import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const BG      = "#FFFFFF";
const TEXT    = "#0B0A0A";
const TEXTSEC = "#595F67";
const MUTED   = "#6C7278";
const BORDER  = "#EDF1F3";
const INPUTBG = "#F0F0F0";
const DARK    = "#010101";

const CATEGORIES = ["Amazon", "iTunes", "Steam", "Google Play", "Netflix", "Xbox", "Vanilla Visa", "eBay"];
const COUNTRIES  = ["USA", "UK", "Canada", "Australia", "Germany", "France"];
const TYPES      = ["Physical", "Digital", "E-Code", "Subscription"];
const AMOUNTS    = ["$25", "$50", "$100", "$200", "$500"];

function DropdownField({
  label,
  value,
  onPress,
}: {
  label: string;
  value: string;
  onPress: () => void;
}) {
  return (
    <View style={df.wrap}>
      <Text style={df.label}>{label}</Text>
      <TouchableOpacity style={df.field} onPress={onPress} activeOpacity={0.8}>
        <Text style={[df.value, !value && df.placeholder]}>{value || `Select ${label}`}</Text>
        <Feather name="chevron-down" size={18} color={MUTED} />
      </TouchableOpacity>
    </View>
  );
}

const df = StyleSheet.create({
  wrap:        { gap: 6 },
  label:       { fontSize: 12, fontFamily: "Manrope_500Medium", color: MUTED, paddingLeft: 2 },
  field:       {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    backgroundColor: INPUTBG, borderWidth: 1.5, borderColor: BORDER,
    borderRadius: 10, paddingHorizontal: 16, paddingVertical: 14,
  },
  value:       { fontSize: 14, fontFamily: "Manrope_500Medium", color: TEXT },
  placeholder: { color: MUTED },
});

function PickerModal({
  visible,
  title,
  options,
  onSelect,
  onClose,
}: {
  visible: boolean;
  title: string;
  options: string[];
  onSelect: (v: string) => void;
  onClose: () => void;
}) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={pm.overlay} onPress={onClose} />
      <View style={pm.sheet}>
        <View style={pm.handle} />
        <Text style={pm.title}>{title}</Text>
        <ScrollView showsVerticalScrollIndicator={false}>
          {options.map((o) => (
            <TouchableOpacity
              key={o}
              style={pm.option}
              onPress={() => { Haptics.selectionAsync(); onSelect(o); onClose(); }}
            >
              <Text style={pm.optText}>{o}</Text>
              <Feather name="chevron-right" size={16} color={MUTED} />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </Modal>
  );
}

const pm = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)" },
  sheet:   {
    backgroundColor: BG, borderTopLeftRadius: 20, borderTopRightRadius: 20,
    paddingHorizontal: 24, paddingTop: 16, paddingBottom: 40, maxHeight: "60%",
  },
  handle:  { width: 40, height: 4, borderRadius: 2, backgroundColor: BORDER, alignSelf: "center", marginBottom: 16 },
  title:   { fontSize: 16, fontFamily: "Manrope_700Bold", color: TEXT, marginBottom: 12 },
  option:  {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: BORDER,
  },
  optText: { fontSize: 15, fontFamily: "Manrope_500Medium", color: TEXT },
});

