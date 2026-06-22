import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  Easing,
  FadeIn,
  FadeInDown,
  FadeInRight,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";

/* ─── Data ─────────────────────────────────────────────────── */
const TRANSACTIONS = [
  { id: "1", title: "Amazon Gift Card", sub: "Sold • Apr 28", amount: "+₦200,040", positive: true,  icon: "shopping-bag" as const },
  { id: "2", title: "MTN Data Service", sub: "Withdraw • Apr 25", amount: "-₦15,000",  positive: false, icon: "arrow-up-right" as const },
  { id: "3", title: "iTunes Gift Card", sub: "Sold • Apr 22", amount: "+₦89,500",  positive: true,  icon: "music"         as const },
  { id: "4", title: "Steam Gift Card",  sub: "Sold • Apr 20", amount: "+₦45,200",  positive: true,  icon: "monitor"       as const },
];

const STATS = [
  { label: "Total Sold",    value: "₦500K", icon: "trending-up" as const,   color: "#00D9A0" },
  { label: "Transactions",  value: "14",     icon: "activity"    as const,   color: "#818CF8" },
  { label: "Best Rate",     value: "₦780/$", icon: "zap"         as const,   color: "#F59E0B" },
];

/* ─── Skeleton shimmer ──────────────────────────────────────── */
function Skeleton({ w, h, radius = 8, style }: { w: number | `${number}%`; h: number; radius?: number; style?: object }) {
  const op = useSharedValue(0.35);
  useEffect(() => {
    op.value = withRepeat(
      withSequence(
        withTiming(0.75, { duration: 700, easing: Easing.sin }),
        withTiming(0.35, { duration: 700, easing: Easing.sin }),
      ),
      -1,
      true,
    );
  }, []);
  const anim = useAnimatedStyle(() => ({ opacity: op.value }));
  return (
    <Animated.View
      style={[{ width: w, height: h, borderRadius: radius, backgroundColor: "#1C1C2A" }, style, anim]}
    />
  );
}

