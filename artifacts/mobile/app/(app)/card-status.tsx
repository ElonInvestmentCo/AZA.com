import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const C = {
  bg:      "#FFFFFF",
  text:    "#0B0A0A",
  navy:    "#061941",
  textSec: "#595F67",
  textMut: "#AAAFB5",
  border:  "#F0F0F0",
  warn:    "#D97706",
  success: "#00B03C",
  danger:  "#EF4444",
};

type CardStatus = "pending" | "approved" | "rejected";

const PENDING_CARDS = [
  {
    id: "1",
    type: "Amazon Gift Card",
    amount: "$200",
    naira: "₦200,040",
    submittedAt: "Aug 06, 2024 — 6:17 PM",
    status: "pending" as CardStatus,
    ref: "3289HF-4378",
    rate: "₦1,200/USD",
  },
  {
    id: "2",
    type: "iTunes Gift Card",
    amount: "$100",
    naira: "₦92,400",
    submittedAt: "Aug 01, 2024 — 2:45 PM",
    status: "approved" as CardStatus,
    ref: "2200II-9900",
    rate: "₦1,580/USD",
  },
  {
    id: "3",
    type: "Steam Gift Card",
    amount: "$50",
    naira: "₦47,000",
    submittedAt: "Jul 28, 2024 — 11:20 AM",
    status: "rejected" as CardStatus,
    ref: "8833ST-1122",
    rate: "₦1,490/USD",
  },
];

const STATUS_META: Record<CardStatus, { label: string; bg: string; color: string; icon: React.ComponentProps<typeof Feather>["name"] }> = {
  pending:  { label: "Pending Review", bg: "#FFFBEB", color: "#D97706", icon: "clock"           },
  approved: { label: "Approved",       bg: "#E8F7EF", color: "#00B03C", icon: "check-circle"    },
  rejected: { label: "Rejected",       bg: "#FFF0F0", color: "#EF4444", icon: "x-circle"        },
};

