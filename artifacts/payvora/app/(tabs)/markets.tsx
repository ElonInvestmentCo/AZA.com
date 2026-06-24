import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import {
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useWallet } from "@/context/WalletContext";

const WHITE      = "#FFFFFF";
const TEXT_DARK  = "#0B0A0A";
const TEXT_GRAY  = "#595F67";
const TEXT_LIGHT = "#AAAFB5";
const INPUT_BG   = "#F0F0F0";
const BORDER     = "#EDF1F3";
const BLACK      = "#000000";
const GREEN      = "#00B03C";
const RED        = "#FF0000";

const ALL_CRYPTO = [
  { symbol: "BTC",  name: "Bitcoin",    price: 66428.17, change24h:  2.34, marketCap: "1.31T", volume: "28.4B", color: "#F7931A", sparkline: [62000, 63500, 61000, 64000, 65000, 63800, 66428] },
  { symbol: "ETH",  name: "Ethereum",   price: 3118.35,  change24h: -1.12, marketCap: "374.2B", volume: "14.2B", color: "#627EEA", sparkline: [3200, 3050, 3100, 2980, 3050, 3120, 3118] },
  { symbol: "SOL",  name: "Solana",     price: 157.93,   change24h:  5.67, marketCap: "72.8B",  volume: "4.1B",  color: "#9945FF", sparkline: [140, 145, 142, 150, 148, 155, 157] },
  { symbol: "BNB",  name: "BNB",        price: 598.42,   change24h:  0.89, marketCap: "88.3B",  volume: "2.3B",  color: "#F3BA2F", sparkline: [585, 590, 580, 595, 592, 596, 598] },
  { symbol: "XRP",  name: "Ripple",     price: 0.5832,   change24h: -0.43, marketCap: "32.1B",  volume: "1.8B",  color: "#00AAE4", sparkline: [0.60, 0.59, 0.585, 0.575, 0.58, 0.582, 0.583] },
  { symbol: "ADA",  name: "Cardano",    price: 0.4521,   change24h:  3.21, marketCap: "16.0B",  volume: "0.8B",  color: "#0033AD", sparkline: [0.42, 0.43, 0.44, 0.435, 0.44, 0.448, 0.452] },
  { symbol: "AVAX", name: "Avalanche",  price: 36.82,    change24h: -2.15, marketCap: "15.2B",  volume: "0.6B",  color: "#E84142", sparkline: [38, 37.5, 37, 37.5, 36.5, 36.8, 36.8] },
  { symbol: "MATIC",name: "Polygon",    price: 0.7214,   change24h:  1.45, marketCap: "7.2B",   volume: "0.5B",  color: "#8247E5", sparkline: [0.70, 0.71, 0.705, 0.715, 0.718, 0.720, 0.721] },
];

function MiniSparkline({ data, up }: { data: number[]; up: boolean }) {
  const min   = Math.min(...data);
  const max   = Math.max(...data);
  const range = max - min || 1;
  const H     = 28;
  return (
    <View style={{ width: 56, height: H, flexDirection: "row", alignItems: "flex-end", gap: 2 }}>
      {data.map((v, i) => {
        const barH = Math.max(3, ((v - min) / range) * H);
        return (
          <View
            key={i}
            style={{ flex: 1, height: barH, borderRadius: 2,
              backgroundColor: up ? GREEN + "90" : RED + "80" }}
          />
        );
      })}
    </View>
  );
}

