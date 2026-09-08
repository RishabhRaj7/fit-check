import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { getFsWeb } from "@/lib/firebase/app";
import { slugify } from "@/lib/format";
import type {
  BrandInput,
  BrandPatch,
  BrandRec,
  ChartInput,
  ChartRec,
  ChartRowRec,
  DataSource,
  ProductInput,
  ProductRec,
  StatsRec,
} from "./types";

/**
 * Firestore layout (primary production datasource):
 *   brands/{slug}                        { name, slug, logoUrl, categories[], priority, needsData }
 *   charts/{slug}__{category}__{gender}  { brandSlug, brandName, category, gender, needsData,
 *                                          updatedAt, updatedBy, rows: ChartRowRec[] }
 *   products/{autoId}                    { brandSlug, category, name, slug, imageUrl, priceInr }
 *
 * Reads use the public web-app config. Writes happen from an authenticated
 * admin context (Google sign-in in /admin, or the authenticated seed script)
 * and are enforced by firestore.rules.
 */
const chartDocId = (slug: string, category: string, gender: string) =>
  `${slug}__${category}__${gender}`;

function toBrand(id: string, d: Record<string, unknown>): BrandRec {
  return {
    id,
    slug: (d.slug as string) ?? id,
    name: (d.name as string) ?? id,
    logoUrl: (d.logoUrl as string) ?? null,
    categories: (d.categories as string[]) ?? [],
    priority: (d.priority as number) ?? 0,
    needsData: (d.needsData as boolean) ?? false,
  };
}

function toChart(id: string, d: Record<string, unknown>): ChartRec {
  const rows = Array.isArray(d.rows) ? (d.rows as ChartRowRec[]) : [];
  return {
    id,
    brandSlug: (d.brandSlug as string) ?? "",
    brandName: (d.brandName as string) ?? "",
    category: (d.category as string) ?? "",
    gender: (d.gender as string) ?? "",
    needsData: (d.needsData as boolean) ?? false,
    updatedAt: (d.updatedAt as string) ?? new Date().toISOString(),
    updatedBy: (d.updatedBy as string) ?? null,
    rows: rows
      .slice()
      .sort((a, b) => (a.anchorValue ?? 0) - (b.anchorValue ?? 0)),
  };
}

