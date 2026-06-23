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
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@/context/AuthContext";

const { width: SW } = Dimensions.get("window");
const CARD_PAD    = 20;
const CARD_WIDTH  = SW - CARD_PAD * 2;
const CARD_HEIGHT = Math.round(CARD_WIDTH * (183 / 287));

const BG      = "#0A0A0F";
const SURFACE = "#14141F";
const BORDER  = "#2A2A3D";
const TEXT    = "#FFFFFF";
const MUTED   = "#8F8FA3";
const PRIMARY = "#00D9A0";

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

function CardSlide({ item }: { item: CardItem }) {
  const scale = useSharedValue(1);
  const anim  = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Animated.View style={[cs.slide, anim]}>
      <Image source={item.source} style={cs.img} resizeMode="contain" fadeDuration={0} />
    </Animated.View>
  );
}

function Dots({ count, active }: { count: number; active: number }) {
  return (
    <View style={cs.dots}>
      {Array.from({ length: count }).map((_, i) => (
        <Animated.View
          key={i}
          style={[
            cs.dot,
            {
              width:           i === active ? 20 : 7,
              backgroundColor: i === active ? PRIMARY : "rgba(255,255,255,0.25)",
            },
          ]}
        />
      ))}
    </View>
  );
}

export default function CardScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user } = useAuth();
  const topPad = Platform.OS === "web" ? 48 : insets.top;

  const [active, setActive] = useState(0);
  const listRef = useRef<FlatList<CardItem>>(null);

  const balance   = user?.balance ?? 0;
  const formatted = "₦" + balance.toLocaleString("en-NG", { minimumFractionDigits: 2 });

  const onViewable = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index != null) {
        setActive(viewableItems[0].index);
      }
    },
    [],
  );
  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const renderCard = useCallback(
    ({ item }: ListRenderItemInfo<CardItem>) => <CardSlide item={item} />,
    [],
  );

  const getLayout = useCallback(
    (_: ArrayLike<CardItem> | null | undefined, index: number) => ({
      length: SW, offset: SW * index, index,
    }),
    [],
  );

  return (
    <View style={[s.root, { backgroundColor: BG }]}>
      {/* Header */}
      <Animated.View
        entering={FadeInDown.duration(350).springify()}
        style={[s.header, { paddingTop: topPad + 10 }]}
      >
        <Text style={s.title}>Virtual Card</Text>
        <TouchableOpacity
          style={[s.addBtn, { backgroundColor: SURFACE, borderColor: BORDER }]}
          onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
        >
          <Feather name="plus" size={18} color={PRIMARY} />
        </TouchableOpacity>
      </Animated.View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[s.scroll, { paddingBottom: insets.bottom + 110 }]}
      >
        {/* Card carousel */}
        <Animated.View entering={FadeInDown.duration(420).springify().delay(60)}>
          <FlatList
            ref={listRef}
            data={CARDS}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            renderItem={renderCard}
            onViewableItemsChanged={onViewable}
            viewabilityConfig={viewConfig}
            getItemLayout={getLayout}
            initialNumToRender={3}
            maxToRenderPerBatch={3}
            windowSize={3}
            bounces
            overScrollMode="never"
            decelerationRate="fast"
          />
          <Dots count={CARDS.length} active={active} />
        </Animated.View>

        {/* Balance */}
        <Animated.View
          entering={FadeInUp.duration(360).springify().delay(100)}
          style={[s.balBox, { backgroundColor: SURFACE, borderColor: BORDER }]}
        >
          <Text style={[s.balLbl, { color: MUTED }]}>Available Balance</Text>
          <Text style={[s.balAmt, { color: TEXT }]}>{formatted}</Text>
        </Animated.View>

        {/* Card selector pills */}
        <Animated.View
          entering={FadeInUp.duration(340).springify().delay(120)}
          style={s.pillRow}
        >
          {CARDS.map((card, i) => (
            <TouchableOpacity
              key={card.id}
              onPress={() => {
                Haptics.selectionAsync();
                listRef.current?.scrollToIndex({ index: i, animated: true });
              }}
              style={[
                s.pill,
                {
                  backgroundColor: i === active ? PRIMARY + "22" : "transparent",
                  borderColor:     i === active ? PRIMARY : BORDER,
                },
              ]}
            >
              <Text style={[s.pillTxt, { color: i === active ? PRIMARY : MUTED }]}>
                Card {i + 1}
              </Text>
            </TouchableOpacity>
          ))}
        </Animated.View>

        {/* Actions */}
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
              <Text style={[s.actLbl, { color: MUTED }]}>{a.label}</Text>
            </TouchableOpacity>
          ))}
        </Animated.View>

        {/* CTA */}
        <Animated.View
          entering={FadeInUp.duration(340).springify().delay(180)}
          style={{ paddingHorizontal: 20 }}
        >
          <TouchableOpacity
            style={[s.cta, { backgroundColor: PRIMARY }]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              router.push("/(app)/dashboard");
            }}
            activeOpacity={0.85}
          >
            <Text style={[s.ctaTxt, { color: BG }]}>View Full Dashboard</Text>
            <Feather name="arrow-right" size={18} color={BG} />
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const cs = StyleSheet.create({
  slide: {
    width: SW, alignItems: "center", justifyContent: "center",
    paddingHorizontal: CARD_PAD,
  },
  img: {
    width: CARD_WIDTH, height: CARD_HEIGHT, borderRadius: 20,
    shadowColor: "#000", shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3, shadowRadius: 20,
  },
  dots: { flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 6, marginTop: 16 },
  dot:  { height: 7, borderRadius: 4 },
});

const s = StyleSheet.create({
  root:   { flex: 1 },
  scroll: { paddingTop: 8, gap: 20 },

  header: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    paddingHorizontal: 20, paddingBottom: 12,
  },
  title:  { fontSize: 24, fontFamily: "Manrope_700Bold", color: TEXT },
  addBtn: {
    width: 40, height: 40, borderRadius: 12, borderWidth: 1,
    alignItems: "center", justifyContent: "center",
  },

  balBox: {
    marginHorizontal: 20, borderRadius: 18, borderWidth: 1,
    padding: 20, alignItems: "center", gap: 6,
  },
  balLbl: { fontSize: 13, fontFamily: "Manrope_400Regular" },
  balAmt: { fontSize: 32, fontFamily: "Manrope_700Bold", letterSpacing: -1 },

  pillRow: { flexDirection: "row", justifyContent: "center", gap: 10, paddingHorizontal: 20 },
  pill:    { paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20, borderWidth: 1 },
  pillTxt: { fontSize: 12, fontFamily: "Manrope_600SemiBold" },

  actRow:  { flexDirection: "row", justifyContent: "space-around", paddingHorizontal: 20 },
  actItem: { alignItems: "center", gap: 8 },
  actIcon: { width: 54, height: 54, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  actLbl:  { fontSize: 11, fontFamily: "Manrope_500Medium" },

  cta: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 8, height: 56, borderRadius: 16,
  },
  ctaTxt: { fontSize: 15, fontFamily: "Manrope_700Bold" },
});
