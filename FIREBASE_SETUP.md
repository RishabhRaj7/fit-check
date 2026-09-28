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

**Build → Authentication → Sign-in method**, enable **Google** only — it's
used for visitor profiles and `/admin`. Email/Password isn't needed; leave it
off.

Add your production domain under **Authentication → Settings → Authorized
domains**, or Google sign-in will fail there.

## 3. Web config

Project settings → **Your apps** → **Web** (`</>`) → register → copy the
values into `.env.local` (see `.env.example`) and your host's environment
variables.

## 4. Admin UID → rules → deploy

Sign in once on `/admin` with your Google account, copy its UID from
**Authentication → Users**, and put it in `isAdmin()` in `firestore.rules`
(it's a list, so more admins can be added later):

```
request.auth.uid in [
  "YOUR_GOOGLE_ACCOUNT_UID"
]
```

Then deploy:

```bash
firebase deploy --only firestore
```

## 5. Load the catalogue

`/admin` → **Sync catalogue** → **Preview sync** → **Write N changes**. It
writes as your Google admin account and upserts the researched brands, charts
and starter products bundled with the build. Brands and charts edited in
`/admin` are kept. Run it again whenever a deploy adds catalogue data.

`npm run seed` prints the same preview from the command line without writing
anything.

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
document, with at most 40 entries.

## Troubleshooting

- **`/api/health` returns 503** — the six `FIREBASE_*` vars aren't loaded;
  check spelling and restart.
- **`permission-denied` in `/admin`** — the signed-in UID isn't the one in
  `firestore.rules`, or the rules weren't redeployed.
- **Seed: `auth/operation-not-allowed`** — enable Email/Password (step 2).
- **Google popup blocked** — the app falls back to a full-page redirect.
