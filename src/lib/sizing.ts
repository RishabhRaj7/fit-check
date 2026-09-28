/**
 * The sizing engine — pure, dependency-free, runs on the server and in the
 * browser alike.
 *
 * Every brand chart is a list of rows keyed by one neutral body measurement
 * (the "anchor": foot length, chest or waist in cm). Converting is a
 * nearest-row lookup against the target brand's own chart. When the target
 * has no chart for the category, sibling brands vote on an estimate.
 */
import {
  primaryRegion,
  regionValue,
  type CategoryId,
  type Gender,
} from "@/lib/categories";

export interface SizeRow {
  anchorValue: number;
  eu: string | null;
  uk: string | null;
  us: string | null;
  jpn: string | null;
  ind: string | null;
  label: string | null;
}

/** brandSlug → gender → rows (sorted by anchorValue). One category's worth. */
export type CategoryCharts = Record<string, Partial<Record<Gender, SizeRow[]>>>;

export interface LiteBrand {
  slug: string;
  name: string;
}

export type MatchStatus = "exact" | "nearest" | "estimate" | "none";

export interface Match {
  status: MatchStatus;
  row: SizeRow | null;
  /** Gender whose chart answered (may differ from the one asked for). */
  genderUsed: Gender | null;
  /** |anchor − row.anchorValue| in cm, rounded to 0.1. */
  distance: number;
  /** For estimates: the brands that voted. */
  basedOn: string[];
  /** True when the anchor sits outside the chart's range. */
  outOfRange: boolean;
}

/** Tolerance under which a row counts as an exact hit. */
const EXACT_CM = 0.05;

/** Preferred gender first, then the fallbacks Indian retail actually uses. */
export function genderChain(gender: Gender): Gender[] {
  return gender === "women" ? ["women", "unisex", "men"] : ["men", "unisex", "women"];
}

export function chartFor(
  charts: CategoryCharts,
  brandSlug: string,
  gender: Gender
): { rows: SizeRow[]; genderUsed: Gender } | null {
  const byGender = charts[brandSlug];
  if (!byGender) return null;
  for (const g of genderChain(gender)) {
    const rows = byGender[g];
    if (rows && rows.length > 0) return { rows, genderUsed: g };
  }
  return null;
}

export function nearestRow(rows: SizeRow[], anchor: number): { row: SizeRow; distance: number } {
  let best = rows[0];
  let bestD = Math.abs(anchor - best.anchorValue);
  for (const r of rows) {
    const d = Math.abs(anchor - r.anchorValue);
    if (d < bestD) {
      best = r;
      bestD = d;
    }
  }
  return { row: best, distance: bestD };
}

const round1 = (n: number) => Math.round(n * 10) / 10;

export function convert(
  charts: CategoryCharts,
  brands: LiteBrand[],
  category: CategoryId,
  brandSlug: string,
  gender: Gender,
  anchor: number
): Match {
  const own = chartFor(charts, brandSlug, gender);
  if (own) {
    const { row, distance } = nearestRow(own.rows, anchor);
    const first = own.rows[0].anchorValue;
    const last = own.rows[own.rows.length - 1].anchorValue;
    return {
      status: distance <= EXACT_CM ? "exact" : "nearest",
      row,
      genderUsed: own.genderUsed,
      distance: round1(distance),
      basedOn: [],
      outOfRange: anchor < first - 0.5 || anchor > last + 0.5,
    };
  }

  // No chart for the target — let sibling brands vote on the primary label.
  const key = primaryRegion(category).key;
  const votes: { label: string; row: SizeRow; name: string }[] = [];
  for (const b of brands) {
    if (b.slug === brandSlug) continue;
    const c = chartFor(charts, b.slug, gender);
    if (!c) continue;
    const { row } = nearestRow(c.rows, anchor);
    const label = regionValue(row, key);
    if (label !== "—") votes.push({ label, row, name: b.name });
    if (votes.length >= 8) break;
  }
  if (votes.length === 0) {
    return { status: "none", row: null, genderUsed: null, distance: 0, basedOn: [], outOfRange: false };
  }
  const tally = new Map<string, number>();
  for (const v of votes) tally.set(v.label, (tally.get(v.label) ?? 0) + 1);
  let winner = votes[0].label;
  let best = 0;
  for (const [label, n] of tally) {
    if (n > best) {
      winner = label;
      best = n;
    }
  }
  const rep = votes.find((v) => v.label === winner) ?? votes[0];
  return {
    status: "estimate",
    row: rep.row,
    genderUsed: null,
    distance: 0,
    basedOn: votes.map((v) => v.name),
    outOfRange: false,
  };
}

/** Convert once for every brand in the category — the "size passport". */
export function passport(
  charts: CategoryCharts,
  brands: LiteBrand[],
  category: CategoryId,
  gender: Gender,
  anchor: number
): { brand: LiteBrand; match: Match }[] {
  return brands.map((brand) => ({
    brand,
    match: convert(charts, brands, category, brand.slug, gender, anchor),
  }));
}
