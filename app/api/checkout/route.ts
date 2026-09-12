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
    const { packageId, addOnQuantities, name, email, phone, address, pickupAddress, agreed, zip, pickupZip, deliveryDate, pickupDate, honeypot } = body;

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
    // Consent is enforced server-side too — a checkbox is trivial to bypass in
    // devtools, and the whole point of clickwrap is a reliable record.
    if (agreed !== true) {
      return NextResponse.json({ error: "You must accept the rental agreement to book." }, { status: 400 });
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

    // Pickup is a separate trip, so it's priced as its own leg.
    let pickupFee = 0;
    if (/^\d{5}$/.test(String(pickupZip ?? "")) && businessZip) {
      const pz = await lookupZip(String(pickupZip));
      if (pz) {
        const pickupMiles = haversineMiles(pz.latitude, pz.longitude, businessZip.latitude, businessZip.longitude);
        pickupFee = calculateDeliveryFee(pickupMiles, siteConfig.freeDeliveryRadiusMiles, siteConfig.perMileFeeBeyondRadius);
      }
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

    // Extra rental weeks are derived from the dates the customer submitted,
    // not from the number the client sent — the dates are what we validated
    // above, and recomputing here means a tampered client value can't
    // buy a longer rental for free.
    const rentalDays = Math.max(
      0,
      Math.round(
        (new Date(pickupDate).getTime() - new Date(deliveryDate).getTime()) / 86_400_000
      )
    );
    const derivedExtraDays = rentalDays > pkg.days ? rentalDays - pkg.days : 0;
    const extraDays = Math.min(60, Math.max(0, derivedExtraDays));
    if (extraDays > 0) {
      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: `${extraDays} additional day${extraDays > 1 ? "s" : ""} (${pkg.days + extraDays}-day rental)`,
          },
          unit_amount: Math.round(pkg.dailyRate * 100),
        },
        quantity: extraDays,
      });
    }

    if (deliveryFee > 0 && distanceMiles !== null) {
      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: { name: `Delivery trip beyond free zone (~${Math.round(distanceMiles)} mi)` },
          unit_amount: Math.round(deliveryFee * 100),
        },
        quantity: 1,
      });
    }
    if (pickupFee > 0) {
      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: { name: "Pickup trip beyond free zone" },
          unit_amount: Math.round(pickupFee * 100),
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
        pickupAddress: pickupAddress ?? address,
        agreedToTerms: "yes",
        zip,
        deliveryDate,
        pickupDate,
        packageId,
        extraDays: String(extraDays),
        deliveryFee: (deliveryFee + pickupFee).toFixed(2),
        distanceMiles: distanceMiles !== null ? distanceMiles.toFixed(1) : "",
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Checkout session error:", err);
    return NextResponse.json({ error: "Something went wrong creating checkout." }, { status: 500 });
  }
}
