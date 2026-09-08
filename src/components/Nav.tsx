import Link from "next/link";
import { CATEGORY_ORDER, CATEGORIES } from "@/lib/categories";
import { Ruler, Settings2, User } from "lucide-react";

export default function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-bone/10 bg-ink/85 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-[1600px] items-center justify-between px-4 md:px-8">
        <Link href="/" className="group flex items-center gap-2.5">
          <svg viewBox="0 0 64 64" className="h-6 w-6" aria-hidden="true">
            <rect x="5" y="5" width="54" height="54" fill="none" stroke="#8cb8dd" strokeWidth="5" />
            <path d="M15 5v11M25 5v7M35 5v11M45 5v7" stroke="#8cb8dd" strokeWidth="5" fill="none" />
            <rect x="14" y="36" width="36" height="11" fill="#2c5f87" />
            <rect x="14" y="36" width="4" height="11" fill="#f5f5f0" />
          </svg>
          <span className="font-display text-xl tracking-wide text-bone">
            FIT CHECK
          </span>
          <span className="mb-[2px] inline-block h-2 w-2 bg-signal transition-transform group-hover:-translate-y-0.5" />
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {CATEGORY_ORDER.map((c) => (
            <Link
              key={c}
              href={`/category/${c}`}
              className="font-mono text-[11px] tracking-[0.18em] text-fog transition-colors hover:text-frost"
            >
              {CATEGORIES[c].nav}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 md:gap-3">
          <Link
            href="/profile"
            aria-label="Profile"
            className="flex h-9 w-9 items-center justify-center border border-bone/15 text-fog transition-colors hover:border-signal hover:text-frost"
          >
            <User size={15} strokeWidth={1.8} />
          </Link>
          <Link
            href="/admin"
            aria-label="Admin"
            className="flex h-9 w-9 items-center justify-center border border-bone/15 text-fog transition-colors hover:border-signal hover:text-frost"
          >
            <Settings2 size={15} strokeWidth={1.8} />
          </Link>
          <Link
            href="/onboarding"
            className="hidden items-center gap-2 bg-signal px-4 py-2.5 font-mono text-[11px] font-semibold tracking-[0.18em] text-bone uppercase transition-colors hover:bg-bone hover:text-ink sm:flex"
          >
            <Ruler size={13} strokeWidth={2.2} />
            Find my size
          </Link>
        </div>
      </div>
    </header>
  );
}
