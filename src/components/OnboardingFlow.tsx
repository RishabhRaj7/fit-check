"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Check, Footprints, Shirt } from "lucide-react";
import { CATEGORIES, GENDERS, type CategoryId } from "@/lib/categories";
import { cn } from "@/lib/format";
import { saveEntry } from "@/lib/profile";
import KnownSizePicker, {
  type LiteBrand,
  type PickedSize,
} from "@/components/KnownSizePicker";

type Step = 0 | 1 | 2;

export default function OnboardingFlow({
  brandSets,
}: {
  brandSets: Record<"sneakers" | "tshirt" | "trousers", LiteBrand[]>;
}) {
  const [step, setStep] = useState<Step>(0);
  const [gender, setGender] = useState<"men" | "women">("men");
  const [sneakerPick, setSneakerPick] = useState<PickedSize | null>(null);
  const [apparelCat, setApparelCat] = useState<"tshirt" | "trousers">("tshirt");
  const [apparelPick, setApparelPick] = useState<PickedSize | null>(null);
  const [count, setCount] = useState(0);

  const commitSneakers = () => {
    if (sneakerPick) {
      void saveEntry("sneakers", gender, {
        anchorValue: sneakerPick.anchorValue,
        sourceBrandSlug: sneakerPick.slug,
        sourceBrandName: sneakerPick.name,
        sourceSizeLabel: sneakerPick.label,
        confidence: "exact",
      });
      setCount((c) => c + 1);
    }
  };

  const commitApparel = () => {
    if (apparelPick) {
      void saveEntry(apparelCat, gender, {
        anchorValue: apparelPick.anchorValue,
        sourceBrandSlug: apparelPick.slug,
        sourceBrandName: apparelPick.name,
        sourceSizeLabel: apparelPick.label,
        confidence: "exact",
      });
      setCount((c) => c + 1);
    }
  };

  const steps: { id: Step; kicker: string; title: string; sub: string }[] = [
    {
      id: 0,
      kicker: "STEP 01 — FOOTWEAR",
      title: "WHAT'S YOUR USUAL SNEAKER SIZE?",
      sub: "Pick the brand and size whose fit you trust most. We back-calculate your exact foot length from their chart.",
    },
    {
      id: 1,
      kicker: "STEP 02 — APPAREL",
      title: "AND YOUR GO-TO FIT UP TOP / BELOW.",
      sub: "T-shirt or trousers — either one anchors your chest or waist measurement.",
    },
  ];

  return (
    <div className="relative">
      <div className="pointer-events-none absolute -top-6 right-0 hidden select-none lg:block">
        <span className="font-display text-[11rem] leading-none text-stroke">
          {String(step + 1).padStart(2, "0")}
        </span>
      </div>

      {step < 2 && (
        <div className="mb-8 flex items-center justify-between gap-4">
          <span className="font-mono text-[10px] tracking-[0.24em] text-fog">
            {steps[step].kicker}
          </span>
          <div className="flex border border-bone/15">
            {GENDERS.map((g) => (
              <button
                key={g.id}
                onClick={() => setGender(g.id as "men" | "women")}
                className={cn(
                  "px-3 py-1.5 font-mono text-[10px] tracking-[0.18em] transition-colors",
                  gender === g.id ? "bg-bone text-ink" : "text-fog hover:text-bone"
                )}
              >
                {g.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div
            key="s0"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2 className="max-w-2xl font-display text-4xl leading-[0.95] tracking-tight text-bone md:text-6xl">
              {steps[0].title}
            </h2>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-fog">
              {steps[0].sub}
            </p>
            <div className="mt-8 max-w-2xl border border-bone/12 bg-coal p-5 md:p-7">
              <KnownSizePicker
                category="sneakers"
                gender={gender}
                brands={brandSets.sneakers}
                value={sneakerPick}
                onChange={setSneakerPick}
              />
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                disabled={!sneakerPick}
                onClick={() => {
                  commitSneakers();
                  setStep(1);
                }}
                className="flex items-center gap-2 bg-signal px-6 py-3.5 font-mono text-[11px] font-semibold tracking-[0.2em] text-bone uppercase transition-colors hover:bg-bone hover:text-ink disabled:cursor-not-allowed disabled:opacity-30"
              >
                Anchor it <ArrowRight size={14} strokeWidth={2.4} />
              </button>
              <button
                onClick={() => setStep(1)}
                className="font-mono text-[11px] tracking-[0.2em] text-fog uppercase transition-colors hover:text-bone"
              >
                Skip this one
              </button>
            </div>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div
            key="s1"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2 className="max-w-2xl font-display text-4xl leading-[0.95] tracking-tight text-bone md:text-6xl">
              {steps[1].title}
            </h2>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-fog">
              {steps[1].sub}
            </p>

            <div className="mt-6 flex gap-px border border-bone/15 bg-bone/15">
              {(
                [
                  ["tshirt", "T-SHIRT", Shirt],
                  ["trousers", "TROUSERS / JEANS", Footprints],
                ] as [CategoryId, string, typeof Shirt][]
              ).map(([c, label, Icon]) => (
                <button
                  key={c}
                  onClick={() => {
                    setApparelCat(c as "tshirt" | "trousers");
                    setApparelPick(null);
                  }}
                  className={cn(
                    "flex flex-1 items-center justify-center gap-2 px-4 py-3 font-mono text-[10px] tracking-[0.18em] transition-colors",
                    apparelCat === c
                      ? "bg-bone text-ink"
                      : "bg-ink text-fog hover:text-bone"
                  )}
                >
                  <Icon size={13} strokeWidth={1.8} /> {label}
                </button>
              ))}
            </div>

            <div className="mt-6 max-w-2xl border border-bone/12 bg-coal p-5 md:p-7">
              <KnownSizePicker
                key={apparelCat}
                category={apparelCat}
                gender={gender}
                brands={brandSets[apparelCat]}
                value={apparelPick}
                onChange={setApparelPick}
              />
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                disabled={!apparelPick}
                onClick={() => {
                  commitApparel();
                  setStep(2);
                }}
                className="flex items-center gap-2 bg-signal px-6 py-3.5 font-mono text-[11px] font-semibold tracking-[0.2em] text-bone uppercase transition-colors hover:bg-bone hover:text-ink disabled:cursor-not-allowed disabled:opacity-30"
              >
                Anchor it <ArrowRight size={14} strokeWidth={2.4} />
              </button>
              <button
                onClick={() => setStep(2)}
                className="font-mono text-[11px] tracking-[0.2em] text-fog uppercase transition-colors hover:text-bone"
              >
                Skip &amp; finish
              </button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="s2"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 220, damping: 20 }}
            className="border border-bone/12 bg-coal p-8 md:p-12"
          >
            <span className="font-mono text-[10px] tracking-[0.24em] text-frost">
              PROFILE ANCHORED
            </span>
            <h2 className="mt-3 font-display text-5xl leading-[0.9] tracking-tight text-bone md:text-7xl">
              LOCKED IN<span className="text-frost">.</span>
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-fog">
              {count > 0
                ? `${count} ${count === 1 ? "measurement" : "measurements"} saved to this device. Every brand page now converts for you instantly — no re-asking, ever.`
                : "Nothing saved yet — you can anchor a size anytime from any brand page."}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/category/sneakers"
                className="flex items-center gap-2 bg-signal px-6 py-3.5 font-mono text-[11px] font-semibold tracking-[0.2em] text-bone uppercase transition-colors hover:bg-bone hover:text-ink"
              >
                Find my size in a brand <ArrowRight size={14} strokeWidth={2.4} />
              </Link>
              <Link
                href="/profile"
                className="flex items-center gap-2 border border-bone/25 px-6 py-3.5 font-mono text-[11px] tracking-[0.2em] text-bone uppercase transition-colors hover:border-signal hover:text-frost"
              >
                <Check size={13} strokeWidth={2.2} /> View profile
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {step < 2 && (
        <div className="mt-10 flex items-center gap-3">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className={cn(
                "h-1 flex-1 transition-colors",
                i <= step ? "bg-signal" : "bg-bone/12"
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
