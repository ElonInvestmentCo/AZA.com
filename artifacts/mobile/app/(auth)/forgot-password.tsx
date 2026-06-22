import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
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
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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
  error:       "#FF5B7A",
  errorDim:    "rgba(255,91,122,0.10)",
};

/* ─── Animated input ────────────────────────────────────────────────────────── */
function FinInput({
  placeholder, value, onChangeText, error,
}: { placeholder: string; value: string; onChangeText: (t: string) => void; error?: boolean }) {
  const [focused, setFocused] = useState(false);
  return (
    <View style={[fi.row, focused && fi.focused, error && fi.errored]}>
      <Feather
        name="mail" size={17}
        color={focused ? C.inputFocus : error ? C.error : C.placeholder}
        style={{ marginRight: 12 }}
      />
      <TextInput
        style={fi.input}
        placeholder={placeholder}
        placeholderTextColor={C.placeholder}
        value={value}
        onChangeText={onChangeText}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
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

/* ─── Sent success state ────────────────────────────────────────────────────── */
function SentView({ email, onBack }: { email: string; onBack: () => void }) {
  const iconScale = useSharedValue(0);
  const iconOp    = useSharedValue(0);
  const ringScale = useSharedValue(0.6);
  const ringOp    = useSharedValue(0);

  useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    iconOp.value    = withTiming(1, { duration: 300 });
    iconScale.value = withSequence(
      withSpring(1.25, { damping: 7,  stiffness: 180 }),
      withSpring(1.0,  { damping: 14, stiffness: 180 }),
    );
    ringOp.value    = withDelay(80, withTiming(1,   { duration: 400 }));
    ringScale.value = withDelay(80, withSpring(1.0, { damping: 14, stiffness: 100 }));
  }, []);

  const iconStyle = useAnimatedStyle(() => ({
    opacity:   iconOp.value,
    transform: [{ scale: iconScale.value }],
  }));
  const ringStyle = useAnimatedStyle(() => ({
    opacity:   ringOp.value,
    transform: [{ scale: ringScale.value }],
  }));

  return (
    <Animated.View
      entering={FadeIn.duration(350)}
      style={sv.root}
    >
      {/* Check icon */}
      <View style={sv.iconWrap}>
        <Animated.View style={[sv.ring, ringStyle]} />
        <Animated.View style={[sv.circle, iconStyle]}>
          <Feather name="send" size={30} color={C.accent} />
        </Animated.View>
      </View>

      <Animated.View entering={FadeInDown.duration(380).springify().delay(200)} style={{ alignItems: "center", gap: 10 }}>
        <Text style={sv.title}>Check your inbox!</Text>
        <Text style={sv.desc}>
          We've sent a password reset link to
        </Text>
        <View style={sv.emailPill}>
          <Text style={sv.emailText}>{email}</Text>
        </View>
        <Text style={[sv.desc, { fontSize: 13 }]}>
          It may take a few minutes. Check your spam folder too.
        </Text>
      </Animated.View>

      <Animated.View entering={FadeInUp.duration(380).springify().delay(320)} style={{ width: "100%", gap: 12 }}>
        <TouchableOpacity style={sv.backBtn} onPress={onBack} activeOpacity={0.85}>
          <Text style={sv.backBtnText}>Back to Sign In</Text>
        </TouchableOpacity>
        <Text style={sv.resend}>
          Didn't receive it?{" "}
          <Text style={{ color: C.accent, fontFamily: "Manrope_600SemiBold" }}>Resend</Text>
        </Text>
      </Animated.View>
    </Animated.View>
  );
}

