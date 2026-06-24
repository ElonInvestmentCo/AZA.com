import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@/context/AuthContext";

const C = {
  bg:        "#FFFFFF",
  text:      "#1B1B1B",
  textSec:   "#6C7278",
  border:    "#D1D1D1",
  rowBorder: "#F0F0F0",
  summaryBg: "#010101",
};

const RATE  = 1200;
const TOTAL = 200040;

const now = new Date();
const DATE_STR =
  now.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }).replace(/ /g, " ") +
  " - " +
  now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });

const ROWS = [
  { label: "Date & Time",                 value: DATE_STR,          right: false },
  { label: "Total Amount",                value: "₦200,040",        right: true  },
  { label: "Gift Card Category",          value: "Amazon",          right: false },
  { label: "Gift card Type/sub-category", value: "Australia Amazon",right: true  },
  { label: "Gift card Amount",            value: "Aug 06,2024 -6:17PM", right: false },
];

export default function ConfirmTransactionScreen() {
  const router          = useRouter();
  const insets          = useSafeAreaInsets();
  const { updateBalance } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setLoading(true);
    setTimeout(() => {
      updateBalance(TOTAL);
      setLoading(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace("/(app)/submitted");
    }, 1500);
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
        <Text style={s.headerTitle}>Confirm transaction Details</Text>
        <View style={{ width: 40 }} />
      </Animated.View>
      <View style={s.headerDivider} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[s.scroll, { paddingBottom: insets.bottom + 40 }]}
      >

        {/* ── Transaction detail rows ────────────────────────────────────────── */}
        <Animated.View
          entering={FadeInDown.duration(360).springify().delay(60)}
          style={s.detailCard}
        >
          {ROWS.map((row, i) => (
            <View
              key={row.label}
              style={[s.detailRow, i === ROWS.length - 1 && { borderBottomWidth: 0 }]}
            >
              <Text style={[s.rowLabel, row.right && s.rowLabelRight]}>{row.label}</Text>
              <Text style={[s.rowValue, row.right && s.rowValueRight]}>{row.value}</Text>
            </View>
          ))}
        </Animated.View>

        {/* ── Upload gift card image ─────────────────────────────────────────── */}
        <Animated.View entering={FadeInDown.duration(340).springify().delay(120)} style={s.uploadSection}>
          <Text style={s.uploadLabel}>Gift card image</Text>
          <View style={s.uploadRow}>
            {[
              { bg: "#FFB6C1", icon: "image" as const, iconColor: "#d63384" },
              { bg: "#AED6F1", icon: "image" as const, iconColor: "#2980b9" },
              { bg: "#BBBBBB", icon: "plus"  as const, iconColor: "#FFFFFF" },
            ].map((item, i) => (
              <TouchableOpacity key={i} style={[s.uploadCircle, { backgroundColor: item.bg }]} activeOpacity={0.8}>
                <Feather name={item.icon} size={18} color={item.iconColor} />
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* ── Rate / Total summary box ───────────────────────────────────────── */}
        <Animated.View entering={FadeInUp.duration(340).springify().delay(160)} style={s.summaryBox}>
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

        {/* ── Submit Trade button ────────────────────────────────────────────── */}
        <Animated.View entering={FadeInUp.duration(340).springify().delay(200)}>
          <TouchableOpacity
            style={[s.submitBtn, loading && { opacity: 0.7 }]}
            onPress={handleSubmit}
            activeOpacity={0.85}
            disabled={loading}
          >
            <Text style={s.submitBtnText}>{loading ? "Submitting…" : "Submit Trade"}</Text>
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

  scroll: { padding: 20, gap: 20 },

  detailCard: {
    backgroundColor: "#FFFFFF", borderRadius: 10, borderWidth: 1, borderColor: "#F0F0F0",
    paddingHorizontal: 16,
    shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 1,
  },
  detailRow: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start",
    paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: "#F0F0F0",
  },
  rowLabel:       { fontSize: 12, fontFamily: "Manrope_500Medium", color: "#6C7278", flex: 1, letterSpacing: 0.24 },
  rowLabelRight:  { textAlign: "right" },
  rowValue:       { fontSize: 12, fontFamily: "Manrope_700Bold",   color: "#1B1B1B", flex: 1, letterSpacing: 0.24 },
  rowValueRight:  { textAlign: "right" },

  uploadSection: { gap: 8 },
  uploadLabel:   { fontSize: 12, fontFamily: "Manrope_500Medium", color: "#6C7278", textTransform: "capitalize" },
  uploadRow:     { flexDirection: "row", gap: 10, alignItems: "center" },
  uploadCircle:  { width: 49, height: 49, borderRadius: 24.5, alignItems: "center", justifyContent: "center" },

  summaryBox: {
    backgroundColor: "#010101", borderRadius: 10, paddingHorizontal: 16, paddingVertical: 4,
  },
  summaryRow:     { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 12 },
  summaryDivider: { height: 1, backgroundColor: "rgba(233,233,233,0.25)" },
  summaryLabel:   { fontSize: 10, fontFamily: "Manrope_500Medium", color: "#FFFFFF" },
  summaryValue:   { fontSize: 10, fontFamily: "Manrope_700Bold",   color: "#FFFFFF" },

  submitBtn: {
    backgroundColor: "#000000", height: 48, borderRadius: 10,
    alignItems: "center", justifyContent: "center",
    shadowColor: "#375DFB", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.48, shadowRadius: 2, elevation: 4,
  },
  submitBtnText: { fontSize: 14, fontFamily: "Manrope_700Bold", color: "#FFFFFF" },
});
