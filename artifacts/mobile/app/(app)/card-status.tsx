import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { ScreenHeader } from "@/components/ScreenHeader";
import { AZAButton } from "@/components/AZAButton";
import { useColors } from "@/hooks/useColors";

const STEPS = [
  { label: "Card Received", done: true, time: "10:42 AM" },
  { label: "Under Review", done: true, time: "10:43 AM" },
  { label: "Verified", done: true, time: "10:45 AM" },
  { label: "Payment Sent", done: false, time: "Pending" },
];

export default function CardStatusScreen() {
  const router = useRouter();
  const colors = useColors();

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <ScreenHeader title="Card Status" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.cardName, { color: colors.text }]}>Amazon Gift Card</Text>
          <Text style={[styles.cardCode, { color: colors.mutedForeground }]}>3289HF-4378</Text>
          <View style={[styles.badge, { backgroundColor: "#FFF3CD" }]}>
            <Text style={[styles.badgeText, { color: "#856404" }]}>Processing</Text>
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>Transaction Progress</Text>

        <View style={styles.steps}>
          {STEPS.map((step, i) => (
            <View key={step.label} style={styles.stepRow}>
              <View style={styles.stepLeft}>
                <View
                  style={[
                    styles.stepCircle,
                    {
                      backgroundColor: step.done ? colors.success : colors.border,
                    },
                  ]}
                >
                  {step.done ? (
                    <Feather name="check" size={12} color="#fff" />
                  ) : (
                    <View style={[styles.stepInner, { backgroundColor: "#fff" }]} />
                  )}
                </View>
                {i < STEPS.length - 1 ? (
                  <View
                    style={[
                      styles.stepLine,
                      { backgroundColor: STEPS[i + 1].done ? colors.success : colors.border },
                    ]}
                  />
                ) : null}
              </View>
              <View style={styles.stepContent}>
                <Text style={[styles.stepLabel, { color: step.done ? colors.text : colors.mutedForeground }]}>
                  {step.label}
                </Text>
                <Text style={[styles.stepTime, { color: colors.mutedForeground }]}>{step.time}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={[styles.detailBox, { backgroundColor: "#061941" }]}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Amount</Text>
            <Text style={styles.detailValue}>$100 USD</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Rate</Text>
            <Text style={styles.detailValue}>₦780/$</Text>
          </View>
          <View style={[styles.detailRow, { borderBottomWidth: 0 }]}>
            <Text style={styles.detailLabel}>You Receive</Text>
            <Text style={[styles.detailValue, { color: "#4ade80", fontFamily: "Manrope_700Bold" }]}>₦78,000</Text>
          </View>
        </View>

        <AZAButton
          title="Back to Dashboard"
          onPress={() => router.replace("/(app)/dashboard")}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { paddingHorizontal: 20, paddingTop: 20, gap: 20, paddingBottom: 40 },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    gap: 6,
    alignItems: "flex-start",
  },
  cardName: { fontSize: 18, fontFamily: "Manrope_700Bold" },
  cardCode: { fontSize: 13, fontFamily: "Manrope_400Regular" },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, marginTop: 4 },
  badgeText: { fontSize: 12, fontFamily: "Manrope_600SemiBold" },
  sectionTitle: { fontSize: 16, fontFamily: "Manrope_700Bold" },
  steps: { gap: 0 },
  stepRow: { flexDirection: "row", gap: 16 },
  stepLeft: { alignItems: "center", width: 24 },
  stepCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  stepInner: { width: 8, height: 8, borderRadius: 4 },
  stepLine: { width: 2, flex: 1, minHeight: 32 },
  stepContent: { flex: 1, paddingBottom: 24 },
  stepLabel: { fontSize: 14, fontFamily: "Manrope_600SemiBold", marginBottom: 2 },
  stepTime: { fontSize: 12, fontFamily: "Manrope_400Regular" },
  detailBox: { borderRadius: 16, padding: 20, gap: 0 },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },
  detailLabel: { color: "rgba(255,255,255,0.6)", fontSize: 14, fontFamily: "Manrope_400Regular" },
  detailValue: { color: "#fff", fontSize: 14, fontFamily: "Manrope_600SemiBold" },
});
