import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
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

const NETWORKS = [
  { id: "mtn",    name: "MTN",     color: "#FFC300", bg: "#FFFBEB" },
  { id: "airtel", name: "Airtel",  color: "#E11D48", bg: "#FFF1F2" },
  { id: "glo",    name: "Glo",     color: "#059669", bg: "#F0FFF4" },
  { id: "9mobile",name: "9Mobile", color: "#0891B2", bg: "#ECFEFF" },
];

const DATA_PLANS: Record<string, { id: string; size: string; duration: string; price: string }[]> = {
  mtn: [
    { id: "1", size: "1GB",   duration: "1 Day",    price: "₦300"   },
    { id: "2", size: "2GB",   duration: "2 Days",   price: "₦500"   },
    { id: "3", size: "5GB",   duration: "7 Days",   price: "₦1,500" },
    { id: "4", size: "10GB",  duration: "30 Days",  price: "₦2,500" },
    { id: "5", size: "20GB",  duration: "30 Days",  price: "₦4,000" },
    { id: "6", size: "50GB",  duration: "30 Days",  price: "₦8,000" },
  ],
  airtel: [
    { id: "1", size: "1GB",   duration: "1 Day",    price: "₦350"   },
    { id: "2", size: "3GB",   duration: "7 Days",   price: "₦1,000" },
    { id: "3", size: "6GB",   duration: "30 Days",  price: "₦1,500" },
    { id: "4", size: "15GB",  duration: "30 Days",  price: "₦3,000" },
  ],
  glo: [
    { id: "1", size: "1.5GB", duration: "1 Day",    price: "₦300"   },
    { id: "2", size: "3.5GB", duration: "7 Days",   price: "₦1,000" },
    { id: "3", size: "7.5GB", duration: "30 Days",  price: "₦2,000" },
  ],
  "9mobile": [
    { id: "1", size: "1GB",   duration: "7 Days",   price: "₦500"   },
    { id: "2", size: "5GB",   duration: "30 Days",  price: "₦2,000" },
    { id: "3", size: "11GB",  duration: "30 Days",  price: "₦3,500" },
  ],
};

