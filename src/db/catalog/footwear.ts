/* Footwear-first brands — charts transcribed from each brand's own size guide. */
import { from, shoes, type BrandSeed } from "./helpers";

/* ─────────────────────────────── Skechers ────────────────────────────── */
// skechers.in product size charts — retrieved Sep 2026.
const skShoesM = shoes({
  us: "6.5 7 7.5 8 8.5 9 9.5 10 10.5 11 11.5 12 12.5 13 13.5 14",
  uk: "5.5 6 6.5 7 7.5 8 8.5 9 9.5 10 10.5 11 11.5 12 12.5 13",
  eu: "39 39.5 40 41 41.5 42 42.5 43 44 45 45.5 46 47 47.5 48 48.5",
  cm: "24.5 25 25.5 26 26.5 27 27.5 28 28.5 29 29.5 30 30.5 31 31.5 32",
});
const skShoesW = shoes({
  us: "5 5.5 6 6.5 7 7.5 8 8.5 9 9.5 10 10.5 11 12 13",
  uk: "2 2.5 3 3.5 4 4.5 5 5.5 6 6.5 7 7.5 8 9 10",
  eu: "35 35.5 36 36.5 37 37.5 38 38.5 39 39.5 40 40.5 41 42 43",
  cm: "22 22.5 23 23.5 24 24.5 25 25.5 26 26.5 27 27.5 28 29 30",
});
const skM = from({ source: "Skechers India men's size chart", sourceUrl: "https://www.skechers.in/hotshot---roaver/254152-YLMT.html" });
const skW = from({ source: "Skechers India women's size chart", sourceUrl: "https://www.skechers.in/hotshot-kickoff/185232-NTLB.html" });

const skechers: BrandSeed = {
  name: "Skechers",
  slug: "skechers",
  priority: 90,
  categories: ["sneakers", "running", "slides"],
  charts: [
    skM("sneakers", "men", skShoesM),
    skW("sneakers", "women", skShoesW),
    skM("running", "men", skShoesM),
    skW("running", "women", skShoesW),
    skM("slides", "men", skShoesM),
    skW("slides", "women", skShoesW),
  ],
};

/* ─────────────────────────────── Converse ────────────────────────────── */
// converse.com/size-chart-guide — Chuck Taylor All Star & Chuck 70 chart,
// published with the note "These sneakers run large" (US men = UK here).
const cvShoesM = shoes({
  us: "5 5.5 6 6.5 7 7.5 8 8.5 9 9.5 10 10.5 11 11.5 12 13",
  uk: "5 5.5 6 6.5 7 7.5 8 8.5 9 9.5 10 10.5 11 11.5 12 13",
  eu: "37.5 38 39 39.5 40 41 41.5 42 42.5 43 44 44.5 45 46 46.5 48",
  cm: "24 24.5 24.5 25 25.5 26 26.5 27 27.5 28 28.5 29 29.5 30 30.5 31.5",
  jp: false,
});
const cvShoesW = shoes({
  us: "5 5.5 6 6.5 7 7.5 8 8.5 9 9.5 10 10.5 11 11.5 12",
  uk: "3 3.5 4 4.5 5 5.5 6 6.5 7 7.5 8 8.5 9 9.5 10",
  eu: "35 36 36.5 37 37.5 38 39 39.5 40 41 41.5 42 42.5 43 44",
  cm: "22 22.5 23 23.5 24 24.5 24.5 25 25.5 26 26.5 27 27.5 28 28.5",
  jp: false,
});
const cv = from({ source: "Converse Chuck Taylor size chart (“these sneakers run large”)", sourceUrl: "https://www.converse.com/size-chart-guide?id=men" });

const converse: BrandSeed = {
  name: "Converse",
  slug: "converse",
  priority: 84,
  categories: ["sneakers"],
  charts: [cv("sneakers", "men", cvShoesM), cv("sneakers", "women", cvShoesW)],
};

