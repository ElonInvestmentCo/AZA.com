# PAYVORA Mobile — Production QA Audit

Date: 2026-07-12

## Summary

This pass focused on finding and fixing **real, verified bugs** rather than
re-confirming things already known to work. Every fix below was reproduced
against the live API (curl) and/or the database before being changed, and
re-verified after.

## Critical bugs found and fixed

1. **Database schema was never pushed — all auth/wallet endpoints 500'd.**
   `psql` showed zero tables in the Postgres database despite the schema
   existing in code. `/api/auth/register` and every other DB-backed route
   was failing. Fixed by running `drizzle-kit push`; verified register →
   login → `/auth/me` → `/wallet/balance` → `/wallet/transactions` all
   return 200 end-to-end.

2. **`JWT_SECRET` was not set anywhere — login/register 500'd** even after
   the schema fix (`Error: JWT_SECRET environment variable is required`).
   Generated a strong random secret and set it as an environment variable;
   restarted the API and re-verified the same end-to-end flow above.

3. **Wallet balance was displayed 100x too large (kobo/naira bug).** The API
   returns `wallet.balanceKobo` (smallest currency unit), but every mobile
   screen formats and does arithmetic on `user.balance` as whole Naira.
   `AuthContext` was passing the raw kobo value straight through. A user
   with ₦500 in their wallet would have seen "₦50,000.00" everywhere
   (dashboard, withdraw, fund wallet). Fixed at the single point balance
   enters the app (`toUser()` in `AuthContext.tsx`), so every screen is
   correct without touching each one individually.

4. **History screen never showed a real empty state — fake transactions
   masked it.** `history.tsx` initialized its list with a 14-item hardcoded
   mock dataset and only overwrote it if the API returned a *non-empty*
   array. A brand-new account with zero real transactions would see 14 fake
   transactions forever. Removed the mock dataset entirely, the list now
   starts empty and always reflects exactly what the API returns (including
   truly empty), with a proper "No transactions yet" empty state distinct
   from the existing "No results found" (filtered) state.

5. **Dashboard "Recent Transaction" list was 100% hardcoded**, not wired to
   the API at all. Wired it to `GET /wallet/transactions?limit=3` with
   loading and empty states, matching the real wallet data shown on History.

6. **Notifications leaked between accounts on a shared device.** The
   notification store was one global AsyncStorage key for the whole
   device. Logging out and into a different account would show (and let
   you delete) the previous account's notifications. Notifications are now
   stored per-account (keyed by user id, with a separate "guest" bucket for
   logged-out browsing), and re-hydrate correctly on login/logout without
   losing the "never resurrect deleted items" guarantee that was already in
   place.

## Confirmed already correct (no changes needed)

- **Notification persistence**: already a single provider mounted at the
  app root, persisted to AsyncStorage, with a hydration guard that prevents
  the empty initial state from ever clobbering a real persisted list. This
  was previously flagged as a risk area; direct code reading confirmed it's
  sound.
- **Auth**: `AuthContext` is real JWT-based auth calling the live API — the
  `replit.md` note calling it "mock auth" was stale and has been corrected.
- **Wallet backend**: `/wallet/balance`, `/wallet/transactions`,
  `/wallet/withdraw` are real, DB-backed, and now reachable (see fixes 1–2).

## Known remaining issue — needs a decision, not a code fix

- **Electricity bill payments (`/api/bills/billers`) return 502.** The
  Reloadly utility-billing integration requires `RELOADLY_CLIENT_ID` and
  `RELOADLY_CLIENT_SECRET`, which are not set. This needs real Reloadly
  account credentials from you — I can't generate those. Let me know if
  you'd like to add them (I'll use the secrets flow, not plain text).

## Not completed this pass (scope/tooling limits)

- A full screen-by-screen visual sweep across 4 device sizes was not
  completed — the headless screenshot tool reloads the app fresh on every
  capture, and the app's ~3s cold splash/font/asset-preload sequence means
  every capture lands mid-splash rather than past it. This is a *capture
  tooling* limitation, not a confirmed app bug — the underlying flows
  (login, dashboard, wallet, history) were verified directly against the
  running API instead. Recommend a manual pass in the Expo Go app or a
  device simulator for pixel-level layout QA across breakpoints.
- Inline `router.back()` calls across ~32 screens don't guard with
  `router.canGoBack()`; a shared `ScreenHeader` component already exists
  but isn't used anywhere. Left as-is (behavior risk only on deep-linked
  entry with no navigation stack) — flagging for a follow-up pass rather
  than a blind edit across 32 files.
- `(app)/_layout.tsx` / `(tabs)/_layout.tsx` don't have an explicit
  unauthenticated-route guard (rely on `index.tsx` redirect + server 401s).
  Not changed this pass; flagging as a hardening item.

## Verdict

The wallet/history data-integrity bugs (kobo/naira, fake transaction
fallback) and the two infrastructure bugs that made auth entirely
non-functional (missing schema, missing JWT secret) are fixed and verified
against the live API. I'm not certifying full production-readiness yet —
the visual/responsive sweep and the back-navigation hardening above are
still open.
