import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Animated,
  Modal,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "@/context/AuthContext";
import { useWallet, Transaction } from "@/context/WalletContext";

// ── Palette ──────────────────────────────────────────────────
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

// Sheet dark palette
const SHEET_BG = "#0E0E1A";
const SHEET_CARD = "#181825";
const SHEET_BORDER = "rgba(255,255,255,0.07)";
const SHEET_LABEL = "rgba(255,255,255,0.42)";
const SHEET_VALUE = "#FFFFFF";
const ACCENT_GREEN = "#00D9A0";
const ACCENT_RED = "#F87171";

// ── Static data ───────────────────────────────────────────────
const QUICK_ACTIONS = [
  { label: "Gift Card",    icon: "gift",        key: "gift"        },
  { label: "Settings",    icon: "sliders",     key: "settings"    },
  { label: "Electricity", icon: "zap",         key: "electricity" },
  { label: "Cable TV",    icon: "tv",          key: "cable"       },
  { label: "Rates",       icon: "bar-chart-2", key: "rates"       },
  { label: "Transaction", icon: "list",        key: "transaction" },
  { label: "Bet Funding", icon: "dollar-sign", key: "bet"         },
  { label: "More",        icon: "grid",        key: "more"        },
];

const PROMO_CARDS = [
  { id: "1", pct: "50% OFF", title: "Summer special deal",  desc: "Get discount for every transaction this weekend", bg: PROMO_PINK   },
  { id: "2", pct: "50% OFF", title: "Black friday deal",    desc: "Get discount for every sign up and payment",     bg: PROMO_YELLOW },
  { id: "3", pct: "30% OFF", title: "Refer & Earn",         desc: "Get cashback for every friend you invite",       bg: PROMO_BLUE   },
];

// ── Types ─────────────────────────────────────────────────────
interface FullTxRow {
  id: string;
  icon: string;
  name: string;
  date: string;
  amount: string;
  isPositive: boolean;
  type: string;
  status: "completed" | "pending" | "failed";
  reference: string;
  rawAmount: number;
  currency: string;
  timestamp: string;
  note: string;
}

const STATIC_TXS: FullTxRow[] = [
  {
    id: "s1",
    icon: "triangle",
    name: "Deposit Giftcard",
    date: "February 24, 2022",
    amount: "+₦20,040.00",
    isPositive: true,
    type: "Gift Card Deposit",
    status: "completed",
    reference: "PAY-20220224-GC-0041",
    rawAmount: 20040,
    currency: "NGN",
    timestamp: "February 24, 2022 · 09:45 AM",
    note: "Gift card top-up",
  },
  {
    id: "s2",
    icon: "arrow-down",
    name: "Withdraws",
    date: "February 24, 2022",
    amount: "-₦400,000.00",
    isPositive: false,
    type: "Bank Withdrawal",
    status: "completed",
    reference: "PAY-20220224-WD-0098",
    rawAmount: 400000,
    currency: "NGN",
    timestamp: "February 24, 2022 · 02:17 PM",
    note: "Withdrawal to bank account",
  },
];

