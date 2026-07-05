# UI Components

All components use **Manrope** typeface and the PAYVORA dark design system (`#0A0A0F` background, `#00D9A0` accent). Auth screens use a white background variant.

---

## PayvoraWordmark

Brand wordmark component for React Native.

```tsx
import { PayvoraWordmark } from "@/components/PayvoraWordmark";

<PayvoraWordmark width={148} height={38} />
<PayvoraWordmark width={148} height={38} color="#FFFFFF" /> // white on dark
```

- Built with `SvgXml` from `react-native-svg`
- `color` prop defaults to `#0B1B3A` (deep navy, for white backgrounds)
- Used on all auth screens and onboarding

---

## Buttons

Primary action triggers across PAYVORA.

- Variants: Primary (`#00D9A0` bg), Secondary (outline), Ghost (text only), Destructive (`#FF4D4F`)
- Minimum height: **44px**
- Border radius: 12–16px
- States: default, pressed (0.96 spring scale), disabled (0.45 opacity), loading (`ActivityIndicator`)
- All buttons use `Manrope_700Bold`

---

## PasswordInput

Secure text input with show/hide toggle.

```tsx
import { PasswordInput } from "@/components/PasswordInput";

<PasswordInput
  value={password}
  onChangeText={setPassword}
  placeholder="Enter password"
/>
```

- Eye icon toggles `secureTextEntry`
- Used on login, register, new-password screens

---

## EyeIcon

Standalone visibility toggle icon.

```tsx
import { EyeIcon } from "@/components/EyeIcon";
```

---

## SocialAuthButtons

Google + Apple OAuth button row.

```tsx
import SocialAuthButtons from "@/components/SocialAuthButtons";

<SocialAuthButtons />
```

- Google: uses `expo-auth-session` + `expo-web-browser`
- Apple: uses `expo-apple-authentication` (iOS only, hidden on Android/web)
- Calls `loginWithSocial` from `AuthContext`

---

## AnimatedSheet (Bottom Sheet)

Slide-up modal sheet with spring animation and scrim.

```tsx
import { AnimatedSheet } from "@/components/AnimatedSheet";

<AnimatedSheet
  visible={visible}
  onClose={() => setVisible(false)}
  maxHeight="70%"
>
  {/* content */}
</AnimatedSheet>
```

- Spring entry from bottom
- Scrim: `rgba(0,0,0,0.6)`, tap to dismiss
- Background: `#1A1A2E`
- Handle bar indicator at top
- Used for: bank picker, filter sheets, transaction detail, confirmation dialogs

---

## Inputs

Financial and user data capture.

- Dark theme: `#1A1A2E` background, `#2A2A45` border, `#00D9A0` focus ring
- Light theme (auth): `#F7F8F9` background, `#E8ECF4` border, `#1E232C` focus
- Floating/static labels using `Manrope_500Medium` at 12px
- Real-time validation with checkmark or error colour
- Auto-format for currency amounts and phone numbers
- 10-digit validation for bank account numbers

---

## OTP Input

4-box OTP entry with auto-advance and haptic feedback.

- Located on `/(auth)/otp` screen
- Auto-advances to next box on input
- Auto-backspaces to previous box on delete
- SMS autofill support (`textContentType="oneTimeCode"` on iOS)
- Shake animation on wrong code

---

## Cards

Financial information containers.

- Background: `#1A1A2E`, border: `#2A2A45`, radius: 16px
- Wallet card: balance headline, currency, quick actions row
- Transaction card: icon bg + name + amount + status badge + timestamp
- Gift card card: brand logo/flag + rate badge + "Popular"/"Top Rate" tags

---

## Transaction Row

Individual transaction entry in history list.

```
[Icon bg] Name                    Amount (green/red)
           Category · Date         Status badge
```

- Tap opens `TxDetailSheet` with full receipt
- Share as text receipt via native share sheet

---

## Status Badge

Color-coded transaction status pill.

| Status | Background | Text |
|---|---|---|
| Completed | `#E8F7EF` | `#00B03C` |
| Pending | `#FFFBEB` | `#D97706` |
| Failed | `#FFF0F0` | `#EF4444` |

---

## Bottom Navigation

Primary mobile navigation.

| Tab | Icon | Route |
|---|---|---|
| Home | home | `/(tabs)/` |
| Cards | credit-card | `/(tabs)/cards` |
| History | clock | `/(tabs)/history` |
| More | grid | `/(tabs)/more` |
| Profile | user | `/(tabs)/profile` |

- Active colour: `#00D9A0`
- Inactive colour: `#5A5A7A`
- Background: `#0A0A0F` with `#1A1A2E` top border

---

## Quick Action Grid

2×N grid of icon-button tiles on the home dashboard.

- Gift Card, Airtime, Electricity, Cable TV
- Rates, Transactions, Betting, Funding
- Each tile: icon in rounded bg + label below
- Tap navigates to the relevant screen

---

## Toast / Feedback

In-app feedback patterns:

- `expo-haptics` for all interactions (impact, selection, notification)
- `/(app)/submitted` screen for post-transaction success states
- `/(app)/rejected` screen for failed transaction states
- No custom toast component — haptics + navigation carry feedback

---

## Wallet Balance Card

Core financial summary on home dashboard.

- Balance in naira: `₦XXX,XXX.XX` — `Manrope_700Bold` at 32–40px
- Show/hide toggle (eye icon)
- Currency label: "NGN"
- Quick actions: Fund Wallet, Sell, Withdraw

---

## Charts

Not yet implemented. Planned as line charts for balance trends and bar charts for spending categories using `react-native-chart-kit` or Victory Native.

---

## Modals

Critical action confirmations.

- Built using `AnimatedSheet` with focused single-action content
- Confirm + Cancel actions always present
- Used for: withdrawal confirm, transaction review, picker selection

---

## Dropdowns / Pickers

Controlled selection from predefined options.

- Built as custom `PickerModal` using `AnimatedSheet`
- Used for: bank selection (withdraw), biller selection (bills)
- Search-enabled for large biller lists
- Clear selected state with checkmark

---

## Chips / Filter Pills

Compact interactive filters in transaction history.

- `TX_FILTERS`: All, Credit, Debit, Pending
- `DATE_RANGES`: All time, 7 days, 30 days, 3 months
- Rounded pill design (`borderRadius: 999`)
- Active: `#00D9A0` border + tint background
- Inactive: `#2A2A45` border + `#1A1A2E` background

---

## Highlight Text

Search result highlight in transaction list.

- Wraps matched substring in `#FEF3C7` background / `#92400E` text
- Used in transaction name and category search
