import type { Metadata } from "next";
import ProfileClient from "@/components/ProfileClient";
import type { LiteBrand } from "@/components/KnownSizePicker";
import { CATEGORY_ORDER, type CategoryId } from "@/lib/categories";
import { getChartAvailability, listBrands } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Profile" };

export default async function ProfilePage() {
  const all = await listBrands();
  const avail = await Promise.all(
    CATEGORY_ORDER.map((c) => getChartAvailability(c))
  );

  const brandSets = {} as Record<CategoryId, LiteBrand[]>;
  CATEGORY_ORDER.forEach((c, i) => {
    const a = avail[i];
    brandSets[c] = all
      .filter((b) => b.categories.includes(c))
      .map((b) => ({
        slug: b.slug,
        name: b.name,
        logoUrl: b.logoUrl,
        hasChart: (a[b.slug] ?? []).length > 0,
      }));
  });

  return (
    <section className="mx-auto max-w-[1600px] px-4 py-14 md:px-8 md:py-20">
      <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="font-mono text-[10px] tracking-[0.3em] text-fog">
            PROFILE — STORED ON THIS DEVICE
          </p>
          <h1 className="mt-3 font-display text-5xl leading-[0.9] tracking-tight text-bone md:text-7xl">
            YOUR ANCHORS<span className="text-frost">.</span>
          </h1>
        </div>
        <p className="max-w-xs font-mono text-[10px] leading-relaxed tracking-[0.14em] text-fog">
          ONE ENTRY PER CATEGORY + GENDER. THESE ARE WHAT EVERY BRAND PAGE
          CONVERTS FROM — EDIT OR REMOVE ANYTIME.
        </p>
      </div>
      <ProfileClient brandSets={brandSets} />
    </section>
  );
}
