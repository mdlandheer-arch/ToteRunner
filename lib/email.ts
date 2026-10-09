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
  promoSummary?: string;
  sessionId: string;
  rentalDays?: number;
  extraDays?: number;
  notes?: string;
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
  const addr = process.env.FROM_EMAIL || "onboarding@resend.dev";
  // Show "ToteRunner" in the inbox instead of just "hello". If FROM_EMAIL already
  // includes a display name ("Name <a@b.com>"), leave it alone.
  return addr.includes("<") ? addr : `${siteConfig.name} <${addr}>`;
}

// Where new-booking alerts go. Defaults to the public contact address.
function ownerAddress(): string {
  return process.env.OWNER_EMAIL || siteConfig.email;
}

// Everything a customer types ends up inside HTML below, so escape it first —
// otherwise a name or note containing markup would be rendered in the email.
function esc(value: string | number | undefined | null): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// "2026-10-12" -> "Mon, Oct 12, 2026". Parsed by hand so the date never shifts a day
// because of time zones.
function fmtDate(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return iso;
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
}

const FONT = "Arial,Helvetica,sans-serif";

// `value` must already be escaped HTML.
function row(label: string, value: string): string {
  return `<tr>
    <td style="padding:10px 12px;border-bottom:1px solid #E6E1D3;font-weight:600;color:#14211C;width:38%;vertical-align:top;">${label}</td>
    <td style="padding:10px 12px;border-bottom:1px solid #E6E1D3;color:#14211C;vertical-align:top;">${value}</td>
  </tr>`;
}

const tel = () => siteConfig.phone.replace(/[^0-9+]/g, "");

// Shared wrapper: logo, content, signature. `preheader` is the grey preview line
// shown next to the subject in the inbox list.
function shell(preheader: string, content: string, opts: { signature: boolean }): string {
  const logo = `${siteConfig.domain}/brand/toterunner-lockup.png`;
  const { facebook, instagram } = siteConfig.social;
  const link = (href: string, label: string, bold = false) =>
    `<a href="${esc(href)}" style="color:#1F7A55;text-decoration:none;${bold ? "font-weight:bold;" : ""}">${esc(label)}</a>`;
  const sep = ` <span style="color:#14211C;">&nbsp;|&nbsp;</span> `;
  const sig = opts.signature
    ? `<table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:28px;"><tr>
        <td style="width:4px;background:#F5A524;font-size:0;line-height:0;">&nbsp;</td>
        <td style="padding:2px 0 2px 14px;font-family:${FONT};font-size:15px;line-height:1.5;color:#14211C;">
          <div style="font-size:20px;font-weight:bold;">${esc(siteConfig.emailSignature.name)}</div>
          <div style="font-weight:bold;color:#1F7A55;">${esc(siteConfig.emailSignature.title)}, ${esc(siteConfig.name)}</div>
          <div style="font-style:italic;margin-top:6px;">${esc(siteConfig.tagline)}</div>
          <div style="margin-top:8px;">${link(`tel:${tel()}`, siteConfig.phone).replace("color:#1F7A55;", "color:#14211C;")}${sep}${link(`mailto:${siteConfig.email}`, siteConfig.email).replace("color:#1F7A55;", "color:#14211C;")}</div>
          <div>${[link(siteConfig.domain, siteConfig.domain.replace(/^https?:\/\/(www\.)?/, ""), true), facebook && link(facebook, "Facebook"), instagram && link(instagram, "Instagram")].filter(Boolean).join(sep)}</div>
          <div style="font-size:13px;color:#14211C;opacity:.7;margin-top:8px;">Reusable moving tote rentals · ${esc(siteConfig.region)}</div>
        </td></tr></table>`
    : "";
  return `<!doctype html><html><body style="margin:0;padding:0;background:#F7F4ED;">
  <span style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${esc(preheader)}</span>
  <div style="font-family:${FONT};max-width:600px;margin:0 auto;padding:24px 16px;color:#14211C;">
    <a href="${esc(siteConfig.domain)}"><img src="${logo}" width="180" alt="${esc(siteConfig.name)}" style="display:block;border:0;height:auto;margin-bottom:20px;" /></a>
    <div style="background:#FFFFFF;border:1px solid #E6E1D3;border-radius:8px;padding:24px;">
      ${content}
      ${sig}
    </div>
  </div>
</body></html>`;
}

