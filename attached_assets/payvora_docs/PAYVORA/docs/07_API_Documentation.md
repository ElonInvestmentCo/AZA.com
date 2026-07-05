# API Documentation (PAYVORA)

**Base URL (dev):** `http://localhost:8080/api`
**Base URL (production):** `https://api.payvora.org/api`

All authenticated routes require:
```
Authorization: Bearer <jwt_token>
```

---

## Health

### GET /health
**Description:** Server health check
**Authentication:** None

**Response:**
```json
{ "status": "ok" }
```

### GET /api/status
**Description:** API version info
**Authentication:** None

**Response:**
```json
{ "name": "Payvora API", "version": "1.0.0", "status": "ok" }
```

---

## Authentication

### POST /auth/register
**Description:** Register a new user (also creates wallet)
**Authentication:** None

**Request:**
```json
{
  "email": "user@example.com",
  "fullName": "Ada Obi",
  "password": "min8chars"
}
```

**Response 201:**
```json
{
  "token": "jwt",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "fullName": "Ada Obi",
    "avatarUrl": null,
    "authProvider": "email",
    "createdAt": "2025-07-05T00:00:00Z"
  }
}
```

**Error Codes:** 400 Invalid input | 409 Email already exists

---

### POST /auth/login
**Description:** Authenticate user
**Authentication:** None

**Request:**
```json
{
  "email": "user@example.com",
  "password": "string"
}
```

**Response 200:**
```json
{
  "token": "jwt",
  "user": { "id": "uuid", "email": "...", "fullName": "..." }
}
```

**Error Codes:** 400 Missing fields | 401 Invalid credentials

---

### POST /auth/google
**Description:** Google OAuth login/register
**Authentication:** None

**Request:**
```json
{ "accessToken": "google_access_token" }
```

**Response 200:**
```json
{ "token": "jwt", "user": { ... } }
```

---

### POST /auth/apple
**Description:** Apple Sign-In login/register
**Authentication:** None

**Request:**
```json
{
  "identityToken": "apple_identity_token",
  "name": "Ada Obi",
  "email": "user@example.com"
}
```

**Response 200:**
```json
{ "token": "jwt", "user": { ... } }
```

---

### GET /auth/me
**Description:** Get current user + wallet
**Authentication:** Bearer Token

