"use client";

import { useId, useState } from "react";
import Link from "next/link";
import Ruler from "@/components/Ruler";
import {
  CATEGORIES,
  formatCm,
  rowPrimaryLabel,
  siblingsOf,
  type CategoryId,
  type ShopperGender,
} from "@/lib/categories";
import { cn } from "@/lib/format";
import { chartFor, type CategoryCharts, type LiteBrand } from "@/lib/sizing";

/** What a shopper told us — enough to save as a profile entry. */
export interface Anchor {
  anchorValue: number;
  /** Brand slug, or "measured". */
  sourceBrandSlug: string;
  sourceBrandName?: string;
  sourceSizeLabel: string;
  /** The line the size came from (e.g. a lifestyle-sneaker size used on a running page). */
  sourceCategory?: CategoryId;
}

/** A sibling category's charts, so a size from one line can anchor another. */
export type Lines = Partial<Record<CategoryId, { brands: LiteBrand[]; charts: CategoryCharts }>>;

export type AnchorMode = "known" | "measure";

export function measuredAnchor(category: CategoryId, cm: number): Anchor {
  return {
    anchorValue: cm,
    sourceBrandSlug: "measured",
    sourceBrandName: "Measured",
    sourceSizeLabel: `${formatCm(cm)} cm`,
  };
}

/**
 * Two ways in: "a size I already wear" (brand + size → we back-calculate the
 * measurement), or "I'll measure" (ruler / typed cm).
 */
