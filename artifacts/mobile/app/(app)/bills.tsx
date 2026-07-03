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
  navy:      "#061941",
  textSec:   "#595F67",
  textMuted: "#6C7278",
  inputBg:   "#F0F0F0",
  border:    "#EDF1F3",
  success:   "#00B03C",
  dark:      "#010101",
  black:     "#000000",
};

const PROVIDERS = ["Spectranet", "Swift Networks", "ipNX", "Lagos Fibre"];

const PROVIDER_HINTS: Record<string, string[]> = {
  "Spectranet":     ["spectranet"],
  "Swift Networks": ["swift"],
  "ipNX":           ["ipnx"],
  "Lagos Fibre":    ["lagosfibre", "fibre"],
};

function FieldLabel({ text }: { text: string }) {
  return <Text style={f.label}>{text}</Text>;
}

function SelectField({ label, value, placeholder, onPress }: { label: string; value: string; placeholder: string; onPress: () => void }) {
  return (
    <View style={{ gap: 4 }}>
      <FieldLabel text={label} />
      <TouchableOpacity style={f.input} onPress={onPress} activeOpacity={0.8}>
        <Text style={[f.val, !value && f.ph]}>{value || placeholder}</Text>
        <Feather name="chevron-down" size={16} color={C.textMuted} />
      </TouchableOpacity>
    </View>
  );
}

const f = StyleSheet.create({
  label: { fontSize: 12, fontFamily: "Manrope_500Medium", color: C.textMuted, textTransform: "capitalize", letterSpacing: 0.24 },
  input: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: C.inputBg, borderWidth: 1, borderColor: C.border, borderRadius: 10, paddingHorizontal: 14, height: 46 },
  val:   { fontSize: 13, fontFamily: "Manrope_500Medium", color: C.text, flex: 1 },
  ph:    { color: "#646464", fontSize: 10 },
});

