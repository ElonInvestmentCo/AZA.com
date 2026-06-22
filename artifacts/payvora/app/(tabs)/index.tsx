import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";
import { useAuth } from "@/context/AuthContext";
import { useWallet, Transaction } from "@/context/WalletContext";

function formatDate(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function TransactionItem({ tx }: { tx: Transaction }) {
  const colors = useColors();
  const isPositive = tx.amount > 0;
  const handlePress = () => Haptics.selectionAsync();

  const iconMap: Record<string, string> = {
    send: "arrow-up-right",
    receive: "arrow-down-left",
    trade: "repeat",
    topup: "plus",
  };

  const iconBgMap: Record<string, string> = {
    send: colors.destructive + "20",
    receive: colors.primary + "20",
    trade: "#3B82F620",
    topup: "#F59E0B20",
  };

  const iconColorMap: Record<string, string> = {
    send: colors.destructive,
    receive: colors.primary,
    trade: "#3B82F6",
    topup: "#F59E0B",
  };

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.7} style={[styles.txItem, { borderBottomColor: colors.border }]}>
      <View style={[styles.txIcon, { backgroundColor: iconBgMap[tx.type] }]}>
        <Feather name={iconMap[tx.type] as any} size={18} color={iconColorMap[tx.type]} />
      </View>
      <View style={styles.txInfo}>
        <Text style={[styles.txTitle, { color: colors.foreground }]}>{tx.title}</Text>
        <Text style={[styles.txSub, { color: colors.mutedForeground }]}>
          {formatDate(tx.timestamp)} · {tx.subtitle}
        </Text>
      </View>
      <Text
        style={[
          styles.txAmount,
          { color: isPositive ? colors.positive : colors.foreground },
        ]}
      >
        {isPositive ? "+" : ""}${Math.abs(tx.amount).toFixed(2)}
      </Text>
    </TouchableOpacity>
  );
}

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user } = useAuth();
  const { balance, transactions, cryptoHoldings } = useWallet();
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  async function onRefresh() {
    setRefreshing(true);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setTimeout(() => setRefreshing(false), 1000);
  }

  const quickActions = [
    { label: "Send", icon: "arrow-up-right", color: "#3B82F6", route: "/send" },
    { label: "Receive", icon: "arrow-down-left", color: "#00D9A0", route: "/send" },
    { label: "Top Up", icon: "plus", color: "#F59E0B", route: null },
    { label: "Exchange", icon: "repeat", color: "#8B5CF6", route: null },
  ];

  const firstName = user?.name?.split(" ")[0] ?? "User";

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingTop: topPad, paddingBottom: (Platform.OS === "web" ? 34 : 0) + 100 }}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={colors.primary}
        />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.greeting, { color: colors.mutedForeground }]}>Good morning</Text>
          <Text style={[styles.name, { color: colors.foreground }]}>{firstName}</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={[styles.headerBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={async () => { await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}
          >
            <Feather name="bell" size={20} color={colors.foreground} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.avatar, { backgroundColor: colors.primary + "20", borderColor: colors.primary + "40" }]}
            onPress={() => router.push("/(tabs)/profile")}
          >
            <Text style={[styles.avatarText, { color: colors.primary }]}>
              {firstName.charAt(0).toUpperCase()}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Balance Card */}
      <View style={styles.cardContainer}>
        <View style={[styles.balanceCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[styles.cardGlow, { backgroundColor: colors.primary }]} />
          <View style={styles.cardTop}>
            <Text style={[styles.cardLabel, { color: colors.mutedForeground }]}>Total Balance</Text>
            <TouchableOpacity onPress={async () => { await Haptics.selectionAsync(); setBalanceVisible(!balanceVisible); }}>
              <Feather name={balanceVisible ? "eye" : "eye-off"} size={18} color={colors.mutedForeground} />
            </TouchableOpacity>
          </View>
          <Text style={[styles.balanceAmount, { color: colors.foreground }]}>
            {balanceVisible ? `$${balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}` : "••••••"}
          </Text>
          <View style={styles.cardBottom}>
            <View style={styles.cardChip}>
              <View style={[styles.chip1, { backgroundColor: colors.primary + "80" }]} />
              <View style={[styles.chip2, { backgroundColor: colors.primary + "40" }]} />
            </View>
            <Text style={[styles.cardNumber, { color: colors.mutedForeground }]}>
              •••• •••• •••• 4242
            </Text>
          </View>
          <View style={styles.cardBadge}>
            <View style={[styles.badgeDot, { backgroundColor: colors.primary }]} />
            <Text style={[styles.badgeText, { color: colors.primary }]}>Active</Text>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <View style={styles.quickActions}>
          {quickActions.map((action) => (
            <TouchableOpacity
              key={action.label}
              style={styles.quickAction}
              onPress={async () => {
                await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                if (action.route) router.push(action.route as any);
              }}
              activeOpacity={0.7}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: action.color + "20", borderColor: action.color + "30" }]}>
                <Feather name={action.icon as any} size={22} color={action.color} />
              </View>
              <Text style={[styles.quickActionLabel, { color: colors.mutedForeground }]}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Crypto Portfolio */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Portfolio</Text>
          <TouchableOpacity onPress={() => router.push("/(tabs)/markets")}>
            <Text style={[styles.seeAll, { color: colors.primary }]}>See All</Text>
          </TouchableOpacity>
        </View>
        <View style={[styles.portfolioCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {cryptoHoldings.map((coin, i) => (
            <View
              key={coin.symbol}
              style={[
                styles.portfolioRow,
                i < cryptoHoldings.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border },
              ]}
            >
              <View style={[styles.coinDot, { backgroundColor: coin.color }]} />
              <View style={styles.coinInfo}>
                <Text style={[styles.coinSymbol, { color: colors.foreground }]}>{coin.symbol}</Text>
                <Text style={[styles.coinAmount, { color: colors.mutedForeground }]}>{coin.amount} {coin.symbol}</Text>
              </View>
              <View style={styles.coinRight}>
                <Text style={[styles.coinValue, { color: colors.foreground }]}>${coin.valueUSD.toFixed(2)}</Text>
                <Text style={[styles.coinChange, { color: coin.change24h >= 0 ? colors.positive : colors.negative }]}>
                  {coin.change24h >= 0 ? "+" : ""}{coin.change24h.toFixed(2)}%
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Transactions */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Transactions</Text>
          <TouchableOpacity>
            <Text style={[styles.seeAll, { color: colors.primary }]}>See All</Text>
          </TouchableOpacity>
        </View>
        <View style={[styles.txList, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {transactions.slice(0, 5).map((tx) => (
            <TransactionItem key={tx.id} tx={tx} />
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    paddingHorizontal: 24, paddingBottom: 24,
  },
  greeting: { fontSize: 13, fontFamily: "Inter_400Regular", marginBottom: 2 },
  name: { fontSize: 22, fontFamily: "Inter_700Bold", letterSpacing: -0.5 },
  headerActions: { flexDirection: "row", gap: 10, alignItems: "center" },
  headerBtn: {
    width: 40, height: 40, borderRadius: 12, borderWidth: 1,
    alignItems: "center", justifyContent: "center",
  },
  avatar: {
    width: 40, height: 40, borderRadius: 12, borderWidth: 1,
    alignItems: "center", justifyContent: "center",
  },
  avatarText: { fontSize: 16, fontFamily: "Inter_700Bold" },
  cardContainer: { paddingHorizontal: 24, marginBottom: 24 },
  balanceCard: {
    borderRadius: 24, borderWidth: 1, padding: 24, overflow: "hidden", position: "relative", minHeight: 180,
  },
  cardGlow: {
    position: "absolute", top: -40, right: -40,
    width: 160, height: 160, borderRadius: 80, opacity: 0.12,
  },
  cardTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  cardLabel: { fontSize: 13, fontFamily: "Inter_500Medium" },
  balanceAmount: { fontSize: 40, fontFamily: "Inter_700Bold", letterSpacing: -1, marginBottom: 24 },
  cardBottom: { flexDirection: "row", alignItems: "center", gap: 12 },
  cardChip: { flexDirection: "row", gap: -4 },
  chip1: { width: 20, height: 20, borderRadius: 10 },
  chip2: { width: 20, height: 20, borderRadius: 10, marginLeft: -6 },
  cardNumber: { fontSize: 14, fontFamily: "Inter_400Regular", letterSpacing: 2 },
  cardBadge: {
    position: "absolute", top: 24, right: 24,
    flexDirection: "row", alignItems: "center", gap: 5,
  },
  badgeDot: { width: 6, height: 6, borderRadius: 3 },
  badgeText: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
  section: { paddingHorizontal: 24, marginBottom: 24 },
  quickActions: { flexDirection: "row", justifyContent: "space-between" },
  quickAction: { alignItems: "center", gap: 8 },
  quickActionIcon: {
    width: 60, height: 60, borderRadius: 18, borderWidth: 1,
    alignItems: "center", justifyContent: "center",
  },
  quickActionLabel: { fontSize: 12, fontFamily: "Inter_500Medium" },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 14 },
  sectionTitle: { fontSize: 18, fontFamily: "Inter_600SemiBold" },
  seeAll: { fontSize: 14, fontFamily: "Inter_500Medium" },
  portfolioCard: { borderRadius: 20, borderWidth: 1, overflow: "hidden" },
  portfolioRow: { flexDirection: "row", alignItems: "center", padding: 16, gap: 12 },
  coinDot: { width: 10, height: 10, borderRadius: 5 },
  coinInfo: { flex: 1 },
  coinSymbol: { fontSize: 15, fontFamily: "Inter_600SemiBold", marginBottom: 2 },
  coinAmount: { fontSize: 12, fontFamily: "Inter_400Regular" },
  coinRight: { alignItems: "flex-end" },
  coinValue: { fontSize: 15, fontFamily: "Inter_600SemiBold", marginBottom: 2 },
  coinChange: { fontSize: 12, fontFamily: "Inter_500Medium" },
  txList: { borderRadius: 20, borderWidth: 1, overflow: "hidden" },
  txItem: { flexDirection: "row", alignItems: "center", padding: 16, gap: 12, borderBottomWidth: 1 },
  txIcon: { width: 42, height: 42, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  txInfo: { flex: 1 },
  txTitle: { fontSize: 15, fontFamily: "Inter_500Medium", marginBottom: 2 },
  txSub: { fontSize: 12, fontFamily: "Inter_400Regular" },
  txAmount: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
});
