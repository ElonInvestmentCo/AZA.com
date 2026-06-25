import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
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
import { PremiumEyeIcon } from "@/components/PremiumEyeIcon";

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

const CARD_ACTIONS = [
  { id: "freeze",  label: "Freeze",       icon: "pause-circle" as const, color: "#0891B2", bg: "#ECFEFF" },
  { id: "limit",   label: "Limit",        icon: "sliders"      as const, color: "#7C3AED", bg: "#F5F3FF" },
  { id: "topup",   label: "Top Up",       icon: "plus-circle"  as const, color: "#00B03C", bg: "#F0FFF4" },
  { id: "details", label: "Card Details", icon: "eye"          as const, color: "#E11D48", bg: "#FFF1F2" },
];

const TRANSACTIONS = [
  { id: "1", name: "Amazon Purchase", date: "Jun 23, 2025", amount: "₦12,500", positive: false, icon: "shopping-bag" as const, iconBg: "#FFF2CF", iconColor: "#5C4000" },
  { id: "2", name: "Card Top Up",     date: "Jun 22, 2025", amount: "₦50,000", positive: true,  icon: "arrow-down"  as const, iconBg: "#F0FFF4", iconColor: "#00B03C" },
  { id: "3", name: "Netflix",         date: "Jun 20, 2025", amount: "₦4,700",  positive: false, icon: "tv"          as const, iconBg: "#FFF1F2", iconColor: "#E11D48" },
  { id: "4", name: "Spotify",         date: "Jun 18, 2025", amount: "₦2,400",  positive: false, icon: "music"       as const, iconBg: "#F5F3FF", iconColor: "#7C3AED" },
  { id: "5", name: "Card Top Up",     date: "Jun 15, 2025", amount: "₦20,000", positive: true,  icon: "arrow-down"  as const, iconBg: "#F0FFF4", iconColor: "#00B03C" },
];

function ActionBtn({ item, onPress }: { item: typeof CARD_ACTIONS[number]; onPress: () => void }) {
  const sc   = useSharedValue(1);
  const anim = useAnimatedStyle(() => ({ transform: [{ scale: sc.value }] }));
  return (
    <Animated.View style={[anim, { alignItems: "center", gap: 6, flex: 1 }]}>
      <Pressable
        style={[ab.btn, { backgroundColor: item.bg }]}
        onPressIn={() => { sc.value = withSpring(0.88, { damping: 12 }); }}
        onPressOut={() => { sc.value = withSpring(1, { damping: 12 }); }}
        onPress={onPress}
      >
        <Feather name={item.icon} size={20} color={item.color} />
      </Pressable>
      <Text style={ab.label}>{item.label}</Text>
    </Animated.View>
  );
}

