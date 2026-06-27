// @ts-ignore — expo-asset types resolved at runtime via expo's module resolver
import { Asset } from "expo-asset";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewToken,
  useWindowDimensions,
} from "react-native";
import LottieWalletSlide from "@/components/LottieWalletSlide";
import Animated, {
  cancelAnimation,
  Easing,
  FadeInUp,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import type { SharedValue } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// ── Assets ────────────────────────────────────────────────────────────────────
const slide1Img       = require("@/assets/images/slide1.png");
const slide3Img       = require("@/assets/images/slide3.png");
const giftCardImg     = require("@/assets/images/gift-card.png");
const giftCardVisaImg = require("@/assets/images/gift-card-visa.png");
const manImg          = require("@/assets/images/man-illustration.png");
const onboardPortfolio = require("@/assets/images/onboard-portfolio.png");
const onboardEsim      = require("@/assets/images/onboard-esim.png");

Asset.loadAsync([slide1Img, slide3Img, giftCardImg, giftCardVisaImg, manImg, onboardPortfolio, onboardEsim]);

// ── Helpers ───────────────────────────────────────────────────────────────────
function clamp(val: number, min: number, max: number) {
  return Math.min(Math.max(val, min), max);
}

// ── Layout constants ──────────────────────────────────────────────────────────
const HEADER_H = 56;
const DOTS_H   = 28;
const TEXT_H   = 72;
const BTNS_H   = 116;

// ── Slide definitions ─────────────────────────────────────────────────────────
type SlideItem = {
  id: string;
  type: "animated-wallet" | "giftcard" | "image" | "chatgpt-portfolio" | "virtual-card" | "chatgpt-esim";
  title: string;
  subtitle: string;
  bgColor: string;
};

const SLIDES: SlideItem[] = [
  {
    id: "1",
    type: "animated-wallet",
    title: "Withdraw like a Boss",
    subtitle: "Fast, secure withdrawals made simple.",
    bgColor: "#ffffff",
  },
  {
    id: "2",
    type: "giftcard",
    title: "Sell your gift card",
    subtitle: "Sell smarter. Get paid faster.",
    bgColor: "#EDE7F6",
  },
  {
    id: "3",
    type: "image",
    title: "Bill payments",
    subtitle: "Pay your bills seamlessly in one place",
    bgColor: "#ffffff",
  },
  {
    id: "4",
    type: "chatgpt-portfolio",
    title: "Track Your Portfolio",
    subtitle: "Monitor your crypto assets in real time.",
    bgColor: "#ffffff",
  },
  {
    id: "5",
    type: "virtual-card",
    title: "Virtual Card",
    subtitle: "Pay anywhere with your PAYVORA virtual card.",
    bgColor: "#ffffff",
  },
  {
    id: "6",
    type: "chatgpt-esim",
    title: "Global eSIM",
    subtitle: "Stay connected wherever you go.",
    bgColor: "#ffffff",
  },
];

// ── Animated pressable button ─────────────────────────────────────────────────
function ScaleBtn({
  style,
  textStyle,
  label,
  onPress,
}: {
  style: object;
  textStyle: object;
  label: string;
  onPress: () => void;
}) {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  return (
    <Animated.View style={animStyle}>
      <Pressable
        style={style}
        onPress={onPress}
        onPressIn={() => {
          scale.value = withSpring(0.96, { damping: 14, stiffness: 320 });
        }}
        onPressOut={() => {
          scale.value = withSpring(1, { damping: 14, stiffness: 320 });
        }}
      >
        <Text style={textStyle}>{label}</Text>
      </Pressable>
    </Animated.View>
  );
}

// ── Slide 1: Wallet + man + premium ring pulse ────────────────────────────────
function AnimatedWalletSlide({
  illustrationSize,
  slideW,
  slideH,
  isActive,
}: {
  illustrationSize: number;
  slideW: number;
  slideH: number;
  isActive: boolean;
}) {
  // Layout
  const manH     = illustrationSize * 1.38;
  const manW     = manH * 0.72;
  const illusTop  = (slideH - illustrationSize) / 2;
  const illusLeft = (slideW - illustrationSize) / 2;
  const manTop    = illusTop  + illustrationSize * 0.62 - manH * 0.50;
  const manLeft   = illusLeft - manW * 0.08;
  const startY    = -(slideH + manH);

  // Ring overlay on PAY button
  const ringSize = illustrationSize * 0.22;
  const ringTop  = illusTop  + illustrationSize * 0.62 - ringSize / 2;
  const ringLeft = illusLeft + illustrationSize * 0.61 - ringSize / 2;

  // Shared values
  const manY        = useSharedValue(startY);
  const illusOp     = useSharedValue(0);
  const illusSc     = useSharedValue(0.90);
  const ringOp      = useSharedValue(0);
  const ringSc      = useSharedValue(1);

  // JS-thread function that drives the ring pulse (called via runOnJS)
  const triggerPulse = useCallback(() => {
    ringOp.value = 0;
    ringSc.value = 1;
    // 3 expanding white ring pulses
    ringOp.value = withRepeat(
      withSequence(
        withTiming(0.72, { duration: 90, easing: Easing.out(Easing.quad) }),
        withTiming(0,    { duration: 580, easing: Easing.in(Easing.quad) }),
        withDelay(120, withTiming(0, { duration: 0 })),
      ),
      3,
      false,
    );
    ringSc.value = withRepeat(
      withSequence(
        withTiming(1.0,  { duration: 90 }),
        withTiming(2.5,  { duration: 580, easing: Easing.out(Easing.quad) }),
        withDelay(120, withTiming(1.0, { duration: 0 })),
      ),
      3,
      false,
    );
  }, []);

  useEffect(() => {
    if (!isActive) {
      cancelAnimation(manY);
      cancelAnimation(illusOp);
      cancelAnimation(illusSc);
      cancelAnimation(ringOp);
      cancelAnimation(ringSc);
      manY.value    = startY;
      illusOp.value = 0;
      illusSc.value = 0.90;
      ringOp.value  = 0;
      ringSc.value  = 1;
      return;
    }
    // Reset
    manY.value    = startY;
    illusOp.value = 0;
    illusSc.value = 0.90;
    ringOp.value  = 0;
    ringSc.value  = 1;

    // 1. Illustration fades + scales in
    illusOp.value = withTiming(1, { duration: 480, easing: Easing.out(Easing.quad) });
    illusSc.value = withSpring(1, { damping: 18, stiffness: 150 });

    // 2. Man slides down; on completion trigger ring pulse
    manY.value = withDelay(
      200,
      withTiming(0, { duration: 1100, easing: Easing.out(Easing.cubic) },
        (finished) => {
          "worklet";
          if (finished) runOnJS(triggerPulse)();
        }),
    );
  }, [isActive, illustrationSize]);

  const manStyle   = useAnimatedStyle(() => ({ transform: [{ translateY: manY.value }] }));
  const illusStyle = useAnimatedStyle(() => ({ opacity: illusOp.value, transform: [{ scale: illusSc.value }] }));
  const ringStyle  = useAnimatedStyle(() => ({ opacity: ringOp.value,  transform: [{ scale: ringSc.value  }] }));

  return (
    <View style={{ width: slideW, height: slideH }}>
      {/* Illustration — fades + scales in */}
      <Animated.View
        style={[
          { position: "absolute", top: illusTop, left: illusLeft,
            width: illustrationSize, height: illustrationSize },
          illusStyle,
        ]}
      >
        <Image
          source={slide1Img}
          style={{ width: illustrationSize, height: illustrationSize }}
          contentFit="contain"
          cachePolicy="memory-disk"
          priority="high"
        />
      </Animated.View>

      {/* Premium white ring pulse on PAY button */}
      <Animated.View
        style={[
          {
            position: "absolute",
            top: ringTop,
            left: ringLeft,
            width: ringSize,
            height: ringSize,
            borderRadius: ringSize / 2,
            borderWidth: 2.5,
            borderColor: "#FFFFFF",
            backgroundColor: "transparent",
          },
          ringStyle,
        ]}
      />

      {/* Man — slides in from top */}
      <Animated.View
        style={[
          { position: "absolute", top: manTop, left: manLeft, width: manW, height: manH },
          manStyle,
        ]}
      >
        <Image
          source={manImg}
          style={{ width: manW, height: manH }}
          contentFit="contain"
          cachePolicy="memory-disk"
          priority="high"
        />
      </Animated.View>
    </View>
  );
}

// ── QR code placeholder (decorative) ──────────────────────────────────────────
// Real QR-code anatomy (Version 1, 21×21):
//   • Three 7×7 finder patterns at TL, TR, BL corners
//   • Separator rows/cols (all 0) around each finder
//   • Horizontal + vertical timing strips (row 6 / col 6, alternating 1-0)
//   • Dark module at (13,8)
//   • Dense data modules in the remaining area
const QR_MATRIX: number[][] = [
  [1,1,1,1,1,1,1, 0, 1,0,1,1,0, 0, 1,1,1,1,1,1,1],
  [1,0,0,0,0,0,1, 0, 0,1,0,0,1, 0, 1,0,0,0,0,0,1],
  [1,0,1,1,1,0,1, 0, 1,1,1,0,0, 0, 1,0,1,1,1,0,1],
  [1,0,1,1,1,0,1, 0, 0,0,1,1,0, 0, 1,0,1,1,1,0,1],
  [1,0,1,1,1,0,1, 0, 1,0,0,0,1, 0, 1,0,1,1,1,0,1],
  [1,0,0,0,0,0,1, 0, 0,1,1,0,0, 0, 1,0,0,0,0,0,1],
  [1,1,1,1,1,1,1, 0, 1,0,1,0,1, 0, 1,1,1,1,1,1,1],
  [0,0,0,0,0,0,0, 0, 0,1,0,0,1, 0, 0,0,0,0,0,0,0],
  [1,1,0,1,0,1,1, 1, 1,0,1,0,0, 0, 1,0,1,1,0,0,1],
  [0,0,1,0,1,0,0, 0, 0,1,0,1,1, 0, 0,1,0,0,1,1,0],
  [1,1,0,1,1,0,1, 0, 1,0,0,0,1, 0, 1,0,1,0,0,1,1],
  [0,1,1,0,0,1,0, 1, 0,1,1,0,0, 1, 0,1,1,0,1,0,0],
  [1,0,1,1,0,0,1, 0, 1,0,0,1,1, 0, 1,0,0,1,0,1,0],
  [0,0,0,0,0,0,0, 0, 1,0,1,0,0, 1, 0,0,1,0,0,0,1],
  [1,1,1,1,1,1,1, 0, 1,1,0,0,1, 0, 0,1,1,0,1,0,1],
  [1,0,0,0,0,0,1, 0, 0,0,1,1,0, 0, 1,0,0,1,0,1,0],
  [1,0,1,1,1,0,1, 0, 1,0,0,0,1, 1, 0,1,0,0,1,0,1],
  [1,0,1,1,1,0,1, 0, 0,1,1,0,0, 0, 1,0,1,1,0,0,0],
  [1,0,1,1,1,0,1, 0, 1,0,0,1,0, 1, 0,1,0,0,1,1,0],
  [1,0,0,0,0,0,1, 0, 0,1,1,0,1, 0, 1,0,0,1,0,0,1],
  [1,1,1,1,1,1,1, 0, 1,0,0,1,0, 1, 0,0,1,0,1,1,0],
];

function QRPlaceholder({ size }: { size: number }) {
  const COLS   = 21;
  const PAD    = Math.round(size * 0.05);
  const cell   = (size - PAD * 2) / COLS;
  const r      = Math.max(1, cell * 0.28);          // module corner radius
  const logoSz = Math.round(cell * 5);              // centre logo ~5 cells wide

  // Finder-pattern border cells get a larger corner radius for the modern look
  const finderOuter = (row: number, col: number) =>
    (row < 7 && col < 7) ||
    (row < 7 && col >= 14) ||
    (row >= 14 && col < 7);

  return (
    <View style={{
      width: size, height: size,
      backgroundColor: "#fff",
      borderRadius: Math.round(size * 0.06),
      padding: PAD,
      overflow: "hidden",
    }}>
      {QR_MATRIX.map((row, ri) => (
        <View key={ri} style={{ flexDirection: "row" }}>
          {row.map((filled, ci) => {
            const isFinder = finderOuter(ri, ci);
            return (
              <View
                key={ci}
                style={{
                  width: cell,
                  height: cell,
                  backgroundColor: filled ? "#0D0D0D" : "#fff",
                  borderRadius: filled ? (isFinder ? r * 1.6 : r) : 0,
                }}
              />
            );
          })}
        </View>
      ))}

      {/* Centre brand mark — white circle with ₦ glyph */}
      <View style={{
        position: "absolute",
        left: (size - logoSz) / 2,
        top:  (size - logoSz) / 2,
        width: logoSz,
        height: logoSz,
        borderRadius: logoSz / 2,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 3,
        elevation: 2,
      }}>
        <Text style={{
          fontSize: Math.round(logoSz * 0.42),
          fontFamily: "Manrope_700Bold",
          color: "#0D0D0D",
          lineHeight: Math.round(logoSz * 0.5),
        }}>₦</Text>
      </View>
    </View>
  );
}

// ── Slide 2: Gift card — fade + spring in ─────────────────────────────────────
function GiftCardSlide({
  slideW,
  slideH,
  isActive,
}: {
  slideW: number;
  slideH: number;
  isActive: boolean;
}) {
  const blackCardW    = clamp(slideW * 0.88, 280, 420);
  const blackCardH    = blackCardW / 1.586;
  const blackCardLeft = (slideW - blackCardW) / 2;
  const blackCardTop  = (slideH - blackCardH) / 2;

  const qrSize = blackCardH * 0.50;
  const pad    = blackCardW * 0.06;

  const cardOp = useSharedValue(0);
  const cardSc = useSharedValue(0.88);

  useEffect(() => {
    if (!isActive) {
      cancelAnimation(cardOp);
      cancelAnimation(cardSc);
      cardOp.value = 0;
      cardSc.value = 0.88;
      return;
    }
    cardOp.value = withTiming(1, { duration: 480, easing: Easing.out(Easing.quad) });
    cardSc.value = withSpring(1, { damping: 18, stiffness: 140 });
  }, [isActive]);

  const cardStyle = useAnimatedStyle(() => ({
    opacity: cardOp.value,
    transform: [{ scale: cardSc.value }],
  }));

  return (
    <View style={{ width: slideW, height: slideH }}>
      <Animated.View
        style={[
          {
            position: "absolute",
            top: blackCardTop,
            left: blackCardLeft,
            width: blackCardW,
            height: blackCardH,
            backgroundColor: "#0A0A0A",
            borderRadius: 22,
            overflow: "hidden",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 12 },
            shadowOpacity: 0.45,
            shadowRadius: 28,
            elevation: 16,
            padding: pad,
          },
          cardStyle,
        ]}
      >
        {/* Top row: title + ID */}
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
          <View>
            <Text style={{ color: "#fff", fontSize: blackCardW * 0.048, fontFamily: "Manrope_700Bold", letterSpacing: -0.3 }}>
              Visa Gift Card
            </Text>
            <Text style={{ color: "rgba(255,255,255,0.75)", fontSize: blackCardW * 0.033, fontFamily: "Manrope_400Regular", marginTop: 3 }}>
              {"United States 🇺🇸"}
            </Text>
          </View>
          <Text style={{ color: "rgba(255,255,255,0.75)", fontSize: blackCardW * 0.033, fontFamily: "Manrope_400Regular" }}>
            {"ID: 12345678"}
          </Text>
        </View>

        {/* Bottom row: amount + QR */}
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", flex: 1, marginTop: 8 }}>
          <Text style={{ color: "#fff", fontSize: blackCardW * 0.13, fontFamily: "Manrope_700Bold", letterSpacing: -1 }}>
            $100
          </Text>
          <View style={{
            borderRadius: 6,
            overflow: "hidden",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.18,
            shadowRadius: 6,
            elevation: 4,
          }}>
            <QRPlaceholder size={qrSize} />
          </View>
        </View>
      </Animated.View>
    </View>
  );
}

