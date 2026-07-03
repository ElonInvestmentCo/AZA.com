---
name: Real auth system
description: JWT-based auth routes in the API server; how Google/Apple OAuth flows work; how the mobile AuthContext calls real API.
---

# Real auth system

## API routes (artifacts/api-server/src/routes/auth.ts)
- `POST /api/auth/register` — email + password + fullName → bcrypt hash, create user + wallet, return JWT
- `POST /api/auth/login` — email + password → verify bcrypt, return JWT  
- `POST /api/auth/google` — accepts `accessToken` (preferred, uses userinfo endpoint) OR `idToken` (uses google-auth-library verify)
- `POST /api/auth/apple` — accepts `identityToken` + `email` + `name` (Apple gives email only on first sign-in)
- `GET /api/auth/me` — requires Bearer JWT, returns user + wallet
- `POST /api/auth/logout` — requires Bearer JWT, returns ok (stateless — client deletes token)

## JWT
- `artifacts/api-server/src/lib/jwt.ts` — `signToken()`, `verifyToken()` using `jsonwebtoken`
- `artifacts/api-server/src/middleware/auth.ts` — `requireAuth` middleware, attaches `req.userId`
- Secret from `JWT_SECRET` env var (required in Railway)

## Google OAuth flow
- Mobile uses `expo-auth-session/providers/google` → gets `accessToken` (NOT idToken — implicit flow)
- Mobile sends `accessToken` to `/api/auth/google`
- Server calls `https://www.googleapis.com/userinfo/v2/me` with the token to verify + get profile
- **Why accessToken not idToken:** `expo-auth-session` implicit flow doesn't return idToken by default

## Mobile changes
- `artifacts/mobile/utils/api.ts` — `apiFetch` auto-attaches JWT from AsyncStorage; API base URL fixed (no longer appends `/api-server`)
- `artifacts/mobile/context/AuthContext.tsx` — calls real API, stores JWT at key `payvora_token`
- `loginWithSocial(token, "google"|"apple", userInfo?)` — provider-aware, hits the right endpoint

## Required Railway env vars
- `JWT_SECRET` — any strong random string (32+ chars)
- `GOOGLE_CLIENT_ID` — for Google ID token verification (optional if using accessToken flow)
- `GOOGLE_CLIENT_SECRET` — not directly used server-side currently (kept for future server OAuth flow)