export default function DataScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 20 : insets.top;

  const [network,     setNetwork]     = useState(NETWORKS[0]);
  const [phone,       setPhone]       = useState("");
  const [selectedPlan,setSelectedPlan]= useState("");

  const plans = DATA_PLANS[network.id] ?? [];
  const plan  = plans.find(p => p.id === selectedPlan);
  const canProceed = phone.length === 11 && !!selectedPlan;

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: C.bg }} behavior={Platform.OS === "ios" ? "padding" : undefined}>

      <Animated.View entering={FadeInDown.duration(280).springify()} style={[s.header, { paddingTop: topPad + 10 }]}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
          <Feather name="arrow-left" size={22} color="#1E232C" />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Buy Data</Text>
        <View style={{ width: 44 }} />
      </Animated.View>
      <View style={s.divider} />

      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" contentContainerStyle={[s.scroll, { paddingBottom: insets.bottom + 40 }]}>

        <Animated.View entering={FadeInDown.duration(300).delay(30)}>
          <Text style={s.subtitle}>Select network and data plan.</Text>
        </Animated.View>

        {/* Network */}
        <Animated.View entering={FadeInDown.duration(300).delay(60)}>
          <Text style={s.label}>select network</Text>
          <View style={s.networkRow}>
            {NETWORKS.map(n => (
              <Pressable
                key={n.id}
                style={[s.networkItem, network.id === n.id && { borderColor: n.color, borderWidth: 2 }]}
                onPress={() => { Haptics.selectionAsync(); setNetwork(n); setSelectedPlan(""); }}
              >
                <View style={[s.networkIcon, { backgroundColor: n.bg }]}>
                  <Text style={{ fontSize: 11, fontFamily: "Manrope_700Bold", color: n.color }}>{n.name.slice(0,3).toUpperCase()}</Text>
                </View>
                <Text style={s.networkName}>{n.name}</Text>
                {network.id === n.id && (
                  <View style={[s.networkCheck, { backgroundColor: n.color }]}>
                    <Feather name="check" size={8} color="#fff" />
                  </View>
                )}
              </Pressable>
            ))}
          </View>
        </Animated.View>

        {/* Phone */}
        <Animated.View entering={FadeInDown.duration(300).delay(90)}>
          <Text style={s.label}>phone number</Text>
          <View style={s.inputField}>
            <Text style={s.inputPrefix}>+234</Text>
            <View style={s.inputSep} />
            <TextInput
              style={s.inputText}
              placeholder="   08012345678"
              placeholderTextColor="#646464"
              value={phone}
              onChangeText={t => setPhone(t.replace(/\D/g, "").slice(0, 11))}
              keyboardType="phone-pad"
              maxLength={11}
            />
            {phone.length === 11 && <Feather name="check-circle" size={18} color={C.success} />}
          </View>
        </Animated.View>

        {/* Plans */}
        <Animated.View entering={FadeInDown.duration(300).delay(120)}>
          <Text style={s.label}>select data plan</Text>
          <View style={s.plansGrid}>
            {plans.map(p => (
              <Pressable
                key={p.id}
                style={[s.planCard, selectedPlan === p.id && { borderColor: "#000", borderWidth: 2, backgroundColor: "#000" }]}
                onPress={() => { Haptics.selectionAsync(); setSelectedPlan(p.id); }}
              >
                <Text style={[s.planSize, selectedPlan === p.id && { color: "#fff" }]}>{p.size}</Text>
                <Text style={[s.planDur, selectedPlan === p.id && { color: "rgba(255,255,255,0.7)" }]}>{p.duration}</Text>
                <Text style={[s.planPrice, selectedPlan === p.id && { color: "#fff" }]}>{p.price}</Text>
              </Pressable>
            ))}
          </View>
        </Animated.View>

        {/* Summary */}
        {plan && (
          <Animated.View entering={FadeInUp.duration(260)} style={s.summaryBox}>
            <View style={s.summaryRow}>
              <Text style={s.summaryLabel}>Plan</Text>
              <Text style={s.summaryValue}>{plan.size} — {plan.duration}</Text>
            </View>
            <View style={s.summaryLine} />
            <View style={s.summaryRow}>
              <Text style={s.summaryLabel}>Total:</Text>
              <Text style={[s.summaryValue, { fontFamily: "Manrope_700Bold", fontSize: 13 }]}>{plan.price}</Text>
            </View>
          </Animated.View>
        )}

        <TouchableOpacity
          style={[s.buyBtn, !canProceed && { opacity: 0.45 }]}
          onPress={() => {
            if (!canProceed) return;
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            router.push({ pathname: "/(app)/submitted" as any, params: { title: "Data Purchase Successful", subtitle: "Your data bundle has been\nactivated successfully" } });
          }}
          activeOpacity={0.85}
        >
          <Text style={s.buyBtnText}>Buy Data</Text>
        </TouchableOpacity>

      </ScrollView>
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
  label:       { fontSize: 12, fontFamily: "Manrope_500Medium", color: C.textMuted, textTransform: "capitalize", letterSpacing: 0.24, marginBottom: 8 },

  networkRow: { flexDirection: "row", gap: 10 },
  networkItem: { flex: 1, alignItems: "center", gap: 6, paddingVertical: 12, borderRadius: 12, borderWidth: 1, borderColor: C.border, backgroundColor: "#F8F9FA", position: "relative" },
  networkIcon: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  networkName: { fontSize: 10, fontFamily: "Manrope_600SemiBold", color: C.text },
  networkCheck:{ position: "absolute", top: 6, right: 6, width: 14, height: 14, borderRadius: 7, alignItems: "center", justifyContent: "center" },

  inputField: { flexDirection: "row", alignItems: "center", backgroundColor: C.inputBg, borderRadius: 10, paddingHorizontal: 14, height: 46, borderWidth: 1, borderColor: C.border },
  inputPrefix: { fontSize: 13, fontFamily: "Manrope_600SemiBold", color: C.textMuted },
  inputSep:    { width: 1, height: 20, backgroundColor: C.border, marginHorizontal: 8 },
  inputText:   { flex: 1, fontSize: 13, fontFamily: "Manrope_500Medium", color: C.text },

  plansGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  planCard:  { width: "47%", borderRadius: 12, borderWidth: 1, borderColor: C.border, backgroundColor: "#F8F9FA", padding: 14, gap: 4, alignItems: "center" },
  planSize:  { fontSize: 18, fontFamily: "Manrope_700Bold", color: C.navy },
  planDur:   { fontSize: 11, fontFamily: "Manrope_400Regular", color: C.textMuted },
  planPrice: { fontSize: 14, fontFamily: "Manrope_700Bold", color: C.text, marginTop: 4 },

  summaryBox:   { backgroundColor: C.dark, borderRadius: 10, paddingHorizontal: 18, paddingVertical: 2 },
  summaryRow:   { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 13 },
  summaryLine:  { height: 1, backgroundColor: "rgba(255,255,255,0.1)" },
  summaryLabel: { fontSize: 10, fontFamily: "Manrope_400Regular", color: "rgba(255,255,255,0.7)" },
  summaryValue: { fontSize: 10, fontFamily: "Manrope_500Medium", color: "#FFFFFF" },

  buyBtn:     { backgroundColor: C.black, height: 48, borderRadius: 10, alignItems: "center", justifyContent: "center", elevation: 4 },
  buyBtnText: { fontSize: 14, fontFamily: "Manrope_700Bold", color: "#FFFFFF", letterSpacing: -0.14 },
});
