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
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AuthProvider } from "@/context/AuthContext";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

const RAW_ASSETS = [
  require("@/assets/images/fingerprint.png"),
  require("@/assets/images/3d_avatar_16.png"),
  require("@/assets/images/lkd.png"),
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
      await SplashScreen.hideAsync();
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
              Platform.OS === "web" && { backgroundColor: "#F0F2F8" } as any,
            ]}
            onLayout={onLayoutReady}
          >
            <View style={webContainerStyle}>
              <KeyboardProvider>
                <AuthProvider>
                  <RootLayoutNav />
                </AuthProvider>
              </KeyboardProvider>
            </View>
          </GestureHandlerRootView>
        </QueryClientProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}

const webContainerStyle = Platform.select({
  web: {
    flex: 1,
    maxWidth: 430,
    width: "100%" as const,
    alignSelf: "center" as const,
    overflow: "hidden" as const,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.08,
    shadowRadius: 40,
  },
  default: { flex: 1 },
});
