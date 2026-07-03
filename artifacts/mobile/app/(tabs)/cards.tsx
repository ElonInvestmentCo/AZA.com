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
import { useSafeAreaInsets } from "react-native-safe-area-context";

/* ─── Slide data (mirrors the Figma design) ─────────────────────────────── */
const SLIDES = [
  {
    id:          "virtual",
    label:       "Virtual",
    cardColor:   "#6B7FD4",
    cardGlow:    "rgba(107,127,212,0.40)",
    cardLabel:   "VIRTUAL",
    buttonColor: "#4B63CC",
    buttonText:  "Get virtual card",
    description:
      "Instant and ready to use online. Add to Apple Pay and use it to pay in stores, just like a physical card.",
  },
  {
    id:          "disposable",
    label:       "Disposable virtual",
    cardColor:   "#F472B6",
    cardGlow:    "rgba(244,114,182,0.40)",
    cardLabel:   "DISPOSABLE VIRTUAL",
    buttonColor: "#EC4899",
    buttonText:  "Get disposable virtual card",
    description:
      "Add an extra layer of security with our disposable virtual cards. Your details automatically change each time you make a payment, protecting you from fraud.",
  },
] as const;

/* ─── Mastercard logo ────────────────────────────────────────────────────── */
function MastercardLogo() {
  const S = 26;
  const overlap = 10;
  return (
    <View>
      <View style={{ width: S + overlap + S - overlap, height: S, flexDirection: "row" }}>
        <View style={[mc.circle, { backgroundColor: "#EB001B", left: 0 }]} />
        <View style={[mc.circle, { backgroundColor: "#F79E1B", left: S - overlap }]} />
        <View style={[mc.circle, { backgroundColor: "#FF5F00", left: (S - overlap) / 2, opacity: 0.45 }]} />
      </View>
      <Text style={mc.label}>mastercard</Text>
    </View>
  );
}

const mc = StyleSheet.create({
  circle: { position: "absolute", width: 26, height: 26, borderRadius: 13 },
  label:  { color: "rgba(255,255,255,0.85)", fontSize: 8, fontFamily: "Manrope_500Medium", letterSpacing: 0.4, marginTop: 2 },
});

/* ─── PAYVORA "P" mark ───────────────────────────────────────────────────── */
function PayvoraMark() {
  return (
    <View style={pm.wrap}>
      <Text style={pm.letter}>P</Text>
    </View>
  );
}

const pm = StyleSheet.create({
  wrap:   { width: 38, height: 38, borderRadius: 10, backgroundColor: "rgba(255,255,255,0.18)", alignItems: "center", justifyContent: "center" },
  letter: { color: "#FFFFFF", fontSize: 20, fontFamily: "Manrope_700Bold", lineHeight: 22 },
});

/* ─── Portrait card visual ───────────────────────────────────────────────── */
function Card({
  slide,
  cardW,
  cardH,
}: {
  slide: typeof SLIDES[number];
  cardW: number;
  cardH: number;
}) {
  return (
    <View
      style={[
        cv.root,
        {
          width: cardW,
          height: cardH,
          backgroundColor: slide.cardColor,
          shadowColor: slide.cardGlow,
        },
      ]}
    >
      <View style={cv.blob} />
      <View style={cv.numWrap}>
        <Text style={cv.num}>8003  6071  0534  6352</Text>
      </View>
      <View style={[cv.sideLabel, { left: -(cardH * 0.25) / 2 + 10 }]}>
        <Text style={cv.sideLabelText}>CARD HOLDER</Text>
      </View>
      <View style={[cv.sideLabel, { right: -(cardH * 0.25) / 2 + 10, transform: [{ rotate: "90deg" }] }]}>
        <Text style={[cv.sideLabelText, { fontSize: 8.5 }]}>{slide.cardLabel}</Text>
      </View>
      <View style={cv.bottom}>
        <MastercardLogo />
        <PayvoraMark />
      </View>
    </View>
  );
}

const cv = StyleSheet.create({
  root: {
    borderRadius: 28,
    shadowOffset: { width: 0, height: 24 },
    shadowOpacity: 0.55,
    shadowRadius: 40,
    elevation: 14,
    overflow: "hidden",
    position: "relative",
  },
  blob: {
    position: "absolute",
    top: "10%", left: "20%",
    width: "60%", height: "38%",
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.13)",
  },
  numWrap: {
    position: "absolute",
    top: 0, bottom: 0, left: 0, right: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  num: {
    color: "rgba(255,255,255,0.20)",
    fontSize: 11,
    fontFamily: "Manrope_500Medium",
    letterSpacing: 3,
  },
  sideLabel: {
    position: "absolute",
    top: 0, bottom: 0,
    justifyContent: "center",
    transform: [{ rotate: "-90deg" }],
  },
  sideLabelText: {
    color: "rgba(255,255,255,0.72)",
    fontSize: 9,
    fontFamily: "Manrope_600SemiBold",
    letterSpacing: 2.5,
    textTransform: "uppercase",
  },
  bottom: {
    position: "absolute",
    bottom: 20, left: 20, right: 20,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
});

/* ─── Tab button with crossfaded bold ↔ normal text ─────────────────────── */
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
    inputRange: [0, pageW],
    outputRange: index === 0
      ? (["#111111", "#b0b0b0"] as any)
      : (["#b0b0b0", "#111111"] as any),
    extrapolate: "clamp",
  });

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={tb.wrap}>
      {/* Hidden bold copy to reserve layout width */}
      <Text style={[tb.hidden, tb.bold]}>{slide.label}</Text>
      <Animated.Text style={[tb.label, tb.normal, { position: "absolute", opacity: normalOpacity, color: normalColor as any }]}>
        {slide.label}
      </Animated.Text>
      <Animated.Text style={[tb.label, tb.bold, { position: "absolute", opacity: boldOpacity, color: "#111111" }]}>
        {slide.label}
      </Animated.Text>
    </TouchableOpacity>
  );
}

