import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <section className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <p className="font-mono text-[10px] tracking-[0.3em] text-fog">
        OUT OF RANGE — LIKE A UK 17
      </p>
      <h1 className="mt-4 font-display text-[clamp(5rem,20vw,14rem)] leading-[0.85] tracking-tight">
        <span className="text-stroke">4</span>
        <span className="text-bone">0</span>
        <span className="text-stroke-signal">4</span>
      </h1>
      <p className="mt-4 max-w-sm text-sm leading-relaxed text-fog">
        This page doesn&apos;t exist in any sizing system we know of.
      </p>
      <Link
        href="/"
        className="mt-8 flex items-center gap-2 bg-signal px-6 py-3.5 font-mono text-[11px] font-semibold tracking-[0.2em] text-bone uppercase transition-colors hover:bg-bone hover:text-ink"
      >
        <ArrowLeft size={13} strokeWidth={2.4} /> Back to base
      </Link>
    </section>
  );
}
