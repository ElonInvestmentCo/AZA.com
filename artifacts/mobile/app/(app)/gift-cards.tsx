import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  FadeInUp,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { ScreenHeader } from "@/components/ScreenHeader";
import { useColors } from "@/hooks/useColors";

const CARDS = [
  { id: "1", name: "Amazon",       category: "Shopping",      rate: "₦780/$", color: "#FF9900", icon: "shopping-bag" as const, cvv: "472", expiry: "08/27", last4: "4821" },
  { id: "2", name: "iTunes",       category: "Entertainment", rate: "₦710/$", color: "#FC3C44", icon: "music"        as const, cvv: "319", expiry: "11/26", last4: "7734" },
  { id: "3", name: "Steam",        category: "Gaming",        rate: "₦720/$", color: "#66C0F4", icon: "monitor"      as const, cvv: "853", expiry: "03/28", last4: "2290" },
  { id: "4", name: "Google Play",  category: "Apps",          rate: "₦700/$", color: "#34A853", icon: "smartphone"   as const, cvv: "641", expiry: "07/27", last4: "5518" },
  { id: "5", name: "Netflix",      category: "Streaming",     rate: "₦650/$", color: "#E50914", icon: "tv"           as const, cvv: "205", expiry: "01/29", last4: "9963" },
  { id: "6", name: "Xbox",         category: "Gaming",        rate: "₦730/$", color: "#52B043", icon: "headphones"   as const, cvv: "788", expiry: "05/28", last4: "3347" },
  { id: "7", name: "Vanilla Visa", category: "Finance",       rate: "₦760/$", color: "#5C6BC0", icon: "credit-card"  as const, cvv: "134", expiry: "09/26", last4: "6612" },
  { id: "8", name: "eBay",         category: "Shopping",      rate: "₦690/$", color: "#E53238", icon: "tag"          as const, cvv: "967", expiry: "12/27", last4: "8805" },
];

