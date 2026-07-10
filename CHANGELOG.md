# Changelog

## 2026-07-10 — Production readiness audit + login/history bug fix

### Fixed
- **Login always returned "Invalid credentials"** — root cause was the Postgres schema never having been pushed to the live database (no `users`/`sessions`/`wallets`/`transactions` tables existed), so every login/register query threw a 500 that the client displayed as a generic credentials error. Fixed by running `pnpm --filter @workspace/db run push-force`.
- **Transaction History showed "Couldn't load latest transactions"** — same root cause as above; resolved once a fresh login/token was issued against the now-existing schema.
- **API server `tsc --noEmit` failing** — `lib/db` and `lib/api-zod` composite TypeScript project references had never been built, so `api-server`'s typecheck couldn't resolve their declaration output. Rebuilt both with `tsc -b --force`.
- **Implicit `any` in `artifacts/api-server/src/routes/wallet.ts`** — added the `Transaction` type from `@workspace/db` to the `.map()` callback.

### Removed
- **`artifacts/landing/`** — a fully orphaned legacy Vite landing page. Verified via full-repo grep that it was not referenced by `.replit` workflows, the Railway build command, or any import anywhere else in the codebase before deleting.
- **Dead static-file-serving branch in `artifacts/api-server/src/app.ts`** — the `IS_PROD` branch tried to serve `artifacts/landing/dist` and catch-all non-API routes to it, but this code path was never reachable in production: Railway's `start.mjs` runs Next.js directly on the public port and only proxies `/api/*` requests to the Express server, so nothing ever routed public traffic to Express's root. Replaced with a plain JSON root response plus a 404 handler for anything else hitting the internal API port.
- Unused `path`/`fileURLToPath` imports in `app.ts` left over from the removed static-serving code.

### Added
- Baseline security headers on the website (`artifacts/website/next.config.ts`): `Strict-Transport-Security`, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`. (A Content-Security-Policy was deliberately **not** added — see `NEXT_AGENT.md` for why.)

### Documented (not code changes)
- Full production-readiness scoring and prioritized issue list — see `NEXT_AGENT.md`.
- Rewrote `PROJECT_STATUS.md`, which had drifted out of sync with the actual codebase (referenced a `packages/db` directory that no longer exists, a Firebase custom-token plan that was never finished, and Railway config details that had since changed).
- Flagged but did not remove: an unused Firebase auth subsystem (`middleware/firebaseAuth.ts`, `useLiveBalance.ts`, unused `sessions` DB table, unused `SESSION_SECRET`) — this looks like an abandoned feature and needs an explicit decision (finish or delete), not a silent removal.

---

## 2026-07-10 (earlier) — Mobile bug fixes

Fixed five reported mobile bugs: Biometrics screen kicking authenticated users back to the tabs, Settings language sublabel not reflecting the actual selection, Transaction History crashing on malformed API data, Settings header alignment, and a placeholder Live Chat screen replaced with a working (backend-less) chat UI. See git history for `artifacts/mobile/app/(auth)/_layout.tsx`, `artifacts/mobile/app/(app)/settings.tsx`, `artifacts/mobile/app/(tabs)/history.tsx`, `artifacts/mobile/app/(app)/help-support.tsx`, `artifacts/mobile/app/(app)/live-chat.tsx`.
