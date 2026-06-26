import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  FlatList,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  interpolate,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

/* ─── Design tokens ──────────────────────────────────────────────────────── */
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

/* ─── Transaction data ───────────────────────────────────────────────────── */
type TxStatus = "completed" | "pending" | "failed";

interface Transaction {
  id:        string;
  name:      string;
  cat:       string;
  date:      string;
  ts:        number; // unix ms for date comparisons
  amount:    string;
  positive:  boolean;
  status:    TxStatus;
  icon:      React.ComponentProps<typeof Feather>["name"];
  iconBg:    string;
  iconColor: string;
}

const ALL_TX: Transaction[] = [
  { id:"1",  name:"Amazon Gift Card",    cat:"Gift Card", date:"Apr 28, 2024", ts: new Date("2024-04-28").getTime(), amount:"₦200,040",  positive:true,  status:"completed", icon:"gift",             iconBg:"#FFF2CF", iconColor:"#5C4000" },
  { id:"2",  name:"Bitcoin Sale",        cat:"Crypto",    date:"Jun 23, 2025", ts: new Date("2025-06-23").getTime(), amount:"₦185,000",  positive:true,  status:"completed", icon:"trending-up",      iconBg:"#FFF7ED", iconColor:"#F7931A" },
  { id:"3",  name:"Electricity Bill",   cat:"Bills",     date:"Jun 22, 2025", ts: new Date("2025-06-22").getTime(), amount:"₦5,000",    positive:false, status:"completed", icon:"zap",              iconBg:"#FFFBEB", iconColor:"#D97706" },
  { id:"4",  name:"MTN Airtime",         cat:"Airtime",   date:"Jun 22, 2025", ts: new Date("2025-06-22").getTime(), amount:"₦2,000",    positive:false, status:"completed", icon:"phone",            iconBg:"#FEFCE8", iconColor:"#CA8A04" },
  { id:"5",  name:"Wallet Withdrawal",  cat:"Wallet",    date:"Jun 21, 2025", ts: new Date("2025-06-21").getTime(), amount:"₦50,000",   positive:false, status:"completed", icon:"arrow-up-circle",  iconBg:"#FFF0F0", iconColor:"#EF4444" },
  { id:"6",  name:"iTunes Gift Card",   cat:"Gift Card", date:"Jun 20, 2025", ts: new Date("2025-06-20").getTime(), amount:"₦92,400",   positive:true,  status:"pending",   icon:"gift",             iconBg:"#FFF2CF", iconColor:"#5C4000" },
  { id:"7",  name:"DSTV Subscription",  cat:"Bills",     date:"Jun 19, 2025", ts: new Date("2025-06-19").getTime(), amount:"₦7,900",    positive:false, status:"completed", icon:"tv",               iconBg:"#FFF1F2", iconColor:"#E11D48" },
  { id:"8",  name:"Wallet Funding",     cat:"Wallet",    date:"Jun 17, 2025", ts: new Date("2025-06-17").getTime(), amount:"₦100,000",  positive:true,  status:"completed", icon:"arrow-down-circle",iconBg:"#F0FFF4", iconColor:"#00B03C" },
  { id:"9",  name:"Deposit Gift Card",  cat:"Gift Card", date:"Feb 24, 2022", ts: new Date("2022-02-24").getTime(), amount:"₦200,040",  positive:true,  status:"completed", icon:"gift",             iconBg:"#FFF2CF", iconColor:"#5C4000" },
  { id:"10", name:"Withdrawal",         cat:"Wallet",    date:"Feb 24, 2022", ts: new Date("2022-02-24").getTime(), amount:"₦400,000",  positive:false, status:"completed", icon:"arrow-up-right",   iconBg:"#FFF0F0", iconColor:"#EF4444" },
  { id:"11", name:"Spotify Premium",    cat:"Bills",     date:"Jun 15, 2025", ts: new Date("2025-06-15").getTime(), amount:"₦3,200",    positive:false, status:"completed", icon:"music",            iconBg:"#F5F3FF", iconColor:"#7C3AED" },
  { id:"12", name:"Steam Gift Card",    cat:"Gift Card", date:"Jun 12, 2025", ts: new Date("2025-06-12").getTime(), amount:"₦45,000",   positive:true,  status:"completed", icon:"gift",             iconBg:"#FFF2CF", iconColor:"#5C4000" },
  { id:"13", name:"Ethereum Sale",      cat:"Crypto",    date:"Jun 10, 2025", ts: new Date("2025-06-10").getTime(), amount:"₦312,000",  positive:true,  status:"completed", icon:"trending-up",      iconBg:"#FFF7ED", iconColor:"#627EEA" },
  { id:"14", name:"WAEC Data Bundle",   cat:"Airtime",   date:"Jun 8, 2025",  ts: new Date("2025-06-08").getTime(), amount:"₦1,500",    positive:false, status:"pending",   icon:"wifi",             iconBg:"#EFF6FF", iconColor:"#3B82F6" },
];

