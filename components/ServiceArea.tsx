import { siteConfig } from "@/lib/site-config";
import ServiceAreaChecker from "@/components/ServiceAreaChecker";

export default function ServiceArea() {
  return (
    <section className="bg-tint-sand">
      <div className="mx-auto max-w-6xl px-5 py-16">
        <h2 className="text-3xl font-bold text-ink">Serving {siteConfig.region}</h2>
        <p className="mt-2 max-w-xl text-ink/70">
          We deliver across {siteConfig.city} and the surrounding area, including:
        </p>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
          <div>
            <div className="flex flex-wrap gap-2">
              {siteConfig.serviceAreas.map((area) => (
                <span key={area} className="rounded-full border border-line px-4 py-1.5 text-sm text-ink/80">
                  {area}
                </span>
              ))}
            </div>
            <p className="mt-6 text-sm text-ink/75">
              Free delivery and pickup within {siteConfig.freeDeliveryRadiusMiles} miles.
              {siteConfig.perMileFeeBeyondRadius > 0 && (
                <> A ${siteConfig.perMileFeeBeyondRadius.toFixed(2)}/mile fee applies beyond that.</>
              )}
            </p>
            <p className="mt-2 text-sm text-ink/75">
              Further out?{" "}
              <a href={`mailto:${siteConfig.email}`} className="font-medium text-crate hover:underline">
                Email us
              </a>{" "}
              — if you&apos;re nearby, chances are we can help.
            </p>
          </div>

          <ServiceAreaChecker />
        </div>
      </div>
    </section>
  );
}
