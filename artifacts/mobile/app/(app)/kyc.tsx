import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { AnimatedSheet } from "@/components/AnimatedSheet";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
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
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { apiFetch } from "@/utils/api";

const C = {
  bg:        "#FFFFFF",
  text:      "#0B0A0A",
  navy:      "#061941",
  textSec:   "#595F67",
  textMuted: "#6C7278",
  inputBg:   "#F0F0F0",
  border:    "#EDF1F3",
  success:   "#00B03C",
  warn:      "#D97706",
  danger:    "#EF4444",
  dark:      "#010101",
  black:     "#000000",
};

const ID_TYPES = [
  { key: "nin",             label: "National ID (NIN)" },
  { key: "bvn",              label: "Bank Verification Number (BVN)" },
  { key: "passport",         label: "International Passport" },
  { key: "drivers_license",  label: "Driver's License" },
  { key: "voters_card",      label: "Voter's Card" },
];

type KycStatus = "none" | "pending" | "verified" | "rejected";

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
  visible, title, onSelect, onClose,
}: { visible: boolean; title: string; onSelect: (v: { key: string; label: string }) => void; onClose: () => void }) {
  return (
    <AnimatedSheet visible={visible} onClose={onClose} maxHeight="60%">
      <View style={pm.inner}>
        <Text style={pm.title}>{title}</Text>
        <ScrollView showsVerticalScrollIndicator={false}>
          {ID_TYPES.map(o => (
            <TouchableOpacity key={o.key} style={pm.option} onPress={() => { Haptics.selectionAsync(); onSelect(o); onClose(); }}>
              <Text style={pm.optText}>{o.label}</Text>
              <Feather name="chevron-right" size={16} color={C.textMuted} />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </AnimatedSheet>
  );
}

const pm = StyleSheet.create({
  inner:   { paddingHorizontal: 20, paddingTop: 20, flex: 1 },
  title:   { fontSize: 16, fontFamily: "Manrope_700Bold", color: C.text, marginBottom: 12 },
  option:  { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: C.border },
  optText: { fontSize: 15, fontFamily: "Manrope_500Medium", color: C.text, flex: 1, paddingRight: 12 },
});

const STATUS_META: Record<KycStatus, { label: string; color: string; bg: string; icon: keyof typeof Feather.glyphMap }> = {
  none:     { label: "Not verified",    color: C.textMuted, bg: "#F0F0F0", icon: "shield" },
  pending:  { label: "Under review",    color: C.warn,      bg: "#FFFBEB", icon: "clock" },
  verified: { label: "Verified",        color: C.success,   bg: "#F0FFF4", icon: "check-circle" },
  rejected: { label: "Rejected",        color: C.danger,    bg: "#FFF0F0", icon: "x-circle" },
};

export default function KycScreen() {
  const router  = useRouter();
  const insets  = useSafeAreaInsets();
  const topPad  = Platform.OS === "web" ? 20 : insets.top;

  const [status,     setStatus]     = useState<KycStatus>("none");
  const [rejection,  setRejection]  = useState<string | null>(null);
  const [checking,   setChecking]   = useState(true);

  const [fullName, setFullName] = useState("");
  const [dob,       setDob]     = useState("");
  const [idType,    setIdType]  = useState<{ key: string; label: string } | null>(null);
  const [idNumber,  setIdNumber] = useState("");
  const [picker,    setPicker]   = useState(false);
  const [done,      setDone]     = useState(false);
  const [loading,   setLoading]  = useState(false);

  useEffect(() => {
    apiFetch<{
      kycStatus: KycStatus;
      kycFullName: string | null;
      kycDob: string | null;
      kycIdType: string | null;
      kycIdNumber: string | null;
      kycRejectionReason: string | null;
    }>("/kyc/status")
      .then(data => {
        setStatus(data.kycStatus ?? "none");
        setRejection(data.kycRejectionReason ?? null);
        if (data.kycFullName) setFullName(data.kycFullName);
        if (data.kycDob) setDob(data.kycDob);
        if (data.kycIdNumber) setIdNumber(data.kycIdNumber);
        if (data.kycIdType) {
          const match = ID_TYPES.find(t => t.key === data.kycIdType);
          if (match) setIdType(match);
        }
      })
      .catch(() => { /* keep defaults if the request fails */ })
      .finally(() => setChecking(false));
  }, []);

  const idIsNumericType = idType?.key === "bvn" || idType?.key === "nin";
  const idLenOk = idIsNumericType ? idNumber.length === 11 : idNumber.trim().length >= 4;
  const canProceed = !!fullName.trim() && !!dob.trim() && !!idType && idLenOk;

  const meta = STATUS_META[status];
  const isVerified = status === "verified";

  const submit = async () => {
    if (!canProceed || loading) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setLoading(true);
    try {
      const res = await apiFetch<{ status: KycStatus }>("/kyc/submit", {
        method: "POST",
        body: JSON.stringify({
          fullName: fullName.trim(),
          dob: dob.trim(),
          idType: idType!.key,
          idNumber: idNumber.trim(),
        }),
      });
      setStatus(res.status);
      setDone(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setTimeout(() => setDone(false), 1800);
    } catch (err: any) {
      Alert.alert("Verification Failed", err.message || "Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: C.bg }} behavior={Platform.OS === "ios" ? "padding" : undefined}>

      {/* Header */}
      <Animated.View entering={FadeInDown.duration(280).springify()} style={[s.header, { paddingTop: topPad + 10 }]}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
          <Feather name="arrow-left" size={22} color="#1E232C" />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Identity Verification</Text>
        <View style={{ width: 44 }} />
      </Animated.View>
      <View style={s.divider} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[s.scroll, { paddingBottom: insets.bottom + 40 }]}
      >

        {/* Status card */}
        <Animated.View entering={FadeInDown.duration(320).springify().delay(40)} style={[s.statusCard, { backgroundColor: meta.bg }]}>
          <View style={[s.statusIcon, { backgroundColor: "#FFFFFF" }]}>
            <Feather name={meta.icon} size={18} color={meta.color} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[s.statusLabel, { color: meta.color }]}>{checking ? "Checking status…" : meta.label}</Text>
            <Text style={s.statusSub}>
              {status === "verified"
                ? "Your identity has been verified."
                : status === "pending"
                ? "We're reviewing your submission."
                : status === "rejected"
                ? rejection || "Your submission was rejected. Please resubmit."
                : "Verify your identity to unlock full wallet limits."}
            </Text>
          </View>
        </Animated.View>

        {!isVerified && (
          <>
            {/* Full name */}
            <Animated.View entering={FadeInDown.duration(300).springify().delay(70)}>
              <View style={f.wrap}>
                <Text style={f.label}>full legal name</Text>
                <View style={f.input}>
                  <TextInput
                    style={[f.val, { flex: 1 }]}
                    placeholder="   As it appears on your ID"
                    placeholderTextColor="#646464"
                    value={fullName}
                    onChangeText={setFullName}
                    autoCapitalize="words"
                  />
                </View>
              </View>
            </Animated.View>

            {/* Date of birth */}
            <Animated.View entering={FadeInDown.duration(300).springify().delay(100)}>
              <View style={f.wrap}>
                <Text style={f.label}>date of birth</Text>
                <View style={f.input}>
                  <TextInput
                    style={[f.val, { flex: 1 }]}
                    placeholder="   YYYY-MM-DD"
                    placeholderTextColor="#646464"
                    value={dob}
                    onChangeText={setDob}
                    keyboardType={Platform.OS === "ios" ? "numbers-and-punctuation" : "default"}
                    maxLength={10}
                  />
                </View>
              </View>
            </Animated.View>

            {/* ID type */}
            <Animated.View entering={FadeInDown.duration(300).springify().delay(130)}>
              <SelectField
                label="identification type"
                value={idType?.label ?? ""}
                placeholder="   Choose an ID type"
                onPress={() => setPicker(true)}
              />
            </Animated.View>

            {/* ID number */}
            <Animated.View entering={FadeInDown.duration(300).springify().delay(160)}>
              <View style={f.wrap}>
                <Text style={f.label}>{idType ? `${idType.label} number` : "id number"}</Text>
                <View style={f.input}>
                  <TextInput
                    style={[f.val, { flex: 1 }]}
                    placeholder={idIsNumericType ? "   11-digit number" : "   Enter ID number"}
                    placeholderTextColor="#646464"
                    value={idNumber}
                    onChangeText={t => setIdNumber(idIsNumericType ? t.replace(/\D/g, "").slice(0, 11) : t)}
                    keyboardType={idIsNumericType ? "numeric" : "default"}
                    maxLength={idIsNumericType ? 11 : 20}
                  />
                  {idLenOk && <Feather name="check-circle" size={18} color={C.success} />}
                </View>
              </View>
            </Animated.View>

            {done && (
              <Animated.View entering={FadeInUp.duration(280)} style={s.successBox}>
                <Feather name="check-circle" size={18} color={C.success} />
                <Text style={s.successText}>Identity verification submitted!</Text>
              </Animated.View>
            )}

            <TouchableOpacity
              style={[s.submitBtn, (!canProceed || loading) && { opacity: 0.45 }]}
              onPress={submit}
              activeOpacity={0.85}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={s.submitBtnText}>Submit for Verification</Text>
              )}
            </TouchableOpacity>
          </>
        )}

      </ScrollView>

      <PickerModal visible={picker} title="Select ID Type" onSelect={setIdType} onClose={() => setPicker(false)} />
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  header:      { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingBottom: 14, backgroundColor: C.bg },
  backBtn:     { width: 44, height: 44, alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: 13, fontFamily: "Manrope_700Bold", color: C.text, textTransform: "capitalize" },
  divider:     { height: 1, backgroundColor: "#D1D1D1" },
  scroll:      { paddingHorizontal: 20, paddingTop: 20, gap: 18 },

  statusCard: { flexDirection: "row", alignItems: "center", gap: 12, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: "#EDF1F3" },
  statusIcon: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  statusLabel: { fontSize: 14, fontFamily: "Manrope_700Bold" },
  statusSub:   { fontSize: 12, fontFamily: "Manrope_400Regular", color: C.textSec, marginTop: 2 },

  successBox:  { flexDirection: "row", alignItems: "center", gap: 10, backgroundColor: "#F0FFF4", borderRadius: 10, padding: 14, borderWidth: 1, borderColor: "#BBF7D0" },
  successText: { fontSize: 13, fontFamily: "Manrope_500Medium", color: C.success },

  submitBtn:     { backgroundColor: C.black, height: 48, borderRadius: 10, alignItems: "center", justifyContent: "center", elevation: 4 },
  submitBtnText: { fontSize: 14, fontFamily: "Manrope_700Bold", color: "#FFFFFF", letterSpacing: -0.14 },
});
