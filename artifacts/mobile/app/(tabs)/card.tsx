import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Dimensions,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  FadeInDown,
  FadeInUp,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";

const { width: SW } = Dimensions.get("window");

const CARD_W = SW - 40;
const CARD_H = CARD_W * 0.56;

type Action = {
  icon: React.ComponentProps<typeof Feather>["name"];
  label: string;
  color: string;
  onPress: () => void;
};

export default function CardScreen() {
  const router  = useRouter();
  const insets  = useSafeAreaInsets();
  const { user } = useAuth();
  const C       = useColors();
  const topPad  = Platform.OS === "web" ? 48 : insets.top;

  const [cvvVisible, setCvvVisible] = useState(false);
  const [frozen, setFrozen]         = useState(false);

  const cardNumber = "4532 •••• •••• 7841";
  const expiry     = "12/27";
  const cvv        = cvvVisible ? "392" : "•••";

  const actions: Action[] = [
    {
      icon: "plus-circle",
      label: "Fund Card",
      color: C.accent,
      onPress: () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        Alert.alert("Fund Card", "Enter amount to add to your virtual card.", [
          { text: "Cancel", style: "cancel" },
          { text: "Continue", onPress: () => {} },
        ]);
      },
    },
    {
      icon: frozen ? "unlock" : "lock",
      label: frozen ? "Unfreeze" : "Freeze",
      color: frozen ? C.success : C.warning,
      onPress: () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setFrozen(v => !v);
      },
    },
    {
      icon: "eye",
      label: "View CVV",
      color: "#7C3AED",
      onPress: () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setCvvVisible(v => !v);
      },
    },
    {
      icon: "trash-2",
      label: "Terminate",
      color: C.destructive,
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
    { id: "1", name: "Netflix Subscription", date: "Jun 20, 2025", amount: "-$15.99",  positive: false },
    { id: "2", name: "Spotify Premium",       date: "Jun 18, 2025", amount: "-$9.99",   positive: false },
    { id: "3", name: "Card Funding",          date: "Jun 15, 2025", amount: "+$100.00", positive: true  },
    { id: "4", name: "Amazon Purchase",       date: "Jun 12, 2025", amount: "-$42.50",  positive: false },
  ];

  return (
    <View style={[s.root, { backgroundColor: C.background, paddingTop: topPad }]}>

      {/* Header */}
      <Animated.View entering={FadeInDown.duration(300)} style={s.header}>
        <Text style={[s.title, { color: C.text }]}>My Card</Text>
        <TouchableOpacity
          style={[s.addBtn, { borderColor: C.border }]}
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
        <Animated.View entering={FadeInDown.duration(380).delay(40)} style={[s.card, frozen && s.cardFrozen]}>
          <View style={s.chip}>
            <View style={s.chipInner} />
          </View>
          <View style={s.cardTop}>
            <Text style={s.cardLabel}>AZA Virtual Card</Text>
            {frozen && (
              <View style={s.frozenBadge}>
                <Feather name="lock" size={10} color="#fff" />
                <Text style={s.frozenText}>Frozen</Text>
              </View>
            )}
          </View>
          <Text style={s.cardNumber}>{cardNumber}</Text>
          <View style={s.cardBottom}>
            <View>
              <Text style={s.cardMeta}>Card Holder</Text>
              <Text style={s.cardValue}>{(user?.name ?? "AZA User").toUpperCase()}</Text>
            </View>
            <View style={s.cardCenter}>
              <Text style={s.cardMeta}>Expires</Text>
              <Text style={s.cardValue}>{expiry}</Text>
            </View>
            <View>
              <Text style={s.cardMeta}>CVV</Text>
              <Pressable onPress={() => setCvvVisible(v => !v)}>
                <Text style={s.cardValue}>{cvv}</Text>
              </Pressable>
            </View>
          </View>
          <Text style={s.visaLabel}>VISA</Text>
        </Animated.View>

        {/* Balance chip */}
        <Animated.View entering={FadeInDown.duration(340).delay(80)} style={[s.balChip, { backgroundColor: C.surface }]}>
          <Text style={[s.balLabel, { color: C.subtitle }]}>Available Balance</Text>
          <Text style={[s.balAmount, { color: C.text }]}>$240.00</Text>
        </Animated.View>

        {/* Actions */}
        <Animated.View entering={FadeInUp.duration(340).delay(100)} style={s.actions}>
          {actions.map(a => (
            <TouchableOpacity key={a.label} style={s.actionItem} onPress={a.onPress} activeOpacity={0.75}>
              <View style={[s.actionIcon, { backgroundColor: a.color + "18" }]}>
                <Feather name={a.icon} size={20} color={a.color} />
              </View>
              <Text style={[s.actionLabel, { color: C.subtitle }]}>{a.label}</Text>
            </TouchableOpacity>
          ))}
        </Animated.View>

        {/* Card Details */}
        <Animated.View entering={FadeInUp.duration(320).delay(130)} style={[s.detailCard, { borderColor: C.border, backgroundColor: C.surface }]}>
          <Text style={[s.sectionTitle, { color: C.text }]}>Card Details</Text>
          {[
            { label: "Card Type",    value: "Virtual Dollar Card" },
            { label: "Network",      value: "Visa" },
            { label: "Currency",     value: "USD" },
            { label: "Status",       value: frozen ? "Frozen" : "Active", accent: !frozen },
            { label: "Spending Limit", value: "$5,000 / month" },
          ].map(row => (
            <View key={row.label} style={s.detailRow}>
              <Text style={[s.detailLabel, { color: C.subtitle }]}>{row.label}</Text>
              <Text style={[s.detailValue, { color: C.text }, row.accent && { color: C.success }]}>{row.value}</Text>
            </View>
          ))}
        </Animated.View>

        {/* Recent Transactions */}
        <Animated.View entering={FadeInUp.duration(320).delay(160)}>
          <View style={s.secHeader}>
            <Text style={[s.sectionTitle, { color: C.text }]}>Recent Transactions</Text>
            <TouchableOpacity onPress={() => router.push("/(app)/transactions" as any)}>
              <Text style={[s.seeAll, { color: C.accent }]}>See All</Text>
            </TouchableOpacity>
          </View>
          {RECENT.map(tx => (
            <View key={tx.id} style={[s.txRow, { borderColor: C.border }]}>
              <View style={[s.txIcon, { backgroundColor: (tx.positive ? C.success : C.destructive) + "15" }]}>
                <Feather name={tx.positive ? "arrow-down-left" : "arrow-up-right"} size={16} color={tx.positive ? C.success : C.destructive} />
              </View>
              <View style={s.txInfo}>
                <Text style={[s.txName, { color: C.text }]}>{tx.name}</Text>
                <Text style={[s.txDate, { color: C.mutedForeground }]}>{tx.date}</Text>
              </View>
              <Text style={[s.txAmount, { color: tx.positive ? C.success : C.destructive }]}>{tx.amount}</Text>
            </View>
          ))}
        </Animated.View>

      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root:   { flex: 1 },
  header: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 20, paddingBottom: 16, paddingTop: 8,
  },
  title: { fontSize: 22, fontFamily: "Manrope_700Bold" },
  addBtn: {
    width: 40, height: 40, borderRadius: 12, borderWidth: 1,
    alignItems: "center", justifyContent: "center",
  },

  scroll: { paddingHorizontal: 20, paddingTop: 4, gap: 16 },

  card: {
    width: CARD_W, height: CARD_H,
    backgroundColor: "#0D1320",
    borderRadius: 20,
    padding: 20,
    justifyContent: "space-between",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.22,
    shadowRadius: 20,
    elevation: 10,
  },
  cardFrozen: { opacity: 0.7 },

  chip: {
    width: 34, height: 26, borderRadius: 5,
    backgroundColor: "#C9A84C",
    justifyContent: "center", alignItems: "center",
    position: "absolute", top: 20, left: 20,
  },
  chipInner: {
    width: 20, height: 16, borderRadius: 3,
    borderWidth: 1, borderColor: "#E8C56A",
  },

  cardTop: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    marginTop: 36,
  },
  cardLabel: { color: "rgba(255,255,255,0.7)", fontSize: 12, fontFamily: "Manrope_400Regular" },
  frozenBadge: {
    flexDirection: "row", alignItems: "center", gap: 4,
    backgroundColor: "rgba(255,255,255,0.2)", borderRadius: 12,
    paddingHorizontal: 8, paddingVertical: 3,
  },
  frozenText: { color: "#fff", fontSize: 10, fontFamily: "Manrope_600SemiBold" },

  cardNumber: {
    fontSize: 18, fontFamily: "Manrope_600SemiBold", color: "#FFFFFF",
    letterSpacing: 2, marginTop: 8,
  },
  cardBottom: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" },
  cardCenter: { alignItems: "center" },
  cardMeta:  { color: "rgba(255,255,255,0.5)", fontSize: 9, fontFamily: "Manrope_400Regular", marginBottom: 3 },
  cardValue: { color: "#FFFFFF", fontSize: 13, fontFamily: "Manrope_600SemiBold" },
  visaLabel: {
    position: "absolute", bottom: 16, right: 20,
    fontSize: 18, fontFamily: "Manrope_700Bold",
    color: "rgba(255,255,255,0.9)", letterSpacing: 1,
  },

  balChip: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    borderRadius: 14, paddingHorizontal: 20, paddingVertical: 14,
  },
  balLabel:  { fontSize: 14, fontFamily: "Manrope_500Medium" },
  balAmount: { fontSize: 18, fontFamily: "Manrope_700Bold" },

  actions: { flexDirection: "row", justifyContent: "space-between" },
  actionItem: { alignItems: "center", gap: 8, flex: 1 },
  actionIcon: { width: 52, height: 52, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  actionLabel: { fontSize: 11, fontFamily: "Manrope_500Medium", textAlign: "center" },

  detailCard: { borderWidth: 1, borderRadius: 16, padding: 16, gap: 12 },
  sectionTitle: { fontSize: 16, fontFamily: "Manrope_700Bold", marginBottom: 4 },
  detailRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  detailLabel: { fontSize: 13, fontFamily: "Manrope_400Regular" },
  detailValue: { fontSize: 13, fontFamily: "Manrope_600SemiBold" },

  secHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  seeAll:    { fontSize: 13, fontFamily: "Manrope_600SemiBold" },

  txRow: {
    flexDirection: "row", alignItems: "center", gap: 12,
    paddingVertical: 12, borderBottomWidth: 1,
  },
  txIcon: { width: 38, height: 38, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  txInfo: { flex: 1 },
  txName:   { fontSize: 13, fontFamily: "Manrope_600SemiBold", marginBottom: 2 },
  txDate:   { fontSize: 11, fontFamily: "Manrope_400Regular", marginTop: 2 },
  txAmount: { fontSize: 13, fontFamily: "Manrope_700Bold" },
});
