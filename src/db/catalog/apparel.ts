/* Clothing brands — body-measurement charts from each brand's own size guide. */
import { EASE_CM, bottoms, from, garmentTops, tops, type BrandSeed } from "./helpers";

/* ───────────────────────────────── H&M ───────────────────────────────── */
// H&M India product size guides — retrieved Sep 2026 (body measurements, cm).
const hmTopsM = from({ source: "H&M India men's size guide", sourceUrl: "https://www2.hm.com/en_in/productpage.0685816002.html" });
const hmTopsW = from({ source: "H&M India women's size guide", sourceUrl: "https://www2.hm.com/en_in/women/shop-by-product/tops.html" });
const hmJeansM = from({ source: "H&M India men's jeans size guide", sourceUrl: "https://www2.hm.com/en_in/men/shop-by-product/jeans.html" });
const hmTopRowsM = tops("XXS XS S M L XL XXL 3XL", "74-78 78-86 86-90 94-98 102-106 110-114 118-122 126-130", "cm", {
  eu: "33 34-35 36 38 40 42 44 46", // neckline cm, used as collar size for shirts
});
const hmTopRowsW = tops("XXS XS S M L XL XXL 3XL 4XL", "74-78 78-82 82-90 90-98 98-107 107-119 119-131 131-143 143-155", "cm");

const hm: BrandSeed = {
  name: "H&M",
  slug: "hm",
  priority: 96,
  categories: ["tshirt", "shirts", "hoodies", "trousers", "shorts"],
  charts: [
    hmTopsM("tshirt", "men", hmTopRowsM),
    hmTopsW("tshirt", "women", hmTopRowsW),
    hmTopsM("shirts", "men", hmTopRowsM),
    hmTopsW("shirts", "women", hmTopRowsW),
    hmTopsM("hoodies", "men", hmTopRowsM),
    hmTopsW("hoodies", "women", hmTopRowsW),
    hmJeansM(
      "trousers",
      "men",
      bottoms(
        "25 26 27 28 29 30 31 32 33 34 36 38 40 42 44",
        "64-67 67-70 70-73 73-75 75-78 78-81 81-84 84-87 87-89 89-92 94-98 100-104 106-110 112-116 118-122",
        "cm"
      )
    ),
    hmTopsW(
      "shorts",
      "women",
      bottoms("XXS XS S M L XL XXL 3XL 4XL", "62-64 64-66 66-74 74-82.5 82.5-93 93-105 105-117.5 117.5-131.5 131.5-145.5", "cm")
    ),
  ],
};

/* ──────────────────────────────── Uniqlo ─────────────────────────────── */
// uniqlo.com/in product "Body Size" charts — retrieved Sep 2026.
// Uniqlo's men's/unisex body chart is the same across its tops.
const uqM = from({ source: "UNIQLO India body size chart (unisex/men)", sourceUrl: "https://www.uniqlo.com/in/en/products/E465193-000/01" });
const uqW = from({ source: "UNIQLO India body size chart (women)", sourceUrl: "https://www.uniqlo.com/in/en/women/tops/t-shirts" });
const uqTopRowsM = tops("S M L XL XXL", "80-88 88-96 96-104 104-112 112-120", "cm");
const uqTopRowsW = tops("S M L XL", "77-83 81-87 85-91 91-97", "cm");

const uniqlo: BrandSeed = {
  name: "Uniqlo",
  slug: "uniqlo",
  priority: 94,
  categories: ["tshirt", "shirts", "hoodies", "shorts"],
  charts: [
    uqM("tshirt", "men", uqTopRowsM),
    uqW("tshirt", "women", uqTopRowsW),
    uqM("shirts", "men", uqTopRowsM),
    uqW("shirts", "women", uqTopRowsW),
    uqM("hoodies", "men", uqTopRowsM),
    uqW("hoodies", "women", uqTopRowsW),
    uqM("shorts", "men", bottoms("S M L XL XXL", "68-76 76-84 84-92 92-100 100-108", "cm")),
    uqW("shorts", "women", bottoms("S M L XL", "61-67 65-71 69-75 75-81", "cm")),
  ],
};

/* ───────────────────────────────── Zara ──────────────────────────────── */
// zara.com/in "Product Measurements" (garment, Basic Medium Weight T-shirt) —
// Zara no longer publishes body sizes, so body chest = garment chest − regular ease.
const zaraM = from({
  source: "ZARA India product measurements (garment), converted with standard ease",
  sourceUrl: "https://www.zara.com/in/en/basic-medium-weight-t-shirt--02-p01887411.html",
});
const zaraTeeM = garmentTops("S M L XL XXL", "53 55 57 59 61", EASE_CM.regular);

const zara: BrandSeed = {
  name: "Zara",
  slug: "zara",
  priority: 92,
  categories: ["tshirt", "shirts", "hoodies", "trousers"],
  charts: [zaraM("tshirt", "men", zaraTeeM, { basis: "garment" })],
};

