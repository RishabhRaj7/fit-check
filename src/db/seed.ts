import "dotenv/config";
import { BRANDS, PRODUCTS, slugifyProduct } from "./seedData";

/**
 * Seed dispatcher.
 *  - With FIREBASE_* web-app config present: seeds Firestore. Because public
 *    config can only READ, the script signs in with email/password first
 *    (ADMIN_EMAIL + ADMIN_PASSWORD env vars — the same email hardcoded in
 *    firestore.rules). The account is created on first run if needed.
 *  - Otherwise: seeds local Postgres (offline fallback).
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
  const cfg = {
    apiKey: process.env.FIREBASE_API_KEY ?? "",
    authDomain: process.env.FIREBASE_AUTH_DOMAIN ?? "",
    projectId: process.env.FIREBASE_PROJECT_ID ?? "",
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET ?? "",
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID ?? "",
    appId: process.env.FIREBASE_APP_ID ?? "",
  };
  if (!cfg.apiKey || !cfg.projectId || !cfg.appId) {
    throw new Error("FIREBASE_* web config incomplete");
  }
  const email = process.env.ADMIN_EMAIL ?? "";
  const password = process.env.ADMIN_PASSWORD ?? "";
  if (!email || !password) {
    throw new Error(
      "ADMIN_EMAIL and ADMIN_PASSWORD are required to seed Firestore " +
        "(same email as hardcoded in firestore.rules)"
    );
  }

  const { initializeApp } = await import("firebase/app");
  const { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } =
    await import("firebase/auth");
  const {
    getFirestore,
    collection,
    doc,
    getDocs,
    setDoc,
    deleteDoc,
    addDoc,
  } = await import("firebase/firestore");

  const app = initializeApp(cfg);
  const auth = getAuth(app);
  const fs = getFirestore(app);

  console.log(`Signing in as ${email}…`);
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch {
    console.log("Account not found — creating it…");
    await createUserWithEmailAndPassword(auth, email, password);
  }

  console.log("Seeding Firestore…");
  for (const col of ["brands", "charts", "products"]) {
    const snap = await getDocs(collection(fs, col));
    await Promise.all(snap.docs.map((d) => deleteDoc(d.ref)));
  }

  let chartCount = 0;
  let rowCount = 0;

  for (const b of BRANDS) {
    await setDoc(doc(fs, "brands", b.slug), {
      name: b.name,
      slug: b.slug,
      categories: b.categories,
      priority: b.priority,
      needsData: b.needsData ?? false,
      logoUrl: `/brands/${b.slug}/logo.png`,
      createdAt: new Date().toISOString(),
    });

    for (const c of b.charts) {
      await setDoc(doc(fs, "charts", `${b.slug}__${c.category}__${c.gender}`), {
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
    await addDoc(collection(fs, "products"), {
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
  process.exit(0); // close auth listeners
}

async function main() {
  const { hasFirebaseConfig } = await import("../lib/firebase/app");
  if (hasFirebaseConfig()) {
    await seedFirestore();
  } else {
    console.log("No FIREBASE_* config found — falling back to Postgres.");
    await seedPostgres();
  }
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
