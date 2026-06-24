import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const C = {
  bg:      "#FFFFFF",
  text:    "#0B0A0A",
  navy:    "#061941",
  textSec: "#595F67",
  textMut: "#AAAFB5",
  border:  "#F0F0F0",
  success: "#00B03C",
  danger:  "#EF4444",
  warn:    "#D97706",
  primary: "#135EF2",
};

type FilterType = "All" | "Credit" | "Debit" | "Pending";

const ALL_TX = [
  { id:"1",  name:"Amazon card",        cat:"Gift Card",    date:"April 28, 2024",  amount:"₦200,040",  positive:true,  status:"completed" as const, icon:"gift"            as const, iconBg:"#FFF2CF", iconColor:"#5C4000" },
  { id:"2",  name:"Bitcoin Sale",       cat:"Crypto",       date:"Jun 23, 2025",    amount:"₦185,000",  positive:true,  status:"completed" as const, icon:"trending-up"     as const, iconBg:"#FFF7ED", iconColor:"#F7931A" },
  { id:"3",  name:"Electricity Bill",   cat:"Bills",        date:"Jun 22, 2025",    amount:"₦5,000",    positive:false, status:"completed" as const, icon:"zap"             as const, iconBg:"#FFFBEB", iconColor:"#D97706" },
  { id:"4",  name:"MTN Airtime",        cat:"Airtime",      date:"Jun 22, 2025",    amount:"₦2,000",    positive:false, status:"completed" as const, icon:"phone"           as const, iconBg:"#FEFCE8", iconColor:"#CA8A04" },
  { id:"5",  name:"Wallet Withdrawal",  cat:"Wallet",       date:"Jun 21, 2025",    amount:"₦50,000",   positive:false, status:"completed" as const, icon:"arrow-up-circle" as const, iconBg:"#FFF0F0", iconColor:"#EF4444" },
  { id:"6",  name:"iTunes Gift Card",   cat:"Gift Card",    date:"Jun 20, 2025",    amount:"₦92,400",   positive:true,  status:"pending"   as const, icon:"gift"            as const, iconBg:"#FFF2CF", iconColor:"#5C4000" },
  { id:"7",  name:"DSTV Subscription",  cat:"Bills",        date:"Jun 19, 2025",    amount:"₦7,900",    positive:false, status:"completed" as const, icon:"tv"              as const, iconBg:"#FFF1F2", iconColor:"#E11D48" },
  { id:"8",  name:"Wallet Funding",     cat:"Wallet",       date:"Jun 17, 2025",    amount:"₦100,000",  positive:true,  status:"completed" as const, icon:"arrow-down-circle" as const, iconBg:"#F0FFF4", iconColor:"#00B03C" },
  { id:"9",  name:"Deposit Giftcard",   cat:"Gift Card",    date:"Feb 24, 2022",    amount:"₦200,040",  positive:true,  status:"completed" as const, icon:"gift"            as const, iconBg:"#FFF2CF", iconColor:"#5C4000" },
  { id:"10", name:"Withdraws",          cat:"Wallet",       date:"Feb 24, 2022",    amount:"₦400,000",  positive:false, status:"completed" as const, icon:"arrow-up-right"  as const, iconBg:"#FFF0F0", iconColor:"#EF4444" },
];

const STATUS_STYLE = {
  completed: { bg: "#E8F7EF", color: "#00B03C" },
  pending:   { bg: "#FFFBEB", color: "#D97706" },
  failed:    { bg: "#FFF0F0", color: "#EF4444" },
};

const SUMMARY = [
  { label: "Income",  amount: "₦677,080", color: "#00B03C", icon: "arrow-down" as const },
  { label: "Expense", amount: "₦464,900", color: "#EF4444", icon: "arrow-up"   as const },
];

