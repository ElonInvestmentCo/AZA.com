import * as Haptics from "expo-haptics";
import { useRouter, useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import { scheduleTradeSubmitted, scheduleTradeCompleted } from "@/services/notifications";
import { Platform, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from "react-native";
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
import Svg, { Path } from "react-native-svg";
import { SvgXml } from "react-native-svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { RUNNING_MAN_SVG } from "@/constants/runningManSvg";
import { CHECKMARK_BADGE_SVG } from "@/constants/checkmarkBadgeSvg";

const AnimatedPath = Animated.createAnimatedComponent(Path);

const C = {
  bg:   "#FFFFFF",
  text: "#1A1A1A",
  sub:  "#8391A1",
  dark: "#1A1A1A",
};

/* ─── Scalloped Badge (uses provided SVG) + animated checkmark overlay ──────── */
function ScallopBadge({
  badgeScale,
  badgeOpacity,
  dashOffset,
  pulseScale,
  pulseOpacity,
  size,
}: {
  badgeScale:   ReturnType<typeof useSharedValue<number>>;
  badgeOpacity: ReturnType<typeof useSharedValue<number>>;
  dashOffset:   ReturnType<typeof useSharedValue<number>>;
  pulseScale:   ReturnType<typeof useSharedValue<number>>;
  pulseOpacity: ReturnType<typeof useSharedValue<number>>;
  size:         number;
}) {
  const pulseSize = Math.round(size * 1.12);

  const badgeWrapAnim = useAnimatedStyle(() => ({
    transform: [{ scale: badgeScale.value }],
    opacity:   badgeOpacity.value,
  }));

  const pulseWrapAnim = useAnimatedStyle(() => ({
    transform:  [{ scale: pulseScale.value }],
    opacity:    pulseOpacity.value,
    position:   "absolute" as const,
  }));

  const checkAnimProps = useAnimatedProps(() => ({
    strokeDashoffset: dashOffset.value,
  }));

  /* Stroke length of the checkmark path M27 51 L43 67 L73 31 */
  const DASH_LEN = 72;

  return (
    <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>

      {/* Pulse ring (scalloped outline) */}
      <Animated.View style={pulseWrapAnim}>
        <Svg viewBox="0 0 100 100" width={pulseSize} height={pulseSize}>
          <Path
            d="M96.4793 49.9979C98.0236 48.1995 99.1059 46.0514 99.6321 43.74C100.158 41.4286 100.113 39.0237 99.4991 36.734C98.8856 34.4442 97.7225 32.3388 96.111 30.6003C94.4995 28.8617 92.4882 27.5426 90.2515 26.7574C90.6898 24.4277 90.5529 22.0262 89.8529 19.7612C89.1529 17.4963 87.9108 15.4364 86.2344 13.7602C84.558 12.0841 82.4979 10.8422 80.2329 10.1425C77.9679 9.44275 75.5664 9.30623 73.2367 9.74479C72.4521 7.50756 71.1332 5.49566 69.3947 3.88376C67.6561 2.27186 65.5504 1.10869 63.2603 0.495228C60.9703 -0.118234 58.5651 -0.16344 56.2535 0.363534C53.942 0.890508 51.7941 1.97374 49.9962 3.51917C48.1978 1.9748 46.0497 0.892548 43.7383 0.366302C41.4269 -0.159944 39.022 -0.114292 36.7323 0.499295C34.4425 1.11288 32.3371 2.27588 30.5986 3.88738C28.86 5.49889 27.541 7.51024 26.7558 9.74695C24.4261 9.3091 22.0249 9.44623 19.7603 10.1464C17.4956 10.8467 15.4361 12.0888 13.7601 13.7651C12.0842 15.4415 10.8426 17.5014 10.143 19.7662C9.44334 22.031 9.30683 24.4323 9.74527 26.7618C7.50856 27.547 5.4972 28.8661 3.88569 30.6046C2.27418 32.3431 1.11119 34.4486 0.497598 36.7383C-0.11599 39.0281 -0.161649 41.4329 0.364597 43.7443C0.890843 46.0557 1.97311 48.2038 3.51748 50.0022C1.97264 51.8006 0.890041 53.9488 0.363645 56.2605C-0.162751 58.5721 -0.117053 60.9772 0.496804 63.2672C1.11066 65.5571 2.27411 67.6627 3.88617 69.4011C5.49823 71.1394 7.51021 72.4581 9.74744 73.2427C9.30862 75.5722 9.44497 77.9737 10.1447 80.2386C10.8444 82.5035 12.0864 84.5634 13.7627 86.2396C15.439 87.9157 17.4991 89.1573 19.7641 89.8568C22.0291 90.5562 24.4306 90.6923 26.7601 90.2532C27.5453 92.4899 28.8644 94.5012 30.6029 96.1127C32.3414 97.7242 34.4469 98.8872 36.7366 99.5008C39.0264 100.114 41.4312 100.16 43.7426 99.6338C46.054 99.1076 48.2021 98.0253 50.0005 96.4809C51.7989 98.0258 53.9472 99.1084 56.2588 99.6348C58.5704 100.161 60.9756 100.115 63.2655 99.5016C65.5555 98.8877 67.661 97.7243 69.3994 96.1122C71.1378 94.5002 72.4565 92.4882 73.241 90.251C75.5706 90.6897 77.9721 90.5532 80.2371 89.8535C82.502 89.1538 84.562 87.9119 86.2383 86.2356C87.9145 84.5594 89.1564 82.4994 89.8562 80.2344C90.5559 77.9695 90.6923 75.568 90.2536 73.2383C92.4905 72.4533 94.5021 71.1343 96.1136 69.3957C97.7252 67.6571 98.8882 65.5515 99.5016 63.2616C100.115 60.9717 100.16 58.5667 99.6336 56.2553C99.107 53.9439 98.0242 51.796 96.4793 49.9979Z"
            fill="none"
            stroke={C.dark}
            strokeWidth={2}
            opacity={0.18}
          />
        </Svg>
      </Animated.View>

      {/* Badge: exact SVG provided by user */}
      <Animated.View style={badgeWrapAnim}>
        {/* Render the exact SVG — badge shape + white checkmark */}
        <SvgXml xml={CHECKMARK_BADGE_SVG} width={size} height={size} />

        {/* Animated draw-on overlay: stroke checkmark drawn on top */}
        <Svg
          viewBox="0 0 100 100"
          width={size}
          height={size}
          style={StyleSheet.absoluteFill}
        >
          <AnimatedPath
            d="M 27 51 L 43 67 L 73 31"
            stroke="#FFFFFF"
            strokeWidth={7}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            strokeDasharray={DASH_LEN}
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
  const { width } = useWindowDimensions();
  const botPad  = Platform.OS === "web" ? 32 : insets.bottom + 24;
  const BADGE_SIZE = Math.min(Math.max(Math.round(width * 0.28), 80), 130);

  const params   = useLocalSearchParams<{ cardType?: string; amount?: string; naira?: string }>();
  const cardType = params.cardType ?? "Gift Card";
  const amount   = params.amount   ?? "$100";
  const naira    = params.naira    ?? "₦120,000";

  /* Running man float */
  const floatY = useSharedValue(0);

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

    /* Push notifications */
    scheduleTradeSubmitted(cardType, amount);
    scheduleTradeCompleted(cardType, naira, 30);
  }, [cardType, amount, naira]);

  const floatAnim = useAnimatedStyle(() => ({
    transform: [{ translateY: floatY.value }],
  }));

  /* Running man dimensions — preserve 296:233 aspect ratio */
  const manWidth  = Math.min(width * 0.82, 296);
  const manHeight = Math.round(manWidth * (233 / 296));

  return (
    <View style={[s.root, { paddingBottom: botPad }]}>

      {/* ── Centre content ───────────────────────────── */}
      <View style={s.content}>

        {/* Running man — exact provided SVG, floats gently */}
        <Animated.View style={[s.illustrationWrap, floatAnim]}>
          <SvgXml xml={RUNNING_MAN_SVG} width={manWidth} height={manHeight} />
        </Animated.View>

        {/* Scalloped badge — exact provided SVG + animated checkmark overlay */}
        <View style={{ marginBottom: 28 }}>
          <ScallopBadge
            badgeScale={badgeScale}
            badgeOpacity={badgeOpacity}
            dashOffset={dashOffset}
            pulseScale={pulseScale}
            pulseOpacity={pulseOpacity}
            size={BADGE_SIZE}
          />
        </View>

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
