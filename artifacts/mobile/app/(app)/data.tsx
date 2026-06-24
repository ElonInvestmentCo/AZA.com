import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SectionList,
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
  { id:"mtn",    label:"MTN",     color:"#FFCC00" },
  { id:"airtel", label:"Airtel",  color:"#FF0000" },
  { id:"glo",    label:"Glo",     color:"#008000" },
  { id:"9mob",   label:"9mobile", color:"#006633" },
];

type DataPlan = { id:string; size:string; validity:string; price:string };

const DATA_PLANS: { title:string; data:DataPlan[] }[] = [
  {
    title: "Daily Plans",
    data: [
      { id:"d1", size:"100MB", validity:"1 Day",  price:"₦100" },
      { id:"d2", size:"500MB", validity:"1 Day",  price:"₦200" },
      { id:"d3", size:"1GB",   validity:"1 Day",  price:"₦300" },
    ],
  },
  {
    title: "Weekly Plans",
    data: [
      { id:"w1", size:"1.5GB", validity:"7 Days",  price:"₦500"   },
      { id:"w2", size:"3GB",   validity:"7 Days",  price:"₦1,000" },
      { id:"w3", size:"7GB",   validity:"7 Days",  price:"₦2,000" },
    ],
  },
  {
    title: "Monthly Plans",
    data: [
      { id:"m1", size:"5GB",   validity:"30 Days", price:"₦2,000" },
      { id:"m2", size:"10GB",  validity:"30 Days", price:"₦3,500" },
      { id:"m3", size:"15GB",  validity:"30 Days", price:"₦5,000" },
      { id:"m4", size:"30GB",  validity:"30 Days", price:"₦8,000" },
      { id:"m5", size:"60GB",  validity:"30 Days", price:"₦15,000"},
    ],
  },
  {
    title: "SME Plans",
    data: [
      { id:"s1", size:"10GB", validity:"30 Days", price:"₦2,500" },
      { id:"s2", size:"25GB", validity:"30 Days", price:"₦5,000" },
      { id:"s3", size:"50GB", validity:"30 Days", price:"₦9,000" },
    ],
  },
];

type Step = "form" | "confirm" | "success";

