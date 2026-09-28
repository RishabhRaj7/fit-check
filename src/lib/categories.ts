export type CategoryId = "sneakers" | "slides" | "tshirt" | "trousers";
export type RegionKey = "eu" | "uk" | "us" | "jpn" | "ind" | "label";
export type Gender = "men" | "women" | "unisex";
/** The two genders a shopper picks between; "unisex" is only a chart fallback. */
export type ShopperGender = "men" | "women";

export interface RegionDef {
  key: RegionKey;
  label: string;
  primary?: boolean;
}

export interface CategoryDef {
  id: CategoryId;
  label: string;
  nav: string;
  tagline: string;
  /** What the anchor measures, sentence case. */
  anchor: string;
  anchorUnit: "cm";
  anchorMin: number;
  anchorMax: number;
  anchorStep: number;
  /** Starting point for a fresh ruler. */
  anchorDefault: number;
  fitNote: string;
  /** Three short steps for measuring yourself. */
  howTo: string[];
  regions: RegionDef[];
}

export const CATEGORY_ORDER: CategoryId[] = ["sneakers", "slides", "tshirt", "trousers"];

const FOOT_HOW_TO = [
  "Stand on a sheet of paper with your heel against a wall.",
  "Mark the tip of your longest toe — for most people that's the big toe.",
  "Measure wall to mark in centimetres. Do both feet; use the longer one.",
];

const FOOTWEAR_REGIONS: RegionDef[] = [
  { key: "uk", label: "UK / IND", primary: true },
  { key: "us", label: "US" },
  { key: "eu", label: "EU" },
  { key: "jpn", label: "JP (cm)" },
];

export const CATEGORIES: Record<CategoryId, CategoryDef> = {
  sneakers: {
    id: "sneakers",
    label: "Sneakers",
    nav: "Sneakers",
    tagline: "Runners, trainers and everyday sneakers.",
    anchor: "Foot length",
    anchorUnit: "cm",
    anchorMin: 22,
    anchorMax: 31,
    anchorStep: 0.5,
    anchorDefault: 26,
    fitNote: "Sneaker charts are read on their own — never borrowed from slides.",
    howTo: FOOT_HOW_TO,
    regions: FOOTWEAR_REGIONS,
  },
  slides: {
    id: "slides",
    label: "Slides & Sandals",
    nav: "Slides",
    tagline: "Slides, sandals and open footwear.",
    anchor: "Foot length",
    anchorUnit: "cm",
    anchorMin: 21,
    anchorMax: 31,
    anchorStep: 0.5,
    anchorDefault: 26,
    fitNote: "Slides run roomier than sneakers, so they keep their own anchor.",
    howTo: FOOT_HOW_TO,
    regions: FOOTWEAR_REGIONS,
  },
  tshirt: {
    id: "tshirt",
    label: "T-Shirts",
    nav: "T-Shirts",
    tagline: "Tees, polos and casual tops.",
    anchor: "Chest",
    anchorUnit: "cm",
    anchorMin: 74,
    anchorMax: 140,
    anchorStep: 1,
    anchorDefault: 98,
    fitNote: "Anchored to chest girth — an M in one brand is an L in another.",
    howTo: [
      "Arms relaxed at your sides, breathing normally.",
      "Wrap the tape around the fullest part of your chest, under the armpits.",
      "Keep it level across your back and snug, not tight.",
    ],
    regions: [
      { key: "label", label: "Size", primary: true },
      { key: "ind", label: "Chest (in)" },
    ],
  },
  trousers: {
    id: "trousers",
    label: "Trousers & Jeans",
    nav: "Trousers",
    tagline: "Jeans, chinos and formal trousers.",
    anchor: "Waist",
    anchorUnit: "cm",
    anchorMin: 60,
    anchorMax: 130,
    anchorStep: 1,
    anchorDefault: 82,
    fitNote: "Waist decides the size; pick the inseam (L30 / L32 / L34) separately.",
    howTo: [
      "Find your natural waist — where your trousers actually sit.",
      "Wrap the tape around it, one finger's width of slack.",
      "Read the number where the tape meets its zero end.",
    ],
    regions: [
      { key: "ind", label: "Waist (in)", primary: true },
      { key: "eu", label: "EU" },
      { key: "label", label: "Tag" },
    ],
  },
};

export const GENDERS: { id: ShopperGender; label: string }[] = [
  { id: "men", label: "Men" },
  { id: "women", label: "Women" },
];

export function isCategory(v: string): v is CategoryId {
  return Object.prototype.hasOwnProperty.call(CATEGORIES, v);
}

export function primaryRegion(cat: CategoryId): RegionDef {
  return CATEGORIES[cat].regions.find((r) => r.primary) ?? CATEGORIES[cat].regions[0];
}

export interface AnyRow {
  eu?: string | null;
  uk?: string | null;
  us?: string | null;
  jpn?: string | null;
  ind?: string | null;
  label?: string | null;
  anchorValue: number;
}

export function regionValue(row: AnyRow, key: RegionKey): string {
  const v = row[key];
  if (v && v.trim() !== "") return v;
  if (key === "label" && row.uk) return `UK ${row.uk}`;
  return "—";
}

/** "UK 8", "M", "32" — the label a shopper reads off the tag. */
export function rowPrimaryLabel(cat: CategoryId, row: AnyRow): string {
  const key = primaryRegion(cat).key;
  const v = regionValue(row, key);
  if (v === "—") return v;
  if (key === "uk" || key === "us") return `${key.toUpperCase()} ${v}`;
  if (cat === "trousers" && key === "ind") return `W${v}`;
  return v;
}

export function formatCm(v: number): string {
  return (Math.round(v * 10) / 10).toFixed(1);
}
