export type CategoryId = "sneakers" | "slides" | "tshirt" | "trousers";
export type RegionKey = "eu" | "uk" | "us" | "jpn" | "ind" | "label";
export type Gender = "men" | "women" | "unisex";

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
  anchorLabel: string;
  anchorUnit: string;
  anchorHint: string;
  anchorMin: number;
  anchorMax: number;
  anchorStep: number;
  fitNote: string;
  regions: RegionDef[];
}

export const CATEGORY_ORDER: CategoryId[] = [
  "sneakers",
  "slides",
  "tshirt",
  "trousers",
];

export const CATEGORIES: Record<CategoryId, CategoryDef> = {
  sneakers: {
    id: "sneakers",
    label: "Sneakers",
    nav: "SNEAKERS",
    tagline: "Sports shoes, runners & training silhouettes.",
    anchorLabel: "FOOT LENGTH",
    anchorUnit: "CM",
    anchorHint: "Heel to longest toe, standing, in cm.",
    anchorMin: 22,
    anchorMax: 31,
    anchorStep: 0.5,
    fitNote: "Independent charts — sneaker lasts run true-to-sport.",
    regions: [
      { key: "uk", label: "UK / IND", primary: true },
      { key: "us", label: "US" },
      { key: "eu", label: "EU" },
      { key: "jpn", label: "JPN (CM)" },
    ],
  },
  slides: {
    id: "slides",
    label: "Slides & Sandals",
    nav: "SLIDES",
    tagline: "Slides, sandals & open-fit footwear.",
    anchorLabel: "FOOT LENGTH",
    anchorUnit: "CM",
    anchorHint: "Heel to longest toe, standing, in cm.",
    anchorMin: 21,
    anchorMax: 31,
    anchorStep: 0.5,
    fitNote: "Slides fit roomier than sneakers — never convert across the two.",
    regions: [
      { key: "uk", label: "UK / IND", primary: true },
      { key: "us", label: "US" },
      { key: "eu", label: "EU" },
      { key: "jpn", label: "JPN (CM)" },
    ],
  },
  tshirt: {
    id: "tshirt",
    label: "T-Shirts",
    nav: "T-SHIRTS",
    tagline: "Tees, polos & casual tops.",
    anchorLabel: "CHEST",
    anchorUnit: "CM",
    anchorHint: "Around the fullest part of your chest.",
    anchorMin: 74,
    anchorMax: 140,
    anchorStep: 1,
    fitNote: "Anchored to chest width — alpha sizes differ wildly by brand.",
    regions: [
      { key: "label", label: "ALPHA SIZE", primary: true },
      { key: "ind", label: "CHEST (IN)" },
    ],
  },
  trousers: {
    id: "trousers",
    label: "Trousers & Jeans",
    nav: "TROUSERS",
    tagline: "Jeans, chinos & formal trousers.",
    anchorLabel: "WAIST",
    anchorUnit: "CM",
    anchorHint: "Natural waist, where the waistband sits.",
    anchorMin: 60,
    anchorMax: 130,
    anchorStep: 1,
    fitNote: "Waist drives the size; inseam (L30/32/34) picks freely afterwards.",
    regions: [
      { key: "ind", label: "WAIST (IN)", primary: true },
      { key: "eu", label: "EU" },
      { key: "label", label: "TAG SIZE" },
    ],
  },
};

export const GENDERS: { id: Gender; label: string }[] = [
  { id: "men", label: "MEN" },
  { id: "women", label: "WOMEN" },
];

export function isCategory(v: string): v is CategoryId {
  return v in CATEGORIES;
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

export function rowPrimaryLabel(cat: CategoryId, row: AnyRow): string {
  const key = primaryRegion(cat).key;
  let v = regionValue(row, key);
  if (v !== "—" && (key === "uk" || key === "us")) v = `${key.toUpperCase()} ${v}`;
  return v;
}
