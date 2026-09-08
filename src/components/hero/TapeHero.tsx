"use client";

import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import {
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useSpring,
  useTransform,
} from "framer-motion";
import { rowPrimaryLabel, type AnyRow, type CategoryId } from "@/lib/categories";
import FootOutline from "@/components/hero/tape/FootOutline";
import TapeMeasure, { ANCHOR_X, PPC, xOf } from "@/components/hero/tape/TapeMeasure";
import MeasurementMarker from "@/components/hero/tape/MeasurementMarker";
import MeasurementValue from "@/components/hero/tape/MeasurementValue";
import BrandSelector, { type HeroBrand } from "@/components/hero/tape/BrandSelector";
import type { MatchKind } from "@/components/hero/tape/MatchFound";

/** Reusable measurement config — apparel variants plug in here later. */
export interface MeasureConfig {
  category: CategoryId;
  anchorLabel: string;
  min: number;
  max: number;
  initial: number;
  snap: number;
}

const FOOT_CONFIG: MeasureConfig = {
  category: "sneakers",
  anchorLabel: "FOOT LENGTH",
  min: 23,
  max: 31,
  initial: 26,
  snap: 0.5,
};

const INK = "#0a0a0a";

export default function TapeHero({
  brands,
  config = FOOT_CONFIG,
}: {
  brands: HeroBrand[];
  config?: MeasureConfig;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const engagedRef = useRef(false);
  const introDone = useRef(false);
  const convertId = useRef(0);
  const previewTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const markerX = useMotionValue(xOf(config.min));
  const smooth = useSpring(markerX, { stiffness: 420, damping: 38, mass: 0.5 });

  const [displayV, setDisplayV] = useState(config.min);
  const [committed, setCommitted] = useState(config.initial);
  const [brand, setBrand] = useState(brands[0]?.slug ?? "");
  const [verdict, setVerdict] = useState<string | null>(null);
  const [kind, setKind] = useState<MatchKind>(null);
  const [pulse, setPulse] = useState(0);
  const [engaged, setEngaged] = useState(false);
  const [converting, setConverting] = useState(false);

  useMotionValueEvent(smooth, "change", (x) => {
    const v = (x - ANCHOR_X) / PPC;
    const c = Math.min(config.max, Math.max(config.min, v));
    setDisplayV(Math.round(c * 10) / 10);
  });

  /* -------- conversion — the existing anchor-measurement engine -------- */
  const runConvert = useCallback(
    (cm: number, slug: string, final: boolean) => {
      if (!slug) return;
      const id = ++convertId.current;
      setConverting(true);
      fetch("/api/convert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: config.category,
          gender: "men",
          anchorValue: cm,
          brandSlug: slug,
        }),
      })
        .then((r) => r.json())
        .then((d) => {
          if (convertId.current !== id) return;
          const row: AnyRow | undefined =
            d.status === "estimate" ? d.estimate : d.row;
          if (row) {
            const primary = rowPrimaryLabel(config.category, row);
            const name =
              brands
                .find((b) => b.slug === slug)
                ?.name.toUpperCase() ?? slug.toUpperCase();
            setVerdict(`${name} · ${primary}`);
            setKind(d.status === "empty" ? null : (d.status as MatchKind));
            if (final) setPulse((p) => p + 1);
          } else {
            setVerdict(null);
            setKind(null);
          }
          setConverting(false);
        })
        .catch(() => {
          if (convertId.current === id) setConverting(false);
        });
    },
    [brands, config.category]
  );

  const settle = useCallback(
    (v: number) => {
      const snapped = Math.round(v / config.snap) * config.snap;
      const c = Math.min(config.max, Math.max(config.min, snapped));
      setCommitted(c);
      runConvert(c, brand, true);
    },
    [brand, config, runConvert]
  );

  /* -------- intro: settle at the reference measurement -------- */
  useEffect(() => {
    if (introDone.current) return;
    introDone.current = true;
    const t = setTimeout(() => {
      animate(markerX, xOf(config.initial), {
        duration: 0.55,
        ease: [0.22, 1, 0.36, 1],
        onComplete: () => settle(config.initial),
      });
    }, 850);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* -------- drag physics -------- */
  const svgPointX = (clientX: number): number => {
    const el = svgRef.current;
    if (!el) return ANCHOR_X;
    const rect = el.getBoundingClientRect();
    const s = Math.min(rect.width / 640, rect.height / 600);
    const drawnW = 640 * s;
    const offX = rect.left + (rect.width - drawnW) / 2;
    return (clientX - offX) / s;
  };

  /** rubber-band resistance past the range ends */
  const resist = (v: number): number => {
    if (v < config.min) return config.min - (config.min - v) * 0.4;
    if (v > config.max) return config.max + (v - config.max) * 0.4;
    return v;
  };

  const minX = xOf(config.min) - 8;
  const maxX = xOf(config.max) + 12;

  const preview = (clientX: number) => {
    const px = svgPointX(clientX);
    const v = (px - ANCHOR_X) / PPC;
    markerX.set(Math.min(maxX, Math.max(minX, xOf(resist(v)))));
    if (previewTimer.current) clearTimeout(previewTimer.current);
    previewTimer.current = setTimeout(() => {
      const snapped = Math.min(
        config.max,
        Math.max(config.min, Math.round(v / config.snap) * config.snap)
      );
      runConvert(snapped, brand, false);
    }, 180);
  };

  const onDown = (e: ReactPointerEvent<SVGRectElement>) => {
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    engagedRef.current = true;
    setEngaged(true);
    markerX.stop();
    preview(e.clientX);
  };

  const onMove = (e: ReactPointerEvent<SVGRectElement>) => {
    if (!engagedRef.current) return;
    preview(e.clientX);
  };

  const onUp = (e: ReactPointerEvent<SVGRectElement>) => {
    if (!engagedRef.current) return;
    engagedRef.current = false;
    setEngaged(false);
    if (previewTimer.current) clearTimeout(previewTimer.current);
    const px = svgPointX(e.clientX);
    const v = (px - ANCHOR_X) / PPC;
    const snapped = Math.round(
      Math.min(config.max, Math.max(config.min, v)) / config.snap
    ) * config.snap;
    animate(markerX, xOf(snapped), {
      type: "spring",
      stiffness: 420,
      damping: 32,
      onComplete: () => settle(snapped),
    });
  };

  /* -------- restrained scroll response -------- */
  const scrollP = useMotionValue(0);
  useEffect(() => {
    const onScroll = () =>
      scrollP.set(Math.min(1, window.scrollY / Math.max(1, window.innerHeight)));
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [scrollP]);
  const footScale = useTransform(scrollP, [0, 1], [1, 0.94]);
  const svgY = useTransform(scrollP, [0, 1], [0, 30]);
  const numY = useTransform(scrollP, [0, 1], [0, -20]);
  const annoY = useTransform(scrollP, [0, 1], [0, -34]);

  return (
    <div className="absolute inset-0">
      {/* faint blueprint grid — monochrome, no glow */}
      <div
        className="absolute inset-0 opacity-70 md:opacity-100"
        style={{
          backgroundImage:
            "linear-gradient(rgba(140,184,221,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(140,184,221,0.05) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      {/* oversized number sits behind the SVG layer */}
      <MeasurementValue
        display={displayV}
        anchorLabel={config.anchorLabel}
        verdict={verdict}
        kind={kind}
        pulse={pulse}
        converting={converting}
        yShift={numY}
      />

      <motion.div style={{ y: svgY }} className="absolute inset-0">
        <svg
          ref={svgRef}
          viewBox="0 0 640 600"
          className="h-full w-full select-none opacity-60 md:opacity-100"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* tape first (under everything) */}
          <TapeMeasure maxCm={config.max} />
          {/* coverage hides the retracted tail beyond the tang */}
          <motion.g style={{ x: smooth }}>
            <rect x={7} y={240} width={640} height={140} fill={INK} />
          </motion.g>
          {/* insole draws above the cover so toes survive retraction */}
          <FootOutline scale={footScale} />
          <MeasurementMarker
            x={smooth}
            value={displayV.toFixed(1)}
            engaged={engaged}
            onDown={onDown}
            onMove={onMove}
            onUp={onUp}
          />
        </svg>
      </motion.div>

      <motion.p
        style={{ y: annoY }}
        className="pointer-events-none absolute bottom-16 left-0 hidden font-mono text-[9px] tracking-[0.3em] text-fog/70 md:block"
      >
        DRAG THE TANG — SNAPS EVERY 0.5 CM
      </motion.p>

      {/* vertical brand rail — right edge, centered on the ruler line */}
      <div className="absolute top-1/2 right-0 z-20 -translate-y-1/2 md:right-3">
        <motion.div
          initial={{ opacity: 0, x: 14 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.35, duration: 0.4 }}
        >
          <BrandSelector
            brands={brands}
            active={brand}
            onSelect={(s) => {
              setBrand(s);
              runConvert(committed, s, true);
            }}
          />
        </motion.div>
      </div>
    </div>
  );
}
