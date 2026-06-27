import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
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
  AirtimeIcon,
  ElectricityIcon,
  CableTVIcon,
  RatesIcon,
  TransactionsIcon,
  BettingIcon,
  FundingIcon,
  MoreIcon,
  SellGiftCardIcon,
  CheckPendingIcon,
} from "@/components/DashboardIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AnimatedSheet } from "@/components/AnimatedSheet";
import { rf } from "@/utils/responsive";
import { WaveIcon } from "@/components/WaveIcon";
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
const BAL_VIS_KEY = "aza_balance_visible";

const C = {
  bg:        "#FFFFFF",
  text:      "#0B0A0A",
  navy:      "#061941",
  textSec:   "#595F67",
  textMuted: "#AAAFB5",
  border:    "#F0F0F0",
  success:   "#00B03C",
  danger:    "#EF4444",
  actionBar: "#000000",
};

const logoSrc   = require("@/assets/images/lkd.png");
const avatarSrc = require("@/assets/images/3d_avatar_16.png");

const SERVICES = [
  { id: "gift",    label: "Gift Card",     bg: "#FFF2CF", iconColor: "#5C4000", route: null                              },
  { id: "airtime", label: "Airtime",       bg: "#EEF9FF", iconColor: "#0891B2", route: "/(app)/bills"  as const           },
  { id: "elec",    label: "Electricity",   bg: "#FFF7ED", iconColor: "#D97706", route: "/(app)/bills"  as const           },
  { id: "cable",   label: "Cable TV",      bg: "#FFF1F2", iconColor: "#E11D48", route: "/(app)/bills"  as const           },
  { id: "rates",   label: "Rates",         bg: "#F5F3FF", iconColor: "#7C3AED", route: "/(app)/rates"  as const           },
  { id: "txn",     label: "Transactions",  bg: "#EFF6FF", iconColor: "#2563EB", route: "/(app)/transactions" as const     },
  { id: "bet",     label: "Betting",       bg: "#ECFEFF", iconColor: "#0891B2", route: "/(app)/bills"  as const           },
  { id: "funding", label: "Funding",       bg: "#EBF3FF", iconColor: "#1D6ECC", route: "/(app)/dashboard" as const        },
  { id: "more",    label: "More",          bg: "#F0EEFF", iconColor: "#7C3AED", route: "/(app)/more"   as const           },
];

const PROMOS = [
  {
    id: "p1", pct: "50% OFF", title: "Summer special deal",
    desc: "Get discount for every transaction this weekend",
    bg: "#FCB3C5", textColor: "#7A1535",
  },
  {
    id: "p2", pct: "50% OFF", title: "Black friday deal",
    desc: "Get discount for every top up and payment",
    bg: "#FFF2CF", textColor: "#5C4000",
  },
  {
    id: "p3", pct: "Top Rates", title: "Sell Gift Cards",
    desc: "Amazon, iTunes, Steam — paid instantly",
    bg: "#D6E1FF", textColor: "#1A3070",
  },
];

const TRANSACTIONS = [
  { id: "t1", title: "Amazon card",      ref: "3289HF-4378", date: "April 28, 2024",    amount: "₦200,040.00",  positive: true  },
  { id: "t2", title: "Withdraws",        ref: "7812KJ-2901", date: "February 24, 2022", amount: "₦400,000.00",  positive: false },
  { id: "t3", title: "Deposit Giftcard", ref: "5621AB-1122", date: "February 24, 2022", amount: "₦200,040.00",  positive: true  },
];

function ServiceIconRenderer({ id, color, size = 20 }: { id: string; color: string; size?: number }) {
  switch (id) {
    case "gift":    return <GiftCardIcon size={size} color={color} />;
    case "airtime": return <AirtimeIcon size={size} color={color} />;
    case "elec":    return <ElectricityIcon size={size} color={color} />;
    case "cable":   return <CableTVIcon size={size} color={color} />;
    case "rates":   return <RatesIcon size={size} color={color} />;
    case "txn":     return <TransactionsIcon size={size} color={color} />;
    case "bet":     return <BettingIcon size={size} color={color} />;
    case "funding": return <FundingIcon size={size} color={color} />;
    case "more":    return <MoreIcon size={size} color={color} />;
    default:        return <MoreIcon size={size} color={color} />;
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
        <View style={[sv.iconBox, { backgroundColor: item.bg }]}>
          <ServiceIconRenderer id={item.id} color={item.iconColor} size={20} />
        </View>
        <Text style={sv.label} numberOfLines={2}>{item.label}</Text>
      </Pressable>
    </Animated.View>
  );
}

