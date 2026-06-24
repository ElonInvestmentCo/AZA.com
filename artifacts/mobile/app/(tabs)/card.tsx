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
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@/context/AuthContext";

const MAX_W = 430;

const C = {
  bg:       "#FFFFFF",
  text:     "#0B0A0A",
  navy:     "#061941",
  textSec:  "#595F67",
  textMut:  "#9DA4B4",
  border:   "#F3F4F7",
  surface:  "#F8F9FA",
  success:  "#008A48",
  danger:   "#FF4444",
  warn:     "#F59E0B",
  primary:  "#135EF2",
};

export default function CardScreen() {
  const router  = useRouter();
  const insets  = useSafeAreaInsets();
  const { user } = useAuth();
  const { width } = useWindowDimensions();
  const CARD_W  = Math.min(width, MAX_W) - 40;
  const CARD_H  = CARD_W * 0.58;
  const topPad  = Platform.OS === "web" ? 48 : insets.top;

  const [cvvVisible, setCvvVisible] = useState(false);
  const [frozen, setFrozen]         = useState(false);

  const cardNumber = "4532 •••• •••• 7841";
  const expiry     = "12/27";
  const cvv        = cvvVisible ? "392" : "•••";

  const actions = [
    {
      icon: "plus-circle" as const,
      label: "Fund Card",
      bg: "#EFF6FF",
      iconColor: C.primary,
      onPress: () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        Alert.alert("Fund Card", "Enter amount to add to your virtual card.", [
          { text: "Cancel", style: "cancel" },
          { text: "Continue", onPress: () => {} },
        ]);
      },
    },
    {
      icon: (frozen ? "unlock" : "lock") as React.ComponentProps<typeof Feather>["name"],
      label: frozen ? "Unfreeze" : "Freeze",
      bg: frozen ? "#F0FFF4" : "#FFFBEB",
      iconColor: frozen ? C.success : C.warn,
      onPress: () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setFrozen(v => !v);
      },
    },
    {
      icon: "eye" as const,
      label: "View CVV",
      bg: "#F5F3FF",
      iconColor: "#7C3AED",
      onPress: () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setCvvVisible(v => !v);
      },
    },
    {
      icon: "trash-2" as const,
      label: "Terminate",
      bg: "#FFF0F0",
      iconColor: C.danger,
      onPress: () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        Alert.alert(
          "Terminate Card",
          "This will permanently delete your virtual card. This action cannot be undone.",
          [
            { text: "Cancel", style: "cancel" },
            { text: "Terminate", style: "destructive", onPress: () => {} },
          ],
        );
      },
    },
  ];

  const RECENT = [
    { id: "1", name: "Netflix Subscription", ref: "3289HF-4378", date: "Jun 20, 2025", amount: "$15.99",  positive: false },
    { id: "2", name: "Spotify Premium",       ref: "4411SP-9922", date: "Jun 18, 2025", amount: "$9.99",   positive: false },
    { id: "3", name: "Card Funding",          ref: "5500CF-3311", date: "Jun 15, 2025", amount: "$100.00", positive: true  },
    { id: "4", name: "Amazon Purchase",       ref: "6611AP-2200", date: "Jun 12, 2025", amount: "$42.50",  positive: false },
  ];

  return (
    <View style={[s.root, { paddingTop: topPad }]}>

      {/* Header */}
      <Animated.View entering={FadeInDown.duration(280)} style={s.header}>
        <TouchableOpacity
          style={s.backBtn}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.back();
          }}
        >
          <Feather name="arrow-left" size={20} color={C.navy} />
        </TouchableOpacity>
        <Text style={s.title}>My Card</Text>
        <TouchableOpacity
          style={s.addBtn}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            Alert.alert("Create New Card", "Create a new USD virtual dollar card?", [
              { text: "Cancel", style: "cancel" },
              { text: "Create", onPress: () => {} },
            ]);
          }}
        >
          <Feather name="plus" size={20} color={C.text} />
        </TouchableOpacity>
      </Animated.View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[s.scroll, { paddingBottom: insets.bottom + 100 }]}>

        {/* Virtual Card */}
        <Animated.View entering={FadeInDown.duration(360).delay(40)}>
          <View style={[s.card, { width: CARD_W, height: CARD_H }, frozen && s.cardFrozen]}>

            {/* Top row: label + network */}
            <View style={s.cardTopRow}>
              <Text style={s.cardBrand}>AZA</Text>
              {frozen && (
                <View style={s.frozenBadge}>
                  <Feather name="lock" size={9} color="#fff" />
                  <Text style={s.frozenText}>Frozen</Text>
                </View>
              )}
              <Text style={s.visaLabel}>VISA</Text>
            </View>

            {/* Chip */}
            <View style={s.chipRow}>
              <View style={s.chip}>
                <View style={s.chipH} />
                <View style={s.chipV} />
              </View>
            </View>

            {/* Card number */}
            <Text style={s.cardNumber}>{cardNumber}</Text>

            {/* Bottom row */}
            <View style={s.cardBottom}>
              <View>
                <Text style={s.cardMeta}>CARD HOLDER</Text>
                <Text style={s.cardValue}>{(user?.name ?? "AZA USER").toUpperCase()}</Text>
              </View>
              <View style={{ alignItems: "center" }}>
                <Text style={s.cardMeta}>EXPIRES</Text>
                <Text style={s.cardValue}>{expiry}</Text>
              </View>
              <View style={{ alignItems: "flex-end" }}>
                <Text style={s.cardMeta}>CVV</Text>
                <Pressable onPress={() => setCvvVisible(v => !v)}>
                  <Text style={s.cardValue}>{cvv}</Text>
                </Pressable>
              </View>
            </View>

            {/* Decorative circles */}
            <View style={s.circle1} />
            <View style={s.circle2} />
          </View>
        </Animated.View>

        {/* Balance chip */}
        <Animated.View entering={FadeInDown.duration(320).delay(70)} style={s.balChip}>
          <View>
            <Text style={s.balLabel}>Available Balance</Text>
            <Text style={s.balAmount}>$240.00</Text>
          </View>
          <View style={[s.statusPill, { backgroundColor: "#E8F7EF" }]}>
            <View style={s.statusDot} />
            <Text style={[s.statusPillText, { color: C.success }]}>Active</Text>
          </View>
        </Animated.View>

        {/* Actions */}
        <Animated.View entering={FadeInUp.duration(320).delay(90)} style={s.actions}>
          {actions.map(a => (
            <TouchableOpacity key={a.label} style={s.actionItem} onPress={a.onPress} activeOpacity={0.75}>
              <View style={[s.actionIcon, { backgroundColor: a.bg }]}>
                <Feather name={a.icon} size={20} color={a.iconColor} />
              </View>
              <Text style={s.actionLabel}>{a.label}</Text>
            </TouchableOpacity>
          ))}
        </Animated.View>

        {/* Card Details */}
        <Animated.View entering={FadeInUp.duration(300).delay(110)} style={s.detailCard}>
          <Text style={s.sectionTitle}>Card Details</Text>
          {[
            { label: "Card Type",      value: "Virtual Dollar Card" },
            { label: "Network",        value: "Visa" },
            { label: "Currency",       value: "USD" },
            { label: "Status",         value: frozen ? "Frozen" : "Active", accent: !frozen },
            { label: "Spending Limit", value: "$5,000 / month" },
          ].map(row => (
            <View key={row.label} style={s.detailRow}>
              <Text style={s.detailLabel}>{row.label}</Text>
              <Text style={[s.detailValue, row.accent && { color: C.success }]}>{row.value}</Text>
            </View>
          ))}
        </Animated.View>

        {/* Recent Transactions */}
        <Animated.View entering={FadeInUp.duration(300).delay(130)}>
          <View style={s.secHeader}>
            <Text style={s.sectionTitle}>Recent Transactions</Text>
            <TouchableOpacity onPress={() => router.push("/(app)/transactions" as any)}>
              <Text style={s.seeAll}>View detail</Text>
            </TouchableOpacity>
          </View>
          {RECENT.map((tx, i) => (
            <View key={tx.id}>
              <View style={s.txRow}>
                <View style={[s.txIcon, { backgroundColor: tx.positive ? "#E8F7EF" : "#FFF0F0" }]}>
                  <Feather name={tx.positive ? "arrow-down-left" : "arrow-up-right"} size={16} color={tx.positive ? C.success : C.danger} />
                </View>
                <View style={s.txInfo}>
                  <Text style={s.txName}>{tx.name}</Text>
                  <Text style={s.txRef}>{tx.ref}</Text>
                </View>
                <View style={{ alignItems: "flex-end", gap: 3 }}>
                  <Text style={[s.txAmount, { color: tx.positive ? C.success : C.danger }]}>
                    {tx.positive ? "+" : "-"}${tx.amount.replace("$", "")}
                  </Text>
                  <Text style={s.txDate}>{tx.date}</Text>
                </View>
              </View>
              {i < RECENT.length - 1 && <View style={s.txDivider} />}
            </View>
          ))}
        </Animated.View>

      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },

  header: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 20, paddingBottom: 12, paddingTop: 8,
  },
  backBtn: { width: 36, height: 36, alignItems: "center", justifyContent: "center" },
  title:   { fontSize: 18, fontFamily: "Manrope_700Bold", color: C.navy },
  addBtn:  {
    width: 36, height: 36, borderRadius: 10, borderWidth: 1, borderColor: C.border,
    alignItems: "center", justifyContent: "center",
  },

  scroll: { paddingHorizontal: 20, paddingTop: 4, gap: 16 },

  card: {
    backgroundColor: "#1A1A2E",
    borderRadius: 20, padding: 20,
    overflow: "hidden", position: "relative",
    shadowColor: "#000", shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4, shadowRadius: 20, elevation: 12,
  },
  cardFrozen: { opacity: 0.75 },

  cardTopRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  cardBrand: { color: "#FFFFFF", fontSize: 18, fontFamily: "Manrope_700Bold", letterSpacing: 2 },
  frozenBadge: {
    flexDirection: "row", alignItems: "center", gap: 4,
    backgroundColor: "rgba(255,255,255,0.2)", borderRadius: 10,
    paddingHorizontal: 8, paddingVertical: 3,
  },
  frozenText: { color: "#fff", fontSize: 9, fontFamily: "Manrope_600SemiBold" },
  visaLabel: { color: "rgba(255,255,255,0.85)", fontSize: 16, fontFamily: "Manrope_700Bold", letterSpacing: 1 },

  chipRow: { marginTop: 16, marginBottom: 4 },
  chip: {
    width: 32, height: 24, borderRadius: 5,
    backgroundColor: "#C9A84C", justifyContent: "center", alignItems: "center",
    overflow: "hidden",
  },
  chipH: { position: "absolute", left: 0, right: 0, height: 1, backgroundColor: "#A8833A" },
  chipV: { position: "absolute", top: 0, bottom: 0, width: 1, backgroundColor: "#A8833A" },

  cardNumber: {
    fontSize: 16, fontFamily: "Manrope_600SemiBold", color: "#FFFFFF",
    letterSpacing: 2, marginVertical: 12,
  },
  cardBottom: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" },
  cardMeta:  { color: "rgba(255,255,255,0.45)", fontSize: 8, fontFamily: "Manrope_400Regular", marginBottom: 3, letterSpacing: 0.5 },
  cardValue: { color: "#FFFFFF", fontSize: 12, fontFamily: "Manrope_600SemiBold" },

  circle1: {
    position: "absolute", width: 180, height: 180, borderRadius: 90,
    backgroundColor: "rgba(255,255,255,0.04)", top: -60, right: -40,
  },
  circle2: {
    position: "absolute", width: 120, height: 120, borderRadius: 60,
    backgroundColor: "rgba(255,255,255,0.04)", bottom: -30, left: -30,
  },

  balChip: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    backgroundColor: C.surface, borderRadius: 14,
    paddingHorizontal: 20, paddingVertical: 16,
    borderWidth: 1, borderColor: C.border,
  },
  balLabel:  { fontSize: 12, fontFamily: "Manrope_400Regular", color: C.textSec, marginBottom: 4 },
  balAmount: { fontSize: 22, fontFamily: "Manrope_700Bold", color: C.text },
  statusPill: { flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  statusDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: C.success },
  statusPillText: { fontSize: 12, fontFamily: "Manrope_600SemiBold" },

  actions: { flexDirection: "row", justifyContent: "space-between" },
  actionItem: { alignItems: "center", gap: 8, flex: 1 },
  actionIcon: { width: 52, height: 52, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  actionLabel: { fontSize: 11, fontFamily: "Manrope_500Medium", color: C.textSec, textAlign: "center" },

  detailCard: { borderWidth: 1, borderColor: C.border, borderRadius: 16, padding: 16, gap: 0 },
  sectionTitle: { fontSize: 16, fontFamily: "Manrope_700Bold", color: C.navy, marginBottom: 12 },
  detailRow: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: C.border,
  },
  detailLabel: { fontSize: 13, fontFamily: "Manrope_400Regular", color: C.textSec },
  detailValue: { fontSize: 13, fontFamily: "Manrope_600SemiBold", color: C.text },

  secHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  seeAll:    { fontSize: 13, fontFamily: "Manrope_500Medium", color: C.primary },

  txRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 12 },
  txIcon: { width: 44, height: 44, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  txInfo: { flex: 1, gap: 3 },
  txName: { fontSize: 14, fontFamily: "Manrope_500Medium", color: C.navy },
  txRef:  { fontSize: 12, fontFamily: "Manrope_400Regular", color: C.textMut },
  txAmount: { fontSize: 14, fontFamily: "Manrope_700Bold" },
  txDate:   { fontSize: 11, fontFamily: "Manrope_400Regular", color: C.textMut },
  txDivider: { height: 1, backgroundColor: C.border },
});
