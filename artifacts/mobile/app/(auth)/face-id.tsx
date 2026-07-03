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
  Easing,
  FadeIn,
  FadeInDown,
  FadeInUp,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

/* ── Storage keys ────────────────────────────────────────────────────────── */
const BIOMETRIC_KEY = "payvora_biometric_enabled";

/* ── Design tokens — unchanged from original ─────────────────────────────── */
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
   Pulse ring — one animated ring that expands outward and fades.
   Multiple instances with staggered delays create a sonar / radar effect.
   ══════════════════════════════════════════════════════════════════════════ */
function PulseRing({
  size,
  color,
  delay,
  duration = 2000,
}: {
  size: number;
  color: string;
  delay: number;
  duration?: number;
}) {
  const scale   = useSharedValue(1);
  const opacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1,    { duration: 0 }),
          withTiming(1.55, { duration, easing: Easing.out(Easing.quad) }),
        ),
        -1,
        false,
      ),
    );
    opacity.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(0.28, { duration: 0 }),
          withTiming(0,    { duration, easing: Easing.out(Easing.quad) }),
        ),
        -1,
        false,
      ),
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity:   opacity.value,
  }));

  return (
    <Animated.View
      style={[
        style,
        {
          position:     "absolute",
          width:        size,
          height:       size,
          borderRadius: size / 2,
          borderWidth:  1.5,
          borderColor:  color,
        },
      ]}
    />
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   Sweep scan line — a glowing horizontal bar that travels top→bottom
   inside the Face ID circle during scanning state.
   ══════════════════════════════════════════════════════════════════════════ */
function ScanLine({
  circleSize,
  active,
}: {
  circleSize: number;
  active: boolean;
}) {
  const translateY = useSharedValue(-(circleSize * 0.32));
  const opacity    = useSharedValue(0);

  useEffect(() => {
    if (active) {
      opacity.value    = withTiming(1, { duration: 200 });
      translateY.value = withRepeat(
        withSequence(
          withTiming(-(circleSize * 0.32), { duration: 0 }),
          withTiming(circleSize * 0.32,    { duration: 1200, easing: Easing.inOut(Easing.sin) }),
          withTiming(-(circleSize * 0.32), { duration: 1200, easing: Easing.inOut(Easing.sin) }),
        ),
        -1,
        false,
      );
    } else {
      cancelAnimation(translateY);
      cancelAnimation(opacity);
      opacity.value = withTiming(0, { duration: 200 });
    }
  }, [active, circleSize]);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity:   opacity.value,
  }));

  const lineW = Math.round(circleSize * 0.6);

  return (
    <Animated.View
      style={[
        style,
        {
          position:     "absolute",
          width:        lineW,
          height:       2,
          borderRadius: 1,
          backgroundColor: C.teal,
          /* glow via shadow */
          shadowColor:     C.teal,
          shadowOffset:    { width: 0, height: 0 },
          shadowOpacity:   0.9,
          shadowRadius:    6,
        },
      ]}
      pointerEvents="none"
    />
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   Face ID icon — corner brackets + face features, animated on state changes.
   Logic identical to original; only ambient glow and scan-line overlay added.
   ══════════════════════════════════════════════════════════════════════════ */
function FaceIdIcon({
  circleSize = 160,
  scanning   = false,
  success    = false,
  failed     = false,
}: {
  circleSize?: number;
  scanning?:   boolean;
  success?:    boolean;
  failed?:     boolean;
}) {
  const scale   = useSharedValue(1);
  const opacity = useSharedValue(1);

  useEffect(() => {
    if (scanning) {
      scale.value = withRepeat(
        withSequence(
          withTiming(1.04, { duration: 800 }),
          withTiming(1.0,  { duration: 800 }),
        ),
        -1,
        false,
      );
      opacity.value = withRepeat(
        withSequence(
          withTiming(0.75, { duration: 800 }),
          withTiming(1.0,  { duration: 800 }),
        ),
        -1,
        false,
      );
    } else {
      cancelAnimation(scale);
      cancelAnimation(opacity);
      scale.value   = withSpring(1,   { damping: 14, stiffness: 200 });
      opacity.value = withTiming(1, { duration: 200 });
    }
  }, [scanning]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity:   opacity.value,
  }));

  const ic = circleSize * 0.52;
  const bw = Math.round(ic * 0.047);
  const bl = Math.round(ic * 0.3);
  const br = Math.round(bw * 1.5);

  const bracketColor = failed ? C.error : success ? C.success : C.dark;
  const bStyle = { backgroundColor: bracketColor, borderRadius: br };

  const eyeW = Math.round(ic * 0.055);
  const eyeH = Math.round(ic * 0.22);
  const eyeX = Math.round(ic * 0.26);
  const eyeY = Math.round(ic * 0.28);
  const eyeR = Math.round(eyeW / 2);

  const smileW = Math.round(ic * 0.42);
  const smileH = Math.round(ic * 0.15);
  const smileY = Math.round(ic * 0.58);

  const circleColor = failed   ? "#FFF1F2"
    : success  ? "#F0FFF8"
    : scanning ? "#EEEEF5"
    : C.iconCircle;

  /* Teal ring highlight when scanning */
  const ringColor = scanning ? C.teal : "transparent";

  return (
    <Animated.View
      style={[
        animStyle,
        fi.circle,
        {
          width:           circleSize,
          height:          circleSize,
          borderRadius:    circleSize / 2,
          backgroundColor: circleColor,
          /* Premium border ring — teal when scanning, invisible otherwise */
          borderWidth:  scanning ? 1.5 : 0,
          borderColor:  ringColor,
          /* Elevated shadow */
          shadowColor:   scanning ? C.teal : "#000",
          shadowOffset:  { width: 0, height: scanning ? 0 : 6 },
          shadowOpacity: scanning ? 0.28 : 0.08,
          shadowRadius:  scanning ? 18 : 16,
          elevation:     8,
        },
      ]}
    >
      <View style={{ width: ic, height: ic }}>
        {/* Corner brackets */}
        <View style={[fi.absH, bStyle, { top: 0, left: 0,     width: bl, height: bw }]} />
        <View style={[fi.absV, bStyle, { top: 0, left: 0,     width: bw, height: bl }]} />
        <View style={[fi.absH, bStyle, { top: 0, right: 0,    width: bl, height: bw }]} />
        <View style={[fi.absV, bStyle, { top: 0, right: 0,    width: bw, height: bl }]} />
        <View style={[fi.absH, bStyle, { bottom: 0, left: 0,  width: bl, height: bw }]} />
        <View style={[fi.absV, bStyle, { bottom: 0, left: 0,  width: bw, height: bl }]} />
        <View style={[fi.absH, bStyle, { bottom: 0, right: 0, width: bl, height: bw }]} />
        <View style={[fi.absV, bStyle, { bottom: 0, right: 0, width: bw, height: bl }]} />

        {/* Eyes */}
        <View style={[fi.abs, bStyle, { width: eyeW, height: eyeH, borderRadius: eyeR, left: eyeX, top: eyeY }]} />
        <View style={[fi.abs, bStyle, { width: eyeW, height: eyeH, borderRadius: eyeR, right: eyeX, top: eyeY }]} />

        {/* Nose */}
        <View style={[fi.abs, bStyle, {
          width: bw, height: Math.round(ic * 0.13),
          borderRadius: bw / 2,
          left: (ic - bw) / 2,
          top:  eyeY + eyeH + Math.round(ic * 0.04),
        }]} />

        {/* Smile */}
        <View style={[fi.abs, {
          width: smileW, height: smileH,
          borderBottomWidth:       bw,
          borderLeftWidth:         bw,
          borderRightWidth:        bw,
          borderTopWidth:          0,
          borderColor:             bracketColor,
          borderBottomLeftRadius:  smileW / 2,
          borderBottomRightRadius: smileW / 2,
          top:  smileY,
          left: (ic - smileW) / 2,
          backgroundColor: "transparent",
        }]} />

        {/* Success overlay */}
        {success && (
          <Animated.View
            entering={FadeIn.duration(280)}
            style={[fi.abs, fi.checkWrap, {
              width: ic * 0.5, height: ic * 0.5,
              left: ic * 0.25, top: ic * 0.25,
              borderRadius: ic * 0.25,
            }]}
          >
            <Ionicons name="checkmark" size={Math.round(ic * 0.28)} color="#FFFFFF" />
          </Animated.View>
        )}

        {/* Failed overlay */}
        {failed && (
          <Animated.View
            entering={FadeIn.duration(280)}
            style={[fi.abs, fi.checkWrap, {
              width: ic * 0.5, height: ic * 0.5,
              left: ic * 0.25, top: ic * 0.25,
              borderRadius: ic * 0.25,
              backgroundColor: C.error,
            }]}
          >
            <Ionicons name="close" size={Math.round(ic * 0.28)} color="#FFFFFF" />
          </Animated.View>
        )}
      </View>

      {/* Sweep scan line — overlaid on top of the icon content */}
      <ScanLine circleSize={circleSize} active={scanning} />
    </Animated.View>
  );
}

