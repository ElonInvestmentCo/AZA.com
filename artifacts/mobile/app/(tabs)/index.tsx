import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  FundWalletIcon,
  SellIcon,
  WithdrawIcon,
  GiftCardIcon,
  SettingsIcon,
  ElectricityIcon,
  CableTVIcon,
  RatesIcon,
  TransactionsIcon,
  BettingIcon,
  MoreIcon,
  SellGiftCardIcon,
  CheckPendingIcon,
  GiftcardTxIcon,
  WithdrawTxIcon,
} from "@/components/DashboardIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AnimatedSheet } from "@/components/AnimatedSheet";
import { rf } from "@/utils/responsive";
import { PremiumEyeIcon } from "@/components/PremiumEyeIcon";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@/context/AuthContext";

const MAX_W = 430;
const BAL_VIS_KEY = "payvora_balance_visible";

const avatarSrc = require("@/assets/images/3d_avatar_16.png");

const SERVICES = [
  { id: "gift",     label: "Gift Card",   iconBg: "#FFF8ED", iconColor: "#C27C0E", route: null },
  { id: "settings", label: "Settings",    iconBg: "#EFF6FF", iconColor: "#3B82F6", route: "/(app)/settings" as const },
  { id: "elec",     label: "Electricity", iconBg: "#FFFBEB", iconColor: "#D97706", route: "/(app)/bills" as const },
  { id: "cable",    label: "Cable TV",    iconBg: "#FEF2F2", iconColor: "#E11D48", route: "/(app)/bills" as const },
  { id: "rates",    label: "Rates",       iconBg: "#F5F3FF", iconColor: "#7C3AED", route: "/(app)/rates" as const },
  { id: "txn",      label: "Transaction", iconBg: "#EFF6FF", iconColor: "#2563EB", route: "/(app)/transactions" as const },
  { id: "bet",      label: "Bet Funding", iconBg: "#ECFEFF", iconColor: "#0891B2", route: "/(app)/bills" as const },
  { id: "more",     label: "More",        iconBg: "#F5F3FF", iconColor: "#7C3AED", route: "/(app)/more" as const },
];

const PROMOS = [
  {
    id: "p1", pct: "50% OFF", title: "Summer special deal",
    desc: "Get discount for every transaction this weekend",
    bg: "#FCB3C5", pctColor: "#000000", titleColor: "#000000", descColor: "#3D0010",
  },
  {
    id: "p2", pct: "50% OFF", title: "Black friday deal",
    desc: "Get discount for every top up and payment",
    bg: "#FFF2CF", pctColor: "#000000", titleColor: "#000000", descColor: "#5C4000",
  },
];

const TRANSACTIONS = [
  { id: "t1", icon: "gift",     title: "Deposit Giftcard", date: "February 24,2022", amount: "₦200,40.00",   positive: true  },
  { id: "t2", icon: "withdraw", title: "Withdraws",        date: "February 24,2022", amount: "₦400,000.00",  positive: false },
];

function ServiceIconRenderer({ id, color, size = 20 }: { id: string; color: string; size?: number }) {
  switch (id) {
    case "gift":     return <GiftCardIcon    size={size} color={color} />;
    case "settings": return <SettingsIcon    size={size} color={color} />;
    case "elec":     return <ElectricityIcon size={size} color={color} />;
    case "cable":    return <CableTVIcon     size={size} color={color} />;
    case "rates":    return <RatesIcon       size={size} color={color} />;
    case "txn":      return <TransactionsIcon size={size} color={color} />;
    case "bet":      return <BettingIcon     size={size} color={color} />;
    case "more":     return <MoreIcon        size={size} color={color} />;
    default:         return <MoreIcon        size={size} color={color} />;
  }
}

