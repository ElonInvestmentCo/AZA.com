import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AZAButton } from "@/components/AZAButton";
import { useColors } from "@/hooks/useColors";

export default function PasswordChangedScreen() {
  const router = useRouter();
  const colors = useColors();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          paddingTop: insets.top + 40,
          paddingBottom: insets.bottom + 24,
        },
      ]}
    >
      <View style={[styles.iconBg, { backgroundColor: colors.successLight }]}>
        <Feather name="check" size={40} color={colors.success} />
      </View>
      <Text style={[styles.heading, { color: colors.text }]}>Password Changed!</Text>
      <Text style={[styles.sub, { color: colors.mutedForeground }]}>
        Your password has been updated successfully. You can now log in with your new password.
      </Text>
      <AZAButton title="Back to Login" onPress={() => router.replace("/(auth)/login")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 28,
    gap: 20,
  },
  iconBg: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  heading: { fontSize: 26, fontFamily: "Manrope_700Bold", letterSpacing: -0.5, textAlign: "center" },
  sub: { fontSize: 15, fontFamily: "Manrope_400Regular", textAlign: "center", lineHeight: 22 },
});
