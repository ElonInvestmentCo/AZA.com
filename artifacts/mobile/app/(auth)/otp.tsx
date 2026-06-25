import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Image } from "expo-image";
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

/* ── Design tokens — light theme matching login/register ─────────────────── */
const C = {
  bg:          "#FFFFFF",
  inputBg:     "#F7F8F9",
  inputBorder: "#E8ECF4",
  inputFocus:  "#35C2C1",   /* Primary teal — CSS spec */
  text:        "#1E232C",
  subtext:     "#8391A1",
  placeholder: "#8391A1",
  btn:         "#1E232C",
  btnText:     "#FFFFFF",
  resend:      "#35C2C1",
  error:       "#FF5B7A",
};

const OTP_LENGTH = 4;

/* ── Responsive OTP box sizing ──────────────────────────────────────────────
 * Box width is derived from the available screen width so it scales on
 * every device: from iPhone SE (320pt) to iPad / foldable / desktop.
 * Formula: (screenWidth - horizontalPadding*2 - gap*(boxes-1)) / boxCount
 * ─────────────────────────────────────────────────────────────────────────── */
function useOtpBoxSize() {
  const { width } = useWindowDimensions();
  const hPad = 24 * 2;      // paddingHorizontal: 24 on both sides
  const gaps = 10 * 3;      // 10pt gap between 4 boxes
  const boxW = Math.min((width - hPad - gaps) / OTP_LENGTH, 80);
  const boxH = Math.round(boxW * 0.87);  // preserve ~69:60 ratio
  return { boxW, boxH };
}

/* ── Single OTP digit box — matches CSS spec exactly ─────────────────────── */
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
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  boxFilled: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1.2,
    borderColor: "#35C2C1",
  },
  boxFocused: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1.2,
    borderColor: "#35C2C1",
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
  const params  = useLocalSearchParams<{ email?: string }>();
  const email   = params.email ?? "";
  const { boxW, boxH } = useOtpBoxSize();

  const [digits,   setDigits]   = useState<string[]>(["", "", "", ""]);
  const [focused,  setFocused]  = useState(0);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");
  const [resent,   setResent]   = useState(false);
  const [countdown, setCountdown] = useState(0);

  const refs = [
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
  ];

  /* Auto-focus first box on mount */
  useEffect(() => {
    setTimeout(() => refs[0].current?.focus(), 300);
  }, []);

  /* Countdown timer for resend */
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

  /* Button spring */
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
    /* Simulate verification — navigate to main app on success */
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
          <Text style={s.wordmark}>AZA.</Text>
          <View style={{ width: 44 }} />
        </Animated.View>

        {/* ── Heading — "OTP Verification" from image ── */}
        <Animated.View
          entering={FadeInDown.duration(450).delay(60).springify()}
          style={s.headBlock}
        >
          <Text style={s.heading}>OTP Verification</Text>
          <Text style={s.subheading}>
            {"Enter the verification code we just sent on your\nemail address."}
          </Text>
        </Animated.View>

        {/* ── OTP boxes — CSS spec: 69×60, radius 8, #35C2C1 border ── */}
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
        {error ? (
          <Animated.Text entering={FadeIn.duration(200)} style={s.errorText}>
            {error}
          </Animated.Text>
        ) : null}

        {/* Resent toast */}
        {resent ? (
          <Animated.Text
            entering={FadeIn.duration(200)}
            style={s.resentText}
          >
            Code resent successfully!
          </Animated.Text>
        ) : null}

        {/* ── Verify button ── */}
        <Animated.View
          entering={FadeInUp.duration(400).delay(180).springify()}
          style={[btnStyle, s.btnWrap]}
        >
          <Pressable
            style={[s.verifyBtn, (!isComplete || loading) && { opacity: 0.65 }]}
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
              <Text style={s.verifyBtnText}>Verify</Text>
            )}
          </Pressable>
        </Animated.View>

        {/* ── "Didn't received code? Resend" ── */}
        <Animated.View
          entering={FadeInUp.duration(380).delay(220).springify()}
          style={s.resendRow}
        >
          <Image
            source={require("../../assets/images/didnt-received-code.png")}
            style={s.resendLabelImg}
            contentFit="contain"
            cachePolicy="memory-disk"
          />
          <TouchableOpacity
            onPress={handleResend}
            activeOpacity={countdown > 0 ? 1 : 0.7}
            disabled={countdown > 0}
            style={countdown > 0 && { opacity: 0.45 }}
          >
            {countdown > 0 ? (
              <Text style={s.resendCountdown}>{`(${countdown}s)`}</Text>
            ) : (
              <Image
                source={require("../../assets/images/resend.png")}
                style={s.resendImg}
                contentFit="contain"
                cachePolicy="memory-disk"
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
  root:  { flex: 1, backgroundColor: C.bg },
  inner: { flex: 1, paddingHorizontal: 24 },

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

  headBlock:  { marginBottom: 40 },
  heading: {
    fontSize: 28,
    fontFamily: "Manrope_700Bold",
    color: C.text,
    letterSpacing: -0.4,
    marginBottom: 12,
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
    gap: 10,
    marginBottom: 12,
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
    color: C.resend,
    textAlign: "center",
    marginBottom: 8,
  },

  btnWrap: { marginTop: 28, marginBottom: 32 },
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
    gap: 4,
  },
  resendLabelImg: {
    height: 21,
    width: 146,
  },
  resendImg: {
    height: 21,
    width: 50,
  },
  resendCountdown: {
    fontSize: 15,
    fontFamily: "Manrope_700Bold",
    color: "#35C2C1",
    lineHeight: 21,
  },
});
