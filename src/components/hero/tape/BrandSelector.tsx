"use client";

import { cn } from "@/lib/format";

export interface HeroBrand {
  slug: string;
  name: string;
}

/**
 * Vertical brand rail at the right edge — the measurement never changes,
 * only the size label that falls out of it.
 */
export default function BrandSelector({
  brands,
  active,
  onSelect,
}: {
  brands: HeroBrand[];
  active: string;
  onSelect: (slug: string) => void;
}) {
  return (
    <div className="pointer-events-auto z-20 flex flex-col items-end">
      <p className="mb-2 hidden pr-0.5 font-mono text-[9px] tracking-[0.3em] text-fog md:block">
        BRAND — SIZE LABEL
      </p>
      <div className="flex flex-row flex-wrap justify-end gap-1.5 md:flex-col md:items-stretch">
        {brands.map((b) => (
          <button
            key={b.slug}
            onClick={() => onSelect(b.slug)}
            className={cn(
              "border px-3 py-2.5 text-right font-mono text-[10px] tracking-[0.18em] uppercase transition-colors duration-200 md:w-32 md:py-2",
              active === b.slug
                ? "border-signal bg-signal text-bone"
                : "border-bone/25 bg-ink/85 text-fog hover:border-bone/50 hover:text-bone"
            )}
          >
            {b.name}
          </button>
        ))}
      </div>
    </div>
  );
}
