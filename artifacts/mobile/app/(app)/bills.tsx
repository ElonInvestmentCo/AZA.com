import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { AnimatedSheet } from "@/components/AnimatedSheet";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
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

type BillType = "electricity" | "cable" | "internet" | "betting";

const BILL_TYPES: { id: BillType; label: string; icon: React.ComponentProps<typeof Feather>["name"]; bg: string; color: string }[] = [
  { id: "electricity", label: "Electricity", icon: "zap",        bg: "#FFFBEB", color: "#D97706" },
  { id: "cable",       label: "Cable TV",    icon: "tv",         bg: "#FFF1F2", color: "#E11D48" },
  { id: "internet",    label: "Internet",    icon: "wifi",       bg: "#EFF6FF", color: "#2563EB" },
  { id: "betting",     label: "Bet Funding", icon: "dollar-sign",bg: "#ECFEFF", color: "#0891B2" },
];

const PROVIDERS: Record<BillType, string[]> = {
  electricity: ["EKEDC", "IKEDC", "AEDC", "PHEDC", "BEDC", "KEDCO", "JEDC"],
  cable:       ["DSTV", "GOtv", "StarTimes", "Consat"],
  internet:    ["Spectranet", "Swift Networks", "ipNX", "Lagos Fibre"],
  betting:     ["Bet9ja", "SportyBet", "Betway", "1xBet", "NairaBet", "BetKing"],
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
      <View style={pm.handle} />
      <Text style={pm.title}>{title}</Text>
      <ScrollView showsVerticalScrollIndicator={false}>
        {options.map(o => (
          <TouchableOpacity key={o} style={pm.option} onPress={() => { Haptics.selectionAsync(); onSelect(o); onClose(); }}>
            <Text style={pm.optText}>{o}</Text>
            <Feather name="chevron-right" size={16} color={C.textMuted} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </AnimatedSheet>
  );
}

const pm = StyleSheet.create({
  handle:  { width: 40, height: 4, borderRadius: 2, backgroundColor: C.border, alignSelf: "center", marginBottom: 16 },
  title:   { fontSize: 16, fontFamily: "Manrope_700Bold", color: C.text, marginBottom: 12 },
  option:  { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: C.border },
  optText: { fontSize: 15, fontFamily: "Manrope_500Medium", color: C.text },
});

export default function BillsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 20 : insets.top;

  const [billType,  setBillType]  = useState<BillType>("electricity");
  const [provider,  setProvider]  = useState("");
  const [meterNum,  setMeterNum]  = useState("");
  const [amount,    setAmount]    = useState("");
  const [picker,    setPicker]    = useState(false);

  const selected = BILL_TYPES.find(b => b.id === billType)!;
  const providers = PROVIDERS[billType];
  const canProceed = !!provider && !!meterNum && !!amount;

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: C.bg }} behavior={Platform.OS === "ios" ? "padding" : undefined}>

      <Animated.View entering={FadeInDown.duration(280).springify()} style={[s.header, { paddingTop: topPad + 10 }]}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
          <Feather name="arrow-left" size={22} color="#1E232C" />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Pay Bills</Text>
        <View style={{ width: 44 }} />
      </Animated.View>
      <View style={s.divider} />

      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" contentContainerStyle={[s.scroll, { paddingBottom: insets.bottom + 40 }]}>

        <Animated.View entering={FadeInDown.duration(300).delay(30)}>
          <Text style={s.subtitle}>Select bill category and fill in details.</Text>
        </Animated.View>

        {/* Bill type selector */}
        <Animated.View entering={FadeInDown.duration(300).delay(60)}>
          <Text style={s.label}>bill category</Text>
          <View style={s.typeRow}>
            {BILL_TYPES.map(b => (
              <Pressable
                key={b.id}
                style={[s.typeItem, billType === b.id && { borderColor: b.color, borderWidth: 2, backgroundColor: b.bg }]}
                onPress={() => { Haptics.selectionAsync(); setBillType(b.id); setProvider(""); }}
              >
                <View style={[s.typeIcon, { backgroundColor: billType === b.id ? b.color + "22" : "#F8F9FA" }]}>
                  <Feather name={b.icon} size={18} color={billType === b.id ? b.color : C.textMuted} />
                </View>
                <Text style={[s.typeLabel, billType === b.id && { color: b.color }]}>{b.label}</Text>
              </Pressable>
            ))}
          </View>
        </Animated.View>

        {/* Provider */}
        <Animated.View entering={FadeInDown.duration(300).delay(90)}>
          <SelectField label="select provider" value={provider} placeholder="   Choose provider" onPress={() => setPicker(true)} />
        </Animated.View>

        {/* Meter/account number */}
        <Animated.View entering={FadeInDown.duration(300).delay(120)}>
          <View style={{ gap: 4 }}>
            <Text style={s.label}>{billType === "electricity" ? "meter number" : billType === "cable" ? "smart card number" : "account number"}</Text>
            <View style={f.input}>
              <TextInput
                style={[f.val]}
                placeholder="   Enter number"
                placeholderTextColor="#646464"
                value={meterNum}
                onChangeText={setMeterNum}
                keyboardType="numeric"
              />
              {meterNum.length >= 10 && <Feather name="check-circle" size={18} color={C.success} />}
            </View>
          </View>
        </Animated.View>

        {/* Amount */}
        <Animated.View entering={FadeInDown.duration(300).delay(150)}>
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
          onPress={() => {
            if (!canProceed) return;
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            router.push({ pathname: "/(app)/submitted" as any, params: { title: "Payment Successful", subtitle: "Your bill payment has been\nprocessed successfully" } });
          }}
          activeOpacity={0.85}
        >
          <Text style={s.payBtnText}>Pay Bill</Text>
        </TouchableOpacity>

      </ScrollView>

      <PickerModal visible={picker} title={`Select ${selected.label} Provider`} options={providers} onSelect={setProvider} onClose={() => setPicker(false)} />
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

  typeRow:  { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  typeItem: { width: "47%", borderRadius: 12, borderWidth: 1, borderColor: C.border, backgroundColor: "#F8F9FA", padding: 14, alignItems: "center", gap: 8 },
  typeIcon: { width: 42, height: 42, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  typeLabel:{ fontSize: 12, fontFamily: "Manrope_600SemiBold", color: C.textSec },

  summaryBox:   { backgroundColor: C.dark, borderRadius: 10, paddingHorizontal: 18, paddingVertical: 2 },
  summaryRow:   { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 13 },
  summaryLine:  { height: 1, backgroundColor: "rgba(255,255,255,0.1)" },
  summaryLabel: { fontSize: 10, fontFamily: "Manrope_400Regular", color: "rgba(255,255,255,0.7)" },
  summaryValue: { fontSize: 10, fontFamily: "Manrope_500Medium", color: "#FFFFFF" },

  payBtn:     { backgroundColor: C.black, height: 48, borderRadius: 10, alignItems: "center", justifyContent: "center", elevation: 4 },
  payBtnText: { fontSize: 14, fontFamily: "Manrope_700Bold", color: "#FFFFFF", letterSpacing: -0.14 },
});
