# Product Overview

## Introduction

PAYVORA is a unified financial super app designed to consolidate payments, digital assets, and everyday financial services into a single ecosystem. It enables users to manage money, transact, and access essential services from one secure platform.

The platform removes fragmentation in fintech by combining wallets, gift card trading, crypto, and bill payment infrastructure into one seamless mobile-first experience.

---

## Implementation Status Key

- ✅ **Complete** — functional and API-backed
- 🔶 **UI Complete** — screens built, backend integration pending
- ❌ **Planned** — not yet started

---

## Core Features

### Wallet ✅

- NGN balance stored in kobo (integer precision, ÷100 = naira)
- Real-time balance displayed on home dashboard
- Transaction history via `/api/wallet/transactions`
- Withdrawal to bank account via `/api/wallet/withdraw`
- Fund wallet (bank transfer instructions; payment gateway pending)

---

### Bill Payments ✅

Via **Reloadly API** (`/api/bills/billers`, `/api/bills/pay`):

- **Airtime** — MTN, Airtel, Glo, 9mobile
- **Data Bundles** — Multi-carrier data plans
- **Electricity** — EKEDC, IKEDC, AEDC, and other DISCOs
- **Cable TV** — DSTV, GOtv, Startimes
- **Betting** — Wallet funding for betting platforms

---

### Gift Card Trading 🔶

- Browse and sell gift cards (Amazon, iTunes, Steam, Google Play, Visa, Walmart, eBay, Vanilla)
- Image upload for physical card codes
- Rate display per gift card type
- Backend processing integration pending

---

### Virtual Cards 🔶

- Card request interface
- Active/inactive status display
- Card detail view
- Card issuer integration (Bridgecard / Mono) pending

---

### Airtime & Data ✅

- Part of Bill Payments feature (see above)
- Reloadly-backed carrier integrations

---

### eSIM ✅

- International eSIM plans via Reloadly
- Region and plan browsing (`/api/esim/plans`, `/api/esim/regions`)

---

### Crypto 🔶

- Buy/sell interface for BTC, ETH, USDT, BNB, SOL, XRP
- Portfolio display
- Live price feed integration pending
- Trade execution backend pending

---

### Rates 🔶

- Gift card rate display (static NGN/USD rates per brand)
- Crypto price display (static — live feed pending)
- eSIM tab

---

### Transaction History ✅

- Full transaction list from `/api/wallet/transactions`
- Filterable by: Credit, Debit, Pending
- Date range filters: 7 days, 30 days, 3 months, All time
- Search by name or category
- Transaction detail sheet with receipt share

---

### Notifications 🔶

- In-app notification centre at `/(app)/notifications`
- Transaction alerts, security notices, promotions, system messages
- Read/dismiss controls per notification and mark-all-read
- Push notification service (FCM / Expo Notifications) not yet integrated

---

### Security ✅

- JWT authentication (30-day tokens)
- Biometric / Face ID gate (local-auth)
- OTP verification flow (email-based, 6-digit)
- bcryptjs password hashing (12 rounds)
- Google OAuth via access token → userinfo endpoint
- Apple Sign-In via identity token

---

### KYC ✅

- Mobile screen at `/(app)/kyc` — full identity verification flow
- `GET /api/kyc/status` and `POST /api/kyc/submit`
- Supports NIN, BVN, passport, driver's license, voter's card

---

### Referral System 🔶

- Referral code display and share sheet
- Rewards engine not yet built

---

### Support ✅

- Help & Support screen
- App Info screen
- Language settings screen

---

### Settings & Profile ✅

- Profile display from AuthContext (name, email, avatar)
- Logout (clears AsyncStorage + server session)
- Settings screen with language, support, app info

---

## User Journey

1. Onboarding — animated slides introducing the app
2. Register — email + password + full name
3. Login — email/password or Google/Apple OAuth
4. OTP verification — 4-digit code (post-login or password reset)
5. Face ID gate — biometric confirmation
6. Home Dashboard — wallet balance + quick actions
7. Daily usage — bills, gift cards, crypto, rates
8. Withdraw — bank transfer from wallet

---

## Navigation Structure (Mobile)

| Tab | Screens |
|---|---|
| **Home** | Dashboard (balance, quick actions, recent transactions) |
| **Cards** | Virtual card management |
| **History** | Transaction history + detail sheet |
| **More** | Bills, rates, crypto, gift cards, eSIM, referral, settings |
| **Profile** | Account info, security, support, logout |

---

## Platform Coverage

| Platform | Status |
|---|---|
| iOS (Expo Go + native build) | ✅ Active |
| Android (Expo Go + native build) | ✅ Active |
| Web (Expo Web) | 🔶 Partial |
| Marketing Website (Next.js 15) | ✅ Live at www.payvora.org |
| Landing Site (Vite + React) | ✅ Served from API server in production |

---

## Product Goals

- Build a unified financial ecosystem for Nigerian users
- Reduce dependency on multiple fintech apps
- Enable real-time global transactions
- Improve financial accessibility
- Deliver secure and intuitive financial UX

---

## Future Expansion

- Lending and credit systems
- Investment products
- Merchant POS systems
- API banking infrastructure
- AI financial assistant
- Cross-border remittance network
- KYC identity verification (BVN + NIN + face match)
- Push notification service (FCM / Expo Notifications)
