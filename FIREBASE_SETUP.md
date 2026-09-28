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

## 4. Admin UIDs → rules → deploy

There are two admin sign-ins, and Firebase treats them as **two different
users with two different UIDs** (even with the same email):

| Used by            | Sign-in method  | UID found |
| ------------------ | --------------- | --------- |
| `/admin` in the browser | Google     | Authentication → Users, after you sign in once on /admin |
| `npm run seed`     | Email/password  | printed by the seed when it signs in |

Put both in `isAdmin()` in `firestore.rules`:

```
request.auth.uid in [
  "GOOGLE_ACCOUNT_UID",
  "SEED_ACCOUNT_UID"
]
```

Then deploy:

```bash
firebase deploy --only firestore
```

Tip: use a separate email for the seed account (e.g. a `+seed` alias). If you
reuse your Google email, Firebase won't create a password for it — add one via
Authentication → Users → ⋮ → Reset password instead.

## 5. Seed the catalogue (once)

```bash
npm run seed -- --dry    # preview, no sign-in needed
npm run seed             # ADMIN_EMAIL + ADMIN_PASSWORD from .env.local
```

Creates the email/password account on first run, signs in, prints its UID
and upserts the catalogue (brands, researched charts, starter products).
Brands and charts edited in `/admin` are kept. If Firestore refuses the
writes, the seed prints the UID to add to the rules.

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
