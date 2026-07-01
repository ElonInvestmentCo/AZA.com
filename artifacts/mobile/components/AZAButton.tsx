import * as Haptics from "expo-haptics";
import React from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useColors } from "@/hooks/useColors";

interface PayvoraButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "outline" | "ghost" | "danger";
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
}

export function PayvoraButton({
  title,
  onPress,
  variant = "primary",
  loading = false,
  disabled = false,
  fullWidth = true,
}: PayvoraButtonProps) {
  const colors = useColors();
  const scale = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.96, { damping: 14, stiffness: 320 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1.0, { damping: 14, stiffness: 320 });
  };

  const handlePress = () => {
    if (variant === "primary" || variant === "danger") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } else {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress();
  };

  const bgColor =
    variant === "primary" ? colors.primary :
    variant === "danger"  ? colors.destructive :
    "transparent";

  const textColor =
    variant === "primary" ? colors.primaryForeground :
    variant === "danger"  ? "#fff" :
    variant === "outline" ? colors.primary :
    colors.mutedForeground;

  const shadowStyle =
    variant === "primary"
      ? {
          shadowColor:   colors.accent,
          shadowOffset:  { width: 0, height: 4 },
          shadowOpacity: 0.28,
          shadowRadius:  14,
          elevation:     8,
        }
      : {};

  return (
    <Animated.View
      style={[
        animStyle,
        { opacity: disabled ? 0.45 : 1 },
        fullWidth && { width: "100%" as const },
      ]}
    >
      <Pressable
        style={[
          s.btn,
          { backgroundColor: bgColor },
          variant === "outline" && {
            borderWidth:  1.5,
            borderColor:  colors.primary,
          },
          shadowStyle,
        ]}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
      >
        {loading ? (
          <ActivityIndicator
            color={variant === "primary" ? colors.primaryForeground : colors.primary}
            size="small"
          />
        ) : (
          <Text style={[s.label, { color: textColor }]}>{title}</Text>
        )}
      </Pressable>
    </Animated.View>
  );
}

const s = StyleSheet.create({
  btn: {
    height: 54,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  label: {
    fontSize: 15,
    fontFamily: "Manrope_700Bold",
    letterSpacing: 0.2,
  },
});
