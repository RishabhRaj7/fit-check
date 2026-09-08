import type { Metadata } from "next";
import OnboardingFlow from "@/components/OnboardingFlow";
import type { LiteBrand } from "@/components/KnownSizePicker";
import { getChartAvailability, listBrands } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Onboarding" };

export default async function OnboardingPage() {
  const all = await listBrands();
  const [aSn, aTs, aTr] = await Promise.all([
    getChartAvailability("sneakers"),
    getChartAvailability("tshirt"),
    getChartAvailability("trousers"),
  ]);

  const lite = (cats: string[], avail: Record<string, string[]>): LiteBrand[] =>
    all
      .filter((b) => cats.some((c) => b.categories.includes(c)))
      .map((b) => ({
        slug: b.slug,
        name: b.name,
        logoUrl: b.logoUrl,
        hasChart: (avail[b.slug] ?? []).length > 0,
      }));

  const brandSets = {
    sneakers: lite(["sneakers"], aSn),
    tshirt: lite(["tshirt"], aTs),
    trousers: lite(["trousers"], aTr),
  };

  return (
    <section className="mx-auto max-w-[1600px] px-4 py-14 md:px-8 md:py-20">
      <div className="mb-12 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="font-mono text-[10px] tracking-[0.3em] text-frost">
            FIRST-VISIT ANCHORING — 20 SECONDS
          </p>
          <h1 className="mt-3 max-w-3xl font-display text-5xl leading-[0.9] tracking-tight text-bone md:text-7xl">
            TELL US ONE SIZE YOU TRUST<span className="text-frost">.</span>
          </h1>
        </div>
        <p className="max-w-xs font-mono text-[10px] leading-relaxed tracking-[0.14em] text-fog">
          STORED ON THIS DEVICE ONLY. SKIP ANYTHING — EVERYTHING IS EDITABLE
          LATER IN /PROFILE.
        </p>
      </div>
      <div className="relative max-w-4xl">
        <OnboardingFlow brandSets={brandSets} />
      </div>
    </section>
  );
}
