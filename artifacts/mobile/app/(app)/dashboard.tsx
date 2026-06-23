import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
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
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@/context/AuthContext";

/* ─── Light theme ────────────────────────────────────────────────────────────── */
const C = {
  bg:         "#FFFFFF",
  text:       "#0B0A0A",
  textSec:    "#595F67",
  textMuted:  "#6C7278",
  border:     "#EDF1F3",
  inputBg:    "#F0F0F0",
  success:    "#00B03C",
  divider:    "#D1D1D1",
};

const BANKS = [
  "Access Bank",
  "First Bank",
  "GTBank",
  "UBA",
  "Zenith Bank",
  "Fidelity Bank",
  "Union Bank",
  "Sterling Bank",
];

const AMOUNTS = ["₦5,000", "₦10,000", "₦20,000", "₦50,000", "₦100,000"];

/* ─── Dropdown field ─────────────────────────────────────────────────────────── */
function SelectField({
  label, value, placeholder, onPress,
}: { label: string; value: string; placeholder: string; onPress: () => void }) {
  return (
    <View style={sf.wrap}>
      <Text style={sf.label}>{label}</Text>
      <TouchableOpacity style={sf.field} onPress={onPress} activeOpacity={0.8}>
        <Text style={[sf.value, !value && sf.ph]}>{value || placeholder}</Text>
        <Feather name="chevron-down" size={18} color={C.textMuted} />
      </TouchableOpacity>
    </View>
  );
}

const sf = StyleSheet.create({
  wrap:  { gap: 6 },
  label: { fontSize: 12, fontFamily: "Manrope_500Medium", color: C.textMuted, paddingLeft: 2 },
  field: {
    flexDirection:  "row",
    alignItems:     "center",
    justifyContent: "space-between",
    backgroundColor: C.inputBg,
    borderWidth:    1.5,
    borderColor:    C.border,
    borderRadius:   10,
    paddingHorizontal: 16,
    paddingVertical:   14,
  },
  value: { fontSize: 14, fontFamily: "Manrope_500Medium", color: C.text },
  ph:    { color: C.textMuted },
});

/* ─── Picker modal ───────────────────────────────────────────────────────────── */
function PickerModal({
  visible, title, options, onSelect, onClose,
}: {
  visible: boolean; title: string; options: string[];
  onSelect: (v: string) => void; onClose: () => void;
}) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={pm.overlay} onPress={onClose} />
      <View style={pm.sheet}>
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
      </View>
    </Modal>
  );
}

const pm = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)" },
  sheet: {
    backgroundColor:     "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius:20,
    paddingHorizontal:   24,
    paddingTop:          16,
    paddingBottom:       40,
    maxHeight:           "60%",
  },
  handle: {
    width: 40, height: 4,
    borderRadius:    2,
    backgroundColor: C.border,
    alignSelf:       "center",
    marginBottom:    16,
  },
  title:   { fontSize: 16, fontFamily: "Manrope_700Bold", color: C.text, marginBottom: 12 },
  option:  {
    flexDirection:   "row",
    alignItems:      "center",
    justifyContent:  "space-between",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  optText: { fontSize: 15, fontFamily: "Manrope_500Medium", color: C.text },
});

