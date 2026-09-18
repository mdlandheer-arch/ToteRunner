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
  x, y, w, h, lidH,
}: { x: number; y: number; w: number; h: number; lidH: number }) {
  const inset = w * 0.11;
  return (
    <>
      <rect x={x} y={y} width={w} height={lidH} rx={lidH * 0.22} fill={LID} />
      <path
        d={`M${x + w * 0.045} ${y + lidH} L${x + w * 0.955} ${y + lidH} L${x + w * 0.845} ${y + h} L${x + w * 0.155} ${y + h} Z`}
        fill={BODY}
      />
      <path
        d={`M${x + inset * 1.9} ${y + lidH + h * 0.16} L${x + w - inset * 1.9} ${y + lidH + h * 0.16} L${x + w - inset * 2.25} ${y + lidH + h * 0.52} L${x + inset * 2.25} ${y + lidH + h * 0.52} Z`}
        fill={BODY_DARK}
        opacity="0.55"
      />
    </>
  );
}

/** Icon-only mark — motion lines plus a single tote. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 130" className={className} role="img" aria-label="ToteRunner">
      <rect x="4" y="34" width="22" height="5" rx="2.5" fill="currentColor" opacity="0.35" />
      <rect x="0" y="52" width="30" height="5" rx="2.5" fill="currentColor" opacity="0.55" />
      <rect x="8" y="70" width="18" height="5" rx="2.5" fill="currentColor" opacity="0.3" />
      <Tote x={40} y={26} w={106} h={82} lidH={21} />
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
