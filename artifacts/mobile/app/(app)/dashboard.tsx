import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
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
import { useColors } from "@/hooks/useColors";

const BANKS = [
  "Access Bank", "First Bank", "GTBank", "UBA",
  "Zenith Bank", "Fidelity Bank", "Union Bank", "Sterling Bank",
];

const AMOUNTS = ["₦5,000", "₦10,000", "₦20,000", "₦50,000", "₦100,000"];

/* ─── Dropdown field ─────────────────────────────────────────────────────────── */
function SelectField({
  label, value, placeholder, onPress,
}: { label: string; value: string; placeholder: string; onPress: () => void }) {
  const C = useColors();
  return (
    <View style={sf.wrap}>
      <Text style={[sf.label, { color: C.mutedForeground }]}>{label}</Text>
      <TouchableOpacity
        style={[sf.field, { backgroundColor: C.input, borderColor: C.border }]}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <Text style={[sf.value, { color: value ? C.text : C.placeholder }]}>{value || placeholder}</Text>
        <Feather name="chevron-down" size={18} color={C.mutedForeground} />
      </TouchableOpacity>
    </View>
  );
}

const sf = StyleSheet.create({
  wrap:  { gap: 6 },
  label: { fontSize: 12, fontFamily: "Manrope_500Medium", paddingLeft: 2 },
  field: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    borderWidth: 1.5, borderRadius: 10, paddingHorizontal: 16, paddingVertical: 14,
  },
  value: { fontSize: 14, fontFamily: "Manrope_500Medium" },
});

/* ─── Picker modal ───────────────────────────────────────────────────────────── */
function PickerModal({
  visible, title, options, onSelect, onClose,
}: {
  visible: boolean; title: string; options: string[];
  onSelect: (v: string) => void; onClose: () => void;
}) {
  const C = useColors();
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={pm.overlay} onPress={onClose} />
      <View style={[pm.sheet, { backgroundColor: C.surface }]}>
        <View style={[pm.handle, { backgroundColor: C.border }]} />
        <Text style={[pm.title, { color: C.text }]}>{title}</Text>
        <ScrollView showsVerticalScrollIndicator={false}>
          {options.map(o => (
            <TouchableOpacity
              key={o}
              style={[pm.option, { borderBottomColor: C.border }]}
              onPress={() => { Haptics.selectionAsync(); onSelect(o); onClose(); }}
            >
              <Text style={[pm.optText, { color: C.text }]}>{o}</Text>
              <Feather name="chevron-right" size={16} color={C.mutedForeground} />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </Modal>
  );
}

const pm = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.55)" },
  sheet: {
    borderTopLeftRadius: 20, borderTopRightRadius: 20,
    paddingHorizontal: 24, paddingTop: 16, paddingBottom: 40, maxHeight: "60%",
  },
  handle: {
    width: 40, height: 4, borderRadius: 2,
    alignSelf: "center", marginBottom: 16,
  },
  title:   { fontSize: 16, fontFamily: "Manrope_700Bold", marginBottom: 12 },
  option:  {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingVertical: 14, borderBottomWidth: 1,
  },
  optText: { fontSize: 15, fontFamily: "Manrope_500Medium" },
});

