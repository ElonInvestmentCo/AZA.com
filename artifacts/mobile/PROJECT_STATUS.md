# PAYVORA Mobile — Project Status

_Last updated: July 7, 2026_

## Overview
PAYVORA is a React Native / Expo mobile app (SDK 54) targeting Nigerian financial services: gift card trading, crypto, bill payments, airtime, eSIM, virtual dollar cards, and wallet management.

---

## Recently Completed

### UI/UX Premium Upgrade (July 7, 2026)

#### Notifications Screen (`app/(app)/notifications.tsx`)
- **Chronological timeline** — notifications grouped by Today / Yesterday / Earlier This Week / Earlier This Month / Older
- **13 notification categories** — transactions, deposits, withdrawals, transfers, virtual cards, security, login alerts, promotions, cashback, rewards, verification, referrals, system updates
- **Search bar** — animated slide-in search with text highlighting
- **Category filter chips** — horizontal scrollable filter by category with colored dots
- **Unread indicator** — blue dot (#2563EB) on unread notifications
- **Status badges** — Completed / Pending / Failed badges on transactional notifications
- **CTA buttons** — contextual action buttons (e.g., "Secure account", "Complete KYC", "Redeem now")
- **Pull to refresh** — RefreshControl with accent tint
- **Skeleton loading** — animated pulsing skeleton rows
- **Empty state** — different states for all-empty, filtered-empty, and search-empty

#### Transaction History (`app/(tabs)/history.tsx`)
- **Extended status types** — added Processing, Cancelled, Refunded, Reversed (in addition to Completed, Pending, Failed)
- **Status timeline** — visual 3-step progress rail in transaction detail sheet
- **Recipient/Sender row** — shown in details based on transaction direction
- **Payment method row** — displays the method used for the transaction
- **Transaction ID row** — formatted TXN-XXXXXX with copy chip
- **Reference ID** — existing, now alongside Transaction ID for clarity
- **Repeat Transaction button** — routes user back to relevant service screen
- **API mapper updated** — handles all 7 status types from backend

#### AnimatedSheet (`components/AnimatedSheet.tsx`)
- **Drag handle** — 36×4px pill at top of every sheet, always visible
- **Multi-snap support** — new `snapPoints` prop (array of fractions 0–1)
- **`initialSnapIndex` prop** — controls which snap point to open at
- **Rubber-band overscroll** — upward drag has RUBBER_FACTOR (0.12) resistance
- **Velocity-biased snapping** — release velocity biases snap target selection
- **Haptic feedback** — fires on snap point change
- **Backward compatible** — all existing usages work unchanged (default = single snap)

---

## Architecture

| Layer | Stack |
|---|---|
| Framework | Expo SDK 54, React Native |
| Navigation | Expo Router (file-based) |
| Animation | react-native-reanimated 4.x |
| Gestures | react-native-gesture-handler 2.x |
| Auth | JWT, stored in AsyncStorage |
| API | `@workspace/api-server` on port 3001 |
| Fonts | Manrope (400/500/600/700) |
| Design | White bg (#FFFFFF), Navy (#061941), Green accent (#00D9A0) |

---

## Running

```bash
pnpm --filter @workspace/mobile run dev
```

Expo DevTools at `http://localhost:8081`. Scan QR with Expo Go or run on simulator.

---

---

### UI/UX Gap Closes (July 7, 2026 — follow-up)

#### Notifications — Swipe-to-Dismiss (`app/(app)/notifications.tsx`)
- **`Swipeable` from react-native-gesture-handler** wraps each notification row
- Swipe left reveals a red "Delete" action (trash icon + label, 80px wide)
- Full swipe triggers haptic + 180ms delay then calls `onDismiss()` for a clean exit animation
- Tap-X dismiss still present as secondary affordance
- `rightThreshold: 72`, `friction: 1.8`, `overshootRight: false` for polished feel

#### Transaction History — PDF Receipt Download (`app/(tabs)/history.tsx`)
- **`expo-print` + `expo-sharing`** installed (`npx expo install expo-print expo-sharing`)
- `handleDownloadPDF` builds a full-bleed HTML receipt (PAYVORA branding, amounts, status, breakdown, ref IDs, legal footer)
- `Print.printToFileAsync({ html })` renders to a temp PDF file
- `Sharing.shareAsync(uri, { mimeType: "application/pdf" })` opens native share sheet for Save/AirDrop/email
- Actions row updated: **Share** + **Download PDF** buttons sit side-by-side (flex row)

#### AnimatedSheet — Backdrop Blur (`components/AnimatedSheet.tsx`)
- **`expo-blur` BlurView** (already installed, now used) replaces plain black overlay
- `intensity={35}`, `tint="dark"` gives frosted-glass effect on iOS/Android 12+
- Falls back gracefully on web (Platform check → renders plain dark overlay)
- Added 28% dark tint overlay on top of blur for sheet contrast and readability
- Opacity animation unchanged — BlurView inside the Animated.View wrapper

---

## Known Issues / TODOs
- [ ] Push notifications (real) — Expo Notifications integration needed
- [ ] Real notification API endpoint — currently uses mock data
- [ ] Blog article detail pages (`/blog/[slug]`) not yet built on the website
- [ ] Apple Sign-in security hardening (proposed task #2)
- [ ] Password reset link TTL (proposed task #3)
- [ ] Infinite scroll / pagination in transaction history
- [ ] Notification preferences screen (`app/(app)/notification-preferences.tsx`)
