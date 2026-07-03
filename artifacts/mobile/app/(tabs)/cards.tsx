import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Circle, Path, Rect, ClipPath, Defs, G } from "react-native-svg";

/* ─── Design tokens ──────────────────────────────────────────────────────── */
const C = {
  bg:      "#FFFFFF",
  surface: "#F5F7FA",
  text:    "#111827",
  textSec: "#6B7280",
  textMut: "#9CA3AF",
  navy:    "#1A1A2E",
  border:  "#E5E7EB",
};

type CardType = "regular" | "premium";

/* ─── Card dimensions (portrait) ────────────────────────────────────────── */
/* Original Figma frame was landscape 332×210; rotating 90° → portrait 210×332.
   We display it at CARD_W×CARD_H, preserving that landscape aspect ratio. */
const CARD_W = 185;
const CARD_H = Math.round(332 * (CARD_W / 210)); // ≈ 293

/* ─── Regular card ───────────────────────────────────────────────────────── */
function RegularCard() {
  return (
    <View style={[card.base, { backgroundColor: "#F4F4F4" }]}>
      {/* Chip (RFID) — upper area */}
      <View style={card.chipWrap}>
        <Svg width={38} height={29} viewBox="0 0 40 30">
          <Defs>
            <ClipPath id="cr">
              <Rect width={40} height={30} rx={4.5} />
            </ClipPath>
          </Defs>
          <G clipPath="url(#cr)">
            <Rect width={40} height={30} rx={4.5} fill="#E9DCA5" />
            {/* horizontal lines */}
            <Path d="M0 10 H40" stroke="#8C7A3A" strokeWidth={0.8} />
            <Path d="M0 20 H40" stroke="#8C7A3A" strokeWidth={0.8} />
            {/* vertical lines */}
            <Path d="M13 0 V30" stroke="#8C7A3A" strokeWidth={0.8} />
            <Path d="M27 0 V30" stroke="#8C7A3A" strokeWidth={0.8} />
            {/* center square */}
            <Rect x={13} y={10} width={14} height={10} fill="#D4B96A" opacity={0.6} />
          </G>
        </Svg>
      </View>

      {/* Brand name — vertical, right side */}
      <View style={card.brandWrap}>
        <Text style={[card.brandText, { color: "#424242" }]}>PAYVORA</Text>
      </View>

      {/* Mastercard logo — bottom */}
      <View style={card.mcWrap}>
        <View style={[card.mcCircle, { backgroundColor: "#EB001B", left: 0 }]} />
        <View style={[card.mcCircle, { backgroundColor: "#F79E1B", left: 18 }]} />
        {/* overlap tint */}
        <View style={[card.mcCircle, { backgroundColor: "#FF5F00", left: 9, opacity: 0.4 }]} />
      </View>
      <Text style={[card.mcLabel, { color: "#424242" }]}>mastercard</Text>
    </View>
  );
}

