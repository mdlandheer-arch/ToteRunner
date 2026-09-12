import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { siteConfig, packages } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Realtor Referral Program",
  description: `Refer your clients to ${siteConfig.name} and earn a referral bonus on every booking — plus a discount for them. Free for West Michigan agents to join.`,
};

const { commissionPerReferral, clientDiscount, payoutMethod, payoutTiming } = siteConfig.realtorReferral;

const steps = [
  {
    n: "1",
    title: "Get your code",
    body: "Email or call us and we'll set you up with a referral code in your name. Takes about five minutes and costs nothing.",
  },
  {
    n: "2",
    title: "Pass it along",
    body: `Give it to clients when a closing date firms up. They enter it when they book and take $${clientDiscount} off — so you're handing them a discount, not a sales pitch.`,
  },
  {
    n: "3",
    title: "We deliver",
    body: "We handle the totes, the delivery, and the pickup. Nothing lands back on your plate, and you hear from us if anything comes up.",
  },
  {
    n: "4",
    title: "You get paid",
    body: `$${commissionPerReferral} per completed booking, sent ${payoutTiming} by ${payoutMethod}.`,
  },
];

const why = [
  {
    title: "A closing gift that isn't a candle",
    body: "Most closing gifts get used once and forgotten. This one shows up the week they actually need it and takes a real job off their list.",
  },
  {
    title: "It makes your listings show better",
    body: "Sellers packing in uniform stacking totes keep a cleaner house during showings than sellers with cardboard piled in every corner.",
  },
  {
    title: "Your clients move faster",
    body: "No hunting for boxes, no taping, no breaking cardboard down afterward. Faster packing means fewer delays at the closing table.",
  },
  {
    title: "Zero effort on your end",
    body: "No inventory, no scheduling, no follow-up. You hand over a code and we take it from there.",
  },
];

const faqs = [
  {
    q: "Is there any cost to join?",
    a: "No. There's no fee, no minimum, and no commitment — refer one client or fifty.",
  },
  {
    q: "How do I know a referral was mine?",
    a: "Your code is attached to the booking at checkout. We track them and send you a summary with your payout.",
  },
  {
    q: "What if my client books without the code?",
    a: "Let us know and we'll credit it, as long as they confirm you sent them. We'd rather sort it out than lose you the referral.",
  },
  {
    q: "Can I refer buyers as well as sellers?",
    a: "Absolutely — buyers are moving too, and they often need totes longer since they're unpacking on the other end.",
  },
  {
    q: "Do you work with brokerages?",
    a: "Yes. If you want to set this up office-wide rather than agent by agent, call and we'll work something out.",
  },
];

export default function RealtorReferralPage() {
  return (
    <main>
      <Header />

      <section className="bg-tint-green">
        <div className="mx-auto max-w-4xl px-5 py-16 text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-crate">
            For West Michigan agents
          </p>
          <h1 className="mt-3 text-4xl font-extrabold leading-tight text-ink">
            Your clients are moving anyway.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-ink/75">
            Send them our way and earn ${commissionPerReferral} per booking — while they get $
            {clientDiscount} off. Free to join, nothing to manage.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a
              href={`mailto:${siteConfig.email}?subject=Realtor Referral Program`}
              className="rounded-md bg-crate px-6 py-3 font-semibold text-paper hover:bg-crate-dark"
            >
              Get your referral code
            </a>
            <a
              href={`tel:${siteConfig.phone.replace(/[^0-9+]/g, "")}`}
              className="rounded-md border border-ink/20 px-6 py-3 font-semibold text-ink hover:bg-ink/5"
            >
              Call {siteConfig.phone}
            </a>
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-4xl px-5 py-16">
          <h2 className="text-3xl font-bold text-ink">How it works</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s) => (
              <div key={s.n} className="border-l-2 border-crate pl-4">
                <div className="text-sm font-semibold text-crate">{s.n}</div>
                <h3 className="mt-1 font-bold text-ink">{s.title}</h3>
                <p className="mt-2 text-sm text-ink/75">{s.body}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-lg border border-line bg-tint-sand p-6">
            <p className="text-sm text-ink/80">
              <span className="font-semibold text-ink">Worth doing the math:</span> refer one client
              a month and that&apos;s ${commissionPerReferral * 12} a year for forwarding a code —
              on top of clients who remember you made their move easier.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-tint-sand">
        <div className="mx-auto max-w-4xl px-5 py-16">
          <h2 className="text-3xl font-bold text-ink">Why agents use us</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {why.map((w) => (
              <div key={w.title} className="rounded-lg border border-line bg-white/70 p-6">
                <h3 className="font-bold text-ink">{w.title}</h3>
                <p className="mt-2 text-sm text-ink/75">{w.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-4xl px-5 py-16">
          <h2 className="text-3xl font-bold text-ink">What your clients get</h2>
          <p className="mt-2 text-ink/75">
            Totes, a rolling dolly, labels, and both trips — delivery and pickup — included.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {packages.map((pkg) => (
              <div key={pkg.id} className="rounded-lg border border-line bg-white/70 p-5">
                <p className="font-bold text-ink">{pkg.name}</p>
                <p className="mt-2 text-2xl font-extrabold text-ink">${pkg.price}</p>
                <p className="mt-1 text-sm text-steel">
                  {pkg.totes} totes · {pkg.days} days
                </p>
                <p className="mt-2 text-sm font-medium text-crate">
                  ${clientDiscount} off with your code
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-tint-green">
        <div className="mx-auto max-w-3xl px-5 py-16">
          <h2 className="text-3xl font-bold text-ink">Questions</h2>
          <div className="mt-6 divide-y divide-line border-y border-line">
            {faqs.map((f) => (
              <details key={f.q} className="group py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between font-medium text-ink">
                  {f.q}
                  <span className="ml-4 text-crate transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-sm text-ink/75">{f.a}</p>
              </details>
            ))}
          </div>

          <div className="mt-10 rounded-lg border border-line bg-white/70 p-6 text-center">
            <h3 className="text-xl font-bold text-ink">Ready to start referring?</h3>
            <p className="mt-2 text-sm text-ink/75">
              One email and you&apos;ll have a code the same day.
            </p>
            <a
              href={`mailto:${siteConfig.email}?subject=Realtor Referral Program`}
              className="mt-5 inline-block rounded-md bg-crate px-6 py-3 font-semibold text-paper hover:bg-crate-dark"
            >
              Email {siteConfig.email}
            </a>
            <p className="mt-3 text-sm text-ink/75">
              Or call{" "}
              <a href={`tel:${siteConfig.phone.replace(/[^0-9+]/g, "")}`} className="font-medium text-crate hover:underline">
                {siteConfig.phone}
              </a>
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
