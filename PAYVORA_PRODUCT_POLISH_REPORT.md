# PAYVORA Product Polish Report — Brand Integration Pass

Date: 2026-07-12

## Scope

Integrate the official `PAYVORA_Brand_Assets.zip` package into the website and
mobile app, replacing placeholder/mismatched brand assets. No logo artwork was
modified or regenerated — all files below are copied verbatim from the
official brand package. Backend/business logic was not touched.

## Audit findings (before changes)

- The website navbar and footer rendered a **hard-coded text logo** (`PAY` /
  `VORA` spans) instead of the real vector logo, even though a correct
  `payvora-wordmark.svg` already existed unused in `public/`.
- The website's `favicon-dark.png` / `favicon-light.png` / `apple-touch-icon.png`
  were not real favicons — they were the full-resolution `PAYVORA-Logomark-*.png`
  files (500–700 KB each) reused as favicons, and the same file was reused again
  as the **mobile app icon**.
- `og-image.png` referenced in `layout.tsx` metadata did not exist on disk.
- No web manifest (`site.webmanifest`) existed.
- Mobile `app.json` had no Android adaptive-icon configuration and no Expo-web
  favicon.
- The website's wordmark PNGs (`wordmark-dark.png` / `wordmark-light.png`) and
  the three `payvora-*.svg` vector files already matched the official brand
  package byte-for-byte / were legitimate vector traces — these were correct
  and left untouched.

## Changes made

### Website (`artifacts/website`)
- `public/favicon.ico`, `favicon-16x16.png`, `favicon-32x32.png` — added from
  `Favicons/`.
- `public/apple-touch-icon.png` — replaced with the correctly-sized official
  version.
- `public/og-image.png` — added from `Website/OpenGraph-1200x630.png`.
- `public/site.webmanifest`, `pwa-icon-192.png`, `pwa-icon-512.png`,
  `pwa-icon-512-maskable.png` — added from `Favicons/` and `Website/`.
- Removed the oversized placeholder `favicon-dark.png` / `favicon-light.png`.
- `src/app/layout.tsx` — updated `metadata.icons` to point at the real favicon
  set and added `metadata.manifest: "/site.webmanifest"`.
- `src/components/Navbar.tsx` and `src/components/Footer.tsx` — replaced the
  hard-coded text logo with the real `payvora-wordmark.svg` via `next/image`.

### Mobile (`artifacts/mobile`)
- `assets/images/icon.png` — replaced with the official 1024×1024 `AppIcon-1024.png`.
- `assets/images/adaptive-icon/{foreground,background,monochrome}.png` — added
  from `App Icons/Android-Adaptive/`.
- `assets/images/favicon.png` — added (Expo web favicon) from `Favicons/favicon-32x32.png`.
- `app.json` — added `android.adaptiveIcon` (foreground/background/monochrome)
  and `expo.web.favicon`. `icon` and `splash` keys already pointed at the
  correct (now-replaced) asset paths, so no path changes were needed there.

## Build / workflow status

- Website: `NODE_ENV=production next build` completed cleanly (all routes
  prerendered), `tsc --noEmit` clean, dev workflow restarted and serving with
  the new logo/favicons confirmed via screenshot and `curl` (200 on
  `/favicon.ico`, `/og-image.png`, `/site.webmanifest`, `/payvora-wordmark.svg`).
- Mobile: `app.json` validated as JSON; Expo dev server restarted cleanly.
- API server: unaffected, still running.

## Deferred / not done in this pass

The handoff brief's full scope (design tokens consolidation, splash
motion/Rive-Lottie work, and per-screen logo placement across every
onboarding/auth/dashboard/settings/empty/loading screen) was **not**
attempted in this pass, to avoid a large, unreviewed sweep across dozens of
mobile screens:

- **Design tokens**: colors are already centralized and match the brand
  (`artifacts/mobile/constants/colors.ts`, `artifacts/website/src/app/globals.css`,
  both using `#00D9A0` / `#0A0A0F`). No separate `theme/`, `design-system/`, or
  `tokens/` directory exists; consolidating these into a single shared token
  source is a real refactor and should be scoped as its own task if wanted.
- **Splash/loading motion (Rive/Lottie)**: the mobile app currently uses a
  hand-built animated component (`SplashAnimation.tsx`, React Native Animated
  API) for launch, and a Lottie animation elsewhere (`LottieWalletSlide.tsx`,
  `wallet-lottie.json`). Swapping the launch screen to Rive/Lottie fed by the
  official `Motion/` assets is a distinct animation task, not a file-copy —
  recommend scoping separately.
- **Per-screen logo audit**: dashboard/settings/onboarding/empty/loading
  screens were not individually audited for placeholder logos; the assets
  above cover the two spots (browser tab / OS app icon / social preview) that
  were confirmed broken.

## Remaining known issues (pre-existing, unrelated to branding)

- `artifacts/mockup-sandbox` has a pre-existing `@types/react` version
  conflict with `artifacts/mobile` (documented previously); not touched here.
- The unused `sessions` DB table and stubbed OTP email delivery are tracked as
  separate proposed project tasks.
