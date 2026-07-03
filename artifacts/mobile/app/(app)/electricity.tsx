import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { AnimatedSheet } from "@/components/AnimatedSheet";
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
  accent:    "#D97706",
  accentBg:  "#FFF7ED",
};

const DISCOS = [
  { id: "ekedc",  name: "EKEDC",  full: "Eko Electric",          abbr: "EKE", hints: ["eko"] },
  { id: "ikedc",  name: "IKEDC",  full: "Ikeja Electric",        abbr: "IKE", hints: ["ikeja"] },
  { id: "aedc",   name: "AEDC",   full: "Abuja Electric",        abbr: "ABJ", hints: ["abuja"] },
  { id: "phedc",  name: "PHEDC",  full: "Port Harcourt Electric",abbr: "PHC", hints: ["portharcourt", "phed"] },
  { id: "bedc",   name: "BEDC",   full: "Benin Electric",        abbr: "BEN", hints: ["benin"] },
  { id: "kedco",  name: "KEDCO",  full: "Kano Electric",         abbr: "KAN", hints: ["kano"] },
  { id: "jedc",   name: "JEDC",   full: "Jos Electric",          abbr: "JOS", hints: ["jos"] },
  { id: "kedpo",  name: "KEDPO",  full: "Kaduna Electric",       abbr: "KAD", hints: ["kaduna"] },
];

const QUICK_AMOUNTS = ["₦1,000", "₦2,000", "₦5,000", "₦10,000", "₦20,000", "₦50,000"];

type MeterType = "prepaid" | "postpaid";

