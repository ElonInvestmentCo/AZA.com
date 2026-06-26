import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { AnimatedSheet } from "@/components/AnimatedSheet";
import { useRouter } from "expo-router";
import { scheduleWalletFunded } from "@/services/notifications";
import React, { useRef, useState } from "react";
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
import { rf } from "@/utils/responsive";

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

const AMOUNTS = ["₦5,000", "₦10,000", "₦20,000", "₦50,000", "₦100,000"];

/* ── Currency formatting helpers ──────────────────────────────────────────── */
function formatWithCommas(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (!digits) return "";
  return parseInt(digits, 10).toLocaleString("en-NG");
}

function stripCommas(formatted: string): string {
  return formatted.replace(/,/g, "");
}

function FieldLabel({ text }: { text: string }) {
  return <Text style={f.label}>{text}</Text>;
}

function SelectField({
  label, value, placeholder, onPress,
}: {
  label: string; value: string; placeholder: string; onPress: () => void;
}) {
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
  input: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    backgroundColor: C.inputBg, borderWidth: 1, borderColor: C.border,
    borderRadius: 10, paddingHorizontal: 14, height: 48,
  },
  val: { fontSize: 13, fontFamily: "Manrope_500Medium", color: C.text, flex: 1 },
  ph:  { color: "#646464", fontSize: 10 },
});