const sv = StyleSheet.create({
  root:     { flex: 1, alignItems: "center", justifyContent: "center", gap: 28, paddingHorizontal: 8 },
  iconWrap: { alignItems: "center", justifyContent: "center" },
  ring:     { position: "absolute", width: 120, height: 120, borderRadius: 60, borderWidth: 1.5, borderColor: "rgba(0,217,160,0.22)" },
  circle:   { width: 88, height: 88, borderRadius: 44, backgroundColor: "rgba(0,217,160,0.12)", alignItems: "center", justifyContent: "center", borderWidth: 1.5, borderColor: "rgba(0,217,160,0.28)" },
  title:    { fontSize: 26, fontFamily: "Manrope_700Bold", color: "#fff", letterSpacing: -0.5 },
  desc:     { fontSize: 14, fontFamily: "Manrope_400Regular", color: C.subtext, textAlign: "center", lineHeight: 21 },
  emailPill:{ backgroundColor: C.accentDim, paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, borderWidth: 1, borderColor: "rgba(0,217,160,0.2)" },
  emailText:{ fontSize: 14, fontFamily: "Manrope_600SemiBold", color: C.accent },
  backBtn:  { height: 56, backgroundColor: C.accent, borderRadius: 16, alignItems: "center", justifyContent: "center", shadowColor: C.accent, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.28, shadowRadius: 16, elevation: 8 },
  backBtnText: { fontSize: 16, fontFamily: "Manrope_700Bold", color: C.btnText },
  resend:   { fontSize: 13, fontFamily: "Manrope_400Regular", color: C.subtext, textAlign: "center" },
});

/* ─── Main screen ───────────────────────────────────────────────────────────── */
export default function ForgotPasswordScreen() {
  const router  = useRouter();
  const insets  = useSafeAreaInsets();

  const [email,   setEmail]   = useState("");
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");
  const [sent,    setSent]    = useState(false);

  /* Button spring */
  const btnSc    = useSharedValue(1);
  const btnStyle = useAnimatedStyle(() => ({ transform: [{ scale: btnSc.value }] }));

  const handleSubmit = () => {
    if (!email) {
      setError("Please enter your email address.");
      return;
    }
    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    setLoading(true);
    setError("");
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 1400);
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
          { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 40 },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* ── Back button ── */}
        {!sent && (
          <Animated.View entering={FadeInDown.duration(420).springify()} style={s.topRow}>
            <TouchableOpacity
              style={s.backBtn}
              onPress={() => router.back()}
              activeOpacity={0.78}
            >
              <Feather name="chevron-left" size={20} color={C.text} />
            </TouchableOpacity>
          </Animated.View>
        )}

        {sent ? (
          /* ── Sent success state ── */
          <SentView email={email} onBack={() => router.back()} />
        ) : (
          <>
            {/* ── Lock icon hero ── */}
            <Animated.View entering={FadeInUp.duration(450).springify().delay(60)} style={s.hero}>
              <View style={s.heroIconWrap}>
                <View style={s.heroRingOuter} />
                <View style={s.heroRingInner} />
                <View style={s.heroCircle}>
                  <Feather name="lock" size={28} color={C.accent} />
                </View>
              </View>
            </Animated.View>

            {/* ── Heading ── */}
            <Animated.View entering={FadeInUp.duration(420).springify().delay(120)} style={s.headBlock}>
              <Text style={s.heading}>Reset Password</Text>
              <Text style={s.headSub}>
                No worries! Enter your registered email and we'll send you a secure reset link instantly.
              </Text>
            </Animated.View>

            {/* ── Form ── */}
            <Animated.View entering={FadeInUp.duration(400).springify().delay(180)} style={s.form}>
              <View style={{ gap: 6 }}>
                <Text style={s.inputLabel}>Email Address</Text>
                <FinInput
                  placeholder="Enter your email"
                  value={email}
                  onChangeText={t => { setEmail(t); setError(""); }}
                  error={!!error}
                />
              </View>

              {error ? (
                <Animated.View entering={FadeIn.duration(250)} style={s.errorBox}>
                  <Feather name="alert-circle" size={13} color={C.error} />
                  <Text style={s.errorText}>{error}</Text>
                </Animated.View>
              ) : null}
            </Animated.View>

            {/* ── CTA ── */}
            <Animated.View
              entering={FadeInUp.duration(400).springify().delay(240)}
              style={btnStyle}
            >
              <Pressable
                style={[s.submitBtn, loading && { opacity: 0.72 }]}
                onPress={handleSubmit}
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
                  <View style={s.submitBtnInner}>
                    <Text style={s.submitBtnText}>Send Reset Link</Text>
                    <View style={s.submitArrow}>
                      <Feather name="send" size={14} color={C.accent} />
                    </View>
                  </View>
                )}
              </Pressable>
            </Animated.View>

            {/* ── Footer ── */}
            <Animated.View
              entering={FadeInUp.duration(380).springify().delay(300)}
              style={s.footer}
            >
              <Text style={s.footerText}>Remember your password? </Text>
              <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
                <Text style={s.footerLink}>Sign In</Text>
              </TouchableOpacity>
            </Animated.View>

            {/* ── Security note ── */}
            <Animated.View
              entering={FadeInUp.duration(380).springify().delay(340)}
              style={s.secBadge}
            >
              <Feather name="shield" size={11} color={C.placeholder} />
              <Text style={s.secText}>Reset link expires in 10 minutes for your security</Text>
            </Animated.View>
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

