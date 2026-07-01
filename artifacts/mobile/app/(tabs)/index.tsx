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
import Svg, { Defs, Path, Rect, RadialGradient, Stop } from "react-native-svg";
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
const BAL_VIS_KEY = "payvora_balance_visible";

const C = {
  bg:        "#FFFFFF",
  text:      "#0B0A0A",
  textSec:   "#595F67",
  textMuted: "#9CA3AF",
  border:    "#F0F0F0",
  success:   "#22C55E",
  danger:    "#EF4444",
  card:      "#111111",
};

const avatarSrc  = require("@/assets/images/3d_avatar_16.png");
const cardBgSrc  = require("@/assets/images/card-bg.png");

/* ── 3-D gift box illustration (inline SVG) ─────────────────────────────── */
function GiftBox3D({ size = 120 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      {/* Shadow */}
      <Rect x="20" y="100" width="80" height="12" rx="6" fill="rgba(0,0,0,0.4)" />
      {/* Box bottom */}
      <Rect x="18" y="60" width="84" height="44" rx="6" fill="#1a1a1a" />
      {/* Box bottom sheen */}
      <Rect x="18" y="60" width="84" height="44" rx="6" fill="url(#boxSheen)" />
      {/* Lid */}
      <Rect x="12" y="42" width="96" height="22" rx="5" fill="#222222" />
      {/* Lid sheen */}
      <Rect x="12" y="42" width="96" height="22" rx="5" fill="url(#lidSheen)" />
      {/* Ribbon vertical */}
      <Rect x="52" y="42" width="16" height="62" rx="2" fill="#333333" />
      {/* Ribbon horizontal on lid */}
      <Rect x="12" y="49" width="96" height="8" rx="2" fill="#333333" />
      {/* Bow left loop */}
      <Path d="M44 42 C30 30 20 18 36 16 C48 14 52 30 52 42Z" fill="#2a2a2a" />
      <Path d="M44 42 C30 30 20 18 36 16 C48 14 52 30 52 42Z" fill="url(#bowSheen)" />
      {/* Bow right loop */}
      <Path d="M76 42 C90 30 100 18 84 16 C72 14 68 30 68 42Z" fill="#2a2a2a" />
      <Path d="M76 42 C90 30 100 18 84 16 C72 14 68 30 68 42Z" fill="url(#bowSheen)" />
      {/* Bow center */}
      <Path d="M52 42 C52 36 68 36 68 42 C68 48 52 48 52 42Z" fill="#303030" />
      {/* Highlight on lid */}
      <Rect x="20" y="44" width="40" height="6" rx="3" fill="rgba(255,255,255,0.05)" />
      <Defs>
        <RadialGradient id="boxSheen" cx="30%" cy="30%" r="70%">
          <Stop offset="0" stopColor="rgba(255,255,255,0.08)" />
          <Stop offset="1" stopColor="rgba(0,0,0,0)" />
        </RadialGradient>
        <RadialGradient id="lidSheen" cx="30%" cy="30%" r="70%">
          <Stop offset="0" stopColor="rgba(255,255,255,0.12)" />
          <Stop offset="1" stopColor="rgba(0,0,0,0)" />
        </RadialGradient>
        <RadialGradient id="bowSheen" cx="40%" cy="40%" r="60%">
          <Stop offset="0" stopColor="rgba(255,255,255,0.1)" />
          <Stop offset="1" stopColor="rgba(0,0,0,0)" />
        </RadialGradient>
      </Defs>
    </Svg>
  );
}

/* ── Amazon logo placeholder ─────────────────────────────────────────────── */
function AmazonIcon({ size = 38 }: { size?: number }) {
  return (
    <View style={{
      width: size, height: size, borderRadius: 10,
      backgroundColor: "#FF9900",
      alignItems: "center", justifyContent: "center",
    }}>
      <Text style={{ fontFamily: "Manrope_700Bold", fontSize: size * 0.42, color: "#000", letterSpacing: -0.5 }}>a</Text>
    </View>
  );
}

const SERVICES = [
  { id: "gift",    label: "Gift Card",    route: null                              },
  { id: "airtime", label: "Airtime",      route: "/(app)/bills"  as const          },
  { id: "elec",    label: "Electricity",  route: "/(app)/bills"  as const          },
  { id: "cable",   label: "Cable TV",     route: "/(app)/bills"  as const          },
  { id: "rates",   label: "Rates",        route: "/(app)/rates"  as const          },
  { id: "txn",     label: "Transactions", route: "/(app)/transactions" as const    },
  { id: "bet",     label: "Betting",      route: "/(app)/bills"  as const          },
  { id: "funding", label: "Funding",      route: "/(app)/dashboard" as const       },
  { id: "more",    label: "More",         route: "/(app)/more"   as const          },
];

