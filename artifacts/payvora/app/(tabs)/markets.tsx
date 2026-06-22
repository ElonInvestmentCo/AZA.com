import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";
import { useWallet } from "@/context/WalletContext";

const ALL_CRYPTO = [
  { symbol: "BTC", name: "Bitcoin", price: 66428.17, change24h: 2.34, marketCap: "1.31T", volume: "28.4B", color: "#F7931A", sparkline: [62000, 63500, 61000, 64000, 65000, 63800, 66428] },
  { symbol: "ETH", name: "Ethereum", price: 3118.35, change24h: -1.12, marketCap: "374.2B", volume: "14.2B", color: "#627EEA", sparkline: [3200, 3050, 3100, 2980, 3050, 3120, 3118] },
  { symbol: "SOL", name: "Solana", price: 157.93, change24h: 5.67, marketCap: "72.8B", volume: "4.1B", color: "#9945FF", sparkline: [140, 145, 142, 150, 148, 155, 157] },
  { symbol: "BNB", name: "BNB", price: 598.42, change24h: 0.89, marketCap: "88.3B", volume: "2.3B", color: "#F3BA2F", sparkline: [585, 590, 580, 595, 592, 596, 598] },
  { symbol: "XRP", name: "Ripple", price: 0.5832, change24h: -0.43, marketCap: "32.1B", volume: "1.8B", color: "#00AAE4", sparkline: [0.60, 0.59, 0.585, 0.575, 0.58, 0.582, 0.583] },
  { symbol: "ADA", name: "Cardano", price: 0.4521, change24h: 3.21, marketCap: "16.0B", volume: "0.8B", color: "#0033AD", sparkline: [0.42, 0.43, 0.44, 0.435, 0.44, 0.448, 0.452] },
  { symbol: "AVAX", name: "Avalanche", price: 36.82, change24h: -2.15, marketCap: "15.2B", volume: "0.6B", color: "#E84142", sparkline: [38, 37.5, 37, 37.5, 36.5, 36.8, 36.8] },
  { symbol: "MATIC", name: "Polygon", price: 0.7214, change24h: 1.45, marketCap: "7.2B", volume: "0.5B", color: "#8247E5", sparkline: [0.70, 0.71, 0.705, 0.715, 0.718, 0.720, 0.721] },
];

function MiniSparkline({ data, color, up }: { data: number[]; color: string; up: boolean }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const width = 60;
  const height = 32;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * height;
    return `${x},${y}`;
  });
  return (
    <View style={{ width, height }}>
      {/* SVG-like path via positioned views */}
      <View style={{ flexDirection: "row", alignItems: "flex-end", height, gap: 1 }}>
        {data.map((v, i) => {
          const barH = Math.max(2, ((v - min) / range) * height);
          return (
            <View
              key={i}
              style={{
                flex: 1,
                height: barH,
                backgroundColor: up ? "#00D9A0" + "80" : "#EF4444" + "80",
                borderRadius: 1,
              }}
            />
          );
        })}
      </View>
    </View>
  );
}

