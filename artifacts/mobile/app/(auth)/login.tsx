import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as Haptics from "expo-haptics";
import { EyeIcon } from "@/components/EyeIcon";
import { LinearGradient } from "expo-linear-gradient";
import SocialAuthButtons from "@/components/SocialAuthButtons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";

const fingerprintImg = require("@/assets/images/fingerprint.png");

/* ── Email input ────────────────────────────────────────────────────────── */
function EmailInput({
  placeholder,
  value,
  onChangeText,
  keyboardType,
  error,
}: {
  placeholder: string;
  value: string;
  onChangeText: (t: string) => void;
  keyboardType?: any;
  error?: boolean;
}) {
  const C = useColors();
  const [focused, setFocused] = useState(false);
  return (
    <View
      style={[
        inp.wrap,
        {
          backgroundColor: C.input,
          borderColor: error ? C.destructive : focused ? C.inputFocus : C.inputBorder,
          borderWidth: focused || error ? 1.5 : 1,
        },
      ]}
    >
      <TextInput
        style={[inp.field, { color: C.text }]}
        placeholder={placeholder}
        placeholderTextColor={C.placeholder}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        autoCapitalize="none"
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
    </View>
  );
}

/* ── Password input ─────────────────────────────────────────────────────── */
function PasswordInput({
  value,
  onChangeText,
  error,
}: {
  value: string;
  onChangeText: (t: string) => void;
  error?: boolean;
}) {
  const C = useColors();
  const [focused,  setFocused]  = useState(false);
  const [showPass, setShowPass] = useState(false);
  return (
    <View
      style={[
        inp.wrap,
        {
          backgroundColor: C.input,
          borderColor: error ? C.destructive : focused ? C.inputFocus : C.inputBorder,
          borderWidth: focused || error ? 1.5 : 1,
        },
      ]}
    >
      <TextInput
        style={[inp.field, { color: C.text }]}
        placeholder="Enter your password"
        placeholderTextColor={C.placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={!showPass}
        autoCapitalize="none"
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
      <Pressable
        onPress={() => { Haptics.selectionAsync(); setShowPass(v => !v); }}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        style={inp.eyeBtn}
      >
        <EyeIcon open={showPass} size={22} color={C.placeholder} />
      </Pressable>
    </View>
  );
}

const inp = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    paddingHorizontal: 18,
    height: 58,
  },
  field: {
    flex: 1,
    fontSize: 15,
    fontFamily: "Manrope_400Regular",
    height: "100%",
  },
  eyeBtn: { padding: 2 },
});

/* ── Animated Pressable link ────────────────────────────────────────────── */
function LinkBtn({
  onPress,
  style,
  textStyle,
  label,
}: {
  onPress: () => void;
  style?: object;
  textStyle: object;
  label: string;
}) {
  const op = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({ opacity: op.value }));
  return (
    <Animated.View style={[animStyle, style]}>
      <Pressable
        onPress={onPress}
        onPressIn={() => { op.value = withTiming(0.5, { duration: 80 }); }}
        onPressOut={() => { op.value = withSpring(1, { damping: 14, stiffness: 280 }); }}
        hitSlop={{ top: 10, bottom: 10, left: 8, right: 8 }}
      >
        <Text style={textStyle}>{label}</Text>
      </Pressable>
    </Animated.View>
  );
}

