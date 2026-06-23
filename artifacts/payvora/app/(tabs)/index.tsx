import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  Modal,
  NativeScrollEvent,
  NativeSyntheticEvent,
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

const { width: SCREEN_W } = Dimensions.get("window");
const CARD_W = SCREEN_W - 48;

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

const SHEET_BG = "#0E0E1A";
const SHEET_CARD = "#181825";
const SHEET_BORDER = "rgba(255,255,255,0.07)";
const SHEET_LABEL = "rgba(255,255,255,0.42)";
const SHEET_VALUE = "#FFFFFF";
const ACCENT_GREEN = "#00D9A0";
const ACCENT_RED = "#F87171";

// ── Virtual cards ─────────────────────────────────────────────
const VIRTUAL_CARDS = [
  {
    id: "1",
    gradient: ["#1a1a2e", "#16213e"] as [string, string],
    accent: "#BCE2FE",
    label: "PAYVORA",
    number: "•••• •••• •••• 4287",
    scheme: "VISA",
  },
  {
    id: "2",
    gradient: ["#0d1b2a", "#1b263b"] as [string, string],
    accent: "#D6E1FF",
    label: "PAYVORA",
    number: "•••• •••• •••• 8154",
    scheme: "MASTERCARD",
  },
  {
    id: "3",
    gradient: ["#1e1b4b", "#312e81"] as [string, string],
    accent: "#FFF2CF",
    label: "PAYVORA",
    number: "•••• •••• •••• 6039",
    scheme: "VERVE",
  },
];

// ── Quick Actions ─────────────────────────────────────────────
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
    icon: "gift",
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
    icon: tx.amount > 0 ? "arrow-down-circle" : "arrow-up-circle",
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