function ServiceItem({ item, onPress }: { item: (typeof SERVICES)[number]; onPress: () => void }) {
  const { width } = useWindowDimensions();
  const ITEM_W = (Math.min(width, MAX_W) - 32) / 4;
  const sc   = useSharedValue(1);
  const anim = useAnimatedStyle(() => ({ transform: [{ scale: sc.value }] }));

  return (
    <Animated.View style={[anim, { width: ITEM_W, alignItems: "center" }]}>
      <Pressable
        onPress={onPress}
        onPressIn={() => { sc.value = withSpring(0.88, { damping: 12 }); }}
        onPressOut={() => { sc.value = withSpring(1, { damping: 12 }); }}
        style={sv.wrap}
      >
        <View style={[sv.iconBox, { backgroundColor: item.iconBg }]}>
          <ServiceIconRenderer id={item.id} color={item.iconColor} size={20} />
        </View>
        <Text style={sv.label} numberOfLines={2}>{item.label}</Text>
      </Pressable>
    </Animated.View>
  );
}

type PromoItem = typeof PROMOS[number];
function PromoCard({ item, width: promoW }: { item: PromoItem; width: number }) {
  const sc   = useSharedValue(1);
  const anim = useAnimatedStyle(() => ({ transform: [{ scale: sc.value }] }));
  return (
    <Animated.View style={[anim, { width: promoW, marginRight: 12 }]}>
      <Pressable
        onPressIn={() => { sc.value = withSpring(0.97, { damping: 14 }); }}
        onPressOut={() => { sc.value = withSpring(1, { damping: 14 }); }}
      >
        <View style={[pc.card, { backgroundColor: item.bg }]}>
          <Text style={[pc.pct,   { color: item.pctColor }]}>{item.pct}</Text>
          <Text style={[pc.title, { color: item.titleColor }]}>{item.title}</Text>
          <Text style={[pc.desc,  { color: item.descColor }]}>{item.desc}</Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}

function TxRow({ item, onPress }: { item: (typeof TRANSACTIONS)[number]; onPress: () => void }) {
  return (
    <TouchableOpacity style={tx.row} onPress={onPress} activeOpacity={0.75}>
      <View style={tx.iconWrap}>
        {item.icon === "gift"
          ? <GiftcardTxIcon size={22} color="#1C1B1F" />
          : <WithdrawTxIcon size={22} color="#1C1B1F" />
        }
      </View>
      <View style={tx.info}>
        <Text style={tx.title} numberOfLines={1}>{item.title}</Text>
        <Text style={tx.date}>{item.date}</Text>
      </View>
      <Text style={[tx.amount, { color: item.positive ? "#00B03C" : "#FF0000" }]}>
        {item.amount}
      </Text>
    </TouchableOpacity>
  );
}

export default function HomeScreen() {
  const router   = useRouter();
  const insets   = useSafeAreaInsets();
  const { user } = useAuth();
  const { width } = useWindowDimensions();
  const PROMO_W  = Math.min(width, MAX_W) * 0.72;
  const [balanceVisible,   setBalanceVisible]   = useState(true);
  const [giftModalVisible, setGiftModalVisible] = useState(false);
  const webTopPad = Platform.OS === "web" ? 40 : 0;

  useEffect(() => {
    AsyncStorage.getItem(BAL_VIS_KEY).then(val => {
      if (val !== null) setBalanceVisible(val === "true");
    }).catch(() => {});
  }, []);

  const toggleBalance = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const next = !balanceVisible;
    setBalanceVisible(next);
    AsyncStorage.setItem(BAL_VIS_KEY, String(next)).catch(() => {});
  };

  const firstName = (user?.name ?? "Dove").split(" ")[0];
  const balance   = user?.balance ?? 200590;
  const formatted = "₦" + balance.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const MASKED    = "₦••••••••";

  const balOpacity = useSharedValue(1);
  const balScale   = useSharedValue(1);
  const balStyle   = useAnimatedStyle(() => ({
    transform: [{ scale: balScale.value }],
    opacity: balOpacity.value,
  }));

  const handleToggle = () => {
    balOpacity.value = withTiming(0, { duration: 100 }, () => {
      balScale.value = withSpring(1, { damping: 14 });
      balOpacity.value = withTiming(1, { duration: 150 });
    });
    toggleBalance();
  };

  const press = (fn: () => void) => () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    fn();
  };

  return (
    <SafeAreaView style={s.root} edges={["top"]}>

      {/* ── Header: centered PAYVORA wordmark ── */}
      <Animated.View
        entering={FadeIn.duration(300)}
        style={[s.header, { paddingTop: webTopPad + 4 }]}
      >
        <Text style={s.wordmark}>PAYVORA.</Text>
      </Animated.View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[s.scroll, { paddingBottom: insets.bottom + 110 }]}
      >
        {/* ── Greeting + Balance ── */}
        <Animated.View
          entering={FadeInDown.duration(300).springify().delay(40)}
          style={s.greetSection}
        >
          {/* Left: avatar + name/subtitle */}
          <View style={s.greetLeft}>
            <Image
              source={avatarSrc}
              style={s.avatar}
              contentFit="cover"
              cachePolicy="memory-disk"
            />
            <View style={s.greetText}>
              <Text style={s.hiText}>Hi, {firstName}</Text>
              <Text style={s.greetSub}>Your available balance</Text>
            </View>
          </View>

          {/* Right: eye + balance */}
          <View style={s.balRight}>
            <TouchableOpacity
              onPress={handleToggle}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              style={s.eyeBtn}
            >
              <PremiumEyeIcon open={balanceVisible} size={20} color="#AAAAAA" />
            </TouchableOpacity>
            <Animated.Text style={[s.balAmount, balStyle]} numberOfLines={1} adjustsFontSizeToFit>
              {balanceVisible ? formatted : MASKED}
            </Animated.Text>
          </View>
        </Animated.View>

        {/* ── Quick action bar ── */}
        <Animated.View
          entering={FadeInDown.duration(300).springify().delay(80)}
          style={s.actionsWrap}
        >
          <View style={s.actionsBar}>
            {([
              { renderIcon: () => <FundWalletIcon size={20} color="#FFFFFF" />, label: "Fund Wallet", onPress: press(() => router.push("/(app)/dashboard" as any)) },
              { renderIcon: () => <SellIcon       size={20} color="#FFFFFF" />, label: "Sell",        onPress: press(() => router.push("/(app)/trade-asset" as any)) },
              { renderIcon: () => <WithdrawIcon   size={20} color="#FFFFFF" />, label: "Withdraw",    onPress: press(() => router.push("/(app)/withdraw" as any)) },
            ]).map((action, i) => (
              <React.Fragment key={action.label}>
                {i > 0 && <View style={s.actionDivider} />}
                <TouchableOpacity style={s.actionBtn} onPress={action.onPress} activeOpacity={0.72}>
                  {action.renderIcon()}
                  <Text style={s.actionLabel}>{action.label}</Text>
                </TouchableOpacity>
              </React.Fragment>
            ))}
          </View>
        </Animated.View>

        {/* ── Services grid ── */}
        <Animated.View
          entering={FadeInUp.duration(300).springify().delay(120)}
          style={s.servicesGrid}
        >
          {SERVICES.map((item, i) => (
            <Animated.View
              key={item.id}
              entering={FadeInUp.duration(260).springify().delay(120 + i * 20)}
            >
              <ServiceItem
                item={item}
                onPress={press(() => {
                  if (item.id === "gift") { setGiftModalVisible(true); return; }
                  if (item.route) router.push(item.route as any);
                })}
              />
            </Animated.View>
          ))}
        </Animated.View>

        {/* ── Promo banners ── */}
        <Animated.View entering={FadeInUp.duration(280).springify().delay(170)}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={s.promoScroll}
            snapToInterval={PROMO_W + 12}
            decelerationRate="fast"
          >
            {PROMOS.map(p => (
              <PromoCard key={p.id} item={p} width={PROMO_W} />
            ))}
          </ScrollView>
        </Animated.View>

        {/* ── Recent Transactions ── */}
        <Animated.View entering={FadeInUp.duration(280).springify().delay(210)}>
          <View style={s.secHdr}>
            <Text style={s.secTitle}>Recent Transaction</Text>
            <TouchableOpacity onPress={press(() => router.push("/(app)/transactions" as any))}>
              <Text style={s.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>

          <View style={s.txCard}>
            {TRANSACTIONS.map((item, i) => (
              <React.Fragment key={item.id}>
                <TxRow
                  item={item}
                  onPress={press(() => router.push("/(app)/transactions" as any))}
                />
                {i < TRANSACTIONS.length - 1 && <View style={s.txDivider} />}
              </React.Fragment>
            ))}
          </View>
        </Animated.View>
      </ScrollView>

      {/* ── Gift Card Modal ── */}
      <AnimatedSheet
        visible={giftModalVisible}
        onClose={() => setGiftModalVisible(false)}
        sheetStyle={gm.sheet}
      >
        <View style={gm.sheetHeader}>
          <Text style={gm.sheetTitle}>I want to?</Text>
          <TouchableOpacity
            style={gm.closeBtn}
            onPress={() => setGiftModalVisible(false)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={gm.closeBtnText}>✕</Text>
          </TouchableOpacity>
        </View>

        <View style={gm.tilesRow}>
          {/* Sell Gift Card tile */}
          <TouchableOpacity
            style={[gm.tile, { backgroundColor: "#FFF2CF" }]}
            activeOpacity={0.82}
            onPress={() => {
              setGiftModalVisible(false);
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push("/(app)/sell-gift-card" as any);
            }}
          >
            <View style={gm.tileIconWrap}>
              <SellGiftCardIcon size={20} color="#FFFFFF" />
            </View>
            <Text style={gm.tileTitle}>Sell Gift Card</Text>
            <Text style={gm.tileDesc}>
              Sell local and international gift cards easily and instantly on Payvora.
            </Text>
          </TouchableOpacity>

          {/* Check Pending tile */}
          <TouchableOpacity
            style={[gm.tile, { backgroundColor: "#FCB3C5" }]}
            activeOpacity={0.82}
            onPress={() => {
              setGiftModalVisible(false);
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push("/(app)/card-status" as any);
            }}
          >
            <View style={gm.tileIconWrap}>
              <CheckPendingIcon size={20} color="#FFFFFF" />
            </View>
            <Text style={gm.tileTitle}>Check Pending</Text>
            <Text style={gm.tileDesc}>
              Check Status of Pending gift card sale.
            </Text>
          </TouchableOpacity>
        </View>
      </AnimatedSheet>
    </SafeAreaView>
  );
}

