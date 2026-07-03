import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { apiFetch, AUTH_TOKEN_KEY } from "@/utils/api";

interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string | null;
  balance: number;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  loginWithSocial: (token: string, provider: "google" | "apple", userInfo?: { name?: string; email?: string }) => Promise<void>;
  logout: () => void;
  updateBalance: (amount: number) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => false,
  register: async () => false,
  loginWithSocial: async (_token, _provider, _userInfo) => {},
  logout: () => {},
  updateBalance: () => {},
});

const USER_KEY = "payvora_user";

async function saveSession(token: string, user: User) {
  await Promise.all([
    AsyncStorage.setItem(AUTH_TOKEN_KEY, token),
    AsyncStorage.setItem(USER_KEY, JSON.stringify(user)),
  ]);
}

async function clearSession() {
  await Promise.all([
    AsyncStorage.removeItem(AUTH_TOKEN_KEY),
    AsyncStorage.removeItem(USER_KEY),
  ]);
}

interface ApiUser {
  id: string;
  email: string;
  fullName: string | null;
  avatarUrl: string | null;
}

interface WalletData {
  balanceKobo: number;
  currency: string;
}

function toUser(apiUser: ApiUser, wallet: WalletData | null): User {
  return {
    id: apiUser.id,
    email: apiUser.email,
    name: apiUser.fullName ?? apiUser.email.split("@")[0],
    avatarUrl: apiUser.avatarUrl,
    balance: wallet ? wallet.balanceKobo : 0,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const restore = async () => {
      try {
        const [token, stored] = await Promise.all([
          AsyncStorage.getItem(AUTH_TOKEN_KEY),
          AsyncStorage.getItem(USER_KEY),
        ]);

        if (token && stored) {
          setUser(JSON.parse(stored));
          apiFetch<{ user: ApiUser; wallet: WalletData | null }>("/auth/me")
            .then(({ user: u, wallet }) => {
              const refreshed = toUser(u, wallet);
              setUser(refreshed);
              AsyncStorage.setItem(USER_KEY, JSON.stringify(refreshed));
            })
            .catch(() => {});
        }
      } catch {}
      setIsLoading(false);
    };
    restore();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const { token, user: apiUser } = await apiFetch<{
        token: string;
        user: ApiUser;
      }>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);

      const { wallet } = await apiFetch<{ user: ApiUser; wallet: WalletData | null }>("/auth/me");

      const u = toUser(apiUser, wallet);
      setUser(u);
      await saveSession(token, u);
      return true;
    } catch {
      return false;
    }
  }, []);

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      try {
        const { token, user: apiUser } = await apiFetch<{
          token: string;
          user: ApiUser;
        }>("/auth/register", {
          method: "POST",
          body: JSON.stringify({ fullName: name, email, password }),
        });

        const u = toUser(apiUser, null);
        setUser(u);
        await saveSession(token, u);
        return true;
      } catch {
        return false;
      }
    },
    []
  );

  const loginWithSocial = useCallback(
    async (oauthToken: string, provider: "google" | "apple", userInfo?: { name?: string; email?: string }) => {
      const endpoint = provider === "apple" ? "/auth/apple" : "/auth/google";
      const body =
        provider === "apple"
          ? { identityToken: oauthToken, ...userInfo }
          : { accessToken: oauthToken };

      const { token, user: apiUser } = await apiFetch<{
        token: string;
        user: ApiUser;
      }>(endpoint, {
        method: "POST",
        body: JSON.stringify(body),
      });

      await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
      const { wallet } = await apiFetch<{ user: ApiUser; wallet: WalletData | null }>("/auth/me");

      const u = toUser(apiUser, wallet);
      setUser(u);
      await saveSession(token, u);
    },
    []
  );

  const logout = useCallback(async () => {
    apiFetch("/auth/logout", { method: "POST" }).catch(() => {});
    setUser(null);
    await clearSession();
  }, []);

  const updateBalance = useCallback(
    async (amount: number) => {
      if (!user) return;
      const updated = { ...user, balance: user.balance + amount };
      setUser(updated);
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(updated));
    },
    [user]
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        loginWithSocial,
        logout,
        updateBalance,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
