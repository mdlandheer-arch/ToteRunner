import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { siteConfig, eventPackage, damageFees } from "@/lib/site-config";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  path: "/events",
  title: "Wedding & Event Tote Rental",
  description: `Haul wedding and event decor in sturdy reusable totes. ${eventPackage.totes} totes, a dolly and labels for ${eventPackage.days} days, $${eventPackage.price}. Grand Rapids & the Lakeshore.`,
});

// Links straight to the booking form on the homepage with this package
// preselected (BookingForm reads ?package=).
const bookHref = `/?package=${eventPackage.id}#booking`;

const steps = [
  { n: "1", title: "We drop off at your home", body: `${eventPackage.totes} clean totes, a dolly and labels, delivered to your house before the event.` },
  { n: "2", title: "You pack and haul", body: "Load centerpieces, candles, signs and favors. Everything stacks, so it fits in one trip to the venue — and back home after." },
  { n: "3", title: "We pick up from your home", body: "Once you're unpacked and the totes are empty, we pick them up from your house." },
];

const uses = ["Weddings & receptions", "Bridal & baby showers", "Grad parties", "Church & school events", "Craft & vendor shows"];

const faqs = [
  {
    q: "What's included?",
    a: `${eventPackage.totes} totes, ${eventPackage.dollies} dolly, ${eventPackage.totes} labels, and delivery and pickup for ${eventPackage.days} days. Delivery and pickup are free within ${siteConfig.freeDeliveryRadiusMiles} miles of Grand Rapids or Muskegon; beyond that it's $${siteConfig.perMileFeeBeyondRadius.toFixed(2)}/mile.`,
  },
  {
    q: "Can I keep them longer than a week?",
    a: `Yes. Pick your dates on the booking form and anything past ${eventPackage.days} days is $${eventPackage.dailyRate}/day. You'll see the total before you pay.`,
  },
  {
    q: "Can you deliver to the venue?",
    a: "No — we drop off and pick up at your home, not the venue. That way you can pack ahead of time, take the totes to the venue yourself, and bring everything home after without racing a pickup window.",
  },
  {
    q: "Do I need more totes?",
    a: "Add extra totes on the booking request, or pick \"Not sure / need a custom quote\" and tell us about your event.",
  },
  {
    q: "What if something gets damaged?",
    a: `Normal wear is never charged. Totes lost or damaged beyond normal use are $${damageFees.perTote} each.`,
  },
];

export default function EventsPage() {
  return (
    <main>
      <Header />

      <section className="bg-tint-green">
        <div className="mx-auto max-w-4xl px-5 py-16 text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-crate">
            Weddings &amp; events · {siteConfig.region}
          </p>
          <h1 className="mt-3 text-4xl font-extrabold leading-tight text-ink">
            Wedding decor everywhere? Pack it once.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-ink/75">
            Sturdy, stackable totes for centerpieces, candles, signs and favors. No hunting for
            boxes, no crushed decor.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a href={bookHref} className="rounded-md bg-crate px-6 py-3 font-semibold text-paper hover:bg-crate-dark">
              Reserve the Event Package
            </a>
            <a
              href={`tel:${siteConfig.phone.replace(/[^0-9+]/g, "")}`}
              className="rounded-md border border-crate px-6 py-3 font-semibold text-crate hover:bg-crate/5"
            >
              Call or text {siteConfig.phone}
            </a>
          </div>
          <p className="mt-3 text-sm text-ink/70">Reserve online — no payment up front.</p>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-4xl px-5 py-16">
          <div className="mx-auto max-w-md rounded-lg border-2 border-crate bg-white/70 p-6 text-center">
            <h2 className="text-lg font-bold text-ink">{eventPackage.name}</h2>
            <p className="mt-3 text-4xl font-extrabold text-ink">${eventPackage.price}</p>
            <p className="mt-1 text-sm text-ink/70">
              {eventPackage.totes} totes · {eventPackage.days}-day rental
            </p>
            <p className="mt-1 text-sm text-ink/70">Need longer? ${eventPackage.dailyRate}/day after that.</p>
            <ul className="mt-4 space-y-1.5 border-t border-line pt-4 text-left">
              {eventPackage.includes.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-ink/80">
                  <span className="text-crate">✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm font-medium text-crate">
              Free delivery &amp; pickup within {siteConfig.freeDeliveryRadiusMiles} miles of Grand Rapids or
              Muskegon.
            </p>
            <a
              href={bookHref}
              className="mt-5 flex min-h-11 items-center justify-center rounded-md bg-crate px-4 py-2 text-sm font-semibold text-paper hover:bg-crate-dark"
            >
              Request this package
            </a>
          </div>

          <h2 className="mt-16 text-3xl font-bold text-ink">How it works</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            {steps.map((s) => (
              <div key={s.n} className="rounded-lg border border-line p-6">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-crate font-bold text-paper">
                  {s.n}
                </span>
                <h3 className="mt-4 font-bold text-ink">{s.title}</h3>
                <p className="mt-2 text-sm text-ink/75">{s.body}</p>
              </div>
            ))}
          </div>

          <h2 className="mt-16 text-3xl font-bold text-ink">Great for</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {uses.map((u) => (
              <span key={u} className="rounded-full border border-line bg-white/70 px-4 py-1.5 text-sm text-ink/80">
                {u}
              </span>
            ))}
          </div>

          <p className="mt-10 text-sm text-ink/75">
            Moving instead?{" "}
            <a href="/#pricing" className="font-medium text-crate hover:underline">
              See our moving packages
            </a>
            .
          </p>
        </div>
      </section>

      <section className="bg-tint-green">
        <div className="mx-auto max-w-3xl px-5 py-16">
          <h2 className="text-3xl font-bold text-ink">Questions</h2>
          <div className="mt-6 divide-y divide-line border-y border-line">
            {faqs.map((f) => (
              <details key={f.q} className="group py-4">
                <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between font-medium text-ink">
                  {f.q}
                  <span className="ml-4 text-crate transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-sm text-ink/75">{f.a}</p>
              </details>
            ))}
          </div>

          <div className="mt-10 rounded-lg border border-line bg-white/70 p-6 text-center">
            <h3 className="text-xl font-bold text-ink">Ready to reserve?</h3>
            <p className="mt-2 text-sm text-ink/75">Pick your dates and we&apos;ll confirm by email.</p>
            <a href={bookHref} className="mt-5 inline-block rounded-md bg-crate px-6 py-3 font-semibold text-paper hover:bg-crate-dark">
              Reserve the Event Package
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
