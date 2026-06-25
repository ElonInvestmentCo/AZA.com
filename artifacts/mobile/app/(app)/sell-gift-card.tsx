import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { AnimatedSheet } from "@/components/AnimatedSheet";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
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
  muted2:    "#ACACAC",
  inputBg:   "#F0F0F0",
  border:    "#EDF1F3",
  black:     "#000000",
  dark:      "#010101",
};

const CATEGORIES = ["Amazon", "iTunes", "Steam", "Google Play", "Visa Gift Card", "Vanilla", "eBay", "Walmart"];
const COUNTRIES   = ["United States", "United Kingdom", "Canada", "Australia", "Germany", "France"];
const TYPES       = ["Physical Card", "E-Code", "Physical + E-Code"];
const RATE        = 1200;

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
    borderRadius: 10, paddingHorizontal: 14, height: 48,
    shadowColor: "rgba(228,229,231,0.24)", shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1, shadowRadius: 2, elevation: 1,
  },
  val: { fontSize: 13, fontFamily: "Manrope_500Medium", color: C.text, flex: 1 },
  ph:  { color: "#646464", fontSize: 10 },
});

type PickerKey = "category" | "country" | "type";

const PICKER_CONFIG: Record<PickerKey, { title: string; options: string[] }> = {
  category: { title: "Select Gift Card Category", options: CATEGORIES },
  country:  { title: "Select Country",            options: COUNTRIES   },
  type:     { title: "Select Type",               options: TYPES       },
};

