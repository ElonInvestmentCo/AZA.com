/**
 * Choose a Card Type screen
 * Translated from the web prototype (Card06 + Card07 zip designs).
 *
 * Card designs:
 *  – Virtual  : dark green #283C3A  (Card06 — red/orange Mastercard, cream chip, RFID)
 *  – Premium  : olive gold  #6B6530  (Card07 — navy/purple Mastercard, warm-gold chip, frame)
 */
import * as Haptics from "expo-haptics";
import React, { useRef, useCallback, useState } from "react";
import {
  Alert,
  Animated,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { SvgXml } from "react-native-svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { VIRTUAL_CARD_SVG, PREMIUM_CARD_SVG } from "@/assets/images/cards/cardSvgs";

/* ─── Slide data ─────────────────────────────────────────────────────────── */
const SLIDES = [
  {
    id:          "virtual",
    label:       "Virtual",
    cardBg:      "#283C3A",
    cardGlow:    "#283C3A",
    buttonColor: "#283C3A",
    buttonText:  "Get virtual card",
    description:
      "Instant and ready to use online. Add to Apple Pay and use it to pay in stores, just like a physical card.",
  },
  {
    id:          "premium",
    label:       "Premium",
    cardBg:      "#6B6530",
    cardGlow:    "#746D35",
    buttonColor: "#5C5628",
    buttonText:  "Get premium card",
    description:
      "Unlock exclusive benefits and worldwide acceptance with our premium metal-finish card.",
  },
] as const;

/* ─── Card visual ────────────────────────────────────────────────────────── */
/*
 * Renders the exact provided card artwork (SVG) for each slide.
 * Two-wrapper pattern (fixes iOS shadow clipping):
 *   outer  – shadow props, NO overflow (so shadow is not clipped)
 *   inner  – overflow: "hidden", clips the SVG to rounded corners
 *
 * Source SVGs use a 210×332 viewBox, so we scale via SvgXml's width/height
 * while keeping that aspect ratio (cardW/cardH are derived from it upstream).
 */
function Card({
  slide,
  cardW,
  cardH,
}: {
  slide: typeof SLIDES[number];
  cardW: number;
  cardH: number;
}) {
  const isVirtual = slide.id === "virtual";
  const svgXml = isVirtual ? VIRTUAL_CARD_SVG : PREMIUM_CARD_SVG;

  return (
    <View style={[cv.shadowWrap, { width: cardW, height: cardH, shadowColor: slide.cardGlow }]}>
      <View style={cv.cardInner}>
        <SvgXml xml={svgXml} width={cardW} height={cardH} />
      </View>
    </View>
  );
}

const cv = StyleSheet.create({
  shadowWrap: {
    borderRadius: 20,
    shadowOffset: { width: 0, height: 24 },
    shadowOpacity: 0.45,
    shadowRadius: 36,
    elevation: 14,
  },
  cardInner: {
    flex: 1,
    borderRadius: 20,
    overflow: "hidden",
    position: "relative",
  },
});

/* ─── Tab button ─────────────────────────────────────────────────────────── */
function TabButton({
  slide,
  index,
  scrollX,
  pageW,
  onPress,
}: {
  slide: typeof SLIDES[number];
  index: number;
  scrollX: Animated.Value;
  pageW: number;
  onPress: () => void;
}) {
  const activeAnim = scrollX.interpolate({
    inputRange:  [0, pageW],
    outputRange: index === 0 ? [1, 0] : [0, 1],
    extrapolate: "clamp",
  });
  const normalOpacity = activeAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 0] });
  const boldOpacity   = activeAnim;
  const normalColor: Animated.AnimatedInterpolation<string> = scrollX.interpolate({
    inputRange:  [0, pageW],
    outputRange: (index === 0
      ? ["#111111", "#b0b0b0"]
      : ["#b0b0b0", "#111111"]) as any,
    extrapolate: "clamp",
  });

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={tb.wrap}>
      {/* Invisible bold copy — anchors the width so the row never shifts */}
      <Text style={[tb.measure, tb.bold]} numberOfLines={1}>{slide.label}</Text>
      <Animated.Text
        style={[tb.label, tb.normal, StyleSheet.absoluteFillObject, { opacity: normalOpacity, color: normalColor as any }]}
        numberOfLines={1}
      >
        {slide.label}
      </Animated.Text>
      <Animated.Text
        style={[tb.label, tb.bold, StyleSheet.absoluteFillObject, { opacity: boldOpacity, color: "#111111" }]}
        numberOfLines={1}
      >
        {slide.label}
      </Animated.Text>
    </TouchableOpacity>
  );
}

const tb = StyleSheet.create({
  wrap:    { paddingVertical: 6, paddingHorizontal: 4, overflow: "hidden", alignItems: "center", justifyContent: "center" },
  measure: { opacity: 0 },
  label:   { fontSize: 17, letterSpacing: -0.2, textAlign: "center" },
  normal:  { fontFamily: "Manrope_400Regular" },
  bold:    { fontFamily: "Manrope_700Bold" },
});

/* ─── Main screen ────────────────────────────────────────────────────────── */
const PILL_BAR_HEIGHT = 68;

