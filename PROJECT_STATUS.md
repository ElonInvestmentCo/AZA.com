# PAYVORA — PROJECT STATUS (AI Handoff Document)

> **READ THIS FILE FIRST** before touching any code.
> Update it immediately after every completed task, bug fix, deployment, or architecture change.
> This is the single source of truth for project progress.

---

## Current Status

**Current Phase:** Production readiness audit + core auth stabilization

**Production Completion:** ~80% (see Production Readiness Report in `NEXT_AGENT.md` for the scored breakdown)

**Last Updated:** 2026-07-10

**This file was out of date** as of the previous entry (referenced `packages/db`, a Firebase custom-token plan, and `railway.toml` fixes that no longer match the codebase). It has been rewritten below to match what is actually in the repo today.

---

## What Was Just Fixed (this session)

1. **Login always failed with "Invalid credentials"** — the Postgres schema had never been pushed to the live `DATABASE_URL` (no `users`/`sessions`/`wallets`/`transactions` tables existed). Every login/register DB query threw a 500, which the mobile client's generic error handling displayed as "Invalid credentials." Fixed by running `pnpm --filter @workspace/db run push-force`. **Any accounts created before this fix were never actually persisted — those users must register again.**
2. **Transaction History "Couldn't load latest transactions" banner** — same root cause; stale/invalid tokens issued before the schema existed now fail auth cleanly. Resolved by re-logging in.
3. Five mobile bugs fixed: Biometrics kicked authenticated users back to the tabs (auth-group redirect guard didn't exempt `face-id`), Settings language sublabel didn't reflect the actual stored language, History tab crashed on malformed `createdAt`/amount/note fields from the API, Settings header could misalign (now absolutely centered), Live Chat was a placeholder alert (now a real, if backend-less, chat screen).
4. **Production audit fixes:**
   - Removed dead code in `artifacts/api-server/src/app.ts` that tried to serve a static site from `artifacts/landing/dist` in production — this path was never reachable (Railway's `start.mjs` runs Next.js directly and only proxies `/api/*` to Express; nothing routes public traffic to the Express server's root).
   - Deleted `artifacts/landing/` entirely — a fully orphaned legacy Vite landing page, not referenced by any workflow, the Railway build command, or any other code. Verified via full-repo grep before removal.
   - Added baseline security headers (HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy) via `next.config.ts` `headers()`.
   - Fixed stale TypeScript project-reference build outputs (`lib/db`, `lib/api-zod` composite `dist/` was never built, breaking `tsc --noEmit` in `api-server`) and an implicit-`any` in `wallet.ts`.
   - `api-server` typecheck, `website` typecheck + production build all pass clean.

---

## Architecture Overview

### Monorepo Structure
```
pnpm workspaces (Node 20, TypeScript 5.9)
├── artifacts/api-server/     Express 5 API — port 8080 (dev workflow) / 3001 (prod, internal only)
├── artifacts/website/        Next.js 15 + Tailwind v4 — port 5000 (dev) / Railway PORT (prod, public)
├── artifacts/mobile/         Expo (React Native) — port 19000 (Expo Go)
├── artifacts/mockup-sandbox/ Canvas component-preview sandbox (design tool only, not shipped)
├── lib/db/                   Drizzle ORM + PostgreSQL schema (source-only package, no build step needed at runtime)
├── lib/api-zod/              Shared Zod schemas
├── lib/api-client-react/     Generated API client
└── lib/api-spec/             OpenAPI spec
```
Note: `lib/` was previously called `packages/` in older docs — the directory was renamed at some point; always check the actual filesystem, not old docs.

### Production Topology (Railway)
- Single Railway service runs `node start.mjs`, which spawns:
  - Express API on internal port 3001 (never exposed directly to the internet)
  - Next.js on Railway's public `PORT`
- Next.js `rewrites()` in `artifacts/website/next.config.ts` proxy `/api/*` → `http://localhost:3001/api/*`
- Public domain: `www.payvora.org`; `payvora.org` 301-redirects to it (`next.config.ts` `redirects()`)
- Railway build command (`railway.toml`): `pnpm install --no-frozen-lockfile && pnpm --filter @workspace/api-server run build && pnpm --filter @workspace/website run build`
- Healthcheck: `GET /api/status`

### Auth System
- **JWT auth is the only active auth system**: Express `/api/auth/*` routes, bcryptjs password hashing, JWT signed with `JWT_SECRET`, stored client-side in AsyncStorage (mobile) via `context/AuthContext.tsx`.
- Google Sign-In (mobile accessToken + web OAuth redirect flow) and Apple Sign-In are both wired to the same JWT issuance path.
- **Dead/unused code found during this audit (not removed, flagged for a decision):**
  - `artifacts/api-server/src/middleware/firebaseAuth.ts` — a Firebase Admin auth middleware that is never imported/mounted anywhere.
  - `artifacts/mobile/hooks/useLiveBalance.ts` — a Firestore real-time balance hook that is never imported anywhere in `app/`.
  - `SESSION_SECRET` — an available secret that is not referenced by any code.
  - `sessionsTable` in `lib/db/src/schema/sessions.ts` — table exists in the DB but no route ever reads/writes it.
  - These look like remnants of an earlier, abandoned Firebase-based real-time balance feature. Decide whether to finish wiring it up or delete it — do not silently delete a whole subsystem without confirming intent first.

### Database (PostgreSQL + Drizzle ORM)
- Tables: `users`, `sessions` (unused, see above), `wallets`, `transactions`
- All monetary amounts stored in **kobo** (÷100 = naira)
- Schema lives in `lib/db/src/schema/`; push changes with `pnpm --filter @workspace/db run push` (or `push-force`)
- **No migration files** — schema is synced directly via `drizzle-kit push`, not versioned migrations. If a fresh `DATABASE_URL` is ever provisioned, someone must remember to run the push command, or every DB-backed route will 500.

---

## Environment Variables (as actually used in code — verified by grep, 2026-07-10)

| Variable | Used by | Status |
|---|---|---|
| `DATABASE_URL` | `lib/db` | Set (Replit-managed) |
| `JWT_SECRET` | `artifacts/api-server/src/lib/jwt.ts` | Set |
| `GOOGLE_CLIENT_ID` | Google OAuth (mobile + web) | Set |
| `GOOGLE_CLIENT_SECRET` | Google OAuth (web redirect flow) | Set |
| `GOOGLE_CALLBACK_URL` | Web OAuth redirect client construction | Not confirmed set in this environment — required for the web OAuth flow to work at all; without it `makeWebOAuthClient()` returns null and `/api/auth/google` 503s |
| `RELOADLY_CLIENT_ID` / `RELOADLY_CLIENT_SECRET` | Bill payments / eSIM (`lib/reloadly.ts`) | Set |
| `FIREBASE_SERVICE_ACCOUNT` | Only `middleware/firebaseAuth.ts` (unused, see above) | Set but effectively unused |
| `SESSION_SECRET` | Nothing references it | Set but unused — safe to leave, but do not rely on it for anything |
| `EXPO_PUBLIC_API_URL` / `EXPO_PUBLIC_DOMAIN` | Mobile API base URL resolution | Configured per environment |
| `CORS_ALLOWED_ORIGINS` / `ALLOWED_ORIGINS` | `app.ts` CORS allow-list | Optional, additive |
| `GOOGLE_SITE_VERIFICATION` | Website `<head>` meta | Optional |
| `LOG_LEVEL`, `NODE_ENV` | Standard | Set by workflow/deploy config |

**Action item:** confirm `GOOGLE_CALLBACK_URL` is set in the Railway production environment and that it exactly matches the redirect URI registered in Google Cloud Console (`https://www.payvora.org/api/auth/google/callback`).

---

## API Routes (Express, all under `/api`)

| Route | Method | Auth | Description |
|---|---|---|---|
| `/status` | GET | None | Health check |
| `/auth/register` | POST | None | Register with email/password |
| `/auth/login` | POST | None | Login → JWT |
| `/auth/me` | GET | JWT | Current user + wallet |
| `/auth/logout` | POST | JWT | No-op (stateless JWT) |
| `/auth/google` | GET/POST | None | Web redirect flow / mobile accessToken exchange |
| `/auth/google/callback` | GET | None | OAuth callback → JWT → deep link |
| `/auth/apple` | POST | None | Apple Sign-In → JWT |
| `/auth/forgot-password` | POST | None | Sends OTP (dev: logged to console, no real email provider wired up) |
| `/auth/verify-otp`, `/auth/reset-password` | POST | None | Password reset flow |
| `/wallet/balance`, `/wallet/transactions`, `/wallet/withdraw` | GET/POST | JWT | Wallet operations |
| `/bills/*` | Various | JWT | Reloadly bill payments |

---

## Known Gaps / Not Yet Production Ready

- **Forgot-password OTP has no real email delivery** — codes are only logged to the server console outside of `NODE_ENV=production`. In production, users currently cannot actually receive their reset code. This needs a transactional email provider (SendGrid/Resend/etc.) before password reset is usable in production.
- **No automated tests** — no unit or integration test suite exists in `api-server`, `website`, or `mobile`. Build health today relies solely on typecheck + build passing.
- **CSP not configured** — HSTS/X-Frame-Options/etc. were added this session, but no Content-Security-Policy header exists yet; adding one requires auditing every inline script/style the site uses first to avoid breaking it.
- **Rate limiting** — no rate limiting on `/api/auth/login`, `/api/auth/register`, or OTP endpoints. Recommend adding before public launch to prevent brute-force/credential-stuffing and OTP-spam.
- **Firebase subsystem is half-built and unused** (see Auth System section above) — needs an explicit decision to finish or remove.

See `NEXT_AGENT.md` for the full scored production-readiness report and prioritized next steps.

---

## Fresh Import / Environment Bootstrap (2026-07-12)

A fresh re-import of this repl wipes `node_modules` and every package's build
output (`dist/`, `.next/`, Metro cache) since those are gitignored, so the
"PayVora Website", "API Server", and "artifacts/mobile: expo" workflows will
fail immediately after import with errors like `next: not found` or a
missing `artifacts/api-server/dist/index.mjs`. This is expected, not a
regression — re-run the bootstrap below (also see `scripts/setup.sh`):

1. `pnpm install` — relinks all workspace packages from the pnpm store
   (fast if the store cache is warm; the lockfile is never modified).
2. `pnpm --filter @workspace/api-server run build` — regenerates
   `artifacts/api-server/dist/index.mjs`, which the root **API Server**
   workflow (`PORT=3001 node ... ./artifacts/api-server/dist/index.mjs`)
   runs directly instead of building itself.
3. Restart the **API Server** workflow once the build above exists.
   **PayVora Website** and **artifacts/mockup-sandbox: Component Preview
   Server** run `next dev` / `vite dev` directly and do not need a
   pre-build step — just restart them.
4. **artifacts/mobile: expo** can fail with
   `Port 19000 is running this app in another window` /
   `ERR_PNPM_RECURSIVE_RUN_FIRST_FAIL` even right after import. This is a
   stale Expo process left over from an earlier partial start still holding
   port 19000 (`lsof -i :19000` will show a `node .../expo/bin/cli` process).
   Kill it (`kill -9 <pid>` for the process bound to port 19000, and any
   parent `pnpm exec expo`/`sh -c` processes from the same failed launch),
   then restart the workflow — Expo's CLI runs `CI=1` (non-interactive) so
   it refuses to auto-pick a fallback port and exits instead of retrying.
5. Note there are two independent API server workflows —
   **API Server** (root, pre-built, port 3001, what the website proxies to)
   and **artifacts/api-server: API Server** (runs its own `pnpm run dev`,
   which builds+starts itself) — both can run simultaneously without
   conflict since they bind different ports, but see the open follow-up
   task about consolidating them.

Validated working end-to-end on 2026-07-12: `pnpm install` completed
("Already up to date"), `pnpm --filter @workspace/api-server run build`
produced `dist/index.mjs`, and all five workflows (`PayVora Website`,
`API Server`, `artifacts/mockup-sandbox: Component Preview Server`,
`artifacts/mobile: expo`, `artifacts/api-server: API Server`) came up
`RUNNING` with no errors in their logs.
