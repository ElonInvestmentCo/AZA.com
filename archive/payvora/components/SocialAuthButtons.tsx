/**
 * SocialAuthButtons — Payvora dark-fintech flavour
 *
 * Wires real Google OAuth (expo-auth-session) and Apple Sign-In
 * (expo-apple-authentication, iOS only) to Payvora's AuthContext.
 *
 * Required env var:
 *   EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID — Web client ID from Google Cloud Console
 *
 * Redirect URIs to register in Google Cloud Console:
 *   • https://auth.expo.io/@payvora/payvora  (Expo Go dev)
 *   • https://www.payvora.org               (web production)
 *   • payvora://auth/google                 (iOS/Android production)
 *
 * Google works in Expo Go via the hosted auth proxy.
 * Apple works on iOS native only; shows an informative alert on Android/web.
 */

import { AntDesign, Ionicons } from "@expo/vector-icons";
import * as AppleAuthentication from "expo-apple-authentication";
import { makeRedirectUri } from "expo-auth-session";
import * as Google from "expo-auth-session/providers/google";
import * as Haptics from "expo-haptics";
import * as WebBrowser from "expo-web-browser";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, {
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useAuth } from "@/context/AuthContext";

WebBrowser.maybeCompleteAuthSession();

/* ─── Design tokens (Payvora dark fintech palette) ──────────────────────── */
const C = {
  google: {
    bg:     "#12121A",
    border: "#2A2A3A",
    text:   "#FFFFFF",
    icon:   "#4285F4",
  },
  apple: {
    bg:     "#12121A",
    border: "#2A2A3A",
    text:   "#FFFFFF",
    icon:   "#FFFFFF",
  },
  disabled: {
    bg:     "#0F0F17",
    border: "#1F2028",
    text:   "#3A3A4A",
    icon:   "#3A3A4A",
  },
  loading: "#6B7280",
};

/* ─── Types ──────────────────────────────────────────────────────────────── */
interface Props {
  onSuccess: () => void;
  onError?: (msg: string) => void;
}

/* ─── Animated pressable ─────────────────────────────────────────────────── */
function SocialBtn({
  onPress,
  loading,
  disabled,
  bg,
  border,
  children,
}: {
  onPress: () => void;
  loading: boolean;
  disabled: boolean;
  bg: string;
  border: string;
  children: React.ReactNode;
}) {
  const sc = useSharedValue(1);
  const anim = useAnimatedStyle(() => ({ transform: [{ scale: sc.value }] }));
  const isDisabled = disabled || loading;

  return (
    <Animated.View style={[anim, { flex: 1 }]}>
      <Pressable
        onPress={onPress}
        onPressIn={() => {
          if (isDisabled) return;
          sc.value = withSpring(0.96, { damping: 13, stiffness: 300 });
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }}
        onPressOut={() => {
          sc.value = withSpring(1, { damping: 13, stiffness: 300 });
        }}
        disabled={isDisabled}
        style={[
          styles.btn,
          { backgroundColor: bg, borderColor: border },
          isDisabled && styles.btnDisabled,
        ]}
      >
        {children}
      </Pressable>
    </Animated.View>
  );
}