export default function CardsScreen() {
  const insets  = useSafeAreaInsets();
  const { width: screenW, height: screenH } = useWindowDimensions();
  const topPad  = Platform.OS === "web" ? 48 : insets.top;
  const pageW   = screenW;

  const barBottom       = Math.max(insets.bottom + 10, Platform.OS === "ios" ? 20 : 12);
  const tabBarClearance = barBottom + PILL_BAR_HEIGHT + 20;

  const CARD_V_PAD = 16;
  const RESERVED   = topPad + 46 + CARD_V_PAD * 2 + 42 + 72 + 58 + tabBarClearance;
  const cardH = Math.min(Math.max(Math.round(screenH - RESERVED), 200), 340);
  // Card06/07 aspect ratio: 210/332 ≈ 0.632
  const cardW = Math.round(cardH * (210 / 332));

  const scrollX   = useRef(new Animated.Value(0)).current;
  const scrollRef = useRef<ScrollView>(null);

  /* Track active index so pointerEvents can block the off-screen CTA */
  const [activeIndex, setActiveIndex] = useState(0);

  const snapTo = useCallback((index: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    scrollRef.current?.scrollTo({ x: index * pageW, animated: true });
    setActiveIndex(index);
  }, [pageW]);

  const handleMomentumScrollEnd = useCallback((e: any) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / pageW);
    setActiveIndex(index);
  }, [pageW]);

  const slide0Opacity = scrollX.interpolate({ inputRange: [0, pageW], outputRange: [1, 0], extrapolate: "clamp" });
  const slide1Opacity = scrollX.interpolate({ inputRange: [0, pageW], outputRange: [0, 1], extrapolate: "clamp" });
  const opacities = [slide0Opacity, slide1Opacity];

  return (
    <View style={[s.root, { paddingTop: topPad }]}>

      {/* ── Header ── */}
      <View style={s.header}>
        <View style={s.headerSpacer} />
        <Text style={s.headerTitle}>Choose a card type</Text>
        <View style={s.headerSpacer} />
      </View>

      {/* ── Horizontal card swipe ── */}
      <Animated.ScrollView
        ref={scrollRef as any}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={1}
        decelerationRate="fast"
        alwaysBounceVertical={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false },
        )}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        contentContainerStyle={{ width: pageW * SLIDES.length }}
        style={[s.cardScroll, { height: cardH + CARD_V_PAD * 2 }]}
      >
        {SLIDES.map((slide) => (
          <View key={slide.id} style={[s.cardPage, { width: pageW, paddingVertical: CARD_V_PAD }]}>
            <View style={{ width: cardW, height: cardH }}>
              <Card slide={slide} cardW={cardW} cardH={cardH} />
            </View>
          </View>
        ))}
      </Animated.ScrollView>

      {/* ── Bottom UI ── */}
      <View style={[s.bottom, { paddingBottom: tabBarClearance }]}>

        {/* Tabs */}
        <View style={s.tabs}>
          {SLIDES.map((slide, i) => (
            <TabButton
              key={slide.id}
              slide={slide}
              index={i}
              scrollX={scrollX}
              pageW={pageW}
              onPress={() => snapTo(i)}
            />
          ))}
        </View>

        {/* Description — each layer anchored with absoluteFillObject */}
        <View style={s.descArea}>
          {SLIDES.map((slide, i) => (
            <Animated.View
              key={slide.id}
              pointerEvents="none"
              style={[StyleSheet.absoluteFillObject, s.descLayer, { opacity: opacities[i] }]}
            >
              <Text style={s.descText}>{slide.description}</Text>
            </Animated.View>
          ))}
        </View>

        {/* CTA — only the active slide's button receives touches */}
        <View style={s.ctaArea}>
          {SLIDES.map((slide, i) => (
            <Animated.View
              key={slide.id}
              pointerEvents={i === activeIndex ? "auto" : "none"}
              style={[
                s.ctaBtnWrap,
                { opacity: opacities[i], position: "absolute", left: 0, right: 0 },
              ]}
            >
              <TouchableOpacity
                activeOpacity={0.88}
                style={[s.ctaBtn, { backgroundColor: slide.buttonColor }]}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  Alert.alert(
                    slide.label + " Card",
                    "Your " + slide.label.toLowerCase() +
                      " card request has been submitted! We'll notify you when it's ready.",
                    [{ text: "Got it" }],
                  );
                }}
              >
                <Text style={s.ctaBtnText}>{slide.buttonText}</Text>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>

      </View>
    </View>
  );
}

const s = StyleSheet.create({
  root:         { flex: 1, backgroundColor: "#FFFFFF" },

  header:       { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingBottom: 16, paddingTop: 8 },
  headerSpacer: { width: 36 },
  headerTitle:  { fontSize: 17, fontFamily: "Manrope_700Bold", color: "#111111", letterSpacing: -0.2, textAlign: "center" },

  cardScroll:   { flexShrink: 0 },
  cardPage:     { alignItems: "center", justifyContent: "center" },

  bottom:       { flex: 1, flexDirection: "column", justifyContent: "space-between", paddingHorizontal: 20 },

  tabs:         { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 32, paddingVertical: 4 },

  descArea:     { flex: 1, overflow: "hidden" },
  descLayer:    { alignItems: "center", justifyContent: "center", paddingHorizontal: 8 },
  descText:     { fontFamily: "Manrope_400Regular", fontSize: 15, color: "#999999", lineHeight: 23, textAlign: "center" },

  ctaArea:      { height: 54, position: "relative" },
  ctaBtnWrap:   {},
  ctaBtn:       { height: 54, borderRadius: 100, alignItems: "center", justifyContent: "center", shadowColor: "#000", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.28, shadowRadius: 20, elevation: 8 },
  ctaBtnText:   { fontFamily: "Manrope_600SemiBold", fontSize: 17, color: "#FFFFFF", letterSpacing: -0.2 },
});