function PickerModal({ visible, title, options, onSelect, onClose }: { visible: boolean; title: string; options: string[]; onSelect: (v: string) => void; onClose: () => void }) {
  return (
    <AnimatedSheet visible={visible} onClose={onClose} maxHeight="60%">
      <View style={pm.inner}>
        <Text style={pm.title}>{title}</Text>
        <ScrollView showsVerticalScrollIndicator={false}>
          {options.map(o => (
            <TouchableOpacity key={o} style={pm.option} onPress={() => { Haptics.selectionAsync(); onSelect(o); onClose(); }}>
              <Text style={pm.optText}>{o}</Text>
              <Feather name="chevron-right" size={16} color={C.textMuted} />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </AnimatedSheet>
  );
}

const pm = StyleSheet.create({
  inner:   { paddingHorizontal: 20, paddingTop: 20, flex: 1 },
  title:   { fontSize: 16, fontFamily: "Manrope_700Bold", color: C.text, marginBottom: 12 },
  option:  { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: C.border },
  optText: { fontSize: 15, fontFamily: "Manrope_500Medium", color: C.text },
});

export default function BillsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 20 : insets.top;

  const [provider,  setProvider]  = useState("");
  const [accountNum, setAccountNum] = useState("");
  const [amount,    setAmount]    = useState("");
  const [picker,    setPicker]    = useState(false);
  const [billers,    setBillers]    = useState<ReloadlyBiller[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchBillers("INTERNET_BILL_PAYMENT")
      .then(setBillers)
      .catch((err) => console.warn("Failed to load internet billers:", err));
  }, []);

  const canProceed = !!provider && !!accountNum && !!amount && !submitting;

  const handlePay = async () => {
    if (!canProceed) return;

    const biller = matchBiller(billers, PROVIDER_HINTS[provider] ?? [provider]);
    if (!biller) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Provider unavailable", `${provider} isn't currently available. Please try again later.`);
      return;
    }

    setSubmitting(true);
    try {
      const result = await payBill({
        billerId: biller.id,
        subscriberAccountNumber: accountNum,
        amount: parseInt(amount || "0"),
        referenceId: `internet-${Date.now()}`,
      });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.push({
        pathname: "/(app)/submitted" as any,
        params: {
          title:    "Payment Successful",
          subtitle: `Your bill payment is being\nprocessed (ref: ${result.referenceId})`,
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
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: C.bg }} behavior={Platform.OS === "ios" ? "padding" : undefined}>

      <Animated.View entering={FadeInDown.duration(280).springify()} style={[s.header, { paddingTop: topPad + 10 }]}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
          <Feather name="arrow-left" size={22} color="#1E232C" />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Internet Bill</Text>
        <View style={{ width: 44 }} />
      </Animated.View>
      <View style={s.divider} />

      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" contentContainerStyle={[s.scroll, { paddingBottom: insets.bottom + 40 }]}>

        <Animated.View entering={FadeInDown.duration(300).delay(30)}>
          <Text style={s.subtitle}>Select your internet provider and fill in details.</Text>
        </Animated.View>

        {/* Provider */}
        <Animated.View entering={FadeInDown.duration(300).delay(60)}>
          <SelectField label="select provider" value={provider} placeholder="   Choose provider" onPress={() => setPicker(true)} />
        </Animated.View>

        {/* Account number */}
        <Animated.View entering={FadeInDown.duration(300).delay(90)}>
          <View style={{ gap: 4 }}>
            <Text style={s.label}>account number</Text>
            <View style={f.input}>
              <TextInput
                style={[f.val]}
                placeholder="   Enter number"
                placeholderTextColor="#646464"
                value={accountNum}
                onChangeText={setAccountNum}
                keyboardType="numeric"
              />
              {accountNum.length >= 10 && <Feather name="check-circle" size={18} color={C.success} />}
            </View>
          </View>
        </Animated.View>

        {/* Amount */}
        <Animated.View entering={FadeInDown.duration(300).delay(120)}>
          <View style={{ gap: 4 }}>
            <Text style={s.label}>amount</Text>
            <View style={f.input}>
              <Text style={{ fontSize: 14, fontFamily: "Manrope_700Bold", color: C.textMuted, marginRight: 4 }}>₦</Text>
              <TextInput
                style={[f.val, { flex: 1 }]}
                placeholder="0.00"
                placeholderTextColor="#646464"
                value={amount}
                onChangeText={t => setAmount(t.replace(/\D/g, ""))}
                keyboardType="numeric"
              />
            </View>
          </View>
        </Animated.View>

        {/* Summary */}
        {!!amount && (
          <Animated.View entering={FadeInUp.duration(260)} style={s.summaryBox}>
            <View style={s.summaryRow}>
              <Text style={s.summaryLabel}>Provider</Text>
              <Text style={s.summaryValue}>{provider || "—"}</Text>
            </View>
            <View style={s.summaryLine} />
            <View style={s.summaryRow}>
              <Text style={s.summaryLabel}>Service Charge</Text>
              <Text style={s.summaryValue}>₦100.00</Text>
            </View>
            <View style={s.summaryLine} />
            <View style={s.summaryRow}>
              <Text style={s.summaryLabel}>Total:</Text>
              <Text style={[s.summaryValue, { fontFamily: "Manrope_700Bold", fontSize: 13 }]}>
                ₦{(parseInt(amount || "0") + 100).toLocaleString("en-NG")}
              </Text>
            </View>
          </Animated.View>
        )}

        <TouchableOpacity
          style={[s.payBtn, !canProceed && { opacity: 0.45 }]}
          onPress={handlePay}
          activeOpacity={0.85}
          disabled={!canProceed}
        >
          {submitting ? (
            <ActivityIndicator color="#FFFFFF" style={{ marginRight: 6 }} />
          ) : null}
          <Text style={s.payBtnText}>{submitting ? "Processing..." : "Pay Bill"}</Text>
        </TouchableOpacity>

      </ScrollView>

      <PickerModal visible={picker} title="Select Internet Provider" options={PROVIDERS} onSelect={setProvider} onClose={() => setPicker(false)} />
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  header:      { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingBottom: 14, backgroundColor: C.bg },
  backBtn:     { width: 44, height: 44, alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: 13, fontFamily: "Manrope_700Bold", color: C.text, textTransform: "capitalize" },
  divider:     { height: 1, backgroundColor: "#D1D1D1" },
  scroll:      { paddingHorizontal: 20, paddingTop: 20, gap: 18 },
  subtitle:    { fontSize: 12, fontFamily: "Manrope_500Medium", color: C.textMuted, letterSpacing: 0.24 },
  label:       { fontSize: 12, fontFamily: "Manrope_500Medium", color: C.textMuted, textTransform: "capitalize", letterSpacing: 0.24, marginBottom: 6 },

  summaryBox:   { backgroundColor: C.dark, borderRadius: 10, paddingHorizontal: 18, paddingVertical: 2 },
  summaryRow:   { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 13 },
  summaryLine:  { height: 1, backgroundColor: "rgba(255,255,255,0.1)" },
  summaryLabel: { fontSize: 10, fontFamily: "Manrope_400Regular", color: "rgba(255,255,255,0.7)" },
  summaryValue: { fontSize: 10, fontFamily: "Manrope_500Medium", color: "#FFFFFF" },

  payBtn:     { flexDirection: "row", backgroundColor: C.black, height: 48, borderRadius: 10, alignItems: "center", justifyContent: "center", elevation: 4 },
  payBtnText: { fontSize: 14, fontFamily: "Manrope_700Bold", color: "#FFFFFF", letterSpacing: -0.14 },
});
