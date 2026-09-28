import { config } from "dotenv";
import { CATALOG, RESEARCHED } from "./catalog";
import { PRODUCTS } from "./catalog/products";
import { chartDocId } from "../lib/chartId";
import { slugify } from "../lib/format";

/**
 * Writes the researched catalogue to Firestore. Safe to re-run:
 *
 *  • brands   — upserted (merged), categories unioned with what's there, so
 *               brands and edits made in /admin survive.
 *  • charts   — researched charts are written; charts left by the old
 *               formula-based seed (updatedBy "seed") are deleted. Charts
 *               saved from /admin are never touched.
 *  • products — upserted under stable ids; the old seed's random-id copies
 *               of the same products are removed.
 *
 * The public web config can only READ, so the script signs in with
 * ADMIN_EMAIL + ADMIN_PASSWORD — that account's UID must be the admin UID in
 * firestore.rules. The account is created on first run if needed.
 *
 *   npm run seed            write
 *   npm run seed -- --dry   print what would change, write nothing
 */

config({ path: [".env.local", ".env"], quiet: true });

const DRY = process.argv.includes("--dry");
const SEEDER = "research-seed";

async function main() {
  const cfg = {
    apiKey: process.env.FIREBASE_API_KEY ?? "",
    authDomain: process.env.FIREBASE_AUTH_DOMAIN ?? "",
    projectId: process.env.FIREBASE_PROJECT_ID ?? "",
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET ?? "",
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID ?? "",
    appId: process.env.FIREBASE_APP_ID ?? "",
  };
  if (!cfg.apiKey || !cfg.projectId || !cfg.appId) throw new Error("FIREBASE_* web config incomplete");

  const { initializeApp } = await import("firebase/app");
  const { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } = await import("firebase/auth");
  const { getFirestore, collection, doc, getDocs, writeBatch } = await import("firebase/firestore");

  const app = initializeApp(cfg);
  let seedUid = "";
  const fs = getFirestore(app);

  if (!DRY) {
    const email = process.env.ADMIN_EMAIL ?? "";
    const password = process.env.ADMIN_PASSWORD ?? "";
    if (!email || !password) {
      throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD are required (the account whose UID is the admin in firestore.rules)");
    }
    const auth = getAuth(app);
    console.log(`Signing in as ${email}…`);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (e) {
      const code = (e as { code?: string }).code ?? "";
      if (code !== "auth/user-not-found" && code !== "auth/invalid-credential") throw e;
      try {
        console.log("No email/password account yet — creating it…");
        await createUserWithEmailAndPassword(auth, email, password);
      } catch (e2) {
        if ((e2 as { code?: string }).code === "auth/email-already-in-use") {
          throw new Error(
            `${email} already exists in Firebase Auth but this password didn't work — either the password is wrong, ` +
              "or it's a Google-only account with no password. Either use a different ADMIN_EMAIL for " +
              "the seed, or add a password to that account: Authentication → Users → ⋮ → Reset password, " +
              "follow the email, then re-run with that password."
          );
        }
        throw e2;
      }
    }
    seedUid = auth.currentUser?.uid ?? "";
    console.log(`Signed in. Seed account UID: ${seedUid}`);
  }

  const [brandSnap, chartSnap, productSnap] = await Promise.all([
    getDocs(collection(fs, "brands")),
    getDocs(collection(fs, "charts")),
    getDocs(collection(fs, "products")),
  ]);

  // Firestore batches cap at 500 writes; chunk everything.
  type Op = (b: ReturnType<typeof writeBatch>) => void;
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
    log.push(`${prev ? "update" : "create"} brand ${b.slug}`);
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
  let removedCharts = 0;
  for (const d of chartSnap.docs) {
    const by = d.data().updatedBy;
    if (!written.has(d.id) && (by === "seed" || by === SEEDER)) {
      ops.push((batch) => batch.delete(d.ref));
      removedCharts++;
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

  const chartCount = written.size;
  const rowCount = RESEARCHED.reduce((n, b) => n + b.charts.reduce((m, c) => m + c.rows.length, 0), 0);
  console.log(
    `${CATALOG.length} brands (${RESEARCHED.length} with researched charts), ${chartCount} charts / ${rowCount} rows, ` +
      `${removedCharts} stale charts to remove, ${ops.length} writes in total.`
  );

  if (DRY) {
    console.log(log.filter((l) => !l.startsWith("update brand")).join("\n"));
    console.log("Dry run — nothing written.");
    return;
  }
  try {
    for (let i = 0; i < ops.length; i += 450) {
      const batch = writeBatch(fs);
      ops.slice(i, i + 450).forEach((op) => op(batch));
      await batch.commit();
    }
  } catch (e) {
    if (String((e as { code?: string }).code ?? "").includes("permission-denied")) {
      throw new Error(
        `Firestore refused the writes. Add this UID to isAdmin() in firestore.rules:

    "${seedUid}"

` +
          "then run `firebase deploy --only firestore:rules` and re-run the seed."
      );
    }
    throw e;
  }
  console.log("Done.");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
