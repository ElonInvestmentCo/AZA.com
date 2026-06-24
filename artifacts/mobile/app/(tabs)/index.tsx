import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
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
import { SvgXml } from "react-native-svg";

const MAX_W = 430;

const C = {
  bg:        "#FFFFFF",
  surface:   "#F8F9FA",
  text:      "#1C1C1C",
  textSec:   "#595F67",
  textMuted: "#AAAFB5",
  border:    "#F0F0F0",
  success:   "#008A48",
  danger:    "#FF4444",
  actionBar: "#000000",
  navy:      "#061941",
};

const SERVICES = [
  { id: "gift",  label: "Gift Card",   bg: "#F3E8FF", iconColor: "#7C3AED", route: null,                        icon: "gift"            as const },
  { id: "set",   label: "Settings",    bg: "#F0FFF4", iconColor: "#059669", route: "/(app)/settings" as const,  icon: "settings"        as const },
  { id: "elec",  label: "Electricity", bg: "#FFFBEB", iconColor: "#D97706", route: "/(app)/bills" as const,     icon: "zap"             as const },
  { id: "cable", label: "Cable TV",    bg: "#FFF1F2", iconColor: "#E11D48", route: "/(app)/bills" as const,     icon: "tv"              as const },
  { id: "rates", label: "Rates",       bg: "#EFF6FF", iconColor: "#2563EB", route: "/(app)/rates" as const,     icon: "bar-chart-2"     as const },
  { id: "txn",   label: "Transaction", bg: "#F5F3FF", iconColor: "#7C3AED", route: "/(app)/transactions" as const, icon: "list"         as const },
  { id: "bet",   label: "Bet Funding", bg: "#FFF7ED", iconColor: "#EA580C", route: "/(app)/bills" as const,     icon: "dollar-sign"     as const },
  { id: "more",  label: "More",        bg: "#ECFEFF", iconColor: "#0891B2", route: "/(app)/more" as const,      icon: "more-horizontal" as const },
] as const;

const PROMOS = [
  { id: "p1", pct: "50% OFF", title: "Summer special deal",  desc: "Get discount for every transaction this weekend", bg: "#FCB3C5", textColor: "#7A1535" },
  { id: "p2", pct: "50% OFF", title: "Black friday deal",    desc: "Get discount for every top up and payment",       bg: "#FFF2CF", textColor: "#5C4000" },
  { id: "p3", pct: "Top Rates", title: "Sell Gift Cards",    desc: "Amazon, iTunes, Steam — paid instantly",          bg: "#D6E1FF", textColor: "#1A3070" },
];

const TRANSACTIONS = [
  { id: "t1", title: "Amazon card",      ref: "3289HF-4378", date: "April 28, 2024",    amount: "₦200,040",   positive: true  },
  { id: "t2", title: "Withdraws",        ref: "7812KJ-2901", date: "February 24, 2022", amount: "₦400,000.00", positive: false },
  { id: "t3", title: "Deposit Giftcard", ref: "5621AB-1122", date: "February 24, 2022", amount: "₦200,040.00", positive: true  },
];

const AVATAR_SVG = `<svg width="46" height="44" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="50" cy="50" r="50" fill="#BCE2FE"/>
<ellipse cx="50" cy="85" rx="22" ry="12" fill="#FF9F43"/>
<circle cx="50" cy="38" r="20" fill="#FFDBB5"/>
<rect x="30" y="58" width="40" height="30" rx="8" fill="#F9CA24"/>
<circle cx="43" cy="36" r="3" fill="#2C3E50"/>
<circle cx="57" cy="36" r="3" fill="#2C3E50"/>
<rect x="30" y="20" width="40" height="22" rx="10" fill="#D63031"/>
<rect x="40" y="20" width="20" height="12" rx="6" fill="#E17055"/>
</svg>`;

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
        onPressOut={() => { sc.value = withSpring(1,    { damping: 12 }); }}
        style={sv.wrap}
      >
        <View style={[sv.iconBox, { backgroundColor: item.bg }]}>
          <Feather name={item.icon} size={20} color={item.iconColor} />
        </View>
        <Text style={sv.label} numberOfLines={2}>{item.label}</Text>
      </Pressable>
    </Animated.View>
  );
}