export const firestoreSource: DataSource = {
  name: "firestore",

  async listBrands(): Promise<BrandRec[]> {
    const snap = await getDocs(collection(getFsWeb(), "brands"));
    return snap.docs
      .map((d) => toBrand(d.id, d.data()))
      .sort((a, b) => b.priority - a.priority || a.name.localeCompare(b.name));
  },

  async getBrandBySlug(slug) {
    const d = await getDoc(doc(getFsWeb(), "brands", slug));
    return d.exists() ? toBrand(d.id, d.data() ?? {}) : null;
  },

  async getChart(brandSlug, category, gender): Promise<ChartRec | null> {
    const d = await getDoc(
      doc(getFsWeb(), "charts", chartDocId(brandSlug, category, gender))
    );
    return d.exists() ? toChart(d.id, d.data() ?? {}) : null;
  },

  async listCharts(): Promise<ChartRec[]> {
    const snap = await getDocs(collection(getFsWeb(), "charts"));
    return snap.docs
      .map((d) => toChart(d.id, d.data()))
      .sort(
        (a, b) =>
          a.brandName.localeCompare(b.brandName) ||
          a.category.localeCompare(b.category) ||
          a.gender.localeCompare(b.gender)
      );
  },

  async getChartAvailability(category) {
    const snap = await getDocs(
      query(collection(getFsWeb(), "charts"), where("category", "==", category))
    );
    const map: Record<string, string[]> = {};
    for (const d of snap.docs) {
      const c = toChart(d.id, d.data());
      if (c.rows.length > 0) (map[c.brandSlug] ??= []).push(c.gender);
    }
    return map;
  },

  async listProducts(brandSlug?, category?): Promise<ProductRec[]> {
    const fs = getFsWeb();
    let ref: ReturnType<typeof collection> | ReturnType<typeof query> =
      collection(fs, "products");
    if (brandSlug !== undefined) ref = query(ref, where("brandSlug", "==", brandSlug));
    if (category) ref = query(ref, where("category", "==", category));
    const snap = await getDocs(ref);
    const brandNames = new Map<string, string>();
    const bSnap = await getDocs(collection(fs, "brands"));
    bSnap.docs.forEach((d) => brandNames.set(d.id, (d.data().name as string) ?? d.id));
    return snap.docs.map((d) => {
      const data = d.data() as Record<string, unknown>;
      return {
        id: d.id,
        brandSlug: (data.brandSlug as string) ?? "",
        brandName: brandNames.get(data.brandSlug as string) ?? "",
        category: (data.category as string) ?? "",
        name: (data.name as string) ?? "",
        slug: (data.slug as string) ?? "",
        imageUrl: (data.imageUrl as string) ?? null,
        priceInr: (data.priceInr as number) ?? null,
      };
    });
  },

  async getStats(): Promise<StatsRec> {
    const fs = getFsWeb();
    const [b, c] = await Promise.all([
      getDocs(collection(fs, "brands")),
      getDocs(collection(fs, "charts")),
    ]);
    const rows = c.docs.reduce((n, d) => {
      const r = d.data().rows;
      return n + (Array.isArray(r) ? r.length : 0);
    }, 0);
    return { brands: b.size, charts: c.size, rows };
  },

  async createBrand(input: BrandInput) {
    const name = input.name.trim();
    if (!name) return { error: "name required" };
    const slug = slugify(name);
    const ref = doc(getFsWeb(), "brands", slug);
    const existing = await getDoc(ref);
    if (existing.exists()) return { error: `Slug "${slug}" already exists` };
    const brand: BrandRec = {
      id: slug,
      slug,
      name,
      logoUrl: input.logoUrl || `/brands/${slug}/logo.png`,
      categories: input.categories,
      priority: input.priority ?? 0,
      needsData: false,
    };
    await setDoc(ref, { ...brand, createdAt: new Date().toISOString() });
    return { brand };
  },

  async updateBrand(slug, patch: BrandPatch) {
    const ref = doc(getFsWeb(), "brands", slug);
    const d = await getDoc(ref);
    if (!d.exists()) return null;
    await updateDoc(ref, { ...patch });
    const after = await getDoc(ref);
    return toBrand(after.id, after.data() ?? {});
  },

  async deleteBrand(slug) {
    const fs = getFsWeb();
    await deleteDoc(doc(fs, "brands", slug));
    const charts = await getDocs(query(collection(fs, "charts"), where("brandSlug", "==", slug)));
    const prods = await getDocs(query(collection(fs, "products"), where("brandSlug", "==", slug)));
    await Promise.all([
      ...charts.docs.map((d) => deleteDoc(d.ref)),
      ...prods.docs.map((d) => deleteDoc(d.ref)),
    ]);
  },

  async upsertChart(input: ChartInput) {
    const fs = getFsWeb();
    const brandDoc = await getDoc(doc(fs, "brands", input.brandSlug));
    if (!brandDoc.exists()) throw new Error("Unknown brand slug");
    const brandName = (brandDoc.data()?.name as string) ?? input.brandSlug;
    const id = chartDocId(input.brandSlug, input.category, input.gender);
    await setDoc(doc(fs, "charts", id), {
      brandSlug: input.brandSlug,
      brandName,
      category: input.category,
      gender: input.gender,
      needsData: input.needsData ?? false,
      updatedBy: input.updatedBy ?? "admin",
      updatedAt: new Date().toISOString(),
      rows: input.rows,
    });
    return { chartId: id, rowCount: input.rows.length };
  },

  async createProduct(input: ProductInput): Promise<ProductRec> {
    const ref = await import("firebase/firestore").then((m) =>
      m.addDoc(collection(getFsWeb(), "products"), {
        brandSlug: input.brandSlug,
        category: input.category,
        name: input.name,
        slug: slugify(input.name),
        imageUrl: input.imageUrl ?? null,
        priceInr: input.priceInr ?? null,
      })
    );
    return {
      id: ref.id,
      brandSlug: input.brandSlug,
      category: input.category,
      name: input.name,
      slug: slugify(input.name),
      imageUrl: input.imageUrl ?? null,
      priceInr: input.priceInr ?? null,
    };
  },

  async deleteProduct(id) {
    await deleteDoc(doc(getFsWeb(), "products", id));
  },
};
