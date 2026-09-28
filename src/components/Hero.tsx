"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { animate, motion, useMotionValue, useMotionValueEvent, useSpring } from "framer-motion";
import ParticleReadout from "@/components/ParticleReadout";
import FootOutline from "@/components/hero/tape/FootOutline";
import TapeMeasure, { ANCHOR_X, PPC, xOf } from "@/components/hero/tape/TapeMeasure";
import MeasurementMarker from "@/components/hero/tape/MeasurementMarker";
import {
  CATEGORIES,
  GENDERS,
  formatCm,
  regionValue,
  rowPrimaryLabel,
  type ShopperGender,
} from "@/lib/categories";
import { cn } from "@/lib/format";
import { convert, type CategoryCharts, type LiteBrand } from "@/lib/sizing";

export type HeroLine = "sneakers" | "running";

export interface HeroLineData {
  /** Brands on the selector (those with charts in this line). */
  featured: LiteBrand[];
  /** Every brand in the line — needed for estimates. */
  brands: LiteBrand[];
  charts: CategoryCharts;
}
const MIN = 23;
const MAX = 31;
const SNAP = 0.5;
const INITIAL = 26.5;
const DWELL_MS = 2800;
const INK = "#0a0a0a";

const clamp = (v: number) => Math.min(MAX, Math.max(MIN, v));
const snap = (v: number) => clamp(Math.round(v / SNAP) * SNAP);

/**
 * The hero instrument: pull the tape along the foot; the size re-forms in
 * particles above it, brand after brand. Auto-advances until you touch it.
 */
