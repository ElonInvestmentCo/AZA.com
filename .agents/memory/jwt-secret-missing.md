---
    name: JWT secret missing on fresh environment
    description: PAYVORA API server throws "JWT_SECRET environment variable is required" on register/login until the secret is generated and set.
    ---

    The api-server's `signToken`/`verifyToken` (lib/jwt.ts) throw if
    `process.env.JWT_SECRET` is unset. On a fresh environment (or one where
    secrets weren't carried over), every auth route 500s.

    **Why:** there is no default/fallback secret in code, by design (no
    hardcoded signing key in a fintech app). But nothing auto-generates or
    requests it either, so a missing secret is invisible until you hit an auth
    endpoint and read the stack trace.

    **How to apply:** if register/login 500 with a JWT-related stack trace,
    generate a random secret (`crypto.randomBytes(48).toString("hex")`) and set
    it as `JWT_SECRET` via the environment-secrets flow, then restart the API
    server. Also check `psql "$DATABASE_URL" -c '\dt'` — an empty/never-pushed
    schema produces a *different* 500 further down in the same registration
    flow, so rule both out before assuming an application logic bug.
    