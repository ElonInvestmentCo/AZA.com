import { useRouter } from "expo-router";
import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, View } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AZAButton } from "@/components/AZAButton";
import { AZAInput } from "@/components/AZAInput";
import { ScreenHeader } from "@/components/ScreenHeader";
import { useColors } from "@/hooks/useColors";
import { StyleSheet, Text } from "react-native";

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [email,   setEmail]   = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
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
      <Animated.View
        entering={FadeInUp.duration(420).springify().delay(80)}
        style={[s.content, { paddingBottom: insets.bottom + 24 }]}
      >
        <Text style={[s.sub, { color: colors.mutedForeground }]}>
          Enter your registered email and we'll send you a link to reset your password.
        </Text>
        <AZAInput
          label="Email Address"
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          icon="mail"
        />
        <AZAButton
          title="Send Reset Link"
          onPress={handleSubmit}
          loading={loading}
        />
      </Animated.View>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  content: { flex: 1, paddingHorizontal: 24, paddingTop: 32, gap: 20 },
  sub: { fontSize: 15, fontFamily: "Manrope_400Regular", lineHeight: 24 },
});
