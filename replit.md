# AZA Mobile App

A fintech gift card trading platform — users can sell gift cards, fund their wallet, pay bills, and track transactions.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm --filter @workspace/mobile run dev` — run the AZA mobile app (Expo tunnel)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

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

- `artifacts/mobile/` — AZA mobile app (Expo)
  - `app/(auth)/` — Login, Register, OTP, Forgot Password screens
  - `app/(tabs)/` — Home, Card, History tabs (main app)
  - `app/(app)/` — Dashboard (Fund Wallet), Sell Gift Card, Confirm Transaction, Card Status, etc.
  - `app/onboarding.tsx` — 6-slide onboarding carousel
  - `context/AuthContext.tsx` — user auth state (AsyncStorage)
  - `assets/images/` — all local image assets
- `artifacts/payvora/` — Payvora mobile app (separate brand)
- `attached_assets/aza_export/` — Figma export reference code
- `attached_assets/design_ref/` — design reference screenshots

## Architecture decisions

- OTP verification (`/(auth)/otp`) is shown after email/password login AND after registration, but NOT after Google/Apple social auth (which goes directly to `/(tabs)`)
- Gift Card button on the home dashboard opens a bottom sheet modal with two tiles: "Sell Gift Card" → `/(app)/sell-gift-card` and "Check Pending" → `/(app)/card-status`
- White background light theme (bg: `#FFFFFF`, text: `#0B0A0A`, accent: `#35C2C1` teal) for AZA app
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

- Expo runs via tunnel (`--tunnel` flag) — use the Expo QR code to preview on a device
- The API server runs on port 8080, not 5000 — `PORT=8080` env var is set
- `/(app)/dashboard.tsx` is named "dashboard" but is actually the Fund Wallet screen
- Social auth (Google/Apple) skips OTP and goes directly to `/(tabs)` — this is intentional

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
- Figma design reference: `attached_assets/aza_export/src/imports/` for screen-level TSX components
- CSS design specs: `attached_assets/Pasted--Gift-card-button-*` and similar pasted text files
