# Fit Check

Cross-brand size checker for India. Tell it the size you wear in one brand and
it tells you the size to buy in another — for shoes, tees, shirts, hoodies,
kurtas, jeans and shorts.

Sizes are compared on the body measurement each brand's own chart is built on
(foot length, chest, waist), not by lining up size labels. That's why a
Nike Air Force 1 in UK 7 can map to UK 8 in Nike running shoes: the two lines
are cut on different lasts, and each has its own chart.

## Features

- **10 categories in 3 groups.** Footwear (lifestyle sneakers, running &
  sports, slides, formal & casual), tops (t-shirts, shirts, hoodies, kurtas) and
  bottoms (jeans, shorts). Categories in a group share a body anchor, so a
  saved sneaker size also answers the running-shoe question.
- **Product lines and fits.** Brands can have separate charts per line
  (lifestyle vs running) and per fit (slim, regular, relaxed, oversized).
- **Researched charts.** Every chart carries its source and URL. Brands whose
  guide couldn't be transcribed yet are listed with an estimate from similar
  brands, clearly marked.
- **Size passport.** Save sizes as a guest (kept on the device) or sign in with
  Google to sync them across devices.
- **Admin deck** at `/admin` for editing brands, charts (paste CSV) and
  products, plus a one-click sync of the researched catalogue.
- **Public API.** `POST /api/convert` runs the same engine the site uses.

## Stack

Next.js 16 (App Router) · React 19 · Tailwind CSS v4 · framer-motion ·
Firebase (Firestore + Google Auth, web SDK only — no service account) ·
deployed on Vercel.

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in the six FIREBASE_* values
npm run dev                  # http://localhost:3000
```

No Firebase project yet? Run against the bundled catalogue instead:

```bash
npm run dev:local
```

Firebase setup (project, Google sign-in, admin UID, rules) is covered step by
step in [FIREBASE_SETUP.md](FIREBASE_SETUP.md).

## Scripts

| Command             | What it does                                                        |
| ------------------- | ------------------------------------------------------------------- |
| `npm run dev`       | Dev server reading the catalogue from Firestore                     |
| `npm run dev:local` | Dev server reading the bundled catalogue in `src/db/catalog`        |
| `npm run seed`      | Read-only preview of what `/admin` → Sync catalogue would write     |
| `npm run build`     | Production build                                                    |
| `npm run typecheck` | `tsc --noEmit`                                                      |
| `npm run lint`      | ESLint                                                              |

## How it works

```
src/db/catalog/*     researched brand charts (source of truth for seeded data)
        │  /admin → Sync catalogue (writes as the signed-in Google admin)
        ▼
Firestore            brands · charts · products · users/{uid}
        │  read once a minute per server instance
        ▼
src/lib/catalog.ts   in-memory catalogue snapshot used by every page
        │
        ▼
src/lib/sizing.ts    pure conversion engine — runs in the browser
```

- **Charts** are keyed `brand__category__gender[__fit]`. Each row holds the
  body measurement in cm plus the brand's UK / US / EU / JP / India or letter
  size.
- **Conversion** finds the row nearest your measurement in the target chart
  and reports whether it's an exact match, the nearest size, or an estimate.
  Missing charts fall back to the other gender, then to a vote across similar
  brands.
- **Profiles** are stored per `category:gender`. Signed out they live in
  `localStorage`; on sign-in they merge into `users/{uid}` and the device copy
  is cleared.
- **Security** lives in `firestore.rules`: the catalogue is publicly readable
  and writable only by the admin UID(s); each user can write only their own
  size profile.

## Project layout

```
src/
  app/            routes — home, category/[category]/[brand], profile,
                  onboarding, measure, admin, api/convert, api/health
  components/     UI (Hero + hero/tape animation, BrandSizing, SizePassport,
                  AdminApp, …)
  lib/            catalog, sizing engine, categories, profile store, firebase
  db/
    catalog/      researched charts: sportswear, footwear, apparel, products
    seedPlan.ts   catalogue → Firestore sync (used by /admin and npm run seed)
scripts/          dev-local runner
firestore.rules   access control
```

## Adding or fixing data

- **One-off edits:** `/admin` → Charts. Pick brand, category, gender and fit,
  paste CSV from the brand's size guide, save. Live within a minute.
- **Researched data in code:** add or edit a brand in `src/db/catalog/`,
  preview with `npm run dev:local`, deploy, then run `/admin` → Sync catalogue.
  Charts saved from `/admin` are never overwritten by the sync.

## API

```bash
curl -X POST https://<your-domain>/api/convert \
  -H "Content-Type: application/json" \
  -d '{"category":"running","gender":"men","brandSlug":"asics","anchorValue":26.5}'
```

`anchorValue` is the body measurement in cm (foot length, chest or waist,
depending on the category). `GET /api/health` reports the data source and
catalogue counts.
