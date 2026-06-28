import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AZAButton } from "@/components/AZAButton";
import { ScreenHeader } from "@/components/ScreenHeader";
import { useAuth } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";

const DETAILS = [
  { label: "Gift Card", value: "Amazon — $100" },
  { label: "Rate", value: "₦780/$1" },
  { label: "You Receive", value: "₦78,000" },
  { label: "Processing Fee", value: "₦0" },
  { label: "Settlement Time", value: "Instant" },
];

export default function ConfirmTransactionScreen() {
  const router = useRouter();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { updateBalance } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleConfirm = () => {
    setLoading(true);
    setTimeout(() => {
      updateBalance(78000);
      setLoading(false);
      router.replace("/(app)/submitted");
    }, 1500);
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <ScreenHeader title="Confirm Transaction" />
      <View style={[styles.content, { paddingBottom: insets.bottom + 24 }]}>
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[styles.cardIconBg, { backgroundColor: "#e8f4ff" }]}>
            <Feather name="gift" size={28} color="#0066cc" />
          </View>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Transaction Summary</Text>

          {DETAILS.map((d, i) => (
            <View
              key={i}
              style={[
                styles.detailRow,
                { borderBottomColor: colors.border },
                i === DETAILS.length - 1 ? { borderBottomWidth: 0 } : {},
              ]}
            >
              <Text style={[styles.detailLabel, { color: colors.mutedForeground }]}>{d.label}</Text>
              <Text
                style={[
                  styles.detailValue,
                  { color: d.label === "You Receive" ? colors.success : colors.text },
                  d.label === "You Receive" ? { fontFamily: "Manrope_700Bold" } : {},
                ]}
              >
                {d.value}
              </Text>
            </View>
          ))}
        </View>

        <Text style={[styles.disclaimer, { color: colors.mutedForeground }]}>
          By confirming, you agree that the gift card details are correct and valid.
        </Text>

        <AZAButton title="Confirm & Submit" onPress={handleConfirm} loading={loading} />
        <AZAButton
          title="Cancel"
          onPress={() => router.back()}
          variant="outline"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { flex: 1, paddingHorizontal: 20, paddingTop: 20, gap: 16 },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    gap: 0,
  },
  cardIconBg: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 16,
  },
  cardTitle: { fontSize: 17, fontFamily: "Manrope_700Bold", textAlign: "center", marginBottom: 16 },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  detailLabel: { fontSize: 14, fontFamily: "Manrope_400Regular" },
  detailValue: { fontSize: 14, fontFamily: "Manrope_600SemiBold" },
  disclaimer: { fontSize: 12, fontFamily: "Manrope_400Regular", lineHeight: 18, textAlign: "center" },
});