/* ─── Quick amount chip ──────────────────────────────────────────────────────── */
function AmountChip({
  label, selected, onPress,
}: { label: string; selected: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity
      style={[ac.chip, selected && ac.chipSel]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={[ac.label, selected && ac.labelSel]}>{label}</Text>
    </TouchableOpacity>
  );
}

const ac = StyleSheet.create({
  chip:     { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, borderWidth: 1.5, borderColor: C.border, backgroundColor: C.inputBg },
  chipSel:  { backgroundColor: "#000000", borderColor: "#000000" },
  label:    { fontSize: 13, fontFamily: "Manrope_600SemiBold", color: C.textSec },
  labelSel: { color: "#FFFFFF" },
});

/* ─── Main screen ────────────────────────────────────────────────────────────── */
export default function DashboardScreen() {
  const router  = useRouter();
  const insets  = useSafeAreaInsets();
  const { user, logout } = useAuth();

  const [bank,    setBank]    = useState("");
  const [acctNum, setAcctNum] = useState("");
  const [amount,  setAmount]  = useState("");
  const [selAmt,  setSelAmt]  = useState("");
  const [picker,  setPicker]  = useState<"bank" | "amt" | null>(null);
  const [success, setSuccess] = useState(false);

  const firstName = (user?.name ?? "User").split(" ")[0];
  const balance   = user?.balance ?? 200590;
  const formatted = "₦" + balance.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const canProceed = !!bank && !!acctNum && (!!amount || !!selAmt);

  const handleAmtChip = (a: string) => {
    setSelAmt(a);
    setAmount(a.replace("₦", "").replace(",", ""));
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: C.bg }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* Header */}
      <View style={[hdr.wrap, { paddingTop: (insets.top || 16) + 12 }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={hdr.back}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Feather name="arrow-left" size={22} color="#1E232C" />
        </TouchableOpacity>
        <Text style={hdr.title}>Fund Wallet</Text>
        <TouchableOpacity
          onPress={logout}
          style={hdr.back}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Feather name="log-out" size={20} color={C.textMuted} />
        </TouchableOpacity>
      </View>
      <View style={hdr.divider} />

      <ScrollView
        contentContainerStyle={sc.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Balance preview card */}
        <Animated.View
          entering={FadeInDown.duration(380).springify().delay(40)}
          style={bc.card}
        >
          <View style={bc.row}>
            <View style={[bc.dot, { backgroundColor: C.success }]} />
            <Text style={bc.tag}>Wallet Balance</Text>
          </View>
          <Text style={bc.amount}>{formatted}</Text>
          <Text style={bc.sub}>Hi, {firstName} — top up your wallet below</Text>
        </Animated.View>

        {/* Bank select */}
        <Animated.View entering={FadeInUp.duration(360).springify().delay(80)}>
          <SelectField
            label="Select Bank"
            value={bank}
            placeholder="Choose your bank"
            onPress={() => setPicker("bank")}
          />
        </Animated.View>

        {/* Account number */}
        <Animated.View entering={FadeInUp.duration(360).springify().delay(110)}>
          <View style={sf.wrap}>
            <Text style={sf.label}>Account Number</Text>
            <View style={[sf.field, { backgroundColor: C.inputBg }]}>
              <TextInput
                style={[sf.value, { flex: 1 }]}
                placeholder="Enter 10-digit account number"
                placeholderTextColor={C.textMuted}
                value={acctNum}
                onChangeText={t => setAcctNum(t.replace(/\D/g, "").slice(0, 10))}
                keyboardType="numeric"
                maxLength={10}
              />
              {acctNum.length === 10 && (
                <Feather name="check-circle" size={18} color={C.success} />
              )}
            </View>
          </View>
        </Animated.View>

        {/* Quick amounts */}
        <Animated.View entering={FadeInUp.duration(360).springify().delay(140)} style={qa.wrap}>
          <Text style={qa.label}>Quick Amount</Text>
          <View style={qa.row}>
            {AMOUNTS.map(a => (
              <AmountChip
                key={a}
                label={a}
                selected={selAmt === a}
                onPress={() => handleAmtChip(a)}
              />
            ))}
          </View>
        </Animated.View>

        {/* Custom amount */}
        <Animated.View entering={FadeInUp.duration(360).springify().delay(170)}>
          <View style={sf.wrap}>
            <Text style={sf.label}>Or enter custom amount</Text>
            <View style={[sf.field, { backgroundColor: C.inputBg }]}>
              <Text style={{ fontSize: 16, fontFamily: "Manrope_600SemiBold", color: C.textMuted, marginRight: 4 }}>₦</Text>
              <TextInput
                style={[sf.value, { flex: 1 }]}
                placeholder="0.00"
                placeholderTextColor={C.textMuted}
                value={amount}
                onChangeText={t => { setAmount(t.replace(/\D/g, "")); setSelAmt(""); }}
                keyboardType="numeric"
              />
            </View>
          </View>
        </Animated.View>

        {/* Summary */}
        {(amount || selAmt) ? (
          <Animated.View entering={FadeInUp.duration(300).springify()} style={sm.box}>
            <View style={sm.row}>
              <Text style={sm.label}>Amount</Text>
              <Text style={sm.val}>₦{parseInt(amount || "0").toLocaleString("en-NG")}</Text>
            </View>
            <View style={sm.line} />
            <View style={sm.row}>
              <Text style={sm.label}>Fee</Text>
              <Text style={sm.val}>₦0.00</Text>
            </View>
            <View style={sm.line} />
            <View style={sm.row}>
              <Text style={sm.label}>Total</Text>
              <Text style={[sm.val, { fontFamily: "Manrope_700Bold", fontSize: 14 }]}>
                ₦{parseInt(amount || "0").toLocaleString("en-NG")}
              </Text>
            </View>
          </Animated.View>
        ) : null}

        {/* Fund button */}
        <TouchableOpacity
          style={[btn.wrap, !canProceed && { opacity: 0.45 }]}
          onPress={() => {
            if (!canProceed) return;
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
          }}
          activeOpacity={0.85}
        >
          <Text style={btn.text}>Fund Wallet</Text>
        </TouchableOpacity>

        {success && (
          <Animated.View entering={FadeInDown.duration(300).springify()} style={ok.box}>
            <Feather name="check-circle" size={18} color={C.success} />
            <Text style={ok.text}>Funding initiated successfully!</Text>
          </Animated.View>
        )}
      </ScrollView>

      <PickerModal
        visible={picker === "bank"}
        title="Select Bank"
        options={BANKS}
        onSelect={setBank}
        onClose={() => setPicker(null)}
      />
    </KeyboardAvoidingView>
  );
}

/* ─── Styles ─────────────────────────────────────────────────────────────────── */

const hdr = StyleSheet.create({
  wrap: {
    flexDirection:     "row",
    alignItems:        "center",
    justifyContent:    "space-between",
    paddingHorizontal: 20,
    paddingBottom:     16,
    backgroundColor:   C.bg,
  },
  back:    { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  title:   { fontSize: 13, fontFamily: "Manrope_700Bold", color: "#000000", textAlign: "center" },
  divider: { height: 1, backgroundColor: C.divider },
});

const sc = StyleSheet.create({
  content: { padding: 20, gap: 18, paddingBottom: 48 },
});

const bc = StyleSheet.create({
  card: {
    backgroundColor: "#F8F9FA",
    borderRadius:    16,
    padding:         20,
    gap:             8,
    borderWidth:     1,
    borderColor:     C.border,
  },
  row:    { flexDirection: "row", alignItems: "center", gap: 6 },
  dot:    { width: 8, height: 8, borderRadius: 4 },
  tag:    { fontSize: 12, fontFamily: "Manrope_500Medium", color: C.textMuted },
  amount: { fontSize: 28, fontFamily: "Manrope_700Bold", color: C.text, letterSpacing: -0.5 },
  sub:    { fontSize: 12, fontFamily: "Manrope_400Regular", color: C.textSec },
});

const qa = StyleSheet.create({
  wrap:  { gap: 10 },
  label: { fontSize: 12, fontFamily: "Manrope_500Medium", color: C.textMuted, paddingLeft: 2 },
  row:   { flexDirection: "row", flexWrap: "wrap", gap: 8 },
});

const sm = StyleSheet.create({
  box: {
    backgroundColor: "#010101",
    borderRadius:    10,
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  row: {
    flexDirection:   "row",
    justifyContent:  "space-between",
    paddingVertical: 11,
  },
  line:  { height: 1, backgroundColor: "rgba(255,255,255,0.1)" },
  label: { fontSize: 12, fontFamily: "Manrope_400Regular", color: "#FFFFFF" },
  val:   { fontSize: 12, fontFamily: "Manrope_500Medium", color: "#FFFFFF" },
});

const btn = StyleSheet.create({
  wrap: {
    backgroundColor: "#000000",
    height:          50,
    borderRadius:    10,
    alignItems:      "center",
    justifyContent:  "center",
    shadowColor:     "#375DFB",
    shadowOffset:    { width: 0, height: 1 },
    shadowOpacity:   0.48,
    shadowRadius:    2,
    elevation:       4,
  },
  text: { fontSize: 15, fontFamily: "Manrope_700Bold", color: "#FFFFFF" },
});

const ok = StyleSheet.create({
  box: {
    flexDirection:  "row",
    alignItems:     "center",
    gap:            8,
    backgroundColor:"#F0FFF4",
    borderRadius:   10,
    padding:        14,
    borderWidth:    1,
    borderColor:    "#C3E6CB",
  },
  text: { fontSize: 13, fontFamily: "Manrope_500Medium", color: C.success },
});
