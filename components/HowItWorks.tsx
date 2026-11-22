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
            <StaggerItem key={s.n} index={i} className="relative flex gap-4 sm:block">
              {i < steps.length - 1 && (
                <>
                  {/* Phone: a line runs down from this badge to the next one. */}
                  <span aria-hidden="true" className="absolute -bottom-8 left-[15px] top-8 w-0.5 bg-crate sm:hidden" />
                  {/* Wide screens: a line runs across from this badge to the next one. */}
                  <span aria-hidden="true" className="absolute left-8 top-[15px] hidden h-0.5 w-full bg-crate lg:block" />
                </>
              )}
              <div className="btn-edge relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-crate text-sm font-bold text-paper">{s.n}</div>
              <div>
                <h3 className="text-lg font-bold text-ink sm:mt-3">{s.title}</h3>
                <p className="mt-2 text-base text-ink/70">{s.body}</p>
              </div>
            </StaggerItem>
          ))}
        </div>

      </div>
    </section>
  );
}