/* ───────────────────────────────── Vans ──────────────────────────────── */
// vans.com/en-us/help/size-charts — retrieved Sep 2026. JP size = foot length in cm.
const vansShoesM = shoes({
  us: "6.5 7 7.5 8 8.5 9 9.5 10 10.5 11 11.5 12 13 14",
  uk: "5.5 6 6.5 7 7.5 8 8.5 9 9.5 10 10.5 11 12 13",
  eu: "38.5 39 40 40.5 41 42 42.5 43 44 44.5 45 46 47 48",
  cm: "24.5 25 25.5 26 26.5 27 27.5 28 28.5 29 29.5 30 31 32",
});
const vansShoesW = shoes({
  us: "5 5.5 6 6.5 7 7.5 8 8.5 9 9.5 10 10.5 11 11.5",
  uk: "2.5 3 3.5 4 4.5 5 5.5 6 6.5 7 7.5 8 8.5 9",
  eu: "34.5 35 36 36.5 37 38 38.5 39 40 40.5 41 42 42.5 43",
  cm: "21.5 22 22.5 23 23.5 24 24.5 25 25.5 26 26.5 27 27.5 28",
});
const vans_ = from({ source: "Vans size chart", sourceUrl: "https://www.vans.com/en-us/help/size-charts" });

const vans: BrandSeed = {
  name: "Vans",
  slug: "vans",
  priority: 83,
  categories: ["sneakers", "slides"],
  charts: [
    vans_("sneakers", "men", vansShoesM),
    vans_("sneakers", "women", vansShoesW),
    vans_("slides", "men", vansShoesM),
    vans_("slides", "women", vansShoesW),
  ],
};

/* ──────────────────────────────── Campus ─────────────────────────────── */
// campusshoes.com/pages/{mens,womens}-size-chart (chart images) — retrieved Sep 2026.
// Campus prints shoe length and says to add 1/4–1/2 inch to your foot, so
// foot length = printed length − 3/8 in (0.95 cm), rounded to 0.1 cm.
const campusM = shoes({
  uk: "6 7 8 9 10 11 12 13",
  us: "7 8 9 10 11 12 13 14",
  eu: "40 41 42 43 44 45 46 47",
  cm: "25.5 26.3 27.1 27.9 28.7 29.6 30.5 31.3",
  jp: false,
});
const campusW = shoes({
  uk: "4 5 6 7 8",
  us: "5 6 7 8 9",
  eu: "37 38 39 40 41",
  cm: "23.6 24.3 24.9 25.6 26.2",
  jp: false,
});
const campusSrcM = from({ source: "Campus men's size chart (length − 3/8 in, per Campus's measuring advice)", sourceUrl: "https://www.campusshoes.com/pages/mens-size-chart" });
const campusSrcW = from({ source: "Campus women's size chart (length − 3/8 in, per Campus's measuring advice)", sourceUrl: "https://www.campusshoes.com/pages/womens-size-chart" });

const campus: BrandSeed = {
  name: "Campus",
  slug: "campus",
  priority: 80,
  categories: ["sneakers", "running", "slides"],
  charts: (["sneakers", "running", "slides"] as const).flatMap((c) => [
    campusSrcM(c, "men", campusM),
    campusSrcW(c, "women", campusW),
  ]),
};

/* ────────────────────────────── Decathlon ────────────────────────────── */
// Decathlon India size guide (served from Decathlon's size-guide CDN) — Sep 2026.
// One unisex table: UK/EU "website size", Indian size and foot length.
const dktShoes = shoes({
  uk: "3 4 5 5.5 6.5 7 8 8.5 9.5 10.5 11 12 12.5",
  eu: "36 37 38 39 40 41 42 43 44 45 46 47 48",
  cm: "22.5 23.5 24 24.5 25.5 26 27 27.5 28 29 29.5 30 31",
  jp: false,
});
const dkt = from({
  source: "Decathlon India shoe size guide (unisex)",
  sourceUrl: "https://d1314cmsbd81ch.cloudfront.net/new_size_guide/shoes-walk/index.html",
});

const decathlon: BrandSeed = {
  name: "Decathlon",
  slug: "decathlon",
  priority: 78,
  categories: ["running", "sneakers", "slides", "tshirt", "shorts"],
  charts: (["running", "sneakers", "slides"] as const).flatMap((c) => [dkt(c, "men", dktShoes), dkt(c, "women", dktShoes)]),
};

export const FOOTWEAR: BrandSeed[] = [skechers, converse, vans, campus, decathlon];