export default function HistoryScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const topPad = Platform.OS === "web" ? 40 : insets.top;
  const [filter, setFilter] = useState<FilterType>("All");

  const filtered = ALL_TX.filter(t => {
    if (filter === "All")     return true;
    if (filter === "Credit")  return t.positive;
    if (filter === "Debit")   return !t.positive;
    if (filter === "Pending") return t.status === "pending";
    return true;
  });

  const totalIn  = ALL_TX.filter(t => t.positive).reduce((sum, t) => sum + parseInt(t.amount.replace(/[₦,]/g, "")), 0);
  const totalOut = ALL_TX.filter(t => !t.positive).reduce((sum, t) => sum + parseInt(t.amount.replace(/[₦,]/g, "")), 0);

  return (
    <View style={[s.root, { paddingTop: topPad }]}>

      {/* Header */}
      <Animated.View entering={FadeInDown.duration(280)} style={s.header}>
        <Text style={s.title}>Transaction History</Text>
        <TouchableOpacity style={s.filterBtn} onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}>
          <Feather name="sliders" size={18} color={C.navy} />
        </TouchableOpacity>
      </Animated.View>

      {/* Summary cards */}
      <Animated.View entering={FadeInDown.duration(320).delay(30)} style={s.summaryRow}>
        <View style={[s.summaryCard, { backgroundColor: "#F0FFF4", flex: 1 }]}>
          <View style={s.summaryTop}>
            <View style={[s.summaryIcon, { backgroundColor: "#C6F6D5" }]}>
              <Feather name="arrow-down" size={14} color={C.success} />
            </View>
            <Text style={[s.summaryLabel, { color: C.success }]}>Income</Text>
          </View>
          <Text style={[s.summaryAmt, { color: C.success }]}>
            ₦{totalIn.toLocaleString("en-NG")}
          </Text>
        </View>
        <View style={[s.summaryCard, { backgroundColor: "#FFF0F0", flex: 1 }]}>
          <View style={s.summaryTop}>
            <View style={[s.summaryIcon, { backgroundColor: "#FED7D7" }]}>
              <Feather name="arrow-up" size={14} color={C.danger} />
            </View>
            <Text style={[s.summaryLabel, { color: C.danger }]}>Expense</Text>
          </View>
          <Text style={[s.summaryAmt, { color: C.danger }]}>
            ₦{totalOut.toLocaleString("en-NG")}
          </Text>
        </View>
      </Animated.View>

      {/* Filter chips */}
      <Animated.View entering={FadeInDown.duration(290).delay(50)}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.chipScroll}>
          {(["All", "Credit", "Debit", "Pending"] as FilterType[]).map(f => (
            <Pressable
              key={f}
              style={[s.chip, filter === f && s.chipActive]}
              onPress={() => { Haptics.selectionAsync(); setFilter(f); }}
            >
              <Text style={[s.chipText, filter === f && s.chipTextActive]}>{f}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </Animated.View>

      {/* Transactions list */}
      <FlatList
        data={filtered}
        keyExtractor={t => t.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[s.list, { paddingBottom: insets.bottom + 110 }]}
        ListHeaderComponent={
          <Text style={s.listHeader}>Last 6 months</Text>
        }
        ListEmptyComponent={
          <View style={s.empty}>
            <Feather name="inbox" size={32} color={C.textMut} />
            <Text style={s.emptyText}>No transactions found</Text>
          </View>
        }
        renderItem={({ item, index }) => (
          <Animated.View entering={FadeInDown.duration(240).delay(index * 20)}>
            <TouchableOpacity
              style={s.txRow}
              activeOpacity={0.75}
              onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.push("/(app)/transactions" as any); }}
            >
              <View style={[s.txIcon, { backgroundColor: item.iconBg }]}>
                <Feather name={item.icon} size={20} color={item.iconColor} />
              </View>
              <View style={s.txInfo}>
                <Text style={s.txName} numberOfLines={1}>{item.name}</Text>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                  <Text style={s.txDate}>{item.date}</Text>
                  <Text style={s.txDot}>·</Text>
                  <Text style={[s.txCat, { color: item.iconColor }]}>{item.cat}</Text>
                </View>
              </View>
              <View style={s.txRight}>
                <Text style={[s.txAmount, { color: item.positive ? C.success : C.danger }]}>
                  {item.positive ? "+" : "-"}{item.amount}
                </Text>
                <View style={[s.statusBadge, { backgroundColor: STATUS_STYLE[item.status].bg }]}>
                  <Text style={[s.statusText, { color: STATUS_STYLE[item.status].color }]}>
                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
            {index < filtered.length - 1 && <View style={s.divider} />}
          </Animated.View>
        )}
      />
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },

  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, paddingBottom: 12, paddingTop: 8 },
  title: { fontSize: 22, fontFamily: "Manrope_700Bold", color: C.navy },
  filterBtn: { width: 38, height: 38, borderRadius: 10, backgroundColor: "#F8F9FA", alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: C.border },

  summaryRow: { flexDirection: "row", gap: 12, paddingHorizontal: 20, marginBottom: 12 },
  summaryCard: { borderRadius: 14, padding: 14, gap: 8 },
  summaryTop: { flexDirection: "row", alignItems: "center", gap: 8 },
  summaryIcon: { width: 28, height: 28, borderRadius: 8, alignItems: "center", justifyContent: "center" },
  summaryLabel: { fontSize: 12, fontFamily: "Manrope_600SemiBold" },
  summaryAmt: { fontSize: 18, fontFamily: "Manrope_700Bold" },

  chipScroll: { paddingHorizontal: 20, gap: 8, paddingBottom: 10 },
  chip:         { paddingHorizontal: 16, paddingVertical: 7, borderRadius: 20, borderWidth: 1, borderColor: C.border, backgroundColor: "#F8F9FA" },
  chipActive:   { backgroundColor: C.navy, borderColor: C.navy },
  chipText:     { fontSize: 12, fontFamily: "Manrope_500Medium", color: C.textSec },
  chipTextActive: { color: "#FFFFFF" },

  list: { paddingHorizontal: 20, paddingTop: 4 },
  listHeader: { fontSize: 13, fontFamily: "Manrope_700Bold", color: C.textSec, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 10 },

  txRow:    { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 14 },
  txIcon:   { width: 52, height: 52, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  txInfo:   { flex: 1, gap: 4 },
  txName:   { fontSize: 14, fontFamily: "Manrope_600SemiBold", color: C.text },
  txDate:   { fontSize: 11, fontFamily: "Manrope_400Regular", color: C.textMut },
  txDot:    { fontSize: 11, color: C.textMut },
  txCat:    { fontSize: 11, fontFamily: "Manrope_600SemiBold" },
  txRight:  { alignItems: "flex-end", gap: 5 },
  txAmount: { fontSize: 14, fontFamily: "Manrope_700Bold" },
  statusBadge: { paddingHorizontal: 7, paddingVertical: 2, borderRadius: 8 },
  statusText:  { fontSize: 10, fontFamily: "Manrope_600SemiBold" },
  divider:     { height: 1, backgroundColor: C.border },

  empty:     { alignItems: "center", paddingTop: 60, gap: 10 },
  emptyText: { fontSize: 14, fontFamily: "Manrope_500Medium", color: C.textMut },
});
