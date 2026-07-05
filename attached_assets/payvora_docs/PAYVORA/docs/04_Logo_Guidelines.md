# Logo Guidelines

## Logo Assets

Three SVG files are the official PAYVORA brand assets. They live at:

```
artifacts/website/public/
  payvora-wordmark.svg     ← text only, black paths, transparent bg
  payvora-logo-dark.svg    ← full logo on black background
  payvora-icon.svg         ← symbol / icon only, square

artifacts/landing/public/
  (same three files)

artifacts/mobile/assets/images/
  payvora-wordmark.svg
  payvora-icon.svg
```

---

## Asset Descriptions

### payvora-wordmark.svg
- PAYVORA text wordmark only
- Black letterform paths, transparent background
- Aspect ratio: ~4.3:1 (landscape)
- Viewbox: `0 0 1774 887`
- Use as the primary brand identifier in headers, footers, and auth screens

### payvora-logo-dark.svg
- Full logo with black background rectangle + white winding-rule letterforms
- Use when a self-contained, badge-style logo is needed

### payvora-icon.svg
- Symbol / icon only — square format, same winding-rule construction
- Use for app icon, favicon, and compact brand moments

---

## Usage Rules

### On Dark Backgrounds (Website & Landing — primary)

```html
<img
  src="/payvora-wordmark.svg"
  alt="PAYVORA"
  style="height: 32px; filter: brightness(0) invert(1);"
/>
```

The CSS filter converts black paths → white. Never apply colour tints, gradients, or opacity to the logo.

### On Light Backgrounds (Mobile auth screens)

Use the `PayvoraWordmark` React Native component:

```tsx
import { PayvoraWordmark } from "@/components/PayvoraWordmark";

<PayvoraWordmark width={148} height={38} />
// default color: #0B1B3A (deep navy on white)
// pass color prop to override for any background
```

The component embeds the SVG paths via `SvgXml` from `react-native-svg` — no file loading required.

---

## Sizing

| Context | Recommended size |
|---|---|
| Website / Landing navbar | `height: 32px` (auto width ≈ 138px) |
| Website / Landing footer | `height: 34px` |
| Mobile auth screens (login, register, OTP, forgot-password) | `width={148} height={38}` |
| Mobile onboarding header | `width={110} height={28}` |
| Minimum digital width | 96px |
| Preferred UI header width | 120–160px |

---

## Colour Rules

| Background | Logo colour |
|---|---|
| Dark (`#0A0A0F`, `#1A1A2E`, any dark) | White — via `filter: brightness(0) invert(1)` (web) or `color="#FFFFFF"` prop (mobile) |
| Light (`#FFFFFF`, `#F7F8F9`) | Deep Navy `#0B1B3A` (default) |
| Teal accent `#00D9A0` | White — `color="#FFFFFF"` |

- Never apply the teal `#00D9A0` accent directly to the wordmark
- Never add drop shadows, outlines, bevels, or decorative effects to the logo
- Never stretch or distort the aspect ratio

---

## Clear Space

Minimum clear space = height of the uppercase `P` counter × 4, on all sides.

---

## What Not to Do

- Do not recolour to teal or any brand accent colour
- Do not place on a busy photographic background without a scrim
- Do not use the wordmark smaller than 96px wide
- Do not mix the wordmark and icon in the same composition unless following an approved lockup
- Do not recreate the wordmark in system fonts — always use the SVG asset

---

## Wordmark Typographic Reference

The PAYVORA wordmark is a custom geometric sans-serif:
- Weight: optical 760–800 (heavy without closing counters)
- Case: uppercase only
- Kerning: manual — `PA` and `AY` tighter, `YV` looser, `VO` and `RA` tighter
- Width-to-height ratio: approximately 4.3:1 to 4.5:1
- Converted to outlines — do not attempt to re-type in any font

---

**Logo Guidelines v1.1** — updated with actual SVG assets and implementation details
