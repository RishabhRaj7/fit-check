import Link from "next/link";
import { CATEGORY_ORDER, CATEGORIES } from "@/lib/categories";

export default function Footer() {
  return (
    <footer className="border-t border-bone/10 bg-ink">
      <div className="mx-auto max-w-[1600px] px-4 pt-16 pb-8 md:px-8">
        <div className="flex flex-col gap-12 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-display text-[clamp(3.4rem,12.5vw,10rem)] leading-[0.85] tracking-tight text-stroke select-none whitespace-nowrap">
              FIT CHECK
            </p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-fog">
              Sizes in UK / IND, EU, US and JPN. Anchored to your body, not to
              guesswork. Built for how India actually shops.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-x-16 gap-y-2 md:grid-cols-3">
            <div className="flex flex-col gap-2">
              <span className="mb-1 font-mono text-[10px] tracking-[0.22em] text-fog">
                CATEGORIES
              </span>
              {CATEGORY_ORDER.map((c) => (
                <Link
                  key={c}
                  href={`/category/${c}`}
                  className="text-sm text-bone/80 transition-colors hover:text-frost"
                >
                  {CATEGORIES[c].label}
                </Link>
              ))}
            </div>
            <div className="flex flex-col gap-2">
              <span className="mb-1 font-mono text-[10px] tracking-[0.22em] text-fog">
                SYSTEM
              </span>
              <Link href="/onboarding" className="text-sm text-bone/80 transition-colors hover:text-frost">
                Onboarding
              </Link>
              <Link href="/profile" className="text-sm text-bone/80 transition-colors hover:text-frost">
                Profile
              </Link>
              <Link href="/admin" className="text-sm text-bone/80 transition-colors hover:text-frost">
                Admin
              </Link>
            </div>
            <div className="flex flex-col gap-2">
              <span className="mb-1 font-mono text-[10px] tracking-[0.22em] text-fog">
                ANCHORS
              </span>
              <span className="font-mono text-xs text-fog">FOOT — CM</span>
              <span className="font-mono text-xs text-fog">CHEST — CM</span>
              <span className="font-mono text-xs text-fog">WAIST — CM</span>
            </div>
          </div>
        </div>
        <div className="mt-14 flex flex-col gap-2 border-t border-bone/10 pt-6 font-mono text-[10px] tracking-[0.2em] text-fog md:flex-row md:items-center md:justify-between">
          <span>FIT CHECK — 2026</span>
          <span>
            A NEW BRAND IS A FORM, NOT A DEPLOY<span className="text-frost">.</span>
          </span>
        </div>
      </div>
    </footer>
  );
}
