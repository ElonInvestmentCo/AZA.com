import { Platform } from "react-native";

/**
 * Resolves the API base URL in priority order:
 *
 * 1. EXPO_PUBLIC_API_URL      — explicit override (Railway service URL, etc.)
 * 2. EXPO_PUBLIC_DOMAIN       — derive as https://<domain>/api-server
 * 3. Web platform (no vars)   — relative path "/api-server" (same-origin)
 * 4. __DEV__ native           — localhost dev server
 * 5. Production native catch  — hard-coded production origin as last resort
 */
function getApiBaseUrl(): string {
  const explicit = process.env.EXPO_PUBLIC_API_URL;
  if (explicit) return explicit.replace(/\/$/, "");

  const rawDomain = process.env.EXPO_PUBLIC_DOMAIN;
  if (rawDomain) {
    const host = rawDomain.replace(/^https?:\/\//, "").replace(/\/$/, "");
    return `https://${host}/api-server`;
  }

  if (Platform.OS === "web") return "/api-server";

  if (__DEV__) return "http://localhost:8080";

  /* Production native build with no env vars — should not happen but
     provides a safe fallback so the app doesn't silently break. */
  return "https://www.payvora.org/api-server";
}

export const API_BASE_URL = getApiBaseUrl();

export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}/api${path}`;
  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers ?? {}),
    },
    ...options,
  });

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

/** Finds the best-matching Reloadly biller for a locally-known provider name. */
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
