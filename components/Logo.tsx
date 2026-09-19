// ToteRunner logo — matches the mark used on the Facebook page.
// Black tote bodies with yellow lids, which is what the real inventory looks
// like; the green is brand accent only, never the tote itself.
//
// Inline SVG rather than an image file so it stays crisp at any size and
// picks up the site's color tokens.

const BODY = "#23292c";
const BODY_DARK = "#161b1e";
const LID = "#f5a524";

function Tote({
  x, y, w, h, lidH, outline,
}: { x: number; y: number; w: number; h: number; lidH: number; outline?: string }) {
  // Gentle taper (Facebook mark's totes are nearly straight-sided, not a wide
  // wedge) and a thin seam line near the top of the body rather than a big
  // interior block — the block read as a broken "window" cut into the tote.
  const topInset = w * 0.02;
  const bottomInset = w * 0.08;
  return (
    <>
      <rect x={x} y={y} width={w} height={lidH} rx={w * 0.028} fill={LID} />
      <path
        d={`M${x + topInset} ${y + lidH} L${x + w - topInset} ${y + lidH} L${x + w - bottomInset} ${y + lidH + h} L${x + bottomInset} ${y + lidH + h} Z`}
        fill={BODY}
        stroke={outline}
        strokeWidth={outline ? 2.5 : 0}
      />
      <rect
        x={x + bottomInset * 1.5}
        y={y + lidH + h * 0.14}
        width={w - bottomInset * 3}
        height={h * 0.07}
        rx={h * 0.03}
        fill={BODY_DARK}
        opacity="0.4"
      />
    </>
  );
}

/**
 * Icon-only mark — motion lines plus two stacked totes.
 *
 * Matches the approved brand mark (the one used on Facebook/Instagram):
 * two totes stacked, real-inventory proportions (wider/shorter than a
 * single storage bin actually is), with three accent lines trailing to
 * the left, brightest at the seam between the totes.
 *
 * The tote body is a near-black fill (matches the real inventory), which
 * disappears against a dark background — that's the header/light-background
 * default. Pass `dark` on any dark background (the footer, a dark hero) to
 * add a faint light edge around each body so it stays visible.
 */
export function LogoMark({ className, dark }: { className?: string; dark?: boolean }) {
  const outline = dark ? "rgba(255,255,255,0.35)" : undefined;
  // One tote's proportions, matched to the approved mark: lid height to body
  // height is roughly 2:5, and the whole tote is noticeably wider than it is
  // tall — closer to what a real moving tote looks like than a tall bin.
  const toteW = 106;
  const lidH = 16;
  const bodyH = 40;
  const toteH = lidH + bodyH; // 56
  const gap = 2; // small gap between the stacked totes, matching the mark
  const top1 = 28;
  const top2 = top1 + toteH + gap; // 86

  return (
    <svg viewBox="0 0 160 170" className={className} role="img" aria-label="ToteRunner">
      {/* Accent trail, brightest at the seam between the two totes */}
      <rect x="4" y="58" width="22" height="5" rx="2.5" fill="currentColor" opacity="0.4" />
      <rect x="0" y="83" width="30" height="5" rx="2.5" fill="currentColor" opacity="0.6" />
      <rect x="8" y="106" width="18" height="5" rx="2.5" fill="currentColor" opacity="0.4" />

      <Tote x={40} y={top1} w={toteW} h={bodyH} lidH={lidH} outline={outline} />
      <Tote x={40} y={top2} w={toteW} h={bodyH} lidH={lidH} outline={outline} />
    </svg>
  );
}

/** Horizontal lockup — mark plus wordmark. Used in the header. */
export default function Logo({ className }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className ?? ""}`}>
      <LogoMark className="h-7 w-auto text-crate" />
      <span className="text-lg font-bold tracking-tight text-ink">
        Tote<span className="text-crate">Runner</span>
      </span>
    </span>
  );
}
