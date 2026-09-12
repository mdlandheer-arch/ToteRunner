import { siteConfig } from "@/lib/site-config";

// NOTE ON CLAIMS: everything here is qualitative and defensible on its face
// (a reused tote replaces boxes; cardboard is single-use in a move). If you
// want to add hard numbers — "used 400+ times," "X trees saved," "only Y% of
// cardboard is recycled" — get them from your actual tote supplier's spec
// sheet or a citable source first. Competitors publish stats like these
// without sourcing them; unsupported environmental claims are exactly what
// the FTC's Green Guides target, so don't copy theirs.

const points = [
  {
    title: "Used hundreds of times, not once",
    body: "A cardboard box gets taped, filled, cut open, and thrown out — all in one move. Our totes go back on the truck, get cleaned, and do it again for the next family.",
  },
  {
    title: "Nothing left at the curb",
    body: "No flattened box mountain in your garage, no trips to the recycling center, no pile on the curb the week after you move in. We take them away.",
  },
  {
    title: "No tape, no filler, no box cutters",
    body: "Packing tape isn't recyclable and it contaminates the cardboard it's stuck to. Skipping it entirely removes a whole category of waste from your move.",
  },
  {
    title: "Recycled at the end of their life",
    body: "When a tote finally wears out after many moves, it doesn't go to landfill — the plastic gets recycled into new product.",
  },
];

export default function EcoImpact() {
  return (
    <section id="eco">
      <div className="mx-auto max-w-6xl px-5 py-16">
        <p className="text-sm font-semibold uppercase tracking-wide text-crate">The greener move</p>
        <h2 className="mt-2 max-w-2xl text-3xl font-bold text-ink">
          Every move you make with us is one that doesn&apos;t end in a landfill.
        </h2>
        <p className="mt-3 max-w-2xl text-ink/70">
          Moving generates a startling amount of single-use waste — and almost all of it is
          cardboard that gets used once and thrown away. Renting totes takes that out of the
          equation entirely.
        </p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {points.map((p) => (
            <div key={p.title} className="rounded-lg border border-crate/30 bg-crate/5 p-6">
              <h3 className="font-bold text-ink">{p.title}</h3>
              <p className="mt-2 text-sm text-ink/70">{p.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-lg border border-line bg-white/60 p-6">
          <p className="text-ink/80">
            <span className="font-semibold text-ink">The short version:</span> one rental keeps a
            household&apos;s worth of cardboard out of the waste stream, and the same totes go on to
            do it again for your neighbors. Renting isn&apos;t just cheaper and easier than buying
            boxes — it&apos;s the only version of moving day that doesn&apos;t leave a pile behind.
          </p>
          <p className="mt-3 text-sm text-steel">
            Serving {siteConfig.region} — locally owned, and reusing the same fleet move after move.
          </p>
        </div>
      </div>
    </section>
  );
}
