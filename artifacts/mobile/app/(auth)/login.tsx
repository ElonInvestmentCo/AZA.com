import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as Haptics from "expo-haptics";
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

/* ── Design tokens (light theme matching reference) ─────────────────────── */
const C = {
  bg:           "#FFFFFF",
  inputBg:      "#F7F8F9",
  inputBorder:  "#E8ECF4",
  inputFocus:   "#1E232C",
  text:         "#1E232C",
  placeholder:  "#8391A1",
  subtext:      "#6A707C",
  loginBtn:     "#1E232C",
  loginBtnText: "#FFFFFF",
  forgotText:   "#6A707C",
  divider:      "#E8ECF4",
  dividerText:  "#1E232C",
  socialBg:     "#FFFFFF",
  socialBorder: "#E8ECF4",
  footerText:   "#1E232C",
  footerLink:   "#35C2C1",
  backBg:       "#FFFFFF",
  backBorder:   "#E8ECF4",
  backIcon:     "#1E232C",
  error:        "#FF5B7A",
};

const fingerprintImg = require("@/assets/images/fingerprint.png");
const btnGoogleImg   = require("@/assets/images/btn-social-google.png");
const btnAppleImg    = require("@/assets/images/btn-social-apple.png");

const eyeOpenImg   = require("../../assets/images/eye-open.svg");
const eyeClosedImg = require("../../assets/images/eye-closed.svg");

/* ── Password input ─────────────────────────────────────────────────────── */
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
  const [focused, setFocused] = useState(false);

  return (
    <View
      style={[
        inp.wrap,
        focused && inp.focused,
        error && inp.errored,
      ]}
    >
      <TextInput
        style={inp.field}
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

function PasswordInput({
  value,
  onChangeText,
  error,
}: {
  value: string;
  onChangeText: (t: string) => void;
  error?: boolean;
}) {
  const [focused,  setFocused]  = useState(false);
  const [showPass, setShowPass] = useState(false);

  return (
    <View
      style={[
        inp.wrap,
        focused && inp.focused,
        error && inp.errored,
      ]}
    >
      <TextInput
        style={inp.field}
        placeholder="Enter your password"
        placeholderTextColor={C.placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={!showPass}
        autoCapitalize="none"
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
      <TouchableOpacity
        onPress={() => setShowPass(v => !v)}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        style={inp.eyeBtn}
      >
        <Image
          source={showPass ? eyeOpenImg : eyeClosedImg}
          style={{ width: 22, height: 22 }}
          contentFit="contain"
        />
      </TouchableOpacity>
    </View>
  );
}

const inp = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.inputBg,
    borderWidth: 1,
    borderColor: C.inputBorder,
    borderRadius: 14,
    paddingHorizontal: 18,
    height: 58,
  },
  focused: {
    borderColor: C.inputFocus,
  },
  errored: {
    borderColor: C.error,
  },
  field: {
    flex: 1,
    fontSize: 15,
    fontFamily: "Manrope_400Regular",
    color: C.text,
    height: "100%",
  },
  eyeBtn: {
    padding: 2,
  },
});

/* ── Social button ──────────────────────────────────────────────────────── */
function SocialBtn({ children }: { children: React.ReactNode }) {
  const sc = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: sc.value }],
  }));

  return (
    <Animated.View style={[animStyle, { flex: 1 }]}>
      <Pressable
        style={sb.btn}
        onPressIn={() => {
          sc.value = withSpring(0.93, { damping: 12, stiffness: 300 });
        }}
        onPressOut={() => {
          sc.value = withSpring(1.0, { damping: 12, stiffness: 300 });
        }}
      >
        {children}
      </Pressable>
    </Animated.View>
  );
}

