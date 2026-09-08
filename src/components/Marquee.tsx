import { cn } from "@/lib/format";

export default function Marquee({
  items,
  className,
  itemClassName,
  reverse = false,
}: {
  items: string[];
  className?: string;
  itemClassName?: string;
  reverse?: boolean;
}) {
  const row = items.join("   \u00D7   ") + "   \u00D7   ";
  return (
    <div className={cn("overflow-hidden whitespace-nowrap", className)}>
      <div
        className={cn(
          "inline-flex will-change-transform",
          reverse ? "animate-marquee-rev" : "animate-marquee"
        )}
      >
        <span className={cn("pr-10", itemClassName)}>{row}</span>
        <span className={cn("pr-10", itemClassName)} aria-hidden>
          {row}
        </span>
      </div>
    </div>
  );
}
