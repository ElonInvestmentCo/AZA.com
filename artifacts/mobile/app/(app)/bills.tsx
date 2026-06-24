import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
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
import { ScreenHeader } from "@/components/ScreenHeader";

const C = {
  bg:       "#FFFFFF",
  text:     "#0B0A0A",
  textSec:  "#595F67",
  textMut:  "#AAAFB5",
  border:   "#EDF1F3",
  surface:  "#F8F9FA",
  inputBg:  "#F7F8F9",
  accent:   "#35C2C1",
  btn:      "#000000",
};

type BillCategory = {
  id: string;
  label: string;
  icon: React.ComponentProps<typeof Feather>["name"];
  color: string;
  providers: string[];
};

const CATEGORIES: BillCategory[] = [
  { id:"elec",  label:"Electricity",  icon:"zap",       color:"#F59E0B", providers:["EKEDC","IKEDC","KEDCO","AEDC","BEDC","IBEDC","JEDC","KAEDCO","PHEDC"] },
  { id:"cable", label:"Cable TV",     icon:"tv",        color:"#EF4444", providers:["DSTV","GoTV","StarTimes","ShowMax"] },
  { id:"internet", label:"Internet",  icon:"wifi",      color:"#3B82F6", providers:["Spectranet","Smile","Swift","IPNX","Ntel"] },
  { id:"education", label:"Education",icon:"book-open", color:"#8B5CF6", providers:["WAEC","NECO","NABTEB","JAMB"] },
  { id:"betting", label:"Betting",    icon:"grid",      color:"#10B981", providers:["Bet9ja","SportyBet","BetKing","NairaBet","1xBet","Betway"] },
  { id:"water",  label:"Water",       icon:"droplet",   color:"#06B6D4", providers:["LCC Water","LSWC","Abuja Water","Rivers Water"] },
];

type Step = "category" | "provider" | "details" | "confirm" | "success";

