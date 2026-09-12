import { NextRequest, NextResponse } from "next/server";
import { getStripeClient } from "@/lib/stripe";
import { packages, addOns, siteConfig } from "@/lib/site-config";
import { lookupZip, haversineMiles, calculateDeliveryFee } from "@/lib/geo";

// Basic in-memory rate limit per server instance — good enough to blunt naive
// bots. For real spam/abuse protection, put Cloudflare Turnstile or
// hCaptcha on the form in addition to this.
const recentRequests = new Map<string, number>();
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 5;

function isRateLimited(ip: string) {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW_MS;
  const timestamps = (recentRequests.get(ip) as unknown as number[]) || [];
  const recent = Array.isArray(timestamps) ? timestamps.filter((t) => t > windowStart) : [];
  if (recent.length >= RATE_LIMIT_MAX) return true;
  recent.push(now);
  recentRequests.set(ip, recent as unknown as number);
  return false;
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") ?? "unknown";
    if (isRateLimited(ip)) {
      return NextResponse.json({ error: "Too many requests. Try again shortly." }, { status: 429 });
    }

    const body = await req.json();
    const { packageId, addOnQuantities, extraWeeks, name, email, phone, address, zip, deliveryDate, pickupDate, honeypot } = body;

    // Honeypot: real users never fill this hidden field; bots often do.
    if (honeypot) {
      return NextResponse.json({ error: "Submission rejected." }, { status: 400 });
    }

    // Server-side validation — never trust the client, even your own form.
    const pkg = packages.find((p) => p.id === packageId);
    if (!pkg) {
      return NextResponse.json({ error: "Invalid package selected." }, { status: 400 });
    }
    if (!name || !email || !phone || !address || !zip || !deliveryDate || !pickupDate) {
      return NextResponse.json({ error: "Missing required booking details." }, { status: 400 });
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }
    if (!/^\d{5}$/.test(zip)) {
      return NextResponse.json({ error: "Invalid zip code." }, { status: 400 });
    }

    // Recompute the delivery distance/fee server-side — never trust a fee the
    // client calculated, since that number is directly editable in devtools
    // before the request is sent.
    let deliveryFee = 0;
    let distanceMiles: number | null = null;
    const [customerZip, businessZip] = await Promise.all([
      lookupZip(zip),
      lookupZip(siteConfig.businessZip),
    ]);
    if (!customerZip) {
      return NextResponse.json({ error: "We couldn't verify that zip code — please check and try again." }, { status: 400 });
    }
    if (businessZip) {
      distanceMiles = haversineMiles(
        customerZip.latitude,
        customerZip.longitude,
        businessZip.latitude,
        businessZip.longitude
      );
      deliveryFee = calculateDeliveryFee(distanceMiles, siteConfig.freeDeliveryRadiusMiles, siteConfig.perMileFeeBeyondRadius);
    }

    const lineItems: { price_data: any; quantity: number }[] = [
      {
        price_data: {
          currency: "usd",
          product_data: { name: `${pkg.name} — ${pkg.totes} totes, ${pkg.days}-day rental` },
          unit_amount: Math.round(pkg.price * 100),
        },
        quantity: 1,
      },
    ];

    // Extra rental weeks, priced per package. Clamped server-side so a
    // tampered client can't request a negative or absurd number.
    const weeks = Math.min(8, Math.max(0, Math.floor(Number(extraWeeks) || 0)));
    if (weeks > 0) {
      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: `${weeks} additional week${weeks > 1 ? "s" : ""} (${pkg.days + weeks * 7}-day rental)`,
          },
          unit_amount: Math.round(pkg.extraWeekPrice * 100),
        },
        quantity: weeks,
      });
    }

    if (deliveryFee > 0 && distanceMiles !== null) {
      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: `Delivery beyond free zone (~${Math.round(distanceMiles)} mi from hub)`,
          },
          unit_amount: Math.round(deliveryFee * 100),
        },
        quantity: 1,
      });
    }

    if (addOnQuantities && typeof addOnQuantities === "object") {
      for (const [addOnId, qtyRaw] of Object.entries(addOnQuantities)) {
        const qty = Number(qtyRaw);
        if (!qty || qty <= 0) continue;
        const addOn = addOns.find((a) => a.id === addOnId);
        if (!addOn) continue;
        lineItems.push({
          price_data: {
            currency: "usd",
            product_data: { name: `${addOn.name} (${addOn.unit})` },
            unit_amount: Math.round(addOn.price * 100),
          },
          quantity: Math.min(qty, 20), // sanity cap
        });
      }
    }

    const stripe = getStripeClient();
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      customer_email: email,
      success_url: `${siteConfig.domain}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteConfig.domain}/cancel`,
      metadata: {
        name,
        phone,
        address,
        zip,
        deliveryDate,
        pickupDate,
        packageId,
        extraWeeks: String(weeks),
        deliveryFee: deliveryFee.toFixed(2),
        distanceMiles: distanceMiles !== null ? distanceMiles.toFixed(1) : "",
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Checkout session error:", err);
    return NextResponse.json({ error: "Something went wrong creating checkout." }, { status: 500 });
  }
}
