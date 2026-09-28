"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

/** Framer honours the OS "reduce motion" setting everywhere. */
export default function Providers({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
