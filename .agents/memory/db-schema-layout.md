---
name: DB schema layout
description: Payvora Postgres schema — table list, amount convention, indexes, known gaps.
---

# DB Schema Layout

## Tables (lib/db/src/schema/)
| File | Table | Notes |
|---|---|---|
| users.ts | users | email unique, authProvider (email/oauth), googleId, appleId |
| sessions.ts | sessions | token plaintext unique — hash before storing in real auth |
| wallets.ts | wallets | userId unique (one wallet per user); balanceKobo (÷100 = NGN) |
| transactions.ts | transactions | enums: tx_type, tx_status, tx_category; amountKobo |

## Amounts
All monetary amounts stored as integers in kobo (smallest NGN unit). Divide by 100 for display.

## Indexes
- `sessions_user_id_idx` on sessions.user_id
- `transactions_user_id_idx` on transactions.user_id
- `transactions_created_at_idx` on transactions.created_at
- wallets.userId has implicit index from `.unique()`

## Known gaps to fix before real auth
- sessions.token should be hashed (bcrypt/SHA-256) — current schema stores raw token
- No email verification or password reset table yet

## DB init
- `lib/db/src/index.ts` exports `db`, `pool`, and all schema
- `artifacts/api-server/src/lib/db.ts` exports `initDb()` — called at startup, aborts if DB unreachable
- API server does NOT yet import db in any route — routes are still Reloadly-only proxies

**Why:** try/finally in initDb() ensures pool.connect() client is always released even if SELECT 1 throws.
