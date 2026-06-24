import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React from "react";
import {
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width: SW } = Dimensions.get("window");
const PROMO_W = SW - 60;

const C = {
  bg:        "#FFFFFF",
  text:      "#0B0A0A",
  textSec:   "#595F67",
  textMuted: "#AAAFB5",
  border:    "#EDF1F3",
  success:   "#00B03C",
  danger:    "#FF0000",
};

const SERVICES = [
  { id: "gift",  icon: "gift"            as const, label: "Gift Card",   color: "#7C3AED" },
  { id: "water", icon: "droplet"         as const, label: "Water",       color: "#3B82F6" },
  { id: "elec",  icon: "zap"             as const, label: "Electricity", color: "#F59E0B" },
  { id: "cable", icon: "tv"              as const, label: "Cable TV",    color: "#EF4444" },
  { id: "rates", icon: "bar-chart-2"     as const, label: "Rates",       color: "#3B82F6" },
  { id: "txn",   icon: "list"            as const, label: "Transaction", color: "#8B5CF6" },
  { id: "bet",   icon: "grid"            as const, label: "Bet Funding", color: "#F97316" },
  { id: "more",  icon: "more-horizontal" as const, label: "More",        color: "#06B6D4" },
] as const;

const PROMOS = [
  { id: "p1", pct: "50% OFF",  title: "Black friday deal",   desc: "Get discount for every top up and payment",        bg: "#D6E1FF", textColor: "#1A3070" },
  { id: "p2", pct: "50% OFF",  title: "Summer special deal", desc: "Get discount for every transaction this weekend",  bg: "#FCB3C5", textColor: "#7A1535" },
  { id: "p3", pct: "50% OFF",  title: "Black friday deal",   desc: "Get discount for every top up and payment",        bg: "#FFF2CF", textColor: "#5C4000" },
];

const TRANSACTIONS = [
  { id: "t1", icon: "arrow-down-circle" as const, title: "Deposit Giftcard", date: "February 24, 2022", amount: "₦200,40.00",  positive: true  },
  { id: "t2", icon: "arrow-up-circle"   as const, title: "Withdraws",        date: "February 24, 2022", amount: "₦400,000.00", positive: false },
];

function ServiceItem({ item, onPress }: { item: typeof SERVICES[number]; onPress: () => void }) {
  const sc   = useSharedValue(1);
  const anim = useAnimatedStyle(() => ({ transform: [{ scale: sc.value }] }));
  const ITEM_W = (SW - 40) / 4;

  return (
    <Animated.View style={[anim, { width: ITEM_W, alignItems: "center" }]}>
      <Pressable
        onPress={onPress}
        onPressIn={() => { sc.value = withSpring(0.88, { damping: 12 }); }}
        onPressOut={() => { sc.value = withSpring(1,    { damping: 12 }); }}
        style={sv.wrap}
      >
        <View style={[sv.iconBox, { backgroundColor: item.color + "20" }]}>
          <Feather name={item.icon} size={22} color={item.color} />
        </View>
        <Text style={sv.label} numberOfLines={1}>{item.label}</Text>
      </Pressable>
    </Animated.View>
  );
}

