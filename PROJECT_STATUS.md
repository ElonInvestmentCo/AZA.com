# PAYVORA — PROJECT STATUS (AI Handoff Document)

> **READ THIS FILE FIRST** before touching any code.
> Update it immediately after every completed task, bug fix, deployment, or architecture change.
> This is the single source of truth for project progress.

---

## Current Status

**Current Phase:** Production Stabilization + Firebase Integration

**Current Task:** Firebase Auth ↔ JWT Auth sync (custom token minting not yet implemented)

**Current Blocker:** Firebase custom tokens require Firebase Admin SDK on the Express API + service account key secret. Not yet implemented.

**Next Task:** Add Firebase Admin SDK to Express API so it mints a Firebase custom token on every JWT login — enabling `useLiveBalance` (Firestore real-time balance) for all users.

**Production Completion:** 88%

**Last Updated:** 2026-07-07

---

## Open Tasks

- [ ] **CRITICAL** — Firebase custom token minting: Express `/api/auth/login` and `/api/auth/register` should also return a `firebaseToken` (minted via Firebase Admin SDK) so the mobile app can call `firebase.auth().signInWithCustomToken(firebaseToken)` and activate `useLiveBalance`
- [ ] Trigger Railway redeploy — user must click "Redeploy" in Railway dashboard (automatic on next GitHub push to `ElonInvestmentCo/AZA.com`)
- [ ] Add SHA-1 fingerprint to Firebase for native Android Google Sign-In (not required for current web-based OAuth flow)
- [ ] Firestore security rules — block direct client writes to `walletBalanceNaira` field
- [ ] Register iOS app in Firebase (only Android registered so far — iOS `GoogleService-Info.plist` was generated but verify `GOOGLE_APP_ID` is correct)
- [ ] Add `GOOGLE_CALLBACK_URL` env var to Railway (needed for web Google OAuth: `https://www.payvora.org/api/auth/google/callback`)
- [ ] Set `NODE_ENV=production` on Railway service if not already set

---

## Architecture Overview

### Monorepo Structure
```
pnpm workspaces (Node 24, TypeScript 5.9)
├── artifacts/api-server/     Express 5 API — port 8080 (dev) / 3001 (prod via start.mjs)
├── artifacts/website/        Next.js 15 + Tailwind v4 — port 5000 (dev) / Railway PORT (prod)
├── artifacts/mobile/         Expo (React Native) — port 19000 (Expo Go)
├── packages/db/              Drizzle ORM + PostgreSQL schema
└── packages/api-spec/        OpenAPI spec + Orval codegen
```

### Production Topology (Railway)
- **Single Railway service** runs `node start.mjs` which spawns:
  - Express API on internal port 3001
  - Next.js on Railway's public PORT
- Next.js rewrites `/api/*` → `http://localhost:3001/api/*`
- Public domain: `www.payvora.org`
- Railway build command: `pnpm install --no-frozen-lockfile && pnpm --filter @workspace/api-server run build && pnpm --filter @workspace/website run build`
- Railway start command: `node start.mjs`
- Healthcheck: `GET /api/status`

### Auth System (Dual — must stay in sync)
1. **JWT Auth** (primary): Express `/api/auth/*` → bcryptjs passwords → JWT tokens → stored in AsyncStorage
2. **Firebase Auth** (secondary, for Firestore real-time): `useLiveBalance` hook subscribes to Firestore `/users/{uid}` — requires `firebase.auth().signInWithCustomToken()` after JWT login. **NOT YET WIRED UP.**

### Database (PostgreSQL + Drizzle ORM)
- Tables: `users`, `sessions`, `wallets`, `transactions`
- All monetary amounts stored in **kobo** (÷100 = naira)
- DB package: `packages/db/`
- Push schema changes: `pnpm --filter @workspace/db run push`

---

## Environment Variables

### Replit (dev + shared)
| Variable | Purpose |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string (auto-managed by Replit) |
| `JWT_SECRET` | Signs/verifies JWT auth tokens |
| `GOOGLE_CLIENT_ID` | Google OAuth (server-side) |
| `GOOGLE_CLIENT_SECRET` | Google OAuth (server-side) |
| `GOOGLE_IOS_URL_SCHEME` | `com.googleusercontent.apps.419400712274-...` |
| `RELOADLY_CLIENT_ID` | Reloadly bill payments + eSIM |
| `RELOADLY_CLIENT_SECRET` | Reloadly bill payments + eSIM |
| `RAILWAY_TOKEN` | Railway API token (user: laurabrady281@gmail.com) |

