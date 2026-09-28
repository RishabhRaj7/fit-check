import type { Metadata } from "next";
import OnboardingFlow from "@/components/OnboardingFlow";
import { allCategoryBrands, allCategoryCharts, getCatalog } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Find my size",
  description: "Tell us one size you already wear — get your size in every brand.",
};

export default async function OnboardingPage() {
  const cat = await getCatalog();
  return (
    <section className="mx-auto max-w-[1440px] px-4 py-12 md:px-8 md:py-16">
      <p className="kicker text-fog">Find my size · about 30 seconds</p>
      <h1 className="mt-4 mb-12 font-display text-[clamp(2.25rem,5vw,4rem)] leading-[1] font-light tracking-[-0.03em] text-bone">
        Three sizes you trust.
      </h1>
      <OnboardingFlow charts={allCategoryCharts(cat)} brands={allCategoryBrands(cat)} />
    </section>
  );
}
