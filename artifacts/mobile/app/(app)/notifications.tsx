import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
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
  accent:  "#00D9A0",
  info:    "#2563EB",
  purple:  "#7C3AED",
};

/* ─── Notification types ─────────────────────────────────────────────────── */
type NotifCategory =
  | "transaction" | "deposit" | "withdrawal" | "transfer"
  | "virtual_card" | "security" | "login_alert" | "promotion"
  | "cashback" | "reward" | "verification" | "referral" | "system";

type TxStatus = "completed" | "pending" | "failed";

interface Notification {
  id:          string;
  category:    NotifCategory;
  title:       string;
  body:        string;
  /** Unix ms timestamp */
  ts:          number;
  read:        boolean;
  icon:        keyof typeof Feather.glyphMap;
  iconBg:      string;
  iconColor:   string;
  status?:     TxStatus;
  /** CTA shown below body */
  cta?:        { label: string; action: string };
}

/* ─── Category metadata ──────────────────────────────────────────────────── */
const CAT_META: Record<NotifCategory, {
  icon:      keyof typeof Feather.glyphMap;
  iconBg:    string;
  iconColor: string;
  label:     string;
}> = {
  transaction:  { icon: "arrow-down-left",  iconBg: "#F0FFF9", iconColor: C.success, label: "Transactions"    },
  deposit:      { icon: "arrow-down-circle",iconBg: "#EFF6FF", iconColor: C.info,    label: "Deposits"        },
  withdrawal:   { icon: "arrow-up-circle",  iconBg: "#FFF0F0", iconColor: C.danger,  label: "Withdrawals"     },
  transfer:     { icon: "repeat",           iconBg: "#F5F3FF", iconColor: C.purple,  label: "Transfers"       },
  virtual_card: { icon: "credit-card",      iconBg: "#EFF6FF", iconColor: C.info,    label: "Virtual Cards"   },
  security:     { icon: "shield",           iconBg: "#FFF0F0", iconColor: C.danger,  label: "Security"        },
  login_alert:  { icon: "log-in",           iconBg: "#FFF0F0", iconColor: C.danger,  label: "Login Alerts"    },
  promotion:    { icon: "gift",             iconBg: "#FFF7ED", iconColor: C.warn,    label: "Promotions"      },
  cashback:     { icon: "percent",          iconBg: "#F0FFF9", iconColor: C.success, label: "Cashback"        },
  reward:       { icon: "star",             iconBg: "#FFF7ED", iconColor: C.warn,    label: "Rewards"         },
  verification: { icon: "check-circle",     iconBg: "#F0FFF9", iconColor: C.success, label: "Verification"    },
  referral:     { icon: "users",            iconBg: "#FFF7ED", iconColor: C.warn,    label: "Referrals"       },
  system:       { icon: "bell",             iconBg: "#EFF6FF", iconColor: C.info,    label: "System Updates"  },
};

const STATUS_STYLE: Record<TxStatus, { label: string; bg: string; color: string }> = {
  completed: { label: "Completed", bg: "#F0FFF4", color: C.success },
  pending:   { label: "Pending",   bg: "#FFF7ED", color: C.warn    },
  failed:    { label: "Failed",    bg: "#FFF0F0", color: C.danger  },
};

/* ─── Helper: time-ago relative to "now" ────────────────────────────────── */
const NOW = Date.now();
const D   = (daysAgo: number, h = 0, m = 0) =>
  NOW - daysAgo * 86_400_000 - h * 3_600_000 - m * 60_000;

