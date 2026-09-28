"use client";

import { useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { cn } from "@/lib/format";

/**
 * A measuring scale you drag like the end of a tape. Snaps to `step`,
 * works with arrow keys (Shift = ×5), Home/End and Page keys.
 */
export default function Ruler({
  min,
  max,
  step,
  value,
  onChange,
  onCommit,
  label,
  unit = "cm",
  labelEvery,
  className,
}: {
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (v: number) => void;
  /** Fires when a drag ends or a key changes the value. */
  onCommit?: (v: number) => void;
  label: string;
  unit?: string;
  /** Numeric labels every N units (defaults: 1 for small ranges, 10 for large). */
  labelEvery?: number;
  className?: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const span = max - min;
  const every = labelEvery ?? (span <= 12 ? 1 : 10);
  const tickStep = span <= 12 ? step : every / 5;

  const clamp = (v: number) => Math.min(max, Math.max(min, v));
  const snap = (v: number) => clamp(Math.round((v - min) / step) * step + min);
  const pct = ((clamp(value) - min) / span) * 100;

  const fromPointer = (clientX: number) => {
    const r = trackRef.current?.getBoundingClientRect();
    if (!r) return value;
    return snap(min + ((clientX - r.left) / r.width) * span);
  };

  const onDown = (e: PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(true);
    onChange(fromPointer(e.clientX));
  };
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    const v = fromPointer(e.clientX);
    if (v !== value) onChange(v);
  };
  const onUp = (e: PointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    setDragging(false);
    onCommit?.(fromPointer(e.clientX));
  };

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const big = e.shiftKey ? 5 : 1;
    const map: Record<string, number> = {
      ArrowRight: value + step * big,
      ArrowUp: value + step * big,
      ArrowLeft: value - step * big,
      ArrowDown: value - step * big,
      PageUp: value + step * 5,
      PageDown: value - step * 5,
      Home: min,
      End: max,
    };
    if (!(e.key in map)) return;
    e.preventDefault();
    const v = snap(map[e.key]);
    onChange(v);
    onCommit?.(v);
  };

  const ticks: { v: number; major: boolean }[] = [];
  const count = Math.round(span / tickStep);
  for (let i = 0; i <= count; i++) {
    const v = Math.round((min + i * tickStep) * 100) / 100;
    ticks.push({ v, major: Math.abs(v / every - Math.round(v / every)) < 1e-6 });
  }

  return (
    <div className={cn("select-none", className)}>
      <div
        ref={trackRef}
        role="slider"
        tabIndex={0}
        aria-label={label}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-valuetext={`${value} ${unit}`}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        onKeyDown={onKey}
        className={cn(
          "group relative h-16 touch-none outline-none",
          dragging ? "cursor-grabbing" : "cursor-grab"
        )}
      >
        {/* baseline */}
        <div className="absolute inset-x-0 top-7 h-px bg-bone/25" />
        {/* measured span */}
        <div
          className="absolute top-7 left-0 h-px bg-signal transition-[width] duration-150 ease-out"
          style={{ width: `${pct}%` }}
        />
        {/* ticks */}
        {ticks.map((t) => {
          const left = ((t.v - min) / span) * 100;
          return (
            <div key={t.v} className="absolute top-7" style={{ left: `${left}%` }}>
              <div className={cn("w-px bg-bone", t.major ? "h-3 opacity-50" : "h-1.5 opacity-25")} />
              {t.major && (
                <span className="absolute top-4 -translate-x-1/2 font-mono text-[10px] text-fog tabular">
                  {t.v}
                </span>
              )}
            </div>
          );
        })}
        {/* caret */}
        <div
          className="absolute top-0 bottom-3 transition-[left] duration-150 ease-out"
          style={{ left: `${pct}%` }}
        >
          <div className="absolute top-0 bottom-0 w-px bg-signal" />
          <div
            className={cn(
              "absolute top-[22px] h-3 w-3 -translate-x-1/2 border border-signal bg-ink transition-transform",
              dragging ? "scale-125 bg-signal" : "group-focus-visible:bg-signal"
            )}
          />
        </div>
      </div>
    </div>
  );
}
