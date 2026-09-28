# Fit Check — Firebase setup

Fit Check runs entirely on the **public Firebase web-app config** — the six
keys from *Project settings → Your apps → Web app*. There is no service
account and no private key.

| Who                | Reads                          | Writes                                    |
| ------------------ | ------------------------------ | ----------------------------------------- |
| Next.js server     | brands, charts, products       | —                                         |
| Signed-in visitor  | their own `users/{uid}`        | their own `users/{uid}` (size profile)    |
| Admin (`/admin`)   | everything public              | brands, charts, products                  |

## Data model

```
brands/{slug}                        { name, slug, categories[], priority, needsData, logoUrl? }
charts/{slug}__{category}__{gender}  { brandSlug, brandName, category, gender, needsData,
                                       updatedAt, updatedBy, rows: [{ anchorValue, eu, uk, us, jpn, ind, label }] }
products/{autoId}                    { brandSlug, category, name, priceInr }
users/{uid}                          { sizeProfile: { "{category}:{gender}": entry }, updatedAt }
```

The public catalogue (~100 small documents) is read **once per minute per
server instance** into memory (`src/lib/catalog.ts`) and every page, the
converter and `/api/convert` work from that snapshot. Size conversion runs in
the browser (`src/lib/sizing.ts`), so dragging a slider never touches the
network. Admin edits go straight to Firestore and reach the public site within
that minute; `/admin` itself always reads live.

---

## 1. Project & database

1. <https://console.firebase.google.com> → **Add project**.
2. **Build → Firestore Database → Create database** — `asia-south1 (Mumbai)`,
   **Production** mode.

## 2. Auth providers

**Build → Authentication → Sign-in method**, enable:

- **Google** — visitor profiles and `/admin`.
- **Email/Password** — only for the seed script (Node can't open a popup).

Add your production domain under **Authentication → Settings → Authorized
domains**, or Google sign-in will fail there.

## 3. Web config

Project settings → **Your apps** → **Web** (`</>`) → register → copy the
values into `.env.local` (see `.env.example`) and your host's environment
variables.

## 4. Admin UID → rules → deploy

Sign in once with the account you'll use as admin (on `/admin`, or via the
seed script), copy its UID from **Authentication → Users**, and put it in
`firestore.rules`:

```
request.auth.uid == "YOUR_UID";
```

Then deploy rules (and the empty index file):

```bash
npm i -g firebase-tools
firebase login
firebase deploy --only firestore
```

## 5. Seed the catalogue (once)

```bash
ADMIN_EMAIL=you@example.com ADMIN_PASSWORD='a-strong-password' npm run seed
```

Creates the email/password account on first run, then signs in and writes
20 brands, 69 charts, 608 rows and the starter products. Re-running clears and
rewrites. The starter charts are generated from standard conversion steps —
replace them with each brand's published chart in `/admin` over time.

## 6. Verify

- `GET /api/health` → `{"ok":true,"dataSource":"firestore","brands":…}`
- `/admin` → sign in with the admin Google account → the deck. Any other
  account can look but every write is denied.
- `/profile` → sign in with any Google account → save a size → it appears on
  another device after signing in there.

## Size profiles

Signed out, a visitor's sizes live in `localStorage` on that device. On
sign-in they're merged into `users/{uid}` (newer entry wins) and the device
copy is cleared, so the next person on a shared device starts clean. The
rules only let a user write `sizeProfile` and `updatedAt` to their own
document, with at most 16 entries.

## Troubleshooting

- **`/api/health` returns 503** — the six `FIREBASE_*` vars aren't loaded;
  check spelling and restart.
- **`permission-denied` in `/admin`** — the signed-in UID isn't the one in
  `firestore.rules`, or the rules weren't redeployed.
- **Seed: `auth/operation-not-allowed`** — enable Email/Password (step 2).
- **Google popup blocked** — the app falls back to a full-page redirect.
