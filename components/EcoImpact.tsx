// Merged into WhyUs — kept as a standalone strip so the eco angle still gets
// its own visual moment without a wall of text. Claims stay qualitative; see
// the note in WhyUs before adding any hard statistics.
const points = [
  ["Hundreds of moves", "One tote replaces boxes over and over."],
  ["Nothing at the curb", "No cardboard pile. We take them away."],
  ["No tape, ever", "Tape isn't recyclable. Skip it entirely."],
  ["Recycled at end of life", "Worn-out totes become new product."],
];

export default function EcoImpact() {
  return (
    <section id="eco" className="bg-tint-green">
      <div className="mx-auto max-w-6xl px-5 py-16">
        <p className="text-sm font-semibold uppercase tracking-wide text-crate">The greener move</p>
        <h2 className="mt-2 max-w-xl text-3xl font-bold text-ink">
          A move that doesn&apos;t end in a landfill.
        </h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {points.map(([title, body]) => (
            <div key={title}>
              <p className="font-bold text-ink">{title}</p>
              <p className="mt-1 text-sm text-ink/75">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
