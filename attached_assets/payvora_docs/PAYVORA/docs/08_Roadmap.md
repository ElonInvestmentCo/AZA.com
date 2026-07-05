# PAYVORA Product Development Roadmap

## Overview

This roadmap outlines the phased development strategy for the PAYVORA fintech platform. Status reflects the current implementation as of July 2025.

---

## Phase 1 — Project Foundation ✅ COMPLETE

### Deliverables
- pnpm monorepo structure (website, landing, mobile, api-server)
- Express 5 API server with TypeScript
- Drizzle ORM + PostgreSQL (hosted on Railway)
- Expo 54 / React Native mobile app
- Next.js 15 marketing website (`www.payvora.org`)
- Vite + React landing site (served from API in production)
- Docker-free deployment via Railway
- JWT-based authentication library
- Pino structured logging
- Environment secrets management

**Status:** Dev environment fully operational on Replit + Railway production deployment.

---

## Phase 2 — Identity & Compliance ✅ LARGELY COMPLETE

### Deliverables
- ✅ User registration (email + password)
- ✅ Login (email/password, Google OAuth, Apple Sign-In)
- ✅ JWT authentication (30-day tokens)
- ✅ Password recovery (forgot-password → OTP → reset-password)
- ✅ OTP verification (in-memory 6-digit, 10-minute TTL)
- ✅ Face ID / biometric gate (expo-local-authentication)
- ✅ User profiles (name, email, avatar)
- ✅ Session management (AsyncStorage + server-side logout)
- ❌ Multi-factor authentication (SMS 2FA) — planned
- ❌ Role-Based Access Control (RBAC) — planned
- ✅ KYC verification (BVN, NIN, face match) — UI + API complete (auto-approve; third-party provider pending)
- ❌ Audit logs — not started

**Milestone:** Verified user onboarding operational. KYC flow live.

---

## Phase 3 — Wallet Infrastructure ✅ CORE COMPLETE

### Deliverables
- ✅ Wallet creation (auto-created on register)
- ✅ NGN balance storage (kobo precision)
- ✅ Balance display (real-time from API)
- ✅ Withdrawal to bank account (`POST /wallet/withdraw`)
- ✅ Transaction recording (credits and debits)
- ✅ Transaction history with filtering and search
- 🔶 Wallet funding (bank transfer UI; payment gateway pending)
- ❌ Double-entry ledger — planned
- ❌ Wallet statements (export) — planned
- ❌ Multi-currency wallets — planned
- ❌ Balance reconciliation — planned

**Milestone:** Core wallet transactions operational. Payment gateway integration needed for live funding.

---

## Phase 4 — Trading Engine 🔶 PARTIAL

### Deliverables
- 🔶 Gift card trading UI (sell flow complete, processing backend pending)
- 🔶 Crypto trading UI (buy/sell interface complete, live prices and execution pending)
- 🔶 Live exchange rates (static rates display; live feed integration pending)
- ❌ Order processing engine
- ❌ Trade history (uses general transaction history)
- ❌ Settlement engine

**Milestone:** UI scaffolding complete. Backend trading engine not yet built.

---

## Phase 5 — Bill Payments & Financial Services ✅ COMPLETE

### Deliverables
- ✅ Airtime purchase (MTN, Airtel, Glo, 9mobile via Reloadly)
- ✅ Data subscriptions (multi-carrier via Reloadly)
- ✅ Electricity bills (EKEDC, IKEDC, AEDC via Reloadly)
- ✅ Cable TV payments (DSTV, GOtv, Startimes via Reloadly)
- ✅ Betting wallet funding (Bet9ja, Sportybet, etc. via Reloadly)
- ✅ eSIM plans (international via Reloadly)
- ✅ Transaction receipts (confirmation screens + shareable text)

**Milestone:** Complete bill payment platform operational. Requires active Reloadly API keys.

---

## Phase 6 — Virtual Cards 🔶 UI ONLY

### Deliverables
- 🔶 Virtual card request UI
- 🔶 Card detail display (masked number, expiry, CVV)
- 🔶 Card status (active/inactive) display
- 🔶 Freeze/unfreeze UI
- 🔶 Spending limits display
- ❌ Card issuance API (Bridgecard / Mono integration pending)
- ❌ Card funding from wallet
- ❌ Card transaction history

**Milestone:** UI complete. Awaiting card issuer API integration.

---

## Phase 7 — Notifications & Communication ❌ NOT STARTED

### Deliverables
- ❌ Push notifications (FCM / Expo Notifications)
- ❌ In-app notification centre
- ❌ Email notifications (transaction confirmations, OTP)
- ❌ SMS notifications
- ❌ Notification preferences

**Note:** Currently using `expo-haptics` for in-app feedback only. OTP codes are logged to server console in dev.

---

## Phase 8 — Administration & Operations ❌ NOT STARTED

### Deliverables
- ❌ Admin authentication
- ❌ User management dashboard
- ❌ Transaction management
- ❌ KYC review dashboard
- ❌ Fraud monitoring
- ❌ Customer support dashboard
- ❌ Analytics and reporting
- ❌ Audit trail management

---

## Phase 9 — Testing & Security ❌ NOT STARTED

### Deliverables
- ❌ Unit testing
- ❌ Integration testing
- ❌ End-to-end testing
- ❌ Performance and load testing
- ❌ Security testing / penetration testing

---

## Phase 10 — Production & Scaling 🔶 IN PROGRESS

### Deliverables
- ✅ Production deployment (Railway + `www.payvora.org`)
- ✅ CORS configuration for production domains
- ✅ Environment secrets management
- 🔶 Monitoring — basic (Railway logs)
- ❌ Centralized structured logging (Pino configured, aggregation pending)
- ❌ Automated backups
- ❌ Disaster recovery plan
- ❌ CDN integration
- ❌ Auto scaling

---

## Current Priority Order

1. **Email service integration** — required for OTP delivery (Phase 2, 7)
2. **Payment gateway** (Paystack or Flutterwave) — required for wallet funding (Phase 3)
3. **Card issuer integration** (Bridgecard / Mono) — required for virtual cards (Phase 6)
4. **Live price feeds** — crypto (CoinGecko) and FX rates (Phase 4)
5. **Push notifications** — Expo Notifications + FCM (Phase 7)
6. **Admin portal** — internal ops tooling (Phase 8)

> ✅ **KYC integration** — completed: UI + API flow live in mobile app

---

## Major Milestones Summary

| Milestone | Phase | Status |
|---|---|---|
| Development environment ready | 1 | ✅ Complete |
| Auth + onboarding complete | 2 | ✅ Complete |
| Wallet infrastructure live | 3 | ✅ Core complete |
| Trading engine operational | 4 | 🔶 UI only |
| Financial services launched | 5 | ✅ Complete |
| Virtual cards launched | 6 | 🔶 UI only |
| Notification platform | 7 | ❌ Pending |
| Admin portal | 8 | ❌ Pending |
| Production-ready certification | 9 | ❌ Pending |
| PAYVORA full public launch | 10 | 🔶 In progress |
