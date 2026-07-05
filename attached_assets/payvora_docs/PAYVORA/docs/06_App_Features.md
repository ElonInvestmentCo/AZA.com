# App Features

Status key: ✅ Complete | 🔶 UI Complete, backend pending | ❌ Planned / not started

---

## Authentication ✅

### Register
- Email + full name + password (min 8 chars)
- `POST /api/auth/register` — creates user + wallet in DB
- Redirects to OTP screen after registration

### Login
- Email + password
- `POST /api/auth/login`
- Redirects to OTP → Face ID gate

### Google Sign-In ✅
- Via `expo-auth-session` + `expo-web-browser`
- Exchange access token at `POST /api/auth/google`
- Calls Google userinfo endpoint server-side

### Apple Sign-In ✅
- Via `expo-apple-authentication` (iOS only)
- Exchange identity token at `POST /api/auth/apple`

### OTP Verification ✅
- 4-digit code, 30-second resend countdown
- Used in login flow (biometric gate) and password reset flow
- Reset mode: verifies against server-stored 6-digit OTP → issues reset token

### Forgot Password ✅
- `POST /api/auth/forgot-password` — generates OTP, logs to console (email in production)
- OTP verified at `POST /api/auth/verify-otp` → reset token returned
- New password set at `POST /api/auth/reset-password`

### Face ID / Biometric ✅
- `expo-local-authentication` — biometric gate after login/OTP
- Acts as 2FA confirmation layer

### Session Management ✅
- JWT tokens (30-day expiry), stored in `AsyncStorage`
- Auto-restore on app launch via `/api/auth/me`
- Logout clears token and user state

---

## Wallet ✅

### Balance Display
- Fetched via `/api/auth/me` on login and app restore
- Stored in `AuthContext` as `user.balance` (kobo integer)
- Displayed as `₦XXX,XXX.XX` with show/hide toggle

### Fund Wallet 🔶
- Bank transfer instructions displayed
- Payment gateway (Paystack / Flutterwave) integration pending
- No wallet credit without gateway integration

### Withdraw ✅
- Bank + account number + amount input
- Validates balance sufficiency server-side
- `POST /api/wallet/withdraw` — deducts balance, creates pending transaction record
- Shows transaction ref and success confirmation

---

## Transaction History ✅

- `GET /api/wallet/transactions` — paginated, ordered by newest first
- Falls back to rich mock data if wallet is empty (demo mode)
- Filter by: Credit, Debit, Pending
- Date range: 7d, 30d, 3m, All time
- Text search across name and category
- Running totals: total in / total out for filtered view
- Detail sheet: full receipt with share as text

---

## Bill Payments ✅

All powered by **Reloadly Utilities API**.

### Airtime
- Provider selection: MTN, Airtel, Glo, 9mobile
- Amount entry + phone number
- `POST /api/bills/pay` with `AIRTIME` biller type

### Data Bundles
- Provider + plan selection
- `GET /api/bills/billers?type=INTERNET_BILL_PAYMENT`

### Electricity
- Meter number + distributor selection
- Prepaid / postpaid support
- `ELECTRICITY_BILL_PAYMENT` biller type

### Cable TV
- Provider: DSTV, GOtv, Startimes
- Subscriber ID + plan selection
- `CABLE_TV_BILL_PAYMENT` biller type

### Betting Funding
- Provider selection (Bet9ja, Sportybet, etc.)
- Betting account ID
- `BETTING_BILL_PAYMENT` biller type

---

## Gift Cards 🔶

### Sell Gift Card
- Brand selection with flag/logo
- Card value input
- Image upload of physical card
- Submission flow → pending review
- Backend processing and rate locking pending

### Rates Display
- Static NGN/USD rates per gift card brand
- Popular/Top Rate badges
- Rates screen shows gift cards, crypto, eSIM tabs

---

## Crypto 🔶

