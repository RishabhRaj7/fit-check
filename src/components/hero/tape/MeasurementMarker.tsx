"use client";

import { motion, type MotionValue } from "framer-motion";
import type { PointerEvent as ReactPointerEvent } from "react";
import { TAPE_Y } from "./TapeMeasure";

const FROST = "#8cb8dd";
const SIGNAL = "#2c5f87";
const BONE = "#f5f5f0";

/**
 * The draggable end of the tape — accent measurement line, metal tang,
 * chevron, live value tag, and a generously-sized invisible hit area.
 */
export default function MeasurementMarker({
  x,
  value,
  engaged,
  onDown,
  onMove,
  onUp,
}: {
  x: MotionValue<number>;
  value: string;
  engaged: boolean;
  onDown: (e: ReactPointerEvent<SVGRectElement>) => void;
  onMove: (e: ReactPointerEvent<SVGRectElement>) => void;
  onUp: (e: ReactPointerEvent<SVGRectElement>) => void;
}) {
  return (
    <motion.g style={{ x }} cursor={engaged ? "grabbing" : "grab"}>
      {/* active measurement line */}
      <line
        x1={0}
        y1={TAPE_Y - 40}
        x2={0}
        y2={TAPE_Y + 44}
        stroke={FROST}
        strokeWidth={1.25}
        strokeOpacity={0.9}
      />

      {/* value tag */}
      <rect
        x={-21}
        y={TAPE_Y - 66}
        width={42}
        height={17}
        fill={engaged ? SIGNAL : "#0a0a0a"}
        stroke={FROST}
        strokeOpacity={0.6}
      />
      <text
        x={0}
        y={TAPE_Y - 53.5}
        fontSize={9.5}
        textAnchor="middle"
        letterSpacing={1}
        fill={engaged ? BONE : FROST}
      >
        {value}
      </text>

      {/* chevron pointer */}
      <path
        d={`M -9 ${TAPE_Y - 32} L 0 ${TAPE_Y - 44} L 9 ${TAPE_Y - 32} Z`}
        fill={SIGNAL}
      />

      {/* end tang (the metal hook of a tape) */}
      <rect
        x={-6.5}
        y={TAPE_Y - 16}
        width={13}
        height={32}
        fill={SIGNAL}
        stroke={FROST}
        strokeOpacity={0.35}
      />
      <line x1={-2} y1={TAPE_Y - 12} x2={-2} y2={TAPE_Y + 12} stroke={BONE} strokeOpacity={0.4} />
      <line x1={2} y1={TAPE_Y - 12} x2={2} y2={TAPE_Y + 12} stroke={BONE} strokeOpacity={0.4} />

      {/* crosshair on axis */}
      <circle
        cx={0}
        cy={TAPE_Y}
        r={3}
        fill="#0a0a0a"
        stroke={BONE}
        strokeOpacity={0.7}
      />
      <line
        x1={-9}
        y1={TAPE_Y}
        x2={9}
        y2={TAPE_Y}
        stroke={BONE}
        strokeOpacity={0.5}
        strokeWidth={0.75}
      />

      {/* generous invisible hit target (~56 viewBox units ≈ finger-sized) */}
      <rect
        x={-28}
        y={TAPE_Y - 70}
        width={56}
        height={120}
        fill="transparent"
        style={{ touchAction: "none" }}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
      />
    </motion.g>
  );
}
