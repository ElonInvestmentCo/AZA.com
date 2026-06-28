import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ScreenHeader } from "@/components/ScreenHeader";
import { useColors } from "@/hooks/useColors";

const CARDS = [
  { id: "1", name: "Amazon", category: "Shopping", rate: "₦780/$", color: "#FF9900", icon: "shopping-bag" as const },
  { id: "2", name: "iTunes", category: "Entertainment", rate: "₦710/$", color: "#FC3C44", icon: "music" as const },
  { id: "3", name: "Steam", category: "Gaming", rate: "₦720/$", color: "#1B2838", icon: "monitor" as const },
  { id: "4", name: "Google Play", category: "Apps", rate: "₦700/$", color: "#34A853", icon: "smartphone" as const },
  { id: "5", name: "Netflix", category: "Streaming", rate: "₦650/$", color: "#E50914", icon: "tv" as const },
  { id: "6", name: "Xbox", category: "Gaming", rate: "₦730/$", color: "#107C10", icon: "headphones" as const },
  { id: "7", name: "Vanilla Visa", category: "Finance", rate: "₦760/$", color: "#1A1F71", icon: "credit-card" as const },
  { id: "8", name: "eBay", category: "Shopping", rate: "₦690/$", color: "#E53238", icon: "tag" as const },
];

export default function GiftCardsScreen() {
  const router = useRouter();
  const colors = useColors();
  const [selected, setSelected] = useState<"sell" | "trade">("sell");

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <ScreenHeader title="Gift Cards" />

      <View style={styles.toggle}>
        {(["sell", "trade"] as const).map((t) => (
          <TouchableOpacity
            key={t}
            style={[
              styles.toggleBtn,
              {
                backgroundColor: selected === t ? colors.primary : "transparent",
                borderColor: colors.border,
              },
            ]}
            onPress={() => setSelected(t)}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.toggleText,
                { color: selected === t ? "#fff" : colors.mutedForeground },
              ]}
            >
              {t === "sell" ? "Sell Card" : "Trade Asset"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={CARDS}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.list}
        columnWrapperStyle={styles.columnWrapper}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() =>
              router.push(
                selected === "sell"
                  ? {
                      pathname: "/(app)/sell-gift-card",
                      params: { card: item.name },
                    }
                  : {
                      pathname: "/(app)/trade-asset",
                      params: { card: item.name },
                    }
              )
            }
            activeOpacity={0.85}
          >
            <View style={[styles.cardIcon, { backgroundColor: item.color + "20" }]}>
              <Feather name={item.icon} size={24} color={item.color} />
            </View>
            <Text style={[styles.cardName, { color: colors.text }]}>{item.name}</Text>
            <Text style={[styles.cardCat, { color: colors.mutedForeground }]}>{item.category}</Text>
            <View style={[styles.rateBadge, { backgroundColor: colors.successLight }]}>
              <Text style={[styles.rateText, { color: colors.success }]}>{item.rate}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  toggle: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginVertical: 16,
    gap: 8,
  },
  toggleBtn: {
    flex: 1,
    height: 44,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  toggleText: { fontSize: 14, fontFamily: "Manrope_600SemiBold" },
  list: { paddingHorizontal: 16, paddingBottom: 32 },
  columnWrapper: { gap: 12, marginBottom: 12 },
  card: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    gap: 6,
  },
  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  cardName: { fontSize: 15, fontFamily: "Manrope_700Bold" },
  cardCat: { fontSize: 12, fontFamily: "Manrope_400Regular" },
  rateBadge: { alignSelf: "flex-start", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4, marginTop: 4 },
  rateText: { fontSize: 11, fontFamily: "Manrope_600SemiBold" },
});