### Crypto Screen
- Asset list: BTC, ETH, USDT, BNB, SOL, XRP
- Price and 24h change display (static)
- Portfolio allocation

### Trade Asset Screen
- Buy/sell interface with amount entry
- Fiat ↔ crypto conversion preview
- Live price feed integration pending
- Trade execution backend pending

---

## Virtual Cards 🔶

### Cards Tab
- Active / inactive card status display
- Card number (masked), expiry, CVV display
- Fund card + freeze/unfreeze UI
- Card request form

### Card Status Screen
- Full card detail view
- Spending limits display
- Card issuer integration (Bridgecard / Mono) pending

---

## Rates 🔶

- Gift card rates (static NGN/USD per brand)
- Crypto rates (static NGN prices for BTC, ETH, USDT, BNB, SOL, XRP)
- eSIM tab (live via Reloadly)
- Live FX feed integration pending

---

## eSIM ✅

- International eSIM plans via Reloadly
- Region browsing: `GET /api/esim/regions`
- Plan listing: `GET /api/esim/plans`
- Purchase flow UI

---

## Onboarding ✅

- Animated multi-slide onboarding with Reanimated
- Covers: Wallet, Bill Payments, Gift Cards, Virtual Cards features
- Skip and Next navigation
- Auto-advances to auth after completion

---

## Notifications 🔶

- In-app notification centre screen at `/(app)/notifications`
- Displays transaction alerts, security notices, promotions, and system messages
- Unread count badge on bell icon (home header)
- Mark individual or all notifications as read
- Dismiss individual notifications
- Bell icon on home dashboard wired to notifications screen
- Push notification service (FCM / Expo Notifications) not yet integrated — mock data displayed

---

## KYC ✅

- Mobile screen at `/(app)/kyc` — identity verification flow
- Accessible from More → Account → Identity Verification
- `GET /api/kyc/status` — returns current KYC status + submitted data
- `POST /api/kyc/submit` — submits fullName, dob, idType, idNumber
- Supported ID types: NIN (11 digits), BVN (11 digits), International Passport, Driver's License, Voter's Card
- Status states: none → pending → verified / rejected with UI feedback
- KYC fields stored on `usersTable`: kycStatus, kycFullName, kycDob, kycIdType, kycIdNumber, kycRejectionReason, kycSubmittedAt, kycReviewedAt
- Auto-approves in current environment (no third-party BVN/NIN provider wired)

---

## Referral System 🔶

- Referral code displayed with copy + share actions
- Native share sheet integration
- Reward tracking and distribution engine not yet built

---

## Security ✅

- JWT auth with 30-day expiry
- bcryptjs password hashing (12 rounds)
- Biometric gate via `expo-local-authentication`
- OTP 2-factor verification
- CORS restricted to allowed origins in production
- All sensitive actions require re-authentication

---

## Support ✅

- Help & Support screen with FAQ links
- App Info screen (version, build)
- Language screen (UI only)
- Contact routes to website

---

## Settings / Profile ✅

- Profile: name, email, avatar from `AuthContext`
- Logout: clears `AsyncStorage` + calls `POST /api/auth/logout`
- Settings: language, support, app info, security

---

## Submitted / Rejected States ✅

- `/(app)/submitted` — full-screen success state with title/subtitle params
- `/(app)/rejected` — full-screen failure state
- Used after bill payments, withdrawals, and gift card submissions

---

## Quick Payment ✅

- `/(app)/quick-payment` — accessible from More → Account → Quick Payment
- Toggle to enable/disable PIN-free payments for small transactions
- Configurable spending limit: ₦5,000 / ₦10,000 / ₦20,000 / ₦50,000
- Preference persisted in `AsyncStorage` across sessions
- Transactions above the set limit still require PIN / biometric authentication

---

## Dashboard (Home Tab) ✅

- Wallet balance card (show/hide, fund, sell, withdraw)
- Quick action grid (8 tiles)
- Recent transactions preview
- Greeting with username
