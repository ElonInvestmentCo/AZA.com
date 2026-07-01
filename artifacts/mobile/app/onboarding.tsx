// @ts-ignore — expo-asset types resolved at runtime via expo's module resolver
import { Asset } from "expo-asset";
import { LinearGradient } from "expo-linear-gradient";
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
const slide1Img        = require("@/assets/images/slide1-payvora.png");
const slide3Img        = require("@/assets/images/slide3.png");
const onboardPortfolio = require("@/assets/images/onboard-portfolio.png");
const onboardEsim      = require("@/assets/images/onboard-esim.png");

Asset.loadAsync([slide1Img, slide3Img, onboardPortfolio, onboardEsim]);

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

// ── Slide 1: Payvora phone mockup — fade + spring scale in ───────────────────
function AnimatedWalletSlide({
  slideW,
  slideH,
  isActive,
}: {
  illustrationSize: number;   // kept in signature so call-sites don't change
  slideW: number;
  slideH: number;
  isActive: boolean;
}) {
  // Fill most of the slide area; image is portrait (≈695×850 px natural size)
  // so cap by both width AND height to ensure it never overflows.
  const imgH = Math.min(slideH * 0.92, slideW * 1.15);
  const imgW = imgH * (695 / 850);

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
    op.value = withTiming(1, { duration: 520, easing: Easing.out(Easing.quad) });
    sc.value = withSpring(1, { damping: 16, stiffness: 140 });
  }, [isActive]);

  const animStyle = useAnimatedStyle(() => ({
    opacity: op.value,
    transform: [{ scale: sc.value }],
  }));

  return (
    <View style={{ width: slideW, height: slideH, alignItems: "center", justifyContent: "center" }}>
      <Animated.View style={animStyle}>
        <Image
          source={slide1Img}
          style={{ width: imgW, height: imgH }}
          contentFit="contain"
          cachePolicy="memory-disk"
          priority="high"
        />
      </Animated.View>
    </View>
  );
}

