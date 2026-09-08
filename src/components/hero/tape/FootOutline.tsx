"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const BONE = "#f5f5f0";
const FROST = "#8cb8dd";

/**
 * Minimalist top-down insole silhouette — rounded heel, midfoot waist,
 * forefoot flare with big-toe bulge, rounded toe cap. No self-intersection;
 * reads as a foot, not a figure. Draws itself in ~0.6s after mount.
 */
export default function FootOutline({ scale }: { scale?: any }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  return (
    <motion.g style={{ scale, transformOrigin: "320px 300px" }}>
      {/* insole outline */}
      <motion.path
        d="M 86 305
           C 84 262, 96 240, 122 232
           C 160 220, 210 236, 252 244
           C 300 252, 350 224, 414 210
           C 448 202, 480 206, 502 220
           C 534 238, 556 256, 556 284
           C 556 314, 544 330, 522 344
           C 492 362, 460 380, 424 386
           C 372 394, 330 372, 292 366
           C 246 360, 200 380, 158 376
           C 118 372, 88 348, 86 305 Z"
        fill="none"
        stroke={BONE}
        strokeOpacity={0.85}
        strokeWidth={2.4}
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: mounted ? 1 : 0, opacity: mounted ? 1 : 0 }}
        transition={{ duration: 0.6, delay: 0.12, ease: [0.4, 0, 0.2, 1] }}
      />

      {/* inner marks fade in after the draw */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: mounted ? 1 : 0 }}
        transition={{ duration: 0.4, delay: 0.78 }}
      >
        {/* inner arch line — quiet footprint character */}
        <path
          d="M 150 342 C 230 322, 300 328, 386 352"
          fill="none"
          stroke={BONE}
          strokeOpacity={0.22}
          strokeWidth={1}
          strokeDasharray="2 5"
        />

        {/* ball width bracket */}
        <line
          x1={430}
          y1={204}
          x2={430}
          y2={390}
          stroke={BONE}
          strokeOpacity={0.28}
          strokeWidth={1}
          strokeDasharray="2 5"
        />
        <line x1={422} y1={204} x2={438} y2={204} stroke={BONE} strokeOpacity={0.4} />
        <line x1={422} y1={390} x2={438} y2={390} stroke={BONE} strokeOpacity={0.4} />
        <text
          x={444}
          y={208}
          fontSize={7.5}
          letterSpacing={2}
          fill={BONE}
          fillOpacity={0.35}
        >
          BALL
        </text>

        {/* toe-cap crosshair */}
        <circle cx={540} cy={284} r={9} fill="none" stroke={FROST} strokeOpacity={0.5} strokeWidth={1} />
        <line x1={540} y1={270} x2={540} y2={298} stroke={FROST} strokeOpacity={0.5} />
        <line x1={526} y1={284} x2={554} y2={284} stroke={FROST} strokeOpacity={0.5} />
      </motion.g>

      {/* dimension line under the foot: heel -> toe */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: mounted ? 1 : 0 }}
        transition={{ duration: 0.5, delay: 1.0 }}
      >
        <line
          x1={86}
          y1={436}
          x2={556}
          y2={436}
          stroke={BONE}
          strokeOpacity={0.3}
          strokeWidth={1}
          strokeDasharray="3 6"
        />
        <line x1={86} y1={428} x2={86} y2={444} stroke={BONE} strokeOpacity={0.4} />
        <line x1={556} y1={428} x2={556} y2={444} stroke={BONE} strokeOpacity={0.4} />
        <path d="M 96 432 L 86 436 L 96 440" fill="none" stroke={BONE} strokeOpacity={0.4} />
        <path d="M 546 432 L 556 436 L 546 440" fill="none" stroke={BONE} strokeOpacity={0.4} />
        <text
          x={321}
          y={452}
          fontSize={7.5}
          letterSpacing={3}
          textAnchor="middle"
          fill={BONE}
          fillOpacity={0.35}
        >
          AXIS — HEEL → TOE
        </text>

        <text x={84} y={474} fontSize={8} letterSpacing={3} fill={BONE} fillOpacity={0.45}>
          FIG. 01 — TOP-DOWN INSOLE
        </text>
        <text x={84} y={490} fontSize={8} letterSpacing={3} fill={BONE} fillOpacity={0.3}>
          SCALE 1:1 · 16 UNITS / CM
        </text>
        <text x={84} y={214} fontSize={8} letterSpacing={3} fill={FROST} fillOpacity={0.55}>
          FOOT LENGTH
        </text>
      </motion.g>
    </motion.g>
  );
}