/* ─── Mock dataset ───────────────────────────────────────────────────────── */
const MOCK: Notification[] = [
  {
    id: "1", category: "withdrawal", ts: D(0, 0, 3),  read: false,
    title: "Withdrawal Successful",
    body:  "₦5,000 has been sent to GTBank ending in 6789.",
    status: "completed",
    ...CAT_META.withdrawal,
  },
  {
    id: "2", category: "login_alert", ts: D(0, 1, 45), read: false,
    title: "New Device Login",
    body:  "Your account was accessed from a new iPhone in Lagos. If this wasn't you, tap to secure your account.",
    cta:  { label: "Secure account", action: "security" },
    ...CAT_META.login_alert,
  },
  {
    id: "3", category: "deposit", ts: D(0, 3, 0), read: false,
    title: "Wallet Funded",
    body:  "₦50,000 has been added to your PAYVORA wallet via bank transfer.",
    status: "completed",
    ...CAT_META.deposit,
  },
  {
    id: "4", category: "virtual_card", ts: D(0, 5, 0), read: false,
    title: "Card Transaction Declined",
    body:  "Your virtual card was declined for $12.99 on Netflix. Check your card balance and try again.",
    status: "failed",
    cta:  { label: "View card", action: "cards" },
    ...CAT_META.virtual_card,
  },
  {
    id: "5", category: "transaction", ts: D(1, 2, 0), read: true,
    title: "Airtime Purchase",
    body:  "₦1,000 MTN airtime sent to 0812 345 6789.",
    status: "completed",
    ...CAT_META.transaction,
  },
  {
    id: "6", category: "referral", ts: D(1, 5, 0), read: true,
    title: "Referral Bonus Pending",
    body:  "Your friend Chuka signed up with your code. ₦5,000 bonus will be credited once they complete KYC.",
    cta:  { label: "Track referral", action: "referral" },
    ...CAT_META.referral,
  },
  {
    id: "7", category: "cashback", ts: D(2, 1, 0), read: true,
    title: "Cashback Credited",
    body:  "₦250 cashback has been added to your wallet for your electricity bill payment.",
    ...CAT_META.cashback,
  },
  {
    id: "8", category: "transaction", ts: D(2, 4, 0), read: true,
    title: "Electricity Bill Payment",
    body:  "₦10,000 EKEDC prepaid meter top-up was successful. Token: 4521-9845-7623-1290.",
    status: "completed",
    ...CAT_META.transaction,
  },
  {
    id: "9", category: "security", ts: D(3, 2, 0), read: true,
    title: "PIN Changed Successfully",
    body:  "Your transaction PIN was changed. If you did not initiate this, contact support immediately.",
    cta:  { label: "Contact support", action: "help" },
    ...CAT_META.security,
  },
  {
    id: "10", category: "verification", ts: D(3, 6, 0), read: true,
    title: "Identity Verification Complete",
    body:  "Your KYC verification has been approved. You now have full wallet access and higher limits.",
    cta:  { label: "Explore features", action: "home" },
    ...CAT_META.verification,
  },
  {
    id: "11", category: "promotion", ts: D(4, 0, 0), read: true,
    title: "Weekend Promo 🎉",
    body:  "0% fee on all bill payments this weekend only. Save more with PAYVORA.",
    ...CAT_META.promotion,
  },
  {
    id: "12", category: "reward", ts: D(5, 3, 0), read: true,
    title: "Points Milestone Reached",
    body:  "You've earned 500 PAYVORA points! Redeem them for cashback or airtime.",
    cta:  { label: "Redeem now", action: "rewards" },
    ...CAT_META.reward,
  },
  {
    id: "13", category: "transfer", ts: D(6, 1, 0), read: true,
    title: "Transfer Received",
    body:  "₦20,000 received from Adewale O. via PAYVORA Wallet.",
    status: "completed",
    ...CAT_META.transfer,
  },
  {
    id: "14", category: "system", ts: D(8, 0, 0), read: true,
    title: "App Update Available",
    body:  "PAYVORA v2.4 is out — faster gift card processing, improved virtual card controls, and bug fixes.",
    cta:  { label: "Update now", action: "app-info" },
    ...CAT_META.system,
  },
  {
    id: "15", category: "transaction", ts: D(10, 2, 0), read: true,
    title: "Gift Card Trade Completed",
    body:  "Your Amazon $50 gift card was traded successfully. ₦45,200 credited to your wallet.",
    status: "completed",
    ...CAT_META.transaction,
  },
  {
    id: "16", category: "deposit", ts: D(22, 0, 0), read: true,
    title: "Large Deposit Received",
    body:  "₦200,000 has been added to your wallet. Daily withdrawal limit applies.",
    status: "completed",
    ...CAT_META.deposit,
  },
];

type Group = "Today" | "Yesterday" | "Earlier This Week" | "Earlier This Month" | "Older";

function getGroup(ts: number): Group {
  const msAgo = NOW - ts;
  const daysAgo = msAgo / 86_400_000;
  if (daysAgo < 1)  return "Today";
  if (daysAgo < 2)  return "Yesterday";
  if (daysAgo < 7)  return "Earlier This Week";
  if (daysAgo < 30) return "Earlier This Month";
  return "Older";
}