function GiftCard({
  item,
  onPress,
}: {
  item: typeof CARDS[0];
  onPress: () => void;
}) {
  const colors  = useColors();
  const scale   = useSharedValue(1);
  const flip    = useSharedValue(0); // 0 = front, 1 = back
  const [isFlipped, setIsFlipped] = useState(false);

  const frontStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(flip.value, [0, 1], [0, 180]);
    return {
      transform: [{ perspective: 1000 }, { rotateY: `${rotateY}deg` }, { scale: scale.value }],
      backfaceVisibility: "hidden" as const,
    };
  });

  const backStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(flip.value, [0, 1], [180, 360]);
    return {
      transform: [{ perspective: 1000 }, { rotateY: `${rotateY}deg` }, { scale: scale.value }],
      backfaceVisibility: "hidden" as const,
    };
  });

  const handleTap = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const next = !isFlipped;
    setIsFlipped(next);
    flip.value = withTiming(next ? 1 : 0, { duration: 480 });
  };

  const handlePressIn = () => {
    scale.value = withSpring(0.96, { damping: 12, stiffness: 300 });
  };
  const handlePressOut = () => {
    scale.value = withSpring(1.0, { damping: 12, stiffness: 300 });
  };

  return (
    <View style={{ flex: 1 }}>
      <Pressable
        onPress={handleTap}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={{ flex: 1 }}
      >
        {/* FRONT */}
        <Animated.View
          style={[
            s.card,
            { backgroundColor: colors.card, borderColor: colors.border },
            frontStyle,
            { position: "absolute", top: 0, left: 0, right: 0, bottom: 0 },
          ]}
        >
          <View style={[s.cardIcon, { backgroundColor: item.color + "22" }]}>
            <Feather name={item.icon} size={22} color={item.color} />
          </View>
          <Text style={[s.cardName, { color: colors.text }]}>{item.name}</Text>
          <Text style={[s.cardCat, { color: colors.mutedForeground }]}>{item.category}</Text>
          <View style={[s.rateBadge, { backgroundColor: colors.successLight }]}>
            <Text style={[s.rateText, { color: colors.success }]}>{item.rate}</Text>
          </View>
          <View style={s.flipHint}>
            <Feather name="refresh-cw" size={10} color={colors.mutedForeground} />
            <Text style={[s.flipHintText, { color: colors.mutedForeground }]}>Tap to flip</Text>
          </View>
        </Animated.View>

        {/* BACK */}
        <Animated.View
          style={[
            s.card,
            s.cardBack,
            { backgroundColor: "#0A0A0F", borderColor: item.color + "55" },
            backStyle,
          ]}
        >
          {/* Card stripe */}
          <View style={[s.stripe, { backgroundColor: item.color + "33" }]} />

          <View style={s.backTopRow}>
            <View style={[s.backIconSmall, { backgroundColor: item.color + "22" }]}>
              <Feather name={item.icon} size={14} color={item.color} />
            </View>
            <Text style={[s.backBrand, { color: item.color }]}>{item.name}</Text>
          </View>

          <Text style={s.backLabel}>CARD NUMBER</Text>
          <Text style={s.backValue}>•••• •••• •••• {item.last4}</Text>

          <View style={s.backRow}>
            <View>
              <Text style={s.backLabel}>EXPIRY</Text>
              <Text style={s.backValue}>{item.expiry}</Text>
            </View>
            <View>
              <Text style={s.backLabel}>CVV</Text>
              <Text style={s.backValue}>{item.cvv}</Text>
            </View>
          </View>

          <View style={s.flipHint}>
            <Feather name="refresh-cw" size={10} color="#555" />
            <Text style={[s.flipHintText, { color: "#555" }]}>Tap to flip back</Text>
          </View>
        </Animated.View>
      </Pressable>

      {/* Invisible spacer so the card takes up correct height */}
      <View style={s.cardSpacer} />

      {/* Navigate button — only when front is showing */}
      {!isFlipped && (
        <TouchableOpacity
          style={[s.useBtn, { backgroundColor: item.color + "18", borderColor: item.color + "44" }]}
          onPress={onPress}
          activeOpacity={0.8}
        >
          <Text style={[s.useBtnText, { color: item.color }]}>Use card →</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

export default function GiftCardsScreen() {
  const router = useRouter();
  const colors = useColors();
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

const CARD_HEIGHT = 165;

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
    height: CARD_HEIGHT,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    gap: 4,
  },
  cardBack: {
    position: "absolute",
    top: 0, left: 0, right: 0,
    height: CARD_HEIGHT,
    gap: 0,
    justifyContent: "flex-end",
    overflow: "hidden",
  },
  cardSpacer: {
    height: CARD_HEIGHT,
  },

  cardIcon:  { width: 44, height: 44, borderRadius: 12, alignItems: "center", justifyContent: "center", marginBottom: 2 },
  cardName:  { fontSize: 15, fontFamily: "Manrope_700Bold" },
  cardCat:   { fontSize: 12, fontFamily: "Manrope_400Regular" },
  rateBadge: { alignSelf: "flex-start", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, marginTop: 4 },
  rateText:  { fontSize: 11, fontFamily: "Manrope_600SemiBold" },

  flipHint:  { flexDirection: "row", alignItems: "center", gap: 3, marginTop: 4 },
  flipHintText: { fontSize: 9, fontFamily: "Manrope_400Regular" },

  /* Back face */
  stripe: { position: "absolute", top: 32, left: 0, right: 0, height: 28 },
  backTopRow:   { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 8, marginTop: 4 },
  backIconSmall: { width: 24, height: 24, borderRadius: 6, alignItems: "center", justifyContent: "center" },
  backBrand:    { fontSize: 11, fontFamily: "Manrope_700Bold" },
  backLabel:    { fontSize: 8, fontFamily: "Manrope_600SemiBold", color: "#555", letterSpacing: 0.8, marginBottom: 1 },
  backValue:    { fontSize: 13, fontFamily: "Manrope_700Bold", color: "#FFFFFF", marginBottom: 6 },
  backRow:      { flexDirection: "row", gap: 24 },

  useBtn: {
    marginTop: 6,
    height: 32,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  useBtnText: { fontSize: 12, fontFamily: "Manrope_600SemiBold" },
});
