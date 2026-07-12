# PAYVORA

A Nigerian fintech platform for gift card trading, bill payments, airtime, and virtual dollar cards. pnpm monorepo: Next.js website, Express API, Expo mobile app.

For day-to-day run commands and environment setup, see [`replit.md`](./replit.md). For the detailed audit history, known gaps, and AI-handoff notes, see [`PROJECT_STATUS.md`](./PROJECT_STATUS.md).

## Architecture status (as of 2026-07-12)

- **Website** (`artifacts/website`, Next.js 15) — builds and typechecks clean; renders correctly.
- **API** (`artifacts/api-server`, Express 5) — builds and typechecks clean; healthy at `/api/status`.
- **Mobile** (`artifacts/mobile`, Expo) — Metro bundler starts clean; packager reachable.
- **Mockup sandbox** (`artifacts/mockup-sandbox`) — dev-only design preview tool, not shipped; runs clean, but see known limitations below.
- Dev workflows consolidated to one workflow per service (previous duplicate API server workflow removed; see `PROJECT_STATUS.md`).

## Known limitations

- **No transactional email provider** — forgot-password OTP codes are only logged server-side outside of production; users cannot receive real reset codes in production yet.
- **No automated test suite** — build health relies on typecheck + build passing, not tests.
- **No rate limiting** on auth/OTP endpoints.
- **`mockup-sandbox` typecheck fails** on a workspace-wide `@types/react` version conflict between `artifacts/mobile`'s React Native dependency tree and the shared pnpm catalog. Does not affect shipped code (website/api-server typecheck clean); left unfixed because any fix touches shared/production dependency resolution — see `PROJECT_STATUS.md` for details.
- **`sessions` DB table is defined but unused** — auth is fully stateless JWT; no route reads or writes it. Flagged as dead code, not yet removed.
- **Firebase-based real-time balance subsystem is half-built and unused** (`firebaseAuth.ts` middleware, `useLiveBalance.ts` hook) — needs an explicit decision to finish or delete.

## Production readiness checklist

- [x] Website builds in production mode and prerenders all routes
- [x] API builds, starts, and passes its health check
- [x] Mobile app bundles and serves via Expo
- [x] Core typecheck (website, api-server) passes clean
- [x] Auth (JWT, Google, Apple) wired end-to-end
- [x] Baseline security headers (HSTS, X-Frame-Options, etc.)
- [ ] Transactional email for password-reset OTP
- [ ] Rate limiting on auth/OTP endpoints
- [ ] Content-Security-Policy header
- [ ] Automated test suite
- [ ] Decision on Firebase real-time-balance subsystem (finish or remove)
- [ ] Decision on unused `sessions` table (remove or wire up with hashed tokens)

See `PROJECT_STATUS.md` → "Known Gaps / Not Yet Production Ready" and "Final Cleanup Pass" for full detail.
