/**
 * SocialAuthButtons
 *
 * Wires real Google OAuth (via expo-auth-session) and Apple Sign-In
 * (via expo-apple-authentication, iOS only) into pressable buttons that
 * match the AZA light-theme design system.
 *
 * Required env var (already set in Replit Secrets):
 *   EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID — Web client ID from Google Cloud Console
 *
 * Google works in Expo Go (web-based OAuth proxy).
 * Apple works only on iOS native builds; shows disabled on Android/web.
 */

import { AntDesign } from "@expo/vector-icons";
import * as AppleAuthentication from "expo-apple-authentication";
import * as Google from "expo-auth-session/providers/google";
import * as Haptics from "expo-haptics";
import * as WebBrowser from "expo-web-browser";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
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

/* Required for expo-auth-session OAuth redirect handling */
WebBrowser.maybeCompleteAuthSession();

/* ─── Design tokens (matches the light auth theme) ──────────────────────────── */
const C = {
  google: {
    bg:      "#FFFFFF",
    border:  "#E8ECF4",
    text:    "#1E232C",
    icon:    "#4285F4",
    shadow:  "rgba(0,0,0,0.06)",
  },
  apple: {
    bg:      "#1E232C",
    border:  "#1E232C",
    text:    "#FFFFFF",
    icon:    "#FFFFFF",
    shadow:  "rgba(0,0,0,0.14)",
  },
  loading:  "#8391A1",
  error:    "#FF5B7A",
  disabled: {
    bg:     "#F7F8F9",
    border: "#E8ECF4",
    text:   "#C4C9D4",
  },
};

/* ─── Types ──────────────────────────────────────────────────────────────────── */
interface Props {
  /** Called after a successful sign-in so the parent can navigate */
  onSuccess: () => void;
  /** Optional error sink so parent can display errors centrally */
  onError?: (msg: string) => void;
}

/* ─── Animated pressable wrapper ─────────────────────────────────────────────── */
function SocialBtn({
  onPress,
  loading,
  disabled,
  bg,
  border,
  shadow,
  children,
}: {
  onPress: () => void;
  loading: boolean;
  disabled: boolean;
  bg: string;
  border: string;
  shadow: string;
  children: React.ReactNode;
}) {
  const sc = useSharedValue(1);
  const anim = useAnimatedStyle(() => ({ transform: [{ scale: sc.value }] }));
  const isDisabled = disabled || loading;

  return (
    <Animated.View style={anim}>
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
          sb.btn,
          {
            backgroundColor: isDisabled && !loading ? C.disabled.bg : bg,
            borderColor:     isDisabled && !loading ? C.disabled.border : border,
            shadowColor:     shadow,
          },
          isDisabled && sb.disabled,
        ]}
      >
        {children}
      </Pressable>
    </Animated.View>
  );
}

const sb = StyleSheet.create({
  btn: {
    height: 58,
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 3,
  },
  disabled: { opacity: 0.55 },
});

/* ─── Main component ─────────────────────────────────────────────────────────── */
export default function SocialAuthButtons({ onSuccess, onError }: Props) {
  const { loginWithSocial } = useAuth();

  const [googleLoading, setGoogleLoading] = useState(false);
  const [appleLoading,  setAppleLoading]  = useState(false);
  const [appleAvail,    setAppleAvail]    = useState(false);

  /* ── Google OAuth via expo-auth-session ──────────────────────────────────── */
  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  });

  /* Check Apple availability on mount */
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
        .then(r => r.json())
        .then(info => {
          const name  = info.name || info.given_name || "Google User";
          const email = info.email || `google_${Date.now()}@googleuser.com`;
          return loginWithSocial(email, name, "google");
        })
        .then(() => {
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

  /* ── Google press handler ─────────────────────────────────────────────────── */
  const handleGoogle = async () => {
    if (!request) {
      Alert.alert(
        "Google Sign-In",
        "Google sign-in is not configured yet.\n\nEnsure EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID is set and the redirect URI (https://auth.expo.io) is allowed in your Google Cloud Console.",
      );
      return;
    }
    setGoogleLoading(true);
    await promptAsync();
    /* setGoogleLoading(false) is handled in the response useEffect */
  };

  /* ── Apple press handler ──────────────────────────────────────────────────── */
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

      const given   = credential.fullName?.givenName  ?? "";
      const family  = credential.fullName?.familyName ?? "";
      const name    = [given, family].filter(Boolean).join(" ") || "Apple User";
      const email   = credential.email ?? `apple_${credential.user}@privaterelay.appleid.com`;

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

  /* ── Responsive width — ensures buttons fill any screen ──────────────────── */
  const { width } = Dimensions.get("window");
  const btnW = (width - 48 - 12) / 2; /* 24px padding each side, 12px gap */

  const appleDisabled = Platform.OS !== "ios" || !appleAvail;

  return (
    <Animated.View entering={FadeIn.duration(220)} style={ss.container}>
      {/* Google */}
      <View style={[ss.btnWrap, { width: btnW }]}>
        <SocialBtn
          onPress={handleGoogle}
          loading={googleLoading}
          disabled={false}
          bg={C.google.bg}
          border={C.google.border}
          shadow={C.google.shadow}
        >
          {googleLoading ? (
            <ActivityIndicator size="small" color={C.loading} />
          ) : (
            <>
              <AntDesign name="google" size={20} color={C.google.icon} />
              <Text style={[ss.btnText, { color: C.google.text }]}>Google</Text>
            </>
          )}
        </SocialBtn>
      </View>

      {/* Apple */}
      <View style={[ss.btnWrap, { width: btnW }]}>
        <SocialBtn
          onPress={handleApple}
          loading={appleLoading}
          disabled={appleDisabled}
          bg={appleDisabled ? C.disabled.bg : C.apple.bg}
          border={appleDisabled ? C.disabled.border : C.apple.border}
          shadow={C.apple.shadow}
        >
          {appleLoading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              <AntDesign
                name="apple1"
                size={20}
                color={appleDisabled ? C.disabled.text : C.apple.icon}
              />
              <Text
                style={[
                  ss.btnText,
                  { color: appleDisabled ? C.disabled.text : C.apple.text },
                ]}
              >
                Apple
              </Text>
            </>
          )}
        </SocialBtn>
      </View>
    </Animated.View>
  );
}

const ss = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 12,
    alignItems: "stretch",
  },
  btnWrap: {
    flex: 1,
  },
  btnText: {
    fontSize: 15,
    fontFamily: "Manrope_600SemiBold",
    letterSpacing: 0.1,
  },
});