const TRANSACTIONS = [
  {
    id: "t1",
    icon: "amazon",
    title: "Amazon Card",
    subtitle: "Gift Card Purchase",
    amount: "₦200,040.00",
    time: "Today, 08:45 PM",
    positive: true,
  },
  {
    id: "t2",
    icon: "arrow",
    title: "Withdrawal",
    subtitle: "Bank Transfer",
    amount: "₦50,000.00",
    time: "Yesterday, 02:10 PM",
    positive: false,
  },
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
        <View style={sv.iconBox}>
          <ServiceIconRenderer id={item.id} color="#0B0A0A" size={20} />
        </View>
        <Text style={sv.label} numberOfLines={2}>{item.label}</Text>
      </Pressable>
    </Animated.View>
  );
}

function TxRow({ item, onPress }: { item: (typeof TRANSACTIONS)[number]; onPress: () => void }) {
  return (
    <TouchableOpacity style={tx.row} onPress={onPress} activeOpacity={0.75}>
      {item.icon === "amazon"
        ? <AmazonIcon size={42} />
        : (
          <View style={[tx.iconWrap, { backgroundColor: item.positive ? "#E8F7EF" : "#FFF0F0" }]}>
            <Feather
              name={item.positive ? "arrow-down-left" : "arrow-up-right"}
              size={16}
              color={item.positive ? C.success : C.danger}
            />
          </View>
        )
      }
      <View style={tx.info}>
        <Text style={tx.title} numberOfLines={1}>{item.title}</Text>
        <Text style={tx.sub}>{item.subtitle}</Text>
      </View>
      <View style={tx.right}>
        <Text style={[tx.amount, { color: C.text }]}>{item.amount}</Text>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <Text style={tx.time}>{item.time}</Text>
          <Feather
            name={item.positive ? "arrow-down" : "arrow-up"}
            size={12}
            color={item.positive ? C.success : C.danger}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function HomeScreen() {
  const router   = useRouter();
  const insets   = useSafeAreaInsets();
  const { user } = useAuth();
  const { width } = useWindowDimensions();
  const topPad   = Platform.OS === "web" ? 40 : insets.top;
  const cardW    = Math.min(width, MAX_W) - 32;

  const [balanceVisible,   setBalanceVisible]   = useState(true);
  const [giftModalVisible, setGiftModalVisible] = useState(false);

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
  const MASKED    = "₦ ••••••••";

  const balOpacity = useSharedValue(1);
  const balStyle   = useAnimatedStyle(() => ({ opacity: balOpacity.value }));

  const handleToggle = () => {
    balOpacity.value = withTiming(0, { duration: 100 }, () => {
      balOpacity.value = withTiming(1, { duration: 150 });
    });
    toggleBalance();
  };

  const press = (fn: () => void) => () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    fn();
  };

  return (
    <View style={s.root}>

      {/* ── Full-screen background image ── */}
      <Image
        source={cardBgSrc}
        style={StyleSheet.absoluteFillObject}
        contentFit="cover"
        cachePolicy="memory-disk"
      />

      {/* ── Header ── */}
      <Animated.View
        entering={FadeInDown.duration(300).springify()}
        style={[s.header, { paddingTop: topPad + 8 }]}
      >
        <TouchableOpacity
          onPress={press(() => router.push("/(app)/settings" as any))}
          style={s.hdrBtn}
        >
          <Feather name="menu" size={22} color="#FFFFFF" />
        </TouchableOpacity>

        <Text style={s.logo}>PAYVORA.</Text>

        <TouchableOpacity style={s.hdrBtn}>
          <Feather name="bell" size={22} color="#FFFFFF" />
          <View style={s.notifBadge}>
            <Text style={s.notifBadgeText}>2</Text>
          </View>
        </TouchableOpacity>
      </Animated.View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[s.scroll, { paddingBottom: insets.bottom + 110 }]}
      >
        {/* ── Dark Balance Card ── */}
        <Animated.View
          entering={FadeInDown.duration(340).springify().delay(50)}
          style={[s.balCard, { width: cardW }]}
        >
          {/* Top row: avatar + greeting + eye */}
          <View style={s.balCardTop}>
            <View style={s.balAvatarWrap}>
              <Image
                source={avatarSrc}
                style={s.balAvatar}
                contentFit="cover"
                cachePolicy="memory-disk"
              />
            </View>
            <View style={{ flex: 1, gap: 2 }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
                <Text style={s.hiText}>Hi, {firstName}</Text>
                <WaveIcon size={16} color="#FFFFFF" />
              </View>
              <Text style={s.balSubLabel}>Your available balance</Text>
            </View>
            <TouchableOpacity
              onPress={handleToggle}
              style={s.eyeCircle}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <PremiumEyeIcon open={balanceVisible} size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Balance amount */}
          <Animated.Text style={[s.balAmount, balStyle]} numberOfLines={1} adjustsFontSizeToFit>
            {balanceVisible ? formatted : MASKED}
          </Animated.Text>
        </Animated.View>

        {/* ── Quick Actions (white card) ── */}
        <Animated.View
          entering={FadeInDown.duration(320).springify().delay(90)}
          style={s.actionsOuter}
        >
          <View style={s.actionsCard}>
            {([
              { renderIcon: () => <FundWalletIcon size={22} color="#0B0A0A" />, label: "Fund Wallet", onPress: press(() => router.push("/(app)/dashboard" as any)) },
              { renderIcon: () => <SellIcon       size={22} color="#0B0A0A" />, label: "Send",        onPress: press(() => router.push("/(app)/trade-asset" as any)) },
              { renderIcon: () => <WithdrawIcon   size={22} color="#0B0A0A" />, label: "Withdraw",    onPress: press(() => router.push("/(app)/withdraw" as any)) },
            ]).map((action, i) => (
              <React.Fragment key={action.label}>
                {i > 0 && <View style={s.actionDivider} />}
                <TouchableOpacity style={s.actionBtn} onPress={action.onPress} activeOpacity={0.7}>
                  {action.renderIcon()}
                  <Text style={s.actionLabel}>{action.label}</Text>
                </TouchableOpacity>
              </React.Fragment>
            ))}
          </View>
        </Animated.View>

        {/* ── Services Grid ── */}
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

        {/* ── Promo Banner ── */}
        <Animated.View
          entering={FadeInUp.duration(300).springify().delay(160)}
          style={[s.promoBanner, { width: cardW }]}
        >
          {/* "LIMITED TIME" chip */}
          <View style={s.promoChip}>
            <Text style={s.promoChipText}>LIMITED TIME</Text>
          </View>
          <Text style={s.promoPct}>50% OFF</Text>
          <Text style={s.promoTitle}>Summer special deal</Text>
          <Text style={s.promoDesc}>Get discount for every{"\n"}transaction this weekend</Text>

          {/* Arrow button */}
          <TouchableOpacity style={s.promoArrow} activeOpacity={0.85}>
            <Feather name="arrow-right" size={18} color="#000000" />
          </TouchableOpacity>

          {/* Gift box art — positioned absolute right */}
          <View style={s.promoGiftWrap} pointerEvents="none">
            <GiftBox3D size={130} />
          </View>
        </Animated.View>

        {/* ── Recent Transactions ── */}
        <Animated.View entering={FadeInUp.duration(300).springify().delay(200)}>
          <View style={s.secHdr}>
            <Text style={s.secTitle}>Recent Transactions</Text>
            <TouchableOpacity onPress={press(() => router.push("/(app)/transactions" as any))}>
              <Text style={s.viewAll}>View all</Text>
            </TouchableOpacity>
          </View>

          <View style={s.txCard}>
            {TRANSACTIONS.map((item, i) => (
              <Animated.View
                key={item.id}
                entering={FadeInUp.duration(260).springify().delay(200 + i * 35)}
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
              Sell local and international gift cards easily and instantly on PAYVORA.
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
    </View>
  );
}

/* ── Styles ──────────────────────────────────────────────────────────────── */
const s = StyleSheet.create({
  root:   { flex: 1, backgroundColor: "transparent" },
  scroll: { paddingTop: 4, gap: 18, alignItems: "center" },

  /* Header */
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 12,
    backgroundColor: "transparent",
  },
  hdrBtn: {
    width: 40, height: 40, borderRadius: 20,
    alignItems: "center", justifyContent: "center",
    position: "relative",
  },
  notifBadge: {
    position: "absolute", top: 4, right: 4,
    minWidth: 17, height: 17, borderRadius: 8.5,
    backgroundColor: "#EF4444",
    alignItems: "center", justifyContent: "center",
    paddingHorizontal: 3,
    borderWidth: 1.5, borderColor: C.bg,
  },
  notifBadgeText: {
    fontSize: 9, fontFamily: "Manrope_700Bold", color: "#FFFFFF",
  },
  logo: { fontFamily: "Manrope_700Bold", fontSize: 18, letterSpacing: 1.5, color: "#FFFFFF" },

  /* Balance card */
  balCard: {
    backgroundColor: "transparent",
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 24,
    overflow: "hidden",
    gap: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 12,
    alignSelf: "center",
  },
  balCardTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  balAvatarWrap: {
    width: 50, height: 50, borderRadius: 25,
    borderWidth: 2, borderColor: "rgba(255,255,255,0.35)",
    overflow: "hidden",
  },
  balAvatar: { width: 46, height: 46 },
  hiText:   { fontSize: rf(15), fontFamily: "Manrope_700Bold", color: "#FFFFFF" },
  balSubLabel: { fontSize: rf(12), fontFamily: "Manrope_400Regular", color: "rgba(255,255,255,0.55)" },
  eyeCircle: {
    width: 34, height: 34, borderRadius: 17,
    borderWidth: 1.5, borderColor: "rgba(255,255,255,0.3)",
    alignItems: "center", justifyContent: "center",
  },
  balAmount: {
    fontSize: rf(34),
    fontFamily: "Manrope_700Bold",
    color: "#FFFFFF",
    letterSpacing: -1,
  },

  /* Quick actions */
  actionsOuter: {
    alignSelf: "stretch",
    paddingHorizontal: 16,
  },
  actionsCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#EBEBEB",
    paddingVertical: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  actionBtn: { flex: 1, alignItems: "center", justifyContent: "center", gap: 8 },
  actionLabel: { fontSize: rf(12), fontFamily: "Manrope_600SemiBold", color: "#0B0A0A" },
  actionDivider: { width: 1, height: 36, backgroundColor: "#EBEBEB" },

  /* Services grid */
  servicesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 8,
    rowGap: 14,
    alignSelf: "stretch",
  },

  /* Promo banner */
  promoBanner: {
    backgroundColor: "#111111",
    borderRadius: 18,
    paddingHorizontal: 20,
    paddingVertical: 20,
    overflow: "hidden",
    alignSelf: "center",
    gap: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
    minHeight: 140,
  },
  promoChip: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: 4,
    paddingHorizontal: 7,
    paddingVertical: 3,
    marginBottom: 2,
  },
  promoChipText: { fontSize: rf(9), fontFamily: "Manrope_700Bold", color: "rgba(255,255,255,0.7)", letterSpacing: 0.8 },
  promoPct:   { fontSize: rf(28), fontFamily: "Manrope_700Bold", color: "#FFFFFF", letterSpacing: -0.5 },
  promoTitle: { fontSize: rf(14), fontFamily: "Manrope_600SemiBold", color: "rgba(255,255,255,0.85)" },
  promoDesc:  { fontSize: rf(11), fontFamily: "Manrope_400Regular", color: "rgba(255,255,255,0.5)", lineHeight: rf(16), marginTop: 2 },
  promoArrow: {
    position: "absolute",
    bottom: 20,
    right: 130,
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: "#FFFFFF",
    alignItems: "center", justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  promoGiftWrap: {
    position: "absolute",
    right: -10,
    bottom: -10,
  },

  /* Transactions */
  secHdr: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 10,
    alignSelf: "stretch",
  },
  secTitle: { fontSize: rf(16), fontFamily: "Manrope_700Bold", color: C.text },
  viewAll:  { fontSize: rf(13), fontFamily: "Manrope_600SemiBold", color: "#0B0A0A" },

  txCard: {
    marginHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#F0F0F0",
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
    alignSelf: "stretch",
  },
  txDivider: { height: 1, backgroundColor: "#F7F7F7", marginHorizontal: 14 },
});