const sb = StyleSheet.create({
  btn: {
    height: 60,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: C.socialBorder,
    backgroundColor: C.socialBg,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
});

/* ── Main screen ────────────────────────────────────────────────────────── */
export default function LoginScreen() {
  const router    = useRouter();
  const insets    = useSafeAreaInsets();
  const { login } = useAuth();

  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

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
      <StatusBar style="dark" />

      <ScrollView
        contentContainerStyle={[
          s.scroll,
          { paddingTop: insets.top + 8, paddingBottom: insets.bottom + 32 },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* ── Top bar: Logo + Back ── */}
        <Animated.View entering={FadeIn.duration(400)} style={s.topBar}>
          <TouchableOpacity
            style={s.backBtn}
            onPress={() => router.back()}
            activeOpacity={0.8}
          >
            <Ionicons name="chevron-back" size={22} color={C.backIcon} />
          </TouchableOpacity>

          <Text style={s.wordmark}>AZA.</Text>

          {/* spacer to center the logo */}
          <View style={{ width: 44 }} />
        </Animated.View>

        {/* ── Fingerprint icon ── */}
        <Animated.View
          entering={FadeInDown.duration(500).delay(80).springify()}
          style={s.fingerprintWrap}
        >
          <Image
            source={fingerprintImg}
            style={{ width: 90, height: 90 }}
            contentFit="contain"
            cachePolicy="memory-disk"
          />
        </Animated.View>

        {/* ── Form ── */}
        <Animated.View
          entering={FadeInUp.duration(420).delay(120).springify()}
          style={[s.form, shakeStyle]}
        >
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
            <Animated.Text entering={FadeIn.duration(200)} style={s.errorText}>
              {error}
            </Animated.Text>
          ) : null}

          <TouchableOpacity
            onPress={() => router.push("/(auth)/forgot-password")}
            style={s.forgotWrap}
            activeOpacity={0.7}
          >
            <Text style={s.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* ── Login button ── */}
        <Animated.View
          entering={FadeInUp.duration(400).delay(180).springify()}
          style={[btnStyle, s.btnWrap]}
        >
          <Pressable
            style={[s.loginBtn, loading && { opacity: 0.75 }]}
            onPress={handleLogin}
            onPressIn={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              btnSc.value = withSpring(0.96, { damping: 13, stiffness: 300 });
            }}
            onPressOut={() => {
              btnSc.value = withSpring(1.0, { damping: 13, stiffness: 300 });
            }}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={C.loginBtnText} size="small" />
            ) : (
              <Text style={s.loginBtnText}>Login</Text>
            )}
          </Pressable>
        </Animated.View>

        {/* ── Or Login with ── */}
        <Animated.View
          entering={FadeInUp.duration(380).delay(260).springify()}
          style={s.dividerRow}
        >
          <View style={s.dividerLine} />
          <Text style={s.dividerText}>Or Login with</Text>
          <View style={s.dividerLine} />
        </Animated.View>

        {/* ── Social buttons ── */}
        <Animated.View
          entering={FadeInUp.duration(380).delay(300).springify()}
          style={s.socialRow}
        >
          <Image source={btnGoogleImg} style={s.socialBtn} contentFit="contain" />
          <Image source={btnAppleImg}  style={s.socialBtn} contentFit="contain" />
        </Animated.View>

        {/* ── Footer ── */}
        <Animated.View
          entering={FadeInUp.duration(380).delay(340).springify()}
          style={s.footer}
        >
          <Text style={s.footerText}>Don't have an account? </Text>
          <TouchableOpacity
            onPress={() => router.push("/(auth)/register")}
            activeOpacity={0.7}
          >
            <Text style={s.footerLink}>Register Now</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

/* ── Styles ─────────────────────────────────────────────────────────────── */
const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: C.bg,
  },
  scroll: {
    paddingHorizontal: 24,
    flexGrow: 1,
  },

  /* Top bar */
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
    borderColor: C.backBorder,
    backgroundColor: C.backBg,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 1,
  },
  wordmark: {
    fontSize: 32,
    fontFamily: "Manrope_700Bold",
    color: C.text,
    letterSpacing: -0.5,
  },

  /* Fingerprint */
  fingerprintWrap: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 44,
    marginTop: 8,
  },

  /* Form */
  form: {
    gap: 16,
    marginBottom: 28,
  },
  errorText: {
    fontSize: 13,
    fontFamily: "Manrope_400Regular",
    color: C.error,
    textAlign: "center",
  },
  forgotWrap: {
    alignSelf: "flex-end",
    marginTop: 2,
  },
  forgotText: {
    fontSize: 14,
    fontFamily: "Manrope_600SemiBold",
    color: C.forgotText,
  },

  /* Login button */
  btnWrap: {
    marginBottom: 32,
  },
  loginBtn: {
    height: 60,
    backgroundColor: C.loginBtn,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#1E232C",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 6,
  },
  loginBtnText: {
    fontSize: 16,
    fontFamily: "Manrope_700Bold",
    color: C.loginBtnText,
    letterSpacing: 0.2,
  },

  /* Divider — from CSS spec */
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E8ECF4",
  },
  dividerText: {
    fontSize: 14,
    fontFamily: "Manrope_600SemiBold",
    color: "#6A707C",
    marginHorizontal: 12,
    lineHeight: 17,
  },

  /* Social */
  socialRow: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 40,
  },

  /* Divider + Social */
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E8ECF4",
  },
  dividerText: {
    marginHorizontal: 12,
    fontSize: 14,
    fontFamily: "Manrope_400Regular",
    color: "#6A707C",
  },
  socialRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
    marginBottom: 24,
  },
  socialBtn: {
    width: 150,
    height: 56,
  },

  /* Footer */
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  footerText: {
    fontSize: 15,
    fontFamily: "Manrope_400Regular",
    color: C.footerText,
  },
  footerLink: {
    fontSize: 15,
    fontFamily: "Manrope_700Bold",
    color: C.footerLink,
  },
});