const GROUP_ORDER: Group[] = [
  "Today", "Yesterday", "Earlier This Week", "Earlier This Month", "Older",
];

const FILTER_ALL = "All";
type FilterOption = typeof FILTER_ALL | NotifCategory;

/* ─── Skeleton row ───────────────────────────────────────────────────────── */
function SkeletonRow({ index }: { index: number }) {
  const opacity = useSharedValue(1);
  React.useEffect(() => {
    const loop = () => {
      opacity.value = withTiming(0.4, { duration: 700 }, () => {
        opacity.value = withTiming(1, { duration: 700 }, loop);
      });
    };
    loop();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const style = useAnimatedStyle(() => ({ opacity: opacity.value }));
  return (
    <Animated.View style={[sk.row, style]}>
      <View style={sk.icon} />
      <View style={sk.lines}>
        <View style={[sk.line, { width: `${60 + (index % 3) * 12}%` }]} />
        <View style={[sk.line, { width: `${40 + (index % 4) * 8}%`, marginTop: 6 }]} />
        <View style={[sk.line, { width: "25%", marginTop: 4 }]} />
      </View>
    </Animated.View>
  );
}

/* ─── Notification card ──────────────────────────────────────────────────── */
function NotifCard({
  item, index, onPress, onDismiss,
}: {
  item: Notification; index: number; onPress: () => void; onDismiss: () => void;
}) {
  const router  = useRouter();
  const st = item.status ? STATUS_STYLE[item.status] : null;

  const handleCTA = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (item.cta?.action) router.push(`/(app)/${item.cta.action}` as any);
  };

  const renderRightActions = useCallback(() => (
    <View style={nc.swipeAction}>
      <Feather name="trash-2" size={20} color="#FFFFFF" />
      <Text style={nc.swipeActionText}>Delete</Text>
    </View>
  ), []);

  const handleSwipeOpen = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // Small delay so the swipe animation completes before removing
    setTimeout(() => onDismiss(), 180);
  }, [onDismiss]);

  return (
    <Animated.View entering={FadeInDown.duration(260).delay(index * 25).springify()}>
      <Swipeable
        renderRightActions={renderRightActions}
        onSwipeableOpen={handleSwipeOpen}
        rightThreshold={72}
        friction={1.8}
        overshootRight={false}
      >
        <TouchableOpacity
          style={[nc.card, !item.read && nc.cardUnread]}
          activeOpacity={0.78}
          onPress={() => { Haptics.selectionAsync(); onPress(); }}
        >
          {/* Unread blue dot */}
          {!item.read && <View style={nc.unreadDot} />}

          {/* Icon */}
          <View style={[nc.iconWrap, { backgroundColor: item.iconBg }]}>
            <Feather name={item.icon} size={18} color={item.iconColor} />
          </View>

          {/* Content */}
          <View style={nc.content}>
            <View style={nc.topRow}>
              <Text style={[nc.title, !item.read && nc.titleBold]} numberOfLines={1}>
                {item.title}
              </Text>
              <TouchableOpacity
                onPress={onDismiss}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Feather name="x" size={14} color={C.textMut} />
              </TouchableOpacity>
            </View>

            <Text style={nc.body} numberOfLines={2}>{item.body}</Text>

            <View style={nc.metaRow}>
              <Text style={nc.time}>{formatTs(item.ts)}</Text>
              {/* Status badge */}
              {st && (
                <View style={[nc.badge, { backgroundColor: st.bg }]}>
                  <View style={[nc.badgeDot, { backgroundColor: st.color }]} />
                  <Text style={[nc.badgeText, { color: st.color }]}>{st.label}</Text>
                </View>
              )}
            </View>

            {/* CTA button */}
            {item.cta && (
              <TouchableOpacity style={nc.ctaBtn} onPress={handleCTA} activeOpacity={0.8}>
                <Text style={nc.ctaText}>{item.cta.label}</Text>
                <Feather name="arrow-right" size={11} color={C.info} />
              </TouchableOpacity>
            )}
          </View>
        </TouchableOpacity>
        <View style={nc.separator} />
      </Swipeable>
    </Animated.View>
  );
}

