import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
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
import { useColors } from "@/hooks/useColors";

function EmailInput({
  value,
  onChangeText,
}: {
  value: string;
  onChangeText: (t: string) => void;
}) {
  const C = useColors();
  const [focused, setFocused] = useState(false);
  return (
    <View
      style={[
        inp.row,
        {
          backgroundColor: C.input,
          borderColor: focused ? C.inputFocus : C.inputBorder,
          borderWidth: focused ? 1.5 : 1,
        },
      ]}
    >
      <TextInput
        style={[inp.input, { color: C.text }]}
        placeholder="Enter your email"
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

const inp = StyleSheet.create({
  row: {
    height: 56,
    borderRadius: 8,
    paddingHorizontal: 18,
    justifyContent: "center",
  },
  input: {
    fontSize: 15,
    fontFamily: "Manrope_400Regular",
    height: "100%",
  },
});

export default function ForgotPasswordScreen() {
  const router  = useRouter();
  const insets  = useSafeAreaInsets();
  const C       = useColors();

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

        {/* ── Title ── */}
        <Animated.View entering={FadeInUp.duration(380).delay(80).springify()} style={s.titleBlock}>
          <Text style={[s.heading, { color: C.text }]}>Forgot Password?</Text>
          <Text style={[s.subText, { color: C.mutedForeground }]}>
            Don't worry! It occurs. Please enter the email address linked with your account.
          </Text>
        </Animated.View>

        {/* ── Input ── */}
        <Animated.View entering={FadeInUp.duration(380).delay(140).springify()} style={s.formBlock}>
          <EmailInput value={email} onChangeText={t => { setEmail(t); setError(""); }} />
          {!!error && (
            <Animated.Text entering={FadeIn.duration(220)} style={[s.errorText, { color: C.destructive }]}>
              {error}
            </Animated.Text>
          )}
        </Animated.View>

        {/* ── Send Code button (gradient) ── */}
        <Animated.View
          entering={FadeInUp.duration(380).delay(200).springify()}
          style={[btnStyle, s.btnWrap]}
        >
          <LinearGradient
            colors={[C.gradientStart, C.gradientMid, C.gradientEnd] as [string, string, string]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[s.sendBtnGrad, { shadowColor: C.accentGlow, opacity: loading ? 0.72 : 1 }]}
          >
            <Pressable
              style={s.sendBtnPress}
              onPress={handleSubmit}
              onPressIn={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                btnSc.value = withSpring(0.97, { damping: 13, stiffness: 320 });
              }}
              onPressOut={() => { btnSc.value = withSpring(1.0, { damping: 13, stiffness: 320 }); }}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={s.sendBtnText}>Send Code</Text>
              )}
            </Pressable>
          </LinearGradient>
        </Animated.View>

        {/* ── Footer ── */}
        <Animated.View
          entering={FadeInUp.duration(380).delay(260).springify()}
          style={s.footer}
        >
          <Text style={[s.footerText, { color: C.mutedForeground }]}>Remember Password? </Text>
          <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
            <Text style={[s.footerLink, { color: C.accent }]}>Login</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

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
    width: 44, height: 44, borderRadius: 12, borderWidth: 1,
    alignItems: "center", justifyContent: "center",
  },
  wordmark: {
    fontSize: 32,
    fontFamily: "Manrope_700Bold",
    letterSpacing: -0.5,
  },

  titleBlock: { marginBottom: 36 },
  heading: {
    fontSize: 30,
    fontFamily: "Manrope_700Bold",
    letterSpacing: -0.3,
    marginBottom: 12,
    lineHeight: 39,
  },
  subText: {
    fontSize: 16,
    fontFamily: "Manrope_400Regular",
    lineHeight: 24,
  },

  formBlock: { marginBottom: 20 },
  errorText: {
    marginTop: 8,
    fontSize: 13,
    fontFamily: "Manrope_400Regular",
  },

  btnWrap: { marginBottom: 28 },
  sendBtnGrad: {
    height: 60,
    borderRadius: 14,
    overflow: "hidden",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 24,
    elevation: 8,
  },
  sendBtnPress: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  sendBtnText: {
    fontSize: 16,
    fontFamily: "Manrope_700Bold",
    color: "#FFFFFF",
    letterSpacing: 0.2,
  },

  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "auto",
    paddingTop: 24,
  },
  footerText: { fontSize: 15, fontFamily: "Manrope_400Regular", lineHeight: 21 },
  footerLink: { fontSize: 15, fontFamily: "Manrope_700Bold", lineHeight: 21 },
});
