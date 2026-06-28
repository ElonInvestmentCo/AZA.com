import {
  Manrope_400Regular,
  Manrope_500Medium,
  Manrope_600SemiBold,
  Manrope_700Bold,
  useFonts,
} from "@expo-google-fonts/manrope";
import { Image } from "expo-image";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useCallback, useEffect, useState } from "react";
import { Image as RNImage, Platform, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AuthProvider } from "@/context/AuthContext";
import { NotificationsProvider } from "@/context/NotificationsContext";

/* ── Keyboard controller availability (checked once at module load) ───────── */
let KeyboardProviderComponent: React.ComponentType<{ children: React.ReactNode }> | null = null;
try {
  KeyboardProviderComponent = require("react-native-keyboard-controller").KeyboardProvider;
} catch {
  KeyboardProviderComponent = null;
}

// Splash screen is only managed on native — skip entirely on web
if (Platform.OS !== "web") {
  SplashScreen.preventAutoHideAsync();
}

const queryClient = new QueryClient();

const RAW_ASSETS = [
  require("@/assets/images/fingerprint.png"),
  require("@/assets/images/3d_avatar_16.png"),
  require("@/assets/images/slide1.png"),
  require("@/assets/images/slide3.png"),
  require("@/assets/images/gift-card.png"),
  require("@/assets/images/gift-card-visa.png"),
  require("@/assets/images/man-illustration.png"),
  require("@/assets/images/onboard-portfolio.png"),
  require("@/assets/images/onboard-card.png"),
  require("@/assets/images/onboard-esim.png"),
  require("@/assets/images/didnt-received-code.png"),
  require("@/assets/images/resend.png"),
  require("@/assets/images/icon.png"),
];

async function preloadAssets() {
  try {
    const uris = RAW_ASSETS
      .map(src => {
        try { return RNImage.resolveAssetSource(src)?.uri; }
        catch { return null; }
      })
      .filter((uri): uri is string => !!uri);

    if (uris.length > 0) {
      await Image.prefetch(uris, "memory-disk");
    }
  } catch {
    // Non-fatal — app works fine without pre-warming
  }
}

/* ── Safe KeyboardProvider wrapper ─────────────────────────────────────────
   react-native-keyboard-controller may not be available in all environments.
   The module availability is checked once at module load (above), never
   inside the render path, so React's reconciler sees a stable component tree. */
function SafeKeyboardProvider({ children }: { children: React.ReactNode }) {
  if (KeyboardProviderComponent) {
    return <KeyboardProviderComponent>{children}</KeyboardProviderComponent>;
  }
  return <>{children}</>;
}

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="(app)" />
    </Stack>
  );
}

export default function RootLayout() {
  const [assetsReady, setAssetsReady] = useState(false);

  const [fontsLoaded, fontError] = useFonts({
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_600SemiBold,
    Manrope_700Bold,
  });

  useEffect(() => {
    preloadAssets().finally(() => setAssetsReady(true));
  }, []);

  const onLayoutReady = useCallback(async () => {
    if ((fontsLoaded || fontError) && assetsReady) {
      if (Platform.OS !== "web") {
        await SplashScreen.hideAsync();
      }
    }
  }, [fontsLoaded, fontError, assetsReady]);

  if ((!fontsLoaded && !fontError) || !assetsReady) return null;

  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <GestureHandlerRootView
            style={[
              { flex: 1 },
              Platform.OS === "web" && webOuterStyle as any,
            ]}
            onLayout={onLayoutReady}
          >
            <View style={webContainerStyle}>
              <SafeKeyboardProvider>
                <AuthProvider>
                  <NotificationsProvider>
                    <RootLayoutNav />
                  </NotificationsProvider>
                </AuthProvider>
              </SafeKeyboardProvider>
            </View>
          </GestureHandlerRootView>
        </QueryClientProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}

/* ── Web outer background ── */
const webOuterStyle = {
  backgroundColor: "#FFFFFF",
};

/* ── Web container (full width, no phone frame) ── */
const webContainerStyle = Platform.select({
  web: {
    flex: 1,
    width: "100%" as const,
    overflow: "hidden" as const,
  } as any,
  default: { flex: 1 },
});
