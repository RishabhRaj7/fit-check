import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import CategoryBrandList from "@/components/CategoryBrandList";
import { brandsIn, chartsIn, getCatalog } from "@/lib/catalog";
import { CATEGORY_ORDER, CATEGORIES, isCategory } from "@/lib/categories";
import { cn } from "@/lib/format";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ category: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  if (!isCategory(category)) return {};
  const def = CATEGORIES[category];
  return {
    title: `${def.label} size converter`,
    description: `${def.tagline} Convert your ${def.label.toLowerCase()} size across brands using your ${def.anchor.toLowerCase()} in cm.`,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  if (!isCategory(category)) notFound();

  const cat = await getCatalog();
  const def = CATEGORIES[category];
  const charts = chartsIn(cat, category);
  const brands = brandsIn(cat, category).map((b) => ({
    slug: b.slug,
    name: b.name,
    logoUrl: b.logoUrl,
    genders: Object.keys(charts[b.slug] ?? {}),
  }));
  const idx = CATEGORY_ORDER.indexOf(category);

  return (
    <>
      <section className="border-b border-bone/10">
        <div className="mx-auto max-w-[1440px] px-4 pt-12 pb-10 md:px-8 md:pt-16 md:pb-14">
          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <div>
              <p className="kicker text-fog">
                <span className="text-frost">0{idx + 1}</span> / 0{CATEGORY_ORDER.length} · Anchor ·{" "}
                {def.anchor}, cm
              </p>
              <h1 className="mt-4 font-display text-[clamp(2.75rem,7vw,6rem)] leading-[0.95] font-light tracking-[-0.035em] text-bone">
                {def.label}
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-bone/65">
                {def.tagline} {def.fitNote}
              </p>
            </div>
            <nav aria-label="Categories" className="flex flex-wrap gap-px border border-bone/12 bg-bone/12 self-start lg:self-end">
              {CATEGORY_ORDER.map((c) => (
                <Link
                  key={c}
                  href={`/category/${c}`}
                  aria-current={c === category ? "page" : undefined}
                  className={cn(
                    "kicker px-4 py-2.5 transition-colors",
                    c === category ? "bg-bone text-ink" : "bg-ink text-fog hover:text-bone"
                  )}
                >
                  {CATEGORIES[c].nav}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-4 py-10 md:px-8 md:py-14">
        <CategoryBrandList category={category} brands={brands} charts={charts} />
      </section>
    </>
  );
}
