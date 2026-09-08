"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";
import { CATEGORIES, rowPrimaryLabel, type AnyRow, type CategoryId } from "@/lib/categories";
import { cn } from "@/lib/format";

export interface LiteBrand {
  slug: string;
  name: string;
  logoUrl: string | null;
  hasChart: boolean;
}

export interface PickedSize {
  slug: string;
  name: string;
  anchorValue: number;
  label: string;
}

export default function KnownSizePicker({
  category,
  gender,
  brands,
  value,
  onChange,
}: {
  category: CategoryId;
  gender: "men" | "women";
  brands: LiteBrand[];
  value: PickedSize | null;
  onChange: (v: PickedSize) => void;
}) {
  const cat = CATEGORIES[category];
  const options = useMemo(() => brands.filter((b) => b.hasChart), [brands]);
  const [slug, setSlug] = useState(value?.slug ?? options[0]?.slug ?? "");
  const [rows, setRows] = useState<AnyRow[]>([]);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    fetch(`/api/chart?brand=${slug}&category=${category}&gender=${gender}`)
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled) setRows(Array.isArray(d.rows) ? d.rows : []);
      })
      .catch(() => !cancelled && setRows([]));
    return () => {
      cancelled = true;
    };
  }, [slug, category, gender]);

  const brandName = options.find((b) => b.slug === slug)?.name ?? "";

  return (
    <div>
      <label className="mb-2 block font-mono text-[10px] tracking-[0.2em] text-fog">
        BRAND THAT FITS YOU
      </label>
      <div className="relative">
        <select
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          className="w-full appearance-none border border-bone/20 bg-coal px-4 py-3 font-display text-lg tracking-wide text-bone uppercase outline-none focus:border-signal"
        >
          {options.map((b) => (
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

      <label className="mt-5 mb-2 block font-mono text-[10px] tracking-[0.2em] text-fog">
        YOUR SIZE IN {brandName.toUpperCase()}
      </label>
      {rows.length === 0 ? (
        <p className="border border-dashed border-bone/20 p-4 font-mono text-xs text-fog">
          No rows for this brand/gender yet.
        </p>
      ) : (
        <div className="scroll-thin grid max-h-52 grid-cols-3 gap-1.5 overflow-y-auto pr-1 sm:grid-cols-4">
          {rows.map((r, i) => {
            const label = rowPrimaryLabel(category, r);
            const active = value?.slug === slug && value.anchorValue === r.anchorValue;
            return (
              <button
                key={i}
                onClick={() =>
                  onChange({ slug, name: brandName, anchorValue: r.anchorValue, label })
                }
                className={cn(
                  "border px-1 py-2 text-center transition-colors",
                  active
                    ? "border-signal bg-signal text-bone"
                    : "border-bone/15 text-bone hover:border-bone/40"
                )}
              >
                <span className="block font-display text-base leading-tight">{label}</span>
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
  );
}
