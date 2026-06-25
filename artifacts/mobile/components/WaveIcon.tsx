import { Ionicons } from "@expo/vector-icons";
import React, { useEffect } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

interface WaveIconProps {
  size?: number;
  color?: string;
}

export function WaveIcon({ size = 22, color = "#0B0A0A" }: WaveIconProps) {
  const angle = useSharedValue(0);

  useEffect(() => {
    angle.value = withDelay(
      800,
      withRepeat(
        withSequence(
          withTiming(22, { duration: 260 }),
          withTiming(-12, { duration: 210 }),
          withTiming(20, { duration: 210 }),
          withTiming(-8, { duration: 190 }),
          withTiming(0, { duration: 240 }),
          withTiming(0, { duration: 2200 }),
        ),
        -1,
        false,
      ),
    );
  }, []);

  const animStyle = useAnimatedStyle(() => {
    const dx = size / 2;
    return {
      transform: [
        { translateX: dx },
        { translateY: 0 },
        { rotate: `${angle.value}deg` },
        { translateX: -dx },
        { translateY: 0 },
      ],
    };
  });

  return (
    <Animated.View style={animStyle}>
      <Ionicons name="hand-right" size={size} color={color} />
    </Animated.View>
  );
}
