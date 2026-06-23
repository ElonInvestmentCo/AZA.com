import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

/* ─── Light theme colors ─────────────────────────────────────────────────────── */
const C = {
  bg:         "#FFFFFF",
  text:       "#1B1B1B",
  textSec:    "#6C7278",
  textMuted:  "#AAAFB5",
  border:     "#EDF1F3",
  summaryBox: "#010101",
  divider:    "#D1D1D1",
};

/* ─── Detail row ─────────────────────────────────────────────────────────────── */
function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={dr.wrap}>
      <Text style={dr.label}>{label}</Text>
      <Text style={dr.value}>{value}</Text>
    </View>
  );
}

const dr = StyleSheet.create({
  wrap: {
    flexDirection:   "row",
    justifyContent:  "space-between",
    alignItems:      "flex-start",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  label: { fontSize: 12, fontFamily: "Manrope_500Medium", color: C.textSec, flex: 1 },
  value: { fontSize: 12, fontFamily: "Manrope_700Bold",   color: C.text, flex: 1, textAlign: "right" },
});

/* ─── Main screen ────────────────────────────────────────────────────────────── */
export default function TradeAssetScreen() {
  const router  = useRouter();
  const insets  = useSafeAreaInsets();
  const { card } = useLocalSearchParams<{ card: string }>();

  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", {
    month: "short", day: "2-digit", year: "numeric",
  }) + " - " + now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });

  const rate  = 1200;
  const total = 200040;

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      {/* Header */}
      <View style={[hdr.wrap, { paddingTop: (insets.top || 16) + 12 }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={hdr.back}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Feather name="arrow-left" size={22} color="#1E232C" />
        </TouchableOpacity>
        <Text style={hdr.title}>Confirm transaction Details</Text>
        <View style={{ width: 40 }} />
      </View>
      <View style={hdr.divider} />

      <ScrollView
        contentContainerStyle={sc.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Transaction detail rows */}
        <View style={sc.card}>
          <DetailRow label="Date & Time"               value={dateStr} />
          <DetailRow label="Gift Card Category"         value={card ?? "Amazon"} />
          <DetailRow label="Gift card Type/sub-category" value="Australia Amazon" />
          <DetailRow label="Gift card Amount"           value="Aug 06,2024 -6:17PM" />
          <View style={[dr.wrap, { borderBottomWidth: 0 }]}>
            <Text style={dr.label}>Total Amount</Text>
            <Text style={[dr.value, { color: C.text, fontFamily: "Manrope_700Bold" }]}>
              ₦{total.toLocaleString("en-NG")}
            </Text>
          </View>
        </View>

        {/* Upload gift card images section */}
        <View style={up.wrap}>
          <Text style={up.label}>gift card image</Text>
          <View style={up.row}>
            {[["#FFB6C1", "#d63384"], ["#AED6F1", "#2980b9"]].map(([bg, col], i) => (
              <View key={i} style={[up.circle, { backgroundColor: bg }]}>
                <Feather name="image" size={16} color={col} />
              </View>
            ))}
            <View style={[up.circle, { backgroundColor: "#BBBBBB" }]}>
              <Feather name="plus" size={18} color="#FFFFFF" />
            </View>
          </View>
        </View>

        {/* Rate / Total summary box */}
        <View style={sb.box}>
          <View style={sb.row}>
            <Text style={sb.label}>Rate</Text>
            <Text style={sb.value}>₦{rate.toLocaleString("en-NG")}</Text>
          </View>
          <View style={sb.line} />
          <View style={sb.row}>
            <Text style={sb.label}>Total:</Text>
            <Text style={[sb.value, { fontSize: 15, fontFamily: "Manrope_700Bold" }]}>
              ₦{total.toLocaleString("en-NG")}
            </Text>
          </View>
        </View>

        {/* Submit Trade button */}
        <TouchableOpacity
          style={btn.wrap}
          onPress={() => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            router.push("/(app)/submitted");
          }}
          activeOpacity={0.85}
        >
          <Text style={btn.text}>Submit Trade</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
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
  back:   { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  title:  {
    fontSize:    13,
    fontFamily:  "Manrope_700Bold",
    color:       "#000000",
    textAlign:   "center",
    flex:        1,
    textTransform: "capitalize",
  },
  divider:{ height: 1, backgroundColor: C.divider },
});

const sc = StyleSheet.create({
  content: { padding: 20, gap: 20, paddingBottom: 48 },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius:    10,
    borderWidth:     1,
    borderColor:     "#F0F0F0",
    paddingHorizontal: 16,
    shadowColor:     "#000",
    shadowOffset:    { width: 0, height: 1 },
    shadowOpacity:   0.05,
    shadowRadius:    4,
    elevation:       1,
  },
});

const up = StyleSheet.create({
  wrap:  { gap: 8 },
  label: { fontSize: 12, fontFamily: "Manrope_500Medium", color: C.textSec },
  row:   { flexDirection: "row", gap: 10, alignItems: "center" },
  circle: {
    width: 49, height: 49, borderRadius: 24.5,
    alignItems: "center", justifyContent: "center",
  },
});

const sb = StyleSheet.create({
  box: {
    backgroundColor: C.summaryBox,
    borderRadius:    10,
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  row: {
    flexDirection:   "row",
    justifyContent:  "space-between",
    alignItems:      "center",
    paddingVertical: 12,
  },
  line:  { height: 1, backgroundColor: "rgba(233,233,233,0.25)" },
  label: { fontSize: 10, fontFamily: "Manrope_500Medium", color: "#FFFFFF" },
  value: { fontSize: 10, fontFamily: "Manrope_700Bold",   color: "#FFFFFF" },
});

const btn = StyleSheet.create({
  wrap: {
    backgroundColor: "#000000",
    height:          48,
    borderRadius:    10,
    alignItems:      "center",
    justifyContent:  "center",
    shadowColor:     "#375DFB",
    shadowOffset:    { width: 0, height: 1 },
    shadowOpacity:   0.48,
    shadowRadius:    2,
    elevation:       4,
  },
  text: { fontSize: 14, fontFamily: "Manrope_700Bold", color: "#FFFFFF" },
});
