import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

export interface Transaction {
  id: string;
  type: "send" | "receive" | "trade" | "topup";
  title: string;
  subtitle: string;
  amount: number;
  currency: string;
  timestamp: string;
  status: "completed" | "pending" | "failed";
  icon: string;
}

export interface CryptoHolding {
  symbol: string;
  name: string;
  amount: number;
  valueUSD: number;
  change24h: number;
  price: number;
  color: string;
}

interface WalletContextType {
  balance: number;
  cryptoHoldings: CryptoHolding[];
  transactions: Transaction[];
  totalPortfolioValue: number;
  addTransaction: (tx: Omit<Transaction, "id" | "timestamp">) => void;
}

const WalletContext = createContext<WalletContextType | null>(null);

const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: "1",
    type: "receive",
    title: "Salary Deposit",
    subtitle: "Bank Transfer",
    amount: 4200.0,
    currency: "USD",
    timestamp: new Date(Date.now() - 1 * 86400000).toISOString(),
    status: "completed",
    icon: "arrow-down-circle",
  },
  {
    id: "2",
    type: "trade",
    title: "Bought BTC",
    subtitle: "Market Order",
    amount: -800.0,
    currency: "USD",
    timestamp: new Date(Date.now() - 2 * 86400000).toISOString(),
    status: "completed",
    icon: "repeat",
  },
  {
    id: "3",
    type: "send",
    title: "Sent to Alex",
    subtitle: "Personal Transfer",
    amount: -250.0,
    currency: "USD",
    timestamp: new Date(Date.now() - 3 * 86400000).toISOString(),
    status: "completed",
    icon: "arrow-up-circle",
  },
  {
    id: "4",
    type: "topup",
    title: "Top Up",
    subtitle: "Visa •••• 4242",
    amount: 1000.0,
    currency: "USD",
    timestamp: new Date(Date.now() - 5 * 86400000).toISOString(),
    status: "completed",
    icon: "plus-circle",
  },
  {
    id: "5",
    type: "receive",
    title: "Refund",
    subtitle: "Netflix",
    amount: 15.99,
    currency: "USD",
    timestamp: new Date(Date.now() - 7 * 86400000).toISOString(),
    status: "completed",
    icon: "arrow-down-circle",
  },
  {
    id: "6",
    type: "send",
    title: "Subscription",
    subtitle: "Spotify Premium",
    amount: -9.99,
    currency: "USD",
    timestamp: new Date(Date.now() - 8 * 86400000).toISOString(),
    status: "completed",
    icon: "arrow-up-circle",
  },
];

const CRYPTO_HOLDINGS: CryptoHolding[] = [
  {
    symbol: "BTC",
    name: "Bitcoin",
    amount: 0.0142,
    valueUSD: 943.28,
    change24h: 2.34,
    price: 66428.17,
    color: "#F7931A",
  },
  {
    symbol: "ETH",
    name: "Ethereum",
    amount: 0.412,
    valueUSD: 1284.56,
    change24h: -1.12,
    price: 3118.35,
    color: "#627EEA",
  },
  {
    symbol: "SOL",
    name: "Solana",
    amount: 8.5,
    valueUSD: 1342.42,
    change24h: 5.67,
    price: 157.93,
    color: "#9945FF",
  },
];

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [balance, setBalance] = useState(12450.32);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [cryptoHoldings] = useState<CryptoHolding[]>(CRYPTO_HOLDINGS);

  const totalPortfolioValue = balance + cryptoHoldings.reduce((s, h) => s + h.valueUSD, 0);

  function addTransaction(tx: Omit<Transaction, "id" | "timestamp">) {
    const newTx: Transaction = {
      ...tx,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
    };
    setTransactions((prev) => [newTx, ...prev]);
    if (tx.amount > 0) {
      setBalance((prev) => prev + tx.amount);
    } else {
      setBalance((prev) => prev + tx.amount);
    }
  }

  return (
    <WalletContext.Provider
      value={{
        balance,
        cryptoHoldings,
        transactions,
        totalPortfolioValue,
        addTransaction,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWallet must be used within WalletProvider");
  return ctx;
}
