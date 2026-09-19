import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FAQ from "@/components/FAQ";
import { siteConfig } from "@/lib/site-config";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  path: "/faq",
  title: "Frequently Asked Questions",
  description: `Common questions about renting moving totes from ${siteConfig.name} — pricing, rental length, delivery, cleaning, and cancellations.`,
});

export default function FAQPage() {
  return (
    <main>
      <Header />
      <div className="mx-auto max-w-3xl px-5 py-16">
        <h1 className="text-3xl font-bold text-ink">Frequently asked questions</h1>
        <p className="mt-3 text-ink/70">
          Everything people usually want to know before booking. Still stuck? Call{" "}
          <a href={`tel:${siteConfig.phone.replace(/[^0-9+]/g, "")}`} className="font-medium text-crate hover:underline">
            {siteConfig.phone}
          </a>{" "}
          or email{" "}
          <a href={`mailto:${siteConfig.email}`} className="font-medium text-crate hover:underline">
            {siteConfig.email}
          </a>
          .
        </p>

        <div className="mt-10">
          <FAQ />
        </div>

        <div className="mt-12 rounded-lg border border-line bg-tint-green p-6 text-center">
          <p className="font-semibold text-ink">Ready to request dates?</p>
          <p className="mt-1 text-sm text-ink/70">No payment up front.</p>
          <a href="/#booking" className="mt-4 inline-block rounded-md bg-crate px-6 py-3 font-semibold text-paper hover:bg-crate-dark">
            Request your totes
          </a>
        </div>
      </div>
      <Footer />
    </main>
  );
}
