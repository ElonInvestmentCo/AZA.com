import { useEffect, useRef, useState } from "react";
import { apiFetch } from "@/utils/api";

interface LiveBalanceResult {
  balance: number | null;
  loading: boolean;
  error: Error | null;
}

/**
 * useLiveBalance
 *
 * Polls the JWT API for the current wallet balance every 15 seconds.
 * Falls back to null gracefully if the user is unauthenticated.
 */
export function useLiveBalance(): LiveBalanceResult {
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchBalance = async () => {
    try {
      const data = await apiFetch<{
        wallet: { balanceKobo: number; currency: string } | null;
      }>("/auth/me");
      setBalance(data.wallet ? data.wallet.balanceKobo : null);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch balance"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBalance();
    intervalRef.current = setInterval(fetchBalance, 15_000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return { balance, loading, error };
}