const tb = StyleSheet.create({
  wrap:   { position: "relative", paddingVertical: 6, paddingHorizontal: 4 },
  hidden: { opacity: 0 },
  label:  { fontSize: 17, letterSpacing: -0.2, fontFamily: "Manrope_600SemiBold" },
  normal: { fontFamily: "Manrope_400Regular" },
  bold:   { fontFamily: "Manrope_700Bold" },
});

/* ─── Main screen ────────────────────────────────────────────────────────── */

/*
 * The pill tab bar in _layout.tsx is positioned ABSOLUTELY over the screen
 * (not in the layout flow), so this screen must manually reserve space for it.
 *
 * Pill bar geometry (mirrored from _layout.tsx):
 *   height:     68 pt
 *   bottom:     max(insets.bottom + 10, iOS ? 20 : 12)
 *
 * Total clearance = barBottom + barHeight + a small breathing gap.
 */
const PILL_BAR_HEIGHT = 68;

export default function CardsScreen() {
  const insets = useSafeAreaInsets();
  const { width: screenW, height: screenH } = useWindowDimensions();
  const topPad = Platform.OS === "web" ? 48 : insets.top;
  const pageW  = screenW;

  /*
   * Bottom clearance: enough space so the CTA button sits comfortably above
   * the floating pill tab bar on every device.
   */
  const barBottom = Math.max(
    insets.bottom + 10,
    Platform.OS === "ios" ? 20 : 12,
  );
  const tabBarClearance = barBottom + PILL_BAR_HEIGHT + 20; // 20 pt breathing room

  /*
   * Card height: dynamically sized so all UI elements fit without scrolling.
   *
   * Budget consumed by everything except the card:
   *   topPad           – device status bar / notch
   *   46               – header (paddingTop 8 + title ~22 + paddingBottom 16)
   *   CARD_V_PAD * 2   – vertical padding around the card in its scroll zone
   *   42               – tab row (label 21 + tb.wrap paddingV 12 + s.tabs paddingV 8 ≈ 41)
   *   72               – minimum description area
   *   58               – CTA button
   *   tabBarClearance  – space for floating pill bar
   */
  const CARD_V_PAD   = 16;
  const RESERVED     = topPad + 46 + CARD_V_PAD * 2 + 42 + 72 + 58 + tabBarClearance;
  const cardH = Math.min(Math.max(Math.round(screenH - RESERVED), 200), 340);
  const cardW = Math.round(cardH * 0.63);

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

      {/* ── Horizontal card swipe ──────────────────────────────────────────
       *  • pagingEnabled + decelerationRate "fast" snaps pages cleanly.
       *  • scrollEventThrottle={1} drives the interpolations at full 60 FPS.
       *  • alwaysBounceVertical={false} prevents the scroll view from
       *    jolting vertically when the user swipes slightly off-axis, which
       *    is the main source of reported scroll jank on this screen.
       *  • The Animated event uses useNativeDriver:false because it drives
       *    opacity/color animated values that require the JS thread.
       ─────────────────────────────────────────────────────────────────── */}
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

      {/* ── Bottom UI: tabs + description + CTA ─────────────────────────── */}
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

        {/* Description — cross-fades between slides */}
        <View style={s.descArea}>
          {SLIDES.map((slide, i) => (
            <Animated.Text
              key={slide.id}
              style={[
                s.descText,
                {
                  opacity: opacities[i],
                  position: "absolute",
                  left: 32, right: 32,
                  pointerEvents: "none",
                },
              ]}
            >
              {slide.description}
            </Animated.Text>
          ))}
        </View>

        {/* CTA — cross-fades between slides */}
        <View style={s.ctaArea}>
          {SLIDES.map((slide, i) => (
            <Animated.View
              key={slide.id}
              style={[
                s.ctaBtnWrap,
                {
                  opacity: opacities[i],
                  position: "absolute",
                  left: 0, right: 0,
                  pointerEvents: "box-none",
                },
              ]}
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
  root: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 16,
    paddingTop: 8,
  },
  headerSpacer: { width: 36 },
  headerTitle: {
    fontSize: 17,
    fontFamily: "Manrope_700Bold",
    color: "#111111",
    letterSpacing: -0.2,
    textAlign: "center",
  },

  /*
   * Card scroll zone — fixed height (flexShrink: 0) so it doesn't compress
   * when the bottom section needs space, and doesn't expand to take extra
   * space that should go to the description area.
   */
  cardScroll: { flexShrink: 0 },

  cardPage: {
    alignItems: "center",
    justifyContent: "center",
  },

  /*
   * Bottom section — takes all remaining vertical space (flex: 1) and
   * distributes it between tabs (fixed), description (flex: 1), and CTA
   * (fixed). paddingBottom is applied inline so it can use the dynamic
   * tabBarClearance value.
   */
  bottom: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },

  tabs: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 32,
    paddingVertical: 4,
  },

  descArea: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
  },
  descText: {
    fontFamily: "Manrope_400Regular",
    fontSize: 15,
    color: "#999999",
    lineHeight: 23,
    textAlign: "center",
  },

  ctaArea: {
    height: 54,
    position: "relative",
  },
  ctaBtnWrap: {},
  ctaBtn: {
    height: 54,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.30,
    shadowRadius: 20,
    elevation: 8,
  },
  ctaBtnText: {
    fontFamily: "Manrope_600SemiBold",
    fontSize: 17,
    color: "#FFFFFF",
    letterSpacing: -0.2,
  },
});
