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
  { id: "freeze",  label: "Freeze",        icon: "pause-circle"    as const, color: "#0891B2",  bg: "#ECFEFF" },
  { id: "limit",   label: "Limit",         icon: "sliders"         as const, color: "#7C3AED",  bg: "#F5F3FF" },
  { id: "topup",   label: "Top Up",        icon: "plus-circle"     as const, color: "#00B03C",  bg: "#F0FFF4" },
  { id: "details", label: "Card Details",  icon: "eye"             as const, color: "#E11D48",  bg: "#FFF1F2" },
];

const TRANSACTIONS = [
  { id: "1", name: "Amazon Purchase",   date: "Jun 23, 2025", amount: "₦12,500", positive: false, icon: "shopping-bag" as const, iconBg: "#FFF2CF", iconColor: "#5C4000" },
  { id: "2", name: "Card Top Up",       date: "Jun 22, 2025", amount: "₦50,000", positive: true,  icon: "arrow-down"  as const, iconBg: "#F0FFF4", iconColor: "#00B03C" },
  { id: "3", name: "Netflix",           date: "Jun 20, 2025", amount: "₦4,700",  positive: false, icon: "tv"          as const, iconBg: "#FFF1F2", iconColor: "#E11D48" },
  { id: "4", name: "Spotify",           date: "Jun 18, 2025", amount: "₦2,400",  positive: false, icon: "music"       as const, iconBg: "#F5F3FF", iconColor: "#7C3AED" },
  { id: "5", name: "Card Top Up",       date: "Jun 15, 2025", amount: "₦20,000", positive: true,  icon: "arrow-down"  as const, iconBg: "#F0FFF4", iconColor: "#00B03C" },
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

export default function CardScreen() {
  const router  = useRouter();
  const insets  = useSafeAreaInsets();
  const { user } = useAuth();
  const { width } = useWindowDimensions();
  const CARD_W = Math.min(width - 40, 380);
  const topPad = Platform.OS === "web" ? 40 : insets.top;

  const [frozen, setFrozen]   = useState(false);
  const [visible, setVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<"transactions" | "details">("transactions");

  const cardNum = "5234 •••• •••• 8901";
  const visibleNum = "5234  4892  7712  8901";
  const expiry  = "08 / 27";
  const cvv     = "••• ";
  const visibleCvv = "482";
  const balance = user?.balance ?? 200590;

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
        <TouchableOpacity style={s.notifBtn} onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}>
          <Feather name="bell" size={20} color={C.navy} />
          <View style={s.notifDot} />
        </TouchableOpacity>
      </Animated.View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[s.scroll, { paddingBottom: insets.bottom + 110 }]}>

        {/* Physical card */}
        <Animated.View entering={FadeInDown.duration(360).delay(30)}>
          <View style={[s.card, { width: CARD_W, opacity: frozen ? 0.5 : 1 }]}>
            {/* Background orbs */}
            <View style={s.cardOrb1} />
            <View style={s.cardOrb2} />
            <View style={s.cardOrb3} />

            {/* Frozen overlay */}
            {frozen && (
              <View style={s.frozenOverlay}>
                <Feather name="pause-circle" size={36} color="#FFFFFF" />
                <Text style={s.frozenText}>Card Frozen</Text>
              </View>
            )}

            {/* Card top */}
            <View style={s.cardTop}>
              <View>
                <Text style={s.cardLabel}>Virtual Card</Text>
                <Text style={s.cardBank}>AZA / Payvora</Text>
              </View>
              <View style={s.chipIcon}>
                <Feather name="credit-card" size={22} color="rgba(255,255,255,0.9)" />
              </View>
            </View>

            {/* Balance */}
            <View style={s.cardBalance}>
              <Text style={s.cardBalLabel}>Available Balance</Text>
              <Text style={s.cardBalAmount}>
                ₦{balance.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </Text>
            </View>

            {/* Card number */}
            <Text style={s.cardNumber}>{visible ? visibleNum : cardNum}</Text>

            {/* Card footer */}
            <View style={s.cardFooter}>
              <View>
                <Text style={s.cardMeta}>Card Holder</Text>
                <Text style={s.cardMetaVal}>{(user?.name ?? "AZA User").toUpperCase()}</Text>
              </View>
              <View>
                <Text style={s.cardMeta}>Expires</Text>
                <Text style={s.cardMetaVal}>{expiry}</Text>
              </View>
              <View>
                <Text style={s.cardMeta}>CVV</Text>
                <Text style={s.cardMetaVal}>{visible ? visibleCvv : cvv}</Text>
              </View>
            </View>

            {/* Mastercard badge */}
            <View style={s.mastercard}>
              <View style={[s.mcCircle, { backgroundColor: "#EB001B", marginRight: -12 }]} />
              <View style={[s.mcCircle, { backgroundColor: "#F79E1B", opacity: 0.95 }]} />
            </View>

            {/* Toggle visibility */}
            <TouchableOpacity
              style={s.visBtn}
              onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setVisible(v => !v); }}
            >
              <Feather name={visible ? "eye-off" : "eye"} size={16} color="rgba(255,255,255,0.7)" />
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Quick actions */}
        <Animated.View entering={FadeInUp.duration(300).delay(80)} style={s.actionsRow}>
          {CARD_ACTIONS.map(action => (
            <ActionBtn key={action.id} item={action} onPress={() => handleAction(action.id)} />
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
                <TouchableOpacity style={s.txRow} activeOpacity={0.75} onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}>
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
              { label: "Card Number",   value: visible ? visibleNum : cardNum },
              { label: "Card Holder",   value: (user?.name ?? "AZA User").toUpperCase() },
              { label: "Expiry Date",   value: expiry },
              { label: "CVV",           value: visible ? visibleCvv : cvv },
              { label: "Card Type",     value: "Virtual Mastercard" },
              { label: "Status",        value: frozen ? "Frozen" : "Active" },
            ].map((row, i, arr) => (
              <View key={row.label}>
                <View style={s.detailRow}>
                  <Text style={s.detailLabel}>{row.label}</Text>
                  <Text style={[s.detailValue, row.label === "Status" && { color: frozen ? C.danger : C.success }]}>{row.value}</Text>
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

  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, paddingBottom: 12, paddingTop: 8 },
  title: { fontSize: 22, fontFamily: "Manrope_700Bold", color: C.navy },
  notifBtn: { width: 38, height: 38, borderRadius: 19, alignItems: "center", justifyContent: "center", backgroundColor: "#F8F9FA", position: "relative" },
  notifDot: { position: "absolute", top: 6, right: 6, width: 7, height: 7, borderRadius: 3.5, backgroundColor: "#FF3B30", borderWidth: 1.5, borderColor: C.bg },

  scroll: { paddingHorizontal: 20, paddingTop: 4, gap: 20 },

  card: {
    borderRadius: 22,
    backgroundColor: "#000000",
    padding: 24, paddingBottom: 22,
    minHeight: 210,
    overflow: "hidden",
    position: "relative",
    shadowColor: "#000", shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.35, shadowRadius: 24, elevation: 16,
    alignSelf: "center",
  },
  cardOrb1: { position: "absolute", width: 200, height: 200, borderRadius: 100, backgroundColor: "rgba(255,255,255,0.05)", top: -60, left: -40 },
  cardOrb2: { position: "absolute", width: 140, height: 140, borderRadius: 70,  backgroundColor: "rgba(255,255,255,0.04)", bottom: -30, right: -20 },
  cardOrb3: { position: "absolute", width: 100, height: 100, borderRadius: 50,  backgroundColor: "rgba(99,91,255,0.15)",   top: 20, right: 30 },

  frozenOverlay: { position: "absolute", inset: 0, zIndex: 10, backgroundColor: "rgba(0,0,0,0.6)", alignItems: "center", justifyContent: "center", gap: 8, borderRadius: 22 },
  frozenText: { fontSize: 18, fontFamily: "Manrope_700Bold", color: "#FFFFFF" },

  cardTop:    { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 },
  cardLabel:  { fontSize: 11, fontFamily: "Manrope_500Medium", color: "rgba(255,255,255,0.6)", letterSpacing: 1.5, textTransform: "uppercase" },
  cardBank:   { fontSize: 14, fontFamily: "Manrope_700Bold", color: "#FFFFFF", marginTop: 3 },
  chipIcon:   { width: 40, height: 32, backgroundColor: "rgba(255,255,255,0.1)", borderRadius: 8, alignItems: "center", justifyContent: "center" },

  cardBalance:    { marginBottom: 16 },
  cardBalLabel:   { fontSize: 10, fontFamily: "Manrope_500Medium", color: "rgba(255,255,255,0.5)", letterSpacing: 0.5, marginBottom: 4 },
  cardBalAmount:  { fontSize: 22, fontFamily: "Manrope_700Bold", color: "#FFFFFF", letterSpacing: -0.5 },

  cardNumber:  { fontSize: 16, fontFamily: "Manrope_500Medium", color: "rgba(255,255,255,0.85)", letterSpacing: 3, marginBottom: 18 },

  cardFooter:    { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" },
  cardMeta:      { fontSize: 9, fontFamily: "Manrope_400Regular", color: "rgba(255,255,255,0.5)", letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 3 },
  cardMetaVal:   { fontSize: 12, fontFamily: "Manrope_600SemiBold", color: "#FFFFFF", letterSpacing: 0.5 },

  mastercard: { position: "absolute", top: 22, right: 22, flexDirection: "row" },
  mcCircle:   { width: 26, height: 26, borderRadius: 13 },

  visBtn: { position: "absolute", bottom: 22, right: 22 },

  actionsRow: { flexDirection: "row", justifyContent: "space-between" },

  tabBar: { flexDirection: "row", backgroundColor: "#F8F9FA", borderRadius: 12, padding: 4 },
  tabItem:       { flex: 1, paddingVertical: 9, alignItems: "center", borderRadius: 9 },
  tabItemActive: { backgroundColor: C.bg, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 4, elevation: 2 },
  tabText:       { fontSize: 13, fontFamily: "Manrope_600SemiBold", color: C.textMut },
  tabTextActive: { color: C.navy },

  txRow:     { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 12 },
  txIcon:    { width: 44, height: 44, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  txInfo:    { flex: 1, gap: 3 },
  txName:    { fontSize: 14, fontFamily: "Manrope_600SemiBold", color: C.text },
  txDate:    { fontSize: 11, fontFamily: "Manrope_400Regular", color: C.textMut },
  txAmount:  { fontSize: 14, fontFamily: "Manrope_700Bold" },
  txDivider: { height: 1, backgroundColor: C.border },

  detailsCard: { borderRadius: 16, borderWidth: 1, borderColor: C.border, overflow: "hidden", backgroundColor: C.bg },
  detailRow:   { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 14, paddingHorizontal: 16 },
  detailLabel: { fontSize: 13, fontFamily: "Manrope_400Regular", color: C.textSec },
  detailValue: { fontSize: 13, fontFamily: "Manrope_700Bold", color: C.text },
  detailDivider: { height: 1, backgroundColor: C.border },
});
