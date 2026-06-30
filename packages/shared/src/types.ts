export interface User {
  id: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  phone?: string;
  kycVerified: boolean;
  createdAt: string;
}

export interface Wallet {
  id: string;
  userId: string;
  balanceNgn: number;
  balanceUsd: number;
  currency: "NGN" | "USD";
}

export type TransactionType =
  | "gift_card_sale"
  | "bill_payment"
  | "airtime"
  | "data"
  | "wallet_fund"
  | "wallet_withdraw"
  | "virtual_card";

export type TransactionStatus = "pending" | "processing" | "completed" | "failed" | "reversed";

export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  status: TransactionStatus;
  amountNgn: number;
  description: string;
  reference: string;
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, unknown>;
}

export interface GiftCard {
  id: string;
  category: GiftCardCategory;
  country: GiftCardCountry;
  type: "physical" | "ecode";
  denominationUsd: number;
  rateNgn: number;
  cardCode?: string;
  pin?: string;
  images?: string[];
}

export type GiftCardCategory =
  | "amazon"
  | "apple"
  | "google_play"
  | "steam"
  | "itunes"
  | "walmart"
  | "target"
  | "ebay"
  | "nordstrom"
  | "sephora"
  | "nike"
  | "other";

export type GiftCardCountry = "US" | "UK" | "CA" | "AU" | "EU" | "OTHER";

export interface GiftCardTrade {
  id: string;
  userId: string;
  giftCard: GiftCard;
  status: "pending" | "reviewing" | "approved" | "rejected";
  payoutNgn: number;
  createdAt: string;
  reviewedAt?: string;
  rejectionReason?: string;
}

export interface BillPayment {
  id: string;
  userId: string;
  billType: BillType;
  provider: string;
  accountNumber: string;
  amountNgn: number;
  status: TransactionStatus;
  createdAt: string;
}

export type BillType =
  | "electricity"
  | "water"
  | "cable_tv"
  | "internet"
  | "education"
  | "government";

export interface AirtimeTopUp {
  id: string;
  userId: string;
  network: MobileNetwork;
  phoneNumber: string;
  amountNgn: number;
  status: TransactionStatus;
  createdAt: string;
}

export type MobileNetwork = "MTN" | "Airtel" | "Glo" | "9mobile";

export interface DataBundle {
  id: string;
  network: MobileNetwork;
  sizeGb: number;
  durationDays: number;
  priceNgn: number;
}

export interface VirtualCard {
  id: string;
  userId: string;
  cardNumber: string;
  expiryMonth: number;
  expiryYear: number;
  cvv: string;
  balanceUsd: number;
  status: "active" | "frozen" | "terminated";
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  perPage: number;
  hasMore: boolean;
}