export default function BillsScreen() {
  const router = useRouter();

  const [step,     setStep]     = useState<Step>("category");
  const [category, setCategory] = useState<BillCategory | null>(null);
  const [provider, setProvider] = useState("");
  const [meter,    setMeter]    = useState("");
  const [amount,   setAmount]   = useState("");
  const [loading,  setLoading]  = useState(false);
  const [showPicker, setShowPicker] = useState(false);

  const quickAmounts = ["₦1,000", "₦2,000", "₦5,000", "₦10,000", "₦20,000"];

  const handleSubmit = async () => {
    if (!amount) { Alert.alert("Error", "Please enter an amount"); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);
    setStep("success");
  };

  if (step === "success") {
    return (
      <View style={s.root}>
        <ScreenHeader title="Payment Successful" showBack={false} />
        <View style={s.successWrap}>
          <Animated.View entering={FadeInDown.duration(400).springify()} style={s.successCircle}>
            <Feather name="check" size={40} color="#fff" />
          </Animated.View>
          <Animated.Text entering={FadeInUp.duration(350).delay(100)} style={s.successTitle}>
            Payment Successful!
          </Animated.Text>
          <Animated.Text entering={FadeInUp.duration(350).delay(150)} style={s.successSub}>
            Your {category?.label} bill of {amount} has been paid.
          </Animated.Text>
          <Animated.View entering={FadeInUp.duration(320).delay(220)} style={s.successCard}>
            {[
              { label:"Provider",  value: provider },
              { label:"Reference", value: `AZ-${Math.floor(Math.random()*9000)+1000}` },
              { label:"Amount",    value: amount },
              { label:"Status",    value: "Successful" },
            ].map(r => (
              <View key={r.label} style={s.receiptRow}>
                <Text style={s.receiptLabel}>{r.label}</Text>
                <Text style={s.receiptValue}>{r.value}</Text>
              </View>
            ))}
          </Animated.View>
          <TouchableOpacity
            style={[s.btn, { marginTop: 24 }]}
            onPress={() => {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              router.back();
            }}
          >
            <Text style={s.btnText}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={s.root} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScreenHeader title={
        step === "category" ? "Bills & Utilities" :
        step === "provider" ? (category?.label ?? "Bills") :
        step === "details"  ? "Enter Details" :
        "Confirm Payment"
      } />

      <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

        {/* STEP 1 — Category selection */}
        {step === "category" && (
          <Animated.View entering={FadeInDown.duration(320)}>
            <Text style={s.subheading}>Select bill category</Text>
            <View style={s.catGrid}>
              {CATEGORIES.map((cat, i) => (
                <Animated.View key={cat.id} entering={FadeInDown.duration(280).delay(i * 30)}>
                  <TouchableOpacity
                    style={s.catCard}
                    activeOpacity={0.8}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      setCategory(cat);
                      setStep("provider");
                    }}
                  >
                    <View style={[s.catIcon, { backgroundColor: cat.color + "18" }]}>
                      <Feather name={cat.icon} size={26} color={cat.color} />
                    </View>
                    <Text style={s.catLabel}>{cat.label}</Text>
                  </TouchableOpacity>
                </Animated.View>
              ))}
            </View>
          </Animated.View>
        )}

        {/* STEP 2 — Provider selection */}
        {step === "provider" && category && (
          <Animated.View entering={FadeInDown.duration(300)} style={{ gap: 12 }}>
            <Text style={s.subheading}>Select {category.label} provider</Text>
            {category.providers.map((p, i) => (
              <Animated.View key={p} entering={FadeInDown.duration(260).delay(i * 25)}>
                <TouchableOpacity
                  style={[s.providerRow, provider === p && s.providerRowActive]}
                  activeOpacity={0.8}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setProvider(p);
                    setStep("details");
                  }}
                >
                  <View style={[s.providerIcon, { backgroundColor: category.color + "18" }]}>
                    <Feather name={category.icon} size={18} color={category.color} />
                  </View>
                  <Text style={s.providerName}>{p}</Text>
                  <Feather name="chevron-right" size={18} color={C.textMut} />
                </TouchableOpacity>
              </Animated.View>
            ))}
          </Animated.View>
        )}

        {/* STEP 3 — Details */}
        {step === "details" && (
          <Animated.View entering={FadeInDown.duration(300)} style={{ gap: 20 }}>
            <View style={s.selectedProvider}>
              <View style={[s.providerIcon, { backgroundColor: (category?.color ?? "#000") + "18" }]}>
                <Feather name={category?.icon ?? "zap"} size={18} color={category?.color ?? "#000"} />
              </View>
              <View>
                <Text style={s.selectedLabel}>Provider</Text>
                <Text style={s.selectedValue}>{provider}</Text>
              </View>
            </View>

            <View style={s.field}>
              <Text style={s.fieldLabel}>
                {category?.id === "cable" ? "Smart Card Number" :
                 category?.id === "internet" ? "Account Number" :
                 category?.id === "betting" ? "User ID / Account" :
                 category?.id === "education" ? "Registration Number" :
                 "Meter Number"}
              </Text>
              <TextInput
                style={s.input}
                placeholder="Enter number"
                placeholderTextColor={C.textMut}
                value={meter}
                onChangeText={setMeter}
                keyboardType="numeric"
              />
            </View>

            <View style={s.field}>
              <Text style={s.fieldLabel}>Amount</Text>
              <TextInput
                style={s.input}
                placeholder="₦0.00"
                placeholderTextColor={C.textMut}
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
              />
            </View>

            <View style={s.quickRow}>
              {quickAmounts.map(qa => (
                <TouchableOpacity
                  key={qa}
                  style={[s.quickChip, amount === qa && s.quickChipActive]}
                  onPress={() => { Haptics.selectionAsync(); setAmount(qa); }}
                >
                  <Text style={[s.quickText, amount === qa && s.quickTextActive]}>{qa}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={[s.btn, (!meter || !amount) && s.btnDisabled]}
              disabled={!meter || !amount}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                setStep("confirm");
              }}
            >
              <Text style={s.btnText}>Continue</Text>
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* STEP 4 — Confirm */}
        {step === "confirm" && (
          <Animated.View entering={FadeInDown.duration(300)} style={{ gap: 20 }}>
            <Text style={s.subheading}>Review your payment</Text>
            <View style={s.confirmCard}>
              {[
                { label:"Category",    value: category?.label ?? "" },
                { label:"Provider",    value: provider },
                { label:"Reference",   value: meter },
                { label:"Amount",      value: amount },
                { label:"Fee",         value: "₦0.00" },
                { label:"Total",       value: amount },
              ].map(r => (
                <View key={r.label} style={s.receiptRow}>
                  <Text style={s.receiptLabel}>{r.label}</Text>
                  <Text style={[s.receiptValue, r.label === "Total" && { color: C.btn, fontFamily: "Manrope_700Bold" }]}>
                    {r.value}
                  </Text>
                </View>
              ))}
            </View>
            <TouchableOpacity style={[s.btn, loading && s.btnDisabled]} disabled={loading} onPress={handleSubmit}>
              <Text style={s.btnText}>{loading ? "Processing…" : "Pay Now"}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setStep("details")} style={s.secondaryBtn}>
              <Text style={s.secondaryText}>Edit Details</Text>
            </TouchableOpacity>
          </Animated.View>
        )}

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  root:    { flex: 1, backgroundColor: C.bg },
  scroll:  { padding: 20, flexGrow: 1 },

  subheading: { fontSize: 15, fontFamily: "Manrope_600SemiBold", color: C.textSec, marginBottom: 16 },

  catGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  catCard: {
    width: "47%", backgroundColor: C.surface, borderRadius: 16, padding: 16,
    alignItems: "center", gap: 10, borderWidth: 1, borderColor: C.border,
  },
  catIcon:  { width: 56, height: 56, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  catLabel: { fontSize: 13, fontFamily: "Manrope_600SemiBold", color: C.text, textAlign: "center" },

  providerRow: {
    flexDirection: "row", alignItems: "center", gap: 12,
    backgroundColor: C.surface, borderRadius: 14, padding: 14, borderWidth: 1, borderColor: C.border,
  },
  providerRowActive: { borderColor: C.accent },
  providerIcon: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  providerName: { flex: 1, fontSize: 14, fontFamily: "Manrope_600SemiBold", color: C.text },

  selectedProvider: {
    flexDirection: "row", alignItems: "center", gap: 12,
    backgroundColor: C.surface, borderRadius: 14, padding: 14,
  },
  selectedLabel: { fontSize: 11, fontFamily: "Manrope_400Regular", color: C.textMut },
  selectedValue: { fontSize: 14, fontFamily: "Manrope_600SemiBold", color: C.text },

  field:      { gap: 6 },
  fieldLabel: { fontSize: 13, fontFamily: "Manrope_500Medium", color: C.textSec },
  input: {
    backgroundColor: C.inputBg, borderWidth: 1, borderColor: C.border,
    borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14,
    fontSize: 15, fontFamily: "Manrope_500Medium", color: C.text,
  },

  quickRow:       { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  quickChip:      { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: C.border, backgroundColor: C.surface },
  quickChipActive:{ backgroundColor: C.btn, borderColor: C.btn },
  quickText:      { fontSize: 12, fontFamily: "Manrope_500Medium", color: C.textSec },
  quickTextActive:{ color: "#fff" },

  btn: { height: 56, backgroundColor: C.btn, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  btnDisabled: { opacity: 0.5 },
  btnText: { fontSize: 16, fontFamily: "Manrope_700Bold", color: "#fff" },

  secondaryBtn: { height: 48, alignItems: "center", justifyContent: "center" },
  secondaryText:{ fontSize: 14, fontFamily: "Manrope_600SemiBold", color: C.textSec },

  confirmCard: {
    backgroundColor: C.surface, borderRadius: 16, padding: 18,
    borderWidth: 1, borderColor: C.border, gap: 14,
  },
  receiptRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  receiptLabel: { fontSize: 13, fontFamily: "Manrope_400Regular", color: C.textSec },
  receiptValue: { fontSize: 13, fontFamily: "Manrope_600SemiBold", color: C.text },

  successWrap: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24, gap: 12 },
  successCircle: {
    width: 80, height: 80, borderRadius: 40, backgroundColor: "#00B03C",
    alignItems: "center", justifyContent: "center", marginBottom: 8,
  },
  successTitle: { fontSize: 22, fontFamily: "Manrope_700Bold", color: C.text },
  successSub:   { fontSize: 14, fontFamily: "Manrope_400Regular", color: C.textSec, textAlign: "center", lineHeight: 22 },
  successCard:  { width: "100%", backgroundColor: C.surface, borderRadius: 16, padding: 18, gap: 14, marginTop: 8 },
});
