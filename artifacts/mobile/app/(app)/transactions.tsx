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
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const C = {
  bg:      "#FFFFFF",
  navy:    "#061941",
  text:    "#0B0A0A",
  textSec: "#595F67",
  textMut: "#AAAFB5",
  border:  "#F3F4F7",
  surface: "#F8F9FA",
  success: "#00B03C",
  danger:  "#EF4444",
  warn:    "#D97706",
  primary: "#135EF2",
};

type TxCategory = "All" | "Gift Card" | "Crypto" | "Bills" | "Airtime" | "Wallet";
type TxStatus   = "completed" | "pending" | "failed";

interface TxItem {
  id: string; name: string; ref: string; category: TxCategory;
  date: string; amount: string; status: TxStatus; positive: boolean;
  icon: React.ComponentProps<typeof Feather>["name"]; iconBg: string; iconColor: string;
}

const ALL_TX: TxItem[] = [
  { id:"1",  name:"Amazon card",        ref:"3289HF-4378", category:"Gift Card", date:"April 28, 2024",    amount:"₦200,040",  status:"completed", positive:true,  icon:"gift",            iconBg:"#FFF2CF", iconColor:"#5C4000" },
  { id:"2",  name:"Bitcoin Sale",        ref:"7812KJ-2901", category:"Crypto",    date:"Jun 23, 2025",      amount:"₦185,000",  status:"completed", positive:true,  icon:"trending-up",     iconBg:"#FFF7ED", iconColor:"#F7931A" },
  { id:"3",  name:"Electricity Bill",   ref:"1234AB-5678", category:"Bills",     date:"Jun 22, 2025",      amount:"₦5,000",    status:"completed", positive:false, icon:"zap",             iconBg:"#FFFBEB", iconColor:"#D97706" },
  { id:"4",  name:"MTN Airtime",        ref:"9988KK-0011", category:"Airtime",   date:"Jun 22, 2025",      amount:"₦2,000",    status:"completed", positive:false, icon:"phone",           iconBg:"#FEFCE8", iconColor:"#CA8A04" },
  { id:"5",  name:"Wallet Withdrawal",  ref:"5566WW-3344", category:"Wallet",    date:"Jun 21, 2025",      amount:"₦50,000",   status:"completed", positive:false, icon:"arrow-up-circle", iconBg:"#FFF0F0", iconColor:"#EF4444" },
  { id:"6",  name:"iTunes Gift Card",   ref:"2200II-9900", category:"Gift Card", date:"Jun 20, 2025",      amount:"₦92,400",   status:"pending",   positive:true,  icon:"gift",            iconBg:"#FFF2CF", iconColor:"#5C4000" },
  { id:"7",  name:"DSTV Subscription",  ref:"3311DV-2200", category:"Bills",     date:"Jun 19, 2025",      amount:"₦7,900",    status:"completed", positive:false, icon:"tv",              iconBg:"#FFF1F2", iconColor:"#E11D48" },
  { id:"8",  name:"Ethereum Purchase",  ref:"4422EP-1100", category:"Crypto",    date:"Jun 18, 2025",      amount:"₦40,000",   status:"completed", positive:false, icon:"trending-up",     iconBg:"#EFF6FF", iconColor:"#627EEA" },
  { id:"9",  name:"Wallet Funding",     ref:"5533WF-0099", category:"Wallet",    date:"Jun 17, 2025",      amount:"₦100,000",  status:"completed", positive:true,  icon:"arrow-down-circle",iconBg:"#F0FFF4", iconColor:"#00B03C" },
  { id:"10", name:"Deposit Giftcard",   ref:"6644DG-8877", category:"Gift Card", date:"February 24, 2022", amount:"₦200,040",  status:"completed", positive:true,  icon:"gift",            iconBg:"#FFF2CF", iconColor:"#5C4000" },
  { id:"11", name:"Withdraws",          ref:"7755WD-6655", category:"Wallet",    date:"February 24, 2022", amount:"₦400,000",  status:"completed", positive:false, icon:"arrow-up-right",  iconBg:"#FFF0F0", iconColor:"#EF4444" },
  { id:"12", name:"USDT Sale",          ref:"8866US-4433", category:"Crypto",    date:"Jun 14, 2025",      amount:"₦75,000",   status:"completed", positive:true,  icon:"dollar-sign",     iconBg:"#F0FFF9", iconColor:"#26A17B" },
];

const CATEGORIES: TxCategory[] = ["All", "Gift Card", "Crypto", "Bills", "Airtime", "Wallet"];

const STATUS_COLORS: Record<TxStatus, { bg: string; text: string }> = {
  completed: { bg: "#E8F7EF", text: C.success },
  pending:   { bg: "#FFFBEB", text: C.warn },
  failed:    { bg: "#FFF0F0", text: C.danger },
};