// ── Slide 3: Illustration — fade + spring in + parallax ───────────────────────
function ImageSlide({
  illustrationSize,
  slideW,
  slideH,
  isActive,
  parallaxFactor,
}: {
  illustrationSize: number;
  slideW: number;
  slideH: number;
  isActive: boolean;
  parallaxFactor: number;
}) {
  const op = useSharedValue(0);
  const sc = useSharedValue(0.88);
  const px = useSharedValue(parallaxFactor * slideW * 0.13);

  useEffect(() => {
    if (!isActive) {
      cancelAnimation(op);
      cancelAnimation(sc);
      op.value = 0;
      sc.value = 0.88;
    } else {
      op.value = withTiming(1, { duration: 480, easing: Easing.out(Easing.quad) });
      sc.value = withSpring(1, { damping: 18, stiffness: 140 });
    }
  }, [isActive]);

  useEffect(() => {
    const target = Math.max(Math.min(parallaxFactor, 1), -1) * slideW * 0.13;
    px.value = withSpring(target, { damping: 20, stiffness: 160, mass: 0.8 });
  }, [parallaxFactor]);

  const animStyle = useAnimatedStyle(() => ({
    opacity: op.value,
    transform: [{ scale: sc.value }, { translateX: px.value }],
  }));

  return (
    <View style={{ width: slideW, height: slideH, overflow: "hidden", alignItems: "center", justifyContent: "center" }}>
      <Animated.View style={[animStyle, { width: slideW * 1.3, height: slideH }]}>
        <Image
          source={slide3Img}
          style={{ width: slideW * 1.3, height: slideH }}
          contentFit="contain"
          cachePolicy="memory-disk"
          priority="high"
        />
      </Animated.View>
    </View>
  );
}

