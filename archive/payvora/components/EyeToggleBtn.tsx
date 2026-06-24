import * as Haptics from "expo-haptics";
import React from "react";
import { Pressable, StyleSheet } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import Svg, { Path } from "react-native-svg";

interface EyeToggleBtnProps {
  show: boolean;
  onToggle: () => void;
  color: string;
}

/**
 * Shared password-visibility toggle button.
 *
 * Behaviour
 * ─────────
 * • Feather "eye" / "eye-off" icon, size 18, colour injected via `color` prop.
 * • Press → light haptic → icon fades out (70 ms) while state flips, then
 *   fades back in (130 ms) so the new icon appears cross-fade style.
 * • Simultaneously the icon scales down to 0.82 (spring) then bounces back
 *   to 1.0 for a satisfying tactile feel without being distracting.
 * • Hit-slop of 8 px on every side ensures the 26 px tap target is easy to hit.
 */
export function EyeToggleBtn({ show, onToggle, color }: EyeToggleBtnProps) {
  const scale   = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity:   opacity.value,
  }));

  function handlePress() {
    Haptics.selectionAsync();

    opacity.value = withSequence(
      withTiming(0,   { duration: 70  }),
      withTiming(1,   { duration: 130 }),
    );

    scale.value = withSequence(
      withSpring(0.82, { damping: 12, stiffness: 500 }),
      withSpring(1.0,  { damping: 14, stiffness: 320 }),
    );

    onToggle();
  }

  return (
    <Pressable
      onPress={handlePress}
      style={styles.btn}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
    >
      <Animated.View style={animStyle}>
        {show ? (
          <Svg width={18} height={18} viewBox="0 0 24 24">
            <Path
              fill={color}
              fillRule="evenodd"
              clipRule="evenodd"
              d="M1.606 6.08a1 1 0 0 1 1.313.526L2 7l.92-.394v-.001l.003.009l.021.045l.094.194c.086.172.219.424.4.729a13.4 13.4 0 0 0 1.67 2.237a12 12 0 0 0 .59.592C7.18 11.8 9.251 13 12 13a8.7 8.7 0 0 0 3.22-.602c1.227-.483 2.254-1.21 3.096-1.998a13 13 0 0 0 2.733-3.725l.027-.058l.005-.011a1 1 0 0 1 1.838.788L22 7l.92.394l-.003.005l-.004.008l-.011.026l-.04.087a14 14 0 0 1-.741 1.348a15.4 15.4 0 0 1-1.711 2.256l.797.797a1 1 0 0 1-1.414 1.415l-.84-.84a12 12 0 0 1-1.897 1.256l.782 1.202a1 1 0 1 1-1.676 1.091l-.986-1.514c-.679.208-1.404.355-2.176.424V16.5a1 1 0 0 1-2 0v-1.544c-.775-.07-1.5-.217-2.177-.425l-.985 1.514a1 1 0 0 1-1.676-1.09l.782-1.203c-.7-.37-1.332-.8-1.897-1.257l-.84.84a1 1 0 0 1-1.414-1.414l.797-.797a15.4 15.4 0 0 1-1.87-2.519a14 14 0 0 1-.591-1.107l-.033-.072l-.01-.021l-.002-.007l-.001-.002v-.001C1.08 7.395 1.08 7.394 2 7l-.919.395a1 1 0 0 1 .525-1.314"
            />
          </Svg>
        ) : (
          <Svg width={18} height={18} viewBox="0 0 24 24">
            <Path
              fill={color}
              d="M9.75 12a2.25 2.25 0 1 1 4.5 0a2.25 2.25 0 0 1-4.5 0"
            />
            <Path
              fill={color}
              fillRule="evenodd"
              clipRule="evenodd"
              d="M2 12c0 1.64.425 2.191 1.275 3.296C4.972 17.5 7.818 20 12 20s7.028-2.5 8.725-4.704C21.575 14.192 22 13.639 22 12c0-1.64-.425-2.191-1.275-3.296C19.028 6.5 16.182 4 12 4S4.972 6.5 3.275 8.704C2.425 9.81 2 10.361 2 12m10-3.75a3.75 3.75 0 1 0 0 7.5a3.75 3.75 0 0 0 0-7.5"
            />
          </Svg>
        )}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: { padding: 4 },
});
