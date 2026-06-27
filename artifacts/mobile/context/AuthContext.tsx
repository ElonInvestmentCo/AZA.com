import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

interface User {
  name: string;
  email: string;
  balance: number;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  loginWithSocial: (email: string, name: string, provider: string) => Promise<void>;
  logout: () => void;
  updateBalance: (amount: number) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => false,
  register: async () => false,
  loginWithSocial: async () => {},
  logout: () => {},
  updateBalance: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const restore = async () => {
      try {
        const stored = await AsyncStorage.getItem("payvora_user");
        if (stored) setUser(JSON.parse(stored));
      } catch {}
      setIsLoading(false);
    };
    restore();
  }, []);

  const login = useCallback(async (email: string, _password: string) => {
    const u: User = { name: "Dove", email, balance: 200590 };
    setUser(u);
    await AsyncStorage.setItem("payvora_user", JSON.stringify(u));
    return true;
  }, []);

  const register = useCallback(
    async (name: string, email: string, _password: string) => {
      const u: User = { name, email, balance: 0 };
      setUser(u);
      await AsyncStorage.setItem("payvora_user", JSON.stringify(u));
      return true;
    },
    []
  );

  const loginWithSocial = useCallback(
    async (email: string, name: string, _provider: string) => {
      const u: User = { name: name || email.split("@")[0], email, balance: 200590 };
      setUser(u);
      await AsyncStorage.setItem("payvora_user", JSON.stringify(u));
    },
    []
  );

  const logout = useCallback(async () => {
    setUser(null);
    await AsyncStorage.removeItem("payvora_user");
  }, []);

  const updateBalance = useCallback(
    async (amount: number) => {
      if (!user) return;
      const updated = { ...user, balance: user.balance + amount };
      setUser(updated);
      await AsyncStorage.setItem("payvora_user", JSON.stringify(updated));
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
