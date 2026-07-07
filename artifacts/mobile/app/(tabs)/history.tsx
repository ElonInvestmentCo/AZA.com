import { Feather } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import * as Haptics from "expo-haptics";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { apiFetch } from "@/utils/api";
import { useAuth } from "@/context/AuthContext";
import {
  FlatList,
  Platform,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AnimatedSheet } from "@/components/AnimatedSheet";
import { rf } from "@/utils/responsive";

/* ─── Design tokens ──────────────────────────────────────────────────────── */
const C = {
  bg:      "#FFFFFF",
  text:    "#0B0A0A",
  navy:    "#061941",
  textSec: "#595F67",
  textMut: "#AAAFB5",
  border:  "#F0F0F0",
  success: "#00B03C",
  danger:  "#EF4444",
  warn:    "#D97706",
  primary: "#135EF2",
};

/* ─── Transaction type ───────────────────────────────────────────────────── */
type TxStatus = "completed" | "pending" | "failed" | "processing" | "cancelled" | "refunded" | "reversed";

interface Transaction {
  id:        string;
  name:      string;
  cat:       string;
  date:      string;
  time:      string;
  ts:        number;
  amount:    string;
  amountRaw: number;
  fee:       string;
  ref:       string;
  positive:  boolean;
  status:    TxStatus;
  note:      string;
  icon:      React.ComponentProps<typeof Feather>["name"];
  iconBg:    string;
  iconColor: string;
}

/* ─── Transaction dataset ────────────────────────────────────────────────── */
const ALL_TX: Transaction[] = [
  {
    id:"1",  name:"Amazon Gift Card",   cat:"Gift Card", date:"Apr 28, 2024", time:"09:14 AM",
    ts: new Date("2024-04-28").getTime(), amount:"₦200,040",  amountRaw:200040,
    fee:"₦200", ref:"TXN-84920-GC", positive:true,  status:"completed",
    note:"Amazon US $120 gift card", icon:"gift",             iconBg:"#FFF2CF", iconColor:"#5C4000",
  },
  {
    id:"2",  name:"Bitcoin Sale",       cat:"Crypto",    date:"Jun 23, 2025", time:"02:47 PM",
    ts: new Date("2025-06-23").getTime(), amount:"₦185,000",  amountRaw:185000,
    fee:"₦500", ref:"TXN-29183-CR", positive:true,  status:"completed",
    note:"0.0021 BTC @ ₦88,095,238/BTC", icon:"trending-up",      iconBg:"#FFF7ED", iconColor:"#F7931A",
  },
  {
    id:"3",  name:"Electricity Bill",  cat:"Bills",     date:"Jun 22, 2025", time:"11:05 AM",
    ts: new Date("2025-06-22").getTime(), amount:"₦5,000",    amountRaw:5000,
    fee:"₦100", ref:"TXN-77641-BL", positive:false, status:"completed",
    note:"EKEDC prepaid meter top-up", icon:"zap",              iconBg:"#FFFBEB", iconColor:"#D97706",
  },
  {
    id:"4",  name:"MTN Airtime",        cat:"Airtime",   date:"Jun 22, 2025", time:"08:30 AM",
    ts: new Date("2025-06-22").getTime(), amount:"₦2,000",    amountRaw:2000,
    fee:"₦0",   ref:"TXN-55302-AT", positive:false, status:"completed",
    note:"MTN 08012345678", icon:"phone",            iconBg:"#FEFCE8", iconColor:"#CA8A04",
  },
  {
    id:"5",  name:"Wallet Withdrawal", cat:"Wallet",    date:"Jun 21, 2025", time:"04:22 PM",
    ts: new Date("2025-06-21").getTime(), amount:"₦50,000",   amountRaw:50000,
    fee:"₦50",  ref:"TXN-66128-WD", positive:false, status:"completed",
    note:"Withdrawn to GTBank •••• 4821", icon:"arrow-up-circle",  iconBg:"#FFF0F0", iconColor:"#EF4444",
  },
  {
    id:"6",  name:"iTunes Gift Card",  cat:"Gift Card", date:"Jun 20, 2025", time:"01:18 PM",
    ts: new Date("2025-06-20").getTime(), amount:"₦92,400",   amountRaw:92400,
    fee:"₦200", ref:"TXN-10293-GC", positive:true,  status:"pending",
    note:"Apple iTunes US $50 gift card — under review", icon:"gift",             iconBg:"#FFF2CF", iconColor:"#5C4000",
  },
  {
    id:"7",  name:"DSTV Subscription", cat:"Bills",     date:"Jun 19, 2025", time:"10:00 AM",
    ts: new Date("2025-06-19").getTime(), amount:"₦7,900",    amountRaw:7900,
    fee:"₦100", ref:"TXN-38841-BL", positive:false, status:"completed",
    note:"DSTV Premium — IUC 1234567890", icon:"tv",               iconBg:"#FFF1F2", iconColor:"#E11D48",
  },
  {
    id:"8",  name:"Wallet Funding",    cat:"Wallet",    date:"Jun 17, 2025", time:"03:55 PM",
    ts: new Date("2025-06-17").getTime(), amount:"₦100,000",  amountRaw:100000,
    fee:"₦0",   ref:"TXN-92011-WF", positive:true,  status:"completed",
    note:"Funded from GTBank via bank transfer", icon:"arrow-down-circle",iconBg:"#F0FFF4", iconColor:"#00B03C",
  },
  {
    id:"9",  name:"Deposit Gift Card", cat:"Gift Card", date:"Feb 24, 2022", time:"05:40 PM",
    ts: new Date("2022-02-24").getTime(), amount:"₦200,040",  amountRaw:200040,
    fee:"₦200", ref:"TXN-40021-GC", positive:true,  status:"completed",
    note:"Vanilla Visa $120 gift card", icon:"gift",             iconBg:"#FFF2CF", iconColor:"#5C4000",
  },
  {
    id:"10", name:"Withdrawal",        cat:"Wallet",    date:"Feb 24, 2022", time:"06:12 PM",
    ts: new Date("2022-02-24").getTime(), amount:"₦400,000",  amountRaw:400000,
    fee:"₦50",  ref:"TXN-73950-WD", positive:false, status:"completed",
    note:"Withdrawn to Access Bank •••• 9934", icon:"arrow-up-right",   iconBg:"#FFF0F0", iconColor:"#EF4444",
  },
  {
    id:"11", name:"Spotify Premium",   cat:"Bills",     date:"Jun 15, 2025", time:"12:00 PM",
    ts: new Date("2025-06-15").getTime(), amount:"₦3,200",    amountRaw:3200,
    fee:"₦0",   ref:"TXN-61122-BL", positive:false, status:"completed",
    note:"Spotify Premium monthly — auto-renew", icon:"music",            iconBg:"#F5F3FF", iconColor:"#7C3AED",
  },
  {
    id:"12", name:"Steam Gift Card",   cat:"Gift Card", date:"Jun 12, 2025", time:"11:31 AM",
    ts: new Date("2025-06-12").getTime(), amount:"₦45,000",   amountRaw:45000,
    fee:"₦200", ref:"TXN-58801-GC", positive:true,  status:"completed",
    note:"Steam Wallet US $25 gift card", icon:"gift",             iconBg:"#FFF2CF", iconColor:"#5C4000",
  },
  {
    id:"13", name:"Ethereum Sale",     cat:"Crypto",    date:"Jun 10, 2025", time:"09:03 AM",
    ts: new Date("2025-06-10").getTime(), amount:"₦312,000",  amountRaw:312000,
    fee:"₦500", ref:"TXN-14420-CR", positive:true,  status:"completed",
    note:"0.1 ETH @ ₦3,120,000/ETH", icon:"trending-up",      iconBg:"#FFF7ED", iconColor:"#627EEA",
  },
  {
    id:"14", name:"WAEC Data Bundle",  cat:"Airtime",   date:"Jun 8, 2025",  time:"07:45 AM",
    ts: new Date("2025-06-08").getTime(), amount:"₦1,500",    amountRaw:1500,
    fee:"₦0",   ref:"TXN-33672-AT", positive:false, status:"pending",
    note:"1GB data — 09087654321", icon:"wifi",             iconBg:"#EFF6FF", iconColor:"#3B82F6",
  },
];

