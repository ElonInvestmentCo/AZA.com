import {
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

/* ── Colors ─────────────────────────────────────────────────────────────── */
const C = {
  bg:      "#FFFFFF",
  text:    "#151521",
  subtext: "rgba(26,29,37,0.5)",
  border:  "rgba(21,21,33,0.2)",
  amount:  "#000000",
};

const SHEET = {
  bg:         "#0F0F13",
  surface:    "#1A1A22",
  border:     "rgba(255,255,255,0.07)",
  label:      "rgba(255,255,255,0.45)",
  value:      "#FFFFFF",
  handle:     "rgba(255,255,255,0.18)",
  accent:     "#00D9A0",
};

/* ── Types ───────────────────────────────────────────────────────────────── */
type TxType   = "transferred" | "refund" | "transaction";
type IconKind = "visa" | "bank" | "paypal" | "receipt" | "stripe" | "cash";
type TxStatus = "completed" | "pending" | "failed";

interface Tx {
  id:          string;
  type:        TxType;
  date:        string;
  time:        string;
  amount:      string;
  icon:        IconKind;
  status:      TxStatus;
  direction:   "credit" | "debit";
  refId:       string;
  description: string;
  fee:         string;
  network:     string;
}

/* ── Data ────────────────────────────────────────────────────────────────── */
const TRANSACTIONS: Tx[] = [
  {
    id: "1", type: "transferred", date: "Aug 19, 2023", time: "2:30 PM",
    amount: "$123.00", icon: "visa", status: "completed", direction: "credit",
    refId: "TXN-AZ-8821", description: "Visa card top-up", fee: "$0.00", network: "Visa Direct",
  },
  {
    id: "2", type: "transferred", date: "Jul 20, 2023", time: "11:14 AM",
    amount: "$12.00", icon: "bank", status: "completed", direction: "debit",
    refId: "TXN-AZ-7704", description: "Bank wire transfer", fee: "$1.50", network: "ACH",
  },
  {
    id: "3", type: "refund", date: "May 08, 2023", time: "9:02 AM",
    amount: "$234.00", icon: "paypal", status: "completed", direction: "credit",
    refId: "TXN-AZ-6219", description: "PayPal refund processed", fee: "$0.00", network: "PayPal",
  },
  {
    id: "4", type: "refund", date: "Feb 29, 2023", time: "4:48 PM",
    amount: "$15.00", icon: "receipt", status: "pending", direction: "credit",
    refId: "TXN-AZ-5530", description: "Merchant refund pending", fee: "$0.00", network: "Internal",
  },
  {
    id: "5", type: "transaction", date: "Jan 25, 2023", time: "7:55 PM",
    amount: "-$92.00", icon: "stripe", status: "completed", direction: "debit",
    refId: "TXN-AZ-4401", description: "Stripe payment gateway", fee: "$2.76", network: "Stripe",
  },
  {
    id: "6", type: "transaction", date: "Jan 16, 2023", time: "1:20 PM",
    amount: "-$20.00", icon: "cash", status: "failed", direction: "debit",
    refId: "TXN-AZ-3382", description: "Cash withdrawal declined", fee: "$0.00", network: "ATM",
  },
];

const TYPE_LABEL: Record<TxType, string> = {
  transferred: "Transferred",
  refund:      "Refund",
  transaction: "Transaction",
};

/* ── Icons ───────────────────────────────────────────────────────────────── */
function TxIcon({ kind, size = 40 }: { kind: IconKind; size?: number }) {
  const r = size / 2;
  if (kind === "visa")
    return (
      <View style={[ico.circle, { width: size, height: size, borderRadius: r, backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "rgba(0,0,0,0.1)" }]}>
        <FontAwesome5 name="cc-visa" size={size * 0.5} color="#263B80" />
      </View>
    );
  if (kind === "bank")
    return (
      <View style={[ico.circle, { width: size, height: size, borderRadius: r, backgroundColor: "#118EEB" }]}>
        <MaterialCommunityIcons name="bank-transfer" size={size * 0.55} color="#FFFFFF" />
      </View>
    );
  if (kind === "paypal")
    return (
      <View style={[ico.circle, { width: size, height: size, borderRadius: r, backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "rgba(0,0,0,0.1)" }]}>
        <FontAwesome5 name="paypal" size={size * 0.45} color="#003087" />
      </View>
    );
  if (kind === "receipt")
    return (
      <View style={[ico.circle, { width: size, height: size, borderRadius: r, backgroundColor: "#FE5722" }]}>
        <Ionicons name="receipt-outline" size={size * 0.45} color="#FFFFFF" />
      </View>
    );
  if (kind === "stripe")
    return (
      <View style={[ico.circle, { width: size, height: size, borderRadius: r, backgroundColor: "#000000" }]}>
        <FontAwesome5 name="stripe-s" size={size * 0.45} color="#FFFFFF" />
      </View>
    );
  return (
    <View style={[ico.circle, { width: size, height: size, borderRadius: r, backgroundColor: "#00DA5A" }]}>
      <MaterialCommunityIcons name="cash" size={size * 0.5} color="#FFFFFF" />
    </View>
  );
}

const ico = StyleSheet.create({
  circle: { alignItems: "center", justifyContent: "center" },
});

/* ── Filter pills ────────────────────────────────────────────────────────── */
type Filter = "all" | TxType;

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all",         label: "All"         },
  { key: "transferred", label: "Transferred" },
  { key: "refund",      label: "Refund"      },
  { key: "transaction", label: "Transaction" },
];

