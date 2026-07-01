import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";
import * as LocalAuthentication from "expo-local-authentication";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

/* ── Storage keys ────────────────────────────────────────────────────────── */
const BIOMETRIC_KEY = "payvora_biometric_enabled";

/* ── Design tokens ───────────────────────────────────────────────────────── */
const C = {
  bg:         "#FFFFFF",
  dark:       "#1E232C",
  gray:       "#8391A1",
  iconCircle: "#F2F2F4",
  border:     "#E8ECF4",
  teal:       "#35C2C1",
  error:      "#FF5B7A",
  success:    "#00C48C",
  white:      "#FFFFFF",
};

/* ══════════════════════════════════════════════════════════════════════════
   Face ID scan icon — drawn with pure Views matching the reference exactly
   ══════════════════════════════════════════════════════════════════════════ */
function FaceIdIcon({
  circleSize = 160,
  scanning = false,
  success = false,
  failed = false,
}: {
  circleSize?: number;
  scanning?: boolean;
  success?: boolean;
  failed?: boolean;
}) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  useEffect(() => {
    if (scanning) {
      scale.value = withRepeat(
        withSequence(
          withTiming(1.06, { duration: 700 }),
          withTiming(1.0,  { duration: 700 }),
        ),
        -1,
        false,
      );
      opacity.value = withRepeat(
        withSequence(
          withTiming(0.6, { duration: 700 }),
          withTiming(1.0, { duration: 700 }),
        ),
        -1,
        false,
      );
    } else {
      cancelAnimation(scale);
      cancelAnimation(opacity);
      scale.value = withSpring(1, { damping: 14, stiffness: 200 });
      opacity.value = withTiming(1, { duration: 200 });
    }
  }, [scanning]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  /* Icon dimensions — proportional to circle */
  const ic = circleSize * 0.52;   // icon content box
  const bw = Math.round(ic * 0.047);  // bracket line thickness
  const bl = Math.round(ic * 0.3);    // bracket arm length
  const br = Math.round(bw * 1.5);    // bracket corner radius

  /* Bracket color based on state */
  const bracketColor = failed  ? C.error
    : success ? C.success
    : C.dark;

  /* Feature: bracket border style */
  const bStyle = { backgroundColor: bracketColor, borderRadius: br };

  /* Eye dims */
  const eyeW  = Math.round(ic * 0.055);
  const eyeH  = Math.round(ic * 0.22);
  const eyeX  = Math.round(ic * 0.26);
  const eyeY  = Math.round(ic * 0.28);
  const eyeR  = Math.round(eyeW / 2);

  /* Smile dims — U-shape using bottom border only */
  const smileW = Math.round(ic * 0.42);
  const smileH = Math.round(ic * 0.15);
  const smileY = Math.round(ic * 0.58);

  const circleColor = failed  ? "#FFF1F2"
    : success ? "#F0FFF8"
    : scanning ? "#EEEEF5"
    : C.iconCircle;

  return (
    <Animated.View
      style={[
        animStyle,
        fi.circle,
        {
          width:        circleSize,
          height:       circleSize,
          borderRadius: circleSize / 2,
          backgroundColor: circleColor,
        },
      ]}
    >
      {/* ── Icon content box — centered ── */}
      <View style={{ width: ic, height: ic }}>

        {/* ── Corner brackets ── */}
        {/* Top-left */}
        <View style={[fi.absH, bStyle, { top: 0, left: 0,      width: bl, height: bw }]} />
        <View style={[fi.absV, bStyle, { top: 0, left: 0,      width: bw, height: bl }]} />
        {/* Top-right */}
        <View style={[fi.absH, bStyle, { top: 0, right: 0,     width: bl, height: bw }]} />
        <View style={[fi.absV, bStyle, { top: 0, right: 0,     width: bw, height: bl }]} />
        {/* Bottom-left */}
        <View style={[fi.absH, bStyle, { bottom: 0, left: 0,   width: bl, height: bw }]} />
        <View style={[fi.absV, bStyle, { bottom: 0, left: 0,   width: bw, height: bl }]} />
        {/* Bottom-right */}
        <View style={[fi.absH, bStyle, { bottom: 0, right: 0,  width: bl, height: bw }]} />
        <View style={[fi.absV, bStyle, { bottom: 0, right: 0,  width: bw, height: bl }]} />

        {/* ── Eyes ── */}
        <View style={[fi.abs, bStyle, {
          width: eyeW, height: eyeH,
          borderRadius: eyeR,
          left: eyeX, top: eyeY,
        }]} />
        <View style={[fi.abs, bStyle, {
          width: eyeW, height: eyeH,
          borderRadius: eyeR,
          right: eyeX, top: eyeY,
        }]} />

        {/* ── Nose — short vertical line center ── */}
        <View style={[fi.abs, bStyle, {
          width: bw, height: Math.round(ic * 0.13),
          borderRadius: bw / 2,
          alignSelf: "center",
          top: eyeY + eyeH + Math.round(ic * 0.04),
          left: (ic - bw) / 2,
        }]} />

        {/* ── Smile — U-shape, bottom border only ── */}
        <View style={[fi.abs, {
          width:  smileW,
          height: smileH,
          borderBottomWidth:            bw,
          borderLeftWidth:              bw,
          borderRightWidth:             bw,
          borderTopWidth:               0,
          borderColor:                  bracketColor,
          borderBottomLeftRadius:       smileW / 2,
          borderBottomRightRadius:      smileW / 2,
          top:  smileY,
          left: (ic - smileW) / 2,
          backgroundColor: "transparent",
        }]} />

        {/* ── Success checkmark overlay ── */}
        {success && (
          <Animated.View
            entering={FadeIn.duration(280)}
            style={[fi.abs, fi.checkWrap, { width: ic * 0.5, height: ic * 0.5,
              left: ic * 0.25, top: ic * 0.25, borderRadius: ic * 0.25 }]}
          >
            <Ionicons name="checkmark" size={Math.round(ic * 0.28)} color="#FFFFFF" />
          </Animated.View>
        )}

        {/* ── Failed X overlay ── */}
        {failed && (
          <Animated.View
            entering={FadeIn.duration(280)}
            style={[fi.abs, fi.checkWrap, {
              width: ic * 0.5, height: ic * 0.5,
              left: ic * 0.25, top: ic * 0.25, borderRadius: ic * 0.25,
              backgroundColor: C.error,
            }]}
          >
            <Ionicons name="close" size={Math.round(ic * 0.28)} color="#FFFFFF" />
          </Animated.View>
        )}
      </View>
    </Animated.View>
  );
}

