import { Resend } from "resend";
import { siteConfig } from "./site-config";

// Email is OPTIONAL infrastructure: if RESEND_API_KEY isn't set, these
// functions log and return instead of throwing. A failed email must never
// break a webhook — Stripe retries failed webhooks, and a thrown error here
// would make Stripe retry a booking that already succeeded.

export type BookingDetails = {
  name: string;
  email: string;
  phone: string;
  address: string;
  deliveryDate: string;
  pickupDate: string;
  packageName: string;
  totes: number;
  addOnSummary: string;
  deliveryFee: string;
  distanceMiles: string;
  amountTotal: string;
  sessionId: string;
};

function getClient(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

// Until you verify your own domain with Resend, set FROM_EMAIL to their
// test sender (onboarding@resend.dev). After verifying toterunner.com,
// switch it to hello@toterunner.com.
function fromAddress(): string {
  return process.env.FROM_EMAIL || "onboarding@resend.dev";
}

// Where new-booking alerts go. Defaults to the public contact address.
function ownerAddress(): string {
  return process.env.OWNER_EMAIL || siteConfig.email;
}

function row(label: string, value: string): string {
  return `<tr>
    <td style="padding:8px 12px;border-bottom:1px solid #e5e5e5;font-weight:600;color:#1b1f23;">${label}</td>
    <td style="padding:8px 12px;border-bottom:1px solid #e5e5e5;color:#333;">${value}</td>
  </tr>`;
}

export async function sendOwnerNotification(b: BookingDetails): Promise<void> {
  const client = getClient();
  if (!client) {
    console.warn("RESEND_API_KEY not set — skipping owner notification for", b.sessionId);
    return;
  }

  const html = `
    <div style="font-family:system-ui,-apple-system,sans-serif;max-width:600px;">
      <h2 style="color:#2f6d4f;margin-bottom:4px;">New booking — ${b.name}</h2>
      <p style="color:#666;margin-top:0;">Paid and confirmed via Stripe.</p>
      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        ${row("Customer", b.name)}
        ${row("Email", b.email)}
        ${row("Phone", b.phone)}
        ${row("Address", b.address)}
        ${row("Delivery", b.deliveryDate)}
        ${row("Pickup", b.pickupDate)}
        ${row("Package", `${b.packageName} (${b.totes} totes)`)}
        ${row("Add-ons", b.addOnSummary || "None")}
        ${row("Distance from hub", b.distanceMiles ? `${b.distanceMiles} mi` : "—")}
        ${row("Delivery fee", `$${b.deliveryFee}`)}
        ${row("Total paid", `$${b.amountTotal}`)}
      </table>
      <p style="color:#999;font-size:12px;margin-top:16px;">Stripe session: ${b.sessionId}</p>
    </div>`;

  try {
    await client.emails.send({
      from: fromAddress(),
      to: ownerAddress(),
      replyTo: b.email,
      subject: `New booking: ${b.name} — ${b.deliveryDate}`,
      html,
    });
  } catch (err) {
    console.error("Failed to send owner notification:", err);
  }
}

export async function sendCustomerConfirmation(b: BookingDetails): Promise<void> {
  const client = getClient();
  if (!client) {
    console.warn("RESEND_API_KEY not set — skipping customer confirmation for", b.sessionId);
    return;
  }

  const html = `
    <div style="font-family:system-ui,-apple-system,sans-serif;max-width:600px;">
      <h2 style="color:#2f6d4f;margin-bottom:4px;">You're booked, ${b.name.split(" ")[0]}!</h2>
      <p style="color:#333;">Your ${siteConfig.name} totes are reserved. Here's what we have:</p>
      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        ${row("Package", `${b.packageName} (${b.totes} totes)`)}
        ${row("Add-ons", b.addOnSummary || "None")}
        ${row("Delivery date", b.deliveryDate)}
        ${row("Pickup date", b.pickupDate)}
        ${row("Address", b.address)}
        ${row("Total paid", `$${b.amountTotal}`)}
      </table>
      <p style="color:#333;margin-top:16px;">
        We'll be in touch with your delivery window before your delivery date. Need to change
        something? Just reply to this email or call ${siteConfig.phone}.
      </p>
      <p style="color:#999;font-size:12px;margin-top:24px;">
        ${siteConfig.name} · ${siteConfig.email} · ${siteConfig.phone}
      </p>
    </div>`;

  try {
    await client.emails.send({
      from: fromAddress(),
      to: b.email,
      replyTo: ownerAddress(),
      subject: `Your ${siteConfig.name} booking is confirmed`,
      html,
    });
  } catch (err) {
    console.error("Failed to send customer confirmation:", err);
  }
}
