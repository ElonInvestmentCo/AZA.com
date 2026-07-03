import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { fetchBillers, matchBiller, payBill, type ReloadlyBiller } from "@/utils/api";

const C = {
  bg:        "#FFFFFF",
  text:      "#0B0A0A",
  textSec:   "#595F67",
  textMuted: "#6C7278",
  inputBg:   "#F0F0F0",
  border:    "#EDF1F3",
  success:   "#00B03C",
  dark:      "#010101",
  black:     "#000000",
  accent:    "#0891B2",
  accentBg:  "#ECFEFF",
};

const PLATFORMS = [
  { id: "sportybet",  name: "SportyBet",  color: "#059669", bg: "#F0FFF4", abbr: "SBT", hints: ["sportybet", "sporty"] },
  { id: "bet9ja",     name: "Bet9ja",     color: "#065F46", bg: "#D1FAE5", abbr: "B9J", hints: ["bet9ja"] },
  { id: "betway",     name: "Betway",     color: "#047857", bg: "#ECFDF5", abbr: "BTW", hints: ["betway"] },
  { id: "1xbet",      name: "1xBet",      color: "#1D4ED8", bg: "#EFF6FF", abbr: "1XB", hints: ["1xbet"] },
  { id: "nairabet",   name: "NairaBet",   color: "#7C3AED", bg: "#F5F3FF", abbr: "NRB", hints: ["nairabet"] },
  { id: "betking",    name: "BetKing",    color: "#B45309", bg: "#FFFBEB", abbr: "BTK", hints: ["betking"] },
  { id: "msport",     name: "MSport",     color: "#DC2626", bg: "#FFF1F2", abbr: "MSP", hints: ["msport"] },
  { id: "betlion",    name: "BetLion",    color: "#D97706", bg: "#FFF7ED", abbr: "BLN", hints: ["betlion"] },
  { id: "supabets",   name: "Supabets",   color: "#0891B2", bg: "#ECFEFF", abbr: "SUP", hints: ["supabets", "supabet"] },
];

const QUICK_AMOUNTS = ["₦500", "₦1,000", "₦2,000", "₦5,000", "₦10,000", "₦20,000"];

