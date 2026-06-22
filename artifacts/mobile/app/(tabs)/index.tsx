import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
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
  FadeInDown,
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

/* ─── Service tile data ──────────────────────────────────────────────────────── */

const SERVICES = [
  {
    id: "sell",
    icon: "tag" as const,
    title: "Sell Gift Cards",
    subtitle: "Amazon, iTunes, Steam & more",
    color: "#00D9A0",
    gradient: ["#00D9A020", "#00D9A008"] as [string, string],
    route: "/(app)/gift-cards" as const,
    badge: "Best Rate",
  },
  {
    id: "buy",
    icon: "shopping-bag" as const,
    title: "Buy Gift Cards",
    subtitle: "Shop at 200+ brands globally",
    color: "#8B5CF6",
    gradient: ["#8B5CF620", "#8B5CF608"] as [string, string],
    route: "/(app)/gift-cards" as const,
    badge: null,
  },
  {
    id: "bill",
    icon: "zap" as const,
    title: "Bill Payments",
    subtitle: "Airtime, data, electricity",
    color: "#F59E0B",
    gradient: ["#F59E0B20", "#F59E0B08"] as [string, string],
    route: "/(app)/gift-cards" as const,
    badge: null,
  },
  {
    id: "esim",
    icon: "wifi" as const,
    title: "eSIM Plans",
    subtitle: "Global connectivity in 200+ countries",
    color: "#3B82F6",
    gradient: ["#3B82F620", "#3B82F608"] as [string, string],
    route: "/(app)/gift-cards" as const,
    badge: "New",
  },
  {
    id: "card",
    icon: "credit-card" as const,
    title: "Virtual Card",
    subtitle: "Pay anywhere with Payvora Dollars",
    color: "#EC4899",
    gradient: ["#EC489920", "#EC489908"] as [string, string],
    route: "/(app)/dashboard" as const,
    badge: null,
  },
  {
    id: "trade",
    icon: "refresh-cw" as const,
    title: "Trade Assets",
    subtitle: "Currency & crypto exchange",
    color: "#06B6D4",
    gradient: ["#06B6D420", "#06B6D408"] as [string, string],
    route: "/(app)/trade-asset" as const,
    badge: null,
  },
] as const;

const PROMOS = [
  {
    id: "p1",
    title: "Sell Gift Cards at Top Rates",
    sub: "Instant payout to your wallet",
    icon: "gift" as const,
    colors: ["#00D9A0", "#00A878"] as [string, string],
  },
  {
    id: "p2",
    title: "Get a Virtual Dollar Card",
    sub: "Shop globally with Payvora Dollars",
    icon: "credit-card" as const,
    colors: ["#3B82F6", "#2563EB"] as [string, string],
  },
  {
    id: "p3",
    title: "eSIM — Stay Connected Abroad",
    sub: "No physical SIM, all digital",
    icon: "wifi" as const,
    colors: ["#8B5CF6", "#7C3AED"] as [string, string],
  },
];

/* ─── Service card ───────────────────────────────────────────────────────────── */

