import { siteConfig, hubs } from "@/lib/site-config";
import ReserveButton from "@/components/ReserveButton";
import HeroAnimation from "@/components/HeroAnimation";

export default function Hero() {
  return (
    <section>
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-2 md:items-center md:py-24">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-crate">
            <span className="typewrite">{siteConfig.tagline}</span>
          </p>
          <h1 className="mt-3 text-4xl font-extrabold leading-[1.05] text-ink sm:text-5xl">
            Stop buying boxes you&rsquo;ll just throw away.
          </h1>
          <p className="mt-5 max-w-md text-lg text-ink/70">
            We drop off sturdy, stackable totes before your move and haul the empties away when
            you&rsquo;re done. No tape, no cardboard mess, no landfill run.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ReserveButton
              label="Request your totes"
              className="btn-edge-yellow rounded-md bg-safety px-8 py-4 text-lg font-semibold text-ink hover:brightness-95"
            />
            <a
              href="#pricing"
              className="rounded-md border border-ink/20 px-6 py-3 font-semibold text-ink hover:bg-ink/5"
            >
              See pricing
            </a>
          </div>
          <p className="mt-4 text-sm text-ink/70">
            Free delivery and pickup within {siteConfig.freeDeliveryRadiusMiles} miles of{" "}
            {hubs.map((h) => h.name).join(" or ")}.
          </p>
        </div>

        {/* Animated tote stack — brand master tote, CSS keyframes, still frame for reduced motion */}
        <div className="mx-auto w-full max-w-sm">
          <HeroAnimation />
        </div>
      </div>
    </section>
  );
}
