import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useCallback, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  ListRenderItemInfo,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewToken,
} from "react-native";
import Animated, {
  FadeInDown,
  FadeInUp,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";

const { width: SW } = Dimensions.get("window");
const CARD_SIDE_PAD = 20;
const CARD_WIDTH = SW - CARD_SIDE_PAD * 2;
const CARD_HEIGHT = Math.round(CARD_WIDTH * (183 / 287));

type CardItem = { id: string; source: ReturnType<typeof require> };

const CARDS: CardItem[] = [
  { id: "green",  source: require("@/assets/images/card-green.png")  },
  { id: "pink",   source: require("@/assets/images/card-pink.png")   },
  { id: "purple", source: require("@/assets/images/card-purple.png") },
];

const ACTIONS = [
  { icon: "plus"     as const, label: "Fund Card", color: "#00D9A0" },
  { icon: "send"     as const, label: "Transfer",  color: "#3B82F6" },
  { icon: "lock"     as const, label: "Freeze",    color: "#8B5CF6" },
  { icon: "settings" as const, label: "Settings",  color: "#F59E0B" },
] as const;

/* ─── Card slide ─────────────────────────────────────────────────────────── */

function CardSlide({ item, index, activeIndex }: { item: CardItem; index: number; activeIndex: number }) {
  const distance = index - activeIndex;
  const scale = useSharedValue(1);

  const anim = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
    ],
    opacity: Math.max(0, 1 - Math.abs(distance) * 0.12),
  }));

  return (
    <Animated.View style={[c.slide, anim]}>
      <Image
        source={item.source}
        style={c.cardImage}
        resizeMode="contain"
        fadeDuration={0}
      />
    </Animated.View>
  );
}

/* ─── Dot pagination ─────────────────────────────────────────────────────── */

function Dots({ count, active }: { count: number; active: number }) {
  return (
    <View style={c.dotsRow}>
      {Array.from({ length: count }).map((_, i) => (
        <Animated.View
          key={i}
          style={[
            c.dot,
            {
              width: i === active ? 20 : 7,
              backgroundColor: i === active ? "#00D9A0" : "rgba(255,255,255,0.25)",
            },
          ]}
        />
      ))}
    </View>
  );
}

/* ─── Main screen ────────────────────────────────────────────────────────── */