export default function Hero({ lines }: { lines: Partial<Record<HeroLine, HeroLineData>> }) {
  const available = (["sneakers", "running"] as HeroLine[]).filter((l) => lines[l]?.featured.length);
  const [line, setLine] = useState<HeroLine>(available[0] ?? "sneakers");
  const { featured = [], brands = [], charts = {} } = lines[line] ?? {};
  const CAT = CATEGORIES[line];
  const svgRef = useRef<SVGSVGElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const markerX = useMotionValue(xOf(MIN));
  const smooth = useSpring(markerX, { stiffness: 420, damping: 38, mass: 0.5 });
  const [displayV, setDisplayV] = useState(MIN);
  const [engaged, setEngaged] = useState(false);

  const [cm, setCm] = useState(INITIAL);
  const [gender, setGender] = useState<ShopperGender>("men");
  const [idx, setIdx] = useState(0);
  const [auto, setAuto] = useState(true);
  const [pulse, setPulse] = useState(0);
  const [onScreen, setOnScreen] = useState(true);

  useMotionValueEvent(smooth, "change", (x) => {
    setDisplayV(Math.round(clamp((x - ANCHOR_X) / PPC) * 10) / 10);
  });

  const brand = featured[idx % Math.max(1, featured.length)];
  const match = useMemo(
    () => (brand ? convert(charts, brands, line, brand.slug, gender, cm) : null),
    [charts, brands, brand, gender, cm, line]
  );
  const primary = match?.row ? rowPrimaryLabel(line, match.row) : "—";

  // Intro: the tape runs out to the reference foot length.
  useEffect(() => {
    const t = window.setTimeout(() => {
      animate(markerX, xOf(INITIAL), { duration: 0.6, ease: [0.22, 1, 0.36, 1] });
    }, 850);
    return () => window.clearTimeout(t);
  }, [markerX]);

  // Pause the brand tour off-screen and in background tabs.
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setOnScreen(e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!auto || !onScreen || featured.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = window.setInterval(() => {
      if (document.hidden) return;
      setIdx((i) => (i + 1) % featured.length);
      setPulse((p) => p + 1);
    }, DWELL_MS);
    return () => window.clearInterval(t);
  }, [auto, onScreen, featured.length]);

  const take = () => setAuto(false);

  /* ---------------------------------------------------------- tape drag */
  const cmAt = (clientX: number): number => {
    const svg = svgRef.current;
    const ctm = svg?.getScreenCTM();
    if (!svg || !ctm) return cm;
    const pt = svg.createSVGPoint();
    pt.x = clientX;
    pt.y = 0;
    return (pt.matrixTransform(ctm.inverse()).x - ANCHOR_X) / PPC;
  };

  /** Rubber-band resistance past the ends of the range. */
  const resist = (v: number) =>
    v < MIN ? MIN - (MIN - v) * 0.4 : v > MAX ? MAX + (v - MAX) * 0.4 : v;

  const follow = (clientX: number) => {
    const v = cmAt(clientX);
    markerX.set(Math.min(xOf(MAX) + 12, Math.max(xOf(MIN) - 8, xOf(resist(v)))));
    setCm(snap(v));
  };

  const onDown = (e: ReactPointerEvent<SVGRectElement>) => {
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    dragging.current = true;
    setEngaged(true);
    take();
    markerX.stop();
    follow(e.clientX);
  };
  const onMove = (e: ReactPointerEvent<SVGRectElement>) => {
    if (dragging.current) follow(e.clientX);
  };
  const onUp = (e: ReactPointerEvent<SVGRectElement>) => {
    if (!dragging.current) return;
    dragging.current = false;
    setEngaged(false);
    const v = snap(cmAt(e.clientX));
    setCm(v);
    animate(markerX, xOf(v), { type: "spring", stiffness: 420, damping: 32 });
  };
  const onKey = (e: KeyboardEvent<SVGRectElement>) => {
    const step = e.shiftKey ? 2.5 : SNAP;
    const next =
      e.key === "ArrowRight" || e.key === "ArrowUp"
        ? cm + step
        : e.key === "ArrowLeft" || e.key === "ArrowDown"
          ? cm - step
          : e.key === "Home"
            ? MIN
            : e.key === "End"
              ? MAX
              : null;
    if (next === null) return;
    e.preventDefault();
    take();
    const v = snap(next);
    setCm(v);
    animate(markerX, xOf(v), { type: "spring", stiffness: 420, damping: 32 });
  };

  if (!brand || !match) return null;

  const status =
    match.status === "exact"
      ? "Exact row"
      : match.status === "nearest"
        ? `Nearest · ±${match.distance} cm`
        : match.status === "estimate"
          ? "Estimate"
          : "No data";

  return (
    <div ref={rootRef} className="border border-bone/12 bg-ink">
      {/* header */}
      <div className="flex items-center justify-between gap-3 border-b border-bone/12 px-4 py-2.5 md:px-6">
        <div className="flex items-center gap-3">
          {available.length > 1 ? (
            <div className="flex border border-bone/15" role="group" aria-label="Shoe type">
              {available.map((l) => (
                <button
                  key={l}
                  aria-pressed={line === l}
                  onClick={() => {
                    take();
                    setLine(l);
                    const keep = lines[l]!.featured.findIndex((b) => b.slug === brand.slug);
                    setIdx(keep >= 0 ? keep : 0);
                    setPulse((p) => p + 1);
                  }}
                  className={cn(
                    "kicker px-2.5 py-1 transition-colors",
                    line === l ? "bg-frost text-ink" : "text-fog hover:text-bone"
                  )}
                >
                  {l === "sneakers" ? "Lifestyle" : "Running"}
                </button>
              ))}
            </div>
          ) : null}
          <span className="kicker text-fog">
            <span className="text-bone">{brand.name}</span>
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="kicker hidden items-center gap-2 text-frost sm:flex">
            <span
              className={cn(
                "inline-block h-1.5 w-1.5",
                match.status === "exact" ? "bg-frost" : "border border-frost"
              )}
            />
            {status}
          </span>
          <div className="flex border border-bone/15" role="group" aria-label="Chart">
            {GENDERS.map((g) => (
              <button
                key={g.id}
                aria-pressed={gender === g.id}
                onClick={() => {
                  take();
                  setGender(g.id);
                }}
                className={cn(
                  "kicker px-2.5 py-1 transition-colors",
                  gender === g.id ? "bg-bone text-ink" : "text-fog hover:text-bone"
                )}
              >
                {g.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* size in particles, tape below */}
      <div className="px-4 pt-4 md:px-6">
        <ParticleReadout text={primary} pulse={pulse} className="h-[84px] sm:h-[112px] lg:h-[124px]" />
        <svg
          ref={svgRef}
          viewBox="40 196 580 262"
          preserveAspectRatio="xMidYMid meet"
          className="mt-1 h-[170px] w-full touch-pan-y select-none sm:h-[220px] lg:h-[232px]"
        >
          <TapeMeasure maxCm={MAX} />
          {/* covers the retracted tail of the tape beyond the tang */}
          <motion.g style={{ x: smooth }}>
            <rect x={7} y={240} width={640} height={140} fill={INK} />
          </motion.g>
          <FootOutline />
          <MeasurementMarker
            x={smooth}
            value={displayV.toFixed(1)}
            engaged={engaged}
            onDown={onDown}
            onMove={onMove}
            onUp={onUp}
            onKeyDown={onKey}
            valueNow={cm}
            min={MIN}
            max={MAX}
          />
        </svg>
      </div>

      {/* numbers */}
      <dl className="grid grid-cols-4 border-t border-bone/12">
        {[
          { label: "Foot · cm", value: formatCm(displayV) },
          ...CAT.regions
            .filter((r) => !r.primary)
            .map((r) => ({ label: r.label, value: match.row ? regionValue(match.row, r.key) : "—" })),
        ].map((o, i) => (
          <div key={o.label} className={cn("px-4 py-2.5 md:px-6", i > 0 && "border-l border-bone/12")}>
            <dt className="kicker text-fog">{o.label}</dt>
            <dd className={cn("mt-0.5 font-display text-lg font-light tabular md:text-xl", i === 0 ? "text-frost" : "text-bone")}>
              {o.value}
            </dd>
          </div>
        ))}
      </dl>

      {/* brand selector */}
      <div role="tablist" aria-label="Brand" className="scroll-thin flex overflow-x-auto border-t border-bone/12">
        {featured.map((b, i) => {
          const active = i === idx;
          return (
            <button
              key={b.slug}
              role="tab"
              aria-selected={active}
              onClick={() => {
                take();
                setIdx(i);
                setPulse((p) => p + 1);
              }}
              className={cn(
                "kicker relative min-w-max flex-1 px-4 py-3 text-left transition-colors",
                i > 0 && "border-l border-bone/12",
                active ? "bg-graphite text-bone" : "text-fog hover:text-bone"
              )}
            >
              {b.name}
              {active && (
                <span
                  key={`${idx}-${auto}`}
                  className={cn(
                    "absolute bottom-0 left-0 h-px bg-frost",
                    auto ? "animate-[fc-dwell_linear_forwards]" : "w-full"
                  )}
                  style={auto ? { animationDuration: `${DWELL_MS}ms` } : undefined}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
