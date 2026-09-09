import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${siteConfig.name} collects, uses, and protects your information.`,
};

export default function PrivacyPage() {
  return (
    <main>
      <Header />
      <div className="mx-auto max-w-3xl px-5 py-16">
        <h1 className="text-3xl font-bold text-ink">Privacy Policy</h1>
        <p className="mt-2 text-sm text-steel">Last updated: [DATE]</p>

        <div className="mt-4 rounded-md border border-safety bg-safety/10 p-4 text-sm text-ink/80">
          <strong>Before you launch:</strong> this is a starting template, not legal advice. Have a
          licensed attorney in your state review it — especially the sections on payment data,
          any add-on tracking pixels, and applicable state privacy law — before publishing.
        </div>

        <div className="prose prose-sm mt-8 max-w-none text-ink/80">
          <h2>Information we collect</h2>
          <p>
            When you book with {siteConfig.name}, we collect your name, email, phone number, moving
            address, and delivery/pickup dates. Payment is processed by Stripe; we do not receive or
            store your full card number.
          </p>

          <h2>How we use it</h2>
          <p>
            We use this information to schedule delivery and pickup, communicate about your
            reservation, and process payment. We do not sell your personal information.
          </p>

          <h2>Cookies and analytics</h2>
          <p>
            With your consent (see the banner shown on your first visit), we use Google Analytics to
            understand site traffic. You can decline this, and you can clear cookies at any time in
            your browser settings.
          </p>

          <h2>Third parties</h2>
          <p>
            We share booking details with Stripe (payment processing) only as needed to complete your
            transaction. [List any other processors you add, e.g. SMS reminders, email service.]
          </p>

          <h2>Data retention</h2>
          <p>[State how long you keep booking records, e.g. "for 3 years for tax and dispute purposes."]</p>

          <h2>Your rights</h2>
          <p>
            [Add any state-specific rights that apply to your customers, e.g. California/CCPA,
            depending on where you operate and who you serve.]
          </p>

          <h2>Contact</h2>
          <p>
            Questions about this policy? Email{" "}
            <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.
          </p>
        </div>
      </div>
      <Footer />
    </main>
  );
}
