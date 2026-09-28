import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import { getCatalog } from "@/lib/catalog";
import { CATEGORY_ORDER } from "@/lib/categories";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const h = await headers();
  const base = `${h.get("x-forwarded-proto") ?? "https"}://${h.get("host") ?? "localhost"}`;
  const cat = await getCatalog();
  return [
    { url: `${base}/`, priority: 1 },
    { url: `${base}/measure`, priority: 0.6 },
    { url: `${base}/onboarding`, priority: 0.6 },
    ...CATEGORY_ORDER.map((c) => ({ url: `${base}/category/${c}`, priority: 0.8 })),
    ...cat.brands.flatMap((b) =>
      b.categories.map((c) => ({ url: `${base}/category/${c}/${b.slug}`, priority: 0.7 }))
    ),
  ];
}
