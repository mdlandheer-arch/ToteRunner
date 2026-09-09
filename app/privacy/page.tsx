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
        <p className="mt-2 text-sm text-steel">Last updated: 9/9/2026</p>

        <div className="mt-4 rounded-md border border-safety bg-safety/10 p-4 text-sm text-ink/80">
          <strong>Before you launch:</strong> this is a detailed starting template, not legal advice.
          Have a licensed attorney in Michigan review it — especially the sections on payment data,
          analytics, and any state-specific privacy rights — before publishing.
        </div>

        <div className="prose prose-sm mt-8 max-w-none text-ink/80">
          <h2>1. Who this policy covers</h2>
          <p>
            This policy explains how {siteConfig.name} (&quot;we,&quot; &quot;us&quot;) collects, uses,
            and protects information from people who visit our website or book a tote rental
            (&quot;you&quot;). It applies to {siteConfig.domain} and any related booking or contact forms.
          </p>

          <h2>2. Information we collect</h2>
          <p>When you use our site or book a rental, we may collect:</p>
          <ul>
            <li><strong>Booking details:</strong> full name, email address, phone number, delivery
              address (street, city, state, zip), delivery and pickup dates, and package/add-on
              selections.</li>
            <li><strong>Payment information:</strong> processed entirely by Stripe. We never receive,
              see, or store your full card number — Stripe passes us only a payment confirmation and
              the last 4 digits of the card for your reference.</li>
            <li><strong>Address verification data:</strong> when you enter a zip code, we send it to a
              third-party zip-lookup service to confirm the city/state and estimate delivery distance.
              No account or persistent identifier is created with that service.</li>
            <li><strong>Communications:</strong> messages you send us by email, phone, or contact form.</li>
            <li><strong>Site usage data:</strong> with your cookie consent, basic analytics (pages
              viewed, general location by IP, device type) via Google Analytics.</li>
          </ul>

          <h2>3. How we use your information</h2>
          <ul>
            <li>To schedule and fulfill your tote delivery and pickup</li>
            <li>To process payment and send booking confirmations or receipts</li>
            <li>To contact you about your reservation (delivery windows, delays, issues)</li>
            <li>To calculate delivery distance and any applicable delivery fee</li>
            <li>To respond to questions or support requests</li>
            <li>To improve our website, with your analytics consent</li>
            <li>To detect and prevent fraud, spam, or abuse of our booking system</li>
          </ul>
          <p>We do not use your information for automated decision-making that produces legal or similarly significant effects.</p>

          <h2>4. How we share your information</h2>
          <p>We share information only as needed to run the business:</p>
          <ul>
            <li><strong>Stripe</strong> — payment processing. See Stripe&apos;s own privacy policy for
              how they handle payment data.</li>
            <li><strong>Zippopotam.us (or successor address-verification provider)</strong> — receives
              only the zip code you enter, to verify it and estimate distance.</li>
            <li><strong>Google Analytics</strong> — receives anonymized usage data, only if you accept
              analytics cookies.</li>
            <li><strong>[Your hosting provider]</strong> — hosts the website and processes requests to
              serve pages; standard server logs (IP address, timestamp, page requested) may be
              retained briefly for security purposes.</li>
          </ul>
          <p>We do not sell your personal information, and we do not share it with third parties for their own marketing purposes.</p>

          <h2>5. Cookies</h2>
          <p>
            We use a small number of cookies: one to remember your cookie consent choice, and — only
            if you accept — Google Analytics cookies to understand site traffic. You can decline
            analytics cookies in the banner shown on your first visit, and you can clear cookies at
            any time in your browser settings.
          </p>

          <h2>6. Data retention</h2>
          <p>
            [Decide and state your real retention period — for example: &quot;We retain booking
            records for 3 years for tax, accounting, and dispute-resolution purposes, then delete or
            anonymize them.&quot;]
          </p>

          <h2>7. Data security</h2>
          <p>
            We use industry-standard measures (HTTPS encryption in transit, restricted access to
            booking records) to protect your information. No method of transmission or storage is
            100% secure, and we cannot guarantee absolute security.
          </p>

          <h2>8. Your rights and choices</h2>
          <p>
            You can ask us to access, correct, or delete the personal information we hold about you
            by emailing <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>. Depending on
            your state of residence, you may have additional rights under state privacy law (for
            example, Michigan does not currently have a comprehensive consumer privacy statute in
            effect as of this writing — confirm current law with your attorney before finalizing this
            section, and add any state-specific disclosures your customers require).
          </p>

          <h2>9. Children&apos;s privacy</h2>
          <p>
            Our services are intended for adults arranging their own moves and are not directed at
            children under 13. We do not knowingly collect personal information from children under 13.
          </p>

          <h2>10. Changes to this policy</h2>
          <p>
            We may update this policy from time to time. We&apos;ll update the &quot;Last updated&quot;
            date above when we do. Continued use of our site after changes means you accept the
            updated policy.
          </p>

          <h2>11. Contact us</h2>
          <p>
            Questions about this policy or your data? Email{" "}
            <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a> or call{" "}
            <a href={`tel:${siteConfig.phone.replace(/[^0-9+]/g, "")}`}>{siteConfig.phone}</a>.
          </p>
        </div>
      </div>
      <Footer />
    </main>
  );
}
