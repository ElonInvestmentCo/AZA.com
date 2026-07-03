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
import { useAuth } from "@/context/AuthContext";

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

const BANKS = [
  "Access Bank", "First Bank", "GTBank", "UBA", "Zenith Bank",
  "Fidelity Bank", "Union Bank", "Sterling Bank", "FCMB", "Polaris Bank",
];

function FieldLabel({ text }: { text: string }) {
  return <Text style={f.label}>{text}</Text>;
}

function SelectField({
  label, value, placeholder, onPress,
}: { label: string; value: string; placeholder: string; onPress: () => void }) {
  return (
    <View style={f.wrap}>
      <FieldLabel text={label} />
      <TouchableOpacity style={f.input} onPress={onPress} activeOpacity={0.8}>
        <Text style={[f.val, !value && f.ph]}>{value || placeholder}</Text>
        <Feather name="chevron-down" size={16} color={C.textMuted} />
      </TouchableOpacity>
    </View>
  );
}

const f = StyleSheet.create({
  wrap:  { gap: 4 },
  label: { fontSize: 12, fontFamily: "Manrope_500Medium", color: C.textMuted, textTransform: "capitalize", letterSpacing: 0.24 },
  input: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    backgroundColor: C.inputBg, borderWidth: 1, borderColor: C.border,
    borderRadius: 10, paddingHorizontal: 14, height: 46,
  },
  val: { fontSize: 13, fontFamily: "Manrope_500Medium", color: C.text, flex: 1 },
  ph:  { color: "#646464", fontSize: 10 },
});

function PickerModal({
  visible, title, options, onSelect, onClose,
}: { visible: boolean; title: string; options: string[]; onSelect: (v: string) => void; onClose: () => void }) {
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
  handle: { width: 40, height: 4, borderRadius: 2, backgroundColor: C.border, alignSelf: "center", marginBottom: 16 },
  title:   { fontSize: 16, fontFamily: "Manrope_700Bold", color: C.text, marginBottom: 12 },
  option:  { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: C.border },
  optText: { fontSize: 15, fontFamily: "Manrope_500Medium", color: C.text },
});

