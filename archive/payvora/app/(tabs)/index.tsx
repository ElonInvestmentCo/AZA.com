import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Animated as RNAnimated,
  Dimensions,
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
import { Circle, Path, Svg } from "react-native-svg";
import { useAuth } from "@/context/AuthContext";
import { useWallet, Transaction } from "@/context/WalletContext";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedProps,
  useDerivedValue,
  withSpring,
  withTiming,
  interpolate,
  Extrapolation,
  runOnJS,
  type SharedValue,
} from "react-native-reanimated";

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");
const CARD_W = SCREEN_W - 48;

/* ── Morph System Constants ───────────────────────────────────── */
const MORPH_THRESHOLD = SCREEN_H * 0.38;
const MORPH_FULL      = SCREEN_H + 20;

/* ── SVG Animated Components ─────────────────────────────────── */
const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedPath   = Animated.createAnimatedComponent(Path);

/* ── Home Palette ─────────────────────────────────────────────── */
const WHITE        = "#FFFFFF";
const BLACK        = "#000000";
const TEXT_DARK    = "#0B0A0A";
const TEXT_GRAY    = "#595F67";
const TEXT_LIGHT   = "#AAAFB5";
const GREEN        = "#00B03C";
const RED          = "#FF0000";
const PROMO_PINK   = "#FCB3C5";
const PROMO_YELLOW = "#FFF2CF";
const PROMO_BLUE   = "#D6E1FF";

const SHEET_BG      = "#0E0E1A";
const SHEET_CARD    = "#181825";
const SHEET_BORDER  = "rgba(255,255,255,0.07)";
const SHEET_LABEL   = "rgba(255,255,255,0.42)";
const SHEET_VALUE   = "#FFFFFF";
const ACCENT_GREEN  = "#00D9A0";
const ACCENT_RED    = "#F87171";

/* ── Wallet Intelligence Palette ─────────────────────────────── */
const WI_BG     = "#0A0A0F";
const WI_CARD   = "#12121A";
const WI_BORDER = "rgba(255,255,255,0.08)";
const WI_LABEL  = "rgba(255,255,255,0.38)";
const WI_PURPLE = "#8B5CF6";
const WI_AMBER  = "#F59E0B";

/* ── Static Data ─────────────────────────────────────────────── */
const VIRTUAL_CARDS = [
  { id: "1", gradient: ["#1a1a2e", "#16213e"] as [string, string], accent: "#BCE2FE", label: "PAYVORA", number: "•••• •••• •••• 4287", scheme: "VISA" },
  { id: "2", gradient: ["#0d1b2a", "#1b263b"] as [string, string], accent: "#D6E1FF", label: "PAYVORA", number: "•••• •••• •••• 8154", scheme: "MASTERCARD" },
  { id: "3", gradient: ["#1e1b4b", "#312e81"] as [string, string], accent: "#FFF2CF", label: "PAYVORA", number: "•••• •••• •••• 6039", scheme: "VERVE" },
];

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

/* ── WI Layer Data ───────────────────────────────────────────── */
const SPEND_CATEGORIES = [
  { label: "Shopping", color: ACCENT_GREEN },
  { label: "Travel",   color: WI_PURPLE },
  { label: "Bills",    color: WI_AMBER },
];

const WEEKLY_DATA = [
  { day: "M", inflow: 68, outflow: 42 },
  { day: "T", inflow: 45, outflow: 72 },
  { day: "W", inflow: 82, outflow: 38 },
  { day: "T", inflow: 55, outflow: 60 },
  { day: "F", inflow: 73, outflow: 48 },
  { day: "S", inflow: 38, outflow: 25 },
  { day: "S", inflow: 20, outflow: 15 },
];

/* ── Types ───────────────────────────────────────────────────── */
interface FullTxRow {
  id: string; icon: string; name: string; date: string; amount: string;
  isPositive: boolean; type: string; status: "completed" | "pending" | "failed";
  reference: string; rawAmount: number; currency: string; timestamp: string; note: string;
}

const STATIC_TXS: FullTxRow[] = [
  { id: "s1", icon: "gift",       name: "Deposit Giftcard", date: "February 24, 2022", amount: "+₦20,040.00", isPositive: true,  type: "Gift Card Deposit", status: "completed", reference: "PAY-20220224-GC-0041", rawAmount: 20040,  currency: "NGN", timestamp: "February 24, 2022 · 09:45 AM", note: "Gift card top-up" },
  { id: "s2", icon: "arrow-down", name: "Withdraws",        date: "February 24, 2022", amount: "-₦400,000.00", isPositive: false, type: "Bank Withdrawal",  status: "completed", reference: "PAY-20220224-WD-0098", rawAmount: 400000, currency: "NGN", timestamp: "February 24, 2022 · 02:17 PM", note: "Withdrawal to bank account" },
];

