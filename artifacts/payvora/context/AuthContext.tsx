import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
  joinedAt: string;
}

interface AuthContextType {
  user: User | null;
  hasSeenOnboarding: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  completeOnboarding: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const STORAGE_KEYS = {
  USER: "payvora_user",
  ONBOARDING: "payvora_onboarding",
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStoredAuth();
  }, []);

  async function loadStoredAuth() {
    try {
      const [storedUser, onboarding] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.USER),
        AsyncStorage.getItem(STORAGE_KEYS.ONBOARDING),
      ]);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else if (__DEV__ && typeof window !== "undefined") {
        const demoUser: User = { id: "demo", name: "Dove Johnson", email: "dove@payvora.app", joinedAt: new Date().toISOString() };
        setUser(demoUser);
        setHasSeenOnboarding(true);
      }
      if (onboarding === "true") setHasSeenOnboarding(true);
    } catch {
    } finally {
      setIsLoading(false);
    }
  }

  async function login(email: string, _password: string) {
    const newUser: User = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      name: email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      email,
      joinedAt: new Date().toISOString(),
    };
    await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(newUser));
    setUser(newUser);
  }

  async function register(name: string, email: string, _password: string) {
    const newUser: User = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      name,
      email,
      joinedAt: new Date().toISOString(),
    };
    await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(newUser));
    setUser(newUser);
  }

  async function logout() {
    await AsyncStorage.removeItem(STORAGE_KEYS.USER);
    setUser(null);
  }

  async function completeOnboarding() {
    await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDING, "true");
    setHasSeenOnboarding(true);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        hasSeenOnboarding,
        isLoading,
        login,
        register,
        logout,
        completeOnboarding,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
