import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { siteConfig } from "@/lib/site-config";

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
        <p className="mt-2 text-sm text-steel">Last updated: [DATE]</p>

        <div className="mt-4 rounded-md border border-safety bg-safety/10 p-4 text-sm text-ink/80">
          <strong>Before you launch:</strong> this is a starting template, not legal advice. A
          licensed attorney should confirm your damage/loss fees, liability limits, and cancellation
          policy comply with your state&apos;s consumer protection law before you publish this.
        </div>

        <div className="prose prose-sm mt-8 max-w-none text-ink/80">
          <h2>Rental period</h2>
          <p>
            Each package includes a rental period as shown at checkout (default 3 days). Additional
            days can be added as an add-on at checkout or by contacting us before your pickup date.
          </p>

          <h2>Payment</h2>
          <p>
            Full payment is collected at the time of booking through Stripe. [State your refund/
            cancellation window, e.g. "Cancellations made 48+ hours before delivery are fully
            refundable."]
          </p>

          <h2>Lost or damaged totes</h2>
          <p>
            Customers are responsible for totes and accessories during the rental period. A
            replacement fee of $[AMOUNT] per tote applies for lost or damaged totes beyond normal
            wear.
          </p>

          <h2>Weight limits</h2>
          <p>Totes are rated for up to roughly 60 lbs each. Overloading may cause damage and void replacement coverage.</p>

          <h2>Delivery and pickup</h2>
          <p>
            You&apos;ll receive a delivery window by [email/text] before your scheduled date. Someone
            does not need to be present if a safe drop-off location is provided at booking.
          </p>

          <h2>Liability</h2>
          <p>
            [Add your liability limitation language here — e.g. limits on liability for delays caused
            by weather, road conditions, or circumstances outside the company&apos;s control.]
          </p>

          <h2>Governing law</h2>
          <p>These terms are governed by the laws of [STATE].</p>

          <h2>Contact</h2>
          <p>
            Questions? Email <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.
          </p>
        </div>
      </div>
      <Footer />
    </main>
  );
}
