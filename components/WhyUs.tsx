import { siteConfig } from "@/lib/site-config";

const cardboard = ["Buy your own boxes", "Tape every seam", "Boxes sag or collapse", "Haul them to recycling after"];
const totes = ["Delivered to your door", "No tape needed", "Stack tight, stay rigid", "We pick them up when you're done"];

export default function WhyUs() {
  return (
    <section className="bg-tint-sand">
      <div className="mx-auto max-w-6xl px-5 py-16">
        <h2 className="text-3xl font-bold text-ink">Cardboard vs. totes</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          <div className="rounded-lg border border-line p-6">
            <h3 className="font-bold text-ink/60">Cardboard boxes</h3>
            <ul className="mt-4 space-y-2 text-sm text-ink/70">
              {cardboard.map((c) => (
                <li key={c}>– {c}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-lg border border-crate bg-crate/5 p-6">
            <h3 className="font-bold text-crate">Our totes</h3>
            <ul className="mt-4 space-y-2 text-sm text-ink/80">
              {totes.map((t) => (
                <li key={t}>✓ {t}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 rounded-lg border border-line p-6">
          <h3 className="text-xl font-bold text-ink">Built for real moving days</h3>
          <p className="mt-2 max-w-2xl text-sm text-ink/70">
            Rain or snow doesn&apos;t care about your move date. Wet cardboard loses its strength fast —
            our totes have secure lids and a rigid plastic shell that hold up regardless of weather.
          </p>
        </div>

        <div className="mt-6 rounded-lg border border-line p-6">
          <h3 className="text-xl font-bold text-ink">Clean, sanitized, and bug-free</h3>
          <p className="mt-2 max-w-2xl text-sm text-ink/70">
            Every tote is cleaned and sanitized between rentals — inside, outside, and the lids — and
            old labels are removed before it reaches you. This is one of the real advantages over
            cardboard: used boxes absorb moisture and odors, and they&apos;re a known hiding spot for
            bedbugs and pantry pests. Hard plastic doesn&apos;t give them anywhere to go.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {[
              ["Vacuumed", "Debris and dust removed from every corner."],
              ["Sanitized", "Cleaned inside and out, lids included."],
              ["Inspected", "Old labels off, lids and handles checked."],
            ].map(([title, body]) => (
              <div key={title} className="rounded-md border border-line bg-white/60 p-4">
                <p className="text-sm font-semibold text-crate">{title}</p>
                <p className="mt-1 text-sm text-ink/70">{body}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 rounded-lg border border-line p-6">
          <h3 className="text-xl font-bold text-ink">Also great for</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {siteConfig.otherUseCases.map((useCase) => (
              <span key={useCase} className="rounded-full border border-line bg-white/60 px-4 py-1.5 text-sm text-ink/80">
                {useCase}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
