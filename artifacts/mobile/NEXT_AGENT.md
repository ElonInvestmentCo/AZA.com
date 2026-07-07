# PAYVORA Mobile — Next Agent Handoff

_Last updated: July 7, 2026_

## What Was Just Built

Three premium UI/UX upgrades to make the app feel like Revolut / Cash App:

1. **AnimatedSheet** — multi-snap bottom sheet with drag handle, rubber-band, haptic feedback
2. **Notifications** — grouped timeline, 13 categories, search/filter, skeleton, CTA buttons
3. **Transaction History** — status timeline, extended status types, recipient/sender, repeat tx

See `PROJECT_STATUS.md` for full detail on each change.

---

## What to Work on Next

### High Priority
1. **Real notification API** — the notifications screen uses mock data. Build `GET /notifications` on the API server and wire it up with the same grouping logic.
2. **Push notifications** — integrate `expo-notifications` so the app receives background alerts.
3. **Apple Sign-in security** (proposed task #2) — identityToken validation needs stricter audience check.
4. **Password reset TTL** (proposed task #3) — reset tokens should expire in 15 minutes, not 24h.

### Medium Priority
5. **Swipe-to-dismiss notifications** — the spec asks for swipe gesture on notification rows. Currently only tap-X deletes. Use `react-native-gesture-handler` Swipeable component.
6. **Download receipt (PDF)** — the transaction detail has "Share Receipt" but not PDF download. Use `expo-print` or `react-native-html-to-pdf`.
7. **Infinite scroll / pagination** in transactions — currently loads all in one shot; add page-based loading.

### Low Priority
8. **Notification preferences screen** — the spec mentions toggling notification categories. Create `app/(app)/notification-preferences.tsx`.
9. **Transaction filter modal** — current filter uses chips; a full filter bottom sheet (date range picker, amount range, status multi-select) would improve UX.

---

## Architecture Notes

- All animation uses `react-native-reanimated` 4.x — worklets are required for gesture callbacks
- `AnimatedSheet` is shared across 12+ screens; test carefully if modifying it
- `expo-haptics` is available and already used; add to new interactions
- Fonts: always use `Manrope_400Regular`, `Manrope_500Medium`, `Manrope_600SemiBold`, `Manrope_700Bold`
- Design tokens: navy `#061941`, accent `#00D9A0`, success `#00B03C`, danger `#EF4444`, warn `#D97706`
- API base URL is resolved via `@/utils/api.ts` → `apiFetch(path)` handles auth headers automatically

---

## File Map (key files)

```
artifacts/mobile/
  app/
    (tabs)/
      history.tsx          ← Transaction history + detail sheet (enhanced)
      index.tsx            ← Dashboard / home
      cards.tsx            ← Virtual cards
    (app)/
      notifications.tsx    ← Notifications (rewritten)
      transactions.tsx     ← Secondary tx screen (older version)
      settings.tsx         ← Account settings
      kyc.tsx              ← Identity verification
  components/
    AnimatedSheet.tsx      ← Shared bottom sheet (enhanced with snap points)
    AZAButton.tsx          ← Primary button
    AZAInput.tsx           ← Form input
  context/
    AuthContext.tsx        ← JWT auth state, login/logout
  utils/
    api.ts                 ← apiFetch wrapper with token injection
```