export default function TransactionsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const topPad = Platform.OS === "web" ? 48 : insets.top;
  const [filter, setFilter] = useState<TxCategory>("All");

  const filtered = filter === "All" ? ALL_TX : ALL_TX.filter(t => t.category === filter);

  return (
    <View style={[s.root, { paddingTop: topPad }]}>

      {/* Header */}
      <Animated.View entering={FadeInDown.duration(280)} style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.back(); }}>
          <Feather name="arrow-left" size={20} color={C.navy} />
        </TouchableOpacity>
        <Text style={s.title}>Transaction History</Text>
        <View style={{ width: 36 }} />
      </Animated.View>

      {/* Section header */}
      <Animated.View entering={FadeInDown.duration(290).delay(30)} style={s.sectionRow}>
        <Text style={s.sectionTitle}>Last 6 months</Text>
        <TouchableOpacity onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}>
          <Text style={s.viewDetail}>View detail</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Category filters */}
      <Animated.View entering={FadeInDown.duration(290).delay(50)}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.filterScroll}>
          {CATEGORIES.map(item => {
            const active = item === filter;
            return (
              <Pressable
                key={item}
                style={[s.filterChip, active && s.filterChipActive]}
                onPress={() => { Haptics.selectionAsync(); setFilter(item); }}
              >
                <Text style={[s.filterChipText, active && s.filterChipTextActive]}>{item}</Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </Animated.View>

      {/* List */}
      <FlatList
        data={filtered}
        keyExtractor={t => t.id}
        contentContainerStyle={[s.list, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={s.empty}>
            <Feather name="inbox" size={32} color={C.textMut} />
            <Text style={s.emptyText}>No transactions</Text>
          </View>
        }
        renderItem={({ item, index }) => (
          <Animated.View entering={FadeInDown.duration(240).delay(index * 20)}>
            <TouchableOpacity style={s.txRow} activeOpacity={0.75} onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}>
              <View style={[s.iconWrap, { backgroundColor: item.iconBg }]}>
                <Feather name={item.icon} size={20} color={item.iconColor} />
              </View>
              <View style={s.txInfo}>
                <Text style={s.txName} numberOfLines={1}>{item.name}</Text>
                <Text style={s.txRef}>{item.ref}</Text>
              </View>
              <View style={s.txRight}>
                <Text style={[s.txAmount, { color: item.positive ? C.success : C.danger }]}>
                  {item.positive ? "" : "-"}{item.amount}
                </Text>
                <View style={[s.statusBadge, { backgroundColor: STATUS_COLORS[item.status].bg }]}>
                  <Text style={[s.statusText, { color: STATUS_COLORS[item.status].text }]}>
                    {item.status === "completed" ? "Completed" : item.status === "pending" ? "Pending" : "Failed"}
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

  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingBottom: 12, paddingTop: 8 },
  backBtn: { width: 36, height: 36, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 18, fontFamily: "Manrope_700Bold", color: C.navy, textAlign: "center" },

  sectionRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, paddingBottom: 10 },
  sectionTitle: { fontSize: 20, fontFamily: "Manrope_700Bold", color: C.navy },
  viewDetail:   { fontSize: 14, fontFamily: "Manrope_500Medium", color: C.primary },

  filterScroll: { paddingHorizontal: 20, gap: 8, paddingBottom: 10 },
  filterChip:        { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, borderWidth: 1, borderColor: C.border, backgroundColor: C.surface },
  filterChipActive:  { backgroundColor: C.navy, borderColor: C.navy },
  filterChipText:     { fontSize: 12, fontFamily: "Manrope_500Medium", color: C.textSec },
  filterChipTextActive: { color: "#FFFFFF" },

  list: { paddingHorizontal: 20, paddingTop: 4 },
  txRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 14, backgroundColor: C.bg },
  iconWrap: { width: 52, height: 52, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  txInfo: { flex: 1, gap: 4 },
  txName: { fontSize: 15, fontFamily: "Manrope_600SemiBold", color: C.navy },
  txRef:  { fontSize: 13, fontFamily: "Manrope_400Regular", color: C.textMut },
  txRight: { alignItems: "flex-end", gap: 5 },
  txAmount: { fontSize: 15, fontFamily: "Manrope_700Bold" },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  statusText: { fontSize: 11, fontFamily: "Manrope_600SemiBold" },
  divider: { height: 1, backgroundColor: C.border },
  empty: { alignItems: "center", justifyContent: "center", paddingTop: 80, gap: 10 },
  emptyText: { fontSize: 14, fontFamily: "Manrope_500Medium", color: C.textMut },
});
