/**
 * Server-side read model.
 *
 * Firestore layout:
 *   brands/{slug}                        { name, slug, categories[], priority, needsData, logoUrl? }
 *   charts/{slug}__{category}__{gender}  { brandSlug, brandName, category, gender, needsData,
 *                                          updatedAt, updatedBy, rows: SizeRow[] }
 *   products/{autoId}                    { brandSlug, category, name, priceInr }
 *   users/{uid}                          { sizeProfile: { "{category}:{gender}": entry }, updatedAt }
 *
 * The whole public catalogue is ~100 small documents, so instead of querying
 * per page (and per slider drag) we read it once, keep it in memory for a
 * minute, and derive everything from that snapshot. Admin edits go straight
 * to Firestore from the browser and show up on the site within CACHE_MS.
 */
import { collection, getDocs } from "firebase/firestore";
import { getFsWeb } from "@/lib/firebase/app";
import {
  CATEGORY_ORDER,
  isCategory,
  type CategoryId,
  type Gender,
} from "@/lib/categories";
import type { CategoryCharts, LiteBrand, SizeRow } from "@/lib/sizing";

export interface Brand {
  slug: string;
  name: string;
  logoUrl: string | null;
  categories: CategoryId[];
  priority: number;
  needsData: boolean;
}

export interface Chart {
  id: string;
  brandSlug: string;
  brandName: string;
  category: CategoryId;
  gender: Gender;
  needsData: boolean;
  updatedAt: string;
  updatedBy: string | null;
  rows: SizeRow[];
}

export interface Product {
  id: string;
  brandSlug: string;
  category: string;
  name: string;
  priceInr: number | null;
}

export interface Catalog {
  brands: Brand[];
  charts: Chart[];
  products: Product[];
}

const CACHE_MS = 60_000;
let cached: { at: number; data: Catalog } | null = null;
let inflight: Promise<Catalog> | null = null;

const str = (v: unknown, d = "") => (typeof v === "string" ? v : d);
const strOrNull = (v: unknown) => (typeof v === "string" && v.trim() !== "" ? v : null);

function toRow(r: Record<string, unknown>): SizeRow {
  return {
    anchorValue: Number(r.anchorValue),
    eu: strOrNull(r.eu),
    uk: strOrNull(r.uk),
    us: strOrNull(r.us),
    jpn: strOrNull(r.jpn),
    ind: strOrNull(r.ind),
    label: strOrNull(r.label),
  };
}

async function load(): Promise<Catalog> {
  const fs = getFsWeb();
  const [b, c, p] = await Promise.all([
    getDocs(collection(fs, "brands")),
    getDocs(collection(fs, "charts")),
    getDocs(collection(fs, "products")),
  ]);

  const brands: Brand[] = b.docs
    .map((d) => {
      const x = d.data();
      return {
        slug: str(x.slug, d.id),
        name: str(x.name, d.id),
        logoUrl: strOrNull(x.logoUrl),
        categories: (Array.isArray(x.categories) ? x.categories : []).filter(
          (c: unknown): c is CategoryId => typeof c === "string" && isCategory(c)
        ),
        priority: typeof x.priority === "number" ? x.priority : 0,
        needsData: x.needsData === true,
      };
    })
    .sort((a, z) => z.priority - a.priority || a.name.localeCompare(z.name));

  const charts: Chart[] = [];
  for (const d of c.docs) {
    const x = d.data();
    const category = str(x.category);
    if (!isCategory(category)) continue;
    const rows = (Array.isArray(x.rows) ? x.rows : [])
      .map(toRow)
      .filter((r: SizeRow) => Number.isFinite(r.anchorValue))
      .sort((a: SizeRow, z: SizeRow) => a.anchorValue - z.anchorValue);
    charts.push({
      id: d.id,
      brandSlug: str(x.brandSlug),
      brandName: str(x.brandName, str(x.brandSlug)),
      category,
      gender: (str(x.gender, "men") as Gender),
      needsData: x.needsData === true,
      updatedAt: str(x.updatedAt, new Date(0).toISOString()),
      updatedBy: strOrNull(x.updatedBy),
      rows,
    });
  }

  const products: Product[] = p.docs.map((d) => {
    const x = d.data();
    return {
      id: d.id,
      brandSlug: str(x.brandSlug),
      category: str(x.category),
      name: str(x.name),
      priceInr: typeof x.priceInr === "number" ? x.priceInr : null,
    };
  });

  return { brands, charts, products };
}

/** `fresh` skips the cache (the admin deck always wants the live data). */
export async function getCatalog(opts: { fresh?: boolean } = {}): Promise<Catalog> {
  if (!opts.fresh && cached && Date.now() - cached.at < CACHE_MS) return cached.data;
  if (!inflight) {
    inflight = load()
      .then((data) => {
        cached = { at: Date.now(), data };
        return data;
      })
      .finally(() => {
        inflight = null;
      });
  }
  // Serve stale data rather than fail if a refresh errors.
  try {
    return await inflight;
  } catch (e) {
    if (cached) return cached.data;
    throw e;
  }
}

/* ------------------------------------------------------------- selectors */

export function brandsIn(cat: Catalog, category: CategoryId): Brand[] {
  return cat.brands.filter((b) => b.categories.includes(category));
}

export function liteBrands(list: Brand[]): LiteBrand[] {
  return list.map((b) => ({ slug: b.slug, name: b.name }));
}

/** Rows for one category, shaped for the sizing engine (and the browser). */
export function chartsIn(cat: Catalog, category: CategoryId): CategoryCharts {
  const out: CategoryCharts = {};
  for (const c of cat.charts) {
    if (c.category !== category || c.rows.length === 0) continue;
    (out[c.brandSlug] ??= {})[c.gender] = c.rows;
  }
  return out;
}

export function allCategoryCharts(cat: Catalog): Record<CategoryId, CategoryCharts> {
  return Object.fromEntries(
    CATEGORY_ORDER.map((c) => [c, chartsIn(cat, c)])
  ) as Record<CategoryId, CategoryCharts>;
}

export function allCategoryBrands(cat: Catalog): Record<CategoryId, LiteBrand[]> {
  return Object.fromEntries(
    CATEGORY_ORDER.map((c) => [c, liteBrands(brandsIn(cat, c))])
  ) as Record<CategoryId, LiteBrand[]>;
}

export function stats(cat: Catalog) {
  const withRows = cat.charts.filter((c) => c.rows.length > 0);
  return {
    brands: cat.brands.length,
    charts: withRows.length,
    rows: withRows.reduce((n, c) => n + c.rows.length, 0),
  };
}
