"use client";

import { useState } from "react";
import { cn } from "@/lib/format";

/**
 * Brand logo with graceful fallback — if the logo asset is missing at the
 * expected path, render the brand initial on the accent tile (per spec §8).
 */
export default function BrandLogo({
  name,
  logoUrl,
  className,
  letterClassName,
}: {
  name: string;
  logoUrl?: string | null;
  className?: string;
  letterClassName?: string;
}) {
  const [broken, setBroken] = useState(false);
  const showImage = !!logoUrl && !broken;

  return (
    <div
      className={cn(
        "relative flex shrink-0 items-center justify-center overflow-hidden bg-signal",
        className
      )}
    >
      {showImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={logoUrl!}
          alt={`${name} logo`}
          onError={() => setBroken(true)}
          className="h-full w-full object-contain"
        />
      ) : (
        <span
          className={cn(
            "font-display leading-none text-bone select-none",
            letterClassName ?? "text-2xl"
          )}
        >
          {name.trim().charAt(0).toUpperCase()}
        </span>
      )}
    </div>
  );
}
