import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
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
import { useColors } from "@/hooks/useColors";

const OTP_LENGTH = 4;

/* ── Single OTP digit box ─────────────────────────────────────────────────── */
function OtpBox({
  value,
  isFocused,
  onFocus,
  inputRef,
  onKeyPress,
  onChangeText,
}: {
  value: string;
  isFocused: boolean;
  onFocus: () => void;
  inputRef: React.RefObject<TextInput | null>;
  onKeyPress: (key: string) => void;
  onChangeText: (t: string) => void;
}) {
  const C = useColors();
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  useEffect(() => {
    if (value) {
      scale.value = withSequence(
        withSpring(1.1, { damping: 8, stiffness: 300 }),
        withSpring(1.0, { damping: 14, stiffness: 300 }),
      );
    }
  }, [value]);

  const bgColor     = value || isFocused ? C.surface : C.muted;
  const borderColor = value || isFocused ? C.accent   : C.inputBorder;
  const borderWidth = value || isFocused ? 1.5        : 1;

  return (
    <Animated.View style={[ob.wrap, animStyle]}>
      <View style={[ob.box, { backgroundColor: bgColor, borderColor, borderWidth }]}>
        <TextInput
          ref={inputRef}
          style={[ob.digit, { color: C.text }]}
          value={value}
          onFocus={onFocus}
          onChangeText={onChangeText}
          onKeyPress={({ nativeEvent }) => onKeyPress(nativeEvent.key)}
          keyboardType="number-pad"
          maxLength={1}
          caretHidden
          selectTextOnFocus
        />
      </View>
    </Animated.View>
  );
}

