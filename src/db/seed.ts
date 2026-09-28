import { config } from "dotenv";
import { BRANDS, PRODUCTS } from "./seedData";

/**
 * Seeds Firestore with the starter catalogue.
 * The public web config can only READ, so the script signs in with
 * email/password first (ADMIN_EMAIL + ADMIN_PASSWORD) — that account's UID
 * must be the admin UID in firestore.rules. The account is created on first
 * run if needed. Re-running is safe: it clears and rewrites.
 *
 *   npx tsx src/db/seed.ts
 */

config({ path: [".env.local", ".env"], quiet: true });

async function main() {
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
        "(the account whose UID is the admin in firestore.rules)"
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
      priceInr: p.price,
    });
  }

  console.log(
    `Seeded Firestore: ${BRANDS.length} brands, ${chartCount} charts, ${rowCount} rows, ${PRODUCTS.length} products.`
  );
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
