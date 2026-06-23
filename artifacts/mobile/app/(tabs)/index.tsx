import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  Platform,
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
import { useAuth } from "@/context/AuthContext";

const { width: SW } = Dimensions.get("window");
const PROMO_W = 263;

/* ─── Light theme colors (matching design reference) ───────────────────────── */
const C = {
  bg:          "#FFFFFF",
  surface:     "#F8F9FA",
  text:        "#0B0A0A",
  textSec:     "#595F67",
  textMuted:   "#AAAFB5",
  border:      "#EDF1F3",
  success:     "#00B03C",
  danger:      "#FF0000",
  actionBar:   "#000000",
  promoPink:   "#FCB3C5",
  promoYellow: "#FFF2CF",
  promoBlue:   "#D6E1FF",
  seeAll:      "#1B1B1B",
};

/* ─── Static data ──────────────────────────────────────────────────────────── */

const SERVICES = [
  { id: "gift",     icon: "tag"            as const, label: "Gift Card",   color: "#00B03C", route: "/(app)/gift-cards"    as const },
  { id: "settings", icon: "sliders"        as const, label: "Settings",    color: "#8B8FA3", route: null },
  { id: "elec",     icon: "zap"            as const, label: "Electricity", color: "#F59E0B", route: null },
  { id: "cable",    icon: "tv"             as const, label: "Cable TV",    color: "#EF4444", route: null },
  { id: "rates",    icon: "bar-chart-2"    as const, label: "Rates",       color: "#3B82F6", route: null },
  { id: "txn",      icon: "list"           as const, label: "Transaction", color: "#8B5CF6", route: "/(app)/transactions"  as const },
  { id: "bet",      icon: "grid"           as const, label: "Bet Funding", color: "#F97316", route: null },
  { id: "more",     icon: "more-horizontal" as const, label: "More",       color: "#06B6D4", route: null },
] as const;

const PROMOS = [
  {
    id: "p1",
    pct: "50% OFF",
    title: "Summer special deal",
    desc: "Get discount for every transaction this weekend",
    bg: C.promoPink,
    textColor: "#7A1535",
  },
  {
    id: "p2",
    pct: "50% OFF",
    title: "Black friday deal",
    desc: "Get discount for every sign up and payment",
    bg: C.promoYellow,
    textColor: "#5C4000",
  },
  {
    id: "p3",
    pct: "Top Rates",
    title: "Sell Gift Cards",
    desc: "Amazon, iTunes, Steam — paid to wallet instantly",
    bg: C.promoBlue,
    textColor: "#1A3070",
  },
];

const TRANSACTIONS = [
  { id: "t1", icon: "arrow-down-circle" as const, title: "Deposit Giftcard", date: "February 24, 2022", amount: "₦200,40.00",  positive: true },
  { id: "t2", icon: "arrow-up-circle"   as const, title: "Withdraws",        date: "February 24, 2022", amount: "₦400,000.00", positive: false },
  { id: "t3", icon: "tag"               as const, title: "Amazon Gift Card",  date: "April 28, 2024",   amount: "+₦200,040",   positive: true },
];

/* ─── Sub-components ────────────────────────────────────────────────────────── */

