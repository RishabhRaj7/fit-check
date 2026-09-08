import { NextRequest } from "next/server";
import { getBrandBySlug, getChartChain } from "@/lib/queries";
import { isCategory } from "@/lib/categories";

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const brandSlug = sp.get("brand") ?? "";
  const category = sp.get("category") ?? "";
  const gender = sp.get("gender") ?? "men";

  if (!brandSlug || !isCategory(category)) {
    return Response.json({ error: "Missing or invalid params" }, { status: 400 });
  }

  const brand = await getBrandBySlug(brandSlug);
  if (!brand) return Response.json({ error: "Unknown brand" }, { status: 404 });

  const found = await getChartChain(brand.slug, category, gender);
  if (!found) {
    return Response.json({
      brandSlug: brand.slug,
      brandName: brand.name,
      category,
      genderUsed: null,
      rows: [],
    });
  }
  return Response.json({
    brandSlug: brand.slug,
    brandName: brand.name,
    category,
    genderUsed: found.genderUsed,
    chartId: found.chart.id,
    needsData: found.chart.needsData,
    updatedAt: found.chart.updatedAt,
    updatedBy: found.chart.updatedBy,
    rows: found.chart.rows,
  });
}
