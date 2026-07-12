# PAYVORA — Nigerian Fintech Platform

A fintech platform for gift card trading, bill payments, airtime, and virtual dollar cards. Monorepo with website, mobile app, and API server.

## Run & Operate

### Workflows (Replit)
- **PayVora Website** — Next.js 15 landing page on port 5000 (preview pane); inherits `INTERNAL_API_URL` from the shared env (points at the API Server below)
- **artifacts/api-server: API Server** — Express API on port 8080 (internal, artifact-managed); the sole API dev workflow
- **artifacts/mobile: expo** — Expo dev server on port 19000; scan QR code with Expo Go app
- **artifacts/mockup-sandbox: Component Preview Server** — Vite canvas/design preview on port 8081

### Note on workflow consolidation (2026-07-12)
There used to be two separate dev workflows running the Express API (a legacy hand-rolled `API Server` on port 3001, and the artifact-managed `artifacts/api-server: API Server` on port 8080). The legacy one was removed to avoid confusion — the artifact-managed workflow on port 8080 is now canonical for dev, matching `userenv.shared.INTERNAL_API_URL`. Production (Railway `start.mjs`) is unaffected — it still runs the API on a fixed internal port 3001 and the website on Railway's dynamic `PORT`; that's a separate, self-contained launcher unrelated to Replit dev workflow ports. See `PROJECT_STATUS.md` → "Final Cleanup Pass" for the full rationale.

### Commands
- `pnpm install` — install all workspace dependencies (run this after cloning)
- `pnpm --filter @workspace/api-server run dev` — build + start API server (port 8080)
- `pnpm --filter @workspace/website run dev` — start Next.js website (port 5000)
- `pnpm --filter @workspace/mobile run dev` — start mobile Expo dev server
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required secret: `JWT_SECRET` — secret key for signing/verifying JWT auth tokens (set in Replit Secrets)
- Required secret: `FIREBASE_SERVICE_ACCOUNT` — full Firebase service account JSON string (set in Replit Secrets)
- Required env: `DATABASE_URL` — Postgres connection string (runtime-managed by Replit)
- Required secret: `GOOGLE_CLIENT_ID` + `GOOGLE_CLIENT_SECRET` — Google OAuth credentials (server-side; set in Replit Secrets)
- Required env: `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` — Google OAuth client ID for mobile/web
- Required env: `GOOGLE_CALLBACK_URL` — Google OAuth redirect URI (set in shared env, e.g. `https://www.payvora.org/api/auth/google/callback`)
- Required env: `RELOADLY_CLIENT_ID` + `RELOADLY_CLIENT_SECRET` — needed for bill payment and eSIM routes (`/api/bills/*`, `/api/esim/*`)
- Optional env: `GOOGLE_SITE_VERIFICATION` — Google Search Console meta tag for the website
- Note: `NODE_ENV` is set to `development` in the shared env (for local workflows) and `production` in the production env (for deployments)

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5 (port 8080)
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)
- Mobile: Expo (React Native), Expo Router (file-based navigation)
- Fonts: Manrope (400, 500, 600, 700)

## Where things live

- `artifacts/mobile/` — PAYVORA mobile app (Expo)
  - `app/(auth)/` — Login, Register, OTP, Forgot Password screens
  - `app/(tabs)/` — Home, Card, History tabs (main app)
  - `app/(app)/` — Dashboard (Fund Wallet), Sell Gift Card, Confirm Transaction, Card Status, etc.
  - `app/onboarding.tsx` — 6-slide onboarding carousel
  - `context/AuthContext.tsx` — user auth state (AsyncStorage)
  - `assets/images/` — all local image assets
- `artifacts/payvora/` — Payvora mobile app (separate brand)
- `attached_assets/aza_export/` — Figma design export reference (historical, not used in app)
- `attached_assets/design_ref/` — design reference screenshots

## Architecture decisions

- OTP verification (`/(auth)/otp`) is shown after email/password login AND after registration, but NOT after Google/Apple social auth (which goes directly to `/(tabs)`)
- Gift Card button on the home dashboard opens a bottom sheet modal with two tiles: "Sell Gift Card" → `/(app)/sell-gift-card` and "Check Pending" → `/(app)/card-status`
- White background light theme (bg: `#FFFFFF`, text: `#0B0A0A`, accent: `#35C2C1` teal) for PAYVORA app
- `/(app)/dashboard.tsx` is actually the "Fund Wallet" flow, not a real dashboard — the main home is at `/(tabs)/index.tsx`
- AuthContext uses AsyncStorage to persist user session; login/register always succeed (mock auth)

## Product

- Onboarding: 6-slide animated carousel (Withdraw, Sell Gift Card, Bills, Portfolio, Virtual Card, eSIM)
- Auth: Email/password login + registration, OTP verification, Google/Apple social auth
- Home dashboard: wallet balance, quick actions (Fund/Sell/Withdraw), services grid, promo banners, recent transactions
- Gift card trading: sell gift cards with category/country/type/amount, check pending card status
- Fund wallet: bank selection, account number, quick/custom amounts
- Transaction history with filtering and bottom-sheet detail view

## User preferences

- Do NOT rebuild screens from scratch — modify existing files using Figma exports as reference
- Do NOT navigate to forgot-password from the main login flow — only when "Forgot Password?" link is explicitly tapped
- Use existing image assets from `artifacts/mobile/assets/images/`

## Gotchas

- Expo runs in LAN mode on port 19000 — use the Expo Go app on the same network, or the web preview
- The API server runs on port 8080, not 5000 — `PORT=8080` env var is set
- `/(app)/dashboard.tsx` is named "dashboard" but is actually the Fund Wallet screen
- Social auth (Google/Apple) skips OTP and goes directly to `/(tabs)` — this is intentional

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
- Figma design reference: `attached_assets/aza_export/src/imports/` for screen-level component specs (historical reference only)
- CSS design specs: `attached_assets/Pasted--Gift-card-button-*` and similar pasted text files
