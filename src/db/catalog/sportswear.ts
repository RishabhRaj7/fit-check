/* Sportswear brands — charts transcribed from each brand's own size guide. */
import { bottoms, from, shifted, shoes, tops, type BrandSeed } from "./helpers";

/* ───────────────────────────────── Nike ──────────────────────────────── */
// nike.com/gb/size-fit — retrieved Sep 2026.
const nikeShoesM = shoes({
  uk: "3 3.5 4 4.5 5 5.5 6 6 6.5 7 7.5 8 8.5 9 9.5 10 10.5 11 11.5 12 12.5 13 13.5 14",
  us: "3.5 4 4.5 5 5.5 6 6.5 7 7.5 8 8.5 9 9.5 10 10.5 11 11.5 12 12.5 13 13.5 14 14.5 15",
  eu: "35.5 36 36.5 37.5 38 38.5 39 40 40.5 41 42 42.5 43 44 44.5 45 45.5 46 47 47.5 48 48.5 49 49.5",
  cm: "22.5 23 23.5 23.5 24 24 24.5 25 25.5 26 26.5 27 27.5 28 28.5 29 29.5 30 30.5 31 31.5 32 32.5 33",
});
const nikeShoesW = shoes({
  uk: "1.5 1.5 2 2.5 3 3.5 4 4.5 5 5.5 6 6.5 7 7.5 8 8.5 9 9.5",
  us: "3.5 4 4.5 5 5.5 6 6.5 7 7.5 8 8.5 9 9.5 10 10.5 11 11.5 12",
  eu: "33.5 34.5 35 35.5 36 36.5 37.5 38 38.5 39 40 40.5 41 42 42.5 43 44 44.5",
  cm: "21 21 21.5 22 22.5 23 23.5 24 24.5 25 25.5 26 26.5 27 27.5 28 28.5 29",
});
const nikeFw = from({ source: "Nike footwear size chart", sourceUrl: "https://www.nike.com/gb/size-fit/mens-footwear" });
// Air Force 1 / Dunk product pages: "Fits large; we recommend ordering half a size down".
const nikeLs = from({
  source: "Nike size chart + Air Force 1 fit note (“fits large, order half a size down”)",
  sourceUrl: "https://www.nike.com/gb/t/air-force-1-07-shoes-WrLlWX/CW2288-111",
});
const nikeTopsM = from({ source: "Nike men's tops size chart", sourceUrl: "https://www.nike.com/gb/size-fit/mens-tops-alpha" });
const nikeTopsW = from({ source: "Nike women's tops size chart", sourceUrl: "https://www.nike.com/gb/size-fit/womens-tops-alpha" });
const nikeBotM = from({ source: "Nike men's bottoms size chart", sourceUrl: "https://www.nike.com/gb/size-fit/mens-bottoms-alpha" });
const nikeBotW = from({ source: "Nike women's bottoms size chart", sourceUrl: "https://www.nike.com/gb/size-fit/womens-bottoms-alpha" });
const nikePantsM = from({ source: "Nike men's numeric bottoms chart", sourceUrl: "https://www.nike.com/gb/size-fit/mens-bottoms-numeric" });

const nikeTopRowsM = tops("XXS XS S M L XL XXL 3XL 4XL", "28.1-31.5 31.5-35 35-37.5 37.5-41 41-44 44-48.5 48.5-53.5 53.5-58 58-63", "in");
const nikeTopRowsW = tops("XXS XS S M L XL XXL", "27.5-29.5 29.5-32.5 32.5-35.5 35.5-38 38-41 41-44.5 44.5-48.5", "in");

const nike: BrandSeed = {
  name: "Nike",
  slug: "nike",
  priority: 100,
  categories: ["sneakers", "running", "slides", "tshirt", "hoodies", "trousers", "shorts"],
  charts: [
    nikeLs("sneakers", "men", shifted(nikeShoesM, 1)),
    nikeLs("sneakers", "women", shifted(nikeShoesW, 1)),
    nikeFw("running", "men", nikeShoesM),
    nikeFw("running", "women", nikeShoesW),
    nikeFw("slides", "men", nikeShoesM),
    nikeFw("slides", "women", nikeShoesW),
    nikeTopsM("tshirt", "men", nikeTopRowsM),
    nikeTopsW("tshirt", "women", nikeTopRowsW),
    nikeTopsM("hoodies", "men", nikeTopRowsM),
    nikeTopsW("hoodies", "women", nikeTopRowsW),
    nikePantsM(
      "trousers",
      "men",
      bottoms("26 28 30 32 34 35 36 37 38 40 42 44", "27.5 29.5 31.5 33.5 35.5 36.5 37.5 38.5 39.5 41.5 43.5 45.5", "in", {
        eu: "44 46 48 50 52 53 54 55 56 58 60 62",
      })
    ),
    nikeBotM("shorts", "men", bottoms("XXS XS S M L XL XXL 3XL 4XL", "22.5-25.5 25.5-29 29-32 32-35 35-38 38-43 43-47.5 47.5-52.5 52.5-57", "in")),
    nikeBotW("shorts", "women", bottoms("XXS XS S M L XL XXL", "21.25-23.5 23.5-26 26-29 29-31.5 31.5-34.5 34.5-38.5 38.5-42.5", "in")),
  ],
};

