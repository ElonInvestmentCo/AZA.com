# PAYVORA AI Prompt Library

This document captures the actual prompt patterns, constraints, and decisions used to build and evolve the PAYVORA codebase. Use this as a reference for consistent AI-assisted development.

---

## Global Rules (apply to every prompt)

1. **Never change** the teal accent `#00D9A0` or deep black background `#0A0A0F` — these are locked brand tokens.
2. All monetary amounts are stored in **kobo** (integer). Divide by 100 for naira display.
3. Font is **Manrope** (`Manrope_400Regular`, `Manrope_500Medium`, `Manrope_600SemiBold`, `Manrope_700Bold`).
4. Auth screens use a **white background** (`#FFFFFF`); the main app uses `#0A0A0F` dark background.
5. The API server is Express 5 + Drizzle ORM + PostgreSQL. Use `@workspace/db` for DB access.
6. Mobile is Expo 54 + React Native. Use `apiFetch` from `@/utils/api` for all API calls.
7. All API routes are prefixed `/api/`. The mobile `apiFetch` already handles this.

---

## Branding

### System prompt fragment
```
You are building PAYVORA, a Nigerian fintech super app.
Brand tokens (immutable):
- Accent: #00D9A0 (teal/mint green)
- Background: #0A0A0F (near-black)
- Surface: #1A1A2E
- Font: Manrope (400, 500, 600, 700)
- Logo: use PayvoraWordmark component or payvora-wordmark.svg with CSS invert filter
Never change these. Never apply the accent colour to the wordmark itself.
```

---

## Mobile Screen Prompts

### New feature screen (dark theme)
```
Create a new React Native screen for [feature] in artifacts/mobile/app/(app)/[name].tsx.

Design tokens:
const C = {
  bg:      "#0A0A0F",
  surface: "#1A1A2E",
  accent:  "#00D9A0",
  text:    "#FFFFFF",
  textSec: "#8F8FA3",
  textMut: "#5A5A7A",
  border:  "#2A2A45",
  error:   "#FF4D4F",
  warn:    "#FFB020",
};

Rules:
- Use Manrope font family throughout
- Use Feather icons from @expo/vector-icons
- Use expo-haptics for all user interactions
- Use AnimatedSheet for bottom sheets / pickers
- Use apiFetch from @/utils/api for API calls
- All amounts displayed as ₦X,XXX.XX (divide kobo by 100)
- Animated entry with react-native-reanimated FadeInDown/FadeInUp
- useSafeAreaInsets for proper top/bottom padding
```

### New auth screen (white theme)
```
Create a new React Native auth screen in artifacts/mobile/app/(auth)/[name].tsx.

Design tokens:
const C = {
  bg:          "#FFFFFF",
  inputBg:     "#F7F8F9",
  inputBorder: "#E8ECF4",
  inputFocus:  "#1E232C",
  text:        "#1E232C",
  subtext:     "#8391A1",
  btn:         "#00D9A0",
  btnText:     "#0A0A0F",
  error:       "#FF5B7A",
};

Rules:
- Include PayvoraWordmark at the top (width=148, height=38)
- Back button using Ionicons chevron-back
- Use Manrope font family
- KeyboardAvoidingView wrapper
- Use apiFetch for real API calls (not setTimeout mocks)
```

---

## API Route Prompts

### New Express route
```
Add a new route to artifacts/api-server/src/routes/[name].ts

Rules:
- Use Router from express
- Import { db, [tables] } from "@workspace/db"
- Import { requireAuth, type AuthRequest } from "../middleware/auth.js"
- All authenticated routes use requireAuth middleware
- Return errors as { error: "message" } with appropriate HTTP status
- Store amounts in kobo (multiply naira × 100 before inserting)
- Return amountNaira (kobo / 100) alongside amountKobo in responses
- Register the router in artifacts/api-server/src/routes/index.ts
```

