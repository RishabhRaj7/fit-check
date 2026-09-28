"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

const EASE = [0.16, 1, 0.3, 1] as const;

/** Quiet entrance on scroll — a short rise, once. */
export function FadeUp({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/** A line of display type wiped in from the left — pure CSS, runs on first paint. */
export function LineReveal({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  return (
    <span className="wipe-in block" style={{ animationDelay: `${delay}s` }}>
      {children}
    </span>
  );
}

/** Above-the-fold entrance — pure CSS, runs on first paint. */
export function Rise({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <div className={`rise-in ${className ?? ""}`} style={{ animationDelay: `${delay}s` }}>
      {children}
    </div>
  );
}
