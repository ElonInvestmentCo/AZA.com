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

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push("/(auth)/new-password");
    }, 1200);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScreenHeader title="Forgot Password" />
      <View style={[styles.content, { paddingBottom: insets.bottom + 24 }]}>
        <Text style={[styles.sub, { color: colors.mutedForeground }]}>
          Enter your email address and we'll send you a link to reset your password.
        </Text>
        <AZAInput
          label="Email"
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          icon="mail"
        />
        <AZAButton title="Send Reset Link" onPress={handleSubmit} loading={loading} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1, paddingHorizontal: 28, paddingTop: 32, gap: 20 },
  sub: { fontSize: 15, fontFamily: "Manrope_400Regular", lineHeight: 22 },
});