/* ─── Root + Header ──────────────────────────────────────────────────────── */
const s = StyleSheet.create({
  root:   { flex: 1, backgroundColor: "#FFFFFF" },
  scroll: { paddingTop: 4, gap: 20 },

  header: {
    alignItems:        "center",
    justifyContent:    "center",
    paddingHorizontal: 20,
    paddingBottom:     10,
    backgroundColor:   "#FFFFFF",
  },
  wordmark: { fontSize: rf(18), fontFamily: "Manrope_700Bold", color: "#000000", letterSpacing: -0.5 },

  /* ─── Greeting ──────────────────────────────────────────────────────── */
  greetSection: {
    marginHorizontal: 20,
    flexDirection:    "row",
    alignItems:       "center",
    justifyContent:   "space-between",
    gap:              8,
  },
  greetLeft:  { flexDirection: "row", alignItems: "center", gap: 12, flex: 1 },
  avatar:     { width: 46, height: 46, borderRadius: 23 },
  greetText:  { gap: 2 },
  hiText:     { fontSize: rf(15), fontFamily: "Manrope_700Bold",     color: "#000000" },
  greetSub:   { fontSize: rf(12), fontFamily: "Manrope_400Regular",  color: "#888888" },

  balRight:   { alignItems: "flex-end", gap: 4 },
  eyeBtn:     { padding: 2 },
  balAmount:  {
    fontSize: rf(20), fontFamily: "Manrope_700Bold", color: "#000000",
    letterSpacing: -0.5, textAlign: "right",
  },

  /* ─── Actions bar ────────────────────────────────────────────────────── */
  actionsWrap: { paddingHorizontal: 20 },
  actionsBar:  {
    borderRadius:    14,
    flexDirection:   "row",
    alignItems:      "center",
    paddingVertical: 18,
    backgroundColor: "#000000",
    overflow:        "hidden",
  },
  actionBtn:     { flex: 1, alignItems: "center", justifyContent: "center", gap: 7 },
  actionLabel:   { fontSize: rf(11), fontFamily: "Manrope_700Bold", color: "#FFFFFF", letterSpacing: 0.2 },
  actionDivider: { width: 1, height: 34, backgroundColor: "rgba(255,255,255,0.15)" },

  /* ─── Services ───────────────────────────────────────────────────────── */
  servicesGrid: { flexDirection: "row", flexWrap: "wrap", paddingHorizontal: 8, rowGap: 16 },

  /* ─── Promos ─────────────────────────────────────────────────────────── */
  promoScroll: { paddingHorizontal: 20 },

  /* ─── Recent Transactions ────────────────────────────────────────────── */
  secHdr: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    paddingHorizontal: 20, marginBottom: 8,
  },
  secTitle: { fontSize: rf(17), fontFamily: "Manrope_700Bold",    color: "#0B0A0A" },
  seeAll:   { fontSize: rf(13), fontFamily: "Manrope_600SemiBold", color: "#000000" },

  txCard: {
    marginHorizontal: 20,
    borderRadius:     4,
    overflow:         "hidden",
    backgroundColor:  "#FFFFFF",
  },
  txDivider: { height: 1, backgroundColor: "#F0F0F0", marginHorizontal: 14 },
});

