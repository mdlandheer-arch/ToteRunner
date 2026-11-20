import StaggerItem from "@/components/StaggerItem";

const steps = [
  {
    n: "1",
    title: "We deliver",
    body: "Request your dates online. We drop the totes and a dolly at your door before moving day.",
  },
  {
    n: "2",
    title: "You pack",
    body: "Fill the totes. No boxes to build and no tape. Keep each one under about 60 lbs.",
  },
  {
    n: "3",
    title: "You move",
    body: "The totes stack tight in the truck and everything stays together.",
  },
  {
    n: "4",
    title: "We pick up",
    body: "When you’re unpacked, we come get the empties. No cardboard to break down or haul away.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works">
      <div className="mx-auto max-w-6xl px-5 py-16">
        <h2 className="section-h text-3xl font-bold text-ink">How it works</h2>
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <StaggerItem key={s.n} index={i} className="border-l-2 border-crate pl-4">
              <div className="btn-edge flex h-8 w-8 items-center justify-center rounded-full bg-crate text-sm font-bold text-paper">{s.n}</div>
              <h3 className="mt-3 text-lg font-bold text-ink">{s.title}</h3>
              <p className="mt-2 text-sm text-ink/70">{s.body}</p>
            </StaggerItem>
          ))}
        </div>

      </div>
    </section>
  );
}