### Railway (production — must be set in Railway dashboard)
| Variable | Status | Value |
|---|---|---|
| `NODE_ENV` | Required | `production` |
| `DATABASE_URL` | Auto-provided | PostgreSQL from Railway |
| `PORT` | Auto-provided | Dynamic |
| `JWT_SECRET` | Required | Same as Replit secret |
| `GOOGLE_CLIENT_ID` | Required | Same as Replit secret |
| `GOOGLE_CLIENT_SECRET` | Required | Same as Replit secret |
| `GOOGLE_CALLBACK_URL` | **Required** | `https://www.payvora.org/api/auth/google/callback` |
| `RELOADLY_CLIENT_ID` | Required | Same as Replit secret |
| `RELOADLY_CLIENT_SECRET` | Required | Same as Replit secret |
| `FIREBASE_SERVICE_ACCOUNT_JSON` | **Pending** | Firebase Admin SDK service account (needed for custom tokens) |

---

## Firebase Configuration

| Item | Status |
|---|---|
| Firebase project ID | `payvora-2026` |
| Project number | `361130131715` |
| Android app registered | ✅ `com.payvora.mobile` — `google-services.json` in `artifacts/mobile/` |
| iOS app registered | ✅ `com.payvora.mobile` — `GoogleService-Info.plist` in `artifacts/mobile/` |
| `app.json` wired | ✅ `googleServicesFile` set for both platforms |
| Google Sign-In provider | ✅ Enabled in Firebase Auth console |
| SHA-1 fingerprint (Android) | ❌ Not added — needed for native Google Sign-In |
| Firestore rules | ❌ Default (open) — needs hardening |
| Firebase Admin SDK (server) | ❌ Not implemented |

---

## Known Bugs

| Bug | Severity | Status | File |
|---|---|---|---|
| Google OAuth callback 500 (`logger is not defined`) | HIGH | ✅ Fixed in code, **pending Railway redeploy** | `artifacts/api-server/src/routes/auth.ts:323` |
| `useLiveBalance` returns null for all JWT-auth users | MEDIUM | Known — Firebase Auth not signed in | `artifacts/mobile/hooks/useLiveBalance.ts` |
| Firebase magic-link tab removed from login | LOW | ✅ Fixed — password-only login now | `artifacts/mobile/app/(auth)/login.tsx` |

---

## Completed Features

- [x] Onboarding (6-slide carousel)
- [x] Auth: email/password login + registration + OTP
- [x] Auth: Google OAuth (web-based, mobile WebBrowser)
- [x] Auth: Apple Sign-In
- [x] JWT session management (AsyncStorage)
- [x] Home dashboard (wallet balance, quick actions, services grid)
- [x] Gift card trading (sell flow, pending card status)
- [x] Fund wallet (bank selection, amounts)
- [x] Transaction history
- [x] Bill payments (Reloadly integration)
- [x] Virtual dollar card screen
- [x] eSIM screen
- [x] Next.js 15 marketing website
- [x] Google OAuth website routes (`/api/auth/google`, `/api/auth/google/callback`)
- [x] Firebase config files placed in mobile app

---

## Partially Completed Features

- [ ] **Real-time wallet balance** — `useLiveBalance` hook is Firebase Firestore-ready but Firebase Auth is not signed in after JWT login. Needs custom token minting.
- [ ] **Google OAuth native Android** — web OAuth works; native needs SHA-1 fingerprint in Firebase
- [ ] **Production deployment** — code is correct, Railway has NOT been redeployed yet after the `logger` fix

---

## API Routes (Express)

| Route | Method | Auth | Description |
|---|---|---|---|
| `/api/status` | GET | None | Health check |
| `/api/auth/register` | POST | None | Register with email/password |
| `/api/auth/login` | POST | None | Login → returns JWT |
| `/api/auth/me` | GET | JWT | Get current user + wallet |
| `/api/auth/google` | GET | None | Start Google OAuth web flow |
| `/api/auth/google/callback` | GET | None | Google OAuth callback → JWT |
| `/api/auth/apple` | POST | None | Apple Sign-In → JWT |
| `/api/bills/*` | Various | JWT | Reloadly bill payments |
| `/api/esim/*` | Various | JWT | Reloadly eSIM |

