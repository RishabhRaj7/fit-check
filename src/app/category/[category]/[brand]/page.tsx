import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, ArrowUpRight, TriangleAlert } from "lucide-react";
import BrandLogo from "@/components/BrandLogo";
import SizeConverter, { type BrandMeta } from "@/components/SizeConverter";
import { CATEGORIES, isCategory } from "@/lib/categories";
import { cn, inr } from "@/lib/format";
import {
  brandsForCategory,
  getBrandBySlug,
  getChart,
  getChartAvailability,
  listBrands,
  listProducts,
} from "@/lib/queries";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ category: string; brand: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, brand } = await params;
  const b = await getBrandBySlug(brand);
  if (!isCategory(category) || !b) return {};
  return { title: `${b.name} ${CATEGORIES[category].label} — your size` };
}

export default async function BrandPage({ params }: Props) {
  const { category, brand: brandSlug } = await params;
  if (!isCategory(category)) notFound();
  const brand = await getBrandBySlug(brandSlug);
  if (!brand) notFound();

  const [all, availability, products] = await Promise.all([
    listBrands(),
    getChartAvailability(category),
    listProducts(brand.slug, category),
  ]);

  const catBrands = brandsForCategory(all, category);
  const metas: BrandMeta[] = catBrands.map((b) => ({
    slug: b.slug,
    name: b.name,
    logoUrl: b.logoUrl,
    needsData: b.needsData,
    hasChart: (availability[b.slug] ?? []).length > 0,
  }));
  const targetMeta = metas.find((m) => m.slug === brand.slug) ?? {
    slug: brand.slug,
    name: brand.name,
    logoUrl: brand.logoUrl,
    needsData: brand.needsData,
    hasChart: false,
  };

  const [menChart, womenChart] = await Promise.all([
    getChart(brand.slug, category, "men"),
    getChart(brand.slug, category, "women"),
  ]);
  const menRows = menChart?.rows ?? [];
  const womenRows = womenChart?.rows ?? [];
  const gendersHere = availability[brand.slug] ?? [];
  const cat = CATEGORIES[category];
  const updated = menChart?.updatedAt ?? womenChart?.updatedAt ?? null;

  return (
    <>
      {/* breadcrumb + header */}
      <section className="border-b border-bone/10">
        <div className="mx-auto max-w-[1600px] px-4 pt-8 pb-10 md:px-8 md:pt-12">
          <Link
            href={`/category/${category}`}
            className="inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.22em] text-fog uppercase transition-colors hover:text-frost"
          >
            <ArrowLeft size={12} /> {cat.label}
          </Link>
          <div className="mt-6 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div className="flex items-end gap-5">
              <BrandLogo
                name={brand.name}
                logoUrl={brand.logoUrl}
                className="h-16 w-16 md:h-24 md:w-24"
                letterClassName="text-3xl md:text-5xl"
              />
              <div>
                <p className="font-mono text-[10px] tracking-[0.28em] text-fog">
                  {cat.nav} SIZE LOOKUP
                </p>
                <h1 className="mt-1 font-display text-5xl leading-[0.88] tracking-tight text-bone uppercase md:text-7xl">
                  {brand.name}
                  <span className="text-frost">.</span>
                </h1>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              {targetMeta.hasChart ? (
                <span className="bg-bone px-2.5 py-1.5 font-mono text-[9px] tracking-[0.18em] text-ink">
                  EXACT CHART ON FILE
                </span>
              ) : (
                <span className="flex items-center gap-1.5 border border-signal px-2.5 py-1.5 font-mono text-[9px] tracking-[0.18em] text-frost">
                  <TriangleAlert size={10} /> NO EXACT CHART — ESTIMATE MODE
                </span>
              )}
              <span className="border border-bone/20 px-2.5 py-1.5 font-mono text-[9px] tracking-[0.18em] text-fog">
                M {menRows.length} ROWS · W {womenRows.length} ROWS
              </span>
              {updated && (
                <span className="border border-bone/20 px-2.5 py-1.5 font-mono text-[9px] tracking-[0.18em] text-fog">
                  UPDATED {new Date(updated).toISOString().slice(0, 10)}
                </span>
              )}
              {brand.categories
                .filter((c) => c !== category && isCategory(c))
                .map((c) => (
                  <Link
                    key={c}
                    href={`/category/${c}/${brand.slug}`}
                    className="flex items-center gap-1 border border-bone/20 px-2.5 py-1.5 font-mono text-[9px] tracking-[0.18em] text-fog uppercase transition-colors hover:border-signal hover:text-frost"
                  >
                    ALSO: {CATEGORIES[c as keyof typeof CATEGORIES].nav}{" "}
                    <ArrowUpRight size={9} />
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </section>

      {/* converter */}
      <section className="mx-auto max-w-[1600px] px-4 py-12 md:px-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <h2 className="font-display text-2xl tracking-wide text-bone uppercase md:text-3xl">
            Find your {brand.name} size
          </h2>
          <span className="hidden font-mono text-[10px] tracking-[0.2em] text-fog md:block">
            UPDATES LIVE — NO BUTTON PRESS NEEDED
          </span>
        </div>
        <SizeConverter category={category} targetBrand={targetMeta} brands={metas} />
      </section>

      {/* products */}
      <section className="mx-auto max-w-[1600px] px-4 pb-20 md:px-8">
        <div className="flex items-center justify-between gap-4 border-t border-bone/10 pt-8">
          <h2 className="font-display text-2xl tracking-wide text-bone uppercase md:text-3xl">
            On the shelf
          </h2>
          <span className="font-mono text-[10px] tracking-[0.2em] text-fog">
            {products.length} PRODUCT{products.length === 1 ? "" : "S"} · {cat.nav}
          </span>
        </div>
        {products.length === 0 ? (
          <p className="mt-6 border border-dashed border-bone/20 p-8 font-mono text-xs text-fog">
            No products listed for this brand in {cat.label.toLowerCase()} yet —
            the size verdict above still works.
          </p>
        ) : (
          <div className="mt-6 grid gap-px border border-bone/12 bg-bone/12 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => (
              <article key={p.id} className="group bg-ink">
                <div
                  className={cn(
                    "relative flex aspect-[4/3] items-center justify-center overflow-hidden border-b border-bone/10",
                    !p.imageUrl && "bg-coal"
                  )}
                >
                  {p.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={p.imageUrl}
                      alt={p.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <>
                      <div
                        className="pointer-events-none absolute inset-0 opacity-40"
                        style={{
                          background:
                            "repeating-linear-gradient(135deg, transparent 0 14px, rgba(245,245,240,0.04) 14px 15px)",
                        }}
                      />
                      <BrandLogo
                        name={brand.name}
                        logoUrl={brand.logoUrl}
                        className="h-14 w-14"
                        letterClassName="text-2xl"
                      />
                    </>
                  )}
                  <span className="absolute top-3 left-3 font-mono text-[9px] tracking-[0.2em] text-fog">
                    {cat.nav}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3 px-4 py-4">
                  <h3 className="text-sm font-medium text-bone">{p.name}</h3>
                  {inr(p.priceInr) && (
                    <span className="font-mono text-xs text-fog">
                      {inr(p.priceInr)}
                    </span>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
