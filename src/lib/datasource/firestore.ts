import { getFs } from "@/lib/firebase/admin";
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
    const snap = await getFs().collection("brands").get();
    return snap.docs
      .map((doc) => toBrand(doc.id, doc.data()))
      .sort((a, b) => b.priority - a.priority || a.name.localeCompare(b.name));
  },

  async getBrandBySlug(slug) {
    const doc = await getFs().collection("brands").doc(slug).get();
    return doc.exists ? toBrand(doc.id, doc.data() ?? {}) : null;
  },

  async getChart(brandSlug, category, gender): Promise<ChartRec | null> {
    const doc = await getFs()
      .collection("charts")
      .doc(chartDocId(brandSlug, category, gender))
      .get();
    return doc.exists ? toChart(doc.id, doc.data() ?? {}) : null;
  },

  async listCharts(): Promise<ChartRec[]> {
    const snap = await getFs().collection("charts").get();
    return snap.docs
      .map((doc) => toChart(doc.id, doc.data()))
      .sort(
        (a, b) =>
          a.brandName.localeCompare(b.brandName) ||
          a.category.localeCompare(b.category) ||
          a.gender.localeCompare(b.gender)
      );
  },

  async getChartAvailability(category) {
    const snap = await getFs()
      .collection("charts")
      .where("category", "==", category)
      .get();
    const map: Record<string, string[]> = {};
    for (const doc of snap.docs) {
      const c = toChart(doc.id, doc.data());
      if (c.rows.length > 0) (map[c.brandSlug] ??= []).push(c.gender);
    }
    return map;
  },

  async listProducts(brandSlug?, category?): Promise<ProductRec[]> {
    let ref: FirebaseFirestore.Query = getFs().collection("products");
    if (brandSlug !== undefined) ref = ref.where("brandSlug", "==", brandSlug);
    if (category) ref = ref.where("category", "==", category);
    const snap = await ref.get();
    const brandNames = new Map<string, string>();
    for (const doc of await getFs().collection("brands").get().then((s) => s.docs)) {
      brandNames.set(doc.id, (doc.data().name as string) ?? doc.id);
    }
    return snap.docs.map((doc) => {
      const d = doc.data();
      return {
        id: doc.id,
        brandSlug: (d.brandSlug as string) ?? "",
        brandName: brandNames.get(d.brandSlug as string) ?? "",
        category: (d.category as string) ?? "",
        name: (d.name as string) ?? "",
        slug: (d.slug as string) ?? "",
        imageUrl: (d.imageUrl as string) ?? null,
        priceInr: (d.priceInr as number) ?? null,
      };
    });
  },

  async getStats(): Promise<StatsRec> {
    const fs = getFs();
    const [b, c] = await Promise.all([
      fs.collection("brands").get(),
      fs.collection("charts").get(),
    ]);
    const rows = c.docs.reduce((n, doc) => {
      const r = doc.data().rows;
      return n + (Array.isArray(r) ? r.length : 0);
    }, 0);
    return { brands: b.size, charts: c.size, rows };
  },

  async createBrand(input: BrandInput) {
    const name = input.name.trim();
    if (!name) return { error: "name required" };
    const slug = slugify(name);
    const ref = getFs().collection("brands").doc(slug);
    const existing = await ref.get();
    if (existing.exists) return { error: `Slug "${slug}" already exists` };
    const brand: BrandRec = {
      id: slug,
      slug,
      name,
      logoUrl: input.logoUrl || `/brands/${slug}/logo.png`,
      categories: input.categories,
      priority: input.priority ?? 0,
      needsData: false,
    };
    await ref.set({
      ...brand,
      createdAt: new Date().toISOString(),
    });
    return { brand };
  },

  async updateBrand(slug, patch: BrandPatch) {
    const ref = getFs().collection("brands").doc(slug);
    const doc = await ref.get();
    if (!doc.exists) return null;
    await ref.update({ ...patch });
    const after = await ref.get();
    return toBrand(after.id, after.data() ?? {});
  },

  async deleteBrand(slug) {
    const fs = getFs();
    const batchDeletes: Promise<unknown>[] = [];
    batchDeletes.push(fs.collection("brands").doc(slug).delete());
    const charts = await fs
      .collection("charts")
      .where("brandSlug", "==", slug)
      .get();
    charts.docs.forEach((doc) => batchDeletes.push(doc.ref.delete()));
    const prods = await fs
      .collection("products")
      .where("brandSlug", "==", slug)
      .get();
    prods.docs.forEach((doc) => batchDeletes.push(doc.ref.delete()));
    await Promise.all(batchDeletes);
  },

  async upsertChart(input: ChartInput) {
    const fs = getFs();
    const brandDoc = await fs.collection("brands").doc(input.brandSlug).get();
    if (!brandDoc.exists) throw new Error("Unknown brand slug");
    const brandName = (brandDoc.data()?.name as string) ?? input.brandSlug;
    const id = chartDocId(input.brandSlug, input.category, input.gender);
    await fs
      .collection("charts")
      .doc(id)
      .set({
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
    const ref = await getFs()
      .collection("products")
      .add({
        brandSlug: input.brandSlug,
        category: input.category,
        name: input.name,
        slug: slugify(input.name),
        imageUrl: input.imageUrl ?? null,
        priceInr: input.priceInr ?? null,
      });
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
    await getFs().collection("products").doc(id).delete();
  },
};
