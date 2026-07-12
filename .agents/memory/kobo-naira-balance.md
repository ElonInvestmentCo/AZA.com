---
    name: Kobo vs Naira balance conversion
    description: PAYVORA wallet balance is stored/returned in kobo; the mobile app must convert to Naira exactly once, at the AuthContext boundary.
    ---

    `GET /wallet/balance` and the wallet object nested in `/auth/me` return
    `balanceKobo` (smallest currency unit — 100 kobo = ₦1). Every mobile screen
    (dashboard, withdraw, fund wallet, etc.) formats and does arithmetic on
    `user.balance` assuming it is already whole Naira (parses input as Naira,
    formats with `toLocaleString`, sends `amountNaira` to the withdraw
    endpoint).

    **Why:** converting per-screen is how this bug happened in the first place
    — it's easy to wire one more screen to the raw kobo value and get a
    balance that's 100x too large.

    **How to apply:** the one and only place kobo should become Naira is
    `toUser()` in `context/AuthContext.tsx` (divide `balanceKobo` by 100 when
    building the `User` object). Every downstream screen must keep treating
    `user.balance` as Naira. If you add a new balance-reading endpoint, do the
    same conversion at its single entry point rather than in the UI.
    