// ── Free Card — rebuilt from Figma CSS specs (237×150 reference) ──────────────
//
// All text content matches the card image exactly:
//   John Smith / amazon wordmark / Amazon Platimun / 4756 •••• •••• 9018 / $3,469.52
//
// Positions: Figma left/top percentages × rendered W/H.
// Gradient angle 216.89° → start{x:0.80,y:0.10} end{x:0.20,y:0.90} in RN.
function FreeCard({ cardW }: { cardW: number }) {
  const W = cardW;
  const H = W * (150 / 237);
  const R = W * (18 / 237);
  const s = W / 237;            // uniform scale factor from 237px reference

  const GRAD_START = { x: 0.80, y: 0.10 };
  const GRAD_END   = { x: 0.20, y: 0.90 };

  const greenTop    = -0.1297 * H;
  const greenHeight = (1 + 0.1297 - 0.3627) * H;
  const blueTop     =  0.3842 * H;
  const blueHeight  = (1 + 0.1512 - 0.3842) * H;

  // Font sizes scaled from the Figma bounding-box heights at 237×150 reference
  const nameFz     = s * 11.2;   // "John Smith"       — Figma top:11.6% bottom:80.95%
  const brandFz    = s *  7.5;   // "Amazon Platimun"  — Figma top:48.57% bottom:46.47%
  const numFz      = s *  8.0;   // card number        — Figma top:63.53%
  const balanceFz  = s * 13.5;   // "$3,469.52"        — Figma top:77.58%
  const amazonFz   = s *  6.5;   // "amazon" wordmark  — Figma top-right cluster

  return (
    <View style={{
      width: W, height: H,
      borderRadius: R,
      overflow: "hidden",
      backgroundColor: "#272A38",
    }}>

      {/* ── Green gradient blob ── */}
      <LinearGradient
        colors={["#009B6E", "#99E200"]}
        start={GRAD_START}
        end={GRAD_END}
        style={{
          position: "absolute",
          left:   0.2398 * W,
          top:    greenTop,
          width:  (1 - 0.2398 - 0.3230) * W,
          height: greenHeight,
          borderRadius: (1 - 0.2398 - 0.3230) * W * 0.5,
        }}
      />

      {/* ── Blue gradient blob ── */}
      <LinearGradient
        colors={["#009DCA", "#0047BB"]}
        start={GRAD_START}
        end={GRAD_END}
        style={{
          position: "absolute",
          left:   0.3391 * W,
          top:    blueTop,
          width:  (1 - 0.3391 - 0.2238) * W,
          height: blueHeight,
          borderRadius: (1 - 0.3391 - 0.2238) * W * 0.5,
        }}
      />

      {/* ── Text content ─────────────────────────────────────────────────── */}

      {/* "John Smith" — top-left, bold white */}
      <Text style={{
        position: "absolute",
        left: 0.0731 * W,
        top:  0.1160 * H,
        color: "#FFFFFF",
        fontSize: nameFz,
        fontFamily: "Manrope_700Bold",
        letterSpacing: 0.1,
      }}>
        John Smith
      </Text>

      {/* "amazon" wordmark — top-right, white */}
      <View style={{ position: "absolute", right: 0.065 * W, top: 0.105 * H }}>
        <Text style={{
          color: "#FFFFFF",
          fontSize: amazonFz,
          fontFamily: "Manrope_700Bold",
          letterSpacing: 0.5,
        }}>
          amazon
        </Text>
        {/* Curved-arrow underline — approximated as a bottom-rounded bar */}
        <View style={{
          height: s * 1.2,
          marginTop: s * 0.8,
          marginHorizontal: s * 1,
          backgroundColor: "#FFFFFF",
          borderRadius: s * 1,
        }} />
      </View>

      {/* "Amazon Platimun" — mid-left, dimmed white */}
      <Text style={{
        position: "absolute",
        left: 0.0721 * W,
        top:  0.4857 * H,
        color: "rgba(255,255,255,0.80)",
        fontSize: brandFz,
        fontFamily: "Manrope_400Regular",
        letterSpacing: 0.1,
      }}>
        Amazon Platimun
      </Text>

      {/* Card number — "4756  ····  ····  9018" */}
      <Text style={{
        position: "absolute",
        left: 0.0731 * W,
        top:  0.6220 * H,
        color: "#FFFFFF",
        fontSize: numFz,
        fontFamily: "Manrope_600SemiBold",
        letterSpacing: s * 0.8,
      }}>
        {"4756  \u2022\u2022\u2022\u2022  \u2022\u2022\u2022\u2022  9018"}
      </Text>

      {/* "$3,469.52" — bottom-left, bold */}
      <Text style={{
        position: "absolute",
        left: 0.0748 * W,
        top:  0.7400 * H,
        color: "#FFFFFF",
        fontSize: balanceFz,
        fontFamily: "Manrope_700Bold",
        letterSpacing: -0.3,
      }}>
        $3,469.52
      </Text>

      {/* ── Mastercard circles (bottom-right) ────────────────────────────── */}
      {/* Left circle — full white */}
      <View style={{
        position: "absolute",
        left:   0.7796 * W,
        top:    0.7311 * H,
        width:  (1 - 0.7796 - 0.1279) * W,
        height: (1 - 0.7311 - 0.1222) * H,
        borderRadius: 999,
        backgroundColor: "#FFFFFF",
      }} />
      {/* Right circle — 50% opacity */}
      <View style={{
        position: "absolute",
        left:   0.8359 * W,
        top:    0.7311 * H,
        width:  (1 - 0.8359 - 0.0716) * W,
        height: (1 - 0.7311 - 0.1222) * H,
        borderRadius: 999,
        backgroundColor: "#FFFFFF",
        opacity: 0.5,
      }} />

    </View>
  );
}

