import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, {
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { ScreenHeader } from "@/components/ScreenHeader";
import { useColors } from "@/hooks/useColors";

const CARDS = [
  { id: "1", name: "Amazon",       category: "Shopping",      rate: "₦780/$", color: "#FF9900", icon: "shopping-bag" as const },
  { id: "2", name: "iTunes",       category: "Entertainment", rate: "₦710/$", color: "#FC3C44", icon: "music"        as const },
  { id: "3", name: "Steam",        category: "Gaming",        rate: "₦720/$", color: "#66C0F4", icon: "monitor"      as const },
  { id: "4", name: "Google Play",  category: "Apps",          rate: "₦700/$", color: "#34A853", icon: "smartphone"   as const },
  { id: "5", name: "Netflix",      category: "Streaming",     rate: "₦650/$", color: "#E50914", icon: "tv"           as const },
  { id: "6", name: "Xbox",         category: "Gaming",        rate: "₦730/$", color: "#52B043", icon: "headphones"   as const },
  { id: "7", name: "Vanilla Visa", category: "Finance",       rate: "₦760/$", color: "#5C6BC0", icon: "credit-card"  as const },
  { id: "8", name: "eBay",         category: "Shopping",      rate: "₦690/$", color: "#E53238", icon: "tag"          as const },
];

function GiftCard({
  item, onPress,
}: { item: typeof CARDS[0]; onPress: () => void }) {
  const colors = useColors();
  const scale  = useSharedValue(1);
  const style  = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Animated.View style={[{ flex: 1 }, style]}>
      <Pressable
        style={[s.card, { backgroundColor: colors.card, borderColor: colors.border }]}
        onPress={onPress}
        onPressIn={() => { scale.value = withSpring(0.96, { damping: 12, stiffness: 300 }); }}
        onPressOut={() => { scale.value = withSpring(1.0,  { damping: 12, stiffness: 300 }); }}
      >
        <View style={[s.cardIcon, { backgroundColor: item.color + "22" }]}>
          <Feather name={item.icon} size={22} color={item.color} />
        </View>
        <Text style={[s.cardName, { color: colors.text }]}>{item.name}</Text>
        <Text style={[s.cardCat,  { color: colors.mutedForeground }]}>{item.category}</Text>
        <View style={[s.rateBadge, { backgroundColor: colors.successLight }]}>
          <Text style={[s.rateText, { color: colors.success }]}>{item.rate}</Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}

export default function GiftCardsScreen() {
  const router   = useRouter();
  const colors   = useColors();
  const [sel, setSel] = useState<"sell" | "trade">("sell");

  return (
    <View style={[s.root, { backgroundColor: colors.background }]}>
      <ScreenHeader title="Gift Cards" />

      {/* Toggle */}
      <Animated.View
        entering={FadeInUp.duration(380).springify().delay(40)}
        style={[s.toggleWrap, { backgroundColor: colors.surface, borderColor: colors.border }]}
      >
        {(["sell", "trade"] as const).map((t) => (
          <Pressable
            key={t}
            style={[
              s.toggleBtn,
              sel === t && { backgroundColor: colors.primary },
            ]}
            onPress={() => setSel(t)}
          >
            <Text
              style={[
                s.toggleText,
                { color: sel === t ? colors.primaryForeground : colors.mutedForeground },
              ]}
            >
              {t === "sell" ? "Sell Card" : "Trade Asset"}
            </Text>
          </Pressable>
        ))}
      </Animated.View>

      <FlatList
        data={CARDS}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={s.list}
        columnWrapperStyle={s.colWrap}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <Animated.View
            style={{ flex: 1 }}
            entering={FadeInUp.duration(350).springify().delay(60 + index * 40)}
          >
            <GiftCard
              item={item}
              onPress={() =>
                router.push(
                  sel === "sell"
                    ? { pathname: "/(app)/sell-gift-card", params: { card: item.name } }
                    : { pathname: "/(app)/trade-asset",    params: { card: item.name } }
                )
              }
            />
          </Animated.View>
        )}
      />
    </View>
  );
}

const s = StyleSheet.create({
  root:       { flex: 1 },
  toggleWrap: {
    flexDirection: "row", marginHorizontal: 20, marginVertical: 16,
    borderRadius: 14, borderWidth: 1, padding: 4, gap: 4,
  },
  toggleBtn:  { flex: 1, height: 40, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  toggleText: { fontSize: 14, fontFamily: "Manrope_600SemiBold" },
  list:       { paddingHorizontal: 16, paddingBottom: 32 },
  colWrap:    { gap: 12, marginBottom: 12 },
  card: {
    flex: 1, borderRadius: 16, padding: 16, borderWidth: 1, gap: 6,
  },
  cardIcon:  { width: 48, height: 48, borderRadius: 14, alignItems: "center", justifyContent: "center", marginBottom: 4 },
  cardName:  { fontSize: 15, fontFamily: "Manrope_700Bold" },
  cardCat:   { fontSize: 12, fontFamily: "Manrope_400Regular" },
  rateBadge: { alignSelf: "flex-start", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, marginTop: 4 },
  rateText:  { fontSize: 11, fontFamily: "Manrope_600SemiBold" },
});
