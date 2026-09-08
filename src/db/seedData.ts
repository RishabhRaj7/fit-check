/* Pure seed data — shared by the Postgres and Firestore seed writers. */
/* ---------------------------------------------------------------- helpers */

const fmt = (n: number): string => {
  const r = Math.round(n * 100) / 100;
  return Number.isInteger(r) ? String(r) : String(r);
};

const r2 = (n: number) => Math.round(n * 100) / 100;
const r1 = (n: number) => Math.round(n * 10) / 10;

// US men's -> EU (standard athletic mapping)
const EU: Record<string, string> = {
  "4": "35.5", "4.5": "36", "5": "37.5", "5.5": "38", "6": "38.5",
  "6.5": "39", "7": "40", "7.5": "40.5", "8": "41", "8.5": "42",
  "9": "42.5", "9.5": "43", "10": "44", "10.5": "44.5", "11": "45",
  "11.5": "45.5", "12": "46", "12.5": "47", "13": "47.5", "13.5": "48",
  "14": "48.5",
};

interface RowSeed {
  anchorValue: number;
  eu: string | null;
  uk: string | null;
  us: string | null;
  jpn: string | null;
  ind: string | null;
  label: string | null;
}

/** Sneakers/footwear: US size advances 0.5 per 0.5cm of foot length. */
function footwear(start: number, end: number, usAtStart: number): RowSeed[] {
  const rows: RowSeed[] = [];
  for (let cm = start, us = usAtStart; cm <= end + 1e-6; cm += 0.5, us += 0.5) {
    const uk = us - 1;
    rows.push({
      anchorValue: r2(cm),
      us: fmt(us),
      uk: fmt(uk),
      eu: EU[fmt(us)] ?? "",
      jpn: fmt(Math.round((cm + 0.5) * 2) / 2),
      ind: fmt(uk),
      label: null,
    });
  }
  return rows;
}

/** Slides: whole UK sizes, roomier fit (ease added to the foot anchor). */
function slides(ukStart: number, ukEnd: number, base: number, ease: number): RowSeed[] {
  const rows: RowSeed[] = [];
  for (let uk = ukStart; uk <= ukEnd; uk += 1) {
    const anchor = base + uk + ease;
    const us = uk + 1;
    rows.push({
      anchorValue: r2(anchor),
      us: fmt(us),
      uk: fmt(uk),
      eu: EU[fmt(us)] ?? "",
      jpn: fmt(Math.round((anchor + 0.5) * 2) / 2),
      ind: fmt(uk),
      label: null,
    });
  }
  return rows;
}

/** T-shirts: alpha sizes anchored via chest cm. Includes XS..3XL spread. */
function tee(sizes: [string, number][]): RowSeed[] {
  return sizes.map(([alpha, chest]) => ({
    anchorValue: chest,
    eu: alpha,
    uk: alpha,
    us: alpha,
    jpn: null,
    ind: fmt(r1(chest / 2.54)),
    label: alpha,
  }));
}

/** Trousers in inch sizing: anchor = labelled waist * 2.54 + vanity allowance. */
function trousersIn(inches: number[], vanity: number): RowSeed[] {
  return inches.map((w) => {
    const anchor = r1(w * 2.54 + vanity);
    return {
      anchorValue: anchor,
      eu: String(w + 16),
      uk: String(w),
      us: String(w),
      jpn: null,
      ind: String(w),
      label: `W${w} / L32`,
    };
  });
}

/** Trousers in continental EU sizing (women's H&M / Zara style). */
function trousersEu(eus: number[], base: number, step: number): RowSeed[] {
  return eus.map((e, i) => {
    const anchor = r1(base + i * step);
    return {
      anchorValue: anchor,
      eu: String(e),
      uk: fmt(r1(anchor / 2.54)),
      us: fmt(r1(anchor / 2.54)),
      jpn: null,
      ind: fmt(r1(anchor / 2.54)),
      label: `EU ${e}`,
    };
  });
}

const range = (a: number, b: number, step = 1): number[] => {
  const out: number[] = [];
  for (let x = a; x <= b + 1e-6; x += step) out.push(x);
  return out;
};

