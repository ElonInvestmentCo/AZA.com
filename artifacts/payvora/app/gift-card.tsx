import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Dimensions,
  FlatList,
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

const { width: SCREEN_W } = Dimensions.get("window");

const WHITE     = "#FFFFFF";
const TEXT_DARK = "#0B0A0A";
const TEXT_GRAY = "#595F67";
const TEXT_LIGHT = "#AAAFB5";
const INPUT_BG  = "#F0F0F0";
const BORDER    = "#EDF1F3";
const BLACK     = "#000000";

const CARD_CATEGORIES = [
  { id: "1",  label: "Amazon",       icon: "shopping-cart", color: "#FF9900", bg: "#FFF3E0" },
  { id: "2",  label: "iTunes",       icon: "music",         color: "#FC3C44", bg: "#FFE8E9" },
  { id: "3",  label: "Google Play",  icon: "play",          color: "#34A853", bg: "#E8F5E9" },
  { id: "4",  label: "Steam",        icon: "monitor",       color: "#1B2838", bg: "#E3E8EE" },
  { id: "5",  label: "eBay",         icon: "tag",           color: "#E53238", bg: "#FDEAEA" },
  { id: "6",  label: "Walmart",      icon: "package",       color: "#0071CE", bg: "#E3F2FD" },
  { id: "7",  label: "Visa",         icon: "credit-card",   color: "#1A1F71", bg: "#E8EAF6" },
  { id: "8",  label: "Sephora",      icon: "heart",         color: "#000000", bg: "#F5F5F5" },
  { id: "9",  label: "Nike",         icon: "zap",           color: "#111111", bg: "#F0F0F0" },
  { id: "10", label: "Netflix",      icon: "film",          color: "#E50914", bg: "#FDEAEA" },
  { id: "11", label: "Nordstrom",    icon: "star",          color: "#1D1D1B", bg: "#F5F5F5" },
  { id: "12", label: "More",         icon: "grid",          color: "#595F67", bg: "#F5F5F5" },
];

const POPULAR = CARD_CATEGORIES.slice(0, 4);

interface GiftCardCategory {
  id: string;
  label: string;
  icon: string;
  color: string;
  bg: string;
}

function CategoryCard({ item, onPress }: { item: GiftCardCategory; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.catCard} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.catIconWrap, { backgroundColor: item.bg }]}>
        <Feather name={item.icon as any} size={22} color={item.color} />
      </View>
      <Text style={styles.catLabel} numberOfLines={1}>{item.label}</Text>
      <Feather name="chevron-right" size={13} color={TEXT_LIGHT} />
    </TouchableOpacity>
  );
}

export default function GiftCardScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [search, setSearch] = useState("");

  const topPad = Platform.OS === "web" ? 20 : insets.top;

  const filtered = search.trim()
    ? CARD_CATEGORIES.filter((c) => c.label.toLowerCase().includes(search.toLowerCase()))
    : CARD_CATEGORIES;

  async function handleCategory(item: GiftCardCategory) {
    await Haptics.selectionAsync();
    router.push("/sell-gift-card" as any);
  }

  return (
    <View style={[styles.screen, { paddingTop: topPad }]}>
      <StatusBar barStyle="dark-content" backgroundColor={WHITE} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backBtn}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Feather name="arrow-left" size={22} color={TEXT_DARK} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Gift Cards</Text>
        <View style={styles.headerRight} />
      </View>

      {/* Search */}
      <View style={styles.searchRow}>
        <View style={styles.searchWrap}>
          <Feather name="search" size={16} color={TEXT_LIGHT} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search gift cards…"
            placeholderTextColor={TEXT_LIGHT}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch("")} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Feather name="x-circle" size={15} color={TEXT_LIGHT} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Popular */}
        {!search && (
          <>
            <Text style={styles.sectionTitle}>Popular</Text>
            <View style={styles.popularRow}>
              {POPULAR.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.popularItem}
                  onPress={() => handleCategory(item)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.popularIcon, { backgroundColor: item.bg }]}>
                    <Feather name={item.icon as any} size={24} color={item.color} />
                  </View>
                  <Text style={styles.popularLabel}>{item.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.divider} />
          </>
        )}

        {/* All Categories */}
        <Text style={styles.sectionTitle}>{search ? "Results" : "All Categories"}</Text>

        {filtered.map((item) => (
          <CategoryCard key={item.id} item={item} onPress={() => handleCategory(item)} />
        ))}

        {filtered.length === 0 && (
          <View style={styles.emptyWrap}>
            <Feather name="search" size={40} color={TEXT_LIGHT} />
            <Text style={styles.emptyText}>No gift cards found</Text>
          </View>
        )}
      </ScrollView>

      {/* Sell CTA */}
      <View style={styles.ctaWrap}>
        <TouchableOpacity
          style={styles.ctaBtn}
          onPress={async () => {
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            router.push("/sell-gift-card" as any);
          }}
          activeOpacity={0.82}
        >
          <Feather name="tag" size={18} color={WHITE} />
          <Text style={styles.ctaText}>Sell a Gift Card</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: WHITE },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: BORDER,
  },
  backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: INPUT_BG, alignItems: "center", justifyContent: "center" },
  headerTitle: { fontFamily: "Inter_700Bold", fontSize: 17, color: TEXT_DARK },
  headerRight: { width: 36 },

  searchRow: { paddingHorizontal: 20, paddingVertical: 14 },
  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: INPUT_BG,
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 46,
    gap: 10,
  },
  searchIcon: {},
  searchInput: { flex: 1, fontFamily: "Inter_400Regular", fontSize: 14, color: TEXT_DARK },

  sectionTitle: { fontFamily: "Inter_600SemiBold", fontSize: 14, color: TEXT_DARK, paddingHorizontal: 20, marginBottom: 12, marginTop: 4 },

  popularRow: { flexDirection: "row", paddingHorizontal: 20, gap: 12, marginBottom: 20 },
  popularItem: { flex: 1, alignItems: "center", gap: 8 },
  popularIcon: { width: 56, height: 56, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  popularLabel: { fontFamily: "Inter_500Medium", fontSize: 11, color: TEXT_GRAY, textAlign: "center" },

  divider: { height: 1, backgroundColor: BORDER, marginHorizontal: 20, marginBottom: 20 },

  catCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: BORDER,
    gap: 14,
  },
  catIconWrap: { width: 44, height: 44, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  catLabel: { flex: 1, fontFamily: "Inter_500Medium", fontSize: 14, color: TEXT_DARK },

  emptyWrap: { alignItems: "center", paddingTop: 48, gap: 12 },
  emptyText: { fontFamily: "Inter_400Regular", fontSize: 14, color: TEXT_LIGHT },

  ctaWrap: {
    paddingHorizontal: 20, paddingVertical: 16,
    borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: BORDER,
    backgroundColor: WHITE,
  },
  ctaBtn: {
    backgroundColor: BLACK, borderRadius: 14, height: 52,
    flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10,
  },
  ctaText: { fontFamily: "Inter_600SemiBold", fontSize: 16, color: WHITE },
});
