/**
 * Choose a Card Type screen
 * Translated from the web prototype (Card06 + Card07 zip designs).
 *
 * Card designs:
 *  – Virtual  : dark green #283C3A  (Card06 — red/orange Mastercard, gold chip, RFID)
 *  – Premium  : olive gold  #6B6530  (Card07 — purple/navy Mastercard, warm-gold chip, frame)
 */
import * as Haptics from "expo-haptics";
import React, { useRef, useCallback } from "react";
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
import Svg, {
  Circle,
  Path,
  Rect,
  G,
  Defs,
  ClipPath,
  LinearGradient,
  Stop,
} from "react-native-svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";

/* ─── Slide data ─────────────────────────────────────────────────────────── */
const SLIDES = [
  {
    id:          "virtual",
    label:       "Virtual",
    cardBg:      "#283C3A",
    cardGlow:    "rgba(40,60,58,0.45)",
    buttonColor: "#283C3A",
    buttonText:  "Get virtual card",
    description:
      "Instant and ready to use online. Add to Apple Pay and use it to pay in stores, just like a physical card.",
  },
  {
    id:          "premium",
    label:       "Premium",
    cardBg:      "#6B6530",
    cardGlow:    "rgba(116,109,53,0.45)",
    buttonColor: "#5C5628",
    buttonText:  "Get premium card",
    description:
      "Unlock exclusive benefits and worldwide acceptance with our premium metal-finish card.",
  },
] as const;

/* ─── Mastercard logo ────────────────────────────────────────────────────── */
function MastercardLogo({ isVirtual }: { isVirtual: boolean }) {
  const S = 24;
  const gap = 8; // overlap between the two circles
  const totalW = S * 2 - gap;

  if (isVirtual) {
    // Card06: red left, orange right, amber blend in the middle
    return (
      <Svg width={totalW} height={S} viewBox={`0 0 ${totalW} ${S}`}>
        <Circle cx={S / 2} cy={S / 2} r={S / 2} fill="#EF1B22" />
        <Circle cx={totalW - S / 2} cy={S / 2} r={S / 2} fill="#F79E1C" />
        {/* Blend overlap */}
        <Circle cx={totalW / 2} cy={S / 2} r={S / 2 - gap + 2} fill="#FF5F00" opacity={0.4} />
      </Svg>
    );
  }
  // Card07: dark navy left, purple right
  return (
    <Svg width={totalW} height={S} viewBox={`0 0 ${totalW} ${S}`}>
      <Circle cx={S / 2} cy={S / 2} r={S / 2} fill="#28283E" stroke="#C1C1D7" strokeWidth={0.75} />
      <Circle cx={totalW - S / 2} cy={S / 2} r={S / 2} fill="#8282B0" stroke="#C1C1D7" strokeWidth={0.75} />
    </Svg>
  );
}

/* ─── EMV chip ───────────────────────────────────────────────────────────── */
function EmvChip({ isVirtual }: { isVirtual: boolean }) {
  // Card06 chip: cream/gold  Card07 chip: richer warm gold
  const bg = isVirtual ? "#E9DCA5" : "#D5B688";
  const stroke = "#262626";
  const sw = "0.7";

  return (
    <Svg width={36} height={28} viewBox="0 0 36 28">
      {/* Chip body */}
      <Rect x={0} y={0} width={36} height={28} rx={4} fill={bg} />

      {/* Left contact traces */}
      <Path
        d={`M0.5 9H11C12.1 9 13 9.9 13 11V14.5
           M13 27.5V21.5
           M13 21.5V14.5
           M13 21.5H0.5
           M13 14.5H0.5`}
        stroke={stroke} strokeWidth={sw} fill="none" strokeLinecap="round"
      />
      {/* Right contact traces */}
      <Path
        d={`M35.5 9H25C23.9 9 23 9.9 23 11V14.5
           M23 27.5V21.5
           M23 21.5V14.5
           M23 21.5H35.5
           M23 14.5H35.5`}
        stroke={stroke} strokeWidth={sw} fill="none" strokeLinecap="round"
      />
    </Svg>
  );
}

/* ─── RFID / contactless waves ───────────────────────────────────────────── */
function RfidWaves({ isVirtual }: { isVirtual: boolean }) {
  // Card06: dark stroke  Card07: white stroke (on darker bg the waves are subtle)
  const strokeColor = isVirtual ? "#424242" : "rgba(255,255,255,0.55)";
  return (
    <Svg width={22} height={26} viewBox="0 0 22 26">
      <Path
        d="M5.5 13C7.6 10.6 7.6 6.4 5.5 4"
        stroke={strokeColor} strokeWidth={2} strokeLinecap="round" fill="none"
      />
      <Path
        d="M10.1 15.5C13.8 11.4 13.8 4.6 10.1 0.5"
        stroke={strokeColor} strokeWidth={2} strokeLinecap="round" fill="none"
      />
      <Path
        d="M15 18C20.4 12.2 20.4 3.8 15 -2"
        stroke={strokeColor} strokeWidth={2} strokeLinecap="round" fill="none"
      />
    </Svg>
  );
}