export default function MarketsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { cryptoHoldings, totalPortfolioValue } = useWallet();
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "watchlist">("all");

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const filtered = ALL_CRYPTO.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.symbol.toLowerCase().includes(search.toLowerCase())
  );

  const portfolioChange = 3.42;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingTop: topPad, paddingBottom: (Platform.OS === "web" ? 34 : 0) + 100 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.foreground }]}>Markets</Text>
        <TouchableOpacity
          style={[styles.headerBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
        >
          <Feather name="sliders" size={18} color={colors.foreground} />
        </TouchableOpacity>
      </View>

      {/* Portfolio Summary */}
      <View style={[styles.portfolioSummary, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={[styles.summaryGlow, { backgroundColor: colors.primary }]} />
        <Text style={[styles.summaryLabel, { color: colors.mutedForeground }]}>Portfolio Value</Text>
        <Text style={[styles.summaryValue, { color: colors.foreground }]}>
          ${totalPortfolioValue.toLocaleString("en-US", { minimumFractionDigits: 2 })}
        </Text>
        <View style={styles.summaryChange}>
          <Feather name="trending-up" size={14} color={colors.positive} />
          <Text style={[styles.summaryChangeText, { color: colors.positive }]}>
            +{portfolioChange}% today
          </Text>
        </View>
        <View style={styles.holdingDots}>
          {cryptoHoldings.map((h) => (
            <View key={h.symbol} style={styles.holdingDot}>
              <View style={[styles.dot, { backgroundColor: h.color }]} />
              <Text style={[styles.holdingLabel, { color: colors.mutedForeground }]}>{h.symbol}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <View style={[styles.searchBar, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Feather name="search" size={16} color={colors.mutedForeground} />
          <TextInput
            style={[styles.searchInput, { color: colors.foreground }]}
            value={search}
            onChangeText={setSearch}
            placeholder="Search coins..."
            placeholderTextColor={colors.mutedForeground}
            autoCorrect={false}
            autoCapitalize="none"
          />
          {search ? (
            <TouchableOpacity onPress={() => setSearch("")}>
              <Feather name="x" size={16} color={colors.mutedForeground} />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabRow}>
        {(["all", "watchlist"] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tab,
              activeTab === tab && { backgroundColor: colors.primary + "20", borderColor: colors.primary + "40" },
              { borderColor: colors.border },
            ]}
            onPress={async () => {
              await Haptics.selectionAsync();
              setActiveTab(tab);
            }}
          >
            <Text
              style={[
                styles.tabText,
                { color: activeTab === tab ? colors.primary : colors.mutedForeground },
              ]}
            >
              {tab === "all" ? "All Assets" : "Watchlist"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Crypto List */}
      <View style={[styles.cryptoList, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={[styles.listHeader, { borderBottomColor: colors.border }]}>
          <Text style={[styles.listHeaderText, { color: colors.mutedForeground }]}>Asset</Text>
          <Text style={[styles.listHeaderText, { color: colors.mutedForeground }]}>Price / 24h</Text>
        </View>
        {filtered.map((coin, i) => (
          <TouchableOpacity
            key={coin.symbol}
            style={[
              styles.cryptoRow,
              i < filtered.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border },
            ]}
            onPress={() => Haptics.selectionAsync()}
            activeOpacity={0.7}
          >
            <View style={styles.cryptoLeft}>
              <View style={[styles.coinIcon, { backgroundColor: coin.color + "20" }]}>
                <Text style={{ fontSize: 12, fontFamily: "Inter_700Bold", color: coin.color }}>
                  {coin.symbol.charAt(0)}
                </Text>
              </View>
              <View>
                <Text style={[styles.coinName, { color: colors.foreground }]}>{coin.symbol}</Text>
                <Text style={[styles.coinFullName, { color: colors.mutedForeground }]}>{coin.name}</Text>
              </View>
            </View>
            <MiniSparkline data={coin.sparkline} color={coin.color} up={coin.change24h >= 0} />
            <View style={styles.cryptoRight}>
              <Text style={[styles.cryptoPrice, { color: colors.foreground }]}>
                ${coin.price < 1 ? coin.price.toFixed(4) : coin.price.toLocaleString("en-US")}
              </Text>
              <Text style={[styles.cryptoChange, { color: coin.change24h >= 0 ? colors.positive : colors.negative }]}>
                {coin.change24h >= 0 ? "+" : ""}{coin.change24h.toFixed(2)}%
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    paddingHorizontal: 24, paddingBottom: 20,
  },
  title: { fontSize: 28, fontFamily: "Inter_700Bold", letterSpacing: -0.5 },
  headerBtn: {
    width: 40, height: 40, borderRadius: 12, borderWidth: 1,
    alignItems: "center", justifyContent: "center",
  },
  portfolioSummary: {
    marginHorizontal: 24, borderRadius: 20, borderWidth: 1,
    padding: 20, marginBottom: 16, overflow: "hidden", position: "relative",
  },
  summaryGlow: {
    position: "absolute", top: -30, right: -30,
    width: 100, height: 100, borderRadius: 50, opacity: 0.12,
  },
  summaryLabel: { fontSize: 13, fontFamily: "Inter_500Medium", marginBottom: 6 },
  summaryValue: { fontSize: 32, fontFamily: "Inter_700Bold", letterSpacing: -1, marginBottom: 8 },
  summaryChange: { flexDirection: "row", alignItems: "center", gap: 4, marginBottom: 16 },
  summaryChangeText: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  holdingDots: { flexDirection: "row", gap: 12 },
  holdingDot: { flexDirection: "row", alignItems: "center", gap: 5 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  holdingLabel: { fontSize: 12, fontFamily: "Inter_500Medium" },
  searchContainer: { paddingHorizontal: 24, marginBottom: 14 },
  searchBar: {
    flexDirection: "row", alignItems: "center", gap: 10,
    borderRadius: 14, borderWidth: 1, paddingHorizontal: 14, height: 46,
  },
  searchInput: { flex: 1, fontSize: 15, fontFamily: "Inter_400Regular" },
  tabRow: { flexDirection: "row", gap: 10, paddingHorizontal: 24, marginBottom: 16 },
  tab: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10, borderWidth: 1 },
  tabText: { fontSize: 14, fontFamily: "Inter_500Medium" },
  cryptoList: { marginHorizontal: 24, borderRadius: 20, borderWidth: 1, overflow: "hidden" },
  listHeader: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    paddingHorizontal: 16, paddingVertical: 10, borderBottomWidth: 1,
  },
  listHeaderText: { fontSize: 12, fontFamily: "Inter_500Medium" },
  cryptoRow: { flexDirection: "row", alignItems: "center", padding: 14, gap: 10 },
  cryptoLeft: { flexDirection: "row", alignItems: "center", gap: 10, flex: 1 },
  coinIcon: { width: 36, height: 36, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  coinName: { fontSize: 14, fontFamily: "Inter_600SemiBold", marginBottom: 1 },
  coinFullName: { fontSize: 11, fontFamily: "Inter_400Regular" },
  cryptoRight: { alignItems: "flex-end", minWidth: 80 },
  cryptoPrice: { fontSize: 14, fontFamily: "Inter_600SemiBold", marginBottom: 1 },
  cryptoChange: { fontSize: 12, fontFamily: "Inter_500Medium" },
});