export default function CardScreen() {
  const colors  = useColors();
  const insets  = useSafeAreaInsets();
  const router  = useRouter();
  const { user } = useAuth();
  const topPad  = Platform.OS === "web" ? 48 : insets.top;

  const [activeIndex, setActiveIndex] = useState(0);
  const flatRef = useRef<FlatList<CardItem>>(null);

  const balance   = user?.balance ?? 0;
  const formatted = "₦" + balance.toLocaleString("en-NG", { minimumFractionDigits: 2 });

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index != null) {
        setActiveIndex(viewableItems[0].index);
      }
    },
    [],
  );

  const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const renderCard = useCallback(
    ({ item, index }: ListRenderItemInfo<CardItem>) => (
      <CardSlide item={item} index={index} activeIndex={activeIndex} />
    ),
    [activeIndex],
  );

  const getItemLayout = useCallback(
    (_: ArrayLike<CardItem> | null | undefined, index: number) => ({
      length: SW,
      offset: SW * index,
      index,
    }),
    [],
  );

  return (
    <View style={[s.root, { backgroundColor: colors.background }]}>

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <Animated.View
        entering={FadeInDown.duration(350).springify()}
        style={[s.header, { paddingTop: topPad + 10 }]}
      >
        <Text style={[s.title, { color: colors.text }]}>Virtual Card</Text>
        <TouchableOpacity
          style={[s.hdrBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}
          onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
        >
          <Feather name="plus" size={18} color={colors.primary} />
        </TouchableOpacity>
      </Animated.View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[s.scroll, { paddingBottom: insets.bottom + 100 }]}
      >

        {/* ── Card carousel ───────────────────────────────────────────── */}
        <Animated.View entering={FadeInDown.duration(420).springify().delay(60)}>
          <FlatList
            ref={flatRef}
            data={CARDS}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            renderItem={renderCard}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={viewabilityConfig}
            getItemLayout={getItemLayout}
            initialNumToRender={3}
            maxToRenderPerBatch={3}
            windowSize={3}
            bounces={true}
            overScrollMode="never"
            snapToAlignment="start"
            decelerationRate="fast"
          />

          {/* Dot indicator */}
          <Dots count={CARDS.length} active={activeIndex} />
        </Animated.View>

        {/* ── Balance ─────────────────────────────────────────────────── */}
        <Animated.View
          entering={FadeInUp.duration(360).springify().delay(100)}
          style={[s.balBox, { backgroundColor: colors.surface, borderColor: colors.border }]}
        >
          <Text style={[s.balLbl, { color: colors.mutedForeground }]}>Available Balance</Text>
          <Text style={[s.balAmt, { color: colors.text }]}>{formatted}</Text>
        </Animated.View>

        {/* ── Card indicator labels ───────────────────────────────────── */}
        <Animated.View
          entering={FadeInUp.duration(340).springify().delay(120)}
          style={s.cardLabelRow}
        >
          {CARDS.map((card, i) => (
            <TouchableOpacity
              key={card.id}
              onPress={() => {
                Haptics.selectionAsync();
                flatRef.current?.scrollToIndex({ index: i, animated: true });
              }}
              style={[
                s.cardLabel,
                {
                  backgroundColor: i === activeIndex ? colors.primary + "22" : "transparent",
                  borderColor: i === activeIndex ? colors.primary : colors.border,
                },
              ]}
            >
              <Text style={[s.cardLabelTxt, { color: i === activeIndex ? colors.primary : colors.mutedForeground }]}>
                Card {i + 1}
              </Text>
            </TouchableOpacity>
          ))}
        </Animated.View>

        {/* ── Actions ─────────────────────────────────────────────────── */}
        <Animated.View
          entering={FadeInUp.duration(360).springify().delay(140)}
          style={s.actRow}
        >
          {ACTIONS.map((a) => (
            <TouchableOpacity
              key={a.label}
              style={s.actItem}
              onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
              activeOpacity={0.75}
            >
              <View style={[s.actIcon, { backgroundColor: a.color + "20" }]}>
                <Feather name={a.icon} size={20} color={a.color} />
              </View>
              <Text style={[s.actLbl, { color: colors.mutedForeground }]}>{a.label}</Text>
            </TouchableOpacity>
          ))}
        </Animated.View>

        {/* ── CTA ─────────────────────────────────────────────────────── */}
        <Animated.View
          entering={FadeInUp.duration(340).springify().delay(180)}
          style={{ paddingHorizontal: 20 }}
        >
          <TouchableOpacity
            style={[s.cta, { backgroundColor: colors.primary }]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              router.push("/(app)/dashboard");
            }}
            activeOpacity={0.85}
          >
            <Text style={[s.ctaTxt, { color: colors.background }]}>View Full Dashboard</Text>
            <Feather name="arrow-right" size={18} color={colors.background} />
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

/* ─── Carousel slide styles ────────────────────────────────────────────────── */
const c = StyleSheet.create({
  slide: {
    width: SW,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: CARD_SIDE_PAD,
  },
  cardImage: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
  },
  dotsRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    marginTop: 16,
  },
  dot: {
    height: 7,
    borderRadius: 4,
  },
});

/* ─── Screen styles ────────────────────────────────────────────────────────── */
const s = StyleSheet.create({
  root:   { flex: 1 },
  scroll: { paddingTop: 8, gap: 20 },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  title:  { fontSize: 24, fontFamily: "Manrope_700Bold" },
  hdrBtn: {
    width: 40, height: 40,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  balBox: {
    marginHorizontal: 20,
    borderRadius: 18,
    borderWidth: 1,
    padding: 20,
    alignItems: "center",
    gap: 6,
  },
  balLbl: { fontSize: 13, fontFamily: "Manrope_400Regular" },
  balAmt: { fontSize: 32, fontFamily: "Manrope_700Bold", letterSpacing: -1 },

  cardLabelRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    paddingHorizontal: 20,
  },
  cardLabel: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  cardLabelTxt: { fontSize: 12, fontFamily: "Manrope_600SemiBold" },

  actRow: { flexDirection: "row", justifyContent: "space-around", paddingHorizontal: 20 },
  actItem: { alignItems: "center", gap: 8 },
  actIcon: { width: 54, height: 54, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  actLbl:  { fontSize: 11, fontFamily: "Manrope_500Medium" },

  cta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: 56,
    borderRadius: 16,
  },
  ctaTxt: { fontSize: 15, fontFamily: "Manrope_700Bold" },
});
