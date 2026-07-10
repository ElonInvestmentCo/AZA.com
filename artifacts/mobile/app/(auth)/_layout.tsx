import { Stack, useRouter, useSegments } from "expo-router";
import React, { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

export default function AuthLayout() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  // Several screens in this (auth) group are reachable both from the
  // pre-login auth flow AND from an already-authenticated user opening
  // them from Settings ("face-id" via Biometrics, "forgot-password" /
  // "new-password" / "password-changed" via Change Password). Only bounce
  // authenticated users out of the *login/register* screens — don't kick
  // them out of a screen they navigated to on purpose. Without this
  // exemption, opening Settings → Change Password immediately triggered
  // this effect and replaced the stack with "/(tabs)" before the user
  // could type anything.
  const currentScreen = segments[segments.length - 1];
  const EXEMPT_SCREENS = new Set([
    "face-id",
    "forgot-password",
    "new-password",
    "password-changed",
  ]);
  const isExemptFromRedirect = EXEMPT_SCREENS.has(currentScreen as string);

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