function txFromWallet(tx: Transaction): FullTxRow {
  const naira = Math.abs(tx.amount * 1550);
  return {
    id: tx.id,
    icon: tx.amount > 0 ? "triangle" : "arrow-down",
    name: tx.title,
    date: new Date(tx.timestamp).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
    amount: (tx.amount > 0 ? "+" : "-") + "₦" + naira.toLocaleString("en-NG", { minimumFractionDigits: 2 }),
    isPositive: tx.amount > 0,
    type: tx.type === "receive" ? "Deposit" : tx.type === "send" ? "Transfer" : tx.type === "trade" ? "Trade" : "Top-up",
    status: tx.status,
    reference: `PAY-${tx.id.padStart(8, "0")}`,
    rawAmount: naira,
    currency: "NGN",
    timestamp: new Date(tx.timestamp).toLocaleString("en-US", { month: "long", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" }),
    note: tx.subtitle,
  };
}

// ── Sub-components ────────────────────────────────────────────
function PayvoraLogo() {
  return (
    <View style={styles.logoRow}>
      <Text style={styles.logoText}>Payvora</Text>
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

// ── Transaction Detail Sheet ──────────────────────────────────
const SHEET_HEIGHT = 460;

function StatusPill({ status }: { status: FullTxRow["status"] }) {
  const map = {
    completed: { bg: "#00D9A018", text: ACCENT_GREEN, label: "Completed", dot: "●" },
    pending:   { bg: "#F59E0B18", text: "#F59E0B",    label: "Pending",   dot: "○" },
    failed:    { bg: "#F8717118", text: ACCENT_RED,   label: "Failed",    dot: "✕" },
  };
  const s = map[status] ?? map.completed;
  return (
    <View style={[sheetStyles.statusPill, { backgroundColor: s.bg }]}>
      <Text style={[sheetStyles.statusText, { color: s.text }]}>{s.dot}  {s.label}</Text>
    </View>
  );
}

function DetailRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <View style={sheetStyles.detailRow}>
      <Text style={sheetStyles.detailLabel}>{label}</Text>
      <Text style={[sheetStyles.detailValue, mono && sheetStyles.mono]} numberOfLines={1} adjustsFontSizeToFit>
        {value}
      </Text>
    </View>
  );
}

function TransactionDetailSheet({
  tx,
  sheetY,
  backdropOpacity,
  onClose,
}: {
  tx: FullTxRow | null;
  sheetY: Animated.Value;
  backdropOpacity: Animated.Value;
  onClose: () => void;
}) {
  if (!tx) return null;
  const amountColor = tx.isPositive ? ACCENT_GREEN : ACCENT_RED;

  return (
    <Modal transparent animationType="none" visible statusBarTranslucent onRequestClose={onClose}>
      {/* Backdrop */}
      <Animated.View style={[sheetStyles.backdrop, { opacity: backdropOpacity }]}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={StyleSheet.absoluteFill} />
        </TouchableWithoutFeedback>
      </Animated.View>

      {/* Sheet */}
      <Animated.View style={[sheetStyles.sheet, { transform: [{ translateY: sheetY }] }]}>
        {/* Drag handle */}
        <View style={sheetStyles.handle} />

        {/* Header row */}
        <View style={sheetStyles.sheetHeader}>
          <Text style={sheetStyles.sheetTitle}>Transaction Details</Text>
          <TouchableOpacity onPress={onClose} style={sheetStyles.closeBtn} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
            <Feather name="x" size={18} color="rgba(255,255,255,0.6)" />
          </TouchableOpacity>
        </View>

        {/* Amount hero */}
        <View style={sheetStyles.amountHero}>
          <View style={[sheetStyles.txTypeChip, { backgroundColor: amountColor + "18" }]}>
            <Feather name={tx.isPositive ? "arrow-down-left" : "arrow-up-right"} size={15} color={amountColor} />
          </View>
          <View style={sheetStyles.amountBlock}>
            <Text style={[sheetStyles.heroAmount, { color: amountColor }]}>{tx.amount}</Text>
            <Text style={sheetStyles.heroName}>{tx.name}</Text>
          </View>
        </View>

        {/* Divider */}
        <View style={sheetStyles.divider} />

        {/* Detail rows */}
        <View style={sheetStyles.detailsBlock}>
          <DetailRow label="Type"       value={tx.type}      />
          <DetailRow label="Date & Time" value={tx.timestamp} />
          <DetailRow label="Currency"   value={tx.currency}  />
          <View style={sheetStyles.statusRow}>
            <Text style={sheetStyles.detailLabel}>Status</Text>
            <StatusPill status={tx.status} />
          </View>
          <DetailRow label="Reference"  value={tx.reference} mono />
          {tx.note ? <DetailRow label="Note" value={tx.note} /> : null}
        </View>

        {/* CTA */}
        <TouchableOpacity
          style={sheetStyles.ctaBtn}
          onPress={() => { Haptics.selectionAsync(); onClose(); }}
          activeOpacity={0.78}
        >
          <Text style={sheetStyles.ctaText}>Done</Text>
        </TouchableOpacity>
      </Animated.View>
    </Modal>
  );
}

// ── Main screen ───────────────────────────────────────────────
export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user } = useAuth();
  const { balance, transactions } = useWallet();
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [selectedTx, setSelectedTx] = useState<FullTxRow | null>(null);

  const scaleAnim     = useRef(new Animated.Value(1)).current;
  const sheetY        = useRef(new Animated.Value(SHEET_HEIGHT)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  const firstName = user?.name?.split(" ")[0] ?? "Dove";
  const initial   = firstName.charAt(0).toUpperCase();

  const displayBalance = balanceVisible
    ? `₦${(balance * 1550).toLocaleString("en-NG", { minimumFractionDigits: 2 })}`
    : "••••••••";

  const rows: FullTxRow[] =
    transactions.length > 0
      ? transactions.slice(0, 2).map(txFromWallet)
      : STATIC_TXS;

  // ── Handlers ──────────────────────────────────────────────
  function handleEyeToggle() {
    Haptics.selectionAsync();
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.91, duration: 75, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1,    duration: 75, useNativeDriver: true }),
    ]).start();
    setBalanceVisible((v) => !v);
  }

  async function handleAction(label: string) {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (label === "Fund Wallet" || label === "Withdraw") router.push("/(tabs)/send" as any);
    if (label === "Sell") router.push("/(tabs)/markets" as any);
  }

  async function handleQuick(key: string) {
    await Haptics.selectionAsync();
    if (key === "transaction") router.push("/(tabs)/send" as any);
    if (key === "settings")    router.push("/(tabs)/profile" as any);
  }

  function openSheet(tx: FullTxRow) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedTx(tx);
    Animated.parallel([
      Animated.spring(sheetY, { toValue: 0, tension: 68, friction: 11, useNativeDriver: true }),
      Animated.timing(backdropOpacity, { toValue: 1, duration: 240, useNativeDriver: true }),
    ]).start();
  }

  function closeSheet() {
    Haptics.selectionAsync();
    Animated.parallel([
      Animated.timing(sheetY, { toValue: SHEET_HEIGHT, duration: 260, useNativeDriver: true }),
      Animated.timing(backdropOpacity, { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start(() => setSelectedTx(null));
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
        <PayvoraLogo />

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
            <TouchableOpacity
              onPress={handleEyeToggle}
              style={styles.eyeBtn}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Feather name={balanceVisible ? "eye-off" : "eye"} size={20} color={TEXT_GRAY} />
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
            { label: "Sell",        icon: "send"         as const },
            { label: "Withdraw",    icon: "download"     as const },
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
            <TouchableOpacity
              onPress={() => { Haptics.selectionAsync(); router.push("/(tabs)/send" as any); }}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={styles.txSeeAll}>See All</Text>
            </TouchableOpacity>
          </View>

          {rows.map((row) => (
            <TouchableOpacity
              key={row.id}
              style={styles.txRow}
              onPress={() => openSheet(row)}
              activeOpacity={0.68}
            >
              <View style={styles.txLeft}>
                <View style={styles.txIconWrap}>
                  <Feather name={row.icon as any} size={14} color={TEXT_DARK} />
                </View>
                <View style={styles.txInfo}>
                  <Text style={styles.txName}>{row.name}</Text>
                  <Text style={styles.txDate}>{row.date}</Text>
                </View>
              </View>
              <View style={styles.txRight}>
                <Text style={[styles.txAmount, { color: row.isPositive ? GREEN : RED }]}>
                  {row.amount}
                </Text>
                <Feather name="chevron-right" size={14} color={TEXT_LIGHT} />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* ── Transaction Detail Bottom Sheet ── */}
      <TransactionDetailSheet
        tx={selectedTx}
        sheetY={sheetY}
        backdropOpacity={backdropOpacity}
        onClose={closeSheet}
      />
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: WHITE },
  scroll: { flex: 1, backgroundColor: WHITE },

  logoRow: { alignItems: "center", paddingVertical: 14 },
  logoText: { fontFamily: "Inter_700Bold", fontSize: 22, letterSpacing: 4, color: TEXT_DARK },

  greetingRow: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    paddingHorizontal: 24, marginBottom: 20,
  },
  greetingLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  avatarCircle: { width: 52, height: 52, borderRadius: 26, alignItems: "center", justifyContent: "center" },
  avatarInitial: { fontFamily: "Inter_700Bold", fontSize: 20, color: WHITE, lineHeight: 24 },
  greetingTexts: { gap: 2 },
  greetingName: { fontFamily: "Inter_700Bold", fontSize: 16, color: TEXT_DARK, lineHeight: 22 },
  greetingSub: { fontFamily: "Inter_400Regular", fontSize: 12, color: TEXT_GRAY, lineHeight: 18 },
  balanceRight: { alignItems: "flex-end", gap: 4 },
  eyeBtn: { padding: 2 },
  balanceAmount: { fontFamily: "Inter_700Bold", fontSize: 18, color: TEXT_DARK, letterSpacing: -0.3 },

  actionBar: {
    marginHorizontal: 21, backgroundColor: BLACK, borderRadius: 14,
    flexDirection: "row", marginBottom: 28, overflow: "hidden",
  },
  actionItem: { flex: 1, alignItems: "center", justifyContent: "center", paddingVertical: 14, gap: 6 },
  actionBorder: { borderRightWidth: StyleSheet.hairlineWidth, borderRightColor: "rgba(255,255,255,0.15)" },
  actionIconWrap: { width: 34, height: 34, borderRadius: 17, alignItems: "center", justifyContent: "center" },
  actionLabel: { fontFamily: "Inter_500Medium", fontSize: 11.5, color: WHITE, textAlign: "center", letterSpacing: 0.1 },

  quickGrid: { flexDirection: "row", flexWrap: "wrap", paddingHorizontal: 21, marginBottom: 24, rowGap: 20 },
  quickItem: { width: "25%", alignItems: "center", gap: 8 },
  quickIconWrap: { width: 44, height: 44, borderRadius: 12, alignItems: "center", justifyContent: "center", backgroundColor: "#F7F7F8" },
  quickLabel: { fontFamily: "Inter_500Medium", fontSize: 10.5, color: TEXT_GRAY, textAlign: "center", lineHeight: 14 },

  promoScroll: { paddingLeft: 21, paddingRight: 9, gap: 12, marginBottom: 28 },
  promoCard: { width: 263, borderRadius: 10, padding: 18, justifyContent: "flex-end", minHeight: 100, gap: 4 },
  promoPct: { fontFamily: "Inter_700Bold", fontSize: 20, color: TEXT_DARK, lineHeight: 26 },
  promoTitle: { fontFamily: "Inter_600SemiBold", fontSize: 13.5, color: TEXT_DARK, lineHeight: 18 },
  promoDesc: { fontFamily: "Inter_400Regular", fontSize: 11, color: TEXT_GRAY, lineHeight: 16 },

  txSection: { paddingHorizontal: 21, gap: 12 },
  txHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  txHeading: { fontFamily: "Inter_600SemiBold", fontSize: 18, color: TEXT_DARK, lineHeight: 23 },
  txSeeAll: { fontFamily: "Inter_600SemiBold", fontSize: 12.5, color: BLACK, textAlign: "right" },
  txRow: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingVertical: 12, minHeight: 52, backgroundColor: WHITE, borderRadius: 4,
  },
  txLeft: { flexDirection: "row", alignItems: "center", gap: 12, flex: 1 },
  txIconWrap: { width: 28, height: 28, borderRadius: 6, backgroundColor: "#F0F0F2", alignItems: "center", justifyContent: "center" },
  txInfo: { gap: 2, flex: 1 },
  txName: { fontFamily: "Inter_600SemiBold", fontSize: 12.5, color: TEXT_GRAY, lineHeight: 19 },
  txDate: { fontFamily: "Inter_500Medium", fontSize: 11, color: TEXT_LIGHT, lineHeight: 17 },
  txRight: { flexDirection: "row", alignItems: "center", gap: 4 },
  txAmount: { fontFamily: "Inter_700Bold", fontSize: 12.5, lineHeight: 19, textAlign: "right" },
});

// ── Sheet styles (dark system) ────────────────────────────────
const sheetStyles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.68)",
  },
  sheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: SHEET_HEIGHT,
    backgroundColor: SHEET_BG,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingBottom: 32,
    paddingTop: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 24,
  },
  handle: {
    alignSelf: "center",
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.18)",
    marginBottom: 16,
  },
  sheetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  sheetTitle: { fontFamily: "Inter_600SemiBold", fontSize: 16, color: SHEET_VALUE },
  closeBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },

  amountHero: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: SHEET_CARD,
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: SHEET_BORDER,
  },
  txTypeChip: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  amountBlock: { flex: 1 },
  heroAmount: { fontFamily: "Inter_700Bold", fontSize: 22, letterSpacing: -0.5 },
  heroName: { fontFamily: "Inter_400Regular", fontSize: 13, color: SHEET_LABEL, marginTop: 2 },

  divider: { height: StyleSheet.hairlineWidth, backgroundColor: SHEET_BORDER, marginBottom: 14 },

  detailsBlock: { gap: 14 },
  detailRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  statusRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  detailLabel: { fontFamily: "Inter_400Regular", fontSize: 13, color: SHEET_LABEL, flex: 1 },
  detailValue: { fontFamily: "Inter_500Medium", fontSize: 13, color: SHEET_VALUE, textAlign: "right", flex: 2 },
  mono: { fontFamily: "Inter_600SemiBold", fontSize: 12, letterSpacing: 0.5, color: "rgba(255,255,255,0.7)" },

  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusText: { fontFamily: "Inter_600SemiBold", fontSize: 12 },

  ctaBtn: {
    position: "absolute",
    bottom: 32,
    left: 24,
    right: 24,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
  ctaText: { fontFamily: "Inter_600SemiBold", fontSize: 15, color: SHEET_VALUE },
});
