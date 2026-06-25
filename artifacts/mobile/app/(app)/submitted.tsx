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
  flagRotation: Animated.SharedValue<number>;
  motionOpacity: Animated.SharedValue<number>;
}) {
  const flagProps = useAnimatedProps(() => ({
    rotation: flagRotation.value,
    originX:  88,
    originY:  7,
  }));

  const motionProps = useAnimatedProps(() => ({
    opacity: motionOpacity.value,
  }));

  return (
    <Svg viewBox="0 0 218 158" width={218} height={158}>

      {/* ── Motion lines (speed / wind) ─────────────────── */}
      <AnimatedG animatedProps={motionProps}>
        <Path d="M 160 20 L 200 15" stroke={C.dark} strokeWidth={3.2} strokeLinecap="round"/>
        <Path d="M 162 32 L 198 28" stroke={C.dark} strokeWidth={2.6} strokeLinecap="round"/>
        <Path d="M 164 44 L 195 41" stroke={C.dark} strokeWidth={2.0} strokeLinecap="round"/>
      </AnimatedG>

      {/* ── Flag pole ───────────────────────────────────── */}
      <Path
        d="M 108 36 L 88 7"
        stroke={C.dark} strokeWidth={3.5} strokeLinecap="round"
      />

      {/* ── Flag (animated wave) ────────────────────────── */}
      <AnimatedG animatedProps={flagProps}>
        <Path
          d="M 88 7 L 57 15 Q 59 22 62 24 L 88 19 Z"
          fill={C.dark}
        />
      </AnimatedG>

      {/* ── Head ────────────────────────────────────────── */}
      <Circle cx={148} cy={32} r={15} fill={C.dark} />

      {/* ── Torso ───────────────────────────────────────── */}
      <Path
        d="M 132 46 Q 120 61 117 79 Q 126 84 137 82 Q 148 68 142 46 Z"
        fill={C.dark}
      />

      {/* ── Left arm (raised — holds flag pole) ─────────── */}
      <Path
        d="M 128 52 Q 118 45 108 36"
        stroke={C.dark} strokeWidth={11} strokeLinecap="round" fill="none"
      />

      {/* ── Right arm (trailing back) ────────────────────── */}
      <Path
        d="M 143 52 Q 158 60 168 70"
        stroke={C.dark} strokeWidth={11} strokeLinecap="round" fill="none"
      />

      {/* ── Right leg (stepping forward) ─────────────────── */}
      <Path
        d="M 133 79 Q 148 98 162 106 Q 167 103 170 108"
        stroke={C.dark} strokeWidth={11} strokeLinecap="round" fill="none"
      />

      {/* ── Left leg (kicking back / trailing) ───────────── */}
      <Path
        d="M 122 79 Q 107 92 95 88 Q 88 79 85 73"
        stroke={C.dark} strokeWidth={11} strokeLinecap="round" fill="none"
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
  badgeScale:   Animated.SharedValue<number>;
  badgeOpacity: Animated.SharedValue<number>;
  dashOffset:   Animated.SharedValue<number>;
  pulseScale:   Animated.SharedValue<number>;
  pulseOpacity: Animated.SharedValue<number>;
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
  const topPad  = Platform.OS === "web" ? 20 : insets.top;
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
