import { cn } from "@/lib/format";

/** "New Balance" → "NB", "H&M" → "HM", "Levi's" → "L". */
export function initials(name: string): string {
  const words = name.replace(/[^A-Za-z0-9 &]/g, "").split(/[\s&]+/).filter(Boolean);
  if (words.length === 1) return words[0].charAt(0).toUpperCase();
  return words
    .slice(0, 2)
    .map((w) => w.charAt(0).toUpperCase())
    .join("");
}

/**
 * Typographic brand tile. Uses a logo only when an absolute image URL has
 * been set in /admin — no guessed paths, so no 404s.
 */
export default function BrandMark({
  name,
  logoUrl,
  className,
}: {
  name: string;
  logoUrl?: string | null;
  className?: string;
}) {
  const hasLogo = !!logoUrl && /^https?:\/\//.test(logoUrl);
  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden border border-bone/15 bg-coal",
        className
      )}
      aria-hidden="true"
    >
      {hasLogo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={logoUrl!} alt="" className="h-full w-full object-contain p-1.5" />
      ) : (
        <span className="font-display text-[0.8em] font-medium tracking-wide text-bone">
          {initials(name)}
        </span>
      )}
    </span>
  );
}