// ── Card Carousel ─────────────────────────────────────────────
function CardCarousel({ balanceVisible, balance }: { balanceVisible: boolean; balance: number }) {
  const [activeIdx, setActiveIdx] = useState(0);

  function onScroll(e: NativeSyntheticEvent<NativeScrollEvent>) {
    const idx = Math.round(e.nativeEvent.contentOffset.x / CARD_W);
    setActiveIdx(idx);
  }

  const displayBalance = balanceVisible
    ? `₦${(balance * 1550).toLocaleString("en-NG", { minimumFractionDigits: 2 })}`
    : "••••••••";

  return (
    <View style={carouselStyles.wrapper}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_W + 16}
        snapToAlignment="start"
        decelerationRate="fast"
        contentContainerStyle={{ paddingHorizontal: 24, gap: 16 }}
        onMomentumScrollEnd={onScroll}
      >
        {VIRTUAL_CARDS.map((card, i) => (
          <LinearGradient
            key={card.id}
            colors={card.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[carouselStyles.card, { width: CARD_W }]}
          >
            {/* Decorative circle */}
            <View style={[carouselStyles.decorCircle, { borderColor: card.accent + "30" }]} />
            <View style={[carouselStyles.decorCircle2, { borderColor: card.accent + "20" }]} />

            {/* Top row */}
            <View style={carouselStyles.cardTop}>
              <Text style={carouselStyles.cardLabel}>{card.label}</Text>
              <View style={[carouselStyles.schemeBadge, { borderColor: card.accent + "40" }]}>
                <Text style={[carouselStyles.schemeText, { color: card.accent }]}>{card.scheme}</Text>
              </View>
            </View>

            {/* Balance */}
            <View style={carouselStyles.cardBalanceRow}>
              <Text style={carouselStyles.cardBalLabel}>Available Balance</Text>
              {i === 0 && (
                <Text style={[carouselStyles.cardBalance, { color: card.accent }]}>{displayBalance}</Text>
              )}
            </View>

            {/* Card number */}
            <Text style={[carouselStyles.cardNumber, { color: card.accent + "CC" }]}>{card.number}</Text>

            {/* Chip decoration */}
            <View style={[carouselStyles.chip, { borderColor: card.accent + "40" }]}>
              <View style={[carouselStyles.chipInner, { backgroundColor: card.accent + "30" }]} />
            </View>
          </LinearGradient>
        ))}
      </ScrollView>

      {/* Dots */}
      <View style={carouselStyles.dots}>
        {VIRTUAL_CARDS.map((_, i) => (
          <View
            key={i}
            style={[
              carouselStyles.dot,
              { backgroundColor: i === activeIdx ? TEXT_DARK : TEXT_LIGHT, width: i === activeIdx ? 20 : 6 },
            ]}
          />
        ))}
      </View>
    </View>
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
      <Animated.View style={[sheetStyles.backdrop, { opacity: backdropOpacity }]}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={StyleSheet.absoluteFill} />
        </TouchableWithoutFeedback>
      </Animated.View>

      <Animated.View style={[sheetStyles.sheet, { transform: [{ translateY: sheetY }] }]}>
        <View style={sheetStyles.handle} />

        <View style={sheetStyles.sheetHeader}>
          <Text style={sheetStyles.sheetTitle}>Transaction Details</Text>
          <TouchableOpacity onPress={onClose} style={sheetStyles.closeBtn} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
            <Feather name="x" size={18} color="rgba(255,255,255,0.6)" />
          </TouchableOpacity>
        </View>

        <View style={sheetStyles.amountHero}>
          <View style={[sheetStyles.txTypeChip, { backgroundColor: amountColor + "18" }]}>
            <Feather name={tx.isPositive ? "arrow-down-left" : "arrow-up-right"} size={15} color={amountColor} />
          </View>
          <View style={sheetStyles.amountBlock}>
            <Text style={[sheetStyles.heroAmount, { color: amountColor }]}>{tx.amount}</Text>
            <Text style={sheetStyles.heroName}>{tx.name}</Text>
          </View>
        </View>

        <View style={sheetStyles.divider} />

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

  const scaleAnim       = useRef(new Animated.Value(1)).current;
  const sheetY          = useRef(new Animated.Value(SHEET_HEIGHT)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  const firstName = user?.name?.split(" ")[0] ?? "Dove";
  const initial   = firstName.charAt(0).toUpperCase();

  const rows: FullTxRow[] =
    transactions.length > 0
      ? transactions.slice(0, 2).map(txFromWallet)
      : STATIC_TXS;

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
    if (label === "Fund Wallet") router.push("/fund-wallet" as any);
    if (label === "Sell")        router.push("/sell-gift-card" as any);
    if (label === "Withdraw")    router.push("/(tabs)/send" as any);
  }

  async function handleQuick(key: string) {
    await Haptics.selectionAsync();
    if (key === "gift")        router.push("/gift-card" as any);
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
        {/* ── Top Bar ── */}
        <View style={styles.topBar}>
          <View style={styles.greetingLeft}>
            <LinearGradient
              colors={["#BCE2FE", "#D8B4FE"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.avatarCircle}
            >
              <Text style={styles.avatarInitial}>{initial}</Text>
            </LinearGradient>
            <View>
              <Text style={styles.greetingName}>Hi, {firstName} 👋</Text>
              <Text style={styles.greetingSub}>Welcome back</Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={handleEyeToggle}
            style={styles.eyeBtn}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Feather name={balanceVisible ? "eye" : "eye-off"} size={22} color={TEXT_GRAY} />
          </TouchableOpacity>
        </View>

        {/* ── Card Carousel ── */}
        <CardCarousel balanceVisible={balanceVisible} balance={balance} />

        {/* ── Action Bar ── */}
        <View style={styles.actionBar}>
          {[
            { label: "Fund Wallet", icon: "plus-circle" as const },
            { label: "Sell",        icon: "tag"          as const },
            { label: "Withdraw",    icon: "download"     as const },
          ].map((action, i) => (
            <TouchableOpacity
              key={action.label}
              style={[styles.actionItem, i < 2 && styles.actionBorder]}
              onPress={() => handleAction(action.label)}
              activeOpacity={0.6}
            >
              <View style={styles.actionIconWrap}>
                <Feather name={action.icon} size={20} color={WHITE} />
              </View>
              <Text style={styles.actionLabel}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Quick Actions Grid ── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
        </View>
        <View style={styles.quickGrid}>
          {QUICK_ACTIONS.map((item) => (
            <TouchableOpacity
              key={item.key}
              style={styles.quickItem}
              onPress={() => handleQuick(item.key)}
              activeOpacity={0.65}
            >
              <View style={styles.quickIconWrap}>
                <Feather name={item.icon as any} size={20} color={TEXT_DARK} />
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
          snapToInterval={270}
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

        {/* ── Recent Transactions ── */}
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
                <View style={[styles.txIconWrap, { backgroundColor: row.isPositive ? "#E8F8EE" : "#FEF2F2" }]}>
                  <Feather name={row.icon as any} size={15} color={row.isPositive ? GREEN : RED} />
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

      <TransactionDetailSheet
        tx={selectedTx}
        sheetY={sheetY}
        backdropOpacity={backdropOpacity}
        onClose={closeSheet}
      />
    </View>
  );
}

// ── Carousel Styles ───────────────────────────────────────────
const carouselStyles = StyleSheet.create({
  wrapper: { marginBottom: 24 },
  card: {
    height: 180,
    borderRadius: 20,
    padding: 24,
    overflow: "hidden",
    position: "relative",
    justifyContent: "space-between",
  },
  decorCircle: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 1,
    top: -60,
    right: -60,
  },
  decorCircle2: {
    position: "absolute",
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 1,
    bottom: -40,
    left: -30,
  },
  cardTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  cardLabel: { fontFamily: "Inter_700Bold", fontSize: 16, color: WHITE, letterSpacing: 3 },
  schemeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
  },
  schemeText: { fontFamily: "Inter_600SemiBold", fontSize: 10, letterSpacing: 1 },
  cardBalanceRow: { gap: 4 },
  cardBalLabel: { fontFamily: "Inter_400Regular", fontSize: 11, color: "rgba(255,255,255,0.5)", letterSpacing: 0.3 },
  cardBalance: { fontFamily: "Inter_700Bold", fontSize: 22, letterSpacing: -0.5 },
  cardNumber: { fontFamily: "Inter_500Medium", fontSize: 14, letterSpacing: 3 },
  chip: {
    position: "absolute",
    width: 36,
    height: 28,
    borderRadius: 5,
    borderWidth: 1,
    bottom: 24,
    left: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  chipInner: { width: 24, height: 18, borderRadius: 3 },
  dots: { flexDirection: "row", justifyContent: "center", gap: 6, marginTop: 14 },
  dot: { height: 6, borderRadius: 3, backgroundColor: TEXT_LIGHT },
});

// ── Screen Styles ─────────────────────────────────────────────
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: WHITE },
  scroll: { flex: 1, backgroundColor: WHITE },

  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  greetingLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  avatarCircle: { width: 46, height: 46, borderRadius: 23, alignItems: "center", justifyContent: "center" },
  avatarInitial: { fontFamily: "Inter_700Bold", fontSize: 18, color: WHITE },
  greetingName: { fontFamily: "Inter_700Bold", fontSize: 15, color: TEXT_DARK, lineHeight: 22 },
  greetingSub: { fontFamily: "Inter_400Regular", fontSize: 12, color: TEXT_GRAY, lineHeight: 18 },
  eyeBtn: { padding: 4 },

  actionBar: {
    marginHorizontal: 24,
    backgroundColor: BLACK,
    borderRadius: 16,
    flexDirection: "row",
    marginBottom: 28,
    overflow: "hidden",
  },
  actionItem: { flex: 1, alignItems: "center", justifyContent: "center", paddingVertical: 16, gap: 7 },
  actionBorder: { borderRightWidth: StyleSheet.hairlineWidth, borderRightColor: "rgba(255,255,255,0.15)" },
  actionIconWrap: { width: 36, height: 36, borderRadius: 18, backgroundColor: "rgba(255,255,255,0.1)", alignItems: "center", justifyContent: "center" },
  actionLabel: { fontFamily: "Inter_500Medium", fontSize: 11, color: WHITE, textAlign: "center" },

  sectionHeader: { paddingHorizontal: 24, marginBottom: 14 },
  sectionTitle: { fontFamily: "Inter_600SemiBold", fontSize: 15, color: TEXT_DARK },

  quickGrid: { flexDirection: "row", flexWrap: "wrap", paddingHorizontal: 16, marginBottom: 28, rowGap: 20 },
  quickItem: { width: "25%", alignItems: "center", gap: 8 },
  quickIconWrap: {
    width: 46, height: 46, borderRadius: 14,
    alignItems: "center", justifyContent: "center",
    backgroundColor: "#F5F5F7",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  quickLabel: { fontFamily: "Inter_500Medium", fontSize: 10, color: TEXT_GRAY, textAlign: "center", lineHeight: 14 },

  promoScroll: { paddingLeft: 24, paddingRight: 8, gap: 12, marginBottom: 28 },
  promoCard: { width: 260, borderRadius: 10, padding: 18, minHeight: 100, gap: 4, justifyContent: "flex-end" },
  promoPct: { fontFamily: "Inter_700Bold", fontSize: 20, color: TEXT_DARK },
  promoTitle: { fontFamily: "Inter_600SemiBold", fontSize: 13, color: TEXT_DARK },
  promoDesc: { fontFamily: "Inter_400Regular", fontSize: 10.5, color: TEXT_GRAY, lineHeight: 16 },

  txSection: { paddingHorizontal: 24, gap: 4 },
  txHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  txHeading: { fontFamily: "Inter_600SemiBold", fontSize: 16, color: TEXT_DARK },
  txSeeAll: { fontFamily: "Inter_600SemiBold", fontSize: 12, color: BLACK },
  txRow: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingVertical: 13, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: "#F0F0F2",
  },
  txLeft: { flexDirection: "row", alignItems: "center", gap: 12, flex: 1 },
  txIconWrap: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  txInfo: { gap: 3, flex: 1 },
  txName: { fontFamily: "Inter_600SemiBold", fontSize: 13, color: TEXT_GRAY },
  txDate: { fontFamily: "Inter_400Regular", fontSize: 11, color: TEXT_LIGHT },
  txRight: { flexDirection: "row", alignItems: "center", gap: 4 },
  txAmount: { fontFamily: "Inter_700Bold", fontSize: 13, textAlign: "right" },
});

// ── Sheet Styles ──────────────────────────────────────────────
const sheetStyles = StyleSheet.create({
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.68)" },
  sheet: {
    position: "absolute",
    bottom: 0, left: 0, right: 0,
    height: SHEET_HEIGHT,
    backgroundColor: SHEET_BG,
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    paddingHorizontal: 24, paddingBottom: 32, paddingTop: 12,
  },
  handle: { alignSelf: "center", width: 40, height: 4, borderRadius: 2, backgroundColor: "rgba(255,255,255,0.18)", marginBottom: 16 },
  sheetHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  sheetTitle: { fontFamily: "Inter_600SemiBold", fontSize: 16, color: SHEET_VALUE },
  closeBtn: { width: 30, height: 30, borderRadius: 15, backgroundColor: "rgba(255,255,255,0.08)", alignItems: "center", justifyContent: "center" },
  amountHero: {
    flexDirection: "row", alignItems: "center", gap: 14,
    backgroundColor: SHEET_CARD, borderRadius: 14, padding: 16, marginBottom: 16,
    borderWidth: 1, borderColor: SHEET_BORDER,
  },
  txTypeChip: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  amountBlock: { flex: 1 },
  heroAmount: { fontFamily: "Inter_700Bold", fontSize: 22, letterSpacing: -0.5 },
  heroName: { fontFamily: "Inter_500Medium", fontSize: 13, color: SHEET_LABEL, marginTop: 2 },
  divider: { height: 1, backgroundColor: SHEET_BORDER, marginBottom: 16 },
  detailsBlock: { gap: 12, flex: 1 },
  detailRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  detailLabel: { fontFamily: "Inter_400Regular", fontSize: 13, color: SHEET_LABEL },
  detailValue: { fontFamily: "Inter_600SemiBold", fontSize: 13, color: SHEET_VALUE, maxWidth: "60%", textAlign: "right" },
  mono: { fontFamily: "Inter_400Regular", fontSize: 11, letterSpacing: 0.5 },
  statusRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  statusPill: { flexDirection: "row", alignItems: "center", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  statusText: { fontFamily: "Inter_600SemiBold", fontSize: 12 },
  ctaBtn: { height: 50, backgroundColor: "#1E1E2C", borderRadius: 14, alignItems: "center", justifyContent: "center", marginTop: 8 },
  ctaText: { fontFamily: "Inter_600SemiBold", fontSize: 16, color: WHITE },
});
