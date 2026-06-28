import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { AZAButton } from "@/components/AZAButton";
import { AZAInput } from "@/components/AZAInput";
import { ScreenHeader } from "@/components/ScreenHeader";
import { useColors } from "@/hooks/useColors";

const DENOMINATIONS = ["$25", "$50", "$100", "$200", "$500"];

export default function SellGiftCardScreen() {
  const router = useRouter();
  const colors = useColors();
  const { card } = useLocalSearchParams<{ card: string }>();
  const [denom, setDenom] = useState("");
  const [code, setCode] = useState("");
  const [selectedDenom, setSelectedDenom] = useState<string | null>(null);

  const handleContinue = () => {
    if (!code) return;
    router.push("/(app)/confirm-transaction");
  };

  const nairaValue = selectedDenom
    ? parseInt(selectedDenom.replace("$", "")) * 780
    : 0;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScreenHeader title={`Sell ${card ?? "Gift Card"}`} />
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.label, { color: colors.subtitle }]}>Select Denomination</Text>
        <View style={styles.denomRow}>
          {DENOMINATIONS.map((d) => (
            <TouchableOpacity
              key={d}
              style={[
                styles.denomBtn,
                {
                  backgroundColor: selectedDenom === d ? colors.primary : colors.card,
                  borderColor: selectedDenom === d ? colors.primary : colors.border,
                },
              ]}
              onPress={() => setSelectedDenom(d)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.denomText,
                  { color: selectedDenom === d ? "#fff" : colors.text },
                ]}
              >
                {d}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <AZAInput
          label="Gift Card Code"
          placeholder="Enter the card code"
          value={code}
          onChangeText={setCode}
          icon="credit-card"
          autoCapitalize="characters"
        />

        {selectedDenom && (
          <View style={[styles.estimateBox, { backgroundColor: colors.successLight }]}>
            <Feather name="info" size={14} color={colors.success} />
            <Text style={[styles.estimateText, { color: colors.success }]}>
              You'll receive approximately ₦{nairaValue.toLocaleString("en-NG")}
            </Text>
          </View>
        )}

        <AZAButton
          title="Continue"
          onPress={handleContinue}
          disabled={!code || !selectedDenom}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 20, paddingTop: 20, gap: 20, paddingBottom: 40 },
  label: { fontSize: 13, fontFamily: "Manrope_500Medium" },
  denomRow: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  denomBtn: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
  },
  denomText: { fontSize: 14, fontFamily: "Manrope_600SemiBold" },
  estimateBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
    borderRadius: 8,
  },
  estimateText: { fontSize: 13, fontFamily: "Manrope_500Medium", flex: 1 },
});
