"use client";

import { motion } from "framer-motion";

export type MatchKind = "exact" | "nearest" | "estimate" | null;

const LABELS: Record<Exclude<MatchKind, null>, string> = {
  exact: "MATCH FOUND",
  nearest: "CLOSEST MATCH",
  estimate: "ESTIMATE — NO CHART",
};

export default function MatchFound({
  kind,
  pulse,
}: {
  kind: MatchKind;
  pulse: number;
}) {
  if (!kind) return null;
  return (
    <motion.div
      key={`${pulse}-${kind}`}
      initial={{ opacity: 0, scale: 0.72 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 380, damping: 20 }}
      className="mt-2 flex items-center justify-end gap-2"
    >
      <span
        className={
          kind === "exact"
            ? "inline-block h-2 w-2 bg-signal"
            : kind === "nearest"
              ? "inline-block h-2 w-2 border border-frost"
              : "inline-block h-2 w-2 border border-dashed border-frost/70"
        }
      />
      <span className="font-mono text-[10px] tracking-[0.28em] text-frost">
        {LABELS[kind]}
      </span>
    </motion.div>
  );
}
