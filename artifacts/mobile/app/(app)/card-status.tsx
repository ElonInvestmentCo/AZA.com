import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { AZAButton } from "@/components/AZAButton";
import { ScreenHeader } from "@/components/ScreenHeader";
import { useColors } from "@/hooks/useColors";

const STEPS = [
  { label: "Card Received", done: true,  time: "10:42 AM" },
  { label: "Under Review",  done: true,  time: "10:43 AM" },
  { label: "Verified",      done: true,  time: "10:45 AM" },
  { label: "Payment Sent",  done: false, time: "Pending"  },
];

const DETAILS = [
  { label: "Amount",     value: "$100 USD" },
  { label: "Rate",       value: "₦780 / $1" },
  { label: "You Receive",value: "₦78,000",  accent: true },
];

export default function CardStatusScreen() {
  const router = useRouter();
  const colors = useColors();

  return (
    <View style={[s.root, { backgroundColor: colors.background }]}>
      <ScreenHeader title="Card Status" />
      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>

        {/* Card info */}
        <Animated.View
          entering={FadeInDown.duration(380).springify().delay(40)}
          style={[s.infoCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
        >
          <View>
            <Text style={[s.cardName, { color: colors.text }]}>Amazon Gift Card</Text>
            <Text style={[s.cardCode, { color: colors.mutedForeground }]}>REF: 3289HF-4378</Text>
          </View>
          <View style={[s.badge, { backgroundColor: colors.warningLight }]}>
            <View style={[s.badgeDot, { backgroundColor: colors.warning }]} />
            <Text style={[s.badgeText, { color: colors.warning }]}>Processing</Text>
          </View>
        </Animated.View>

        {/* Progress stepper */}
        <Animated.View entering={FadeInUp.duration(380).springify().delay(80)}>
          <Text style={[s.sectionTitle, { color: colors.text }]}>Transaction Progress</Text>
          <View style={[s.stepperCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            {STEPS.map((step, i) => (
              <View key={step.label} style={s.stepRow}>
                <View style={s.stepLeft}>
                  <View
                    style={[
                      s.stepCircle,
                      {
                        backgroundColor: step.done ? colors.accent : colors.card,
                        borderColor:     step.done ? colors.accent : colors.border,
                      },
                    ]}
                  >
                    {step.done
                      ? <Feather name="check" size={11} color={colors.primaryForeground} />
                      : <View style={[s.stepInner, { backgroundColor: colors.border }]} />
                    }
                  </View>
                  {i < STEPS.length - 1 && (
                    <View
                      style={[
                        s.stepLine,
                        { backgroundColor: STEPS[i + 1].done ? colors.accent : colors.border },
                      ]}
                    />
                  )}
                </View>
                <View style={s.stepBody}>
                  <Text style={[s.stepLabel, { color: step.done ? colors.text : colors.mutedForeground }]}>
                    {step.label}
                  </Text>
                  <Text style={[s.stepTime, { color: colors.mutedForeground }]}>{step.time}</Text>
                </View>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* Detail box */}
        <Animated.View
          entering={FadeInUp.duration(380).springify().delay(140)}
          style={[s.detailBox, { backgroundColor: colors.surface, borderColor: colors.border }]}
        >
          {DETAILS.map((d, i) => (
            <View
              key={d.label}
              style={[
                s.detailRow,
                { borderBottomColor: colors.border },
                i === DETAILS.length - 1 && { borderBottomWidth: 0 },
              ]}
            >
              <Text style={[s.detailLabel, { color: colors.mutedForeground }]}>{d.label}</Text>
              <Text
                style={[
                  s.detailValue,
                  { color: d.accent ? colors.accent : colors.text },
                  d.accent && { fontFamily: "Manrope_700Bold", fontSize: 16 },
                ]}
              >
                {d.value}
              </Text>
            </View>
          ))}
        </Animated.View>

        <AZAButton title="Back to Dashboard" onPress={() => router.replace("/(app)/dashboard")} />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root:    { flex: 1 },
  content: { paddingHorizontal: 20, paddingTop: 20, gap: 20, paddingBottom: 40 },

  infoCard: {
    borderRadius: 18, borderWidth: 1, padding: 18,
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
  },
  cardName: { fontSize: 17, fontFamily: "Manrope_700Bold", marginBottom: 4 },
  cardCode: { fontSize: 12, fontFamily: "Manrope_400Regular" },
  badge:    { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  badgeDot: { width: 6, height: 6, borderRadius: 3 },
  badgeText:{ fontSize: 12, fontFamily: "Manrope_600SemiBold" },

  sectionTitle: { fontSize: 15, fontFamily: "Manrope_700Bold", marginBottom: 12 },
  stepperCard:  { borderRadius: 18, borderWidth: 1, padding: 20 },
  stepRow:  { flexDirection: "row", gap: 16 },
  stepLeft: { alignItems: "center", width: 24 },
  stepCircle: {
    width: 24, height: 24, borderRadius: 12,
    alignItems: "center", justifyContent: "center", borderWidth: 1.5,
  },
  stepInner: { width: 8, height: 8, borderRadius: 4 },
  stepLine:  { width: 2, flex: 1, minHeight: 28, marginVertical: 2 },
  stepBody:  { flex: 1, paddingBottom: 22 },
  stepLabel: { fontSize: 14, fontFamily: "Manrope_600SemiBold", marginBottom: 2 },
  stepTime:  { fontSize: 12, fontFamily: "Manrope_400Regular" },

  detailBox: { borderRadius: 18, borderWidth: 1, padding: 18 },
  detailRow: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    paddingVertical: 13, borderBottomWidth: StyleSheet.hairlineWidth,
  },
  detailLabel: { fontSize: 13, fontFamily: "Manrope_400Regular" },
  detailValue: { fontSize: 14, fontFamily: "Manrope_600SemiBold" },
});