const fi = StyleSheet.create({
  circle:    { alignItems: "center", justifyContent: "center" },
  abs:       { position: "absolute" },
  absH:      { position: "absolute" },
  absV:      { position: "absolute" },
  checkWrap: {
    position:        "absolute",
    backgroundColor: C.success,
    alignItems:      "center",
    justifyContent:  "center",
  },
});

/* ══════════════════════════════════════════════════════════════════════════
   Feature card — premium elevated card with teal left-accent strip.
   ══════════════════════════════════════════════════════════════════════════ */
type FeatureItem = {
  icon:  keyof typeof Ionicons.glyphMap;
  title: string;
  sub:   string;
};

const FEATURES: FeatureItem[] = [
  { icon: "shield-checkmark-outline", title: "Secure",  sub: "Your data is protected with Face ID"    },
  { icon: "flash-outline",            title: "Fast",    sub: "Quick access in just a glance"          },
  { icon: "lock-closed-outline",      title: "Private", sub: "Biometric data never leaves your device" },
];

function FeatureCard({ item, delay }: { item: FeatureItem; delay: number }) {
  return (
    <Animated.View
      entering={FadeInUp.duration(360).delay(delay).springify()}
      style={fc.card}
    >
      {/* Teal accent bar */}
      <View style={fc.accent} />

      {/* Icon in soft teal circle */}
      <View style={fc.iconCircle}>
        <Ionicons name={item.icon} size={20} color={C.teal} />
      </View>

      {/* Text */}
      <View style={fc.text}>
        <Text style={fc.title}>{item.title}</Text>
        <Text style={fc.sub}>{item.sub}</Text>
      </View>
    </Animated.View>
  );
}