export default function ElectricityScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 20 : insets.top;

  const [disco,      setDisco]      = useState<typeof DISCOS[number] | null>(null);
  const [meterType,  setMeterType]  = useState<MeterType>("prepaid");
  const [meterNum,   setMeterNum]   = useState("");
  const [amount,     setAmount]     = useState("");
  const [discoSheet, setDiscoSheet] = useState(false);
  const [billers,    setBillers]    = useState<ReloadlyBiller[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchBillers("ELECTRICITY_BILL_PAYMENT")
      .then(setBillers)
      .catch((err) => console.warn("Failed to load electricity billers:", err));
  }, []);

  const parseAmt = (raw: string) => parseInt(raw.replace(/,/g, "") || "0");
  const canProceed = !!disco && meterNum.length >= 10 && !!amount && !submitting;

  const handlePay = async () => {
    if (!canProceed || !disco) return;

    const biller = matchBiller(
      billers,
      disco.hints,
      meterType === "prepaid" ? "PREPAID" : "POSTPAID",
    );

    if (!biller) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert(
        "Biller unavailable",
        `${disco.full} isn't currently available for ${meterType} payments. Please try again later.`,
      );
      return;
    }

    setSubmitting(true);
    try {
      const result = await payBill({
        billerId: biller.id,
        subscriberAccountNumber: meterNum,
        amount: parseAmt(amount),
        referenceId: `electricity-${Date.now()}`,
      });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.push({
        pathname: "/(app)/submitted" as any,
        params: {
          title:    "Payment Successful",
          subtitle: `Your electricity token is being\nprocessed (ref: ${result.referenceId})`,
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
        <Text style={s.headerTitle}>Electricity Bill</Text>
        <View style={{ width: 44 }} />
      </Animated.View>
      <View style={s.divider} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[s.scroll, { paddingBottom: insets.bottom + 40 }]}
      >
        <Animated.View entering={FadeInDown.duration(300).delay(30)}>
          <Text style={s.subtitle}>Select your DisCo and enter meter details.</Text>
        </Animated.View>

        {/* ── Distribution company picker ── */}
        <Animated.View entering={FadeInDown.duration(300).delay(60)}>
          <Text style={s.label}>distribution company</Text>
          <TouchableOpacity
            style={[s.selectBtn, disco && { borderColor: C.accent }]}
            onPress={() => { Haptics.selectionAsync(); setDiscoSheet(true); }}
            activeOpacity={0.8}
          >
            {disco ? (
              <View style={s.selectedDisco}>
                <View style={[s.discoAbbr, { backgroundColor: C.accentBg }]}>
                  <Text style={[s.discoAbbrText, { color: C.accent }]}>{disco.abbr}</Text>
                </View>
                <View>
                  <Text style={s.discoName}>{disco.name}</Text>
                  <Text style={s.discoFull}>{disco.full}</Text>
                </View>
              </View>
            ) : (
              <Text style={s.selectPlaceholder}>Choose distribution company</Text>
            )}
            <Feather name="chevron-down" size={16} color={C.textMuted} />
          </TouchableOpacity>
        </Animated.View>

        {/* ── Meter type toggle ── */}
        <Animated.View entering={FadeInDown.duration(300).delay(90)}>
          <Text style={s.label}>meter type</Text>
          <View style={s.meterToggle}>
            {(["prepaid", "postpaid"] as MeterType[]).map(t => (
              <Pressable
                key={t}
                style={[s.meterTab, meterType === t && s.meterTabActive]}
                onPress={() => { Haptics.selectionAsync(); setMeterType(t); }}
              >
                <Text style={[s.meterTabText, meterType === t && s.meterTabTextActive]}>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </Text>
              </Pressable>
            ))}
          </View>
        </Animated.View>

        {/* ── Meter number ── */}
        <Animated.View entering={FadeInDown.duration(300).delay(120)}>
          <Text style={s.label}>meter number</Text>
          <View style={s.inputField}>
            <Feather name="credit-card" size={16} color={C.textMuted} style={{ marginRight: 8 }} />
            <TextInput
              style={[s.inputText, { flex: 1 }]}
              placeholder="Enter 11-digit meter number"
              placeholderTextColor="#646464"
              value={meterNum}
              onChangeText={t => setMeterNum(t.replace(/\D/g, "").slice(0, 13))}
              keyboardType="numeric"
              maxLength={13}
            />
            {meterNum.length >= 10 && (
              <Feather name="check-circle" size={18} color={C.success} />
            )}
          </View>
          {meterNum.length > 0 && meterNum.length < 10 && (
            <Text style={s.fieldHint}>Meter number must be at least 10 digits</Text>
          )}
        </Animated.View>

        {/* ── Amount ── */}
        <Animated.View entering={FadeInDown.duration(300).delay(150)}>
          <Text style={s.label}>amount</Text>
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
        {!!amount && !!disco && (
          <Animated.View entering={FadeInUp.duration(260)} style={s.summaryBox}>
            <View style={s.summaryRow}>
              <Text style={s.summaryLabel}>DisCo</Text>
              <Text style={s.summaryValue}>{disco.full}</Text>
            </View>
            <View style={s.summaryLine} />
            <View style={s.summaryRow}>
              <Text style={s.summaryLabel}>Meter Type</Text>
              <Text style={s.summaryValue}>{meterType.charAt(0).toUpperCase() + meterType.slice(1)}</Text>
            </View>
            <View style={s.summaryLine} />
            <View style={s.summaryRow}>
              <Text style={s.summaryLabel}>Service Charge</Text>
              <Text style={s.summaryValue}>₦100.00</Text>
            </View>
            <View style={s.summaryLine} />
            <View style={s.summaryRow}>
              <Text style={s.summaryLabel}>Total</Text>
              <Text style={[s.summaryValue, s.summaryTotal]}>
                ₦{(parseAmt(amount) + 100).toLocaleString("en-NG")}
              </Text>
            </View>
          </Animated.View>
        )}

        {/* ── CTA ── */}
        <TouchableOpacity
          style={[s.payBtn, !canProceed && s.payBtnDisabled]}
          onPress={handlePay}
          activeOpacity={0.85}
          disabled={!canProceed}
        >
          {submitting ? (
            <ActivityIndicator color="#FFFFFF" style={{ marginRight: 8 }} />
          ) : (
            <Feather name="zap" size={16} color="#FFFFFF" style={{ marginRight: 8 }} />
          )}
          <Text style={s.payBtnText}>{submitting ? "Processing..." : "Pay Electricity Bill"}</Text>
        </TouchableOpacity>

      </ScrollView>

      {/* ── DisCo picker sheet ── */}
      <AnimatedSheet
        visible={discoSheet}
        onClose={() => setDiscoSheet(false)}
        maxHeight="65%"
      >
        <View style={sh.inner}>
          <Text style={sh.title}>Select Distribution Company</Text>
          <ScrollView showsVerticalScrollIndicator={false}>
            {DISCOS.map(d => (
              <TouchableOpacity
                key={d.id}
                style={[sh.option, disco?.id === d.id && sh.optionActive]}
                onPress={() => {
                  Haptics.selectionAsync();
                  setDisco(d);
                  setDiscoSheet(false);
                }}
              >
                <View style={[sh.optAbbr, disco?.id === d.id
                  ? { backgroundColor: C.accent }
                  : { backgroundColor: C.accentBg }
                ]}>
                  <Text style={[sh.optAbbrText, { color: disco?.id === d.id ? "#fff" : C.accent }]}>
                    {d.abbr}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[sh.optName, disco?.id === d.id && { color: C.accent }]}>{d.name}</Text>
                  <Text style={sh.optFull}>{d.full}</Text>
                </View>
                {disco?.id === d.id && (
                  <Feather name="check" size={16} color={C.accent} />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </AnimatedSheet>
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
  fieldHint:    { fontSize: 11, fontFamily: "Manrope_400Regular", color: "#E11D48", marginTop: 4 },

  /* DisCo select button */
  selectBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    backgroundColor: C.inputBg, borderWidth: 1, borderColor: C.border,
    borderRadius: 10, paddingHorizontal: 14, height: 54,
  },
  selectPlaceholder: { fontSize: 12, fontFamily: "Manrope_500Medium", color: "#646464", flex: 1 },
  selectedDisco:     { flexDirection: "row", alignItems: "center", gap: 10, flex: 1 },
  discoAbbr:         { width: 32, height: 32, borderRadius: 8, alignItems: "center", justifyContent: "center" },
  discoAbbrText:     { fontSize: 10, fontFamily: "Manrope_700Bold" },
  discoName:         { fontSize: 13, fontFamily: "Manrope_700Bold", color: C.text },
  discoFull:         { fontSize: 10, fontFamily: "Manrope_400Regular", color: C.textMuted },

  /* Meter type toggle */
  meterToggle:     { flexDirection: "row", backgroundColor: C.inputBg, borderRadius: 10, padding: 3, gap: 3 },
  meterTab:        { flex: 1, height: 38, borderRadius: 8, alignItems: "center", justifyContent: "center" },
  meterTabActive:  { backgroundColor: C.black, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 6, elevation: 3 },
  meterTabText:    { fontSize: 13, fontFamily: "Manrope_600SemiBold", color: C.textMuted },
  meterTabTextActive: { color: "#FFFFFF" },

  /* Input */
  inputField:    { flexDirection: "row", alignItems: "center", backgroundColor: C.inputBg, borderRadius: 10, paddingHorizontal: 14, height: 46, borderWidth: 1, borderColor: C.border },
  inputText:     { fontSize: 13, fontFamily: "Manrope_500Medium", color: C.text },
  currencySymbol: { fontSize: 14, fontFamily: "Manrope_700Bold", color: C.textMuted, marginRight: 4 },

  /* Quick amounts */
  quickRow:       { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 10 },
  quickChip:      { paddingHorizontal: 14, paddingVertical: 9, borderRadius: 20, borderWidth: 1, borderColor: C.border, backgroundColor: "#F8F9FA" },
  quickChipActive:{ backgroundColor: C.black, borderColor: C.black },
  quickText:      { fontSize: 12, fontFamily: "Manrope_600SemiBold", color: C.textSec },
  quickTextActive:{ color: "#FFFFFF" },

  /* Summary */
  summaryBox:   { backgroundColor: C.dark, borderRadius: 10, paddingHorizontal: 18, paddingVertical: 2 },
  summaryRow:   { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 12 },
  summaryLine:  { height: 1, backgroundColor: "rgba(255,255,255,0.1)" },
  summaryLabel: { fontSize: 10, fontFamily: "Manrope_400Regular", color: "rgba(255,255,255,0.7)" },
  summaryValue: { fontSize: 10, fontFamily: "Manrope_500Medium", color: "#FFFFFF" },
  summaryTotal: { fontFamily: "Manrope_700Bold", fontSize: 13 },

  /* CTA */
  payBtn:         { flexDirection: "row", backgroundColor: C.black, height: 48, borderRadius: 10, alignItems: "center", justifyContent: "center", elevation: 4 },
  payBtnDisabled: { opacity: 0.45 },
  payBtnText:     { fontSize: 14, fontFamily: "Manrope_700Bold", color: "#FFFFFF", letterSpacing: -0.14 },
});

const sh = StyleSheet.create({
  inner:  { paddingHorizontal: 20, paddingTop: 20, flex: 1 },
  title:  { fontSize: 16, fontFamily: "Manrope_700Bold", color: C.text, marginBottom: 14 },
  option: {
    flexDirection: "row", alignItems: "center", gap: 12,
    paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: C.border,
  },
  optionActive: { backgroundColor: "transparent" },
  optAbbr:      { width: 36, height: 36, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  optAbbrText:  { fontSize: 10, fontFamily: "Manrope_700Bold" },
  optName:      { fontSize: 14, fontFamily: "Manrope_600SemiBold", color: C.text },
  optFull:      { fontSize: 11, fontFamily: "Manrope_400Regular", color: C.textMuted, marginTop: 1 },
});
