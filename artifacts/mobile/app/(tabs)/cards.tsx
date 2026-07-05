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
import Svg, { Circle, Path, Rect } from "react-native-svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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

/* ─── Mastercard logo — scales with card width ───────────────────────────── */
function MastercardLogo({
  isVirtual,
  r = 12,
}: {
  isVirtual: boolean;
  r?: number;
}) {
  const gap      = r * 0.6;
  const totalW   = r * 2 + r * 2 - gap;
  const totalH   = r * 2;
  const cx1      = r;
  const cx2      = totalW - r;
  const cy       = r;

  if (isVirtual) {
    // Card06: red left, orange right
    return (
      <Svg width={totalW} height={totalH} viewBox={`0 0 ${totalW} ${totalH}`}>
        <Circle cx={cx1} cy={cy} r={r} fill="#EF1B22" />
        <Circle cx={cx2} cy={cy} r={r} fill="#F79E1C" />
        {/* amber blend in overlap */}
        <Circle cx={totalW / 2} cy={cy} r={r * 0.55} fill="#FF5F00" opacity={0.45} />
      </Svg>
    );
  }
  // Card07: dark navy left, purple right
  return (
    <Svg width={totalW} height={totalH} viewBox={`0 0 ${totalW} ${totalH}`}>
      <Circle cx={cx1} cy={cy} r={r} fill="#28283E" stroke="#C1C1D7" strokeWidth={0.75} />
      <Circle cx={cx2} cy={cy} r={r} fill="#8282B0" stroke="#C1C1D7" strokeWidth={0.75} />
    </Svg>
  );
}

/* ─── EMV chip — scales with card width ──────────────────────────────────── */
function EmvChip({
  isVirtual,
  w = 36,
  h = 28,
}: {
  isVirtual: boolean;
  w?: number;
  h?: number;
}) {
  const bg = isVirtual ? "#E9DCA5" : "#D5B688";
  const st = "#262626";
  const sw = "0.7";
  const mx = w;   // viewBox coords = actual px so SVG scales cleanly
  const my = h;
  const px = mx * 0.36; // left trace join x (~36% = left contact pad edge)
  const qx = mx * 0.64; // right trace join x

  return (
    <Svg width={w} height={h} viewBox={`0 0 ${mx} ${my}`}>
      <Rect x={0} y={0} width={mx} height={my} rx={4} fill={bg} />
      {/* left traces */}
      <Path
        d={`M0.5 ${my * 0.32}H${px}C${px + 2} ${my * 0.32} ${px + 3} ${my * 0.42} ${px + 3} ${my * 0.5}
           V${my * 0.77}M${px + 3} ${my * 0.99}V${my * 0.77}M${px + 3} ${my * 0.77}H0.5
           M${px + 3} ${my * 0.5}H0.5`}
        stroke={st} strokeWidth={sw} fill="none" strokeLinecap="round"
      />
      {/* right traces */}
      <Path
        d={`M${mx - 0.5} ${my * 0.32}H${qx}C${qx - 2} ${my * 0.32} ${qx - 3} ${my * 0.42} ${qx - 3} ${my * 0.5}
           V${my * 0.77}M${qx - 3} ${my * 0.99}V${my * 0.77}M${qx - 3} ${my * 0.77}H${mx - 0.5}
           M${qx - 3} ${my * 0.5}H${mx - 0.5}`}
        stroke={st} strokeWidth={sw} fill="none" strokeLinecap="round"
      />
    </Svg>
  );
}

/* ─── RFID / contactless waves — scales with card ────────────────────────── */
function RfidWaves({
  isVirtual,
  size = 22,
}: {
  isVirtual: boolean;
  size?: number;
}) {
  const strokeColor = isVirtual ? "#424242" : "rgba(255,255,255,0.6)";
  // Arc paths drawn in a 22×26 viewBox; SVG scales to `size`
  const vw = 22, vh = 26;
  return (
    <Svg width={size} height={size * (vh / vw)} viewBox={`0 0 ${vw} ${vh}`}>
      <Path d="M5.5 13C7.6 10.6 7.6 6.4 5.5 4"
        stroke={strokeColor} strokeWidth={2} strokeLinecap="round" fill="none" />
      <Path d="M10.1 15.5C13.8 11.4 13.8 4.6 10.1 0.5"
        stroke={strokeColor} strokeWidth={2} strokeLinecap="round" fill="none" />
      <Path d="M15 18C20.4 12.2 20.4 3.8 15 -2"
        stroke={strokeColor} strokeWidth={2} strokeLinecap="round" fill="none" />
    </Svg>
  );
}

