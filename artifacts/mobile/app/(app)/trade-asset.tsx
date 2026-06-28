import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { AZAButton } from "@/components/AZAButton";
import { AZAInput } from "@/components/AZAInput";
import { ScreenHeader } from "@/components/ScreenHeader";
import { useColors } from "@/hooks/useColors";

export default function TradeAssetScreen() {
  const router = useRouter();
  const colors = useColors();
  const { card } = useLocalSearchParams<{ card: string }>();
  const [amount, setAmount] = useState("");
  const [wallet, setWallet] = useState("");

  const handleContinue = () => {
    if (!amount || !wallet) return;
    router.push("/(app)/confirm-transaction");
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScreenHeader title={`Trade ${card ?? "Asset"}`} />
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.rateCard, { backgroundColor: "#061941" }]}>
          <Text style={styles.rateName}>{card ?? "Gift Card"}</Text>
          <Text style={styles.rateValue}>₦780 / $1</Text>
          <Text style={styles.rateSub}>Current trading rate</Text>
        </View>

        <AZAInput
          label="Amount (USD)"
          placeholder="Enter amount in USD"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          icon="dollar-sign"
        />
        <AZAInput
          label="Wallet / Account Number"
          placeholder="Enter your wallet or account"
          value={wallet}
          onChangeText={setWallet}
          icon="credit-card"
        />

        <AZAButton
          title="Proceed to Trade"
          onPress={handleContinue}
          disabled={!amount || !wallet}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 20, paddingTop: 20, gap: 20, paddingBottom: 40 },
  rateCard: {
    borderRadius: 16,
    padding: 20,
    gap: 4,
    marginBottom: 4,
  },
  rateName: { color: "#fff", fontSize: 15, fontFamily: "Manrope_600SemiBold", opacity: 0.7 },
  rateValue: { color: "#fff", fontSize: 28, fontFamily: "Manrope_700Bold", letterSpacing: -0.5 },
  rateSub: { color: "rgba(255,255,255,0.5)", fontSize: 12, fontFamily: "Manrope_400Regular" },
});
