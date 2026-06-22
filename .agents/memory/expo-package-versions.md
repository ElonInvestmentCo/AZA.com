---
name: Expo package versions
description: Correct package versions for expo 54 — wrong versions cause "Cannot find native module ExpoCryptoAES".
---

# Expo 54 package versions

## Auth-related (both mobile and payvora)
```
expo-auth-session: ~7.0.11   (NOT ^56.x — breaks native crypto module)
expo-crypto:       ~15.0.9   (NOT ^56.x)
expo-apple-authentication: ~8.0.8  (NOT ^56.x)
```

**Why:** expo SDK 54 ships with specific native module versions. The ^56.x tags are mismatched (probably from a different SDK branch) and cause `Cannot find native module 'ExpoCryptoAES'` at runtime in Expo Go.

## How to apply
Fix in both `artifacts/mobile/package.json` (dependencies) and `artifacts/payvora/package.json` (dependencies), then run `pnpm install --no-frozen-lockfile`.