/* ─── Premium decorative frame (Card07 only) ─────────────────────────────── */
function PremiumFrame({ w }: { w: number }) {
  // Four parallelogram shapes fanning from center-bottom (Card07 Frame 252)
  const frameW = Math.min(w * 0.65, 130);
  const frameH = 32;
  return (
    <Svg width={frameW} height={frameH} viewBox="0 0 160 32">
      <Path d="M0 32L10 0L30 0L20 32Z"   fill="rgba(255,255,255,0.18)" />
      <Path d="M40 32L50 0L70 0L60 32Z"  fill="rgba(255,255,255,0.18)" />
      <Path d="M80 32L90 0L110 0L100 32Z"fill="rgba(255,255,255,0.18)" />
      <Path d="M120 32L130 0L150 0L140 32Z" fill="rgba(255,255,255,0.18)" />
    </Svg>
  );
}

/* ─── Card visual ────────────────────────────────────────────────────────── */
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

  /*
   * Layout ratios derived from Card06/Card07 React components (316×500 reference):
   *   Mastercard area : left 7.6 %, top 26 %   w 51/316 ≈ 16%, h 60/500 ≈ 12%
   *   RFID waves      : left 7  %, top 43 %
   *   EMV chip        : left 41 %, top 31 %
   *   PAYVORA text    : right ~5%, top 2% (vertical, full height)
   *   Premium frame   : centered, bottom 8%
   */
  const mastercardLeft  = cardW * 0.072;
  const mastercardTop   = cardH * 0.26;
  const rfidLeft        = cardW * 0.07;
  const rfidTop         = cardH * 0.44;
  const chipLeft        = cardW * 0.41;
  const chipTop         = cardH * 0.31;

  // Card07 has mastercard on the RIGHT (left: 263/316 ≈ 83%)
  const mc07Left        = cardW * 0.83;
  const mc07Top         = cardH * 0.033;
  const chip07Left      = cardW * 0.83;
  const chip07Top       = cardH * 0.31;
  const rfid07Left      = cardW * 0.62;
  const rfid07Top       = cardH * 0.31;

  return (
    <View
      style={[
        cv.root,
        {
          width: cardW,
          height: cardH,
          backgroundColor: slide.cardBg,
          shadowColor: slide.cardGlow,
        },
      ]}
    >
      {/* ── Card number (faint, horizontal center) ── */}
      <View style={cv.numWrap}>
        <Text style={cv.num}>•• 6352</Text>
      </View>

      {/* ── PAYVORA brand name vertical right edge ── */}
      <View
        pointerEvents="none"
        style={[
          cv.brandWrap,
          isVirtual
            ? { right: 10, top: cardH * 0.04 }
            : { left: cardW * 0.44, top: cardH * 0.13 },
        ]}
      >
        <Text style={cv.brandText}>PAYVORA</Text>
      </View>

      {isVirtual ? (
        <>
          {/* ── Card06: Mastercard (left side, rotated label) ── */}
          <View style={{ position: "absolute", left: mastercardLeft, top: mastercardTop }}>
            <MastercardLogo isVirtual />
            <Text style={cv.mastercardLabel}>mastercard</Text>
          </View>

          {/* ── Card06: RFID waves ── */}
          <View style={{ position: "absolute", left: rfidLeft, top: rfidTop }}>
            <RfidWaves isVirtual />
          </View>

          {/* ── Card06: EMV chip ── */}
          <View style={{ position: "absolute", left: chipLeft, top: chipTop }}>
            <EmvChip isVirtual />
          </View>
        </>
      ) : (
        <>
          {/* ── Card07: Mastercard (right side) ── */}
          <View style={{ position: "absolute", left: mc07Left, top: mc07Top }}>
            <MastercardLogo isVirtual={false} />
            <Text style={[cv.mastercardLabel, { color: "rgba(255,255,255,0.75)" }]}>
              mastercard
            </Text>
          </View>

          {/* ── Card07: EMV chip (right area) ── */}
          <View style={{ position: "absolute", left: chip07Left, top: chip07Top }}>
            <EmvChip isVirtual={false} />
          </View>

          {/* ── Card07: RFID waves ── */}
          <View style={{ position: "absolute", left: rfid07Left, top: rfid07Top }}>
            <RfidWaves isVirtual={false} />
          </View>

          {/* ── Card07: decorative frame at bottom ── */}
          <View
            style={{
              position: "absolute",
              bottom: cardH * 0.08,
              left: (cardW - Math.min(cardW * 0.65, 130)) / 2,
            }}
          >
            <PremiumFrame w={cardW} />
          </View>
        </>
      )}
    </View>
  );
}

