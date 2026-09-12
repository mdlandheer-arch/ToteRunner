import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { siteConfig, packages, cancellationPolicy, damageFees, legalLastUpdated } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: `The terms that apply to renting moving totes from ${siteConfig.name}.`,
};

export default function TermsPage() {
  return (
    <main>
      <Header />
      <div className="mx-auto max-w-3xl px-5 py-16">
        <h1 className="text-3xl font-bold text-ink">Terms & Conditions</h1>
        <p className="mt-2 text-sm text-steel">Last updated: {legalLastUpdated}</p>

        <div className="mt-4 rounded-md border border-safety bg-safety/10 p-4 text-sm text-ink/80">
          <strong>Before you launch:</strong> this is a detailed starting template, not legal advice.
          A licensed Michigan attorney should confirm your damage/loss fees, liability limits, and
          cancellation policy comply with state consumer protection law before you publish this.
        </div>

        <div className="prose prose-sm mt-8 max-w-none text-ink/80">
          <h2>1. Agreement to these terms</h2>
          <p>
            By booking a rental with {siteConfig.name}, you agree to these terms. If you&apos;re
            booking on behalf of someone else, you confirm you have the authority to agree to these
            terms for that booking.
          </p>

          <h2>2. What we provide</h2>
          <p>
            {siteConfig.name} rents reusable plastic moving totes and optional accessories (hand
            trucks, dollies, label kits). We deliver totes to the address you provide, and pick them
            up from that same address (or a new address you&apos;ve confirmed with us in writing)
            after your rental period.
          </p>

          <h2>3. Rental period</h2>
          <p>
            Each package includes a base rental period of {packages[0]?.days ?? 14} days. Rentals
            longer than the base period are charged a per-day rate that varies by package size and is
            shown at checkout before payment. Totes not returned or made available for pickup by the
            end of the rental period (including any paid extension) may continue to accrue charges at
            our posted daily rate until pickup is completed.
          </p>

          <h2>4. Pricing, payment, and delivery fees</h2>
          <p>
            Package prices are shown at checkout and include delivery and pickup within{" "}
            {siteConfig.freeDeliveryRadiusMiles} miles of our hub. Addresses beyond that radius are
            charged an additional delivery fee of ${siteConfig.perMileFeeBeyondRadius.toFixed(2)} per
            mile beyond the free radius, calculated automatically at checkout based on the zip code
            you provide. Full payment is collected at the time of booking through Stripe.
          </p>

          <h2>5. Cancellations and changes</h2>
          <p>
            Cancellations made at least {cancellationPolicy.freeCancellationHours} hours before the
            scheduled delivery are fully refundable. Cancellations made within{" "}
            {cancellationPolicy.freeCancellationHours} hours of delivery are subject to a $
            {cancellationPolicy.lateCancellationFee} cancellation fee. If the Equipment has already
            been delivered, a $
            {cancellationPolicy.postDeliveryRestockingFee} restocking fee applies. To request a date
            change, contact us as early as possible; changes are accommodated subject to
            availability. [Confirm these amounts with your attorney and keep them consistent with the
            cancellation policy published on your website.]
          </p>

          <h2>6. Condition, weight limits, and prohibited items</h2>
          <p>
            Totes are rated for up to approximately 60 lbs each. Overloading a tote may cause damage
            and can void replacement coverage under Section 7. Totes may not be used to transport
            hazardous materials, perishable food, live animals, firearms, or any illegal items.
          </p>

          <h2>7. Lost, damaged, or unreturned totes</h2>
          <p>
            You&apos;re responsible for our totes and any rented accessories during your rental
            period. A replacement fee of ${damageFees.perTote} per tote (and ${damageFees.perAccessory}{" "}
            per accessory) applies for items that are lost, stolen, or damaged beyond normal wear and
            tear. Totes not returned or
            made available for pickup within [X] days of the scheduled pickup date may be billed at
            full replacement value.
          </p>

          <h2>8. Delivery and pickup logistics</h2>
          <p>
            We&apos;ll send a delivery window by [email/text] before your scheduled date. You don&apos;t
            need to be present for delivery or pickup if you provide a safe, accessible drop-off/pickup
            location when you book (for example, a garage, porch, or building lobby). We&apos;re not
            responsible for delays caused by inaccurate address information, blocked access, or
            circumstances outside our control (see Section 10).
          </p>

          <h2>9. Cleanliness</h2>
          <p>
            Totes are sanitized before delivery. Please return totes free of food debris, liquids, or
            hazardous residue. A ${damageFees.cleaning} cleaning fee may apply for totes returned in a
            condition requiring more than standard cleaning.
          </p>

          <h2>10. Force majeure</h2>
          <p>
            We&apos;re not liable for delays or failure to perform caused by events beyond our
            reasonable control, including severe weather, road closures, natural disasters, or other
            circumstances that make delivery or pickup impracticable. We&apos;ll make reasonable
            efforts to reschedule as soon as conditions allow.
          </p>

          <h2>11. Limitation of liability</h2>
          <p>
            [Add your liability limitation language here — consult your attorney on an appropriate cap,
            e.g. limiting liability to the amount paid for the rental, and excluding indirect or
            consequential damages, subject to what Michigan law allows for consumer contracts.]
          </p>

          <h2>12. Assumption of risk</h2>
          <p>
            You&apos;re responsible for safely lifting, stacking, and transporting totes. {siteConfig.name}{" "}
            is not responsible for injury resulting from improper lifting, stacking, or transport of
            totes by you or others assisting with your move.
          </p>

          <h2>13. Indemnification</h2>
          <p>
            You agree to reimburse {siteConfig.name} for any loss, claim, or damage arising from your
            misuse of the totes or violation of these terms, to the extent permitted by Michigan law.
          </p>

          <h2>14. Dispute resolution and governing law</h2>
          <p>
            These terms are governed by the laws of the State of Michigan. [Add your preferred dispute
            resolution process — for example, informal resolution first, followed by small claims
            court or arbitration, and specify the venue/county.]
          </p>

          <h2>15. Changes to these terms</h2>
          <p>
            We may update these terms from time to time; the &quot;Last updated&quot; date above
            reflects the latest version. Continuing to use our services after a change means you
            accept the updated terms.
          </p>

          <h2>16. Contact</h2>
          <p>
            Questions about these terms? Email{" "}
            <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a> or call{" "}
            <a href={`tel:${siteConfig.phone.replace(/[^0-9+]/g, "")}`}>{siteConfig.phone}</a>.
          </p>
        </div>
      </div>
      <Footer />
    </main>
  );
}