const fi = StyleSheet.create({
  circle: { alignItems: "center", justifyContent: "center" },
  abs:    { position: "absolute" },
  absH:   { position: "absolute" },
  absV:   { position: "absolute" },
  checkWrap: {
    position: "absolute",
    backgroundColor: C.success,
    alignItems: "center",
    justifyContent: "center",
  },
});

/* ══════════════════════════════════════════════════════════════════════════
   Feature row — matches reference: bordered icon box + bold title + gray sub
   ══════════════════════════════════════════════════════════════════════════ */
type FeatureItem = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  sub: string;
};

const FEATURES: FeatureItem[] = [
  { icon: "shield-checkmark-outline", title: "Secure",  sub: "Your data is protected with Face ID" },
  { icon: "flash-outline",            title: "Fast",    sub: "Quick access in just a glance"       },
  { icon: "lock-closed-outline",      title: "Private", sub: "Biometric data never leaves your device" },
];

function FeatureRow({ item, delay }: { item: FeatureItem; delay: number }) {
  return (
    <Animated.View
      entering={FadeInUp.duration(380).delay(delay).springify()}
      style={fr.row}
    >
      <View style={fr.iconBox}>
        <Ionicons name={item.icon} size={22} color={C.dark} />
      </View>
      <View style={fr.text}>
        <Text style={fr.title}>{item.title}</Text>
        <Text style={fr.sub}>{item.sub}</Text>
      </View>
    </Animated.View>
  );
}

