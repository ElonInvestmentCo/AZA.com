import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
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

const RATE = 1200;

/* Simulates the async trade submission API call.
   Returns { status: "submitted" | "rejected" }.
   Replace this with a real API call when available. */
async function submitTradeAPI(): Promise<{ status: "submitted" | "rejected" }> {
  return new Promise(resolve =>
    setTimeout(() => resolve({ status: "submitted" }), 1200)
  );
}

export default function ConfirmTransactionScreen() {
  const router  = useRouter();
  const insets  = useSafeAreaInsets();
  const topPad  = Platform.OS === "web" ? 20 : insets.top;
  const [loading, setLoading] = useState(false);

  const params = useLocalSearchParams<{
    category:  string;
    country:   string;
    type:      string;
    amountUSD: string;
    total:     string;
  }>();

  const category  = params.category  || "Amazon";
  const country   = params.country   || "";
  const cardType  = params.type      || "";
  const amountUSD = params.amountUSD || "200";
  const totalNGN  = params.total     ? Number(params.total) : Number(amountUSD) * RATE;

  const amountLabel  = `$${Number(amountUSD).toLocaleString("en-US")}`;
  const totalLabel   = `₦${totalNGN.toLocaleString("en-NG")}`;
  const subtypeLabel = [country, cardType].filter(Boolean).join(" — ") || "—";

  const now     = new Date();
  const dateStr = now.toLocaleString("en-US", {
    month: "short", day: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });

  const ROWS = [
    {
      left:  { label: "Date & Time",           value: dateStr      },
      right: { label: "Total Amount",           value: totalLabel   },
    },
    {
      left:  { label: "Gift Card Category",     value: category     },
      right: { label: "Gift Card Type / Origin", value: subtypeLabel },
    },
    {
      left:  { label: "Gift Card Amount",       value: amountLabel  },
      right: null,
    },
  ];

  const handleSubmit = async () => {
    if (loading) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setLoading(true);

    const { status } = await submitTradeAPI();

    setLoading(false);

    if (status === "rejected") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      router.push({
        pathname: "/(app)/rejected" as any,
        params: { cardType: `${category} Gift Card`, amount: amountLabel },
      });
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.push({
        pathname: "/(app)/submitted" as any,
        params: { cardType: `${category} Gift Card`, amount: amountLabel, naira: totalLabel },
      });
    }
  };

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
            <Text style={s.summaryValue}>₦{RATE.toLocaleString("en-NG")} / $1</Text>
          </View>
          <View style={s.summaryLine} />
          <View style={s.summaryRow}>
            <Text style={s.summaryLabel}>Total:</Text>
            <Text style={[s.summaryValue, { fontSize: 15, fontFamily: "Manrope_700Bold" }]}>
              {totalLabel}
            </Text>
          </View>
        </Animated.View>

        {/* Submit */}
        <Animated.View entering={FadeInUp.duration(300).springify().delay(160)}>
          <TouchableOpacity
            style={[s.submitBtn, loading && { opacity: 0.72 }]}
            onPress={handleSubmit}
            activeOpacity={0.85}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={s.submitBtnText}>Submit Trade</Text>
            )}
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