/* ──────────────────────────────── Levi's ─────────────────────────────── */
// levi.com/US/en_US/info/sizeguide — retrieved Sep 2026 (body measurements, inches).
const levis_ = from({ source: "Levi's size guide", sourceUrl: "https://www.levi.com/US/en_US/info/sizeguide" });

const levis: BrandSeed = {
  name: "Levi's",
  slug: "levis",
  priority: 97,
  categories: ["trousers", "shorts", "tshirt", "shirts", "hoodies"],
  charts: [
    levis_(
      "trousers",
      "men",
      bottoms(
        "26 27 28 29 30 31 32 33 34 35 36 38 40 42 44",
        "26.5-27 27.5-28 28.5-29 29.5-30 30.5-31 31.5-32 32.5-33 33.5-34 34.5-35 35.5-36 36.5-37.5 38.5-39.5 40.5-41.5 42.5-43.5 44.5-45.5",
        "in"
      )
    ),
    levis_(
      "trousers",
      "women",
      bottoms("24 25 26 27 28 29 30 31 32 33 34", "25.25 26.25 27.25 28.25 29.25 30.25 31.25 32.75 34.25 35.75 37.75", "in")
    ),
    levis_(
      "shorts",
      "men",
      bottoms("26 27 28 29 30 31 32 33 34 35 36 38 40", "26.5-27 27.5-28 28.5-29 29.5-30 30.5-31 31.5-32 32.5-33 33.5-34 34.5-35 35.5-36 36.5-37.5 38.5-39.5 40.5-41.5", "in")
    ),
    levis_("shorts", "women", bottoms("XXS XS S M L XL", "23-24 25-26 27-28 29-30 31-32 33-34", "in")),
    ...(["tshirt", "shirts", "hoodies"] as const).flatMap((c) => [
      levis_(c, "men", tops("XS S M L XL XXL 3XL", "32-34 35-37 38-40 41-43 44-46 47-49 50-52", "in")),
      levis_(c, "women", tops("XXS XS S M L XL XXL", "31 33 35 37 39.5 42.5 45.5", "in")),
    ]),
  ],
};

/* ──────────────────────────── Jack & Jones ───────────────────────────── */
// jackjones.com/en-gb/content/size-guide — retrieved Sep 2026 (body, cm).
const jj = from({ source: "JACK & JONES size guide", sourceUrl: "https://www.jackjones.com/en-gb/content/size-guide" });
const jjTops = tops("XS S M L XL XXL", "92 96 100 104 112 120", "cm", { eu: "39 40 41 42 44 46" });

const jackJones: BrandSeed = {
  name: "Jack & Jones",
  slug: "jack-jones",
  priority: 88,
  categories: ["tshirt", "shirts", "hoodies", "trousers", "shorts"],
  charts: [
    jj("tshirt", "men", jjTops),
    jj("shirts", "men", jjTops),
    jj("hoodies", "men", jjTops),
    jj("trousers", "men", bottoms("28 29 30 31 32 33 34 36 38", "76 78.5 81 83.5 86 88.5 91 96 101", "cm")),
    jj("shorts", "men", bottoms("XS S M L XL XXL", "76 81 86 91 96 101", "cm")),
  ],
};

/* ─────────────────────────── Tommy Hilfiger ──────────────────────────── */
// au.tommy.com/size_guide_{mens,womens} — retrieved Sep 2026 (body, cm).
const thM = from({ source: "Tommy Hilfiger men's size guide", sourceUrl: "https://au.tommy.com/size_guide_mens" });
const thW = from({ source: "Tommy Hilfiger women's size guide", sourceUrl: "https://au.tommy.com/size_guide_womens" });
const thTopsM = tops("XS S M L XL XXL 3XL", "88-92 93-97 98-102 103-108 109-114 115-120 121-126", "cm", {
  eu: "37-38 38-39 40-41 42-43 44-45 45-46 46-47", // neck, cm
});
const thTopsW = tops("XXS XS S M L XL XXL", "77-80 81-84 85-88 89-92 93-97 98-102 102-106", "cm");

const tommy: BrandSeed = {
  name: "Tommy Hilfiger",
  slug: "tommy-hilfiger",
  priority: 86,
  categories: ["tshirt", "shirts", "hoodies", "trousers", "shorts"],
  charts: [
    ...(["tshirt", "shirts", "hoodies"] as const).flatMap((c) => [thM(c, "men", thTopsM), thW(c, "women", thTopsW)]),
    thM("trousers", "men", bottoms("30 31 32 33 34 36 38", "77.5-80 80-82.5 82.5-85 85-87.5 87.5-92 92-97 97-102", "cm")),
    thW("trousers", "women", bottoms("24 25-26 27-28 29-30 31 33 34", "61-64 65-68 69-72 73-76 77-80 82-86 87-92", "cm")),
    thM("shorts", "men", bottoms("XS S M L XL XXL", "74-81 82-86 86-90 91-96 97-101 102-106", "cm")),
    thW("shorts", "women", bottoms("XXS XS S M L XL XXL", "61-64 65-68 69-72 73-76 77-80 82-86 87-92", "cm")),
  ],
};

export const APPAREL: BrandSeed[] = [hm, uniqlo, zara, levis, jackJones, tommy];
