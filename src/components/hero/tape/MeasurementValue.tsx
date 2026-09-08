"use client";

import { AnimatePresence, motion, type MotionValue } from "framer-motion";
import MatchFound, { type MatchKind } from "./MatchFound";

/**
 * Oversized reference number + live verdict line + match status.
 * The number partially crops behind the SVG foot layer.
 */
export default function MeasurementValue({
  display,
  anchorLabel,
  verdict,
  kind,
  pulse,
  converting,
  yShift,
}: {
  display: number;
  anchorLabel: string;
  verdict: string | null;
  kind: MatchKind;
  pulse: number;
  converting: boolean;
  yShift?: MotionValue<number>;
}) {
  return (
    <motion.div
      style={{ y: yShift }}
      className="pointer-events-none absolute top-10 right-36 z-0 text-right md:top-14 md:right-0"
    >
      <p className="font-mono text-[9px] tracking-[0.3em] text-fog">
        {anchorLabel} — REFERENCE · DRAG TO RE-MEASURE
      </p>
      <p className="font-display text-[clamp(4.5rem,11vw,10rem)] leading-[0.9] tracking-tight text-bone tabular-nums">
        {display.toFixed(1)}
        <span className="ml-2 text-[0.32em] text-frost">CM</span>
      </p>

      <div className="mt-3 min-h-10">
        <AnimatePresence mode="wait">
          {verdict && (
            <motion.p
              key={verdict}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="font-display text-2xl tracking-wide text-bone uppercase md:text-3xl"
            >
              {verdict}
            </motion.p>
          )}
        </AnimatePresence>
        {converting && (
          <p className="font-mono text-[9px] tracking-[0.3em] text-fog">
            CONVERTING…
          </p>
        )}
        <MatchFound kind={kind} pulse={pulse} />
      </div>
    </motion.div>
  );
}
