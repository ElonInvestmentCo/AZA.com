# PAYVORA — App Store / Play Store Metadata Checklist

Status: assets ready in-repo; store listing content and native build/signing
are outside the scope of this pass.

## App Icon

- [x] Source icon (1024×1024, no transparency) — `PAYVORA Brand/App Icons/AppIcon-1024.png`,
      wired into `artifacts/mobile/app.json` (`expo.icon`).
- [x] iOS icon set (all required sizes) available at
      `PAYVORA Brand/App Icons/iOS-AppIcon.appiconset/` (with `Contents.json`)
      — Expo will generate the iOS icon set from `expo.icon` at build/prebuild
      time; the pre-sliced set is available if a manual Xcode asset catalog is
      ever needed.
- [x] Android adaptive icon (foreground/background/monochrome) wired into
      `artifacts/mobile/app.json` (`expo.android.adaptiveIcon`).
- [x] Android legacy launcher icons available at
      `PAYVORA Brand/App Icons/Android-Legacy/` if a non-adaptive fallback is
      needed for older devices.

## Splash Screen

- [x] Splash image wired (`expo.splash.image` → `splash-payvora.png`,
      background `#0A0A0F`).
- [ ] Not yet using the official `PAYVORA Brand/Splash/` light/dark variants —
      current splash is a single dark-only image; dark/light splash switching
      would need `expo-splash-screen`'s newer config API.

## Store Graphics (assets available, not yet uploaded to any store console)

- [x] App Store icon: `PAYVORA Brand/App Store/App-Store-Icon-1024.png`
- [x] Google Play icon: `PAYVORA Brand/App Store/Google-Play-Icon-512.png`
- [ ] Screenshots (iPhone 6.7"/6.5", iPad, Android phone/tablet) — not
      included in the brand package; need to be captured from the running app.
- [ ] Feature graphic (Google Play, 1024×500) — not included in the brand
      package; would need to be produced from `Marketing/` assets.

## Metadata (not started — content decisions needed from the team)

- [ ] App name / subtitle (App Store) and short/full description (Play)
- [ ] Keywords (App Store)
- [ ] Privacy policy URL (site already has `/privacy` and `/privacy-policy`
      routes on payvora.org — confirm which is canonical before submitting)
- [ ] Support URL / contact email
- [ ] Age rating questionnaire answers
- [ ] Data safety / App Privacy declarations (what data PAYVORA collects —
      needs input from whoever owns the KYC/wallet data model)
- [ ] Category selection (Finance)
- [ ] App Store Connect / Google Play Console app records created
- [ ] Signing: iOS distribution certificate + provisioning profile; Android
      upload keystore — not part of this pass, needs to be set up via EAS or
      manually before a store submission build.

## Build

- [ ] Production EAS build (`eas build --profile production`) has not been
      run as part of this pass — app.json changes above only affect what a
      future build will bundle.
