import { Resend } from "resend";
import { siteConfig } from "./site-config";

// Email is the delivery mechanism for reservation requests. If RESEND_API_KEY
// isn't set these log and return instead of throwing, so a mail outage never
// makes a customer's request appear to fail — but it does mean the request is
// lost, so set the key before going live.

export type BookingDetails = {
  name: string;
  email: string;
  phone: string;
  address: string;
  pickupAddress: string;
  deliveryDate: string;
  pickupDate: string;
  packageName: string;
  totes: number;
  addOnSummary: string;
  deliveryFee: string;
  distanceMiles: string;
  amountTotal: string;
  sessionId: string;
  rentalDays?: number;
  extraDays?: number;
};

function getClient(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

// Until you verify your own domain with Resend, set FROM_EMAIL to their
// test sender (onboarding@resend.dev). After verifying toterunner.com,
// switch it to an address on your own domain once you have one.
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
      <h2 style="color:#1a6848;margin-bottom:4px;">New reservation request — ${b.name}</h2>
      <p style="color:#666;margin-top:0;">No payment taken. Confirm availability, then arrange payment.</p>
      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        ${row("Customer", b.name)}
        ${row("Email", b.email)}
        ${row("Phone", b.phone)}
        ${row("Delivery address", b.address)}
        ${b.pickupAddress && b.pickupAddress !== b.address ? row("Pickup address", b.pickupAddress) : ""}
        ${row("Delivery", b.deliveryDate)}
        ${row("Pickup", b.pickupDate)}
        ${row("Package", `${b.packageName} (${b.totes} totes)`)}
        ${row("Add-ons", b.addOnSummary || "None")}
        ${row("Distance from hub", b.distanceMiles ? `${b.distanceMiles} mi` : "—")}
        ${row("Delivery fee", `$${b.deliveryFee}`)}
        ${row("Estimated total", `$${b.amountTotal} (not charged)`)}
      </table>
      <p style="color:#999;font-size:12px;margin-top:16px;">Request ref: ${b.sessionId}</p>
    </div>`;

  try {
    await client.emails.send({
      from: fromAddress(),
      to: ownerAddress(),
      replyTo: b.email,
      subject: `Reservation request: ${b.name} — ${b.deliveryDate}`,
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
      <h2 style="color:#1a6848;margin-bottom:4px;">Got it, ${b.name.split(" ")[0]}!</h2>
      <p style="color:#333;">We've received your reservation request. Nothing has been charged yet — we'll confirm availability and follow up with payment details shortly. Here's what you sent:</p>
      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        ${row("Package", `${b.packageName} (${b.totes} totes)`)}
        ${row("Add-ons", b.addOnSummary || "None")}
        ${row("Delivery date", b.deliveryDate)}
        ${row("Pickup date", b.pickupDate)}
        ${row("Delivery address", b.address)}
        ${b.pickupAddress && b.pickupAddress !== b.address ? row("Pickup address", b.pickupAddress) : ""}
        ${row("Estimated total", `$${b.amountTotal} (not charged)`)}
      </table>
      <p style="color:#333;margin-top:16px;">
        <strong>This isn't a confirmed booking yet.</strong> We'll reply within one business day to
        confirm your dates and send payment details. Need to change something in the meantime? Just
        reply to this email or call ${siteConfig.phone}.
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
      subject: `We got your ${siteConfig.name} reservation request`,
      html,
    });
  } catch (err) {
    console.error("Failed to send customer confirmation:", err);
  }
}