const sv = StyleSheet.create({
  wrap:    { alignItems: "center", gap: 7, paddingVertical: 4 },
  iconBox: {
    width: 54, height: 54, borderRadius: 14,
    alignItems: "center", justifyContent: "center",
    backgroundColor: "#F5F5F5",
    borderWidth: 1, borderColor: "#EEEEEE",
  },
  label: {
    fontSize: rf(10.5), fontFamily: "Manrope_600SemiBold",
    textAlign: "center", color: "#0B0A0A",
    lineHeight: rf(14), maxWidth: 64, flexShrink: 1,
  },
});

const tx = StyleSheet.create({
  row: {
    flexDirection: "row", alignItems: "center", gap: 12,
    paddingHorizontal: 14, paddingVertical: 14, backgroundColor: "#FFFFFF",
  },
  iconWrap: { width: 42, height: 42, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  info:  { flex: 1, gap: 3 },
  title: { fontSize: rf(13), fontFamily: "Manrope_600SemiBold", color: C.text },
  sub:   { fontSize: rf(11), fontFamily: "Manrope_400Regular", color: "#9CA3AF" },
  right: { alignItems: "flex-end", gap: 3 },
  amount: { fontSize: rf(13), fontFamily: "Manrope_700Bold", color: C.text },
  time:  { fontSize: rf(10.5), fontFamily: "Manrope_400Regular", color: "#9CA3AF" },
});

const gm = StyleSheet.create({
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
