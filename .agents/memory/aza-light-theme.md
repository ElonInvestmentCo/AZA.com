---
name: AZA mobile color theme
description: The AZA mobile app (artifacts/mobile) uses a DARK theme. Individual screens define their own inline C constant; colors.ts also stores the dark palette.
---

## Current Design: Dark Mode
The user explicitly switched to dark mode matching a reference screenshot.

`artifacts/mobile/constants/colors.ts`:
- `background: #0A0A0A`, `text: #FFFFFF`, `tint/accent: #35C2C1` (teal)
- Surface/card: `#1C1C1E`, borders: `#2A2A2A`, mutedForeground: `#9A9A9A`
- Success: `#00D88C`, destructive: `#EF4444`

**Home screen (index.tsx) inline `C` constant** matches dark palette:
- Action bar (Fund/Sell/Withdraw) is **WHITE** (`#FFFFFF`) with black icons — it intentionally inverts against the dark background
- Tab bar is also **WHITE** floating pill with dark icons; active tab has `#1C1C1E` dark wrapper + white icon
- Service icon boxes: `#1C1C1E` dark bg with colored icons
- Wallet/greeting card: `#1C1C1E` dark card (no gradient)
- Promo cards: `#1C1C1E` with `#35C2C1` teal pct text, white title, `#888888` gray desc

**Why:** User chose the dark UI design as canonical (June 2026). Previous light theme was also valid but this is now the target.

**How to apply:** Keep all screen inline C constants in dark values. The action bar and tab bar remain WHITE as accent elements — do NOT make them dark.
