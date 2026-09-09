import { siteConfig } from "@/lib/site-config";

const cardboard = ["Buy your own boxes", "Tape every seam", "Boxes sag or collapse", "Haul them to recycling after"];
const totes = ["Delivered to your door", "No tape needed", "Stack tight, stay rigid", "We pick them up when you're done"];

export default function WhyUs() {
  return (
    <section>
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