function PromoCard({ item }: { item: typeof PROMOS[number] }) {
  const sc   = useSharedValue(1);
  const anim = useAnimatedStyle(() => ({ transform: [{ scale: sc.value }] }));
  return (
    <Animated.View style={[anim, { width: PROMO_W, marginRight: 16 }]}>
      <Pressable
        onPressIn={() => { sc.value = withSpring(0.97, { damping: 14 }); }}
        onPressOut={() => { sc.value = withSpring(1,    { damping: 14 }); }}
      >
        <View style={[pc.card, { backgroundColor: item.bg }]}>
          <View style={pc.orb} />
          <Text style={[pc.pct,   { color: item.textColor }]}>{item.pct}</Text>
          <Text style={[pc.title, { color: item.textColor }]}>{item.title}</Text>
          <Text style={[pc.desc,  { color: item.textColor + "CC" }]}>{item.desc}</Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}

export default function TradeAssetScreen() {
  const router  = useRouter();
  const insets  = useSafeAreaInsets();

  const press = (fn: () => void) => () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    fn();
  };

  return (
    <View style={[s.root, { backgroundColor: C.bg }]}>

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <Animated.View
        entering={FadeInDown.duration(320).springify()}
        style={[s.header, { paddingTop: (insets.top || 16) + 12 }]}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={s.backBtn}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Feather name="arrow-left" size={22} color="#1E232C" />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Gift Card</Text>
        <View style={{ width: 40 }} />
      </Animated.View>
      <View style={s.headerDivider} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[s.scroll, { paddingBottom: insets.bottom + 40 }]}
      >

        {/* ── Services grid (2×4) ──────────────────────────────────────────── */}
        <Animated.View
          entering={FadeInDown.duration(360).springify().delay(80)}
          style={s.servicesGrid}
        >
          {SERVICES.map((item, i) => (
            <Animated.View
              key={item.id}
              entering={FadeInDown.duration(300).springify().delay(80 + i * 28)}
            >
              <ServiceItem
                item={item}
                onPress={press(() => {
                  if (item.id === "gift") router.push("/(app)/sell-gift-card" as any);
                })}
              />
            </Animated.View>
          ))}
        </Animated.View>

        {/* ── Promo banners ─────────────────────────────────────────────────── */}
        <Animated.View entering={FadeInUp.duration(340).springify().delay(180)}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={s.promoScroll}
            snapToInterval={PROMO_W + 16}
            decelerationRate="fast"
          >
            {PROMOS.map(p => <PromoCard key={p.id} item={p} />)}
          </ScrollView>
        </Animated.View>

        {/* ── Recent Transactions ───────────────────────────────────────────── */}
        <Animated.View entering={FadeInUp.duration(340).springify().delay(220)}>
          <View style={s.secHdr}>
            <Text style={s.secTitle}>Recent Transaction</Text>
            <TouchableOpacity onPress={press(() => router.push("/(app)/transactions"))}>
              <Text style={s.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>

          <View style={s.txList}>
            {TRANSACTIONS.map((item, i) => (
              <Animated.View
                key={item.id}
                entering={FadeInUp.duration(280).springify().delay(220 + i * 40)}
              >
                <TouchableOpacity
                  style={[s.txRow, { borderBottomColor: C.border, borderBottomWidth: i < TRANSACTIONS.length - 1 ? 1 : 0 }]}
                  activeOpacity={0.75}
                >
                  <View style={[s.txIcon, { backgroundColor: (item.positive ? C.success : C.danger) + "18" }]}>
                    <Feather name={item.icon} size={18} color={item.positive ? C.success : C.danger} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={s.txTitle}>{item.title}</Text>
                    <Text style={s.txDate}>{item.date}</Text>
                  </View>
                  <Text style={[s.txAmount, { color: item.positive ? C.success : C.danger }]}>
                    {item.amount}
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        </Animated.View>

        {/* ── Sell Gift Card button ─────────────────────────────────────────── */}
        <Animated.View entering={FadeInUp.duration(340).springify().delay(280)}>
          <TouchableOpacity
            style={s.sellBtn}
            onPress={press(() => router.push("/(app)/sell-gift-card" as any))}
            activeOpacity={0.85}
          >
            <Feather name="gift" size={18} color="#FFFFFF" />
            <Text style={s.sellBtnText}>Sell Gift Card</Text>
          </TouchableOpacity>
        </Animated.View>

      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#FFFFFF" },

  header: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 20, paddingBottom: 16, backgroundColor: "#FFFFFF",
  },
  backBtn:     { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: 14, fontFamily: "Manrope_700Bold", color: "#000000", textAlign: "center", flex: 1 },
  headerDivider: { height: 1, backgroundColor: "#D1D1D1" },

  scroll: { paddingTop: 20, gap: 20 },

  servicesGrid: { flexDirection: "row", flexWrap: "wrap", paddingHorizontal: 10, rowGap: 20 },

  promoScroll: { paddingHorizontal: 20 },

  secHdr: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    paddingHorizontal: 20, marginBottom: 10,
  },
  secTitle: { fontSize: 18, fontFamily: "Manrope_700Bold", color: "#0B0A0A" },
  seeAll:   { fontSize: 14, fontFamily: "Manrope_600SemiBold", color: "#1B1B1B" },

  txList: {
    marginHorizontal: 20, borderRadius: 6, borderWidth: 1, borderColor: "#EDF1F3",
    overflow: "hidden", backgroundColor: "#FFFFFF",
    shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  txRow: {
    flexDirection: "row", alignItems: "center", gap: 12,
    paddingHorizontal: 16, paddingVertical: 12, backgroundColor: "#FFFFFF",
  },
  txIcon:   { width: 25, height: 25, borderRadius: 3, alignItems: "center", justifyContent: "center" },
  txTitle:  { fontSize: 12, fontFamily: "Manrope_600SemiBold", color: "#595F67", marginBottom: 2 },
  txDate:   { fontSize: 11, fontFamily: "Manrope_400Regular",  color: "#AAAFB5" },
  txAmount: { fontSize: 12, fontFamily: "Manrope_700Bold" },

  sellBtn: {
    marginHorizontal: 20, backgroundColor: "#000000", height: 52, borderRadius: 10,
    flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10,
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 6, elevation: 4,
  },
  sellBtnText: { fontSize: 14, fontFamily: "Manrope_700Bold", color: "#FFFFFF" },
});

const sv = StyleSheet.create({
  wrap:    { alignItems: "center", gap: 8, paddingVertical: 4 },
  iconBox: { width: 54, height: 54, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  label:   { fontSize: 11, fontFamily: "Manrope_500Medium", textAlign: "center", color: "#595F67" },
});

const pc = StyleSheet.create({
  card: {
    borderRadius: 6, padding: 16, paddingBottom: 20, overflow: "hidden", gap: 4, height: 97, justifyContent: "center",
  },
  orb: {
    position: "absolute", width: 100, height: 100, borderRadius: 50,
    backgroundColor: "rgba(255,255,255,0.2)", top: -30, right: -20,
  },
  pct:   { fontSize: 13, fontFamily: "Manrope_700Bold" },
  title: { fontSize: 13, fontFamily: "Manrope_700Bold" },
  desc:  { fontSize: 10, fontFamily: "Manrope_400Regular", lineHeight: 15, marginTop: 2 },
});