export default function WithdrawScreen() {
  const router  = useRouter();
  const insets  = useSafeAreaInsets();
  const { user } = useAuth();
  const topPad = Platform.OS === "web" ? 20 : insets.top;

  const [bank,    setBank]    = useState("");
  const [acctNum, setAcctNum] = useState("");
  const [amount,  setAmount]  = useState("");
  const [picker,  setPicker]  = useState(false);
  const [done,    setDone]    = useState(false);

  const balance   = user?.balance ?? 200590;
  const formatted = "₦" + balance.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const canProceed = !!bank && acctNum.length === 10 && !!amount;

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: C.bg }} behavior={Platform.OS === "ios" ? "padding" : undefined}>

      {/* Header */}
      <Animated.View entering={FadeInDown.duration(280).springify()} style={[s.header, { paddingTop: topPad + 10 }]}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
          <Feather name="arrow-left" size={22} color="#1E232C" />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Withdraw</Text>
        <View style={{ width: 44 }} />
      </Animated.View>
      <View style={s.divider} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[s.scroll, { paddingBottom: insets.bottom + 40 }]}
      >

        {/* Balance card */}
        <Animated.View entering={FadeInDown.duration(320).springify().delay(40)} style={s.balCard}>
          <View style={s.balTop}>
            <View style={s.balDot} />
            <Text style={s.balTag}>Available Balance</Text>
          </View>
          <Text style={s.balAmount}>{formatted}</Text>
          <Text style={s.balSub}>Enter your bank details to withdraw</Text>
        </Animated.View>

        {/* Bank */}
        <Animated.View entering={FadeInDown.duration(300).springify().delay(70)}>
          <SelectField label="select bank" value={bank} placeholder="   Choose your bank" onPress={() => setPicker(true)} />
        </Animated.View>

        {/* Account number */}
        <Animated.View entering={FadeInDown.duration(300).springify().delay(100)}>
          <View style={f.wrap}>
            <Text style={f.label}>account number</Text>
            <View style={f.input}>
              <TextInput
                style={[f.val, { flex: 1 }]}
                placeholder="   Enter 10-digit account number"
                placeholderTextColor="#646464"
                value={acctNum}
                onChangeText={t => setAcctNum(t.replace(/\D/g, "").slice(0, 10))}
                keyboardType="numeric"
                maxLength={10}
              />
              {acctNum.length === 10 && <Feather name="check-circle" size={18} color={C.success} />}
            </View>
          </View>
        </Animated.View>

        {/* Amount */}
        <Animated.View entering={FadeInDown.duration(300).springify().delay(130)}>
          <View style={f.wrap}>
            <Text style={f.label}>amount</Text>
            <View style={f.input}>
              <Text style={{ fontSize: 14, fontFamily: "Manrope_600SemiBold", color: C.textMuted, marginRight: 4 }}>₦</Text>
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
          <Animated.View entering={FadeInUp.duration(260).springify()} style={s.summaryBox}>
            <View style={s.summaryRow}>
              <Text style={s.summaryLabel}>Amount</Text>
              <Text style={s.summaryValue}>₦{parseInt(amount).toLocaleString("en-NG")}</Text>
            </View>
            <View style={s.summaryLine} />
            <View style={s.summaryRow}>
              <Text style={s.summaryLabel}>Fee</Text>
              <Text style={s.summaryValue}>₦0.00</Text>
            </View>
            <View style={s.summaryLine} />
            <View style={s.summaryRow}>
              <Text style={s.summaryLabel}>Total</Text>
              <Text style={[s.summaryValue, { fontFamily: "Manrope_700Bold", fontSize: 12 }]}>
                ₦{parseInt(amount).toLocaleString("en-NG")}
              </Text>
            </View>
          </Animated.View>
        )}

        {done && (
          <Animated.View entering={FadeInDown.duration(280)} style={s.successBox}>
            <Feather name="check-circle" size={18} color={C.success} />
            <Text style={s.successText}>Withdrawal initiated successfully!</Text>
          </Animated.View>
        )}

        {/* Withdraw button */}
        <TouchableOpacity
          style={[s.withdrawBtn, !canProceed && { opacity: 0.45 }]}
          onPress={() => {
            if (!canProceed) return;
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            setDone(true);
            setTimeout(() => { setDone(false); router.push({ pathname: "/(app)/submitted" as any, params: { title: "Withdrawal Successful", subtitle: "Your withdrawal has been\nprocessed successfully" } }); }, 1000);
          }}
          activeOpacity={0.85}
        >
          <Text style={s.withdrawBtnText}>Withdraw</Text>
        </TouchableOpacity>

      </ScrollView>

      <PickerModal visible={picker} title="Select Bank" options={BANKS} onSelect={setBank} onClose={() => setPicker(false)} />
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  header:      { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingBottom: 14, backgroundColor: C.bg },
  backBtn:     { width: 44, height: 44, alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: 13, fontFamily: "Manrope_700Bold", color: C.text, textTransform: "capitalize" },
  divider:     { height: 1, backgroundColor: "#D1D1D1" },
  scroll:      { paddingHorizontal: 20, paddingTop: 20, gap: 18 },

  balCard:   { backgroundColor: "#F0F7FF", borderRadius: 16, padding: 20, gap: 8, borderWidth: 1, borderColor: "#C7DFFF" },
  balTop:    { flexDirection: "row", alignItems: "center", gap: 7 },
  balDot:    { width: 8, height: 8, borderRadius: 4, backgroundColor: "#EF4444" },
  balTag:    { fontSize: 12, fontFamily: "Manrope_500Medium", color: C.textMuted },
  balAmount: { fontSize: 30, fontFamily: "Manrope_700Bold", color: C.navy, letterSpacing: -0.5 },
  balSub:    { fontSize: 12, fontFamily: "Manrope_400Regular", color: C.textSec },

  summaryBox:   { backgroundColor: C.dark, borderRadius: 10, paddingHorizontal: 18, paddingVertical: 2 },
  summaryRow:   { flexDirection: "row", justifyContent: "space-between", paddingVertical: 12 },
  summaryLine:  { height: 1, backgroundColor: "rgba(255,255,255,0.1)" },
  summaryLabel: { fontSize: 10, fontFamily: "Manrope_400Regular", color: "rgba(255,255,255,0.7)" },
  summaryValue: { fontSize: 10, fontFamily: "Manrope_500Medium", color: "#FFFFFF" },

  successBox:  { flexDirection: "row", alignItems: "center", gap: 10, backgroundColor: "#F0FFF4", borderRadius: 10, padding: 14, borderWidth: 1, borderColor: "#BBF7D0" },
  successText: { fontSize: 13, fontFamily: "Manrope_500Medium", color: C.success },

  withdrawBtn:     { backgroundColor: C.black, height: 48, borderRadius: 10, alignItems: "center", justifyContent: "center", elevation: 4 },
  withdrawBtnText: { fontSize: 14, fontFamily: "Manrope_700Bold", color: "#FFFFFF", letterSpacing: -0.14 },
});