/* ─── Premium decorative frame (Card07 only) ─────────────────────────────── */
function PremiumFrame({ cardW }: { cardW: number }) {
  const w = cardW * 0.65;
  const h = cardW * 0.16;
  return (
    <Svg width={w} height={h} viewBox="0 0 160 40">
      <Path d="M0 40L12 0L32 0L20 40Z"    fill="rgba(255,255,255,0.18)" />
      <Path d="M40 40L52 0L72 0L60 40Z"   fill="rgba(255,255,255,0.18)" />
      <Path d="M80 40L92 0L112 0L100 40Z" fill="rgba(255,255,255,0.18)" />
      <Path d="M120 40L132 0L152 0L140 40Z" fill="rgba(255,255,255,0.18)" />
    </Svg>
  );
}

/* ─── Card visual ────────────────────────────────────────────────────────── */
/*
 * Two-wrapper pattern (fixes iOS shadow clipping):
 *   outer  – shadow props, NO overflow (so shadow is not clipped)
 *   inner  – overflow: "hidden" + background, clips card artwork
 *
 * All internal element sizes are derived from cardW / cardH so they stay
 * proportionally correct on any screen size.
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

  // Scaled element sizes
  const mcR      = Math.round(cardW * 0.062);   // Mastercard circle radius
  const chipW    = Math.round(cardW * 0.185);    // EMV chip width
  const chipH    = Math.round(chipW * 0.76);     // EMV chip height  (≈0.76 aspect)
  const rfidSize = Math.round(cardW * 0.114);    // RFID arc icon size

  /* ── Layout ratios from Card06/07 React components (316×500 ref frame) ──
   *
   *  Card06 (Virtual, dark-green):
   *    Mastercard  left 7.6 %, top 26 %
   *    RFID        left 7 %,   top 44 %
   *    EMV chip    left 41 %,  top 31 %
   *    PAYVORA     right ~5 %, top 2 %   (rotated 90°)
   *
   *  Card07 (Premium, gold):
   *    Mastercard  left 83 %,  top 3.3 %
   *    EMV chip    left 83 %,  top 31 %
   *    RFID        left 62 %,  top 31 %
   *    PAYVORA     left 44 %,  top 13 %  (rotated 90°)
   *    Frame       bottom 8 %, centered
   */
  const layout = isVirtual
    ? {
        mcLeft:    cardW * 0.076,
        mcTop:     cardH * 0.26,
        rfidLeft:  cardW * 0.07,
        rfidTop:   cardH * 0.44,
        chipLeft:  cardW * 0.41,
        chipTop:   cardH * 0.31,
        brandRight:  cardW * 0.052,
        brandTop:    cardH * 0.04,
      }
    : {
        mcLeft:    cardW * 0.83 - mcR * 2,  // keep within right edge
        mcTop:     cardH * 0.033,
        rfidLeft:  cardW * 0.62,
        rfidTop:   cardH * 0.31,
        chipLeft:  cardW * 0.83 - chipW,    // right-align chip
        chipTop:   cardH * 0.31,
        brandLeft:   cardW * 0.44,
        brandTop:    cardH * 0.13,
      };

  return (
    <View
      style={[
        cv.shadowWrap,
        {
          width: cardW,
          height: cardH,
          shadowColor: slide.cardGlow,
        },
      ]}
    >
      {/* ── Inner wrapper: clips artwork, no shadow ── */}
      <View style={[cv.cardInner, { backgroundColor: slide.cardBg }]}>

        {/* Faint card number */}
        <View style={cv.numWrap}>
          <Text style={cv.num}>•• 6352</Text>
        </View>

        {/* PAYVORA brand — vertical along one edge */}
        {isVirtual ? (
          <View
            pointerEvents="none"
            style={[cv.brandWrap, { right: (layout as any).brandRight, top: (layout as any).brandTop }]}
          >
            <Text style={cv.brandText}>PAYVORA</Text>
          </View>
        ) : (
          <View
            pointerEvents="none"
            style={[cv.brandWrap, { left: (layout as any).brandLeft, top: (layout as any).brandTop }]}
          >
            <Text style={cv.brandText}>PAYVORA</Text>
          </View>
        )}

        {/* Mastercard */}
        <View style={{ position: "absolute", left: layout.mcLeft, top: layout.mcTop }}>
          <MastercardLogo isVirtual={isVirtual} r={mcR} />
          <Text style={cv.mastercardLabel}>mastercard</Text>
        </View>

        {/* EMV chip */}
        <View style={{ position: "absolute", left: layout.chipLeft, top: layout.chipTop }}>
          <EmvChip isVirtual={isVirtual} w={chipW} h={chipH} />
        </View>

        {/* RFID waves */}
        <View style={{ position: "absolute", left: layout.rfidLeft, top: layout.rfidTop }}>
          <RfidWaves isVirtual={isVirtual} size={rfidSize} />
        </View>

        {/* Premium-only decorative frame */}
        {!isVirtual && (
          <View
            style={{
              position: "absolute",
              bottom: cardH * 0.08,
              left: (cardW - cardW * 0.65) / 2,
            }}
          >
            <PremiumFrame cardW={cardW} />
          </View>
        )}

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
    color: "rgba(255,255,255,0.5)",
    fontSize: 10,
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