export async function sendOwnerNotification(b: BookingDetails): Promise<void> {
  const client = getClient();
  if (!client) {
    console.warn("RESEND_API_KEY not set — skipping owner notification for", b.sessionId);
    return;
  }

  const html = shell(
    `New request from ${b.name}: ${fmtDate(b.deliveryDate)} to ${fmtDate(b.pickupDate)}`,
    `<h2 style="color:#1F7A55;margin:0 0 4px;font-size:20px;">New reservation request — ${esc(b.name)}</h2>
      <p style="margin:0 0 16px;opacity:.7;">No payment taken. Confirm availability, then arrange payment.</p>
      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        ${row("Customer", esc(b.name))}
        ${row("Email", `<a href="mailto:${esc(b.email)}" style="color:#1F7A55;">${esc(b.email)}</a>`)}
        ${row("Phone", `<a href="tel:${esc(b.phone.replace(/[^0-9+]/g, ""))}" style="color:#1F7A55;">${esc(b.phone)}</a>`)}
        ${row("Delivery address", esc(b.address))}
        ${b.pickupAddress && b.pickupAddress !== b.address ? row("Pickup address", esc(b.pickupAddress)) : ""}
        ${row("Delivery", esc(fmtDate(b.deliveryDate)))}
        ${row("Pickup", esc(fmtDate(b.pickupDate)))}
        ${row("Package", `${esc(b.packageName)} (${esc(b.totes)} totes)`)}
        ${row("Add-ons", esc(b.addOnSummary || "None"))}
        ${row("Distance from hub", b.distanceMiles ? `${esc(b.distanceMiles)} mi` : "—")}
        ${row("Delivery fee", `$${esc(b.deliveryFee)}`)}
        ${b.promoSummary ? row("Promo code", esc(b.promoSummary)) : ""}
        ${row("Estimated total", `$${esc(b.amountTotal)} (not charged)`)}
        ${b.notes ? row("Customer notes", esc(b.notes).replace(/\n/g, "<br/>")) : ""}
      </table>
      <p style="font-size:12px;opacity:.6;margin:16px 0 0;">Request ref: ${esc(b.sessionId)}</p>`,
    { signature: false },
  );

  try {
    await client.emails.send({
      from: fromAddress(),
      to: ownerAddress(),
      replyTo: b.email,
      subject: `Reservation request: ${b.name} — ${fmtDate(b.deliveryDate)}`,
      html,
    });
  } catch (err) {
    console.error("Failed to send owner notification:", err);
  }
}