const fc = StyleSheet.create({
  card: {
    flexDirection:    "row",
    alignItems:       "center",
    backgroundColor:  C.white,
    borderRadius:     16,
    paddingVertical:  14,
    paddingRight:     16,
    paddingLeft:      0,
    gap:              14,
    /* Elevation */
    shadowColor:      "#1E232C",
    shadowOffset:     { width: 0, height: 2 },
    shadowOpacity:    0.07,
    shadowRadius:     10,
    elevation:        3,
    /* Subtle border */
    borderWidth:      1,
    borderColor:      "rgba(232,236,244,0.8)",
    overflow:         "hidden",
  },
  accent: {
    width:            4,
    alignSelf:        "stretch",
    backgroundColor:  C.teal,
    borderTopRightRadius:    3,
    borderBottomRightRadius: 3,
  },
  iconCircle: {
    width:            42,
    height:           42,
    borderRadius:     21,
    backgroundColor:  "rgba(53,194,193,0.10)",
    alignItems:       "center",
    justifyContent:   "center",
  },
  text:  { flex: 1 },
  title: { fontSize: 15, fontFamily: "Manrope_700Bold",      color: C.dark, marginBottom: 3 },
  sub:   { fontSize: 13, fontFamily: "Manrope_400Regular",   color: C.gray, lineHeight: 18 },
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

  /* ── Shake on failure ── */
  const shakeX    = useSharedValue(0);
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

  /* ── On mount ── */
  useEffect(() => {
    (async () => {
      try {
        const hasHardware  = await LocalAuthentication.hasHardwareAsync();
        const isEnrolled   = await LocalAuthentication.isEnrolledAsync();
        const stored       = await AsyncStorage.getItem(BIOMETRIC_KEY);
        const alreadySetup = stored === "true";

        if (!hasHardware || !isEnrolled) {
          setState("unsupported");
          return;
        }
        if (alreadySetup) {
          setState("scanning");
          triggerBiometricAuth(true);
        } else {
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
      const types    = await LocalAuthentication.supportedAuthenticationTypesAsync();
      const isFaceId = types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION);

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage:         isFaceId ? "Authenticate with Face ID" : "Authenticate with biometrics",
        cancelLabel:           "Cancel",
        fallbackLabel:         "Use password",
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

  const handleEnable = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await triggerBiometricAuth(false);
  };

  const handleSkip = async () => {
    Haptics.selectionAsync();
    await AsyncStorage.setItem(BIOMETRIC_KEY, "false");
    router.replace("/(tabs)");
  };

  const handleRetry = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    triggerBiometricAuth(true);
  };

  useEffect(() => {
    if (state === "unsupported") router.replace("/(tabs)");
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

  /* Ring color: teal when scanning/success, muted when idle/failed */
  const ringColor = (isScanning || isSuccess) ? C.teal
    : isFailed ? C.error
    : C.dark;
  const ringDuration = isScanning ? 1600 : 2400;

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

      {/* ── Content ── */}
      <View style={s.content}>

        {/* ── Icon zone: ambient glow + pulse rings + face icon ── */}
        <Animated.View
          entering={FadeInDown.duration(520).delay(60).springify()}
          style={s.iconZone}
        >
          {/* Soft ambient background glow */}
          <View style={[s.ambientGlow, {
            width:        circleSize * 2.8,
            height:       circleSize * 2.8,
            borderRadius: circleSize * 1.4,
            backgroundColor: (isScanning || isSuccess)
              ? "rgba(53,194,193,0.06)"
              : isFailed
              ? "rgba(255,91,122,0.05)"
              : "rgba(53,194,193,0.04)",
          }]} />

          {/* Pulse rings — 3 staggered rings */}
          <PulseRing size={circleSize} color={ringColor} delay={0}    duration={ringDuration} />
          <PulseRing size={circleSize} color={ringColor} delay={ringDuration / 3}  duration={ringDuration} />
          <PulseRing size={circleSize} color={ringColor} delay={(ringDuration / 3) * 2} duration={ringDuration} />

          {/* Face ID icon with shake wrapper */}
          <Animated.View style={shakeStyle}>
            <FaceIdIcon
              circleSize={circleSize}
              scanning={isScanning}
              success={isSuccess}
              failed={isFailed}
            />
          </Animated.View>
        </Animated.View>

        {/* ── Title block ── */}
        <Animated.View
          entering={FadeInUp.duration(400).delay(140).springify()}
          style={s.titleBlock}
        >
          {/* Premium badge tag */}
          {isEnroll && (
            <View style={s.badge}>
              <Text style={s.badgeText}>BIOMETRIC SECURITY</Text>
            </View>
          )}

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

        {/* ── Feature cards — enroll only ── */}
        {isEnroll && (
          <View style={s.featureList}>
            {FEATURES.map((f, i) => (
              <FeatureCard key={f.title} item={f} delay={220 + i * 70} />
            ))}
          </View>
        )}

        {/* ── Scanning caption ── */}
        {isScanning && (
          <Animated.View entering={FadeIn.duration(300)} style={s.scanningRow}>
            <View style={s.scanningDot} />
            <Text style={s.scanningText}>Waiting for Face ID…</Text>
          </Animated.View>
        )}
      </View>

      {/* ── Bottom CTA ── */}
      <Animated.View
        entering={FadeInUp.duration(400).delay(320).springify()}
        style={s.cta}
      >
        {(isEnroll || isFailed) && (
          <Animated.View style={btnStyle}>
            <Pressable
              style={[s.primaryBtn, isFailed && { backgroundColor: C.error }]}
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
    marginBottom: 16,
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
    paddingTop: 4,
  },

  /* Icon zone — relatively positioned so rings + glow stack behind the icon */
  iconZone: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 28,
  },
  ambientGlow: {
    position: "absolute",
  },

  /* ── Title ── */
  titleBlock: {
    alignItems: "center",
    marginBottom: 32,
    paddingHorizontal: 8,
  },
  badge: {
    backgroundColor:  "rgba(53,194,193,0.10)",
    borderRadius:     20,
    paddingHorizontal: 12,
    paddingVertical:   4,
    marginBottom:     12,
  },
  badgeText: {
    fontSize:      10,
    fontFamily:    "Manrope_700Bold",
    color:         C.teal,
    letterSpacing: 1.4,
    textTransform: "uppercase",
  },
  heading: {
    fontSize:      30,
    fontFamily:    "Manrope_700Bold",
    color:         C.dark,
    letterSpacing: -0.5,
    textAlign:     "center",
    marginBottom:  10,
  },
  subText: {
    fontSize:    15,
    fontFamily:  "Manrope_400Regular",
    color:       C.gray,
    textAlign:   "center",
    lineHeight:  22,
  },

  /* ── Feature list ── */
  featureList: {
    width: "100%",
    gap:   12,
  },

  /* ── Scanning caption ── */
  scanningRow: {
    flexDirection: "row",
    alignItems:    "center",
    marginTop:     8,
    gap:           8,
  },
  scanningDot: {
    width:           8,
    height:          8,
    borderRadius:    4,
    backgroundColor: C.teal,
  },
  scanningText: {
    fontSize:   14,
    fontFamily: "Manrope_400Regular",
    color:      C.gray,
  },

  /* ── CTA ── */
  cta: {
    width:    "100%",
    gap:      16,
    paddingTop: 8,
  },
  primaryBtn: {
    height:          60,
    backgroundColor: C.dark,
    borderRadius:    18,
    alignItems:      "center",
    justifyContent:  "center",
    /* Rich layered shadow for depth */
    shadowColor:   "#1E232C",
    shadowOffset:  { width: 0, height: 6 },
    shadowOpacity: 0.22,
    shadowRadius:  18,
    elevation:     8,
  },
  primaryBtnText: {
    fontSize:      16,
    fontFamily:    "Manrope_700Bold",
    color:         C.white,
    letterSpacing: 0.2,
  },

  secondaryBtn: {
    alignItems:     "center",
    justifyContent: "center",
    paddingVertical: 4,
  },
  secondaryBtnText: {
    fontSize:   15,
    fontFamily: "Manrope_600SemiBold",
    color:      C.teal,
    textAlign:  "center",
  },

  successRow: {
    flexDirection:  "row",
    alignItems:     "center",
    justifyContent: "center",
    gap:            8,
  },
  successText: {
    fontSize:   14,
    fontFamily: "Manrope_600SemiBold",
    color:      C.success,
  },
});
