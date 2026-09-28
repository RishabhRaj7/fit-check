import { getCatalog, brandsIn, chartsIn, liteBrands } from "@/lib/catalog";
import { CATEGORIES, isCategory, rowPrimaryLabel } from "@/lib/categories";
import { convert } from "@/lib/sizing";

/**
 * Public conversion endpoint — the site itself converts in the browser, this
 * exposes the same engine over HTTP.
 *   POST { category, gender, brandSlug, anchorValue }
 */
export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const category = String(body.category ?? "");
  const gender = body.gender === "women" ? "women" : "men";
  const brandSlug = String(body.brandSlug ?? "");
  const anchorValue = Number(body.anchorValue);

  if (!isCategory(category)) {
    return Response.json({ error: "Unknown category" }, { status: 400 });
  }
  const def = CATEGORIES[category];
  if (
    !Number.isFinite(anchorValue) ||
    anchorValue < def.anchorMin - 5 ||
    anchorValue > def.anchorMax + 5
  ) {
    return Response.json({ error: "anchorValue out of range" }, { status: 400 });
  }

  const cat = await getCatalog();
  const brands = brandsIn(cat, category);
  if (!brands.some((b) => b.slug === brandSlug)) {
    return Response.json({ error: "Unknown brand for this category" }, { status: 404 });
  }
  const match = convert(chartsIn(cat, category), liteBrands(brands), category, brandSlug, gender, anchorValue);
  return Response.json({
    ...match,
    size: match.row ? rowPrimaryLabel(category, match.row) : null,
  });
}