/* ─── Action button ─────────────────────────────────────────── */
function ActionBtn({ icon, label, onPress }: { icon: keyof typeof Feather.glyphMap; label: string; onPress: () => void }) {
  const colors = useColors();
  const scale  = useSharedValue(1);
  const anim   = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const tap = () => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); onPress(); };
  return (
    <Animated.View style={anim}>
      <Pressable
        style={s.actionItem}
        onPress={tap}
        onPressIn={() => { scale.value = withSpring(0.88, { damping: 12, stiffness: 300 }); }}
        onPressOut={() => { scale.value = withSpring(1.0,  { damping: 12, stiffness: 300 }); }}
      >
        <View style={[s.actionIcon, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Feather name={icon} size={18} color={colors.accent} />
        </View>
        <Text style={[s.actionLabel, { color: colors.mutedForeground }]}>{label}</Text>
      </Pressable>
    </Animated.View>
  );
}

/* ─── Stat card ─────────────────────────────────────────────── */
function StatCard({ label, value, icon, color, delay }: typeof STATS[0] & { delay: number }) {
  const colors = useColors();
  const scale  = useSharedValue(1);
  const anim   = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  return (
    <Animated.View entering={FadeInRight.duration(340).springify().delay(delay)} style={anim}>
      <Pressable
        style={[s.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}
        onPressIn={() => { scale.value = withSpring(0.95, { damping: 12, stiffness: 300 }); }}
        onPressOut={() => { scale.value = withSpring(1.0,  { damping: 12, stiffness: 300 }); }}
      >
        <View style={[s.statIcon, { backgroundColor: color + "22" }]}>
          <Feather name={icon} size={15} color={color} />
        </View>
        <Text style={[s.statValue, { color: colors.text }]}>{value}</Text>
        <Text style={[s.statLabel, { color: colors.mutedForeground }]}>{label}</Text>
      </Pressable>
    </Animated.View>
  );
}

/* ─── Transaction row ───────────────────────────────────────── */
function TxRow({ tx, delay, onPress }: { tx: typeof TRANSACTIONS[0]; delay: number; onPress: () => void }) {
  const colors = useColors();
  const scale  = useSharedValue(1);
  const anim   = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  return (
    <Animated.View
      entering={FadeInRight.duration(340).springify().delay(delay)}
      style={anim}
    >
      <Pressable
        style={[s.txRow, { borderBottomColor: colors.border }]}
        onPress={onPress}
        onPressIn={() => { scale.value = withSpring(0.98, { damping: 14, stiffness: 300 }); }}
        onPressOut={() => { scale.value = withSpring(1.0,  { damping: 14, stiffness: 300 }); }}
      >
        <View style={[s.txIcon, {
          backgroundColor: tx.positive ? colors.successLight : colors.destructiveDim,
        }]}>
          <Feather
            name={tx.positive ? "arrow-down-left" : "arrow-up-right"}
            size={14}
            color={tx.positive ? colors.success : colors.destructive}
          />
        </View>
        <View style={s.txMid}>
          <Text style={[s.txTitle, { color: colors.text }]}>{tx.title}</Text>
          <Text style={[s.txSub,   { color: colors.mutedForeground }]}>{tx.sub}</Text>
        </View>
        <View style={s.txRight}>
          <Text style={[s.txAmount, { color: tx.positive ? colors.success : colors.destructive }]}>
            {tx.amount}
          </Text>
          <View style={[s.txBadge, { backgroundColor: tx.positive ? colors.successLight : colors.destructiveDim }]}>
            <Text style={[s.txBadgeText, { color: tx.positive ? colors.success : colors.destructive }]}>
              {tx.positive ? "Sold" : "Debit"}
            </Text>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

/* ─── Main screen ───────────────────────────────────────────── */
export default function DashboardScreen() {
  const router = useRouter();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuth();

  const topPad = Platform.OS === "web" ? 48 : insets.top;

  /* skeleton → content reveal */
  const [loaded, setLoaded]           = useState(false);
  const [displayBalance, setDisplay]  = useState(0);
  const [balanceHidden, setHidden]    = useState(false);
  const counterRef                    = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 750);
    return () => clearTimeout(t);
  }, []);

  /* balance counter — starts after skeleton disappears */
  useEffect(() => {
    if (!loaded) return;
    const target = user?.balance ?? 0;
    if (counterRef.current) clearInterval(counterRef.current);
    let step = 0;
    const steps = 55;
    const intervalMs = 1300 / steps;
    counterRef.current = setInterval(() => {
      step++;
      const p   = step / steps;
      const eas = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(target * eas));
      if (step >= steps) {
        if (counterRef.current) clearInterval(counterRef.current);
        setDisplay(target);
      }
    }, intervalMs);
    return () => { if (counterRef.current) clearInterval(counterRef.current); };
  }, [loaded, user?.balance]);

  /* floating balance card */
  const floatY    = useSharedValue(0);
  const floatAnim = useAnimatedStyle(() => ({ transform: [{ translateY: floatY.value }] }));
  useEffect(() => {
    floatY.value = withRepeat(
      withSequence(
        withTiming(-5, { duration: 2400, easing: Easing.sin }),
        withTiming(0,  { duration: 2400, easing: Easing.sin }),
      ),
      -1,
      true,
    );
  }, []);

  const fmt = (n: number) => "₦" + n.toLocaleString("en-NG");

  /* ── Skeleton state ── */
  if (!loaded) {
    return (
      <View style={[s.root, { backgroundColor: colors.background, paddingTop: topPad + 20 }]}>
        <View style={s.skHeader}>
          <Skeleton w="45%" h={14} style={{ marginBottom: 10 }} />
          <Skeleton w={38} h={38} radius={12} />
        </View>
        <View style={[s.skCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Skeleton w="35%" h={12} style={{ marginBottom: 16 }} />
          <Skeleton w="65%" h={46} radius={10} style={{ marginBottom: 10 }} />
          <Skeleton w="45%" h={10} />
        </View>
        <View style={s.skActions}>
          {[0,1,2,3].map(i => (
            <View key={i} style={{ alignItems: "center", gap: 8 }}>
              <Skeleton w={52} h={52} radius={16} />
              <Skeleton w={44} h={10} />
            </View>
          ))}
        </View>
        <View style={{ paddingHorizontal: 20, paddingTop: 24 }}>
          <Skeleton w="40%" h={14} style={{ marginBottom: 16 }} />
          {[0,1,2,3].map(i => (
            <View key={i} style={s.skTxRow}>
              <Skeleton w={44} h={44} radius={14} />
              <View style={{ flex: 1, gap: 8 }}>
                <Skeleton w="60%" h={13} />
                <Skeleton w="40%" h={10} />
              </View>
              <Skeleton w={80} h={13} />
            </View>
          ))}
        </View>
      </View>
    );
  }

  /* ── Loaded state ── */
  return (
    <Animated.View entering={FadeIn.duration(350)} style={[s.root, { backgroundColor: colors.background }]}>

      {/* ── Fixed header ── */}
      <View style={[s.headerWrap, { paddingTop: topPad + 16, borderBottomColor: colors.border }]}>

        {/* Top bar */}
        <Animated.View entering={FadeInDown.duration(380).springify()} style={s.topBar}>
          <View>
            <Text style={[s.greeting, { color: colors.mutedForeground }]}>
              Good morning 👋
            </Text>
            <Text style={[s.username, { color: colors.text }]}>
              {user?.name ?? "User"}
            </Text>
          </View>
          <View style={s.topBarRight}>
            <TouchableOpacity
              style={[s.iconBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}
              activeOpacity={0.75}
            >
              <Feather name="bell" size={16} color={colors.mutedForeground} />
              <View style={[s.notifDot, { backgroundColor: colors.accent }]} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={logout}
              style={[s.iconBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}
              activeOpacity={0.75}
            >
              <Feather name="log-out" size={15} color={colors.mutedForeground} />
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Balance card — floating */}
        <Animated.View
          entering={FadeInUp.duration(420).springify().delay(60)}
          style={floatAnim}
        >
          <View style={[s.balanceCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            {/* Teal accent top stripe */}
            <View style={[s.accentStripe, { backgroundColor: colors.accent }]} />

            <View style={s.balanceTop}>
              <Text style={[s.balanceLabel, { color: colors.mutedForeground }]}>Total Balance</Text>
              <TouchableOpacity
                onPress={() => setHidden(v => !v)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Feather
                  name={balanceHidden ? "eye-off" : "eye"}
                  size={16}
                  color={colors.mutedForeground}
                />
              </TouchableOpacity>
            </View>

            <Text style={[s.balanceAmount, { color: colors.text }]}>
              {balanceHidden ? "₦ ••••••" : fmt(displayBalance)}
            </Text>

            <View style={s.balanceFooter}>
              <View style={[s.changeBadge, { backgroundColor: colors.accentDim }]}>
                <Feather name="trending-up" size={11} color={colors.accent} />
                <Text style={[s.changeText, { color: colors.accent }]}>+₦45,000 this month</Text>
              </View>
              <Text style={[s.balanceDate, { color: colors.mutedForeground }]}>Updated now</Text>
            </View>
          </View>
        </Animated.View>

        {/* Quick actions */}
        <Animated.View
          entering={FadeInUp.duration(380).springify().delay(120)}
          style={s.actionsRow}
        >
          <ActionBtn icon="arrow-up"   label="Top Up"     onPress={() => {}} />
          <ActionBtn icon="send"       label="Send"       onPress={() => {}} />
          <ActionBtn icon="gift"       label="Gift Cards" onPress={() => router.push("/(app)/gift-cards")} />
          <ActionBtn icon="refresh-cw" label="Withdraw"   onPress={() => {}} />
        </Animated.View>
      </View>

      {/* ── Scroll content ── */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[s.scrollContent, { paddingBottom: insets.bottom + 32 }]}
        showsVerticalScrollIndicator={false}
        overScrollMode="never"
      >

        {/* Stats strip */}
        <Animated.View entering={FadeInUp.duration(360).springify().delay(140)}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={s.statsScroll}
          >
            {STATS.map((st, i) => (
              <StatCard key={st.label} {...st} delay={i * 60} />
            ))}
          </ScrollView>
        </Animated.View>

        {/* Promo card */}
        <Animated.View entering={FadeInUp.duration(360).springify().delay(180)}>
          <TouchableOpacity
            style={[s.promoCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={() => router.push("/(app)/gift-cards")}
            activeOpacity={0.86}
          >
            <View style={[s.promoLeft, { backgroundColor: colors.accentDim }]}>
              <Feather name="gift" size={22} color={colors.accent} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[s.promoTitle, { color: colors.text }]}>Sell a Gift Card</Text>
              <Text style={[s.promoSub,   { color: colors.mutedForeground }]}>
                Amazon · iTunes · Steam · Google Play
              </Text>
            </View>
            <View style={[s.promoChevron, { backgroundColor: colors.accent }]}>
              <Feather name="chevron-right" size={17} color={colors.primaryForeground} />
            </View>
          </TouchableOpacity>
        </Animated.View>

        {/* Section header */}
        <Animated.View
          entering={FadeInUp.duration(340).springify().delay(220)}
          style={s.sectionHeader}
        >
          <View>
            <Text style={[s.sectionTitle, { color: colors.text }]}>Recent Activity</Text>
            <Text style={[s.sectionSub,   { color: colors.mutedForeground }]}>Your last 4 transactions</Text>
          </View>
          <TouchableOpacity
            style={[s.seeAllBtn, { backgroundColor: colors.accentDim }]}
            onPress={() => router.push("/(app)/transactions")}
          >
            <Text style={[s.seeAllText, { color: colors.accent }]}>See All</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Transaction list */}
        <View style={[s.txCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          {TRANSACTIONS.map((tx, i) => (
            <TxRow
              key={tx.id}
              tx={tx}
              delay={260 + i * 55}
              onPress={() => router.push("/(app)/card-status")}
            />
          ))}
        </View>

      </ScrollView>
    </Animated.View>
  );
}

/* ─── Styles ────────────────────────────────────────────────── */
const s = StyleSheet.create({
  root: { flex: 1 },

  /* skeleton */
  skHeader:  { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 24, marginBottom: 20 },
  skCard:    { marginHorizontal: 20, borderRadius: 20, borderWidth: 1, padding: 20, marginBottom: 24 },
  skActions: { flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 24, marginBottom: 8 },
  skTxRow:   { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 18 },

  /* header */
  headerWrap: { paddingBottom: 20, borderBottomWidth: StyleSheet.hairlineWidth },
  topBar:     { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", paddingHorizontal: 24, marginBottom: 20 },
  greeting:   { fontSize: 12, fontFamily: "Manrope_400Regular", marginBottom: 2 },
  username:   { fontSize: 20, fontFamily: "Manrope_700Bold", letterSpacing: -0.4 },
  topBarRight:{ flexDirection: "row", gap: 10 },
  iconBtn: {
    width: 38, height: 38, borderRadius: 12,
    alignItems: "center", justifyContent: "center", borderWidth: 1,
  },
  notifDot: {
    position: "absolute", top: 8, right: 8,
    width: 7, height: 7, borderRadius: 4,
    borderWidth: 1.5, borderColor: "#0A0A0F",
  },

  /* balance card */
  balanceCard: {
    marginHorizontal: 20, borderRadius: 20, borderWidth: 1, padding: 20,
    overflow: "hidden", marginBottom: 20,
  },
  accentStripe: {
    position: "absolute", top: 0, left: 0, right: 0, height: 2.5,
    opacity: 0.7,
  },
  balanceTop:    { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  balanceLabel:  { fontSize: 12, fontFamily: "Manrope_600SemiBold", textTransform: "uppercase", letterSpacing: 0.8 },
  balanceAmount: { fontSize: 40, fontFamily: "Manrope_700Bold", letterSpacing: -2, marginBottom: 14 },
  balanceFooter: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  changeBadge:   { flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  changeText:    { fontSize: 11, fontFamily: "Manrope_600SemiBold" },
  balanceDate:   { fontSize: 11, fontFamily: "Manrope_400Regular" },

  /* actions */
  actionsRow: { flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 24 },
  actionItem: { alignItems: "center", gap: 8 },
  actionIcon: { width: 54, height: 54, borderRadius: 18, alignItems: "center", justifyContent: "center", borderWidth: 1 },
  actionLabel:{ fontSize: 11, fontFamily: "Manrope_500Medium" },

  /* scroll */
  scrollContent: { paddingTop: 24 },

  /* stats */
  statsScroll: { paddingHorizontal: 20, gap: 12, paddingBottom: 4, marginBottom: 20 },
  statCard: {
    width: 120, borderRadius: 18, borderWidth: 1, padding: 14, gap: 8,
  },
  statIcon:  { width: 34, height: 34, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  statValue: { fontSize: 17, fontFamily: "Manrope_700Bold", letterSpacing: -0.4 },
  statLabel: { fontSize: 11, fontFamily: "Manrope_400Regular" },

  /* promo */
  promoCard: {
    marginHorizontal: 20, borderRadius: 18, borderWidth: 1,
    padding: 16, flexDirection: "row", alignItems: "center", gap: 14, marginBottom: 24,
  },
  promoLeft:    { width: 50, height: 50, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  promoTitle:   { fontSize: 15, fontFamily: "Manrope_700Bold", marginBottom: 3 },
  promoSub:     { fontSize: 11, fontFamily: "Manrope_400Regular" },
  promoChevron: { width: 36, height: 36, borderRadius: 11, alignItems: "center", justifyContent: "center" },

  /* section header */
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 14, paddingHorizontal: 20 },
  sectionTitle:  { fontSize: 17, fontFamily: "Manrope_700Bold", letterSpacing: -0.3, marginBottom: 2 },
  sectionSub:    { fontSize: 11, fontFamily: "Manrope_400Regular" },
  seeAllBtn:     { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  seeAllText:    { fontSize: 12, fontFamily: "Manrope_600SemiBold" },

  /* tx card */
  txCard: { marginHorizontal: 20, borderRadius: 20, borderWidth: 1, overflow: "hidden" },
  txRow: {
    flexDirection: "row", alignItems: "center",
    paddingVertical: 14, paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth, gap: 12,
  },
  txIcon:      { width: 44, height: 44, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  txMid:       { flex: 1 },
  txTitle:     { fontSize: 14, fontFamily: "Manrope_600SemiBold", marginBottom: 3 },
  txSub:       { fontSize: 11, fontFamily: "Manrope_400Regular" },
  txRight:     { alignItems: "flex-end", gap: 4 },
  txAmount:    { fontSize: 14, fontFamily: "Manrope_700Bold" },
  txBadge:     { paddingHorizontal: 7, paddingVertical: 2, borderRadius: 6 },
  txBadgeText: { fontSize: 10, fontFamily: "Manrope_600SemiBold" },
});
