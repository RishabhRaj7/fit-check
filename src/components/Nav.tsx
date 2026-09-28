"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ANCHOR_LABEL, CATEGORIES, GROUPS, type GroupId } from "@/lib/categories";
import { cn } from "@/lib/format";
import { useProfile } from "@/lib/profile";
import { Wordmark } from "@/components/Logo";

export default function Nav() {
  const pathname = usePathname();
  const { profile, user, ready } = useProfile();
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState<GroupId | null>(null);
  const anchors = Object.keys(profile).length;

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-bone/10 bg-ink/95 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-[1440px] items-center justify-between gap-6 px-4 md:px-8">
        <Link href="/" aria-label="Fit Check — home">
          <Wordmark />
        </Link>

        <nav
          aria-label="Categories"
          className="hidden h-full items-stretch lg:flex"
          onKeyDown={(e) => e.key === "Escape" && setMenu(null)}
        >
          {GROUPS.map((g) => {
            const active = g.categories.some((c) => isActive(`/category/${c}`));
            const expanded = menu === g.id;
            return (
              <div
                key={g.id}
                className="relative flex"
                onMouseEnter={() => setMenu(g.id)}
                onMouseLeave={() => setMenu(null)}
                onBlur={(e) => {
                  if (!e.currentTarget.contains(e.relatedTarget as Node)) setMenu(null);
                }}
              >
                <button
                  aria-expanded={expanded}
                  aria-controls={`menu-${g.id}`}
                  onClick={() => setMenu(expanded ? null : g.id)}
                  className={cn(
                    "kicker relative flex items-center gap-1.5 px-4 transition-colors",
                    active || expanded ? "text-bone" : "text-fog hover:text-bone"
                  )}
                >
                  {g.label}
                  <span aria-hidden="true" className={cn("text-[9px] transition-transform", expanded && "rotate-180")}>
                    ▾
                  </span>
                  {active && <span className="absolute inset-x-4 bottom-0 h-px bg-frost" />}
                </button>
                {expanded && (
                  <ul
                    id={`menu-${g.id}`}
                    className="absolute top-full left-0 min-w-64 border border-bone/12 bg-ink py-2"
                  >
                    {g.categories.map((c) => (
                      <li key={c}>
                        <Link
                          href={`/category/${c}`}
                          onClick={() => setMenu(null)}
                          aria-current={isActive(`/category/${c}`) ? "page" : undefined}
                          className={cn(
                            "block px-4 py-2.5 text-sm transition-colors hover:bg-coal",
                            isActive(`/category/${c}`) ? "text-frost" : "text-bone/85 hover:text-bone"
                          )}
                        >
                          {CATEGORIES[c].label}
                        </Link>
                      </li>
                    ))}
                    <li className="kicker mt-1 border-t border-bone/10 px-4 pt-3 pb-1 text-fog">
                      One {ANCHOR_LABEL[g.anchorKey].toLowerCase()} for all
                    </li>
                  </ul>
                )}
              </div>
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
          <div className="mx-auto grid max-w-[1440px] gap-6 px-4 py-5 sm:grid-cols-3 md:px-8">
            {GROUPS.map((g) => (
              <div key={g.id}>
                <p className="kicker mb-2 text-fog">{g.label}</p>
                <ul>
                  {g.categories.map((c) => (
                    <li key={c} className="border-b border-bone/10">
                      <Link href={`/category/${c}`} className="block py-3 font-display text-lg font-light text-bone">
                        {CATEGORIES[c].label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div className="flex flex-wrap gap-2 sm:col-span-3">
              <Link href="/measure" className="kicker flex h-11 items-center border border-bone/20 px-4 text-bone">
                How to measure
              </Link>
              <Link href="/onboarding" className="kicker flex h-11 items-center bg-signal px-4 text-bone">
                Find my size
              </Link>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
