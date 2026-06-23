import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  Platform,
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

const BG      = "#FFFFFF";
const TEXT    = "#0B0A0A";
const TEXTSEC = "#595F67";
const MUTED   = "#AAAFB5";
const BORDER  = "#EDF1F3";
const INPUTBG = "#F0F0F0";
const SUCCESS = "#00B03C";

const CARDS = [
  { id: "1", name: "Amazon",       category: "Shopping",      rate: "₦780/$", color: "#FF9900", icon: "shopping-bag"  as const },
  { id: "2", name: "iTunes",       category: "Entertainment", rate: "₦710/$", color: "#FC3C44", icon: "music"         as const },
  { id: "3", name: "Steam",        category: "Gaming",        rate: "₦720/$", color: "#1B9AF5", icon: "monitor"       as const },
  { id: "4", name: "Google Play",  category: "Apps",          rate: "₦700/$", color: "#34A853", icon: "smartphone"    as const },
  { id: "5", name: "Netflix",      category: "Streaming",     rate: "₦650/$", color: "#E50914", icon: "tv"            as const },
  { id: "6", name: "Xbox",         category: "Gaming",        rate: "₦730/$", color: "#52B043", icon: "headphones"    as const },
  { id: "7", name: "Vanilla Visa", category: "Finance",       rate: "₦760/$", color: "#5C6BC0", icon: "credit-card"   as const },
  { id: "8", name: "eBay",         category: "Shopping",      rate: "₦690/$", color: "#E53238", icon: "tag"           as const },
];

const CARD_H = 166;

