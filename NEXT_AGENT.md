# NEXT AGENT — Production Readiness Report (2026-07-10)

This is the output of a full-repo production audit + fix pass. Read `PROJECT_STATUS.md` first for current architecture and what changed this session; this file is the scored report and prioritized backlog.

## Production Score: 62/100

Scores below are honest estimates based on direct code/config inspection — not guesses. "N/A (not audited)" means the check genuinely requires tools/access this session didn't have (live DNS, live SSL cert, Google Cloud Console, Railway dashboard).

| Category | Score | Notes |
|---|---|---|
| Security | 55/100 | JWT + bcrypt auth is solid; CORS is origin-restricted in prod. Missing: CSP, rate limiting, plaintext session tokens in an unused table, no CSRF protection (mitigated somewhat by Bearer-token-only auth, not cookies) |
| Performance | 65/100 | Next.js static generation for marketing pages is fast; API queries are simple indexed lookups. Not measured: real API latency under load, bundle size deep-dive |
| Accessibility | Not audited | No screen-reader/contrast/keyboard-nav pass was done this session |
| SEO | 60/100 | robots.txt + sitemap.xml + Open Graph metadata present on website; not verified against Google Search Console |
| PWA | Not audited | No manifest.json/service-worker audit performed for the website; mobile is a native Expo app, not a PWA |
| Code Quality | 70/100 | One fully orphaned app removed (`artifacts/landing`), one dead code path removed, typecheck clean across `api-server` and `website`. An entire unused Firebase auth subsystem still exists (flagged, not removed) |
| Architecture | 75/100 | Clean monorepo split, single Railway process spawning API + Next.js is a sound pattern, schema-as-code via Drizzle push works but has no migration history |
| Deployment Readiness | 55/100 | Builds pass; forgot-password has no real email delivery in production; `GOOGLE_CALLBACK_URL` not confirmed set in Railway |

## Critical Issues

1. **Password reset does not work in production.** OTP codes are only `console.log`'d when `NODE_ENV !== "production"`. In production there is no email provider wired up, so a user who requests a reset code will never receive it. Needs a transactional email integration before launch.
2. **No rate limiting on auth endpoints.** `/auth/login`, `/auth/register`, `/auth/forgot-password`, `/auth/verify-otp` all accept unlimited requests — brute-force and OTP-guessing are both currently unmitigated.
3. **`GOOGLE_CALLBACK_URL` not confirmed present in the Railway production environment.** Without it, `/api/auth/google` (the web OAuth start route) 503s. Must be verified in the Railway dashboard and matched exactly against the Google Cloud Console redirect URI.

## High Priority

4. **No automated tests anywhere in the repo** (api-server, website, mobile). Every fix this session and last session was verified by manual curl/tsc/build checks, not a test suite. Recommend at minimum: auth route integration tests (register/login/me) and a smoke test for `/api/wallet/*`.
5. **Unused Firebase auth subsystem** (`middleware/firebaseAuth.ts`, `useLiveBalance.ts`, `sessions` table, `SESSION_SECRET`, `FIREBASE_SERVICE_ACCOUNT`) — dead code sitting in the codebase. Either finish wiring it up (real-time Firestore balance) or delete it; leaving it half-built creates maintenance confusion and one more thing to secure.
6. **No CSP header.** HSTS/X-Frame-Options/X-Content-Type-Options/Referrer-Policy/Permissions-Policy were added this session in `artifacts/website/next.config.ts`. A Content-Security-Policy was intentionally not added without first auditing every inline `<script>`/style the site relies on — doing that blind risks breaking the site in production with no easy rollback path visible from code alone.

## Medium Priority

7. **DB schema has no migration history** — it's pushed directly via `drizzle-kit push`. This already caused the login bug fixed last session (schema was simply never pushed to the live DB). Consider switching to versioned migrations (`drizzle-kit generate` + `migrate`) so schema drift is visible and auditable, especially before this app handles real money.
8. **Notifications/Transaction History UX** — current History screen shows a flat list with pull-to-refresh and an error/retry state (verified in code), but does not yet do date-grouping, a status timeline per transaction, receipt download, or advanced filters/export as described in the "premium banking app" bar. Scope this as a real design/build task if wanted, not a quick fix.
9. **Domain/SSL/HTTPS enforcement** — could not be verified this session (no access to live DNS or the Railway custom-domain SSL dashboard). `next.config.ts` handles the `payvora.org` → `www.payvora.org` redirect in-app, but HTTPS enforcement and certificate validity are controlled by Railway's edge, not app code — confirm directly in the Railway dashboard.

## Low Priority

10. `SESSION_SECRET` secret exists but nothing reads it — harmless, but worth removing once the Firebase-subsystem decision (#5) is made, since it may have been provisioned for that.
11. `artifacts/mockup-sandbox` is a design tool, not shipped — confirmed intentional, no action needed.

## What Was Verified Clean This Session

- `artifacts/api-server` — `tsc --noEmit` passes, `pnpm run build` (esbuild) passes.
- `artifacts/website` — `tsc --noEmit` passes (via `next build`'s built-in type check), `NODE_ENV=production next build` passes, generates 27 routes successfully.
- Full-repo grep for duplicate/orphaned apps found and removed exactly one: `artifacts/landing` (a legacy Vite landing page, not referenced by `.replit`, the Railway build command, or any import anywhere in the codebase — verified before deletion).
- CORS configuration in `app.ts` is origin-restricted in production (allow-lists `www.payvora.org`, `payvora.org`, Replit dev domains, plus `CORS_ALLOWED_ORIGINS`/`ALLOWED_ORIGINS` env overrides) and open in development — this is correct and intentional, not a bug.
- Auth flow (register → login → `/auth/me` → `/wallet/transactions`) tested end-to-end against the live dev database with curl; all return correct 2xx responses with a freshly created account.

## Not Audited This Session (needs live access this agent didn't have)

- Live SSL certificate validity/chain, HSTS preload list status
- Google Cloud Console redirect URI configuration (can only check what the code expects, not what's registered)
- Railway dashboard environment variables (only Replit secrets were checked directly)
- Lighthouse/PWA/accessibility scores
- App Store / Google Play submission readiness (icons, screenshots, store listing copy, privacy policy URL wiring — website has a `/privacy-policy` route but store-listing-specific requirements weren't checked)

## Recommended Next Steps, In Order

1. Confirm `GOOGLE_CALLBACK_URL` in Railway matches Google Cloud Console exactly (5 min, unblocks web Google Sign-In in prod if it's currently broken).
2. Wire up a real email provider for password-reset OTPs (blocks a real user-facing feature from working at all in prod).
3. Add basic rate limiting to auth endpoints (e.g. `express-rate-limit`, keyed by IP + email).
4. Decide: finish or delete the unused Firebase real-time-balance subsystem.
5. Move DB schema management from `push`/`push-force` to versioned migrations before more schema changes accumulate.
