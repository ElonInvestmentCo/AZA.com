import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
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
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!password || !confirm) {
      setError("Please fill in all fields.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
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
      <View style={[styles.content, { paddingBottom: insets.bottom + 24 }]}>
        <Text style={[styles.sub, { color: colors.mutedForeground }]}>
          Create a strong new password for your account.
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
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1, paddingHorizontal: 28, paddingTop: 32, gap: 20 },
  sub: { fontSize: 15, fontFamily: "Manrope_400Regular", lineHeight: 22 },
});
