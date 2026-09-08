import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowUpRight, TriangleAlert } from "lucide-react";
import BrandLogo from "@/components/BrandLogo";
import { FadeUp } from "@/components/motion";
import { CATEGORY_ORDER, CATEGORIES, isCategory } from "@/lib/categories";
import { cn } from "@/lib/format";
import {
  brandsForCategory,
  getChartAvailability,
  listBrands,
} from "@/lib/queries";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ category: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  if (!isCategory(category)) return {};
  return { title: `${CATEGORIES[category].label} size converter` };
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  if (!isCategory(category)) notFound();

  const [all, availability] = await Promise.all([
    listBrands(),
    getChartAvailability(category),
  ]);
  const list = brandsForCategory(all, category);
  const cat = CATEGORIES[category];
  const idx = CATEGORY_ORDER.indexOf(category);

  return (
    <>
      <section className="border-b border-bone/10">
        <div className="mx-auto max-w-[1600px] px-4 pt-14 pb-10 md:px-8 md:pt-20">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <p className="font-mono text-[10px] tracking-[0.3em] text-fog">
                CATEGORY {String(idx + 1).padStart(2, "0")} / 04 — ANCHOR:{" "}
                {cat.anchorLabel} ({cat.anchorUnit})
              </p>
              <h1 className="mt-3 font-display text-[clamp(3rem,9vw,8rem)] leading-[0.88] tracking-tight text-bone uppercase">
                {cat.label}
                <span className="text-frost">.</span>
              </h1>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-fog">
                {cat.tagline} {cat.fitNote}
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {CATEGORY_ORDER.map((c) => (
                <Link
                  key={c}
                  href={`/category/${c}`}
                  className={cn(
                    "border px-3 py-2 font-mono text-[10px] tracking-[0.16em] transition-colors",
                    c === category
                      ? "border-signal bg-signal text-bone"
                      : "border-bone/20 text-fog hover:border-bone/40 hover:text-bone"
                  )}
                >
                  {CATEGORIES[c].nav}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1600px] px-4 py-12 md:px-8">
        <FadeUp>
          <p className="mb-6 font-mono text-[10px] tracking-[0.24em] text-fog">
            {list.length} BRANDS — PICK ONE TO GET YOUR EXACT SIZE
          </p>
        </FadeUp>
        <div className="grid gap-px border border-bone/12 bg-bone/12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {list.map((b, i) => {
            const genders = availability[b.slug] ?? [];
            const hasChart = genders.length > 0;
            return (
              <FadeUp key={b.id} delay={Math.min(i * 0.04, 0.3)}>
                <Link
                  href={`/category/${category}/${b.slug}`}
                  className="group flex h-full min-h-56 flex-col justify-between bg-ink p-5 transition-colors duration-300 hover:bg-bone hover:text-ink"
                >
                  <div className="flex items-start justify-between">
                    <BrandLogo
                      name={b.name}
                      logoUrl={b.logoUrl}
                      className="h-12 w-12"
                      letterClassName="text-xl"
                    />
                    <ArrowUpRight
                      size={18}
                      className="text-fog opacity-0 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-frost group-hover:opacity-100"
                    />
                  </div>
                  <div>
                    <h2 className="font-display text-3xl tracking-wide text-bone uppercase transition-colors group-hover:text-ink">
                      {b.name}
                    </h2>
                    <div className="mt-2 flex flex-wrap items-center gap-1.5">
                      {hasChart ? (
                        <>
                          <span className="bg-bone/10 px-2 py-1 font-mono text-[9px] tracking-[0.16em] text-bone transition-colors group-hover:bg-ink/10 group-hover:text-ink">
                            EXACT CHART
                          </span>
                          {genders.map((g) => (
                            <span
                              key={g}
                              className="border border-bone/20 px-2 py-1 font-mono text-[9px] tracking-[0.16em] text-fog uppercase transition-colors group-hover:border-ink/30 group-hover:text-ink/70"
                            >
                              {g}
                            </span>
                          ))}
                        </>
                      ) : (
                        <span className="flex items-center gap-1.5 border border-signal px-2 py-1 font-mono text-[9px] tracking-[0.16em] text-frost">
                          <TriangleAlert size={10} /> CHART PENDING — ESTIMATES SHOWN
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              </FadeUp>
            );
          })}
        </div>
      </section>
    </>
  );
}
