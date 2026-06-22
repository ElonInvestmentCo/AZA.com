import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AZAButton } from "@/components/AZAButton";
import { ScreenHeader } from "@/components/ScreenHeader";
import { useAuth } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";

const DETAILS = [
  { label: "Gift Card",       value: "Amazon — $100" },
  { label: "Rate",            value: "₦780 / $1"     },
  { label: "You Receive",     value: "₦78,000"       },
  { label: "Processing Fee",  value: "₦0 (Free)"     },
  { label: "Settlement",      value: "Instant"        },
];

export default function ConfirmTransactionScreen() {
  const router = useRouter();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { updateBalance } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleConfirm = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setLoading(true);
    setTimeout(() => {
      updateBalance(78000);
      setLoading(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace("/(app)/submitted");
    }, 1500);
  };

  return (
    <View style={[s.root, { backgroundColor: colors.background }]}>
      <ScreenHeader title="Confirm Transaction" />
      <View style={[s.content, { paddingBottom: insets.bottom + 24 }]}>

        {/* Summary card */}
        <Animated.View
          entering={FadeInDown.duration(400).springify().delay(60)}
          style={[s.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
        >
          <View style={[s.iconBg, { backgroundColor: colors.accentDim }]}>
            <Feather name="gift" size={26} color={colors.accent} />
          </View>
          <Text style={[s.cardTitle, { color: colors.text }]}>Transaction Summary</Text>

          {DETAILS.map((d, i) => (
            <View
              key={i}
              style={[
                s.row,
                { borderBottomColor: colors.border },
                i === DETAILS.length - 1 && { borderBottomWidth: 0 },
              ]}
            >
              <Text style={[s.rowLabel, { color: colors.mutedForeground }]}>{d.label}</Text>
              <Text
                style={[
                  s.rowValue,
                  { color: d.label === "You Receive" ? colors.accent : colors.text },
                  d.label === "You Receive" && {
                    fontFamily: "Manrope_700Bold",
                    fontSize: 16,
                  },
                ]}
              >
                {d.value}
              </Text>
            </View>
          ))}
        </Animated.View>

        <Animated.View entering={FadeInUp.duration(380).springify().delay(140)}>
          <Text style={[s.disclaimer, { color: colors.mutedForeground }]}>
            By confirming, you agree the gift card details are correct and valid.
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInUp.duration(380).springify().delay(180)} style={s.btns}>
          <AZAButton title="Confirm & Submit" onPress={handleConfirm} loading={loading} />
          <AZAButton title="Cancel" onPress={() => router.back()} variant="outline" />
        </Animated.View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  root:       { flex: 1 },
  content:    { flex: 1, paddingHorizontal: 20, paddingTop: 20, gap: 16 },
  card:       { borderRadius: 20, borderWidth: 1, padding: 20 },
  iconBg:     {
    width: 60, height: 60, borderRadius: 20,
    alignItems: "center", justifyContent: "center",
    alignSelf: "center", marginBottom: 14,
  },
  cardTitle:  { fontSize: 16, fontFamily: "Manrope_700Bold", textAlign: "center", marginBottom: 14 },
  row:        {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    paddingVertical: 13, borderBottomWidth: StyleSheet.hairlineWidth,
  },
  rowLabel:   { fontSize: 13, fontFamily: "Manrope_400Regular" },
  rowValue:   { fontSize: 14, fontFamily: "Manrope_600SemiBold" },
  disclaimer: { fontSize: 12, fontFamily: "Manrope_400Regular", lineHeight: 18, textAlign: "center" },
  btns:       { gap: 12 },
});
