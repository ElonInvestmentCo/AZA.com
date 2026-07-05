import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { PayvoraWordmark } from "@/components/PayvoraWordmark";
import { useLocalSearchParams, useRouter } from "expo-router";
import { apiFetch } from "@/utils/api";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
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

/* ── Design tokens ───────────────────────────────────────────────────────── */
const C = {
  bg:          "#FFFFFF",
  inputBg:     "#F7F8F9",
  inputBorder: "#E8ECF4",
  inputFocus:  "#1E232C",
  text:        "#1E232C",
  subtext:     "#8391A1",
  placeholder: "#8391A1",
  btn:         "#1E232C",
  btnText:     "#FFFFFF",
  resend:      "#1E232C",
  error:       "#FF5B7A",
  success:     "#00C48C",
};

const OTP_LENGTH = 4;
const RESEND_SECONDS = 30;

function useOtpBoxSize() {
  const { width } = useWindowDimensions();
  const hPad = 24 * 2;
  const gaps = 12 * 3;
  const boxW = Math.min((width - hPad - gaps) / OTP_LENGTH, 80);
  const boxH = Math.round(boxW * 0.87);
  return { boxW, boxH };
}

/* ── Single OTP digit box ─────────────────────────────────────────────────── */
function OtpBox({
  value,
  isFocused,
  onFocus,
  inputRef,
  onKeyPress,
  onChangeText,
  boxW,
  boxH,
  smsAutofill,
}: {
  value: string;
  isFocused: boolean;
  onFocus: () => void;
  inputRef: React.RefObject<TextInput | null>;
  onKeyPress: (key: string) => void;
  onChangeText: (t: string) => void;
  boxW: number;
  boxH: number;
  smsAutofill?: boolean;
}) {
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

  const boxStyle = value
    ? ob.boxFilled
    : isFocused
    ? ob.boxFocused
    : ob.boxEmpty;

  return (
    <Animated.View style={animStyle}>
      <View style={[ob.box, boxStyle, { width: boxW, height: boxH }]}>
        <TextInput
          ref={inputRef}
          style={[ob.digit, { fontSize: Math.round(boxH * 0.38) }]}
          value={value}
          onFocus={onFocus}
          onChangeText={onChangeText}
          onKeyPress={({ nativeEvent }) => onKeyPress(nativeEvent.key)}
          keyboardType="number-pad"
          maxLength={1}
          caretHidden
          selectTextOnFocus
          textContentType={smsAutofill ? "oneTimeCode" : "none"}
        />
      </View>
    </Animated.View>
  );
}