const ab = StyleSheet.create({
  btn:   { width: 52, height: 52, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  label: { fontSize: 11, fontFamily: "Manrope_600SemiBold", color: C.textSec, textAlign: "center" },
});

/* ─── Responsive Virtual Card ─────────────────────────────────────────────── */
interface VirtualCardProps {
  cardW: number;
  frozen: boolean;
  visible: boolean;
  onToggleVisible: () => void;
  balance: number;
  name: string;
  cardNum: string;
  visibleNum: string;
  expiry: string;
  cvv: string;
  visibleCvv: string;
}

function VirtualCard({
  cardW, frozen, visible, onToggleVisible,
  balance, name, cardNum, visibleNum, expiry, cvv, visibleCvv,
}: VirtualCardProps) {
  /* Standard credit card aspect ratio: 85.6mm × 54mm = 1.5852:1 */
  const cardH = Math.round(cardW * 0.6303);
  /* Scale factor from a 370px base design */
  const sc = cardW / 370;
  const f  = (n: number) => Math.max(1, Math.round(n * sc));
  const p  = (n: number) => Math.round(n * sc);

  return (
    <View
      style={[
        vc.card,
        {
          width: cardW,
          height: cardH,
          padding: p(20),
          borderRadius: p(22),
          opacity: frozen ? 0.55 : 1,
        },
      ]}
    >
      {/* Decorative orbs */}
      <View style={[vc.orb1, { width: p(200), height: p(200), borderRadius: p(100), top: p(-60), left: p(-40) }]} />
      <View style={[vc.orb2, { width: p(130), height: p(130), borderRadius: p(65),  bottom: p(-28), right: p(-18) }]} />
      <View style={[vc.orb3, { width: p(90),  height: p(90),  borderRadius: p(45),  top: p(18), right: p(28) }]} />

      {/* Frozen overlay */}
      {frozen && (
        <View style={[vc.frozenOverlay, { borderRadius: p(22) }]}>
          <Feather name="pause-circle" size={f(34)} color="#FFFFFF" />
          <Text style={[vc.frozenText, { fontSize: f(16) }]}>Card Frozen</Text>
        </View>
      )}

      {/* Card top row */}
      <View style={vc.cardTop}>
        <View>
          <Text style={[vc.cardLabel, { fontSize: f(9), letterSpacing: 1.4 }]}>VIRTUAL CARD</Text>
          <Text style={[vc.cardBank,  { fontSize: f(13), marginTop: p(3) }]}>AZA / Payvora</Text>
        </View>
        <View style={[vc.chipIcon, { width: p(38), height: p(28), borderRadius: p(8) }]}>
          <Feather name="credit-card" size={f(18)} color="rgba(255,255,255,0.88)" />
        </View>
      </View>

      {/* Balance */}
      <View style={[vc.cardBalance, { marginBottom: p(14) }]}>
        <Text style={[vc.cardBalLabel, { fontSize: f(9), marginBottom: p(3) }]}>Available Balance</Text>
        <Text style={[vc.cardBalAmount, { fontSize: f(20) }]}>
          ₦{balance.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </Text>
      </View>

      {/* Card number */}
      <Text style={[vc.cardNumber, { fontSize: f(13), letterSpacing: p(3), marginBottom: p(14) }]}>
        {visible ? visibleNum : cardNum}
      </Text>

      {/* Card footer */}
      <View style={vc.cardFooter}>
        <View>
          <Text style={[vc.cardMeta, { fontSize: f(8) }]}>CARD HOLDER</Text>
          <Text style={[vc.cardMetaVal, { fontSize: f(10) }]}>{name.toUpperCase()}</Text>
        </View>
        <View>
          <Text style={[vc.cardMeta, { fontSize: f(8) }]}>EXPIRES</Text>
          <Text style={[vc.cardMetaVal, { fontSize: f(10) }]}>{expiry}</Text>
        </View>
        <View>
          <Text style={[vc.cardMeta, { fontSize: f(8) }]}>CVV</Text>
          <Text style={[vc.cardMetaVal, { fontSize: f(10) }]}>{visible ? visibleCvv : cvv}</Text>
        </View>
      </View>

      {/* Mastercard circles */}
      <View style={[vc.mastercard, { top: p(20), right: p(20) }]}>
        <View style={[vc.mcCircle, { width: p(24), height: p(24), borderRadius: p(12), backgroundColor: "#EB001B", marginRight: p(-10) }]} />
        <View style={[vc.mcCircle, { width: p(24), height: p(24), borderRadius: p(12), backgroundColor: "#F79E1B", opacity: 0.95 }]} />
      </View>

      {/* Toggle visibility */}
      <TouchableOpacity
        style={[vc.visBtn, { bottom: p(18), right: p(18) }]}
        onPress={onToggleVisible}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <PremiumEyeIcon open={visible} size={f(16)} color="rgba(255,255,255,0.75)" />
      </TouchableOpacity>
    </View>
  );
}

const vc = StyleSheet.create({
  card: {
    backgroundColor: "#000000",
    overflow: "hidden",
    position: "relative",
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.38,
    shadowRadius: 28,
    elevation: 18,
  },
  orb1: { position: "absolute", backgroundColor: "rgba(255,255,255,0.05)" },
  orb2: { position: "absolute", backgroundColor: "rgba(255,255,255,0.04)" },
  orb3: { position: "absolute", backgroundColor: "rgba(99,91,255,0.15)"   },

  frozenOverlay: {
    position: "absolute", inset: 0, zIndex: 10,
    backgroundColor: "rgba(0,0,0,0.58)",
    alignItems: "center", justifyContent: "center", gap: 8,
  },
  frozenText: { fontFamily: "Manrope_700Bold", color: "#FFFFFF" },

  cardTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 0 },
  cardLabel: { fontFamily: "Manrope_500Medium", color: "rgba(255,255,255,0.55)", textTransform: "uppercase" },
  cardBank:  { fontFamily: "Manrope_700Bold", color: "#FFFFFF" },
  chipIcon:  { backgroundColor: "rgba(255,255,255,0.1)", alignItems: "center", justifyContent: "center" },

  cardBalance:   { },
  cardBalLabel:  { fontFamily: "Manrope_500Medium", color: "rgba(255,255,255,0.5)", letterSpacing: 0.4, marginTop: 12 },
  cardBalAmount: { fontFamily: "Manrope_700Bold", color: "#FFFFFF", letterSpacing: -0.5 },

  cardNumber: { fontFamily: "Manrope_500Medium", color: "rgba(255,255,255,0.85)" },

  cardFooter:  { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" },
  cardMeta:    { fontFamily: "Manrope_400Regular", color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: 0.4, marginBottom: 2 },
  cardMetaVal: { fontFamily: "Manrope_600SemiBold", color: "#FFFFFF", letterSpacing: 0.4 },

  mastercard: { position: "absolute", flexDirection: "row" },
  mcCircle:   { },

  visBtn: { position: "absolute" },
});

/* ─── Main screen ─────────────────────────────────────────────────────────── */
export default function CardScreen() {
  const router   = useRouter();
  const insets   = useSafeAreaInsets();
  const { user } = useAuth();
  const { width } = useWindowDimensions();
  const CARD_W   = Math.min(width - 40, 390);
  const topPad   = Platform.OS === "web" ? 40 : insets.top;

  const [frozen,    setFrozen]    = useState(false);
  const [visible,   setVisible]   = useState(false);
  const [activeTab, setActiveTab] = useState<"transactions" | "details">("transactions");

  const cardNum    = "5234 •••• •••• 8901";
  const visibleNum = "5234  4892  7712  8901";
  const expiry     = "08 / 27";
  const cvv        = "•••";
  const visibleCvv = "482";
  const balance    = user?.balance ?? 200590;
  const name       = user?.name ?? "AZA User";

  const handleAction = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (id === "freeze") { setFrozen(f => !f); }
    else if (id === "details") { setActiveTab("details"); }
    else if (id === "topup") { router.push("/(app)/dashboard" as any); }
    else if (id === "limit") {
      Alert.alert("Spending Limit", "Set your card spending limit in settings.", [{ text: "OK" }]);
    }
  };

  return (
    <View style={[s.root, { paddingTop: topPad }]}>

      {/* Header */}
      <Animated.View entering={FadeInDown.duration(280)} style={s.header}>
        <Text style={s.title}>My Card</Text>
        <TouchableOpacity
          style={s.notifBtn}
          onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
        >
          <Feather name="bell" size={20} color={C.navy} />
          <View style={s.notifDot} />
        </TouchableOpacity>
      </Animated.View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[s.scroll, { paddingBottom: insets.bottom + 110 }]}
      >

        {/* Physical card */}
        <Animated.View entering={FadeInDown.duration(360).delay(30)} style={{ alignItems: "center" }}>
          <VirtualCard
            cardW={CARD_W}
            frozen={frozen}
            visible={visible}
            onToggleVisible={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setVisible(v => !v);
            }}
            balance={balance}
            name={name}
            cardNum={cardNum}
            visibleNum={visibleNum}
            expiry={expiry}
            cvv={cvv}
            visibleCvv={visibleCvv}
          />
        </Animated.View>

        {/* Quick actions */}
        <Animated.View entering={FadeInUp.duration(300).delay(80)} style={s.actionsRow}>
          {CARD_ACTIONS.map(action => (
            <ActionBtn
              key={action.id}
              item={action}
              onPress={() => handleAction(action.id)}
            />
          ))}
        </Animated.View>

        {/* Tabs */}
        <Animated.View entering={FadeInUp.duration(280).delay(110)} style={s.tabBar}>
          {(["transactions", "details"] as const).map(t => (
            <Pressable
              key={t}
              style={[s.tabItem, activeTab === t && s.tabItemActive]}
              onPress={() => { Haptics.selectionAsync(); setActiveTab(t); }}
            >
              <Text style={[s.tabText, activeTab === t && s.tabTextActive]}>
                {t === "transactions" ? "Transactions" : "Card Details"}
              </Text>
            </Pressable>
          ))}
        </Animated.View>

        {activeTab === "transactions" && (
          <Animated.View entering={FadeInUp.duration(280).delay(40)}>
            {TRANSACTIONS.map((item, i) => (
              <Animated.View key={item.id} entering={FadeInDown.duration(240).delay(i * 25)}>
                <TouchableOpacity
                  style={s.txRow}
                  activeOpacity={0.75}
                  onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                >
                  <View style={[s.txIcon, { backgroundColor: item.iconBg }]}>
                    <Feather name={item.icon} size={18} color={item.iconColor} />
                  </View>
                  <View style={s.txInfo}>
                    <Text style={s.txName}>{item.name}</Text>
                    <Text style={s.txDate}>{item.date}</Text>
                  </View>
                  <Text style={[s.txAmount, { color: item.positive ? C.success : C.danger }]}>
                    {item.positive ? "+" : "-"}{item.amount}
                  </Text>
                </TouchableOpacity>
                {i < TRANSACTIONS.length - 1 && <View style={s.txDivider} />}
              </Animated.View>
            ))}
          </Animated.View>
        )}

        {activeTab === "details" && (
          <Animated.View entering={FadeInUp.duration(280).delay(40)} style={s.detailsCard}>
            {[
              { label: "Card Number", value: visible ? visibleNum : cardNum },
              { label: "Card Holder", value: name.toUpperCase() },
              { label: "Expiry Date", value: expiry },
              { label: "CVV",         value: visible ? visibleCvv : cvv },
              { label: "Card Type",   value: "Virtual Mastercard" },
              { label: "Status",      value: frozen ? "Frozen" : "Active" },
            ].map((row, i, arr) => (
              <View key={row.label}>
                <View style={s.detailRow}>
                  <Text style={s.detailLabel}>{row.label}</Text>
                  <Text style={[s.detailValue, row.label === "Status" && { color: frozen ? C.danger : C.success }]}>
                    {row.value}
                  </Text>
                </View>
                {i < arr.length - 1 && <View style={s.detailDivider} />}
              </View>
            ))}
          </Animated.View>
        )}

      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },

  header: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    paddingHorizontal: 20, paddingBottom: 12, paddingTop: 8,
  },
  title:    { fontSize: 22, fontFamily: "Manrope_700Bold", color: C.navy },
  notifBtn: {
    width: 38, height: 38, borderRadius: 19,
    alignItems: "center", justifyContent: "center",
    backgroundColor: "#F8F9FA", position: "relative",
  },
  notifDot: {
    position: "absolute", top: 6, right: 6,
    width: 7, height: 7, borderRadius: 3.5,
    backgroundColor: "#FF3B30", borderWidth: 1.5, borderColor: C.bg,
  },

  scroll: { paddingHorizontal: 20, paddingTop: 4, gap: 20 },

  actionsRow: { flexDirection: "row", justifyContent: "space-between" },

  tabBar:        { flexDirection: "row", backgroundColor: "#F8F9FA", borderRadius: 12, padding: 4 },
  tabItem:       { flex: 1, paddingVertical: 9, alignItems: "center", borderRadius: 9 },
  tabItemActive: {
    backgroundColor: C.bg,
    shadowColor: "#000", shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08, shadowRadius: 4, elevation: 2,
  },
  tabText:       { fontSize: 13, fontFamily: "Manrope_600SemiBold", color: C.textMut },
  tabTextActive: { color: C.navy },

  txRow:     { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 12 },
  txIcon:    { width: 44, height: 44, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  txInfo:    { flex: 1, gap: 3 },
  txName:    { fontSize: 14, fontFamily: "Manrope_600SemiBold", color: C.text },
  txDate:    { fontSize: 11, fontFamily: "Manrope_400Regular", color: C.textMut },
  txAmount:  { fontSize: 14, fontFamily: "Manrope_700Bold" },
  txDivider: { height: 1, backgroundColor: C.border },

  detailsCard:   { borderRadius: 16, borderWidth: 1, borderColor: C.border, overflow: "hidden", backgroundColor: C.bg },
  detailRow:     { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 14, paddingHorizontal: 16 },
  detailLabel:   { fontSize: 13, fontFamily: "Manrope_400Regular", color: C.textSec },
  detailValue:   { fontSize: 13, fontFamily: "Manrope_700Bold", color: C.text },
  detailDivider: { height: 1, backgroundColor: C.border },
});
