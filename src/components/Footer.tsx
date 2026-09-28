import Link from "next/link";
import { CATEGORIES, GROUPS } from "@/lib/categories";
import { LogoMark } from "@/components/Logo";

export default function Footer() {
  return (
    <footer className="border-t border-bone/10">
      <div className="rule-ticks h-3 opacity-60" aria-hidden="true" />
      <div className="mx-auto grid max-w-[1440px] gap-12 px-4 pt-14 pb-10 md:grid-cols-12 md:px-8">
        <div className="md:col-span-4">
          <LogoMark className="h-7 w-7 text-bone" />
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-fog">
            One measurement, read back in every brand&apos;s own chart. UK / IND,
            US, EU and JP sizing for how India actually shops.
          </p>
        </div>
        <nav aria-label="Footer" className="grid grid-cols-2 gap-8 sm:grid-cols-4 md:col-span-8">
          {GROUPS.map((g) => (
            <div key={g.id} className="flex flex-col gap-2.5">
              <span className="kicker mb-1 text-fog">{g.label}</span>
              {g.categories.map((c) => (
                <Link key={c} href={`/category/${c}`} className="text-sm text-bone/80 transition-colors hover:text-bone">
                  {CATEGORIES[c].label}
                </Link>
              ))}
            </div>
          ))}
          <div className="flex flex-col gap-2.5">
            <span className="kicker mb-1 text-fog">You</span>
            <Link href="/onboarding" className="text-sm text-bone/80 transition-colors hover:text-bone">
              Find my size
            </Link>
            <Link href="/profile" className="text-sm text-bone/80 transition-colors hover:text-bone">
              Size profile
            </Link>
            <Link href="/measure" className="text-sm text-bone/80 transition-colors hover:text-bone">
              How to measure
            </Link>
          </div>
        </nav>
      </div>
      <div className="mx-auto flex max-w-[1440px] flex-col gap-2 border-t border-bone/10 px-4 py-6 md:flex-row md:items-center md:justify-between md:px-8">
        <span className="kicker text-fog">Fit Check · {new Date().getFullYear()}</span>
        <span className="kicker text-fog">
          Charts are guides, not guarantees — fit also depends on the model.{" "}
          <Link href="/admin" className="text-fog/60 transition-colors hover:text-bone">
            Admin
          </Link>
        </span>
      </div>
    </footer>
  );
}
