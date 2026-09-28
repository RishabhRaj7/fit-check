import {
  collection,
  doc,
  getDocs,
  writeBatch,
  type Firestore,
  type WriteBatch,
} from "firebase/firestore";
import { CATALOG, RESEARCHED } from "./catalog";
import { PRODUCTS } from "./catalog/products";
import { chartDocId } from "../lib/chartId";
import { slugify } from "../lib/format";

/**
 * Syncs the researched catalogue into Firestore. Shared by the /admin
 * "Sync catalogue" button (writes as the signed-in Google admin) and
 * `npm run seed` (read-only preview). Safe to re-run:
 *
 *  • brands   — upserted (merged), categories unioned with what's there, so
 *               brands and edits made in /admin survive.
 *  • charts   — researched charts are written; charts left by the old
 *               formula-based seed (updatedBy "seed") are deleted. Charts
 *               saved from /admin are never touched.
 *  • products — upserted under stable ids; the old seed's random-id copies
 *               of the same products are removed.
 */

const SEEDER = "research-seed";

export interface SeedPlan {
  brands: number;
  researchedBrands: number;
  charts: number;
  rows: number;
  staleCharts: number;
  writes: number;
  /** Creates and deletions only — brand updates are the common case and noise. */
  log: string[];
  commit(): Promise<void>;
}

export async function planSeed(fs: Firestore): Promise<SeedPlan> {
  const [brandSnap, chartSnap, productSnap] = await Promise.all([
    getDocs(collection(fs, "brands")),
    getDocs(collection(fs, "charts")),
    getDocs(collection(fs, "products")),
  ]);

  type Op = (b: WriteBatch) => void;
  const ops: Op[] = [];
  const log: string[] = [];

  /* brands */
  const existingBrands = new Map(brandSnap.docs.map((d) => [d.id, d.data()]));
  for (const b of CATALOG) {
    const prev = existingBrands.get(b.slug);
    const categories = [...new Set([...((prev?.categories as string[]) ?? []), ...b.categories])];
    ops.push((batch) =>
      batch.set(
        doc(fs, "brands", b.slug),
        {
          name: b.name,
          slug: b.slug,
          priority: b.priority,
          categories,
          needsData: b.charts.length === 0,
          ...(prev ? {} : { createdAt: new Date().toISOString() }),
        },
        { merge: true }
      )
    );
    if (!prev) log.push(`create brand ${b.slug}`);
  }

  /* charts */
  const written = new Set<string>();
  const now = new Date().toISOString();
  for (const b of RESEARCHED) {
    for (const c of b.charts) {
      const id = chartDocId(b.slug, c.category, c.gender, c.fit ?? "regular");
      written.add(id);
      ops.push((batch) =>
        batch.set(doc(fs, "charts", id), {
          brandSlug: b.slug,
          brandName: b.name,
          category: c.category,
          gender: c.gender,
          fit: c.fit ?? "regular",
          source: c.source,
          sourceUrl: c.sourceUrl,
          basis: c.basis ?? "body",
          needsData: false,
          updatedBy: SEEDER,
          updatedAt: now,
          rows: c.rows,
        })
      );
    }
  }
  let staleCharts = 0;
  for (const d of chartSnap.docs) {
    const by = d.data().updatedBy;
    if (!written.has(d.id) && (by === "seed" || by === SEEDER)) {
      ops.push((batch) => batch.delete(d.ref));
      staleCharts++;
      log.push(`delete stale chart ${d.id}`);
    }
  }

  /* products */
  const brandSlugs = new Set(CATALOG.map((b) => b.slug));
  const productKey = (brand: string, name: string) => `${brand}__${slugify(name)}`;
  const wanted = new Set<string>();
  for (const p of PRODUCTS) {
    if (!brandSlugs.has(p.brand)) continue;
    const id = `seed__${productKey(p.brand, p.name)}`;
    wanted.add(productKey(p.brand, p.name));
    ops.push((batch) =>
      batch.set(doc(fs, "products", id), { brandSlug: p.brand, category: p.category, name: p.name, priceInr: p.price })
    );
  }
  for (const d of productSnap.docs) {
    const x = d.data();
    if (!d.id.startsWith("seed__") && wanted.has(productKey(String(x.brandSlug), String(x.name)))) {
      ops.push((batch) => batch.delete(d.ref));
      log.push(`delete duplicate product ${d.id}`);
    }
  }

  return {
    brands: CATALOG.length,
    researchedBrands: RESEARCHED.length,
    charts: written.size,
    rows: RESEARCHED.reduce((n, b) => n + b.charts.reduce((m, c) => m + c.rows.length, 0), 0),
    staleCharts,
    writes: ops.length,
    log,
    async commit() {
      // Firestore batches cap at 500 writes; chunk everything.
      for (let i = 0; i < ops.length; i += 450) {
        const batch = writeBatch(fs);
        ops.slice(i, i + 450).forEach((op) => op(batch));
        await batch.commit();
      }
    },
  };
}