function ServiceCard({
  item,
  onPress,
}: {
  item: (typeof SERVICES)[number];
  onPress: () => void;
}) {
  const colors = useColors();
  const sc = useSharedValue(1);
  const anim = useAnimatedStyle(() => ({ transform: [{ scale: sc.value }] }));

  return (
    <Animated.View style={[anim, svc.wrap]}>
      <Pressable
        onPress={onPress}
        onPressIn={() => { sc.value = withSpring(0.94, { damping: 13 }); }}
        onPressOut={() => { sc.value = withSpring(1, { damping: 13 }); }}
        style={[svc.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
      >
        <LinearGradient
          colors={item.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />

        {/* Icon */}
        <View style={[svc.iconWrap, { backgroundColor: item.color + "22" }]}>
          <Feather name={item.icon} size={22} color={item.color} />
        </View>

        {/* Badge */}
        {item.badge && (
          <View style={[svc.badge, { backgroundColor: item.color + "25" }]}>
            <Text style={[svc.badgeText, { color: item.color }]}>{item.badge}</Text>
          </View>
        )}

        <Text style={[svc.title, { color: colors.text }]} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={[svc.sub, { color: colors.mutedForeground }]} numberOfLines={2}>
          {item.subtitle}
        </Text>

        {/* Arrow */}
        <View style={[svc.arrow, { backgroundColor: item.color + "18" }]}>
          <Feather name="arrow-right" size={12} color={item.color} />
        </View>
      </Pressable>
    </Animated.View>
  );
}

/* ─── Promo banner ───────────────────────────────────────────────────────────── */

function PromoBanner({ item, onPress }: { item: (typeof PROMOS)[number]; onPress: () => void }) {
  const sc = useSharedValue(1);
  const anim = useAnimatedStyle(() => ({ transform: [{ scale: sc.value }] }));

  return (
    <Animated.View style={[anim, pb.wrap]}>
      <Pressable
        onPress={onPress}
        onPressIn={() => { sc.value = withSpring(0.97, { damping: 14 }); }}
        onPressOut={() => { sc.value = withSpring(1, { damping: 14 }); }}
      >
        <LinearGradient colors={item.colors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={pb.card}>
          {/* Decorative circle */}
          <View style={pb.orb} />
          <View style={[pb.iconBox, { backgroundColor: "rgba(255,255,255,0.18)" }]}>
            <Feather name={item.icon} size={20} color="#FFFFFF" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={pb.title}>{item.title}</Text>
            <Text style={pb.sub}>{item.sub}</Text>
          </View>
          <View style={[pb.arrow, { backgroundColor: "rgba(255,255,255,0.2)" }]}>
            <Feather name="chevron-right" size={16} color="#FFFFFF" />
          </View>
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
}

/* ─── Balance mini pill ──────────────────────────────────────────────────────── */

function BalancePill({ balance }: { balance: number }) {
  const colors = useColors();
  const fmt = (n: number) => "₦" + n.toLocaleString("en-NG");

  return (
    <TouchableOpacity
      style={[bp.pill, { backgroundColor: colors.accentDim, borderColor: "rgba(0,217,160,0.2)" }]}
      activeOpacity={0.8}
    >
      <View style={[bp.dot, { backgroundColor: "#00D9A0" }]} />
      <Text style={[bp.label, { color: colors.mutedForeground }]}>Balance</Text>
      <Text style={[bp.amount, { color: "#00D9A0" }]}>{fmt(balance)}</Text>
    </TouchableOpacity>
  );
}

/* ─── Main screen ────────────────────────────────────────────────────────────── */

export default function HomeScreen() {
  const router = useRouter();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  const topPad = Platform.OS === "web" ? 48 : insets.top;
  const firstName = (user?.name ?? "User").split(" ")[0];

  /* Pulse animation for live indicator */
  const pulse = useSharedValue(1);
  useEffect(() => {
    pulse.value = withRepeat(
      withSequence(
        withTiming(1.3, { duration: 900, easing: Easing.inOut(Easing.sin) }),
        withTiming(1, { duration: 900, easing: Easing.inOut(Easing.sin) }),
      ),
      -1,
      true,
    );
  }, []);
  const pulseStyle = useAnimatedStyle(() => ({ transform: [{ scale: pulse.value }] }));

  return (
    <View style={[s.root, { backgroundColor: colors.background }]}>

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <Animated.View
        entering={FadeInDown.duration(380).springify()}
        style={[s.header, { paddingTop: topPad + 12 }]}
      >
        <View>
          <View style={s.liveRow}>
            <Animated.View style={[s.liveDot, { backgroundColor: "#00D9A0" }, pulseStyle]} />
            <Text style={[s.liveText, { color: colors.mutedForeground }]}>AZA Platform</Text>
          </View>
          <Text style={[s.welcome, { color: colors.text }]}>
            Hi, {firstName} 👋
          </Text>
        </View>

        <TouchableOpacity
          style={[s.dashBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}
          onPress={() => router.push("/(app)/dashboard")}
          activeOpacity={0.78}
        >
          <Feather name="grid" size={17} color={colors.mutedForeground} />
        </TouchableOpacity>
      </Animated.View>

      {/* Balance pill */}
      <Animated.View
        entering={FadeInDown.duration(340).springify().delay(60)}
        style={s.balPillWrap}
      >
        <BalancePill balance={user?.balance ?? 0} />
      </Animated.View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[s.scroll, { paddingBottom: insets.bottom + 40 }]}
      >

        {/* ── Promo banners ─────────────────────────────────────────────────── */}
        <Animated.View entering={FadeInUp.duration(400).springify().delay(40)}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={s.promoScroll}
            snapToInterval={SCREEN_PROMO_W + 12}
            decelerationRate="fast"
          >
            {PROMOS.map(p => (
              <PromoBanner
                key={p.id}
                item={p}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  router.push("/(app)/gift-cards");
                }}
              />
            ))}
          </ScrollView>
        </Animated.View>

        {/* ── Services header ───────────────────────────────────────────────── */}
        <Animated.View
          entering={FadeInUp.duration(360).springify().delay(80)}
          style={s.secRow}
        >
          <View>
            <Text style={[s.secTitle, { color: colors.text }]}>Services</Text>
            <Text style={[s.secSub, { color: colors.mutedForeground }]}>
              What would you like to do?
            </Text>
          </View>
        </Animated.View>

        {/* ── Service grid ──────────────────────────────────────────────────── */}
        <Animated.View
          entering={FadeInUp.duration(380).springify().delay(120)}
          style={s.grid}
        >
          {SERVICES.map((item, i) => (
            <Animated.View
              key={item.id}
              entering={FadeInUp.duration(320).springify().delay(120 + i * 40)}
              style={s.gridCell}
            >
              <ServiceCard
                item={item}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  router.push(item.route as any);
                }}
              />
            </Animated.View>
          ))}
        </Animated.View>

        {/* ── Quick access section ──────────────────────────────────────────── */}
        <Animated.View
          entering={FadeInUp.duration(360).springify().delay(260)}
          style={s.secRow}
        >
          <Text style={[s.secTitle, { color: colors.text }]}>Quick Access</Text>
        </Animated.View>

        <Animated.View
          entering={FadeInUp.duration(380).springify().delay(290)}
          style={s.quickList}
        >
          {[
            { icon: "trending-up" as const, label: "View Dashboard",     sub: "Balance, transactions & virtual card", route: "/(app)/dashboard" as const, color: "#00D9A0" },
            { icon: "layers" as const,      label: "Trade Assets",        sub: "Exchange currency & crypto",           route: "/(app)/trade-asset" as const, color: "#3B82F6" },
            { icon: "check-circle" as const,label: "Transactions",        sub: "Full transaction history",             route: "/(app)/transactions" as const, color: "#8B5CF6" },
          ].map((item, i) => (
            <Animated.View
              key={item.label}
              entering={FadeInUp.duration(300).springify().delay(290 + i * 50)}
            >
              <TouchableOpacity
                style={[s.quickRow, { backgroundColor: colors.surface, borderColor: colors.border }]}
                onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.push(item.route as any); }}
                activeOpacity={0.82}
              >
                <View style={[s.quickIcon, { backgroundColor: item.color + "18" }]}>
                  <Feather name={item.icon} size={18} color={item.color} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[s.quickLabel, { color: colors.text }]}>{item.label}</Text>
                  <Text style={[s.quickSub, { color: colors.mutedForeground }]}>{item.sub}</Text>
                </View>
                <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
              </TouchableOpacity>
            </Animated.View>
          ))}
        </Animated.View>

        {/* ── Footer tagline ────────────────────────────────────────────────── */}
        <Animated.View
          entering={FadeInUp.duration(340).springify().delay(360)}
          style={s.footer}
        >
          <View style={[s.footerLine, { backgroundColor: colors.border }]} />
          <Text style={[s.footerText, { color: colors.mutedForeground }]}>
            PAYVORA · FINTECH REIMAGINED
          </Text>
          <View style={[s.footerLine, { backgroundColor: colors.border }]} />
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const SCREEN_PROMO_W = 290;