export default function AnchorInput({
  category,
  gender,
  brands,
  charts,
  value,
  onChange,
  exclude,
  initialMode,
  lines,
}: {
  category: CategoryId;
  gender: ShopperGender;
  brands: LiteBrand[];
  charts: CategoryCharts;
  value: Anchor | null;
  onChange: (a: Anchor) => void;
  /** Brand to leave out of the "I know" list (the one being converted to). */
  exclude?: string;
  initialMode?: AnchorMode;
  /** Other lines sharing this body measurement (sneakers ↔ running…). */
  lines?: Lines;
}) {
  const def = CATEGORIES[category];
  const uid = useId();
  const lineIds = [
    category,
    ...siblingsOf(category).filter((c) => c !== category && lines?.[c]),
  ];
  const [line, setLine] = useState<CategoryId>(
    value?.sourceCategory && lineIds.includes(value.sourceCategory) ? value.sourceCategory : category
  );
  const lineBrands = line === category ? brands : lines?.[line]?.brands ?? [];
  const lineCharts = line === category ? charts : lines?.[line]?.charts ?? {};
  const options = lineBrands.filter(
    (b) => chartFor(lineCharts, b.slug, gender) && !(line === category && b.slug === exclude)
  );
  const [mode, setMode] = useState<AnchorMode>(
    initialMode ?? (value?.sourceBrandSlug === "measured" || options.length === 0 ? "measure" : "known")
  );
  const [slug, setSlug] = useState(() =>
    value && options.some((o) => o.slug === value.sourceBrandSlug)
      ? value.sourceBrandSlug
      : options[0]?.slug ?? ""
  );
  const current = options.find((o) => o.slug === slug) ?? options[0];
  const rows = current ? chartFor(lineCharts, current.slug, gender)?.rows ?? [] : [];
  const cm = value?.anchorValue ?? def.anchorDefault;
  const [typed, setTyped] = useState<string | null>(null);

  const measure = (v: number) => onChange(measuredAnchor(category, v));

  return (
    <div>
      <div role="tablist" aria-label="How do you want to tell us?" className="flex gap-6 border-b border-bone/12">
        {(
          [
            ["known", "A size I already wear"],
            ["measure", "I'll measure"],
          ] as [AnchorMode, string][]
        ).map(([m, label]) => (
          <button
            key={m}
            role="tab"
            aria-selected={mode === m}
            disabled={m === "known" && options.length === 0}
            onClick={() => setMode(m)}
            className={cn(
              "kicker -mb-px border-b pb-3 transition-colors disabled:opacity-30",
              mode === m ? "border-signal text-bone" : "border-transparent text-fog hover:text-bone"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {mode === "known" && lineIds.length > 1 && (
        <div className="mt-6">
          <p className="kicker mb-2 text-fog">From</p>
          <div className="flex flex-wrap gap-px border border-bone/12 bg-bone/12 sm:inline-flex" role="group" aria-label="Product line">
            {lineIds.map((c) => (
              <button
                key={c}
                aria-pressed={line === c}
                onClick={() => {
                  setLine(c);
                  setSlug("");
                }}
                className={cn(
                  "kicker px-3 py-2 transition-colors",
                  line === c ? "bg-bone text-ink" : "bg-ink text-fog hover:text-bone"
                )}
              >
                {CATEGORIES[c].nav}
              </button>
            ))}
          </div>
        </div>
      )}

      {mode === "known" && current ? (
        <div className="mt-6">
          <label htmlFor={`${uid}-brand`} className="kicker mb-2 block text-fog">
            Brand
          </label>
          <div className="relative">
            <select
              id={`${uid}-brand`}
              value={current.slug}
              onChange={(e) => setSlug(e.target.value)}
              className="h-12 w-full appearance-none border border-bone/20 bg-coal px-4 pr-10 font-display text-base text-bone outline-none focus:border-signal"
            >
              {options.map((b) => (
                <option key={b.slug} value={b.slug}>
                  {b.name}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 font-mono text-xs text-fog">
              ▾
            </span>
          </div>

          <p id={`${uid}-sizes`} className="kicker mt-6 mb-2 text-fog">
            Your {CATEGORIES[line].nav.toLowerCase()} size in {current.name}
          </p>
          <div
            role="radiogroup"
            aria-labelledby={`${uid}-sizes`}
            className="scroll-thin grid max-h-60 grid-cols-3 overflow-y-auto border-t border-l border-bone/12 sm:grid-cols-4"
          >
            {rows.map((r) => {
              const label = rowPrimaryLabel(line, r);
              const active =
                value?.sourceBrandSlug === current.slug &&
                value.anchorValue === r.anchorValue &&
                value.sourceSizeLabel === label &&
                (value.sourceCategory ?? category) === line;
              return (
                <button
                  key={`${r.anchorValue}-${label}`}
                  role="radio"
                  aria-checked={active}
                  onClick={() =>
                    onChange({
                      anchorValue: r.anchorValue,
                      sourceBrandSlug: current.slug,
                      sourceBrandName: current.name,
                      sourceSizeLabel: label,
                      sourceCategory: line,
                    })
                  }
                  className={cn(
                    "border-r border-b border-bone/12 px-3 py-3 text-left transition-colors",
                    active ? "bg-signal text-bone" : "bg-ink text-bone hover:bg-graphite"
                  )}
                >
                  <span className="block font-display text-base leading-tight">{label}</span>
                  <span className={cn("mt-0.5 block font-mono text-[10px] tabular", active ? "text-bone/70" : "text-fog")}>
                    {formatCm(r.anchorValue)} cm
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="mt-6">
          <div className="flex items-end justify-between gap-4">
            <label htmlFor={`${uid}-cm`} className="kicker text-fog">
              {def.anchor}
            </label>
            <Link href="/measure" className="kicker text-fog underline-offset-4 transition-colors hover:text-bone hover:underline">
              How to measure
            </Link>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <input
              id={`${uid}-cm`}
              inputMode="decimal"
              value={typed ?? formatCm(cm)}
              onFocus={() => setTyped(formatCm(cm))}
              onChange={(e) => {
                setTyped(e.target.value);
                const v = Number(e.target.value.replace(",", "."));
                if (Number.isFinite(v) && v >= def.anchorMin && v <= def.anchorMax) measure(v);
              }}
              onBlur={() => setTyped(null)}
              className={cn(
                "w-40 border-b border-bone/20 bg-transparent font-display text-5xl font-light tabular outline-none focus:border-signal",
                value || typed !== null ? "text-bone" : "text-bone/30"
              )}
            />
            <span className="font-mono text-sm text-fog">cm</span>
            {!value && <span className="kicker ml-3 text-fog">Drag the scale or type</span>}
          </div>
          <Ruler
            className="mt-4"
            label={`${def.anchor} in centimetres`}
            min={def.anchorMin}
            max={def.anchorMax}
            step={def.anchorStep}
            value={Math.min(def.anchorMax, Math.max(def.anchorMin, cm))}
            onChange={measure}
          />
          <p className="mt-4 text-sm leading-relaxed text-fog">{def.howTo[0]} {def.howTo[1]}</p>
        </div>
      )}
    </div>
  );
}
