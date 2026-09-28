/**
 * Helpers for transcribing published size charts.
 *
 * Every chart is typed in as the brand prints it — space-separated columns
 * copied straight off the source page — and converted to rows here, so the
 * data files stay easy to check against the original.
 */
import type { CategoryId, Fit, Gender } from "@/lib/categories";
import type { SizeRow } from "@/lib/sizing";

export interface ChartSeed {
  category: CategoryId;
  gender: Gender;
  fit?: Fit;
  rows: SizeRow[];
  source: string;
  sourceUrl: string;
  /** "garment" when the brand only publishes garment measurements. */
  basis?: "body" | "garment";
}

export interface BrandSeed {
  name: string;
  slug: string;
  priority: number;
  categories: CategoryId[];
  charts: ChartSeed[];
}

export interface Source {
  source: string;
  sourceUrl: string;
}

const IN = 2.54;
const r1 = (n: number) => Math.round(n * 10) / 10;
const cols = (s: string) => s.trim().split(/\s+/);

/** "37.5-41" | "37.5" | "1/2" fractions → [lo, hi] in the given unit. */
function range(token: string): [number, number] {
  const num = (x: string) => {
    const [whole, frac] = x.split("+");
    if (!frac) return Number(whole);
    const [a, b] = frac.split("/").map(Number);
    return Number(whole) + a / b;
  };
  const [lo, hi] = token.split("-");
  return [num(lo), num(hi ?? lo)];
}

const inches = (lo: number, hi: number) =>
  lo === hi ? `${r1(lo)}` : `${r1(lo)}–${r1(hi)}`;

/* ─────────────────────────────── footwear ─────────────────────────────── */

/**
 * Footwear chart from parallel columns. `cm` is the foot length the brand
 * prints for each size (heel to toe). Missing columns may be omitted.
 */
export function shoes(c: {
  uk: string;
  us?: string;
  eu?: string;
  cm: string;
  /** false = brand prints no JP size; a string = JP column when it isn't the foot length. */
  jp?: boolean | string;
}): SizeRow[] {
  const uk = cols(c.uk);
  const us = c.us ? cols(c.us) : [];
  const eu = c.eu ? cols(c.eu) : [];
  const cm = cols(c.cm).map(Number);
  const jp = typeof c.jp === "string" ? cols(c.jp) : null;
  if (cm.length !== uk.length) throw new Error(`shoes(): ${uk.length} UK vs ${cm.length} cm columns`);
  return uk.map((u, i) => ({
    anchorValue: cm[i],
    uk: u,
    us: us[i] && us[i] !== "-" ? us[i] : null,
    eu: eu[i] && eu[i] !== "-" ? eu[i].replace("_", " ") : null,
    jpn: jp ? jp[i] : c.jp === false ? null : String(cm[i]),
    ind: u,
    label: null,
  }));
}

/**
 * A line that fits differently from the brand's master chart (e.g. "runs
 * large — order half a size down"). Each size is re-anchored to the foot
 * length of the size `steps` rows away in the same chart.
 */
export function shifted(rows: SizeRow[], steps: number): SizeRow[] {
  return rows
    .map((r, i) => {
      const j = i + steps;
      if (j < 0 || j >= rows.length) return null;
      return { ...r, anchorValue: rows[j].anchorValue };
    })
    .filter((r): r is SizeRow => r !== null);
}

/* ─────────────────────────────── apparel ─────────────────────────────── */

/**
 * Alpha-sized tops from a body chest (or bust) row.
 * `ranges` are "lo-hi" tokens in `unit`; the anchor is the midpoint in cm.
 */
export function tops(labels: string, ranges: string, unit: "cm" | "in", extra?: { eu?: string }): SizeRow[] {
  const L = cols(labels);
  const R = cols(ranges).map(range);
  const E = extra?.eu ? cols(extra.eu) : [];
  if (L.length !== R.length) throw new Error(`tops(): ${L.length} labels vs ${R.length} ranges`);
  return L.map((label, i) => {
    const [lo, hi] = R[i];
    const loCm = unit === "cm" ? lo : lo * IN;
    const hiCm = unit === "cm" ? hi : hi * IN;
    return {
      anchorValue: r1((loCm + hiCm) / 2),
      label: label.replace(/_/g, " "),
      ind: inches(loCm / IN, hiCm / IN),
      eu: E[i] ?? null,
      uk: null,
      us: null,
      jpn: null,
    };
  });
}

/**
 * Tops from GARMENT measurements (what some brands publish instead of body
 * sizes). Body chest ≈ garment chest − ease; `halfChest` is the flat,
 * armpit-to-armpit width in cm. Charts built this way carry basis "garment".
 */
export const EASE_CM = { slim: 6, regular: 10, relaxed: 16, oversized: 24 } as const;
export function garmentTops(labels: string, halfChest: string, ease: number): SizeRow[] {
  const L = cols(labels);
  const H = cols(halfChest).map(Number);
  if (L.length !== H.length) throw new Error(`garmentTops(): ${L.length} labels vs ${H.length} widths`);
  return L.map((label, i) => {
    const body = r1(H[i] * 2 - ease);
    return { anchorValue: body, label, ind: `${r1(body / IN)}`, eu: null, uk: null, us: null, jpn: null };
  });
}

/** Waist-sized bottoms. `labels` are what's on the tag (28, 30… or S, M…). */
export function bottoms(labels: string, waists: string, unit: "cm" | "in", extra?: { eu?: string }): SizeRow[] {
  const L = cols(labels);
  const W = cols(waists).map(range);
  const E = extra?.eu ? cols(extra.eu) : [];
  if (L.length !== W.length) throw new Error(`bottoms(): ${L.length} labels vs ${W.length} waists`);
  return L.map((label, i) => {
    const [lo, hi] = W[i];
    const loCm = unit === "cm" ? lo : lo * IN;
    const hiCm = unit === "cm" ? hi : hi * IN;
    const numeric = /^\d+$/.test(label);
    return {
      anchorValue: r1((loCm + hiCm) / 2),
      label: numeric ? `W${label}` : label.replace(/_/g, " "),
      ind: numeric ? label : inches(loCm / IN, hiCm / IN),
      eu: E[i] ?? null,
      uk: null,
      us: null,
      jpn: null,
    };
  });
}

/** Build a set of charts that share one source. */
export function from(src: Source) {
  return (
    category: CategoryId,
    gender: Gender,
    rows: SizeRow[],
    opts: { fit?: Fit; basis?: "body" | "garment" } = {}
  ): ChartSeed => ({ category, gender, rows, ...src, ...opts });
}
