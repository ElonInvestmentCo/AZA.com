import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
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
import { ScreenHeader } from "@/components/ScreenHeader";

const C = {
  bg:      "#FFFFFF",
  text:    "#0B0A0A",
  textSec: "#595F67",
  textMut: "#AAAFB5",
  border:  "#EDF1F3",
  surface: "#F8F9FA",
  inputBg: "#F7F8F9",
  btn:     "#000000",
  accent:  "#35C2C1",
};

const NETWORKS = [
  { id:"mtn",    label:"MTN",    color:"#FFCC00", bg:"#FFCC0020", icon:"📶" },
  { id:"airtel", label:"Airtel", color:"#FF0000", bg:"#FF000020", icon:"📡" },
  { id:"glo",    label:"Glo",    color:"#008000", bg:"#00800020", icon:"📱" },
  { id:"9mob",   label:"9mobile",color:"#006633", bg:"#00663320", icon:"📲" },
];

const QUICK_AMOUNTS = ["₦50","₦100","₦200","₦500","₦1,000","₦2,000","₦5,000"];

type Step = "form" | "confirm" | "success";

export default function AirtimeScreen() {
  const router = useRouter();
  const [step,    setStep]    = useState<Step>("form");
  const [network, setNetwork] = useState("");
  const [phone,   setPhone]   = useState("");
  const [amount,  setAmount]  = useState("");
  const [self,    setSelf]    = useState(true);
  const [loading, setLoading] = useState(false);

  const selectedNet = NETWORKS.find(n => n.id === network);

  const handlePay = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);
    setStep("success");
  };

  if (step === "success") {
    return (
      <View style={s.root}>
        <ScreenHeader title="Airtime Purchased" showBack={false} />
        <View style={s.successWrap}>
          <Animated.View entering={FadeInDown.duration(380).springify()} style={s.successCircle}>
            <Feather name="check" size={38} color="#fff" />
          </Animated.View>
          <Animated.Text entering={FadeInUp.duration(320).delay(80)} style={s.successTitle}>
            Airtime Sent!
          </Animated.Text>
          <Animated.Text entering={FadeInUp.duration(320).delay(120)} style={s.successSub}>
            {amount} {selectedNet?.label} airtime sent to {phone}
          </Animated.Text>
          <Animated.View entering={FadeInUp.duration(300).delay(160)} style={s.receiptCard}>
            {[
              { label:"Network",   value: selectedNet?.label ?? "" },
              { label:"Phone",     value: phone },
              { label:"Amount",    value: amount },
              { label:"Reference", value: `AT-${Math.floor(Math.random()*90000)+10000}` },
              { label:"Status",    value: "Successful" },
            ].map(r => (
              <View key={r.label} style={s.receiptRow}>
                <Text style={s.receiptLabel}>{r.label}</Text>
                <Text style={s.receiptValue}>{r.value}</Text>
              </View>
            ))}
          </Animated.View>
          <TouchableOpacity style={s.btn} onPress={() => router.back()}>
            <Text style={s.btnText}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={s.root} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScreenHeader title="Buy Airtime" />
      <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

        {step === "form" && (
          <Animated.View entering={FadeInDown.duration(300)} style={{ gap: 20 }}>

            {/* Self / Others toggle */}
            <View style={s.toggleRow}>
              {["Self Recharge","Third Party"].map((opt, i) => {
                const active = i === 0 ? self : !self;
                return (
                  <TouchableOpacity
                    key={opt}
                    style={[s.toggleBtn, active && s.toggleBtnActive]}
                    onPress={() => { Haptics.selectionAsync(); setSelf(i === 0); }}
                  >
                    <Text style={[s.toggleText, active && s.toggleTextActive]}>{opt}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Network selection */}
            <View style={s.field}>
              <Text style={s.fieldLabel}>Select Network</Text>
              <View style={s.networkRow}>
                {NETWORKS.map(net => (
                  <TouchableOpacity
                    key={net.id}
                    style={[s.netCard, network === net.id && { borderColor: net.color, borderWidth: 2 }]}
                    onPress={() => { Haptics.selectionAsync(); setNetwork(net.id); }}
                  >
                    <Text style={s.netIcon}>{net.icon}</Text>
                    <Text style={[s.netLabel, { color: net.color }]}>{net.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Phone number */}
            <View style={s.field}>
              <Text style={s.fieldLabel}>Phone Number</Text>
              <TextInput
                style={s.input}
                placeholder={self ? "Your phone number" : "Recipient number"}
                placeholderTextColor={C.textMut}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                maxLength={11}
              />
            </View>

            {/* Amount */}
            <View style={s.field}>
              <Text style={s.fieldLabel}>Amount</Text>
              <TextInput
                style={s.input}
                placeholder="₦0"
                placeholderTextColor={C.textMut}
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
              />
            </View>

            {/* Quick amounts */}
            <View style={s.quickRow}>
              {QUICK_AMOUNTS.map(qa => (
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
              style={[s.btn, (!network || !phone || !amount) && s.btnDisabled]}
              disabled={!network || !phone || !amount}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                setStep("confirm");
              }}
            >
              <Text style={s.btnText}>Continue</Text>
            </TouchableOpacity>
          </Animated.View>
        )}

        {step === "confirm" && (
          <Animated.View entering={FadeInDown.duration(300)} style={{ gap: 20 }}>
            <Text style={s.subheading}>Confirm your purchase</Text>
            <View style={s.receiptCard}>
              {[
                { label:"Network",  value: selectedNet?.label ?? "" },
                { label:"Phone",    value: phone },
                { label:"Amount",   value: amount },
                { label:"Fee",      value: "Free" },
                { label:"Total",    value: amount },
              ].map(r => (
                <View key={r.label} style={s.receiptRow}>
                  <Text style={s.receiptLabel}>{r.label}</Text>
                  <Text style={[s.receiptValue, r.label === "Total" && { fontFamily: "Manrope_700Bold" }]}>
                    {r.value}
                  </Text>
                </View>
              ))}
            </View>
            <TouchableOpacity style={[s.btn, loading && s.btnDisabled]} disabled={loading} onPress={handlePay}>
              <Text style={s.btnText}>{loading ? "Processing…" : "Buy Airtime"}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setStep("form")} style={s.secondaryBtn}>
              <Text style={s.secondaryText}>Edit Details</Text>
            </TouchableOpacity>
          </Animated.View>
        )}

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  root:   { flex: 1, backgroundColor: C.bg },
  scroll: { padding: 20, gap: 4, flexGrow: 1 },

  subheading: { fontSize: 15, fontFamily: "Manrope_600SemiBold", color: C.textSec },

  toggleRow: { flexDirection: "row", backgroundColor: C.surface, borderRadius: 12, padding: 4 },
  toggleBtn: { flex: 1, paddingVertical: 10, alignItems: "center", borderRadius: 10 },
  toggleBtnActive: { backgroundColor: C.btn },
  toggleText: { fontSize: 13, fontFamily: "Manrope_600SemiBold", color: C.textSec },
  toggleTextActive: { color: "#fff" },

  field:      { gap: 8 },
  fieldLabel: { fontSize: 13, fontFamily: "Manrope_500Medium", color: C.textSec },

  networkRow: { flexDirection: "row", gap: 10 },
  netCard: {
    flex: 1, alignItems: "center", paddingVertical: 14, borderRadius: 12,
    borderWidth: 1, borderColor: C.border, backgroundColor: C.surface, gap: 4,
  },
  netIcon:  { fontSize: 22 },
  netLabel: { fontSize: 11, fontFamily: "Manrope_600SemiBold" },

  input: {
    backgroundColor: C.inputBg, borderWidth: 1, borderColor: C.border,
    borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14,
    fontSize: 15, fontFamily: "Manrope_500Medium", color: C.text,
  },

  quickRow:        { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  quickChip:       { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: C.border, backgroundColor: C.surface },
  quickChipActive: { backgroundColor: C.btn, borderColor: C.btn },
  quickText:       { fontSize: 12, fontFamily: "Manrope_500Medium", color: C.textSec },
  quickTextActive: { color: "#fff" },

  btn:         { height: 56, backgroundColor: C.btn, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  btnDisabled: { opacity: 0.5 },
  btnText:     { fontSize: 16, fontFamily: "Manrope_700Bold", color: "#fff" },

  secondaryBtn:  { height: 48, alignItems: "center", justifyContent: "center" },
  secondaryText: { fontSize: 14, fontFamily: "Manrope_600SemiBold", color: C.textSec },

  receiptCard: { backgroundColor: C.surface, borderRadius: 16, padding: 18, borderWidth: 1, borderColor: C.border, gap: 14 },
  receiptRow:  { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  receiptLabel:{ fontSize: 13, fontFamily: "Manrope_400Regular", color: C.textSec },
  receiptValue:{ fontSize: 13, fontFamily: "Manrope_600SemiBold", color: C.text },

  successWrap:   { flex: 1, alignItems: "center", justifyContent: "center", padding: 24, gap: 12 },
  successCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: "#00B03C", alignItems: "center", justifyContent: "center", marginBottom: 8 },
  successTitle:  { fontSize: 22, fontFamily: "Manrope_700Bold", color: C.text },
  successSub:    { fontSize: 14, fontFamily: "Manrope_400Regular", color: C.textSec, textAlign: "center" },
});
