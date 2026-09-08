import { and, asc, desc, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { brands, products, sizeChartRows, sizeCharts } from "@/db/schema";
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

function toBrand(b: typeof brands.$inferSelect): BrandRec {
  return {
    id: b.slug,
    slug: b.slug,
    name: b.name,
    logoUrl: b.logoUrl,
    categories: b.categories,
    priority: b.priority,
    needsData: b.needsData,
  };
}

function toRow(r: typeof sizeChartRows.$inferSelect): ChartRowRec {
  return {
    anchorValue: r.anchorValue,
    eu: r.eu,
    uk: r.uk,
    us: r.us,
    jpn: r.jpn,
    ind: r.ind,
    label: r.label,
  };
}

function toProduct(p: typeof products.$inferSelect): ProductRec {
  return {
    id: String(p.id),
    brandSlug: "",
    category: p.category,
    name: p.name,
    slug: p.slug,
    imageUrl: p.imageUrl,
    priceInr: p.priceInr,
  };
}

async function numericBrandId(slug: string): Promise<number | null> {
  const rows = await db
    .select({ id: brands.id })
    .from(brands)
    .where(eq(brands.slug, slug))
    .limit(1);
  return rows[0]?.id ?? null;
}

async function rowsFor(chartId: number): Promise<ChartRowRec[]> {
  const rows = await db
    .select()
    .from(sizeChartRows)
    .where(eq(sizeChartRows.chartId, chartId))
    .orderBy(asc(sizeChartRows.sort), asc(sizeChartRows.anchorValue));
  return rows.map(toRow);
}

export const postgresSource: DataSource = {
  name: "postgres",

  async listBrands(): Promise<BrandRec[]> {
    const rows = await db
      .select()
      .from(brands)
      .orderBy(desc(brands.priority), asc(brands.name));
    return rows.map(toBrand);
  },

  async getBrandBySlug(slug) {
    const rows = await db.select().from(brands).where(eq(brands.slug, slug)).limit(1);
    return rows[0] ? toBrand(rows[0]) : null;
  },

  async getChart(brandSlug, category, gender): Promise<ChartRec | null> {
    const brandRows = await db
      .select()
      .from(brands)
      .where(eq(brands.slug, brandSlug))
      .limit(1);
    if (!brandRows[0]) return null;
    const chartRows = await db
      .select()
      .from(sizeCharts)
      .where(
        and(
          eq(sizeCharts.brandId, brandRows[0].id),
          eq(sizeCharts.category, category),
          eq(sizeCharts.gender, gender)
        )
      )
      .limit(1);
    const chart = chartRows[0];
    if (!chart) return null;
    return {
      id: String(chart.id),
      brandSlug,
      brandName: brandRows[0].name,
      category,
      gender,
      needsData: chart.needsData,
      updatedAt: chart.updatedAt.toISOString(),
      updatedBy: chart.updatedBy,
      rows: await rowsFor(chart.id),
    };
  },

  async listCharts(): Promise<ChartRec[]> {
    const chartRows = await db
      .select({
        id: sizeCharts.id,
        brandId: sizeCharts.brandId,
        brandSlug: brands.slug,
        brandName: brands.name,
        category: sizeCharts.category,
        gender: sizeCharts.gender,
        needsData: sizeCharts.needsData,
        updatedAt: sizeCharts.updatedAt,
        updatedBy: sizeCharts.updatedBy,
      })
      .from(sizeCharts)
      .innerJoin(brands, eq(brands.id, sizeCharts.brandId))
      .orderBy(asc(brands.name), asc(sizeCharts.category), asc(sizeCharts.gender));

    const allRows = await db
      .select()
      .from(sizeChartRows)
      .orderBy(asc(sizeChartRows.sort), asc(sizeChartRows.anchorValue));
    const byChart = new Map<number, ChartRowRec[]>();
    for (const r of allRows) {
      const list = byChart.get(r.chartId) ?? [];
      list.push(toRow(r));
      byChart.set(r.chartId, list);
    }
    return chartRows.map((c) => ({
      id: String(c.id),
      brandSlug: c.brandSlug,
      brandName: c.brandName,
      category: c.category,
      gender: c.gender,
      needsData: c.needsData,
      updatedAt: c.updatedAt.toISOString(),
      updatedBy: c.updatedBy,
      rows: byChart.get(c.id) ?? [],
    }));
  },

  async getChartAvailability(category) {
    const rows = await db
      .select({
        slug: brands.slug,
        gender: sizeCharts.gender,
        rowCount: sql<number>`count(${sizeChartRows.id})`,
      })
      .from(sizeCharts)
      .innerJoin(brands, eq(brands.id, sizeCharts.brandId))
      .leftJoin(sizeChartRows, eq(sizeChartRows.chartId, sizeCharts.id))
      .where(eq(sizeCharts.category, category))
      .groupBy(brands.slug, sizeCharts.gender);
    const map: Record<string, string[]> = {};
    for (const r of rows) {
      if (r.rowCount > 0) (map[r.slug] ??= []).push(r.gender);
    }
    return map;
  },

  async listProducts(brandSlug?, category?): Promise<ProductRec[]> {
    const conds = [];
    if (brandSlug !== undefined) {
      const id = await numericBrandId(brandSlug);
      if (id == null) return [];
      conds.push(eq(products.brandId, id));
    }
    if (category) conds.push(eq(products.category, category));
    const rows = await db
      .select({
        id: products.id,
        brandSlug: brands.slug,
        brandName: brands.name,
        category: products.category,
        name: products.name,
        slug: products.slug,
        imageUrl: products.imageUrl,
        priceInr: products.priceInr,
      })
      .from(products)
      .innerJoin(brands, eq(brands.id, products.brandId))
      .where(conds.length ? and(...conds) : undefined)
      .orderBy(asc(products.id));
    return rows.map((p) => ({
      id: String(p.id),
      brandSlug: p.brandSlug,
      brandName: p.brandName,
      category: p.category,
      name: p.name,
      slug: p.slug,
      imageUrl: p.imageUrl,
      priceInr: p.priceInr,
    }));
  },

  async getStats(): Promise<StatsRec> {
    const [b] = await db.select({ n: sql<number>`count(*)` }).from(brands);
    const [c] = await db.select({ n: sql<number>`count(*)` }).from(sizeCharts);
    const [r] = await db.select({ n: sql<number>`count(*)` }).from(sizeChartRows);
    return { brands: Number(b.n), charts: Number(c.n), rows: Number(r.n) };
  },

  async createBrand(input: BrandInput) {
    const name = input.name.trim();
    if (!name) return { error: "name required" };
    const slug = slugify(name);
    const existing = await db
      .select()
      .from(brands)
      .where(eq(brands.slug, slug))
      .limit(1);
    if (existing.length > 0) return { error: `Slug "${slug}" already exists` };
    const [inserted] = await db
      .insert(brands)
      .values({
        name,
        slug,
        categories: input.categories,
        priority: input.priority ?? 0,
        logoUrl: input.logoUrl || `/brands/${slug}/logo.png`,
      })
      .returning();
    return { brand: toBrand(inserted) };
  },

  async updateBrand(slug, patch: BrandPatch) {
    const [updated] = await db
      .update(brands)
      .set(patch)
      .where(eq(brands.slug, slug))
      .returning();
    return updated ? toBrand(updated) : null;
  },

  async deleteBrand(slug) {
    await db.delete(brands).where(eq(brands.slug, slug));
  },

  async upsertChart(input: ChartInput) {
    const brandId = await numericBrandId(input.brandSlug);
    if (brandId == null) throw new Error("Unknown brand slug");
    const existing = await db
      .select()
      .from(sizeCharts)
      .where(
        and(
          eq(sizeCharts.brandId, brandId),
          eq(sizeCharts.category, input.category),
          eq(sizeCharts.gender, input.gender)
        )
      )
      .limit(1);

    let chartId: number;
    if (existing.length > 0) {
      chartId = existing[0].id;
      await db
        .update(sizeCharts)
        .set({
          needsData: input.needsData,
          updatedBy: input.updatedBy ?? "admin",
          updatedAt: new Date(),
        })
        .where(eq(sizeCharts.id, chartId));
      await db.delete(sizeChartRows).where(eq(sizeChartRows.chartId, chartId));
    } else {
      const [c] = await db
        .insert(sizeCharts)
        .values({
          brandId,
          category: input.category,
          gender: input.gender,
          needsData: input.needsData,
          updatedBy: input.updatedBy ?? "admin",
        })
        .returning({ id: sizeCharts.id });
      chartId = c.id;
    }
    if (input.rows.length > 0) {
      await db.insert(sizeChartRows).values(
        input.rows.map((r, i) => ({ ...r, chartId, sort: i }))
      );
    }
    return { chartId: String(chartId), rowCount: input.rows.length };
  },

  async createProduct(input: ProductInput): Promise<ProductRec> {
    const brandId = await numericBrandId(input.brandSlug);
    if (brandId == null) throw new Error("Unknown brand slug");
    const [inserted] = await db
      .insert(products)
      .values({
        brandId,
        category: input.category,
        name: input.name,
        slug: slugify(input.name),
        priceInr: input.priceInr ?? null,
        imageUrl: input.imageUrl ?? null,
      })
      .returning();
    return { ...toProduct(inserted), brandSlug: input.brandSlug };
  },

  async deleteProduct(id) {
    await db.delete(products).where(eq(products.id, Number(id)));
  },
};