/* ─── Premium card ───────────────────────────────────────────────────────── */
function PremiumCard() {
  return (
    <View style={[card.base, { overflow: "hidden" }]}>
      <LinearGradient
        colors={["#1A1A2E", "#16213E", "#0F3460"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />
      {/* Decorative arc */}
      <View style={card.arc} />

      {/* Chip */}
      <View style={card.chipWrap}>
        <Svg width={38} height={29} viewBox="0 0 40 30">
          <Defs>
            <ClipPath id="cp">
              <Rect width={40} height={30} rx={4.5} />
            </ClipPath>
          </Defs>
          <G clipPath="url(#cp)">
            <Rect width={40} height={30} rx={4.5} fill="#B8973A" />
            <Path d="M0 10 H40" stroke="#8C6A1A" strokeWidth={0.8} />
            <Path d="M0 20 H40" stroke="#8C6A1A" strokeWidth={0.8} />
            <Path d="M13 0 V30" stroke="#8C6A1A" strokeWidth={0.8} />
            <Path d="M27 0 V30" stroke="#8C6A1A" strokeWidth={0.8} />
            <Rect x={13} y={10} width={14} height={10} fill="#D4A020" opacity={0.7} />
          </G>
        </Svg>
      </View>

      {/* Brand name */}
      <View style={card.brandWrap}>
        <Text style={[card.brandText, { color: "#FFFFFF" }]}>PAYVORA</Text>
      </View>

      {/* Mastercard logo */}
      <View style={card.mcWrap}>
        <View style={[card.mcCircle, { backgroundColor: "#EB001B", left: 0 }]} />
        <View style={[card.mcCircle, { backgroundColor: "#F79E1B", left: 18 }]} />
        <View style={[card.mcCircle, { backgroundColor: "#FF5F00", left: 9, opacity: 0.4 }]} />
      </View>
      <Text style={[card.mcLabel, { color: "rgba(255,255,255,0.7)" }]}>mastercard</Text>

      {/* PREMIUM badge */}
      <View style={card.premiumBadge}>
        <Text style={card.premiumBadgeText}>PREMIUM</Text>
      </View>
    </View>
  );
}

const card = StyleSheet.create({
  base: {
    width:         CARD_W,
    height:        CARD_H,
    borderRadius:  16,
    shadowColor:   "#000",
    shadowOffset:  { width: 0, height: 8 },
    shadowOpacity: 0.14,
    shadowRadius:  20,
    elevation:     10,
    position:      "relative",
  },
  arc: {
    position:        "absolute",
    width:           CARD_W * 1.4,
    height:          CARD_W * 1.4,
    borderRadius:    CARD_W * 0.7,
    backgroundColor: "rgba(255,255,255,0.05)",
    top:             -CARD_W * 0.5,
    right:           -CARD_W * 0.4,
  },
  chipWrap: {
    position: "absolute",
    top:      60,
    left:     20,
  },
  brandWrap: {
    position: "absolute",
    right:    16,
    top:      0,
    bottom:   0,
    justifyContent: "center",
    alignItems:     "center",
  },
  brandText: {
    fontFamily:    "Manrope_700Bold",
    fontSize:      11,
    letterSpacing: 2,
    transform:     [{ rotate: "90deg" }],
  },
  mcWrap: {
    position:  "absolute",
    bottom:    30,
    left:      18,
    width:     48,
    height:    28,
  },
  mcCircle: {
    position:     "absolute",
    width:         28,
    height:        28,
    borderRadius:  14,
  },
  mcLabel: {
    position:      "absolute",
    bottom:        14,
    left:          20,
    fontSize:       8,
    fontFamily:    "Manrope_500Medium",
    letterSpacing: 0.3,
  },
  premiumBadge: {
    position:        "absolute",
    top:             20,
    right:           14,
    backgroundColor: "rgba(255,215,0,0.15)",
    borderWidth:     1,
    borderColor:     "rgba(255,215,0,0.4)",
    borderRadius:    6,
    paddingHorizontal: 7,
    paddingVertical:   3,
  },
  premiumBadgeText: {
    fontSize:      7,
    fontFamily:    "Manrope_700Bold",
    color:         "#FFD700",
    letterSpacing: 1,
  },
});

/* ─── Card data ──────────────────────────────────────────────────────────── */
const CARD_DATA: Record<CardType, { label: string; title: string; description: string; cta: string }> = {
  regular: {
    label:       "Regular",
    title:       "Regular Card",
    description: "Instant and ready to use online. Add to Apple Pay and use it to pay in stores, just like a physical card.",
    cta:         "Get Regular Card",
  },
  premium: {
    label:       "Premium",
    title:       "Premium Card",
    description: "Unlock higher limits, premium benefits, and enhanced features designed for frequent users.",
    cta:         "Get Premium Card",
  },
};

const SLIDE_DURATION = 350;
const SLIDE_EASING   = Easing.bezier(0.4, 0, 0.2, 1);

/* ─── Main screen ────────────────────────────────────────────────────────── */
export default function CardsScreen() {
  const insets  = useSafeAreaInsets();
  const { width: screenW } = useWindowDimensions();
  const topPad  = Platform.OS === "web" ? 40 : insets.top;

  const [selected, setSelected] = useState<CardType>("regular");
  const trackX    = useSharedValue(0);
  const descOp    = useSharedValue(1);

  const trackStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: trackX.value }],
  }));
  const descStyle = useAnimatedStyle(() => ({
    opacity: descOp.value,
  }));

  function selectCard(type: CardType) {
    if (type === selected) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    /* Fade out description, slide card, fade in description */
    descOp.value = withTiming(0, { duration: 120 });

    const targetX = type === "regular" ? 0 : -CARD_W;
    trackX.value = withTiming(targetX, { duration: SLIDE_DURATION, easing: SLIDE_EASING }, () => {
      descOp.value = withTiming(1, { duration: 180 });
    });

    setSelected(type);
  }

  const info = CARD_DATA[selected];
  const isPremium = selected === "premium";

  return (
    <View style={[s.root, { backgroundColor: C.bg }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[s.scroll, { paddingTop: topPad, paddingBottom: insets.bottom + 100 }]}
        bounces={false}
      >
        {/* ── Header ── */}
        <View style={s.header}>
          <View style={s.headerSpacer} />
          <Text style={s.headerTitle}>Choose a Card Type</Text>
          <View style={s.headerSpacer} />
        </View>

        {/* ── Card showcase ── */}
        <View style={[s.showcase, { marginHorizontal: 16 }]}>

          {/* Tab switcher */}
          <View style={s.tabRow}>
            {(["regular", "premium"] as CardType[]).map((type) => {
              const active = selected === type;
              return (
                <TouchableOpacity
                  key={type}
                  onPress={() => selectCard(type)}
                  activeOpacity={0.85}
                  style={[s.tabBtn, active && s.tabBtnActive]}
                >
                  <Text style={[s.tabLabel, active && s.tabLabelActive]}>
                    {CARD_DATA[type].label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Card track */}
          <View style={s.cardViewport}>
            <Animated.View style={[s.cardTrack, trackStyle]}>
              {/* Regular */}
              <View style={{ width: CARD_W }}>
                <RegularCard />
              </View>
              {/* Premium */}
              <View style={{ width: CARD_W }}>
                <PremiumCard />
              </View>
            </Animated.View>
          </View>
        </View>

        {/* ── Description ── */}
        <Animated.View style={[s.desc, descStyle]}>
          <Text style={s.descLabel}>
            {isPremium ? "Premium" : "Standard"}
          </Text>
          <Text style={s.descTitle}>{info.title}</Text>
          <Text style={s.descBody}>{info.description}</Text>
        </Animated.View>

        {/* ── Feature bullets ── */}
        <Animated.View style={[s.bullets, descStyle]}>
          {(isPremium
            ? ["Higher spending limits", "Priority customer support", "Exclusive cashback rewards", "International payments"]
            : ["Instant virtual card", "Apple Pay & Google Pay", "Online purchases worldwide", "Bank-level security"]
          ).map((item) => (
            <View key={item} style={s.bulletRow}>
              <View style={[s.bulletDot, { backgroundColor: isPremium ? "#0F3460" : C.navy }]} />
              <Text style={s.bulletText}>{item}</Text>
            </View>
          ))}
        </Animated.View>
      </ScrollView>

      {/* ── CTA button (fixed above tab bar) ── */}
      <View style={[s.ctaWrap, { paddingBottom: Math.max(insets.bottom, 16) + 72 }]}>
        {isPremium ? (
          <LinearGradient
            colors={["#5B8DB8", "#7FBCD2"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={s.ctaGradient}
          >
            <TouchableOpacity
              style={s.ctaInner}
              activeOpacity={0.88}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                Alert.alert("Premium Card", "Your Premium Card request has been submitted! Our team will review and activate your card within 24 hours.", [{ text: "Got it" }]);
              }}
            >
              <Text style={s.ctaText}>{info.cta}</Text>
            </TouchableOpacity>
          </LinearGradient>
        ) : (
          <TouchableOpacity
            style={[s.ctaBtn, { backgroundColor: C.navy }]}
            activeOpacity={0.88}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              Alert.alert("Regular Card", "Your Regular Card is being set up! You'll receive a notification once it's ready to use.", [{ text: "Got it" }]);
            }}
          >
            <Text style={s.ctaText}>{info.cta}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  root:   { flex: 1, backgroundColor: C.bg },
  scroll: { flexGrow: 1 },

  /* Header */
  header: {
    flexDirection:   "row",
    alignItems:      "center",
    justifyContent:  "space-between",
    paddingHorizontal: 20,
    paddingBottom:   24,
    paddingTop:      8,
  },
  headerSpacer: { width: 36 },
  headerTitle: {
    fontSize:      17,
    fontFamily:    "Manrope_600SemiBold",
    color:         C.text,
    letterSpacing: -0.3,
  },

  /* Showcase */
  showcase: {
    backgroundColor: C.surface,
    borderRadius:    20,
    paddingTop:      24,
    paddingBottom:   28,
    alignItems:      "center",
    gap:             24,
  },

  /* Tabs */
  tabRow: {
    flexDirection:   "row",
    backgroundColor: "#FFFFFF",
    borderRadius:    40,
    padding:         4,
    gap:             2,
    shadowColor:     "#000",
    shadowOffset:    { width: 0, height: 1 },
    shadowOpacity:   0.06,
    shadowRadius:    4,
    elevation:       2,
  },
  tabBtn: {
    paddingHorizontal: 24,
    paddingVertical:   9,
    borderRadius:      40,
  },
  tabBtnActive: {
    backgroundColor: C.navy,
    shadowColor:     "#000",
    shadowOffset:    { width: 0, height: 2 },
    shadowOpacity:   0.15,
    shadowRadius:    6,
    elevation:       3,
  },
  tabLabel: {
    fontSize:      13,
    fontFamily:    "Manrope_600SemiBold",
    color:         C.textMut,
    letterSpacing: 0.2,
  },
  tabLabelActive: {
    color: "#FFFFFF",
  },

  /* Card viewport / track */
  cardViewport: {
    width:    CARD_W,
    height:   CARD_H,
    overflow: "hidden",
  },
  cardTrack: {
    flexDirection: "row",
    width:         CARD_W * 2,
  },

  /* Description */
  desc: {
    paddingHorizontal: 24,
    paddingTop:        28,
    gap:               8,
  },
  descLabel: {
    fontSize:      11,
    fontFamily:    "Manrope_700Bold",
    color:         C.textMut,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  descTitle: {
    fontSize:      22,
    fontFamily:    "Manrope_700Bold",
    color:         C.text,
    letterSpacing: -0.5,
  },
  descBody: {
    fontSize:   15,
    fontFamily: "Manrope_400Regular",
    color:      C.textSec,
    lineHeight: 24,
    marginTop:  4,
  },

  /* Feature bullets */
  bullets: {
    paddingHorizontal: 24,
    paddingTop:        18,
    gap:               12,
  },
  bulletRow: {
    flexDirection: "row",
    alignItems:    "center",
    gap:           10,
  },
  bulletDot: {
    width:        7,
    height:       7,
    borderRadius: 4,
  },
  bulletText: {
    fontSize:   14,
    fontFamily: "Manrope_500Medium",
    color:      C.textSec,
  },

  /* CTA */
  ctaWrap: {
    position:          "absolute",
    bottom:            0,
    left:              0,
    right:             0,
    paddingHorizontal: 20,
    paddingTop:        12,
    backgroundColor:   C.bg,
    borderTopWidth:    1,
    borderTopColor:    C.border,
  },
  ctaGradient: {
    borderRadius: 40,
    height:       56,
  },
  ctaInner: {
    flex:           1,
    alignItems:     "center",
    justifyContent: "center",
  },
  ctaBtn: {
    height:         56,
    borderRadius:   40,
    alignItems:     "center",
    justifyContent: "center",
  },
  ctaText: {
    fontSize:      16,
    fontFamily:    "Manrope_700Bold",
    color:         "#FFFFFF",
    letterSpacing: -0.2,
  },
});