/* ─── Quick amount chip ──────────────────────────────────────────────────────── */
function AmountChip({
  label, selected, onPress,
}: { label: string; selected: boolean; onPress: () => void }) {
  const C = useColors();
  return (
    <TouchableOpacity
      style={[
        ac.chip,
        { borderColor: C.border, backgroundColor: C.input },
        selected && { backgroundColor: C.accent, borderColor: C.accent },
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={[ac.label, { color: C.subtitle }, selected && { color: "#FFFFFF" }]}>{label}</Text>
    </TouchableOpacity>
  );
}

const ac = StyleSheet.create({
  chip:  { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, borderWidth: 1.5 },
  label: { fontSize: 13, fontFamily: "Manrope_600SemiBold" },
});

/* ─── Main screen ────────────────────────────────────────────────────────────── */
export default function DashboardScreen() {
  const router  = useRouter();
  const insets  = useSafeAreaInsets();
  const { user, logout } = useAuth();
  const C       = useColors();

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
      style={[{ flex: 1 }, { backgroundColor: C.background }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* Header */}
      <View style={[hdr.wrap, { paddingTop: (insets.top || 16) + 12, backgroundColor: C.background }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={hdr.back}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Feather name="arrow-left" size={22} color={C.text} />
        </TouchableOpacity>
        <Text style={[hdr.title, { color: C.text }]}>Fund Wallet</Text>
        <TouchableOpacity
          onPress={logout}
          style={hdr.back}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Feather name="log-out" size={20} color={C.mutedForeground} />
        </TouchableOpacity>
      </View>
      <View style={[hdr.divider, { backgroundColor: C.border }]} />

      <ScrollView
        contentContainerStyle={sc.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Balance preview card */}
        <Animated.View
          entering={FadeInDown.duration(380).springify().delay(40)}
          style={[bc.card, { backgroundColor: C.surface, borderColor: C.border }]}
        >
          <View style={bc.row}>
            <View style={[bc.dot, { backgroundColor: C.success }]} />
            <Text style={[bc.tag, { color: C.mutedForeground }]}>Wallet Balance</Text>
          </View>
          <Text style={[bc.amount, { color: C.text }]}>{formatted}</Text>
          <Text style={[bc.sub, { color: C.subtitle }]}>Hi, {firstName} — top up your wallet below</Text>
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
            <Text style={[sf.label, { color: C.mutedForeground }]}>Account Number</Text>
            <View style={[sf.field, { backgroundColor: C.input, borderColor: C.border }]}>
              <TextInput
                style={[sf.value, { flex: 1, color: C.text }]}
                placeholder="Enter 10-digit account number"
                placeholderTextColor={C.placeholder}
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
          <Text style={[qa.label, { color: C.mutedForeground }]}>Quick Amount</Text>
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
            <Text style={[sf.label, { color: C.mutedForeground }]}>Or enter custom amount</Text>
            <View style={[sf.field, { backgroundColor: C.input, borderColor: C.border }]}>
              <Text style={{ fontSize: 16, fontFamily: "Manrope_600SemiBold", color: C.mutedForeground, marginRight: 4 }}>₦</Text>
              <TextInput
                style={[sf.value, { flex: 1, color: C.text }]}
                placeholder="0.00"
                placeholderTextColor={C.placeholder}
                value={amount}
                onChangeText={t => { setAmount(t.replace(/\D/g, "")); setSelAmt(""); }}
                keyboardType="numeric"
              />
            </View>
          </View>
        </Animated.View>

        {/* Summary */}
        {(amount || selAmt) ? (
          <Animated.View entering={FadeInUp.duration(300).springify()} style={[sm.box, { backgroundColor: C.card }]}>
            <View style={sm.row}>
              <Text style={sm.label}>Amount</Text>
              <Text style={sm.val}>₦{parseInt(amount || "0").toLocaleString("en-NG")}</Text>
            </View>
            <View style={[sm.line, { backgroundColor: C.border }]} />
            <View style={sm.row}>
              <Text style={sm.label}>Fee</Text>
              <Text style={sm.val}>₦0.00</Text>
            </View>
            <View style={[sm.line, { backgroundColor: C.border }]} />
            <View style={sm.row}>
              <Text style={sm.label}>Total</Text>
              <Text style={[sm.val, { fontFamily: "Manrope_700Bold", fontSize: 14 }]}>
                ₦{parseInt(amount || "0").toLocaleString("en-NG")}
              </Text>
            </View>
          </Animated.View>
        ) : null}

        {/* Fund button (gradient) */}
        <LinearGradient
          colors={[C.gradientStart, C.gradientMid, C.gradientEnd] as [string, string, string]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[btn.grad, { shadowColor: C.accentGlow, opacity: canProceed ? 1 : 0.45 }]}
        >
          <TouchableOpacity
            style={btn.press}
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
        </LinearGradient>

        {success && (
          <Animated.View entering={FadeInDown.duration(300).springify()} style={[ok.box, { backgroundColor: C.successLight, borderColor: C.success }]}>
            <Feather name="check-circle" size={18} color={C.success} />
            <Text style={[ok.text, { color: C.success }]}>Funding initiated successfully!</Text>
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
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 20, paddingBottom: 16,
  },
  back:    { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  title:   { fontSize: 13, fontFamily: "Manrope_700Bold", textAlign: "center" },
  divider: { height: 1 },
});

const sc = StyleSheet.create({
  content: { padding: 20, gap: 18, paddingBottom: 48 },
});

const bc = StyleSheet.create({
  card:   { borderRadius: 16, padding: 20, gap: 8, borderWidth: 1 },
  row:    { flexDirection: "row", alignItems: "center", gap: 6 },
  dot:    { width: 8, height: 8, borderRadius: 4 },
  tag:    { fontSize: 12, fontFamily: "Manrope_500Medium" },
  amount: { fontSize: 28, fontFamily: "Manrope_700Bold", letterSpacing: -0.5 },
  sub:    { fontSize: 12, fontFamily: "Manrope_400Regular" },
});

const qa = StyleSheet.create({
  wrap:  { gap: 10 },
  label: { fontSize: 12, fontFamily: "Manrope_500Medium", paddingLeft: 2 },
  row:   { flexDirection: "row", flexWrap: "wrap", gap: 8 },
});

const sm = StyleSheet.create({
  box: { borderRadius: 10, paddingHorizontal: 16, paddingVertical: 4 },
  row: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 11 },
  line:  { height: 1 },
  label: { fontSize: 12, fontFamily: "Manrope_400Regular", color: "#FFFFFF" },
  val:   { fontSize: 12, fontFamily: "Manrope_500Medium",  color: "#FFFFFF" },
});

const btn = StyleSheet.create({
  grad: {
    height: 50, borderRadius: 10,
    overflow: "hidden",
    shadowOffset: { width: 0, height: 4 }, shadowOpacity: 1, shadowRadius: 16, elevation: 6,
  },
  press: { flex: 1, alignItems: "center", justifyContent: "center" },
  text:  { fontSize: 15, fontFamily: "Manrope_700Bold", color: "#FFFFFF" },
});

const ok = StyleSheet.create({
  box: {
    flexDirection: "row", alignItems: "center", gap: 8,
    borderRadius: 10, padding: 14, borderWidth: 1,
  },
  text: { fontSize: 13, fontFamily: "Manrope_500Medium" },
});
