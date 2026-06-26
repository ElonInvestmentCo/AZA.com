import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { scheduleTradeSubmitted, scheduleTradeCompleted } from "@/services/notifications";
import React from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { rf } from "@/utils/responsive";

const C = {
  bg:        "#FFFFFF",
  text:      "#1B1B1B",
  textSec:   "#6C7278",
  border:    "#D1D1D1",
  borderSoft:"#E9E9E9",
  dark:      "#010101",
  black:     "#000000",
};

const DETAILS = [
  { label: "Date & Time",                  value: "Aug 06, 2024 — 6:17 PM",    right: "Total Amount" },
  { label: "Gift Card Category",           value: "Amazon",                   right: "Australia Amazon" },
  { label: "Gift card Type/sub-category",  value: "Australia Amazon",         right: null },
  { label: "Gift card Amount",             value: "Aug 06, 2024 — 6:17 PM",  right: null },
];

const ROWS = [
  { left: { label: "Date & Time",    value: "Aug 06, 2024 — 6:17 PM"  }, right: { label: "Total Amount",    value: "₦200,040" } },
  { left: { label: "Gift Card Category", value: "Amazon" },               right: { label: "Gift card Type/sub-category", value: "Australia Amazon" } },
  { left: { label: "Gift card Amount",   value: "Aug 06, 2024 — 6:17PM" }, right: null },
];

export default function ConfirmTransactionScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 20 : insets.top;

  return (
    <View style={s.root}>

      {/* Header */}
      <Animated.View
        entering={FadeInDown.duration(280).springify()}
        style={[s.header, { paddingTop: topPad + 10 }]}
      >
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
          <Feather name="arrow-left" size={22} color="#1E232C" />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Confirm transaction Details</Text>
        <View style={{ width: 44 }} />
      </Animated.View>
      <View style={s.topDivider} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[s.scroll, { paddingBottom: insets.bottom + 40 }]}
      >

        {/* Detail rows */}
        <Animated.View entering={FadeInDown.duration(320).springify().delay(40)} style={s.detailCard}>
          {ROWS.map((row, i) => (
            <View key={i}>
              <View style={s.pairRow}>
                <View style={s.pairCell}>
                  <Text style={s.detailLabel}>{row.left.label}</Text>
                  <Text style={s.detailValue}>{row.left.value}</Text>
                </View>
                {row.right && (
                  <View style={[s.pairCell, { alignItems: "flex-end" }]}>
                    <Text style={s.detailLabel}>{row.right.label}</Text>
                    <Text style={[s.detailValue, { textAlign: "right" }]}>{row.right.value}</Text>
                  </View>
                )}
              </View>
              {i < ROWS.length - 1 && <View style={s.rowDivider} />}
            </View>
          ))}
        </Animated.View>

        {/* Gift card image */}
        <Animated.View entering={FadeInDown.duration(300).springify().delay(80)}>
          <Text style={s.imgLabel}>gift card image</Text>
          <View style={s.imgRow}>
            <View style={[s.imgThumb, { backgroundColor: "#FFB6C1" }]}>
              <Feather name="image" size={18} color="#C0392B" />
            </View>
            <View style={[s.imgThumb, { backgroundColor: "#AED6F1" }]}>
              <Feather name="image" size={18} color="#2980B9" />
            </View>
            <View style={[s.imgThumb, { backgroundColor: "#BBBBBB" }]}>
              <Feather name="plus" size={16} color="#fff" />
            </View>
          </View>
        </Animated.View>

        {/* Summary */}
        <Animated.View entering={FadeInUp.duration(300).springify().delay(120)} style={s.summaryBox}>
          <View style={s.summaryRow}>
            <Text style={s.summaryLabel}>Rate</Text>
            <Text style={s.summaryValue}>₦1200</Text>
          </View>
          <View style={s.summaryLine} />
          <View style={s.summaryRow}>
            <Text style={s.summaryLabel}>Total:</Text>
            <Text style={[s.summaryValue, { fontSize: 15, fontFamily: "Manrope_700Bold" }]}>₦200,400</Text>
          </View>
        </Animated.View>

        {/* Submit */}
        <Animated.View entering={FadeInUp.duration(300).springify().delay(160)}>
          <TouchableOpacity
            style={s.submitBtn}
            onPress={() => {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              scheduleTradeSubmitted("Amazon Gift Card", "$200");
              scheduleTradeCompleted("Amazon Gift Card", "₦200,040", 30);
              router.push("/(app)/submitted" as any);
            }}
            activeOpacity={0.85}
          >
            <Text style={s.submitBtnText}>Submit Trade</Text>
          </TouchableOpacity>
        </Animated.View>

      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root:        { flex: 1, backgroundColor: C.bg },
  header:      { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingBottom: 14 },
  backBtn:     { width: 44, height: 44, alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: 13, fontFamily: "Manrope_700Bold", color: C.text, textTransform: "capitalize" },
  topDivider:  { height: 1, backgroundColor: C.border },
  scroll:      { paddingHorizontal: 20, paddingTop: 24, gap: 20 },

  detailCard:  { borderRadius: 12, borderWidth: 1, borderColor: "#EEEEEE", backgroundColor: C.bg, overflow: "hidden" },
  pairRow:     { paddingHorizontal: 16, paddingVertical: 14, flexDirection: "row", justifyContent: "space-between" },
  pairCell:    { flex: 1, gap: 4 },
  rowDivider:  { height: 1, backgroundColor: "#F5F5F5" },
  detailLabel: { fontSize: 12, fontFamily: "Manrope_500Medium", color: C.textSec, letterSpacing: 0.24 },
  detailValue: { fontSize: 12, fontFamily: "Manrope_700Bold", color: C.text, letterSpacing: 0.24 },

  imgLabel: { fontSize: 12, fontFamily: "Manrope_500Medium", color: C.textSec, textTransform: "capitalize", letterSpacing: 0.24, marginBottom: 10 },
  imgRow:   { flexDirection: "row", gap: 10 },
  imgThumb: { width: 49, height: 49, borderRadius: 24.5, alignItems: "center", justifyContent: "center" },

  summaryBox:   { backgroundColor: C.dark, borderRadius: 10, paddingHorizontal: 18, paddingVertical: 2 },
  summaryRow:   { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 14 },
  summaryLine:  { height: 1, backgroundColor: C.borderSoft },
  summaryLabel: { fontSize: 10, fontFamily: "Manrope_500Medium", color: "#FFFFFF", letterSpacing: -0.1 },
  summaryValue: { fontSize: 10, fontFamily: "Manrope_700Bold", color: "#FFFFFF" },

  submitBtn:     { backgroundColor: C.black, height: 48, borderRadius: 10, alignItems: "center", justifyContent: "center", elevation: 4 },
  submitBtnText: { fontSize: rf(14), fontFamily: "Manrope_700Bold", color: "#FFFFFF", letterSpacing: -0.14 },
});
