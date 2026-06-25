import React, { useEffect } from "react";
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import Svg, { Path } from "react-native-svg";
import { View } from "react-native";

const AnimatedPath = Animated.createAnimatedComponent(Path);

const SLASH_LEN = 30;

interface PremiumEyeIconProps {
  open: boolean;
  size?: number;
  color?: string;
}

export function PremiumEyeIcon({ open, size = 22, color = "#AAAFB5" }: PremiumEyeIconProps) {
  const slashOff  = useSharedValue(open ? SLASH_LEN : 0);
  const pupilOp   = useSharedValue(open ? 1 : 0.15);
  const lashOp    = useSharedValue(open ? 0 : 1);

  useEffect(() => {
    if (open) {
      slashOff.value = withTiming(SLASH_LEN, { duration: 200 });
      pupilOp.value  = withTiming(1, { duration: 180 });
      lashOp.value   = withTiming(0, { duration: 160 });
    } else {
      slashOff.value = withTiming(0, { duration: 200 });
      pupilOp.value  = withTiming(0.15, { duration: 180 });
      lashOp.value   = withTiming(1, { duration: 180 });
    }
  }, [open]);

  const slashProps  = useAnimatedProps(() => ({ strokeDashoffset: slashOff.value }));
  const pupilProps  = useAnimatedProps(() => ({ opacity: pupilOp.value }));
  const lashProps   = useAnimatedProps(() => ({ opacity: lashOp.value }));

  const sw = Math.max(1.4, size / 13);

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        {/* Eye outline */}
        <Path
          d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
          stroke={color}
          strokeWidth={sw}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Pupil — fades out when hidden */}
        <AnimatedPath
          d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"
          stroke={color}
          strokeWidth={sw}
          strokeLinecap="round"
          fill="none"
          animatedProps={pupilProps}
        />
        {/* Lash lines — appear when hidden (eye-off squint) */}
        <AnimatedPath
          d="M8.5 14.5Q12 16.5 15.5 14.5"
          stroke={color}
          strokeWidth={sw}
          strokeLinecap="round"
          fill="none"
          animatedProps={lashProps}
        />
        {/* Diagonal slash — draws in when hidden */}
        <AnimatedPath
          d="M3.5 3.5L20.5 20.5"
          stroke={color}
          strokeWidth={sw + 0.4}
          strokeLinecap="round"
          strokeDasharray={SLASH_LEN}
          animatedProps={slashProps}
        />
      </Svg>
    </View>
  );
}
