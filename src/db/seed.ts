import { config } from "dotenv";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { planSeed } from "./seedPlan";

/**
 * Read-only preview of what the /admin "Sync catalogue" button will write.
 *
 * Writing happens in /admin, signed in with the admin Google account — the
 * project has no email/password sign-in, so a Node script can't authenticate
 * as the admin. This only needs the public web config (catalogue reads are
 * public).
 *
 *   npm run seed
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
  if (!cfg.apiKey || !cfg.projectId || !cfg.appId) throw new Error("FIREBASE_* web config incomplete");

  const plan = await planSeed(getFirestore(initializeApp(cfg)));
  console.log(
    `${plan.brands} brands (${plan.researchedBrands} with researched charts), ${plan.charts} charts / ${plan.rows} rows, ` +
      `${plan.staleCharts} stale charts to remove, ${plan.writes} writes in total.`
  );
  if (plan.log.length) console.log(plan.log.join("\n"));
  console.log("\nPreview only — nothing written. Apply it from /admin → Sync catalogue.");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
