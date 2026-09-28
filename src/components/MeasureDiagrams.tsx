const BONE = "var(--color-bone)";
const SIGNAL = "var(--color-frost)";
const MONO = "var(--font-plex-mono)";

function Dim({ x1, x2, y, label }: { x1: number; x2: number; y: number; label: string }) {
  return (
    <g>
      <line x1={x1} y1={y} x2={x2} y2={y} stroke={SIGNAL} strokeWidth="1" />
      <line x1={x1} y1={y - 6} x2={x1} y2={y + 6} stroke={SIGNAL} />
      <line x1={x2} y1={y - 6} x2={x2} y2={y + 6} stroke={SIGNAL} />
      <path d={`M ${x1 + 7} ${y - 3.5} L ${x1} ${y} L ${x1 + 7} ${y + 3.5}`} fill="none" stroke={SIGNAL} />
      <path d={`M ${x2 - 7} ${y - 3.5} L ${x2} ${y} L ${x2 - 7} ${y + 3.5}`} fill="none" stroke={SIGNAL} />
      <text x={(x1 + x2) / 2} y={y - 8} textAnchor="middle" fontSize="9" letterSpacing="1.5" fontFamily={MONO} fill={SIGNAL}>
        {label}
      </text>
    </g>
  );
}

/** Top-down: heel against a wall, paper under the foot, wall-to-toe dimension. */
export function FootDiagram() {
  return (
    <svg viewBox="0 0 320 200" className="h-auto w-full" role="img" aria-label="A foot on paper with the heel against a wall; the measurement runs from the wall to the tip of the longest toe.">
      {/* wall */}
      <rect x="20" y="30" width="12" height="150" fill="none" stroke={BONE} strokeOpacity="0.5" />
      {Array.from({ length: 13 }).map((_, i) => (
        <line key={i} x1="20" y1={36 + i * 11} x2="32" y2={30 + i * 11} stroke={BONE} strokeOpacity="0.3" />
      ))}
      <text x="26" y="24" textAnchor="middle" fontSize="8" letterSpacing="1.5" fontFamily={MONO} fill={BONE} fillOpacity="0.5">
        WALL
      </text>
      {/* paper */}
      <rect x="32" y="44" width="272" height="112" fill="none" stroke={BONE} strokeOpacity="0.25" strokeDasharray="3 4" />
      {/* foot */}
      <path
        d="M 33 100 C 33 80, 48 71, 72 71 C 108 71, 138 79, 174 71 C 212 62, 250 58, 272 66 C 290 74, 292 94, 283 108 C 272 124, 236 132, 198 130 C 158 128, 128 124, 98 128 C 66 132, 33 124, 33 100 Z"
        fill="none"
        stroke={BONE}
        strokeWidth="1.5"
      />
      {[
        [276, 82, 9],
        [262, 108, 6],
        [247, 119, 5.5],
        [231, 125, 5],
        [216, 128, 4.5],
      ].map(([cx, cy, r], i) => (
        <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={BONE} strokeOpacity="0.45" />
      ))}
      {/* toe mark */}
      <line x1="289" y1="48" x2="289" y2="176" stroke={SIGNAL} strokeDasharray="2 3" />
      <Dim x1={32} x2={289} y={176} label="FOOT LENGTH" />
    </svg>
  );
}

const TORSO = [
  "M 86 14 C 86 28, 70 33, 44 39 C 32 42, 25 50, 26 62 C 27 74, 34 85, 44 95",
  "C 44 118, 50 136, 54 150 C 56 170, 48 192, 46 212",
  "M 154 212 C 152 192, 144 170, 146 150 C 150 136, 156 118, 156 95",
  "C 166 85, 173 74, 174 62 C 175 50, 168 42, 156 39 C 130 33, 114 28, 114 14",
].join(" ");

/** Front view with a level tape band at chest or waist height. */
export function TorsoDiagram({ band }: { band: "chest" | "waist" }) {
  const y = band === "chest" ? 104 : 150;
  const rx = band === "chest" ? 57 : 47;
  return (
    <svg viewBox="0 0 200 220" className="h-auto w-full" role="img" aria-label={band === "chest" ? "A level tape around the fullest part of the chest, under the arms." : "A tape around the natural waist, where trousers sit."}>
      <path d={TORSO} fill="none" stroke={BONE} strokeWidth="1.5" />
      {/* the other band, for reference */}
      <ellipse
        cx="100"
        cy={band === "chest" ? 150 : 104}
        rx={band === "chest" ? 47 : 57}
        ry="7"
        fill="none"
        stroke={BONE}
        strokeOpacity="0.15"
        strokeDasharray="2 4"
      />
      {/* tape: back half dashed, front half solid */}
      <path d={`M ${100 - rx} ${y} A ${rx} 8 0 0 1 ${100 + rx} ${y}`} fill="none" stroke={SIGNAL} strokeOpacity="0.5" strokeDasharray="3 3" />
      <path d={`M ${100 - rx} ${y} A ${rx} 8 0 0 0 ${100 + rx} ${y}`} fill="none" stroke={SIGNAL} strokeWidth="2" />
      <text x="100" y={y + 26} textAnchor="middle" fontSize="9" letterSpacing="1.5" fontFamily={MONO} fill={SIGNAL}>
        {band === "chest" ? "CHEST" : "WAIST"}
      </text>
    </svg>
  );
}
