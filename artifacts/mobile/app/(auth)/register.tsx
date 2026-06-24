import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { EyeIcon } from "@/components/EyeIcon";
import { LinearGradient } from "expo-linear-gradient";
import SocialAuthButtons from "@/components/SocialAuthButtons";
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

/* ── Validation rules ────────────────────────────────────────────────────── */
const validateUsername = (v: string): string => {
  if (!v.trim()) return "Username is required";
  if (v.trim().length < 3) return "At least 3 characters required";
  if (!/^[a-zA-Z0-9_]+$/.test(v.trim())) return "Only letters, numbers & underscores";
  return "";
};
const validateEmail = (v: string): string => {
  if (!v.trim()) return "Email is required";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())) return "Enter a valid email address";
  return "";
};
const validatePassword = (v: string): string => {
  if (!v) return "Password is required";
  if (v.length < 6) return "Minimum 6 characters";
  if (!/[A-Z]/.test(v)) return "Include at least one uppercase letter";
  if (!/[0-9]/.test(v)) return "Include at least one number";
  return "";
};
const validateConfirm = (v: string, pw: string): string => {
  if (!v) return "Please confirm your password";
  if (v !== pw) return "Passwords don't match";
  return "";
};

/* ── Validated input ─────────────────────────────────────────────────────── */
function ValidatedInput({
  placeholder,
  value,
  onChangeText,
  keyboardType,
  secure,
  error,
  touched,
  onBlur,
}: {
  placeholder: string;
  value: string;
  onChangeText: (t: string) => void;
  keyboardType?: any;
  secure?: boolean;
  error?: string;
  touched?: boolean;
  onBlur?: () => void;
}) {
  const C = useColors();
  const [focused,  setFocused]  = useState(false);
  const [showPass, setShowPass] = useState(false);

  const isError = touched && !!error;
  const isValid = touched && !error && value.length > 0;

  const borderColor = isError
    ? C.destructive
    : isValid
    ? C.success
    : focused
    ? C.inputFocus
    : C.inputBorder;

  return (
    <View>
      <View
        style={[
          inp.wrap,
          { backgroundColor: C.input, borderColor },
          isValid && inp.validShadow,
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
          secureTextEntry={secure && !showPass}
          onFocus={() => setFocused(true)}
          onBlur={() => { setFocused(false); onBlur?.(); }}
        />
        {isValid && !secure && (
          <Animated.View entering={FadeIn.duration(180)}>
            <Ionicons name="checkmark-circle" size={20} color={C.success} />
          </Animated.View>
        )}
        {secure && (
          <Pressable
            onPress={() => { Haptics.selectionAsync(); setShowPass(v => !v); }}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            style={inp.eyeBtn}
          >
            <EyeIcon open={showPass} size={22} color={C.placeholder} />
          </Pressable>
        )}
      </View>
      {isError && (
        <Animated.View entering={FadeIn.duration(180)} style={inp.errorRow}>
          <Ionicons name="alert-circle-outline" size={13} color={C.destructive} />
          <Text style={[inp.errorMsg, { color: C.destructive }]}>{error}</Text>
        </Animated.View>
      )}
    </View>
  );
}

const inp = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderRadius: 14,
    paddingHorizontal: 18,
    height: 58,
  },
  validShadow: {
    shadowColor: "#00C48C",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 2,
  },
  field: {
    flex: 1,
    fontSize: 15,
    fontFamily: "Manrope_400Regular",
    height: "100%",
  },
  eyeBtn:   { padding: 2 },
  errorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 5,
    paddingLeft: 4,
  },
  errorMsg: {
    fontSize: 12,
    fontFamily: "Manrope_400Regular",
    flex: 1,
  },
});

/* ── Animated Pressable link ─────────────────────────────────────────────── */
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

