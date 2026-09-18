import { siteConfig } from "@/lib/site-config";
import ReserveButton from "@/components/ReserveButton";

export default function Hero() {
  return (
    <section>
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-2 md:items-center md:py-24">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-crate">
            {siteConfig.tagline}
          </p>
          <h1 className="mt-3 text-4xl font-extrabold leading-[1.05] text-ink sm:text-5xl">
            Stop buying boxes you&apos;ll just throw away.
          </h1>
          <p className="mt-5 max-w-md text-lg text-ink/70">
            We drop off sturdy, stackable totes before your move and haul the empties away when
            you&apos;re done. No tape, no cardboard mess, no landfill run.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ReserveButton
              label="Request your totes"
              className="rounded-md bg-crate px-6 py-3 font-semibold text-paper hover:bg-crate-dark"
            />
            <a
              href="#pricing"
              className="rounded-md border border-ink/20 px-6 py-3 font-semibold text-ink hover:bg-ink/5"
            >
              See pricing
            </a>
          </div>
          <p className="mt-4 text-sm text-steel">
            Free delivery and pickup across {siteConfig.region}.
          </p>
        </div>

        {/* Illustration built in CSS/SVG — no stock photography needed */}
        <div className="relative mx-auto aspect-square w-full max-w-sm">
          <svg viewBox="0 0 320 320" className="h-full w-full" role="img" aria-label="Stack of moving totes">
            <rect x="40" y="190" width="240" height="90" rx="10" fill="#23292c" />
            <rect x="40" y="190" width="240" height="20" rx="10" fill="#f5a524" />
            <rect x="70" y="100" width="180" height="90" rx="10" fill="#23292c" />
            <rect x="70" y="100" width="180" height="20" rx="10" fill="#f5a524" />
            <rect x="100" y="20" width="120" height="80" rx="10" fill="#23292c" />
            <rect x="100" y="20" width="120" height="18" rx="9" fill="#f5a524" />
          </svg>
        </div>
      </div>
    </section>
  );
}
