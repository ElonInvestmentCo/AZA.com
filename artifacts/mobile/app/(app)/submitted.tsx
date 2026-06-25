import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo } from "react";
import { Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  Easing,
  FadeInDown,
  FadeInUp,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import type { SharedValue } from "react-native-reanimated";
import Svg, { Circle, G, Path } from "react-native-svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const AnimatedG    = Animated.createAnimatedComponent(G);
const AnimatedPath = Animated.createAnimatedComponent(Path);

const C = {
  bg:    "#FFFFFF",
  text:  "#1A1A1A",
  sub:   "#8391A1",
  dark:  "#1A1A1A",
};

/* ─── Scalloped badge path (smooth flower/seal shape) ─────────────────────── */
function makeScallopPath(
  cx: number, cy: number,
  baseR: number, bumpAmp: number, numBumps: number,
  steps = 360,
): string {
  const pts: string[] = [];
  for (let i = 0; i <= steps; i++) {
    const angle  = -Math.PI / 2 + (i / steps) * Math.PI * 2;
    const r      = baseR + bumpAmp * Math.cos(numBumps * angle);
    const x      = cx + r * Math.cos(angle);
    const y      = cy + r * Math.sin(angle);
    pts.push(i === 0 ? `M ${x.toFixed(2)} ${y.toFixed(2)}` : `L ${x.toFixed(2)} ${y.toFixed(2)}`);
  }
  return pts.join(" ") + " Z";
}

/* ─── Running Man SVG ─────────────────────────────────────────────────────── */
function RunningMan({
  flagRotation,
  motionOpacity,
}: {
  flagRotation: SharedValue<number>;
  motionOpacity: SharedValue<number>;
}) {
  /* Flag waves around the top of the pole */
  const flagProps = useAnimatedProps(() => ({
    rotation: flagRotation.value,
    originX:  58,
    originY:  9,
  }));

  const motionProps = useAnimatedProps(() => ({
    opacity: motionOpacity.value,
  }));

  return (
    <Svg viewBox="0 0 275 190" width={275} height={190}>

      {/* ── Motion lines – right side, runner trails left so lines are to his right ── */}
      <AnimatedG animatedProps={motionProps}>
        <Path d="M 172 65 L 228 57" stroke={C.dark} strokeWidth={3.4} strokeLinecap="round"/>
        <Path d="M 175 80 L 223 74" stroke={C.dark} strokeWidth={2.7} strokeLinecap="round"/>
        <Path d="M 178 95 L 218 92" stroke={C.dark} strokeWidth={2.0} strokeLinecap="round"/>
      </AnimatedG>

      {/* ── Flag pole – from raised-hand to upper-left ──── */}
      <Path
        d="M 84 58 L 58 9"
        stroke={C.dark} strokeWidth={3.2} strokeLinecap="round"
      />

      {/* ── Flag (animated wave around pole tip) ────────── */}
      <AnimatedG animatedProps={flagProps}>
        {/* Rectangular flag to the RIGHT of the pole tip */}
        <Path
          d="M 58 9 L 96 18 Q 97 26 95 28 L 58 21 Z"
          fill={C.dark}
        />
      </AnimatedG>

      {/* ── Head – LEFT side (leading, runner faces left) ── */}
      <Circle cx={86} cy={38} r={21} fill={C.dark} />

      {/* ── Torso – leaning forward ─────────────────────── */}
      <Path
        d="M 78 58 Q 70 76 74 97 Q 86 106 108 102 Q 126 90 120 62 Z"
        fill={C.dark}
      />

      {/* ── Left arm (raised – grips flag pole) ─────────── */}
      <Path
        d="M 84 68 Q 82 62 84 58"
        stroke={C.dark} strokeWidth={13} strokeLinecap="round" fill="none"
      />

      {/* ── Right arm (trailing back-right) ──────────────── */}
      <Path
        d="M 116 70 Q 140 82 158 96"
        stroke={C.dark} strokeWidth={13} strokeLinecap="round" fill="none"
      />

      {/* ── Left leg (leading – forward/left) ────────────── */}
      <Path
        d="M 88 102 Q 72 122 60 142 Q 54 154 46 163"
        stroke={C.dark} strokeWidth={13} strokeLinecap="round" fill="none"
      />
      {/* Left shoe */}
      <Path
        d="M 46 163 Q 30 168 25 160 L 40 152 Z"
        fill={C.dark}
      />

      {/* ── Right leg (trailing – back/right) ────────────── */}
      <Path
        d="M 102 102 Q 128 120 146 140 Q 154 152 160 162"
        stroke={C.dark} strokeWidth={13} strokeLinecap="round" fill="none"
      />
      {/* Right shoe */}
      <Path
        d="M 160 162 Q 170 167 176 160 L 162 152 Z"
        fill={C.dark}
      />

    </Svg>
  );
}

/* ─── Scalloped Badge with animated checkmark ─────────────────────────────── */
function ScallopBadge({
  badgeScale,
  badgeOpacity,
  dashOffset,
  pulseScale,
  pulseOpacity,
}: {
  badgeScale:   SharedValue<number>;
  badgeOpacity: SharedValue<number>;
  dashOffset:   SharedValue<number>;
  pulseScale:   SharedValue<number>;
  pulseOpacity: SharedValue<number>;
}) {
  const badgePath = useMemo(
    () => makeScallopPath(50, 50, 41, 7, 14),
    [],
  );

  const badgeWrapAnim = useAnimatedStyle(() => ({
    transform:  [{ scale: badgeScale.value }],
    opacity:    badgeOpacity.value,
  }));

  const pulseWrapAnim = useAnimatedStyle(() => ({
    transform:  [{ scale: pulseScale.value }],
    opacity:    pulseOpacity.value,
    position:   "absolute" as const,
  }));

  const checkAnimProps = useAnimatedProps(() => ({
    strokeDashoffset: dashOffset.value,
  }));

  return (
    <View style={s.badgeContainer}>
      {/* Pulse ring */}
      <Animated.View style={pulseWrapAnim}>
        <Svg viewBox="0 0 100 100" width={106} height={106}>
          <Path
            d={badgePath}
            fill="none"
            stroke={C.dark}
            strokeWidth={2}
            opacity={0.18}
          />
        </Svg>
      </Animated.View>

      {/* Badge */}
      <Animated.View style={[badgeWrapAnim]}>
        <Svg viewBox="0 0 100 100" width={100} height={100}>
          {/* Scalloped background */}
          <Path d={badgePath} fill={C.dark} />

          {/* Static checkmark outline (always visible once badge fades in) */}
          <Path
            d="M 27 51 L 42 66 L 73 31"
            stroke="rgba(255,255,255,0.12)"
            strokeWidth={6.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />

          {/* Animated checkmark draw-on */}
          <AnimatedPath
            d="M 27 51 L 42 66 L 73 31"
            stroke="#FFFFFF"
            strokeWidth={6.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            strokeDasharray={72}
            animatedProps={checkAnimProps}
          />
        </Svg>
      </Animated.View>
    </View>
  );
}

/* ─── Main screen ─────────────────────────────────────────────────────────── */
export default function SubmittedScreen() {
  const router  = useRouter();
  const insets  = useSafeAreaInsets();
  const botPad  = Platform.OS === "web" ? 32 : insets.bottom + 24;

  /* Illustration float */
  const floatY = useSharedValue(0);

  /* Flag wave */
  const flagRotation = useSharedValue(0);

  /* Motion line flicker */
  const motionOpacity = useSharedValue(1);

  /* Badge entrance */
  const badgeScale   = useSharedValue(0.88);
  const badgeOpacity = useSharedValue(0);

  /* Checkmark draw-on */
  const dashOffset = useSharedValue(72);

  /* Post-checkmark pulse */
  const pulseScale   = useSharedValue(1);
  const pulseOpacity = useSharedValue(0);

  useEffect(() => {
    /* Gentle continuous float */
    floatY.value = withRepeat(
      withSequence(
        withTiming(-7, { duration: 2200, easing: Easing.inOut(Easing.sin) }),
        withTiming(0,  { duration: 2200, easing: Easing.inOut(Easing.sin) }),
      ),
      -1, true,
    );

    /* Flag breeze wave */
    flagRotation.value = withRepeat(
      withSequence(
        withTiming(-10, { duration: 700, easing: Easing.inOut(Easing.sin) }),
        withTiming(4,   { duration: 800, easing: Easing.inOut(Easing.sin) }),
        withTiming(-6,  { duration: 700, easing: Easing.inOut(Easing.sin) }),
        withTiming(2,   { duration: 600, easing: Easing.inOut(Easing.sin) }),
      ),
      -1, true,
    );

    /* Motion lines pulse — subtle */
    motionOpacity.value = withRepeat(
      withSequence(
        withTiming(0.35, { duration: 550, easing: Easing.inOut(Easing.quad) }),
        withTiming(1,    { duration: 550, easing: Easing.inOut(Easing.quad) }),
      ),
      -1, true,
    );

    /* Badge fade + spring in */
    badgeOpacity.value = withDelay(200, withTiming(1, { duration: 320 }));
    badgeScale.value   = withDelay(200, withSpring(1, { damping: 11, stiffness: 210 }));

    /* Checkmark draw */
    dashOffset.value = withDelay(500, withTiming(0, {
      duration: 680,
      easing: Easing.out(Easing.cubic),
    }));

    /* Confirmation pulse after draw completes */
    pulseOpacity.value = withDelay(1200, withRepeat(
      withSequence(
        withTiming(1,  { duration: 250 }),
        withTiming(0,  { duration: 550 }),
      ),
      2, false,
    ));
    pulseScale.value = withDelay(1200, withRepeat(
      withSequence(
        withTiming(1.22, { duration: 800, easing: Easing.out(Easing.quad) }),
        withTiming(1,    { duration: 0 }),
      ),
      2, false,
    ));

    /* Haptic on mount */
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, []);

  const floatAnim = useAnimatedStyle(() => ({
    transform: [{ translateY: floatY.value }],
  }));

  return (
    <View style={[s.root, { paddingBottom: botPad }]}>

      {/* ── Centre content ───────────────────────────── */}
      <View style={s.content}>

        {/* Running man */}
        <Animated.View style={[s.illustrationWrap, floatAnim]}>
          <RunningMan flagRotation={flagRotation} motionOpacity={motionOpacity} />
        </Animated.View>

        {/* Scalloped badge */}
        <ScallopBadge
          badgeScale={badgeScale}
          badgeOpacity={badgeOpacity}
          dashOffset={dashOffset}
          pulseScale={pulseScale}
          pulseOpacity={pulseOpacity}
        />

        {/* Text */}
        <Animated.View
          entering={FadeInDown.duration(380).delay(620)}
          style={s.textSection}
        >
          <Text style={s.title}>Trade Submitted</Text>
          <Text style={s.subtitle}>
            Your trade has been submitted{"\n"}successfully
          </Text>
        </Animated.View>
      </View>

      {/* ── Done button (bottom) ─────────────────────── */}
      <Animated.View
        entering={FadeInUp.duration(380).delay(820)}
        style={s.btnWrap}
      >
        <TouchableOpacity
          style={s.doneBtn}
          activeOpacity={0.84}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.replace("/(tabs)" as any);
          }}
        >
          <Text style={s.doneBtnText}>Done</Text>
        </TouchableOpacity>
      </Animated.View>

    </View>
  );
}

const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: C.bg,
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 28,
    paddingTop: 0,
  },

  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 0,
  },

  illustrationWrap: {
    alignItems: "center",
    marginBottom: 6,
  },

  badgeContainer: {
    width: 106,
    height: 106,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 28,
  },

  textSection: {
    alignItems: "center",
    gap: 10,
  },

  title: {
    fontSize: 26,
    fontFamily: "Manrope_700Bold",
    color: C.text,
    textAlign: "center",
    letterSpacing: -0.3,
  },

  subtitle: {
    fontSize: 14,
    fontFamily: "Manrope_400Regular",
    color: C.sub,
    textAlign: "center",
    lineHeight: 21,
  },

  btnWrap: {
    width: "100%",
    paddingBottom: 8,
  },

  doneBtn: {
    backgroundColor: C.dark,
    height: 54,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  doneBtnText: {
    fontSize: 15,
    fontFamily: "Manrope_600SemiBold",
    color: "#FFFFFF",
    letterSpacing: 0.1,
  },
});
