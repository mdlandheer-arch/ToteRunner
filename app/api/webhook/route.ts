import { NextRequest, NextResponse } from "next/server";
import { getStripeClient } from "@/lib/stripe";
import { sendOwnerNotification, sendCustomerConfirmation, type BookingDetails } from "@/lib/email";
import { packages } from "@/lib/site-config";

// Stripe webhook endpoint.
//
// This is what makes a booking reliable: Stripe calls this directly when a
// payment actually completes, regardless of whether the customer's browser
// made it back to /success. Never trust the redirect alone.
//
// SETUP (after deploying):
//   1. Stripe Dashboard > Developers > Webhooks > Add endpoint
//   2. URL: https://yourdomain.com/api/webhook
//   3. Event to send: checkout.session.completed
//   4. Copy the signing secret (starts whsec_) into STRIPE_WEBHOOK_SECRET
//
// The raw body is required for signature verification — do not parse it as
// JSON first, or the signature check will fail.

export async function POST(req: NextRequest) {
  const signature = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET is not set — rejecting webhook.");
    return NextResponse.json({ error: "Webhook not configured." }, { status: 500 });
  }
  if (!signature) {
    return NextResponse.json({ error: "Missing signature." }, { status: 400 });
  }

  let event;
  try {
    const rawBody = await req.text();
    const stripe = getStripeClient();
    // Verifying the signature is what proves this request actually came from
    // Stripe. Without it, anyone who finds this URL could POST a fake booking.
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  if (event.type !== "checkout.session.completed") {
    // Acknowledge other events so Stripe doesn't retry them.
    return NextResponse.json({ received: true });
  }

  try {
    const session = event.data.object as any;
    const meta = session.metadata ?? {};

    const pkg = packages.find((p) => p.id === meta.packageId);

    // Pull the add-on lines back off the session so the email can list them.
    let addOnSummary = "";
    try {
      const stripe = getStripeClient();
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id, { limit: 50 });
      addOnSummary = lineItems.data
        .slice(1) // first line is the package itself
        .map((li) => `${li.quantity}× ${li.description}`)
        .join(", ");
    } catch (err) {
      console.error("Could not fetch line items for", session.id, err);
    }

    const booking: BookingDetails = {
      name: meta.name ?? session.customer_details?.name ?? "Unknown",
      email: session.customer_email ?? session.customer_details?.email ?? "",
      phone: meta.phone ?? "",
      address: meta.address ?? "",
      deliveryDate: meta.deliveryDate ?? "",
      pickupDate: meta.pickupDate ?? "",
      packageName: pkg?.name ?? meta.packageId ?? "Unknown package",
      totes: pkg?.totes ?? 0,
      addOnSummary,
      deliveryFee: meta.deliveryFee ?? "0.00",
      distanceMiles: meta.distanceMiles ?? "",
      amountTotal: ((session.amount_total ?? 0) / 100).toFixed(2),
      sessionId: session.id,
    };

    // Send both emails. Each swallows its own errors so one failing doesn't
    // stop the other — and so neither makes Stripe retry a completed booking.
    await Promise.all([
      sendOwnerNotification(booking),
      booking.email ? sendCustomerConfirmation(booking) : Promise.resolve(),
    ]);

    return NextResponse.json({ received: true });
  } catch (err) {
    // Log and still return 200: the payment succeeded, and a non-200 makes
    // Stripe retry indefinitely. Check logs if a notification goes missing.
    console.error("Error handling checkout.session.completed:", err);
    return NextResponse.json({ received: true, warning: "Handler error — see logs." });
  }
}
