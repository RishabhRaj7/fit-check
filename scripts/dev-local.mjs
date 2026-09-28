// `npm run dev:local` — Next dev server reading the catalogue from the seed
// files (src/db/catalog) instead of Firestore. Preview data before seeding.
import { spawn } from "node:child_process";

const child = spawn("npx", ["next", "dev", ...process.argv.slice(2)], {
  stdio: "inherit",
  shell: true,
  env: { ...process.env, CATALOG_SOURCE: "local" },
});
child.on("exit", (code) => process.exit(code ?? 0));
