import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
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

const C = {
  bg:        "#FFFFFF",
  text:      "#1B1B1B",
  navy:      "#061941",
  textSec:   "#595F67",
  textMuted: "#6C7278",
  inputBg:   "#F7F8F9",
  border:    "#E8ECF4",
  black:     "#000000",
};

const CATEGORIES = ["Amazon", "iTunes", "Steam", "Google Play", "Visa Gift Card", "Vanilla", "eBay", "Walmart"];
const COUNTRIES   = ["United States", "United Kingdom", "Canada", "Australia", "Germany", "France"];
const TYPES       = ["Physical Card", "E-Code", "Physical + E-Code"];

const RATE  = 1200;

function SelectField({
  label, value, placeholder, onPress,
}: { label: string; value: string; placeholder: string; onPress: () => void }) {
  return (
    <View style={sf.wrap}>
      <Text style={sf.label}>{label}</Text>
      <TouchableOpacity style={sf.field} onPress={onPress} activeOpacity={0.8}>
        <Text style={[sf.value, !value && sf.ph]}>{value || placeholder}</Text>
        <Feather name="chevron-down" size={16} color={C.textMuted} />
      </TouchableOpacity>
    </View>
  );
}

const sf = StyleSheet.create({
  wrap:  { gap: 7 },
  label: { fontSize: 13, fontFamily: "Manrope_600SemiBold", color: C.text, textTransform: "capitalize" },
  field: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    backgroundColor: C.inputBg, borderWidth: 1.5, borderColor: C.border,
    borderRadius: 12, paddingHorizontal: 14, height: 50,
  },
  value: { fontSize: 14, fontFamily: "Manrope_500Medium", color: C.text },
  ph:    { color: C.textMuted, fontSize: 13 },
});

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
              <Feather name="check" size={14} color="#7C3AED" />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </Modal>
  );
}

const pm = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.45)" },
  sheet: {
    backgroundColor: "#fff", borderTopLeftRadius: 24, borderTopRightRadius: 24,
    paddingHorizontal: 24, paddingTop: 16, paddingBottom: 40, maxHeight: "60%",
  },
  handle: {
    width: 40, height: 4, borderRadius: 2, backgroundColor: C.border,
    alignSelf: "center", marginBottom: 16,
  },
  title:   { fontSize: 16, fontFamily: "Manrope_700Bold", color: C.text, marginBottom: 12 },
  option:  {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: C.border,
  },
  optText: { fontSize: 15, fontFamily: "Manrope_500Medium", color: C.text },
});

