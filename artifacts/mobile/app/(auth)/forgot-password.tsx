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
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const C = {
  bg:          "#FFFFFF",
  dark:        "#1E232C",
  gray:        "#8391A1",
  inputBg:     "#F7F8F9",
  inputBorder: "#DADADA",
  inputFocus:  "#1E232C",
  primary:     "#35C2C1",
  white:       "#FFFFFF",
  btnBorder:   "#E8ECF4",
};

/* ── Email input ────────────────────────────────────────────────────────── */
function EmailInput({
  value,
  onChangeText,
}: {
  value: string;
  onChangeText: (t: string) => void;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <View
      style={[
        inp.row,
        focused && inp.focused,
      ]}
    >
      <TextInput
        style={inp.input}
        placeholder="Enter your email"
        placeholderTextColor={C.gray}
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

const inp = StyleSheet.create({
  row: {
    height: 56,
    backgroundColor: C.inputBg,
    borderWidth: 1,
    borderColor: C.inputBorder,
    borderRadius: 8,
    paddingHorizontal: 18,
    justifyContent: "center",
  },
  focused: {
    borderColor: C.inputFocus,
  },
  input: {
    fontSize: 15,
    fontFamily: "Urbanist_500Medium",
    color: C.dark,
    height: "100%",
  },
});

/* ── Main screen ──────────────────────────────────────────────────────── */
export default function ForgotPasswordScreen() {
  const router  = useRouter();
  const insets  = useSafeAreaInsets();

  const [email,   setEmail]   = useState("");
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  const btnSc    = useSharedValue(1);
  const btnStyle = useAnimatedStyle(() => ({ transform: [{ scale: btnSc.value }] }));

  const handleSubmit = () => {
    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }
    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setLoading(true);
    setError("");
    setTimeout(() => {
      setLoading(false);
      router.push("/(auth)/new-password");
    }, 1400);
  };

  return (
    <KeyboardAvoidingView
      style={s.root}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={[
          s.scroll,
          { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 32 },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* ── AZA. header ── */}
        <Animated.View entering={FadeInDown.duration(380).springify()} style={s.header}>
          <Text style={s.brand}>AZA.</Text>
        </Animated.View>

        {/* ── Back button ── */}
        <Animated.View entering={FadeInDown.duration(380).delay(40).springify()} style={s.backRow}>
          <TouchableOpacity
            style={s.backBtn}
            onPress={() => router.back()}
            activeOpacity={0.78}
          >
            <Text style={s.backArrow}>‹</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* ── Title ── */}
        <Animated.View entering={FadeInUp.duration(380).delay(80).springify()} style={s.titleBlock}>
          <Text style={s.heading}>Forgot Password?</Text>
          <Text style={s.subText}>
            Don't worry! It occurs. Please enter the email address linked with your account.
          </Text>
        </Animated.View>

        {/* ── Input ── */}
        <Animated.View entering={FadeInUp.duration(380).delay(140).springify()} style={s.formBlock}>
          <EmailInput value={email} onChangeText={t => { setEmail(t); setError(""); }} />
          {!!error && (
            <Animated.Text entering={FadeIn.duration(220)} style={s.errorText}>
              {error}
            </Animated.Text>
          )}
        </Animated.View>

        {/* ── Send Code button ── */}
        <Animated.View
          entering={FadeInUp.duration(380).delay(200).springify()}
          style={[btnStyle, s.btnWrap]}
        >
          <Pressable
            style={[s.sendBtn, loading && { opacity: 0.72 }]}
            onPress={handleSubmit}
            onPressIn={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              btnSc.value = withSpring(0.97, { damping: 13, stiffness: 320 });
            }}
            onPressOut={() => { btnSc.value = withSpring(1.0, { damping: 13, stiffness: 320 }); }}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={C.white} size="small" />
            ) : (
              <Text style={s.sendBtnText}>Send Code</Text>
            )}
          </Pressable>
        </Animated.View>

        {/* ── Footer: Remember Password? Login ── */}
        <Animated.View
          entering={FadeInUp.duration(380).delay(260).springify()}
          style={s.footer}
        >
          <Text style={s.footerText}>Remember Password? </Text>
          <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
            <Text style={s.footerLink}>Login</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  root:   { flex: 1, backgroundColor: C.bg },
  scroll: { paddingHorizontal: 28, flexGrow: 1 },

  header: { alignItems: "center", marginBottom: 32 },
  brand:  {
    fontSize: 28,
    fontFamily: "Urbanist_700Bold",
    color: C.dark,
    letterSpacing: 0.5,
  },

  backRow: { marginBottom: 32 },
  backBtn: {
    width: 41,
    height: 41,
    borderRadius: 12,
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: C.btnBorder,
    alignItems: "center",
    justifyContent: "center",
  },
  backArrow: {
    fontSize: 26,
    color: C.dark,
    lineHeight: 30,
    marginTop: -2,
  },

  titleBlock: { marginBottom: 36 },
  heading: {
    fontSize: 30,
    fontFamily: "Urbanist_700Bold",
    color: C.dark,
    letterSpacing: -0.3,
    marginBottom: 12,
    lineHeight: 39,
  },
  subText: {
    fontSize: 16,
    fontFamily: "Urbanist_500Medium",
    color: C.gray,
    lineHeight: 24,
  },

  formBlock: { marginBottom: 20 },
  errorText: {
    marginTop: 8,
    fontSize: 13,
    fontFamily: "Urbanist_500Medium",
    color: "#E74C3C",
  },

  btnWrap: { marginBottom: 28 },
  sendBtn: {
    height: 56,
    backgroundColor: C.dark,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  sendBtnText: {
    fontSize: 15,
    fontFamily: "Urbanist_600SemiBold",
    color: C.white,
    letterSpacing: 0.1,
  },

  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "auto",
    paddingTop: 24,
  },
  footerText: {
    fontSize: 15,
    fontFamily: "Urbanist_500Medium",
    color: C.dark,
    letterSpacing: 0.01 * 15,
    lineHeight: 21,
  },
  footerLink: {
    fontSize: 15,
    fontFamily: "Urbanist_700Bold",
    color: C.primary,
    letterSpacing: 0.01 * 15,
    lineHeight: 21,
  },

  sentWrap: { flex: 1, alignItems: "center", justifyContent: "center", gap: 20, paddingHorizontal: 4 },
});
