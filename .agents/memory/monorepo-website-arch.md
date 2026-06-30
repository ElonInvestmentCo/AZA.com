---
name: Monorepo website architecture
description: PayVora monorepo now has a Next.js marketing website at artifacts/website alongside the Expo mobile app.
---

## Architecture
- `artifacts/website` — Next.js 15 marketing website for payvora.com
- `artifacts/mobile` — Expo React Native app (Android/iOS/Expo Go only)
- `artifacts/api-server` — Express 5 API on port 8080

## Website stack
- Next.js 15 App Router, TypeScript, Tailwind CSS v4
- PostCSS plugin: `@tailwindcss/postcss` (NOT `@tailwindcss/vite`)
- Port: **5000** (required for Replit webview)
- Workflow: "PayVora Website" → `pnpm --filter @workspace/website run dev`

## Pages built
Home, Features, Security, Virtual Cards, Gift Cards, Bill Payments, Airtime & Data, FAQ (interactive accordion via FAQClient.tsx), Contact, Download, Privacy Policy, Terms, AML/KYC, Refund Policy, robots.txt, sitemap.xml

## Workflow changes made
- Removed: "AZA Mobile Web" (was `pnpm --filter @workspace/mobile run web`)
- Added: "PayVora Website" (port 5000, webview output type)
- Kept intact: "API Server", "AZA Mobile (Expo Go)"

## Legacy Expo web files — PRESERVED, not deleted
The following files remain in artifacts/mobile and are harmless to native builds:
- `server/serve.js` + `server/templates/` — static web server
- `static-build/` — 18MB Expo web output
- `scripts/web-proxy.mjs` — proxies Metro for web
- `scripts/build.js` — builds Expo web
- `components/LottieWalletSlide.web.tsx` — Expo platform override
- `package.json` `web` script — kept

**Why:** User explicitly asked to preserve all legacy files until a second audit confirms they are safe to remove.

## FAQ page pattern
FAQ page uses server/client split: `faq/page.tsx` (Server, exports metadata) imports `faq/FAQClient.tsx` (Client, handles accordion state). Use this pattern for any page that needs both metadata and client interactivity.