const ob = StyleSheet.create({
  wrap: {},
  box: {
    width: 69,
    height: 60,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  digit: {
    fontFamily: "Manrope_700Bold",
    fontSize: 22,
    lineHeight: 26,
    textAlign: "center",
    width: "100%",
    height: "100%",
    padding: 0,
  },
});

/* ── Main screen ─────────────────────────────────────────────────────────── */
export default function OtpScreen() {
  const router  = useRouter();
  const insets  = useSafeAreaInsets();
  const params  = useLocalSearchParams<{ email?: string }>();
  const email   = params.email ?? "";
  const C       = useColors();

  const [digits,    setDigits]    = useState<string[]>(["", "", "", ""]);
  const [focused,   setFocused]   = useState(0);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState("");
  const [resent,    setResent]    = useState(false);
  const [countdown, setCountdown] = useState(0);

  const refs = [
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
  ];

  useEffect(() => {
    setTimeout(() => refs[0].current?.focus(), 300);
  }, []);

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const handleChange = (index: number, text: string) => {
    const digit = text.replace(/[^0-9]/g, "").slice(-1);
    const next = [...digits];
    next[index] = digit;
    setDigits(next);
    setError("");
    if (digit && index < OTP_LENGTH - 1) {
      refs[index + 1].current?.focus();
      setFocused(index + 1);
    }
  };

  const handleKeyPress = (index: number, key: string) => {
    if (key === "Backspace") {
      if (digits[index]) {
        const next = [...digits];
        next[index] = "";
        setDigits(next);
      } else if (index > 0) {
        refs[index - 1].current?.focus();
        setFocused(index - 1);
        const next = [...digits];
        next[index - 1] = "";
        setDigits(next);
      }
    }
  };

  const btnSc    = useSharedValue(1);
  const btnStyle = useAnimatedStyle(() => ({ transform: [{ scale: btnSc.value }] }));

  const handleVerify = () => {
    const code = digits.join("");
    if (code.length < OTP_LENGTH) {
      setError("Please enter the complete 4-digit code.");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }
    setLoading(true);
    setError("");
    setTimeout(() => {
      setLoading(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace("/(tabs)");
    }, 1200);
  };

  const handleResend = () => {
    if (countdown > 0) return;
    setDigits(["", "", "", ""]);
    setFocused(0);
    setError("");
    setResent(true);
    setCountdown(30);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setTimeout(() => refs[0].current?.focus(), 100);
    setTimeout(() => setResent(false), 2500);
  };

  const isComplete = digits.every(d => d !== "");

  return (
    <KeyboardAvoidingView
      style={[s.root, { backgroundColor: C.background }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View
        style={[
          s.inner,
          { paddingTop: insets.top + 8, paddingBottom: insets.bottom + 32 },
        ]}
      >
        {/* ── Top bar ── */}
        <Animated.View entering={FadeIn.duration(400)} style={s.topBar}>
          <TouchableOpacity
            style={[s.backBtn, { borderColor: C.border, backgroundColor: C.surface }]}
            onPress={() => router.back()}
            activeOpacity={0.8}
          >
            <Ionicons name="chevron-back" size={22} color={C.text} />
          </TouchableOpacity>
          <Text style={[s.wordmark, { color: C.text }]}>AZA.</Text>
          <View style={{ width: 44 }} />
        </Animated.View>

        {/* ── Heading ── */}
        <Animated.View
          entering={FadeInDown.duration(450).delay(60).springify()}
          style={s.headBlock}
        >
          <Text style={[s.heading, { color: C.text }]}>OTP Verification</Text>
          <Text style={[s.subheading, { color: C.mutedForeground }]}>
            {"Enter the verification code we just sent on your\nemail address."}
          </Text>
        </Animated.View>

        {/* ── OTP boxes ── */}
        <Animated.View
          entering={FadeInUp.duration(420).delay(120).springify()}
          style={s.otpRow}
        >
          {digits.map((d, i) => (
            <OtpBox
              key={i}
              value={d}
              isFocused={focused === i}
              onFocus={() => setFocused(i)}
              inputRef={refs[i]}
              onChangeText={text => handleChange(i, text)}
              onKeyPress={key => handleKeyPress(i, key)}
            />
          ))}
        </Animated.View>

        {error ? (
          <Animated.Text entering={FadeIn.duration(200)} style={[s.errorText, { color: C.destructive }]}>
            {error}
          </Animated.Text>
        ) : null}

        {resent ? (
          <Animated.Text entering={FadeIn.duration(200)} style={[s.resentText, { color: C.success }]}>
            Code resent successfully!
          </Animated.Text>
        ) : null}

        {/* ── Verify button (gradient) ── */}
        <Animated.View
          entering={FadeInUp.duration(400).delay(180).springify()}
          style={[btnStyle, s.btnWrap]}
        >
          <LinearGradient
            colors={[C.gradientStart, C.gradientMid, C.gradientEnd] as [string, string, string]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[
              s.verifyBtnGrad,
              { shadowColor: C.accentGlow, opacity: (!isComplete || loading) ? 0.65 : 1 },
            ]}
          >
            <Pressable
              style={s.verifyBtnPress}
              onPress={handleVerify}
              onPressIn={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                btnSc.value = withSpring(0.96, { damping: 13, stiffness: 300 });
              }}
              onPressOut={() => {
                btnSc.value = withSpring(1.0, { damping: 13, stiffness: 300 });
              }}
              disabled={!isComplete || loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={s.verifyBtnText}>Verify</Text>
              )}
            </Pressable>
          </LinearGradient>
        </Animated.View>

        {/* ── Resend row ── */}
        <Animated.View
          entering={FadeInUp.duration(380).delay(220).springify()}
          style={s.resendRow}
        >
          <Image
            source={require("../../assets/images/didnt-received-code.png")}
            style={s.resendLabelImg}
            resizeMode="contain"
          />
          <TouchableOpacity
            onPress={handleResend}
            activeOpacity={countdown > 0 ? 1 : 0.7}
            disabled={countdown > 0}
            style={countdown > 0 ? { opacity: 0.45 } : undefined}
          >
            {countdown > 0 ? (
              <Text style={[s.resendCountdown, { color: C.accent }]}>{`(${countdown}s)`}</Text>
            ) : (
              <Image
                source={require("../../assets/images/resend.png")}
                style={s.resendImg}
                resizeMode="contain"
              />
            )}
          </TouchableOpacity>
        </Animated.View>
      </View>
    </KeyboardAvoidingView>
  );
}

/* ── Styles ──────────────────────────────────────────────────────────────── */
const s = StyleSheet.create({
  root:  { flex: 1 },
  inner: { flex: 1, paddingHorizontal: 24 },

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

  headBlock:  { marginBottom: 40 },
  heading: {
    fontSize: 28,
    fontFamily: "Manrope_700Bold",
    letterSpacing: -0.4,
    marginBottom: 12,
  },
  subheading: {
    fontSize: 15,
    fontFamily: "Manrope_400Regular",
    lineHeight: 22,
  },

  otpRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  errorText: {
    fontSize: 13,
    fontFamily: "Manrope_400Regular",
    textAlign: "center",
    marginBottom: 8,
  },
  resentText: {
    fontSize: 13,
    fontFamily: "Manrope_600SemiBold",
    textAlign: "center",
    marginBottom: 8,
  },

  btnWrap: { marginTop: 28, marginBottom: 32 },
  verifyBtnGrad: {
    height: 60,
    borderRadius: 14,
    overflow: "hidden",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 24,
    elevation: 8,
  },
  verifyBtnPress: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  verifyBtnText: {
    fontSize: 16,
    fontFamily: "Manrope_700Bold",
    color: "#FFFFFF",
    letterSpacing: 0.2,
  },

  resendRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
  },
  resendLabelImg: { height: 21, width: 146 },
  resendImg: { height: 21, width: 50 },
  resendCountdown: {
    fontSize: 15,
    fontFamily: "Manrope_700Bold",
    lineHeight: 21,
  },
});
