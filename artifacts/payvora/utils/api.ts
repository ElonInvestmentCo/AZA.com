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
    throw new Error(`API ${res.status}: ${text}`);
  }

  return res.json() as Promise<T>;
}