function FilterPill({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  const sc = useSharedValue(1);
  const style = useAnimatedStyle(() => ({ transform: [{ scale: sc.value }] }));
  return (
    <Animated.View style={style}>
      <Pressable
        style={[fp.btn, active ? fp.active : fp.inactive]}
        onPress={() => { Haptics.selectionAsync(); onPress(); }}
        onPressIn={() => { sc.value = withSpring(0.93, { damping: 12, stiffness: 300 }); }}
        onPressOut={() => { sc.value = withSpring(1.0, { damping: 12, stiffness: 300 }); }}
      >
        <Text style={[fp.label, { color: active ? "#FFFFFF" : "rgba(21,21,33,0.5)" }]}>{label}</Text>
      </Pressable>
    </Animated.View>
  );
}

const fp = StyleSheet.create({
  btn:      { paddingHorizontal: 16, paddingVertical: 9, borderRadius: 20 },
  active:   { backgroundColor: "#151521" },
  inactive: { backgroundColor: "#F5F5F5" },
  label:    { fontSize: 13, fontFamily: "Manrope_500Medium" },
});

/* ── Transaction row ─────────────────────────────────────────────────────── */
function TxRow({ item, index, onPress }: { item: Tx; index: number; onPress: (tx: Tx) => void }) {
  const sc = useSharedValue(1);
  const pressStyle = useAnimatedStyle(() => ({ transform: [{ scale: sc.value }] }));
  return (
    <Animated.View entering={FadeInDown.duration(300).delay(index * 60).springify()}>
      <Animated.View style={pressStyle}>
        <Pressable
          style={s.card}
          onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); onPress(item); }}
          onPressIn={() => { sc.value = withSpring(0.97, { damping: 14, stiffness: 300 }); }}
          onPressOut={() => { sc.value = withSpring(1.0, { damping: 14, stiffness: 300 }); }}
        >
          <View style={s.cardLeft}>
            <TxIcon kind={item.icon} />
            <View style={s.infoBlock}>
              <Text style={s.typeLabel}>{TYPE_LABEL[item.type]}</Text>
              <Text style={s.dateText}>{item.date}</Text>
            </View>
          </View>
          <View style={s.cardRight}>
            <Text style={[s.amount, item.direction === "credit" && s.amountCredit]}>
              {item.amount}
            </Text>
            <StatusDot status={item.status} />
          </View>
        </Pressable>
      </Animated.View>
    </Animated.View>
  );
}

function StatusDot({ status }: { status: TxStatus }) {
  const colors: Record<TxStatus, string> = {
    completed: "#00C48C",
    pending:   "#F59E0B",
    failed:    "#EF4444",
  };
  return (
    <View style={[sd.dot, { backgroundColor: colors[status] }]} />
  );
}
const sd = StyleSheet.create({
  dot: { width: 7, height: 7, borderRadius: 4, alignSelf: "flex-end", marginTop: 4 },
});

