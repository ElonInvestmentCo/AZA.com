---
name: Reloadly Utility Payments API integration
description: Required Accept header and merchant account biller availability caveat for Reloadly's utility bill payment product
---

The Utility Payments API (`utilities.reloadly.com` / `utilities-sandbox.reloadly.com`) is a
separate product from Topups/Airtime — it requires its own OAuth audience/token AND a
versioned Accept header on every request: `application/com.reloadly.utilities-v1+json`.
Plain `application/json` or `*/*` will 406 with an empty body (topups API doesn't have
this requirement in the same way, which makes the failure easy to miss when copying
patterns from the topups client).

**Why:** Discovered while wiring bill payment screens — GET /billers silently returned
406 with no error detail until the versioned Accept header was set.

**How to apply:** Any new Reloadly utility endpoint call must set
`Accept: application/com.reloadly.utilities-v1+json`.

Separately: a Reloadly merchant account's utility billers are provisioned per-account,
not universal — GET /billers with a `type` filter always returns HTTP 200 even for a
type with zero registered billers (no 400 on unknown/unprovisioned type). Always check
actual biller counts per type/country for the account in use before assuming a bill
category (e.g. cable TV, internet, betting) is payable — it may return an empty list
indefinitely until Reloadly enables that vertical for the merchant account, which is
not something fixable in code.
