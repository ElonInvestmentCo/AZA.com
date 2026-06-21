import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AZAButton } from "@/components/AZAButton";
import { useColors } from "@/hooks/useColors";

export default function SuccessPaymentScreen() {
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
          backgroundColor: colors.success,
          paddingTop: insets.top + 40,
          paddingBottom: insets.bottom + 24,
        },
      ]}
    >
      <View style={styles.icon}>
        <Feather name="check" size={52} color={colors.success} />
      </View>
      <Text style={styles.heading}>Payment Received!</Text>
      <Text style={styles.amount}>₦78,000.00</Text>
      <Text style={styles.sub}>
        Your wallet has been credited successfully.
      </Text>

      <View style={styles.actions}>
        <AZAButton
          title="Back to Dashboard"
          onPress={() => router.replace("/(app)/dashboard")}
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
    gap: 16,
    justifyContent: "center",
  },
  icon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  heading: { color: "#fff", fontSize: 28, fontFamily: "Manrope_700Bold", letterSpacing: -0.5 },
  amount: { color: "#fff", fontSize: 40, fontFamily: "Manrope_700Bold", letterSpacing: -1 },
  sub: { color: "rgba(255,255,255,0.8)", fontSize: 15, fontFamily: "Manrope_400Regular", textAlign: "center" },
  actions: { width: "100%", marginTop: 12 },
});