export default function CardStatusScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 48 : insets.top;

  const pending  = PENDING_CARDS.filter(c => c.status === "pending").length;
  const approved = PENDING_CARDS.filter(c => c.status === "approved").length;
  const rejected = PENDING_CARDS.filter(c => c.status === "rejected").length;

  return (
    <View style={[s.root, { paddingTop: topPad }]}>

      {/* Header */}
      <Animated.View entering={FadeInDown.duration(280)} style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.back(); }}>
          <Feather name="arrow-left" size={20} color={C.navy} />
        </TouchableOpacity>
        <Text style={s.title}>Card Status</Text>
        <View style={{ width: 36 }} />
      </Animated.View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[s.scroll, { paddingBottom: insets.bottom + 100 }]}
      >

        {/* Summary strip */}
        <Animated.View entering={FadeInDown.duration(340).delay(40)} style={s.summaryStrip}>
          <View style={s.stripItem}>
            <Text style={[s.stripNum, { color: C.warn }]}>{pending}</Text>
            <Text style={s.stripLabel}>Pending</Text>
          </View>
          <View style={s.stripDivider} />
          <View style={s.stripItem}>
            <Text style={[s.stripNum, { color: C.success }]}>{approved}</Text>
            <Text style={s.stripLabel}>Approved</Text>
          </View>
          <View style={s.stripDivider} />
          <View style={s.stripItem}>
            <Text style={[s.stripNum, { color: C.danger }]}>{rejected}</Text>
            <Text style={s.stripLabel}>Rejected</Text>
          </View>
        </Animated.View>

        {/* Cards */}
        <Text style={s.sectionTitle}>All Submissions</Text>
        {PENDING_CARDS.map((card, i) => {
          const meta = STATUS_META[card.status];
          return (
            <Animated.View key={card.id} entering={FadeInUp.duration(300).delay(60 + i * 60)}>
              <TouchableOpacity
                style={s.card}
                activeOpacity={0.82}
                onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
              >
                {/* Card top */}
                <View style={s.cardTop}>
                  <View style={[s.cardIconWrap, { backgroundColor: "#FFF2CF" }]}>
                    <Feather name="gift" size={20} color="#5C4000" />
                  </View>
                  <View style={s.cardInfo}>
                    <Text style={s.cardType}>{card.type}</Text>
                    <Text style={s.cardRef}>Ref: {card.ref}</Text>
                  </View>
                  <View style={[s.statusBadge, { backgroundColor: meta.bg }]}>
                    <Feather name={meta.icon} size={12} color={meta.color} />
                    <Text style={[s.statusText, { color: meta.color }]}>{meta.label}</Text>
                  </View>
                </View>

                {/* Card details */}
                <View style={s.cardDetails}>
                  <View style={s.detailRow}>
                    <Text style={s.detailLabel}>Amount</Text>
                    <Text style={s.detailValue}>{card.amount}</Text>
                  </View>
                  <View style={s.detailRow}>
                    <Text style={s.detailLabel}>Naira Value</Text>
                    <Text style={[s.detailValue, { color: card.status === "approved" ? C.success : C.text }]}>{card.naira}</Text>
                  </View>
                  <View style={s.detailRow}>
                    <Text style={s.detailLabel}>Rate</Text>
                    <Text style={s.detailValue}>{card.rate}</Text>
                  </View>
                  <View style={s.detailRow}>
                    <Text style={s.detailLabel}>Submitted</Text>
                    <Text style={s.detailValue}>{card.submittedAt}</Text>
                  </View>
                </View>

                {card.status === "rejected" && (
                  <TouchableOpacity
                    style={s.resubmitBtn}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      router.push("/(app)/sell-gift-card" as any);
                    }}
                  >
                    <Text style={s.resubmitText}>Resubmit</Text>
                  </TouchableOpacity>
                )}
              </TouchableOpacity>
            </Animated.View>
          );
        })}

        {/* New submission */}
        <Animated.View entering={FadeInUp.duration(300).delay(250)}>
          <TouchableOpacity
            style={s.newBtn}
            onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.push("/(app)/sell-gift-card" as any); }}
            activeOpacity={0.85}
          >
            <Feather name="plus" size={18} color="#FFFFFF" />
            <Text style={s.newBtnText}>Submit New Gift Card</Text>
          </TouchableOpacity>
        </Animated.View>

      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },

  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingBottom: 12, paddingTop: 8 },
  backBtn: { width: 36, height: 36, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 18, fontFamily: "Manrope_700Bold", color: C.navy },

  scroll: { paddingHorizontal: 20, paddingTop: 4, gap: 16 },

  summaryStrip: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: "#F8F9FA", borderRadius: 16, padding: 20,
    borderWidth: 1, borderColor: C.border,
  },
  stripItem:    { flex: 1, alignItems: "center", gap: 4 },
  stripNum:     { fontSize: 24, fontFamily: "Manrope_700Bold" },
  stripLabel:   { fontSize: 12, fontFamily: "Manrope_400Regular", color: C.textSec },
  stripDivider: { width: 1, height: 36, backgroundColor: C.border },

  sectionTitle: { fontSize: 14, fontFamily: "Manrope_700Bold", color: C.navy },

  card: {
    backgroundColor: C.bg, borderRadius: 16,
    borderWidth: 1, borderColor: C.border,
    overflow: "hidden", padding: 16, gap: 14,
    shadowColor: "#000", shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  cardTop:     { flexDirection: "row", alignItems: "center", gap: 12 },
  cardIconWrap:{ width: 44, height: 44, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  cardInfo:    { flex: 1, gap: 3 },
  cardType:    { fontSize: 13, fontFamily: "Manrope_700Bold", color: C.text },
  cardRef:     { fontSize: 11, fontFamily: "Manrope_400Regular", color: C.textMut },
  statusBadge: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  statusText:  { fontSize: 10, fontFamily: "Manrope_600SemiBold" },

  cardDetails:  { gap: 8, backgroundColor: "#F8F9FA", borderRadius: 10, padding: 12 },
  detailRow:    { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  detailLabel:  { fontSize: 12, fontFamily: "Manrope_400Regular", color: C.textSec },
  detailValue:  { fontSize: 12, fontFamily: "Manrope_600SemiBold", color: C.text },

  resubmitBtn: { backgroundColor: "#FFF0F0", borderRadius: 8, paddingVertical: 10, alignItems: "center", borderWidth: 1, borderColor: "#FCA5A5" },
  resubmitText:{ fontSize: 13, fontFamily: "Manrope_600SemiBold", color: C.danger },

  newBtn:     { backgroundColor: "#000000", height: 52, borderRadius: 12, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 },
  newBtnText: { fontSize: 14, fontFamily: "Manrope_700Bold", color: "#FFFFFF" },
});