/* ─── Main component ─────────────────────────────────────────────────────── */
export default function SocialAuthButtons({ onSuccess, onError }: Props) {
  const { loginWithSocial } = useAuth();

  const [googleLoading, setGoogleLoading] = useState(false);
  const [appleLoading,  setAppleLoading]  = useState(false);
  const [appleAvail,    setAppleAvail]    = useState(false);

  /* ── Google OAuth ─────────────────────────────────────────────────────── */
  /*
   * Redirect URI strategy:
   *   - Native builds: payvora://auth/google  (custom scheme)
   *   - Web builds:    https://www.payvora.org/auth/google (set via EXPO_PUBLIC_DOMAIN)
   *   - Expo Go:       expo-auth-session falls back to the auth proxy automatically
   *
   * Register ALL of these in Google Cloud Console → Authorized redirect URIs.
   */
  const redirectUri = makeRedirectUri({
    scheme: "payvora",
    path: "auth/google",
  });

  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    redirectUri,
  });

  /* Check Apple availability on mount (iOS only) */
  useEffect(() => {
    if (Platform.OS === "ios") {
      AppleAuthentication.isAvailableAsync()
        .then(setAppleAvail)
        .catch(() => setAppleAvail(false));
    }
  }, []);

  /* Handle Google OAuth response */
  useEffect(() => {
    if (!response) return;

    if (response.type === "success") {
      const token = response.authentication?.accessToken;
      if (!token) {
        setGoogleLoading(false);
        const msg = "Google sign-in failed — no access token received.";
        onError?.(msg);
        return;
      }

      fetch("https://www.googleapis.com/userinfo/v2/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((r) => r.json())
        .then(async (info) => {
          const name  = info.name || info.given_name || "Google User";
          const email = info.email || `google_${Date.now()}@googleuser.com`;
          await loginWithSocial(email, name, "google");
          setGoogleLoading(false);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          onSuccess();
        })
        .catch(() => {
          setGoogleLoading(false);
          const msg = "Could not fetch your Google profile. Please try again.";
          onError?.(msg);
          Alert.alert("Google Sign-In", msg);
        });
    } else if (response.type === "error") {
      setGoogleLoading(false);
      const msg = response.error?.message ?? "Google sign-in failed. Please try again.";
      onError?.(msg);
    } else if (response.type === "cancel" || response.type === "dismiss") {
      setGoogleLoading(false);
    }
  }, [response]);

  /* ── Google press handler ─────────────────────────────────────────────── */
  const handleGoogle = async () => {
    if (!request) {
      Alert.alert(
        "Google Sign-In",
        "Google sign-in is not configured.\n\nEnsure EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID is set in Replit Secrets.",
      );
      return;
    }
    setGoogleLoading(true);
    await promptAsync();
  };

  /* ── Apple press handler ──────────────────────────────────────────────── */
  const handleApple = async () => {
    if (Platform.OS !== "ios" || !appleAvail) {
      Alert.alert(
        "Apple Sign-In",
        "Sign in with Apple is only available on iOS devices.",
      );
      return;
    }
    setAppleLoading(true);
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      const given  = credential.fullName?.givenName  ?? "";
      const family = credential.fullName?.familyName ?? "";
      const name   = [given, family].filter(Boolean).join(" ") || "Apple User";
      const email  = credential.email ?? `apple_${credential.user}@privaterelay.appleid.com`;

      await loginWithSocial(email, name, "apple");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      onSuccess();
    } catch (err: any) {
      if (err?.code !== "ERR_REQUEST_CANCELED") {
        const msg = "Apple Sign-In failed. Please try again.";
        onError?.(msg);
        Alert.alert("Apple Sign-In", msg);
      }
    } finally {
      setAppleLoading(false);
    }
  };

  const appleDisabled = Platform.OS !== "ios" || !appleAvail;

  return (
    <View style={styles.container}>
      {/* Google */}
      <SocialBtn
        onPress={handleGoogle}
        loading={googleLoading}
        disabled={false}
        bg={C.google.bg}
        border={C.google.border}
      >
        {googleLoading ? (
          <ActivityIndicator size="small" color={C.loading} />
        ) : (
          <>
            <AntDesign name="google" size={20} color={C.google.icon} />
            <Text style={[styles.btnText, { color: C.google.text }]}>Google</Text>
          </>
        )}
      </SocialBtn>

      {/* Apple */}
      <SocialBtn
        onPress={handleApple}
        loading={appleLoading}
        disabled={appleDisabled}
        bg={appleDisabled ? C.disabled.bg : C.apple.bg}
        border={appleDisabled ? C.disabled.border : C.apple.border}
      >
        {appleLoading ? (
          <ActivityIndicator size="small" color={C.loading} />
        ) : (
          <>
            <Ionicons
              name="logo-apple"
              size={20}
              color={appleDisabled ? C.disabled.icon : C.apple.icon}
            />
            <Text
              style={[
                styles.btnText,
                { color: appleDisabled ? C.disabled.text : C.apple.text },
              ]}
            >
              Apple
            </Text>
          </>
        )}
      </SocialBtn>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 12,
  },
  btn: {
    height: 56,
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  btnDisabled: {
    opacity: 0.45,
  },
  btnText: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 0.1,
  },
});
