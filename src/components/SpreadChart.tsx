"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { GENDERS, formatCm, type ShopperGender } from "@/lib/categories";
import { cn } from "@/lib/format";
import { chartFor, nearestRow, type CategoryCharts, type LiteBrand } from "@/lib/sizing";

/**
 * One foot length, every sneaker chart on file: where does each brand put
 * you on the UK scale? Columns are UK sizes; brands stack in the column they
 * land in. Computed live from the catalogue.
 */
export default function SpreadChart({
  brands,
  charts,
}: {
  brands: LiteBrand[];
  charts: CategoryCharts;
}) {
  const [cm, setCm] = useState(26.5);
  const [gender, setGender] = useState<ShopperGender>("men");

  const { columns, landed, verdicts } = useMemo(() => {
    const landed: { brand: LiteBrand; uk: number }[] = [];
    for (const b of brands) {
      const c = chartFor(charts, b.slug, gender);
      if (!c) continue;
      const uk = Number(nearestRow(c.rows, cm).row.uk);
      if (Number.isFinite(uk)) landed.push({ brand: b, uk });
    }
    const values = landed.map((l) => l.uk);
    const lo = values.length ? Math.min(...values) - 0.5 : 6;
    const hi = values.length ? Math.max(...values) + 0.5 : 9;
    const columns: number[] = [];
    for (let v = lo; v <= hi + 1e-6; v += 0.5) columns.push(Math.round(v * 2) / 2);
    const verdicts = new Set(values).size;
    return { columns, landed, verdicts };
  }, [brands, charts, gender, cm]);

  const step = (d: number) => setCm((v) => Math.min(30, Math.max(23, Math.round((v + d) * 2) / 2)));

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="flex items-end gap-5">
          <div>
            <span className="kicker text-fog">Foot length</span>
            <div className="mt-2 flex items-center border border-bone/15">
              <button
                aria-label="Shorter by half a centimetre"
                onClick={() => step(-0.5)}
                className="h-10 w-10 font-mono text-fog transition-colors hover:bg-graphite hover:text-bone"
              >
                −
              </button>
              <output className="w-24 border-x border-bone/15 text-center font-display text-lg font-light tabular text-bone">
                {formatCm(cm)}
                <span className="ml-1 font-mono text-[10px] text-fog">cm</span>
              </output>
              <button
                aria-label="Longer by half a centimetre"
                onClick={() => step(0.5)}
                className="h-10 w-10 font-mono text-fog transition-colors hover:bg-graphite hover:text-bone"
              >
                +
              </button>
            </div>
          </div>
          <div className="flex border border-bone/15" role="group" aria-label="Chart">
            {GENDERS.map((g) => (
              <button
                key={g.id}
                aria-pressed={gender === g.id}
                onClick={() => setGender(g.id)}
                className={cn(
                  "kicker h-10 px-3 transition-colors",
                  gender === g.id ? "bg-bone text-ink" : "text-fog hover:text-bone"
                )}
              >
                {g.label}
              </button>
            ))}
          </div>
        </div>
        <p className="kicker max-w-xs text-right text-fog" aria-live="polite">
          <span className="text-bone">{landed.length}</span> charts ·{" "}
          <span className="text-frost">{verdicts}</span> different UK sizes for the same foot
        </p>
      </div>

      <div className="scroll-thin mt-8 overflow-x-auto">
        <div
          className="grid min-w-[560px] border-t border-l border-bone/12"
          style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))` }}
        >
          {columns.map((uk) => {
            const here = landed.filter((l) => l.uk === uk);
            return (
              <div key={uk} className="flex min-h-64 flex-col border-r border-b border-bone/12">
                <div
                  className={cn(
                    "flex items-baseline justify-between border-b border-bone/12 px-3 py-2.5",
                    here.length > 0 && "bg-graphite"
                  )}
                >
                  <span className="kicker text-fog">UK</span>
                  <span
                    className={cn(
                      "font-display text-xl font-light tabular",
                      here.length ? "text-bone" : "text-fog/40"
                    )}
                  >
                    {uk}
                  </span>
                </div>
                <ul className="flex flex-1 flex-col gap-1 p-2">
                  {here.map((l) => (
                    <motion.li
                      layout
                      layoutId={`spread-${l.brand.slug}`}
                      key={l.brand.slug}
                      transition={{ type: "spring", stiffness: 380, damping: 34 }}
                      className="kicker border-l-2 border-signal bg-ink px-2 py-1.5 text-bone"
                    >
                      {l.brand.name}
                    </motion.li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
