/**
 * SocialAuthButtons — Google OAuth + Apple Sign-In for PAYVORA.
 *
 * Google auth is isolated to its own inner component so it can be
 * conditionally rendered. On iOS, it requires a dedicated iOS OAuth
 * client ID (EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID). Without one the button
 * is shown in a disabled state with an informative message.
 *
 * Apple Sign-In is shown on iOS only (native entitlement required).
 */

import { AntDesign, Ionicons } from "@expo/vector-icons";
import * as AppleAuthentication from "expo-apple-authentication";
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
  useWindowDimensions,
} from "react-native";
import Animated, {
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useAuth } from "@/context/AuthContext";

WebBrowser.maybeCompleteAuthSession();

/* ─── Design tokens ─────────────────────────────────────────────────────────── */
const C = {
  google:   { bg: "#FFFFFF", border: "#E8ECF4", text: "#1E232C", icon: "#4285F4", shadow: "rgba(0,0,0,0.06)" },
  apple:    { bg: "#1E232C", border: "#1E232C", text: "#FFFFFF", icon: "#FFFFFF", shadow: "rgba(0,0,0,0.14)" },
  loading:  "#8391A1",
  disabled: { bg: "#F7F8F9", border: "#E8ECF4", text: "#C4C9D4" },
};

interface Props {
  onSuccess: () => void;
  onError?:  (msg: string) => void;
}

/* ─── Animated base button ──────────────────────────────────────────────────── */
function SocialBtn({
  onPress, loading, disabled, bg, border, shadow, children,
}: {
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
        style={[
          sb.btn,
          { backgroundColor: off && !loading ? C.disabled.bg : bg, borderColor: off && !loading ? C.disabled.border : border, shadowColor: shadow },
          off && sb.dim,
        ]}
      >
        {children}
      </Pressable>
    </Animated.View>
  );
}

const sb = StyleSheet.create({
  btn: { height: 58, borderRadius: 14, borderWidth: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 12, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 1, shadowRadius: 6, elevation: 3 },
  dim: { opacity: 0.5 },
});

/* ─── Google sign-in — inner component (uses hook, only rendered on eligible platforms) */
function GoogleSignInActive({ onSuccess, onError }: Props) {
  const { loginWithSocial } = useAuth();
  const [loading, setLoading] = useState(false);

  const IOS_ID  = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID;
  const WEB_ID  = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
  const ANDR_ID = process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID;

  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId:     WEB_ID,
    iosClientId:     Platform.OS === "ios" ? IOS_ID : undefined,
    androidClientId: Platform.OS === "android" ? ANDR_ID : undefined,
  });

  useEffect(() => {
    if (!response) return;
    if (response.type === "success") {
      const accessToken = response.authentication?.accessToken;
      if (!accessToken) { setLoading(false); onError?.("Google sign-in failed — no token."); return; }
      loginWithSocial(accessToken, "google")
        .then(() => { setLoading(false); Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); onSuccess(); })
        .catch(() => { setLoading(false); onError?.("Could not sign in with Google. Please try again."); });
    } else if (response.type === "error") {
      setLoading(false);
      onError?.(response.error?.message ?? "Google sign-in failed. Please try again.");
    } else if (response.type === "cancel" || response.type === "dismiss") {
      setLoading(false);
    }
  }, [response]);

  return (
    <SocialBtn
      onPress={async () => {
        if (!request) { Alert.alert("Google Sign-In", "Google sign-in is not ready yet."); return; }
        setLoading(true);
        await promptAsync();
      }}
      loading={loading} disabled={false}
      bg={C.google.bg} border={C.google.border} shadow={C.google.shadow}
    >
      {loading
        ? <ActivityIndicator size="small" color={C.loading} />
        : <><AntDesign name="google" size={20} color={C.google.icon} /><Text style={[ss.txt, { color: C.google.text }]}>Google</Text></>
      }
    </SocialBtn>
  );
}