/* ─── Filter types ───────────────────────────────────────────────────────── */
type TxFilter  = "All" | "Credit" | "Debit" | "Pending";
type DateRange = "all" | "7d" | "30d" | "3m";

const TX_FILTERS:   TxFilter[]  = ["All", "Credit", "Debit", "Pending"];
const DATE_RANGES: { key: DateRange; label: string }[] = [
  { key: "all", label: "All time" },
  { key: "7d",  label: "7 days"   },
  { key: "30d", label: "30 days"  },
  { key: "3m",  label: "3 months" },
];

const STATUS_STYLE: Record<TxStatus, { bg: string; color: string }> = {
  completed: { bg: "#E8F7EF", color: "#00B03C" },
  pending:   { bg: "#FFFBEB", color: "#D97706" },
  failed:    { bg: "#FFF0F0", color: "#EF4444" },
};

/* ─── Highlighted search text ────────────────────────────────────────────── */
function HighlightText({ text, query, style }: { text: string; query: string; style: object }) {
  if (!query.trim()) return <Text style={style} numberOfLines={1}>{text}</Text>;

  const lower   = text.toLowerCase();
  const qLower  = query.toLowerCase().trim();
  const idx     = lower.indexOf(qLower);
  if (idx === -1) return <Text style={style} numberOfLines={1}>{text}</Text>;

  return (
    <Text style={style} numberOfLines={1}>
      {text.slice(0, idx)}
      <Text style={{ backgroundColor: "#FEF3C7", color: "#92400E" }}>
        {text.slice(idx, idx + qLower.length)}
      </Text>
      {text.slice(idx + qLower.length)}
    </Text>
  );
}