function PromoCard({ item }: { item: (typeof PROMOS)[number] }) {
  const { width } = useWindowDimensions();
  const promoW = Math.min(width, MAX_W) - 48;
  const sc   = useSharedValue(1);
  const anim = useAnimatedStyle(() => ({ transform: [{ scale: sc.value }] }));

  return (
    <Animated.View style={[anim, { width: promoW, marginRight: 12 }]}>
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

function TxRow({ item, onPress }: { item: (typeof TRANSACTIONS)[number]; onPress: () => void }) {
  return (
    <TouchableOpacity
      style={tx.row}
      onPress={onPress}
      activeOpacity={0.75}
    >
      <View style={[tx.iconWrap, { backgroundColor: item.positive ? "#E8F7EF" : "#FFF0F0" }]}>
        <Feather
          name={item.positive ? "arrow-down-left" : "arrow-up-right"}
          size={16}
          color={item.positive ? C.success : C.danger}
        />
      </View>
      <View style={tx.info}>
        <Text style={tx.title}>{item.title}</Text>
        <Text style={tx.ref}>{item.ref}</Text>
      </View>
      <View style={tx.right}>
        <Text style={[tx.amount, { color: item.positive ? C.success : C.danger }]}>
          {item.positive ? "" : "-"}{item.amount}
        </Text>
        <Text style={tx.date}>{item.date}</Text>
      </View>
    </TouchableOpacity>
  );
}

export default function HomeScreen() {
  const router   = useRouter();
  const insets   = useSafeAreaInsets();
  const { user } = useAuth();

  const { width } = useWindowDimensions();
  const PROMO_W = Math.min(width, MAX_W) - 48;

  const [balanceVisible,   setBalanceVisible]   = useState(true);
  const [giftModalVisible, setGiftModalVisible] = useState(false);

  const firstName = (user?.name ?? "Dove").split(" ")[0];
  const balance   = user?.balance ?? 200590;
  const formatted = "₦" + balance.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const topPad = Platform.OS === "web" ? 40 : insets.top;

  const press = (fn: () => void) => () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    fn();
  };

  return (
    <View style={[s.root, { backgroundColor: C.bg }]}>

      {/* ── Top header ── */}
      <Animated.View
        entering={FadeInDown.duration(300).springify()}
        style={[s.header, { paddingTop: topPad + 8 }]}
      >
        <TouchableOpacity
          onPress={press(() => router.push("/(app)/settings" as any))}
          style={s.hdrBtn}
        >
          <Feather name="menu" size={20} color="#1C1C1C" />
        </TouchableOpacity>

        <Image
          source={require("@/assets/images/lkd.png")}
          style={s.logo}
          resizeMode="contain"
        />

        <TouchableOpacity style={s.hdrBtn}>
          <Feather name="bell" size={20} color="#1C1C1C" />
          <View style={s.notifDot} />
        </TouchableOpacity>
      </Animated.View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[s.scroll, { paddingBottom: insets.bottom + 100 }]}
      >

        {/* ── Greeting + Balance ── */}
        <Animated.View
          entering={FadeInDown.duration(340).springify().delay(50)}
          style={s.greetSection}
        >
          <View style={s.greetRow}>
            <SvgXml xml={AVATAR_SVG} width={46} height={44} />
            <View style={s.greetText}>
              <Text style={s.hiText}>Hi, {firstName}</Text>
              <Text style={s.greetSub}>Your available balance</Text>
            </View>
          </View>
          <View style={s.balRow}>
            <Text style={s.balAmount}>
              {balanceVisible ? formatted : "₦•••,•••.••"}
            </Text>
            <TouchableOpacity
              onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setBalanceVisible(v => !v); }}
              style={s.eyeBtn}
            >
              <Feather name={balanceVisible ? "eye" : "eye-off"} size={16} color={C.textMuted} />
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* ── Quick actions (black pill) ── */}
        <Animated.View
          entering={FadeInDown.duration(320).springify().delay(90)}
          style={s.actionsWrap}
        >
          <View style={s.actionsBar}>
            {[
              { icon: "plus-circle" as const, label: "Fund Wallet", onPress: press(() => router.push("/(app)/dashboard")) },
              { icon: "send"        as const, label: "Sell",        onPress: press(() => router.push("/(app)/trade-asset")) },
              { icon: "arrow-up"    as const, label: "Withdraw",    onPress: press(() => router.push("/(app)/withdraw" as any)) },
            ].map((action, i) => (
              <React.Fragment key={action.label}>
                {i > 0 && <View style={s.actionDivider} />}
                <TouchableOpacity style={s.actionBtn} onPress={action.onPress} activeOpacity={0.72}>
                  <Feather name={action.icon} size={18} color="#FFFFFF" />
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
              <PromoCard key={p.id} item={p} />
            ))}
          </ScrollView>
        </Animated.View>

        {/* ── Recent Transactions ── */}
        <Animated.View entering={FadeInUp.duration(300).springify().delay(220)}>
          <View style={s.secHdr}>
            <Text style={s.secTitle}>Recent Transaction</Text>
            <TouchableOpacity onPress={press(() => router.push("/(app)/transactions"))}>
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
                  onPress={press(() => router.push("/(app)/transactions"))}
                />
                {i < TRANSACTIONS.length - 1 && <View style={s.txDivider} />}
              </Animated.View>
            ))}
          </View>
        </Animated.View>

      </ScrollView>

      {/* ── Gift Card Bottom Sheet Modal ── */}
      <Modal
        visible={giftModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setGiftModalVisible(false)}
      >
        <Pressable style={gm.overlay} onPress={() => setGiftModalVisible(false)}>
          <Pressable style={gm.sheet} onPress={() => {}}>
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
                <View style={[gm.tileIconWrap, { backgroundColor: "rgba(92,64,0,0.12)" }]}>
                  <Feather name="gift" size={24} color="#5C4000" />
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
                <View style={[gm.tileIconWrap, { backgroundColor: "rgba(122,21,53,0.12)" }]}>
                  <Feather name="clock" size={24} color="#7A1535" />
                </View>
                <Text style={[gm.tileTitle, { color: "#7A1535" }]}>Check Pending</Text>
                <Text style={[gm.tileDesc, { color: "#7A153599" }]}>
                  Check Status of Pending gift card sale.
                </Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

    </View>
  );
}

