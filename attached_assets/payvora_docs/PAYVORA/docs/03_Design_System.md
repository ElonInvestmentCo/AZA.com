# Design System

## Overview

PAYVORA uses a dark-first design system built around deep blacks, a mint-green accent, and the Manrope typeface. Every decision prioritises financial clarity, high contrast, and trust.

---

## Color Palette

### Primary (Dark Theme — default)

| Token | Hex | Usage |
|---|---|---|
| Background | `#0A0A0F` | App background, screen root |
| Surface | `#1A1A2E` | Cards, sheets, inputs |
| Surface2 | `#252540` | Elevated cards, selected states |
| Accent / Primary | `#00D9A0` | Buttons, links, active states, highlights |
| Text Primary | `#FFFFFF` | Headlines, primary body |
| Text Secondary | `#8F8FA3` | Subtitles, labels |
| Text Muted | `#5A5A7A` | Placeholders, disabled, captions |
| Border | `#2A2A45` | Card borders, dividers |

### Semantic Colors

| Token | Hex | Usage |
|---|---|---|
| Success | `#00D9A0` | Confirmed transactions, positive amounts |
| Warning | `#FFB020` | Pending states, alerts |
| Error | `#FF4D4F` | Failed transactions, validation errors |
| Info | `#2DD4FF` | Informational toasts, tips |

### Light-context Colors (auth screens, modals with white bg)

| Token | Hex | Usage |
|---|---|---|
| Light Background | `#FFFFFF` | Login, register, OTP, forgot-password screens |
| Light Surface | `#F7F8F9` | Input fields on white |
| Light Border | `#E8ECF4` | Input borders on white |
| Light Text | `#1E232C` | Body text on white |
| Light Subtext | `#8391A1` | Placeholders on white |
| Light Accent | `#00D9A0` | CTA buttons on white screens |

> **Rule:** Never change `#00D9A0` (accent) or `#0A0A0F` (background). These are locked brand tokens.

---

## Typography

- **Font Family:** Manrope (loaded via `@expo-google-fonts/manrope`)
- **Fallback:** System sans-serif

### Weights in use

| Weight | Token | Usage |
|---|---|---|
| 400 | `Manrope_400Regular` | Body, captions, descriptions |
| 500 | `Manrope_500Medium` | Labels, secondary UI text |
| 600 | `Manrope_600SemiBold` | Subtitles, tab labels, chips |
| 700 | `Manrope_700Bold` | Headings, CTA buttons, balances |

### Scale

| Role | Size | Weight |
|---|---|---|
| Balance display | 32–40px | 700 |
| H1 | 28px | 700 |
| H2 | 24px | 700 |
| H3 | 20px | 600 |
| Body | 16px | 400 |
| Small | 14px | 400–500 |
| Caption | 12px | 400 |

### Rules

- All monetary amounts use `Manrope_700Bold`
- Never use decorative or italic variants
- Maintain consistent vertical rhythm with 4px base unit

---

## Iconography

- Library: **Feather Icons** (`@expo/vector-icons/Feather`) for app UI
- Library: **Ionicons** (`@expo/vector-icons/Ionicons`) for auth screens
- Stroke-based, 1.5–2px visual weight
- Rounded endpoints
- Size scale: 16, 20, 22, 24px
- No filled icons except status indicators

---

## Spacing

- Base unit: 4px
- Scale: 4, 8, 12, 16, 20, 24, 32, 48, 64
- Consistent vertical rhythm required
- Outer screen padding: 20–24px horizontal

---

## Grid System

- Mobile (primary): single column, 20px outer margins
- Card grid: 2 columns for quick actions
- Tab bar: max 5 items

---

## Border Radius

| Scale | Value | Usage |
|---|---|---|
| Small | 8px | Chips, badges, small inputs |
| Medium | 12px | Standard inputs, cards |
| Large | 16px | Sheets, modals, main cards |
| Full | 999px | Pills, avatar circles |

---

## Elevation & Surfaces

- Level 0: Background (`#0A0A0F`)
- Level 1: Cards, list items (`#1A1A2E`)
- Level 2: Modals, bottom sheets (`#1A1A2E` with scrim)
- Level 3: Toasts, overlays

Shadows: soft, minimal — `0 2px 8px rgba(0,0,0,0.4)` on dark surfaces.

---

## Buttons

- **Primary:** `#00D9A0` background, `#0A0A0F` text, `Manrope_700Bold`
- **Secondary:** Transparent, `#00D9A0` border and text
- **Ghost:** No border, `#8F8FA3` text
- **Destructive:** `#FF4D4F` background
- Minimum height: **44px** (WCAG touch target)
- Border radius: 12–16px
- States: default, pressed (0.96 scale spring), disabled (0.45 opacity), loading (ActivityIndicator)

---

## Inputs

- Background: `#1A1A2E` (dark) / `#F7F8F9` (light auth screens)
- Border: `#2A2A45` (dark) / `#E8ECF4` (light)
- Focus border: `#00D9A0` (dark) / `#1E232C` (light)
- Floating labels via `Manrope_500Medium` at 12px
- Real-time validation indicators
- Secure mode for PIN and password fields
- Auto-format for currency and phone numbers

---

## Cards

- Background: `#1A1A2E`
- Border: `#2A2A45`
- Border radius: 16px
- Padding: 16–20px
- Hierarchy: title (secondary text) → value (primary bold) → metadata (muted)

---

## Bottom Navigation

- 5 tabs: **Home, Cards, History, More, Profile**
- Fixed bottom placement
- Active tab: `#00D9A0` icon + label
- Inactive tab: `#5A5A7A`
- Background: `#0A0A0F` with top border `#1A1A2E`

---

## AnimatedSheet (Bottom Sheet)

- Slides up from bottom with spring animation
- Scrim behind: `rgba(0,0,0,0.6)`
- Handle bar: `#2A2A45`
- Background: `#1A1A2E`
- Configurable `maxHeight`

---

## Motion Principles

- Duration: 150–320ms
- Easing: `withSpring` (damping 13–18, stiffness 280–320) for interactive elements
- `withTiming` for opacity fades
- `FadeInDown`, `FadeInUp` from `react-native-reanimated` for screen entry
- No decorative animations — every motion has a functional purpose

---

## Accessibility

- WCAG 2.1 AA compliance target
- 4.5:1 contrast minimum (white on `#0A0A0F` bg passes)
- 44px minimum touch targets
- `hitSlop` applied on all small icon buttons
- No colour-only status indicators — always paired with text or icon

---

## Dark Theme (Primary)

Deep black `#0A0A0F` background, `#1A1A2E` surfaces, `#00D9A0` accent, white text.
This is the **only** production theme for the main app flow.

## Light Theme (Auth Screens Only)

White `#FFFFFF` background for login, register, OTP, and forgot-password screens.
Accent remains `#00D9A0`. Uses darker text palette for readability.
