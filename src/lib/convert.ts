import type { AnyRow } from "@/lib/categories";
import { primaryRegion, regionValue } from "@/lib/categories";
import {
  brandsForCategory,
  getBrandBySlug,
  getChartChain,
  listBrands,
} from "@/lib/queries";

export type ConvertStatus = "exact" | "nearest" | "estimate" | "empty";

export interface ConvertedRow {
  eu: string | null;
  uk: string | null;
  us: string | null;
  jpn: string | null;
  ind: string | null;
  label: string | null;
  anchorValue: number;
}

export interface ConvertResult {
  status: ConvertStatus;
  genderUsed?: string;
  row?: ConvertedRow;
  distance?: number;
  estimate?: ConvertedRow & { basedOn: string[] };
}

function toConverted(r: AnyRow): ConvertedRow {
  return {
    eu: r.eu ?? null,
    uk: r.uk ?? null,
    us: r.us ?? null,
    jpn: r.jpn ?? null,
    ind: r.ind ?? null,
    label: r.label ?? null,
    anchorValue: r.anchorValue,
  };
}

function nearest(rows: AnyRow[], anchorValue: number): { row: AnyRow; distance: number } {
  let best = rows[0];
  let bestD = Math.abs(anchorValue - rows[0].anchorValue);
  for (const r of rows) {
    const d = Math.abs(anchorValue - r.anchorValue);
    if (d < bestD) {
      best = r;
      bestD = d;
    }
  }
  return { row: best, distance: bestD };
}

export async function convertSize(opts: {
  category: string;
  gender: string;
  anchorValue: number;
  brandSlug: string;
}): Promise<ConvertResult> {
  const brand = await getBrandBySlug(opts.brandSlug);
  if (!brand) return { status: "empty" };

  const found = await getChartChain(brand.slug, opts.category, opts.gender);
  if (found && found.chart.rows.length > 0) {
    const { row, distance } = nearest(found.chart.rows, opts.anchorValue);
    return {
      status: distance <= 0.05 ? "exact" : "nearest",
      genderUsed: found.genderUsed,
      row: toConverted(row),
      distance: Math.round(distance * 10) / 10,
    };
  }

  // Data gap on the target brand — infer from sibling brands in the same category.
  const all = await listBrands();
  const siblings = brandsForCategory(all, opts.category)
    .filter((b) => b.slug !== opts.brandSlug)
    .slice(0, 8);

  const votes: { label: string; row: ConvertedRow; name: string }[] = [];
  const primaryKey = primaryRegion(
    opts.category as Parameters<typeof primaryRegion>[0]
  ).key;

  for (const b of siblings) {
    const f = await getChartChain(b.slug, opts.category, opts.gender);
    if (!f || f.chart.rows.length === 0) continue;
    const { row } = nearest(f.chart.rows, opts.anchorValue);
    const v = regionValue(row, primaryKey);
    if (v === "—") continue;
    votes.push({ label: v, row: toConverted(row), name: b.name });
  }

  if (votes.length > 0) {
    const tally = new Map<string, number>();
    for (const v of votes) tally.set(v.label, (tally.get(v.label) ?? 0) + 1);
    let best = votes[0].label;
    let bestN = 0;
    for (const [label, n] of tally) if (n > bestN) (best = label), (bestN = n);
    const rep = votes.find((v) => v.label === best) ?? votes[0];
    return {
      status: "estimate",
      estimate: {
        ...rep.row,
        basedOn: votes.map((v) => v.name),
      },
    };
  }

  return { status: "empty" };
}
