import { Ionicons } from "@expo/vector-icons";
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
  success:     "#00C48C",
};

function EmailInput({
  value,
  onChangeText,
}: {
  value: string;
  onChangeText: (t: string) => void;
}) {
  const [focused, setFocused] = useState(false);
  const isValid = value.includes("@") && value.includes(".");

  return (
    <View style={[inp.row, focused && inp.focused, isValid && inp.valid]}>
      <TextInput
        style={inp.input}
        placeholder="Enter your email"
        placeholderTextColor={C.gray}
        value={value}
        onChangeText={onChangeText}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        textContentType="emailAddress"
        autoComplete="email"
        returnKeyType="done"
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
      {isValid && (
        <Animated.View entering={FadeIn.duration(200)}>
          <Ionicons name="checkmark-circle" size={18} color={C.success} style={{ marginLeft: 8 }} />
        </Animated.View>
      )}
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
    flexDirection: "row",
    alignItems: "center",
  },
  focused: { borderColor: C.inputFocus },
  valid:   { borderColor: C.success, borderWidth: 1.5 },
  input: {
    flex: 1,
    fontSize: 15,
    fontFamily: "Manrope_400Regular",
    color: C.dark,
    height: "100%",
  },
});

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
      router.push({ pathname: "/(auth)/otp", params: { email: email.trim(), mode: "reset" } });
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
            <Ionicons name="chevron-back" size={22} color={C.dark} />
          </Pressable>
          <Text style={s.wordmark}>PayVora.</Text>
          <View style={{ width: 44 }} />
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

        {/* ── Footer ── */}
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
  scroll: { paddingHorizontal: 24, flexGrow: 1 },

  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 32,
  },
  backBtn: {
    width: 44, height: 44, borderRadius: 12,
    borderWidth: 1, borderColor: C.btnBorder,
    backgroundColor: C.white,
    alignItems: "center", justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06, shadowRadius: 4, elevation: 1,
  },
  wordmark: { fontSize: 32, fontFamily: "Manrope_700Bold", color: C.dark, letterSpacing: -0.5 },

  titleBlock: { marginBottom: 36 },
  heading: {
    fontSize: 30, fontFamily: "Manrope_700Bold", color: C.dark,
    letterSpacing: -0.3, marginBottom: 12, lineHeight: 39,
  },
  subText: { fontSize: 16, fontFamily: "Manrope_400Regular", color: C.gray, lineHeight: 24 },

  formBlock: { marginBottom: 20 },
  errorText: { marginTop: 8, fontSize: 13, fontFamily: "Manrope_400Regular", color: "#E74C3C" },

  btnWrap: { marginBottom: 28 },
  sendBtn: {
    height: 60, backgroundColor: C.dark,
    borderRadius: 14, alignItems: "center", justifyContent: "center",
    shadowColor: "#1E232C", shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18, shadowRadius: 12, elevation: 6,
  },
  sendBtnText: { fontSize: 16, fontFamily: "Manrope_700Bold", color: C.white, letterSpacing: 0.2 },

  footer: {
    flexDirection: "row", justifyContent: "center", alignItems: "center",
    marginTop: "auto", paddingTop: 24,
  },
  footerText: { fontSize: 15, fontFamily: "Manrope_400Regular", color: C.dark, lineHeight: 21 },
  footerLink: { fontSize: 15, fontFamily: "Manrope_700Bold", color: C.primary, lineHeight: 21 },
});
