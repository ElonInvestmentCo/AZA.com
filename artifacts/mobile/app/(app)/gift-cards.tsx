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
import { useSafeAreaInsets } from "react-native-safe-area-context";

/* ─── Light theme ────────────────────────────────────────────────────────────── */
const C = {
  bg:       "#FFFFFF",
  surface:  "#F8F9FA",
  text:     "#0B0A0A",
  textSec:  "#595F67",
  textMuted:"#AAAFB5",
  border:   "#EDF1F3",
  success:  "#00B03C",
  inputBg:  "#F0F0F0",
};

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
  item,
  onPress,
}: {
  item: typeof CARDS[0];
  onPress: () => void;
}) {
  const scale   = useSharedValue(1);
  const flip    = useSharedValue(0);
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

  return (
    <View style={{ flex: 1 }}>
      <Pressable
        onPress={handleTap}
        onPressIn={() => { scale.value = withSpring(0.96, { damping: 12, stiffness: 300 }); }}
        onPressOut={() => { scale.value = withSpring(1.0, { damping: 12, stiffness: 300 }); }}
        style={{ flex: 1 }}
      >
        {/* FRONT */}
        <Animated.View
          style={[
            s.card,
            { backgroundColor: "#FFFFFF", borderColor: C.border },
            frontStyle,
            { position: "absolute", top: 0, left: 0, right: 0, bottom: 0 },
          ]}
        >
          <View style={[s.cardIcon, { backgroundColor: item.color + "18" }]}>
            <Feather name={item.icon} size={22} color={item.color} />
          </View>
          <Text style={[s.cardName, { color: C.text }]}>{item.name}</Text>
          <Text style={[s.cardCat,  { color: C.textSec }]}>{item.category}</Text>
          <View style={[s.rateBadge, { backgroundColor: C.success + "18" }]}>
            <Text style={[s.rateText, { color: C.success }]}>{item.rate}</Text>
          </View>
          <View style={s.flipHint}>
            <Feather name="refresh-cw" size={10} color={C.textMuted} />
            <Text style={[s.flipHintText, { color: C.textMuted }]}>Tap to flip</Text>
          </View>
        </Animated.View>

        {/* BACK */}
        <Animated.View
          style={[
            s.card,
            s.cardBack,
            { backgroundColor: "#111111", borderColor: item.color + "55" },
            backStyle,
          ]}
        >
          <View style={[s.stripe, { backgroundColor: item.color + "44" }]} />
          <View style={s.backTopRow}>
            <View style={[s.backIconSmall, { backgroundColor: item.color + "22" }]}>
              <Feather name={item.icon} size={14} color={item.color} />
            </View>
            <Text style={[s.backBrand, { color: item.color }]}>{item.name}</Text>
          </View>
          <Text style={s.backLabel}>CARD NUMBER</Text>
          <Text style={s.backValue}>•••• •••• •••• 4821</Text>
          <View style={s.backRow}>
            <View>
              <Text style={s.backLabel}>EXPIRY</Text>
              <Text style={s.backValue}>08/27</Text>
            </View>
            <View>
              <Text style={s.backLabel}>CVV</Text>
              <Text style={s.backValue}>472</Text>
            </View>
          </View>
          <View style={s.flipHint}>
            <Feather name="refresh-cw" size={10} color="#555" />
            <Text style={[s.flipHintText, { color: "#555" }]}>Tap to flip back</Text>
          </View>
        </Animated.View>
      </Pressable>

      <View style={s.cardSpacer} />

      {!isFlipped && (
        <TouchableOpacity
          style={[s.useBtn, { backgroundColor: item.color + "14", borderColor: item.color + "44" }]}
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
  const insets = useSafeAreaInsets();
  const [sel, setSel] = useState<"sell" | "trade">("sell");

  return (
    <View style={[s.root, { backgroundColor: C.bg }]}>
      {/* Header */}
      <View style={[s.header, { paddingTop: (insets.top || 16) + 12 }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={s.backBtn}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Feather name="arrow-left" size={22} color="#1E232C" />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Gift Cards</Text>
        <View style={{ width: 40 }} />
      </View>
      <View style={s.headerDivider} />

      {/* Sell / Trade toggle */}
      <Animated.View
        entering={FadeInUp.duration(380).springify().delay(40)}
        style={[s.toggleWrap, { backgroundColor: C.inputBg, borderColor: C.border }]}
      >
        {(["sell", "trade"] as const).map((t) => (
          <Pressable
            key={t}
            style={[
              s.toggleBtn,
              sel === t && { backgroundColor: "#000000" },
            ]}
            onPress={() => { Haptics.selectionAsync(); setSel(t); }}
          >
            <Text
              style={[
                s.toggleText,
                { color: sel === t ? "#FFFFFF" : C.textSec },
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
  root: { flex: 1 },

  header: {
    flexDirection:     "row",
    alignItems:        "center",
    justifyContent:    "space-between",
    paddingHorizontal: 20,
    paddingBottom:     16,
    backgroundColor:   "#FFFFFF",
  },
  backBtn: {
    width: 40, height: 40,
    alignItems:     "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize:   13,
    fontFamily: "Manrope_700Bold",
    color:      "#000000",
    textAlign:  "center",
  },
  headerDivider: { height: 1, backgroundColor: "#D1D1D1" },

  toggleWrap: {
    flexDirection:    "row",
    marginHorizontal: 20,
    marginVertical:   16,
    borderRadius:     14,
    borderWidth:      1,
    padding:          4,
    gap:              4,
  },
  toggleBtn:  { flex: 1, height: 40, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  toggleText: { fontSize: 14, fontFamily: "Manrope_600SemiBold" },

  list:    { paddingHorizontal: 16, paddingBottom: 32 },
  colWrap: { gap: 12, marginBottom: 12 },

  card: {
    height:       CARD_HEIGHT,
    borderRadius: 16,
    padding:      16,
    borderWidth:  1,
    gap:          4,
    shadowColor:  "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity:0.06,
    shadowRadius: 6,
    elevation:    2,
  },
  cardBack: {
    position: "absolute",
    top: 0, left: 0, right: 0,
    height:         CARD_HEIGHT,
    gap:            0,
    justifyContent: "flex-end",
    overflow:       "hidden",
  },
  cardSpacer: { height: CARD_HEIGHT },

  cardIcon:  { width: 44, height: 44, borderRadius: 12, alignItems: "center", justifyContent: "center", marginBottom: 2 },
  cardName:  { fontSize: 15, fontFamily: "Manrope_700Bold" },
  cardCat:   { fontSize: 12, fontFamily: "Manrope_400Regular" },
  rateBadge: { alignSelf: "flex-start", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, marginTop: 4 },
  rateText:  { fontSize: 11, fontFamily: "Manrope_600SemiBold" },
  flipHint:  { flexDirection: "row", alignItems: "center", gap: 3, marginTop: 4 },
  flipHintText: { fontSize: 9, fontFamily: "Manrope_400Regular" },

  stripe:       { position: "absolute", top: 32, left: 0, right: 0, height: 28 },
  backTopRow:   { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 8, marginTop: 4 },
  backIconSmall:{ width: 24, height: 24, borderRadius: 6, alignItems: "center", justifyContent: "center" },
  backBrand:    { fontSize: 11, fontFamily: "Manrope_700Bold" },
  backLabel:    { fontSize: 8, fontFamily: "Manrope_600SemiBold", color: "#555", letterSpacing: 0.8, marginBottom: 1 },
  backValue:    { fontSize: 13, fontFamily: "Manrope_700Bold", color: "#FFFFFF", marginBottom: 6 },
  backRow:      { flexDirection: "row", gap: 24 },

  useBtn: {
    marginTop:    6,
    height:       32,
    borderRadius: 8,
    borderWidth:  1,
    alignItems:   "center",
    justifyContent: "center",
  },
  useBtnText: { fontSize: 12, fontFamily: "Manrope_600SemiBold" },
});