/* ─── API transaction type + mapper ─────────────────────────────────────── */
interface ApiTransaction {
  id:          string;
  type:        "credit" | "debit";
  status:      "pending" | "completed" | "failed";
  category:    string;
  amountKobo:  number;
  description: string;
  externalRef?: string;
  createdAt:   string;
}

function apiTxToLocal(t: ApiTransaction): Transaction {
  const date     = new Date(t.createdAt);
  const dateStr  = date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const timeStr  = date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
  const amtNaira = t.amountKobo / 100;
  const amtStr   = "₦" + amtNaira.toLocaleString("en-NG");

  type Icon = React.ComponentProps<typeof Feather>["name"];
  const catMap: Record<string, { cat: string; icon: Icon; iconBg: string; iconColor: string }> = {
    wallet_funding: { cat: "Wallet",    icon: "arrow-down-circle", iconBg: "#F0FFF4", iconColor: "#00B03C" },
    bill_payment:   { cat: "Bills",     icon: "zap",               iconBg: "#FFFBEB", iconColor: "#D97706" },
    gift_card:      { cat: "Gift Card", icon: "gift",              iconBg: "#FFF2CF", iconColor: "#5C4000" },
    airtime:        { cat: "Airtime",   icon: "phone",             iconBg: "#FEFCE8", iconColor: "#CA8A04" },
    esim:           { cat: "eSIM",      icon: "globe",             iconBg: "#EFF6FF", iconColor: "#3B82F6" },
    withdrawal:     { cat: "Wallet",    icon: "arrow-up-circle",   iconBg: "#FFF0F0", iconColor: "#EF4444" },
    transfer:       { cat: "Wallet",    icon: "arrow-right-circle",iconBg: "#F5F3FF", iconColor: "#7C3AED" },
  };

  const meta = catMap[t.category] ?? { cat: "Other", icon: "circle" as Icon, iconBg: "#F0F0F0", iconColor: "#888" };

  const statusMap: Record<string, TxStatus> = {
    pending:    "pending",
    completed:  "completed",
    failed:     "failed",
    processing: "processing",
    cancelled:  "cancelled",
    refunded:   "refunded",
    reversed:   "reversed",
  };

  return {
    id:        t.id,
    name:      t.description || meta.cat,
    cat:       meta.cat,
    date:      dateStr,
    time:      timeStr,
    ts:        date.getTime(),
    amount:    amtStr,
    amountRaw: amtNaira,
    fee:       "₦0",
    ref:       t.externalRef || `TXN-${t.id.slice(0, 8).toUpperCase()}`,
    positive:  t.type === "credit",
    status:    statusMap[t.status] ?? "completed",
    note:      t.description,
    icon:      meta.icon,
    iconBg:    meta.iconBg,
    iconColor: meta.iconColor,
  };
}

/* ─── Filter types ───────────────────────────────────────────────────────── */
type TxFilter  = "All" | "Credit" | "Debit" | "Pending";
type DateRange = "all" | "7d" | "30d" | "3m";

const TX_FILTERS:  TxFilter[]  = ["All", "Credit", "Debit", "Pending"];
const DATE_RANGES: { key: DateRange; label: string }[] = [
  { key: "all", label: "All time" },
  { key: "7d",  label: "7 days"   },
  { key: "30d", label: "30 days"  },
  { key: "3m",  label: "3 months" },
];

const STATUS_STYLE: Record<TxStatus, { bg: string; color: string; label: string }> = {
  completed:  { bg: "#E8F7EF", color: "#00B03C", label: "Completed"  },
  pending:    { bg: "#FFFBEB", color: "#D97706", label: "Pending"    },
  failed:     { bg: "#FFF0F0", color: "#EF4444", label: "Failed"     },
  processing: { bg: "#EFF6FF", color: "#2563EB", label: "Processing" },
  cancelled:  { bg: "#F5F5F5", color: "#6B7280", label: "Cancelled"  },
  refunded:   { bg: "#F5F3FF", color: "#7C3AED", label: "Refunded"   },
  reversed:   { bg: "#FFF0F0", color: "#DC2626", label: "Reversed"   },
};

/** Steps shown in the status timeline for each status */
const STATUS_TIMELINE: Record<TxStatus, { label: string; done: boolean }[]> = {
  pending:    [{ label: "Initiated", done: true  }, { label: "Processing", done: false }, { label: "Completed", done: false }],
  processing: [{ label: "Initiated", done: true  }, { label: "Processing", done: true  }, { label: "Completed", done: false }],
  completed:  [{ label: "Initiated", done: true  }, { label: "Processing", done: true  }, { label: "Completed", done: true  }],
  failed:     [{ label: "Initiated", done: true  }, { label: "Processing", done: true  }, { label: "Failed",    done: true  }],
  cancelled:  [{ label: "Initiated", done: true  }, { label: "Cancelled",  done: true  }],
  refunded:   [{ label: "Initiated", done: true  }, { label: "Completed",  done: true  }, { label: "Refunded",  done: true  }],
  reversed:   [{ label: "Initiated", done: true  }, { label: "Completed",  done: true  }, { label: "Reversed",  done: true  }],
};

