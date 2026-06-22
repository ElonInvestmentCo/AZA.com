import { Feather } from "@expo/vector-icons";
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
import Animated, { FadeInUp } from "react-native-reanimated";
import { AZAButton } from "@/components/AZAButton";
import { AZAInput } from "@/components/AZAInput";
import { ScreenHeader } from "@/components/ScreenHeader";
import { useColors } from "@/hooks/useColors";

export default function TradeAssetScreen() {
  const router  = useRouter();
  const colors  = useColors();
  const { card } = useLocalSearchParams<{ card: string }>();
  const [amount, setAmount] = useState("");
  const [wallet, setWallet] = useState("");

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScreenHeader title={`Trade ${card ?? "Asset"}`} />
      <ScrollView
        contentContainerStyle={s.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Rate card */}
        <Animated.View
          entering={FadeInUp.duration(380).springify().delay(60)}
          style={[s.rateCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
        >
          <View style={[s.rateIconBg, { backgroundColor: colors.accentDim }]}>
            <Feather name="trending-up" size={18} color={colors.accent} />
          </View>
          <Text style={[s.rateName, { color: colors.mutedForeground }]}>
            {card ?? "Gift Card"}
          </Text>
          <Text style={[s.rateValue, { color: colors.accent }]}>₦780 / $1</Text>
          <Text style={[s.rateSub,   { color: colors.mutedForeground }]}>Current trading rate</Text>
        </Animated.View>

        <Animated.View entering={FadeInUp.duration(380).springify().delay(100)}>
          <AZAInput
            label="Amount (USD)"
            placeholder="Enter amount in USD"
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            icon="dollar-sign"
          />
        </Animated.View>

        <Animated.View entering={FadeInUp.duration(380).springify().delay(140)}>
          <AZAInput
            label="Wallet / Account Number"
            placeholder="Enter your wallet or account"
            value={wallet}
            onChangeText={setWallet}
            icon="credit-card"
          />
        </Animated.View>

        <AZAButton
          title="Proceed to Trade"
          onPress={() => router.push("/(app)/confirm-transaction")}
          disabled={!amount || !wallet}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  content:   { paddingHorizontal: 20, paddingTop: 24, gap: 20, paddingBottom: 40 },
  rateCard:  { borderRadius: 18, padding: 20, gap: 6, borderWidth: 1 },
  rateIconBg:{ width: 44, height: 44, borderRadius: 14, alignItems: "center", justifyContent: "center", marginBottom: 8 },
  rateName:  { fontSize: 13, fontFamily: "Manrope_600SemiBold" },
  rateValue: { fontSize: 30, fontFamily: "Manrope_700Bold", letterSpacing: -0.8 },
  rateSub:   { fontSize: 12, fontFamily: "Manrope_400Regular" },
});