/* ──────────────────────────────── adidas ─────────────────────────────── */
// adidas.co.uk/help/size_charts — retrieved Sep 2026. Heel-to-toe foot length.
const adiShoeCols = {
  uk: "3.5 4 4.5 5 5.5 6 6.5 7 7.5 8 8.5 9 9.5 10 10.5 11 11.5 12 12.5 13 13.5 14",
  eu: "36 36_2/3 37_1/3 38 38_2/3 39_1/3 40 40_2/3 41_1/3 42 42_2/3 43_1/3 44 44_2/3 45_1/3 46 46_2/3 47_1/3 48 48_2/3 49_1/3 50",
  cm: "22.1 22.5 22.9 23.3 23.8 24.2 24.6 25.0 25.5 25.9 26.3 26.7 27.1 27.6 28.0 28.4 28.8 29.3 29.7 30.1 30.5 31.0",
  jp: false,
};
const adiShoesM = shoes({ ...adiShoeCols, us: "4 4.5 5 5.5 6 6.5 7 7.5 8 8.5 9 9.5 10 10.5 11 11.5 12 12.5 13 13.5 14 14.5" });
const adiShoesW = shoes({ ...adiShoeCols, us: "5 5.5 6 6.5 7 7.5 8 8.5 9 9.5 10 10.5 11 11.5 12 12.5 13 13.5 14 14.5 15 15.5" });
const adiFw = from({ source: "adidas shoe size chart (heel-to-toe)", sourceUrl: "https://www.adidas.co.uk/help/size_charts" });
const adiTopsM = from({ source: "adidas men's tops size chart", sourceUrl: "https://www.adidas.co.uk/help/size_charts" });
const adiTopsW = from({ source: "adidas women's tops size chart", sourceUrl: "https://www.adidas.co.uk/help/size_charts/women-tops" });
const adiBotM = from({ source: "adidas men's bottoms size chart", sourceUrl: "https://www.adidas.co.uk/help/size_charts/men-pants_shorts" });
const adiBotW = from({ source: "adidas women's bottoms size chart", sourceUrl: "https://www.adidas.co.uk/help/size_charts/women-pants_shorts" });
const adiTopRowsM = tops("XS S M L XL 2XL 3XL", "83-86 87-92 93-100 101-108 109-118 119-130 131-142", "cm");
const adiTopRowsW = tops("2XS XS S M L XL 2XL", "73-76 77-82 83-88 89-94 95-101 102-109 110-118", "cm");

const adidas: BrandSeed = {
  name: "Adidas",
  slug: "adidas",
  priority: 98,
  categories: ["sneakers", "running", "slides", "tshirt", "hoodies", "shorts"],
  charts: [
    adiFw("sneakers", "men", adiShoesM),
    adiFw("sneakers", "women", adiShoesW),
    adiFw("running", "men", adiShoesM),
    adiFw("running", "women", adiShoesW),
    adiFw("slides", "men", adiShoesM),
    adiFw("slides", "women", adiShoesW),
    adiTopsM("tshirt", "men", adiTopRowsM),
    adiTopsW("tshirt", "women", adiTopRowsW),
    adiTopsM("hoodies", "men", adiTopRowsM),
    adiTopsW("hoodies", "women", adiTopRowsW),
    adiBotM("shorts", "men", bottoms("XS S M L XL 2XL 3XL", "71-74 75-80 81-88 89-96 97-106 107-119 120-132", "cm")),
    adiBotW("shorts", "women", bottoms("2XS XS S M L XL 2XL", "57-60 61-66 67-72 73-78 79-85 86-94 95-104", "cm")),
  ],
};