const fr = StyleSheet.create({
  row:     { flexDirection: "row", alignItems: "center", gap: 16 },
  iconBox: {
    width: 48, height: 48, borderRadius: 12,
    borderWidth: 1, borderColor: C.border,
    backgroundColor: C.white,
    alignItems: "center", justifyContent: "center",
    shadowColor: "#000", shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05, shadowRadius: 3, elevation: 1,
  },
  text:    { flex: 1 },
  title:   { fontSize: 15, fontFamily: "Manrope_700Bold", color: C.dark, marginBottom: 2 },
  sub:     { fontSize: 13, fontFamily: "Manrope_400Regular", color: C.gray, lineHeight: 18 },
});

/* ══════════════════════════════════════════════════════════════════════════
   Main screen
   ══════════════════════════════════════════════════════════════════════════ */
type ScreenState = "checking" | "enroll" | "scanning" | "success" | "failed" | "unsupported";

export default function FaceIdScreen() {
  const router  = useRouter();
  const insets  = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  const circleSize = Math.min(Math.round(width * 0.42), 175);

  const [state,     setState]     = useState<ScreenState>("checking");
  const [retries,   setRetries]   = useState(0);
  const [statusMsg, setStatusMsg] = useState("");

  /* ── Shake animation for failure ── */
  const shakeX = useSharedValue(0);
  const shakeStyle = useAnimatedStyle(() => ({ transform: [{ translateX: shakeX.value }] }));

  const triggerShake = useCallback(() => {
    shakeX.value = withSequence(
      withTiming(-10, { duration: 55 }),
      withTiming(10,  { duration: 55 }),
      withTiming(-6,  { duration: 55 }),
      withTiming(6,   { duration: 55 }),
      withTiming(0,   { duration: 55 }),
    );
  }, []);

  /* ── Button press scale ── */
  const btnSc    = useSharedValue(1);
  const btnStyle = useAnimatedStyle(() => ({ transform: [{ scale: btnSc.value }] }));

  /* ── On mount: check if user already has biometrics enabled ── */
  useEffect(() => {
    (async () => {
      try {
        const hasHardware   = await LocalAuthentication.hasHardwareAsync();
        const isEnrolled    = await LocalAuthentication.isEnrolledAsync();
        const stored        = await AsyncStorage.getItem(BIOMETRIC_KEY);
        const alreadySetup  = stored === "true";

        if (!hasHardware || !isEnrolled) {
          /* Device doesn't support or has no biometrics enrolled */
          setState("unsupported");
          return;
        }

        if (alreadySetup) {
          /* Returning user — auto-trigger auth */
          setState("scanning");
          triggerBiometricAuth(true);
        } else {
          /* First time — show enrollment screen */
          setState("enroll");
        }
      } catch {
        setState("enroll");
      }
    })();
  }, []);

  /* ── Core biometric auth ── */
  const triggerBiometricAuth = useCallback(async (isRequired: boolean) => {
    setState("scanning");
    setStatusMsg("");
    try {
      const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
      const isFaceId = types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION);

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage:    isFaceId ? "Authenticate with Face ID" : "Authenticate with biometrics",
        cancelLabel:      "Cancel",
        fallbackLabel:    "Use password",
        disableDeviceFallback: false,
      });

      if (result.success) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        await AsyncStorage.setItem(BIOMETRIC_KEY, "true");
        setState("success");
        setTimeout(() => router.replace("/(tabs)"), 800);
      } else {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        if (isRequired && retries >= 2) {
          setStatusMsg("Too many failed attempts. Use your password.");
          setState("failed");
        } else {
          setRetries(r => r + 1);
          setStatusMsg(
            result.error === "user_cancel"
              ? "Authentication cancelled. Tap to try again."
              : "Face not recognised. Please try again.",
          );
          setState("failed");
          triggerShake();
        }
      }
    } catch {
      setState("failed");
      setStatusMsg("Biometric authentication unavailable.");
      triggerShake();
    }
  }, [retries, triggerShake]);

  /* ── Enable Face ID (first-time enroll) ── */
  const handleEnable = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await triggerBiometricAuth(false);
  };

  /* ── Skip ── */
  const handleSkip = async () => {
    Haptics.selectionAsync();
    await AsyncStorage.setItem(BIOMETRIC_KEY, "false");
    router.replace("/(tabs)");
  };

  /* ── Retry ── */
  const handleRetry = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    triggerBiometricAuth(true);
  };

  /* ── Unsupported — go straight to dashboard ── */
  useEffect(() => {
    if (state === "unsupported") {
      router.replace("/(tabs)");
    }
  }, [state]);

  if (state === "checking" || state === "unsupported") {
    return (
      <View style={[s.root, s.centered]}>
        <ActivityIndicator size="small" color={C.dark} />
      </View>
    );
  }

  const isScanning = state === "scanning";
  const isSuccess  = state === "success";
  const isFailed   = state === "failed";
  const isEnroll   = state === "enroll";

  return (
    <View style={[s.root, { paddingTop: insets.top + 8, paddingBottom: insets.bottom + 28 }]}>

      {/* ── Top bar ── */}
      <Animated.View entering={FadeIn.duration(400)} style={s.topBar}>
        <Pressable
          style={s.backBtn}
          onPress={() => router.back()}
          hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
        >
          <Ionicons name="chevron-back" size={22} color={C.dark} />
        </Pressable>
        <Text style={s.wordmark}>PAYVORA.</Text>
        <View style={{ width: 44 }} />
      </Animated.View>

      {/* ── Scrollable content ── */}
      <View style={s.content}>

        {/* ── Face ID icon ── */}
        <Animated.View
          entering={FadeInDown.duration(520).delay(60).springify()}
          style={s.iconWrap}
        >
          <Animated.View style={shakeStyle}>
            <FaceIdIcon
              circleSize={circleSize}
              scanning={isScanning}
              success={isSuccess}
              failed={isFailed}
            />
          </Animated.View>
        </Animated.View>

        {/* ── Title ── */}
        <Animated.View
          entering={FadeInUp.duration(400).delay(140).springify()}
          style={s.titleBlock}
        >
          <Text style={s.heading}>
            {isSuccess  ? "Authenticated!"
              : isFailed  ? "Authentication Failed"
              : isScanning ? "Scanning…"
              : "Face ID"}
          </Text>
          <Text style={s.subText}>
            {isSuccess  ? "Welcome back. Redirecting…"
              : isFailed  ? (statusMsg || "Face not recognised. Please try again.")
              : isScanning ? "Hold still while we scan your face."
              : "Use Face ID to quickly and securely\naccess your account."}
          </Text>
        </Animated.View>

        {/* ── Feature rows — only on enroll screen ── */}
        {isEnroll && (
          <View style={s.featureList}>
            {FEATURES.map((f, i) => (
              <FeatureRow key={f.title} item={f} delay={220 + i * 70} />
            ))}
          </View>
        )}

        {/* ── Scanning state: subtle caption ── */}
        {isScanning && (
          <Animated.View entering={FadeIn.duration(300)} style={s.scanningRow}>
            <ActivityIndicator size="small" color={C.dark} style={{ marginRight: 10 }} />
            <Text style={s.scanningText}>Waiting for Face ID…</Text>
          </Animated.View>
        )}
      </View>

      {/* ── Bottom CTA area ── */}
      <Animated.View
        entering={FadeInUp.duration(400).delay(320).springify()}
        style={s.cta}
      >
        {/* Primary button */}
        {(isEnroll || isFailed) && (
          <Animated.View style={btnStyle}>
            <Pressable
              style={s.primaryBtn}
              onPress={isFailed ? handleRetry : handleEnable}
              onPressIn={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                btnSc.value = withSpring(0.97, { damping: 13, stiffness: 320 });
              }}
              onPressOut={() => { btnSc.value = withSpring(1.0, { damping: 13, stiffness: 320 }); }}
            >
              <Text style={s.primaryBtnText}>
                {isFailed ? "Try Again" : "Enable Face ID"}
              </Text>
            </Pressable>
          </Animated.View>
        )}

        {/* Secondary — "Not Now" on enroll, "Use Password" on failed */}
        {isEnroll && (
          <TouchableOpacity
            onPress={handleSkip}
            activeOpacity={0.7}
            style={s.secondaryBtn}
            hitSlop={{ top: 10, bottom: 10 }}
          >
            <Text style={s.secondaryBtnText}>Not Now</Text>
          </TouchableOpacity>
        )}

        {isFailed && retries >= 2 && (
          <TouchableOpacity
            onPress={() => router.replace("/(tabs)")}
            activeOpacity={0.7}
            style={s.secondaryBtn}
            hitSlop={{ top: 10, bottom: 10 }}
          >
            <Text style={s.secondaryBtnText}>Continue without Face ID</Text>
          </TouchableOpacity>
        )}

        {/* Success state: subtle redirect message */}
        {isSuccess && (
          <Animated.View entering={FadeIn.duration(300)} style={s.successRow}>
            <Ionicons name="checkmark-circle" size={18} color={C.success} />
            <Text style={s.successText}>Face ID verified successfully</Text>
          </Animated.View>
        )}
      </Animated.View>
    </View>
  );
}