// ── Slide N: Static image — fade + spring in + parallax depth ─────────────────
function ImageSlideStatic({
  source,
  slideW,
  slideH,
  isActive,
  parallaxFactor,
}: {
  source: number;
  slideW: number;
  slideH: number;
  isActive: boolean;
  parallaxFactor: number;
}) {
  const op = useSharedValue(0);
  const sc = useSharedValue(0.88);
  const px = useSharedValue(parallaxFactor * slideW * 0.13);

  useEffect(() => {
    if (!isActive) {
      cancelAnimation(op);
      cancelAnimation(sc);
      op.value = 0;
      sc.value = 0.88;
    } else {
      op.value = withTiming(1, { duration: 480, easing: Easing.out(Easing.quad) });
      sc.value = withSpring(1, { damping: 18, stiffness: 140 });
    }
  }, [isActive]);

  useEffect(() => {
    const target = Math.max(Math.min(parallaxFactor, 1), -1) * slideW * 0.13;
    px.value = withSpring(target, { damping: 20, stiffness: 160, mass: 0.8 });
  }, [parallaxFactor]);

  /* Combined transform — single Animated.View avoids the "overwritten transform" warning */
  const animStyle = useAnimatedStyle(() => ({
    opacity: op.value,
    transform: [{ scale: sc.value }, { translateX: px.value }],
  }));

  return (
    <View style={{ width: slideW, height: slideH, overflow: "hidden", alignItems: "center", justifyContent: "center" }}>
      <Animated.View style={[animStyle, { width: slideW * 1.3, height: slideH }]}>
        <Image
          source={source}
          style={{ width: slideW * 1.3, height: slideH }}
          contentFit="contain"
          cachePolicy="memory-disk"
          priority="high"
        />
      </Animated.View>
    </View>
  );
}

