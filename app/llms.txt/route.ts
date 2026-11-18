import { siteConfig, packages, eventPackage, addOns, cancellationPolicy, damageFees, hubs } from "@/lib/site-config";

// llms.txt: a plain-text summary for AI assistants and search tools. Built from
// site-config so it can't drift from the real prices and policies.
export const dynamic = "force-static";

export function GET() {
  const d = siteConfig.domain;
  const lines = [
    `# ${siteConfig.name}`,
    "",
    `> ${siteConfig.legalName} rents reusable plastic moving totes in ${siteConfig.region}, Michigan. We deliver the totes and a dolly, you pack, and we pick up the empties. No cardboard, no tape.`,
    "",
    "## Packages (base rental includes dolly, labels, delivery and pickup)",
    ...packages.map((p) => `- ${p.name}: ${p.totes} totes, ${p.days} days, $${p.price}. Extra days $${p.dailyRate}/day.`),
    `- ${eventPackage.name}: ${eventPackage.totes} totes, ${eventPackage.days} days, $${eventPackage.price}. Extra days $${eventPackage.dailyRate}/day.`,
    "",
    "## Add-ons",
    ...addOns.map((a) => `- ${a.name}: $${a.price} ${a.unit}`),
    "",
    "## Delivery and service area",
    `- Free delivery and pickup within ${siteConfig.freeDeliveryRadiusMiles} miles of ${hubs.map((h) => h.name).join(" or ")}. Beyond that, $${siteConfig.perMileFeeBeyondRadius.toFixed(2)} per mile.`,
    `- Areas served include ${siteConfig.serviceAreas.join(", ")}.`,
    "",
    "## Policies",
    `- Booking is a reservation request. Nothing is charged until we confirm availability.`,
    `- Free cancellation at least ${cancellationPolicy.freeCancellationHours} hours before delivery. $${cancellationPolicy.lateCancellationFee} inside that window; $${cancellationPolicy.postDeliveryRestockingFee} if already delivered.`,
    `- Lost or damaged: $${damageFees.perTote} per tote, $${damageFees.perAccessory} per dolly. $${damageFees.cleaning} cleaning fee if totes come back needing more than a wipe-down.`,
    "",
    "## Pages",
    `- [Home and booking](${d}/)`,
    `- [FAQ](${d}/faq)`,
    `- [Wedding and event totes](${d}/events)`,
    `- [Realtor referral program](${d}/realtor-referral)`,
    `- [Rental agreement](${d}/rental-agreement)`,
    `- [Terms](${d}/terms)`,
    `- [Privacy policy](${d}/privacy)`,
    "",
    "## Contact",
    `- Phone: ${siteConfig.phone}`,
    `- Email: ${siteConfig.email}`,
    `- Owner: ${siteConfig.emailSignature.name}`,
    "",
  ];
  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
