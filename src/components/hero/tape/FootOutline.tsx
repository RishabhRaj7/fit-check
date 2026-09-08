"use client";

import { motion } from "framer-motion";

const BONE = "#f5f5f0";
const FROST = "#8cb8dd";

/**
 * Minimalist top-down insole silhouette (reference foot ≈ 26 cm),
 * plus technical-drawing marks: heel→toe axis, ball-width bracket,
 * toe-cap crosshair. Draws itself in ~0.6s on mount.
 */
export default function FootOutline({ scale }: { scale?: any }) {
  return (
    <motion.g style={{ scale, transformOrigin: "330px 315px" }}>
      {/* insole outline */}
      <motion.path
        d="M 118 236
           C 92 258, 78 292, 84 328
           C 90 372, 112 408, 152 420
           C 200 434, 248 424, 282 392
           C 306 370, 314 344, 306 316
           C 298 282, 306 250, 336 230
           C 376 202, 430 192, 470 206
           C 504 218, 524 252, 516 292
           C 510 326, 486 350, 448 358
           C 396 370, 338 366, 292 344
           C 252 326, 222 300, 196 268
           C 176 244, 150 236, 130 232
           C 124 231, 120 233, 118 236 Z"
        fill="none"
        stroke={BONE}
        strokeOpacity={0.85}
        strokeWidth={2.4}
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.1, ease: [0.4, 0, 0.2, 1] }}
      />

      {/* inner marks fade in after draw */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.75 }}
      >
        {/* heel→toe axis */}
        <line
          x1={76}
          y1={352}
          x2={556}
          y2={352}
          stroke={BONE}
          strokeOpacity={0.3}
          strokeWidth={1}
          strokeDasharray="3 6"
        />
        <path d="M 556 348 L 566 352 L 556 356 Z" fill={BONE} fillOpacity={0.4} />
        <text
          x={76}
          y={344}
          fontSize={7.5}
          letterSpacing={2}
          fill={BONE}
          fillOpacity={0.35}
        >
          AXIS — HEEL → TOE
        </text>

        {/* ball width bracket */}
        <line
          x1={432}
          y1={206}
          x2={432}
          y2={368}
          stroke={BONE}
          strokeOpacity={0.28}
          strokeWidth={1}
          strokeDasharray="2 5"
        />
        <line x1={424} y1={206} x2={440} y2={206} stroke={BONE} strokeOpacity={0.4} />
        <line x1={424} y1={368} x2={440} y2={368} stroke={BONE} strokeOpacity={0.4} />
        <text
          x={446}
          y={210}
          fontSize={7.5}
          letterSpacing={2}
          fill={BONE}
          fillOpacity={0.35}
        >
          BALL
        </text>

        {/* toe-cap crosshair */}
        <circle cx={510} cy={258} r={9} fill="none" stroke={FROST} strokeOpacity={0.5} strokeWidth={1} />
        <line x1={510} y1={244} x2={510} y2={272} stroke={FROST} strokeOpacity={0.5} />
        <line x1={496} y1={258} x2={524} y2={258} stroke={FROST} strokeOpacity={0.5} />
      </motion.g>

      {/* figure annotations */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1.0 }}
      >
        <text
          x={84}
          y={470}
          fontSize={8}
          letterSpacing={3}
          fill={BONE}
          fillOpacity={0.45}
        >
          FIG. 01 — TOP-DOWN INSOLE
        </text>
        <text
          x={84}
          y={486}
          fontSize={8}
          letterSpacing={3}
          fill={BONE}
          fillOpacity={0.3}
        >
          SCALE 1:1 · 16 UNITS / CM
        </text>
        <text
          x={84}
          y={214}
          fontSize={8}
          letterSpacing={3}
          fill={FROST}
          fillOpacity={0.55}
        >
          FOOT LENGTH
        </text>
      </motion.g>
    </motion.g>
  );
}
