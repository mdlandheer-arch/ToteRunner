// Merged into WhyUs — kept as a standalone strip so the eco angle still gets
// its own visual moment without a wall of text. Claims stay qualitative; see
// the note in WhyUs before adding any hard statistics.
const points = [
  ["One tote, many boxes", "A tote replaces a lot of cardboard."],
  ["Nothing at the curb", "No cardboard pile. We take the totes back."],
  ["No tape", "Nothing to peel off and throw out."],
  ["Reused, not tossed", "Every tote goes back out on the next rental."],
];

export default function EcoImpact() {
  return (
    <section id="eco" className="border-t border-line bg-tint-green">
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