function PromoCard({ item, width: promoW }: { item: (typeof PROMOS)[number]; width: number }) {
  const sc   = useSharedValue(1);
  const anim = useAnimatedStyle(() => ({ transform: [{ scale: sc.value }] }));
  return (
    <Animated.View style={[anim, { width: promoW, marginRight: 12 }]}>
      <Pressable
        onPressIn={() => { sc.value = withSpring(0.97, { damping: 14 }); }}
        onPressOut={() => { sc.value = withSpring(1, { damping: 14 }); }}
      >
        <View style={[pc.card, { backgroundColor: item.bg }]}>
          <View style={pc.orb1} />
          <View style={pc.orb2} />
          <Text style={[pc.pct,   { color: item.textColor }]}>{item.pct}</Text>
          <Text style={[pc.title, { color: item.textColor }]}>{item.title}</Text>
          <Text style={[pc.desc,  { color: item.textColor + "CC", maxWidth: Math.round(promoW * 0.42) }]}>{item.desc}</Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}

function TxRow({ item, onPress }: { item: (typeof TRANSACTIONS)[number]; onPress: () => void }) {
  return (
    <TouchableOpacity style={tx.row} onPress={onPress} activeOpacity={0.75}>
      <View style={[tx.iconWrap, { backgroundColor: item.positive ? "#E8F7EF" : "#FFF0F0" }]}>
        <Feather
          name={item.positive ? "arrow-down-left" : "arrow-up-right"}
          size={14}
          color={item.positive ? C.success : C.danger}
        />
      </View>
      <View style={tx.info}>
        <Text style={tx.title} numberOfLines={1}>{item.title}</Text>
        <Text style={tx.ref}>{item.date}</Text>
      </View>
      <View style={tx.right}>
        <Text style={[tx.amount, { color: item.positive ? C.success : C.danger }]}>
          {item.positive ? "" : "-"}{item.amount}
        </Text>
        <Text style={tx.ref}>{item.ref}</Text>
      </View>
    </TouchableOpacity>
  );
}

export default function HomeScreen() {
  const router   = useRouter();
  const insets   = useSafeAreaInsets();
  const { user } = useAuth();
  const { width } = useWindowDimensions();
  const PROMO_W  = Math.min(width, MAX_W) - 48;
  const [balanceVisible,   setBalanceVisible]   = useState(true);
  const [giftModalVisible, setGiftModalVisible] = useState(false);
  // SafeAreaView handles native top inset; only need extra padding on web
  const webTopPad = Platform.OS === "web" ? 40 : 0;

  /* Persist balance visibility preference */
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

  /* Balance display */
  const firstName = (user?.name ?? "Dove").split(" ")[0];
  const balance   = user?.balance ?? 200590;
  const formatted = "₦" + balance.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const MASKED    = "₦••••••••";

  /* Balance amount scale animation */
  const balScale = useSharedValue(1);
  const balOpacity = useSharedValue(1);
  const balStyle = useAnimatedStyle(() => ({
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
    <SafeAreaView style={[s.root]} edges={["top"]}>

      {/* ── Top header ── */}
      <Animated.View
        entering={FadeInDown.duration(300).springify()}
        style={[s.header, { paddingTop: webTopPad + 8 }]}
      >
        <TouchableOpacity
          onPress={press(() => router.push("/(app)/settings" as any))}
          style={s.hdrBtn}
        >
          <Feather name="menu" size={22} color={C.text} />
        </TouchableOpacity>

        <Image
          source={logoSrc}
          style={s.logo}
          contentFit="contain"
          cachePolicy="memory-disk"
        />

        <TouchableOpacity style={s.hdrBtn}>
          <Feather name="bell" size={22} color={C.text} />
          <View style={s.notifDot} />
        </TouchableOpacity>
      </Animated.View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[s.scroll, { paddingBottom: insets.bottom + 110 }]}
      >
        {/* ── Greeting + Balance ── */}
        <Animated.View
          entering={FadeInDown.duration(340).springify().delay(50)}
          style={s.greetSection}
        >
          <View style={s.greetRow}>
            <Image
              source={avatarSrc}
              style={s.avatar}
              contentFit="cover"
              cachePolicy="memory-disk"
            />
            <View style={s.greetText}>
              <View style={s.hiRow}>
                <Text style={s.hiText}>Hi, {firstName} </Text>
                <WaveIcon size={18} color={C.text} />
              </View>
              <Text style={s.greetSub}>Your available balance</Text>
            </View>
          </View>
          <View style={s.balRow}>
            <Animated.Text style={[s.balAmount, balStyle]} numberOfLines={1}>
              {balanceVisible ? formatted : MASKED}
            </Animated.Text>
            <TouchableOpacity
              onPress={handleToggle}
              style={s.eyeBtn}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <PremiumEyeIcon open={balanceVisible} size={20} color={C.textMuted} />
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* ── Quick actions ── */}
        <Animated.View
          entering={FadeInDown.duration(320).springify().delay(90)}
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
          entering={FadeInUp.duration(320).springify().delay(120)}
          style={s.servicesGrid}
        >
          {SERVICES.map((item, i) => (
            <Animated.View
              key={item.id}
              entering={FadeInUp.duration(280).springify().delay(120 + i * 25)}
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
        <Animated.View entering={FadeInUp.duration(300).springify().delay(180)}>
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
        <Animated.View entering={FadeInUp.duration(300).springify().delay(220)}>
          <View style={s.secHdr}>
            <Text style={s.secTitle}>Recent Transaction</Text>
            <TouchableOpacity onPress={press(() => router.push("/(app)/transactions" as any))}>
              <Text style={s.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>

          <View style={s.txCard}>
            {TRANSACTIONS.map((item, i) => (
              <Animated.View
                key={item.id}
                entering={FadeInUp.duration(260).springify().delay(220 + i * 35)}
              >
                <TxRow
                  item={item}
                  onPress={press(() => router.push("/(app)/transactions" as any))}
                />
                {i < TRANSACTIONS.length - 1 && <View style={s.txDivider} />}
              </Animated.View>
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

        <View style={gm.handle} />
        <View style={gm.sheetHeader}>
          <Text style={gm.sheetTitle}>I want to?</Text>
          <TouchableOpacity
            style={gm.closeBtn}
            onPress={() => setGiftModalVisible(false)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Feather name="x" size={18} color="#1E232C" />
          </TouchableOpacity>
        </View>
        <View style={gm.tilesRow}>
          <TouchableOpacity
            style={[gm.tile, { backgroundColor: "#FFF2CF" }]}
            activeOpacity={0.82}
            onPress={() => {
              setGiftModalVisible(false);
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push("/(app)/sell-gift-card" as any);
            }}
          >
            <View style={[gm.tileIcon, { backgroundColor: "rgba(92,64,0,0.12)" }]}>
              <SellGiftCardIcon size={24} color="#5C4000" />
            </View>
            <Text style={[gm.tileTitle, { color: "#5C4000" }]}>Sell Gift Card</Text>
            <Text style={[gm.tileDesc, { color: "#5C400099" }]}>
              Sell local and international gift cards easily and instantly on aza.
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[gm.tile, { backgroundColor: "#FCB3C5" }]}
            activeOpacity={0.82}
            onPress={() => {
              setGiftModalVisible(false);
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push("/(app)/card-status" as any);
            }}
          >
            <View style={[gm.tileIcon, { backgroundColor: "rgba(122,21,53,0.12)" }]}>
              <CheckPendingIcon size={24} color="#7A1535" />
            </View>
            <Text style={[gm.tileTitle, { color: "#7A1535" }]}>Check Pending</Text>
            <Text style={[gm.tileDesc, { color: "#7A153599" }]}>
              Check Status of Pending gift card sale.
            </Text>
          </TouchableOpacity>
        </View>
      </AnimatedSheet>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root:   { flex: 1, backgroundColor: C.bg },
  scroll: { paddingTop: 4, gap: 20 },

  header: {
    flexDirection:     "row",
    alignItems:        "center",
    justifyContent:    "space-between",
    paddingHorizontal: 20,
    paddingBottom:     12,
    backgroundColor:   C.bg,
  },
  hdrBtn: {
    width: 38, height: 38,
    borderRadius: 19,
    alignItems: "center", justifyContent: "center",
    position: "relative",
  },
  notifDot: {
    position: "absolute", top: 7, right: 7,
    width: 7, height: 7, borderRadius: 3.5,
    backgroundColor: "#FF3B30",
    borderWidth: 1.5, borderColor: C.bg,
  },
  logo: { width: 80, height: 28 },

  greetSection: {
    marginHorizontal: 20,
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "#F8FAFB",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#EEF0F2",
    gap: 12,
  },
  greetRow:  { flexDirection: "row", alignItems: "center", gap: 12 },
  avatar:    { width: 46, height: 46, borderRadius: 23 },
  greetText: { gap: 2, flex: 1 },
  hiRow:     { flexDirection: "row", alignItems: "center" },
  hiText:    { fontSize: rf(15), fontFamily: "Manrope_700Bold", color: C.text },
  greetSub:  { fontSize: rf(12), fontFamily: "Manrope_400Regular", color: C.textSec },
  balRow:    { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  balAmount: { fontSize: rf(24), fontFamily: "Manrope_700Bold", color: C.text, letterSpacing: -0.5, flex: 1 },
  eyeBtn:    { padding: 4 },

  actionsWrap: { paddingHorizontal: 20 },
  actionsBar: {
    backgroundColor: C.actionBar,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  actionBtn:     { flex: 1, alignItems: "center", justifyContent: "center", gap: 7 },
  actionLabel:   { fontSize: rf(11), fontFamily: "Manrope_700Bold", color: "#FFFFFF", letterSpacing: 0.2 },
  actionDivider: { width: 1, height: 34, backgroundColor: "rgba(255,255,255,0.18)" },

  servicesGrid: { flexDirection: "row", flexWrap: "wrap", paddingHorizontal: 8, rowGap: 16 },

  promoScroll: { paddingHorizontal: 20 },

  secHdr: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    paddingHorizontal: 20, marginBottom: 10,
  },
  secTitle: { fontSize: rf(16), fontFamily: "Manrope_700Bold", color: C.text },
  seeAll:   { fontSize: rf(13), fontFamily: "Manrope_600SemiBold", color: "#000000" },

  txCard: {
    marginHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#F0F0F0",
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
  },
  txDivider: { height: 1, backgroundColor: "#F5F5F5", marginHorizontal: 14 },
});

const sv = StyleSheet.create({
  wrap:    { alignItems: "center", gap: 7, paddingVertical: 4 },
  iconBox: { width: 52, height: 52, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  label:   { fontSize: rf(10), fontFamily: "Manrope_700Bold", textAlign: "center", color: C.textSec, lineHeight: rf(14), flexShrink: 1 },
});

const pc = StyleSheet.create({
  card: {
    borderRadius: 10, padding: 14, paddingBottom: 18,
    overflow: "hidden", gap: 5, height: 108, justifyContent: "center",
  },
  orb1: {
    position: "absolute", width: 100, height: 100, borderRadius: 50,
    backgroundColor: "rgba(255,255,255,0.25)", top: -30, right: -20,
  },
  orb2: {
    position: "absolute", width: 60, height: 60, borderRadius: 30,
    backgroundColor: "rgba(255,255,255,0.15)", bottom: -20, right: 40,
  },
  pct:   { fontSize: rf(14), fontFamily: "Manrope_700Bold" },
  title: { fontSize: rf(12), fontFamily: "Manrope_600SemiBold" },
  desc:  { fontSize: rf(9.5), fontFamily: "Manrope_400Regular", lineHeight: rf(14), marginTop: 1 },
});

const tx = StyleSheet.create({
  row: {
    flexDirection: "row", alignItems: "center", gap: 12,
    paddingHorizontal: 14, paddingVertical: 13, backgroundColor: "#FFFFFF",
  },
  iconWrap: { width: 38, height: 38, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  info:   { flex: 1, gap: 3 },
  title:  { fontSize: rf(13), fontFamily: "Manrope_600SemiBold", color: C.text },
  ref:    { fontSize: rf(11), fontFamily: "Manrope_400Regular", color: C.textMuted },
  right:  { alignItems: "flex-end", gap: 3 },
  amount: { fontSize: rf(13), fontFamily: "Manrope_700Bold" },
});

const gm = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  sheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 28, borderTopRightRadius: 28,
    paddingHorizontal: 20, paddingTop: 12, paddingBottom: 40,
    shadowColor: "#000", shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12, shadowRadius: 16, elevation: 12,
  },
  handle: {
    width: 36, height: 4, borderRadius: 2,
    backgroundColor: "#D0D5DD", alignSelf: "center", marginBottom: 20,
  },
  sheetHeader: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 20,
  },
  sheetTitle: { fontSize: rf(18), fontFamily: "Manrope_700Bold", color: "#1E232C" },
  closeBtn: {
    width: 34, height: 34, borderRadius: 17, backgroundColor: "#F7F8F9",
    alignItems: "center", justifyContent: "center",
  },
  tilesRow: { flexDirection: "row", gap: 14 },
  tile:     { flex: 1, borderRadius: 16, padding: 16, gap: 10, minHeight: 164 },
  tileIcon: {
    width: 48, height: 48, borderRadius: 14,
    alignItems: "center", justifyContent: "center", marginBottom: 4,
  },
  tileTitle: { fontSize: rf(14), fontFamily: "Manrope_700Bold" },
  tileDesc:  { fontSize: rf(12), fontFamily: "Manrope_400Regular", lineHeight: rf(17) },
});
