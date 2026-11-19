// A row of the brand tote along the bottom of the hero, sitting on a green rule.
// Tote art is the brand master (viewBox 0 0 70 70), scaled in a repeating pattern.
export default function ToteDivider() {
  return (
    <div aria-hidden="true" className="border-b-4 border-crate bg-paper">
      <svg width="100%" height="36" className="block">
        <defs>
          <pattern id="tote-row" width="46" height="36" patternUnits="userSpaceOnUse">
            <g transform="translate(5 4.2) scale(0.6)">
              <path d="M9,28L61,28Q64,28 63.25,30.9L58.25,50.1Q57.5,53 54.5,53L15.5,53Q12.5,53 11.75,50.1L6.75,30.9Q6,28 9,28Z" fill="#14211C" />
              <path d="M17,33L53,33L51,46L19,46Z" fill="#1B2620" />
              <rect x="3" y="18" width="64" height="10" rx="3" fill="#F5A524" />
            </g>
          </pattern>
        </defs>
        <rect width="100%" height="36" fill="url(#tote-row)" />
      </svg>
    </div>
  );
}
