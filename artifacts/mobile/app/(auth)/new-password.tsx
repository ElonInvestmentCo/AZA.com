import { useRouter } from "expo-router";
import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AZAButton } from "@/components/AZAButton";
import { AZAInput } from "@/components/AZAInput";
import { ScreenHeader } from "@/components/ScreenHeader";
import { useColors } from "@/hooks/useColors";

export default function NewPasswordScreen() {
  const router = useRouter();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [password, setPassword] = useState("");
  const [confirm,  setConfirm]  = useState("");
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

  const handleSubmit = () => {
    if (!password || !confirm) { setError("Please fill in all fields."); return; }
    if (password !== confirm)  { setError("Passwords do not match.");    return; }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.replace("/(auth)/password-changed");
    }, 1000);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScreenHeader title="New Password" />
      <Animated.View
        entering={FadeInUp.duration(420).springify().delay(80)}
        style={[s.content, { paddingBottom: insets.bottom + 24 }]}
      >
        <Text style={[s.sub, { color: colors.mutedForeground }]}>
          Create a strong new password. Use a mix of letters, numbers and symbols.
        </Text>
        <AZAInput
          label="New Password"
          placeholder="Enter new password"
          value={password}
          onChangeText={setPassword}
          secureToggle
          icon="lock"
        />
        <AZAInput
          label="Confirm Password"
          placeholder="Confirm new password"
          value={confirm}
          onChangeText={setConfirm}
          secureToggle
          icon="lock"
          error={error}
        />
        <AZAButton title="Set New Password" onPress={handleSubmit} loading={loading} />
      </Animated.View>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  content: { flex: 1, paddingHorizontal: 24, paddingTop: 32, gap: 20 },
  sub: { fontSize: 15, fontFamily: "Manrope_400Regular", lineHeight: 24 },
});