/* ------------------------------------------------------------- brand data */

interface ChartSeed {
  category: string;
  gender: string;
  rows: RowSeed[];
}

interface BrandSeed {
  name: string;
  slug: string;
  categories: string[];
  priority: number;
  needsData?: boolean;
  charts: ChartSeed[];
}

const BRANDS: BrandSeed[] = [
  {
    name: "Nike", slug: "nike", priority: 100,
    categories: ["sneakers", "slides", "tshirt", "trousers"],
    charts: [
      { category: "sneakers", gender: "men", rows: footwear(23.5, 30, 6) },
      { category: "sneakers", gender: "women", rows: footwear(21.5, 27, 7.5) },
      { category: "slides", gender: "men", rows: slides(5, 12, 18.4, 0.6) },
      { category: "slides", gender: "women", rows: slides(3, 9, 16.9, 0.6) },
      { category: "tshirt", gender: "men", rows: tee([["XS", 88], ["S", 92], ["M", 100], ["L", 108], ["XL", 118], ["XXL", 130]]) },
      { category: "tshirt", gender: "women", rows: tee([["XS", 79], ["S", 84], ["M", 90], ["L", 96], ["XL", 103]]) },
      { category: "trousers", gender: "men", rows: trousersIn(range(28, 40), 0.5) },
    ],
  },
  {
    name: "Adidas", slug: "adidas", priority: 95,
    categories: ["sneakers", "slides", "tshirt", "trousers"],
    charts: [
      { category: "sneakers", gender: "men", rows: footwear(23.5, 30, 6.5) },
      { category: "sneakers", gender: "women", rows: footwear(21.5, 27, 8) },
      { category: "slides", gender: "men", rows: slides(5, 12, 18.4, 0.35) },
      { category: "slides", gender: "women", rows: slides(3, 9, 16.9, 0.35) },
      { category: "tshirt", gender: "men", rows: tee([["XS", 86], ["S", 90], ["M", 98], ["L", 106], ["XL", 114], ["XXL", 124]]) },
      { category: "tshirt", gender: "women", rows: tee([["XS", 78], ["S", 83], ["M", 89], ["L", 95], ["XL", 102]]) },
      { category: "trousers", gender: "men", rows: trousersIn(range(28, 40), 0.5) },
    ],
  },
  {
    name: "Puma", slug: "puma", priority: 90,
    categories: ["sneakers", "slides", "tshirt"],
    charts: [
      { category: "sneakers", gender: "men", rows: footwear(23.5, 30, 6) },
      { category: "sneakers", gender: "women", rows: footwear(21.5, 27, 7.5) },
      { category: "slides", gender: "men", rows: slides(5, 12, 18.4, 0.8) },
      { category: "slides", gender: "women", rows: slides(3, 9, 16.9, 0.7) },
      { category: "tshirt", gender: "men", rows: tee([["S", 91], ["M", 98], ["L", 105], ["XL", 112], ["XXL", 121]]) },
    ],
  },
  {
    name: "Reebok", slug: "reebok", priority: 82, needsData: true,
    categories: ["sneakers", "slides", "tshirt"],
    charts: [
      { category: "sneakers", gender: "men", rows: footwear(23.5, 30, 6) },
      { category: "tshirt", gender: "men", rows: tee([["S", 92], ["M", 99], ["L", 106], ["XL", 113], ["XXL", 122]]) },
    ],
  },
  {
    name: "New Balance", slug: "new-balance", priority: 85,
    categories: ["sneakers"],
    charts: [
      { category: "sneakers", gender: "men", rows: footwear(23.5, 30, 6) },
      { category: "sneakers", gender: "women", rows: footwear(21.5, 27, 7.5) },
    ],
  },
  {
    name: "ASICS", slug: "asics", priority: 88,
    categories: ["sneakers"],
    charts: [
      { category: "sneakers", gender: "men", rows: footwear(23.5, 30, 6.5) },
      { category: "sneakers", gender: "women", rows: footwear(21.5, 27, 8) },
    ],
  },
  {
    name: "Skechers", slug: "skechers", priority: 80,
    categories: ["sneakers", "slides"],
    charts: [
      { category: "sneakers", gender: "men", rows: footwear(23.5, 30, 5.5) },
      { category: "sneakers", gender: "women", rows: footwear(21.5, 27, 7) },
      { category: "slides", gender: "men", rows: slides(5, 12, 18.4, 1.1) },
      { category: "slides", gender: "women", rows: slides(3, 9, 16.9, 1.0) },
    ],
  },
  {
    name: "HRX", slug: "hrx", priority: 72,
    categories: ["sneakers", "slides", "tshirt"],
    charts: [
      { category: "sneakers", gender: "men", rows: footwear(23.5, 30, 6) },
      { category: "slides", gender: "men", rows: slides(5, 12, 18.4, 0.9) },
      { category: "tshirt", gender: "men", rows: tee([["S", 90], ["M", 96], ["L", 102], ["XL", 108], ["XXL", 114]]) },
    ],
  },
  {
    name: "Bata", slug: "bata", priority: 62,
    categories: ["sneakers", "slides"],
    charts: [
      { category: "sneakers", gender: "men", rows: footwear(23.5, 30, 6.5) },
      { category: "slides", gender: "men", rows: slides(5, 12, 18.4, 1.15) },
      { category: "slides", gender: "women", rows: slides(3, 9, 16.9, 1.05) },
    ],
  },
  {
    name: "Woodland", slug: "woodland", priority: 60,
    categories: ["sneakers", "slides", "trousers"],
    charts: [
      { category: "sneakers", gender: "men", rows: footwear(23.5, 30, 6.5) },
      { category: "slides", gender: "men", rows: slides(6, 12, 18.4, 1.0) },
      { category: "trousers", gender: "men", rows: trousersIn(range(28, 40, 2), 1.5) },
    ],
  },
  {
    name: "Decathlon", slug: "decathlon", priority: 58,
    categories: ["sneakers", "slides", "tshirt", "trousers"],
    charts: [
      { category: "sneakers", gender: "men", rows: footwear(23.5, 30, 6) },
      { category: "slides", gender: "men", rows: slides(5, 12, 18.4, 0.8) },
      { category: "tshirt", gender: "men", rows: tee([["S", 89], ["M", 95], ["L", 102], ["XL", 109], ["XXL", 116]]) },
      { category: "trousers", gender: "men", rows: trousersIn(range(28, 40, 2), 0.5) },
    ],
  },
  {
    name: "US Polo Assn", slug: "us-polo-assn", priority: 70,
    categories: ["sneakers", "slides", "tshirt", "trousers"],
    charts: [
      { category: "sneakers", gender: "men", rows: footwear(23.5, 30, 6) },
      { category: "slides", gender: "men", rows: slides(5, 12, 18.4, 0.8) },
      { category: "tshirt", gender: "men", rows: tee([["S", 93], ["M", 100], ["L", 107], ["XL", 114], ["XXL", 121]]) },
      { category: "trousers", gender: "men", rows: trousersIn(range(28, 40), 1.5) },
    ],
  },
  {
    name: "H&M", slug: "hm", priority: 92,
    categories: ["tshirt", "trousers"],
    charts: [
      { category: "tshirt", gender: "men", rows: tee([["XS", 86], ["S", 90], ["M", 96], ["L", 102], ["XL", 109], ["XXL", 116], ["3XL", 124]]) },
      { category: "tshirt", gender: "women", rows: tee([["XS", 80], ["S", 84], ["M", 90], ["L", 96], ["XL", 102], ["XXL", 110]]) },
      { category: "trousers", gender: "men", rows: trousersIn(range(28, 40, 2), 1.0) },
      { category: "trousers", gender: "women", rows: trousersEu(range(32, 46, 2), 61.5, 4) },
    ],
  },
  {
    name: "Zara", slug: "zara", priority: 90,
    categories: ["tshirt", "trousers"],
    charts: [
      { category: "tshirt", gender: "men", rows: tee([["XS", 85], ["S", 89], ["M", 94], ["L", 99], ["XL", 104], ["XXL", 109]]) },
      { category: "tshirt", gender: "women", rows: tee([["XS", 79], ["S", 83], ["M", 87], ["L", 92], ["XL", 98]]) },
      { category: "trousers", gender: "men", rows: trousersIn(range(28, 40, 2), 2.5) },
      { category: "trousers", gender: "women", rows: trousersEu(range(32, 46, 2), 62, 4) },
    ],
  },
  {
    name: "Uniqlo", slug: "uniqlo", priority: 86,
    categories: ["tshirt", "trousers"],
    charts: [
      { category: "tshirt", gender: "men", rows: tee([["XS", 84], ["S", 88], ["M", 93], ["L", 98], ["XL", 103], ["XXL", 108], ["3XL", 114]]) },
      { category: "tshirt", gender: "women", rows: tee([["XS", 78], ["S", 82], ["M", 87], ["L", 92], ["XL", 97], ["XXL", 103]]) },
      { category: "trousers", gender: "men", rows: trousersIn(range(28, 40), 0.5) },
      { category: "trousers", gender: "women", rows: trousersIn(range(23, 30), 2.0) },
    ],
  },
  {
    name: "Levi's", slug: "levis", priority: 95,
    categories: ["tshirt", "trousers"],
    charts: [
      { category: "tshirt", gender: "men", rows: tee([["S", 91], ["M", 97], ["L", 103], ["XL", 110], ["XXL", 118]]) },
      { category: "trousers", gender: "men", rows: trousersIn(range(28, 40), 2.0) },
      { category: "trousers", gender: "women", rows: trousersIn(range(25, 32), 3.0) },
    ],
  },
  {
    name: "Marks & Spencer", slug: "marks-spencer", priority: 76,
    categories: ["tshirt", "trousers"],
    charts: [
      { category: "tshirt", gender: "men", rows: tee([["S", 92], ["M", 99], ["L", 106], ["XL", 113], ["XXL", 120]]) },
      { category: "trousers", gender: "men", rows: trousersIn(range(30, 42, 2), 1.5) },
    ],
  },
  {
    name: "Van Heusen", slug: "van-heusen", priority: 72,
    categories: ["tshirt", "trousers"],
    charts: [
      { category: "tshirt", gender: "men", rows: tee([["S", 96], ["M", 102], ["L", 107], ["XL", 112], ["XXL", 118]]) },
      { category: "trousers", gender: "men", rows: trousersIn(range(28, 40, 2), 1.5) },
    ],
  },
  {
    name: "Allen Solly", slug: "allen-solly", priority: 74,
    categories: ["tshirt", "trousers"],
    charts: [
      { category: "tshirt", gender: "men", rows: tee([["S", 96], ["M", 101], ["L", 106], ["XL", 111], ["XXL", 116]]) },
      { category: "trousers", gender: "men", rows: trousersIn(range(28, 40, 2), 1.0) },
    ],
  },
  {
    name: "Peter England", slug: "peter-england", priority: 70,
    categories: ["tshirt", "trousers"],
    charts: [
      { category: "tshirt", gender: "men", rows: tee([["S", 96], ["M", 102], ["L", 107], ["XL", 112], ["XXL", 118]]) },
      { category: "trousers", gender: "men", rows: trousersIn(range(28, 40, 2), 1.0) },
    ],
  },
];

