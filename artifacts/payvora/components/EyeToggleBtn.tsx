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
import { Feather } from "@expo/vector-icons";

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
        <Feather
          name={show ? "eye-off" : "eye"}
          size={18}
          color={color}
        />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: { padding: 4 },
});