/* ───────────────────────────────── Puma ──────────────────────────────── */
// in.puma.com product size guides — retrieved Sep 2026.
const pumaShoeCols = {
  uk: "3 3.5 4 4.5 5 5.5 6 6.5 7 7.5 8 8.5 9 9.5 10 10.5 11 11.5 12 13",
  eu: "35.5 36 37 37.5 38 38.5 39 40 40.5 41 42 42.5 43 44 44.5 45 46 46.5 47 48.5",
  cm: "21.8 22.3 22.8 23.2 23.7 24.1 24.5 25 25.4 25.8 26.2 26.7 27.1 27.5 27.9 28.3 28.8 29.2 29.6 30.5",
  jp: false,
};
const pumaShoesM = shoes({ ...pumaShoeCols, us: "4 4.5 5 5.5 6 6.5 7 7.5 8 8.5 9 9.5 10 10.5 11 11.5 12 12.5 13 14" });
// The same table serves women's styles on puma.com; it lists men's US only.
const pumaShoesW = shoes(pumaShoeCols);
const pumaFw = from({ source: "PUMA India footwear size guide", sourceUrl: "https://in.puma.com/in/en/pd/speedcat-sneakers/406004" });
const pumaApM = from({ source: "PUMA India men's apparel size guide", sourceUrl: "https://in.puma.com/in/en/mens/mens-clothing/mens-clothing-t-shirts-and-tops" });
const pumaTopRowsM = tops("XXS XS S M L XL XXL", "29-32 32-35 35-38 38-41 41-45 45-48 49-52", "in");

const puma: BrandSeed = {
  name: "Puma",
  slug: "puma",
  priority: 95,
  categories: ["sneakers", "running", "slides", "tshirt", "hoodies", "shorts"],
  charts: [
    pumaFw("sneakers", "men", pumaShoesM),
    pumaFw("sneakers", "women", pumaShoesW),
    pumaFw("running", "men", pumaShoesM),
    pumaFw("running", "women", pumaShoesW),
    pumaFw("slides", "men", pumaShoesM),
    pumaFw("slides", "women", pumaShoesW),
    pumaApM("tshirt", "men", pumaTopRowsM),
    pumaApM("hoodies", "men", pumaTopRowsM),
    pumaApM("shorts", "men", bottoms("XXS XS S M L XL XXL", "24-26 27-30 30-33 33-36 36-39 40-43 44-48", "in")),
  ],
};

/* ────────────────────────────── New Balance ──────────────────────────── */
// newbalance.com/size-guide.html — retrieved Sep 2026. Note UK = US − 0.5 for men.
const nbShoesM = shoes({
  us: "4 4.5 5 5.5 6 6.5 7 7.5 8 8.5 9 9.5 10 10.5 11 11.5 12 12.5 13 13.5 14",
  cm: "22 22.5 23 23.5 24 24.5 25 25.5 26 26.5 27 27.5 28 28.5 29 29.5 30 30.5 31 31.5 32",
  uk: "3.5 4 4.5 5 5.5 6 6.5 7 7.5 8 8.5 9 9.5 10 10.5 11 11.5 12 12.5 13 13.5",
  eu: "36 37 37.5 38 38.5 39.5 40 40.5 41.5 42 42.5 43 44 44.5 45 45.5 46.5 47 47.5 48.5 49",
});
const nbShoesW = shoes({
  us: "5 5.5 6 6.5 7 7.5 8 8.5 9 9.5 10 10.5 11 11.5 12",
  cm: "22 22.5 23 23.5 24 24.5 25 25.5 26 26.5 27 27.5 28 28.5 29",
  uk: "3 3.5 4 4.5 5 5.5 6 6.5 7 7.5 8 8.5 9 9.5 10",
  eu: "35 36 36.5 37 37.5 38 39 40 40.5 41 41.5 42.5 43 43.5 44",
});
const nbFw = from({ source: "New Balance size guide", sourceUrl: "https://www.newbalance.com/size-guide.html" });

const newBalance: BrandSeed = {
  name: "New Balance",
  slug: "new-balance",
  priority: 93,
  categories: ["sneakers", "running"],
  charts: [
    nbFw("sneakers", "men", nbShoesM),
    nbFw("sneakers", "women", nbShoesW),
    nbFw("running", "men", nbShoesM),
    nbFw("running", "women", nbShoesW),
  ],
};