// ── Slide 5: Virtual Card — three isometric stacked cards ─────────────────────
//
// Implements the Figma design: CSS matrix(0.87, 0.5, -0.87, 0.5, 0, 0)
// converted to React Native 4×4 column-major matrix.
//
// CSS 2D matrix(a, b, c, d, e, f) → RN column-major [a,b,0,0, c,d,0,0, 0,0,1,0, e,f,0,1]
// = [0.87, 0.5, 0, 0,  -0.87, 0.5, 0, 0,  0, 0, 1, 0,  0, 0, 0, 1]
const ISO_MATRIX_VALS: number[] = [
  0.87,  0.5,  0, 0,
 -0.87,  0.5,  0, 0,
     0,    0,  1, 0,
     0,    0,  0, 1,
];

// Mastercard-style two-circle badge
function CardMCIcon({ colored }: { colored: boolean }) {
  const d = 17;
  const overlap = Math.round(d * 0.38);
  return (
    <View style={{ width: d * 2 - overlap, height: d, position: "relative" }}>
      <View style={{
        position: "absolute", left: 0, top: 0,
        width: d, height: d, borderRadius: d / 2,
        backgroundColor: colored ? "#ED0006" : "rgba(255,255,255,0.55)",
      }} />
      <View style={{
        position: "absolute", left: d - overlap, top: 0,
        width: d, height: d, borderRadius: d / 2,
        backgroundColor: "#F9A000",
      }} />
    </View>
  );
}