/* ─── Main screen ────────────────────────────────────────────────────────── */
export default function HistoryScreen() {
  const insets  = useSafeAreaInsets();
  const router  = useRouter();
  const topPad  = Platform.OS === "web" ? 40 : insets.top;

  const [txFilter,   setTxFilter]   = useState<TxFilter>("All");
  const [dateRange,  setDateRange]  = useState<DateRange>("all");
  const [searchText, setSearchText] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);

  const searchRef = useRef<TextInput>(null);

  /* ─── Search bar animation ── */
  const searchH    = useSharedValue(0);
  const searchOp   = useSharedValue(0);

  const searchBarStyle = useAnimatedStyle(() => ({
    height:   searchH.value,
    opacity:  searchOp.value,
    overflow: "hidden",
  }));

  const toggleSearch = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (searchOpen) {
      searchH.value  = withTiming(0,  { duration: 220 });
      searchOp.value = withTiming(0,  { duration: 180 });
      setSearchText("");
      setSearchOpen(false);
    } else {
      setSearchOpen(true);
      searchH.value  = withSpring(52, { damping: 18, stiffness: 280 });
      searchOp.value = withTiming(1,  { duration: 200 });
      setTimeout(() => searchRef.current?.focus(), 180);
    }
  }, [searchOpen]);

  /* ─── Date range cutoff ── */
  const dateFrom = useMemo(() => {
    const now = Date.now();
    if (dateRange === "7d")  return now - 7  * 24 * 60 * 60 * 1000;
    if (dateRange === "30d") return now - 30 * 24 * 60 * 60 * 1000;
    if (dateRange === "3m")  return now - 90 * 24 * 60 * 60 * 1000;
    return 0;
  }, [dateRange]);

  /* ─── Combined filter ── */
  const filtered = useMemo(() => {
    const q = searchText.toLowerCase().trim();
    return ALL_TX.filter(t => {
      if (txFilter === "Credit"  && !t.positive)             return false;
      if (txFilter === "Debit"   && t.positive)              return false;
      if (txFilter === "Pending" && t.status !== "pending")  return false;
      if (dateFrom > 0 && t.ts < dateFrom)                   return false;
      if (q && !t.name.toLowerCase().includes(q) && !t.cat.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [txFilter, dateFrom, searchText]);

  /* ─── Summary (filtered totals) ── */
  const totalIn  = filtered.filter(t =>  t.positive).reduce((s, t) => s + parseInt(t.amount.replace(/[₦,]/g, "")), 0);
  const totalOut = filtered.filter(t => !t.positive).reduce((s, t) => s + parseInt(t.amount.replace(/[₦,]/g, "")), 0);

  /* ─── Active filter count for badge ── */
  const activeFilters = (txFilter !== "All" ? 1 : 0) + (dateRange !== "all" ? 1 : 0) + (searchText ? 1 : 0);

  const clearAll = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setTxFilter("All");
    setDateRange("all");
    setSearchText("");
  }, []);

  /* ─── Group transactions by period label ── */
  const grouped = useMemo(() => {
    const now     = Date.now();
    const sections: Array<{ title: string; data: Transaction[] }> = [];
    const buckets: Record<string, Transaction[]> = {};

    for (const t of filtered) {
      const diff = now - t.ts;
      const days = diff / (24 * 60 * 60 * 1000);
      let bucket: string;
      if (days < 1)        bucket = "Today";
      else if (days < 7)   bucket = "This week";
      else if (days < 30)  bucket = "This month";
      else if (days < 90)  bucket = "Last 3 months";
      else                 bucket = "Older";
      if (!buckets[bucket]) buckets[bucket] = [];
      buckets[bucket].push(t);
    }

    const order = ["Today", "This week", "This month", "Last 3 months", "Older"];
    for (const key of order) {
      if (buckets[key]?.length) sections.push({ title: key, data: buckets[key] });
    }
    return sections;
  }, [filtered]);

  /* Flat list data: interleave section headers */
  type ListItem =
    | { type: "header"; title: string; key: string }
    | { type: "tx";     tx: Transaction; isLast: boolean; key: string };

  const listData = useMemo<ListItem[]>(() => {
    const items: ListItem[] = [];
    for (const section of grouped) {
      items.push({ type: "header", title: section.title, key: `h-${section.title}` });
      section.data.forEach((tx, i) => {
        items.push({ type: "tx", tx, isLast: i === section.data.length - 1, key: `tx-${tx.id}` });
      });
    }
    return items;
  }, [grouped]);

  return (
    <View style={[s.root, { paddingTop: topPad }]}>

      {/* ── Header ── */}
      <Animated.View entering={FadeInDown.duration(280)} style={s.header}>
        <Text style={s.title}>History</Text>
        <View style={s.headerRight}>
          {/* Clear all badge */}
          {activeFilters > 0 && (
            <Animated.View entering={FadeIn.duration(180)} exiting={FadeOut.duration(140)}>
              <TouchableOpacity style={s.clearBtn} onPress={clearAll}>
                <Text style={s.clearBtnText}>Clear</Text>
                <View style={s.clearBadge}>
                  <Text style={s.clearBadgeText}>{activeFilters}</Text>
                </View>
              </TouchableOpacity>
            </Animated.View>
          )}
          <TouchableOpacity
            style={[s.iconBtn, searchOpen && s.iconBtnActive]}
            onPress={toggleSearch}
            hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
          >
            <Feather name={searchOpen ? "x" : "search"} size={18} color={searchOpen ? "#FFFFFF" : C.navy} />
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* ── Search bar (animated slide-in) ── */}
      <Animated.View style={[searchBarStyle, s.searchWrap]}>
        <View style={s.searchBox}>
          <Feather name="search" size={15} color={C.textMut} />
          <TextInput
            ref={searchRef}
            style={s.searchInput}
            placeholder="Search by merchant or category…"
            placeholderTextColor={C.textMut}
            value={searchText}
            onChangeText={setSearchText}
            returnKeyType="search"
            autoCorrect={false}
            autoCapitalize="none"
            clearButtonMode="while-editing"
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => setSearchText("")} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Feather name="x-circle" size={15} color={C.textMut} />
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>

      {/* ── Summary cards (update in real-time) ── */}
      <Animated.View entering={FadeInDown.duration(320).delay(30)} style={s.summaryRow}>
        <View style={[s.summaryCard, { backgroundColor: "#F0FFF4", flex: 1 }]}>
          <View style={s.summaryTop}>
            <View style={[s.summaryIcon, { backgroundColor: "#C6F6D5" }]}>
              <Feather name="arrow-down" size={13} color={C.success} />
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
              <Feather name="arrow-up" size={13} color={C.danger} />
            </View>
            <Text style={[s.summaryLabel, { color: C.danger }]}>Expense</Text>
          </View>
          <Text style={[s.summaryAmt, { color: C.danger }]}>
            ₦{totalOut.toLocaleString("en-NG")}
          </Text>
        </View>
      </Animated.View>

      {/* ── Type filter chips ── */}
      <Animated.View entering={FadeInDown.duration(290).delay(50)}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.chipScroll}
        >
          {TX_FILTERS.map(f => (
            <Pressable
              key={f}
              style={[s.chip, txFilter === f && s.chipActive]}
              onPress={() => { Haptics.selectionAsync(); setTxFilter(f); }}
            >
              <Text style={[s.chipText, txFilter === f && s.chipTextActive]}>{f}</Text>
            </Pressable>
          ))}

          {/* Divider */}
          <View style={s.chipDivider} />

          {/* Date range chips */}
          {DATE_RANGES.map(r => (
            <Pressable
              key={r.key}
              style={[s.chip, s.chipDate, dateRange === r.key && s.chipDateActive]}
              onPress={() => { Haptics.selectionAsync(); setDateRange(r.key); }}
            >
              {dateRange === r.key && r.key !== "all" && (
                <Feather name="calendar" size={11} color="#FFFFFF" />
              )}
              {dateRange !== r.key && r.key !== "all" && (
                <Feather name="calendar" size={11} color={C.primary} />
              )}
              <Text style={[s.chipText, dateRange === r.key && s.chipDateTextActive]}>
                {r.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </Animated.View>

      {/* ── Result count ── */}
      <View style={s.resultRow}>
        <Text style={s.resultText}>
          {filtered.length === ALL_TX.length
            ? `${filtered.length} transactions`
            : `${filtered.length} of ${ALL_TX.length} transactions`}
        </Text>
        {filtered.length !== ALL_TX.length && (
          <Animated.View entering={FadeIn.duration(160)}>
            <Text style={s.resultFiltered}>• filtered</Text>
          </Animated.View>
        )}
      </View>

      {/* ── Transaction list ── */}
      <FlatList
        data={listData}
        keyExtractor={item => item.key}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[s.list, { paddingBottom: insets.bottom + 110 }]}
        ListEmptyComponent={
          <View style={s.empty}>
            <View style={s.emptyIconWrap}>
              <Feather name="search" size={24} color={C.textMut} />
            </View>
            <Text style={s.emptyTitle}>No results found</Text>
            <Text style={s.emptySubtitle}>
              {searchText
                ? `No transactions matching "${searchText}"`
                : "Try adjusting your filters"}
            </Text>
            {activeFilters > 0 && (
              <TouchableOpacity style={s.emptyBtn} onPress={clearAll}>
                <Text style={s.emptyBtnText}>Clear all filters</Text>
              </TouchableOpacity>
            )}
          </View>
        }
        renderItem={({ item, index }) => {
          if (item.type === "header") {
            return (
              <Animated.View entering={FadeInDown.duration(200).delay(index * 12)}>
                <Text style={s.sectionHeader}>{item.title}</Text>
              </Animated.View>
            );
          }

          const { tx, isLast } = item;

          return (
            <Animated.View entering={FadeInDown.duration(240).delay(Math.min(index * 18, 300))}>
              <TouchableOpacity
                style={s.txRow}
                activeOpacity={0.75}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  router.push("/(app)/transactions" as any);
                }}
              >
                <View style={[s.txIcon, { backgroundColor: tx.iconBg }]}>
                  <Feather name={tx.icon} size={20} color={tx.iconColor} />
                </View>

                <View style={s.txInfo}>
                  <HighlightText text={tx.name} query={searchText} style={s.txName} />
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                    <Text style={s.txDate}>{tx.date}</Text>
                    <Text style={s.txDot}>·</Text>
                    <Text style={[s.txCat, { color: tx.iconColor }]}>{tx.cat}</Text>
                  </View>
                </View>

                <View style={s.txRight}>
                  <Text style={[s.txAmount, { color: tx.positive ? C.success : C.danger }]}>
                    {tx.positive ? "+" : "-"}{tx.amount}
                  </Text>
                  <View style={[s.statusBadge, { backgroundColor: STATUS_STYLE[tx.status].bg }]}>
                    <Text style={[s.statusText, { color: STATUS_STYLE[tx.status].color }]}>
                      {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
              {!isLast && <View style={s.divider} />}
            </Animated.View>
          );
        }}
      />
    </View>
  );
}

