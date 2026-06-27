import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

const logoSrc = require("@/assets/images/lkd.png");

interface Props {
  size?: number;
  onFinish?: () => void;
  duration?: number;
}

export default function SplashAnimation({ size = 180, onFinish, duration = 2000 }: Props) {
  const scale    = useSharedValue(0.55);
  const opacity  = useSharedValue(0);
  const ring1Sc  = useSharedValue(0.85);
  const ring1Op  = useSharedValue(0.55);
  const ring2Sc  = useSharedValue(0.85);
  const ring2Op  = useSharedValue(0.35);

  const logoStyle  = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }],   opacity: opacity.value }));
  const ring1Style = useAnimatedStyle(() => ({ transform: [{ scale: ring1Sc.value }], opacity: ring1Op.value }));
  const ring2Style = useAnimatedStyle(() => ({ transform: [{ scale: ring2Sc.value }], opacity: ring2Op.value }));

  useEffect(() => {
    scale.value   = withTiming(1,   { duration: 600, easing: Easing.out(Easing.back(1.3)) });
    opacity.value = withTiming(1,   { duration: 450, easing: Easing.out(Easing.cubic) });

    ring1Sc.value = withDelay(200, withRepeat(
      withSequence(
        withTiming(1.38, { duration: 900, easing: Easing.out(Easing.cubic) }),
        withTiming(0.88, { duration: 700, easing: Easing.in(Easing.cubic) }),
      ), -1, false,
    ));
    ring1Op.value = withDelay(200, withRepeat(
      withSequence(
        withTiming(0,    { duration: 900 }),
        withTiming(0.5,  { duration: 50  }),
        withTiming(0,    { duration: 650 }),
      ), -1, false,
    ));

    ring2Sc.value = withDelay(520, withRepeat(
      withSequence(
        withTiming(1.55, { duration: 900, easing: Easing.out(Easing.cubic) }),
        withTiming(0.88, { duration: 700, easing: Easing.in(Easing.cubic) }),
      ), -1, false,
    ));
    ring2Op.value = withDelay(520, withRepeat(
      withSequence(
        withTiming(0,    { duration: 900 }),
        withTiming(0.28, { duration: 50  }),
        withTiming(0,    { duration: 650 }),
      ), -1, false,
    ));

    const hapticTimer = setTimeout(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }, duration * 0.55);

    const finishTimer = setTimeout(() => {
      onFinish?.();
    }, duration);

    return () => {
      clearTimeout(hapticTimer);
      clearTimeout(finishTimer);
    };
  }, []);

  const logoW = size * 0.58;
  const logoH = logoW * 0.36;

  return (
    <View style={[st.root, { width: size, height: size }]}>
      <Animated.View style={[
        st.ring,
        { width: size, height: size, borderRadius: size / 2, borderColor: "rgba(53,194,193,0.22)" },
        ring2Style,
      ]} />
      <Animated.View style={[
        st.ring,
        { width: size * 0.74, height: size * 0.74, borderRadius: (size * 0.74) / 2, borderColor: "rgba(53,194,193,0.38)" },
        ring1Style,
      ]} />
      <Animated.View style={[st.logoWrap, logoStyle]}>
        <Image
          source={logoSrc}
          style={{ width: logoW, height: logoH }}
          contentFit="contain"
          tintColor="#FFFFFF"
          cachePolicy="memory-disk"
        />
      </Animated.View>
    </View>
  );
}

const st = StyleSheet.create({
  root:     { alignItems: "center", justifyContent: "center" },
  ring:     { position: "absolute", borderWidth: 1.5 },
  logoWrap: { alignItems: "center", justifyContent: "center" },
});
