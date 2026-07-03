import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AUTH_TOKEN_KEY = "payvora_token";

/**
 * Resolves the API base URL in priority order:
 *
 * 1. EXPO_PUBLIC_API_URL  — explicit override (e.g. direct Railway API service URL)
 * 2. EXPO_PUBLIC_DOMAIN   — production domain (proxied through Next.js at /api/*)
 * 3. Web platform         — relative path (same-origin Next.js proxy)
 * 4. __DEV__ native       — localhost dev server
 * 5. Production fallback  — hard-coded production origin
 */
function getApiBaseUrl(): string {
  const explicit = process.env.EXPO_PUBLIC_API_URL;
  if (explicit) return explicit.replace(/\/$/, "");

  const rawDomain = process.env.EXPO_PUBLIC_DOMAIN;
  if (rawDomain) {
    const host = rawDomain.replace(/^https?:\/\//, "").replace(/\/$/, "");
    return `https://${host}`;
  }

  if (Platform.OS === "web") return "";

  if (__DEV__) return "http://localhost:8080";

  return "https://www.payvora.org";
}

export const API_BASE_URL = getApiBaseUrl();

export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}/api${path}`;

  const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY).catch(() => null);

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options?.headers as Record<string, string> ?? {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(url, { ...options, headers });

  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    let message = text;
    try {
      const parsed = JSON.parse(text);
      if (parsed?.error) message = parsed.error;
    } catch {
      /* not JSON, keep raw text */
    }
    throw new Error(message || `API ${res.status}`);
  }

  return res.json() as Promise<T>;
}

export interface ReloadlyBiller {
  id: number;
  name: string;
  countryCode?: string;
  type?: string;
  serviceType?: string;
}

export type BillerType =
  | "ELECTRICITY_BILL_PAYMENT"
  | "CABLE_TV_BILL_PAYMENT"
  | "INTERNET_BILL_PAYMENT"
  | "BETTING_BILL_PAYMENT";

export async function fetchBillers(type: BillerType): Promise<ReloadlyBiller[]> {
  const data = await apiFetch<{ billers: ReloadlyBiller[] }>(
    `/bills/billers?type=${type}&countryISOCode=NG`,
  );
  return data.billers;
}

export interface PayBillResult {
  id: number;
  status: string;
  referenceId: string;
  code: string;
  message: string;
}

export async function payBill(params: {
  billerId: number;
  subscriberAccountNumber: string;
  amount: number;
  referenceId: string;
}): Promise<PayBillResult> {
  return apiFetch<PayBillResult>("/bills/pay", {
    method: "POST",
    body: JSON.stringify(params),
  });
}

export function matchBiller(
  billers: ReloadlyBiller[],
  nameHints: string[],
  serviceType?: "PREPAID" | "POSTPAID",
): ReloadlyBiller | null {
  const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
  const hints = nameHints.map(normalize).filter(Boolean);

  const candidates = billers.filter((b) => {
    const name = normalize(b.name);
    return hints.some((h) => name.includes(h));
  });

  if (candidates.length === 0) return null;
  if (!serviceType) return candidates[0] ?? null;

  const exact = candidates.find((b) => b.serviceType === serviceType);
  return exact ?? candidates[0] ?? null;
}
