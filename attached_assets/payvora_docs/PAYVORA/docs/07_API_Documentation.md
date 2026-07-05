# API Documentation (PAYVORA)

## Authentication

### POST /auth/register
**Description:** Register new user  
**Authentication:** None  

**Request:**
```json
{
  "email": "user@example.com",
  "phone": "+10000000000",
  "password": "string"
}
```

**Response:**
```json
{
  "userId": "uuid",
  "status": "pending_verification",
  "token": "jwt"
}
```

**Error Codes:**
- 400 Invalid input
- 409 User already exists

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

**Response:**
```json
{
  "userId": "uuid",
  "token": "jwt"
}
```

**Error Codes:**
- 401 Invalid credentials

---

## Wallet

### GET /wallet/balance
**Description:** Retrieve wallet balance  
**Authentication:** Bearer Token  

**Request:**
Headers:
Authorization: Bearer <token>

**Response:**
```json
{
  "userId": "uuid",
  "balances": [
    {"currency": "USD", "amount": 1000},
    {"currency": "NGN", "amount": 500000}
  ]
}
```

**Error Codes:**
- 401 Unauthorized

---

### POST /wallet/fund
**Description:** Fund wallet  
**Authentication:** Bearer Token  

**Request:**
```json
{
  "amount": 100,
  "currency": "USD",
  "method": "card"
}
```

**Response:**
```json
{
  "transactionId": "uuid",
  "status": "processing"
}
```

**Error Codes:**
- 400 Invalid amount
- 402 Payment failed

---

### POST /wallet/withdraw
**Description:** Withdraw funds  
**Authentication:** Bearer Token  

**Request:**
```json
{
  "amount": 100,
  "currency": "USD",
  "destination": "bank_account_id"
}
```

**Response:**
```json
{
  "transactionId": "uuid",
  "status": "pending"
}
```

**Error Codes:**
- 400 Invalid request
- 401 Unauthorized
- 403 KYC required

---

## Transactions

### GET /transactions
**Description:** List transactions  
**Authentication:** Bearer Token  

**Request:**
Query params:
- limit
- offset

**Response:**
```json
{
  "transactions": [
    {
      "id": "uuid",
      "type": "transfer",
      "amount": 50,
      "status": "completed"
    }
  ]
}
```

---

## Crypto

### GET /crypto/prices
**Description:** Get live crypto prices  
**Authentication:** Bearer Token  

**Response:**
```json
{
  "BTC": 65000,
  "ETH": 3200
}
```

---

### POST /crypto/trade
**Description:** Execute crypto trade  
**Authentication:** Bearer Token  

**Request:**
```json
{
  "asset": "BTC",
  "action": "buy",
  "amount": 0.01
}
```

**Response:**
```json
{
  "tradeId": "uuid",
  "status": "executed"
}
```

---

## Gift Cards

### POST /giftcards/purchase
**Description:** Purchase gift card  
**Authentication:** Bearer Token  

**Request:**
```json
{
  "brand": "Amazon",
  "value": 50,
  "currency": "USD"
}
```

**Response:**
```json
{
  "cardCode": "XXXX-XXXX",
  "status": "delivered"
}
```

---

## Virtual Cards

### POST /cards/virtual/create
**Description:** Create virtual card  
**Authentication:** Bearer Token  

**Request:**
```json
{
  "currency": "USD",
  "limit": 500
}
```

**Response:**
```json
{
  "cardId": "uuid",
  "cardNumber": "**** **** **** 1234"
}
```

---

## Bills

### POST /bills/pay
**Description:** Pay utility bill  
**Authentication:** Bearer Token  

**Request:**
```json
{
  "type": "electricity",
  "provider": "XYZ",
  "account": "123456789",
  "amount": 100
}
```

**Response:**
```json
{
  "billId": "uuid",
  "status": "paid"
}
```

---

## Rates

### GET /rates
**Description:** Get FX & crypto rates  
**Authentication:** Bearer Token  

**Response:**
```json
{
  "USD_NGN": 1500,
  "BTC_USD": 65000
}
```

---

## Notifications

### GET /notifications
**Description:** Get notifications  
**Authentication:** Bearer Token  

**Response:**
```json
{
  "notifications": [
    {
      "id": "uuid",
      "message": "Payment successful",
      "read": false
    }
  ]
}
```

---

## User Profile

### GET /user/profile
**Description:** Get user profile  
**Authentication:** Bearer Token  

**Response:**
```json
{
  "name": "John Doe",
  "email": "john@example.com"
}
```

---

## Settings

### PATCH /settings
**Description:** Update settings  
**Authentication:** Bearer Token  

**Request:**
```json
{
  "theme": "dark",
  "notifications": true
}
```

**Response:**
```json
{
  "status": "updated"
}
```
