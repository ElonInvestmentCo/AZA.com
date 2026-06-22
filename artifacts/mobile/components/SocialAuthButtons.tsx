/**
 * SocialAuthButtons — Google OAuth + Apple Sign-In for AZA.
 *
 * Required env var: EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID
 * Optional env var: EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID (for native iOS builds;
 *   falls back to webClientId in Expo Go / development).
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

WebBrowser.maybeCompleteAuthSession();

const C = {
  google:  { bg: "#FFFFFF", border: "#E8ECF4", text: "#1E232C", icon: "#4285F4", shadow: "rgba(0,0,0,0.06)" },
  apple:   { bg: "#1E232C", border: "#1E232C", text: "#FFFFFF", icon: "#FFFFFF", shadow: "rgba(0,0,0,0.14)" },
  loading: "#8391A1",
  error:   "#FF5B7A",
  disabled:{ bg: "#F7F8F9", border: "#E8ECF4", text: "#C4C9D4" },
};

interface Props {
  onSuccess: () => void;
  onError?:  (msg: string) => void;
}

function SocialBtn({ onPress, loading, disabled, bg, border, shadow, children }: {
  onPress: () => void; loading: boolean; disabled: boolean;
  bg: string; border: string; shadow: string; children: React.ReactNode;
}) {
  const sc   = useSharedValue(1);
  const anim = useAnimatedStyle(() => ({ transform: [{ scale: sc.value }] }));
  const off  = disabled || loading;

  return (
    <Animated.View style={anim}>
      <Pressable
        onPress={onPress}
        onPressIn={() => {
          if (off) return;
          sc.value = withSpring(0.96, { damping: 13, stiffness: 300 });
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }}
        onPressOut={() => { sc.value = withSpring(1, { damping: 13, stiffness: 300 }); }}
        disabled={off}
        style={[sb.btn, { backgroundColor: off && !loading ? C.disabled.bg : bg, borderColor: off && !loading ? C.disabled.border : border, shadowColor: shadow }, off && sb.disabled]}
      >
        {children}
      </Pressable>
    </Animated.View>
  );
}

const sb = StyleSheet.create({
  btn:      { height: 58, borderRadius: 14, borderWidth: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 12, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 1, shadowRadius: 6, elevation: 3 },
  disabled: { opacity: 0.55 },
});

export default function SocialAuthButtons({ onSuccess, onError }: Props) {
  const { loginWithSocial } = useAuth();
  const [googleLoading, setGoogleLoading] = useState(false);
  const [appleLoading,  setAppleLoading]  = useState(false);
  const [appleAvail,    setAppleAvail]    = useState(false);

  const WEB_ID = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;

  /* On iOS, expo-auth-session requires iosClientId. In Expo Go we fall back to
     the web client ID so the OAuth proxy still works during development. For a
     production native build a real iOS client ID should be set in
     EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID. */
  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId:     WEB_ID,
    iosClientId:     Platform.OS === "ios"
      ? (process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID ?? WEB_ID)
      : undefined,
    androidClientId: Platform.OS === "android"
      ? (process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID ?? undefined)
      : undefined,
  });

  useEffect(() => {
    if (Platform.OS === "ios") {
      AppleAuthentication.isAvailableAsync()
        .then(setAppleAvail)
        .catch(() => setAppleAvail(false));
    }
  }, []);

  useEffect(() => {
    if (!response) return;
    if (response.type === "success") {
      const token = response.authentication?.accessToken;
      if (!token) { setGoogleLoading(false); onError?.("Google sign-in failed — no token."); return; }
      fetch("https://www.googleapis.com/userinfo/v2/me", { headers: { Authorization: `Bearer ${token}` } })
        .then(r => r.json())
        .then(info => loginWithSocial(info.email ?? `google_${Date.now()}@googleuser.com`, info.name || "Google User", "google"))
        .then(() => { setGoogleLoading(false); Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); onSuccess(); })
        .catch(() => { setGoogleLoading(false); onError?.("Could not fetch Google profile. Try again."); });
    } else if (response.type === "error") {
      setGoogleLoading(false);
      onError?.(response.error?.message ?? "Google sign-in failed.");
    } else if (response.type === "cancel" || response.type === "dismiss") {
      setGoogleLoading(false);
    }
  }, [response]);

  const handleGoogle = async () => {
    if (!request) {
      Alert.alert("Google Sign-In", "Google sign-in is not available. Ensure EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID is set.");
      return;
    }
    setGoogleLoading(true);
    await promptAsync();
  };

  const handleApple = async () => {
    if (Platform.OS !== "ios" || !appleAvail) {
      Alert.alert("Apple Sign-In", "Sign in with Apple is only available on iOS devices.");
      return;
    }
    setAppleLoading(true);
    try {
      const cred  = await AppleAuthentication.signInAsync({ requestedScopes: [AppleAuthentication.AppleAuthenticationScope.FULL_NAME, AppleAuthentication.AppleAuthenticationScope.EMAIL] });
      const name  = [cred.fullName?.givenName, cred.fullName?.familyName].filter(Boolean).join(" ") || "Apple User";
      const email = cred.email ?? `apple_${cred.user}@privaterelay.appleid.com`;
      await loginWithSocial(email, name, "apple");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      onSuccess();
    } catch (err: any) {
      if (err?.code !== "ERR_REQUEST_CANCELED") onError?.("Apple Sign-In failed. Please try again.");
    } finally {
      setAppleLoading(false);
    }
  };

  const { width } = Dimensions.get("window");
  const btnW = (width - 48 - 12) / 2;
  const appleOff = Platform.OS !== "ios" || !appleAvail;

  return (
    <Animated.View entering={FadeIn.duration(220)} style={ss.container}>
      <View style={[ss.btnWrap, { width: btnW }]}>
        <SocialBtn onPress={handleGoogle} loading={googleLoading} disabled={false} bg={C.google.bg} border={C.google.border} shadow={C.google.shadow}>
          {googleLoading ? <ActivityIndicator size="small" color={C.loading} /> : <><AntDesign name="google" size={20} color={C.google.icon} /><Text style={[ss.txt, { color: C.google.text }]}>Google</Text></>}
        </SocialBtn>
      </View>
      <View style={[ss.btnWrap, { width: btnW }]}>
        <SocialBtn onPress={handleApple} loading={appleLoading} disabled={appleOff} bg={appleOff ? C.disabled.bg : C.apple.bg} border={appleOff ? C.disabled.border : C.apple.border} shadow={C.apple.shadow}>
          {appleLoading ? <ActivityIndicator size="small" color="#FFF" /> : <><AntDesign name="apple1" size={20} color={appleOff ? C.disabled.text : C.apple.icon} /><Text style={[ss.txt, { color: appleOff ? C.disabled.text : C.apple.text }]}>Apple</Text></>}
        </SocialBtn>
      </View>
    </Animated.View>
  );
}

const ss = StyleSheet.create({
  container: { flexDirection: "row", gap: 12, alignItems: "stretch" },
  btnWrap:   { flex: 1 },
  txt:       { fontSize: 15, fontFamily: "Manrope_600SemiBold", letterSpacing: 0.1 },
});
