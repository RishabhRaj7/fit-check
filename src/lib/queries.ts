import { DS } from "@/lib/datasource";
import type { BrandRec, ChartRec } from "@/lib/datasource/types";

export type { BrandRec, ChartRec, ChartRowRec, ProductRec } from "@/lib/datasource/types";
export { dataSourceName } from "@/lib/datasource";

export const listBrands = (): Promise<BrandRec[]> => DS.listBrands();

export const getBrandBySlug = (slug: string): Promise<BrandRec | null> =>
  DS.getBrandBySlug(slug);

export function brandsForCategory(all: BrandRec[], category: string): BrandRec[] {
  return all.filter((b) => b.categories.includes(category));
}

export const getChart = (
  brandSlug: string,
  category: string,
  gender: string
): Promise<ChartRec | null> => DS.getChart(brandSlug, category, gender);

/** Preferred gender first, then pragmatic fallbacks used by Indian retail. */
export function genderChain(gender: string): string[] {
  const chain =
    gender === "women" ? ["women", "unisex", "men"] : ["men", "unisex", "women"];
  return [...new Set(chain)];
}

export async function getChartChain(
  brandSlug: string,
  category: string,
  gender: string
): Promise<{ chart: ChartRec; genderUsed: string } | null> {
  for (const g of genderChain(gender)) {
    const chart = await DS.getChart(brandSlug, category, g);
    if (chart) return { chart, genderUsed: g };
  }
  return null;
}

export const listProducts = (brandSlug: string, category?: string) =>
  DS.listProducts(brandSlug, category);

/** brand slug -> genders that have at least one row, for a category */
export const getChartAvailability = (category: string) =>
  DS.getChartAvailability(category);

export const getStats = () => DS.getStats();
