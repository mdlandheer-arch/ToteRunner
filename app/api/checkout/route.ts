import { NextRequest, NextResponse } from "next/server";
import { getStripeClient } from "@/lib/stripe";
import { packages, addOns, siteConfig } from "@/lib/site-config";

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
    const { packageId, addOnQuantities, name, email, phone, address, deliveryDate, pickupDate, honeypot } = body;

    // Honeypot: real users never fill this hidden field; bots often do.
    if (honeypot) {
      return NextResponse.json({ error: "Submission rejected." }, { status: 400 });
    }

    // Server-side validation — never trust the client, even your own form.
    const pkg = packages.find((p) => p.id === packageId);
    if (!pkg) {
      return NextResponse.json({ error: "Invalid package selected." }, { status: 400 });
    }
    if (!name || !email || !phone || !address || !deliveryDate || !pickupDate) {
      return NextResponse.json({ error: "Missing required booking details." }, { status: 400 });
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
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
        deliveryDate,
        pickupDate,
        packageId,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Checkout session error:", err);
    return NextResponse.json({ error: "Something went wrong creating checkout." }, { status: 500 });
  }
}