/* ── Password strength indicator ─────────────────────────────────────────── */
function PasswordStrength({ value }: { value: string }) {
  const C = useColors();
  if (!value) return null;
  const hasLen   = value.length >= 6;
  const hasUpper = /[A-Z]/.test(value);
  const hasNum   = /[0-9]/.test(value);
  const score    = [hasLen, hasUpper, hasNum].filter(Boolean).length;
  const barColors = ["#FF5A6B", "#FFB020", "#00D68F"];
  const labels    = ["Weak", "Fair", "Strong"];
  const color     = barColors[score - 1] ?? C.border;
  const label     = labels[score - 1] ?? "";

  return (
    <Animated.View entering={FadeIn.duration(220)} style={ps.wrap}>
      <View style={ps.bars}>
        {[0, 1, 2].map((i) => (
          <View
            key={i}
            style={[ps.bar, { backgroundColor: i < score ? color : C.border }]}
          />
        ))}
      </View>
      {!!label && (
        <Text style={[ps.label, { color }]}>{label}</Text>
      )}
    </Animated.View>
  );
}
const ps = StyleSheet.create({
  wrap:  { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 6, paddingLeft: 2 },
  bars:  { flexDirection: "row", gap: 4, flex: 1 },
  bar:   { flex: 1, height: 3, borderRadius: 2 },
  label: { fontSize: 11, fontFamily: "Manrope_600SemiBold" },
});