/* ─── Service item ───────────────────────────────────────────────────────── */
const sv = StyleSheet.create({
  wrap:    { alignItems: "center", gap: 6, paddingVertical: 4 },
  iconBox: { width: 50, height: 50, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  label:   { fontSize: rf(10), fontFamily: "Manrope_700Bold", textAlign: "center", color: "#000000", lineHeight: rf(14), flexShrink: 1 },
});

/* ─── Promo card ─────────────────────────────────────────────────────────── */
const pc = StyleSheet.create({
  card: {
    borderRadius: 8, paddingHorizontal: 14, paddingVertical: 16,
    overflow: "hidden", gap: 4, minHeight: 100,
  },
  pct:   { fontSize: rf(15), fontFamily: "Manrope_700Bold" },
  title: { fontSize: rf(13), fontFamily: "Manrope_700Bold" },
  desc:  { fontSize: rf(10), fontFamily: "Manrope_400Regular", lineHeight: rf(14), marginTop: 2 },
});

/* ─── Transaction row ────────────────────────────────────────────────────── */
const tx = StyleSheet.create({
  row: {
    flexDirection: "row", alignItems: "center", gap: 10,
    paddingHorizontal: 14, paddingVertical: 12, backgroundColor: "#FFFFFF",
  },
  iconWrap: { width: 32, height: 32, alignItems: "center", justifyContent: "center" },
  info:     { flex: 1, gap: 2 },
  title:    { fontSize: rf(13), fontFamily: "Manrope_600SemiBold", color: "#595F67" },
  date:     { fontSize: rf(11), fontFamily: "Manrope_400Regular",  color: "#AAAFB5" },
  amount:   { fontSize: rf(13), fontFamily: "Manrope_700Bold", textAlign: "right" },
});

/* ─── Gift Card Modal ────────────────────────────────────────────────────── */
const gm = StyleSheet.create({
  sheet: {
    backgroundColor:     "#FFFFFF",
    borderTopLeftRadius:  28,
    borderTopRightRadius: 28,
    paddingHorizontal:    20,
    paddingTop:           4,
    paddingBottom:        40,
  },
  sheetHeader: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    marginBottom: 20,
  },
  sheetTitle:   { fontSize: rf(16), fontFamily: "Manrope_700Bold", color: "#000000" },
  closeBtn:     {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: "#F0F0F0",
    alignItems: "center", justifyContent: "center",
  },
  closeBtnText: { fontSize: 14, color: "#555555", lineHeight: 16 },

  tilesRow: { flexDirection: "row", gap: 12 },
  tile: {
    flex: 1, borderRadius: 14, padding: 14, gap: 8, minHeight: 150,
  },
  tileIconWrap: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: "#333333",
    alignItems: "center", justifyContent: "center",
    marginBottom: 4,
  },
  tileTitle: { fontSize: rf(13), fontFamily: "Manrope_700Bold",    color: "#000000" },
  tileDesc:  { fontSize: rf(9),  fontFamily: "Manrope_400Regular",  color: "#555555", lineHeight: rf(13) },
});
