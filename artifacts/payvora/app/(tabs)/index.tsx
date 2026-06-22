import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Animated,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "@/context/AuthContext";
import { useWallet } from "@/context/WalletContext";

const WHITE = "#FFFFFF";
const BLACK = "#000000";
const TEXT_DARK = "#0B0A0A";
const TEXT_GRAY = "#595F67";
const TEXT_LIGHT = "#AAAFB5";
const GREEN = "#00B03C";
const RED = "#FF0000";
const PROMO_PINK = "#FCB3C5";
const PROMO_YELLOW = "#FFF2CF";
const PROMO_BLUE = "#D6E1FF";

const QUICK_ACTIONS = [
  { label: "Gift Card", icon: "gift", key: "gift" },
  { label: "Settings", icon: "sliders", key: "settings" },
  { label: "Electricity", icon: "zap", key: "electricity" },
  { label: "Cable TV", icon: "tv", key: "cable" },
  { label: "Rates", icon: "bar-chart-2", key: "rates" },
  { label: "Transaction", icon: "list", key: "transaction" },
  { label: "Bet Funding", icon: "dollar-sign", key: "bet" },
  { label: "More", icon: "grid", key: "more" },
];

const PROMO_CARDS = [
  {
    id: "1",
    pct: "50% OFF",
    title: "Summer special deal",
    desc: "Get discount for every transaction this weekend",
    bg: PROMO_PINK,
  },
  {
    id: "2",
    pct: "50% OFF",
    title: "Black friday deal",
    desc: "Get discount for every sign up and payment",
    bg: PROMO_YELLOW,
  },
  {
    id: "3",
    pct: "30% OFF",
    title: "Refer & Earn",
    desc: "Get cashback for every friend you invite",
    bg: PROMO_BLUE,
  },
];

const STATIC_TXS = [
  {
    id: "s1",
    icon: "triangle",
    name: "Deposit Giftcard",
    date: "February 24,2022",
    amount: "+₦200,40.00",
    isPositive: true,
  },
  {
    id: "s2",
    icon: "arrow-down",
    name: "Withdraws",
    date: "February 24,2022",
    amount: "-₦400,000.00",
    isPositive: false,
  },
];

function AZALogo() {
  return (
    <View style={styles.logoRow}>
      <Text style={styles.logoText}>AZA</Text>
    </View>
  );
}

