import * as Haptics from "expo-haptics";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useWallet } from "@/context/WalletContext";

const WHITE    = "#FFFFFF";
const TEXT_DARK = "#1B1B1B";
const TEXT_GRAY = "#6C7278";
const BLACK     = "#000000";
const PANEL_BG  = "#010101";
const DIVIDER_H = "#D1D1D1";
const DIVIDER_P = "#E9E9E9";
const BORDER    = "#EDF1F3";

function DetailRow({ label, value, valueRight }: { label: string; value: string; valueRight?: string }) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      {valueRight ? (
        <View style={styles.detailRight}>
          <Text style={styles.detailLabelRight}>{valueRight}</Text>
          <Text style={styles.detailValue}>{value}</Text>
        </View>
      ) : (
        <Text style={styles.detailValue}>{value}</Text>
      )}
    </View>
  );
}

export default function ConfirmTransactionScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { addTransaction } = useWallet();
  const params = useLocalSearchParams<{
    category: string;
    country: string;
    type: string;
    amount: string;
    rate: string;
    total: string;
  }>();

  const topPad = Platform.OS === "web" ? 20 : insets.top;

  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
  const timeStr = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  const dateTime = `${dateStr} - ${timeStr}`;

  const rate  = params.rate  || "1200";
  const total = params.total || "0";
  const amt   = params.amount || "0";
  const totalNum = parseFloat(total) || 0;

  async function handleSubmit() {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    addTransaction({
      type: "trade",
      title: `Sell Gift Card – ${params.category || "Gift Card"}`,
      subtitle: `${params.type || "Gift Card"} · ${dateStr}`,
      amount: totalNum,
      currency: "₦",
      status: "pending",
      icon: "tag",
    });
    router.push("/trade-submitted" as any);
  }

  return (
    <View style={[styles.screen, { paddingTop: topPad }]}>
      <StatusBar barStyle="dark-content" backgroundColor={WHITE} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
          <Feather name="arrow-left" size={20} color="#1E232C" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Confirm transaction Details</Text>
        <View style={{ width: 20 }} />
      </View>
      <View style={styles.headerDivider} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 140 }}>

        {/* Transaction detail rows */}
        <View style={styles.detailsSection}>
          <DetailRow
            label="Date & Time"
            value={dateTime}
            valueRight="Total Amount"
          />
          <View style={styles.rowDivider} />

          <DetailRow
            label="Gift Card Category"
            value={params.category || "—"}
            valueRight={params.country ? `${params.country} ${params.category}` : undefined}
          />
          <View style={styles.rowDivider} />

          {params.type ? (
            <>
              <DetailRow label="Gift card Type/sub-category" value={params.type} />
              <View style={styles.rowDivider} />
            </>
          ) : null}

          <DetailRow label="Gift card Amount" value={amt ? `₦${parseFloat(amt).toLocaleString()}` : "—"} />
          <View style={styles.rowDivider} />

          <DetailRow label="Total Amount" value={totalNum > 0 ? `₦${totalNum.toLocaleString()}` : "—"} />
        </View>

        {/* Gift card image upload area */}
        <View style={styles.uploadSection}>
          <Text style={styles.uploadLabel}>Gift card image</Text>
          <View style={styles.uploadArea}>
            <View style={styles.circlesRow}>
              <View style={[styles.circle, { backgroundColor: "#BBBBBB", zIndex: 2 }]}>
                <Feather name="image" size={16} color={WHITE} />
              </View>
              <View style={[styles.circle, { backgroundColor: "#D9D9D9", marginLeft: -14, zIndex: 1 }]}>
                <Feather name="image" size={16} color={WHITE} />
              </View>
              <View style={styles.plusCircle}>
                <Feather name="plus" size={14} color={WHITE} />
              </View>
            </View>
            <Text style={styles.uploadHint}>Gift card image uploaded</Text>
          </View>
        </View>

        {/* Rate / Total panel */}
        <View style={styles.ratePanel}>
          <View style={styles.rateRow}>
            <Text style={styles.rateLbl}>Rate</Text>
            <Text style={styles.rateVal}>₦{parseInt(rate).toLocaleString()}</Text>
          </View>
          <View style={styles.rateDivider} />
          <View style={styles.rateRow}>
            <Text style={styles.rateLbl}>Total:</Text>
            <Text style={[styles.rateVal, styles.rateTotal]}>₦{totalNum > 0 ? totalNum.toLocaleString() : "0"}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Submit Trade button */}
      <View style={[styles.ctaWrap, { paddingBottom: Platform.OS === "ios" ? insets.bottom + 8 : 20 }]}>
        <TouchableOpacity style={styles.ctaBtn} onPress={handleSubmit} activeOpacity={0.85}>
          <Text style={styles.ctaTxt}>Submit Trade</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: WHITE },

  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 14, paddingBottom: 14 },
  headerTitle: { fontFamily: "Inter_700Bold", fontSize: 13, color: BLACK, textTransform: "capitalize" },
  headerDivider: { height: StyleSheet.hairlineWidth, backgroundColor: DIVIDER_H },

  detailsSection: { marginHorizontal: 20, marginTop: 24 },
  detailRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", paddingVertical: 12 },
  detailLabel: { fontFamily: "Inter_500Medium", fontSize: 12, color: TEXT_GRAY, letterSpacing: 0.24, flex: 1 },
  detailValue: { fontFamily: "Inter_700Bold", fontSize: 12, color: TEXT_DARK, letterSpacing: 0.24, textAlign: "right" },
  detailRight: { alignItems: "flex-end", gap: 2 },
  detailLabelRight: { fontFamily: "Inter_500Medium", fontSize: 12, color: TEXT_GRAY },
  rowDivider: { height: StyleSheet.hairlineWidth, backgroundColor: BORDER },

  uploadSection: { marginHorizontal: 22, marginTop: 20 },
  uploadLabel: { fontFamily: "Inter_500Medium", fontSize: 12, color: TEXT_GRAY, textTransform: "capitalize", marginBottom: 8 },
  uploadArea: { alignItems: "center", gap: 8, paddingVertical: 16, backgroundColor: "#F5F5F5", borderRadius: 10, borderWidth: 1, borderColor: BORDER },
  circlesRow: { flexDirection: "row", alignItems: "center" },
  circle: { width: 45, height: 45, borderRadius: 22.5, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: BLACK, borderStyle: "dashed" },
  plusCircle: { width: 28, height: 28, borderRadius: 14, backgroundColor: BLACK, alignItems: "center", justifyContent: "center", marginLeft: -8, zIndex: 3 },
  uploadHint: { fontFamily: "Inter_400Regular", fontSize: 11, color: TEXT_GRAY },

  ratePanel: { marginHorizontal: 22, marginTop: 20, backgroundColor: PANEL_BG, borderRadius: 10, paddingHorizontal: 20, paddingVertical: 14 },
  rateRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  rateLbl: { fontFamily: "Inter_500Medium", fontSize: 10, color: WHITE, letterSpacing: -0.1 },
  rateVal: { fontFamily: "Inter_700Bold", fontSize: 10, color: WHITE },
  rateTotal: { fontSize: 15 },
  rateDivider: { height: 1, backgroundColor: DIVIDER_P, marginVertical: 10 },

  ctaWrap: { paddingHorizontal: 22, paddingTop: 12, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: BORDER, backgroundColor: WHITE },
  ctaBtn: { backgroundColor: BLACK, borderRadius: 10, height: 48, alignItems: "center", justifyContent: "center" },
  ctaTxt: { fontFamily: "Inter_700Bold", fontSize: 14, color: WHITE, letterSpacing: -0.14 },
});
