import Link from "next/link";
import Hero from "@/components/Hero";
import SpreadChart from "@/components/SpreadChart";
import AnchorDiagram from "@/components/AnchorDiagram";
import { FadeUp, LineReveal, Rise } from "@/components/motion";
import {
  brandsIn,
  chartsIn,
  getCatalog,
  liteBrands,
  stats,
  type Brand,
} from "@/lib/catalog";
import {
  CATEGORY_ORDER,
  CATEGORIES,
  rowPrimaryLabel,
  type CategoryId,
} from "@/lib/categories";
import { cn } from "@/lib/format";
import { chartFor, nearestRow, type CategoryCharts } from "@/lib/sizing";

export const dynamic = "force-dynamic";

const FEATURED = ["nike", "adidas", "puma", "new-balance", "asics"];

function labelAt(charts: CategoryCharts, slug: string, cm: number): string | null {
  const c = chartFor(charts, slug, "men");
  return c ? rowPrimaryLabel("sneakers", nearestRow(c.rows, cm).row) : null;
}

function SectionHead({
  index,
  kicker,
  title,
  children,
}: {
  index: string;
  kicker: string;
  title: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <FadeUp className="grid gap-6 md:grid-cols-12">
      <p className="kicker text-fog md:col-span-3">
        <span className="text-frost">{index}</span> — {kicker}
      </p>
      <div className="md:col-span-9">
        <h2 className="font-display text-[clamp(2rem,4.4vw,3.75rem)] leading-[1.02] font-light tracking-[-0.025em] text-bone">
          {title}
        </h2>
        {children && (
          <div className="mt-5 max-w-2xl text-base leading-relaxed text-bone/65">{children}</div>
        )}
      </div>
    </FadeUp>
  );
}