/* ───────────────────────────────── ASICS ─────────────────────────────── */
// asics.com/us/en-us/aligned-size-charts — retrieved Sep 2026.
// ASICS: "For running shoes, we generally recommend sizing up a half size from
// your casual shoe size" — so the running line is the master chart moved a half size.
const asicsShoesM = shoes({
  us: "4 4.5 5 5.5 6 6.5 7 7.5 8 8.5 9 9.5 10 10.5 11 11.5 12 12.5 13 13.5 14 14.5 15",
  uk: "3 3.5 4 4.5 5 5.5 6 6.5 7 7.5 8 8.5 9 9.5 10 10.5 11 11.5 12 12.5 13 13.5 14",
  eu: "36 37 37.5 38 39 39.5 40 40.5 41.5 42 42.5 43.5 44 44.5 45 46 46.5 47 48 48.5 49 49.5 50.5",
  cm: "22.5 23 23.5 24 24.5 25 25.25 25.5 26 26.5 27 27.5 28 28.25 28.5 29 29.5 30 30.5 30.75 31 31.5 32",
});
const asicsShoesW = shoes({
  us: "4 4.5 5 5.5 6 6.5 7 7.5 8 8.5 9 9.5 10 10.5 11 11.5 12 12.5 13",
  uk: "2 2.5 3 3.5 4 4.5 5 5.5 6 6.5 7 7.5 8 8.5 9 9.5 10 10.5 11",
  eu: "34.5 35 35.5 36 37 37.5 38 39 39.5 40 40.5 41.5 42 42.5 43.5 44 44.5 45 46",
  cm: "21.5 22 22.5 22.75 23 23.5 24 24.5 25 25.5 25.75 26 26.5 27 27.5 28 28.5 28.75 29",
});
const asicsFw = from({ source: "ASICS size guide", sourceUrl: "https://www.asics.com/us/en-us/aligned-size-charts/" });
const asicsRun = from({
  source: "ASICS size guide + ASICS running advice (“size up a half size from your casual size”)",
  sourceUrl: "https://www.asics.com/us/en-us/aligned-size-charts/",
});

const asics: BrandSeed = {
  name: "ASICS",
  slug: "asics",
  priority: 92,
  categories: ["sneakers", "running"],
  charts: [
    asicsFw("sneakers", "men", asicsShoesM),
    asicsFw("sneakers", "women", asicsShoesW),
    asicsRun("running", "men", shifted(asicsShoesM, -1)),
    asicsRun("running", "women", shifted(asicsShoesW, -1)),
  ],
};

/* ────────────────────────────────── On ───────────────────────────────── */
// on.com product size chart (Cloudpulse, Sep 2026) + on.com sizing FAQ:
// "JP sizing is in centimeters … measure your foot … adding about 1 cm" → foot = JP − 1.
// "Women's shoes are a 1.5 size larger than men's" (US) — same JP / UK / EU.
const onCols = {
  uk: "6.5 7 7.5 8 8.5 9 9.5 10 10.5 11 11.5 12 12.5 13 13.5",
  eu: "40 40.5 41 42 42.5 43 44 44.5 45 46 47 47.5 48 48.5 49",
  jp: "25 25.5 26 26.5 27 27.5 28 28.5 29 29.5 30 30.5 31 31.5 32",
  cm: "24 24.5 25 25.5 26 26.5 27 27.5 28 28.5 29 29.5 30 30.5 31",
};
const onShoesM = shoes({ ...onCols, us: "7 7.5 8 8.5 9 9.5 10 10.5 11 11.5 12 12.5 13 13.5 14" });
const onShoesW = shoes({ ...onCols, us: "8.5 9 9.5 10 10.5 11 11.5 12 12.5 13 13.5 14 14.5 15 15.5" });
const onFw = from({
  source: "On size chart + On sizing FAQ (foot length = JP size − 1 cm)",
  sourceUrl: "https://www.on.com/en-us/faq/product-advice-sizing-stock",
});

const on: BrandSeed = {
  name: "On",
  slug: "on",
  priority: 86,
  categories: ["running", "sneakers"],
  charts: [
    onFw("running", "men", onShoesM),
    onFw("running", "women", onShoesW),
    onFw("sneakers", "men", onShoesM),
    onFw("sneakers", "women", onShoesW),
  ],
};

