import Link from "next/link";
import type { Metadata } from "next";
import { FootDiagram, TorsoDiagram } from "@/components/MeasureDiagrams";
import { FadeUp } from "@/components/motion";
import { CATEGORIES } from "@/lib/categories";

export const metadata: Metadata = {
  title: "How to measure your foot, chest and waist",
  description:
    "Three measurements in centimetres are all Fit Check needs: foot length for footwear, chest for tops, waist for trousers. Here's how to take each one at home.",
};

const GUIDES = [
  {
    id: "foot",
    title: "Foot length",
    for: "Sneakers, slides & sandals",
    steps: CATEGORIES.sneakers.howTo,
    figure: <FootDiagram />,
    href: "/category/sneakers",
  },
  {
    id: "chest",
    title: "Chest",
    for: "T-shirts & tops",
    steps: CATEGORIES.tshirt.howTo,
    figure: <TorsoDiagram band="chest" />,
    href: "/category/tshirt",
  },
  {
    id: "waist",
    title: "Waist",
    for: "Trousers & jeans",
    steps: CATEGORIES.trousers.howTo,
    figure: <TorsoDiagram band="waist" />,
    href: "/category/trousers",
  },
];

const TIPS = [
  ["Measure late in the day", "Feet swell a little by evening — that's the size your shoes need to fit."],
  ["Wear what you'd wear", "Socks for sneakers, a thin tee for chest. Not a jacket."],
  ["Round to the half", "Half a centimetre is the step most footwear charts use."],
  ["Between two sizes?", "Every brand page shows the gap in cm, so you can see which way you lean."],
];

export default function MeasurePage() {
  return (
    <>
      <section className="border-b border-bone/10">
        <div className="mx-auto max-w-[1440px] px-4 pt-12 pb-12 md:px-8 md:pt-16 md:pb-16">
          <p className="kicker text-fog">Guide · 2 minutes · a tape or a ruler</p>
          <h1 className="mt-4 max-w-4xl font-display text-[clamp(2.5rem,6vw,5rem)] leading-[0.98] font-light tracking-[-0.035em] text-bone">
            Three numbers.
            <br />
            <span className="text-bone/45">That&apos;s the whole system.</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-bone/65">
            Everything on Fit Check is anchored to one body measurement per
            category. You don&apos;t have to measure — a size you already wear
            works too — but a measurement is the most precise anchor there is.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-4 py-14 md:px-8 md:py-20">
        <div className="grid gap-px border border-bone/12 bg-bone/12 lg:grid-cols-3">
          {GUIDES.map((g, i) => (
            <article key={g.id} id={g.id} className="flex flex-col bg-ink p-6 md:p-8">
              <FadeUp delay={i * 0.08} className="flex flex-1 flex-col">
                <p className="kicker text-fog">
                  <span className="text-frost">0{i + 1}</span> — {g.for}
                </p>
                <h2 className="mt-3 font-display text-3xl font-light tracking-[-0.02em] text-bone">{g.title}</h2>
                <div className="mx-auto mt-8 w-full max-w-sm">{g.figure}</div>
                <ol className="mt-8 flex-1">
                  {g.steps.map((s, j) => (
                    <li key={j} className="grid grid-cols-[2rem_1fr] border-t border-bone/12 py-3 text-sm leading-relaxed text-bone/75">
                      <span className="font-mono text-xs text-fog tabular">{j + 1}.</span>
                      {s}
                    </li>
                  ))}
                </ol>
                <Link
                  href={g.href}
                  className="kicker mt-6 inline-flex items-center gap-2 text-fog transition-colors hover:text-bone"
                >
                  Use it → {g.for.split(" ")[0].replace(",", "")}
                </Link>
              </FadeUp>
            </article>
          ))}
        </div>

        <div className="mt-16 grid gap-10 md:grid-cols-12">
          <p className="kicker text-fog md:col-span-3">Good to know</p>
          <dl className="grid gap-px border border-bone/12 bg-bone/12 sm:grid-cols-2 md:col-span-9">
            {TIPS.map(([t, d]) => (
              <div key={t} className="bg-ink p-5">
                <dt className="text-base text-bone">{t}</dt>
                <dd className="mt-1.5 text-sm leading-relaxed text-fog">{d}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="mt-16 flex flex-wrap gap-2 md:ml-[25%]">
          <Link href="/onboarding" className="kicker flex h-12 items-center bg-signal px-6 text-bone transition-colors hover:bg-bone hover:text-ink">
            Enter my measurements
          </Link>
          <Link href="/profile" className="kicker flex h-12 items-center border border-bone/20 px-6 text-bone transition-colors hover:border-bone/60">
            My size profile
          </Link>
        </div>
      </section>
    </>
  );
}
