import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";

type TxCategory = "All" | "Gift Card" | "Crypto" | "Bills" | "Airtime" | "Wallet";

interface TxItem {
  id:       string;
  type:     string;
  category: TxCategory;
  date:     string;
  amount:   string;
  status:   "completed" | "pending" | "failed";
  positive: boolean;
  icon:     React.ComponentProps<typeof Feather>["name"];
  iconColor: string;
}

const ALL_TX: TxItem[] = [
  { id:"1",  type:"Deposit Giftcard",    category:"Gift Card", date:"Jun 24, 2025", amount:"₦200,040.00", status:"completed", positive:true,  icon:"gift",          iconColor:"#7C3AED" },
  { id:"2",  type:"Bitcoin Sale",         category:"Crypto",    date:"Jun 23, 2025", amount:"₦185,000.00", status:"completed", positive:true,  icon:"trending-up",   iconColor:"#F7931A" },
  { id:"3",  type:"Electricity Bill",    category:"Bills",     date:"Jun 22, 2025", amount:"-₦5,000.00",  status:"completed", positive:false, icon:"zap",           iconColor:"#F59E0B" },
  { id:"4",  type:"MTN Airtime",         category:"Airtime",   date:"Jun 22, 2025", amount:"-₦2,000.00",  status:"completed", positive:false, icon:"phone",         iconColor:"#FFCC00" },
  { id:"5",  type:"Wallet Withdrawal",   category:"Wallet",    date:"Jun 21, 2025", amount:"-₦50,000.00", status:"completed", positive:false, icon:"arrow-up-circle",iconColor:"#EF4444" },
  { id:"6",  type:"Amazon Gift Card",    category:"Gift Card", date:"Jun 20, 2025", amount:"₦92,400.00",  status:"completed", positive:true,  icon:"gift",          iconColor:"#7C3AED" },
  { id:"7",  type:"DSTV Subscription",   category:"Bills",     date:"Jun 19, 2025", amount:"-₦7,900.00",  status:"completed", positive:false, icon:"tv",            iconColor:"#EF4444" },
  { id:"8",  type:"Ethereum Purchase",   category:"Crypto",    date:"Jun 18, 2025", amount:"-₦40,000.00", status:"completed", positive:false, icon:"trending-up",   iconColor:"#627EEA" },
  { id:"9",  type:"Wallet Funding",      category:"Wallet",    date:"Jun 17, 2025", amount:"₦100,000.00", status:"completed", positive:true,  icon:"arrow-down-circle",iconColor:"#00B03C" },
  { id:"10", type:"iTunes Gift Card",    category:"Gift Card", date:"Jun 16, 2025", amount:"₦48,000.00",  status:"pending",   positive:true,  icon:"gift",          iconColor:"#7C3AED" },
  { id:"11", type:"MTN Data 10GB",       category:"Airtime",   date:"Jun 15, 2025", amount:"-₦3,500.00",  status:"completed", positive:false, icon:"wifi",          iconColor:"#FFCC00" },
  { id:"12", type:"USDT Sale",           category:"Crypto",    date:"Jun 14, 2025", amount:"₦75,000.00",  status:"completed", positive:true,  icon:"dollar-sign",   iconColor:"#26A17B" },
  { id:"13", type:"Gift Card Failed",    category:"Gift Card", date:"Jun 13, 2025", amount:"₦0.00",       status:"failed",    positive:false, icon:"gift",          iconColor:"#7C3AED" },
  { id:"14", type:"GOTV Bill",           category:"Bills",     date:"Jun 12, 2025", amount:"-₦4,500.00",  status:"completed", positive:false, icon:"tv",            iconColor:"#EF4444" },
  { id:"15", type:"Wallet Funding",      category:"Wallet",    date:"Jun 11, 2025", amount:"₦25,000.00",  status:"completed", positive:true,  icon:"arrow-down-circle",iconColor:"#00B03C" },
];

const CATEGORIES: TxCategory[] = ["All", "Gift Card", "Crypto", "Bills", "Airtime", "Wallet"];

function StatusBadge({ status }: { status: TxItem["status"] }) {
  const C = useColors();
  const config = {
    completed: { bg: C.successLight,          text: C.success,     label: "Completed" },
    pending:   { bg: C.warningLight,           text: C.warning,     label: "Pending"   },
    failed:    { bg: C.destructiveDim,         text: C.destructive, label: "Failed"    },
  }[status];
  return (
    <View style={[badge.wrap, { backgroundColor: config.bg }]}>
      <Text style={[badge.text, { color: config.text }]}>{config.label}</Text>
    </View>
  );
}

const badge = StyleSheet.create({
  wrap: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  text: { fontSize: 10, fontFamily: "Manrope_600SemiBold" },
});