function VirtualCardSlide({
  slideW,
  slideH,
  isActive,
}: {
  slideW: number;
  slideH: number;
  isActive: boolean;
}) {
  const op = useSharedValue(0);
  const sc = useSharedValue(0.88);

  useEffect(() => {
    if (!isActive) {
      cancelAnimation(op);
      cancelAnimation(sc);
      op.value = 0;
      sc.value = 0.88;
      return;
    }
    op.value = withTiming(1, { duration: 480, easing: Easing.out(Easing.quad) });
    sc.value = withSpring(1, { damping: 18, stiffness: 140 });
  }, [isActive]);

  // Figma card dimensions (reference scale)
  const CW = 252.18;
  const CH = 151.63;
  const CR = 17.11;
  const VSTEP = 43.06; // vertical offset between card tops (394.61-351.55 = 351.55-308.49)

  // Approximate visual bounds after isometric shear:
  //   visual width  ≈ 351px  (card W * 0.87 + card H * 0.87 ≈ 351)
  //   visual height ≈ 290px  (3 cards stacked with shear)
  const VISUAL_W = 351;
  const VISUAL_H = 290;
  const layoutScale = clamp(
    Math.min((slideW * 0.88) / VISUAL_W, (slideH * 0.65) / VISUAL_H),
    0.55,
    1.2,
  );

  // Combine entrance animation + layout scale into one transform
  const animStyle = useAnimatedStyle(() => ({
    opacity: op.value,
    transform: [{ scale: sc.value * layoutScale }],
  }));

  // The container is exactly wide/tall enough to hold all 3 cards (pre-transform coords).
  // Flex centering puts its center at (slideW/2, slideH/2).
  // Average visual center of the 3 cards ≈ container center — layout is balanced.
  const containerH = CH + VSTEP * 2;

  // Shared base style for each card (absolute within container, with isometric matrix)
  const isoTransform = [{ matrix: ISO_MATRIX_VALS }] as any;

  const cardBase = {
    position: "absolute" as const,
    width: CW,
    height: CH,
    borderRadius: CR,
    overflow: "hidden" as const,
    transform: isoTransform,
  };

  const textWhite = "rgba(255,255,255,0.95)" as const;
  const textDark  = "#344054" as const;

  return (
    <View style={{ width: slideW, height: slideH, alignItems: "center", justifyContent: "center" }}>
      <Animated.View style={[animStyle, { width: CW, height: containerH }]}>

        {/* ── Card 3 — back, glass ── */}
        <View style={[cardBase, {
          top: 0, left: 0,
          backgroundColor: "rgba(228, 218, 255, 0.32)",
          borderWidth: 1,
          borderColor: "rgba(180, 160, 240, 0.35)",
          shadowColor: "#4B2EC0",
          shadowOffset: { width: 6.85, height: 8.56 },
          shadowOpacity: 0.06,
          shadowRadius: 13.7,
          elevation: 2,
        }]}>
          <Text style={{
            position: "absolute", right: 14, top: 14,
            fontSize: 9, fontFamily: "Manrope_700Bold",
            color: "rgba(255,255,255,0.5)", letterSpacing: 0.5,
          }}>PAYVORA</Text>
        </View>

        {/* ── Card 2 — middle, black ── */}
        <View style={[cardBase, {
          top: VSTEP, left: 0,
          backgroundColor: "#0A0A0A",
          shadowColor: "#000",
          shadowOffset: { width: 6.85, height: 8.56 },
          shadowOpacity: 0.28,
          shadowRadius: 13.7,
          elevation: 6,
        }]}>
          {/* Brand — top-right */}
          <Text style={{
            position: "absolute", left: 116, top: 14,
            fontSize: 10, fontFamily: "Manrope_700Bold",
            color: textWhite, letterSpacing: 0.3,
          }}>PAYVORA</Text>

          {/* Mastercard badge */}
          <View style={{
            position: "absolute", right: 10, bottom: 10,
            backgroundColor: "rgba(255,255,255,0.12)", borderRadius: 4, padding: 3,
          }}>
            <CardMCIcon colored />
          </View>
        </View>

        {/* ── Card 1 — front, glass with card details ── */}
        <View style={[cardBase, {
          top: VSTEP * 2, left: 0,
          backgroundColor: "rgba(220, 210, 255, 0.45)",
          borderWidth: 1,
          borderColor: "rgba(180, 160, 240, 0.5)",
          shadowColor: "#4B2EC0",
          shadowOffset: { width: 6.85, height: 8.56 },
          shadowOpacity: 0.12,
          shadowRadius: 13.7,
          elevation: 10,
        }]}>
          {/* Brand — Figma: left:116.6, top:17.11 */}
          <Text style={{
            position: "absolute", left: 116, top: 14,
            fontSize: 10, fontFamily: "Manrope_700Bold",
            color: textWhite, letterSpacing: 0.5,
          }}>PAYVORA</Text>

          {/* Cardholder — Figma: left:36.19, top:61.6 */}
          <Text style={{
            position: "absolute", left: 14, top: 50,
            fontSize: 8, fontFamily: "Manrope_600SemiBold",
            color: "rgba(255,255,255,0.75)", letterSpacing: 0.8,
            textTransform: "uppercase",
          }}>JOHN DOE</Text>

          {/* Card number — Figma: left:14.07, top:71.87, letterSpacing:0.15em */}
          <Text style={{
            position: "absolute", left: 14, top: 63,
            fontSize: 10, fontFamily: "Manrope_600SemiBold",
            color: textWhite, letterSpacing: 2,
          }}>{"•••• •••• •••• 4521"}</Text>

          {/* Expiry — Figma: left:150.93, top:127.85 */}
          <Text style={{
            position: "absolute", left: 150, top: 125,
            fontSize: 8, fontFamily: "Manrope_600SemiBold",
            color: "rgba(255,255,255,0.85)",
          }}>12/28</Text>

          {/* Mastercard badge — semi-transparent bg */}
          <View style={{
            position: "absolute", right: 10, bottom: 10,
            backgroundColor: "rgba(255,255,255,0.15)", borderRadius: 4, padding: 3,
          }}>
            <CardMCIcon colored={false} />
          </View>
        </View>

      </Animated.View>
    </View>
  );
}