export default function DataScreen() {
  const router = useRouter();
  const [step,    setStep]    = useState<Step>("form");
  const [network, setNetwork] = useState("");
  const [phone,   setPhone]   = useState("");
  const [plan,    setPlan]    = useState<DataPlan | null>(null);
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
        <ScreenHeader title="Data Purchased" showBack={false} />
        <View style={s.successWrap}>
          <Animated.View entering={FadeInDown.duration(380).springify()} style={s.successCircle}>
            <Feather name="wifi" size={38} color="#fff" />
          </Animated.View>
          <Animated.Text entering={FadeInUp.duration(320).delay(80)} style={s.successTitle}>
            Data Activated!
          </Animated.Text>
          <Animated.Text entering={FadeInUp.duration(320).delay(120)} style={s.successSub}>
            {plan?.size} {selectedNet?.label} data sent to {phone}
          </Animated.Text>
          <Animated.View entering={FadeInUp.duration(300).delay(160)} style={s.receiptCard}>
            {[
              { label:"Network",   value: selectedNet?.label ?? "" },
              { label:"Data Plan", value: `${plan?.size} / ${plan?.validity}` },
              { label:"Phone",     value: phone },
              { label:"Amount",    value: plan?.price ?? "" },
              { label:"Reference", value: `DT-${Math.floor(Math.random()*90000)+10000}` },
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
      <ScreenHeader title="Buy Data" />

      {step === "form" && (
        <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <Animated.View entering={FadeInDown.duration(300)} style={{ gap: 20 }}>

            {/* Network */}
            <View style={s.field}>
              <Text style={s.fieldLabel}>Select Network</Text>
              <View style={s.networkRow}>
                {NETWORKS.map(net => (
                  <TouchableOpacity
                    key={net.id}
                    style={[s.netBtn, network === net.id && { borderColor: net.color, borderWidth: 2, backgroundColor: net.color + "10" }]}
                    onPress={() => { Haptics.selectionAsync(); setNetwork(net.id); setPlan(null); }}
                  >
                    <Text style={[s.netLabel, { color: network === net.id ? net.color : C.textSec }]}>{net.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Phone */}
            <View style={s.field}>
              <Text style={s.fieldLabel}>Phone Number</Text>
              <TextInput
                style={s.input}
                placeholder="Enter phone number"
                placeholderTextColor={C.textMut}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                maxLength={11}
              />
            </View>

            {/* Plans */}
            {network && (
              <View style={{ gap: 8 }}>
                <Text style={s.fieldLabel}>Select Plan</Text>
                {DATA_PLANS.map(section => (
                  <View key={section.title}>
                    <Text style={s.sectionHead}>{section.title}</Text>
                    {section.data.map(p => (
                      <TouchableOpacity
                        key={p.id}
                        style={[s.planRow, plan?.id === p.id && s.planRowActive]}
                        onPress={() => { Haptics.selectionAsync(); setPlan(p); }}
                      >
                        <View>
                          <Text style={s.planSize}>{p.size}</Text>
                          <Text style={s.planValidity}>{p.validity}</Text>
                        </View>
                        <View style={s.planRight}>
                          <Text style={s.planPrice}>{p.price}</Text>
                          {plan?.id === p.id && <Feather name="check-circle" size={18} color={C.accent} />}
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                ))}
              </View>
            )}

            <TouchableOpacity
              style={[s.btn, (!network || !phone || !plan) && s.btnDisabled]}
              disabled={!network || !phone || !plan}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                setStep("confirm");
              }}
            >
              <Text style={s.btnText}>Continue</Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      )}

      {step === "confirm" && (
        <ScrollView contentContainerStyle={s.scroll}>
          <Animated.View entering={FadeInDown.duration(300)} style={{ gap: 20 }}>
            <Text style={s.subheading}>Confirm your purchase</Text>
            <View style={s.receiptCard}>
              {[
                { label:"Network",  value: selectedNet?.label ?? "" },
                { label:"Data",     value: `${plan?.size} / ${plan?.validity}` },
                { label:"Phone",    value: phone },
                { label:"Amount",   value: plan?.price ?? "" },
                { label:"Fee",      value: "Free" },
              ].map(r => (
                <View key={r.label} style={s.receiptRow}>
                  <Text style={s.receiptLabel}>{r.label}</Text>
                  <Text style={s.receiptValue}>{r.value}</Text>
                </View>
              ))}
            </View>
            <TouchableOpacity style={[s.btn, loading && s.btnDisabled]} disabled={loading} onPress={handlePay}>
              <Text style={s.btnText}>{loading ? "Processing…" : "Buy Data"}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setStep("form")} style={s.secondaryBtn}>
              <Text style={s.secondaryText}>Edit</Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      )}
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  root:    { flex: 1, backgroundColor: C.bg },
  scroll:  { padding: 20, flexGrow: 1 },
  subheading: { fontSize: 15, fontFamily: "Manrope_600SemiBold", color: C.textSec },

  field:      { gap: 8 },
  fieldLabel: { fontSize: 13, fontFamily: "Manrope_500Medium", color: C.textSec },

  networkRow: { flexDirection: "row", gap: 8 },
  netBtn: {
    flex: 1, paddingVertical: 12, alignItems: "center", borderRadius: 12,
    borderWidth: 1, borderColor: C.border, backgroundColor: C.surface,
  },
  netLabel: { fontSize: 12, fontFamily: "Manrope_700Bold" },

  input: {
    backgroundColor: C.inputBg, borderWidth: 1, borderColor: C.border,
    borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14,
    fontSize: 15, fontFamily: "Manrope_500Medium", color: C.text,
  },

  sectionHead: { fontSize: 12, fontFamily: "Manrope_700Bold", color: C.textMut, marginTop: 12, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 },

  planRow: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    backgroundColor: C.surface, borderRadius: 12, padding: 14, borderWidth: 1, borderColor: C.border, marginBottom: 6,
  },
  planRowActive: { borderColor: C.accent, backgroundColor: C.accent + "08" },
  planSize:     { fontSize: 14, fontFamily: "Manrope_700Bold", color: C.text },
  planValidity: { fontSize: 11, fontFamily: "Manrope_400Regular", color: C.textMut, marginTop: 2 },
  planRight:    { flexDirection: "row", alignItems: "center", gap: 8 },
  planPrice:    { fontSize: 14, fontFamily: "Manrope_700Bold", color: C.text },

  btn:         { height: 56, backgroundColor: C.btn, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  btnDisabled: { opacity: 0.5 },
  btnText:     { fontSize: 16, fontFamily: "Manrope_700Bold", color: "#fff" },

  secondaryBtn:  { height: 48, alignItems: "center", justifyContent: "center" },
  secondaryText: { fontSize: 14, fontFamily: "Manrope_600SemiBold", color: C.textSec },

  receiptCard:  { backgroundColor: C.surface, borderRadius: 16, padding: 18, borderWidth: 1, borderColor: C.border, gap: 14 },
  receiptRow:   { flexDirection: "row", justifyContent: "space-between" },
  receiptLabel: { fontSize: 13, fontFamily: "Manrope_400Regular", color: C.textSec },
  receiptValue: { fontSize: 13, fontFamily: "Manrope_600SemiBold", color: C.text },

  successWrap:   { flex: 1, alignItems: "center", justifyContent: "center", padding: 24, gap: 12 },
  successCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: "#3B82F6", alignItems: "center", justifyContent: "center", marginBottom: 8 },
  successTitle:  { fontSize: 22, fontFamily: "Manrope_700Bold", color: C.text },
  successSub:    { fontSize: 14, fontFamily: "Manrope_400Regular", color: C.textSec, textAlign: "center" },
});
