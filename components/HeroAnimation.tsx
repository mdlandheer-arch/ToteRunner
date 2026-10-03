import styles from "./HeroAnimation.module.css";

// Brand master tote (viewBox 0 0 70 70), drawn at 2x. Do not change the paths or colors.
function Tote() {
  return (
    <g transform="scale(2)">
      <path
        d="M9,28L61,28Q64,28 63.25,30.9L58.25,50.1Q57.5,53 54.5,53L15.5,53Q12.5,53 11.75,50.1L6.75,30.9Q6,28 9,28Z"
        fill="#14211C"
      />
      <path d="M17,33L53,33L51,46L19,46Z" fill="#1B2620" />
      <rect x="3" y="18" width="64" height="10" rx="3" fill="#F5A524" />
    </g>
  );
}

// Resting y-offset for each tote: bottom tote sits on the dolly platform (y=266),
// each one above sits on the lid below it (70 units per tote at 2x).
const TOTE_Y = [162, 92, 22];
const TOTE_CLASS = [styles.tote0, styles.tote1, styles.tote2];

type Props = { className?: string };

export default function HeroAnimation({ className }: Props) {
  return (
    <svg
      viewBox="0 0 360 320"
      className={`${styles.svg} ${className ?? ""}`}
      role="img"
      aria-label="A dolly rolls in and three black totes with yellow lids stack onto it"
    >
      <line x1="0" y1="301" x2="360" y2="301" stroke="#14211C" strokeWidth="2" opacity="0.18" />

      {/* 4-wheel dolly: low flat platform on casters, no handle */}
      <g className={styles.dolly}>
        <rect x="114" y="266" width="132" height="12" rx="3" fill="#14211C" />
        <rect x="126" y="278" width="12" height="6" fill="#14211C" />
        <rect x="222" y="278" width="12" height="6" fill="#14211C" />
        <g className={styles.wheel}>
          <circle cx="132" cy="290" r="10" fill="#14211C" />
          <circle cx="132" cy="284" r="2.2" fill="#F7F4ED" />
        </g>
        <g className={styles.wheel}>
          <circle cx="228" cy="290" r="10" fill="#14211C" />
          <circle cx="228" cy="284" r="2.2" fill="#F7F4ED" />
        </g>
      </g>

      {TOTE_Y.map((y, i) => (
        <g key={i} transform={`translate(110 ${y})`}>
          <g className={`${styles.tote} ${TOTE_CLASS[i]}`}>
            <Tote />
          </g>
        </g>
      ))}
    </svg>
  );
}