/* ─── Highlight matched search text ─────────────────────────────────────── */
function HighlightText({ text, query, style }: { text: string; query: string; style: object }) {
  if (!query.trim()) return <Text style={style} numberOfLines={1}>{text}</Text>;
  const lower  = text.toLowerCase();
  const qLower = query.toLowerCase().trim();
  const idx    = lower.indexOf(qLower);
  if (idx === -1) return <Text style={style} numberOfLines={1}>{text}</Text>;
  return (
    <Text style={style} numberOfLines={1}>
      {text.slice(0, idx)}
      <Text style={{ backgroundColor: "#FEF3C7", color: "#92400E" }}>
        {text.slice(idx, idx + qLower.length)}
      </Text>
      {text.slice(idx + qLower.length)}
    </Text>
  );
}

/* ─── Receipt row ────────────────────────────────────────────────────────── */
function ReceiptRow({ label, value, valueColor, bold }: {
  label: string; value: string; valueColor?: string; bold?: boolean;
}) {
  return (
    <View style={r.row}>
      <Text style={r.label}>{label}</Text>
      <Text style={[r.value, bold && r.valueBold, valueColor ? { color: valueColor } : undefined]}>
        {value}
      </Text>
    </View>
  );
}

const r = StyleSheet.create({
  row:       { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 9 },
  label:     { fontSize: 12, fontFamily: "Manrope_400Regular", color: C.textSec },
  value:     { fontSize: 12, fontFamily: "Manrope_500Medium", color: C.text, textAlign: "right", flex: 1, marginLeft: 12 },
  valueBold: { fontFamily: "Manrope_700Bold" },
});