const ob = StyleSheet.create({
  box: {
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  boxFilled: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "#18c4bf",
  },
  boxFocused: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "#18c4bf",
  },
  boxEmpty: {
    backgroundColor: "#F7F8F9",
    borderWidth: 1,
    borderColor: "#E8ECF4",
  },
  digit: {
    fontFamily: "Manrope_700Bold",
    lineHeight: undefined,
    color: "#1E232C",
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
  const params  = useLocalSearchParams<{ email?: string; mode?: string }>();
  const email   = params.email ?? "";
  /**
   * mode = "reset"  → navigating from Forgot Password; after verify go to new-password
   * mode = "login"  → navigating from Login; after verify go to /(tabs)
   */
  const isReset = params.mode === "reset";
  const { boxW, boxH } = useOtpBoxSize();

  const [digits,    setDigits]    = useState<string[]>(["", "", "", ""]);
  const [focused,   setFocused]   = useState(0);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState("");
  const [resent,    setResent]    = useState(false);
  const [countdown, setCountdown] = useState(RESEND_SECONDS);

  const refs = [
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
  ];

  /* Auto-focus first box on mount */
  useEffect(() => {
    const t = setTimeout(() => refs[0].current?.focus(), 350);
    return () => clearTimeout(t);
  }, []);

  /* Countdown timer */
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

  const handleVerify = async () => {
    const code = digits.join("");
    if (code.length < OTP_LENGTH) {
      setError("Please enter the complete 4-digit code.");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }
    setLoading(true);
    setError("");

    if (isReset) {
      try {
        const { resetToken } = await apiFetch<{ ok: boolean; resetToken: string }>(
          "/auth/verify-otp",
          { method: "POST", body: JSON.stringify({ email, code }) },
        );
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        router.replace({
          pathname: "/(auth)/new-password",
          params: { verified: "1", email, resetToken },
        } as any);
      } catch (err: any) {
        setLoading(false);
        setError(err.message || "Invalid or expired code.");
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    } else {
      /* Login flow — local biometric gate, no server round-trip needed */
      setTimeout(() => {
        setLoading(false);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        router.replace("/(auth)/face-id" as any);
      }, 800);
    }
  };

  const handleResend = () => {
    if (countdown > 0) return;
    setDigits(["", "", "", ""]);
    setFocused(0);
    setError("");
    setResent(true);
    setCountdown(RESEND_SECONDS);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setTimeout(() => refs[0].current?.focus(), 100);
    setTimeout(() => setResent(false), 2500);
  };

  const isComplete = digits.every(d => d !== "");

  const padded = (n: number) => String(n).padStart(2, "0");

  return (
    <KeyboardAvoidingView
      style={s.root}
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
            style={s.backBtn}
            onPress={() => router.back()}
            activeOpacity={0.8}
          >
            <Ionicons name="chevron-back" size={22} color={C.text} />
          </TouchableOpacity>
          <PayvoraWordmark width={148} height={38} />
          <View style={{ width: 44 }} />
        </Animated.View>

        {/* ── Heading ── */}
        <Animated.View
          entering={FadeInDown.duration(450).delay(60).springify()}
          style={s.headBlock}
        >
          <Text style={s.heading}>
            {isReset ? "Verify Your Email" : "OTP Verification"}
          </Text>
          <Text style={s.subheading}>
            {email
              ? `We sent a 4-digit code to\n${email}`
              : "Enter the verification code we sent to your email address."}
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
              boxW={boxW}
              boxH={boxH}
              smsAutofill={i === 0}
            />
          ))}
        </Animated.View>

        {/* Error */}
        {!!error && (
          <Animated.Text entering={FadeIn.duration(200)} style={s.errorText}>
            {error}
          </Animated.Text>
        )}

        {/* Resent toast */}
        {resent && (
          <Animated.Text entering={FadeIn.duration(200)} style={s.resentText}>
            Code resent successfully!
          </Animated.Text>
        )}

        {/* ── Verify button ── */}
        <Animated.View
          entering={FadeInUp.duration(400).delay(180).springify()}
          style={[btnStyle, s.btnWrap]}
        >
          <Pressable
            style={[s.verifyBtn, (!isComplete || loading) && { opacity: 0.5 }]}
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
              <ActivityIndicator color={C.btnText} size="small" />
            ) : (
              <Text style={s.verifyBtnText}>
                {isReset ? "Verify Code" : "Verify"}
              </Text>
            )}
          </Pressable>
        </Animated.View>

        {/* ── Resend row — clean text, no images ── */}
        <Animated.View
          entering={FadeInUp.duration(380).delay(220).springify()}
          style={s.resendRow}
        >
          <Text style={s.resendLabel}>Didn't receive the code? </Text>
          {countdown > 0 ? (
            <Text style={s.resendTimer}>
              Resend in{" "}
              <Text style={s.resendTimerBold}>
                00:{padded(countdown)}
              </Text>
            </Text>
          ) : (
            <TouchableOpacity
              onPress={handleResend}
              activeOpacity={0.7}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={s.resendBtn}>Resend</Text>
            </TouchableOpacity>
          )}
        </Animated.View>

        {/* ── Expired / invalid hint ── */}
        {isReset && (
          <Animated.View
            entering={FadeIn.duration(400).delay(300)}
            style={s.hintRow}
          >
            <Ionicons name="shield-checkmark-outline" size={14} color={C.subtext} />
            <Text style={s.hintText}>
              Code expires in 10 minutes. Request a new one if expired.
            </Text>
          </Animated.View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

/* ── Styles ──────────────────────────────────────────────────────────────── */
const s = StyleSheet.create({
  root:  { flex: 1, backgroundColor: C.bg },
  inner: { flex: 1, paddingHorizontal: 24 },

  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 36,
  },
  backBtn: {
    width: 44, height: 44, borderRadius: 12,
    borderWidth: 1, borderColor: C.inputBorder,
    backgroundColor: C.bg,
    alignItems: "center", justifyContent: "center",
  },
  wordmark: {
    fontSize: 22,
    fontFamily: "Manrope_700Bold",
    color: C.text,
    letterSpacing: 1,
  },

  headBlock:  { marginBottom: 40 },
  heading: {
    fontSize: 28,
    fontFamily: "Manrope_700Bold",
    color: C.text,
    letterSpacing: -0.4,
    marginBottom: 10,
  },
  subheading: {
    fontSize: 15,
    fontFamily: "Manrope_400Regular",
    color: C.subtext,
    lineHeight: 22,
  },

  otpRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    marginBottom: 16,
  },

  errorText: {
    fontSize: 13,
    fontFamily: "Manrope_400Regular",
    color: C.error,
    textAlign: "center",
    marginBottom: 8,
  },
  resentText: {
    fontSize: 13,
    fontFamily: "Manrope_600SemiBold",
    color: C.success,
    textAlign: "center",
    marginBottom: 8,
  },

  btnWrap: { marginTop: 28, marginBottom: 28 },
  verifyBtn: {
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
  verifyBtnText: {
    fontSize: 16,
    fontFamily: "Manrope_700Bold",
    color: C.btnText,
    letterSpacing: 0.2,
  },

  resendRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 2,
  },
  resendLabel: {
    fontSize: 15,
    fontFamily: "Manrope_400Regular",
    color: C.subtext,
    lineHeight: 22,
  },
  resendTimer: {
    fontSize: 15,
    fontFamily: "Manrope_400Regular",
    color: C.subtext,
    lineHeight: 22,
  },
  resendTimerBold: {
    fontFamily: "Manrope_700Bold",
    color: C.text,
  },
  resendBtn: {
    fontSize: 15,
    fontFamily: "Manrope_700Bold",
    color: C.text,
    lineHeight: 22,
    textDecorationLine: "underline",
  },

  hintRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 6,
    marginTop: 20,
    paddingHorizontal: 4,
  },
  hintText: {
    flex: 1,
    fontSize: 12,
    fontFamily: "Manrope_400Regular",
    color: C.subtext,
    lineHeight: 18,
  },
});
