import { siteConfig } from "@/lib/site-config";

// Rewrite this copy in your own voice before launch — the placeholders below
// are scaffolding, not a story. Local customers choose the local operator they
// feel like they know, so specifics (why you started, where you live, what you
// do when you're not hauling totes) are worth more here than polish.

const badges = [
  { icon: "♻️", label: "Hundreds of moves per tote" },
  { icon: "✨", label: "Scrubbed before every drop-off" },
  { icon: "🚚", label: "We handle both trips" },
  { icon: "🏡", label: "Run from Grand Rapids" },
];

export default function About() {
  return (
    <section id="about">
      <div className="mx-auto max-w-6xl px-5 py-16">
        <div className="grid gap-10 lg:grid-cols-[1fr_380px] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-crate">
              Locally owned
            </p>
            <h2 className="mt-2 text-3xl font-bold text-ink">
              A better way to box up your move.
            </h2>

            <p className="mt-4 text-ink/75">
              I&apos;m {siteConfig.about.ownerNames}, and I run {siteConfig.name} out of{" "}
              {siteConfig.about.homeTown}. [One or two sentences on why you started — the move that
              made you think there had to be a better way.] No franchise behind this, just a local
              operation covering {siteConfig.serviceAreas.length}+ West Michigan towns.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              {badges.map((b) => (
                <span
                  key={b.label}
                  className="rounded-full border border-line bg-white/70 px-4 py-1.5 text-sm text-ink/80"
                >
                  <span aria-hidden="true">{b.icon}</span> {b.label}
                </span>
              ))}
            </div>
          </div>

          {/* Swap this placeholder for a real photo of you with the totes —
              it's the single highest-impact image on the whole site. */}
          <div className="rounded-lg border border-dashed border-line bg-white/70 p-10 text-center">
            <svg viewBox="0 0 200 200" className="mx-auto h-28 w-28" role="img" aria-label="Photo placeholder">
              <rect x="30" y="120" width="140" height="55" rx="8" fill="#1b1f23" />
              <rect x="30" y="120" width="140" height="12" rx="6" fill="#f2b705" />
              <rect x="50" y="65" width="100" height="55" rx="8" fill="#2f6d4f" />
              <rect x="50" y="65" width="100" height="12" rx="6" fill="#f2b705" />
              <rect x="70" y="20" width="60" height="45" rx="8" fill="#1b1f23" />
              <rect x="70" y="20" width="60" height="10" rx="5" fill="#f2b705" />
            </svg>
            <p className="mt-4 text-sm font-medium text-ink/70">Your photo goes here</p>
            <p className="mt-1 text-sm text-steel">
              A shot of you with a stack of totes builds more trust than anything else on this page.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
