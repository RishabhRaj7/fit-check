# Fit Check — Firebase (Firestore) Setup

Fit Check uses **Cloud Firestore** as its primary database through the
**Firebase Admin SDK** (server-side only). The browser never talks to
Firestore directly — every read/write goes through the Next.js API routes.

When the three `FIREBASE_*` env vars are present, the whole app (pages,
converter, `/admin`, seed script) runs on Firestore. When they are absent,
the app falls back to the local Postgres layer so development keeps working.

You do **not** need: Authentication, Hosting, Storage, client SDK config
(`apiKey`, `messagingSenderId`, …), or any npm package beyond what is already
installed (`firebase-admin`).

---

## Part 1 — In the Firebase console (once)

### 1. Create the project
1. Go to <https://console.firebase.google.com> and sign in with a Google account.
2. **Add project** → name it e.g. `fit-check` → continue.
3. Google Analytics: optional — you can disable it, the app doesn't use it.
4. **Create project**. Note the **Project ID** shown under the name
   (e.g. `fit-check-1a2b3`) — you'll need it in Part 2.

### 2. Enable billing (required for Firestore)
1. Project settings (gear icon) → **Usage and billing** → **Billing**.
2. Link a billing account. The **free Spark allowance** still applies
   (50k reads / 20k writes / 20k deletes per day, 1 GiB storage) — a billing
   account is only required to activate Firestore; you stay on free tier
   unless you exceed it.

### 3. Create the Firestore database
1. Left sidebar → **Build** → **Firestore Database** → **Create database**.
2. Location: pick **`asia-south1 (Mumbai)`** (lowest latency for India).
3. Mode: **Production mode** (we deploy deny-all rules; the Admin SDK bypasses
   rules, so the app keeps full access).
4. Create.

### 4. Generate a service-account key (this is the only "auth" step)
1. Project settings (gear) → **Service accounts** tab.
2. Confirm the SDK is **Firebase Admin SDK** → click
   **Generate new private key** → **Generate key**.
3. A JSON file downloads. It looks like:

```json
{
  "type": "service_account",
  "project_id": "fit-check-1a2b3",
  "private_key_id": "…",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIE…\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-xxxx@fit-check-1a2b3.iam.gserviceaccount.com",
  "client_id": "…",
  …
}
```

Keep this file private. It is a root credential for your project.

### 5. (Optional but recommended) Deploy rules + indexes
The repo ships `firebase.json`, `firestore.rules` (deny all client access) and
`firestore.indexes.json` (composite indexes for the product queries).

```bash
npm i -g firebase-tools
firebase login
firebase use --add        # pick your project
firebase deploy --only firestore
```

---

## Part 2 — Environment variables

Map the downloaded JSON onto three env vars:

| JSON field     | Env var                 |
| -------------- | ----------------------- |
| `project_id`   | `FIREBASE_PROJECT_ID`   |
| `client_email` | `FIREBASE_CLIENT_EMAIL` |
| `private_key`  | `FIREBASE_PRIVATE_KEY`  |

### Local development
Put them in `.env` (see `.env.example` for the template):

```bash
FIREBASE_PROJECT_ID=fit-check-1a2b3
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxx@fit-check-1a2b3.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----
MIIE…
-----END PRIVATE KEY-----
"
```

Notes:
- The app normalises escaped line breaks, so a single-line value containing
  literal `\n` sequences also works (that's the form most hosters need).
- Never commit `.env`.

### On your host (Vercel / other)
Add the same three vars (plus `ADMIN_KEY` if you want a custom admin key) in
the platform's **Environment Variables** settings, then redeploy/restart.
For a single-line private key in Vercel, keep the `\n` sequences verbatim.

### Optional
- `ADMIN_KEY` — key required by `/admin` mutations (`x-admin-key` header).
  Defaults to `sizing-admin` when unset.

---

## Part 3 — Seed Firestore with the brand data (once)

The seed script auto-detects the datasource. With the env vars set, run:

```bash
npx tsx src/db/seed.ts
```

It will print `Seeding Firestore: 20 brands, 69 charts, 608 rows, 45 products.`

Firestore layout created:
- `brands/{slug}` — name, slug, logoUrl, categories[], priority, needsData
- `charts/{slug}__{category}__{gender}` — rows[] array of
  `{ anchorValue, eu, uk, us, jpn, ind, label }`
- `products/{autoId}` — brandSlug, category, name, slug, priceInr, imageUrl

Re-running the seed is safe (it clears and rewrites the three collections).

---

## Part 4 — Verify

1. Restart the app (or redeploy).
2. `GET /api/health` → `{"ok":true,"dataSource":"firestore"}`.
   (`postgres` means the env vars weren't picked up.)
3. `/admin` shows a `DATASOURCE: FIRESTORE` badge. New brands/charts you save
   there now write straight to Firestore — adding a brand remains a form,
   not a deploy.

---

## Troubleshooting

- **`dataSource` still `postgres`** — env vars not loaded. Check spelling,
  quotes around the private key, and restart the server.
- **`error: invalid_grant` / signature errors** — the private key was mangled
  (lost line breaks). Use the `\n` form or the multi-line quoted form exactly
  as downloaded.
- **`permission denied` on seed** — wrong project's key, or the service
  account was deleted (Service accounts tab → regenerate).
- **Queries slow at first** — Firestore builds the composite indexes after
  `firebase deploy --only firestore`; single-field queries need no action.
