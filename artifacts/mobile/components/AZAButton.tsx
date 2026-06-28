import * as Haptics from "expo-haptics";
import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useColors } from "@/hooks/useColors";

interface AZAButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "outline" | "ghost";
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
}

export function AZAButton({
  title,
  onPress,
  variant = "primary",
  loading = false,
  disabled = false,
  fullWidth = true,
}: AZAButtonProps) {
  const colors = useColors();

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  const styles = StyleSheet.create({
    btn: {
      height: 52,
      borderRadius: 8,
      alignItems: "center",
      justifyContent: "center",
      width: fullWidth ? "100%" : undefined,
      paddingHorizontal: fullWidth ? 0 : 24,
      backgroundColor:
        variant === "primary"
          ? colors.primary
          : variant === "outline"
            ? "transparent"
            : "transparent",
      borderWidth: variant === "outline" ? 1.5 : 0,
      borderColor: variant === "outline" ? colors.primary : "transparent",
      opacity: disabled ? 0.4 : 1,
    },
    label: {
      fontSize: 15,
      fontWeight: "600" as const,
      color:
        variant === "primary"
          ? colors.primaryForeground
          : colors.primary,
      letterSpacing: 0.2,
    },
  });

  return (
    <TouchableOpacity
      style={styles.btn}
      onPress={handlePress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={variant === "primary" ? "#fff" : colors.primary} size="small" />
      ) : (
        <Text style={styles.label}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}