function txFromWallet(tx: Transaction): FullTxRow {
  const naira = Math.abs(tx.amount * 1550);
  return {
    id: tx.id, icon: tx.amount > 0 ? "arrow-down-circle" : "arrow-up-circle",
    name: tx.title,
    date: new Date(tx.timestamp).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
    amount: (tx.amount > 0 ? "+" : "-") + "₦" + naira.toLocaleString("en-NG", { minimumFractionDigits: 2 }),
    isPositive: tx.amount > 0,
    type: tx.type === "receive" ? "Deposit" : tx.type === "send" ? "Transfer" : tx.type === "trade" ? "Trade" : "Top-up",
    status: tx.status, reference: `PAY-${tx.id.padStart(8, "0")}`,
    rawAmount: naira, currency: "NGN",
    timestamp: new Date(tx.timestamp).toLocaleString("en-US", { month: "long", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" }),
    note: tx.subtitle,
  };
}

/* ── Card Carousel ───────────────────────────────────────────── */
function CardCarousel({ balanceVisible, balance }: { balanceVisible: boolean; balance: number }) {
  const [activeIdx, setActiveIdx] = useState(0);

  function onScroll(e: NativeSyntheticEvent<NativeScrollEvent>) {
    setActiveIdx(Math.round(e.nativeEvent.contentOffset.x / CARD_W));
  }

  const displayBalance = balanceVisible
    ? `₦${(balance * 1550).toLocaleString("en-NG", { minimumFractionDigits: 2 })}`
    : "••••••••";

  return (
    <View style={carouselStyles.wrapper}>
      <ScrollView
        horizontal pagingEnabled showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_W + 16} snapToAlignment="start" decelerationRate="fast"
        contentContainerStyle={{ paddingHorizontal: 24, gap: 16 }}
        onMomentumScrollEnd={onScroll}
      >
        {VIRTUAL_CARDS.map((card, i) => (
          <LinearGradient key={card.id} colors={card.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[carouselStyles.card, { width: CARD_W }]}>
            <View style={[carouselStyles.decorCircle, { borderColor: card.accent + "30" }]} />
            <View style={[carouselStyles.decorCircle2, { borderColor: card.accent + "20" }]} />
            <View style={carouselStyles.cardTop}>
              <Text style={carouselStyles.cardLabel}>{card.label}</Text>
              <View style={[carouselStyles.schemeBadge, { borderColor: card.accent + "40" }]}>
                <Text style={[carouselStyles.schemeText, { color: card.accent }]}>{card.scheme}</Text>
              </View>
            </View>
            <View style={carouselStyles.cardBalanceRow}>
              <Text style={carouselStyles.cardBalLabel}>Available Balance</Text>
              {i === 0 && <Text style={[carouselStyles.cardBalance, { color: card.accent }]}>{displayBalance}</Text>}
            </View>
            <Text style={[carouselStyles.cardNumber, { color: card.accent + "CC" }]}>{card.number}</Text>
            <View style={[carouselStyles.chip, { borderColor: card.accent + "40" }]}>
              <View style={[carouselStyles.chipInner, { backgroundColor: card.accent + "30" }]} />
            </View>
          </LinearGradient>
        ))}
      </ScrollView>
      <View style={carouselStyles.dots}>
        {VIRTUAL_CARDS.map((_, i) => (
          <View key={i} style={[carouselStyles.dot, { backgroundColor: i === activeIdx ? TEXT_DARK : TEXT_LIGHT, width: i === activeIdx ? 20 : 6 }]} />
        ))}
      </View>
    </View>
  );
}

/* ── Transaction Sheet ───────────────────────────────────────── */
const SHEET_HEIGHT = 460;

function StatusPill({ status }: { status: FullTxRow["status"] }) {
  const map = { completed: { bg: "#00D9A018", text: ACCENT_GREEN, label: "Completed", dot: "●" }, pending: { bg: "#F59E0B18", text: "#F59E0B", label: "Pending", dot: "○" }, failed: { bg: "#F8717118", text: ACCENT_RED, label: "Failed", dot: "✕" } };
  const s = map[status] ?? map.completed;
  return <View style={[sheetStyles.statusPill, { backgroundColor: s.bg }]}><Text style={[sheetStyles.statusText, { color: s.text }]}>{s.dot}  {s.label}</Text></View>;
}

function DetailRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <View style={sheetStyles.detailRow}>
      <Text style={sheetStyles.detailLabel}>{label}</Text>
      <Text style={[sheetStyles.detailValue, mono && sheetStyles.mono]} numberOfLines={1} adjustsFontSizeToFit>{value}</Text>
    </View>
  );
}

function TransactionDetailSheet({ tx, sheetY, backdropOpacity, onClose }: { tx: FullTxRow | null; sheetY: RNAnimated.Value; backdropOpacity: RNAnimated.Value; onClose: () => void }) {
  if (!tx) return null;
  const amountColor = tx.isPositive ? ACCENT_GREEN : ACCENT_RED;
  return (
    <Modal transparent animationType="none" visible statusBarTranslucent onRequestClose={onClose}>
      <RNAnimated.View style={[sheetStyles.backdrop, { opacity: backdropOpacity }]}>
        <TouchableWithoutFeedback onPress={onClose}><View style={StyleSheet.absoluteFill} /></TouchableWithoutFeedback>
      </RNAnimated.View>
      <RNAnimated.View style={[sheetStyles.sheet, { transform: [{ translateY: sheetY }] }]}>
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
          <DetailRow label="Type"        value={tx.type}      />
          <DetailRow label="Date & Time" value={tx.timestamp} />
          <DetailRow label="Currency"    value={tx.currency}  />
          <View style={sheetStyles.statusRow}>
            <Text style={sheetStyles.detailLabel}>Status</Text>
            <StatusPill status={tx.status} />
          </View>
          <DetailRow label="Reference" value={tx.reference} mono />
          {tx.note ? <DetailRow label="Note" value={tx.note} /> : null}
        </View>
        <TouchableOpacity style={sheetStyles.ctaBtn} onPress={() => { Haptics.selectionAsync(); onClose(); }} activeOpacity={0.78}>
          <Text style={sheetStyles.ctaText}>Done</Text>
        </TouchableOpacity>
      </RNAnimated.View>
    </Modal>
  );
}

/* ── Weekly Bar ──────────────────────────────────────────────── */
const BAR_MAX_H = 52;

function WeeklyBar({ data, progress, index }: { data: typeof WEEKLY_DATA[0]; progress: SharedValue<number>; index: number }) {
  const delay = index * 0.07;

  const inflowStyle = useAnimatedStyle(() => {
    const raw = Math.max(0, (progress.value - delay) / Math.max(0.01, 1 - delay));
    const p = Math.min(1, raw);
    return { height: p * (data.inflow / 100) * BAR_MAX_H };
  });

  const outflowStyle = useAnimatedStyle(() => {
    const raw = Math.max(0, (progress.value - delay) / Math.max(0.01, 1 - delay));
    const p = Math.min(1, raw);
    return { height: p * (data.outflow / 100) * BAR_MAX_H };
  });

  return (
    <View style={wiStyles.barGroup}>
      <View style={wiStyles.barPair}>
        <View style={[wiStyles.barTrack, { height: BAR_MAX_H }]}>
          <Animated.View style={[wiStyles.barFill, { backgroundColor: ACCENT_GREEN }, inflowStyle]} />
        </View>
        <View style={[wiStyles.barTrack, { height: BAR_MAX_H }]}>
          <Animated.View style={[wiStyles.barFill, { backgroundColor: ACCENT_RED }, outflowStyle]} />
        </View>
      </View>
      <Text style={wiStyles.barDay}>{data.day}</Text>
    </View>
  );
}

