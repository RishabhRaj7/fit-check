export type CategoryId =
  | "sneakers"
  | "running"
  | "slides"
  | "formal"
  | "tshirt"
  | "shirts"
  | "hoodies"
  | "kurtas"
  | "trousers"
  | "shorts";
export type RegionKey = "eu" | "uk" | "us" | "jpn" | "ind" | "label";
export type Gender = "men" | "women" | "unisex";
/** The two genders a shopper picks between; "unisex" is only a chart fallback. */
export type ShopperGender = "men" | "women";

/**
 * The body measurement a category is read against. Every category in a
 * group shares it — one foot length drives sneakers, running shoes, slides
 * and formal shoes alike.
 */
export type AnchorKey = "foot" | "chest" | "waist";
export type GroupId = "footwear" | "tops" | "bottoms";

/** Garment cut. Charts default to "regular"; brands may publish others. */
export type Fit = "slim" | "regular" | "relaxed" | "oversized";
export const FIT_ORDER: Fit[] = ["slim", "regular", "relaxed", "oversized"];
export const FIT_LABEL: Record<Fit, string> = {
  slim: "Slim",
  regular: "Regular",
  relaxed: "Relaxed",
  oversized: "Oversized",
};

export interface RegionDef {
  key: RegionKey;
  label: string;
  primary?: boolean;
}

export interface CategoryDef {
  id: CategoryId;
  group: GroupId;
  label: string;
  nav: string;
  tagline: string;
  anchorKey: AnchorKey;
  /** What the anchor measures, sentence case. */
  anchor: string;
  anchorUnit: "cm";
  anchorMin: number;
  anchorMax: number;
  anchorStep: number;
  /** Starting point for a fresh ruler. */
  anchorDefault: number;
  fitNote: string;
  /** Whether charts in this category come in fits (slim, oversized…). */
  hasFits: boolean;
  /** Three short steps for measuring yourself. */
  howTo: string[];
  regions: RegionDef[];
}

export interface GroupDef {
  id: GroupId;
  label: string;
  anchorKey: AnchorKey;
  categories: CategoryId[];
}

export const GROUPS: GroupDef[] = [
  { id: "footwear", label: "Footwear", anchorKey: "foot", categories: ["sneakers", "running", "slides", "formal"] },
  { id: "tops", label: "Tops", anchorKey: "chest", categories: ["tshirt", "shirts", "hoodies", "kurtas"] },
  { id: "bottoms", label: "Bottoms", anchorKey: "waist", categories: ["trousers", "shorts"] },
];

export const CATEGORY_ORDER: CategoryId[] = GROUPS.flatMap((g) => g.categories);

export const ANCHOR_LABEL: Record<AnchorKey, string> = {
  foot: "Foot length",
  chest: "Chest",
  waist: "Waist",
};

const FOOT_HOW_TO = [
  "Stand on a sheet of paper with your heel against a wall.",
  "Mark the tip of your longest toe — for most people that's the big toe.",
  "Measure wall to mark in centimetres. Do both feet; use the longer one.",
];
const CHEST_HOW_TO = [
  "Arms relaxed at your sides, breathing normally.",
  "Wrap the tape around the fullest part of your chest, under the armpits.",
  "Keep it level across your back and snug, not tight.",
];
const WAIST_HOW_TO = [
  "Find your natural waist — where your trousers actually sit.",
  "Wrap the tape around it, one finger's width of slack.",
  "Read the number where the tape meets its zero end.",
];

const FOOTWEAR_REGIONS: RegionDef[] = [
  { key: "uk", label: "UK / IND", primary: true },
  { key: "us", label: "US" },
  { key: "eu", label: "EU" },
  { key: "jpn", label: "JP (cm)" },
];
const FOOT = {
  anchorKey: "foot" as const,
  group: "footwear" as const,
  anchor: "Foot length",
  anchorUnit: "cm" as const,
  anchorMin: 21,
  anchorMax: 32,
  anchorStep: 0.5,
  anchorDefault: 26,
  hasFits: false,
  howTo: FOOT_HOW_TO,
  regions: FOOTWEAR_REGIONS,
};
const CHEST = {
  anchorKey: "chest" as const,
  group: "tops" as const,
  anchor: "Chest",
  anchorUnit: "cm" as const,
  anchorMin: 74,
  anchorMax: 140,
  anchorStep: 1,
  anchorDefault: 98,
  hasFits: true,
  howTo: CHEST_HOW_TO,
  regions: [
    { key: "label" as const, label: "Size", primary: true },
    { key: "ind" as const, label: "Chest (in)" },
  ],
};
const WAIST = {
  anchorKey: "waist" as const,
  group: "bottoms" as const,
  anchor: "Waist",
  anchorUnit: "cm" as const,
  anchorMin: 60,
  anchorMax: 130,
  anchorStep: 1,
  anchorDefault: 82,
  hasFits: true,
  howTo: WAIST_HOW_TO,
  regions: [
    { key: "ind" as const, label: "Waist (in)", primary: true },
    { key: "eu" as const, label: "EU" },
    { key: "label" as const, label: "Tag" },
  ],
};