// ── Slide 2: Gift card — Figma card + fade/spring entrance + float loop ────────
function GiftCardSlide({
  slideW,
  slideH,
  isActive,
}: {
  slideW: number;
  slideH: number;
  isActive: boolean;
}) {
  const cardW = clamp(slideW * 0.82, 240, 380);

  const cardOp = useSharedValue(0);
  const cardSc = useSharedValue(0.88);
  // Float: gentle ±7px vertical oscillation
  const floatY = useSharedValue(0);

  const startFloat = useCallback(() => {
    floatY.value = withRepeat(
      withSequence(
        withTiming(-7, { duration: 1600, easing: Easing.inOut(Easing.sin) }),
        withTiming( 7, { duration: 1600, easing: Easing.inOut(Easing.sin) }),
      ),
      -1,   // infinite
      false,
    );
  }, []);

  useEffect(() => {
    if (!isActive) {
      cancelAnimation(cardOp);
      cancelAnimation(cardSc);
      cancelAnimation(floatY);
      cardOp.value = 0;
      cardSc.value = 0.88;
      floatY.value = 0;
      return;
    }
    // Entrance
    cardOp.value = withTiming(1, { duration: 480, easing: Easing.out(Easing.quad) });
    cardSc.value = withSpring(1, { damping: 18, stiffness: 140 },
      (finished) => {
        "worklet";
        if (finished) runOnJS(startFloat)();
      },
    );
  }, [isActive]);

  const cardStyle = useAnimatedStyle(() => ({
    opacity: cardOp.value,
    transform: [
      { scale: cardSc.value },
      { translateY: floatY.value },
    ],
  }));

  return (
    <View style={{ width: slideW, height: slideH, alignItems: "center", justifyContent: "center" }}>
      <Animated.View
        style={[
          {
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 16 },
            shadowOpacity: 0.38,
            shadowRadius: 28,
            elevation: 18,
          },
          cardStyle,
        ]}
      >
        <FreeCard cardW={cardW} />
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

        {/* ── Card 2 — middle, light purple #F4EBFF ── */}
        <View style={[cardBase, {
          top: VSTEP, left: 0,
          backgroundColor: "#F4EBFF",
          shadowColor: "#7B4BD0",
          shadowOffset: { width: 6.85, height: 8.56 },
          shadowOpacity: 0.14,
          shadowRadius: 13.7,
          elevation: 6,
        }]}>
          {/* Figma gradient blobs: Pink/500 0.3, Blue/500 0.3, Success/500 0.3, Orange/500 0.3 */}
          <View style={{ position: "absolute", left: "43.3%", top: 0, right: "6.7%", bottom: "50%",
            backgroundColor: "#EE46BC", opacity: 0.3, borderRadius: 60 }} />
          <View style={{ position: "absolute", left: 0, right: "50%", top: "25%", bottom: "25%",
            backgroundColor: "#2E90FA", opacity: 0.3, borderRadius: 60 }} />
          <View style={{ position: "absolute", left: "43.3%", right: "6.7%", top: "50%", bottom: 0,
            backgroundColor: "#12B76A", opacity: 0.3, borderRadius: 60 }} />
          <View style={{ position: "absolute", left: "86.6%", right: "-36.6%", top: "25%", bottom: "25%",
            backgroundColor: "#FB6514", opacity: 0.3, borderRadius: 60 }} />

          {/* Brand — top-right area (Figma: left:116.6, top:17.11) */}
          <Text style={{
            position: "absolute", left: 116, top: 14,
            fontSize: 10, fontFamily: "Manrope_700Bold",
            color: textDark, letterSpacing: 0.3,
          }}>PAYVORA</Text>

          {/* Mastercard badge — white bg (Figma: payment method icon, bottom-right) */}
          <View style={{
            position: "absolute", right: 10, bottom: 10,
            backgroundColor: "#fff", borderRadius: 4, padding: 3,
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
