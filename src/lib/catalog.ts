/**
 * Server-side read model.
 *
 * Firestore layout:
 *   brands/{slug}                        { name, slug, categories[], priority, needsData, logoUrl? }
 *   charts/{slug}__{category}__{gender}[__{fit}]
 *                                        { brandSlug, brandName, category, gender, fit, needsData,
 *                                          source?, sourceUrl?, basis?, updatedAt, updatedBy,
 *                                          rows: SizeRow[] }
 *   (the fit suffix is omitted for "regular", so pre-fit chart ids still resolve)
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
  isFit,
  siblingsOf,
  type CategoryId,
  type Fit,
  type Gender,
} from "@/lib/categories";
import { FALLBACK_PREFIX, type CategoryCharts, type LiteBrand, type SizeRow } from "@/lib/sizing";

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
  fit: Fit;
  needsData: boolean;
  /** Where the numbers came from, e.g. "nike.com size chart". */
  source: string | null;
  sourceUrl: string | null;
  /** "body" charts list body measurements; "garment" ones were converted. */
  basis: "body" | "garment";
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

/**
 * CATALOG_SOURCE=local builds the catalogue from the seed files instead of
 * Firestore — for previewing data changes before syncing it from /admin.
 */
async function loadLocal(): Promise<Catalog> {
  const [{ CATALOG }, { PRODUCTS }, { chartDocId }] = await Promise.all([
    import("@/db/catalog"),
    import("@/db/catalog/products"),
    import("@/lib/chartId"),
  ]);
  const now = new Date().toISOString();
  return {
    brands: CATALOG.map((b) => ({
      slug: b.slug,
      name: b.name,
      logoUrl: null,
      categories: b.categories,
      priority: b.priority,
      needsData: b.charts.length === 0,
    })).sort((a, z) => z.priority - a.priority || a.name.localeCompare(z.name)),
    charts: CATALOG.flatMap((b) =>
      b.charts.map((c) => ({
        id: chartDocId(b.slug, c.category, c.gender, c.fit ?? "regular"),
        brandSlug: b.slug,
        brandName: b.name,
        category: c.category,
        gender: c.gender,
        fit: c.fit ?? "regular",
        needsData: false,
        source: c.source,
        sourceUrl: c.sourceUrl,
        basis: c.basis ?? "body",
        updatedAt: now,
        updatedBy: "local",
        rows: [...c.rows].sort((x, y) => x.anchorValue - y.anchorValue),
      }))
    ),
    products: PRODUCTS.map((p, i) => ({
      id: `local-${i}`,
      brandSlug: p.brand,
      category: p.category,
      name: p.name,
      priceInr: p.price,
    })),
  };
}

async function load(): Promise<Catalog> {
  if (process.env.CATALOG_SOURCE === "local") return loadLocal();
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
      fit: isFit(str(x.fit)) ? (x.fit as Fit) : "regular",
      needsData: x.needsData === true,
      source: strOrNull(x.source),
      sourceUrl: strOrNull(x.sourceUrl),
      basis: x.basis === "garment" ? "garment" : "body",
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

/**
 * Rows for one category and fit, shaped for the sizing engine (and the
 * browser). A brand without a chart for the requested fit falls back to its
 * regular chart — see fitsIn() to tell the two apart.
 */
export function chartsIn(cat: Catalog, category: CategoryId, fit: Fit = "regular"): CategoryCharts {
  const out: CategoryCharts = {};
  for (const pass of fit === "regular" ? ["regular"] : ["regular", fit]) {
    for (const c of cat.charts) {
      if (c.category !== category || c.fit !== pass || c.rows.length === 0) continue;
      (out[c.brandSlug] ??= {})[c.gender] = c.rows;
    }
  }
  // A category with no charts at all borrows a related one's, for estimates only.
  const ref = ESTIMATE_FROM[category];
  if (ref && Object.keys(out).length === 0) {
    const names = new Map(cat.brands.map((b) => [b.slug, b.name]));
    for (const c of cat.charts) {
      if (c.category !== ref || c.fit !== "regular" || c.rows.length === 0) continue;
      (out[`${FALLBACK_PREFIX}${names.get(c.brandSlug) ?? c.brandSlug}`] ??= {})[c.gender] = c.rows;
    }
  }
  return out;
}

/** Where a category with no charts yet borrows estimates from (same body anchor). */
const ESTIMATE_FROM: Partial<Record<CategoryId, CategoryId>> = {
  formal: "sneakers",
  kurtas: "shirts",
  slides: "sneakers",
};

/** Every fit with at least one chart in the category, and which brands have each. */
export function fitsIn(cat: Catalog, category: CategoryId): Partial<Record<Fit, string[]>> {
  const out: Partial<Record<Fit, string[]>> = {};
  for (const c of cat.charts) {
    if (c.category !== category || c.rows.length === 0) continue;
    const list = (out[c.fit] ??= []);
    if (!list.includes(c.brandSlug)) list.push(c.brandSlug);
  }
  return out;
}

/** All fit layers for a category that has more than one fit on file. */
export function chartsByFit(cat: Catalog, category: CategoryId): Partial<Record<Fit, CategoryCharts>> {
  const fits = Object.keys(fitsIn(cat, category)) as Fit[];
  if (!fits.includes("regular")) fits.push("regular");
  return Object.fromEntries(fits.map((f) => [f, chartsIn(cat, category, f)]));
}

/** Charts for the other categories sharing this one's body anchor. */
export function linesFor(cat: Catalog, category: CategoryId) {
  return Object.fromEntries(
    siblingsOf(category)
      .filter((c) => c !== category)
      .map((c) => [c, { brands: liteBrands(brandsIn(cat, c)), charts: chartsIn(cat, c) }])
  ) as Partial<Record<CategoryId, { brands: LiteBrand[]; charts: CategoryCharts }>>;
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
