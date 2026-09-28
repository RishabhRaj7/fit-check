"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import BrandMark from "@/components/BrandMark";
import { formatCm, rowPrimaryLabel, type CategoryId } from "@/lib/categories";
import { cn } from "@/lib/format";
import { entryFor, useProfile } from "@/lib/profile";
import { convert, type CategoryCharts, type LiteBrand } from "@/lib/sizing";
import { matchNote } from "@/components/SizePassport";

export interface ListBrand extends LiteBrand {
  logoUrl: string | null;
  genders: string[];
}

/**
 * Brands in a category. With a saved anchor, each row carries your size in
 * that brand — the list becomes a shopping cheat-sheet.
 */
export default function CategoryBrandList({
  category,
  brands,
  charts,
}: {
  category: CategoryId;
  brands: ListBrand[];
  charts: CategoryCharts;
}) {
  const { profile, gender, ready } = useProfile();
  const saved = entryFor(profile, category, gender);
  const [q, setQ] = useState("");

  const lite = useMemo(() => brands.map(({ slug, name }) => ({ slug, name })), [brands]);
  const shown = brands.filter((b) => b.name.toLowerCase().includes(q.trim().toLowerCase()));

  return (
    <div>
      <div className="flex flex-col justify-between gap-4 border-b border-bone/12 pb-5 md:flex-row md:items-end">
        {ready && saved ? (
          <p className="kicker text-fog">
            Your anchor · <span className="text-bone">{formatCm(saved.entry.anchorValue)} cm</span>{" "}
            {saved.gender !== gender && `(${saved.gender})`}
            {saved.entry.sourceBrandSlug !== "measured" &&
              ` · via ${saved.entry.sourceBrandName ?? ""} ${saved.entry.sourceSizeLabel}`}{" "}
            ·{" "}
            <Link href="/profile" className="underline underline-offset-4 hover:text-bone">
              edit
            </Link>
          </p>
        ) : (
          <p className="kicker text-fog">
            {brands.length} brands ·{" "}
            <Link href="/onboarding" className="text-bone underline underline-offset-4 hover:text-frost">
              Save your size
            </Link>{" "}
            to see it on every row
          </p>
        )}
        <label className="relative block md:w-72">
          <span className="sr-only">Filter brands</span>
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Filter brands"
            className="kicker h-10 w-full border border-bone/15 bg-transparent px-3 text-bone placeholder:text-fog outline-none focus:border-signal"
          />
        </label>
      </div>

      <ul>
        {shown.map((b) => {
          const m = saved ? convert(charts, lite, category, b.slug, saved.gender, saved.entry.anchorValue) : null;
          return (
            <li key={b.slug}>
              <Link
                href={`/category/${category}/${b.slug}`}
                className="group grid grid-cols-[auto_1fr_auto] items-center gap-4 border-b border-bone/10 py-4 transition-colors hover:bg-coal md:grid-cols-12 md:gap-6 md:py-5"
              >
                <BrandMark name={b.name} logoUrl={b.logoUrl} className="h-11 w-11 text-sm md:col-span-1" />
                <span className="font-display text-xl font-light tracking-[-0.01em] text-bone md:col-span-4 md:text-2xl">
                  {b.name}
                </span>
                <span className="kicker hidden items-center gap-2 text-fog md:col-span-3 md:flex">
                  <span
                    className={cn("inline-block h-1.5 w-1.5", b.genders.length ? "bg-bone" : "border border-signal")}
                  />
                  {b.genders.length ? `Chart · ${[...b.genders].sort().join(" + ")}` : "Estimates only"}
                </span>
                <span className="md:col-span-3 md:text-right">
                  {m?.row ? (
                    <span className="flex flex-col items-end">
                      <span className="font-display text-xl font-light tabular text-bone">
                        {rowPrimaryLabel(category, m.row)}
                      </span>
                      <span className="kicker text-fog">{matchNote(m)}</span>
                    </span>
                  ) : null}
                </span>
                <span className="hidden justify-end pr-2 font-mono text-fog transition-all group-hover:translate-x-1 group-hover:text-frost md:col-span-1 md:flex">
                  →
                </span>
              </Link>
            </li>
          );
        })}
        {shown.length === 0 && <li className="py-10 text-sm text-fog">No brand matches “{q}”.</li>}
      </ul>
    </div>
  );
}
