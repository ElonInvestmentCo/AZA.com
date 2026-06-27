---
name: AZA mobile color theme
description: The AZA mobile app (artifacts/mobile) uses a white/light design system; colors.ts was previously corrupted with dark values and has been restored.
---

## Rule
`artifacts/mobile/constants/colors.ts` must use **light/white** theme values:
- `background: #FFFFFF`, `text: #0B0A0A`, `tint/accent: #35C2C1` (teal)
- Input bg: `#F7F8F9`, borders: `#E8ECF4`, placeholder: `#8391A1`
- Destructive: `#FF5B7A`, success: `#00B03C`, warning: `#F59E0B`

**Why:** The AZA brand is white/light. At some point an agent wrote dark values (`#0A0A0F` bg, `#00D9A0` accent) into `colors.light` — this was incorrect and was reverted. The payvora artifact (`artifacts/payvora/`) is a separate dark-branded app and correctly uses its own dark palette.

**How to apply:** Any future edits to `constants/colors.ts` in the mobile artifact must stay within the light palette above. Do NOT copy colors from `artifacts/payvora/` into the mobile app. Individual screens define their own inline `C` constant with the same light values — keep them consistent.
