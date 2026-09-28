"use client";

import Link from "next/link";
import { useMemo } from "react";
import {
  CATEGORIES,
  regionValue,
  rowPrimaryLabel,
  type CategoryId,
  type ShopperGender,
} from "@/lib/categories";
import { cn } from "@/lib/format";
import { passport, type CategoryCharts, type LiteBrand, type Match } from "@/lib/sizing";

export function matchNote(m: Match): string {
  if (m.status === "exact") return "Exact";
  if (m.status === "nearest") return `±${m.distance} cm`;
  if (m.status === "estimate") return "Estimate";
  return "No data";
}

/** One anchor, read back in every brand of a category. */
export default function SizePassport({
  category,
  gender,
  anchor,
  brands,
  charts,
  current,
}: {
  category: CategoryId;
  gender: ShopperGender;
  anchor: number;
  brands: LiteBrand[];
  charts: CategoryCharts;
  /** Brand to mark as "this page". */
  current?: string;
}) {
  const def = CATEGORIES[category];
  const secondary = def.regions.filter((r) => !r.primary);
  const rows = useMemo(
    () => passport(charts, brands, category, gender, anchor),
    [charts, brands, category, gender, anchor]
  );

  return (
    <div className="scroll-thin overflow-x-auto">
      <table className="w-full min-w-[480px] border-collapse">
        <thead>
          <tr className="border-b border-bone/12">
            <th className="kicker py-3 pr-4 text-left font-normal text-fog">Brand</th>
            <th className="kicker px-3 py-3 text-left font-normal text-fog">Your size</th>
            {secondary.map((r) => (
              <th key={r.key} className="kicker hidden px-3 py-3 text-left font-normal text-fog sm:table-cell">
                {r.label}
              </th>
            ))}
            <th className="kicker py-3 pl-3 text-right font-normal text-fog">Match</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(({ brand, match }) => {
            const here = brand.slug === current;
            return (
              <tr
                key={brand.slug}
                className={cn(
                  "group border-b border-bone/8 transition-colors hover:bg-coal",
                  here && "bg-graphite"
                )}
              >
                <td className="py-3 pr-4">
                  <Link
                    href={`/category/${category}/${brand.slug}`}
                    className="flex items-center gap-2 text-sm text-bone/85 transition-colors group-hover:text-bone"
                  >
                    {here && <span className="inline-block h-1.5 w-1.5 bg-signal" aria-label="This brand" />}
                    {brand.name}
                  </Link>
                </td>
                <td className="px-3 py-3 font-display text-lg font-light tabular text-bone">
                  {match.row ? rowPrimaryLabel(category, match.row) : "—"}
                </td>
                {secondary.map((r) => (
                  <td key={r.key} className="hidden px-3 py-3 font-mono text-xs text-fog tabular sm:table-cell">
                    {match.row ? regionValue(match.row, r.key) : "—"}
                  </td>
                ))}
                <td className="py-3 pl-3 text-right">
                  <span
                    className={cn(
                      "kicker inline-flex items-center gap-1.5",
                      match.status === "exact" ? "text-bone" : "text-fog"
                    )}
                  >
                    <span
                      className={cn(
                        "inline-block h-1.5 w-1.5",
                        match.status === "exact" && "bg-signal",
                        match.status === "nearest" && "border border-signal",
                        match.status === "estimate" && "border border-dashed border-fog"
                      )}
                    />
                    {matchNote(match)}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
