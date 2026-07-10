---
name: DB schema never pushed to actual Postgres instance
description: Symptom is generic auth/API failures (e.g. "Invalid credentials") that are actually 500s from missing tables, not real credential mismatches.
---

`@workspace/db` (Drizzle) defines schema in code but there are no migration files —
schema is synced with `pnpm run push` / `push-force` in `lib/db`. If that push was
never run against the live `DATABASE_URL`, tables like `users` simply don't exist.

**Symptom trap:** login/register routes wrap DB errors and the mobile client's
`apiFetch` catch-all turns *any* thrown error (including a 500 from a missing
table) into a generic UI message like "Invalid credentials. Please try again."
This looks like a credentials/hashing bug but is actually a missing-schema bug.

**How to diagnose:** check API server logs for "Failed query" / "relation ... does
not exist" wrapped Drizzle errors, or just query `information_schema.tables` in the
live DB directly — don't assume `checkDatabase` "ready" means the app's tables
exist, it only confirms the Postgres instance is reachable.

**Fix:** `cd lib/db && pnpm run push-force` against `DATABASE_URL`, then restart the
API server workflow(s). Any accounts "created" while the table was missing were
never actually persisted and must be re-registered.
