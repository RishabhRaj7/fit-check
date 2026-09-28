import type { Fit } from "@/lib/categories";

/** Firestore id of a chart. "regular" has no suffix, so pre-fit ids still resolve. */
export function chartDocId(brandSlug: string, category: string, gender: string, fit: Fit | string = "regular") {
  const base = `${brandSlug}__${category}__${gender}`;
  return fit === "regular" ? base : `${base}__${fit}`;
}
