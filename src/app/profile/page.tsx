import type { Metadata } from "next";
import ProfileClient from "@/components/ProfileClient";
import { allCategoryBrands, allCategoryCharts, getCatalog } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Your size profile",
  robots: { index: false },
};

export default async function ProfilePage() {
  const cat = await getCatalog();
  return (
    <section className="mx-auto max-w-[1440px] px-4 py-12 md:px-8 md:py-16">
      <p className="kicker text-fog">Size profile</p>
      <h1 className="mt-4 font-display text-[clamp(2.5rem,6vw,5rem)] leading-[0.95] font-light tracking-[-0.035em] text-bone">
        Your sizes, everywhere.
      </h1>
      <p className="mt-5 mb-10 max-w-xl text-base leading-relaxed text-bone/65">
        One measurement per category. Each one is read back in every brand we
        hold — change it here and every brand page follows.
      </p>
      <ProfileClient charts={allCategoryCharts(cat)} brands={allCategoryBrands(cat)} />
    </section>
  );
}