/* ── Styles ──────────────────────────────────────────────────────────────── */
const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: C.bg,
    paddingHorizontal: 24,
  },
  centered: { alignItems: "center", justifyContent: "center" },

  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  backBtn: {
    width: 44, height: 44, borderRadius: 12,
    borderWidth: 1, borderColor: C.border,
    backgroundColor: C.white,
    alignItems: "center", justifyContent: "center",
    shadowColor: "#000", shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06, shadowRadius: 4, elevation: 1,
  },
  wordmark: {
    fontSize: 22,
    fontFamily: "Manrope_700Bold",
    color: C.dark,
    letterSpacing: 1,
  },

  content: {
    flex: 1,
    alignItems: "center",
    paddingTop: 12,
  },

  iconWrap: {
    marginBottom: 32,
    alignItems: "center",
  },

  titleBlock: {
    alignItems: "center",
    marginBottom: 36,
    paddingHorizontal: 8,
  },
  heading: {
    fontSize: 26,
    fontFamily: "Manrope_700Bold",
    color: C.dark,
    letterSpacing: -0.3,
    textAlign: "center",
    marginBottom: 10,
  },
  subText: {
    fontSize: 15,
    fontFamily: "Manrope_400Regular",
    color: C.gray,
    textAlign: "center",
    lineHeight: 22,
  },

  featureList: {
    width: "100%",
    gap: 20,
  },

  scanningRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  scanningText: {
    fontSize: 14,
    fontFamily: "Manrope_400Regular",
    color: C.gray,
  },

  cta: {
    width: "100%",
    gap: 16,
    paddingTop: 8,
  },

  primaryBtn: {
    height: 60,
    backgroundColor: C.dark,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#1E232C",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 6,
  },
  primaryBtnText: {
    fontSize: 16,
    fontFamily: "Manrope_700Bold",
    color: C.white,
    letterSpacing: 0.2,
  },

  secondaryBtn: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 4,
  },
  secondaryBtnText: {
    fontSize: 15,
    fontFamily: "Manrope_600SemiBold",
    color: C.teal,
    textAlign: "center",
  },

  successRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  successText: {
    fontSize: 14,
    fontFamily: "Manrope_600SemiBold",
    color: C.success,
  },
});
