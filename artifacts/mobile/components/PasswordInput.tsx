import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import {
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { EyeIcon } from "@/components/EyeIcon";

interface PasswordInputProps {
  placeholder?: string;
  value: string;
  onChangeText: (t: string) => void;
  error?: boolean;
}

export function PasswordInput({
  placeholder = "Enter your password",
  value,
  onChangeText,
  error,
}: PasswordInputProps) {
  const [focused,  setFocused]  = useState(false);
  const [showPass, setShowPass] = useState(false);

  return (
    <View style={[s.wrap, focused && s.focused, error && s.errored]}>
      <TextInput
        style={s.field}
        placeholder={placeholder}
        placeholderTextColor="#8391A1"
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={!showPass}
        autoCapitalize="none"
        autoCorrect={false}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
      <Pressable
        onPress={() => { Haptics.selectionAsync(); setShowPass(v => !v); }}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        style={s.eyeBtn}
      >
        <EyeIcon open={showPass} size={22} color="#8391A1" />
      </Pressable>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F7F8F9",
    borderWidth: 1,
    borderColor: "#E8ECF4",
    borderRadius: 14,
    paddingHorizontal: 18,
    height: 58,
  },
  focused: { borderColor: "#1E232C" },
  errored: { borderColor: "#FF5B7A" },
  field: {
    flex: 1,
    fontSize: 15,
    fontFamily: "Manrope_400Regular",
    color: "#1E232C",
    height: "100%",
  },
  eyeBtn: { padding: 2 },
});
