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
  accentGlow:  "rgba(0,217,160,0.05)",
  btnText:     "#0A0A0F",
  error:       "#FF5B7A",
  errorDim:    "rgba(255,91,122,0.10)",
  warn:        "#F59E0B",
};

/* ─── Animated input field ──────────────────────────────────────────────────── */
function FinInput({
  placeholder, value, onChangeText, keyboardType,
  autoCapitalize, secureToggle, icon, error,
}: {
  placeholder: string; value: string; onChangeText: (t: string) => void;
  keyboardType?: any; autoCapitalize?: any; secureToggle?: boolean;
  icon: keyof typeof Feather.glyphMap; error?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  const [showPw,  setShowPw]  = useState(false);

  return (
    <View style={[fi.row, focused && fi.focused, error && fi.errored]}>
      <Feather
        name={icon} size={17}
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
            name={showPw ? "eye-off" : "eye"} size={17}
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

/* ─── Password strength meter ───────────────────────────────────────────────── */
function StrengthMeter({ password }: { password: string }) {
  if (!password) return null;
  const hasUpper  = /[A-Z]/.test(password);
  const hasNum    = /\d/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  const score =
    (password.length >= 6 ? 1 : 0) +
    (password.length >= 10 ? 1 : 0) +
    (hasUpper ? 1 : 0) +
    (hasNum ? 1 : 0) +
    (hasSpecial ? 1 : 0);

  const level  = score <= 1 ? 0 : score <= 3 ? 1 : 2;
  const colors = [C.error, C.warn, C.accent];
  const labels = ["Weak", "Fair", "Strong"];
  const fill   = [1, 2, 3];

  return (
    <Animated.View entering={FadeIn.duration(300)} style={sm.wrap}>
      <View style={sm.bars}>
        {[0, 1, 2].map(i => (
          <View
            key={i}
            style={[
              sm.bar,
              { backgroundColor: i <= level ? colors[level] : C.inputBorder },
            ]}
          />
        ))}
      </View>
      <Text style={[sm.label, { color: colors[level] }]}>{labels[level]}</Text>
    </Animated.View>
  );
}

const sm = StyleSheet.create({
  wrap:  { flexDirection: "row", alignItems: "center", gap: 10 },
  bars:  { flexDirection: "row", gap: 5, flex: 1 },
  bar:   { flex: 1, height: 3, borderRadius: 4 },
  label: { fontSize: 11, fontFamily: "Manrope_600SemiBold", width: 44, textAlign: "right" },
});

/* ─── Main screen ───────────────────────────────────────────────────────────── */
export default function RegisterScreen() {
  const router          = useRouter();
  const insets          = useSafeAreaInsets();
  const { register }    = useAuth();

  const [name,     setName]     = useState("");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

  /* Button spring */
  const btnSc    = useSharedValue(1);
  const btnStyle = useAnimatedStyle(() => ({ transform: [{ scale: btnSc.value }] }));

  /* Error shake */
  const shakeX     = useSharedValue(0);
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

  const handleRegister = async () => {
    if (!name || !email || !password) {
      setError("Please fill in all fields.");
      triggerShake();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      triggerShake();
      return;
    }
    setLoading(true);
    setError("");
    await register(name, email, password);
    setLoading(false);
    router.replace("/(auth)/pin");
  };

  return (
    <KeyboardAvoidingView
      style={s.root}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* Ambient glow */}
      <Animated.View entering={FadeIn.duration(700)} style={s.glow} pointerEvents="none" />

      <ScrollView
        contentContainerStyle={[
          s.scroll,
          { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 36 },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >

        {/* ── Top bar ── */}
        <Animated.View entering={FadeInDown.duration(450).springify()} style={s.topBar}>
          <TouchableOpacity
            style={s.backBtn}
            onPress={() => router.back()}
            activeOpacity={0.78}
          >
            <Feather name="chevron-left" size={20} color={C.text} />
          </TouchableOpacity>
          <View style={s.logoWrap}>
            <Image source={logoIcon} style={s.logoImg} contentFit="contain" priority="high" />
            <View style={s.logoGlow} />
          </View>
        </Animated.View>

        {/* ── Heading ── */}
        <Animated.View entering={FadeInUp.duration(430).springify().delay(80)} style={s.headBlock}>
          <View style={s.stepPill}>
            <Text style={s.stepText}>Step 1 of 2</Text>
          </View>
          <Text style={s.heading}>Create Account</Text>
          <Text style={s.headSub}>
            Join thousands of users trading gift cards with instant payouts
          </Text>
        </Animated.View>

        {/* ── Form ── */}
        <Animated.View
          entering={FadeInUp.duration(410).springify().delay(140)}
          style={[s.form, shakeStyle]}
        >
          <FinInput
            icon="user"
            placeholder="Full name"
            value={name}
            onChangeText={t => { setName(t); setError(""); }}
            autoCapitalize="words"
            error={!!error}
          />
          <FinInput
            icon="mail"
            placeholder="Email address"
            value={email}
            onChangeText={t => { setEmail(t); setError(""); }}
            keyboardType="email-address"
            error={!!error}
          />
          <View style={{ gap: 8 }}>
            <FinInput
              icon="lock"
              placeholder="Create a password"
              value={password}
              onChangeText={t => { setPassword(t); setError(""); }}
              secureToggle
              error={!!error}
            />
            <StrengthMeter password={password} />
          </View>

          {error ? (
            <Animated.View entering={FadeIn.duration(250)} style={s.errorBox}>
              <Feather name="alert-circle" size={13} color={C.error} />
              <Text style={s.errorText}>{error}</Text>
            </Animated.View>
          ) : null}
        </Animated.View>

        {/* ── CTA button ── */}
        <Animated.View
          entering={FadeInUp.duration(400).springify().delay(220)}
          style={btnStyle}
        >
          <Pressable
            style={[s.createBtn, loading && { opacity: 0.72 }]}
            onPress={handleRegister}
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
              <View style={s.createBtnInner}>
                <Text style={s.createBtnText}>Create Account</Text>
                <View style={s.createArrow}>
                  <Feather name="arrow-right" size={15} color={C.accent} />
                </View>
              </View>
            )}
          </Pressable>
        </Animated.View>

        {/* ── Footer ── */}
        <Animated.View
          entering={FadeInUp.duration(380).springify().delay(280)}
          style={s.footer}
        >
          <Text style={s.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
            <Text style={s.footerLink}>Sign In</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* ── Terms note ── */}
        <Animated.View
          entering={FadeInUp.duration(380).springify().delay(320)}
          style={s.terms}
        >
          <Text style={s.termsText}>
            By continuing you agree to our{" "}
            <Text style={s.termsLink}>Terms of Service</Text>
            {" "}and{" "}
            <Text style={s.termsLink}>Privacy Policy</Text>
          </Text>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

/* ─── Styles ────────────────────────────────────────────────────────────────── */
const s = StyleSheet.create({
  root:   { flex: 1, backgroundColor: C.bg },
  scroll: { paddingHorizontal: 24, flexGrow: 1 },

  glow: {
    position: "absolute", top: -60, right: -60,
    width: 240, height: 240, borderRadius: 120,
    backgroundColor: C.accentGlow,
    pointerEvents: "none",
  },

  /* Top bar */
  topBar:  { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 36 },
  backBtn: {
    width: 44, height: 44, borderRadius: 14,
    backgroundColor: C.surface, alignItems: "center", justifyContent: "center",
    borderWidth: 1, borderColor: C.inputBorder,
  },
  logoWrap: { position: "relative" },
  logoImg:  { width: 44, height: 44, borderRadius: 14 },
  logoGlow: {
    position: "absolute", inset: -6, borderRadius: 20,
    backgroundColor: C.accentDim, zIndex: -1,
  },

  /* Heading */
  headBlock: { marginBottom: 32 },
  stepPill:  {
    alignSelf: "flex-start",
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20,
    backgroundColor: C.accentDim, marginBottom: 14,
  },
  stepText:  { fontSize: 11, fontFamily: "Manrope_600SemiBold", color: C.accent, letterSpacing: 0.3 },
  heading:   { fontSize: 28, fontFamily: "Manrope_700Bold", color: C.text, letterSpacing: -0.6, marginBottom: 8 },
  headSub:   { fontSize: 15, fontFamily: "Manrope_400Regular", color: C.subtext, lineHeight: 22 },

  /* Form */
  form:     { gap: 14, marginBottom: 24 },
  errorBox: { flexDirection: "row", alignItems: "center", gap: 7, padding: 12, borderRadius: 12, backgroundColor: C.errorDim },
  errorText:{ fontSize: 13, fontFamily: "Manrope_400Regular", color: C.error, flex: 1 },

  /* CTA */
  createBtn: {
    height: 58, backgroundColor: C.accent, borderRadius: 16,
    alignItems: "center", justifyContent: "center", marginBottom: 28,
    shadowColor: C.accent, shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.32, shadowRadius: 20, elevation: 10,
  },
  createBtnInner: { flexDirection: "row", alignItems: "center", gap: 10 },
  createBtnText:  { fontSize: 16, fontFamily: "Manrope_700Bold", color: C.btnText, letterSpacing: 0.3 },
  createArrow:    {
    width: 28, height: 28, borderRadius: 8,
    backgroundColor: "rgba(10,10,15,0.15)",
    alignItems: "center", justifyContent: "center",
  },

  /* Footer */
  footer:     { flexDirection: "row", justifyContent: "center", alignItems: "center", marginBottom: 20 },
  footerText: { fontSize: 14, fontFamily: "Manrope_400Regular", color: C.subtext },
  footerLink: { fontSize: 14, fontFamily: "Manrope_700Bold", color: C.accent },

  /* Terms */
  terms:     { paddingHorizontal: 8, marginTop: "auto" },
  termsText: { fontSize: 11, fontFamily: "Manrope_400Regular", color: C.placeholder, textAlign: "center", lineHeight: 17 },
  termsLink: { color: C.subtext, fontFamily: "Manrope_600SemiBold" },
});
