import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
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
  bg:         "#FFFFFF",
  text:       "#1B1B1B",
  textSec:    "#6C7278",
  textMuted:  "#ACACAC",
  inputBg:    "#F0F0F0",
  border:     "#EDF1F3",
  summaryBg:  "#010101",
  placeholder:"#646464",
};

const FIELDS = [
  { key: "category", label: "Gift card category",           placeholder: "Select" },
  { key: "country",  label: "Gift card Country (optional)", placeholder: "Select" },
  { key: "type",     label: "Gift card Type/sub-category",  placeholder: "Select" },
  { key: "amount",   label: "Amount",                       placeholder: "200,400" },
] as const;

const RATE  = 1200;
const TOTAL = 200400;

export default function SellGiftCardScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [values, setValues] = useState<Record<string, string>>({
    category: "", country: "", type: "", amount: "",
  });

  const press = (fn: () => void) => () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    fn();
  };

  return (
    <View style={[s.root, { backgroundColor: C.bg }]}>

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <Animated.View
        entering={FadeInDown.duration(320).springify()}
        style={[s.header, { paddingTop: (insets.top || 16) + 12 }]}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={s.backBtn}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Feather name="arrow-left" size={22} color="#1E232C" />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Sell Gift Card</Text>
        <View style={{ width: 40 }} />
      </Animated.View>
      <View style={s.headerDivider} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[s.scroll, { paddingBottom: insets.bottom + 40 }]}
      >

        {/* ── Subtitle ───────────────────────────────────────────────────────── */}
        <Animated.View entering={FadeInDown.duration(340).springify().delay(60)}>
          <Text style={s.subtitle}>Kindly provide your gift card details.</Text>
        </Animated.View>

        {/* ── Input fields ───────────────────────────────────────────────────── */}
        {FIELDS.map((field, i) => (
          <Animated.View
            key={field.key}
            entering={FadeInDown.duration(340).springify().delay(80 + i * 50)}
            style={s.fieldWrap}
          >
            <Text style={s.fieldLabel}>{field.label}</Text>
            <View style={s.inputWrap}>
              <TextInput
                style={s.input}
                placeholder={field.placeholder}
                placeholderTextColor={C.placeholder}
                value={values[field.key]}
                onChangeText={val => setValues(prev => ({ ...prev, [field.key]: val }))}
                keyboardType={field.key === "amount" ? "numeric" : "default"}
              />
              <Feather name="chevron-down" size={16} color={C.textSec} style={s.chevron} />
            </View>
          </Animated.View>
        ))}

        {/* ── Upload gift card image ─────────────────────────────────────────── */}
        <Animated.View entering={FadeInDown.duration(340).springify().delay(280)} style={s.uploadSection}>
          <Text style={s.fieldLabel}>Upload gift card image</Text>
          <Text style={s.uploadHint}>You can upload multiple files at once</Text>
          <View style={s.uploadRow}>
            {[
              { bg: "#FFB6C1", icon: "image" as const,  iconColor: "#d63384" },
              { bg: "#AED6F1", icon: "image" as const,  iconColor: "#2980b9" },
              { bg: "#BBBBBB", icon: "plus"  as const,  iconColor: "#FFFFFF" },
            ].map((item, i) => (
              <TouchableOpacity key={i} style={[s.uploadCircle, { backgroundColor: item.bg }]} activeOpacity={0.8}>
                <Feather name={item.icon} size={18} color={item.iconColor} />
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* ── Rate / Total summary box ───────────────────────────────────────── */}
        <Animated.View entering={FadeInUp.duration(340).springify().delay(320)} style={s.summaryBox}>
          <View style={s.summaryRow}>
            <Text style={s.summaryLabel}>Rate</Text>
            <Text style={s.summaryValue}>₦{RATE.toLocaleString("en-NG")}</Text>
          </View>
          <View style={s.summaryDivider} />
          <View style={s.summaryRow}>
            <Text style={s.summaryLabel}>Total:</Text>
            <Text style={[s.summaryValue, { fontSize: 15, fontFamily: "Manrope_700Bold" }]}>
              ₦{TOTAL.toLocaleString("en-NG")}
            </Text>
          </View>
        </Animated.View>

        {/* ── Proceed button ─────────────────────────────────────────────────── */}
        <Animated.View entering={FadeInUp.duration(340).springify().delay(360)}>
          <TouchableOpacity
            style={s.proceedBtn}
            onPress={press(() => router.push("/(app)/confirm-transaction"))}
            activeOpacity={0.85}
          >
            <Text style={s.proceedBtnText}>Proceed</Text>
          </TouchableOpacity>
        </Animated.View>

      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#FFFFFF" },

  header: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 20, paddingBottom: 16, backgroundColor: "#FFFFFF",
  },
  backBtn:     { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  headerTitle: {
    fontSize: 13, fontFamily: "Manrope_700Bold", color: "#000000",
    textAlign: "center", flex: 1, textTransform: "capitalize",
  },
  headerDivider: { height: 1, backgroundColor: "#D1D1D1" },

  scroll: { paddingHorizontal: 20, paddingTop: 16, gap: 16 },

  subtitle: {
    fontSize: 12, fontFamily: "Manrope_500Medium", color: "#6C7278", letterSpacing: 0.24,
  },

  fieldWrap: { gap: 4 },
  fieldLabel: {
    fontSize: 12, fontFamily: "Manrope_500Medium", color: "#6C7278",
    letterSpacing: -0.24, textTransform: "capitalize",
  },
  inputWrap: {
    backgroundColor: "#F0F0F0", height: 46, borderRadius: 10, borderWidth: 1,
    borderColor: "#EDF1F3", flexDirection: "row", alignItems: "center",
    paddingHorizontal: 14,
  },
  input: {
    flex: 1, fontSize: 10, fontFamily: "Manrope_500Medium", color: "#646464",
  },
  chevron: { marginLeft: 8 },

  uploadSection: { gap: 6 },
  uploadHint: { fontSize: 6, fontFamily: "Manrope_500Medium", color: "#ACACAC" },
  uploadRow: { flexDirection: "row", gap: 10, alignItems: "center", marginTop: 4 },
  uploadCircle: {
    width: 49, height: 49, borderRadius: 24.5, alignItems: "center", justifyContent: "center",
  },

  summaryBox: {
    backgroundColor: "#010101", borderRadius: 10, paddingHorizontal: 16, paddingVertical: 4,
  },
  summaryRow: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 12,
  },
  summaryDivider: { height: 1, backgroundColor: "rgba(233,233,233,0.25)" },
  summaryLabel: { fontSize: 10, fontFamily: "Manrope_500Medium", color: "#FFFFFF" },
  summaryValue: { fontSize: 10, fontFamily: "Manrope_700Bold",   color: "#FFFFFF" },

  proceedBtn: {
    backgroundColor: "#000000", height: 48, borderRadius: 10,
    alignItems: "center", justifyContent: "center",
    shadowColor: "#000000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.18, shadowRadius: 4, elevation: 4,
  },
  proceedBtnText: { fontSize: 14, fontFamily: "Manrope_700Bold", color: "#FFFFFF" },
});
