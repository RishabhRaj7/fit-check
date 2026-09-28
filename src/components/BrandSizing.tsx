"use client";

import { useMemo, useState } from "react";
import AnchorInput, { type Anchor, type Lines } from "@/components/AnchorInput";
import ParticleReadout from "@/components/ParticleReadout";
import SizePassport from "@/components/SizePassport";
import {
  CATEGORIES,
  FIT_LABEL,
  FIT_ORDER,
  GENDERS,
  type Fit,
  formatCm,
  regionValue,
  rowPrimaryLabel,
  type CategoryId,
  type ShopperGender,
} from "@/lib/categories";
import { cn } from "@/lib/format";
import { entryFor, saveEntry, setGender, useProfile } from "@/lib/profile";
import { convert, type CategoryCharts, type LiteBrand } from "@/lib/sizing";

export interface ChartSource {
  label: string;
  url: string | null;
  basis: "body" | "garment";
}

export default function BrandSizing({
  category,
  target,
  brands,
  chartsByFit,
  targetFits,
  lines,
  source,
}: {
  category: CategoryId;
  target: LiteBrand;
  brands: LiteBrand[];
  /** Always has "regular"; other fits when any brand publishes them. */
  chartsByFit: Partial<Record<Fit, CategoryCharts>>;
  /** Fits this brand publishes its own chart for. */
  targetFits: Fit[];
  lines?: Lines;
  source?: ChartSource | null;
}) {
  const def = CATEGORIES[category];
  const fits = FIT_ORDER.filter((f) => chartsByFit[f]);
  const [fit, setFit] = useState<Fit>("regular");
  const charts = useMemo(() => chartsByFit[fit] ?? chartsByFit.regular ?? {}, [chartsByFit, fit]);
  const { profile, gender, user, ready } = useProfile();
  const saved = entryFor(profile, category, gender);
  const [draft, setDraft] = useState<{ gender: ShopperGender; anchor: Anchor } | null>(null);
  const [saving, setSaving] = useState(false);

  // Your own input wins; otherwise the saved profile anchor for this gender.
  const anchor: Anchor | null =
    draft && draft.gender === gender
      ? draft.anchor
      : saved && saved.gender === gender
        ? saved.entry
        : null;

  const match = useMemo(
    () => (anchor ? convert(charts, brands, category, target.slug, gender, anchor.anchorValue) : null),
    [anchor, charts, brands, category, target.slug, gender]
  );
  const primary = match?.row ? rowPrimaryLabel(category, match.row) : null;
  const saveTo: CategoryId = anchor?.sourceCategory ?? category;
  const savedHere = profile[`${saveTo}:${gender}`];
  const isSaved =
    !!anchor &&
    !!savedHere &&
    savedHere.anchorValue === anchor.anchorValue &&
    savedHere.sourceBrandSlug === anchor.sourceBrandSlug;
  const inferredFrom =
    !draft && saved && saved.gender === gender && saved.from !== category ? saved.from : null;

  const ownGenders = GENDERS.filter((g) => charts[target.slug]?.[g.id]?.length);
  const [tableGender, setTableGender] = useState<ShopperGender | null>(null);
  const shownGender = tableGender ?? (ownGenders.some((g) => g.id === gender) ? gender : ownGenders[0]?.id);
  const tableRows = shownGender ? charts[target.slug]?.[shownGender] ?? [] : [];
  const hitRow =
    match?.row && match.status !== "estimate" && match.genderUsed === shownGender
      ? match.row
      : null;

  const save = async () => {
    if (!anchor || !match) return;
    setSaving(true);
    try {
      await saveEntry(saveTo, gender, {
        ...anchor,
        confidence: anchor.sourceBrandSlug === "measured" || match.status === "exact" ? "exact" : "inferred",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-20">
      {/* ---------------------------------------------------- converter */}
      <div className="grid border border-bone/12 lg:grid-cols-2">
        <div className="border-b border-bone/12 p-5 md:p-8 lg:border-r lg:border-b-0">
          <div className="mb-6 flex items-center justify-between gap-4">
            <span className="kicker text-fog">
              <span className="text-frost">01</span> — What you know
            </span>
            <div className="flex border border-bone/15" role="group" aria-label="Chart">
              {GENDERS.map((g) => (
                <button
                  key={g.id}
                  aria-pressed={gender === g.id}
                  onClick={() => setGender(g.id)}
                  className={cn(
                    "kicker px-3 py-1.5 transition-colors",
                    gender === g.id ? "bg-bone text-ink" : "text-fog hover:text-bone"
                  )}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>
          <AnchorInput
            key={`${gender}-${ready}`}
            category={category}
            gender={gender}
            brands={brands}
            charts={charts}
            exclude={target.slug}
            lines={lines}
            value={anchor}
            onChange={(a) => setDraft({ gender, anchor: a })}
          />
          {def.hasFits && fits.length > 1 && (
            <div className="mt-6">
              <p className="kicker mb-2 text-fog">Fit you&apos;re buying</p>
              <div className="inline-flex flex-wrap gap-px border border-bone/12 bg-bone/12" role="group" aria-label="Fit">
                {fits.map((f) => (
                  <button
                    key={f}
                    aria-pressed={fit === f}
                    onClick={() => setFit(f)}
                    className={cn(
                      "kicker px-3 py-2 transition-colors",
                      fit === f ? "bg-bone text-ink" : "bg-ink text-fog hover:text-bone"
                    )}
                  >
                    {FIT_LABEL[f]}
                  </button>
                ))}
              </div>
              {fit !== "regular" && !targetFits.includes(fit) && (
                <p className="mt-2 text-xs leading-relaxed text-fog">
                  {target.name} doesn&apos;t publish a separate {FIT_LABEL[fit].toLowerCase()} chart — showing
                  their regular one.
                </p>
              )}
            </div>
          )}
          <p className="mt-6 border-l border-signal/60 pl-3 text-sm leading-relaxed text-fog">{def.fitNote}</p>
        </div>

        <div className="flex flex-col bg-coal p-5 md:p-8">
          <span className="kicker text-fog">
            <span className="text-frost">02</span> — Your {target.name} size
          </span>

          {!anchor || !match ? (
            <div className="mt-6 flex flex-1 flex-col justify-center border border-dashed border-bone/15 p-8">
              <p className="font-display text-5xl font-light text-bone/20">—</p>
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-fog">
                Pick a size you wear in another brand, or enter your{" "}
                {def.anchor.toLowerCase()}. Your {target.name} size appears here.
              </p>
            </div>
          ) : match.status === "none" ? (
            <div className="mt-6 flex flex-1 flex-col justify-center border border-dashed border-bone/15 p-8">
              <p className="text-sm leading-relaxed text-fog">
                No charts in this category yet, so there&apos;s nothing to read
                against. Check back soon.
              </p>
            </div>
          ) : (
            <div className="mt-6 flex flex-1 flex-col">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <span
                  className={cn(
                    "kicker px-2 py-1",
                    match.status === "exact" ? "bg-bone text-ink" : "border border-signal text-frost"
                  )}
                >
                  {match.status === "exact"
                    ? "Exact row"
                    : match.status === "nearest"
                      ? `Nearest row · ±${match.distance} cm`
                      : "Estimate"}
                </span>
                {match.genderUsed && match.genderUsed !== gender && (
                  <span className="kicker text-fog">From the {match.genderUsed}&apos;s chart</span>
                )}
                <span className="kicker text-fog">
                  {def.anchor} {formatCm(anchor.anchorValue)} cm
                  {anchor.sourceBrandSlug !== "measured" && ` · via ${anchor.sourceBrandName ?? ""} ${anchor.sourceSizeLabel}`}
                </span>
                {inferredFrom && (
                  <span className="kicker text-frost">
                    From your {CATEGORIES[inferredFrom].label.toLowerCase()} size
                  </span>
                )}
              </div>

              <ParticleReadout text={primary ?? "—"} className="mt-6 h-[110px] md:h-[150px]" />

              <dl className="mt-6 grid grid-cols-2 border-t border-bone/12 sm:grid-cols-4">
                {def.regions
                  .filter((r) => !r.primary)
                  .map((r) => (
                    <div key={r.key} className="border-b border-bone/12 py-3 pr-3">
                      <dt className="kicker text-fog">{r.label}</dt>
                      <dd className="mt-1 font-display text-xl font-light tabular text-bone">
                        {match.row ? regionValue(match.row, r.key) : "—"}
                      </dd>
                    </div>
                  ))}
              </dl>

              {match.status === "estimate" && (
                <p className="mt-4 text-sm leading-relaxed text-bone/70">
                  We don&apos;t hold {target.name}&apos;s {def.label.toLowerCase()} chart yet.
                  This is what {match.basedOn.slice(0, 3).join(", ")}
                  {match.basedOn.length > 3 ? ` and ${match.basedOn.length - 3} more` : ""} say
                  for your measurement
                  {match.crossCategory && " in their closest related charts, since no brand's chart for this category is on file yet"}
                  {" "}— treat it as a starting point.
                </p>
              )}
              {match.outOfRange && (
                <p className="mt-4 text-sm leading-relaxed text-frost">
                  Your measurement is outside {target.name}&apos;s chart — this is their
                  closest size, not a true fit.
                </p>
              )}

              <div className="mt-auto flex flex-wrap items-center gap-4 pt-8">
                <button
                  onClick={save}
                  disabled={isSaved || saving}
                  className={cn(
                    "kicker flex h-11 items-center px-5 transition-colors",
                    isSaved ? "border border-bone/20 text-fog" : "bg-signal text-bone hover:bg-bone hover:text-ink"
                  )}
                >
                  {isSaved ? "Saved to your profile" : saving ? "Saving…" : "Save as my size"}
                </button>
                <span className="kicker text-fog">
                  {user ? "Synced to your account" : "Kept on this device"}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ------------------------------------------------------- chart */}
      <section aria-labelledby="chart-heading">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="kicker text-fog">
              <span className="text-frost">03</span> — The chart
            </p>
            <h2 id="chart-heading" className="mt-3 font-display text-3xl font-light tracking-[-0.02em] text-bone md:text-4xl">
              {target.name} {def.label.toLowerCase()}
              {fit !== "regular" && targetFits.includes(fit) && ` · ${FIT_LABEL[fit].toLowerCase()} fit`}
            </h2>
            {source && (
              <p className="kicker mt-2 text-fog">
                Source ·{" "}
                {source.url ? (
                  <a href={source.url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-bone">
                    {source.label}
                  </a>
                ) : (
                  source.label
                )}
                {source.basis === "garment" && " · converted from garment measurements"}
              </p>
            )}
          </div>
          {ownGenders.length > 1 && (
            <div className="flex border border-bone/15" role="group" aria-label="Chart">
              {ownGenders.map((g) => (
                <button
                  key={g.id}
                  aria-pressed={shownGender === g.id}
                  onClick={() => setTableGender(g.id)}
                  className={cn(
                    "kicker px-3 py-1.5 transition-colors",
                    shownGender === g.id ? "bg-bone text-ink" : "text-fog hover:text-bone"
                  )}
                >
                  {g.label}
                </button>
              ))}
            </div>
          )}
        </div>
        {tableRows.length === 0 ? (
          <p className="mt-6 border border-dashed border-bone/15 p-8 text-sm leading-relaxed text-fog">
            {target.name}&apos;s {def.label.toLowerCase()} chart isn&apos;t on file yet —
            sizes above are estimated from other brands.
          </p>
        ) : (
          <div className="scroll-thin mt-6 overflow-x-auto border border-bone/12">
            <table className="w-full min-w-[520px] border-collapse">
              <thead>
                <tr className="border-b border-bone/12 bg-coal">
                  <th className="kicker px-4 py-3 text-left font-normal text-fog">{def.anchor} (cm)</th>
                  {def.regions.map((r) => (
                    <th key={r.key} className="kicker px-4 py-3 text-left font-normal text-fog">
                      {r.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableRows.map((r, i) => {
                  const hit = r === hitRow;
                  return (
                    <tr
                      key={i}
                      aria-current={hit ? "true" : undefined}
                      className={cn("border-b border-bone/8 last:border-0", hit && "bg-signal text-bone")}
                    >
                      <td className={cn("px-4 py-2.5 font-mono text-xs tabular", hit ? "text-bone/80" : "text-fog")}>
                        {formatCm(r.anchorValue)}
                      </td>
                      {def.regions.map((reg) => (
                        <td
                          key={reg.key}
                          className={cn(
                            "px-4 py-2.5 tabular",
                            reg.primary ? "font-display text-base" : "font-mono text-xs",
                            hit ? "text-bone" : reg.primary ? "text-bone" : "text-bone/70"
                          )}
                        >
                          {regionValue(r, reg.key)}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* ----------------------------------------------------- compare */}
      {anchor && (
        <section aria-labelledby="compare-heading">
          <p className="kicker text-fog">
            <span className="text-frost">04</span> — Everywhere else
          </p>
          <h2 id="compare-heading" className="mt-3 font-display text-3xl font-light tracking-[-0.02em] text-bone md:text-4xl">
            The same {formatCm(anchor.anchorValue)} cm, in every brand
          </h2>
          <div className="mt-6">
            <SizePassport
              category={category}
              gender={gender}
              anchor={anchor.anchorValue}
              brands={brands}
              charts={charts}
              current={target.slug}
            />
          </div>
        </section>
      )}
    </div>
  );
}