/* ─── Copy chip ──────────────────────────────────────────────────────────── */
function CopyChip({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);
  const sc = useSharedValue(1);
  const style = useAnimatedStyle(() => ({ transform: [{ scale: sc.value }] }));

  const handleCopy = async () => {
    await Clipboard.setStringAsync(value);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    sc.value = withSpring(0.9, { damping: 10 }, () => { sc.value = withSpring(1); });
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Animated.View style={style}>
      <TouchableOpacity
        style={cc.chip}
        onPress={handleCopy}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Feather name={copied ? "check" : "copy"} size={12} color={copied ? C.success : C.primary} />
        <Text style={[cc.text, { color: copied ? C.success : C.primary }]}>
          {copied ? "Copied!" : label}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const cc = StyleSheet.create({
  chip: { flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8, backgroundColor: "#EFF6FF", borderWidth: 1, borderColor: "#BFDBFE" },
  text: { fontSize: 12, fontFamily: "Manrope_600SemiBold" },
});

/* ─── Status timeline ────────────────────────────────────────────────────── */
function StatusTimeline({ status }: { status: TxStatus }) {
  const steps = STATUS_TIMELINE[status];
  const failureStep = status === "failed" || status === "cancelled" || status === "reversed" || status === "refunded";
  return (
    <View style={tl.wrap}>
      {steps.map((step, i) => {
        const isLast    = i === steps.length - 1;
        const isFailed  = failureStep && i === steps.length - 1;
        const dotColor  = !step.done
          ? "#E5E7EB"
          : isFailed
          ? STATUS_STYLE[status].color
          : "#00B03C";
        const lineColor = i < steps.length - 1 && steps[i + 1].done ? "#00B03C" : "#E5E7EB";
        return (
          <View key={step.label} style={tl.stepRow}>
            <View style={tl.rail}>
              <View style={[tl.dot, { backgroundColor: dotColor, borderColor: step.done ? dotColor : "#D1D5DB" }]}>
                {step.done && (
                  <Feather
                    name={isFailed ? "x" : "check"}
                    size={10}
                    color="#FFFFFF"
                  />
                )}
              </View>
              {!isLast && <View style={[tl.line, { backgroundColor: lineColor }]} />}
            </View>
            <View style={tl.stepInfo}>
              <Text style={[tl.stepLabel, step.done && tl.stepLabelDone]}>{step.label}</Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}

const tl = StyleSheet.create({
  wrap:         { paddingVertical: 4 },
  stepRow:      { flexDirection: "row", alignItems: "flex-start", minHeight: 36 },
  rail:         { alignItems: "center", width: 24, marginRight: 10 },
  dot:          { width: 20, height: 20, borderRadius: 10, borderWidth: 1.5, alignItems: "center", justifyContent: "center" },
  line:         { width: 2, flex: 1, minHeight: 14, borderRadius: 1 },
  stepInfo:     { flex: 1, paddingTop: 1, paddingBottom: 10 },
  stepLabel:    { fontSize: 13, fontFamily: "Manrope_400Regular", color: C.textMut },
  stepLabelDone:{ fontFamily: "Manrope_600SemiBold", color: C.text },
});

/* ─── Transaction detail sheet ───────────────────────────────────────────── */
function TxDetailSheet({ tx, visible, onClose }: {
  tx: Transaction | null;
  visible: boolean;
  onClose: () => void;
}) {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const handleRepeat = useCallback(() => {
    if (!tx) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // Route to the relevant service based on category
    const routeMap: Record<string, string> = {
      "Airtime":    "/(app)/airtime",
      "Bills":      "/(app)/bills",
      "Gift Card":  "/(app)/sell-gift-card",
      "Crypto":     "/(app)/crypto",
      "Wallet":     "/(app)/withdraw",
    };
    const route = routeMap[tx.cat];
    if (route) { onClose(); setTimeout(() => router.push(route as any), 320); }
  }, [tx, onClose, router]);

  const handleShare = useCallback(async () => {
    if (!tx) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const sign = tx.positive ? "+" : "-";
    const feeNum = parseInt(tx.fee.replace(/[₦,]/g, "")) || 0;
    const totalNum = tx.positive
      ? tx.amountRaw - feeNum
      : tx.amountRaw + feeNum;
    const totalStr = "₦" + totalNum.toLocaleString("en-NG");

    try {
      await Share.share({
        message: [
          `PAYVORA Transaction Receipt`,
          `──────────────────────`,
          `${tx.name}`,
          `Amount:    ${sign}${tx.amount}`,
          `Fee:       ${tx.fee}`,
          `Net total: ${sign}${totalStr}`,
          `Status:    ${STATUS_STYLE[tx.status].label}`,
          `Date:      ${tx.date} at ${tx.time}`,
          `Ref:       ${tx.ref}`,
          `Note:      ${tx.note}`,
        ].join("\n"),
        title: `PAYVORA Receipt — ${tx.ref}`,
      });
    } catch {}
  }, [tx]);

  const handleDownloadPDF = useCallback(async () => {
    if (!tx) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    /** Escape HTML-significant chars so user/API text can't break the PDF layout */
    const esc = (s: string) =>
      s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

    const sign    = tx.positive ? "+" : "-";
    const feeNum  = parseInt(tx.fee.replace(/[₦,]/g, "")) || 0;
    const netNum  = tx.positive ? tx.amountRaw - feeNum : tx.amountRaw + feeNum;
    const netStr  = "₦" + netNum.toLocaleString("en-NG");
    const st      = STATUS_STYLE[tx.status];
    const txId    = `TXN-${tx.id.padStart(6, "0")}`;

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Arial, Helvetica, sans-serif; background: #fff; color: #0B0A0A; padding: 48px 40px; }
    .logo { font-size: 22px; font-weight: 900; color: #061941; letter-spacing: -0.5px; margin-bottom: 4px; }
    .logo span { color: #00D9A0; }
    .tagline { font-size: 11px; color: #AAAFB5; margin-bottom: 32px; }
    .divider { border: none; border-top: 1.5px solid #F0F0F0; margin: 20px 0; }
    .divider-strong { border-top-color: #E5E7EB; }
    .receipt-title { font-size: 13px; font-weight: 700; color: #AAAFB5; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 16px; }
    .hero { text-align: center; margin-bottom: 28px; }
    .hero-amount { font-size: 36px; font-weight: 900; color: ${tx.positive ? "#00B03C" : "#EF4444"}; letter-spacing: -1px; }
    .hero-name { font-size: 15px; color: #595F67; margin-top: 4px; }
    .status-pill { display: inline-flex; align-items: center; gap: 6px; padding: 4px 14px; border-radius: 20px; background: ${st.bg}; margin-top: 10px; }
    .status-dot { width: 7px; height: 7px; border-radius: 50%; background: ${st.color}; }
    .status-text { font-size: 12px; font-weight: 700; color: ${st.color}; }
    .row { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; }
    .row-label { font-size: 12px; color: #595F67; }
    .row-value { font-size: 12px; font-weight: 600; color: #0B0A0A; text-align: right; }
    .row-value.green { color: #00B03C; }
    .row-value.red { color: #EF4444; }
    .row-value.bold { font-weight: 800; font-size: 13px; }
    .section { margin-bottom: 20px; }
    .footer { margin-top: 36px; text-align: center; font-size: 10px; color: #AAAFB5; line-height: 1.6; }
    .ref-box { background: #F8F9FA; border: 1px solid #F0F0F0; border-radius: 8px; padding: 10px 14px; margin-top: 8px; font-size: 11px; color: #595F67; font-family: monospace; word-break: break-all; }
  </style>
</head>
<body>
  <div class="logo">PAY<span>VORA</span></div>
  <div class="tagline">Official Transaction Receipt</div>

  <div class="hero">
    <div class="hero-amount">${sign}${esc(tx.amount)}</div>
    <div class="hero-name">${esc(tx.name)}</div>
    <div class="status-pill">
      <div class="status-dot"></div>
      <span class="status-text">${esc(st.label)}</span>
    </div>
  </div>

  <hr class="divider"/>

  <div class="section">
    <div class="receipt-title">Receipt Breakdown</div>
    <div class="row">
      <span class="row-label">Amount</span>
      <span class="row-value ${tx.positive ? "green" : "red"}">${sign}${esc(tx.amount)}</span>
    </div>
    <hr class="divider"/>
    <div class="row">
      <span class="row-label">Fee</span>
      <span class="row-value ${tx.fee === "₦0" ? "green" : ""}">${tx.fee === "₦0" ? "Free" : "-" + esc(tx.fee)}</span>
    </div>
    <hr class="divider divider-strong"/>
    <div class="row">
      <span class="row-label">Net Total</span>
      <span class="row-value bold ${tx.positive ? "green" : "red"}">${sign}${esc(netStr)}</span>
    </div>
  </div>

  <hr class="divider"/>

  <div class="section">
    <div class="receipt-title">Transaction Details</div>
    <div class="row"><span class="row-label">Date</span><span class="row-value">${esc(tx.date)}</span></div>
    <hr class="divider"/>
    <div class="row"><span class="row-label">Time</span><span class="row-value">${esc(tx.time)}</span></div>
    <hr class="divider"/>
    <div class="row"><span class="row-label">Category</span><span class="row-value">${esc(tx.cat)}</span></div>
    <hr class="divider"/>
    <div class="row"><span class="row-label">Type</span><span class="row-value">${tx.positive ? "Credit" : "Debit"}</span></div>
    <hr class="divider"/>
    <div class="row"><span class="row-label">Payment Method</span><span class="row-value">${tx.cat === "Wallet" ? "PAYVORA Wallet" : esc(tx.cat) + " transaction"}</span></div>
    ${tx.note ? `<hr class="divider"/><div class="row"><span class="row-label">Note</span><span class="row-value" style="max-width:55%;text-align:right;">${esc(tx.note)}</span></div>` : ""}
  </div>

  <hr class="divider"/>

  <div class="section">
    <div class="receipt-title">Reference</div>
    <div class="ref-box">Reference ID: ${esc(tx.ref)}</div>
    <div class="ref-box" style="margin-top:6px;">Transaction ID: ${esc(txId)}</div>
  </div>

  <div class="footer">
    Generated by PAYVORA · payvora.org<br/>
    This is an official receipt. Keep for your records.<br/>
    ${new Date().toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" })}
  </div>
</body>
</html>`;

    try {
      const { uri } = await Print.printToFileAsync({ html, base64: false });
      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(uri, {
          mimeType: "application/pdf",
          dialogTitle: `PAYVORA Receipt — ${tx.ref}`,
          UTI: "com.adobe.pdf",
        });
      } else {
        // Sharing not available (e.g. some Android emulators) — fall back to text share
        await Share.share({
          message: `PAYVORA Transaction Receipt\n${tx.name}\n${sign}${tx.amount}\nRef: ${tx.ref}\n${tx.date} ${tx.time}`,
          title: `PAYVORA Receipt — ${tx.ref}`,
        });
      }
    } catch (err) {
      console.warn("PDF generation failed:", err);
    }
  }, [tx]);

  if (!tx) return null;

  const feeNum  = parseInt(tx.fee.replace(/[₦,]/g, "")) || 0;
  const netNum  = tx.positive ? tx.amountRaw - feeNum : tx.amountRaw + feeNum;
  const netStr  = "₦" + netNum.toLocaleString("en-NG");
  const st      = STATUS_STYLE[tx.status];
  const sign    = tx.positive ? "+" : "-";

  return (
    <AnimatedSheet
      visible={visible}
      onClose={onClose}
      maxHeight="82%"
      sheetStyle={{ paddingHorizontal: 0, paddingTop: 0, paddingBottom: 0 }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[ds.scroll, { paddingTop: 20, paddingBottom: insets.bottom + 16 }]}
        bounces={false}
      >
        {/* ── Hero ── */}
        <View style={ds.hero}>
          <View style={[ds.heroIcon, { backgroundColor: tx.iconBg }]}>
            <Feather name={tx.icon} size={28} color={tx.iconColor} />
          </View>

          <Text style={[ds.heroAmount, { color: tx.positive ? C.success : C.danger }]}>
            {sign}{tx.amount}
          </Text>
          <Text style={ds.heroName}>{tx.name}</Text>

          <View style={[ds.statusPill, { backgroundColor: st.bg, borderColor: st.color + "33" }]}>
            <View style={[ds.statusDot, { backgroundColor: st.color }]} />
            <Text style={[ds.statusText, { color: st.color }]}>{st.label}</Text>
          </View>
        </View>

        {/* ── Note ── */}
        {tx.note ? (
          <View style={ds.noteBox}>
            <Feather name="info" size={13} color={C.textMut} />
            <Text style={ds.noteText}>{tx.note}</Text>
          </View>
        ) : null}

        {/* ── Status timeline ── */}
        <View style={ds.section}>
          <Text style={ds.sectionTitle}>Transaction Progress</Text>
          <View style={[ds.card, { paddingHorizontal: 14, paddingTop: 10, paddingBottom: 2 }]}>
            <StatusTimeline status={tx.status} />
          </View>
        </View>

        {/* ── Receipt breakdown ── */}
        <View style={ds.section}>
          <Text style={ds.sectionTitle}>Receipt</Text>
          <View style={ds.card}>
            <ReceiptRow label="Amount"    value={`${sign}${tx.amount}`} valueColor={tx.positive ? C.success : C.danger} />
            <View style={ds.rowDivider} />
            <ReceiptRow label="Fee"       value={tx.fee === "₦0" ? "Free" : `-${tx.fee}`} valueColor={tx.fee === "₦0" ? C.success : undefined} />
            <View style={[ds.rowDivider, ds.rowDividerStrong]} />
            <ReceiptRow label="Net total" value={`${sign}${netStr}`} bold valueColor={tx.positive ? C.success : C.danger} />
          </View>
        </View>

        {/* ── Transaction details ── */}
        <View style={ds.section}>
          <Text style={ds.sectionTitle}>Details</Text>
          <View style={ds.card}>
            <ReceiptRow label="Date"          value={tx.date} />
            <View style={ds.rowDivider} />
            <ReceiptRow label="Time"          value={tx.time} />
            <View style={ds.rowDivider} />
            <ReceiptRow label="Category"      value={tx.cat}  />
            <View style={ds.rowDivider} />
            <ReceiptRow label="Type"          value={tx.positive ? "Credit" : "Debit"} />
            <View style={ds.rowDivider} />
            <ReceiptRow
              label={tx.positive ? "Sender" : "Recipient"}
              value={tx.positive ? "External transfer" : tx.note.split(" — ")[0] || "PAYVORA"}
            />
            <View style={ds.rowDivider} />
            <ReceiptRow label="Payment method" value={tx.cat === "Wallet" ? "PAYVORA Wallet" : `${tx.cat} transaction`} />
            <View style={ds.rowDivider} />
            <View style={[r.row, { paddingVertical: 9 }]}>
              <Text style={r.label}>Reference ID</Text>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8, flex: 1, justifyContent: "flex-end" }}>
                <Text style={[r.value, { flex: 0 }]} numberOfLines={1}>{tx.ref}</Text>
                <CopyChip value={tx.ref} label="Copy" />
              </View>
            </View>
            <View style={ds.rowDivider} />
            <View style={[r.row, { paddingVertical: 9 }]}>
              <Text style={r.label}>Transaction ID</Text>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8, flex: 1, justifyContent: "flex-end" }}>
                <Text style={[r.value, { flex: 0 }]} numberOfLines={1}>{`TXN-${tx.id.padStart(6, "0")}`}</Text>
                <CopyChip value={`TXN-${tx.id.padStart(6, "0")}`} label="Copy" />
              </View>
            </View>
          </View>
        </View>

        {/* ── Actions ── */}
        <View style={ds.actions}>
          <View style={ds.actionsRow}>
            <TouchableOpacity style={[ds.shareBtn, { flex: 1 }]} onPress={handleShare} activeOpacity={0.82}>
              <Feather name="share-2" size={15} color="#FFFFFF" />
              <Text style={ds.shareBtnText}>Share</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[ds.pdfBtn, { flex: 1 }]} onPress={handleDownloadPDF} activeOpacity={0.82}>
              <Feather name="download" size={15} color={C.navy} />
              <Text style={ds.pdfBtnText}>Download PDF</Text>
            </TouchableOpacity>
          </View>

          {/* Repeat transaction */}
          {(tx.status === "completed") && (
            <TouchableOpacity style={ds.repeatBtn} onPress={handleRepeat} activeOpacity={0.82}>
              <Feather name="repeat" size={15} color={C.primary} />
              <Text style={ds.repeatBtnText}>Repeat Transaction</Text>
            </TouchableOpacity>
          )}

          {tx.status === "pending" && (
            <TouchableOpacity
              style={ds.cancelBtn}
              activeOpacity={0.82}
              onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); onClose(); }}
            >
              <Text style={ds.cancelBtnText}>Cancel Transaction</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={ds.closeBtn} onPress={onClose} activeOpacity={0.72}>
            <Text style={ds.closeBtnText}>Close</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </AnimatedSheet>
  );
}

const ds = StyleSheet.create({
  scroll: { paddingHorizontal: 18 },

  /* Hero */
  hero:       { alignItems: "center", gap: 5, paddingBottom: 14 },
  heroIcon:   { width: 52, height: 52, borderRadius: 16, alignItems: "center", justifyContent: "center", marginBottom: 2 },
  heroAmount: { fontSize: rf(26), fontFamily: "Manrope_700Bold", fontVariant: ["tabular-nums"], letterSpacing: -0.5 },
  heroName:   { fontSize: rf(14), fontFamily: "Manrope_600SemiBold", color: C.text },
  statusPill: { flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, borderWidth: 1 },
  statusDot:  { width: 5, height: 5, borderRadius: 3 },
  statusText: { fontSize: 12, fontFamily: "Manrope_600SemiBold" },

  /* Note */
  noteBox: { flexDirection: "row", alignItems: "flex-start", gap: 7, backgroundColor: "#F8F9FA", borderRadius: 10, padding: 10, marginBottom: 12, borderWidth: 1, borderColor: C.border },
  noteText: { flex: 1, fontSize: 12, fontFamily: "Manrope_400Regular", color: C.textSec, lineHeight: 17 },

  /* Sections */
  section:      { marginBottom: 12 },
  sectionTitle: { fontSize: 10, fontFamily: "Manrope_700Bold", color: C.textMut, textTransform: "uppercase", letterSpacing: 0.7, marginBottom: 6 },
  card:         { borderRadius: 14, borderWidth: 1, borderColor: C.border, backgroundColor: C.bg, paddingHorizontal: 14, overflow: "hidden" },
  rowDivider:        { height: 1, backgroundColor: "#F3F4F6" },
  rowDividerStrong:  { backgroundColor: "#E5E7EB", marginVertical: 1 },

  /* Actions */
  actions:       { gap: 8, marginTop: 2 },
  actionsRow:    { flexDirection: "row", gap: 10 },
  shareBtn:      { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 7, height: 44, borderRadius: 12, backgroundColor: C.navy },
  shareBtnText:  { fontSize: rf(13), fontFamily: "Manrope_700Bold", color: "#FFFFFF" },
  pdfBtn:        { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 7, height: 44, borderRadius: 12, backgroundColor: "#F0F4FF", borderWidth: 1, borderColor: "#C7D5F5" },
  pdfBtnText:    { fontSize: rf(13), fontFamily: "Manrope_700Bold", color: C.navy },
  cancelBtn:     { height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center", backgroundColor: "#FFF0F0", borderWidth: 1, borderColor: "#FECACA" },
  cancelBtnText: { fontSize: 13, fontFamily: "Manrope_600SemiBold", color: C.danger },
  repeatBtn:     { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 7, height: 42, borderRadius: 12, backgroundColor: "#EFF6FF", borderWidth: 1, borderColor: "#BFDBFE" },
  repeatBtnText: { fontSize: rf(13), fontFamily: "Manrope_600SemiBold", color: C.primary },
  closeBtn:      { height: 38, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  closeBtnText:  { fontSize: 13, fontFamily: "Manrope_500Medium", color: C.textMut },
});

/* ─── Main screen ────────────────────────────────────────────────────────── */
export default function HistoryScreen() {
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 40 : insets.top;
  const { user } = useAuth();

  const [txData,     setTxData]     = useState<Transaction[]>(ALL_TX);
  const [txFilter,   setTxFilter]   = useState<TxFilter>("All");
  const [dateRange,  setDateRange]  = useState<DateRange>("all");
  const [searchText, setSearchText] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [selected,   setSelected]   = useState<Transaction | null>(null);
  const [sheetOpen,  setSheetOpen]  = useState(false);

  /* ─── Fetch real transactions from API ── */
  useEffect(() => {
    apiFetch<{ transactions: ApiTransaction[] }>("/wallet/transactions")
      .then(({ transactions }) => {
        if (transactions.length > 0) {
          setTxData(transactions.map(apiTxToLocal));
        }
      })
      .catch(() => { /* keep mock data on error */ });
  }, [user?.id]);

  const searchRef = useRef<TextInput>(null);

  /* ─── Search bar animation ── */
  const searchH  = useSharedValue(0);
  const searchOp = useSharedValue(0);
  const searchBarStyle = useAnimatedStyle(() => ({
    height:   searchH.value,
    opacity:  searchOp.value,
    overflow: "hidden",
  }));

  const toggleSearch = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (searchOpen) {
      searchH.value  = withTiming(0, { duration: 220 });
      searchOp.value = withTiming(0, { duration: 180 });
      setSearchText("");
      setSearchOpen(false);
    } else {
      setSearchOpen(true);
      searchH.value  = withSpring(52, { damping: 18, stiffness: 280 });
      searchOp.value = withTiming(1, { duration: 200 });
      setTimeout(() => searchRef.current?.focus(), 180);
    }
  }, [searchOpen]);

  /* ─── Date range cutoff ── */
  const dateFrom = useMemo(() => {
    const now = Date.now();
    if (dateRange === "7d")  return now - 7  * 86400000;
    if (dateRange === "30d") return now - 30 * 86400000;
    if (dateRange === "3m")  return now - 90 * 86400000;
    return 0;
  }, [dateRange]);

  /* ─── Combined filter ── */
  const filtered = useMemo(() => {
    const q = searchText.toLowerCase().trim();
    return txData.filter(t => {
      if (txFilter === "Credit"  && !t.positive)            return false;
      if (txFilter === "Debit"   && t.positive)             return false;
      if (txFilter === "Pending" && t.status !== "pending") return false;
      if (dateFrom > 0 && t.ts < dateFrom)                  return false;
      if (q && !t.name.toLowerCase().includes(q) && !t.cat.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [txData, txFilter, dateFrom, searchText]);

  /* ─── Totals (filtered) ── */
  const totalIn  = filtered.filter(t =>  t.positive).reduce((s, t) => s + t.amountRaw, 0);
  const totalOut = filtered.filter(t => !t.positive).reduce((s, t) => s + t.amountRaw, 0);

  const activeFilters = (txFilter !== "All" ? 1 : 0) + (dateRange !== "all" ? 1 : 0) + (searchText ? 1 : 0);

  const clearAll = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setTxFilter("All");
    setDateRange("all");
    setSearchText("");
  }, []);

  /* ─── Open detail sheet ── */
  const openDetail = useCallback((tx: Transaction) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelected(tx);
    setSheetOpen(true);
  }, []);

  const closeDetail = useCallback(() => {
    setSheetOpen(false);
  }, []);

  /* ─── Group by time period ── */
  const grouped = useMemo(() => {
    const now = Date.now();
    const buckets: Record<string, Transaction[]> = {};
    for (const t of filtered) {
      const days = (now - t.ts) / 86400000;
      const key =
        days < 1  ? "Today" :
        days < 7  ? "This week" :
        days < 30 ? "This month" :
        days < 90 ? "Last 3 months" : "Older";
      if (!buckets[key]) buckets[key] = [];
      buckets[key].push(t);
    }
    const order = ["Today", "This week", "This month", "Last 3 months", "Older"];
    return order.flatMap(k => buckets[k]?.length ? [{ title: k, data: buckets[k] }] : []);
  }, [filtered]);

  type ListItem =
    | { type: "header"; title: string; key: string }
    | { type: "tx"; tx: Transaction; isLast: boolean; key: string };

  const listData = useMemo<ListItem[]>(() => {
    const items: ListItem[] = [];
    for (const sec of grouped) {
      items.push({ type: "header", title: sec.title, key: `h-${sec.title}` });
      sec.data.forEach((tx, i) =>
        items.push({ type: "tx", tx, isLast: i === sec.data.length - 1, key: `tx-${tx.id}` }),
      );
    }
    return items;
  }, [grouped]);

  return (
    <View style={[s.root, { paddingTop: topPad }]}>

      {/* ── Header ── */}
      <Animated.View entering={FadeInDown.duration(280)} style={s.header}>
        <Text style={s.title}>History</Text>
        <View style={s.headerRight}>
          {activeFilters > 0 && (
            <Animated.View entering={FadeIn.duration(180)} exiting={FadeOut.duration(140)}>
              <TouchableOpacity style={s.clearBtn} onPress={clearAll}>
                <Text style={s.clearBtnText}>Clear</Text>
                <View style={s.clearBadge}>
                  <Text style={s.clearBadgeText}>{activeFilters}</Text>
                </View>
              </TouchableOpacity>
            </Animated.View>
          )}
          <TouchableOpacity
            style={[s.iconBtn, searchOpen && s.iconBtnActive]}
            onPress={toggleSearch}
            hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
          >
            <Feather name={searchOpen ? "x" : "search"} size={18} color={searchOpen ? "#FFFFFF" : C.navy} />
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* ── Search bar ── */}
      <Animated.View style={[searchBarStyle, s.searchWrap]}>
        <View style={s.searchBox}>
          <Feather name="search" size={15} color={C.textMut} />
          <TextInput
            ref={searchRef}
            style={s.searchInput}
            placeholder="Search by merchant or category…"
            placeholderTextColor={C.textMut}
            value={searchText}
            onChangeText={setSearchText}
            returnKeyType="search"
            autoCorrect={false}
            autoCapitalize="none"
            clearButtonMode="while-editing"
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => setSearchText("")} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Feather name="x-circle" size={15} color={C.textMut} />
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>

      {/* ── Summary cards ── */}
      <Animated.View entering={FadeInDown.duration(320).delay(30)} style={s.summaryRow}>
        <View style={[s.summaryCard, { backgroundColor: "#F0FFF4", flex: 1 }]}>
          <View style={s.summaryTop}>
            <View style={[s.summaryIcon, { backgroundColor: "#C6F6D5" }]}>
              <Feather name="arrow-down" size={13} color={C.success} />
            </View>
            <Text style={[s.summaryLabel, { color: C.success }]}>Income</Text>
          </View>
          <Text style={[s.summaryAmt, { color: C.success }]}>
            ₦{totalIn.toLocaleString("en-NG")}
          </Text>
        </View>
        <View style={[s.summaryCard, { backgroundColor: "#FFF0F0", flex: 1 }]}>
          <View style={s.summaryTop}>
            <View style={[s.summaryIcon, { backgroundColor: "#FED7D7" }]}>
              <Feather name="arrow-up" size={13} color={C.danger} />
            </View>
            <Text style={[s.summaryLabel, { color: C.danger }]}>Expense</Text>
          </View>
          <Text style={[s.summaryAmt, { color: C.danger }]}>
            ₦{totalOut.toLocaleString("en-NG")}
          </Text>
        </View>
      </Animated.View>

      {/* ── Filter chips ── */}
      <Animated.View entering={FadeInDown.duration(290).delay(50)}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.chipScroll}>
          {TX_FILTERS.map(f => (
            <Pressable
              key={f}
              style={[s.chip, txFilter === f && s.chipActive]}
              onPress={() => { Haptics.selectionAsync(); setTxFilter(f); }}
            >
              <Text style={[s.chipText, txFilter === f && s.chipTextActive]}>{f}</Text>
            </Pressable>
          ))}
          <View style={s.chipDivider} />
          {DATE_RANGES.map(dr => (
            <Pressable
              key={dr.key}
              style={[s.chip, s.chipDate, dateRange === dr.key && s.chipDateActive]}
              onPress={() => { Haptics.selectionAsync(); setDateRange(dr.key); }}
            >
              {dr.key !== "all" && (
                <Feather name="calendar" size={11} color={dateRange === dr.key ? "#FFFFFF" : C.primary} />
              )}
              <Text style={[s.chipText, dateRange === dr.key && s.chipDateTextActive]}>{dr.label}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </Animated.View>

      {/* ── Result count ── */}
      <View style={s.resultRow}>
        <Text style={s.resultText}>
          {filtered.length === txData.length
            ? `${filtered.length} transactions`
            : `${filtered.length} of ${txData.length} transactions`}
        </Text>
        {filtered.length !== txData.length && (
          <Animated.View entering={FadeIn.duration(160)}>
            <Text style={s.resultFiltered}>· filtered</Text>
          </Animated.View>
        )}
      </View>

      {/* ── Transaction list ── */}
      <FlatList
        data={listData}
        keyExtractor={item => item.key}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[s.list, { paddingBottom: insets.bottom + 110 }]}
        ListEmptyComponent={
          <View style={s.empty}>
            <View style={s.emptyIconWrap}>
              <Feather name="search" size={24} color={C.textMut} />
            </View>
            <Text style={s.emptyTitle}>No results found</Text>
            <Text style={s.emptySubtitle}>
              {searchText
                ? `No transactions matching "${searchText}"`
                : "Try adjusting your filters"}
            </Text>
            {activeFilters > 0 && (
              <TouchableOpacity style={s.emptyBtn} onPress={clearAll}>
                <Text style={s.emptyBtnText}>Clear all filters</Text>
              </TouchableOpacity>
            )}
          </View>
        }
        renderItem={({ item, index }) => {
          if (item.type === "header") {
            return (
              <Animated.View entering={FadeInDown.duration(200).delay(index * 12)}>
                <Text style={s.sectionHeader}>{item.title}</Text>
              </Animated.View>
            );
          }

          const { tx, isLast } = item;
          return (
            <Animated.View entering={FadeInDown.duration(240).delay(Math.min(index * 18, 300))}>
              <TouchableOpacity
                style={s.txRow}
                activeOpacity={0.72}
                onPress={() => openDetail(tx)}
              >
                <View style={[s.txIcon, { backgroundColor: tx.iconBg }]}>
                  <Feather name={tx.icon} size={20} color={tx.iconColor} />
                </View>
                <View style={s.txInfo}>
                  <HighlightText text={tx.name} query={searchText} style={s.txName} />
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                    <Text style={s.txDate}>{tx.date}</Text>
                    <Text style={s.txDot}>·</Text>
                    <Text style={[s.txCat, { color: tx.iconColor }]}>{tx.cat}</Text>
                  </View>
                </View>
                <View style={s.txRight}>
                  <Text style={[s.txAmount, { color: tx.positive ? C.success : C.danger }]}>
                    {tx.positive ? "+" : "-"}{tx.amount}
                  </Text>
                  <View style={[s.statusBadge, { backgroundColor: STATUS_STYLE[tx.status].bg }]}>
                    <Text style={[s.statusText, { color: STATUS_STYLE[tx.status].color }]}>
                      {STATUS_STYLE[tx.status].label}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
              {!isLast && <View style={s.divider} />}
            </Animated.View>
          );
        }}
      />

      {/* ── Detail bottom sheet ── */}
      <TxDetailSheet tx={selected} visible={sheetOpen} onClose={closeDetail} />
    </View>
  );
}

/* ─── Styles ──────────────────────────────────────────────────────────────── */
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },

  header:      { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, paddingBottom: 10, paddingTop: 8 },
  title:       { fontSize: rf(22), fontFamily: "Manrope_700Bold", color: C.navy },
  headerRight: { flexDirection: "row", alignItems: "center", gap: 8 },

  iconBtn:       { width: 38, height: 38, borderRadius: 10, backgroundColor: "#F8F9FA", alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: C.border },
  iconBtnActive: { backgroundColor: C.navy, borderColor: C.navy },

  clearBtn:       { flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 10, paddingVertical: 7, borderRadius: 10, backgroundColor: "#FFF0F0", borderWidth: 1, borderColor: "#FECACA" },
  clearBtnText:   { fontSize: 12, fontFamily: "Manrope_600SemiBold", color: C.danger },
  clearBadge:     { minWidth: 18, height: 18, borderRadius: 9, backgroundColor: C.danger, alignItems: "center", justifyContent: "center", paddingHorizontal: 4 },
  clearBadgeText: { fontSize: 10, fontFamily: "Manrope_700Bold", color: "#FFFFFF" },

  searchWrap:  { paddingHorizontal: 20, paddingBottom: 4 },
  searchBox:   { flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: "#F8F9FA", borderRadius: 12, borderWidth: 1, borderColor: C.border, paddingHorizontal: 12, height: 44 },
  searchInput: { flex: 1, fontSize: 14, fontFamily: "Manrope_400Regular", color: C.text, paddingVertical: 0 },

  summaryRow:   { flexDirection: "row", gap: 12, paddingHorizontal: 20, marginBottom: 10 },
  summaryCard:  { borderRadius: 14, padding: 14, gap: 6 },
  summaryTop:   { flexDirection: "row", alignItems: "center", gap: 8 },
  summaryIcon:  { width: 26, height: 26, borderRadius: 8, alignItems: "center", justifyContent: "center" },
  summaryLabel: { fontSize: 12, fontFamily: "Manrope_600SemiBold" },
  summaryAmt:   { fontSize: rf(17), fontFamily: "Manrope_700Bold", fontVariant: ["tabular-nums"] },

  chipScroll:         { paddingHorizontal: 20, gap: 8, paddingBottom: 10, alignItems: "center" },
  chip:               { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, borderWidth: 1, borderColor: C.border, backgroundColor: "#F8F9FA" },
  chipActive:         { backgroundColor: C.navy, borderColor: C.navy },
  chipText:           { fontSize: 12, fontFamily: "Manrope_500Medium", color: C.textSec },
  chipTextActive:     { color: "#FFFFFF" },
  chipDivider:        { width: 1, height: 20, backgroundColor: C.border, marginHorizontal: 2 },
  chipDate:           { flexDirection: "row", alignItems: "center", gap: 5, backgroundColor: "#EFF6FF", borderColor: "#BFDBFE" },
  chipDateActive:     { backgroundColor: C.primary, borderColor: C.primary },
  chipDateTextActive: { color: "#FFFFFF" },

  resultRow:     { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 20, marginBottom: 4 },
  resultText:    { fontSize: 12, fontFamily: "Manrope_500Medium", color: C.textMut },
  resultFiltered:{ fontSize: 12, fontFamily: "Manrope_600SemiBold", color: C.primary },

  list:         { paddingHorizontal: 20, paddingTop: 2 },
  sectionHeader:{ fontSize: 12, fontFamily: "Manrope_700Bold", color: C.textMut, textTransform: "uppercase", letterSpacing: 0.6, marginTop: 14, marginBottom: 6 },

  txRow:    { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 13 },
  txIcon:   { width: 50, height: 50, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  txInfo:   { flex: 1, gap: 4 },
  txName:   { fontSize: 14, fontFamily: "Manrope_600SemiBold", color: C.text },
  txDate:   { fontSize: 11, fontFamily: "Manrope_400Regular", color: C.textMut },
  txDot:    { fontSize: 11, color: C.textMut },
  txCat:    { fontSize: 11, fontFamily: "Manrope_600SemiBold" },
  txRight:  { alignItems: "flex-end", gap: 5 },
  txAmount: { fontSize: 14, fontFamily: "Manrope_700Bold", fontVariant: ["tabular-nums"] },

  statusBadge: { paddingHorizontal: 7, paddingVertical: 2, borderRadius: 8 },
  statusText:  { fontSize: 10, fontFamily: "Manrope_600SemiBold" },
  divider:     { height: 1, backgroundColor: C.border },

  empty:        { alignItems: "center", paddingTop: 60, gap: 10 },
  emptyIconWrap:{ width: 60, height: 60, borderRadius: 20, backgroundColor: "#F8F9FA", alignItems: "center", justifyContent: "center", marginBottom: 4 },
  emptyTitle:   { fontSize: 16, fontFamily: "Manrope_700Bold", color: C.text },
  emptySubtitle:{ fontSize: 13, fontFamily: "Manrope_400Regular", color: C.textMut, textAlign: "center", paddingHorizontal: 32 },
  emptyBtn:     { marginTop: 8, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10, backgroundColor: "#EFF6FF", borderWidth: 1, borderColor: "#BFDBFE" },
  emptyBtnText: { fontSize: 13, fontFamily: "Manrope_600SemiBold", color: C.primary },
});