export default function TradeAssetsScreen() {
  const insets = useSafeAreaInsets();
  const { cryptoHoldings, totalPortfolioValue } = useWallet();
  const [search,     setSearch]     = useState("");
  const [activeTab,  setActiveTab]  = useState<"all" | "watchlist">("all");

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const filtered = ALL_CRYPTO.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.symbol.toLowerCase().includes(search.toLowerCase())
  );
  const list = activeTab === "watchlist" ? [] : filtered;

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={{ paddingTop: topPad, paddingBottom: 110 }}
      showsVerticalScrollIndicator={false}
    >
      <StatusBar barStyle="dark-content" backgroundColor={WHITE} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Trade Assets</Text>
        <TouchableOpacity
          style={styles.filterBtn}
          onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
          activeOpacity={0.7}
        >
          <Feather name="sliders" size={18} color={TEXT_DARK} />
        </TouchableOpacity>
      </View>

      {/* Portfolio Summary */}
      <View style={styles.portfolioCard}>
        <Text style={styles.portfolioLabel}>Portfolio Value</Text>
        <Text style={styles.portfolioValue}>
          ${totalPortfolioValue.toLocaleString("en-US", { minimumFractionDigits: 2 })}
        </Text>
        <View style={styles.portfolioChangeRow}>
          <View style={styles.changeChip}>
            <Feather name="trending-up" size={12} color={GREEN} />
            <Text style={styles.changeText}>+3.42% today</Text>
          </View>
        </View>

        {/* Holding breakdown */}
        <View style={styles.holdingsRow}>
          {cryptoHoldings.map((h) => (
            <View key={h.symbol} style={styles.holdingItem}>
              <View style={[styles.holdingDot, { backgroundColor: h.color }]} />
              <View>
                <Text style={styles.holdingSymbol}>{h.symbol}</Text>
                <Text style={styles.holdingVal}>${h.valueUSD.toLocaleString("en-US", { maximumFractionDigits: 0 })}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchWrap}>
        <Feather name="search" size={15} color={TEXT_LIGHT} />
        <TextInput
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
          placeholder="Search assets…"
          placeholderTextColor={TEXT_LIGHT}
          autoCorrect={false}
          autoCapitalize="none"
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch("")} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Feather name="x" size={15} color={TEXT_LIGHT} />
          </TouchableOpacity>
        )}
      </View>

      {/* Tabs */}
      <View style={styles.tabRow}>
        {(["all", "watchlist"] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={async () => { await Haptics.selectionAsync(); setActiveTab(tab); }}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab === "all" ? "All Assets" : "Watchlist"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Asset List */}
      {activeTab === "watchlist" ? (
        <View style={styles.emptyCard}>
          <View style={styles.emptyIconWrap}>
            <Feather name="bookmark" size={26} color={TEXT_LIGHT} />
          </View>
          <Text style={styles.emptyTitle}>No watchlist yet</Text>
          <Text style={styles.emptySub}>Tap an asset to add it to your watchlist</Text>
        </View>
      ) : (
        <View style={styles.assetList}>
          {/* List Header */}
          <View style={styles.listHeader}>
            <Text style={styles.listHeaderLabel}>Asset</Text>
            <Text style={[styles.listHeaderLabel, { marginLeft: "auto" }]}>7d Chart</Text>
            <Text style={[styles.listHeaderLabel, { minWidth: 90, textAlign: "right" }]}>Price / 24h</Text>
          </View>

          {list.map((coin, i) => (
            <TouchableOpacity
              key={coin.symbol}
              style={[styles.assetRow, i < list.length - 1 && styles.assetRowBorder]}
              onPress={() => Haptics.selectionAsync()}
              activeOpacity={0.7}
            >
              {/* Icon + name */}
              <View style={styles.assetLeft}>
                <View style={[styles.coinIcon, { backgroundColor: coin.color + "20" }]}>
                  <Text style={{ fontFamily: "Inter_700Bold", fontSize: 13, color: coin.color }}>
                    {coin.symbol.charAt(0)}
                  </Text>
                </View>
                <View>
                  <Text style={styles.coinSymbol}>{coin.symbol}</Text>
                  <Text style={styles.coinName}>{coin.name}</Text>
                </View>
              </View>

              {/* Sparkline */}
              <MiniSparkline data={coin.sparkline} up={coin.change24h >= 0} />

              {/* Price */}
              <View style={styles.assetRight}>
                <Text style={styles.coinPrice}>
                  ${coin.price < 1 ? coin.price.toFixed(4) : coin.price.toLocaleString("en-US")}
                </Text>
                <Text style={[styles.coinChange, { color: coin.change24h >= 0 ? GREEN : RED }]}>
                  {coin.change24h >= 0 ? "+" : ""}{coin.change24h.toFixed(2)}%
                </Text>
              </View>
            </TouchableOpacity>
          ))}

          {list.length === 0 && search && (
            <View style={styles.noResults}>
              <Feather name="search" size={32} color={TEXT_LIGHT} />
              <Text style={styles.noResultsText}>No assets found for "{search}"</Text>
            </View>
          )}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: WHITE },

  header: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    paddingHorizontal: 24, paddingBottom: 20,
  },
  title: { fontFamily: "Inter_700Bold", fontSize: 26, color: TEXT_DARK, letterSpacing: -0.5 },
  filterBtn: {
    width: 40, height: 40, borderRadius: 12, backgroundColor: INPUT_BG,
    alignItems: "center", justifyContent: "center",
  },

  portfolioCard: {
    marginHorizontal: 24, borderRadius: 20, padding: 22,
    backgroundColor: BLACK, marginBottom: 18,
  },
  portfolioLabel: { fontFamily: "Inter_500Medium", fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 6 },
  portfolioValue: { fontFamily: "Inter_700Bold", fontSize: 30, color: WHITE, letterSpacing: -1, marginBottom: 10 },
  portfolioChangeRow: { flexDirection: "row", marginBottom: 20 },
  changeChip: {
    flexDirection: "row", alignItems: "center", gap: 4,
    backgroundColor: GREEN + "20", borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5,
  },
  changeText: { fontFamily: "Inter_600SemiBold", fontSize: 12, color: GREEN },
  holdingsRow: { flexDirection: "row", gap: 16, flexWrap: "wrap" },
  holdingItem: { flexDirection: "row", alignItems: "center", gap: 8 },
  holdingDot: { width: 8, height: 8, borderRadius: 4 },
  holdingSymbol: { fontFamily: "Inter_600SemiBold", fontSize: 12, color: WHITE },
  holdingVal: { fontFamily: "Inter_400Regular", fontSize: 11, color: "rgba(255,255,255,0.5)" },

  searchWrap: {
    flexDirection: "row", alignItems: "center", gap: 10,
    marginHorizontal: 24, backgroundColor: INPUT_BG, borderRadius: 12,
    paddingHorizontal: 14, height: 46, marginBottom: 14,
  },
  searchInput: { flex: 1, fontFamily: "Inter_400Regular", fontSize: 14, color: TEXT_DARK },

  tabRow: { flexDirection: "row", gap: 10, paddingHorizontal: 24, marginBottom: 16 },
  tab: {
    paddingHorizontal: 18, paddingVertical: 9, borderRadius: 10,
    backgroundColor: INPUT_BG,
  },
  tabActive: { backgroundColor: BLACK },
  tabText: { fontFamily: "Inter_500Medium", fontSize: 13, color: TEXT_GRAY },
  tabTextActive: { color: WHITE, fontFamily: "Inter_600SemiBold" },

  assetList: {
    marginHorizontal: 24, borderRadius: 20, overflow: "hidden",
    borderWidth: 1, borderColor: BORDER, backgroundColor: WHITE,
  },
  listHeader: {
    flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 10,
    borderBottomWidth: 1, borderBottomColor: BORDER, gap: 10,
  },
  listHeaderLabel: { fontFamily: "Inter_500Medium", fontSize: 11, color: TEXT_LIGHT },

  assetRow: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 14, gap: 10 },
  assetRowBorder: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: BORDER },
  assetLeft: { flexDirection: "row", alignItems: "center", gap: 10, flex: 1 },
  coinIcon: { width: 38, height: 38, borderRadius: 11, alignItems: "center", justifyContent: "center" },
  coinSymbol: { fontFamily: "Inter_600SemiBold", fontSize: 13, color: TEXT_DARK, marginBottom: 1 },
  coinName: { fontFamily: "Inter_400Regular", fontSize: 11, color: TEXT_LIGHT },
  assetRight: { alignItems: "flex-end", minWidth: 82 },
  coinPrice: { fontFamily: "Inter_600SemiBold", fontSize: 13, color: TEXT_DARK, marginBottom: 2 },
  coinChange: { fontFamily: "Inter_500Medium", fontSize: 12 },

  emptyCard: {
    marginHorizontal: 24, borderRadius: 20, borderWidth: 1, borderColor: BORDER,
    padding: 48, alignItems: "center", gap: 12,
  },
  emptyIconWrap: { width: 56, height: 56, borderRadius: 16, backgroundColor: INPUT_BG, alignItems: "center", justifyContent: "center" },
  emptyTitle: { fontFamily: "Inter_600SemiBold", fontSize: 17, color: TEXT_DARK },
  emptySub: { fontFamily: "Inter_400Regular", fontSize: 13, color: TEXT_LIGHT, textAlign: "center", lineHeight: 20 },

  noResults: { padding: 40, alignItems: "center", gap: 12 },
  noResultsText: { fontFamily: "Inter_400Regular", fontSize: 14, color: TEXT_LIGHT, textAlign: "center" },
});