function PickerModal({
  visible, title, options, onSelect, onClose,
}: {
  visible: boolean; title: string; options: string[];
  onSelect: (v: string) => void; onClose: () => void;
}) {
  return (
    <AnimatedSheet visible={visible} onClose={onClose} maxHeight="60%">
      <View style={pm.handle} />
      <Text style={pm.title}>{title}</Text>
      <ScrollView showsVerticalScrollIndicator={false}>
        {options.map(o => (
          <TouchableOpacity
            key={o}
            style={pm.option}
            onPress={() => { Haptics.selectionAsync(); onSelect(o); onClose(); }}
          >
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

export default function DashboardScreen() {
  const router  = useRouter();
  const insets  = useSafeAreaInsets();
  const { user } = useAuth();
  const topPad  = Platform.OS === "web" ? 20 : insets.top;

  const amountRef = useRef<TextInput>(null);

  const [bank,       setBank]       = useState("");
  const [acctNum,    setAcctNum]    = useState("");
  const [amountRaw,  setAmountRaw]  = useState(""); // raw digits only
  const [amountFmt,  setAmountFmt]  = useState(""); // formatted with commas
  const [selAmt,     setSelAmt]     = useState("");
  const [picker,     setPicker]     = useState(false);
  const [success,    setSuccess]    = useState(false);

  const firstName = (user?.name ?? "User").split(" ")[0];
  const balance   = user?.balance ?? 200590;
  const formatted = "₦" + balance.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const canProceed = !!bank && acctNum.length === 10 && (!!amountRaw || !!selAmt);

  const handleAmtChip = (a: string) => {
    setSelAmt(a);
    const raw = a.replace("₦", "").replace(/,/g, "");
    setAmountRaw(raw);
    setAmountFmt(parseInt(raw, 10).toLocaleString("en-NG"));
  };

  const handleAmountChange = (t: string) => {
    const raw = t.replace(/\D/g, "");
    setAmountRaw(raw);
    setAmountFmt(raw ? parseInt(raw, 10).toLocaleString("en-NG") : "");
    setSelAmt("");
  };

  const totalAmount = amountRaw
    ? parseInt(amountRaw, 10)
    : selAmt
    ? parseInt(selAmt.replace("₦", "").replace(/,/g, ""), 10)
    : 0;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: C.bg }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >

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
        <Text style={s.headerTitle}>Fund Wallet</Text>
        <View style={{ width: 44 }} />
      </Animated.View>
      <View style={s.divider} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[s.scroll, { paddingBottom: insets.bottom + 48 }]}
      >

        {/* Balance card */}
        <Animated.View entering={FadeInDown.duration(320).springify().delay(40)} style={s.balCard}>
          <View style={s.balTop}>
            <View style={[s.balDot, { backgroundColor: C.success }]} />
            <Text style={s.balTag}>Wallet Balance</Text>
          </View>
          <Text style={s.balAmount}>{formatted}</Text>
          <Text style={s.balSub}>Hi, {firstName} — fund your wallet below</Text>
        </Animated.View>

        {/* Bank selector */}
        <Animated.View entering={FadeInDown.duration(300).springify().delay(70)}>
          <SelectField
            label="select bank"
            value={bank}
            placeholder="   Choose your bank"
            onPress={() => setPicker(true)}
          />
        </Animated.View>

        {/* Account number */}
        <Animated.View entering={FadeInDown.duration(300).springify().delay(100)}>
          <View style={{ gap: 4 }}>
            <Text style={f.label}>account number</Text>
            <View style={[f.input, acctNum.length === 10 && s.inputValid]}>
              <TextInput
                style={[f.val, { flex: 1 }]}
                placeholder="   Enter 10-digit account number"
                placeholderTextColor="#646464"
                value={acctNum}
                onChangeText={t => setAcctNum(t.replace(/\D/g, "").slice(0, 10))}
                keyboardType="number-pad"
                maxLength={10}
                returnKeyType="next"
                textContentType="none"
                autoComplete="off"
                onSubmitEditing={() => amountRef.current?.focus()}
              />
              {acctNum.length === 10 && (
                <Feather name="check-circle" size={18} color={C.success} />
              )}
            </View>
            {acctNum.length > 0 && acctNum.length < 10 && (
              <Text style={s.fieldHint}>{acctNum.length}/10 digits</Text>
            )}
          </View>
        </Animated.View>

        {/* Quick amounts */}
        <Animated.View entering={FadeInUp.duration(300).springify().delay(130)}>
          <Text style={[f.label, { marginBottom: 8 }]}>quick amount</Text>
          <View style={s.quickRow}>
            {AMOUNTS.map(a => (
              <TouchableOpacity
                key={a}
                style={[s.quickChip, selAmt === a && { backgroundColor: C.black, borderColor: C.black }]}
                onPress={() => { Haptics.selectionAsync(); handleAmtChip(a); }}
              >
                <Text style={[s.quickText, selAmt === a && { color: "#FFFFFF" }]}>{a}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* Custom amount */}
        <Animated.View entering={FadeInUp.duration(300).springify().delay(155)}>
          <View style={{ gap: 4 }}>
            <Text style={f.label}>or enter custom amount</Text>
            <View style={f.input}>
              <Text style={{ fontSize: 14, fontFamily: "Manrope_700Bold", color: C.textMuted, marginRight: 4 }}>₦</Text>
              <TextInput
                ref={amountRef}
                style={[f.val, { flex: 1 }]}
                placeholder="0"
                placeholderTextColor="#646464"
                value={amountFmt}
                onChangeText={handleAmountChange}
                keyboardType="number-pad"
                returnKeyType="done"
                textContentType="none"
                autoComplete="off"
              />
            </View>
          </View>
        </Animated.View>

        {/* Summary */}
        {totalAmount > 0 && (
          <Animated.View entering={FadeInUp.duration(260).springify()} style={s.summaryBox}>
            <View style={s.summaryRow}>
              <Text style={s.summaryLabel}>Amount</Text>
              <Text style={s.summaryValue}>₦{totalAmount.toLocaleString("en-NG")}</Text>
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
                ₦{totalAmount.toLocaleString("en-NG")}
              </Text>
            </View>
          </Animated.View>
        )}

        {success && (
          <Animated.View entering={FadeInDown.duration(280).springify()} style={s.successBox}>
            <Feather name="check-circle" size={18} color={C.success} />
            <Text style={s.successText}>Funding initiated successfully!</Text>
          </Animated.View>
        )}

        <TouchableOpacity
          style={[s.fundBtn, !canProceed && { opacity: 0.45 }]}
          onPress={() => {
            if (!canProceed) return;
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
            const fmtAmt = totalAmount > 0
              ? "₦" + totalAmount.toLocaleString("en-NG")
              : selAmt || "₦0";
            scheduleWalletFunded(fmtAmt);
          }}
          activeOpacity={0.85}
        >
          <Text style={s.fundBtnText}>Fund Wallet</Text>
        </TouchableOpacity>

      </ScrollView>

      <PickerModal
        visible={picker}
        title="Select Bank"
        options={BANKS}
        onSelect={setBank}
        onClose={() => setPicker(false)}
      />
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
  balDot:    { width: 8, height: 8, borderRadius: 4 },
  balTag:    { fontSize: rf(12), fontFamily: "Manrope_500Medium", color: C.textMuted },
  balAmount: { fontSize: rf(30), fontFamily: "Manrope_700Bold", color: C.navy, letterSpacing: -0.5 },
  balSub:    { fontSize: rf(12), fontFamily: "Manrope_400Regular", color: C.textSec },

  inputValid: { borderColor: C.success, borderWidth: 1.5 },
  fieldHint:  { fontSize: 11, fontFamily: "Manrope_400Regular", color: C.textMuted, paddingLeft: 2 },

  quickRow:  { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  quickChip: { paddingHorizontal: 14, paddingVertical: 9, borderRadius: 20, borderWidth: 1, borderColor: C.border, backgroundColor: "#F8F9FA" },
  quickText: { fontSize: 12, fontFamily: "Manrope_600SemiBold", color: C.textSec },

  summaryBox:   { backgroundColor: C.dark, borderRadius: 10, paddingHorizontal: 18, paddingVertical: 2 },
  summaryRow:   { flexDirection: "row", justifyContent: "space-between", paddingVertical: 12 },
  summaryLine:  { height: 1, backgroundColor: "rgba(255,255,255,0.1)" },
  summaryLabel: { fontSize: 10, fontFamily: "Manrope_400Regular", color: "rgba(255,255,255,0.7)" },
  summaryValue: { fontSize: 10, fontFamily: "Manrope_500Medium", color: "#FFFFFF" },

  successBox:  { flexDirection: "row", alignItems: "center", gap: 10, backgroundColor: "#F0FFF4", borderRadius: 10, padding: 14, borderWidth: 1, borderColor: "#BBF7D0" },
  successText: { fontSize: 13, fontFamily: "Manrope_500Medium", color: C.success },

  fundBtn:     { backgroundColor: C.black, height: 48, borderRadius: 10, alignItems: "center", justifyContent: "center", elevation: 4 },
  fundBtnText: { fontSize: rf(14), fontFamily: "Manrope_700Bold", color: "#FFFFFF", letterSpacing: -0.14 },
});
