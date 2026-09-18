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
            {/* Bottom tote */}
            <rect x="34" y="196" width="252" height="24" rx="11" fill="#f5a524" />
            <path d="M45 220 L275 220 L249 292 L71 292 Z" fill="#23292c" />
            <path d="M76 240 L244 240 L233 272 L87 272 Z" fill="#161b1e" opacity="0.5" />

            {/* Middle tote */}
            <rect x="66" y="110" width="188" height="22" rx="10" fill="#f5a524" />
            <path d="M75 132 L245 132 L226 192 L94 192 Z" fill="#23292c" />
            <path d="M102 149 L218 149 L210 176 L110 176 Z" fill="#161b1e" opacity="0.5" />

            {/* Top tote */}
            <rect x="98" y="34" width="124" height="19" rx="9" fill="#f5a524" />
            <path d="M104 53 L216 53 L203 106 L117 106 Z" fill="#23292c" />
            <path d="M124 68 L196 68 L190 92 L130 92 Z" fill="#161b1e" opacity="0.5" />
          </svg>
        </div>
      </div>
    </section>
  );
}
