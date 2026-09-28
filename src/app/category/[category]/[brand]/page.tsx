import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import BrandMark from "@/components/BrandMark";
import BrandSizing from "@/components/BrandSizing";
import { brandsIn, chartsByFit, getCatalog, linesFor, liteBrands } from "@/lib/catalog";
import { CATEGORY_ORDER, CATEGORIES, isCategory } from "@/lib/categories";
import { cn, inr } from "@/lib/format";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ category: string; brand: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, brand } = await params;
  if (!isCategory(category)) return {};
  const b = (await getCatalog()).brands.find((x) => x.slug === brand);
  if (!b) return {};
  const label = CATEGORIES[category].label.toLowerCase();
  return {
    title: `${b.name} ${label} size chart & converter`,
    description: `Find your ${b.name} ${label} size from a size you already wear in another brand, or from your ${CATEGORIES[category].anchor.toLowerCase()} in cm. UK, US, EU and JP.`,
  };
}

export default async function BrandPage({ params }: Props) {
  const { category, brand: slug } = await params;
  if (!isCategory(category)) notFound();
  const cat = await getCatalog();
  const brand = cat.brands.find((b) => b.slug === slug);
  if (!brand) notFound();

  const def = CATEGORIES[category];
  const inCategory = brandsIn(cat, category);
  // A brand reached through an old link for a category it doesn't sell still
  // converts — it simply joins the list for this page.
  const brands = liteBrands(inCategory.some((b) => b.slug === slug) ? inCategory : [...inCategory, brand]);
  const byFit = chartsByFit(cat, category);
  const ownAll = cat.charts.filter((c) => c.brandSlug === slug && c.category === category && c.rows.length);
  const own = ownAll.filter((c) => c.fit === "regular");
  const targetFits = [...new Set(ownAll.map((c) => c.fit))];
  const primary = own.find((c) => c.gender === "men") ?? own[0];
  const source = primary?.source
    ? { label: primary.source, url: primary.sourceUrl, basis: primary.basis }
    : null;
  const updated = own.map((c) => c.updatedAt).sort().at(-1);
  const products = cat.products.filter((p) => p.brandSlug === slug && p.category === category);

  return (
    <>
      <section className="border-b border-bone/10">
        <div className="mx-auto max-w-[1440px] px-4 pt-8 pb-10 md:px-8 md:pt-12 md:pb-14">
          <nav aria-label="Breadcrumb" className="kicker flex items-center gap-2 text-fog">
            <Link href="/" className="transition-colors hover:text-bone">Home</Link>
            <span aria-hidden="true">/</span>
            <Link href={`/category/${category}`} className="transition-colors hover:text-bone">
              {def.label}
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-bone">{brand.name}</span>
          </nav>

          <div className="mt-8 flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <div className="flex items-end gap-5">
              <BrandMark name={brand.name} logoUrl={brand.logoUrl} className="h-16 w-16 text-2xl md:h-20 md:w-20 md:text-3xl" />
              <div>
                <p className="kicker text-fog">{def.label} · size lookup</p>
                <h1 className="mt-2 font-display text-[clamp(2.5rem,6vw,5rem)] leading-[0.95] font-light tracking-[-0.035em] text-bone">
                  {brand.name}
                </h1>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <span
                className={cn(
                  "kicker inline-flex items-center gap-2 border px-3 py-2",
                  own.length ? "border-bone/20 text-bone" : "border-signal/60 text-frost"
                )}
              >
                <span className={cn("inline-block h-1.5 w-1.5", own.length ? "bg-bone" : "border border-signal")} />
                {own.length ? `Chart on file · ${own.map((c) => c.gender).sort().join(" + ")}` : "No chart yet · estimates"}
              </span>
              {updated && !updated.startsWith("1970") && (
                <span className="kicker border border-bone/15 px-3 py-2 text-fog">
                  Updated {updated.slice(0, 10)}
                </span>
              )}
            </div>
          </div>

          {brand.categories.length > 1 && (
            <div className="mt-8 inline-flex flex-wrap gap-px border border-bone/12 bg-bone/12">
              {CATEGORY_ORDER.filter((c) => brand.categories.includes(c)).map((c) => (
                <Link
                  key={c}
                  href={`/category/${c}/${brand.slug}`}
                  aria-current={c === category ? "page" : undefined}
                  className={cn(
                    "kicker px-4 py-2.5 transition-colors",
                    c === category ? "bg-bone text-ink" : "bg-ink text-fog hover:text-bone"
                  )}
                >
                  {CATEGORIES[c].nav}
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-4 py-12 md:px-8 md:py-16">
        <BrandSizing
          category={category}
          target={{ slug: brand.slug, name: brand.name }}
          brands={brands}
          chartsByFit={byFit}
          targetFits={targetFits}
          lines={linesFor(cat, category)}
          source={source}
        />
      </section>

      {products.length > 0 && (
        <section className="mx-auto max-w-[1440px] px-4 pb-24 md:px-8">
          <p className="kicker text-fog">
            <span className="text-frost">05</span> — Models on this chart
          </p>
          <ul className="mt-6 grid border-t border-l border-bone/12 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => (
              <li key={p.id} className="flex items-baseline justify-between gap-4 border-r border-b border-bone/12 px-5 py-4">
                <span className="text-sm text-bone">{p.name}</span>
                {inr(p.priceInr) && <span className="font-mono text-xs text-fog tabular">{inr(p.priceInr)}</span>}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-fog">
            Individual models can run slightly small or large — check the product page too.
          </p>
        </section>
      )}
    </>
  );
}
