import { Stack, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

export default function AuthLayout() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("/(tabs)");
    }
  }, [isAuthenticated, isLoading]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="otp" />
      <Stack.Screen name="face-id" />
      <Stack.Screen name="forgot-password" />
      <Stack.Screen name="new-password" />
      <Stack.Screen name="password-changed" />
    </Stack>
  );
}
