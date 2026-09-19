import { siteConfig } from "@/lib/site-config";

// Rewrite this copy in your own voice before launch — the placeholders below
// are scaffolding, not a story. Local customers choose the local operator they
// feel like they know, so specifics (why you started, where you live, what you
// do when you're not hauling totes) are worth more here than polish.

const badges = [
  { icon: "👪", label: "Family owned & operated" },
  { icon: "♻️", label: "Hundreds of moves per tote" },
  { icon: "✨", label: "Scrubbed before every drop-off" },
  { icon: "🚚", label: "We handle both trips" },
];

export default function About() {
  return (
    <section id="about">
      <div className="mx-auto max-w-6xl px-5 py-16">
        <div className="grid gap-10 lg:grid-cols-[1fr_380px] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-crate">
              Locally & family owned
            </p>
            <h2 className="mt-2 text-3xl font-bold text-ink">
              A better way to box up your move.
            </h2>

            <p className="mt-4 text-ink/75">
              I&apos;m {siteConfig.about.ownerNames}, and I run {siteConfig.name} out of{" "}
              {siteConfig.about.homeTown}. Moving is always a bigger job than you think it&apos;s
              going to be — there&apos;s never enough time, and there&apos;s always one more closet.
              I can&apos;t pack it for you, but I can take one thing off the list: no hunting for
              boxes, no taping, no pile of cardboard in the garage afterward. Totes show up, you
              fill them, I come get them. That&apos;s it.
            </p>
            <p className="mt-3 text-ink/75">
              No franchise, no call center — a family-owned operation covering{" "}
              {siteConfig.serviceAreas.length}+ West Michigan towns, which means when something
              needs sorting out, you&apos;re talking to the person who can sort it out.
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
            <svg viewBox="0 0 200 200" className="mx-auto h-28 w-28" role="img" aria-label="Stack of moving totes">
              <rect x="22" y="122" width="156" height="15" rx="7" fill="#f5a524" />
              <path d="M28 137 L172 137 L156 180 L44 180 Z" fill="#23292c" />
              <path d="M48 149 L152 149 L145 168 L55 168 Z" fill="#161b1e" opacity="0.5" />

              <rect x="46" y="68" width="108" height="13" rx="6" fill="#f5a524" />
              <path d="M51 81 L149 81 L138 118 L62 118 Z" fill="#23292c" />
              <path d="M68 92 L132 92 L127 109 L73 109 Z" fill="#161b1e" opacity="0.5" />

              <rect x="68" y="20" width="64" height="11" rx="5" fill="#f5a524" />
              <path d="M72 31 L128 31 L121 64 L79 64 Z" fill="#23292c" />
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
