import { Ionicons } from "@expo/vector-icons";
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

/* ── Assets ─────────────────────────────────────────────────────────────── */
const btnGoogleImg = require("@/assets/images/btn-social-google.png");
const btnAppleImg  = require("@/assets/images/btn-social-apple.png");
const eyeOpenImg   = require("../../assets/images/eye-open.svg");
const eyeClosedImg = require("../../assets/images/eye-closed.svg");

/* ── Design tokens (light theme — matches reference screenshot) ───────────── */
const C = {
  bg:          "#FFFFFF",
  inputBg:     "#F7F8F9",
  inputBorder: "#E8ECF4",
  inputFocus:  "#1E232C",
  text:        "#1E232C",
  placeholder: "#8391A1",
  subtext:     "#6A707C",
  btn:         "#1E232C",
  btnText:     "#FFFFFF",
  error:       "#FF5B7A",
  footerLink:  "#35C2C1",
};

/* ── Plain input (no left icon — matches reference) ──────────────────────── */
function PlainInput({
  placeholder,
  value,
  onChangeText,
  keyboardType,
  secure,
  error,
}: {
  placeholder: string;
  value: string;
  onChangeText: (t: string) => void;
  keyboardType?: any;
  secure?: boolean;
  error?: boolean;
}) {
  const [focused,  setFocused]  = useState(false);
  const [showPass, setShowPass] = useState(false);

  return (
    <View style={[inp.wrap, focused && inp.focused, error && inp.errored]}>
      <TextInput
        style={inp.field}
        placeholder={placeholder}
        placeholderTextColor={C.placeholder}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        autoCapitalize="none"
        secureTextEntry={secure && !showPass}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
      {secure && (
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
      )}
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
  eyeBtn: { padding: 2 },
});

/* ── Social button ────────────────────────────────────────────────────────── */
function SocialBtn({ children }: { children: React.ReactNode }) {
  const sc = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: sc.value }] }));
  return (
    <Animated.View style={[animStyle, { flex: 1 }]}>
      <Pressable
        style={sb.btn}
        onPressIn={() => { sc.value = withSpring(0.93, { damping: 12, stiffness: 300 }); }}
        onPressOut={() => { sc.value = withSpring(1.0, { damping: 12, stiffness: 300 }); }}
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
    borderColor: C.inputBorder,
    backgroundColor: C.bg,
    alignItems: "center",
    justifyContent: "center",
  },
});

