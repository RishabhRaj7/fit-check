"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import AnchorInput, { type Anchor } from "@/components/AnchorInput";
import { CATEGORIES, GENDERS, formatCm, rowPrimaryLabel, type CategoryId } from "@/lib/categories";
import { isUserCancelled } from "@/lib/firebase/clientAuth";
import { cn } from "@/lib/format";
import { saveEntry, setGender, signIn, useProfile } from "@/lib/profile";
import { passport, type CategoryCharts, type LiteBrand } from "@/lib/sizing";

const STEPS: { category: CategoryId; kicker: string; title: string; sub: string }[] = [
  {
    category: "sneakers",
    kicker: "Footwear",
    title: "Your usual sneaker size.",
    sub: "Pick the brand and size that fits you best — we work out your foot length from their chart. Or measure it; it takes a minute.",
  },
  {
    category: "tshirt",
    kicker: "Tops",
    title: "A T-shirt that fits you right.",
    sub: "Any brand. Its size becomes your chest measurement.",
  },
  {
    category: "trousers",
    kicker: "Bottoms",
    title: "Your trouser waist.",
    sub: "The waist size on a pair that fits well. Inseam doesn't matter here.",
  },
];

export default function OnboardingFlow({
  charts,
  brands,
}: {
  charts: Record<CategoryId, CategoryCharts>;
  brands: Record<CategoryId, LiteBrand[]>;
}) {
  const { gender, user, syncAvailable } = useProfile();
  const [step, setStep] = useState(0);
  const [picks, setPicks] = useState<Partial<Record<CategoryId, Anchor>>>({});
  const [saved, setSaved] = useState<CategoryId[]>([]);
  const [signInError, setSignInError] = useState("");

  const done = step >= STEPS.length;
  const current = STEPS[Math.min(step, STEPS.length - 1)];
  const pick = picks[current.category] ?? null;

  const next = async (keep: boolean) => {
    if (keep && pick) {
      await saveEntry(current.category, gender, { ...pick, confidence: "exact" });
      setSaved((s) => [...s.filter((c) => c !== current.category), current.category]);
    }
    setStep((s) => s + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div>
      {/* progress */}
      <ol className="grid grid-cols-3 gap-px" aria-label="Progress">
        {STEPS.map((s, i) => (
          <li key={s.category} aria-current={i === step ? "step" : undefined}>
            <div className={cn("h-px", i < step || done ? "bg-signal" : i === step ? "bg-bone" : "bg-bone/15")} />
            <p className={cn("kicker mt-3", i === step ? "text-bone" : "text-fog")}>
              0{i + 1} {s.kicker}
              {saved.includes(s.category) && <span className="text-frost"> · saved</span>}
            </p>
          </li>
        ))}
      </ol>

      <AnimatePresence mode="wait">
        {!done ? (
          <motion.div
            key={current.category}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="mt-12 grid gap-10 lg:grid-cols-12"
          >
            <div className="lg:col-span-5">
              <p className="font-display text-[5rem] leading-none font-extralight text-bone/15 tabular md:text-[8rem]" aria-hidden="true">
                0{step + 1}
              </p>
              <h2 className="mt-4 font-display text-[clamp(2rem,4vw,3.25rem)] leading-[1.02] font-light tracking-[-0.025em] text-bone">
                {current.title}
              </h2>
              <p className="mt-4 max-w-md text-base leading-relaxed text-bone/65">{current.sub}</p>
              {step === 0 && (
                <div className="mt-8">
                  <p className="kicker mb-2 text-fog">Charts for</p>
                  <div className="flex border border-bone/15 sm:inline-flex" role="group" aria-label="Charts for">
                    {GENDERS.map((g) => (
                      <button
                        key={g.id}
                        aria-pressed={gender === g.id}
                        onClick={() => {
                          setGender(g.id);
                          setPicks({});
                        }}
                        className={cn(
                          "kicker flex-1 px-5 py-2.5 transition-colors",
                          gender === g.id ? "bg-bone text-ink" : "text-fog hover:text-bone"
                        )}
                      >
                        {g.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="lg:col-span-7">
              <div className="border border-bone/12 bg-coal p-5 md:p-7">
                <AnchorInput
                  key={`${current.category}-${gender}`}
                  category={current.category}
                  gender={gender}
                  brands={brands[current.category]}
                  charts={charts[current.category]}
                  value={pick}
                  onChange={(a) => setPicks((p) => ({ ...p, [current.category]: a }))}
                />
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <button
                  disabled={!pick}
                  onClick={() => void next(true)}
                  className="kicker flex h-12 items-center bg-signal px-6 text-bone transition-colors hover:bg-bone hover:text-ink disabled:cursor-not-allowed disabled:opacity-30"
                >
                  {pick
                    ? `Save ${formatCm(pick.anchorValue)} cm & continue`
                    : "Choose a size to continue"}
                </button>
                <button
                  onClick={() => void next(false)}
                  className="kicker flex h-12 items-center px-4 text-fog transition-colors hover:text-bone"
                >
                  Skip
                </button>
                {step > 0 && (
                  <button
                    onClick={() => setStep((s) => s - 1)}
                    className="kicker ml-auto flex h-12 items-center px-4 text-fog transition-colors hover:text-bone"
                  >
                    Back
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="done"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="mt-12"
          >
            <h2 className="font-display text-[clamp(2.25rem,5vw,4rem)] leading-[1] font-light tracking-[-0.03em] text-bone">
              {saved.length ? "Calibrated." : "Nothing saved yet."}
            </h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-bone/65">
              {saved.length
                ? "Here's a first look. Every brand page now opens with your size on it, and your profile holds the full list."
                : "No problem — you can set a size from any brand page, or from your profile."}
            </p>

            {saved.length > 0 && (
              <div className="mt-10 grid gap-4 md:grid-cols-3">
                {STEPS.filter((s) => saved.includes(s.category)).map((s) => {
                  const a = picks[s.category]!;
                  const rows = passport(charts[s.category], brands[s.category], s.category, gender, a.anchorValue)
                    .filter((r) => r.match.row && r.match.status !== "estimate")
                    .slice(0, 5);
                  return (
                    <div key={s.category} className="border border-bone/12 p-5">
                      <div className="flex items-baseline justify-between border-b border-bone/12 pb-3">
                        <span className="kicker text-fog">{CATEGORIES[s.category].label}</span>
                        <span className="kicker text-bone">{formatCm(a.anchorValue)} cm</span>
                      </div>
                      <ul>
                        {rows.map(({ brand, match }) => (
                          <li key={brand.slug} className="flex items-baseline justify-between border-b border-bone/8 py-2.5 last:border-0">
                            <span className="text-sm text-bone/80">{brand.name}</span>
                            <span className="font-display text-base font-light tabular text-bone">
                              {rowPrimaryLabel(s.category, match.row!)}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            )}

            {saved.length > 0 && syncAvailable && !user && (
              <div className="mt-8 flex flex-col justify-between gap-4 border border-bone/12 p-5 md:flex-row md:items-center">
                <p className="max-w-xl text-sm leading-relaxed text-fog">
                  <span className="text-bone">Saved on this device.</span> Sign in with Google to
                  keep these sizes on your phone and laptop alike.
                </p>
                <div>
                  <button
                    onClick={() =>
                      signIn().catch((e) => {
                        if (!isUserCancelled(e)) setSignInError("Sign-in didn't complete. Please try again.");
                      })
                    }
                    className="kicker flex h-11 items-center bg-bone px-5 text-ink transition-colors hover:bg-signal hover:text-bone"
                  >
                    Sign in with Google
                  </button>
                  {signInError && <p className="mt-2 text-sm text-frost">{signInError}</p>}
                </div>
              </div>
            )}
            {user && saved.length > 0 && (
              <p className="kicker mt-6 text-fog">Synced to {user.email}</p>
            )}

            <div className="mt-10 flex flex-wrap gap-2">
              <Link href="/profile" className="kicker flex h-12 items-center bg-signal px-6 text-bone transition-colors hover:bg-bone hover:text-ink">
                See all my sizes
              </Link>
              <Link href="/category/sneakers" className="kicker flex h-12 items-center border border-bone/20 px-6 text-bone transition-colors hover:border-bone/60">
                Browse brands
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
