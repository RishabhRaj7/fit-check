"use client";

import { useEffect, useRef } from "react";
import { ParticleField, resolveFontFamily } from "@/lib/particles";
import { cn } from "@/lib/format";

/**
 * A number printed in a few thousand points. When `text` changes the same
 * points re-form into the new value; `pulse` changes with the same text give
 * a soft ripple instead (e.g. a new brand that happens to agree).
 */
export default function ParticleReadout({
  text,
  pulse = 0,
  align = "left",
  className,
}: {
  text: string;
  pulse?: number;
  align?: "left" | "center" | "right";
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fieldRef = useRef<ParticleField | null>(null);
  const familyRef = useRef("");
  const shownRef = useRef<string | null>(null);
  const textRef = useRef(text);

  const spec = (t: string) => ({
    lines: [t],
    family: familyRef.current,
    weight: 600,
    stretch: "expanded" as const,
    fill: 0.98,
    fillHeight: 0.92,
    align,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let field: ParticleField;
    const narrow = window.innerWidth < 640;
    try {
      field = new ParticleField(canvas, {
        gap: narrow ? 3 : 4,
        dot: narrow ? 1.8 : 2.4,
        radius: narrow ? 50 : 90,
        accentShare: 0.045,
      });
    } catch {
      return;
    }
    fieldRef.current = field;
    const css = getComputedStyle(document.documentElement);
    field.setColors({
      ink: css.getPropertyValue("--color-bone").trim() || "#f5f5f0",
      accent: css.getPropertyValue("--color-frost").trim() || "#8cb8dd",
    });

    let cancelled = false;
    familyRef.current = resolveFontFamily("font-display");
    // Rasterise only once the display face has loaded, or the points would
    // trace the fallback font.
    const ready = document.fonts?.load
      ? document.fonts.load(`600 120px ${familyRef.current}`)
      : Promise.resolve();
    ready
      .catch(() => undefined)
      .then(() => {
        if (cancelled) return;
        field.resize();
        shownRef.current = textRef.current;
        field.setShape(spec(textRef.current), false);
      });

    const ro = new ResizeObserver(() => field.resize());
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => field.setVisible(e.isIntersecting));
    io.observe(canvas);

    return () => {
      cancelled = true;
      ro.disconnect();
      io.disconnect();
      field.destroy();
      fieldRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    textRef.current = text;
    const field = fieldRef.current;
    if (!field || !familyRef.current || shownRef.current === null) return;
    if (shownRef.current === text) {
      if (pulse) field.ripple();
      return;
    }
    shownRef.current = text;
    field.setShape(spec(text));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, pulse]);

  return (
    <div className={cn("relative", className)}>
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="absolute inset-0 h-full w-full cursor-crosshair touch-pan-y"
      />
      <span className="sr-only" aria-live="polite">
        {text}
      </span>
    </div>
  );
}
