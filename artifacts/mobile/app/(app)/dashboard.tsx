import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React from "react";
import {
  FlatList,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";

const TRANSACTIONS = [
  { id: "1", title: "Amazon Gift Card", sub: "Sold • April 28, 2024", amount: "+₦200,040", positive: true },
  { id: "2", title: "MTN Data Service", sub: "Withdraw • April 25, 2024", amount: "-₦15,000", positive: false },
  { id: "3", title: "iTunes Gift Card", sub: "Sold • April 22, 2024", amount: "+₦89,500", positive: true },
  { id: "4", title: "Steam Gift Card", sub: "Sold • April 20, 2024", amount: "+₦45,200", positive: true },
];

function ActionBtn({ icon, label, onPress }: { icon: keyof typeof Feather.glyphMap; label: string; onPress: () => void }) {
  const colors = useColors();
  return (
    <TouchableOpacity style={styles.actionItem} onPress={onPress} activeOpacity={0.8}>
      <View style={[styles.actionIcon, { backgroundColor: "rgba(255,255,255,0.15)" }]}>
        <Feather name={icon} size={20} color="#fff" />
      </View>
      <Text style={styles.actionLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

export default function DashboardScreen() {
  const router = useRouter();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuth();

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const formatBalance = (n: number) =>
    "₦" + n.toLocaleString("en-NG");

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      {/* Header card */}
      <View style={[styles.header, { paddingTop: topPad + 16 }]}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>Hi, {user?.name ?? "User"} 👋</Text>
            <Text style={styles.balanceLabel}>Available balance</Text>
          </View>
          <TouchableOpacity onPress={logout} activeOpacity={0.7}>
            <Feather name="log-out" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
        <Text style={styles.balance}>{formatBalance(user?.balance ?? 0)}</Text>

        {/* Action row */}
        <View style={styles.actions}>
          <ActionBtn
            icon="arrow-up"
            label="Top Up"
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            }}
          />
          <ActionBtn
            icon="send"
            label="Send"
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            }}
          />
          <ActionBtn
            icon="gift"
            label="Gift Cards"
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              router.push("/(app)/gift-cards");
            }}
          />
          <ActionBtn
            icon="refresh-cw"
            label="Withdraw"
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            }}
          />
        </View>
      </View>

      {/* Content */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Quick sell card */}
        <TouchableOpacity
          style={[styles.sellCard, { backgroundColor: "#061941" }]}
          onPress={() => router.push("/(app)/gift-cards")}
          activeOpacity={0.9}
        >
          <View>
            <Text style={styles.sellCardTitle}>Sell a Gift Card</Text>
            <Text style={styles.sellCardSub}>Amazon, iTunes, Steam & more</Text>
          </View>
          <View style={[styles.sellCardBtn, { backgroundColor: "#fff" }]}>
            <Feather name="arrow-right" size={18} color="#061941" />
          </View>
        </TouchableOpacity>

        {/* Transactions */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Transactions</Text>
          <TouchableOpacity onPress={() => router.push("/(app)/transactions")}>
            <Text style={[styles.seeAll, { color: colors.mutedForeground }]}>See All</Text>
          </TouchableOpacity>
        </View>

        {TRANSACTIONS.map((tx) => (
          <View key={tx.id} style={[styles.txRow, { borderBottomColor: colors.border }]}>
            <View style={[styles.txIcon, { backgroundColor: tx.positive ? colors.successLight : "#fff5f5" }]}>
              <Feather
                name={tx.positive ? "arrow-down-left" : "arrow-up-right"}
                size={16}
                color={tx.positive ? colors.success : colors.destructive}
              />
            </View>
            <View style={styles.txMid}>
              <Text style={[styles.txTitle, { color: colors.text }]}>{tx.title}</Text>
              <Text style={[styles.txSub, { color: colors.mutedForeground }]}>{tx.sub}</Text>
            </View>
            <Text style={[styles.txAmount, { color: tx.positive ? colors.success : colors.destructive }]}>
              {tx.amount}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    backgroundColor: "#000",
    paddingHorizontal: 24,
    paddingBottom: 28,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  greeting: { color: "#fff", fontSize: 14, fontFamily: "Manrope_400Regular", opacity: 0.7 },
  balanceLabel: { color: "#fff", fontSize: 13, fontFamily: "Manrope_400Regular", opacity: 0.6, marginTop: 2 },
  balance: {
    color: "#fff",
    fontSize: 34,
    fontFamily: "Manrope_700Bold",
    letterSpacing: -1,
    marginBottom: 24,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionItem: { alignItems: "center", gap: 6 },
  actionIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
  },
  actionLabel: { color: "#fff", fontSize: 11, fontFamily: "Manrope_500Medium", opacity: 0.85 },
  content: { paddingHorizontal: 20, paddingTop: 20, gap: 0 },
  sellCard: {
    borderRadius: 16,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 28,
  },
  sellCardTitle: { color: "#fff", fontSize: 16, fontFamily: "Manrope_700Bold", marginBottom: 4 },
  sellCardSub: { color: "rgba(255,255,255,0.6)", fontSize: 13, fontFamily: "Manrope_400Regular" },
  sellCardBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: { fontSize: 17, fontFamily: "Manrope_700Bold" },
  seeAll: { fontSize: 13, fontFamily: "Manrope_500Medium" },
  txRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 12,
  },
  txIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  txMid: { flex: 1 },
  txTitle: { fontSize: 14, fontFamily: "Manrope_600SemiBold", marginBottom: 2 },
  txSub: { fontSize: 12, fontFamily: "Manrope_400Regular" },
  txAmount: { fontSize: 14, fontFamily: "Manrope_700Bold" },
});
