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
  { id: "9mobile",name: "9Mobile", color: "#059669", bg: "#ECFEFF" },
];

const QUICK_AMOUNTS = ["₦50", "₦100", "₦200", "₦500", "₦1,000", "₦2,000"];

export default function AirtimeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 20 : insets.top;

  const [network, setNetwork] = useState(NETWORKS[0]);
  const [phone,   setPhone]   = useState("");
  const [amount,  setAmount]  = useState("");
  const [done,    setDone]    = useState(false);

  const canProceed = phone.length === 11 && !!amount;

  const handleBuy = () => {
    if (!canProceed) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setDone(true);
    setTimeout(() => { setDone(false); router.push("/(app)/success-payment" as any); }, 800);
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: C.bg }} behavior={Platform.OS === "ios" ? "padding" : undefined}>

      {/* Header */}
      <Animated.View entering={FadeInDown.duration(280).springify()} style={[s.header, { paddingTop: topPad + 10 }]}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
          <Feather name="arrow-left" size={22} color="#1E232C" />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Buy Airtime</Text>
        <View style={{ width: 44 }} />
      </Animated.View>
      <View style={s.divider} />

      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" contentContainerStyle={[s.scroll, { paddingBottom: insets.bottom + 40 }]}>

        <Animated.View entering={FadeInDown.duration(300).delay(30)}>
          <Text style={s.subtitle}>Select your network and enter phone number.</Text>
        </Animated.View>

        {/* Network selector */}
        <Animated.View entering={FadeInDown.duration(300).delay(60)}>
          <Text style={s.label}>select network</Text>
          <View style={s.networkRow}>
            {NETWORKS.map(n => (
              <Pressable
                key={n.id}
                style={[s.networkItem, network.id === n.id && { borderColor: n.color, borderWidth: 2 }]}
                onPress={() => { Haptics.selectionAsync(); setNetwork(n); }}
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

        {/* Amount */}
        <Animated.View entering={FadeInDown.duration(300).delay(120)}>
          <Text style={s.label}>amount</Text>
          <View style={s.inputField}>
            <Text style={{ fontSize: 14, fontFamily: "Manrope_700Bold", color: C.textMuted, marginRight: 4 }}>₦</Text>
            <TextInput
              style={[s.inputText, { flex: 1 }]}
              placeholder="0.00"
              placeholderTextColor="#646464"
              value={amount}
              onChangeText={t => setAmount(t.replace(/\D/g, ""))}
              keyboardType="numeric"
            />
          </View>
        </Animated.View>

        {/* Quick amounts */}
        <Animated.View entering={FadeInDown.duration(300).delay(150)}>
          <Text style={s.label}>quick amount</Text>
          <View style={s.quickRow}>
            {QUICK_AMOUNTS.map(a => (
              <TouchableOpacity
                key={a}
                style={[s.quickChip, amount === a.replace("₦","").replace(",","") && { backgroundColor: "#000000", borderColor: "#000000" }]}
                onPress={() => { Haptics.selectionAsync(); setAmount(a.replace("₦","").replace(",","")); }}
              >
                <Text style={[s.quickText, amount === a.replace("₦","").replace(",","") && { color: "#FFFFFF" }]}>{a}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* Summary */}
        {!!amount && (
          <Animated.View entering={FadeInUp.duration(260)} style={s.summaryBox}>
            <View style={s.summaryRow}>
              <Text style={s.summaryLabel}>Phone Number</Text>
              <Text style={s.summaryValue}>{phone || "—"}</Text>
            </View>
            <View style={s.summaryLine} />
            <View style={s.summaryRow}>
              <Text style={s.summaryLabel}>Network</Text>
              <Text style={s.summaryValue}>{network.name}</Text>
            </View>
            <View style={s.summaryLine} />
            <View style={s.summaryRow}>
              <Text style={s.summaryLabel}>Total:</Text>
              <Text style={[s.summaryValue, { fontFamily: "Manrope_700Bold", fontSize: 14 }]}>
                ₦{parseInt(amount || "0").toLocaleString("en-NG")}
              </Text>
            </View>
          </Animated.View>
        )}

        {done && (
          <Animated.View entering={FadeInDown.duration(280)} style={s.successBox}>
            <Feather name="check-circle" size={18} color={C.success} />
            <Text style={s.successText}>Airtime purchase successful!</Text>
          </Animated.View>
        )}

        <TouchableOpacity style={[s.buyBtn, !canProceed && { opacity: 0.45 }]} onPress={handleBuy} activeOpacity={0.85}>
          <Text style={s.buyBtnText}>Buy Airtime</Text>
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
  label:       { fontSize: 12, fontFamily: "Manrope_500Medium", color: C.textMuted, textTransform: "capitalize", letterSpacing: 0.24, marginBottom: 6 },

  networkRow: { flexDirection: "row", gap: 10 },
  networkItem: {
    flex: 1, alignItems: "center", gap: 6, paddingVertical: 12,
    borderRadius: 12, borderWidth: 1, borderColor: C.border,
    backgroundColor: "#F8F9FA", position: "relative",
  },
  networkIcon:  { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  networkName:  { fontSize: 10, fontFamily: "Manrope_600SemiBold", color: C.text },
  networkCheck: { position: "absolute", top: 6, right: 6, width: 14, height: 14, borderRadius: 7, alignItems: "center", justifyContent: "center" },

  inputField: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: C.inputBg, borderRadius: 10, paddingHorizontal: 14, height: 46,
    borderWidth: 1, borderColor: C.border,
  },
  inputPrefix: { fontSize: 13, fontFamily: "Manrope_600SemiBold", color: C.textMuted },
  inputSep:    { width: 1, height: 20, backgroundColor: C.border, marginHorizontal: 8 },
  inputText:   { flex: 1, fontSize: 13, fontFamily: "Manrope_500Medium", color: C.text },

  quickRow:  { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  quickChip: { paddingHorizontal: 14, paddingVertical: 9, borderRadius: 20, borderWidth: 1, borderColor: C.border, backgroundColor: "#F8F9FA" },
  quickText: { fontSize: 12, fontFamily: "Manrope_600SemiBold", color: C.textSec },

  summaryBox:   { backgroundColor: C.dark, borderRadius: 10, paddingHorizontal: 18, paddingVertical: 2 },
  summaryRow:   { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 13 },
  summaryLine:  { height: 1, backgroundColor: "rgba(255,255,255,0.1)" },
  summaryLabel: { fontSize: 10, fontFamily: "Manrope_400Regular", color: "rgba(255,255,255,0.7)" },
  summaryValue: { fontSize: 10, fontFamily: "Manrope_500Medium", color: "#FFFFFF" },

  successBox:  { flexDirection: "row", alignItems: "center", gap: 10, backgroundColor: "#F0FFF4", borderRadius: 10, padding: 14, borderWidth: 1, borderColor: "#BBF7D0" },
  successText: { fontSize: 13, fontFamily: "Manrope_500Medium", color: C.success },

  buyBtn:     { backgroundColor: C.black, height: 48, borderRadius: 10, alignItems: "center", justifyContent: "center", elevation: 4 },
  buyBtnText: { fontSize: 14, fontFamily: "Manrope_700Bold", color: "#FFFFFF", letterSpacing: -0.14 },
});
