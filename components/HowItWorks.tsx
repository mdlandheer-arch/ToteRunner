const steps = [
  {
    n: "1",
    title: "We deliver",
    body: "Book online and we'll drop a stack of clean, sturdy totes at your door before moving day.",
  },
  {
    n: "2",
    title: "You pack",
    body: "Fill the stackable totes instead of wrestling with cardboard and tape. Each holds up to 60 lbs.",
  },
  {
    n: "3",
    title: "You move",
    body: "Totes stack tight in the truck, keeping things organized and protected the whole way.",
  },
  {
    n: "4",
    title: "We pick up",
    body: "Once you're unpacked, we collect the empties. No recycling runs, no cardboard pile in the garage.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works">
      <div className="mx-auto max-w-6xl px-5 py-16">
        <h2 className="text-3xl font-bold text-ink">Moving made simple in four steps</h2>
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s) => (
            <div key={s.n} className="border-l-2 border-crate pl-4">
              <div className="text-sm font-semibold text-crate">{s.n}</div>
              <h3 className="mt-1 text-lg font-bold text-ink">{s.title}</h3>
              <p className="mt-2 text-sm text-ink/70">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