/* ── Bottom sheet detail ─────────────────────────────────────────────────── */
const SHEET_HEIGHT = 520;

function SheetRow({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <View style={sh.row}>
      <Text style={sh.label}>{label}</Text>
      <Text style={[sh.value, accent && { color: SHEET.accent }]}>{value}</Text>
    </View>
  );
}

function StatusChip({ status }: { status: TxStatus }) {
  const map: Record<TxStatus, { bg: string; fg: string; label: string }> = {
    completed: { bg: "#00D9A015", fg: "#00D9A0", label: "Completed" },
    pending:   { bg: "#F59E0B18", fg: "#F59E0B", label: "Pending"   },
    failed:    { bg: "#EF444418", fg: "#EF4444", label: "Failed"    },
  };
  const { bg, fg, label } = map[status];
  return (
    <View style={[sh.chip, { backgroundColor: bg, borderColor: fg + "40" }]}>
      <View style={[sh.chipDot, { backgroundColor: fg }]} />
      <Text style={[sh.chipText, { color: fg }]}>{label}</Text>
    </View>
  );
}

const sh = StyleSheet.create({
  row:      { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: SHEET.border },
  label:    { fontSize: 13, fontFamily: "Manrope_400Regular", color: SHEET.label },
  value:    { fontSize: 14, fontFamily: "Manrope_600SemiBold", color: SHEET.value },
  chip:     { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20, borderWidth: 1 },
  chipDot:  { width: 6, height: 6, borderRadius: 3 },
  chipText: { fontSize: 12, fontFamily: "Manrope_600SemiBold" },
});

function TransactionSheet({
  tx,
  visible,
  onClose,
}: {
  tx: Tx | null;
  visible: boolean;
  onClose: () => void;
}) {
  const { height } = useWindowDimensions();
  const insets     = useSafeAreaInsets();

  const translateY = useSharedValue(SHEET_HEIGHT + 60);
  const backdropOp = useSharedValue(0);

  React.useEffect(() => {
    if (visible) {
      backdropOp.value = withTiming(1, { duration: 240 });
      translateY.value = withSpring(0, { damping: 26, stiffness: 220, mass: 0.9 });
    } else {
      translateY.value = withSpring(SHEET_HEIGHT + 60, { damping: 26, stiffness: 220 });
      backdropOp.value = withTiming(0, { duration: 200 });
    }
  }, [visible]);

  const sheetStyle    = useAnimatedStyle(() => ({ transform: [{ translateY: translateY.value }] }));
  const backdropStyle = useAnimatedStyle(() => ({ opacity: backdropOp.value }));

  if (!tx && !visible) return null;

  const isCredit = tx?.direction === "credit";

  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents={visible ? "auto" : "none"}>
      {/* Backdrop */}
      <Animated.View style={[StyleSheet.absoluteFillObject, bs.backdrop, backdropStyle]}>
        <Pressable style={StyleSheet.absoluteFillObject} onPress={onClose} />
      </Animated.View>

      {/* Sheet */}
      <Animated.View
        style={[bs.sheet, { paddingBottom: insets.bottom + 16 }, sheetStyle]}
      >
        {/* Handle */}
        <View style={bs.handle} />

        {/* Header */}
        <View style={bs.header}>
          <View style={bs.iconWrap}>
            {tx && <TxIcon kind={tx.icon} size={52} />}
          </View>
          <Text style={[bs.amount, { color: isCredit ? SHEET.accent : "#FFFFFF" }]}>
            {tx?.amount}
          </Text>
          <Text style={bs.desc}>{tx?.description}</Text>
          {tx && <StatusChip status={tx.status} />}
        </View>

        {/* Divider */}
        <View style={bs.divider} />

        {/* Detail rows */}
        <View style={bs.rows}>
          <SheetRow label="Type"         value={tx ? TYPE_LABEL[tx.type] : ""} />
          <SheetRow label="Date"         value={tx ? `${tx.date} · ${tx.time}` : ""} />
          <SheetRow label="Direction"    value={isCredit ? "Incoming" : "Outgoing"} />
          <SheetRow label="Network"      value={tx?.network ?? ""} />
          <SheetRow label="Fee"          value={tx?.fee ?? ""} />
          <SheetRow label="Reference ID" value={tx?.refId ?? ""} accent />
        </View>
      </Animated.View>
    </View>
  );
}

