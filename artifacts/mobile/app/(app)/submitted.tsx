import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AZAButton } from "@/components/AZAButton";
import { useColors } from "@/hooks/useColors";
import * as Haptics from "expo-haptics";

export default function SubmittedScreen() {
  const router = useRouter();
  const colors = useColors();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, []);

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
      <View style={[styles.icon, { backgroundColor: colors.successLight }]}>
        <Feather name="check-circle" size={52} color={colors.success} />
      </View>
      <Text style={[styles.heading, { color: colors.text }]}>Submitted!</Text>
      <Text style={[styles.sub, { color: colors.mutedForeground }]}>
        Your gift card has been submitted for verification. You'll receive your payment shortly.
      </Text>

      <View style={styles.statusRow}>
        {["Submitted", "Verifying", "Paid"].map((step, i) => (
          <View key={step} style={styles.step}>
            <View
              style={[
                styles.stepDot,
                { backgroundColor: i === 0 ? colors.success : colors.border },
              ]}
            />
            <Text
              style={[
                styles.stepLabel,
                { color: i === 0 ? colors.text : colors.mutedForeground },
              ]}
            >
              {step}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.actions}>
        <AZAButton title="Go to Dashboard" onPress={() => router.replace("/(app)/dashboard")} />
        <AZAButton
          title="View Transactions"
          onPress={() => router.replace("/(app)/transactions")}
          variant="outline"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 28,
    gap: 20,
    justifyContent: "center",
  },
  icon: {
    width: 112,
    height: 112,
    borderRadius: 56,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  heading: { fontSize: 28, fontFamily: "Manrope_700Bold", letterSpacing: -0.5 },
  sub: { fontSize: 15, fontFamily: "Manrope_400Regular", textAlign: "center", lineHeight: 22 },
  statusRow: { flexDirection: "row", gap: 32, alignItems: "center", marginVertical: 8 },
  step: { alignItems: "center", gap: 6 },
  stepDot: { width: 12, height: 12, borderRadius: 6 },
  stepLabel: { fontSize: 12, fontFamily: "Manrope_500Medium" },
  actions: { width: "100%", gap: 12 },
});