function ServiceItem({ item, onPress }: { item: typeof SERVICES[number]; onPress: () => void }) {
  const sc = useSharedValue(1);
  const anim = useAnimatedStyle(() => ({ transform: [{ scale: sc.value }] }));
  const ITEM_W = (SW - 40) / 4;

  return (
    <Animated.View style={[anim, { width: ITEM_W, alignItems: "center" }]}>
      <Pressable
        onPress={onPress}
        onPressIn={() => { sc.value = withSpring(0.88, { damping: 12 }); }}
        onPressOut={() => { sc.value = withSpring(1, { damping: 12 }); }}
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

function PromoCard({ item, onPress }: { item: typeof PROMOS[number]; onPress: () => void }) {
  const sc = useSharedValue(1);
  const anim = useAnimatedStyle(() => ({ transform: [{ scale: sc.value }] }));

  return (
    <Animated.View style={[anim, { width: PROMO_W, marginRight: 12 }]}>
      <Pressable
        onPress={onPress}
        onPressIn={() => { sc.value = withSpring(0.97, { damping: 14 }); }}
        onPressOut={() => { sc.value = withSpring(1, { damping: 14 }); }}
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

function TxRow({ item, onPress }: { item: typeof TRANSACTIONS[number]; onPress: () => void }) {
  return (
    <TouchableOpacity
      style={[tx.row, { borderBottomColor: C.border }]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      <View style={[tx.iconWrap, { backgroundColor: (item.positive ? C.success : C.danger) + "18" }]}>
        <Feather name={item.icon} size={18} color={item.positive ? C.success : C.danger} />
      </View>
      <View style={tx.info}>
        <Text style={[tx.title, { color: C.textSec }]}>{item.title}</Text>
        <Text style={[tx.date,  { color: C.textMuted }]}>{item.date}</Text>
      </View>
      <Text style={[tx.amount, { color: item.positive ? C.success : C.danger }]}>
        {item.amount}
      </Text>
    </TouchableOpacity>
  );
}

/* ─── Main screen ───────────────────────────────────────────────────────────── */

export default function HomeScreen() {
  const router   = useRouter();
  const insets   = useSafeAreaInsets();
  const { user } = useAuth();

  const [balanceVisible, setBalanceVisible] = useState(true);
  const firstName = (user?.name ?? "User").split(" ")[0];
  const balance   = user?.balance ?? 200590;
  const formatted = "₦" + balance.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const topPad = Platform.OS === "web" ? 48 : insets.top;

  const press = (fn: () => void) => () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    fn();
  };

  return (
    <View style={[s.root, { backgroundColor: C.bg }]}>

      {/* ── Top header ─────────────────────────────────────────────────────── */}
      <Animated.View
        entering={FadeInDown.duration(350).springify()}
        style={[s.header, { paddingTop: topPad + 10, backgroundColor: C.bg }]}
      >
        <TouchableOpacity style={[s.hdrBtn, { backgroundColor: C.surface, borderColor: C.border }]}>
          <Feather name="bell" size={18} color={C.textMuted} />
        </TouchableOpacity>

        <Image
          source={require("@/assets/images/lkd.png")}
          style={s.logo}
          resizeMode="contain"
        />

        <TouchableOpacity
          style={[s.hdrBtn, { backgroundColor: C.surface, borderColor: C.border }]}
          onPress={press(() => router.push("/(app)/dashboard"))}
        >
          <Feather name="user" size={18} color={C.textMuted} />
        </TouchableOpacity>
      </Animated.View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[s.scroll, { paddingBottom: insets.bottom + 100 }]}
      >

        {/* ── User + balance card ─────────────────────────────────────────── */}
        <Animated.View
          entering={FadeInDown.duration(380).springify().delay(60)}
          style={[s.balCard, { backgroundColor: C.surface, borderColor: C.border }]}
        >
          <View style={s.userLeft}>
            <Image
              source={require("@/assets/images/man-illustration.png")}
              style={s.avatar}
              resizeMode="cover"
            />
            <View>
              <Text style={[s.greeting, { color: C.text }]}>Hi, {firstName}</Text>
              <Text style={[s.balLabel, { color: C.textMuted }]}>Your available balance</Text>
            </View>
          </View>

          <View style={s.userRight}>
            <TouchableOpacity
              onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setBalanceVisible(v => !v); }}
              style={s.eyeBtn}
            >
              <Feather name={balanceVisible ? "eye" : "eye-off"} size={18} color={C.textMuted} />
            </TouchableOpacity>
            <Text style={[s.balAmount, { color: C.text }]}>
              {balanceVisible ? formatted : "₦•••,•••.••"}
            </Text>
          </View>
        </Animated.View>

        {/* ── Quick actions (black pill) ────────────────────────────────────── */}
        <Animated.View
          entering={FadeInDown.duration(360).springify().delay(100)}
          style={s.actionsWrap}
        >
          <View style={[s.actionsBar, { backgroundColor: C.actionBar }]}>
            {[
              { icon: "plus-circle" as const, label: "Fund Wallet", onPress: press(() => router.push("/(app)/dashboard")) },
              { icon: "send"        as const, label: "Sell",        onPress: press(() => router.push("/(app)/gift-cards")) },
              { icon: "arrow-up"   as const, label: "Withdraw",    onPress: press(() => router.push("/(app)/dashboard")) },
            ].map((action, i) => (
              <React.Fragment key={action.label}>
                {i > 0 && <View style={s.actionDivider} />}
                <TouchableOpacity style={s.actionBtn} onPress={action.onPress} activeOpacity={0.72}>
                  <Feather name={action.icon} size={20} color="#FFFFFF" />
                  <Text style={s.actionLabel}>{action.label}</Text>
                </TouchableOpacity>
              </React.Fragment>
            ))}
          </View>
        </Animated.View>

        {/* ── Services grid (2×4) ──────────────────────────────────────────── */}
        <Animated.View
          entering={FadeInUp.duration(360).springify().delay(130)}
          style={s.servicesGrid}
        >
          {SERVICES.map((item, i) => (
            <Animated.View
              key={item.id}
              entering={FadeInUp.duration(300).springify().delay(130 + i * 30)}
            >
              <ServiceItem
                item={item}
                onPress={press(() => {
                  if (item.route) router.push(item.route as any);
                })}
              />
            </Animated.View>
          ))}
        </Animated.View>

        {/* ── Promo banners ─────────────────────────────────────────────────── */}
        <Animated.View entering={FadeInUp.duration(340).springify().delay(200)}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={s.promoScroll}
            snapToInterval={PROMO_W + 12}
            decelerationRate="fast"
          >
            {PROMOS.map(p => (
              <PromoCard
                key={p.id}
                item={p}
                onPress={press(() => router.push("/(app)/gift-cards"))}
              />
            ))}
          </ScrollView>
        </Animated.View>

        {/* ── Recent Transactions ───────────────────────────────────────────── */}
        <Animated.View entering={FadeInUp.duration(340).springify().delay(240)}>
          <View style={s.secHdr}>
            <Text style={[s.secTitle, { color: C.text }]}>Recent Transaction</Text>
            <TouchableOpacity onPress={press(() => router.push("/(app)/transactions"))}>
              <Text style={[s.seeAll, { color: C.seeAll }]}>See All</Text>
            </TouchableOpacity>
          </View>

          <View style={[s.txList, { backgroundColor: "#FFFFFF", borderColor: C.border }]}>
            {TRANSACTIONS.map((item, i) => (
              <Animated.View
                key={item.id}
                entering={FadeInUp.duration(280).springify().delay(240 + i * 40)}
              >
                <TxRow
                  item={item}
                  onPress={press(() => router.push("/(app)/transactions"))}
                />
              </Animated.View>
            ))}
          </View>
        </Animated.View>

      </ScrollView>
    </View>
  );
}

/* ─── Styles ─────────────────────────────────────────────────────────────────── */

const s = StyleSheet.create({
  root:   { flex: 1 },
  scroll: { paddingTop: 8, gap: 20 },

  header: {
    flexDirection:     "row",
    alignItems:        "center",
    justifyContent:    "space-between",
    paddingHorizontal: 20,
    paddingBottom:     12,
  },
  hdrBtn: {
    width: 40, height: 40,
    borderRadius: 12,
    borderWidth:  1,
    alignItems:   "center",
    justifyContent: "center",
  },
  logo: { width: 80, height: 28 },

  balCard: {
    marginHorizontal: 20,
    borderRadius:     20,
    borderWidth:      1,
    padding:          20,
    flexDirection:    "row",
    alignItems:       "center",
    justifyContent:   "space-between",
    shadowColor:      "#000",
    shadowOffset:     { width: 0, height: 2 },
    shadowOpacity:    0.06,
    shadowRadius:     8,
    elevation:        2,
  },
  userLeft:  { flexDirection: "row", alignItems: "center", gap: 12 },
  avatar:    { width: 52, height: 52, borderRadius: 26 },
  greeting:  { fontSize: 16, fontFamily: "Manrope_700Bold", marginBottom: 2 },
  balLabel:  { fontSize: 12, fontFamily: "Manrope_400Regular" },
  userRight: { alignItems: "flex-end", gap: 4 },
  eyeBtn:    { padding: 4 },
  balAmount: { fontSize: 18, fontFamily: "Manrope_700Bold", letterSpacing: -0.5 },

  actionsWrap: { paddingHorizontal: 20 },
  actionsBar: {
    borderRadius:    34,
    flexDirection:   "row",
    alignItems:      "center",
    paddingVertical: 18,
    shadowColor:     "#000",
    shadowOffset:    { width: 0, height: 4 },
    shadowOpacity:   0.3,
    shadowRadius:    12,
    elevation:       6,
  },
  actionBtn: {
    flex:           1,
    alignItems:     "center",
    justifyContent: "center",
    gap:            8,
  },
  actionLabel: {
    fontSize:    11,
    fontFamily:  "Manrope_600SemiBold",
    color:       "#FFFFFF",
    letterSpacing: 0.2,
  },
  actionDivider: { width: 1, height: 36, backgroundColor: "rgba(255,255,255,0.2)" },

  servicesGrid: {
    flexDirection:     "row",
    flexWrap:          "wrap",
    paddingHorizontal: 10,
    rowGap:            20,
  },

  promoScroll: { paddingHorizontal: 20 },

  secHdr: {
    flexDirection:     "row",
    justifyContent:    "space-between",
    alignItems:        "center",
    paddingHorizontal: 20,
    marginBottom:      10,
  },
  secTitle: { fontSize: 18, fontFamily: "Manrope_700Bold" },
  seeAll:   { fontSize: 14, fontFamily: "Manrope_600SemiBold" },
  txList: {
    marginHorizontal: 20,
    borderRadius:     3,
    borderWidth:      1,
    overflow:         "hidden",
    shadowColor:      "#000",
    shadowOffset:     { width: 0, height: 1 },
    shadowOpacity:    0.04,
    shadowRadius:     4,
    elevation:        1,
  },
});

const sv = StyleSheet.create({
  wrap:    { alignItems: "center", gap: 8, paddingVertical: 4 },
  iconBox: { width: 54, height: 54, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  label:   { fontSize: 11, fontFamily: "Manrope_500Medium", textAlign: "center", color: C.textSec },
});

const pc = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding:      20,
    paddingBottom: 22,
    overflow:     "hidden",
    gap:          4,
    height:       97,
    justifyContent: "center",
  },
  orb: {
    position:     "absolute",
    width:        100,
    height:       100,
    borderRadius: 50,
    backgroundColor: "rgba(255,255,255,0.2)",
    top: -30, right: -20,
  },
  pct:   { fontSize: 13, fontFamily: "Manrope_700Bold" },
  title: { fontSize: 13, fontFamily: "Manrope_700Bold" },
  desc:  { fontSize: 10, fontFamily: "Manrope_400Regular", lineHeight: 15, marginTop: 2 },
});

const tx = StyleSheet.create({
  row: {
    flexDirection:     "row",
    alignItems:        "center",
    gap:               12,
    paddingHorizontal: 16,
    paddingVertical:   12,
    borderBottomWidth: 1,
    backgroundColor:   "#FFFFFF",
  },
  iconWrap: {
    width:  25, height: 25,
    borderRadius: 3,
    alignItems:   "center",
    justifyContent: "center",
  },
  info:   { flex: 1 },
  title:  { fontSize: 12, fontFamily: "Manrope_600SemiBold", marginBottom: 2 },
  date:   { fontSize: 11, fontFamily: "Manrope_400Regular" },
  amount: { fontSize: 12, fontFamily: "Manrope_700Bold" },
});
