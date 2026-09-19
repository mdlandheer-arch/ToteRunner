import { NextRequest, NextResponse } from "next/server";
import { packages, addOns, siteConfig } from "@/lib/site-config";
import { lookupZip, haversineMiles, calculateDeliveryFee } from "@/lib/geo";
import { sendOwnerNotification, sendCustomerConfirmation, type BookingDetails } from "@/lib/email";

// Reservation REQUEST endpoint — no payment is taken here.
//
// The customer submits their details, we email them a confirmation that we've
// received it, and we email the owner the full request. Payment is arranged
// separately once the owner confirms availability.
//
// The price shown is an ESTIMATE. Nothing is charged, so the figures here are
// for the owner's quoting convenience, not a binding total.

const recentRequests = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 5;

function isRateLimited(ip: string) {
  const now = Date.now();
  const recent = (recentRequests.get(ip) || []).filter((t) => t > now - RATE_LIMIT_WINDOW_MS);
  if (recent.length >= RATE_LIMIT_MAX) return true;
  recent.push(now);
  recentRequests.set(ip, recent);
  return false;
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") ?? "unknown";
    if (isRateLimited(ip)) {
      return NextResponse.json({ error: "Too many requests. Try again shortly." }, { status: 429 });
    }

    const body = await req.json();
    const {
      packageId, addOnQuantities, name, email, phone,
      address, pickupAddress, agreed, zip, pickupZip,
      deliveryDate, pickupDate, honeypot, notes,
    } = body;

    if (honeypot) {
      return NextResponse.json({ error: "Submission rejected." }, { status: 400 });
    }
    if (agreed !== true) {
      return NextResponse.json({ error: "You must accept the rental agreement." }, { status: 400 });
    }

    // "custom" isn't a real package — it means the customer didn't see a fit
    // and wants a quote built around their notes instead. There's no fixed
    // price to fall back on, so the estimate math below just treats it as $0
    // and the owner works out real numbers from the notes field.
    const isCustomRequest = packageId === "custom";
    const pkg = isCustomRequest
      ? { name: "Custom (see notes)", totes: 0, days: 14, price: 0, dailyRate: 0 }
      : packages.find((p) => p.id === packageId);
    if (!pkg) {
      return NextResponse.json({ error: "Invalid package selected." }, { status: 400 });
    }
    if (!name || !email || !phone || !address || !zip || !deliveryDate || !pickupDate) {
      return NextResponse.json({ error: "Missing required booking details." }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }
    if (!/^\d{5}$/.test(zip)) {
      return NextResponse.json({ error: "Invalid zip code." }, { status: 400 });
    }

    // Recompute the estimate server-side so the owner's email shows real
    // numbers rather than whatever the browser calculated.
    const businessZip = await lookupZip(siteConfig.businessZip);
    let deliveryFee = 0;
    let distanceMiles: number | null = null;

    const customerZip = await lookupZip(zip);
    if (customerZip && businessZip) {
      distanceMiles = haversineMiles(
        customerZip.latitude, customerZip.longitude,
        businessZip.latitude, businessZip.longitude
      );
      deliveryFee = calculateDeliveryFee(
        distanceMiles, siteConfig.freeDeliveryRadiusMiles, siteConfig.perMileFeeBeyondRadius
      );
    }

    let pickupFee = 0;
    if (/^\d{5}$/.test(String(pickupZip ?? "")) && businessZip) {
      const pz = await lookupZip(String(pickupZip));
      if (pz) {
        const pickupMiles = haversineMiles(
          pz.latitude, pz.longitude, businessZip.latitude, businessZip.longitude
        );
        pickupFee = calculateDeliveryFee(
          pickupMiles, siteConfig.freeDeliveryRadiusMiles, siteConfig.perMileFeeBeyondRadius
        );
      }
    }

    const rentalDays = Math.max(
      0,
      Math.round((new Date(pickupDate).getTime() - new Date(deliveryDate).getTime()) / 86_400_000)
    );
    const extraDays = Math.min(60, Math.max(0, rentalDays > pkg.days ? rentalDays - pkg.days : 0));

    let addOnTotal = 0;
    const addOnLines: string[] = [];
    if (addOnQuantities && typeof addOnQuantities === "object") {
      for (const [id, qtyRaw] of Object.entries(addOnQuantities)) {
        const qty = Math.min(20, Math.max(0, Number(qtyRaw) || 0));
        const a = addOns.find((x) => x.id === id);
        if (!a || qty <= 0) continue;
        addOnTotal += a.price * qty;
        addOnLines.push(`${qty}× ${a.name}`);
      }
    }

    const estimate =
      pkg.price + extraDays * pkg.dailyRate + addOnTotal + deliveryFee + pickupFee;

    const details: BookingDetails = {
      name, email, phone,
      address,
      pickupAddress: pickupAddress || address,
      deliveryDate, pickupDate,
      packageName: pkg.name,
      totes: pkg.totes,
      addOnSummary: addOnLines.join(", "),
      deliveryFee: (deliveryFee + pickupFee).toFixed(2),
      distanceMiles: distanceMiles !== null ? distanceMiles.toFixed(1) : "",
      amountTotal: estimate.toFixed(2),
      sessionId: `req-${Date.now()}`,
      rentalDays,
      extraDays,
      notes: typeof notes === "string" ? notes.slice(0, 2000).trim() : "",
    };

    // Both emails are best-effort and swallow their own errors — a mail
    // failure must never make a submitted request look like it failed.
    // Requires a Resend-verified domain with FROM_EMAIL set to an address on
    // it; the shared resend.dev sender can only reach the account owner.
    await Promise.all([
      sendOwnerNotification(details),
      sendCustomerConfirmation(details),
    ]);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Reservation request error:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
