import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useState } from "react";
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

const BG      = "#0A0A0F";
const SURFACE = "#14141F";
const BORDER  = "#2A2A3D";
const TEXT    = "#FFFFFF";
const MUTED   = "#8F8FA3";
const PRIMARY = "#00D9A0";
const RED     = "#FF5B7A";

const FILTERS = ["All", "Credit", "Debit"] as const;
type Filter = typeof FILTERS[number];

const ALL_TXN = [
  { id: "1", icon: "arrow-down-circle" as const, title: "Deposit Giftcard",  sub: "Gift Card",     date: "Feb 24, 2022", amount: "₦200,40.00",  positive: true  },
  { id: "2", icon: "arrow-up-circle"   as const, title: "Withdraws",         sub: "Bank Transfer", date: "Feb 24, 2022", amount: "₦400,000.00", positive: false },
  { id: "3", icon: "tag"               as const, title: "Amazon Gift Card",   sub: "Sold",          date: "Apr 28, 2024", amount: "+₦200,040",   positive: true  },
  { id: "4", icon: "smartphone"        as const, title: "MTN Data Bundle",    sub: "Bill Payment",  date: "Apr 25, 2024", amount: "-₦15,000",    positive: false },
  { id: "5", icon: "music"             as const, title: "iTunes Gift Card",   sub: "Sold",          date: "Apr 22, 2024", amount: "+₦89,500",    positive: true  },
  { id: "6", icon: "monitor"           as const, title: "Steam Gift Card",    sub: "Sold",          date: "Apr 20, 2024", amount: "+₦45,200",    positive: true  },
  { id: "7", icon: "arrow-up-right"    as const, title: "Wallet Withdrawal",  sub: "Bank Transfer", date: "Apr 18, 2024", amount: "-₦50,000",    positive: false },
  { id: "8", icon: "gift"              as const, title: "Google Play Card",   sub: "Sold",          date: "Apr 15, 2024", amount: "+₦32,800",    positive: true  },
];

export default function HistoryScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const topPad = Platform.OS === "web" ? 48 : insets.top;
  const [filter, setFilter] = useState<Filter>("All");

  const visible = ALL_TXN.filter((t) =>
    filter === "All" ? true : filter === "Credit" ? t.positive : !t.positive
  );

  return (
    <View style={[s.root, { backgroundColor: BG }]}>
      {/* Header */}
      <Animated.View
        entering={FadeInDown.duration(350).springify()}
        style={[s.header, { paddingTop: topPad + 10 }]}
      >
        <Text style={s.title}>History</Text>
        <TouchableOpacity style={[s.filterBtn, { backgroundColor: SURFACE, borderColor: BORDER }]}>
          <Feather name="filter" size={16} color={MUTED} />
        </TouchableOpacity>
      </Animated.View>

      {/* Filter pills */}
      <Animated.View
        entering={FadeInDown.duration(320).springify().delay(50)}
        style={s.pillRow}
      >
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f}
            style={[
              s.pill,
              {
                backgroundColor: filter === f ? PRIMARY : SURFACE,
                borderColor:     filter === f ? PRIMARY : BORDER,
              },
            ]}
            onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setFilter(f); }}
            activeOpacity={0.8}
          >
            <Text style={[s.pillTxt, { color: filter === f ? BG : MUTED }]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </Animated.View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[s.scroll, { paddingBottom: insets.bottom + 110 }]}
      >
        <Animated.View
          entering={FadeInUp.duration(360).springify().delay(80)}
          style={[s.txCard, { backgroundColor: SURFACE, borderColor: BORDER }]}
        >
          {visible.map((item, i) => (
            <Animated.View
              key={item.id}
              entering={FadeInUp.duration(260).springify().delay(80 + i * 30)}
            >
              <TouchableOpacity
                style={[
                  s.txRow,
                  i < visible.length - 1 && { borderBottomWidth: 1, borderBottomColor: BORDER },
                ]}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  router.push("/(app)/transactions");
                }}
                activeOpacity={0.75}
              >
                <View style={[s.txIcon, { backgroundColor: (item.positive ? PRIMARY : RED) + "18" }]}>
                  <Feather name={item.icon} size={18} color={item.positive ? PRIMARY : RED} />
                </View>
                <View style={s.txInfo}>
                  <Text style={[s.txTitle, { color: TEXT }]}>{item.title}</Text>
                  <Text style={[s.txSub,   { color: MUTED }]}>{item.sub} · {item.date}</Text>
                </View>
                <Text style={[s.txAmt, { color: item.positive ? PRIMARY : RED }]}>{item.amount}</Text>
              </TouchableOpacity>
            </Animated.View>
          ))}

          {visible.length === 0 && (
            <View style={s.empty}>
              <Feather name="inbox" size={36} color={MUTED} />
              <Text style={[s.emptyTxt, { color: MUTED }]}>No transactions found</Text>
            </View>
          )}
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root:  { flex: 1 },
  scroll: { paddingTop: 8, paddingHorizontal: 20, gap: 0 },

  header: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    paddingHorizontal: 20, paddingBottom: 12,
  },
  title:     { fontSize: 24, fontFamily: "Manrope_700Bold", color: TEXT },
  filterBtn: { width: 40, height: 40, borderRadius: 12, borderWidth: 1, alignItems: "center", justifyContent: "center" },

  pillRow: { flexDirection: "row", gap: 10, paddingHorizontal: 20, marginBottom: 16 },
  pill:    { paddingHorizontal: 18, paddingVertical: 8, borderRadius: 20, borderWidth: 1 },
  pillTxt: { fontSize: 13, fontFamily: "Manrope_600SemiBold" },

  txCard:  { borderRadius: 20, borderWidth: 1, overflow: "hidden" },
  txRow:   { flexDirection: "row", alignItems: "center", gap: 14, paddingHorizontal: 16, paddingVertical: 16 },
  txIcon:  { width: 44, height: 44, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  txInfo:  { flex: 1 },
  txTitle: { fontSize: 14, fontFamily: "Manrope_600SemiBold", marginBottom: 3 },
  txSub:   { fontSize: 12, fontFamily: "Manrope_400Regular" },
  txAmt:   { fontSize: 14, fontFamily: "Manrope_700Bold" },

  empty:    { padding: 40, alignItems: "center", gap: 12 },
  emptyTxt: { fontSize: 14, fontFamily: "Manrope_400Regular" },
});