---

## Deployment History

------------------------------------------------------------

Date: 2026-07-07
AI Model: Claude (Replit Agent)
Branch: main
Commit: d802696c1e85c21bc01ab1ae0fa138e8024f08a0

Completed:
- Removed Firebase magic-link login from `artifacts/mobile/app/(auth)/login.tsx` (was crashing on module load — no Firebase config existed)
- Restored `useLiveBalance.ts` to original Firebase Firestore real-time version (user requested)
- Placed `artifacts/mobile/google-services.json` (Android Firebase config)
- Placed `artifacts/mobile/GoogleService-Info.plist` (iOS Firebase config)
- Updated `artifacts/mobile/app.json` with `googleServicesFile` for both iOS and Android
- Fixed Google OAuth callback 500 crash: `logger.error` at line 323 of `auth.ts` wrapped in try/catch with `console.error` fallback — production was crashing with `ReferenceError: logger is not defined`
- Fixed `railway.toml` build command: removed stale `pnpm --filter payvora-landing run build` (package doesn't exist; correct name is `@workspace/website`)
- Rebuilt API server — compiles clean (3.2mb bundle)

Currently Working On:
- (Idle — awaiting user direction)

Next Immediate Task:
- Firebase Admin SDK + custom token minting on JWT login routes
- Railway redeploy (user action required: click Redeploy in Railway dashboard)

Pending Tasks:
- Firebase custom token: add `FIREBASE_SERVICE_ACCOUNT_JSON` secret → mint token in `/api/auth/login`, `/api/auth/register`, `/api/auth/google/callback`
- Firestore security rules (block direct client writes to walletBalanceNaira)
- SHA-1 fingerprint for Android native Google Sign-In
- iOS app bundle ID verification (app.json says `com.payvora.mobile`, memory says `org.payvora.app` — confirm correct one)

Known Bugs:
- Google OAuth callback 500 — FIXED IN CODE, not yet deployed to Railway
- useLiveBalance returns null for all users (Firebase Auth not active)

Blockers:
- Railway redeploy requires user action (Railway API token doesn't have project list access via GraphQL)
- Firebase custom tokens require Firebase Admin service account JSON (not yet in secrets)

Files Modified:
- artifacts/mobile/app/(auth)/login.tsx
- artifacts/mobile/hooks/useLiveBalance.ts
- artifacts/mobile/google-services.json (new)
- artifacts/mobile/GoogleService-Info.plist (new)
- artifacts/mobile/app.json
- artifacts/api-server/src/routes/auth.ts
- railway.toml

Environment Variables Added/Changed:
- None added this session (RAILWAY_TOKEN, GOOGLE_IOS_URL_SCHEME confirmed present)

Database Changes:
- None

API Changes:
- GET /api/auth/google/callback — no longer crashes on logger error; gracefully redirects to mobile://auth?error=... on failure

Deployment Changes:
- railway.toml build command fixed (removed payvora-landing)
- Pending: Railway redeploy needed to apply auth.ts fix

Testing Status:
✅ API server builds clean
✅ All 5 Replit workflows running
⚠ Google OAuth callback fix not yet live on Railway (needs redeploy)
⚠ Firebase real-time balance (useLiveBalance) not tested end-to-end

Production Ready:
NO — Google OAuth callback 500 still live on Railway until redeploy

Notes:
- The RAILWAY_TOKEN in Replit secrets is a valid user token (user: laurabrady281@gmail.com, id: b15490da-dd4c-4b11-998a-e498f2cd0ea9) but `me { projects }` GraphQL query returns empty — projects may be under a workspace/team. Railway CLI also rejects it. User must trigger redeploy manually from Railway dashboard.
- Firebase project: payvora-2026 / project number 361130131715
- Google webClientId in app.json: 419400712274-vioi4kdk4gg41ufsm2brjgtqmr8q2agq.apps.googleusercontent.com

------------------------------------------------------------
