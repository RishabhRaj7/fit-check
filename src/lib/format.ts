export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export function inr(n?: number | null): string | null {
  if (n == null) return null;
  return "\u20B9" + n.toLocaleString("en-IN");
}

export function formatAnchor(value: number, unit: string): string {
  const v = Math.round(value * 10) / 10;
  return `${v} ${unit.toLowerCase()}`;
}

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