interface ProductSeed {
  brand: string;
  category: string;
  name: string;
  price: number;
}

const PRODUCTS: ProductSeed[] = [
  { brand: "nike", category: "sneakers", name: "Air Force 1 '07", price: 7995 },
  { brand: "nike", category: "sneakers", name: "Pegasus 41", price: 11495 },
  { brand: "nike", category: "sneakers", name: "Air Jordan 1 Low", price: 8995 },
  { brand: "nike", category: "slides", name: "Calm Slide", price: 4195 },
  { brand: "nike", category: "tshirt", name: "Sportswear Club Tee", price: 1895 },
  { brand: "adidas", category: "sneakers", name: "Samba OG", price: 10999 },
  { brand: "adidas", category: "sneakers", name: "Ultraboost 5", price: 16999 },
  { brand: "adidas", category: "sneakers", name: "Superstar II", price: 8999 },
  { brand: "adidas", category: "slides", name: "Adilette Comfort", price: 2799 },
  { brand: "adidas", category: "tshirt", name: "Essentials 3-Stripes Tee", price: 1599 },
  { brand: "puma", category: "sneakers", name: "Palermo Lth", price: 7999 },
  { brand: "puma", category: "sneakers", name: "Velocity NITRO 4", price: 9999 },
  { brand: "puma", category: "slides", name: "Leadcat 2.0", price: 1999 },
  { brand: "puma", category: "tshirt", name: "Essentials Logo Tee", price: 1299 },
  { brand: "new-balance", category: "sneakers", name: "530", price: 7999 },
  { brand: "new-balance", category: "sneakers", name: "Fresh Foam Arishi v4", price: 6999 },
  { brand: "asics", category: "sneakers", name: "GEL-Kayano 31", price: 15999 },
  { brand: "asics", category: "sneakers", name: "GT-1000 13", price: 9999 },
  { brand: "skechers", category: "sneakers", name: "GO WALK 7", price: 7499 },
  { brand: "skechers", category: "slides", name: "GO Recovery Slide", price: 2499 },
  { brand: "reebok", category: "sneakers", name: "Club C 85", price: 7999 },
  { brand: "hrx", category: "sneakers", name: "Flight Pro Running", price: 2799 },
  { brand: "hrx", category: "tshirt", name: "Rapid-Dry Training Tee", price: 699 },
  { brand: "bata", category: "sneakers", name: "North Star Pulse", price: 1499 },
  { brand: "bata", category: "slides", name: "Comfort Chappal", price: 599 },
  { brand: "woodland", category: "sneakers", name: "Trail Blazer Mid", price: 3995 },
  { brand: "woodland", category: "slides", name: "Outdoor Sandal", price: 1995 },
  { brand: "decathlon", category: "sneakers", name: "Kalenji Jogflow 500", price: 2999 },
  { brand: "decathlon", category: "tshirt", name: "Domyos Essential Tee", price: 399 },
  { brand: "levis", category: "trousers", name: "511 Slim Fit Jeans", price: 3999 },
  { brand: "levis", category: "trousers", name: "501 Original Fit", price: 4499 },
  { brand: "levis", category: "tshirt", name: "Graphic Batwing Tee", price: 1599 },
  { brand: "hm", category: "tshirt", name: "Regular Fit Tee", price: 799 },
  { brand: "hm", category: "trousers", name: "Slim Fit Chinos", price: 2299 },
  { brand: "zara", category: "tshirt", name: "Basic Slim Tee", price: 1590 },
  { brand: "zara", category: "trousers", name: "Comfort Fit Trouser", price: 3590 },
  { brand: "uniqlo", category: "tshirt", name: "Supima Cotton Crew", price: 1490 },
  { brand: "uniqlo", category: "trousers", name: "EZY Ankle Pants", price: 2990 },
  { brand: "marks-spencer", category: "tshirt", name: "Pure Cotton Crew Tee", price: 1299 },
  { brand: "marks-spencer", category: "trousers", name: "Regular Fit Chino", price: 2999 },
  { brand: "van-heusen", category: "tshirt", name: "Athleisure Polo Tee", price: 1399 },
  { brand: "allen-solly", category: "trousers", name: "Slim Formal Trouser", price: 2499 },
  { brand: "peter-england", category: "trousers", name: "Flat Front Trouser", price: 1799 },
  { brand: "us-polo-assn", category: "tshirt", name: "Iconic Logo Tee", price: 1499 },
  { brand: "us-polo-assn", category: "sneakers", name: "Court Classic Sneaker", price: 2799 },
];
function slugifyProduct(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export { BRANDS, PRODUCTS, slugifyProduct };
export type { RowSeed, ChartSeed, BrandSeed, ProductSeed };
