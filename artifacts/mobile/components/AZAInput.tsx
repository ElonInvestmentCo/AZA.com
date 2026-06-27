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

interface PayVoraInputProps extends TextInputProps {
  label?: string;
  error?: string;
  secureToggle?: boolean;
  icon?: keyof typeof Feather.glyphMap;
}

export function PayVoraInput({
  label,
  error,
  secureToggle,
  icon,
  style,
  ...props
}: PayVoraInputProps) {
  const colors = useColors();
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={s.wrapper}>
      {label ? (
        <Text style={[s.label, { color: colors.mutedForeground }]}>{label}</Text>
      ) : null}
      <View
        style={[
          s.row,
          {
            backgroundColor: focused ? "rgba(0,217,160,0.06)" : colors.card,
            borderColor: error
              ? colors.destructive
              : focused
              ? colors.inputFocus
              : colors.inputBorder,
          },
        ]}
      >
        {icon ? (
          <Feather
            name={icon}
            size={18}
            color={focused ? colors.inputFocus : colors.placeholder}
            style={{ marginRight: 12 }}
          />
        ) : null}
        <TextInput
          style={[s.input, { color: colors.text }, style]}
          placeholderTextColor={colors.placeholder}
          secureTextEntry={secureToggle && !showPassword}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...props}
        />
        {secureToggle ? (
          <TouchableOpacity
            onPress={() => setShowPassword((v) => !v)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Feather
              name={showPassword ? "eye-off" : "eye"}
              size={18}
              color={colors.placeholder}
            />
          </TouchableOpacity>
        ) : null}
      </View>
      {error ? (
        <Text style={[s.error, { color: colors.destructive }]}>{error}</Text>
      ) : null}
    </View>
  );
}

const s = StyleSheet.create({
  wrapper: { gap: 8 },
  label: {
    fontSize: 13,
    fontFamily: "Manrope_600SemiBold",
    letterSpacing: 0.1,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 56,
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontFamily: "Manrope_400Regular",
    height: "100%",
  },
  error: {
    fontSize: 12,
    fontFamily: "Manrope_400Regular",
  },
});
