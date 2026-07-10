import { Stack, useRouter, useSegments } from "expo-router";
import React, { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

export default function AuthLayout() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  // "face-id" is reachable both from the pre-login auth flow AND from an
  // already-authenticated user opening Settings → Biometrics. Only bounce
  // authenticated users out of the *login/register* screens — don't kick
  // them out of a screen they navigated to on purpose.
  const currentScreen = segments[segments.length - 1];
  const isExemptFromRedirect = currentScreen === "face-id";

  useEffect(() => {
    if (!isLoading && isAuthenticated && !isExemptFromRedirect) {
      router.replace("/(tabs)");
    }
  }, [isAuthenticated, isLoading, isExemptFromRedirect]);

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
