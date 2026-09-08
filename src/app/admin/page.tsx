import type { Metadata } from "next";
import AdminApp, {
  type AdminBrand,
  type AdminChart,
  type AdminProduct,
} from "@/components/AdminApp";
import { DS, dataSourceName } from "@/lib/datasource";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Admin" };

export default async function AdminPage() {
  const [brandRows, chartRows, productRows] = await Promise.all([
    DS.listBrands(),
    DS.listCharts(),
    DS.listProducts(),
  ]);

  const adminBrands: AdminBrand[] = brandRows.map((b) => ({
    id: b.slug,
    name: b.name,
    slug: b.slug,
    logoUrl: b.logoUrl,
    categories: b.categories,
    priority: b.priority,
    needsData: b.needsData,
  }));

  const adminCharts: AdminChart[] = chartRows.map((c) => ({
    id: c.id,
    brandSlug: c.brandSlug,
    brandName: c.brandName,
    category: c.category,
    gender: c.gender,
    needsData: c.needsData,
    rowCount: c.rows.length,
    updatedAt: c.updatedAt,
    updatedBy: c.updatedBy,
  }));

  const adminProducts: AdminProduct[] = productRows.map((p) => ({
    id: p.id,
    brandSlug: p.brandSlug,
    brandName: p.brandName ?? "",
    category: p.category,
    name: p.name,
    priceInr: p.priceInr,
  }));

  return (
    <section className="mx-auto max-w-[1600px] px-4 py-14 md:px-8 md:py-20">
      <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="font-mono text-[10px] tracking-[0.3em] text-frost">
            RESTRICTED — DATA ROOM
          </p>
          <h1 className="mt-3 font-display text-5xl leading-[0.9] tracking-tight text-bone md:text-7xl">
            CONTROL DECK<span className="text-frost">.</span>
          </h1>
        </div>
        <div className="flex flex-col items-start gap-2 md:items-end">
          <span className="border border-frost/40 px-3 py-1.5 font-mono text-[10px] tracking-[0.2em] text-frost uppercase">
            DATASOURCE: {dataSourceName}
          </span>
          <p className="max-w-xs font-mono text-[10px] leading-relaxed tracking-[0.14em] text-fog">
            ADDING A BRAND = NAME + ONE TABLE PER CATEGORY. PASTE CSV FROM ANY
            OFFICIAL CHART ONLINE. NO DEPLOY REQUIRED.
          </p>
        </div>
      </div>
      <AdminApp
        mode={dataSourceName}
        brands={adminBrands}
        charts={adminCharts}
        products={adminProducts}
      />
    </section>
  );
}
