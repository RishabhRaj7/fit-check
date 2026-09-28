/**
 * The catalogue the seed script writes.
 *
 * RESEARCHED brands carry charts transcribed from the brand's own size guide
 * (source + URL on every chart). LISTED brands are sold in India but their
 * guide couldn't be read automatically (bot walls, image-only or AI widgets);
 * they appear with estimates until a chart is added in /admin.
 */
import type { BrandSeed } from "./helpers";
import { APPAREL } from "./apparel";
import { FOOTWEAR } from "./footwear";
import { SPORTSWEAR } from "./sportswear";

const listed = (
  name: string,
  slug: string,
  priority: number,
  categories: BrandSeed["categories"]
): BrandSeed => ({ name, slug, priority, categories, charts: [] });

export const LISTED: BrandSeed[] = [
  // footwear
  listed("HOKA", "hoka", 76, ["running"]),
  listed("Brooks", "brooks", 66, ["running"]),
  listed("Saucony", "saucony", 64, ["running"]),
  listed("Mizuno", "mizuno", 62, ["running"]),
  listed("Onitsuka Tiger", "onitsuka-tiger", 74, ["sneakers"]),
  listed("Fila", "fila", 60, ["sneakers", "slides"]),
  listed("Crocs", "crocs", 79, ["slides"]),
  listed("Bata", "bata", 77, ["formal", "sneakers", "slides"]),
  listed("Red Tape", "red-tape", 72, ["sneakers", "formal"]),
  listed("Woodland", "woodland", 70, ["formal", "sneakers", "slides"]),
  listed("Liberty", "liberty", 58, ["formal", "sneakers"]),
  listed("Sparx", "sparx", 56, ["running", "sneakers", "slides"]),
  listed("Clarks", "clarks", 68, ["formal"]),
  listed("Hush Puppies", "hush-puppies", 60, ["formal"]),
  listed("HRX", "hrx", 64, ["running", "tshirt", "shorts"]),
  // clothing
  listed("Marks & Spencer", "marks-spencer", 78, ["tshirt", "shirts", "trousers"]),
  listed("US Polo Assn", "us-polo-assn", 76, ["tshirt", "shirts", "trousers", "sneakers"]),
  listed("Van Heusen", "van-heusen", 74, ["shirts", "trousers", "tshirt"]),
  listed("Allen Solly", "allen-solly", 74, ["shirts", "tshirt", "trousers"]),
  listed("Peter England", "peter-england", 70, ["shirts", "trousers"]),
  listed("Louis Philippe", "louis-philippe", 72, ["shirts", "trousers"]),
  listed("Arrow", "arrow", 66, ["shirts", "trousers"]),
  listed("Raymond", "raymond", 64, ["shirts", "trousers"]),
  listed("Blackberrys", "blackberrys", 60, ["shirts", "trousers"]),
  listed("Wrangler", "wrangler", 70, ["trousers", "shirts"]),
  listed("Lee", "lee", 68, ["trousers", "shirts"]),
  listed("Pepe Jeans", "pepe-jeans", 69, ["trousers", "tshirt"]),
  listed("Calvin Klein", "calvin-klein", 71, ["tshirt", "trousers"]),
  listed("Superdry", "superdry", 63, ["tshirt", "hoodies"]),
  listed("Gap", "gap", 67, ["tshirt", "hoodies", "trousers"]),
  listed("Mango", "mango", 67, ["tshirt", "shirts", "trousers"]),
  listed("ONLY", "only", 65, ["tshirt", "trousers"]),
  listed("Vero Moda", "vero-moda", 64, ["tshirt", "trousers"]),
  listed("Snitch", "snitch", 66, ["shirts", "tshirt", "trousers"]),
  listed("Bewakoof", "bewakoof", 65, ["tshirt", "hoodies", "shorts"]),
  listed("The Souled Store", "the-souled-store", 64, ["tshirt", "hoodies", "shorts"]),
  listed("Roadster", "roadster", 62, ["tshirt", "shirts", "trousers"]),
  listed("Rare Rabbit", "rare-rabbit", 58, ["shirts", "trousers"]),
  listed("FabIndia", "fabindia", 66, ["kurtas"]),
  listed("Manyavar", "manyavar", 64, ["kurtas"]),
  listed("W", "w-for-woman", 60, ["kurtas"]),
  listed("Biba", "biba", 60, ["kurtas"]),
];

export const RESEARCHED: BrandSeed[] = [...SPORTSWEAR, ...FOOTWEAR, ...APPAREL];
export const CATALOG: BrandSeed[] = [...RESEARCHED, ...LISTED];
