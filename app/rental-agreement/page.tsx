import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { siteConfig, packages, cancellationPolicy, damageFees, legalLastUpdated } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Rental Agreement",
  description: `The rental terms customers agree to when booking moving totes from ${siteConfig.name}.`,
};

// This is the customer-facing version of the rental agreement — the plain
// summary people actually read and check a box against at booking. The fuller
// signed contract (ToteRunner-Rental-Agreement.docx) still governs; this page
// mirrors it in shorter form.
//
// ATTORNEY REVIEW STILL REQUIRED. Bracketed amounts below must be filled in.

const sections = [
  {
    icon: "📦",
    title: "What you're renting",
    body: [
      `${siteConfig.name} rents reusable plastic moving totes and a rolling dolly as listed in your chosen package. The totes remain our property throughout — this is a rental, not a sale.`,
    ],
  },
  {
    icon: "📅",
    title: "Rental period",
    body: [
      `Every package includes ${packages[0]?.days ?? 14} days, starting on your delivery date. If you keep the totes longer, we charge a per-day rate based on your package size (shown at checkout before you pay).`,
      "If totes aren't returned or made available for pickup after your rental period ends, daily charges continue until pickup is completed.",
    ],
  },
  {
    icon: "💳",
    title: "Payment",
    body: [
      "Submitting a request doesn't charge you. Once we confirm your dates we'll send payment details, and your reservation is held when payment is received.",
      `Delivery and pickup are free within ${siteConfig.freeDeliveryRadiusMiles} miles of our hub. Beyond that, a $${siteConfig.perMileFeeBeyondRadius.toFixed(2)}/mile fee applies and is calculated at checkout before payment.`,
    ],
  },
  {
    icon: "🔄",
    title: "Cancellations",
    body: [
      `Cancel at least ${cancellationPolicy.freeCancellationHours} hours before your scheduled delivery for a full refund. Within that window, a $${cancellationPolicy.lateCancellationFee} cancellation fee applies. If the totes have already been delivered, a $${cancellationPolicy.postDeliveryRestockingFee} restocking fee applies.`,
      "Need to change your dates? Contact us as early as you can and we'll accommodate it if we're able.",
    ],
  },
  {
    icon: "🧼",
    title: "Taking care of the totes",
    body: [
      "You're responsible for the totes from delivery until we confirm pickup.",
      "Each tote holds up to about 60 lbs. Overloading can damage them and may void the normal wear-and-tear allowance below.",
      `Please return them free of food debris, liquids, and hazardous residue. A $${damageFees.cleaning} cleaning fee may apply to totes needing more than a standard wipe-down.`,
      "Totes may not be used for hazardous materials, perishable food, live animals, firearms, or anything illegal.",
    ],
  },
  {
    icon: "🛠️",
    title: "Lost or damaged totes",
    body: [
      "Normal wear and tear is expected and never charged for.",
      `Totes or accessories that are lost, stolen, or damaged beyond normal use are billed at $${damageFees.perTote} per tote and $${damageFees.perAccessory} per dolly.`,
    ],
  },
  {
    icon: "🚚",
    title: "Delivery and pickup",
    body: [
      "We'll confirm a delivery window before your date. You don't need to be home if you give us a safe, accessible drop-off spot when you book.",
      "We're a door-to-door service — we deliver to the nearest accessible point (driveway, garage, porch, or unit door) and don't carry items inside.",
      "We aren't responsible for delays caused by inaccurate addresses, blocked access, or circumstances outside our control such as severe weather or road closures.",
    ],
  },
  {
    icon: "⚠️",
    title: "Safety and liability",
    body: [
      "You're responsible for safely lifting, stacking, and transporting the totes and their contents. We aren't responsible for injuries from handling them, or for damage to items packed inside.",
      `We're a tote rental service, not a moving company — we don't pack, load, or move your belongings.`,
      `To the extent Michigan law allows, our total liability is limited to the amount you paid for your rental.`,
    ],
  },
  {
    icon: "⚖️",
    title: "Governing law",
    body: ["This agreement is governed by the laws of the State of Michigan."],
  },
];

export default function RentalAgreementPage() {
  return (
    <main>
      <Header />
      <div className="mx-auto max-w-3xl px-5 py-16">
        <h1 className="text-3xl font-bold text-ink">Rental Agreement</h1>
        <p className="mt-2 text-sm text-steel">Last updated: {legalLastUpdated}</p>
        <p className="mt-4 text-ink/75">
          These are the terms you agree to when you book totes with us. We&apos;ve kept it in plain
          English — if anything here is unclear, call {siteConfig.phone} and ask before you book.
        </p>

        <div className="mt-4 rounded-md border border-safety bg-safety/10 p-4 text-sm text-ink/80">
          <strong>Before you launch:</strong> this is a template, not legal advice. A licensed
          Michigan attorney should review it — especially sections 5, 6, and 8 — and every
          fees below reflect your stated amounts, but an attorney should confirm they're enforceable
          as liquidated damages under Michigan consumer law before you publish this.
        </div>

        {/* Quick-scan summary so nobody has to read nine sections to get the gist */}
        <div className="mt-10 rounded-lg border border-crate/30 bg-tint-green p-6">
          <p className="font-bold text-ink">The short version</p>
          <ul className="mt-3 space-y-2 text-sm text-ink/80">
            {[
              `${packages[0]?.days ?? 14} days included, then a small daily rate.`,
              "Take care of them, return them reasonably clean, and there's nothing else to pay.",
              `Free cancellation up to ${cancellationPolicy.freeCancellationHours} hours before delivery.`,
              "We're a tote rental service — we don't pack or move your things.",
            ].map((line) => (
              <li key={line} className="flex gap-2">
                <span className="text-crate" aria-hidden="true">✓</span>
                {line}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8 space-y-4">
          {sections.map((sec) => (
            <details key={sec.title} open className="group rounded-lg border border-line bg-white/70 p-5">
              <summary className="flex cursor-pointer list-none items-center gap-3 font-bold text-ink">
                <span aria-hidden="true" className="text-xl">{sec.icon}</span>
                {sec.title}
                <span className="ml-auto text-crate transition-transform group-open:rotate-45">+</span>
              </summary>
              <ul className="mt-3 space-y-2 border-t border-line pt-3">
                {sec.body.map((para, i) => (
                  <li key={i} className="flex gap-2 text-sm text-ink/75">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-crate" aria-hidden="true" />
                    {para}
                  </li>
                ))}
              </ul>
            </details>
          ))}
        </div>

        <div className="mt-12 rounded-lg border border-line bg-white/70 p-6">
          <p className="text-sm text-ink/75">
            Questions before you book? Email{" "}
            <a href={`mailto:${siteConfig.email}`} className="font-medium text-crate hover:underline">
              {siteConfig.email}
            </a>{" "}
            or call{" "}
            <a
              href={`tel:${siteConfig.phone.replace(/[^0-9+]/g, "")}`}
              className="font-medium text-crate hover:underline"
            >
              {siteConfig.phone}
            </a>
            .
          </p>
          <a
            href="/#booking"
            className="mt-4 inline-block rounded-md bg-crate px-6 py-3 font-semibold text-paper hover:bg-crate-dark"
          >
            Back to booking
          </a>
        </div>
      </div>
      <Footer />
    </main>
  );
}
