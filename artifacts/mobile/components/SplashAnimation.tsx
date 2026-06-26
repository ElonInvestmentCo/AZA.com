import React, { useEffect, useRef } from "react";
import { Animated, Easing, Platform, View } from "react-native";
import Svg, { Circle, G } from "react-native-svg";
import * as Haptics from "expo-haptics";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface Props {
  size?: number;
  onFinish?: () => void;
  duration?: number;
}

export default function SplashAnimation({ size = 180, onFinish, duration = 2000 }: Props) {
  const outerProgress  = useRef(new Animated.Value(0)).current;
  const innerProgress  = useRef(new Animated.Value(0)).current;
  const dotOpacity     = useRef(new Animated.Value(0)).current;
  const shimmerOpacity = useRef(new Animated.Value(0)).current;

  const outerR = size * 0.42;
  const innerR = size * 0.26;
  const dotR   = size * 0.045;

  const outerCirc = 2 * Math.PI * outerR;
  const innerCirc = 2 * Math.PI * innerR;

  const outerDashoffset = outerProgress.interpolate({
    inputRange:  [0, 1],
    outputRange: [outerCirc, 0],
  });
  const innerDashoffset = innerProgress.interpolate({
    inputRange:  [0, 1],
    outputRange: [innerCirc, 0],
  });

  useEffect(() => {
    if (Platform.OS !== "web") {
      const hapticTimer = setTimeout(() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }, duration * 0.55);
      return () => clearTimeout(hapticTimer);
    }
  }, []);

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(outerProgress, {
          toValue:        1,
          duration:       duration * 0.65,
          easing:         Easing.inOut(Easing.cubic),
          useNativeDriver: false,
        }),
        Animated.sequence([
          Animated.delay(duration * 0.12),
          Animated.timing(innerProgress, {
            toValue:        1,
            duration:       duration * 0.55,
            easing:         Easing.inOut(Easing.cubic),
            useNativeDriver: false,
          }),
        ]),
        Animated.sequence([
          Animated.delay(duration * 0.55),
          Animated.timing(dotOpacity, {
            toValue:        1,
            duration:       duration * 0.25,
            easing:         Easing.out(Easing.cubic),
            useNativeDriver: false,
          }),
        ]),
      ]),
      Animated.timing(shimmerOpacity, {
        toValue:        1,
        duration:       duration * 0.15,
        easing:         Easing.out(Easing.quad),
        useNativeDriver: false,
      }),
    ]).start(() => {
      onFinish?.();
    });
  }, []);

  return (
    <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <G>
          {/* Outer ring track (dim) */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={outerR}
            stroke="rgba(255,255,255,0.08)"
            strokeWidth={1.5}
            fill="none"
          />
          {/* Outer ring trace */}
          <AnimatedCircle
            cx={size / 2}
            cy={size / 2}
            r={outerR}
            stroke="#FFFFFF"
            strokeWidth={1.5}
            fill="none"
            strokeDasharray={`${outerCirc} ${outerCirc}`}
            strokeDashoffset={outerDashoffset}
            strokeLinecap="round"
            rotation={-90}
            origin={`${size / 2}, ${size / 2}`}
          />

          {/* Inner ring track (dim) */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={innerR}
            stroke="rgba(255,255,255,0.08)"
            strokeWidth={1}
            fill="none"
          />
          {/* Inner ring trace */}
          <AnimatedCircle
            cx={size / 2}
            cy={size / 2}
            r={innerR}
            stroke="rgba(255,255,255,0.72)"
            strokeWidth={1}
            fill="none"
            strokeDasharray={`${innerCirc} ${innerCirc}`}
            strokeDashoffset={innerDashoffset}
            strokeLinecap="round"
            rotation={-90}
            origin={`${size / 2}, ${size / 2}`}
          />

          {/* Center dot */}
          <AnimatedCircle
            cx={size / 2}
            cy={size / 2}
            r={dotR}
            fill="#FFFFFF"
            opacity={dotOpacity}
          />
        </G>
      </Svg>
    </View>
  );
}
