# PAYVORA Mobile — Next Agent Handoff

_Last updated: July 7, 2026_

## What Was Just Built

Three remaining gaps from the premium UI/UX spec have been closed:

1. **Swipe-to-dismiss notifications** — `Swipeable` from RNGH wraps each notification row; swipe left reveals red trash action; haptic + 180ms delay before removing
2. **PDF receipt download** — `expo-print` + `expo-sharing` generate and share a branded PDF receipt from the transaction detail sheet; Share and Download PDF buttons shown side-by-side
3. **Backdrop blur in AnimatedSheet** — `expo-blur` `BlurView` (`intensity=35`, `tint="dark"`) now used instead of plain black overlay; web falls back to solid tint; opacity animation unchanged

See `PROJECT_STATUS.md` for full implementation detail.

---

## What to Work on Next

### High Priority
1. **Real notification API** — the notifications screen uses mock data. Build `GET /notifications` on the API server and wire it up with the same grouping logic (Today / Yesterday / Earlier This Week / Earlier This Month / Older).
2. **Push notifications** — integrate `expo-notifications` so the app receives background alerts.
3. **Apple Sign-in security** — identityToken validation needs stricter audience check (proposed task #2).
4. **Password reset TTL** — reset tokens should expire in 15 minutes, not 24h (proposed task #3).

### Medium Priority
5. **Infinite scroll / pagination** in transactions — currently loads all in one shot; add page-based loading with a FlatList `onEndReached` handler and a loading footer.
6. **Notification preferences screen** — the spec mentions toggling notification categories. Create `app/(app)/notification-preferences.tsx` with category toggles stored in AsyncStorage.
7. **Transaction filter modal** — current filter uses chips; a full filter bottom sheet (date range picker, amount range, status multi-select) would improve UX significantly.

### Low Priority
8. **Mark notification as read on swipe** — currently only "dismiss" is wired; consider adding a left-swipe "mark as read" action as a secondary gesture.
9. **PDF receipt caching** — re-generating on every tap is fine for MVP; a URI cache keyed by `tx.ref` would improve repeat-tap performance.

---

## Architecture Notes

- All animation uses `react-native-reanimated` 4.x — worklets are required for gesture callbacks
- `AnimatedSheet` is shared across 12+ screens; test carefully if modifying it
- `expo-haptics` is available and already used; add to new interactions
- Fonts: always use `Manrope_400Regular`, `Manrope_500Medium`, `Manrope_600SemiBold`, `Manrope_700Bold`
- Design tokens: navy `#061941`, accent `#00D9A0`, success `#00B03C`, danger `#EF4444`, warn `#D97706`
- API base URL is resolved via `@/utils/api.ts` → `apiFetch(path)` handles auth headers automatically
- `Swipeable` from RNGH requires `GestureHandlerRootView` at the app root — already set up

---

## File Map (key files)

```
artifacts/mobile/
  app/
    (tabs)/
      history.tsx          ← Transaction history + detail sheet (PDF download added)
      index.tsx            ← Dashboard / home
      cards.tsx            ← Virtual cards
    (app)/
      notifications.tsx    ← Notifications (swipe-to-dismiss added)
      transactions.tsx     ← Secondary tx screen (older version)
      settings.tsx         ← Account settings
      kyc.tsx              ← Identity verification
  components/
    AnimatedSheet.tsx      ← Shared bottom sheet (BlurView backdrop added)
    AZAButton.tsx          ← Primary button
    AZAInput.tsx           ← Form input
  context/
    AuthContext.tsx        ← JWT auth state, login/logout
  utils/
    api.ts                 ← apiFetch wrapper with token injection
```

## Installed Packages (this session)
- `expo-print` — HTML-to-PDF renderer
- `expo-sharing` — native share sheet for files
