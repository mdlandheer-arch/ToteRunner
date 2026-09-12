import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { siteConfig, packages, cancellationPolicy } from "@/lib/site-config";

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
    n: "1",
    title: "What you're renting",
    body: [
      `${siteConfig.name} rents reusable plastic moving totes and a dolly ("tote taxi") as listed in your chosen package. The totes remain our property throughout — this is a rental, not a sale.`,
    ],
  },
  {
    n: "2",
    title: "Rental period",
    body: [
      `Every package includes ${packages[0]?.days ?? 14} days, starting on your delivery date. If you keep the totes longer, we charge a per-day rate based on your package size (shown at checkout before you pay).`,
      "If totes aren't returned or made available for pickup after your rental period ends, daily charges continue until pickup is completed.",
    ],
  },
  {
    n: "3",
    title: "Payment",
    body: [
      "Payment is due in full at booking, processed securely by Stripe. We never see or store your card number.",
      `Delivery and pickup are free within ${siteConfig.freeDeliveryRadiusMiles} miles of our hub. Beyond that, a $${siteConfig.perMileFeeBeyondRadius.toFixed(2)}/mile fee applies and is calculated at checkout before payment.`,
    ],
  },
  {
    n: "4",
    title: "Cancellations",
    body: [
      `Cancel at least ${cancellationPolicy.freeCancellationHours} hours before your scheduled delivery for a full refund. Within that window, a $${cancellationPolicy.lateCancellationFee} cancellation fee applies. If the totes have already been delivered, a $${cancellationPolicy.postDeliveryRestockingFee} restocking fee applies.`,
      "Need to change your dates? Contact us as early as you can and we'll accommodate it if we're able.",
    ],
  },
  {
    n: "5",
    title: "Taking care of the totes",
    body: [
      "You're responsible for the totes from delivery until we confirm pickup.",
      "Each tote holds up to about 60 lbs. Overloading can damage them and may void the normal wear-and-tear allowance below.",
      "Please return them free of food debris, liquids, and hazardous residue. A cleaning fee of $[AMOUNT] may apply to totes needing more than standard cleaning.",
      "Totes may not be used for hazardous materials, perishable food, live animals, firearms, or anything illegal.",
    ],
  },
  {
    n: "6",
    title: "Lost or damaged totes",
    body: [
      "Normal wear and tear is expected and never charged for.",
      "Totes or accessories that are lost, stolen, or damaged beyond normal use are billed at $[AMOUNT] per tote and $[AMOUNT] per accessory.",
    ],
  },
  {
    n: "7",
    title: "Delivery and pickup",
    body: [
      "We'll confirm a delivery window before your date. You don't need to be home if you give us a safe, accessible drop-off spot when you book.",
      "We're a door-to-door service — we deliver to the nearest accessible point (driveway, garage, porch, or unit door) and don't carry items inside.",
      "We aren't responsible for delays caused by inaccurate addresses, blocked access, or circumstances outside our control such as severe weather or road closures.",
    ],
  },
  {
    n: "8",
    title: "Safety and liability",
    body: [
      "You're responsible for safely lifting, stacking, and transporting the totes and their contents. We aren't responsible for injuries from handling them, or for damage to items packed inside.",
      `We're a tote rental service, not a moving company — we don't pack, load, or move your belongings.`,
      `To the extent Michigan law allows, our total liability is limited to the amount you paid for your rental.`,
    ],
  },
  {
    n: "9",
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
        <p className="mt-2 text-sm text-steel">Last updated: [DATE]</p>
        <p className="mt-4 text-ink/75">
          These are the terms you agree to when you book totes with us. We&apos;ve kept it in plain
          English — if anything here is unclear, call {siteConfig.phone} and ask before you book.
        </p>

        <div className="mt-4 rounded-md border border-safety bg-safety/10 p-4 text-sm text-ink/80">
          <strong>Before you launch:</strong> this is a template, not legal advice. A licensed
          Michigan attorney should review it — especially sections 5, 6, and 8 — and every
          [BRACKETED] amount must be filled in before you publish this or ask anyone to agree to it.
        </div>

        <div className="mt-10 space-y-8">
          {sections.map((s) => (
            <div key={s.n} className="border-l-2 border-crate pl-5">
              <h2 className="text-lg font-bold text-ink">
                <span className="text-crate">{s.n}.</span> {s.title}
              </h2>
              <div className="mt-2 space-y-2">
                {s.body.map((para, i) => (
                  <p key={i} className="text-sm text-ink/75">
                    {para}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-lg border border-line bg-white/60 p-6">
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
