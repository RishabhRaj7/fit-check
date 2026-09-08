import "dotenv/config";
import { BRANDS, PRODUCTS, slugifyProduct } from "./seedData";

/**
 * Seed dispatcher — writes to Firestore when the FIREBASE_* service account
 * env vars are present (production datasource), otherwise to local Postgres.
 */

async function seedPostgres() {
  const { db } = await import("./index");
  const { brands, products, sizeChartRows, sizeCharts } = await import(
    "./schema"
  );

  console.log("Seeding Postgres…");
  await db.delete(sizeChartRows);
  await db.delete(sizeCharts);
  await db.delete(products);
  await db.delete(brands);

  const idBySlug = new Map<string, number>();
  let chartCount = 0;
  let rowCount = 0;

  for (const b of BRANDS) {
    const [inserted] = await db
      .insert(brands)
      .values({
        name: b.name,
        slug: b.slug,
        categories: b.categories,
        priority: b.priority,
        needsData: b.needsData ?? false,
        logoUrl: `/brands/${b.slug}/logo.png`,
      })
      .returning({ id: brands.id });
    idBySlug.set(b.slug, inserted.id);

    for (const c of b.charts) {
      const [chart] = await db
        .insert(sizeCharts)
        .values({
          brandId: inserted.id,
          category: c.category,
          gender: c.gender,
          updatedBy: "seed",
        })
        .returning({ id: sizeCharts.id });
      chartCount++;
      if (c.rows.length > 0) {
        await db
          .insert(sizeChartRows)
          .values(c.rows.map((r, i) => ({ ...r, chartId: chart.id, sort: i })));
        rowCount += c.rows.length;
      }
    }
  }

  for (const p of PRODUCTS) {
    const brandId = idBySlug.get(p.brand);
    if (!brandId) continue;
    await db.insert(products).values({
      brandId,
      category: p.category,
      name: p.name,
      slug: slugifyProduct(p.name),
      imageUrl: null,
      priceInr: p.price,
    });
  }

  console.log(
    `Seeded Postgres: ${BRANDS.length} brands, ${chartCount} charts, ${rowCount} rows, ${PRODUCTS.length} products.`
  );
}

async function seedFirestore() {
  const { getFs } = await import("../lib/firebase/admin");
  const fs = getFs();

  console.log("Seeding Firestore…");
  // Clear existing collections
  for (const col of ["brands", "charts", "products"]) {
    const snap = await fs.collection(col).get();
    const batch = fs.batch();
    snap.docs.forEach((doc) => batch.delete(doc.ref));
    if (!snap.empty) await batch.commit();
  }

  let chartCount = 0;
  let rowCount = 0;

  for (const b of BRANDS) {
    await fs.collection("brands").doc(b.slug).set({
      name: b.name,
      slug: b.slug,
      categories: b.categories,
      priority: b.priority,
      needsData: b.needsData ?? false,
      logoUrl: `/brands/${b.slug}/logo.png`,
      createdAt: new Date().toISOString(),
    });

    for (const c of b.charts) {
      await fs
        .collection("charts")
        .doc(`${b.slug}__${c.category}__${c.gender}`)
        .set({
          brandSlug: b.slug,
          brandName: b.name,
          category: c.category,
          gender: c.gender,
          needsData: false,
          updatedBy: "seed",
          updatedAt: new Date().toISOString(),
          rows: c.rows,
        });
      chartCount++;
      rowCount += c.rows.length;
    }
  }

  for (const p of PRODUCTS) {
    await fs.collection("products").add({
      brandSlug: p.brand,
      category: p.category,
      name: p.name,
      slug: slugifyProduct(p.name),
      imageUrl: null,
      priceInr: p.price,
    });
  }

  console.log(
    `Seeded Firestore: ${BRANDS.length} brands, ${chartCount} charts, ${rowCount} rows, ${PRODUCTS.length} products.`
  );
}

async function main() {
  const { hasFirebaseCreds } = await import("../lib/firebase/admin");
  if (hasFirebaseCreds()) {
    await seedFirestore();
  } else {
    console.log("No FIREBASE_* creds found — falling back to Postgres.");
    await seedPostgres();
  }
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
