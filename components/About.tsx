import Image from "next/image";
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
              {siteConfig.serviceAreas.length}+ towns across {siteConfig.region}, which means when something
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

          <div className="flex items-center justify-center rounded-lg border border-line bg-white p-10">
            <Image
              src="/brand/toterunner-mark.svg"
              alt="ToteRunner logo: two stacked black moving totes with yellow lids and green motion lines"
              width={423}
              height={348}
              unoptimized
              className="h-auto w-56"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
