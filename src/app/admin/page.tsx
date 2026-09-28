import type { Metadata } from "next";
import AdminApp, {
  type AdminBrand,
  type AdminChart,
  type AdminProduct,
} from "@/components/AdminApp";
import { getCatalog } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const cat = await getCatalog({ fresh: true });
  const nameOf = new Map(cat.brands.map((b) => [b.slug, b.name]));

  const brands: AdminBrand[] = cat.brands.map((b) => ({
    id: b.slug,
    name: b.name,
    slug: b.slug,
    logoUrl: b.logoUrl,
    categories: b.categories,
    priority: b.priority,
    needsData: b.needsData,
  }));

  const charts: AdminChart[] = cat.charts
    .map((c) => ({
      id: c.id,
      brandSlug: c.brandSlug,
      brandName: c.brandName,
      category: c.category,
      gender: c.gender,
      needsData: c.needsData,
      rowCount: c.rows.length,
      updatedAt: c.updatedAt,
      updatedBy: c.updatedBy,
    }))
    .sort(
      (a, b) =>
        a.brandName.localeCompare(b.brandName) ||
        a.category.localeCompare(b.category) ||
        a.gender.localeCompare(b.gender)
    );

  const products: AdminProduct[] = cat.products.map((p) => ({
    id: p.id,
    brandSlug: p.brandSlug,
    brandName: nameOf.get(p.brandSlug) ?? p.brandSlug,
    category: p.category,
    name: p.name,
    priceInr: p.priceInr,
  }));

  return (
    <section className="mx-auto max-w-[1440px] px-4 py-12 md:px-8 md:py-16">
      <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="kicker text-fog">Restricted · data room</p>
          <h1 className="mt-3 font-display text-5xl font-light tracking-[-0.03em] text-bone md:text-6xl">
            Control deck
          </h1>
        </div>
        <p className="kicker max-w-xs text-fog md:text-right">
          A brand is a name plus one table per category. Paste CSV from any
          official chart. Changes reach the public site within a minute.
        </p>
      </div>
      <AdminApp brands={brands} charts={charts} products={products} />
    </section>
  );
}