**Response 200:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "fullName": "Ada Obi",
    "avatarUrl": null,
    "authProvider": "email",
    "createdAt": "2025-07-05T00:00:00Z"
  },
  "wallet": {
    "balanceKobo": 20059000,
    "currency": "NGN"
  }
}
```

**Error Codes:** 401 Unauthorized | 404 User not found

---

### POST /auth/logout
**Description:** Invalidate session (client should also clear token)
**Authentication:** Bearer Token

**Response 200:**
```json
{ "ok": true }
```

---

### POST /auth/forgot-password
**Description:** Send OTP to email for password reset
**Authentication:** None

**Request:**
```json
{ "email": "user@example.com" }
```

**Response 200:**
```json
{
  "ok": true,
  "message": "If that email exists, a reset code has been sent."
}
```

> Note: Always returns 200 to prevent email enumeration. OTP logged to console in dev; email service required for production.

---

### POST /auth/verify-otp
**Description:** Verify OTP code and receive reset token
**Authentication:** None

**Request:**
```json
{
  "email": "user@example.com",
  "code": "481923"
}
```

**Response 200:**
```json
{ "ok": true, "resetToken": "jwt" }
```

**Error Codes:** 400 Invalid or expired code

---

### POST /auth/reset-password
**Description:** Set new password using reset token
**Authentication:** None

**Request:**
```json
{
  "resetToken": "jwt_from_verify_otp",
  "newPassword": "newSecurePass123"
}
```

**Response 200:**
```json
{ "ok": true, "message": "Password has been reset successfully." }
```

**Error Codes:** 400 Invalid token | 400 Password too short

---

## Wallet

### GET /wallet/balance
**Description:** Get wallet balance for authenticated user
**Authentication:** Bearer Token

**Response 200:**
```json
{
  "balanceKobo": 20059000,
  "currency": "NGN",
  "balanceNaira": 200590.00
}
```

---

### GET /wallet/transactions
**Description:** List user transactions, newest first
**Authentication:** Bearer Token

**Query params:**
- `limit` (default 50, max 100)
- `offset` (default 0)

**Response 200:**
```json
{
  "transactions": [
    {
      "id": "uuid",
      "type": "debit",
      "status": "completed",
      "category": "bill_payment",
      "amountKobo": 500000,
      "amountNaira": 5000.00,
      "currency": "NGN",
      "description": "EKEDC prepaid meter top-up",
      "externalRef": "TXN-ABC123",
      "metadata": { "billerId": 42, "subscriberNumber": "0123456789" },
      "createdAt": "2025-06-22T11:05:00Z"
    }
  ],
  "limit": 50,
  "offset": 0
}
```

**Categories:** `wallet_funding` | `bill_payment` | `gift_card` | `airtime` | `esim` | `withdrawal` | `transfer`

---

### POST /wallet/withdraw
**Description:** Initiate bank withdrawal
**Authentication:** Bearer Token

**Request:**
```json
{
  "amountNaira": 5000,
  "bank": "GTBank",
  "accountNumber": "0123456789"
}
```

**Response 200:**
```json
{
  "transactionId": "uuid",
  "reference": "WD-A1B2C3D4",
  "status": "pending",
  "amountNaira": 5000,
  "newBalanceKobo": 15059000,
  "message": "Withdrawal initiated. Funds will be credited within 24 hours."
}
```

**Error Codes:** 400 Minimum ₦100 | 400 Insufficient balance | 404 Wallet not found

---

## Bills

### GET /bills/billers
**Description:** List billers by type and country
**Authentication:** Bearer Token

**Query params:**
- `type`: `ELECTRICITY_BILL_PAYMENT` | `CABLE_TV_BILL_PAYMENT` | `INTERNET_BILL_PAYMENT` | `BETTING_BILL_PAYMENT`
- `countryISOCode`: `NG`

**Response 200:**
```json
{
  "billers": [
    { "id": 42, "name": "EKEDC", "countryCode": "NG", "serviceType": "PREPAID" }
  ]
}
```

> Note: requires `Accept: application/com.reloadly.utilities-v1+json` header (handled server-side).

---

### POST /bills/pay
**Description:** Pay a utility bill via Reloadly
**Authentication:** Bearer Token

**Request:**
```json
{
  "billerId": 42,
  "subscriberAccountNumber": "0123456789",
  "amount": 5000,
  "referenceId": "unique-ref-string"
}
```

**Response 200:**
```json
{
  "id": 12345,
  "status": "SUCCESSFUL",
  "referenceId": "unique-ref-string",
  "code": "000",
  "message": "Payment successful"
}
```

---

## eSIM

### GET /esim/regions
**Description:** List available eSIM regions
**Authentication:** Bearer Token

**Response 200:**
```json
{ "regions": [{ "name": "Africa", "code": "AF" }] }
```

---

### GET /esim/plans
**Description:** List available eSIM plans (optionally filtered by region)
**Authentication:** Bearer Token

**Query params:**
- `regionCode` (optional)

**Response 200:**
```json
{
  "plans": [
    {
      "id": "uuid",
      "name": "Africa 1GB",
      "dataGB": 1,
      "validityDays": 30,
      "price": 15.00,
      "currency": "USD"
    }
  ]
}
```

---

## Error Format

All errors follow this shape:

```json
{ "error": "Human-readable error message" }
```

Common HTTP status codes:
- `400` — Bad request / validation error
- `401` — Unauthorised (missing or invalid JWT)
- `403` — Forbidden (KYC required, etc.)
- `404` — Resource not found
- `409` — Conflict (email already exists)
- `500` — Internal server error

---

## Notes

- All amounts are in **kobo** (integer) in the database and most API responses. Divide by 100 for naira display.
- JWT tokens expire after **30 days**. Re-authenticate on expiry.
- OTP codes expire after **10 minutes**.
- Bill payment requires active Reloadly API credentials (`RELOADLY_CLIENT_ID`, `RELOADLY_CLIENT_SECRET`).
