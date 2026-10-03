// ToteRunner logo mark. Uses the approved master tote (BRAND-GUIDELINES.md):
// ink body #14211C, shade #1B2620, yellow lid #F5A524, spec viewBox "0 0 70 70".
// Two stacked totes plus three motion lines (the lines belong to the full logo only).
//
// Inline SVG so it stays crisp at any size. Pass `dark` on dark backgrounds to add a
// faint light edge so the ink bodies stay visible.

const BODY = "#14211C";
const SHADE = "#1B2620";
const LID = "#F5A524";

const BODY_PATH =
  "M9,28L61,28Q64,28 63.25,30.9L58.25,50.1Q57.5,53 54.5,53L15.5,53Q12.5,53 11.75,50.1L6.75,30.9Q6,28 9,28Z";

function Tote({ y, outline }: { y: number; outline?: string }) {
  // Spec coordinates: lid x3..67 / y18..28, body to y53. Shift so lid-left = 0.
  return (
    <g transform={`translate(-3 ${y - 18})`}>
      <path d={BODY_PATH} fill={BODY} stroke={outline} strokeWidth={outline ? 1.1 : 0} strokeLinejoin="round" />
      <path d="M17,33L53,33L51,46L19,46Z" fill={SHADE} />
      <rect x="3" y="18" width="64" height="10" rx="3" fill={LID} />
    </g>
  );
}

export function LogoMark({ className, dark }: { className?: string; dark?: boolean }) {
  const outline = dark ? "rgba(247,244,237,0.55)" : undefined;
  return (
    <svg viewBox="-26 -1 91 73.5" className={className} role="img" aria-label="ToteRunner">
      {/* Motion lines: brightest at the seam between the two totes */}
      <rect x="-21.8" y="18.1" width="13.1" height="3.2" rx="1.6" fill="currentColor" opacity="0.45" />
      <rect x="-24.3" y="32.8" width="18.1" height="3.2" rx="1.6" fill="currentColor" opacity="0.85" />
      <rect x="-19.3" y="47" width="10.6" height="3.2" rx="1.6" fill="currentColor" opacity="0.45" />
      <Tote y={18} outline={outline} />
      <Tote y={54.5} outline={outline} />
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