const bs = StyleSheet.create({
  backdrop: {
    backgroundColor: "rgba(0,0,0,0.68)",
  },
  sheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: SHEET_HEIGHT,
    backgroundColor: SHEET.bg,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: SHEET.handle,
    alignSelf: "center",
    marginBottom: 20,
  },
  header: {
    alignItems: "center",
    gap: 8,
    marginBottom: 20,
  },
  iconWrap: {
    marginBottom: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  amount: {
    fontSize: 38,
    fontFamily: "Manrope_700Bold",
    letterSpacing: -1,
    color: "#FFFFFF",
  },
  desc: {
    fontSize: 14,
    fontFamily: "Manrope_400Regular",
    color: SHEET.label,
    textAlign: "center",
  },
  divider: {
    height: 1,
    backgroundColor: SHEET.border,
    marginBottom: 4,
  },
  rows: {
    gap: 0,
  },
});

/* ── Main screen ─────────────────────────────────────────────────────────── */
export default function TransactionsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [filter, setFilter]       = useState<Filter>("all");
  const [selectedTx, setSelectedTx] = useState<Tx | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const data   = TRANSACTIONS.filter((t) => filter === "all" || t.type === filter);

  const openSheet = useCallback((tx: Tx) => {
    setSelectedTx(tx);
    setSheetOpen(true);
  }, []);

  const closeSheet = useCallback(() => {
    setSheetOpen(false);
    setTimeout(() => setSelectedTx(null), 350);
  }, []);

  return (
    <View style={[s.root, { paddingTop: topPad }]}>
      <View style={s.header}>
        <Pressable
          style={s.backBtn}
          onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.back(); }}
        >
          <Ionicons name="chevron-back" size={20} color={C.text} />
        </Pressable>
        <Text style={s.headerTitle}>Transactions</Text>
        <View style={{ width: 36 }} />
      </View>

      <View style={s.filterRow}>
        {FILTERS.map((f) => (
          <FilterPill
            key={f.key}
            label={f.label}
            active={filter === f.key}
            onPress={() => setFilter(f.key)}
          />
        ))}
      </View>

      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[s.list, { paddingBottom: insets.bottom + 32 }]}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <TxRow item={item} index={index} onPress={openSheet} />
        )}
      />

      <TransactionSheet tx={selectedTx} visible={sheetOpen} onClose={closeSheet} />
    </View>
  );
}

/* ── Styles ──────────────────────────────────────────────────────────────── */
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
  },
  backBtn: {
    width: 36, height: 36, borderRadius: 10,
    borderWidth: 1, borderColor: "rgba(21,21,33,0.12)",
    alignItems: "center", justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  headerTitle: { fontSize: 18, fontFamily: "Manrope_700Bold", color: C.text },
  filterRow: {
    flexDirection: "row", flexWrap: "wrap",
    paddingHorizontal: 20, gap: 8, marginBottom: 20,
  },
  list: { paddingHorizontal: 20, gap: 12 },
  card: {
    height: 70, borderRadius: 32,
    borderWidth: 0.5, borderColor: C.border,
    backgroundColor: "#FFFFFF",
    flexDirection: "row", alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  cardLeft:  { flexDirection: "row", alignItems: "center", gap: 15 },
  cardRight: { alignItems: "flex-end" },
  infoBlock: { gap: 4 },
  typeLabel: { fontSize: 12, fontFamily: "Manrope_400Regular", color: C.subtext },
  dateText:  { fontSize: 15, fontFamily: "Manrope_500Medium", color: C.text },
  amount:    { fontSize: 15, fontFamily: "Manrope_500Medium", color: C.amount, textAlign: "right" },
  amountCredit: { color: "#00A86B" },
});
