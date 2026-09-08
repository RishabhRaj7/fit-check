import Link from "next/link";
import {
  ArrowDown,
  ArrowUpRight,
  Crosshair,
  Database,
  Footprints,
  Repeat2,
  Ruler,
  Shirt,
  TriangleAlert,
} from "lucide-react";
import TapeHero from "@/components/hero/TapeHero";
import Marquee from "@/components/Marquee";
import { ClipReveal, FadeUp } from "@/components/motion";
import { CATEGORY_ORDER, CATEGORIES, type CategoryId } from "@/lib/categories";
import { cn } from "@/lib/format";
import { getChartAvailability, getStats, listBrands } from "@/lib/queries";

export const dynamic = "force-dynamic";

const CATEGORY_ICONS: Record<CategoryId, typeof Footprints> = {
  sneakers: Footprints,
  slides: Footprints,
  tshirt: Shirt,
  trousers: Ruler,
};

export default async function Home() {
  const [allBrands, stats, sneakAvail] = await Promise.all([
    listBrands(),
    getStats(),
    getChartAvailability("sneakers"),
  ]);
  const countFor = (c: string) =>
    allBrands.filter((b) => b.categories.includes(c)).length;

  // hero brand strip — the requested lineup first (when charts exist),
  // then the next sneaker brands with charts from the database
  const wanted = ["nike", "adidas", "puma", "new-balance", "asics"].filter(
    (s) => (sneakAvail[s] ?? []).length > 0
  );
  const extra = allBrands
    .filter(
      (b) =>
        b.categories.includes("sneakers") &&
        (sneakAvail[b.slug] ?? []).length > 0 &&
        !wanted.includes(b.slug)
    )
    .map((b) => b.slug)
    .slice(0, Math.max(0, 5 - wanted.length));
  const heroBrands = [...wanted, ...extra]
    .map((slug) => {
      const b = allBrands.find((x) => x.slug === slug);
      return b ? { slug: b.slug, name: b.name } : null;
    })
    .filter((x): x is { slug: string; name: string } => x !== null);

  return (
    <>
      {/* ------------------------------------------------------------ HERO */}
      <section className="relative min-h-[92svh] overflow-hidden border-b border-bone/10">
        {/* rotating measurement ticks, left edge */}
        <div className="pointer-events-none absolute top-1/2 left-2 hidden -translate-y-1/2 -rotate-90 font-mono text-[10px] tracking-[0.5em] text-fog xl:block">
          26.5 CM — THE ONLY NUMBER THAT MATTERS
        </div>

        <div className="pointer-events-none relative z-10 mx-auto flex min-h-[50svh] w-full max-w-[1600px] flex-1 flex-col justify-center px-4 pt-4 pb-24 md:min-h-[92svh] md:px-8 md:pt-24">
          <div className="max-w-3xl">
            <p className="flex items-center gap-2 font-mono text-[10px] tracking-[0.3em] text-bone/80">
              <span className="inline-block h-2 w-2 bg-signal" />
              CROSS-BRAND SIZE CONVERSION — INDIA
            </p>
            <h1 className="mt-6 font-display text-[clamp(3.6rem,10vw,9rem)] leading-[0.88] tracking-tight">
              <ClipReveal>
                <span className="block text-bone">SAME FEET.</span>
              </ClipReveal>
              <ClipReveal delay={0.12}>
                <span className="block text-stroke">DIFFERENT</span>
              </ClipReveal>
              <ClipReveal delay={0.24}>
                <span className="block text-bone">
                  NUMBERS<span className="text-frost">.</span>
                </span>
              </ClipReveal>
            </h1>
            <FadeUp delay={0.35} className="mt-6 max-w-md">
              <p className="text-sm leading-relaxed text-bone/70 md:text-base">
                Adidas says UK 8. Nike says UK 7. We say stop guessing. Anchor
                your body once — convert into{" "}
                <span className="text-bone">{stats.brands} brands</span>{" "}
                instantly, down to the exact chart row.
              </p>
            </FadeUp>
            <FadeUp delay={0.45} className="pointer-events-auto mt-8 flex flex-wrap gap-3">
              <Link
                href="/onboarding"
                className="flex items-center gap-2 bg-signal px-7 py-4 font-mono text-[11px] font-semibold tracking-[0.2em] text-bone uppercase transition-colors hover:bg-bone hover:text-ink"
              >
                <Ruler size={14} strokeWidth={2.2} /> Find my size
              </Link>
              <Link
                href="#categories"
                className="flex items-center gap-2 border border-bone/25 px-7 py-4 font-mono text-[11px] tracking-[0.2em] text-bone uppercase transition-colors hover:border-signal hover:text-frost"
              >
                Browse brands <ArrowDown size={14} strokeWidth={2.2} />
              </Link>
            </FadeUp>
          </div>

          <FadeUp delay={0.55} className="pointer-events-auto absolute right-4 bottom-0 left-4 md:right-8 md:left-8">
            <div className="flex flex-wrap gap-px border border-bone/15 bg-bone/15">
              {[
                [String(stats.brands), "BRANDS LIVE"],
                [String(stats.charts), "SIZE CHARTS"],
                [`${stats.rows}+`, "DATA ROWS"],
                ["1", "ANCHOR PER CATEGORY"],
              ].map(([v, l]) => (
                <div
                  key={l}
                  className="flex flex-1 items-baseline justify-between gap-3 bg-ink/90 px-4 py-3 backdrop-blur-sm min-w-36"
                >
                  <span className="font-display text-2xl text-bone md:text-3xl">
                    {v}
                  </span>
                  <span className="font-mono text-[9px] tracking-[0.18em] text-fog">
                    {l}
                  </span>
                </div>
              ))}
            </div>
          </FadeUp>
        </div>
        <div className="relative mt-10 h-[430px] w-full md:absolute md:inset-0 md:mt-0 md:h-auto md:w-auto md:left-[36%]">
          <TapeHero brands={heroBrands} />
        </div>
      </section>

      {/* ------------------------------------------------------- MARQUEE A */}
      <section className="overflow-x-clip border-b border-bone/10">
        <div className="-rotate-[1.1deg] scale-[1.02]">
          <Marquee
            items={[
              "NIKE UK 8 IS NOT ADIDAS UK 8",
              "ONE ANCHOR — EVERY BRAND",
              "FOOT 26.5 CM",
              "CHEST 98 CM",
              "WAIST 81 CM",
              "NO MORE SIZE-TABLE SQUINTING",
            ]}
            className="bg-signal py-3.5"
            itemClassName="font-display text-2xl tracking-wide text-bone md:text-4xl"
          />
        </div>
      </section>

      {/* ------------------------------------------------------- CATEGORIES */}
      <section id="categories" className="border-b border-bone/10">
        <div className="mx-auto max-w-[1600px] px-4 py-20 md:px-8 md:py-28">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <FadeUp>
              <h2 className="font-display text-5xl leading-[0.9] tracking-tight text-bone md:text-8xl">
                PICK A<br />
                CATEGORY<span className="text-frost">.</span>
              </h2>
            </FadeUp>
            <FadeUp delay={0.1}>
              <p className="max-w-60 text-right font-mono text-[10px] leading-relaxed tracking-[0.16em] text-fog md:text-left">
                FOUR SILOS. INDEPENDENT CHARTS. SLIDES NEVER BORROW SNEAKER
                LOGIC.
              </p>
            </FadeUp>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-px bg-bone/12 md:grid-cols-12">
            {CATEGORY_ORDER.map((c, i) => {
              const cat = CATEGORIES[c];
              const Icon = CATEGORY_ICONS[c];
              const span =
                i === 0
                  ? "md:col-span-7"
                  : i === 1
                    ? "md:col-span-5"
                    : i === 2
                      ? "md:col-span-5"
                      : "md:col-span-7";
              return (
                <Link
                  key={c}
                  href={`/category/${c}`}
                  className={cn(
                    "group relative flex min-h-72 flex-col justify-between overflow-hidden border border-bone/12 bg-coal p-6 transition-colors duration-300 hover:bg-bone hover:text-ink md:min-h-96 md:p-8",
                    span
                  )}
                >
                  {i === 0 && (
                    <div
                      className="pointer-events-none absolute inset-0 opacity-25 mix-blend-luminosity transition-opacity group-hover:opacity-10"
                      style={{
                        backgroundImage: "url(/images/knit-texture.jpg)",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    />
                  )}
                  <div className="relative flex items-start justify-between">
                    <span className="font-display text-sm tracking-[0.3em] text-frost">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <Icon
                      size={20}
                      strokeWidth={1.5}
                      className="text-fog transition-colors group-hover:text-ink/60"
                    />
                  </div>
                  <div className="relative">
                    <span className="pointer-events-none absolute right-0 -bottom-4 font-display text-[6rem] leading-none text-stroke-faint select-none md:text-[9rem] group-hover:[-webkit-text-stroke-color:rgba(10,10,10,0.15)]">
                      {cat.anchorLabel.split(" ")[0]}
                    </span>
                    <h3 className="font-display text-5xl leading-[0.9] tracking-tight text-bone uppercase transition-colors group-hover:text-ink md:text-7xl">
                      {cat.label}
                    </h3>
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                      <p className="max-w-56 text-xs leading-relaxed text-fog transition-colors group-hover:text-ink/70">
                        {cat.tagline}
                      </p>
                      <span className="font-mono text-[10px] tracking-[0.18em] text-fog transition-colors group-hover:text-ink/70">
                        {countFor(c)} BRANDS · ANCHOR: {cat.anchorLabel}
                      </span>
                    </div>
                  </div>
                  <span className="absolute top-6 right-16 flex h-10 w-10 items-center justify-center bg-signal text-bone opacity-0 transition-all duration-300 group-hover:opacity-100 md:top-8">
                    <ArrowUpRight
                      size={18}
                      strokeWidth={2.2}
                      className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* --------------------------------------------------- ANCHOR METHOD */}
      <section className="relative bg-bone text-ink">
        <div className="mx-auto grid max-w-[1600px] gap-14 px-4 py-20 md:px-8 md:py-28 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <FadeUp>
              <p className="font-mono text-[10px] tracking-[0.3em] text-ink/60">
                WHY IT WORKS
              </p>
              <h2 className="mt-4 font-display text-5xl leading-[0.9] tracking-tight md:text-8xl">
                THE ANCHOR
                <br />
                METHOD<span className="text-signal">.</span>
              </h2>
            </FadeUp>
            <FadeUp delay={0.1}>
              <p className="mt-6 max-w-md text-sm leading-relaxed text-ink/70 md:text-base">
                Everyone else builds brand-to-brand mapping tables — N brands
                means N×N guesswork. We translate every chart into one neutral
                body measurement, then back out. A new brand joins with a single
                table. No pairwise mapping. Ever.
              </p>
            </FadeUp>

            <div className="mt-12">
              {[
                {
                  n: "01",
                  t: "MEASURE ONCE",
                  d: "Foot length, chest, or waist — in centimeters. Or let us back-calculate it from a size you already trust.",
                  icon: Ruler,
                },
                {
                  n: "02",
                  t: "WE ANCHOR IT",
                  d: "Your measurement becomes the anchor. Every brand chart in the system is indexed against that same anchor.",
                  icon: Crosshair,
                },
                {
                  n: "03",
                  t: "CONVERT ANYWHERE",
                  d: "Nearest-row lookup against the target brand's own chart gives you EU, UK, US, JPN and IND in one shot.",
                  icon: Repeat2,
                },
              ].map((s, i) => (
                <FadeUp key={s.n} delay={i * 0.08}>
                  <div className="flex items-start gap-5 border-t border-ink/15 py-7">
                    <span className="font-display text-4xl leading-none text-signal md:text-5xl">
                      {s.n}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <s.icon size={15} strokeWidth={2} />
                        <h3 className="font-display text-xl tracking-wide md:text-2xl">
                          {s.t}
                        </h3>
                      </div>
                      <p className="mt-1.5 max-w-md text-sm leading-relaxed text-ink/65">
                        {s.d}
                      </p>
                    </div>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>

          <FadeUp delay={0.15} className="relative">
            <div className="sticky top-24">
              <div className="relative border-2 border-ink">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/tape-measure.jpg"
                  alt="Foot measured with a tape in centimeters"
                  className="aspect-[4/5] w-full object-cover"
                />
                <div className="absolute -right-3 -bottom-3 bg-signal px-4 py-3">
                  <span className="font-display text-2xl text-bone">26.5</span>
                  <span className="ml-1 font-mono text-[10px] tracking-[0.2em] text-bone/70">
                    CM
                  </span>
                </div>
              </div>
              <p className="mt-4 font-mono text-[10px] leading-relaxed tracking-[0.16em] text-ink/60">
                THE ANCHOR IS YOUR BODY — NOT A SIZE TAG. TAGS LIE; CENTIMETERS
                DON&apos;T.
              </p>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* --------------------------------------------------------- DATA GAP */}
      <section className="border-b border-bone/10 bg-ink">
        <div className="mx-auto grid max-w-[1600px] gap-14 px-4 py-20 md:px-8 md:py-28 lg:grid-cols-2">
          <div>
            <FadeUp>
              <div className="flex items-center gap-2">
                <TriangleAlert size={15} className="text-frost" />
                <p className="font-mono text-[10px] tracking-[0.3em] text-fog">
                  HONEST BY DESIGN
                </p>
              </div>
              <h2 className="mt-4 font-display text-5xl leading-[0.9] tracking-tight text-bone md:text-8xl">
                NO CHART?
                <br />
                NO DEAD END<span className="text-frost">.</span>
              </h2>
              <p className="mt-6 max-w-md text-sm leading-relaxed text-bone/65 md:text-base">
                When a brand&apos;s chart isn&apos;t on file yet, we never fail
                silently. You get a clearly-labelled estimate assembled from
                sibling brands in the same category — plus a flag telling the
                community exactly which table to add next.
              </p>
            </FadeUp>
          </div>
          <FadeUp delay={0.15} className="flex items-center">
            <div className="w-full border border-signal bg-signal/5 p-6 md:p-8">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] tracking-[0.22em] text-frost">
                  ESTIMATE — LIVE EXAMPLE
                </span>
                <span className="font-mono text-[10px] tracking-[0.22em] text-fog">
                  REEBOK · SLIDES
                </span>
              </div>
              <p className="mt-5 font-display text-6xl leading-none text-bone md:text-8xl">
                UK 8<span className="text-frost">.</span>
              </p>
              <p className="mt-4 font-mono text-[10px] leading-relaxed tracking-[0.14em] text-fog">
                VOTES FROM: NIKE · ADIDAS · PUMA · BATA · +4 MORE
              </p>
              <p className="mt-4 border-t border-signal/30 pt-4 text-xs leading-relaxed text-bone/70">
                Treat it as an estimate — once someone drops the official
                Adilette-style chart into /admin, this becomes an exact match
                instantly.
              </p>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* --------------------------------------------------------- THE WALL */}
      <section className="border-b border-bone/10 bg-ink">
        <div className="mx-auto max-w-[1600px] px-4 py-20 md:px-8 md:py-28">
          <FadeUp>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 className="font-display text-4xl tracking-tight text-bone md:text-6xl">
                THE WALL<span className="text-frost">.</span>
              </h2>
              <span className="flex items-center gap-2 font-mono text-[10px] tracking-[0.2em] text-fog">
                <Database size={13} /> NEW BRAND = ONE FORM IN /ADMIN
              </span>
            </div>
          </FadeUp>
          <FadeUp delay={0.1}>
            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-4">
              {allBrands.map((b) => (
                <Link
                  key={b.id}
                  href={`/category/${b.categories[0] ?? "sneakers"}/${b.slug}`}
                  className="group flex items-center gap-2"
                >
                  <span
                    className={cn(
                      "inline-block h-1.5 w-1.5",
                      b.needsData ? "bg-signal" : "bg-bone/25 group-hover:bg-signal"
                    )}
                  />
                  <span className="font-display text-2xl tracking-wide text-bone/60 uppercase transition-colors group-hover:text-bone md:text-3xl">
                    {b.name}
                  </span>
                </Link>
              ))}
            </div>
            <p className="mt-6 font-mono text-[10px] tracking-[0.16em] text-fog">
                <span className="text-frost">■</span> STEEL MARKER — CHART
              INCOMPLETE, CONTRIBUTIONS WELCOME.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* -------------------------------------------------------------- CTA */}
      <section className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 opacity-15"
          style={{
            backgroundImage: "url(/images/knit-texture.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="relative mx-auto max-w-[1600px] px-4 py-24 md:px-8 md:py-36">
          <FadeUp>
            <h2 className="font-display text-[clamp(3rem,9vw,8.5rem)] leading-[0.88] tracking-tight">
              <span className="block text-stroke">STOP GUESSING.</span>
              <span className="block text-bone">
                KNOW YOUR SIZE<span className="text-frost">.</span>
              </span>
            </h2>
          </FadeUp>
          <FadeUp delay={0.15} className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/onboarding"
              className="flex items-center gap-2 bg-signal px-8 py-4 font-mono text-[11px] font-semibold tracking-[0.2em] text-bone uppercase transition-colors hover:bg-bone hover:text-ink"
            >
              <Ruler size={14} strokeWidth={2.2} /> Find my size
            </Link>
            <Link
              href="/category/sneakers"
              className="flex items-center gap-2 border border-bone/25 px-8 py-4 font-mono text-[11px] tracking-[0.2em] text-bone uppercase transition-colors hover:border-signal hover:text-frost"
            >
              Straight to sneakers <ArrowUpRight size={14} />
            </Link>
          </FadeUp>
        </div>
      </section>
    </>
  );
}
