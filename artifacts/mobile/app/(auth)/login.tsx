import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as Haptics from "expo-haptics";
import { PasswordInput } from "@/components/PasswordInput";
import SocialAuthButtons from "@/components/SocialAuthButtons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useRef, useState } from "react";
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
  useWindowDimensions,
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
import { rf } from "@/utils/responsive";

const C = {
  bg:           "#FFFFFF",
  inputBg:      "#F7F8F9",
  inputBorder:  "#E8ECF4",
  inputFocus:   "#1E232C",
  text:         "#1E232C",
  placeholder:  "#8391A1",
  subtext:      "#6A707C",
  loginBtn:     "#000000",
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

/* ── Email input ────────────────────────────────────────────────────────── */
function EmailInput({
  placeholder,
  value,
  onChangeText,
  error,
  onSubmitEditing,
}: {
  placeholder: string;
  value: string;
  onChangeText: (t: string) => void;
  error?: boolean;
  onSubmitEditing?: () => void;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <View style={[inp.wrap, focused && inp.focused, error && inp.errored]}>
      <TextInput
        style={inp.field}
        placeholder={placeholder}
        placeholderTextColor={C.placeholder}
        value={value}
        onChangeText={onChangeText}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        textContentType="emailAddress"
        autoComplete="email"
        returnKeyType="next"
        onSubmitEditing={onSubmitEditing}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
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
  focused: { borderColor: C.inputFocus },
  errored: { borderColor: C.error },
  field: {
    flex: 1,
    fontSize: 15,
    fontFamily: "Manrope_400Regular",
    color: C.text,
    height: "100%",
  },
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
  const { width } = useWindowDimensions();
  const fingerprintSize = Math.min(Math.round(width * 0.24), 100);

  const passwordRef = useRef<TextInput>(null);

  const [email,       setEmail]       = useState("");
  const [password,    setPassword]    = useState("");
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState("");
  const [socialError, setSocialError] = useState("");

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
        {/* ── Top bar ── */}
        <Animated.View entering={FadeIn.duration(400)} style={s.topBar}>
          <Pressable
            style={s.backBtn}
            onPress={() => router.back()}
            hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
          >
            <Ionicons name="chevron-back" size={22} color={C.backIcon} />
          </Pressable>
          <Text style={s.wordmark}>AZA.</Text>
          <View style={{ width: 44 }} />
        </Animated.View>

        {/* ── Fingerprint icon ── */}
        <Animated.View
          entering={FadeInDown.duration(500).delay(80).springify()}
          style={s.fingerprintWrap}
        >
          <Image
            source={fingerprintImg}
            style={{ width: fingerprintSize, height: fingerprintSize }}
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
              error={!!error}
              onSubmitEditing={() => passwordRef.current?.focus()}
            />
            <PasswordInput
              value={password}
              onChangeText={t => { setPassword(t); setError(""); }}
              error={!!error}
              textContentType="password"
              returnKeyType="done"
              onSubmitEditing={handleLogin}
            />
            {error ? (
              <Animated.Text entering={FadeIn.duration(200)} style={s.errorText}>
                {error}
              </Animated.Text>
            ) : null}
            <LinkBtn
              onPress={() => { Haptics.selectionAsync(); router.push("/(auth)/forgot-password"); }}
              style={s.forgotWrap}
              textStyle={s.forgotText}
              label="Forgot Password?"
            />
          </Animated.View>
        </Animated.View>

        {/* ── Login button ── */}
        <Animated.View
          entering={FadeInUp.duration(400).delay(180).springify()}
          style={s.btnWrap}
        >
          <Animated.View style={btnStyle}>
            <Pressable
              style={[s.loginBtn, loading && { opacity: 0.75 }]}
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
                <ActivityIndicator color={C.loginBtnText} size="small" />
              ) : (
                <Text style={s.loginBtnText}>Login</Text>
              )}
            </Pressable>
          </Animated.View>
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
          style={s.socialWrap}
        >
          <SocialAuthButtons
            onSuccess={() => router.replace("/(tabs)")}
            onError={msg => { setSocialError(msg); Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error); }}
          />
          {socialError ? (
            <Animated.Text entering={FadeIn.duration(200)} style={s.socialError}>
              {socialError}
            </Animated.Text>
          ) : null}
        </Animated.View>

        {/* ── Footer ── */}
        <Animated.View
          entering={FadeInUp.duration(380).delay(340).springify()}
          style={s.footer}
        >
          <Text style={s.footerText}>Don't have an account? </Text>
          <LinkBtn
            onPress={() => router.push("/(auth)/register")}
            textStyle={s.footerLink}
            label="Register Now"
          />
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  root:   { flex: 1, backgroundColor: C.bg },
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
    fontSize: rf(32),
    fontFamily: "Manrope_700Bold",
    color: C.text,
    letterSpacing: -0.5,
  },

  fingerprintWrap: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 44,
    marginTop: 8,
  },

  form:      { gap: 16, marginBottom: 28 },
  errorText: {
    fontSize: 13,
    fontFamily: "Manrope_400Regular",
    color: C.error,
    textAlign: "center",
  },
  forgotWrap: { alignSelf: "flex-end", marginTop: 2 },
  forgotText: {
    fontSize: 14,
    fontFamily: "Manrope_600SemiBold",
    color: C.forgotText,
  },

  btnWrap: { marginBottom: 32 },
  loginBtn: {
    height: 60,
    backgroundColor: C.loginBtn,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 6,
  },
  loginBtnText: {
    fontSize: rf(16),
    fontFamily: "Manrope_700Bold",
    color: C.loginBtnText,
    letterSpacing: 0.2,
  },

  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: "#E8ECF4" },
  dividerText: {
    marginHorizontal: 12,
    fontSize: 14,
    fontFamily: "Manrope_400Regular",
    color: "#6A707C",
  },

  socialWrap:  { marginBottom: 24, gap: 10 },
  socialError: {
    fontSize: 13,
    fontFamily: "Manrope_400Regular",
    color: "#FF5B7A",
    textAlign: "center",
    marginTop: 4,
  },

  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  footerText: {
    fontSize: rf(15),
    fontFamily: "Manrope_400Regular",
    color: C.footerText,
  },
  footerLink: {
    fontSize: rf(15),
    fontFamily: "Manrope_700Bold",
    color: C.footerLink,
  },
});