/* ─── Styles ────────────────────────────────────────────────────────────────── */
const s = StyleSheet.create({
  root:   { flex: 1, backgroundColor: C.bg },
  scroll: { paddingHorizontal: 24, flexGrow: 1 },

  glow: {
    position: "absolute", top: -60, left: -60,
    width: 240, height: 240, borderRadius: 120,
    backgroundColor: C.accentGlow, pointerEvents: "none",
  },

  topRow:  { marginBottom: 40 },
  backBtn: {
    width: 44, height: 44, borderRadius: 14,
    backgroundColor: C.surface, alignItems: "center", justifyContent: "center",
    borderWidth: 1, borderColor: C.inputBorder, alignSelf: "flex-start",
  },

  /* Hero icon */
  hero:          { alignItems: "center", marginBottom: 40 },
  heroIconWrap:  { position: "relative", alignItems: "center", justifyContent: "center", width: 120, height: 120 },
  heroRingOuter: { position: "absolute", inset: 0, borderRadius: 60, borderWidth: 1.5, borderColor: "rgba(0,217,160,0.12)" },
  heroRingInner: { position: "absolute", inset: 16, borderRadius: 44, borderWidth: 1, borderColor: "rgba(0,217,160,0.20)" },
  heroCircle:    {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: C.accentDim, alignItems: "center", justifyContent: "center",
    borderWidth: 1.5, borderColor: "rgba(0,217,160,0.28)",
  },

  headBlock: { marginBottom: 32 },
  heading:   { fontSize: 28, fontFamily: "Manrope_700Bold", color: C.text, letterSpacing: -0.6, marginBottom: 10 },
  headSub:   { fontSize: 15, fontFamily: "Manrope_400Regular", color: C.subtext, lineHeight: 23 },

  form:       { gap: 14, marginBottom: 24 },
  inputLabel: { fontSize: 13, fontFamily: "Manrope_600SemiBold", color: C.subtext },
  errorBox:   { flexDirection: "row", alignItems: "center", gap: 7, padding: 12, borderRadius: 12, backgroundColor: C.errorDim },
  errorText:  { fontSize: 13, fontFamily: "Manrope_400Regular", color: C.error, flex: 1 },

  submitBtn: {
    height: 58, backgroundColor: C.accent, borderRadius: 16,
    alignItems: "center", justifyContent: "center", marginBottom: 28,
    shadowColor: C.accent, shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.32, shadowRadius: 20, elevation: 10,
  },
  submitBtnInner: { flexDirection: "row", alignItems: "center", gap: 10 },
  submitBtnText:  { fontSize: 16, fontFamily: "Manrope_700Bold", color: C.btnText, letterSpacing: 0.3 },
  submitArrow:    {
    width: 28, height: 28, borderRadius: 8,
    backgroundColor: "rgba(10,10,15,0.15)",
    alignItems: "center", justifyContent: "center",
  },

  footer:     { flexDirection: "row", justifyContent: "center", alignItems: "center", marginBottom: 20 },
  footerText: { fontSize: 14, fontFamily: "Manrope_400Regular", color: C.subtext },
  footerLink: { fontSize: 14, fontFamily: "Manrope_700Bold", color: C.accent },

  secBadge: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 5, marginTop: "auto" },
  secText:  { fontSize: 11, fontFamily: "Manrope_400Regular", color: C.placeholder, textAlign: "center", lineHeight: 16 },
});