const cv = StyleSheet.create({
  root: {
    borderRadius: 20,
    shadowOffset: { width: 0, height: 24 },
    shadowOpacity: 0.5,
    shadowRadius: 40,
    elevation: 14,
    overflow: "hidden",
    position: "relative",
  },
  numWrap: {
    position: "absolute",
    top: 0, bottom: 0, left: 0, right: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  num: {
    color: "rgba(255,255,255,0.12)",
    fontSize: 12,
    fontFamily: "Manrope_500Medium",
    letterSpacing: 4,
  },
  brandWrap: {
    position: "absolute",
    transform: [{ rotate: "90deg" }],
  },
  brandText: {
    color: "rgba(255,255,255,0.55)",
    fontSize: 11,
    fontFamily: "Manrope_600SemiBold",
    letterSpacing: 3,
    textTransform: "uppercase",
  },
  mastercardLabel: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 7,
    fontFamily: "Manrope_500Medium",
    letterSpacing: 0.3,
    marginTop: 3,
  },
});

/* ─── Tab button (crossfade bold ↔ normal) ───────────────────────────────── */
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
    inputRange: [0, pageW],
    outputRange: index === 0 ? [1, 0] : [0, 1],
    extrapolate: "clamp",
  });
  const normalOpacity = activeAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 0] });
  const boldOpacity   = activeAnim;
  const normalColor: Animated.AnimatedInterpolation<string> = scrollX.interpolate({
    inputRange:  [0, pageW],
    outputRange: index === 0
      ? (["#111111", "#b0b0b0"] as any)
      : (["#b0b0b0", "#111111"] as any),
    extrapolate: "clamp",
  });

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={tb.wrap}>
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

  const barBottom      = Math.max(insets.bottom + 10, Platform.OS === "ios" ? 20 : 12);
  const tabBarClearance = barBottom + PILL_BAR_HEIGHT + 20;

  const CARD_V_PAD = 16;
  const RESERVED   = topPad + 46 + CARD_V_PAD * 2 + 42 + 72 + 58 + tabBarClearance;
  const cardH = Math.min(Math.max(Math.round(screenH - RESERVED), 200), 340);
  // Card06/07 aspect ratio: 210 / 332 ≈ 0.632
  const cardW = Math.round(cardH * (210 / 332));

  const scrollX   = useRef(new Animated.Value(0)).current;
  const scrollRef = useRef<ScrollView>(null);

  const snapTo = useCallback((index: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    scrollRef.current?.scrollTo({ x: index * pageW, animated: true });
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
        contentContainerStyle={{ width: pageW * SLIDES.length }}
        style={s.cardScroll}
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

        {/* Description */}
        <View style={s.descArea}>
          {SLIDES.map((slide, i) => (
            <Animated.View
              key={slide.id}
              style={[StyleSheet.absoluteFillObject, s.descLayer, { opacity: opacities[i] }]}
              pointerEvents="none"
            >
              <Text style={s.descText}>{slide.description}</Text>
            </Animated.View>
          ))}
        </View>

        {/* CTA */}
        <View style={s.ctaArea}>
          {SLIDES.map((slide, i) => (
            <Animated.View
              key={slide.id}
              style={[s.ctaBtnWrap, { opacity: opacities[i], position: "absolute", left: 0, right: 0, pointerEvents: "box-none" }]}
            >
              <TouchableOpacity
                activeOpacity={0.88}
                style={[s.ctaBtn, { backgroundColor: slide.buttonColor }]}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  Alert.alert(
                    slide.label + " Card",
                    "Your " + slide.label.toLowerCase() + " card request has been submitted! We'll notify you when it's ready.",
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
  root:        { flex: 1, backgroundColor: "#FFFFFF" },

  header:      { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingBottom: 16, paddingTop: 8 },
  headerSpacer:{ width: 36 },
  headerTitle: { fontSize: 17, fontFamily: "Manrope_700Bold", color: "#111111", letterSpacing: -0.2, textAlign: "center" },

  cardScroll:  { flexShrink: 0 },
  cardPage:    { alignItems: "center", justifyContent: "center" },

  bottom:      { flex: 1, flexDirection: "column", justifyContent: "space-between", paddingHorizontal: 20 },

  tabs:        { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 32, paddingVertical: 4 },

  descArea:    { flex: 1, overflow: "hidden" },
  descLayer:   { alignItems: "center", justifyContent: "center", paddingHorizontal: 8 },
  descText:    { fontFamily: "Manrope_400Regular", fontSize: 15, color: "#999999", lineHeight: 23, textAlign: "center" },

  ctaArea:     { height: 54, position: "relative" },
  ctaBtnWrap:  {},
  ctaBtn:      { height: 54, borderRadius: 100, alignItems: "center", justifyContent: "center", shadowColor: "#000", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.30, shadowRadius: 20, elevation: 8 },
  ctaBtnText:  { fontFamily: "Manrope_600SemiBold", fontSize: 17, color: "#FFFFFF", letterSpacing: -0.2 },
});