function Avatar({ initial }: { initial: string }) {
  return (
    <LinearGradient
      colors={["#BCE2FE", "#D8B4FE"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.avatarCircle}
    >
      <Text style={styles.avatarInitial}>{initial}</Text>
    </LinearGradient>
  );
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user } = useAuth();
  const { balance, transactions } = useWallet();
  const [balanceVisible, setBalanceVisible] = useState(true);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const firstName = user?.name?.split(" ")[0] ?? "Dove";
  const initial = firstName.charAt(0).toUpperCase();

  const displayBalance = balanceVisible
    ? `₦${(balance * 1550).toLocaleString("en-NG", { minimumFractionDigits: 2 })}`
    : "••••••••";

  const recentTxs = transactions.slice(0, 2);

  function handleEyeToggle() {
    Haptics.selectionAsync();
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.92, duration: 80, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 80, useNativeDriver: true }),
    ]).start();
    setBalanceVisible((v) => !v);
  }

  async function handleAction(label: string) {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (label === "Fund Wallet" || label === "Withdraw") {
      router.push("/(tabs)/send" as any);
    }
  }

  async function handleQuick(key: string) {
    await Haptics.selectionAsync();
    if (key === "transaction") router.push("/(tabs)/send" as any);
    if (key === "settings") router.push("/(tabs)/profile" as any);
  }

  const topPad = Platform.OS === "web" ? 20 : insets.top;

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor={WHITE} />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingTop: topPad, paddingBottom: 110 }}
        showsVerticalScrollIndicator={false}
      >
        <AZALogo />

        {/* ── Greeting + Balance ── */}
        <View style={styles.greetingRow}>
          <View style={styles.greetingLeft}>
            <Avatar initial={initial} />
            <View style={styles.greetingTexts}>
              <Text style={styles.greetingName}>Hi, {firstName}</Text>
              <Text style={styles.greetingSub}>Your available balance</Text>
            </View>
          </View>
          <View style={styles.balanceRight}>
            <TouchableOpacity onPress={handleEyeToggle} style={styles.eyeBtn} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Feather
                name={balanceVisible ? "eye-off" : "eye"}
                size={20}
                color={TEXT_GRAY}
              />
            </TouchableOpacity>
            <Animated.Text style={[styles.balanceAmount, { transform: [{ scale: scaleAnim }] }]}>
              {displayBalance}
            </Animated.Text>
          </View>
        </View>

        {/* ── Action Bar ── */}
        <View style={styles.actionBar}>
          {[
            { label: "Fund Wallet", icon: "plus-circle" as const },
            { label: "Sell", icon: "send" as const },
            { label: "Withdraw", icon: "download" as const },
          ].map((action, i) => (
            <TouchableOpacity
              key={action.label}
              style={[styles.actionItem, i < 2 && styles.actionBorder]}
              onPress={() => handleAction(action.label)}
              activeOpacity={0.6}
            >
              <View style={styles.actionIconWrap}>
                <Feather name={action.icon} size={22} color={WHITE} />
              </View>
              <Text style={styles.actionLabel}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Quick Actions Grid ── */}
        <View style={styles.quickGrid}>
          {QUICK_ACTIONS.map((item) => (
            <TouchableOpacity
              key={item.key}
              style={styles.quickItem}
              onPress={() => handleQuick(item.key)}
              activeOpacity={0.65}
            >
              <View style={styles.quickIconWrap}>
                <Feather name={item.icon as any} size={22} color={TEXT_DARK} />
              </View>
              <Text style={styles.quickLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Promo Banners ── */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.promoScroll}
          decelerationRate="fast"
          snapToInterval={276}
          snapToAlignment="start"
        >
          {PROMO_CARDS.map((card) => (
            <TouchableOpacity
              key={card.id}
              style={[styles.promoCard, { backgroundColor: card.bg }]}
              onPress={() => Haptics.selectionAsync()}
              activeOpacity={0.82}
            >
              <Text style={styles.promoPct}>{card.pct}</Text>
              <Text style={styles.promoTitle}>{card.title}</Text>
              <Text style={styles.promoDesc}>{card.desc}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* ── Recent Transaction ── */}
        <View style={styles.txSection}>
          <View style={styles.txHeader}>
            <Text style={styles.txHeading}>Recent Transaction</Text>
            <TouchableOpacity onPress={() => Haptics.selectionAsync()} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Text style={styles.txSeeAll}>See All</Text>
            </TouchableOpacity>
          </View>

          {/* Rows from WalletContext if available, else static */}
          {(recentTxs.length > 0 ? recentTxs.map((tx) => ({
            id: tx.id,
            icon: tx.amount > 0 ? "triangle" : "arrow-down",
            name: tx.title,
            date: new Date(tx.timestamp).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
            amount: (tx.amount > 0 ? "+" : "-") + "₦" + Math.abs(tx.amount * 1550).toLocaleString("en-NG", { minimumFractionDigits: 2 }),
            isPositive: tx.amount > 0,
          })) : STATIC_TXS).map((row) => (
            <TouchableOpacity
              key={row.id}
              style={styles.txRow}
              onPress={() => Haptics.selectionAsync()}
              activeOpacity={0.7}
            >
              <View style={styles.txLeft}>
                <View style={styles.txIconWrap}>
                  <Feather
                    name={row.icon as any}
                    size={14}
                    color={TEXT_DARK}
                  />
                </View>
                <View style={styles.txInfo}>
                  <Text style={styles.txName}>{row.name}</Text>
                  <Text style={styles.txDate}>{row.date}</Text>
                </View>
              </View>
              <Text style={[styles.txAmount, { color: row.isPositive ? GREEN : RED }]}>
                {row.amount}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: WHITE },
  scroll: { flex: 1, backgroundColor: WHITE },

  // Logo
  logoRow: { alignItems: "center", paddingVertical: 14 },
  logoText: {
    fontFamily: "Inter_700Bold",
    fontSize: 22,
    letterSpacing: 4,
    color: TEXT_DARK,
  },

  // Greeting
  greetingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  greetingLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  avatarCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitial: {
    fontFamily: "Inter_700Bold",
    fontSize: 20,
    color: WHITE,
    lineHeight: 24,
  },
  greetingTexts: { gap: 2 },
  greetingName: {
    fontFamily: "Inter_700Bold",
    fontSize: 16,
    color: TEXT_DARK,
    lineHeight: 22,
  },
  greetingSub: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: TEXT_GRAY,
    lineHeight: 18,
  },
  balanceRight: { alignItems: "flex-end", gap: 4 },
  eyeBtn: { padding: 2 },
  balanceAmount: {
    fontFamily: "Inter_700Bold",
    fontSize: 18,
    color: TEXT_DARK,
    letterSpacing: -0.3,
  },

  // Action Bar
  actionBar: {
    marginHorizontal: 21,
    backgroundColor: BLACK,
    borderRadius: 14,
    flexDirection: "row",
    marginBottom: 28,
    overflow: "hidden",
  },
  actionItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    gap: 6,
  },
  actionBorder: {
    borderRightWidth: StyleSheet.hairlineWidth,
    borderRightColor: "rgba(255,255,255,0.15)",
  },
  actionIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },
  actionLabel: {
    fontFamily: "Inter_500Medium",
    fontSize: 11.5,
    color: WHITE,
    textAlign: "center",
    letterSpacing: 0.1,
  },

  // Quick Actions Grid
  quickGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 21,
    marginBottom: 24,
    rowGap: 20,
  },
  quickItem: {
    width: "25%",
    alignItems: "center",
    gap: 8,
  },
  quickIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F7F7F8",
  },
  quickLabel: {
    fontFamily: "Inter_500Medium",
    fontSize: 10.5,
    color: TEXT_GRAY,
    textAlign: "center",
    lineHeight: 14,
  },

  // Promo Banners
  promoScroll: {
    paddingLeft: 21,
    paddingRight: 9,
    gap: 12,
    marginBottom: 28,
  },
  promoCard: {
    width: 263,
    borderRadius: 10,
    padding: 18,
    justifyContent: "flex-end",
    minHeight: 100,
    gap: 4,
  },
  promoPct: {
    fontFamily: "Inter_700Bold",
    fontSize: 20,
    color: TEXT_DARK,
    lineHeight: 26,
  },
  promoTitle: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 13.5,
    color: TEXT_DARK,
    lineHeight: 18,
  },
  promoDesc: {
    fontFamily: "Inter_400Regular",
    fontSize: 11,
    color: TEXT_GRAY,
    lineHeight: 16,
  },

  // Recent Transaction
  txSection: {
    paddingHorizontal: 21,
    gap: 12,
  },
  txHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  txHeading: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 18,
    color: TEXT_DARK,
    lineHeight: 23,
  },
  txSeeAll: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 12.5,
    color: BLACK,
    textAlign: "right",
  },
  txRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    minHeight: 48,
    backgroundColor: WHITE,
    borderRadius: 4,
  },
  txLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  txIconWrap: {
    width: 26,
    height: 26,
    borderRadius: 4,
    backgroundColor: "#F0F0F2",
    alignItems: "center",
    justifyContent: "center",
  },
  txInfo: { gap: 2, flex: 1 },
  txName: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 12.5,
    color: TEXT_GRAY,
    lineHeight: 19,
  },
  txDate: {
    fontFamily: "Inter_500Medium",
    fontSize: 11,
    color: TEXT_LIGHT,
    lineHeight: 17,
  },
  txAmount: {
    fontFamily: "Inter_700Bold",
    fontSize: 12.5,
    lineHeight: 19,
    textAlign: "right",
    minWidth: 90,
  },
});