export default function SellGiftCardScreen() {
  const router  = useRouter();
  const insets  = useSafeAreaInsets();
  const { card } = useLocalSearchParams<{ card: string }>();
  const topPad  = Platform.OS === "web" ? 20 : insets.top;

  const [category, setCategory] = useState(card ?? "");
  const [country,  setCountry]  = useState("");
  const [type,     setType]     = useState("");
  const [amount,   setAmount]   = useState("");
  const [picker,   setPicker]   = useState<"category" | "country" | "type" | "amount" | null>(null);

  const RATE       = 1200;
  const amtNum     = amount ? parseInt(amount.replace("$", ""), 10) : 0;
  const total      = amtNum * RATE;
  const canProceed = !!category && !!type && !!amount;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: BG }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* Header */}
      <View style={[hdr.wrap, { paddingTop: topPad + 12 }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={hdr.back}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Feather name="arrow-left" size={22} color="#1E232C" />
        </TouchableOpacity>
        <Text style={hdr.title}>Sell Gift Card</Text>
        <View style={{ width: 40 }} />
      </View>
      <View style={hdr.divider} />

      <ScrollView
        contentContainerStyle={sc.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <DropdownField label="Gift card category"           value={category} onPress={() => setPicker("category")} />
        <DropdownField label="Gift card Country (optional)" value={country}  onPress={() => setPicker("country")}  />
        <DropdownField label="Gift card Type/sub-category"  value={type}     onPress={() => setPicker("type")}     />
        <DropdownField label="Amount"                       value={amount}   onPress={() => setPicker("amount")}   />

        {/* Upload */}
        <View style={up.wrap}>
          <Text style={up.label}>Gift card image</Text>
          <View style={up.row}>
            {(["#FFB6C1", "#AED6F1", "#A9DFBF"] as const).map((bg, i) => (
              <View key={i} style={[up.circle, { backgroundColor: bg }]}>
                <Feather name="image" size={16} color="#FFFFFF" />
              </View>
            ))}
            <View style={up.add}>
              <Feather name="plus" size={20} color="#FFFFFF" />
            </View>
          </View>
        </View>

        {/* Summary */}
        <View style={sb.box}>
          <View style={sb.row}>
            <Text style={sb.label}>Rate</Text>
            <Text style={sb.value}>₦{RATE.toLocaleString("en-NG")}</Text>
          </View>
          <View style={sb.line} />
          <View style={sb.row}>
            <Text style={sb.label}>Total:</Text>
            <Text style={[sb.value, sb.total]}>₦{total.toLocaleString("en-NG")}</Text>
          </View>
        </View>

        {/* Proceed */}
        <TouchableOpacity
          style={[btn.wrap, !canProceed && { opacity: 0.45 }]}
          onPress={() => {
            if (!canProceed) return;
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            router.push("/(app)/confirm-transaction");
          }}
          activeOpacity={0.85}
        >
          <Text style={btn.text}>Proceed</Text>
        </TouchableOpacity>
      </ScrollView>

      <PickerModal visible={picker === "category"} title="Gift Card Category" options={CATEGORIES} onSelect={setCategory} onClose={() => setPicker(null)} />
      <PickerModal visible={picker === "country"}  title="Country"            options={COUNTRIES}  onSelect={setCountry}  onClose={() => setPicker(null)} />
      <PickerModal visible={picker === "type"}     title="Gift Card Type"     options={TYPES}      onSelect={setType}     onClose={() => setPicker(null)} />
      <PickerModal visible={picker === "amount"}   title="Amount"             options={AMOUNTS}    onSelect={setAmount}   onClose={() => setPicker(null)} />
    </KeyboardAvoidingView>
  );
}

const hdr = StyleSheet.create({
  wrap:    { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingBottom: 16, backgroundColor: BG },
  back:    { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  title:   { fontSize: 13, fontFamily: "Manrope_700Bold", color: TEXT, textAlign: "center" },
  divider: { height: 1, backgroundColor: "#D1D1D1" },
});

const sc = StyleSheet.create({
  content: { padding: 20, gap: 18, paddingBottom: 48 },
});

const up = StyleSheet.create({
  wrap:   { gap: 8 },
  label:  { fontSize: 12, fontFamily: "Manrope_500Medium", color: MUTED },
  row:    { flexDirection: "row", gap: 10, alignItems: "center" },
  circle: { width: 49, height: 49, borderRadius: 24.5, alignItems: "center", justifyContent: "center" },
  add:    { width: 49, height: 49, borderRadius: 24.5, backgroundColor: "#BBBBBB", alignItems: "center", justifyContent: "center" },
});

const sb = StyleSheet.create({
  box:   { backgroundColor: DARK, borderRadius: 10, paddingHorizontal: 16, paddingVertical: 4 },
  row:   { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 12 },
  line:  { height: 1, backgroundColor: "rgba(233,233,233,0.25)" },
  label: { fontSize: 10, fontFamily: "Manrope_500Medium", color: "#FFFFFF" },
  value: { fontSize: 10, fontFamily: "Manrope_700Bold",   color: "#FFFFFF" },
  total: { fontSize: 15, fontFamily: "Manrope_700Bold" },
});

const btn = StyleSheet.create({
  wrap: {
    backgroundColor: "#000000", height: 48, borderRadius: 10,
    alignItems: "center", justifyContent: "center",
  },
  text: { fontSize: 14, fontFamily: "Manrope_700Bold", color: "#FFFFFF" },
});
