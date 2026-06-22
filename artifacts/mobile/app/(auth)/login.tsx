import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
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
  TouchableOpacity,
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

const logoIcon = require("@/assets/images/logo-icon.png");

/* ─── Design tokens ─────────────────────────────────────────────────────────── */
const C = {
  bg:          "#0A0A0F",
  surface:     "#14141F",
  inputBg:     "#1C1C2A",
  inputBorder: "#2A2A3D",
  inputFocus:  "#00D9A0",
  text:        "#FFFFFF",
  subtext:     "#8F8FA3",
  placeholder: "#55556A",
  accent:      "#00D9A0",
  accentDim:   "rgba(0,217,160,0.10)",
  accentGlow:  "rgba(0,217,160,0.06)",
  btnText:     "#0A0A0F",
  socialBg:    "#1C1C2A",
  socialBorder:"#2A2A3D",
  error:       "#FF5B7A",
  errorDim:    "rgba(255,91,122,0.10)",
  divider:     "#2A2A3D",
};

/* ─── Animated input ────────────────────────────────────────────────────────── */
function FinInput({
  placeholder, value, onChangeText,
  keyboardType, autoCapitalize, secureToggle, icon, error,
}: {
  placeholder: string; value: string; onChangeText: (t: string) => void;
  keyboardType?: any; autoCapitalize?: any; secureToggle?: boolean;
  icon: keyof typeof Feather.glyphMap; error?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  const [showPw,  setShowPw]  = useState(false);

  return (
    <View style={[
      fi.row,
      focused && fi.focused,
      error   && fi.errored,
    ]}>
      <Feather
        name={icon}
        size={17}
        color={focused ? C.inputFocus : error ? C.error : C.placeholder}
        style={{ marginRight: 12 }}
      />
      <TextInput
        style={fi.input}
        placeholder={placeholder}
        placeholderTextColor={C.placeholder}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize ?? "none"}
        secureTextEntry={secureToggle && !showPw}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
      {secureToggle && (
        <TouchableOpacity
          onPress={() => setShowPw(v => !v)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Feather
            name={showPw ? "eye-off" : "eye"}
            size={17}
            color={focused ? C.inputFocus : C.placeholder}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

const fi = StyleSheet.create({
  row: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: C.inputBg, borderWidth: 1.5,
    borderColor: C.inputBorder, borderRadius: 16,
    paddingHorizontal: 16, height: 58,
  },
  focused: { borderColor: C.inputFocus, backgroundColor: "rgba(0,217,160,0.05)" },
  errored: { borderColor: C.error,      backgroundColor: C.errorDim },
  input:   { flex: 1, fontSize: 15, fontFamily: "Manrope_400Regular", color: C.text, height: "100%" },
});

/* ─── Social button ─────────────────────────────────────────────────────────── */
function SocialBtn({ label, emoji }: { label: string; emoji: string }) {
  const sc    = useSharedValue(1);
  const style = useAnimatedStyle(() => ({ transform: [{ scale: sc.value }] }));

  return (
    <Animated.View style={[style, { flex: 1 }]}>
      <Pressable
        style={sb.btn}
        onPressIn={() => { sc.value = withSpring(0.95, { damping: 12, stiffness: 300 }); }}
        onPressOut={() => { sc.value = withSpring(1.0,  { damping: 12, stiffness: 300 }); }}
      >
        <Text style={sb.emoji}>{emoji}</Text>
        <Text style={sb.label}>{label}</Text>
      </Pressable>
    </Animated.View>
  );
}

const sb = StyleSheet.create({
  btn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    height: 52, borderRadius: 14, gap: 8,
    backgroundColor: C.socialBg, borderWidth: 1.5, borderColor: C.socialBorder,
  },
  emoji: { fontSize: 16 },
  label: { fontSize: 14, fontFamily: "Manrope_600SemiBold", color: C.text },
});

/* ─── Main screen ───────────────────────────────────────────────────────────── */
export default function LoginScreen() {
  const router    = useRouter();
  const insets    = useSafeAreaInsets();
  const { login } = useAuth();

  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

  /* Button press scale */
  const btnSc    = useSharedValue(1);
  const btnStyle = useAnimatedStyle(() => ({ transform: [{ scale: btnSc.value }] }));

  /* Form shake on error */
  const shakeX    = useSharedValue(0);
  const shakeStyle = useAnimatedStyle(() => ({ transform: [{ translateX: shakeX.value }] }));

  const triggerShake = () => {
    shakeX.value = withSequence(
      withTiming(-10, { duration: 55 }),
      withTiming(10,  { duration: 55 }),
      withTiming(-7,  { duration: 55 }),
      withTiming(7,   { duration: 55 }),
      withTiming(0,   { duration: 55 }),
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
      router.replace("/(auth)/pin");
    } else {
      setError("Invalid credentials. Please try again.");
      triggerShake();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={s.root}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* Ambient background glow */}
      <Animated.View entering={FadeIn.duration(800)} style={s.glowTop}    pointerEvents="none" />
      <Animated.View entering={FadeIn.duration(1000)} style={s.glowBottom} pointerEvents="none" />

      <ScrollView
        contentContainerStyle={[
          s.scroll,
          { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 40 },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* ── Brand section ── */}
        <Animated.View entering={FadeInDown.duration(500).springify()} style={s.brand}>
          <View style={s.logoWrap}>
            <Image source={logoIcon} style={s.logoImg} contentFit="contain" priority="high" />
            <View style={s.logoGlow} />
          </View>
          <Text style={s.wordmark}>PAYVORA</Text>
          <View style={s.tagWrap}>
            <View style={s.tagDot} />
            <Text style={s.tagline}>Fintech · Reimagined</Text>
          </View>
        </Animated.View>

        {/* ── Heading ── */}
        <Animated.View entering={FadeInUp.duration(420).springify().delay(80)} style={s.headBlock}>
          <Text style={s.heading}>Welcome back 👋</Text>
          <Text style={s.headSub}>Sign in to your account to continue</Text>
        </Animated.View>

        {/* ── Form ── */}
        <Animated.View
          entering={FadeInUp.duration(400).springify().delay(140)}
          style={[s.form, shakeStyle]}
        >
          <FinInput
            icon="mail"
            placeholder="Email address"
            value={email}
            onChangeText={t => { setEmail(t); setError(""); }}
            keyboardType="email-address"
            error={!!error}
          />
          <FinInput
            icon="lock"
            placeholder="Password"
            value={password}
            onChangeText={t => { setPassword(t); setError(""); }}
            secureToggle
            error={!!error}
          />

          {error ? (
            <Animated.View entering={FadeIn.duration(250)} style={s.errorBox}>
              <Feather name="alert-circle" size={13} color={C.error} />
              <Text style={s.errorText}>{error}</Text>
            </Animated.View>
          ) : null}

          <TouchableOpacity
            onPress={() => router.push("/(auth)/forgot-password")}
            style={{ alignSelf: "flex-end" }}
            activeOpacity={0.7}
          >
            <Text style={s.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* ── CTA button ── */}
        <Animated.View entering={FadeInUp.duration(400).springify().delay(200)} style={btnStyle}>
          <Pressable
            style={[s.loginBtn, loading && { opacity: 0.7 }]}
            onPress={handleLogin}
            onPressIn={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              btnSc.value = withSpring(0.96, { damping: 13, stiffness: 320 });
            }}
            onPressOut={() => { btnSc.value = withSpring(1.0, { damping: 13, stiffness: 320 }); }}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={C.btnText} size="small" />
            ) : (
              <View style={s.loginBtnInner}>
                <Text style={s.loginBtnText}>Sign In</Text>
                <View style={s.loginArrow}>
                  <Feather name="arrow-right" size={15} color={C.accent} />
                </View>
              </View>
            )}
          </Pressable>
        </Animated.View>

        {/* ── Divider ── */}
        <Animated.View entering={FadeInUp.duration(380).springify().delay(260)} style={s.dividerRow}>
          <View style={s.dividerLine} />
          <Text style={s.dividerText}>or continue with</Text>
          <View style={s.dividerLine} />
        </Animated.View>

        {/* ── Social ── */}
        <Animated.View entering={FadeInUp.duration(380).springify().delay(300)} style={s.socialRow}>
          <SocialBtn emoji="🇬" label="Google" />
          <SocialBtn emoji="" label="Apple"  />
        </Animated.View>

        {/* ── Footer ── */}
        <Animated.View entering={FadeInUp.duration(380).springify().delay(340)} style={s.footer}>
          <Text style={s.footerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => router.push("/(auth)/register")} activeOpacity={0.7}>
            <Text style={s.footerLink}>Create Account</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* ── Security badge ── */}
        <Animated.View entering={FadeInUp.duration(380).springify().delay(380)} style={s.secBadge}>
          <Feather name="lock" size={11} color={C.placeholder} />
          <Text style={s.secText}>256-bit SSL encrypted · Bank-level security</Text>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

/* ─── Styles ────────────────────────────────────────────────────────────────── */
const s = StyleSheet.create({
  root:  { flex: 1, backgroundColor: C.bg },
  scroll:{ paddingHorizontal: 24, flexGrow: 1 },

  /* Ambient glow blobs */
  glowTop: {
    position: "absolute", top: -80, alignSelf: "center",
    width: 320, height: 320, borderRadius: 160,
    backgroundColor: C.accentGlow,
    pointerEvents: "none",
  },
  glowBottom: {
    position: "absolute", bottom: 60, right: -80,
    width: 220, height: 220, borderRadius: 110,
    backgroundColor: "rgba(0,217,160,0.03)",
    pointerEvents: "none",
  },

  /* Brand section */
  brand:    { alignItems: "center", marginBottom: 44, marginTop: 8 },
  logoWrap: { position: "relative", marginBottom: 14 },
  logoImg:  { width: 56, height: 56, borderRadius: 16 },
  logoGlow: {
    position: "absolute", inset: -8, borderRadius: 24,
    backgroundColor: C.accentDim,
    zIndex: -1,
  },
  wordmark: {
    fontSize: 22, fontFamily: "Manrope_700Bold",
    color: C.text, letterSpacing: 5, marginBottom: 8,
  },
  tagWrap:  { flexDirection: "row", alignItems: "center", gap: 6 },
  tagDot:   { width: 5, height: 5, borderRadius: 3, backgroundColor: C.accent },
  tagline:  { fontSize: 12, fontFamily: "Manrope_400Regular", color: C.subtext, letterSpacing: 0.5 },

  /* Heading */
  headBlock: { marginBottom: 28 },
  heading:   { fontSize: 28, fontFamily: "Manrope_700Bold", color: C.text, letterSpacing: -0.6, marginBottom: 6 },
  headSub:   { fontSize: 15, fontFamily: "Manrope_400Regular", color: C.subtext, lineHeight: 22 },

  /* Form */
  form:     { gap: 14, marginBottom: 24 },
  errorBox: { flexDirection: "row", alignItems: "center", gap: 7, padding: 12, borderRadius: 12, backgroundColor: C.errorDim },
  errorText:{ fontSize: 13, fontFamily: "Manrope_400Regular", color: C.error, flex: 1 },
  forgotText:{ fontSize: 13, fontFamily: "Manrope_600SemiBold", color: C.accent, marginTop: 2 },

  /* CTA button */
  loginBtn: {
    height: 58, backgroundColor: C.accent, borderRadius: 16,
    alignItems: "center", justifyContent: "center", marginBottom: 28,
    shadowColor: C.accent, shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.32, shadowRadius: 20, elevation: 10,
  },
  loginBtnInner: { flexDirection: "row", alignItems: "center", gap: 10 },
  loginBtnText:  { fontSize: 16, fontFamily: "Manrope_700Bold", color: C.btnText, letterSpacing: 0.3 },
  loginArrow:    {
    width: 28, height: 28, borderRadius: 8,
    backgroundColor: "rgba(10,10,15,0.15)",
    alignItems: "center", justifyContent: "center",
  },

  /* Divider */
  dividerRow:  { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 20 },
  dividerLine: { flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: C.divider },
  dividerText: { fontSize: 12, fontFamily: "Manrope_400Regular", color: C.subtext },

  /* Social */
  socialRow: { flexDirection: "row", gap: 12, marginBottom: 32 },

  /* Footer */
  footer:     { flexDirection: "row", justifyContent: "center", alignItems: "center", marginBottom: 20 },
  footerText: { fontSize: 14, fontFamily: "Manrope_400Regular", color: C.subtext },
  footerLink: { fontSize: 14, fontFamily: "Manrope_700Bold", color: C.accent },

  /* Security badge */
  secBadge: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 5, marginTop: "auto" },
  secText:  { fontSize: 11, fontFamily: "Manrope_400Regular", color: C.placeholder },
});
