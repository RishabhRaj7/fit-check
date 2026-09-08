"use client";

import { motion } from "framer-motion";

const BONE = "#f5f5f0";

export const PPC = 16; // viewBox units per centimeter
export const ANCHOR_X = 100; // x of 0 cm (heel anchor)
export const TAPE_Y = 300; // tape axis

export const xOf = (cm: number) => ANCHOR_X + cm * PPC;

interface Tick {
  cm: number;
  x: number;
  major: boolean;
}

/**
 * The measuring tape itself: heel housing + tape body + cm ticks with
 * numeric labels. Slides in from the left on mount; a viewBox-aligned
 * cover rect (driven by the marker) retracts/extends the visible tape.
 */
export default function TapeMeasure({ maxCm }: { maxCm: number }) {
  const ticks: Tick[] = [];
  for (let cm = 0; cm <= maxCm + 1; cm += 0.5) {
    ticks.push({ cm, x: xOf(cm), major: Number.isInteger(cm) });
  }

  return (
    <>
      {/* sliding group: case + body + ticks */}
      <motion.g
        initial={{ x: -560 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.5, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* tape body */}
        <motion.rect
          x={ANCHOR_X}
          y={TAPE_Y - 13}
          height={26}
          width={xOf(maxCm + 1) - ANCHOR_X}
          fill={BONE}
          fillOpacity={0.07}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.3 }}
        />
        <line
          x1={ANCHOR_X}
          y1={TAPE_Y - 13}
          x2={xOf(maxCm + 1)}
          y2={TAPE_Y - 13}
          stroke={BONE}
          strokeOpacity={0.35}
        />
        <line
          x1={ANCHOR_X}
          y1={TAPE_Y + 13}
          x2={xOf(maxCm + 1)}
          y2={TAPE_Y + 13}
          stroke={BONE}
          strokeOpacity={0.35}
        />

        {/* ticks — stagger in along the tape */}
        {ticks.map((t) => (
          <motion.g
            key={t.cm}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55 + t.cm * 0.02, duration: 0.2 }}
          >
            <line
              x1={t.x}
              y1={TAPE_Y - 12}
              x2={t.x}
              y2={TAPE_Y - (t.major ? 3 : -2)}
              stroke={BONE}
              strokeOpacity={t.major ? 0.55 : 0.3}
              strokeWidth={t.major ? 1.2 : 1}
            />
            {t.major && (
              <text
                x={t.x - (t.cm >= 10 ? 0 : 0)}
                y={TAPE_Y + 9.5}
                fontSize={7.5}
                textAnchor="middle"
                letterSpacing={0.5}
                fill={BONE}
                fillOpacity={0.55}
              >
                {t.cm}
              </text>
            )}
          </motion.g>
        ))}
      </motion.g>

      {/* case housing at the heel — drawn after cover so it never clips */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.3 }}
      >
        <rect
          x={52}
          y={272}
          width={40}
          height={56}
          rx={7}
          fill="#0a0a0a"
          stroke={BONE}
          strokeOpacity={0.55}
          strokeWidth={1.5}
        />
        <circle
          cx={72}
          cy={300}
          r={10}
          fill="none"
          stroke={BONE}
          strokeOpacity={0.45}
          strokeWidth={1.5}
        />
        <circle cx={72} cy={300} r={2.5} fill={BONE} fillOpacity={0.5} />
        <rect x={90} y={290} width={5} height={20} fill={BONE} fillOpacity={0.25} />
      </motion.g>
    </>
  );
}