export default async function Home() {
  const cat = await getCatalog();
  const s = stats(cat);
  const sneakerBrands = brandsIn(cat, "sneakers");
  const sneakerCharts = chartsIn(cat, "sneakers");
  const charted = sneakerBrands.filter((b) => sneakerCharts[b.slug]);
  const featured = [
    ...FEATURED.map((slug) => charted.find((b) => b.slug === slug)).filter(
      (b): b is Brand => !!b
    ),
    ...charted.filter((b) => !FEATURED.includes(b.slug)),
  ].slice(0, 5);

  // Copy from the data itself: two brands that disagree at 26.5 cm.
  let disagreement: [string, string, string, string] | null = null;
  outer: for (const a of featured) {
    for (const b of featured) {
      const la = labelAt(sneakerCharts, a.slug, 26.5);
      const lb = labelAt(sneakerCharts, b.slug, 26.5);
      if (a !== b && la && lb && la !== lb) {
        disagreement = [a.name, la, b.name, lb];
        break outer;
      }
    }
  }

  const perCategory = CATEGORY_ORDER.map((c) => {
    const brands = brandsIn(cat, c);
    const charts = chartsIn(cat, c);
    return { id: c, brands: brands.length, charted: brands.filter((b) => charts[b.slug]).length };
  });

  const coverage = [...cat.brands].sort((a, b) => a.name.localeCompare(b.name));
  const chartsBy = Object.fromEntries(
    CATEGORY_ORDER.map((c) => [c, chartsIn(cat, c)])
  ) as Record<CategoryId, CategoryCharts>;

  const example = featured.map((b) => ({
    name: b.name,
    size: labelAt(sneakerCharts, b.slug, 26.5) ?? "—",
  }));

  return (
    <>
      {/* ------------------------------------------------------------ hero */}
      <section className="border-b border-bone/10">
        <div className="mx-auto max-w-[1440px] px-4 pt-8 pb-12 md:px-8 md:pt-10 md:pb-16">
          <p className="kicker flex items-center gap-2.5 text-fog">
            <span className="inline-block h-1.5 w-1.5 bg-signal" />
            Size calibration · India
          </p>
          <h1 className="mt-5 font-display text-[clamp(2.5rem,6.4vw,6.25rem)] leading-[0.98] font-light tracking-[-0.035em]">
            <LineReveal>Same feet.</LineReveal>
            <LineReveal delay={0.18}>
              <span className="text-bone/45">Different numbers.</span>
            </LineReveal>
          </h1>

          <div className="mt-8 grid gap-10 md:mt-10 lg:grid-cols-12">
            <div className="flex flex-col justify-between gap-10 lg:col-span-4">
              <Rise delay={0.3}>
                <p className="max-w-sm text-base leading-relaxed text-bone/75">
                  {disagreement ? (
                    <>
                      For a 26.5 cm foot, {disagreement[0]} says{" "}
                      <span className="text-bone">{disagreement[1]}</span> and{" "}
                      {disagreement[2]} says{" "}
                      <span className="text-bone">{disagreement[3]}</span>.{" "}
                    </>
                  ) : (
                    <>Brands don&apos;t agree on what a UK 8 is. </>
                  )}
                  Fit Check keeps one measurement — your foot, chest or waist in
                  centimetres — and reads it back in each brand&apos;s own chart.
                </p>
                <div className="mt-8 flex flex-wrap gap-2">
                  <Link
                    href="/onboarding"
                    className="kicker flex h-12 items-center bg-signal px-6 text-bone transition-colors hover:bg-bone hover:text-ink"
                  >
                    Find my size
                  </Link>
                  <Link
                    href="#categories"
                    className="kicker flex h-12 items-center border border-bone/20 px-6 text-bone transition-colors hover:border-bone/60"
                  >
                    Browse brands
                  </Link>
                </div>
              </Rise>
              <Rise delay={0.4}>
                <dl className="grid grid-cols-3 border-t border-bone/12">
                  {[
                    [s.brands, "Brands"],
                    [s.charts, "Charts"],
                    [s.rows, "Chart rows"],
                  ].map(([v, l], i) => (
                    <div key={l} className={cn("pt-4", i > 0 && "border-l border-bone/12 pl-4")}>
                      <dd className="font-display text-2xl font-light tabular text-bone md:text-3xl">{v}</dd>
                      <dt className="kicker mt-1 text-fog">{l}</dt>
                    </div>
                  ))}
                </dl>
              </Rise>
            </div>
            <Rise delay={0.2} className="lg:col-span-8">
              <Hero
                featured={liteBrands(featured)}
                brands={liteBrands(sneakerBrands)}
                charts={sneakerCharts}
              />
              <p className="kicker mt-3 text-fog">
                Drag the scale · pick a brand · wave over the number
              </p>
            </Rise>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------- spread */}
      <section className="border-b border-bone/10">
        <div className="mx-auto max-w-[1440px] px-4 py-20 md:px-8 md:py-28">
          <SectionHead index="01" kicker="The problem" title={<>One foot. Several answers.</>}>
            Every sneaker chart on file, read at the same foot length. Step the
            measurement and watch brands split apart and regroup — this is why a
            size you trust in one brand is a gamble in the next.
          </SectionHead>
          <FadeUp delay={0.1} className="mt-12 md:ml-[25%]">
            <SpreadChart brands={liteBrands(sneakerBrands)} charts={sneakerCharts} />
          </FadeUp>
        </div>
      </section>

      {/* --------------------------------------------------------- method */}
      <section className="border-b border-bone/10">
        <div className="mx-auto max-w-[1440px] px-4 py-20 md:px-8 md:py-28">
          <SectionHead index="02" kicker="The method" title={<>Measure once. Read it anywhere.</>}>
            Most converters map brand to brand, which multiplies with every brand
            added. We index every chart against one body measurement instead — so a
            new brand joins with a single table, and your size never has to be
            translated twice.
          </SectionHead>
          <div className="mt-12 grid gap-10 md:grid-cols-12">
            <ol className="md:col-span-5 md:col-start-4">
              {[
                ["Anchor", "Your foot length, chest or waist in cm — measured, or worked out from a size you already trust in any brand."],
                ["Look up", "We find the nearest row in the target brand's own chart and read off UK, US, EU and JP together."],
                ["Stay honest", "Exact row, nearest row (with the gap in cm), or an estimate from other brands when a chart isn't on file yet. Always labelled."],
              ].map(([t, d], i) => (
                <FadeUp key={t} delay={i * 0.08}>
                  <li className="grid grid-cols-[3rem_1fr] border-t border-bone/12 py-6">
                    <span className="font-mono text-sm text-frost tabular">0{i + 1}</span>
                    <div>
                      <h3 className="font-display text-xl font-normal text-bone">{t}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-bone/60">{d}</p>
                    </div>
                  </li>
                </FadeUp>
              ))}
            </ol>
            <FadeUp delay={0.15} className="md:col-span-4">
              <AnchorDiagram />
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------- categories */}
      <section id="categories" className="scroll-mt-14 border-b border-bone/10">
        <div className="mx-auto max-w-[1440px] px-4 py-20 md:px-8 md:py-28">
          <SectionHead index="03" kicker="Categories" title={<>Four scales, kept apart.</>}>
            Slides run roomier than sneakers; tees and trousers are anchored to
            chest and waist. Each category keeps its own anchor, so nothing is
            converted across the line.
          </SectionHead>
          <ul className="mt-12 border-t border-bone/12">
            {perCategory.map((c, i) => {
              const def = CATEGORIES[c.id];
              return (
                <li key={c.id}>
                  <FadeUp delay={i * 0.05}>
                    <Link
                      href={`/category/${c.id}`}
                      className="group grid grid-cols-[2.5rem_1fr_auto] items-center gap-4 border-b border-bone/12 py-6 transition-colors hover:bg-coal md:grid-cols-12 md:py-8"
                    >
                      <span className="font-mono text-sm text-fog tabular md:col-span-1 md:pl-2">
                        0{i + 1}
                      </span>
                      <span className="font-display text-3xl font-light tracking-[-0.02em] text-bone md:col-span-5 md:text-5xl">
                        {def.label}
                      </span>
                      <span className="kicker hidden text-fog md:col-span-3 md:block">
                        Anchor · {def.anchor}, cm
                      </span>
                      <span className="kicker hidden text-fog md:col-span-2 md:block">
                        <span className="text-bone">{c.brands}</span> brands ·{" "}
                        <span className="text-bone">{c.charted}</span> charted
                      </span>
                      <span className="flex justify-end pr-2 font-mono text-lg text-fog transition-all group-hover:translate-x-1 group-hover:text-frost md:col-span-1">
                        →
                      </span>
                    </Link>
                  </FadeUp>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* ------------------------------------------------------- coverage */}
      <section className="border-b border-bone/10">
        <div className="mx-auto max-w-[1440px] px-4 py-20 md:px-8 md:py-28">
          <SectionHead index="04" kicker="Coverage" title={<>What&apos;s on file.</>}>
            A filled mark means we hold that brand&apos;s chart. An open mark
            means the brand sells the category but its chart isn&apos;t in yet —
            you&apos;ll still get an answer, built from brands that do have one,
            and it will say so.
          </SectionHead>
          <FadeUp delay={0.1} className="scroll-thin mt-12 overflow-x-auto md:ml-[25%]">
            <table className="w-full min-w-[560px] border-collapse">
              <thead>
                <tr className="border-b border-bone/12">
                  <th className="kicker py-3 pr-4 text-left font-normal text-fog">Brand</th>
                  {CATEGORY_ORDER.map((c) => (
                    <th key={c} className="kicker px-2 py-3 text-left font-normal text-fog">
                      {CATEGORIES[c].nav}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {coverage.map((b) => (
                  <tr key={b.slug} className="border-b border-bone/8 transition-colors hover:bg-coal">
                    <td className="py-2.5 pr-4 text-sm text-bone">{b.name}</td>
                    {CATEGORY_ORDER.map((c) => {
                      const sold = b.categories.includes(c);
                      const genders = Object.keys(chartsBy[c][b.slug] ?? {});
                      const state = !sold ? "none" : genders.length ? "chart" : "estimate";
                      return (
                        <td key={c} className="px-2 py-2.5">
                          {state === "none" ? (
                            <span className="kicker text-fog/30" aria-label="Not sold">·</span>
                          ) : (
                            <Link
                              href={`/category/${c}/${b.slug}`}
                              className="kicker inline-flex items-center gap-2 text-fog transition-colors hover:text-bone"
                            >
                              <span
                                className={cn(
                                  "inline-block h-2 w-2",
                                  state === "chart" ? "bg-bone" : "border border-signal"
                                )}
                              />
                              {state === "chart" ? genders.map((g) => g[0].toUpperCase()).sort().join(" ") : "Est."}
                            </Link>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </FadeUp>
        </div>
      </section>

      {/* -------------------------------------------------------- profile */}
      <section>
        <div className="mx-auto grid max-w-[1440px] gap-12 px-4 py-20 md:grid-cols-12 md:px-8 md:py-28">
          <FadeUp className="md:col-span-6">
            <p className="kicker text-fog">
              <span className="text-frost">05</span> — Your size profile
            </p>
            <h2 className="mt-6 font-display text-[clamp(2.25rem,5.4vw,4.75rem)] leading-[1] font-light tracking-[-0.03em] text-bone">
              Tell us one size.
              <br />
              <span className="text-bone/45">Get all of them.</span>
            </h2>
            <p className="mt-6 max-w-md text-base leading-relaxed text-bone/65">
              Pick a size you already wear in any brand. We work out the
              measurement behind it and keep it — on this device, or on your
              Google account if you want it everywhere. Every brand page then
              opens with your size already on it.
            </p>
            <div className="mt-8 flex flex-wrap gap-2">
              <Link
                href="/onboarding"
                className="kicker flex h-12 items-center bg-signal px-6 text-bone transition-colors hover:bg-bone hover:text-ink"
              >
                Find my size — 30 seconds
              </Link>
              <Link
                href="/measure"
                className="kicker flex h-12 items-center border border-bone/20 px-6 text-bone transition-colors hover:border-bone/60"
              >
                How to measure
              </Link>
            </div>
          </FadeUp>
          <FadeUp delay={0.15} className="md:col-span-5 md:col-start-8">
            <div className="border border-bone/12">
              <div className="flex items-center justify-between border-b border-bone/12 px-5 py-3">
                <span className="kicker text-fog">Sneakers · men</span>
                <span className="kicker text-bone">26.5 cm</span>
              </div>
              <ul>
                {example.map((e) => (
                  <li
                    key={e.name}
                    className="flex items-baseline justify-between border-b border-bone/8 px-5 py-3 last:border-0"
                  >
                    <span className="text-sm text-bone/80">{e.name}</span>
                    <span className="font-display text-lg font-light tabular text-bone">{e.size}</span>
                  </li>
                ))}
              </ul>
            </div>
            <p className="kicker mt-3 text-fog">Example — one anchor, read in five charts</p>
          </FadeUp>
        </div>
      </section>
    </>
  );
}