const s = StyleSheet.create({
  root:   { flex: 1 },
  scroll: { paddingTop: 4, gap: 20 },

  header: {
    flexDirection:     "row",
    alignItems:        "center",
    justifyContent:    "space-between",
    paddingHorizontal: 20,
    paddingBottom:     10,
    backgroundColor:   C.bg,
  },
  hdrBtn: {
    width: 38, height: 38,
    borderRadius: 19,
    alignItems: "center", justifyContent: "center",
    position: "relative",
  },
  notifDot: {
    position: "absolute", top: 6, right: 6,
    width: 7, height: 7, borderRadius: 3.5,
    backgroundColor: "#FF3B30",
    borderWidth: 1.5, borderColor: C.bg,
  },
  logo: { width: 72, height: 26 },

  greetSection: {
    marginHorizontal: 20,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#F8F9FA",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: C.border,
    gap: 8,
  },
  greetRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  greetText: { gap: 2 },
  hiText:   { fontSize: 16, fontFamily: "Manrope_700Bold", color: C.text, lineHeight: 20 },
  greetSub: { fontSize: 12, fontFamily: "Manrope_400Regular", color: C.textSec },
  balRow:   { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  balAmount: { fontSize: 22, fontFamily: "Manrope_700Bold", color: C.text, letterSpacing: -0.5 },
  eyeBtn:    { padding: 6 },

  actionsWrap: { paddingHorizontal: 20 },
  actionsBar: {
    backgroundColor: C.actionBar,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  actionBtn: { flex: 1, alignItems: "center", justifyContent: "center", gap: 6 },
  actionLabel: { fontSize: 10, fontFamily: "Manrope_700Bold", color: "#FFFFFF", letterSpacing: 0.2 },
  actionDivider: { width: 1, height: 32, backgroundColor: "rgba(255,255,255,0.18)" },

  servicesGrid: { flexDirection: "row", flexWrap: "wrap", paddingHorizontal: 8, rowGap: 16 },

  promoScroll: { paddingHorizontal: 20 },

  secHdr: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    paddingHorizontal: 20, marginBottom: 10,
  },
  secTitle: { fontSize: 16, fontFamily: "Manrope_700Bold", color: C.navy },
  seeAll:   { fontSize: 13, fontFamily: "Manrope_500Medium", color: "#135EF2" },

  txCard: {
    marginHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: C.border,
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
  },
  txDivider: { height: 1, backgroundColor: "#F3F4F7", marginHorizontal: 12 },
});

const sv = StyleSheet.create({
  wrap:    { alignItems: "center", gap: 6, paddingVertical: 4 },
  iconBox: { width: 50, height: 50, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  label:   { fontSize: 10, fontFamily: "Manrope_700Bold", textAlign: "center", color: C.textSec, lineHeight: 14 },
});

const pc = StyleSheet.create({
  card: {
    borderRadius: 12, padding: 16, paddingBottom: 20, overflow: "hidden", gap: 4, height: 110, justifyContent: "center",
  },
  orb: {
    position: "absolute", width: 110, height: 110, borderRadius: 55,
    backgroundColor: "rgba(255,255,255,0.22)", top: -40, right: -25,
  },
  pct:   { fontSize: 11, fontFamily: "Manrope_700Bold" },
  title: { fontSize: 13, fontFamily: "Manrope_700Bold" },
  desc:  { fontSize: 10, fontFamily: "Manrope_400Regular", lineHeight: 14, marginTop: 2 },
});

const tx = StyleSheet.create({
  row: {
    flexDirection: "row", alignItems: "center", gap: 12,
    paddingHorizontal: 14, paddingVertical: 14, backgroundColor: "#FFFFFF",
  },
  iconWrap: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  info:   { flex: 1 },
  title:  { fontSize: 14, fontFamily: "Manrope_500Medium", color: C.navy, marginBottom: 2 },
  ref:    { fontSize: 12, fontFamily: "Manrope_400Regular", color: "#9DA4B4" },
  right:  { alignItems: "flex-end", gap: 3 },
  amount: { fontSize: 16, fontFamily: "Manrope_500Medium" },
  date:   { fontSize: 12, fontFamily: "Manrope_400Regular", color: "#9DA4B4" },
});

const gm = StyleSheet.create({
  overlay: {
    flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 28, borderTopRightRadius: 28,
    paddingHorizontal: 20, paddingTop: 12, paddingBottom: 36,
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
  sheetTitle: { fontSize: 18, fontFamily: "Manrope_700Bold", color: "#1E232C" },
  closeBtn: {
    width: 34, height: 34, borderRadius: 17, backgroundColor: "#F7F8F9",
    alignItems: "center", justifyContent: "center",
  },
  tilesRow: { flexDirection: "row", gap: 14 },
  tile: { flex: 1, borderRadius: 16, padding: 16, gap: 10, minHeight: 160 },
  tileIconWrap: {
    width: 48, height: 48, borderRadius: 14,
    alignItems: "center", justifyContent: "center", marginBottom: 4,
  },
  tileTitle: { fontSize: 14, fontFamily: "Manrope_700Bold" },
  tileDesc:  { fontSize: 12, fontFamily: "Manrope_400Regular", lineHeight: 17 },
});