/* ── Wallet Intelligence Layer ───────────────────────────────── */
function WalletIntelligenceLayer({
  progress,
  balance,
  dismissGesture,
  topInset,
}: {
  progress:        SharedValue<number>;
  balance:         number;
  dismissGesture:  ReturnType<typeof Gesture.Pan>;
  topInset:        number;
}) {
  /* ── Donut ── */
  const r    = 52;
  const circ = 2 * Math.PI * r;

  const donutProps = useAnimatedProps(() => ({
    strokeDashoffset: interpolate(progress.value, [0, 1], [circ, circ * (1 - 0.72)], Extrapolation.CLAMP),
  }));

  /* ── Pulse line ── */
  const PULSE_LEN = 310;
  const pulseProps = useAnimatedProps(() => ({
    strokeDashoffset: interpolate(progress.value, [0.35, 1], [PULSE_LEN, 0], Extrapolation.CLAMP),
  }));

  /* ── Derived bars progress ── */
  const barsProgress = useDerivedValue(() =>
    interpolate(progress.value, [0.18, 0.78], [0, 1], Extrapolation.CLAMP)
  );

  /* ── Layer master opacity ── */
  const layerStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 0.2], [0, 1], Extrapolation.CLAMP),
  }));

  /* ── Header + balance ── */
  const headStyle = useAnimatedStyle(() => ({
    opacity:   interpolate(progress.value, [0.05, 0.4], [0, 1], Extrapolation.CLAMP),
    transform: [{ translateY: interpolate(progress.value, [0.05, 0.4], [18, 0], Extrapolation.CLAMP) }],
  }));

  /* ── Charts row ── */
  const chartsStyle = useAnimatedStyle(() => ({
    opacity:   interpolate(progress.value, [0.28, 0.7], [0, 1], Extrapolation.CLAMP),
    transform: [{ translateY: interpolate(progress.value, [0.28, 0.7], [28, 0], Extrapolation.CLAMP) }],
  }));

  /* ── Dismiss handle ── */
  const handleStyle = useAnimatedStyle(() => ({
    opacity:   interpolate(progress.value, [0.72, 1], [0, 1], Extrapolation.CLAMP),
    transform: [{ translateY: interpolate(progress.value, [0.72, 1], [16, 0], Extrapolation.CLAMP) }],
  }));

  const balanceDisplay = `₦${(balance * 1550).toLocaleString("en-NG", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  const pulseW = SCREEN_W - 64;
  const pulsePath = `M0,25 L28,25 L33,25 L38,5 L43,45 L48,25 L68,25 L73,7 L78,43 L83,25 L108,25 L113,5 L118,45 L123,25 L${pulseW},25`;

  return (
    <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: WI_BG }, layerStyle]} pointerEvents="box-none">
      <View style={[wiStyles.layer, { paddingTop: topInset + 16 }]}>

        {/* ── Header ── */}
        <Animated.View style={[wiStyles.header, headStyle]}>
          <View style={wiStyles.headerLeft}>
            <View style={wiStyles.headerDot} />
            <Text style={wiStyles.headerTitle}>Wallet Intelligence</Text>
          </View>
          <View style={wiStyles.activeBadge}>
            <Text style={wiStyles.activeBadgeText}>ACTIVE</Text>
          </View>
        </Animated.View>

        {/* ── Balance ── */}
        <Animated.View style={[wiStyles.balanceBlock, headStyle]}>
          <Text style={wiStyles.balanceSub}>Total Balance</Text>
          <Text style={wiStyles.balanceAmt}>{balanceDisplay}</Text>
          <View style={wiStyles.growthRow}>
            <View style={wiStyles.growthDot} />
            <Text style={wiStyles.growthText}>All cards combined · Growing</Text>
          </View>
        </Animated.View>

        <View style={wiStyles.sectionDivider} />

        {/* ── Spending Donut + Cashback Cards ── */}
        <Animated.View style={[wiStyles.row, chartsStyle]}>

          {/* Donut */}
          <View style={wiStyles.donutCard}>
            <Text style={wiStyles.sectionLabel}>Spending</Text>
            <View style={wiStyles.donutWrap}>
              <Svg width={120} height={120} viewBox="0 0 120 120">
                <Circle cx="60" cy="60" r={r} stroke="rgba(255,255,255,0.06)" strokeWidth="13" fill="none" />
                <AnimatedCircle
                  cx="60" cy="60" r={r}
                  stroke={ACCENT_GREEN} strokeWidth="13" fill="none"
                  strokeDasharray={`${circ} ${circ}`}
                  animatedProps={donutProps}
                  strokeLinecap="round"
                  rotation="-90" origin="60, 60"
                />
              </Svg>
              <View style={wiStyles.donutCenter}>
                <Text style={wiStyles.donutPct}>72%</Text>
                <Text style={wiStyles.donutSub}>used</Text>
              </View>
            </View>
            <View style={wiStyles.legendWrap}>
              {SPEND_CATEGORIES.map(c => (
                <View key={c.label} style={wiStyles.legendItem}>
                  <View style={[wiStyles.legendDot, { backgroundColor: c.color }]} />
                  <Text style={wiStyles.legendText}>{c.label}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Cashback cards */}
          <View style={wiStyles.cashCol}>
            <View style={[wiStyles.cashCard, { borderLeftColor: ACCENT_GREEN }]}>
              <Text style={wiStyles.cashLabel}>Cashback Earned</Text>
              <Text style={[wiStyles.cashAmt, { color: ACCENT_GREEN }]}>₦2,450</Text>
              <Text style={wiStyles.cashSub}>All time</Text>
            </View>
            <View style={[wiStyles.cashCard, { borderLeftColor: WI_PURPLE }]}>
              <Text style={wiStyles.cashLabel}>This Month</Text>
              <Text style={[wiStyles.cashAmt, { color: WI_PURPLE }]}>+₦890</Text>
              <Text style={wiStyles.cashSub}>↑ 12% vs last</Text>
            </View>
          </View>
        </Animated.View>

        {/* ── Weekly Flow Bars ── */}
        <Animated.View style={[wiStyles.barsCard, chartsStyle]}>
          <View style={wiStyles.barsHeader}>
            <Text style={wiStyles.sectionLabel}>Weekly Flow</Text>
            <View style={wiStyles.barsLegend}>
              <View style={wiStyles.barLegItem}>
                <View style={[wiStyles.barLegDot, { backgroundColor: ACCENT_GREEN }]} />
                <Text style={wiStyles.barLegText}>In</Text>
              </View>
              <View style={wiStyles.barLegItem}>
                <View style={[wiStyles.barLegDot, { backgroundColor: ACCENT_RED }]} />
                <Text style={wiStyles.barLegText}>Out</Text>
              </View>
            </View>
          </View>
          <View style={wiStyles.barsRow}>
            {WEEKLY_DATA.map((d, i) => (
              <WeeklyBar key={i} data={d} progress={barsProgress} index={i} />
            ))}
          </View>
        </Animated.View>

        {/* ── Wallet Growth Pulse ── */}
        <Animated.View style={[wiStyles.pulseCard, chartsStyle]}>
          <View style={wiStyles.pulseHeader}>
            <Text style={wiStyles.sectionLabel}>Wallet Growth</Text>
            <View style={wiStyles.statusPill}>
              <Text style={wiStyles.statusText}>● Growing</Text>
            </View>
          </View>
          <Svg width={pulseW} height={50} viewBox={`0 0 ${pulseW} 50`}>
            <Path d={pulsePath} stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" fill="none" />
            <AnimatedPath
              d={pulsePath}
              stroke={ACCENT_GREEN} strokeWidth="2.5" fill="none"
              strokeDasharray={`${PULSE_LEN} ${PULSE_LEN}`}
              animatedProps={pulseProps}
              strokeLinecap="round"
            />
          </Svg>
        </Animated.View>

        {/* ── Dismiss Handle ── */}
        <GestureDetector gesture={dismissGesture}>
          <Animated.View style={[wiStyles.dismissWrap, handleStyle]}>
            <View style={wiStyles.dismissBar} />
            <Text style={wiStyles.dismissText}>Drag up to return home</Text>
          </Animated.View>
        </GestureDetector>

      </View>
    </Animated.View>
  );
}

/* ── Morph Pill (Dynamic Island style indicator) ─────────────── */
function MorphPill({ progress, balance, topInset }: { progress: SharedValue<number>; balance: number; topInset: number }) {
  const pillStyle = useAnimatedStyle(() => ({
    opacity:   interpolate(progress.value, [0.04, 0.18], [0, 1], Extrapolation.CLAMP),
    transform: [
      { scaleX: interpolate(progress.value, [0.04, 0.22], [0.6, 1], Extrapolation.CLAMP) },
      { scaleY: interpolate(progress.value, [0.04, 0.18], [0.4, 1], Extrapolation.CLAMP) },
    ],
  }));

  const modeStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0.5, 0.75], [0, 1], Extrapolation.CLAMP),
  }));

  const balDisplay = `₦${(balance * 1550 / 1000).toFixed(0)}K`;

  return (
    <Animated.View style={[wiStyles.morphPill, { top: topInset + 10 }, pillStyle]} pointerEvents="none">
      <View style={wiStyles.pillDot} />
      <Text style={wiStyles.pillBalance}>{balDisplay}</Text>
      <Animated.Text style={[wiStyles.pillMode, modeStyle]}>· Wallet Intelligence</Animated.Text>
    </Animated.View>
  );
}

/* ── Gesture Constants ────────────────────────────────────────── */
const DRAG_THRESHOLD     = 120;
const VELOCITY_THRESHOLD = 800;

/* ── Main Screen ─────────────────────────────────────────────── */
export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user }              = useAuth();
  const { balance, transactions } = useWallet();

  const [balanceVisible, setBalanceVisible] = useState(true);
  const [selectedTx, setSelectedTx]         = useState<FullTxRow | null>(null);
  const [scrollEnabled, setScrollEnabled]   = useState(true);

  /* ── Animated refs ── */
  const scaleAnim       = useRef(new RNAnimated.Value(1)).current;
  const sheetY          = useRef(new RNAnimated.Value(SHEET_HEIGHT)).current;
  const backdropOpacity = useRef(new RNAnimated.Value(0)).current;

  /* ── Shared values ── */
  const dragY        = useSharedValue(0);   // existing tx-area swipe
  const morphY       = useSharedValue(0);   // balance-card morph swipe
  const isNavigating = useSharedValue(false);
  const isMorphLocked= useSharedValue(false);
  const scrollY      = useSharedValue(0);

  const firstName = user?.name?.split(" ")[0] ?? "Dove";
  const initial   = firstName.charAt(0).toUpperCase();
  const topPad    = Platform.OS === "web" ? 20 : insets.top;

  const rows: FullTxRow[] = transactions.length > 0 ? transactions.slice(0, 2).map(txFromWallet) : STATIC_TXS;

  /* ── Derived morph progress (0 → 1) ── */
  const morphProgress = useDerivedValue(() =>
    interpolate(morphY.value, [0, MORPH_FULL * 0.74], [0, 1], Extrapolation.CLAMP)
  );

  /* ── Screen animated style — driven by dragY + morphY ── */
  const screenAnimStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: dragY.value + morphY.value },
      { scale: interpolate(dragY.value, [0, 200], [1, 0.95], Extrapolation.CLAMP) },
    ],
    opacity: interpolate(dragY.value, [0, 200], [1, 0.88], Extrapolation.CLAMP),
  }));

  /* ── JS callbacks ── */
  function commitNavigate() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push("/(tabs)/send" as any);
    dragY.value = 0;
    isNavigating.value = false;
  }

  function setMorphed(locked: boolean) {
    if (locked) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    else         Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }

  /* ── Morph Gesture — attached to Balance Card ── */
  const morphGesture = Gesture.Pan()
    .activeOffsetY(10)
    .failOffsetY(-6)
    .onStart(() => {
      "worklet";
      runOnJS(setScrollEnabled)(false);
    })
    .onUpdate((e) => {
      "worklet";
      if (isMorphLocked.value || isNavigating.value) return;
      if (e.translationY > 0 && scrollY.value <= 4) {
        morphY.value = e.translationY / (1 + e.translationY / (MORPH_FULL * 0.55));
      }
    })
    .onEnd((e) => {
      "worklet";
      if (isMorphLocked.value || isNavigating.value) return;
      const shouldLock = (morphY.value > MORPH_THRESHOLD || e.velocityY > 900) && scrollY.value <= 4;
      if (shouldLock) {
        isMorphLocked.value = true;
        morphY.value = withSpring(MORPH_FULL, { damping: 18, stiffness: 140, mass: 0.9 });
        runOnJS(setMorphed)(true);
      } else {
        morphY.value = withSpring(0, { damping: 20, stiffness: 220, mass: 0.8 });
        runOnJS(setScrollEnabled)(true);
      }
    })
    .onFinalize(() => {
      "worklet";
      if (!isMorphLocked.value && morphY.value !== 0) {
        morphY.value = withSpring(0, { damping: 20, stiffness: 220, mass: 0.8 });
        runOnJS(setScrollEnabled)(true);
      }
    });

  /* ── Dismiss Gesture — on WI layer handle ── */
  const dismissGesture = Gesture.Pan()
    .activeOffsetY(-10)
    .failOffsetY(5)
    .onUpdate((e) => {
      "worklet";
      if (e.translationY < 0) {
        morphY.value = Math.max(0, MORPH_FULL + e.translationY * 1.15);
      }
    })
    .onEnd((e) => {
      "worklet";
      const shouldDismiss = morphY.value < MORPH_FULL * 0.62 || e.velocityY < -500;
      if (shouldDismiss) {
        isMorphLocked.value = false;
        morphY.value = withSpring(0, { damping: 20, stiffness: 200, mass: 0.85 });
        runOnJS(setMorphed)(false);
        runOnJS(setScrollEnabled)(true);
      } else {
        morphY.value = withSpring(MORPH_FULL, { damping: 18, stiffness: 150, mass: 0.9 });
      }
    });

  /* ── Existing pan gesture (Recent Transactions → Send tab) ── */
  const panGesture = Gesture.Pan()
    .activeOffsetY(12)
    .failOffsetY(-5)
    .onUpdate((e) => {
      "worklet";
      if (isNavigating.value || scrollY.value > 8 || morphY.value > 5) return;
      if (e.translationY > 0) {
        dragY.value = e.translationY / (1 + e.translationY / 350);
      }
    })
    .onEnd((e) => {
      "worklet";
      if (isNavigating.value) return;
      const shouldNavigate = (dragY.value > DRAG_THRESHOLD || e.velocityY > VELOCITY_THRESHOLD) && scrollY.value <= 8;
      if (shouldNavigate) {
        isNavigating.value = true;
        dragY.value = withTiming(180, { duration: 150 }, () => { runOnJS(commitNavigate)(); });
      } else {
        dragY.value = withSpring(0, { damping: 20, stiffness: 220, mass: 0.8 });
      }
    })
    .onFinalize(() => {
      "worklet";
      if (!isNavigating.value && dragY.value !== 0) {
        dragY.value = withSpring(0, { damping: 20, stiffness: 220, mass: 0.8 });
      }
    });

  function handleEyeToggle() {
    Haptics.selectionAsync();
    RNAnimated.sequence([
      RNAnimated.timing(scaleAnim, { toValue: 0.91, duration: 75, useNativeDriver: true }),
      RNAnimated.timing(scaleAnim, { toValue: 1,    duration: 75, useNativeDriver: true }),
    ]).start();
    setBalanceVisible(v => !v);
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
    RNAnimated.parallel([
      RNAnimated.spring(sheetY, { toValue: 0, tension: 68, friction: 11, useNativeDriver: true }),
      RNAnimated.timing(backdropOpacity, { toValue: 1, duration: 240, useNativeDriver: true }),
    ]).start();
  }

  function closeSheet() {
    Haptics.selectionAsync();
    RNAnimated.parallel([
      RNAnimated.timing(sheetY, { toValue: SHEET_HEIGHT, duration: 260, useNativeDriver: true }),
      RNAnimated.timing(backdropOpacity, { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start(() => setSelectedTx(null));
  }

  return (
    <View style={StyleSheet.absoluteFill}>
      <StatusBar barStyle="dark-content" backgroundColor={WHITE} />

      {/* ── Wallet Intelligence Layer (behind home screen) ── */}
      <WalletIntelligenceLayer
        progress={morphProgress}
        balance={balance}
        dismissGesture={dismissGesture}
        topInset={topPad}
      />

      {/* ── Morph Pill (Dynamic Island style feedback) ── */}
      <MorphPill progress={morphProgress} balance={balance} topInset={topPad} />

      {/* ── Home Screen — translates DOWN as morph progresses ── */}
      <Animated.View style={[styles.screen, screenAnimStyle]}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={{ paddingTop: topPad, paddingBottom: 110 }}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          scrollEnabled={scrollEnabled}
          onScroll={(e: NativeSyntheticEvent<NativeScrollEvent>) => {
            scrollY.value = e.nativeEvent.contentOffset.y;
          }}
        >
          {/* ── Top Bar ── */}
          <View style={styles.topBar}>
            <View style={styles.greetingLeft}>
              <LinearGradient colors={["#BCE2FE", "#D8B4FE"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.avatarCircle}>
                <Text style={styles.avatarInitial}>{initial}</Text>
              </LinearGradient>
              <View>
                <Text style={styles.greetingName}>Hi, {firstName} 👋</Text>
                <Text style={styles.greetingSub}>Welcome back</Text>
              </View>
            </View>
            <TouchableOpacity onPress={handleEyeToggle} style={styles.eyeBtn} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
              <Feather name={balanceVisible ? "eye" : "eye-off"} size={22} color={TEXT_GRAY} />
            </TouchableOpacity>
          </View>

          {/* ── Balance Card — GESTURE ANCHOR ── */}
          <GestureDetector gesture={morphGesture}>
            <View>
              <CardCarousel balanceVisible={balanceVisible} balance={balance} />
              {/* Drag hint */}
              <View style={styles.morphHint}>
                <View style={styles.morphHintPip} />
                <Text style={styles.morphHintText}>Pull down for Wallet Intelligence</Text>
                <View style={styles.morphHintPip} />
              </View>
            </View>
          </GestureDetector>

          {/* ── Action Bar ── */}
          <View style={styles.actionBar}>
            {[
              { label: "Fund Wallet", icon: "plus-circle" as const },
              { label: "Sell",        icon: "tag"          as const },
              { label: "Withdraw",    icon: "download"     as const },
            ].map((action, i) => (
              <TouchableOpacity key={action.label} style={[styles.actionItem, i < 2 && styles.actionBorder]} onPress={() => handleAction(action.label)} activeOpacity={0.6}>
                <View style={styles.actionIconWrap}><Feather name={action.icon} size={20} color={WHITE} /></View>
                <Text style={styles.actionLabel}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* ── Quick Actions Grid ── */}
          <View style={styles.sectionHeader}><Text style={styles.sectionTitle}>Quick Actions</Text></View>
          <View style={styles.quickGrid}>
            {QUICK_ACTIONS.map(item => (
              <TouchableOpacity key={item.key} style={styles.quickItem} onPress={() => handleQuick(item.key)} activeOpacity={0.65}>
                <View style={styles.quickIconWrap}><Feather name={item.icon as any} size={20} color={TEXT_DARK} /></View>
                <Text style={styles.quickLabel}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* ── Promo Banners ── */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.promoScroll} decelerationRate="fast" snapToInterval={270} snapToAlignment="start">
            {PROMO_CARDS.map(card => (
              <TouchableOpacity key={card.id} style={[styles.promoCard, { backgroundColor: card.bg }]} onPress={() => Haptics.selectionAsync()} activeOpacity={0.82}>
                <Text style={styles.promoPct}>{card.pct}</Text>
                <Text style={styles.promoTitle}>{card.title}</Text>
                <Text style={styles.promoDesc}>{card.desc}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* ── Recent Transactions (existing swipe-to-send gesture) ── */}
          <GestureDetector gesture={panGesture}>
            <View style={styles.txSection}>
              <View style={styles.txHeader}>
                <Text style={styles.txHeading}>Recent Transaction</Text>
                <TouchableOpacity onPress={() => { Haptics.selectionAsync(); router.push("/(tabs)/send" as any); }} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                  <Text style={styles.txSeeAll}>See All</Text>
                </TouchableOpacity>
              </View>
              {rows.map(row => (
                <TouchableOpacity key={row.id} style={styles.txRow} onPress={() => openSheet(row)} activeOpacity={0.68}>
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
                    <Text style={[styles.txAmount, { color: row.isPositive ? GREEN : RED }]}>{row.amount}</Text>
                    <Feather name="chevron-right" size={14} color={TEXT_LIGHT} />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </GestureDetector>
        </ScrollView>
      </Animated.View>

      {/* ── Transaction Detail Sheet ── */}
      <TransactionDetailSheet tx={selectedTx} sheetY={sheetY} backdropOpacity={backdropOpacity} onClose={closeSheet} />
    </View>
  );
}

/* ── Carousel Styles ─────────────────────────────────────────── */
const carouselStyles = StyleSheet.create({
  wrapper: { marginBottom: 8 },
  card: { height: 180, borderRadius: 20, padding: 24, overflow: "hidden", position: "relative", justifyContent: "space-between" },
  decorCircle:  { position: "absolute", width: 200, height: 200, borderRadius: 100, borderWidth: 1, top: -60, right: -60 },
  decorCircle2: { position: "absolute", width: 140, height: 140, borderRadius: 70,  borderWidth: 1, bottom: -40, left: -30 },
  cardTop:      { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  cardLabel:    { fontFamily: "Inter_700Bold", fontSize: 16, color: WHITE, letterSpacing: 3 },
  schemeBadge:  { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, borderWidth: 1 },
  schemeText:   { fontFamily: "Inter_600SemiBold", fontSize: 10, letterSpacing: 1 },
  cardBalanceRow: { gap: 4 },
  cardBalLabel: { fontFamily: "Inter_400Regular", fontSize: 11, color: "rgba(255,255,255,0.5)", letterSpacing: 0.3 },
  cardBalance:  { fontFamily: "Inter_700Bold", fontSize: 22, letterSpacing: -0.5 },
  cardNumber:   { fontFamily: "Inter_500Medium", fontSize: 14, letterSpacing: 3 },
  chip:      { position: "absolute", width: 36, height: 28, borderRadius: 5, borderWidth: 1, bottom: 24, left: 24, justifyContent: "center", alignItems: "center" },
  chipInner: { width: 24, height: 18, borderRadius: 3 },
  dots: { flexDirection: "row", justifyContent: "center", gap: 6, marginTop: 14 },
  dot:  { height: 6, borderRadius: 3, backgroundColor: TEXT_LIGHT },
});

/* ── Screen Styles ───────────────────────────────────────────── */
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: WHITE },
  scroll: { flex: 1, backgroundColor: WHITE },

  topBar:       { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 24, paddingBottom: 20 },
  greetingLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  avatarCircle: { width: 46, height: 46, borderRadius: 23, alignItems: "center", justifyContent: "center" },
  avatarInitial:{ fontFamily: "Inter_700Bold", fontSize: 18, color: WHITE },
  greetingName: { fontFamily: "Inter_700Bold", fontSize: 15, color: TEXT_DARK, lineHeight: 22 },
  greetingSub:  { fontFamily: "Inter_400Regular", fontSize: 12, color: TEXT_GRAY, lineHeight: 18 },
  eyeBtn: { padding: 4 },

  /* ── Morph hint below card ── */
  morphHint:     { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 18, marginTop: 6, paddingHorizontal: 24 },
  morphHintPip:  { width: 4, height: 4, borderRadius: 2, backgroundColor: "#D1D5DB" },
  morphHintText: { fontFamily: "Inter_400Regular", fontSize: 11, color: TEXT_LIGHT, letterSpacing: 0.2 },

  actionBar:     { marginHorizontal: 24, backgroundColor: BLACK, borderRadius: 16, flexDirection: "row", marginBottom: 28, overflow: "hidden" },
  actionItem:    { flex: 1, alignItems: "center", justifyContent: "center", paddingVertical: 16, gap: 7 },
  actionBorder:  { borderRightWidth: StyleSheet.hairlineWidth, borderRightColor: "rgba(255,255,255,0.15)" },
  actionIconWrap:{ width: 36, height: 36, borderRadius: 18, backgroundColor: "rgba(255,255,255,0.1)", alignItems: "center", justifyContent: "center" },
  actionLabel:   { fontFamily: "Inter_500Medium", fontSize: 11, color: WHITE, textAlign: "center" },

  sectionHeader: { paddingHorizontal: 24, marginBottom: 14 },
  sectionTitle:  { fontFamily: "Inter_600SemiBold", fontSize: 15, color: TEXT_DARK },

  quickGrid:    { flexDirection: "row", flexWrap: "wrap", paddingHorizontal: 16, marginBottom: 28, rowGap: 20 },
  quickItem:    { width: "25%", alignItems: "center", gap: 8 },
  quickIconWrap:{ width: 46, height: 46, borderRadius: 14, alignItems: "center", justifyContent: "center", backgroundColor: "#F5F5F7", shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 1 },
  quickLabel:   { fontFamily: "Inter_500Medium", fontSize: 10, color: TEXT_GRAY, textAlign: "center", lineHeight: 14 },

  promoScroll: { paddingLeft: 24, paddingRight: 8, gap: 12, marginBottom: 28 },
  promoCard:   { width: 260, borderRadius: 10, padding: 18, minHeight: 100, gap: 4, justifyContent: "flex-end" },
  promoPct:    { fontFamily: "Inter_700Bold", fontSize: 20, color: TEXT_DARK },
  promoTitle:  { fontFamily: "Inter_600SemiBold", fontSize: 13, color: TEXT_DARK },
  promoDesc:   { fontFamily: "Inter_400Regular", fontSize: 10.5, color: TEXT_GRAY, lineHeight: 16 },

  txSection: { paddingHorizontal: 24, gap: 4 },
  txHeader:  { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  txHeading: { fontFamily: "Inter_600SemiBold", fontSize: 16, color: TEXT_DARK },
  txSeeAll:  { fontFamily: "Inter_600SemiBold", fontSize: 12, color: BLACK },
  txRow:     { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 13, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: "#F0F0F2" },
  txLeft:    { flexDirection: "row", alignItems: "center", gap: 12, flex: 1 },
  txIconWrap:{ width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  txInfo:    { gap: 3, flex: 1 },
  txName:    { fontFamily: "Inter_600SemiBold", fontSize: 13, color: TEXT_GRAY },
  txDate:    { fontFamily: "Inter_400Regular", fontSize: 11, color: TEXT_LIGHT },
  txRight:   { flexDirection: "row", alignItems: "center", gap: 4 },
  txAmount:  { fontFamily: "Inter_700Bold", fontSize: 13, textAlign: "right" },
});

/* ── Sheet Styles ────────────────────────────────────────────── */
const sheetStyles = StyleSheet.create({
  backdrop:  { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.68)" },
  sheet:     { position: "absolute", bottom: 0, left: 0, right: 0, height: SHEET_HEIGHT, backgroundColor: SHEET_BG, borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingHorizontal: 24, paddingBottom: 32, paddingTop: 12 },
  handle:    { alignSelf: "center", width: 40, height: 4, borderRadius: 2, backgroundColor: "rgba(255,255,255,0.18)", marginBottom: 16 },
  sheetHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  sheetTitle:  { fontFamily: "Inter_600SemiBold", fontSize: 16, color: SHEET_VALUE },
  closeBtn:    { width: 30, height: 30, borderRadius: 15, backgroundColor: "rgba(255,255,255,0.08)", alignItems: "center", justifyContent: "center" },
  amountHero:  { flexDirection: "row", alignItems: "center", gap: 14, backgroundColor: SHEET_CARD, borderRadius: 14, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: SHEET_BORDER },
  txTypeChip:  { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  amountBlock: { flex: 1 },
  heroAmount:  { fontFamily: "Inter_700Bold", fontSize: 22, letterSpacing: -0.5 },
  heroName:    { fontFamily: "Inter_500Medium", fontSize: 13, color: SHEET_LABEL, marginTop: 2 },
  divider:     { height: 1, backgroundColor: SHEET_BORDER, marginBottom: 16 },
  detailsBlock:{ gap: 12, flex: 1 },
  detailRow:   { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  detailLabel: { fontFamily: "Inter_400Regular", fontSize: 13, color: SHEET_LABEL },
  detailValue: { fontFamily: "Inter_600SemiBold", fontSize: 13, color: SHEET_VALUE, maxWidth: "60%", textAlign: "right" },
  mono:        { fontFamily: "Inter_400Regular", fontSize: 11, letterSpacing: 0.5 },
  statusRow:   { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  statusPill:  { flexDirection: "row", alignItems: "center", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  statusText:  { fontFamily: "Inter_600SemiBold", fontSize: 12 },
  ctaBtn:      { height: 50, backgroundColor: "#1E1E2C", borderRadius: 14, alignItems: "center", justifyContent: "center", marginTop: 8 },
  ctaText:     { fontFamily: "Inter_600SemiBold", fontSize: 16, color: WHITE },
});

/* ── Wallet Intelligence Styles ──────────────────────────────── */
const wiStyles = StyleSheet.create({
  layer: { flex: 1, paddingHorizontal: 24, paddingBottom: 32 },

  /* Header */
  header:        { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 14 },
  headerLeft:    { flexDirection: "row", alignItems: "center", gap: 8 },
  headerDot:     { width: 8, height: 8, borderRadius: 4, backgroundColor: ACCENT_GREEN },
  headerTitle:   { fontFamily: "Inter_700Bold", fontSize: 18, color: WHITE, letterSpacing: -0.3 },
  activeBadge:   { backgroundColor: ACCENT_GREEN + "18", borderWidth: 1, borderColor: ACCENT_GREEN + "35", borderRadius: 99, paddingHorizontal: 10, paddingVertical: 3 },
  activeBadgeText: { fontFamily: "Inter_600SemiBold", fontSize: 10, color: ACCENT_GREEN, letterSpacing: 1, textTransform: "uppercase" },

  /* Balance */
  balanceBlock:  { marginBottom: 14 },
  balanceSub:    { fontFamily: "Inter_400Regular", fontSize: 12, color: WI_LABEL, letterSpacing: 0.3, marginBottom: 4 },
  balanceAmt:    { fontFamily: "Inter_700Bold", fontSize: 32, color: WHITE, letterSpacing: -1 },
  growthRow:     { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 4 },
  growthDot:     { width: 6, height: 6, borderRadius: 3, backgroundColor: ACCENT_GREEN },
  growthText:    { fontFamily: "Inter_400Regular", fontSize: 11, color: ACCENT_GREEN + "CC" },

  sectionDivider: { height: 1, backgroundColor: WI_BORDER, marginBottom: 16 },
  sectionLabel:   { fontFamily: "Inter_600SemiBold", fontSize: 12, color: WI_LABEL, letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 12 },

  /* Row: Donut + Cash cards */
  row:        { flexDirection: "row", gap: 12, marginBottom: 14 },

  /* Donut */
  donutCard:  { flex: 1, backgroundColor: WI_CARD, borderRadius: 16, borderWidth: 1, borderColor: WI_BORDER, padding: 14 },
  donutWrap:  { alignItems: "center", justifyContent: "center", position: "relative" },
  donutCenter:{ position: "absolute", alignItems: "center" },
  donutPct:   { fontFamily: "Inter_700Bold", fontSize: 20, color: WHITE },
  donutSub:   { fontFamily: "Inter_400Regular", fontSize: 10, color: WI_LABEL },
  legendWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 10 },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  legendDot:  { width: 6, height: 6, borderRadius: 3 },
  legendText: { fontFamily: "Inter_400Regular", fontSize: 10, color: WI_LABEL },

  /* Cashback */
  cashCol:  { flex: 1, gap: 10, justifyContent: "space-between" },
  cashCard: { flex: 1, backgroundColor: WI_CARD, borderRadius: 14, borderWidth: 1, borderColor: WI_BORDER, borderLeftWidth: 3, padding: 12 },
  cashLabel:{ fontFamily: "Inter_400Regular", fontSize: 10, color: WI_LABEL, marginBottom: 4 },
  cashAmt:  { fontFamily: "Inter_700Bold", fontSize: 18, color: ACCENT_GREEN, letterSpacing: -0.5 },
  cashSub:  { fontFamily: "Inter_400Regular", fontSize: 10, color: WI_LABEL, marginTop: 2 },

  /* Bars */
  barsCard:   { backgroundColor: WI_CARD, borderRadius: 16, borderWidth: 1, borderColor: WI_BORDER, padding: 14, marginBottom: 14 },
  barsHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  barsLegend: { flexDirection: "row", gap: 12 },
  barLegItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  barLegDot:  { width: 6, height: 6, borderRadius: 3 },
  barLegText: { fontFamily: "Inter_400Regular", fontSize: 10, color: WI_LABEL },
  barsRow:    { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", marginTop: 12 },
  barGroup:   { alignItems: "center", flex: 1, gap: 4 },
  barPair:    { flexDirection: "row", gap: 3, alignItems: "flex-end" },
  barTrack:   { width: 7, backgroundColor: "rgba(255,255,255,0.05)", borderRadius: 4, justifyContent: "flex-end", overflow: "hidden" },
  barFill:    { width: "100%", borderRadius: 4 },
  barDay:     { fontFamily: "Inter_400Regular", fontSize: 9, color: WI_LABEL },

  /* Pulse */
  pulseCard:   { backgroundColor: WI_CARD, borderRadius: 16, borderWidth: 1, borderColor: WI_BORDER, padding: 14, marginBottom: 20 },
  pulseHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  statusPill:  { backgroundColor: ACCENT_GREEN + "18", borderRadius: 99, paddingHorizontal: 8, paddingVertical: 2 },
  statusText:  { fontFamily: "Inter_600SemiBold", fontSize: 10, color: ACCENT_GREEN },

  /* Dismiss */
  dismissWrap: { alignItems: "center", gap: 8, paddingVertical: 12 },
  dismissBar:  { width: 40, height: 4, borderRadius: 2, backgroundColor: "rgba(255,255,255,0.2)" },
  dismissText: { fontFamily: "Inter_400Regular", fontSize: 12, color: "rgba(255,255,255,0.35)", letterSpacing: 0.2 },

  /* Morph Pill */
  morphPill:    { position: "absolute", alignSelf: "center", flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "#0F0F1A", borderWidth: 1, borderColor: "rgba(255,255,255,0.12)", borderRadius: 99, paddingHorizontal: 14, paddingVertical: 7, zIndex: 100 },
  pillDot:      { width: 6, height: 6, borderRadius: 3, backgroundColor: ACCENT_GREEN },
  pillBalance:  { fontFamily: "Inter_700Bold", fontSize: 13, color: WHITE },
  pillMode:     { fontFamily: "Inter_400Regular", fontSize: 11, color: "rgba(255,255,255,0.45)" },
});