export default function HistoryScreen() {
  const insets   = useSafeAreaInsets();
  const router   = useRouter();
  const C        = useColors();
  const topPad   = Platform.OS === "web" ? 48 : insets.top;
  const [filter, setFilter] = useState<TxCategory>("All");

  const filtered = filter === "All" ? ALL_TX : ALL_TX.filter(t => t.category === filter);

  const totalCredit = ALL_TX.filter(t => t.positive).reduce((sum, t) => sum + parseFloat(t.amount.replace(/[^0-9.]/g, "")), 0);
  const totalDebit  = ALL_TX.filter(t => !t.positive).reduce((sum, t) => sum + parseFloat(t.amount.replace(/[^0-9.]/g, "")), 0);

  return (
    <View style={[s.root, { backgroundColor: C.background, paddingTop: topPad }]}>

      {/* Header */}
      <Animated.View entering={FadeInDown.duration(300)} style={s.header}>
        <Text style={[s.title, { color: C.text }]}>History</Text>
        <TouchableOpacity
          style={[s.filterBtn, { borderColor: C.border }]}
          onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
        >
          <Feather name="sliders" size={18} color={C.text} />
        </TouchableOpacity>
      </Animated.View>

      {/* Summary row */}
      <Animated.View entering={FadeInDown.duration(320).delay(40)} style={s.summaryRow}>
        <View style={[s.summaryCard, { backgroundColor: C.successLight }]}>
          <Feather name="arrow-down-left" size={14} color={C.success} />
          <Text style={[s.summaryLabel, { color: C.success }]}>Total In</Text>
          <Text style={[s.summaryAmount, { color: C.success }]}>
            ₦{totalCredit.toLocaleString("en-NG", { minimumFractionDigits: 0 })}
          </Text>
        </View>
        <View style={[s.summaryCard, { backgroundColor: C.destructiveDim }]}>
          <Feather name="arrow-up-right" size={14} color={C.destructive} />
          <Text style={[s.summaryLabel, { color: C.destructive }]}>Total Out</Text>
          <Text style={[s.summaryAmount, { color: C.destructive }]}>
            ₦{totalDebit.toLocaleString("en-NG", { minimumFractionDigits: 0 })}
          </Text>
        </View>
      </Animated.View>

      {/* Category filters */}
      <Animated.View entering={FadeInDown.duration(320).delay(60)}>
        <FlatList
          data={CATEGORIES}
          keyExtractor={c => c}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.filterScroll}
          renderItem={({ item }) => {
            const active = item === filter;
            return (
              <Pressable
                style={[
                  s.filterChip,
                  { borderColor: C.border, backgroundColor: C.surface },
                  active && { backgroundColor: C.accent, borderColor: C.accent },
                ]}
                onPress={() => {
                  Haptics.selectionAsync();
                  setFilter(item);
                }}
              >
                <Text style={[s.filterChipText, { color: C.subtitle }, active && { color: "#FFFFFF" }]}>{item}</Text>
              </Pressable>
            );
          }}
        />
      </Animated.View>

      {/* Transaction list */}
      <FlatList
        data={filtered}
        keyExtractor={t => t.id}
        contentContainerStyle={[s.list, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={s.empty}>
            <Feather name="inbox" size={36} color={C.mutedForeground} />
            <Text style={[s.emptyText, { color: C.mutedForeground }]}>No transactions</Text>
          </View>
        }
        renderItem={({ item, index }) => (
          <Animated.View entering={FadeInDown.duration(260).delay(index * 30)}>
            <TouchableOpacity
              style={[s.txRow, { borderColor: C.border }]}
              activeOpacity={0.75}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.push("/(app)/transactions" as any);
              }}
            >
              <View style={[s.iconWrap, { backgroundColor: item.iconColor + "18" }]}>
                <Feather name={item.icon} size={18} color={item.iconColor} />
              </View>
              <View style={s.txInfo}>
                <Text style={[s.txType, { color: C.text }]} numberOfLines={1}>{item.type}</Text>
                <View style={s.txMeta}>
                  <Text style={[s.txDate, { color: C.mutedForeground }]}>{item.date}</Text>
                  <View style={[s.dot, { backgroundColor: C.mutedForeground }]} />
                  <Text style={[s.txCat, { color: C.mutedForeground }]}>{item.category}</Text>
                </View>
              </View>
              <View style={s.txRight}>
                <Text style={[s.txAmount, { color: item.positive ? C.success : C.destructive }]}>
                  {item.amount}
                </Text>
                <StatusBadge status={item.status} />
              </View>
            </TouchableOpacity>
          </Animated.View>
        )}
      />
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1 },

  header: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 20, paddingBottom: 12, paddingTop: 8,
  },
  title:     { fontSize: 22, fontFamily: "Manrope_700Bold" },
  filterBtn: {
    width: 40, height: 40, borderRadius: 12, borderWidth: 1,
    alignItems: "center", justifyContent: "center",
  },

  summaryRow: { flexDirection: "row", gap: 12, marginHorizontal: 20, marginBottom: 12 },
  summaryCard: {
    flex: 1, borderRadius: 14, padding: 14, gap: 4, alignItems: "flex-start",
  },
  summaryLabel:  { fontSize: 11, fontFamily: "Manrope_500Medium" },
  summaryAmount: { fontSize: 15, fontFamily: "Manrope_700Bold" },

  filterScroll:  { paddingHorizontal: 20, gap: 8, paddingBottom: 12 },
  filterChip:    { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1 },
  filterChipText: { fontSize: 13, fontFamily: "Manrope_500Medium" },

  list: { paddingHorizontal: 20, paddingTop: 4 },

  txRow: {
    flexDirection: "row", alignItems: "center", gap: 12,
    paddingVertical: 13, borderBottomWidth: 1,
  },
  iconWrap: { width: 42, height: 42, borderRadius: 13, alignItems: "center", justifyContent: "center" },
  txInfo:   { flex: 1, gap: 3 },
  txType:   { fontSize: 13, fontFamily: "Manrope_600SemiBold" },
  txMeta:   { flexDirection: "row", alignItems: "center", gap: 6 },
  txDate:   { fontSize: 11, fontFamily: "Manrope_400Regular" },
  txCat:    { fontSize: 11, fontFamily: "Manrope_400Regular" },
  dot:      { width: 3, height: 3, borderRadius: 1.5 },
  txRight:  { alignItems: "flex-end", gap: 4 },
  txAmount: { fontSize: 13, fontFamily: "Manrope_700Bold" },

  empty: { alignItems: "center", justifyContent: "center", paddingTop: 80, gap: 12 },
  emptyText: { fontSize: 15, fontFamily: "Manrope_500Medium" },
});
