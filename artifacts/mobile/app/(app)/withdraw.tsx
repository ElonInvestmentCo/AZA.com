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
import { ScreenHeader } from "@/components/ScreenHeader";
import { useAuth } from "@/context/AuthContext";

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

const BANKS = [
  "Access Bank","First Bank","GTBank","UBA","Zenith Bank",
  "Fidelity Bank","Union Bank","Sterling Bank","Wema Bank","Polaris Bank",
];

const QUICK_AMOUNTS = ["₦5,000","₦10,000","₦20,000","₦50,000","₦100,000"];

type Step = "form" | "confirm" | "success";

export default function WithdrawScreen() {
  const router = useRouter();
  const { user } = useAuth();

  const [step,      setStep]      = useState<Step>("form");
  const [bank,      setBank]      = useState("");
  const [accNum,    setAccNum]    = useState("");
  const [accName,   setAccName]   = useState("");
  const [amount,    setAmount]    = useState("");
  const [loading,   setLoading]   = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [accLoading,setAccLoading]= useState(false);

  const balance = user?.balance ?? 200590;

  const lookupAccount = async () => {
    if (accNum.length < 10) return;
    setAccLoading(true);
    await new Promise(r => setTimeout(r, 900));
    setAccLoading(false);
    setAccName("JOHN DOE SAMPLE");
  };

  const handleWithdraw = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1800));
    setLoading(false);
    setStep("success");
  };

  if (step === "success") {
    return (
      <View style={s.root}>
        <ScreenHeader title="Withdrawal Successful" showBack={false} />
        <View style={s.successWrap}>
          <Animated.View entering={FadeInDown.duration(400).springify()} style={s.successCircle}>
            <Feather name="check" size={40} color="#fff" />
          </Animated.View>
          <Animated.Text entering={FadeInUp.duration(320).delay(80)} style={s.successTitle}>
            Withdrawal Sent!
          </Animated.Text>
          <Animated.Text entering={FadeInUp.duration(320).delay(120)} style={s.successSub}>
            {amount} has been sent to {bank}
          </Animated.Text>
          <Animated.View entering={FadeInUp.duration(300).delay(160)} style={s.receiptCard}>
            {[
              { label:"Bank",       value: bank },
              { label:"Account",    value: accNum },
              { label:"Name",       value: accName },
              { label:"Amount",     value: amount },
              { label:"Fee",        value: "₦52.50" },
              { label:"Reference",  value: `WD-${Math.floor(Math.random()*900000)+100000}` },
              { label:"Status",     value: "Processing" },
            ].map(r => (
              <View key={r.label} style={s.receiptRow}>
                <Text style={s.receiptLabel}>{r.label}</Text>
                <Text style={[s.receiptValue, r.label === "Status" && { color: "#F59E0B" }]}>{r.value}</Text>
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
      <ScreenHeader title="Withdraw Funds" />

      <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

        {step === "form" && (
          <Animated.View entering={FadeInDown.duration(300)} style={{ gap: 20 }}>

            {/* Balance */}
            <View style={s.balanceCard}>
              <Text style={s.balLabel}>Available Balance</Text>
              <Text style={s.balAmount}>₦{balance.toLocaleString("en-NG", { minimumFractionDigits: 2 })}</Text>
            </View>

            {/* Bank */}
            <View style={s.field}>
              <Text style={s.fieldLabel}>Select Bank</Text>
              <TouchableOpacity style={s.selectField} onPress={() => setShowModal(true)}>
                <Text style={[s.selectText, !bank && s.selectPh]}>{bank || "Choose bank"}</Text>
                <Feather name="chevron-down" size={18} color={C.textMut} />
              </TouchableOpacity>
            </View>

            {/* Account number */}
            <View style={s.field}>
              <Text style={s.fieldLabel}>Account Number</Text>
              <TextInput
                style={s.input}
                placeholder="Enter 10-digit account number"
                placeholderTextColor={C.textMut}
                value={accNum}
                onChangeText={t => { setAccNum(t); setAccName(""); if (t.length === 10) lookupAccount(); }}
                keyboardType="numeric"
                maxLength={10}
              />
              {accLoading && <Text style={s.hint}>Verifying account…</Text>}
              {accName ? (
                <View style={s.accNameRow}>
                  <Feather name="check-circle" size={14} color="#00B03C" />
                  <Text style={s.accName}>{accName}</Text>
                </View>
              ) : null}
            </View>

            {/* Amount */}
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

            <View style={s.feeNote}>
              <Feather name="info" size={14} color={C.textMut} />
              <Text style={s.feeText}>Transaction fee: ₦52.50 applies</Text>
            </View>

            <TouchableOpacity
              style={[s.btn, (!bank || accNum.length < 10 || !amount) && s.btnDisabled]}
              disabled={!bank || accNum.length < 10 || !amount}
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
            <Text style={s.subheading}>Review your withdrawal</Text>
            <View style={s.receiptCard}>
              {[
                { label:"Bank",     value: bank },
                { label:"Account",  value: accNum },
                { label:"Name",     value: accName },
                { label:"Amount",   value: amount },
                { label:"Fee",      value: "₦52.50" },
              ].map(r => (
                <View key={r.label} style={s.receiptRow}>
                  <Text style={s.receiptLabel}>{r.label}</Text>
                  <Text style={s.receiptValue}>{r.value}</Text>
                </View>
              ))}
              <View style={[s.receiptRow, { borderTopWidth: 1, borderTopColor: C.border, paddingTop: 14 }]}>
                <Text style={[s.receiptLabel, { fontFamily: "Manrope_700Bold" }]}>Total Deducted</Text>
                <Text style={[s.receiptValue, { fontFamily: "Manrope_700Bold", color: C.text }]}>{amount} + ₦52.50</Text>
              </View>
            </View>
            <TouchableOpacity style={[s.btn, loading && s.btnDisabled]} disabled={loading} onPress={handleWithdraw}>
              <Text style={s.btnText}>{loading ? "Processing…" : "Confirm Withdrawal"}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setStep("form")} style={s.secondaryBtn}>
              <Text style={s.secondaryText}>Edit Details</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </ScrollView>

      {/* Bank picker modal */}
      <Modal visible={showModal} transparent animationType="slide" onRequestClose={() => setShowModal(false)}>
        <Pressable style={s.modalOverlay} onPress={() => setShowModal(false)}>
          <Pressable style={s.modalSheet} onPress={() => {}}>
            <View style={s.modalHandle} />
            <Text style={s.modalTitle}>Select Bank</Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              {BANKS.map(b => (
                <TouchableOpacity
                  key={b}
                  style={[s.bankRow, bank === b && s.bankRowActive]}
                  onPress={() => {
                    Haptics.selectionAsync();
                    setBank(b);
                    setShowModal(false);
                  }}
                >
                  <Text style={[s.bankName, bank === b && { color: C.accent }]}>{b}</Text>
                  {bank === b && <Feather name="check" size={16} color={C.accent} />}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  root:   { flex: 1, backgroundColor: C.bg },
  scroll: { padding: 20, flexGrow: 1 },
  subheading: { fontSize: 15, fontFamily: "Manrope_600SemiBold", color: C.textSec },

  balanceCard: {
    backgroundColor: C.text, borderRadius: 16, padding: 20, gap: 4,
  },
  balLabel:  { fontSize: 13, fontFamily: "Manrope_400Regular", color: "rgba(255,255,255,0.6)" },
  balAmount: { fontSize: 26, fontFamily: "Manrope_700Bold", color: "#FFFFFF" },

  field:      { gap: 8 },
  fieldLabel: { fontSize: 13, fontFamily: "Manrope_500Medium", color: C.textSec },

  selectField: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    backgroundColor: C.inputBg, borderWidth: 1, borderColor: C.border,
    borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14,
  },
  selectText: { fontSize: 15, fontFamily: "Manrope_500Medium", color: C.text },
  selectPh:   { color: C.textMut },

  input: {
    backgroundColor: C.inputBg, borderWidth: 1, borderColor: C.border,
    borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14,
    fontSize: 15, fontFamily: "Manrope_500Medium", color: C.text,
  },
  hint: { fontSize: 12, fontFamily: "Manrope_400Regular", color: C.textMut },
  accNameRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  accName:    { fontSize: 13, fontFamily: "Manrope_600SemiBold", color: "#00B03C" },

  quickRow:        { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  quickChip:       { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: C.border, backgroundColor: C.surface },
  quickChipActive: { backgroundColor: C.btn, borderColor: C.btn },
  quickText:       { fontSize: 12, fontFamily: "Manrope_500Medium", color: C.textSec },
  quickTextActive: { color: "#fff" },

  feeNote: { flexDirection: "row", alignItems: "center", gap: 6 },
  feeText: { fontSize: 12, fontFamily: "Manrope_400Regular", color: C.textMut },

  btn:         { height: 56, backgroundColor: C.btn, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  btnDisabled: { opacity: 0.5 },
  btnText:     { fontSize: 16, fontFamily: "Manrope_700Bold", color: "#fff" },

  secondaryBtn:  { height: 48, alignItems: "center", justifyContent: "center" },
  secondaryText: { fontSize: 14, fontFamily: "Manrope_600SemiBold", color: C.textSec },

  receiptCard:  { backgroundColor: C.surface, borderRadius: 16, padding: 18, borderWidth: 1, borderColor: C.border, gap: 14 },
  receiptRow:   { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  receiptLabel: { fontSize: 13, fontFamily: "Manrope_400Regular", color: C.textSec },
  receiptValue: { fontSize: 13, fontFamily: "Manrope_600SemiBold", color: C.text },

  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.45)", justifyContent: "flex-end" },
  modalSheet: {
    backgroundColor: C.bg, borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: 24, maxHeight: "70%",
  },
  modalHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: C.border, alignSelf: "center", marginBottom: 20 },
  modalTitle:  { fontSize: 18, fontFamily: "Manrope_700Bold", color: C.text, marginBottom: 16 },
  bankRow:     { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: C.border },
  bankRowActive:{ backgroundColor: C.accent + "08" },
  bankName:    { fontSize: 15, fontFamily: "Manrope_500Medium", color: C.text },

  successWrap:   { flex: 1, alignItems: "center", justifyContent: "center", padding: 24, gap: 12 },
  successCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: "#00B03C", alignItems: "center", justifyContent: "center", marginBottom: 8 },
  successTitle:  { fontSize: 22, fontFamily: "Manrope_700Bold", color: C.text },
  successSub:    { fontSize: 14, fontFamily: "Manrope_400Regular", color: C.textSec, textAlign: "center" },
});