export function buildCustomerEmail(b: BookingDetails): { subject: string; html: string; text: string } {
  const first = b.name.trim().split(/\s+/)[0] || b.name;
  const step = (n: number, title: string, body: string) =>
    `<tr><td style="vertical-align:top;padding:0 12px 12px 0;width:24px;"><div style="width:24px;height:24px;border:1px solid #1F7A55;border-radius:12px;text-align:center;line-height:24px;font-size:13px;font-weight:bold;color:#1F7A55;">${n}</div></td>
      <td style="vertical-align:top;padding:0 0 12px;font-size:14px;line-height:1.45;"><strong>${title}</strong><br/>${body}</td></tr>`;

  const html = shell(
    "We'll reply within one business day to confirm availability and send payment details.",
    `<h2 style="color:#1F7A55;margin:0 0 8px;font-size:22px;">Got it, ${esc(first)}!</h2>
      <p style="margin:0 0 16px;line-height:1.5;">We've received your reservation request. <strong>This isn't a confirmed booking yet</strong> — nothing has been charged and your dates aren't locked in until we reply. Here's what you sent:</p>
      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        ${row("Package", `${esc(b.packageName)} (${esc(b.totes)} totes)`)}
        ${row("Add-ons", esc(b.addOnSummary || "None"))}
        ${row("Delivery date", esc(fmtDate(b.deliveryDate)))}
        ${row("Pickup date", esc(fmtDate(b.pickupDate)))}
        ${row("Delivery address", esc(b.address))}
        ${b.pickupAddress && b.pickupAddress !== b.address ? row("Pickup address", esc(b.pickupAddress)) : ""}
        ${b.promoSummary ? row("Promo code", esc(b.promoSummary)) : ""}
        ${row("Estimated total", `$${esc(b.amountTotal)} (not charged)`)}
      </table>
      <h3 style="margin:24px 0 10px;font-size:16px;">What happens next</h3>
      <table role="presentation" style="width:100%;border-collapse:collapse;">
        ${step(1, "We reply within one business day", "We'll confirm the totes are available for your dates and send payment details.")}
        ${step(2, "We deliver, you pack", "We bring the totes and dolly to your door. Pack at your own pace.")}
        ${step(3, "We pick up the empties", "On your pickup date we collect everything — no boxes to break down.")}
      </table>
      <p style="margin:8px 0 0;line-height:1.5;font-size:14px;">Need to change something? Just reply to this email or call <a href="tel:${tel()}" style="color:#1F7A55;">${esc(siteConfig.phone)}</a>.</p>`,
    { signature: true },
  );

  const text = [
    `Got it, ${first}!`,
    "",
    "We've received your reservation request. This isn't a confirmed booking yet — nothing has been charged and your dates aren't locked in until we reply.",
    "",
    `Package: ${b.packageName} (${b.totes} totes)`,
    `Add-ons: ${b.addOnSummary || "None"}`,
    `Delivery date: ${fmtDate(b.deliveryDate)}`,
    `Pickup date: ${fmtDate(b.pickupDate)}`,
    `Delivery address: ${b.address}`,
    ...(b.pickupAddress && b.pickupAddress !== b.address ? [`Pickup address: ${b.pickupAddress}`] : []),
    ...(b.promoSummary ? [`Promo code: ${b.promoSummary}`] : []),
    `Estimated total: $${b.amountTotal} (not charged)`,
    "",
    "What happens next:",
    "1. We reply within one business day to confirm availability and send payment details.",
    "2. We deliver the totes and dolly to your door. You pack at your own pace.",
    "3. On your pickup date we collect the empties.",
    "",
    `Need to change something? Reply to this email or call ${siteConfig.phone}.`,
    "",
    "--",
    siteConfig.emailSignature.name,
    `${siteConfig.emailSignature.title}, ${siteConfig.name}`,
    siteConfig.tagline,
    `${siteConfig.phone}  |  ${siteConfig.email}`,
    [siteConfig.domain.replace(/^https?:\/\/(www\.)?/, ""), siteConfig.social.facebook && "Facebook", siteConfig.social.instagram && "Instagram"].filter(Boolean).join("  |  "),
    `Reusable moving tote rentals · ${siteConfig.region}`,
  ].join("\n");

  return { subject: `We got your ${siteConfig.name} reservation request`, html, text };
}

export async function sendCustomerConfirmation(b: BookingDetails): Promise<void> {
  const client = getClient();
  if (!client) {
    console.warn("RESEND_API_KEY not set — skipping customer confirmation for", b.sessionId);
    return;
  }

  const { subject, html, text } = buildCustomerEmail(b);

  try {
    await client.emails.send({
      from: fromAddress(),
      to: b.email,
      replyTo: ownerAddress(),
      subject,
      html,
      text,
    });
  } catch (err) {
    console.error("Failed to send customer confirmation:", err);
  }
}