function GiftCardItem({
  item,
  onUsePress,
}: {
  item: typeof CARDS[0];
  onUsePress: () => void;
}) {
  const scale   = useSharedValue(1);
  const flip    = useSharedValue(0);
  const [flipped, setFlipped] = useState(false);

  const frontAnim = useAnimatedStyle(() => ({
    transform: [
      { perspective: 1000 },
      { rotateY: `${interpolate(flip.value, [0, 1], [0, 180])}deg` },
      { scale: scale.value },
    ],
    backfaceVisibility: "hidden" as const,
  }));

  const backAnim = useAnimatedStyle(() => ({
    transform: [
      { perspective: 1000 },
      { rotateY: `${interpolate(flip.value, [0, 1], [180, 360])}deg` },
      { scale: scale.value },
    ],
    backfaceVisibility: "hidden" as const,
  }));

  const handleTap = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const next = !flipped;
    setFlipped(next);
    flip.value = withTiming(next ? 1 : 0, { duration: 480 });
  };

  return (
    <View style={{ flex: 1 }}>
      <Pressable
        onPress={handleTap}
        onPressIn={() => { scale.value = withSpring(0.96, { damping: 12, stiffness: 300 }); }}
        onPressOut={() => { scale.value = withSpring(1.0,  { damping: 12, stiffness: 300 }); }}
        style={{ flex: 1 }}
      >
        {/* FRONT */}
        <Animated.View style={[cs.card, { backgroundColor: BG, borderColor: BORDER }, frontAnim, { position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }]}>
          <View style={[cs.iconBox, { backgroundColor: item.color + "18" }]}>
            <Feather name={item.icon} size={22} color={item.color} />
          </View>
          <Text style={cs.cardName}>{item.name}</Text>
          <Text style={cs.cardCat}>{item.category}</Text>
          <View style={[cs.rateBadge, { backgroundColor: SUCCESS + "18" }]}>
            <Text style={[cs.rateText, { color: SUCCESS }]}>{item.rate}</Text>
          </View>
          <View style={cs.flipHint}>
            <Feather name="refresh-cw" size={10} color={MUTED} />
            <Text style={cs.flipHintTxt}>Tap to flip</Text>
          </View>
        </Animated.View>

        {/* BACK */}
        <Animated.View style={[cs.card, cs.cardBack, { backgroundColor: "#111111", borderColor: item.color + "55" }, backAnim]}>
          <View style={[cs.stripe, { backgroundColor: item.color + "44" }]} />
          <View style={cs.backTopRow}>
            <View style={[cs.backIconSm, { backgroundColor: item.color + "22" }]}>
              <Feather name={item.icon} size={14} color={item.color} />
            </View>
            <Text style={[cs.backBrand, { color: item.color }]}>{item.name}</Text>
          </View>
          <Text style={cs.backLabel}>CARD NUMBER</Text>
          <Text style={cs.backValue}>•••• •••• •••• 4821</Text>
          <View style={cs.backRow}>
            <View><Text style={cs.backLabel}>EXPIRY</Text><Text style={cs.backValue}>08/27</Text></View>
            <View><Text style={cs.backLabel}>CVV</Text><Text style={cs.backValue}>472</Text></View>
          </View>
          <View style={cs.flipHint}>
            <Feather name="refresh-cw" size={10} color="#555" />
            <Text style={[cs.flipHintTxt, { color: "#555" }]}>Tap to flip back</Text>
          </View>
        </Animated.View>
      </Pressable>

      <View style={{ height: CARD_H }} />

      {!flipped && (
        <TouchableOpacity
          style={[cs.useBtn, { backgroundColor: item.color + "14", borderColor: item.color + "44" }]}
          onPress={onUsePress}
          activeOpacity={0.8}
        >
          <Text style={[cs.useBtnTxt, { color: item.color }]}>Use card →</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

export default function GiftCardsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 20 : insets.top;
  const [tab, setTab] = useState<"sell" | "trade">("sell");

  return (
    <View style={[s.root, { backgroundColor: BG }]}>
      {/* Header */}
      <View style={[s.header, { paddingTop: topPad + 12 }]}>
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
      <View style={s.divider} />

      {/* Sell / Trade toggle */}
      <Animated.View
        entering={FadeInUp.duration(340).springify().delay(30)}
        style={[s.toggle, { backgroundColor: INPUTBG, borderColor: BORDER }]}
      >
        {(["sell", "trade"] as const).map((t) => (
          <Pressable
            key={t}
            style={[s.toggleBtn, tab === t && s.toggleActive]}
            onPress={() => { Haptics.selectionAsync(); setTab(t); }}
          >
            <Text style={[s.toggleTxt, { color: tab === t ? "#FFFFFF" : TEXTSEC }]}>
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
            entering={FadeInUp.duration(320).springify().delay(60 + index * 40)}
          >
            <GiftCardItem
              item={item}
              onUsePress={() =>
                router.push(
                  tab === "sell"
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

const cs = StyleSheet.create({
  card: {
    height:        CARD_H,
    borderRadius:  16,
    padding:       14,
    borderWidth:   1,
    gap:           4,
    shadowColor:   "#000",
    shadowOffset:  { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius:  6,
    elevation:     2,
  },
  cardBack: {
    position: "absolute", top: 0, left: 0, right: 0,
    height: CARD_H, gap: 0, justifyContent: "flex-end", overflow: "hidden",
  },
  iconBox:     { width: 44, height: 44, borderRadius: 12, alignItems: "center", justifyContent: "center", marginBottom: 2 },
  cardName:    { fontSize: 15, fontFamily: "Manrope_700Bold",    color: TEXT },
  cardCat:     { fontSize: 12, fontFamily: "Manrope_400Regular", color: TEXTSEC },
  rateBadge:   { alignSelf: "flex-start", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, marginTop: 2 },
  rateText:    { fontSize: 11, fontFamily: "Manrope_600SemiBold" },
  flipHint:    { flexDirection: "row", alignItems: "center", gap: 3, marginTop: 3 },
  flipHintTxt: { fontSize: 9,  fontFamily: "Manrope_400Regular", color: MUTED },

  stripe:      { position: "absolute", top: 32, left: 0, right: 0, height: 28 },
  backTopRow:  { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 8, marginTop: 4 },
  backIconSm:  { width: 24, height: 24, borderRadius: 6, alignItems: "center", justifyContent: "center" },
  backBrand:   { fontSize: 11, fontFamily: "Manrope_700Bold" },
  backLabel:   { fontSize: 8,  fontFamily: "Manrope_600SemiBold", color: "#555", letterSpacing: 0.8, marginBottom: 1 },
  backValue:   { fontSize: 13, fontFamily: "Manrope_700Bold",    color: "#FFFFFF", marginBottom: 6 },
  backRow:     { flexDirection: "row", gap: 24 },

  useBtn:    { marginTop: 6, height: 32, borderRadius: 8, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  useBtnTxt: { fontSize: 12, fontFamily: "Manrope_600SemiBold" },
});

const s = StyleSheet.create({
  root: { flex: 1 },

  header: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 20, paddingBottom: 16, backgroundColor: BG,
  },
  backBtn:     { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: 13, fontFamily: "Manrope_700Bold", color: TEXT, textAlign: "center" },
  divider:     { height: 1, backgroundColor: "#D1D1D1" },

  toggle: {
    flexDirection: "row", marginHorizontal: 20, marginVertical: 16,
    borderRadius: 14, borderWidth: 1, padding: 4, gap: 4,
  },
  toggleBtn:    { flex: 1, height: 40, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  toggleActive: { backgroundColor: "#000000" },
  toggleTxt:    { fontSize: 14, fontFamily: "Manrope_600SemiBold" },

  list:    { paddingHorizontal: 16, paddingBottom: 40 },
  colWrap: { gap: 12, marginBottom: 12 },
});
