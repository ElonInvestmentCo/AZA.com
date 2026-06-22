---
name: Payvora production config
description: Railway + www.payvora.org wiring decisions — app.config.js, CORS, API URL, OAuth redirects.
---

# Payvora production config

## What was changed
- `app.json` deleted, replaced by `app.config.js` (dynamic env-driven origin)
- `EXPO_PUBLIC_DOMAIN=www.payvora.org` set as shared Replit env var
- iOS bundleIdentifier: `org.payvora.app`, Android package: `org.payvora.app`
- `expo-apple-authentication` plugin added; `usesAppleSignIn: true` on iOS

## API URL resolution (utils/api.ts) — priority order
1. `EXPO_PUBLIC_API_URL` (explicit override for separate Railway API service)
2. `https://${EXPO_PUBLIC_DOMAIN}/api-server` (derived from domain)
3. `/api-server` (web same-origin fallback)
4. `http://localhost:8080` (__DEV__ only)
5. `https://www.payvora.org/api-server` (production safety net)

## CORS (api-server/src/app.ts)
- Production: allows `https://www.payvora.org`, `https://payvora.org`, `https://auth.expo.io`
- Extra origins: `CORS_ALLOWED_ORIGINS` env var (comma-separated)
- Dev (`NODE_ENV !== production`): all origins allowed

## OAuth redirect URIs (SocialAuthButtons.tsx)
Uses `makeRedirectUri({ scheme: "payvora", path: "auth/google" })`.
Three URIs must be registered in Google Cloud Console:
- `https://auth.expo.io/@payvora/payvora` — Expo Go dev
- `https://www.payvora.org` — web production
- `payvora://auth/google` — iOS/Android native production

**Why:** explicit `redirectUri` ensures correct URI across all three build targets rather than relying on expo-auth-session's implicit detection.

## Railway env vars required
| Variable | Value |
|---|---|
| `NODE_ENV` | `production` |
| `PORT` | auto-provided by Railway |
| `DATABASE_URL` | auto-provided by Railway PostgreSQL |
| `EXPO_PUBLIC_DOMAIN` | `www.payvora.org` |
| `EXPO_PUBLIC_API_URL` | Railway API service URL (if separate service) |
| `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` | from Google Cloud Console |
| `RELOADLY_CLIENT_ID` | Reloadly credentials |
| `RELOADLY_CLIENT_SECRET` | Reloadly credentials |
| `RELOADLY_ENV` | `topup-prod` or `esim-prod` |
| `CORS_ALLOWED_ORIGINS` | additional origins if needed |