function PickerModal({
  pickerKey, onSelect, onClose,
}: {
  pickerKey: PickerKey | null;
  onSelect: (key: PickerKey, v: string) => void;
  onClose: () => void;
}) {
  const cfg = pickerKey ? PICKER_CONFIG[pickerKey] : null;
  return (
    <AnimatedSheet visible={pickerKey !== null} onClose={onClose} maxHeight="60%">
      <View style={pm.handle} />
      <Text style={pm.title}>{cfg?.title ?? ""}</Text>
      <ScrollView showsVerticalScrollIndicator={false}>
        {(cfg?.options ?? []).map(o => (
          <TouchableOpacity
            key={o}
            style={pm.option}
            onPress={() => {
              Haptics.selectionAsync();
              if (pickerKey) onSelect(pickerKey, o);
              onClose();
            }}
          >
            <Text style={pm.optText}>{o}</Text>
            <Feather name="check" size={14} color="#7C3AED" />
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

export default function SellGiftCardScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 20 : insets.top;

  const [category,   setCategory]   = useState("");
  const [country,    setCountry]    = useState("");
  const [type,       setType]       = useState("");
  const [amountRaw,  setAmountRaw]  = useState(""); // raw digit string
  const [amountFmt,  setAmountFmt]  = useState(""); // formatted with commas
  const [picker,     setPicker]     = useState<PickerKey | null>(null);

  const handleAmountChange = (t: string) => {
    const raw = t.replace(/\D/g, "");
    setAmountRaw(raw);
    setAmountFmt(raw ? parseInt(raw, 10).toLocaleString("en-US") : "");
  };

  const cardAmountUSD = amountRaw ? parseInt(amountRaw, 10) : 200;
  const total         = cardAmountUSD * RATE;

  return (
    <View style={s.root}>

      {/* Header */}
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
        <Text style={s.headerTitle}>Sell Gift Card</Text>
        <View style={{ width: 44 }} />
      </Animated.View>
      <View style={s.divider} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[s.scroll, { paddingBottom: insets.bottom + 40 }]}
      >

        <Animated.View entering={FadeInDown.duration(300).springify().delay(30)}>
          <Text style={s.subtitle}>Kindly provide your gift card details.</Text>
        </Animated.View>

        {/* Category */}
        <Animated.View entering={FadeInDown.duration(300).springify().delay(60)}>
          <SelectField label="Gift card category" value={category} placeholder="   Select" onPress={() => setPicker("category")} />
        </Animated.View>

        {/* Country */}
        <Animated.View entering={FadeInDown.duration(300).springify().delay(90)}>
          <SelectField label="Gift card Country (optional)" value={country} placeholder="   Select" onPress={() => setPicker("country")} />
        </Animated.View>

        {/* Type */}
        <Animated.View entering={FadeInDown.duration(300).springify().delay(120)}>
          <SelectField label="gift card Type/sub-category" value={type} placeholder="   Select" onPress={() => setPicker("type")} />
        </Animated.View>

        {/* Amount */}
        <Animated.View entering={FadeInDown.duration(300).springify().delay(150)}>
          <View style={f.wrap}>
            <Text style={f.label}>amount (USD)</Text>
            <View style={f.input}>
              <Text style={{ fontSize: 13, fontFamily: "Manrope_600SemiBold", color: C.textMuted, marginRight: 4 }}>$</Text>
              <TextInput
                style={{ flex: 1, fontSize: 13, fontFamily: "Manrope_500Medium", color: C.text }}
                placeholder="0"
                placeholderTextColor={C.textMuted}
                value={amountFmt}
                onChangeText={handleAmountChange}
                keyboardType="number-pad"
                returnKeyType="done"
                textContentType="none"
                autoComplete="off"
              />
            </View>
            {amountRaw && (
              <Text style={s.rateHint}>
                ≈ ₦{total.toLocaleString("en-NG")} at ₦{RATE.toLocaleString("en-NG")} / $1
              </Text>
            )}
          </View>
        </Animated.View>

        {/* Upload */}
        <Animated.View entering={FadeInDown.duration(300).springify().delay(180)} style={s.uploadSection}>
          <Text style={f.label}>upload gift card image</Text>
          <Text style={s.uploadHint}>You can upload multiple files at once</Text>
          <View style={s.uploadRow}>
            <View style={[s.thumb, { backgroundColor: "#FFB6C1" }]}>
              <Feather name="image" size={20} color="#C0392B" />
            </View>
            <View style={[s.thumb, { backgroundColor: "#AED6F1" }]}>
              <Feather name="image" size={20} color="#2980B9" />
            </View>
            <View style={[s.thumb, { backgroundColor: "#BBBBBB" }]}>
              <Feather name="plus" size={18} color="#fff" />
            </View>
          </View>
        </Animated.View>

        {/* Summary */}
        <Animated.View entering={FadeInUp.duration(300).springify().delay(210)} style={s.summaryBox}>
          <View style={s.summaryRow}>
            <Text style={s.summaryLabel}>Rate</Text>
            <Text style={s.summaryValue}>₦{RATE.toLocaleString("en-NG")} / $1</Text>
          </View>
          <View style={s.summaryLine} />
          <View style={s.summaryRow}>
            <Text style={s.summaryLabel}>Total:</Text>
            <Text style={[s.summaryValue, { fontSize: 15, fontFamily: "Manrope_700Bold" }]}>
              ₦{total.toLocaleString("en-NG")}
            </Text>
          </View>
        </Animated.View>

        {/* Proceed */}
        <Animated.View entering={FadeInUp.duration(300).springify().delay(240)}>
          <TouchableOpacity
            style={s.proceedBtn}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push("/(app)/confirm-transaction" as any);
            }}
            activeOpacity={0.85}
          >
            <Text style={s.proceedBtnText}>Proceed</Text>
          </TouchableOpacity>
        </Animated.View>

      </ScrollView>

      <PickerModal
        pickerKey={picker}
        onSelect={(key, value) => {
          if (key === "category") setCategory(value);
          else if (key === "country") setCountry(value);
          else if (key === "type") setType(value);
        }}
        onClose={() => setPicker(null)}
      />
    </View>
  );
}

const s = StyleSheet.create({
  root:        { flex: 1, backgroundColor: C.bg },
  header:      { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingBottom: 14, backgroundColor: C.bg },
  backBtn:     { width: 44, height: 44, alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: 13, fontFamily: "Manrope_700Bold", color: C.text, textTransform: "capitalize" },
  divider:     { height: 1, backgroundColor: "#D1D1D1" },
  scroll:      { paddingHorizontal: 20, paddingTop: 20, gap: 18 },
  subtitle:    { fontSize: 12, fontFamily: "Manrope_500Medium", color: C.textMuted, letterSpacing: 0.24 },

  rateHint: { fontSize: 11, fontFamily: "Manrope_400Regular", color: C.textMuted, marginTop: 4, paddingLeft: 2 },

  uploadSection: { gap: 6 },
  uploadHint:    { fontSize: 6, fontFamily: "Manrope_500Medium", color: C.muted2 },
  uploadRow:     { flexDirection: "row", gap: 10 },
  thumb:         { width: 49, height: 49, borderRadius: 24.5, alignItems: "center", justifyContent: "center" },

  summaryBox: {
    backgroundColor: C.dark, borderRadius: 10,
    paddingHorizontal: 18, paddingVertical: 2,
  },
  summaryRow:   { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 14 },
  summaryLine:  { height: 1, backgroundColor: "#E9E9E9" },
  summaryLabel: { fontSize: 10, fontFamily: "Manrope_500Medium", color: "#FFFFFF", letterSpacing: -0.1 },
  summaryValue: { fontSize: 10, fontFamily: "Manrope_700Bold", color: "#FFFFFF" },

  proceedBtn: {
    backgroundColor: C.black, height: 48, borderRadius: 10,
    alignItems: "center", justifyContent: "center",
    shadowColor: "rgba(37,62,167,0.48)", shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1, shadowRadius: 2, elevation: 4,
  },
  proceedBtnText: { fontSize: 14, fontFamily: "Manrope_700Bold", color: "#FFFFFF", letterSpacing: -0.14 },
});