/* ── Main screen ─────────────────────────────────────────────────────────── */
export default function RegisterScreen() {
  const router       = useRouter();
  const insets       = useSafeAreaInsets();
  const { register } = useAuth();

  const [username,  setUsername]  = useState("");
  const [email,     setEmail]     = useState("");
  const [password,  setPassword]  = useState("");
  const [confirm,   setConfirm]   = useState("");
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState("");

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
    if (!username || !email || !password || !confirm) {
      setError("Please fill in all fields.");
      triggerShake();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
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
    await register(username, email, password);
    setLoading(false);
    router.replace("/(auth)/pin");
  };

  return (
    <KeyboardAvoidingView
      style={s.root}
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
          <TouchableOpacity
            style={s.backBtn}
            onPress={() => router.back()}
            activeOpacity={0.8}
          >
            <Ionicons name="chevron-back" size={22} color={C.text} />
          </TouchableOpacity>
          <Text style={s.wordmark}>AZA.</Text>
          <View style={{ width: 44 }} />
        </Animated.View>

        {/* ── Heading ── */}
        <Animated.View
          entering={FadeInDown.duration(450).delay(60).springify()}
          style={s.headBlock}
        >
          <Text style={s.heading}>{"Welcome!\nFill your Details Here..."}</Text>
        </Animated.View>

        {/* ── Form ── */}
        <Animated.View
          entering={FadeInUp.duration(420).delay(120).springify()}
          style={[s.form, shakeStyle]}
        >
          <PlainInput
            placeholder="Username"
            value={username}
            onChangeText={t => { setUsername(t); setError(""); }}
            error={!!error}
          />
          <PlainInput
            placeholder="Email"
            value={email}
            onChangeText={t => { setEmail(t); setError(""); }}
            keyboardType="email-address"
            error={!!error}
          />
          <PlainInput
            placeholder="Password"
            value={password}
            onChangeText={t => { setPassword(t); setError(""); }}
            secure
            error={!!error}
          />
          <PlainInput
            placeholder="Confirm password"
            value={confirm}
            onChangeText={t => { setConfirm(t); setError(""); }}
            secure
            error={!!error}
          />

          {error ? (
            <Animated.Text entering={FadeIn.duration(200)} style={s.errorText}>
              {error}
            </Animated.Text>
          ) : null}
        </Animated.View>

        {/* ── Agree and Register button ── */}
        <Animated.View
          entering={FadeInUp.duration(400).delay(180).springify()}
          style={[btnStyle, s.btnWrap]}
        >
          <Pressable
            style={[s.regBtn, loading && { opacity: 0.75 }]}
            onPress={handleRegister}
            onPressIn={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              btnSc.value = withSpring(0.96, { damping: 13, stiffness: 300 });
            }}
            onPressOut={() => { btnSc.value = withSpring(1.0, { damping: 13, stiffness: 300 }); }}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={C.btnText} size="small" />
            ) : (
              <Text style={s.regBtnText}>Agree and Register</Text>
            )}
          </Pressable>
        </Animated.View>

        {/* ── Or Login with ── */}
        <Animated.View
          entering={FadeInUp.duration(380).delay(220).springify()}
          style={s.dividerRow}
        >
          <View style={s.dividerLine} />
          <Text style={s.dividerText}>Or Login with</Text>
          <View style={s.dividerLine} />
        </Animated.View>

        {/* ── Social buttons ── */}
        <Animated.View
          entering={FadeInUp.duration(380).delay(260).springify()}
          style={s.socialRow}
        >
          <Image source={btnGoogleImg} style={s.socialBtn} contentFit="contain" />
          <Image source={btnAppleImg}  style={s.socialBtn} contentFit="contain" />
        </Animated.View>

        {/* ── Footer ── */}
        <Animated.View
          entering={FadeInUp.duration(380).delay(300).springify()}
          style={s.footer}
        >
          <Text style={s.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
            <Text style={s.footerLink}>Sign In</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

/* ── Styles ──────────────────────────────────────────────────────────────── */
const s = StyleSheet.create({
  root:  { flex: 1, backgroundColor: C.bg },
  scroll:{ paddingHorizontal: 24, flexGrow: 1 },

  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 32,
  },
  backBtn: {
    width: 44, height: 44, borderRadius: 12,
    borderWidth: 1, borderColor: C.inputBorder,
    backgroundColor: C.bg,
    alignItems: "center", justifyContent: "center",
  },
  wordmark: {
    fontSize: 32,
    fontFamily: "Manrope_700Bold",
    color: C.text,
    letterSpacing: -0.5,
  },

  headBlock: { marginBottom: 32 },
  heading: {
    fontSize: 26,
    fontFamily: "Manrope_700Bold",
    color: C.text,
    lineHeight: 36,
    letterSpacing: -0.3,
  },

  form:      { gap: 16, marginBottom: 28 },
  errorText: {
    fontSize: 13,
    fontFamily: "Manrope_400Regular",
    color: C.error,
    textAlign: "center",
  },

  btnWrap: { marginBottom: 32 },
  regBtn: {
    height: 60,
    backgroundColor: C.btn,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#1E232C",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 6,
  },
  regBtnText: {
    fontSize: 16,
    fontFamily: "Manrope_700Bold",
    color: C.btnText,
    letterSpacing: 0.2,
  },

  /* Divider — CSS spec: Line1(111.66px) | text | Line2(110.66px), #E8ECF4, 1px */
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

  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  footerText: {
    fontSize: 15,
    fontFamily: "Manrope_400Regular",
    color: C.text,
  },
  footerLink: {
    fontSize: 15,
    fontFamily: "Manrope_700Bold",
    color: C.footerLink,
  },
});