/* ── Main screen ────────────────────────────────────────────────────────── */
export default function LoginScreen() {
  const router    = useRouter();
  const insets    = useSafeAreaInsets();
  const { login } = useAuth();
  const C         = useColors();

  const [email,       setEmail]       = useState("");
  const [password,    setPassword]    = useState("");
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState("");
  const [socialError, setSocialError] = useState("");

  const btnSc    = useSharedValue(1);
  const btnStyle = useAnimatedStyle(() => ({
    transform: [{ scale: btnSc.value }],
  }));

  const shakeX     = useSharedValue(0);
  const shakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeX.value }],
  }));

  const triggerShake = () => {
    shakeX.value = withSequence(
      withTiming(-8, { duration: 55 }),
      withTiming(8,  { duration: 55 }),
      withTiming(-5, { duration: 55 }),
      withTiming(5,  { duration: 55 }),
      withTiming(0,  { duration: 55 }),
    );
  };

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please enter your email and password.");
      triggerShake();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }
    setLoading(true);
    setError("");
    const ok = await login(email, password);
    setLoading(false);
    if (ok) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace("/(auth)/otp");
    } else {
      setError("Invalid credentials. Please try again.");
      triggerShake();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[s.root, { backgroundColor: C.background }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <StatusBar style="auto" />

      <ScrollView
        contentContainerStyle={[
          s.scroll,
          { paddingTop: insets.top + 8, paddingBottom: insets.bottom + 32 },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* ── Top bar ── */}
        <Animated.View entering={FadeIn.duration(400)} style={s.topBar}>
          <Pressable
            style={[s.backBtn, { borderColor: C.border, backgroundColor: C.surface }]}
            onPress={() => router.back()}
            hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
          >
            <Ionicons name="chevron-back" size={22} color={C.text} />
          </Pressable>
          <Text style={[s.wordmark, { color: C.text }]}>AZA.</Text>
          <View style={{ width: 44 }} />
        </Animated.View>

        {/* ── Fingerprint icon with ambient glow ── */}
        <Animated.View
          entering={FadeInDown.duration(500).delay(80).springify()}
          style={s.fingerprintWrap}
        >
          <View style={[s.fingerprintGlow, { backgroundColor: C.accentDim, shadowColor: C.accent }]} />
          <Image
            source={fingerprintImg}
            style={{ width: 90, height: 90 }}
            contentFit="contain"
            cachePolicy="memory-disk"
          />
        </Animated.View>

        {/* ── Form ── */}
        <Animated.View entering={FadeInUp.duration(420).delay(120).springify()}>
          <Animated.View style={[s.form, shakeStyle]}>
            <EmailInput
              placeholder="Enter your email"
              value={email}
              onChangeText={t => { setEmail(t); setError(""); }}
              keyboardType="email-address"
              error={!!error}
            />
            <PasswordInput
              value={password}
              onChangeText={t => { setPassword(t); setError(""); }}
              error={!!error}
            />
            {error ? (
              <Animated.Text entering={FadeIn.duration(200)} style={[s.errorText, { color: C.destructive }]}>
                {error}
              </Animated.Text>
            ) : null}
            <LinkBtn
              onPress={() => { Haptics.selectionAsync(); router.push("/(auth)/forgot-password"); }}
              style={s.forgotWrap}
              textStyle={[s.forgotText, { color: C.accent }]}
              label="Forgot Password?"
            />
          </Animated.View>
        </Animated.View>

        {/* ── Login button (gradient) ── */}
        <Animated.View
          entering={FadeInUp.duration(400).delay(180).springify()}
          style={s.btnWrap}
        >
          <Animated.View style={btnStyle}>
            <LinearGradient
              colors={[C.gradientStart, C.gradientMid, C.gradientEnd] as [string, string, string]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[s.loginBtnGrad, { shadowColor: C.accentGlow, opacity: loading ? 0.75 : 1 }]}
            >
              <Pressable
                style={s.loginBtnPress}
                onPress={handleLogin}
                onPressIn={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  btnSc.value = withSpring(0.96, { damping: 13, stiffness: 300 });
                }}
                onPressOut={() => {
                  btnSc.value = withSpring(1.0, { damping: 13, stiffness: 300 });
                }}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={s.loginBtnText}>Login</Text>
                )}
              </Pressable>
            </LinearGradient>
          </Animated.View>
        </Animated.View>

        {/* ── Or Login with ── */}
        <Animated.View
          entering={FadeInUp.duration(380).delay(260).springify()}
          style={s.dividerRow}
        >
          <View style={[s.dividerLine, { backgroundColor: C.border }]} />
          <Text style={[s.dividerText, { color: C.mutedForeground }]}>Or Login with</Text>
          <View style={[s.dividerLine, { backgroundColor: C.border }]} />
        </Animated.View>

        {/* ── Social buttons ── */}
        <Animated.View
          entering={FadeInUp.duration(380).delay(300).springify()}
          style={s.socialWrap}
        >
          <SocialAuthButtons
            onSuccess={() => router.replace("/(tabs)")}
            onError={msg => { setSocialError(msg); Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error); }}
          />
          {socialError ? (
            <Animated.Text entering={FadeIn.duration(200)} style={[s.socialError, { color: C.destructive }]}>
              {socialError}
            </Animated.Text>
          ) : null}
        </Animated.View>

        {/* ── Footer ── */}
        <Animated.View
          entering={FadeInUp.duration(380).delay(340).springify()}
          style={s.footer}
        >
          <Text style={[s.footerText, { color: C.mutedForeground }]}>Don't have an account? </Text>
          <LinkBtn
            onPress={() => router.push("/(auth)/register")}
            textStyle={[s.footerLink, { color: C.accent }]}
            label="Register Now"
          />
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

/* ── Styles ─────────────────────────────────────────────────────────────── */
const s = StyleSheet.create({
  root:   { flex: 1 },
  scroll: { paddingHorizontal: 24, flexGrow: 1 },

  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 32,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  wordmark: {
    fontSize: 32,
    fontFamily: "Manrope_700Bold",
    letterSpacing: -0.5,
  },

  fingerprintWrap: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 44,
    marginTop: 8,
  },
  fingerprintGlow: {
    position: "absolute",
    width: 160,
    height: 160,
    borderRadius: 80,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 50,
    elevation: 0,
  },

  form:      { gap: 16, marginBottom: 28 },
  errorText: {
    fontSize: 13,
    fontFamily: "Manrope_400Regular",
    textAlign: "center",
  },
  forgotWrap: { alignSelf: "flex-end", marginTop: 2 },
  forgotText: {
    fontSize: 14,
    fontFamily: "Manrope_600SemiBold",
  },

  btnWrap: { marginBottom: 32 },
  loginBtnGrad: {
    height: 60,
    borderRadius: 14,
    overflow: "hidden",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 24,
    elevation: 8,
  },
  loginBtnPress: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loginBtnText: {
    fontSize: 16,
    fontFamily: "Manrope_700Bold",
    color: "#FFFFFF",
    letterSpacing: 0.2,
  },

  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  dividerLine: { flex: 1, height: 1 },
  dividerText: {
    marginHorizontal: 12,
    fontSize: 14,
    fontFamily: "Manrope_400Regular",
  },

  socialWrap: { marginBottom: 24, gap: 10 },
  socialError: {
    fontSize: 13,
    fontFamily: "Manrope_400Regular",
    textAlign: "center",
    marginTop: 4,
  },

  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  footerText: { fontSize: 15, fontFamily: "Manrope_400Regular" },
  footerLink: { fontSize: 15, fontFamily: "Manrope_700Bold" },
});