/* ─── Google sign-in — disabled placeholder (no hook) ──────────────────────── */
function GoogleSignInDisabled() {
  return (
    <SocialBtn
      onPress={() => Alert.alert("Google Sign-In", "Google sign-in is not available on iOS in this build.\n\nAn iOS OAuth client ID is required in Google Cloud Console.")}
      loading={false} disabled={true}
      bg={C.disabled.bg} border={C.disabled.border} shadow="transparent"
    >
      <AntDesign name="google" size={20} color={C.disabled.text} />
      <Text style={[ss.txt, { color: C.disabled.text }]}>Google</Text>
    </SocialBtn>
  );
}

/* ─── Apple sign-in ─────────────────────────────────────────────────────────── */
function AppleSignIn({ onSuccess, onError }: Props) {
  const { loginWithSocial } = useAuth();
  const [loading, setLoading]   = useState(false);
  const [avail,   setAvail]     = useState(false);

  useEffect(() => {
    if (Platform.OS === "ios") {
      AppleAuthentication.isAvailableAsync().then(setAvail).catch(() => setAvail(false));
    }
  }, []);

  const disabled = Platform.OS !== "ios" || !avail;

  return (
    <SocialBtn
      onPress={async () => {
        if (disabled) { Alert.alert("Apple Sign-In", "Sign in with Apple is only available on iOS devices."); return; }
        setLoading(true);
        try {
          const cred  = await AppleAuthentication.signInAsync({ requestedScopes: [AppleAuthentication.AppleAuthenticationScope.FULL_NAME, AppleAuthentication.AppleAuthenticationScope.EMAIL] });
          const name  = [cred.fullName?.givenName, cred.fullName?.familyName].filter(Boolean).join(" ") || "Apple User";
          const email = cred.email ?? `apple_${cred.user}@privaterelay.appleid.com`;
          await loginWithSocial(cred.identityToken ?? "", "apple", { name, email });
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          onSuccess();
        } catch (err: any) {
          if (err?.code !== "ERR_REQUEST_CANCELED") onError?.("Apple Sign-In failed. Please try again.");
        } finally {
          setLoading(false);
        }
      }}
      loading={loading} disabled={disabled}
      bg={disabled ? C.disabled.bg  : C.apple.bg}
      border={disabled ? C.disabled.border : C.apple.border}
      shadow={C.apple.shadow}
    >
      {loading
        ? <ActivityIndicator size="small" color="#FFF" />
        : <><Ionicons name="logo-apple" size={20} color={disabled ? C.disabled.text : C.apple.icon} /><Text style={[ss.txt, { color: disabled ? C.disabled.text : C.apple.text }]}>Apple</Text></>
      }
    </SocialBtn>
  );
}

/* ─── Exported component ─────────────────────────────────────────────────────── */

/*
 * Determines whether this device/platform can run Google Sign-In.
 * - Web: yes (webClientId)
 * - Android: yes (falls back to webClientId)
 * - iOS: ONLY when EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID is explicitly set.
 *        Passing the web client ID as iosClientId does not work because
 *        the library uses it to build native redirect schemes.
 */
function canRunGoogleOnThisPlatform(): boolean {
  if (Platform.OS === "web" || Platform.OS === "android") return true;
  if (Platform.OS === "ios") return !!process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID;
  return false;
}

export default function SocialAuthButtons({ onSuccess, onError }: Props) {
  const googleEnabled = canRunGoogleOnThisPlatform();

  return (
    <View style={ss.row}>
      <View style={ss.half}>
        {googleEnabled
          ? <GoogleSignInActive onSuccess={onSuccess} onError={onError} />
          : <GoogleSignInDisabled />
        }
      </View>
      <View style={ss.half}>
        <AppleSignIn onSuccess={onSuccess} onError={onError} />
      </View>
    </View>
  );
}

const ss = StyleSheet.create({
  row:  { flexDirection: "row", gap: 12, alignItems: "stretch" },
  half: { flex: 1 },
  txt:  { fontSize: 15, fontFamily: "Manrope_600SemiBold", letterSpacing: 0.1 },
});
