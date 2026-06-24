import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useWallet } from "@/context/WalletContext";

const WHITE      = "#FFFFFF";
const TEXT_DARK  = "#0B0A0A";
const TEXT_GRAY  = "#595F67";
const TEXT_LIGHT = "#AAAFB5";
const INPUT_BG   = "#F0F0F0";
const BORDER     = "#EDF1F3";
const BLACK      = "#000000";
const GREEN      = "#00B03C";

const METHODS = [
  { id: "bank",  label: "Bank Transfer",  sub: "1–2 business days",  icon: "briefcase", color: "#3B82F6" },
  { id: "card",  label: "Debit / Credit Card", sub: "Instant",       icon: "credit-card", color: "#8B5CF6" },
  { id: "ussd",  label: "USSD",           sub: "Instant",            icon: "hash",      color: "#F59E0B" },
  { id: "crypto",label: "Crypto Deposit", sub: "10–30 min",          icon: "zap",       color: "#00D9A0" },
];

const QUICK_AMOUNTS = ["₦5,000", "₦10,000", "₦20,000", "₦50,000", "₦100,000", "₦200,000"];

export default function FundWalletScreen() {
  const insets  = useSafeAreaInsets();
  const router  = useRouter();
  const { addTransaction } = useWallet();

  const [method,   setMethod]   = useState("card");
  const [amount,   setAmount]   = useState("");
  const [rawAmt,   setRawAmt]   = useState(0);
  const [loading,  setLoading]  = useState(false);

  const topPad = Platform.OS === "web" ? 20 : insets.top;

  function pickAmount(label: string) {
    Haptics.selectionAsync();
    const num = parseInt(label.replace(/[₦,]/g, ""), 10);
    setAmount(num.toString());
    setRawAmt(num);
  }

  function handleAmountChange(v: string) {
    const cleaned = v.replace(/[^0-9]/g, "");
    setAmount(cleaned);
    setRawAmt(parseInt(cleaned || "0", 10));
  }

  async function handleFund() {
    if (!rawAmt || rawAmt < 100) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Invalid amount", "Please enter at least ₦100");
      return;
    }
    setLoading(true);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    await new Promise((r) => setTimeout(r, 1200));
    addTransaction({
      type: "topup",
      title: "Wallet Funded",
      subtitle: METHODS.find((m) => m.id === method)?.label ?? "Deposit",
      amount: rawAmt / 1550,
      currency: "NGN",
      status: "completed",
      icon: "plus-circle",
    });
    setLoading(false);
    Alert.alert(
      "Funded!",
      `₦${rawAmt.toLocaleString("en-NG")} has been added to your wallet.`,
      [{ text: "Done", onPress: () => router.back() }]
    );
  }

  const selectedMethod = METHODS.find((m) => m.id === method);

  return (
    <View style={[styles.screen, { paddingTop: topPad }]}>
      <StatusBar barStyle="dark-content" backgroundColor={WHITE} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backBtn}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Feather name="arrow-left" size={22} color={TEXT_DARK} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Fund Wallet</Text>
        <View style={styles.headerRight} />
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Amount Input */}
          <View style={styles.amountCard}>
            <Text style={styles.amtLabel}>Enter Amount (NGN)</Text>
            <View style={styles.amtInputRow}>
              <Text style={styles.amtCurrency}>₦</Text>
              <TextInput
                style={styles.amtInput}
                value={amount ? parseInt(amount).toLocaleString("en-NG") : ""}
                onChangeText={handleAmountChange}
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor={TEXT_LIGHT}
              />
            </View>
            {rawAmt > 0 && (
              <Text style={styles.usdEquiv}>
                ≈ ${(rawAmt / 1550).toFixed(2)} USD
              </Text>
            )}
          </View>

          {/* Quick Amounts */}
          <Text style={styles.sectionLabel}>Quick Select</Text>
          <View style={styles.quickGrid}>
            {QUICK_AMOUNTS.map((q) => {
              const num = parseInt(q.replace(/[₦,]/g, ""), 10);
              const active = rawAmt === num;
              return (
                <TouchableOpacity
                  key={q}
                  style={[styles.quickChip, active && styles.quickChipActive]}
                  onPress={() => pickAmount(q)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.quickChipText, active && styles.quickChipTextActive]}>{q}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Payment Method */}
          <Text style={styles.sectionLabel}>Payment Method</Text>
          <View style={styles.methodList}>
            {METHODS.map((m) => (
              <TouchableOpacity
                key={m.id}
                style={[styles.methodRow, method === m.id && styles.methodRowActive]}
                onPress={() => { Haptics.selectionAsync(); setMethod(m.id); }}
                activeOpacity={0.75}
              >
                <View style={[styles.methodIcon, { backgroundColor: m.color + "18" }]}>
                  <Feather name={m.icon as any} size={18} color={m.color} />
                </View>
                <View style={styles.methodInfo}>
                  <Text style={[styles.methodLabel, method === m.id && styles.methodLabelActive]}>{m.label}</Text>
                  <Text style={styles.methodSub}>{m.sub}</Text>
                </View>
                <View style={[styles.radioOuter, method === m.id && styles.radioOuterActive]}>
                  {method === m.id && <View style={styles.radioInner} />}
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Summary */}
          {rawAmt > 0 && (
            <View style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Amount</Text>
                <Text style={styles.summaryVal}>₦{rawAmt.toLocaleString("en-NG")}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Method</Text>
                <Text style={styles.summaryVal}>{selectedMethod?.label}</Text>
              </View>
              <View style={[styles.summaryRow, styles.summaryRowTotal]}>
                <Text style={styles.summaryLabelBold}>You will receive</Text>
                <Text style={styles.summaryTotal}>₦{rawAmt.toLocaleString("en-NG")}</Text>
              </View>
            </View>
          )}

          {/* CTA */}
          <TouchableOpacity
            style={[styles.fundBtn, (loading || rawAmt < 100) && styles.fundBtnDisabled]}
            onPress={handleFund}
            disabled={loading}
            activeOpacity={0.82}
          >
            {loading ? (
              <Text style={styles.fundBtnText}>Processing…</Text>
            ) : (
              <>
                <Feather name="plus-circle" size={18} color={WHITE} />
                <Text style={styles.fundBtnText}>Fund Wallet</Text>
              </>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: WHITE },

  header: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 20, paddingBottom: 14,
    borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: BORDER,
  },
  backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: INPUT_BG, alignItems: "center", justifyContent: "center" },
  headerTitle: { fontFamily: "Inter_700Bold", fontSize: 17, color: TEXT_DARK },
  headerRight: { width: 36 },

  content: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 48 },

  amountCard: {
    backgroundColor: "#F8FAFB", borderRadius: 20, padding: 24,
    alignItems: "center", marginBottom: 28,
    borderWidth: 1, borderColor: BORDER,
  },
  amtLabel: { fontFamily: "Inter_500Medium", fontSize: 13, color: TEXT_GRAY, marginBottom: 12 },
  amtInputRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  amtCurrency: { fontFamily: "Inter_700Bold", fontSize: 32, color: TEXT_DARK },
  amtInput: {
    fontFamily: "Inter_700Bold", fontSize: 42, color: TEXT_DARK,
    minWidth: 60, maxWidth: 220, textAlign: "center",
  },
  usdEquiv: { fontFamily: "Inter_400Regular", fontSize: 13, color: TEXT_LIGHT, marginTop: 8 },

  sectionLabel: { fontFamily: "Inter_600SemiBold", fontSize: 13, color: TEXT_DARK, marginBottom: 12 },

  quickGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 28 },
  quickChip: {
    paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10,
    backgroundColor: INPUT_BG, borderWidth: 1.5, borderColor: "transparent",
  },
  quickChipActive: { backgroundColor: "#E8F8EE", borderColor: GREEN },
  quickChipText: { fontFamily: "Inter_500Medium", fontSize: 13, color: TEXT_GRAY },
  quickChipTextActive: { fontFamily: "Inter_600SemiBold", color: GREEN },

  methodList: { gap: 10, marginBottom: 24 },
  methodRow: {
    flexDirection: "row", alignItems: "center", gap: 14,
    backgroundColor: INPUT_BG, borderRadius: 14, padding: 16,
    borderWidth: 1.5, borderColor: "transparent",
  },
  methodRowActive: { backgroundColor: WHITE, borderColor: BLACK },
  methodIcon: { width: 44, height: 44, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  methodInfo: { flex: 1 },
  methodLabel: { fontFamily: "Inter_500Medium", fontSize: 14, color: TEXT_GRAY },
  methodLabelActive: { fontFamily: "Inter_600SemiBold", color: TEXT_DARK },
  methodSub: { fontFamily: "Inter_400Regular", fontSize: 11, color: TEXT_LIGHT, marginTop: 2 },
  radioOuter: {
    width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: TEXT_LIGHT,
    alignItems: "center", justifyContent: "center",
  },
  radioOuterActive: { borderColor: BLACK },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: BLACK },

  summaryCard: {
    backgroundColor: "#F8FAFB", borderRadius: 14, padding: 18,
    borderWidth: 1, borderColor: BORDER, marginBottom: 28, gap: 10,
  },
  summaryRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  summaryRowTotal: { paddingTop: 10, borderTopWidth: 1, borderTopColor: BORDER },
  summaryLabel: { fontFamily: "Inter_400Regular", fontSize: 13, color: TEXT_GRAY },
  summaryLabelBold: { fontFamily: "Inter_600SemiBold", fontSize: 14, color: TEXT_DARK },
  summaryVal: { fontFamily: "Inter_600SemiBold", fontSize: 13, color: TEXT_DARK },
  summaryTotal: { fontFamily: "Inter_700Bold", fontSize: 16, color: GREEN },

  fundBtn: {
    backgroundColor: BLACK, borderRadius: 14, height: 54,
    flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10,
  },
  fundBtnDisabled: { backgroundColor: "#C4C4C4" },
  fundBtnText: { fontFamily: "Inter_600SemiBold", fontSize: 16, color: WHITE },
});
