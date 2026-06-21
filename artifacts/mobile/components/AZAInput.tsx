import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from "react-native";
import { useColors } from "@/hooks/useColors";

interface AZAInputProps extends TextInputProps {
  label?: string;
  error?: string;
  secureToggle?: boolean;
  icon?: keyof typeof Feather.glyphMap;
}

export function AZAInput({
  label,
  error,
  secureToggle,
  icon,
  style,
  ...props
}: AZAInputProps) {
  const colors = useColors();
  const [showPassword, setShowPassword] = useState(false);

  const styles = StyleSheet.create({
    wrapper: { gap: 6 },
    label: {
      fontSize: 13,
      fontWeight: "500" as const,
      color: colors.subtitle,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: error ? colors.destructive : colors.border,
      borderRadius: 8,
      paddingHorizontal: 16,
      height: 52,
    },
    input: {
      flex: 1,
      fontSize: 15,
      color: colors.text,
    },
    error: {
      fontSize: 12,
      color: colors.destructive,
    },
  });

  return (
    <View style={styles.wrapper}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={styles.row}>
        {icon ? (
          <Feather
            name={icon}
            size={18}
            color={colors.mutedForeground}
            style={{ marginRight: 10 }}
          />
        ) : null}
        <TextInput
          style={[styles.input, style]}
          placeholderTextColor={colors.placeholder}
          secureTextEntry={secureToggle && !showPassword}
          {...props}
        />
        {secureToggle ? (
          <TouchableOpacity onPress={() => setShowPassword((v) => !v)}>
            <Feather
              name={showPassword ? "eye-off" : "eye"}
              size={18}
              color={colors.mutedForeground}
            />
          </TouchableOpacity>
        ) : null}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}
