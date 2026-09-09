// Sample testimonials — replace with real, attributed customer reviews before launch.
// Do not publish placeholder quotes as if they were real.
const reviews = [
  { quote: "Booked online, totes showed up on time, pickup was just as easy. Made a stressful move simple.", name: "Sample customer", tag: "Local move" },
  { quote: "No more taping boxes at midnight. They stacked perfectly in the truck.", name: "Sample customer", tag: "Repeat customer" },
  { quote: "Appreciated not adding a pile of cardboard to the curb after we unpacked.", name: "Sample customer", tag: "Eco-conscious mover" },
];

export default function Reviews() {
  return (
    <section>
      <div className="mx-auto max-w-6xl px-5 py-16">
        <h2 className="text-3xl font-bold text-ink">What movers say</h2>
        <p className="mt-1 text-xs text-steel">
          Placeholder testimonials shown for layout — swap in real, verifiable reviews before launch.
        </p>
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {reviews.map((r, i) => (
            <div key={i} className="rounded-lg border border-line p-6">
              <p className="text-sm text-ink/80">&ldquo;{r.quote}&rdquo;</p>
              <p className="mt-4 text-sm font-semibold text-ink">{r.name}</p>
              <p className="text-xs text-steel">{r.tag}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