export default function BettingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 20 : insets.top;

  const [platform, setPlatform] = useState<typeof PLATFORMS[number] | null>(null);
  const [userId,   setUserId]   = useState("");
  const [amount,   setAmount]   = useState("");
  const [billers,    setBillers]    = useState<ReloadlyBiller[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchBillers("BETTING_BILL_PAYMENT")
      .then(setBillers)
      .catch((err) => console.warn("Failed to load betting billers:", err));
  }, []);

  const canProceed = !!platform && !!userId.trim() && !!amount && !submitting;

  const handleFund = async () => {
    if (!canProceed || !platform) return;

    const biller = matchBiller(billers, platform.hints);
    if (!biller) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Platform unavailable", `${platform.name} isn't currently available. Please try again later.`);
      return;
    }

    setSubmitting(true);
    try {
      const result = await payBill({
        billerId: biller.id,
        subscriberAccountNumber: userId.trim(),
        amount: parseInt(amount || "0"),
        referenceId: `betting-${Date.now()}`,
      });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.push({
        pathname: "/(app)/submitted" as any,
        params: {
          title:    "Bet Funding Successful",
          subtitle: `Your ${platform.name} account is being\nfunded (ref: ${result.referenceId})`,
        },
      });
    } catch (err) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Payment Failed", err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: C.bg }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* ── Header ── */}
      <Animated.View
        entering={FadeInDown.duration(280).springify()}
        style={[s.header, { paddingTop: topPad + 10 }]}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={s.backBtn}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Feather name="arrow-left" size={22} color="#1E232C" />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Bet Funding</Text>
        <View style={{ width: 44 }} />
      </Animated.View>
      <View style={s.divider} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[s.scroll, { paddingBottom: insets.bottom + 40 }]}
      >
        <Animated.View entering={FadeInDown.duration(300).delay(30)}>
          <Text style={s.subtitle}>Select your betting platform and fund your account.</Text>
        </Animated.View>

        {/* ── Platform grid ── */}
        <Animated.View entering={FadeInDown.duration(300).delay(60)}>
          <Text style={s.label}>select platform</Text>
          <View style={s.platformGrid}>
            {PLATFORMS.map(p => {
              const active = platform?.id === p.id;
              return (
                <Pressable
                  key={p.id}
                  style={[
                    s.platformCard,
                    active && { borderColor: p.color, borderWidth: 2, backgroundColor: p.bg },
                  ]}
                  onPress={() => { Haptics.selectionAsync(); setPlatform(p); }}
                >
                  <View style={[s.platformIcon, { backgroundColor: active ? p.color + "22" : "#F0F0F0" }]}>
                    <Text style={[s.platformAbbr, { color: active ? p.color : C.textMuted }]}>
                      {p.abbr}
                    </Text>
                  </View>
                  <Text
                    style={[s.platformName, active && { color: p.color }]}
                    numberOfLines={1}
                  >
                    {p.name}
                  </Text>
                  {active && (
                    <View style={[s.platformCheck, { backgroundColor: p.color }]}>
                      <Feather name="check" size={8} color="#fff" />
                    </View>
                  )}
                </Pressable>
              );
            })}
          </View>
        </Animated.View>

        {/* ── User ID ── */}
        <Animated.View entering={FadeInDown.duration(300).delay(90)}>
          <Text style={s.label}>
            {platform ? `${platform.name} user id / customer id` : "user id / customer id"}
          </Text>
          <View style={s.inputField}>
            <Feather name="user" size={16} color={C.textMuted} style={{ marginRight: 8 }} />
            <TextInput
              style={[s.inputText, { flex: 1 }]}
              placeholder={`Enter your ${platform?.name ?? "betting"} user ID`}
              placeholderTextColor="#646464"
              value={userId}
              onChangeText={setUserId}
              autoCapitalize="none"
              autoCorrect={false}
            />
            {userId.trim().length >= 4 && (
              <Feather name="check-circle" size={18} color={C.success} />
            )}
          </View>
        </Animated.View>

        {/* ── Amount ── */}
        <Animated.View entering={FadeInDown.duration(300).delay(120)}>
          <Text style={s.label}>amount to fund</Text>
          <View style={s.inputField}>
            <Text style={s.currencySymbol}>₦</Text>
            <TextInput
              style={[s.inputText, { flex: 1 }]}
              placeholder="0.00"
              placeholderTextColor="#646464"
              value={amount}
              onChangeText={t => setAmount(t.replace(/\D/g, ""))}
              keyboardType="numeric"
            />
          </View>
          <View style={s.quickRow}>
            {QUICK_AMOUNTS.map(a => {
              const raw = a.replace("₦", "").replace(",", "");
              const active = amount === raw;
              return (
                <TouchableOpacity
                  key={a}
                  style={[s.quickChip, active && s.quickChipActive]}
                  onPress={() => { Haptics.selectionAsync(); setAmount(raw); }}
                >
                  <Text style={[s.quickText, active && s.quickTextActive]}>{a}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </Animated.View>

        {/* ── Summary ── */}
        {!!amount && !!platform && (
          <Animated.View entering={FadeInUp.duration(260)} style={s.summaryBox}>
            <View style={s.summaryRow}>
              <Text style={s.summaryLabel}>Platform</Text>
              <Text style={s.summaryValue}>{platform.name}</Text>
            </View>
            <View style={s.summaryLine} />
            <View style={s.summaryRow}>
              <Text style={s.summaryLabel}>User ID</Text>
              <Text style={s.summaryValue}>{userId || "—"}</Text>
            </View>
            <View style={s.summaryLine} />
            <View style={s.summaryRow}>
              <Text style={s.summaryLabel}>Service Charge</Text>
              <Text style={s.summaryValue}>₦0.00</Text>
            </View>
            <View style={s.summaryLine} />
            <View style={s.summaryRow}>
              <Text style={s.summaryLabel}>Total</Text>
              <Text style={[s.summaryValue, s.summaryTotal]}>
                ₦{parseInt(amount || "0").toLocaleString("en-NG")}
              </Text>
            </View>
          </Animated.View>
        )}

        {/* ── CTA ── */}
        <TouchableOpacity
          style={[s.fundBtn, !canProceed && s.fundBtnDisabled]}
          onPress={handleFund}
          activeOpacity={0.85}
          disabled={!canProceed}
        >
          {submitting ? (
            <ActivityIndicator color="#FFFFFF" style={{ marginRight: 6 }} />
          ) : (
            <Feather name="dollar-sign" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
          )}
          <Text style={s.fundBtnText}>
            {submitting ? "Processing..." : platform ? `Fund ${platform.name}` : "Fund Account"}
          </Text>
        </TouchableOpacity>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  header:       { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingBottom: 14, backgroundColor: C.bg },
  backBtn:      { width: 44, height: 44, alignItems: "center", justifyContent: "center" },
  headerTitle:  { fontSize: 13, fontFamily: "Manrope_700Bold", color: C.text, textTransform: "capitalize" },
  divider:      { height: 1, backgroundColor: "#D1D1D1" },
  scroll:       { paddingHorizontal: 20, paddingTop: 20, gap: 18 },
  subtitle:     { fontSize: 12, fontFamily: "Manrope_500Medium", color: C.textMuted, letterSpacing: 0.24 },
  label:        { fontSize: 12, fontFamily: "Manrope_500Medium", color: C.textMuted, textTransform: "capitalize", letterSpacing: 0.24, marginBottom: 6 },

  /* Platform grid — 3 per row */
  platformGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  platformCard: {
    width: "30.5%", alignItems: "center", gap: 6,
    paddingVertical: 14, paddingHorizontal: 8,
    borderRadius: 12, borderWidth: 1, borderColor: C.border,
    backgroundColor: "#F8F9FA", position: "relative",
  },
  platformIcon:  { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  platformAbbr:  { fontSize: 10, fontFamily: "Manrope_700Bold" },
  platformName:  { fontSize: 10, fontFamily: "Manrope_600SemiBold", color: C.textSec, textAlign: "center" },
  platformCheck: { position: "absolute", top: 6, right: 6, width: 14, height: 14, borderRadius: 7, alignItems: "center", justifyContent: "center" },

  /* Inputs */
  inputField:     { flexDirection: "row", alignItems: "center", backgroundColor: C.inputBg, borderRadius: 10, paddingHorizontal: 14, height: 46, borderWidth: 1, borderColor: C.border },
  inputText:      { fontSize: 13, fontFamily: "Manrope_500Medium", color: C.text },
  currencySymbol: { fontSize: 14, fontFamily: "Manrope_700Bold", color: C.textMuted, marginRight: 4 },

  /* Quick amounts */
  quickRow:        { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 10 },
  quickChip:       { paddingHorizontal: 14, paddingVertical: 9, borderRadius: 20, borderWidth: 1, borderColor: C.border, backgroundColor: "#F8F9FA" },
  quickChipActive: { backgroundColor: C.black, borderColor: C.black },
  quickText:       { fontSize: 12, fontFamily: "Manrope_600SemiBold", color: C.textSec },
  quickTextActive: { color: "#FFFFFF" },

  /* Summary */
  summaryBox:   { backgroundColor: C.dark, borderRadius: 10, paddingHorizontal: 18, paddingVertical: 2 },
  summaryRow:   { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 12 },
  summaryLine:  { height: 1, backgroundColor: "rgba(255,255,255,0.1)" },
  summaryLabel: { fontSize: 10, fontFamily: "Manrope_400Regular", color: "rgba(255,255,255,0.7)" },
  summaryValue: { fontSize: 10, fontFamily: "Manrope_500Medium", color: "#FFFFFF" },
  summaryTotal: { fontFamily: "Manrope_700Bold", fontSize: 13 },

  /* CTA */
  fundBtn:         { flexDirection: "row", backgroundColor: C.black, height: 48, borderRadius: 10, alignItems: "center", justifyContent: "center", elevation: 4 },
  fundBtnDisabled: { opacity: 0.45 },
  fundBtnText:     { fontSize: 14, fontFamily: "Manrope_700Bold", color: "#FFFFFF", letterSpacing: -0.14 },
});
