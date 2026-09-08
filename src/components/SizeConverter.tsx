"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  Crosshair,
  Ruler,
  TriangleAlert,
} from "lucide-react";
import {
  CATEGORIES,
  GENDERS,
  regionValue,
  rowPrimaryLabel,
  type AnyRow,
  type CategoryId,
} from "@/lib/categories";
import { cn } from "@/lib/format";
import { getEntry, saveEntry } from "@/lib/profile";
import BrandLogo from "@/components/BrandLogo";

export interface BrandMeta {
  slug: string;
  name: string;
  logoUrl: string | null;
  needsData: boolean;
  hasChart: boolean;
}

interface ConvertRow {
  eu: string | null;
  uk: string | null;
  us: string | null;
  jpn: string | null;
  ind: string | null;
  label: string | null;
  anchorValue: number;
}

interface ConvertResult {
  status: "exact" | "nearest" | "estimate" | "empty";
  genderUsed?: string;
  row?: ConvertRow;
  distance?: number;
  estimate?: ConvertRow & { basedOn: string[] };
}

type Mode = "known" | "measure";

export default function SizeConverter({
  category,
  targetBrand,
  brands,
}: {
  category: CategoryId;
  targetBrand: BrandMeta;
  brands: BrandMeta[];
}) {
  const cat = CATEGORIES[category];
  const sourceOptions = useMemo(
    () => brands.filter((b) => b.hasChart),
    [brands]
  );

  const [gender, setGender] = useState<"men" | "women">("men");
  const [mode, setMode] = useState<Mode>("known");
  const [sourceSlug, setSourceSlug] = useState(() => {
    const first = sourceOptions.find((b) => b.slug !== targetBrand.slug);
    return first?.slug ?? sourceOptions[0]?.slug ?? "";
  });
  const [sourceRows, setSourceRows] = useState<AnyRow[]>([]);
  const [anchor, setAnchor] = useState<number | null>(null);
  const [knownLabel, setKnownLabel] = useState<string | null>(null);
  const [sourceName, setSourceName] = useState<string>("");
  const [result, setResult] = useState<ConvertResult | null>(null);
  const [busy, setBusy] = useState(false);
  const [stamp, setStamp] = useState(0);
  const [savedFlash, setSavedFlash] = useState(false);
  const runId = useRef(0);

  /* fetch source-brand chart */
  useEffect(() => {
    if (!sourceSlug || mode !== "known") return;
    let cancelled = false;
    fetch(`/api/chart?brand=${sourceSlug}&category=${category}&gender=${gender}`)
      .then((r) => r.json())
      .then((d) => {
        if (cancelled) return;
        setSourceRows(Array.isArray(d.rows) ? d.rows : []);
        setSourceName(d.brandName ?? "");
      })
      .catch(() => !cancelled && setSourceRows([]));
    return () => {
      cancelled = true;
    };
  }, [sourceSlug, category, gender, mode]);

  /* adopt profile entry if one exists */
  const adoptProfile = useCallback(
    async (g: "men" | "women") => {
      const entry = await getEntry(category, g);
      if (entry) {
        setAnchor(entry.anchorValue);
        setKnownLabel(entry.sourceSizeLabel);
        if (entry.sourceBrandSlug === "measured") {
          setMode("measure");
        } else {
          setMode("known");
          if (sourceOptions.some((b) => b.slug === entry.sourceBrandSlug)) {
            setSourceSlug(entry.sourceBrandSlug);
          }
          setSourceName(entry.sourceBrandName ?? entry.sourceBrandSlug);
        }
        return true;
      }
      return false;
    },
    [category, sourceOptions]
  );

  useEffect(() => {
    void adoptProfile("men");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* auto-convert whenever the anchor is set (instant by design) */
  useEffect(() => {
    if (anchor == null) {
      setResult(null);
      return;
    }
    const id = ++runId.current;
    setBusy(true);
    const t = setTimeout(() => {
      fetch("/api/convert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category,
          gender,
          anchorValue: anchor,
          brandSlug: targetBrand.slug,
        }),
      })
        .then((r) => r.json())
        .then((d: ConvertResult) => {
          if (runId.current !== id) return;
          setResult(d);
          setStamp(Date.now());
          setBusy(false);
          setSavedFlash(false);
        })
        .catch(() => {
          if (runId.current !== id) return;
          setBusy(false);
        });
    }, 160);
    return () => clearTimeout(t);
  }, [anchor, category, gender, targetBrand.slug]);

  const switchGender = (g: "men" | "women") => {
    setGender(g);
    void adoptProfile(g).then((adopted) => {
      if (!adopted) {
        setAnchor(null);
        setKnownLabel(null);
        setResult(null);
      }
    });
  };

  const pickRow = (row: AnyRow) => {
    setAnchor(row.anchorValue);
    setKnownLabel(rowPrimaryLabel(category, row));
    setSourceName(sourceOptions.find((b) => b.slug === sourceSlug)?.name ?? "");
  };

  const doSave = async () => {
    if (anchor == null) return;
    await saveEntry(category, gender, {
      anchorValue: anchor,
      sourceBrandSlug:
        mode === "measure"
          ? "measured"
          : result?.status === "estimate"
            ? "measured"
            : sourceSlug,
      sourceBrandName: mode === "measure" ? "Self-measured" : sourceName,
      sourceSizeLabel:
        knownLabel ??
        `${Math.round(anchor * 10) / 10} ${cat.anchorUnit.toLowerCase()}`,
      confidence: result?.status === "estimate" ? "inferred" : "exact",
    });
    setSavedFlash(true);
  };

  const verdictRow = result?.status === "estimate" ? result.estimate : result?.row;
  const primary = verdictRow ? rowPrimaryLabel(category, verdictRow) : null;

  return (
    <div className="grid gap-px border border-bone/12 bg-bone/12 lg:grid-cols-[1.05fr_1fr]">
      {/* ------------------------------ INPUT ------------------------------ */}
      <div className="bg-ink p-5 md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="font-mono text-[10px] tracking-[0.24em] text-fog">
            01 / YOUR INPUT
          </span>
          <div className="flex border border-bone/15">
            {GENDERS.map((g) => (
              <button
                key={g.id}
                onClick={() => switchGender(g.id as "men" | "women")}
                className={cn(
                  "px-3 py-1.5 font-mono text-[10px] tracking-[0.18em] transition-colors",
                  gender === g.id
                    ? "bg-bone text-ink"
                    : "text-fog hover:text-bone"
                )}
              >
                {g.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 flex gap-6 border-b border-bone/12">
          {(
            [
              ["known", "FROM A BRAND I KNOW"],
              ["measure", "FROM A MEASUREMENT"],
            ] as [Mode, string][]
          ).map(([m, label]) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={cn(
                "-mb-px border-b-2 pb-3 font-mono text-[10px] tracking-[0.2em] transition-colors",
                mode === m
                  ? "border-signal text-bone"
                  : "border-transparent text-fog hover:text-bone"
              )}
            >
              {label}
            </button>
          ))}
        </div>

        {mode === "known" ? (
          <div className="mt-6">
            <label className="mb-2 block font-mono text-[10px] tracking-[0.2em] text-fog">
              BRAND THAT FITS YOU
            </label>
            <div className="relative">
              <select
                value={sourceSlug}
                onChange={(e) => {
                  setSourceSlug(e.target.value);
                  setAnchor(null);
                  setKnownLabel(null);
                }}
                className="w-full appearance-none border border-bone/20 bg-coal px-4 py-3 font-display text-lg tracking-wide text-bone uppercase outline-none focus:border-signal"
              >
                {sourceOptions.map((b) => (
                  <option key={b.slug} value={b.slug}>
                    {b.name}
                  </option>
                ))}
              </select>
              <ArrowRight
                size={14}
                className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 rotate-90 text-fog"
              />
            </div>

            <label className="mt-6 mb-2 block font-mono text-[10px] tracking-[0.2em] text-fog">
              YOUR SIZE IN {sourceName.toUpperCase() || "THAT BRAND"}
            </label>
            {sourceRows.length === 0 ? (
              <p className="border border-dashed border-bone/20 p-4 font-mono text-xs text-fog">
                No chart rows for this brand/gender yet — switch to a
                measurement instead.
              </p>
            ) : (
              <div className="scroll-thin grid max-h-56 grid-cols-3 gap-1.5 overflow-y-auto pr-1 sm:grid-cols-4">
                {sourceRows.map((r, i) => {
                  const active = anchor === r.anchorValue && mode === "known";
                  return (
                    <button
                      key={i}
                      onClick={() => pickRow(r)}
                      className={cn(
                        "group border px-1 py-2 text-center transition-colors",
                        active
                          ? "border-signal bg-signal text-bone"
                          : "border-bone/15 text-bone hover:border-bone/40"
                      )}
                    >
                      <span className="block font-display text-base leading-tight">
                        {rowPrimaryLabel(category, r)}
                      </span>
                      <span
                        className={cn(
                          "block font-mono text-[9px] tracking-wider",
                          active ? "text-bone/70" : "text-fog"
                        )}
                      >
                        {r.anchorValue} {cat.anchorUnit}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          <div className="mt-6">
            <label className="mb-2 block font-mono text-[10px] tracking-[0.2em] text-fog">
              YOUR {cat.anchorLabel} ({cat.anchorUnit})
            </label>
            <div className="flex items-end gap-4">
              <span className="font-display text-6xl leading-none text-bone">
                {anchor != null ? Math.round(anchor * 10) / 10 : "--.--"}
              </span>
              <span className="mb-1 font-mono text-xs text-fog">
                {cat.anchorUnit}
              </span>
            </div>
            <input
              type="range"
              min={cat.anchorMin}
              max={cat.anchorMax}
              step={cat.anchorStep}
              value={anchor ?? (cat.anchorMin + cat.anchorMax) / 2}
              onChange={(e) => {
                setAnchor(Number(e.target.value));
                setKnownLabel(null);
                setSourceName("Self-measured");
              }}
              className="mt-5 w-full accent-frost"
            />
            <div className="mt-1 flex justify-between font-mono text-[9px] text-fog">
              <span>{cat.anchorMin}</span>
              <span>{cat.anchorMax}</span>
            </div>
            <p className="mt-3 text-xs text-fog">{cat.anchorHint}</p>
          </div>
        )}

        <div className="mt-8 flex items-center gap-3 border-t border-bone/12 pt-5">
          <Ruler size={14} className="shrink-0 text-frost" strokeWidth={2} />
          <p className="font-mono text-[10px] tracking-[0.14em] text-fog">
            {anchor != null ? (
              <>
                ANCHOR — {Math.round(anchor * 10) / 10} {cat.anchorUnit}{" "}
                {cat.anchorLabel}
                {knownLabel ? ` · VIA ${sourceName.toUpperCase()} ${knownLabel}` : ""}
              </>
            ) : (
              "PICK A SIZE OR MEASUREMENT — THE VERDICT UPDATES INSTANTLY"
            )}
          </p>
        </div>

        <p className="mt-4 border-l-2 border-signal/60 pl-3 text-[11px] leading-relaxed text-fog">
          {cat.fitNote}
        </p>
      </div>

      {/* ------------------------------ VERDICT ---------------------------- */}
      <div className="flex flex-col bg-coal p-5 md:p-8">
        <div className="flex items-center justify-between gap-3">
          <span className="font-mono text-[10px] tracking-[0.24em] text-fog">
            02 / VERDICT — {targetBrand.name.toUpperCase()}
          </span>
          <BrandLogo
            name={targetBrand.name}
            logoUrl={targetBrand.logoUrl}
            className="h-8 w-8"
            letterClassName="text-sm"
          />
        </div>

        <div className="relative mt-6 flex-1">
          {anchor == null || (!result && !busy) ? (
            <div className="flex h-full min-h-64 flex-col items-center justify-center border border-dashed border-bone/20">
              <span className="font-display text-8xl leading-none text-stroke select-none">
                ?
              </span>
              <p className="mt-4 max-w-56 text-center font-mono text-[10px] leading-relaxed tracking-[0.14em] text-fog">
                YOUR {targetBrand.name.toUpperCase()} SIZE APPEARS HERE THE
                MOMENT YOU ANSWER
              </p>
            </div>
          ) : busy && !result ? (
            <div className="flex h-full min-h-64 items-center justify-center">
              <span className="font-display text-4xl tracking-wide text-fog">
                MEASURING…
              </span>
            </div>
          ) : !(result && verdictRow && result.status !== "empty") ? (
            <div className="flex h-full min-h-64 flex-col items-center justify-center gap-3 border border-dashed border-bone/20 p-6 text-center">
              <TriangleAlert size={18} className="text-frost" />
              <p className="font-mono text-xs leading-relaxed text-fog">
                No charts anywhere for this category yet. The admin can add one
                in seconds — check back soon.
              </p>
            </div>
          ) : (
            <motion.div
              key={stamp}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
            >
              {result.status === "estimate" ? (
                <div className="border border-signal bg-signal/5 p-5">
                  <div className="flex items-center gap-2">
                    <TriangleAlert size={14} className="text-frost" />
                    <span className="font-mono text-[10px] tracking-[0.22em] text-frost">
                      ESTIMATE — NO EXACT CHART ON FILE
                    </span>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-bone/90">
                    We don&apos;t have {targetBrand.name}&apos;s exact{" "}
                    {cat.label.toLowerCase()} chart yet. Based on{" "}
                    {result.estimate!.basedOn.slice(0, 3).join(", ")}
                    {result.estimate!.basedOn.length > 3
                      ? ` +${result.estimate!.basedOn.length - 3} more`
                      : ""}
                    , your size is likely close to
                  </p>
                </div>
              ) : (
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={cn(
                      "px-2.5 py-1 font-mono text-[10px] tracking-[0.22em]",
                      result.status === "exact"
                        ? "bg-bone text-ink"
                        : "border border-signal text-frost"
                    )}
                  >
                    {result.status === "exact"
                      ? "EXACT MATCH"
                      : `NEAREST · ±${result.distance ?? 0} ${cat.anchorUnit}`}
                  </span>
                  {result.genderUsed && result.genderUsed !== gender && (
                    <span className="font-mono text-[10px] tracking-[0.18em] text-fog">
                      FROM THE {result.genderUsed.toUpperCase()}&apos;S CHART
                    </span>
                  )}
                </div>
              )}

              <div className="mt-5">
                <span className="font-mono text-[10px] tracking-[0.24em] text-fog">
                  YOUR {targetBrand.name.toUpperCase()} SIZE
                </span>
                <motion.p
                  initial={{ y: 18 }}
                  animate={{ y: 0 }}
                  transition={{ type: "spring", stiffness: 280, damping: 20 }}
                  className="font-display text-[clamp(3.2rem,8vw,5.5rem)] leading-none text-bone"
                >
                  {primary}
                  <span className="text-frost">.</span>
                </motion.p>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-px bg-bone/12 sm:grid-cols-4">
                {cat.regions
                  .map((region) => ({
                    region,
                    value: regionValue(verdictRow as AnyRow, region.key),
                  }))
                  .filter((x) => x.value !== "—" && !x.region.primary)
                  .map(({ region, value }, i) => (
                    <motion.div
                      key={region.key}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.12 + i * 0.06 }}
                      className="bg-coal px-3 py-3"
                    >
                      <span className="block font-display text-xl text-bone">
                        {value}
                      </span>
                      <span className="block font-mono text-[9px] tracking-[0.18em] text-fog">
                        {region.label}
                      </span>
                    </motion.div>
                  ))}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-coal px-3 py-3"
                >
                  <span className="block font-display text-xl text-bone">
                    {Math.round(anchor! * 10) / 10}
                  </span>
                  <span className="block font-mono text-[9px] tracking-[0.18em] text-fog">
                    {cat.anchorLabel} ({cat.anchorUnit})
                  </span>
                </motion.div>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <button
                  onClick={doSave}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2.5 font-mono text-[10px] font-semibold tracking-[0.2em] uppercase transition-colors",
                    savedFlash
                      ? "bg-bone text-ink"
                      : "bg-signal text-bone hover:bg-bone hover:text-ink"
                  )}
                >
                  {savedFlash ? (
                    <Check size={13} strokeWidth={2.5} />
                  ) : (
                    <Crosshair size={13} strokeWidth={2.5} />
                  )}
                  {savedFlash ? "Saved to profile" : "Save as my size"}
                </button>
                {savedFlash && (
                  <span className="font-mono text-[10px] tracking-[0.16em] text-fog">
                    NEVER ASKED AGAIN FOR {cat.nav}
                  </span>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