/* ──────────────────────────────── Reebok ─────────────────────────────── */
// reebok.com/pages/*-size-guide — retrieved Sep 2026. Reebok lists US size and
// heel-to-toe inches only; UK is derived with the standard men's US − 1 (women's
// via Reebok's unisex table, US W = US M + 1.5).
const rbkShoesM = shoes({
  us: "6.5 7 7.5 8 8.5 9 9.5 10 10.5 11 11.5 12 12.5 13 13.5 14",
  uk: "5.5 6 6.5 7 7.5 8 8.5 9 9.5 10 10.5 11 11.5 12 12.5 13",
  cm: "24.1 24.6 24.9 25.4 25.9 26.2 26.7 27.2 27.4 27.9 28.4 28.7 29.2 29.7 30.0 30.5",
  jp: false,
});
const rbkShoesW = shoes({
  us: "5 5.5 6 6.5 7 7.5 8 8.5 9 9.5 10 10.5 11",
  uk: "2.5 3 3.5 4 4.5 5 5.5 6 6.5 7 7.5 8 8.5",
  cm: "21.6 22.1 22.4 22.9 23.4 23.6 24.1 24.6 24.9 25.4 25.9 26.2 26.7",
  jp: false,
});
const rbkFwM = from({ source: "Reebok men's shoe size guide (UK derived from US)", sourceUrl: "https://www.reebok.com/pages/mens-shoe-size-guide" });
const rbkFwW = from({ source: "Reebok women's shoe size guide (UK derived from US)", sourceUrl: "https://www.reebok.com/pages/womens-shoe-size-guide" });
const rbkApM = from({ source: "Reebok men's clothing size guide", sourceUrl: "https://www.reebok.com/pages/mens-clothing-size-guide" });
const rbkApW = from({ source: "Reebok women's clothing size guide", sourceUrl: "https://www.reebok.com/pages/womens-clothing-size-guide" });
const rbkTopsM = tops("XS S M L XL 2XL 3XL", "32-35 35-38 38-41 41-44.5 44.5-49 49-53.5 53.5-58", "in");
const rbkTopsW = tops("XXS XS S M L XL XXL", "28.7-29.9 30-32 33-35 36-37 38-40 41-43 44-46", "in");

const reebok: BrandSeed = {
  name: "Reebok",
  slug: "reebok",
  priority: 85,
  categories: ["sneakers", "running", "slides", "tshirt", "hoodies", "shorts"],
  charts: [
    ...(["sneakers", "running", "slides"] as const).flatMap((c) => [rbkFwM(c, "men", rbkShoesM), rbkFwW(c, "women", rbkShoesW)]),
    rbkApM("tshirt", "men", rbkTopsM),
    rbkApW("tshirt", "women", rbkTopsW),
    rbkApM("hoodies", "men", rbkTopsM),
    rbkApW("hoodies", "women", rbkTopsW),
    rbkApM("shorts", "men", bottoms("XS S M L XL 2XL 3XL", "27-29 30-32 32-35 35-39 39-43 43-47 48-53", "in")),
    rbkApW("shorts", "women", bottoms("XXS XS S M L XL XXL", "22.4-23.6 24-26 27-28 29-31 32-34 35-37 38-41", "in")),
  ],
};

/* ───────────────────────────── Under Armour ──────────────────────────── */
// underarmour.com/en-us/t/size-guide/{mens,womens}-footwear — retrieved Sep 2026.
const uaShoesM = shoes({
  us: "7 7.5 8 8.5 9 9.5 10 10.5 11 11.5 12 12.5 13 13.5 14",
  uk: "6 6.5 7 7.5 8 8.5 9 9.5 10 10.5 11 11.5 12 12.5 13",
  eu: "40 40.5 41 42 42.5 43 44 44.5 45 45.5 46 47 47.5 48 48.5",
  cm: "25 25.5 26 26.5 27 27.5 28 28.5 29 29.5 30 30.5 31 31.5 32",
});
const uaShoesW = shoes({
  us: "5 5.5 6 6.5 7 7.5 8 8.5 9 9.5 10 10.5 11 11.5 12",
  uk: "3 3.5 4 4.5 5 5.5 6 6 6.5 7 7.5 8 8.5 9 9.5",
  eu: "35.5 36 36.5 37.5 38 38.5 39 40 40.5 41 42 42.5 43 44 44.5",
  cm: "22.5 23 23.5 23.5 24 24 24.5 25 25.5 26 26.5 27 27.5 28 28.5",
});
const uaM = from({ source: "Under Armour men's footwear size chart", sourceUrl: "https://www.underarmour.com/en-us/t/size-guide/mens-footwear/" });
const uaW = from({ source: "Under Armour women's footwear size chart", sourceUrl: "https://www.underarmour.com/en-us/t/size-guide/womens-footwear/" });

const underArmour: BrandSeed = {
  name: "Under Armour",
  slug: "under-armour",
  priority: 82,
  categories: ["running", "sneakers", "slides", "tshirt", "shorts"],
  charts: (["running", "sneakers", "slides"] as const).flatMap((c) => [uaM(c, "men", uaShoesM), uaW(c, "women", uaShoesW)]),
};

export const SPORTSWEAR: BrandSeed[] = [nike, adidas, puma, newBalance, asics, on, reebok, underArmour];