export const CATEGORIES: Record<CategoryId, CategoryDef> = {
  sneakers: {
    ...FOOT,
    id: "sneakers",
    label: "Lifestyle Sneakers",
    nav: "Sneakers",
    tagline: "Court, skate and everyday sneakers — Air Force 1, Samba, Chuck Taylor.",
    fitNote: "Lifestyle lasts often run larger than running shoes from the same brand.",
  },
  running: {
    ...FOOT,
    id: "running",
    label: "Running & Sports",
    nav: "Running",
    tagline: "Running, training and court-sport shoes.",
    fitNote: "Running shoes want a thumb's width at the toe — many runners go half a size up.",
  },
  slides: {
    ...FOOT,
    id: "slides",
    label: "Slides & Sandals",
    nav: "Slides",
    tagline: "Slides, sandals, flip-flops and clogs.",
    fitNote: "Many slides only come in whole sizes — between two, go up.",
  },
  formal: {
    ...FOOT,
    id: "formal",
    label: "Formal & Casual Shoes",
    nav: "Formal",
    tagline: "Leather shoes, loafers, boots and casual lace-ups.",
    fitNote: "Leather stretches a little; a snug first fit loosens with wear.",
  },
  tshirt: {
    ...CHEST,
    id: "tshirt",
    label: "T-Shirts & Polos",
    nav: "T-Shirts",
    tagline: "Tees, polos and casual tops.",
    fitNote: "An M in one brand is an L in another — and oversized cuts shift it again.",
  },
  shirts: {
    ...CHEST,
    id: "shirts",
    label: "Shirts",
    nav: "Shirts",
    tagline: "Casual and formal shirts — alpha or collar sizes.",
    fitNote: "Formal shirts are sized by collar; the chest sets which collar fits.",
    regions: [
      { key: "label", label: "Size", primary: true },
      { key: "eu", label: "Collar (cm)" },
      { key: "ind", label: "Chest (in)" },
    ],
  },
  hoodies: {
    ...CHEST,
    id: "hoodies",
    label: "Hoodies & Jackets",
    nav: "Hoodies",
    tagline: "Sweatshirts, hoodies and jackets.",
    fitNote: "Outerwear is cut roomier; oversized hoodies usually mean a size down.",
  },
  kurtas: {
    ...CHEST,
    id: "kurtas",
    label: "Kurtas & Ethnic",
    nav: "Kurtas",
    tagline: "Kurtas, kurtis and ethnic tops.",
    fitNote: "Ethnic sizing varies widely between labels — the chest decides.",
  },
  trousers: {
    ...WAIST,
    id: "trousers",
    label: "Jeans & Trousers",
    nav: "Jeans",
    tagline: "Jeans, chinos and formal trousers.",
    fitNote: "Waist decides the size; pick the inseam (L30 / L32 / L34) separately.",
  },
  shorts: {
    ...WAIST,
    id: "shorts",
    label: "Shorts & Joggers",
    nav: "Shorts",
    tagline: "Shorts, joggers and track pants.",
    fitNote: "Elastic waists forgive — alpha sizes follow the waist band.",
    regions: [
      { key: "label", label: "Size", primary: true },
      { key: "ind", label: "Waist (in)" },
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

export function isFit(v: string): v is Fit {
  return (FIT_ORDER as string[]).includes(v);
}

export function groupOf(cat: CategoryId): GroupDef {
  return GROUPS.find((g) => g.categories.includes(cat))!;
}

/** Categories that share this one's body anchor (including itself). */
export function siblingsOf(cat: CategoryId): CategoryId[] {
  return groupOf(cat).categories;
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

/** "UK 8", "M", "W32" — the label a shopper reads off the tag. */
export function rowPrimaryLabel(cat: CategoryId, row: AnyRow): string {
  // Alpha-sized bottoms (S, M, L…) read by their letter, not a waist range.
  if (CATEGORIES[cat].anchorKey === "waist" && row.label && !/^W\d/.test(row.label)) return row.label;
  const key = primaryRegion(cat).key;
  const v = regionValue(row, key);
  if (v === "—") return v;
  if (key === "uk" || key === "us") return `${key.toUpperCase()} ${v}`;
  if (key === "ind" && CATEGORIES[cat].anchorKey === "waist") return `W${v}`;
  return v;
}

export function formatCm(v: number): string {
  return (Math.round(v * 10) / 10).toFixed(1);
}
