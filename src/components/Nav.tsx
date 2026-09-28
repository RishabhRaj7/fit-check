"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CATEGORY_ORDER, CATEGORIES } from "@/lib/categories";
import { cn } from "@/lib/format";
import { useProfile } from "@/lib/profile";
import { Wordmark } from "@/components/Logo";

export default function Nav() {
  const pathname = usePathname();
  const { profile, user, ready } = useProfile();
  const [open, setOpen] = useState(false);
  const anchors = Object.keys(profile).length;

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-bone/10 bg-ink/95 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-[1440px] items-center justify-between gap-6 px-4 md:px-8">
        <Link href="/" aria-label="Fit Check — home">
          <Wordmark />
        </Link>

        <nav aria-label="Categories" className="hidden h-full items-stretch lg:flex">
          {CATEGORY_ORDER.map((c) => {
            const href = `/category/${c}`;
            const active = isActive(href);
            return (
              <Link
                key={c}
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "kicker relative flex items-center px-4 transition-colors",
                  active ? "text-bone" : "text-fog hover:text-bone"
                )}
              >
                {CATEGORIES[c].nav}
                {active && <span className="absolute inset-x-4 bottom-0 h-px bg-signal" />}
              </Link>
            );
          })}
          <Link
            href="/measure"
            aria-current={isActive("/measure") ? "page" : undefined}
            className={cn(
              "kicker relative flex items-center px-4 transition-colors",
              isActive("/measure") ? "text-bone" : "text-fog hover:text-bone"
            )}
          >
            How to measure
            {isActive("/measure") && <span className="absolute inset-x-4 bottom-0 h-px bg-signal" />}
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/profile"
            className={cn(
              "kicker flex h-9 items-center gap-2 border px-3 transition-colors",
              isActive("/profile")
                ? "border-bone/40 text-bone"
                : "border-bone/15 text-fog hover:border-bone/40 hover:text-bone"
            )}
          >
            <span
              className={cn(
                "inline-block h-1.5 w-1.5",
                user ? "bg-signal" : anchors > 0 ? "border border-signal" : "bg-bone/25"
              )}
              aria-hidden="true"
            />
            <span className="hidden sm:inline">Profile</span>
            {ready && anchors > 0 && <span className="tabular text-bone">{anchors}</span>}
            <span className="sr-only">
              {anchors} saved {anchors === 1 ? "size" : "sizes"}
              {user ? ", synced" : ""}
            </span>
          </Link>
          <Link
            href="/onboarding"
            className="kicker hidden h-9 items-center bg-signal px-4 text-bone transition-colors hover:bg-bone hover:text-ink sm:flex"
          >
            Find my size
          </Link>
          <button
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((o) => !o)}
            className="kicker flex h-9 items-center border border-bone/15 px-3 text-fog transition-colors hover:text-bone lg:hidden"
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </div>

      {open && (
        <nav
          id="mobile-menu"
          aria-label="Menu"
          onClick={() => setOpen(false)}
          className="border-t border-bone/10 bg-ink lg:hidden"
        >
          <ul className="mx-auto max-w-[1440px] px-4 py-2 md:px-8">
            {[
              ...CATEGORY_ORDER.map((c) => ({ href: `/category/${c}`, label: CATEGORIES[c].label })),
              { href: "/measure", label: "How to measure" },
              { href: "/onboarding", label: "Find my size" },
            ].map((l, i) => (
              <li key={l.href} className="border-b border-bone/10 last:border-0">
                <Link
                  href={l.href}
                  className="flex items-baseline gap-4 py-4 font-display text-xl font-light text-bone"
                >
                  <span className="kicker w-6 text-fog">{String(i + 1).padStart(2, "0")}</span>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
