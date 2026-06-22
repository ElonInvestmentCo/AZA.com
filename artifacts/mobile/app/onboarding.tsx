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
import { useSafeAreaInsets } from "react-native-safe-area-context";

// ── Assets ────────────────────────────────────────────────────────────────────
const slide1Img       = require("@/assets/images/slide1.png");
const slide3Img       = require("@/assets/images/slide3.png");
const giftCardImg     = require("@/assets/images/gift-card.png");
const giftCardVisaImg = require("@/assets/images/gift-card-visa.png");
const manImg          = require("@/assets/images/man-illustration.png");
const onboardPortfolio = require("@/assets/images/onboard-portfolio.png");
const onboardCard      = require("@/assets/images/onboard-card.png");
const onboardEsim      = require("@/assets/images/onboard-esim.png");

Asset.loadAsync([slide1Img, slide3Img, giftCardImg, giftCardVisaImg, manImg, onboardPortfolio, onboardCard, onboardEsim]);

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
  type: "animated-wallet" | "giftcard" | "image" | "chatgpt-portfolio" | "chatgpt-card" | "chatgpt-esim";
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
    type: "chatgpt-card",
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
  const blackCardW    = clamp(slideW * 0.90, 280, 420);
  const blackCardH    = blackCardW / 1.586;
  const blackCardLeft = (slideW - blackCardW) / 2;
  const blackCardTop  = (slideH - blackCardH) / 2;

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
            backgroundColor: "#0F0F0F",
            borderRadius: 22,
            overflow: "hidden",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.30,
            shadowRadius: 24,
            elevation: 14,
          },
          cardStyle,
        ]}
      >
        <Image
          source={giftCardVisaImg}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: blackCardW,
            height: blackCardH,
          }}
          contentFit="fill"
          cachePolicy="memory-disk"
          priority="high"
        />
      </Animated.View>
    </View>
  );
}

// ── Slide 3: Illustration — fade + spring in ──────────────────────────────────
function ImageSlide({
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

  const animStyle = useAnimatedStyle(() => ({
    opacity: op.value,
    transform: [{ scale: sc.value }],
  }));

  return (
    <View style={{ width: slideW, height: slideH, alignItems: "center", justifyContent: "center" }}>
      <Animated.View style={animStyle}>
        <Image
          source={slide3Img}
          style={{ width: illustrationSize, height: illustrationSize }}
          contentFit="contain"
          cachePolicy="memory-disk"
          priority="high"
        />
      </Animated.View>
    </View>
  );
}

// ── Slide N: Static image (unmodified) — fade + spring in ─────────────────────
function ImageSlideStatic({
  source,
  illustrationSize,
  slideW,
  slideH,
  isActive,
}: {
  source: number;
  illustrationSize: number;
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

  const animStyle = useAnimatedStyle(() => ({
    opacity: op.value,
    transform: [{ scale: sc.value }],
  }));

  return (
    <View style={{ width: slideW, height: slideH, alignItems: "center", justifyContent: "center" }}>
      <Animated.View style={animStyle}>
        <Image
          source={source}
          style={{ width: illustrationSize, height: illustrationSize }}
          contentFit="contain"
          cachePolicy="memory-disk"
          priority="high"
        />
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
  const illustrationSize = clamp(Math.min(slideAreaH * 0.96, width * 0.92), 220, 500);
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
    <View style={[styles.root, { paddingTop: topInset }]}>

      {/* Header */}
      <View style={[styles.header, { height: HEADER_H }]}>
        <Text style={[styles.logo, { fontSize: logoSize }]}>AZA.</Text>
      </View>

      {/* Slide carousel */}
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
                <AnimatedWalletSlide
                  illustrationSize={illustrationSize}
                  slideW={width}
                  slideH={slideAreaH}
                  isActive={isActive}
                />
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
                />
              )}
              {item.type === "chatgpt-portfolio" && (
                <ImageSlideStatic
                  source={onboardPortfolio}
                  illustrationSize={illustrationSize}
                  slideW={width}
                  slideH={slideAreaH}
                  isActive={isActive}
                />
              )}
              {item.type === "chatgpt-card" && (
                <ImageSlideStatic
                  source={onboardCard}
                  illustrationSize={illustrationSize}
                  slideW={width}
                  slideH={slideAreaH}
                  isActive={isActive}
                />
              )}
              {item.type === "chatgpt-esim" && (
                <ImageSlideStatic
                  source={onboardEsim}
                  illustrationSize={illustrationSize}
                  slideW={width}
                  slideH={slideAreaH}
                  isActive={isActive}
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
            style={[styles.subtitle, { fontSize: 16, lineHeight: 24 }]}
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
  header:        { alignItems: "center", justifyContent: "center", backgroundColor: "#fff" },
  logo:          { fontFamily: "Manrope_700Bold", letterSpacing: 1.5, color: "#0b0a0a" },
  bottom:        { backgroundColor: "#fff" },
  dots:          { flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 8, marginBottom: 4 },
  dot:           { width: 8, height: 8, borderRadius: 2 },
  dotActive:     { backgroundColor: "#0b0a0a" },
  dotInactive:   { backgroundColor: "#d0d3d8" },
  textBlock:     { alignItems: "center", justifyContent: "center", gap: 8, paddingVertical: 4 },
  title:         { fontFamily: "Manrope_700Bold", color: "#0b0a0a", textAlign: "center", letterSpacing: -0.3 },
  subtitle:      { fontFamily: "Manrope_400Regular", color: "#616263", textAlign: "center" },
  buttons:       { alignItems: "center", justifyContent: "center", gap: 12, marginTop: 8 },
  btnLogin:      { height: 50, backgroundColor: "#000", borderRadius: 4, alignItems: "center", justifyContent: "center" },
  btnLoginText:  { color: "#fff", fontSize: 15, fontFamily: "Manrope_700Bold", letterSpacing: 0.3 },
  btnSignUp:     { height: 50, borderRadius: 4, borderWidth: 1, borderColor: "#000", backgroundColor: "transparent", alignItems: "center", justifyContent: "center" },
  btnSignUpText: { color: "#000", fontSize: 15, fontFamily: "Manrope_700Bold", letterSpacing: 0.3 },
});
