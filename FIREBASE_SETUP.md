# Fit Check — Firebase Setup (web-app config)

The app now uses the **public Firebase web-app config** — the six keys you
get from *Project settings → Your apps → Web app*. No service account, no
private key to copy.

How access is split:

- **Reads** (every page, the converter, the hero): the public config,
  server-side in Next and via `/api/*`. Open reads, enforced by rules.
- **Writes** (`/admin`, seed): an **authenticated account whose email is
  hardcoded in `firestore.rules`** — Google sign-in in `/admin`, or
  email/password in the seed script.

---

## 1. Create the project & database (Firebase console)

1. <https://console.firebase.google.com> → **Add project** (e.g. `fit-check`).
   Analytics optional.
2. Project settings → **Usage and billing** → link a billing account
   (required to activate Firestore; free Spark allowances apply).
3. **Build → Firestore Database → Create database**
   - Location: `asia-south1 (Mumbai)`
   - Mode: **Production**

## 2. Enable the two auth providers

**Build → Authentication → Get started → Sign-in method**, enable:

- **Google** — for `/admin` sign-in.
- **Email/Password** — for the seed script (Node can't do a Google popup).

## 3. Register a web app & copy the config

Project settings → **Your apps** → **Web** (`</>`) → register (any nickname).
Copy the `firebaseConfig` object into your env, keeping these exact names
(see `.env.example`):

```bash
FIREBASE_API_KEY=AIza…
FIREBASE_AUTH_DOMAIN=fit-check.firebaseapp.com
FIREBASE_PROJECT_ID=fit-check
FIREBASE_STORAGE_BUCKET=fit-check.appspot.com
FIREBASE_MESSAGING_SENDER_ID=123…
FIREBASE_APP_ID=1:123:web:abc…
```

Locally: `.env`. On your host (Vercel etc.): platform Environment Variables,
then redeploy/restart.

## 4. Put YOUR email into the rules, then deploy

Edit `firestore.rules` — replace `owner@example.com` with the Google account
email you will use as admin (the same email goes in `ADMIN_EMAIL`):

```
request.auth.token.email == "you@gmail.com";
```

Deploy:

```bash
npm i -g firebase-tools
firebase login
firebase use --add          # pick the project
firebase deploy --only firestore
```

(Also sets the composite indexes from `firestore.indexes.json`.)

## 5. Seed Firestore with the brand data (once)

```bash
ADMIN_EMAIL=you@gmail.com ADMIN_PASSWORD='a-strong-password' npx tsx src/db/seed.ts
```

First run **creates** that email/password account in Firebase Auth
(then you can also use it for email-link-style access if you ever want it);
later runs just sign in. It writes 20 brands / 69 charts / 608 rows /
45 products. Re-running is safe (clears and rewrites).

> The `ADMIN_PASSWORD` account is the write credential — pick a real
> password and keep it private. `/admin` itself uses **Google** sign-in and
> never sees this password.

## 6. Verify

1. Restart/redeploy the app.
2. `GET /api/health` → `{"ok":true,"dataSource":"firestore"}`
   (`postgres` = the six FIREBASE_* vars weren't picked up).
3. `/admin` → **Sign in with Google** with the rules email → full deck.
   A different Google account can browse the deck but every write is denied
   with a clear message.

---

## 7. User profiles (automatic — nothing to configure)

Visitors who open `/profile` sign in with **Google** (Authentication →
Google provider, enabled in step 2). Their size profile is stored at
`users/{uid}` (`sizeProfile` map, same `{category}:{gender}` keys as the
device profile) and is readable/writable **only by that user** per
`firestore.rules`. On the next visit — any device — it is fetched back, so
nothing needs to be re-entered.

Device-only guest entries (IndexedDB) are merged up to Firestore
automatically on first sign-in. With Firebase not configured, the site keeps
the old device-only behaviour.

If you edited the rules for your email, redeploy them so the `users/{uid}`
block ships too:

```bash
firebase deploy --only firestore
```

---

## Troubleshooting

- **`dataSource` still `postgres`** — env vars not loaded; check spelling and
  restart the server.
- **`permission-denied` on writes** — signed-in email ≠ email in
  `firestore.rules`, or the rules weren't redeployed after editing.
- **Seed says "auth/operation-not-allowed"** — the Email/Password provider
  isn't enabled (step 2).
- **Seed says "auth/email-already-in-use"** — the account already exists;
  just make sure `ADMIN_PASSWORD` matches it.
- **Google popup blocked** — allow popups for the site, or use a regular
  (non-private) browser window.