function formatTs(ts: number): string {
  const msAgo = NOW - ts;
  const minsAgo = Math.floor(msAgo / 60_000);
  if (minsAgo < 1)  return "Just now";
  if (minsAgo < 60) return `${minsAgo}m ago`;
  const hAgo = Math.floor(minsAgo / 60);
  if (hAgo < 24) return `${hAgo}h ago`;
  const dAgo = Math.floor(hAgo / 24);
  if (dAgo === 1) return "Yesterday";
  if (dAgo < 7)  return `${dAgo} days ago`;
  const date = new Date(ts);
  return date.toLocaleDateString("en-NG", { day: "numeric", month: "short" });
}

/* ─── Main screen ────────────────────────────────────────────────────────── */
export default function NotificationsScreen() {
  const router  = useRouter();
  const insets  = useSafeAreaInsets();
  const topPad  = Platform.OS === "web" ? 20 : insets.top;

  const [items,       setItems]       = useState<Notification[]>(MOCK);
  const [loading,     setLoading]     = useState(false);
  const [refreshing,  setRefreshing]  = useState(false);
  const [searchText,  setSearchText]  = useState("");
  const [searchOpen,  setSearchOpen]  = useState(false);
  const [activeFilter, setFilter]     = useState<FilterOption>(FILTER_ALL);

  const searchRef = useRef<TextInput>(null);
  const searchH   = useSharedValue(0);
  const searchOp  = useSharedValue(0);

  const searchBarStyle = useAnimatedStyle(() => ({
    height:  searchH.value,
    opacity: searchOp.value,
    overflow: "hidden",
  }));

  const toggleSearch = useCallback(() => {
    const next = !searchOpen;
    setSearchOpen(next);
    searchH.value  = withSpring(next ? 52 : 0,  { damping: 20, stiffness: 280 });
    searchOp.value = withTiming(next ? 1 : 0, { duration: 180 });
    if (next) setTimeout(() => searchRef.current?.focus(), 120);
    else { setSearchText(""); searchRef.current?.blur(); }
  }, [searchOpen, searchH, searchOp]);

  /* ── Refresh (simulate API call) ── */
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1200);
  }, []);

  /* ── Derived data ── */
  const unreadCount = items.filter(n => !n.read).length;

  const markAllRead = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setItems(prev => prev.map(n => ({ ...n, read: true })));
  };
  const markRead  = (id: string) => setItems(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  const dismiss   = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setItems(prev => prev.filter(n => n.id !== id));
  };

  /* ── Filtered + grouped ── */
  const filtered = useMemo(() => {
    const q = searchText.toLowerCase().trim();
    return items.filter(n => {
      if (activeFilter !== FILTER_ALL && n.category !== activeFilter) return false;
      if (q && !n.title.toLowerCase().includes(q) && !n.body.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [items, activeFilter, searchText]);

  const grouped = useMemo(() => {
    const buckets: Partial<Record<Group, Notification[]>> = {};
    for (const n of filtered) {
      const g = getGroup(n.ts);
      if (!buckets[g]) buckets[g] = [];
      buckets[g]!.push(n);
    }
    return GROUP_ORDER.filter(g => buckets[g]?.length).map(g => ({ title: g, data: buckets[g]! }));
  }, [filtered]);

  /* ── Filter chips ── */
  const filterOptions: FilterOption[] = [FILTER_ALL, ...Object.keys(CAT_META) as NotifCategory[]];

  return (
    <View style={[s.root, { paddingTop: topPad }]}>

      {/* ── Header ── */}
      <Animated.View entering={FadeInDown.duration(280)} style={s.header}>
        <TouchableOpacity
          style={s.iconBtn}
          onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.back(); }}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Feather name="arrow-left" size={22} color={C.navy} />
        </TouchableOpacity>

        <View style={s.headerCenter}>
          <Text style={s.title}>Notifications</Text>
          {unreadCount > 0 && (
            <View style={s.badge}>
              <Text style={s.badgeText}>{unreadCount}</Text>
            </View>
          )}
        </View>

        <View style={s.headerActions}>
          <TouchableOpacity
            style={s.iconBtn}
            onPress={toggleSearch}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Feather name={searchOpen ? "x" : "search"} size={18} color={C.navy} />
          </TouchableOpacity>
          {unreadCount > 0 && (
            <TouchableOpacity onPress={markAllRead} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Text style={s.markAll}>Mark all read</Text>
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>

      {/* ── Search bar ── */}
      <Animated.View style={[s.searchWrap, searchBarStyle]}>
        <View style={s.searchBox}>
          <Feather name="search" size={15} color={C.textMut} />
          <TextInput
            ref={searchRef}
            style={s.searchInput}
            placeholder="Search notifications…"
            placeholderTextColor={C.textMut}
            value={searchText}
            onChangeText={setSearchText}
            returnKeyType="search"
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => setSearchText("")}>
              <Feather name="x-circle" size={15} color={C.textMut} />
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>

      {/* ── Filter chips ── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={s.chipScroll}
        contentContainerStyle={s.chipContent}
      >
        {filterOptions.map(f => {
          const isActive = activeFilter === f;
          const meta = f !== FILTER_ALL ? CAT_META[f as NotifCategory] : null;
          return (
            <TouchableOpacity
              key={f}
              style={[s.chip, isActive && s.chipActive]}
              onPress={() => { Haptics.selectionAsync(); setFilter(f); }}
              activeOpacity={0.75}
            >
              {meta && (
                <View style={[s.chipDot, { backgroundColor: isActive ? "#FFFFFF" : meta.iconColor }]} />
              )}
              <Text style={[s.chipText, isActive && s.chipTextActive]}>
                {f === FILTER_ALL ? "All" : meta!.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View style={s.divider} />

      {/* ── Content ── */}
      {loading ? (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: 8 }}>
          {Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} index={i} />)}
        </ScrollView>
      ) : filtered.length === 0 ? (
        <Animated.View entering={FadeInUp.duration(320)} style={s.emptyState}>
          <View style={s.emptyIcon}>
            <Feather name={searchText || activeFilter !== FILTER_ALL ? "search" : "bell-off"} size={32} color={C.textMut} />
          </View>
          <Text style={s.emptyTitle}>
            {searchText ? "No results found" : activeFilter !== FILTER_ALL ? "No notifications here" : "You're all caught up"}
          </Text>
          <Text style={s.emptySub}>
            {searchText
              ? `No notifications match "${searchText}"`
              : activeFilter !== FILTER_ALL
              ? "No notifications in this category yet."
              : "New alerts will appear here when activity happens on your account."}
          </Text>
          {(searchText || activeFilter !== FILTER_ALL) && (
            <TouchableOpacity
              style={s.clearBtn}
              onPress={() => { setSearchText(""); setFilter(FILTER_ALL); }}
            >
              <Text style={s.clearBtnText}>Clear filters</Text>
            </TouchableOpacity>
          )}
        </Animated.View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[s.scroll, { paddingBottom: insets.bottom + 60 }]}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={C.accent}
              colors={[C.accent]}
            />
          }
        >
          {grouped.map((section, si) => (
            <Animated.View key={section.title} entering={FadeIn.duration(260).delay(si * 40)}>
              <Text style={s.sectionLabel}>{section.title}</Text>
              {section.data.map((notif, i) => (
                <NotifCard
                  key={notif.id}
                  item={notif}
                  index={i}
                  onPress={() => markRead(notif.id)}
                  onDismiss={() => dismiss(notif.id)}
                />
              ))}
            </Animated.View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

/* ─── Styles ─────────────────────────────────────────────────────────────── */
const s = StyleSheet.create({
  root:          { flex: 1, backgroundColor: C.bg },
  header:        { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingBottom: 10, paddingTop: 8 },
  iconBtn:       { width: 36, height: 36, alignItems: "center", justifyContent: "center" },
  headerCenter:  { flexDirection: "row", alignItems: "center", gap: 6, flex: 1, justifyContent: "center" },
  headerActions: { flexDirection: "row", alignItems: "center", gap: 6 },
  title:         { fontSize: 18, fontFamily: "Manrope_700Bold", color: C.navy },
  badge:         { backgroundColor: C.danger, borderRadius: 10, minWidth: 20, height: 20, alignItems: "center", justifyContent: "center", paddingHorizontal: 5 },
  badgeText:     { fontSize: 11, fontFamily: "Manrope_700Bold", color: "#FFF" },
  markAll:       { fontSize: 12, fontFamily: "Manrope_600SemiBold", color: C.info },

  searchWrap:  { paddingHorizontal: 16, paddingBottom: 6, overflow: "hidden" },
  searchBox:   { flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: "#F8F9FA", borderRadius: 12, borderWidth: 1, borderColor: C.border, paddingHorizontal: 12, height: 40 },
  searchInput: { flex: 1, fontSize: 14, fontFamily: "Manrope_400Regular", color: C.text, paddingVertical: 0 },

  chipScroll:  { maxHeight: 44, marginBottom: 4 },
  chipContent: { paddingHorizontal: 16, gap: 6, alignItems: "center", paddingVertical: 6 },
  chip:        { flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: C.border, backgroundColor: "#F8F9FA" },
  chipActive:  { backgroundColor: C.navy, borderColor: C.navy },
  chipDot:     { width: 6, height: 6, borderRadius: 3 },
  chipText:    { fontSize: 12, fontFamily: "Manrope_500Medium", color: C.textSec },
  chipTextActive: { color: "#FFFFFF" },

  divider:      { height: 1, backgroundColor: C.border },
  scroll:       { paddingTop: 4 },
  sectionLabel: { fontSize: 11, fontFamily: "Manrope_700Bold", color: C.textMut, textTransform: "uppercase", letterSpacing: 0.7, paddingHorizontal: 20, paddingTop: 16, paddingBottom: 6 },

  emptyState: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 40, gap: 10 },
  emptyIcon:  { width: 72, height: 72, borderRadius: 36, backgroundColor: "#F0F0F0", alignItems: "center", justifyContent: "center", marginBottom: 4 },
  emptyTitle: { fontSize: 17, fontFamily: "Manrope_700Bold", color: C.text },
  emptySub:   { fontSize: 13, fontFamily: "Manrope_400Regular", color: C.textSec, textAlign: "center", lineHeight: 20 },
  clearBtn:   { marginTop: 4, paddingHorizontal: 18, paddingVertical: 9, borderRadius: 10, backgroundColor: "#EFF6FF", borderWidth: 1, borderColor: "#BFDBFE" },
  clearBtnText: { fontSize: 13, fontFamily: "Manrope_600SemiBold", color: C.info },
});

const nc = StyleSheet.create({
  card:       { flexDirection: "row", alignItems: "flex-start", paddingHorizontal: 20, paddingVertical: 13, gap: 12, position: "relative" },
  cardUnread: { backgroundColor: "#F8FCFF" },
  unreadDot:  { position: "absolute", top: 19, left: 7, width: 6, height: 6, borderRadius: 3, backgroundColor: C.info },
  iconWrap:   { width: 42, height: 42, borderRadius: 13, alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 },
  content:    { flex: 1, gap: 2 },
  topRow:     { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 8 },
  title:      { fontSize: 13, fontFamily: "Manrope_500Medium", color: C.text, flex: 1 },
  titleBold:  { fontFamily: "Manrope_700Bold" },
  body:       { fontSize: 12, fontFamily: "Manrope_400Regular", color: C.textSec, lineHeight: 17 },

  metaRow:    { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 2 },
  time:       { fontSize: 11, fontFamily: "Manrope_400Regular", color: C.textMut },
  badge:      { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 7, paddingVertical: 2, borderRadius: 8 },
  badgeDot:   { width: 5, height: 5, borderRadius: 3 },
  badgeText:  { fontSize: 10, fontFamily: "Manrope_600SemiBold" },

  ctaBtn:    { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 6, alignSelf: "flex-start", paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8, backgroundColor: "#EFF6FF", borderWidth: 1, borderColor: "#BFDBFE" },
  ctaText:   { fontSize: 11, fontFamily: "Manrope_600SemiBold", color: C.info },

  separator: { height: 1, backgroundColor: C.border, marginHorizontal: 20 },

  /* Swipe-to-dismiss */
  swipeAction:     { justifyContent: "center", alignItems: "center", width: 80, backgroundColor: C.danger, gap: 4 },
  swipeActionText: { fontSize: 11, fontFamily: "Manrope_600SemiBold", color: "#FFFFFF" },
});

const sk = StyleSheet.create({
  row:   { flexDirection: "row", alignItems: "center", paddingHorizontal: 20, paddingVertical: 14, gap: 12 },
  icon:  { width: 42, height: 42, borderRadius: 13, backgroundColor: "#F0F0F0" },
  lines: { flex: 1, gap: 0 },
  line:  { height: 10, borderRadius: 5, backgroundColor: "#F0F0F0" },
});