/* ─── Styles ─────────────────────────────────────────────────────────────────── */

const s = StyleSheet.create({
  root: { flex: 1 },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 24,
    paddingBottom: 12,
  },
  liveRow: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 4 },
  liveDot: { width: 7, height: 7, borderRadius: 4 },
  liveText: { fontSize: 11, fontFamily: "Manrope_400Regular", letterSpacing: 0.5 },
  welcome: { fontSize: 24, fontFamily: "Manrope_700Bold", letterSpacing: -0.5 },
  dashBtn: {
    width: 42,
    height: 42,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },

  balPillWrap: { paddingHorizontal: 24, marginBottom: 6 },

  scroll: { paddingTop: 16, gap: 20 },

  promoScroll: { paddingHorizontal: 20, gap: 12 },

  secRow: { paddingHorizontal: 20, flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" },
  secTitle: { fontSize: 18, fontFamily: "Manrope_700Bold" },
  secSub: { fontSize: 12, fontFamily: "Manrope_400Regular", marginTop: 2 },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 14,
    gap: 10,
  },
  gridCell: { width: "47.5%" },

  quickList: { paddingHorizontal: 20, gap: 10 },
  quickRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
  },
  quickIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  quickLabel: { fontSize: 14, fontFamily: "Manrope_600SemiBold", marginBottom: 2 },
  quickSub: { fontSize: 12, fontFamily: "Manrope_400Regular" },

  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 24,
  },
  footerLine: { flex: 1, height: 1 },
  footerText: { fontSize: 10, fontFamily: "Manrope_400Regular", letterSpacing: 2 },
});

/* service card */
const svc = StyleSheet.create({
  wrap: {},
  card: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    gap: 8,
    overflow: "hidden",
    minHeight: 160,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  iconWrap: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 20,
  },
  badgeText: { fontSize: 9, fontFamily: "Manrope_700Bold", letterSpacing: 0.5 },
  title: { fontSize: 14, fontFamily: "Manrope_700Bold", lineHeight: 18 },
  sub: { fontSize: 11, fontFamily: "Manrope_400Regular", lineHeight: 15 },
  arrow: {
    width: 26,
    height: 26,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-end",
    marginTop: "auto" as any,
  },
});

/* promo banner */
const pb = StyleSheet.create({
  wrap: { width: SCREEN_PROMO_W },
  card: {
    width: SCREEN_PROMO_W,
    borderRadius: 20,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 6,
  },
  orb: {
    position: "absolute",
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "rgba(255,255,255,0.07)",
    top: -60,
    right: -40,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  title: { fontSize: 14, fontFamily: "Manrope_700Bold", color: "#FFFFFF", marginBottom: 3 },
  sub: { fontSize: 11, fontFamily: "Manrope_400Regular", color: "rgba(255,255,255,0.75)" },
  arrow: {
    width: 34,
    height: 34,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },
});

/* balance pill */
const bp = StyleSheet.create({
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
  },
  dot: { width: 6, height: 6, borderRadius: 3 },
  label: { fontSize: 12, fontFamily: "Manrope_400Regular" },
  amount: { fontSize: 14, fontFamily: "Manrope_700Bold" },
});