### DB migration (Drizzle)
```
Add a new table to the PAYVORA database.

Schema location: lib/db/src/schema/[name].ts
Export from: lib/db/src/schema/index.ts
Re-export from: lib/db/src/index.ts

Rules:
- Use drizzle-orm/pg-core (pgTable, uuid, text, integer, timestamp, etc.)
- Primary key: uuid().primaryKey().defaultRandom()
- Timestamps: createdAt and updatedAt with { withTimezone: true }.defaultNow()
- Use createInsertSchema from drizzle-zod
- Add FK indexes for all foreign key columns
```

---

## Logo / Brand Asset Prompts

### Add logo to a web component
```
Replace the existing text/placeholder logo with the PAYVORA SVG wordmark.

For dark backgrounds:
<img src="/payvora-wordmark.svg" alt="PAYVORA" style={{ height: 32, filter: "brightness(0) invert(1)" }} />

For light backgrounds:
<img src="/payvora-wordmark.svg" alt="PAYVORA" style={{ height: 32 }} />
```

### Add logo to a mobile screen
```
Replace <Text>PAYVORA.</Text> with the SVG wordmark component:

import { PayvoraWordmark } from "@/components/PayvoraWordmark";

// On white background (auth screens):
<PayvoraWordmark width={148} height={38} />

// On dark background:
<PayvoraWordmark width={148} height={38} color="#FFFFFF" />
```

---

## Bill Payment Integration (Reloadly)

### Biller fetch pattern
```typescript
// Always use fetchBillers from @/utils/api
import { fetchBillers, type BillerType } from "@/utils/api";

const billers = await fetchBillers("ELECTRICITY_BILL_PAYMENT");
// Match biller by name using matchBiller() helper
const biller = matchBiller(billers, ["ekedc", "eko"], "PREPAID");
```

### Bill pay pattern
```typescript
import { payBill } from "@/utils/api";

const result = await payBill({
  billerId: biller.id,
  subscriberAccountNumber: meterNumber,
  amount: amountNaira,
  referenceId: `REF-${Date.now()}`,
});
```

> Important: The Reloadly Utilities API requires `Accept: application/com.reloadly.utilities-v1+json` — this is handled server-side in `artifacts/api-server/src/routes/bills.ts`.

---

## Design Patterns

### Amount display
```typescript
// Always format naira this way:
const display = "₦" + (amountKobo / 100).toLocaleString("en-NG", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});
```

### apiFetch pattern
```typescript
// Always use apiFetch — it handles base URL, JWT token, and error parsing
import { apiFetch } from "@/utils/api";

const data = await apiFetch<{ result: string }>("/some/route", {
  method: "POST",
  body: JSON.stringify({ key: "value" }),
});
```

### AnimatedSheet usage
```tsx
const [visible, setVisible] = useState(false);

<AnimatedSheet visible={visible} onClose={() => setVisible(false)} maxHeight="60%">
  <View style={{ padding: 20 }}>
    {/* content */}
  </View>
</AnimatedSheet>
```

### Submission flow
```
After a successful payment/transaction:
router.push({
  pathname: "/(app)/submitted",
  params: { title: "Payment Successful", subtitle: "Your payment has been\nprocessed successfully" }
} as any);

After a failed transaction:
router.push({ pathname: "/(app)/rejected" } as any);
```

---

## Decisions & Constraints Log

- **OTP storage:** In-memory Map with 10-minute TTL (production needs DB or Redis)
- **Wallet funding:** UI only — payment gateway (Paystack/Flutterwave) not yet integrated
- **Crypto prices:** Static in rates.tsx — CoinGecko API integration planned
- **Gift card processing:** UI complete — backend processing and escrow not yet built
- **Virtual card issuance:** UI complete — Bridgecard/Mono not yet integrated
- **Email sending:** Not wired — OTP codes logged to console; integrate SendGrid/Mailgun for production
- **Bill payments:** Live via Reloadly — requires active RELOADLY_CLIENT_ID + RELOADLY_CLIENT_SECRET