/* ─── Styles ──────────────────────────────────────────────────────────────── */
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },

  /* Header */
  header:      { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, paddingBottom: 10, paddingTop: 8 },
  title:       { fontSize: 22, fontFamily: "Manrope_700Bold", color: C.navy },
  headerRight: { flexDirection: "row", alignItems: "center", gap: 8 },

  iconBtn:       { width: 38, height: 38, borderRadius: 10, backgroundColor: "#F8F9FA", alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: C.border },
  iconBtnActive: { backgroundColor: C.navy, borderColor: C.navy },

  clearBtn:      { flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 10, paddingVertical: 7, borderRadius: 10, backgroundColor: "#FFF0F0", borderWidth: 1, borderColor: "#FECACA" },
  clearBtnText:  { fontSize: 12, fontFamily: "Manrope_600SemiBold", color: C.danger },
  clearBadge:    { minWidth: 18, height: 18, borderRadius: 9, backgroundColor: C.danger, alignItems: "center", justifyContent: "center", paddingHorizontal: 4 },
  clearBadgeText:{ fontSize: 10, fontFamily: "Manrope_700Bold", color: "#FFFFFF" },

  /* Search */
  searchWrap:  { paddingHorizontal: 20, paddingBottom: 4 },
  searchBox:   { flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: "#F8F9FA", borderRadius: 12, borderWidth: 1, borderColor: C.border, paddingHorizontal: 12, height: 44 },
  searchInput: { flex: 1, fontSize: 14, fontFamily: "Manrope_400Regular", color: C.text, paddingVertical: 0 },

  /* Summary */
  summaryRow:   { flexDirection: "row", gap: 12, paddingHorizontal: 20, marginBottom: 10 },
  summaryCard:  { borderRadius: 14, padding: 14, gap: 6 },
  summaryTop:   { flexDirection: "row", alignItems: "center", gap: 8 },
  summaryIcon:  { width: 26, height: 26, borderRadius: 8, alignItems: "center", justifyContent: "center" },
  summaryLabel: { fontSize: 12, fontFamily: "Manrope_600SemiBold" },
  summaryAmt:   { fontSize: 17, fontFamily: "Manrope_700Bold", fontVariant: ["tabular-nums"] },

  /* Filter chips */
  chipScroll:      { paddingHorizontal: 20, gap: 8, paddingBottom: 10, alignItems: "center" },
  chip:            { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, borderWidth: 1, borderColor: C.border, backgroundColor: "#F8F9FA" },
  chipActive:      { backgroundColor: C.navy, borderColor: C.navy },
  chipText:        { fontSize: 12, fontFamily: "Manrope_500Medium", color: C.textSec },
  chipTextActive:  { color: "#FFFFFF" },

  chipDivider: { width: 1, height: 20, backgroundColor: C.border, marginHorizontal: 2 },

  chipDate:         { flexDirection: "row", alignItems: "center", gap: 5, backgroundColor: "#EFF6FF", borderColor: "#BFDBFE" },
  chipDateActive:   { backgroundColor: C.primary, borderColor: C.primary },
  chipDateTextActive: { color: "#FFFFFF" },

  /* Result count */
  resultRow:     { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 20, marginBottom: 4 },
  resultText:    { fontSize: 12, fontFamily: "Manrope_500Medium", color: C.textMut },
  resultFiltered:{ fontSize: 12, fontFamily: "Manrope_600SemiBold", color: C.primary },

  /* List */
  list:          { paddingHorizontal: 20, paddingTop: 2 },
  sectionHeader: { fontSize: 12, fontFamily: "Manrope_700Bold", color: C.textMut, textTransform: "uppercase", letterSpacing: 0.6, marginTop: 14, marginBottom: 6 },

  txRow:    { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 13 },
  txIcon:   { width: 50, height: 50, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  txInfo:   { flex: 1, gap: 4 },
  txName:   { fontSize: 14, fontFamily: "Manrope_600SemiBold", color: C.text },
  txDate:   { fontSize: 11, fontFamily: "Manrope_400Regular", color: C.textMut },
  txDot:    { fontSize: 11, color: C.textMut },
  txCat:    { fontSize: 11, fontFamily: "Manrope_600SemiBold" },
  txRight:  { alignItems: "flex-end", gap: 5 },
  txAmount: { fontSize: 14, fontFamily: "Manrope_700Bold", fontVariant: ["tabular-nums"] },

  statusBadge: { paddingHorizontal: 7, paddingVertical: 2, borderRadius: 8 },
  statusText:  { fontSize: 10, fontFamily: "Manrope_600SemiBold" },
  divider:     { height: 1, backgroundColor: C.border },

  /* Empty state */
  empty:        { alignItems: "center", paddingTop: 60, gap: 10 },
  emptyIconWrap:{ width: 60, height: 60, borderRadius: 20, backgroundColor: "#F8F9FA", alignItems: "center", justifyContent: "center", marginBottom: 4 },
  emptyTitle:   { fontSize: 16, fontFamily: "Manrope_700Bold", color: C.text },
  emptySubtitle:{ fontSize: 13, fontFamily: "Manrope_400Regular", color: C.textMut, textAlign: "center", paddingHorizontal: 32 },
  emptyBtn:     { marginTop: 8, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10, backgroundColor: "#EFF6FF", borderWidth: 1, borderColor: "#BFDBFE" },
  emptyBtnText: { fontSize: 13, fontFamily: "Manrope_600SemiBold", color: C.primary },
});
