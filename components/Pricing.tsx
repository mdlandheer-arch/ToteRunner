import { packages, addOns } from "@/lib/site-config";
import ToteCalculator from "@/components/ToteCalculator";

export default function Pricing() {
  return (
    <section id="pricing">
      <div className="mx-auto max-w-6xl px-5 py-16">
        <h2 className="text-3xl font-bold text-ink">Pricing</h2>
        <p className="mt-2 text-ink/70">Delivery and pickup included in every package.</p>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
          <div className="grid gap-6 sm:grid-cols-2">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className={`relative rounded-lg border p-6 ${
                  pkg.popular ? "border-crate shadow-md" : "border-line"
                }`}
              >
                {pkg.popular && (
                  <span className="absolute -top-3 left-6 rounded-full bg-safety px-3 py-1 text-xs font-semibold text-ink">
                    Most popular
                  </span>
                )}
                <h3 className="text-lg font-bold text-ink">{pkg.name}</h3>
                <p className="mt-3 text-3xl font-extrabold text-ink">${pkg.price}</p>
                <p className="mt-1 text-sm text-steel">
                  {pkg.totes} totes · {pkg.days}-day rental
                </p>
                <p className="mt-3 text-sm text-ink/70">{pkg.blurb}</p>
                <ul className="mt-4 space-y-1.5 border-t border-line pt-4">
                  {pkg.includes.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-ink/80">
                      <span className="text-crate">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
                <a
                  href={`#booking`}
                  className="mt-5 block rounded-md bg-crate px-4 py-2 text-center text-sm font-semibold text-paper hover:bg-crate-dark"
                >
                  Select package
                </a>
              </div>
            ))}
          </div>

          <ToteCalculator />
        </div>

        <div className="mt-10">
          <h3 className="text-lg font-bold text-ink">Optional add-ons</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {addOns.map((a) => (
              <div key={a.id} className="flex items-center justify-between rounded-md border border-line px-4 py-3 text-sm">
                <span className="text-ink/80">{a.name}</span>
                <span className="font-semibold text-ink">${a.price} {a.unit !== "flat" ? a.unit : ""}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