/* ── Main screen ─────────────────────────────────────────────────────────── */
export default function RegisterScreen() {
  const router       = useRouter();
  const insets       = useSafeAreaInsets();
  const { register } = useAuth();
  const C            = useColors();

  const [username,    setUsername]    = useState("");
  const [email,       setEmail]       = useState("");
  const [password,    setPassword]    = useState("");
  const [confirm,     setConfirm]     = useState("");
  const [loading,     setLoading]     = useState(false);
  const [socialError, setSocialError] = useState("");

  const [touchedUsername, setTouchedUsername] = useState(false);
  const [touchedEmail,    setTouchedEmail]    = useState(false);
  const [touchedPassword, setTouchedPassword] = useState(false);
  const [touchedConfirm,  setTouchedConfirm]  = useState(false);

  const errUsername = validateUsername(username);
  const errEmail    = validateEmail(email);
  const errPassword = validatePassword(password);
  const errConfirm  = validateConfirm(confirm, password);
  const hasErrors   = !!(errUsername || errEmail || errPassword || errConfirm);

  const btnSc    = useSharedValue(1);
  const btnStyle = useAnimatedStyle(() => ({ transform: [{ scale: btnSc.value }] }));

  const shakeX     = useSharedValue(0);
  const shakeStyle = useAnimatedStyle(() => ({ transform: [{ translateX: shakeX.value }] }));

  const triggerShake = () => {
    shakeX.value = withSequence(
      withTiming(-8, { duration: 55 }),
      withTiming(8,  { duration: 55 }),
      withTiming(-5, { duration: 55 }),
      withTiming(5,  { duration: 55 }),
      withTiming(0,  { duration: 55 }),
    );
  };

  const handleRegister = async () => {
    setTouchedUsername(true);
    setTouchedEmail(true);
    setTouchedPassword(true);
    setTouchedConfirm(true);

    if (hasErrors) {
      triggerShake();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }
    setLoading(true);
    await register(username, email, password);
    setLoading(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.replace("/(auth)/otp");
  };

  return (
    <KeyboardAvoidingView
      style={[s.root, { backgroundColor: C.background }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
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

        {/* ── Heading ── */}
        <Animated.View
          entering={FadeInDown.duration(450).delay(60).springify()}
          style={s.headBlock}
        >
          <Text style={[s.heading, { color: C.text }]}>{"Welcome!\nFill your Details Here..."}</Text>
        </Animated.View>

        {/* ── Form ── */}
        <Animated.View entering={FadeInUp.duration(420).delay(120).springify()}>
          <Animated.View style={[s.form, shakeStyle]}>
            <ValidatedInput
              placeholder="Username"
              value={username}
              onChangeText={t => { setUsername(t); }}
              error={errUsername}
              touched={touchedUsername}
              onBlur={() => setTouchedUsername(true)}
            />
            <ValidatedInput
              placeholder="Email"
              value={email}
              onChangeText={t => { setEmail(t); }}
              keyboardType="email-address"
              error={errEmail}
              touched={touchedEmail}
              onBlur={() => setTouchedEmail(true)}
            />
            <View>
              <ValidatedInput
                placeholder="Password"
                value={password}
                onChangeText={t => { setPassword(t); }}
                secure
                error={errPassword}
                touched={touchedPassword}
                onBlur={() => setTouchedPassword(true)}
              />
              {touchedPassword && <PasswordStrength value={password} />}
            </View>
            <ValidatedInput
              placeholder="Confirm password"
              value={confirm}
              onChangeText={t => { setConfirm(t); }}
              secure
              error={errConfirm}
              touched={touchedConfirm}
              onBlur={() => setTouchedConfirm(true)}
            />
          </Animated.View>
        </Animated.View>

        {/* ── Register button (gradient) ── */}
        <Animated.View
          entering={FadeInUp.duration(400).delay(180).springify()}
          style={s.btnWrap}
        >
          <Animated.View style={btnStyle}>
            <LinearGradient
              colors={[C.gradientStart, C.gradientMid, C.gradientEnd] as [string, string, string]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[s.regBtnGrad, { shadowColor: C.accentGlow, opacity: loading ? 0.75 : 1 }]}
            >
              <Pressable
                style={s.regBtnPress}
                onPress={handleRegister}
                onPressIn={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  btnSc.value = withSpring(0.96, { damping: 13, stiffness: 300 });
                }}
                onPressOut={() => { btnSc.value = withSpring(1.0, { damping: 13, stiffness: 300 }); }}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={s.regBtnText}>Agree and Register</Text>
                )}
              </Pressable>
            </LinearGradient>
          </Animated.View>
        </Animated.View>

        {/* ── Divider ── */}
        <Animated.View
          entering={FadeInUp.duration(380).delay(220).springify()}
          style={s.dividerRow}
        >
          <View style={[s.dividerLine, { backgroundColor: C.border }]} />
          <Text style={[s.dividerText, { color: C.mutedForeground }]}>Or Login with</Text>
          <View style={[s.dividerLine, { backgroundColor: C.border }]} />
        </Animated.View>

        {/* ── Social buttons ── */}
        <Animated.View
          entering={FadeInUp.duration(380).delay(260).springify()}
          style={s.socialWrap}
        >
          <SocialAuthButtons
            onSuccess={() => router.replace("/(tabs)")}
            onError={msg => { setSocialError(msg); }}
          />
          {socialError ? (
            <Animated.Text entering={FadeIn.duration(200)} style={[s.socialError, { color: C.destructive }]}>
              {socialError}
            </Animated.Text>
          ) : null}
        </Animated.View>

        {/* ── Footer ── */}
        <Animated.View
          entering={FadeInUp.duration(380).delay(300).springify()}
          style={s.footer}
        >
          <Text style={[s.footerText, { color: C.mutedForeground }]}>Already have an account? </Text>
          <LinkBtn
            onPress={() => { Haptics.selectionAsync(); router.replace("/(auth)/login"); }}
            textStyle={[s.footerLink, { color: C.accent }]}
            label="Sign In"
          />
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

/* ── Styles ──────────────────────────────────────────────────────────────── */
const s = StyleSheet.create({
  root:  { flex: 1 },
  scroll: { paddingHorizontal: 24, flexGrow: 1 },

  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 32,
  },
  backBtn: {
    width: 44, height: 44, borderRadius: 12,
    borderWidth: 1,
    alignItems: "center", justifyContent: "center",
  },
  wordmark: {
    fontSize: 32,
    fontFamily: "Manrope_700Bold",
    letterSpacing: -0.5,
  },

  headBlock: { marginBottom: 32 },
  heading: {
    fontSize: 26,
    fontFamily: "Manrope_700Bold",
    lineHeight: 36,
    letterSpacing: -0.3,
  },

  form:    { gap: 14, marginBottom: 28 },

  btnWrap: { marginBottom: 32 },
  regBtnGrad: {
    height: 60,
    borderRadius: 14,
    overflow: "hidden",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 24,
    elevation: 8,
  },
  regBtnPress: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  regBtnText: {
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