export default function SellGiftCardScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [category, setCategory] = useState("");
  const [country,  setCountry]  = useState("");
  const [type,     setType]     = useState("");
  const [amount,   setAmount]   = useState("");
  const [picker,   setPicker]   = useState<"category" | "country" | "type" | null>(null);

  const total = amount ? parseInt(amount.replace(/,/g, "")) * RATE : RATE * 200;

  const press = (fn: () => void) => () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    fn();
  };

  return (
    <View style={[s.root]}>

      {/* Header */}
      <Animated.View
        entering={FadeInDown.duration(280).springify()}
        style={[s.header, { paddingTop: (Platform.OS === "web" ? 20 : insets.top) + 10 }]}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={s.backBtn}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Feather name="arrow-left" size={22} color={C.navy} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Sell Gift Card</Text>
        <View style={{ width: 44 }} />
      </Animated.View>
      <View style={s.headerDivider} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[s.scroll, { paddingBottom: insets.bottom + 40 }]}
      >

        <Animated.View entering={FadeInDown.duration(300).springify().delay(40)}>
          <Text style={s.subtitle}>Kindly provide your gift card details to get started.</Text>
        </Animated.View>

        {/* Category */}
        <Animated.View entering={FadeInDown.duration(300).springify().delay(70)}>
          <SelectField
            label="Gift card category"
            value={category}
            placeholder="Select category"
            onPress={() => setPicker("category")}
          />
        </Animated.View>

        {/* Country */}
        <Animated.View entering={FadeInDown.duration(300).springify().delay(100)}>
          <SelectField
            label="Gift card Country (optional)"
            value={country}
            placeholder="Select country"
            onPress={() => setPicker("country")}
          />
        </Animated.View>

        {/* Type */}
        <Animated.View entering={FadeInDown.duration(300).springify().delay(130)}>
          <SelectField
            label="Gift card Type / sub-category"
            value={type}
            placeholder="Select type"
            onPress={() => setPicker("type")}
          />
        </Animated.View>

        {/* Amount */}
        <Animated.View entering={FadeInDown.duration(300).springify().delay(160)}>
          <View style={sf.wrap}>
            <Text style={sf.label}>Amount</Text>
            <View style={[sf.field]}>
              <Text style={{ fontSize: 14, fontFamily: "Manrope_600SemiBold", color: C.textMuted, marginRight: 6 }}>$</Text>
              <TextInput
                style={{ flex: 1, fontSize: 14, fontFamily: "Manrope_500Medium", color: C.text }}
                placeholder="200,400"
                placeholderTextColor={C.textMuted}
                value={amount}
                onChangeText={t => setAmount(t.replace(/[^0-9,]/g, ""))}
                keyboardType="numeric"
              />
            </View>
          </View>
        </Animated.View>

        {/* Upload */}
        <Animated.View entering={FadeInDown.duration(300).springify().delay(190)} style={s.uploadSection}>
          <Text style={sf.label}>Upload gift card image</Text>
          <Text style={s.uploadHint}>You can upload multiple files at once</Text>
          <View style={s.uploadRow}>
            {[
              { bg: "#FFB6C1", iconColor: "#C0392B" },
              { bg: "#AED6F1", iconColor: "#2980B9" },
            ].map((item, i) => (
              <View key={i} style={[s.uploadThumb, { backgroundColor: item.bg }]}>
                <Feather name="image" size={20} color={item.iconColor} />
              </View>
            ))}
            <TouchableOpacity
              style={[s.uploadThumb, { backgroundColor: C.inputBg, borderWidth: 2, borderColor: C.border, borderStyle: "dashed" }]}
              activeOpacity={0.8}
            >
              <Feather name="plus" size={20} color={C.textMuted} />
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Rate / Total summary */}
        <Animated.View entering={FadeInUp.duration(300).springify().delay(220)} style={s.summaryBox}>
          <View style={s.summaryRow}>
            <Text style={s.summaryLabel}>Rate</Text>
            <Text style={s.summaryValue}>₦{RATE.toLocaleString("en-NG")}</Text>
          </View>
          <View style={s.summaryDivider} />
          <View style={s.summaryRow}>
            <Text style={s.summaryLabel}>Total:</Text>
            <Text style={[s.summaryValue, { fontSize: 15, fontFamily: "Manrope_700Bold" }]}>
              ₦{total.toLocaleString("en-NG")}
            </Text>
          </View>
        </Animated.View>

        {/* Proceed */}
        <Animated.View entering={FadeInUp.duration(300).springify().delay(250)}>
          <TouchableOpacity
            style={s.proceedBtn}
            onPress={press(() => router.push("/(app)/confirm-transaction"))}
            activeOpacity={0.85}
          >
            <Text style={s.proceedBtnText}>Proceed</Text>
          </TouchableOpacity>
        </Animated.View>

      </ScrollView>

      <PickerModal
        visible={picker === "category"}
        title="Select Gift Card Category"
        options={CATEGORIES}
        onSelect={setCategory}
        onClose={() => setPicker(null)}
      />
      <PickerModal
        visible={picker === "country"}
        title="Select Country"
        options={COUNTRIES}
        onSelect={setCountry}
        onClose={() => setPicker(null)}
      />
      <PickerModal
        visible={picker === "type"}
        title="Select Type"
        options={TYPES}
        onSelect={setType}
        onClose={() => setPicker(null)}
      />
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },

  header: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 20, paddingBottom: 14, backgroundColor: C.bg,
  },
  backBtn:     { width: 44, height: 44, alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: 16, fontFamily: "Manrope_700Bold", color: C.navy, textAlign: "center" },
  headerDivider: { height: 1, backgroundColor: C.border },

  scroll: { paddingHorizontal: 20, paddingTop: 20, gap: 18 },

  subtitle: { fontSize: 13, fontFamily: "Manrope_400Regular", color: C.textSec },

  uploadSection: { gap: 7 },
  uploadHint:    { fontSize: 11, fontFamily: "Manrope_400Regular", color: C.textMuted },
  uploadRow:     { flexDirection: "row", gap: 10, alignItems: "center" },
  uploadThumb:   {
    width: 56, height: 56, borderRadius: 14, alignItems: "center", justifyContent: "center",
  },

  summaryBox: {
    backgroundColor: "#0A0A0A", borderRadius: 12, paddingHorizontal: 18, paddingVertical: 6,
  },
  summaryRow: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 13,
  },
  summaryDivider: { height: 1, backgroundColor: "rgba(255,255,255,0.1)" },
  summaryLabel:   { fontSize: 13, fontFamily: "Manrope_400Regular", color: "rgba(255,255,255,0.7)" },
  summaryValue:   { fontSize: 13, fontFamily: "Manrope_700Bold", color: "#FFFFFF" },

  proceedBtn: {
    backgroundColor: C.black, height: 54, borderRadius: 12,
    alignItems: "center", justifyContent: "center",
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3, shadowRadius: 6, elevation: 4,
  },
  proceedBtnText: { fontSize: 15, fontFamily: "Manrope_700Bold", color: "#FFFFFF" },
});
