import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { siteConfig } from "@/lib/site-config";
import { pageMetadata } from "@/lib/seo";

// Where people land after the booking form succeeds. It has its own URL so it can
// be used as a conversion goal in GA4. Not for search results: noindex, and it's
// deliberately left out of sitemap.ts. (Don't block it in robots.ts — Google has
// to be able to crawl the page to see the noindex.)
export const metadata: Metadata = {
  ...pageMetadata({
    path: "/thank-you",
    title: "Request Received: What Happens Next",
    description: `Your tote rental request was sent to ${siteConfig.name}. Here's what happens next and when you'll hear from us.`,
  }),
  robots: { index: false, follow: true },
};

const steps = [
  {
    title: "Check your email now",
    body: `We just sent a copy of your request from ${siteConfig.email}. If it isn't in your inbox in a few minutes, check spam or promotions.`,
  },
  {
    title: "We reply within one business day",
    body: "We'll confirm the totes are available for your dates and send payment details. Nothing is charged until you hear from us.",
  },
  {
    title: "We deliver, you pack, we pick up",
    body: "Once confirmed, we bring the totes and dolly to your door. Pack at your own pace, and we collect the empties on your pickup date.",
  },
];

export default function ThankYouPage() {
  const tel = `tel:${siteConfig.phone.replace(/[^0-9+]/g, "")}`;

  return (
    <main>
      <Header />
      <div className="mx-auto max-w-2xl px-5 py-16">
        <div
          aria-hidden="true"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-crate text-2xl font-bold text-paper"
        >
          ✓
        </div>
        <h1 className="mt-5 text-3xl font-bold text-ink">Request received. Thank you!</h1>
        <p className="mt-3 text-ink/75">
          This isn&apos;t a confirmed booking yet — your dates aren&apos;t locked in and nothing has been charged.
          We&apos;ll check availability first.
        </p>

        <h2 className="mt-10 text-xl font-bold text-ink">What happens next</h2>
        <ol className="mt-4 space-y-5">
          {steps.map((s, i) => (
            <li key={s.title} className="flex gap-4">
              <span
                aria-hidden="true"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-crate text-sm font-semibold text-crate"
              >
                {i + 1}
              </span>
              <div>
                <p className="font-semibold text-ink">{s.title}</p>
                <p className="mt-1 text-sm text-ink/75">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-10 rounded-lg border border-line bg-white/70 p-5 text-sm text-ink/80">
          <p className="font-semibold text-ink">Need to change something, or need it sooner?</p>
          <p className="mt-1">
            Reply to the confirmation email, email{" "}
            <a href={`mailto:${siteConfig.email}`} className="font-medium text-crate underline">
              {siteConfig.email}
            </a>
            , or call{" "}
            <a href={tel} className="font-medium text-crate underline">
              {siteConfig.phone}
            </a>
            .
          </p>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="/"
            className="inline-flex min-h-11 items-center rounded-md bg-crate px-6 py-3 font-semibold text-paper hover:bg-crate-dark"
          >
            Back to home
          </a>
          <a
            href="/faq"
            className="inline-flex min-h-11 items-center rounded-md border border-ink/20 px-6 py-3 font-semibold text-ink hover:bg-ink/5"
          >
            Read the FAQ
          </a>
        </div>
      </div>
      <Footer />
    </main>
  );
}