// ── Main screen ───────────────────────────────────────────────────────────────
export default function OnboardingScreen() {
  const router  = useRouter();
  const insets  = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const topInset    = Platform.OS === "web" ? 0 : insets.top;
  const bottomInset = Platform.OS === "web" ? 0 : insets.bottom;

  const bottomSectionH   = DOTS_H + TEXT_H + BTNS_H + 40 + bottomInset;
  const slideAreaH       = Math.max(height - topInset - HEADER_H - bottomSectionH, 160);
  const illustrationSize = clamp(Math.min(slideAreaH * 1.0, width * 0.98), 240, 700);
  const contentMaxW      = Math.min(width, 500);
  const hPad             = clamp(width * 0.06, 16, 28);
  const btnWidth         = contentMaxW - hPad * 2;
  const titleSize        = clamp(width * 0.064, 20, 28);
  const logoSize         = clamp(width * 0.056, 18, 24);

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index !== null) {
        setActiveIndex(viewableItems[0].index);
      }
    },
  ).current;

  const activeSlide = SLIDES[activeIndex];

  return (
    <View style={[styles.root, { backgroundColor: activeSlide.bgColor }]}>

      {/* Header — transparent so slide bg bleeds through under status bar */}
      <View style={[styles.header, { height: HEADER_H + topInset, paddingTop: topInset, backgroundColor: activeSlide.bgColor }]}>
        <Text style={[styles.logo, { fontSize: logoSize }]}>AZA.</Text>
      </View>

      {/* Slide carousel — scroll drives the parallax depth on image slides */}
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        bounces={false}
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
        style={{ height: slideAreaH }}
        getItemLayout={(_, index) => ({ length: width, offset: width * index, index })}
        renderItem={({ item, index }) => {
          const isActive = index === activeIndex;
          return (
            <View style={{ width, height: slideAreaH, backgroundColor: item.bgColor }}>
              {item.type === "animated-wallet" && (
                Platform.OS === "web" ? (
                  <LottieWalletSlide slideW={width} slideH={slideAreaH} />
                ) : (
                  <AnimatedWalletSlide
                    illustrationSize={illustrationSize}
                    slideW={width}
                    slideH={slideAreaH}
                    isActive={isActive}
                  />
                )
              )}
              {item.type === "giftcard" && (
                <GiftCardSlide slideW={width} slideH={slideAreaH} isActive={isActive} />
              )}
              {item.type === "image" && (
                <ImageSlide
                  illustrationSize={illustrationSize}
                  slideW={width}
                  slideH={slideAreaH}
                  isActive={isActive}
                  parallaxFactor={index - activeIndex}
                />
              )}
              {item.type === "chatgpt-portfolio" && (
                <ImageSlideStatic
                  source={onboardPortfolio}
                  slideW={width}
                  slideH={slideAreaH}
                  isActive={isActive}
                  parallaxFactor={index - activeIndex}
                />
              )}
              {item.type === "virtual-card" && (
                <VirtualCardSlide
                  slideW={width}
                  slideH={slideAreaH}
                  isActive={isActive}
                />
              )}
              {item.type === "chatgpt-esim" && (
                <ImageSlideStatic
                  source={onboardEsim}
                  slideW={width}
                  slideH={slideAreaH}
                  isActive={isActive}
                  parallaxFactor={index - activeIndex}
                />
              )}
            </View>
          );
        }}
      />

      {/* Bottom section */}
      <View
        style={[
          styles.bottom,
          {
            paddingBottom: bottomInset + 20,
            paddingHorizontal: hPad,
            alignSelf: "center",
            width: contentMaxW,
          },
        ]}
      >
        {/* Dots */}
        <View style={[styles.dots, { height: DOTS_H }]}>
          {SLIDES.map((_, i) => (
            <View
              key={i}
              style={[styles.dot, i === activeIndex ? styles.dotActive : styles.dotInactive]}
            />
          ))}
        </View>

        {/* Text — remounts on slide change, triggering slide-up entering animation */}
        <Animated.View
          key={activeIndex}
          entering={FadeInUp.duration(380).springify().damping(22).stiffness(200)}
          style={[styles.textBlock, { minHeight: TEXT_H }]}
        >
          <Text
            style={[styles.title, { fontSize: titleSize, lineHeight: titleSize * 1.2 }]}
            numberOfLines={2}
            adjustsFontSizeToFit
          >
            {activeSlide.title}
          </Text>
          <Text
            style={styles.subtitle}
            numberOfLines={2}
          >
            {activeSlide.subtitle}
          </Text>
        </Animated.View>

        {/* Buttons — with press-scale feedback */}
        <View style={[styles.buttons, { height: BTNS_H }]}>
          <ScaleBtn
            style={[styles.btnLogin, { width: btnWidth }]}
            textStyle={styles.btnLoginText}
            label="Login"
            onPress={() => router.push("/(auth)/login")}
          />
          <ScaleBtn
            style={[styles.btnSignUp, { width: btnWidth }]}
            textStyle={styles.btnSignUpText}
            label="Sign Up"
            onPress={() => router.push("/(auth)/register")}
          />
        </View>
      </View>
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root:          { flex: 1, backgroundColor: "#fff" },
  header:        { alignItems: "center", justifyContent: "center" },
  logo:          { fontFamily: "Manrope_700Bold", letterSpacing: 1.5, color: "#0b0a0a" },
  bottom:        { backgroundColor: "#fff" },
  dots:          { flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 8, marginBottom: 4 },
  dot:           { width: 8, height: 8, borderRadius: 2 },
  dotActive:     { backgroundColor: "transparent", borderWidth: 1.5, borderColor: "#0b0a0a" },
  dotInactive:   { backgroundColor: "#d0d3d8" },
  textBlock:     { alignItems: "center", justifyContent: "center", gap: 6, paddingVertical: 4 },
  title:         { fontFamily: "Manrope_700Bold", color: "#0b0a0a", textAlign: "center", letterSpacing: -0.3 },
  subtitle:      { fontFamily: "Manrope_400Regular", color: "#8A8F96", textAlign: "center", fontSize: 14, lineHeight: 21 },
  buttons:       { alignItems: "center", justifyContent: "center", gap: 12, marginTop: 8 },
  btnLogin:      { height: 50, backgroundColor: "#000", borderRadius: 4, alignItems: "center", justifyContent: "center" },
  btnLoginText:  { color: "#fff", fontSize: 15, fontFamily: "Manrope_700Bold", letterSpacing: 0.3 },
  btnSignUp:     { height: 50, borderRadius: 4, borderWidth: 1, borderColor: "#000", backgroundColor: "transparent", alignItems: "center", justifyContent: "center" },
  btnSignUpText: { color: "#000", fontSize: 15, fontFamily: "Manrope_700Bold", letterSpacing: 0.3 },
});
