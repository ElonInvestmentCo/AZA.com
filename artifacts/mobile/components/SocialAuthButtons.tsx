/**
 * SocialAuthButtons — Google OAuth + Apple Sign-In for PAYVORA.
 *
 * Google auth uses the backend web OAuth flow via WebBrowser.openAuthSessionAsync.
 * The backend redirects to mobile://auth?token=… after successful sign-in.
 *
 * Apple Sign-In is shown on iOS only (native entitlement required).
 */

import { AntDesign, Ionicons } from "@expo/vector-icons";
import * as AppleAuthentication from "expo-apple-authentication";
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
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useAuth } from "@/context/AuthContext";
import { API_BASE_URL } from "@/utils/api";

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

/* ─── Google sign-in ─────────────────────────────────────────────────────────── */
function GoogleSignIn({ onSuccess, onError }: Props) {
  const { loginWithSocial } = useAuth();
  const [loading, setLoading] = useState(false);

  const handlePress = async () => {
    setLoading(true);
    try {
      const googleAuthUrl = `${API_BASE_URL}/api/auth/google`;

      // Open Google OAuth in system browser.
      // Backend redirects to mobile://auth?token=… on success.
      const result = await WebBrowser.openAuthSessionAsync(
        googleAuthUrl,
        "mobile://",
      );

      if (result.type === "success" && result.url) {
        // Parse token from the deep link URL: mobile://auth?token=xxx
        const raw = result.url;
        const tokenMatch = raw.match(/[?&]token=([^&]+)/);
        const errorMatch = raw.match(/[?&]error=([^&]+)/);

        if (tokenMatch?.[1]) {
          const token = decodeURIComponent(tokenMatch[1]);
          await loginWithSocial(token, "google");
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          onSuccess();
        } else if (errorMatch?.[1]) {
          onError?.(decodeURIComponent(errorMatch[1]));
        } else {
          onError?.("Google sign-in failed — no token received.");
        }
      } else if (result.type === "cancel" || result.type === "dismiss") {
        // User cancelled — do nothing
      } else {
        // Covers "opened" / "locked" / any unexpected result
        onError?.("Google sign-in failed. Please try again.");
      }
    } catch (err: any) {
      onError?.(err?.message ?? "Google sign-in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SocialBtn
      onPress={handlePress}
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
export default function SocialAuthButtons({ onSuccess, onError }: Props) {
  return (
    <View style={ss.row}>
      <View style={ss.half}>
        <GoogleSignIn onSuccess={onSuccess} onError={onError} />
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
