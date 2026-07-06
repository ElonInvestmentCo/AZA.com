// @ts-ignore — expo-asset types resolved at runtime via expo's module resolver
import { Asset } from "expo-asset";
import { PayvoraWordmark } from "@/components/PayvoraWordmark";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
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
  Extrapolation,
  FadeInUp,
  interpolate,
  runOnJS,
  useAnimatedScrollHandler,
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
const slide2Img        = require("@/assets/images/slide2-giftcards.png");
const slide3Img        = require("@/assets/images/slide3-bills.png");
const slide5Img        = require("@/assets/images/slide5-virtualcard.png");
const onboardPortfolio = require("@/assets/images/slide4-portfolio.png");
const onboardEsim      = require("@/assets/images/onboard-esim.png");

Asset.loadAsync([slide1Img, slide2Img, slide3Img, slide5Img, onboardPortfolio, onboardEsim]);

// ── Helpers ───────────────────────────────────────────────────────────────────
function clamp(val: number, min: number, max: number) {
  return Math.min(Math.max(val, min), max);
}

// ── Layout constants ──────────────────────────────────────────────────────────
const HEADER_H  = 44;   // tighter — illustration starts closer to logo
const DOTS_H    = 28;
const TEXT_H    = 72;
const BTNS_H    = 116;
// Proportion of slideAreaH the hero image fills — same on every slide
const HERO_FILL = 0.94;

// ── Slide definitions ─────────────────────────────────────────────────────────
type SlideItem = {
  id: string;
  type: "animated-wallet" | "giftcard" | "image" | "chatgpt-portfolio" | "virtual-card" | "chatgpt-esim";
  title: string;
  subtitle: string;
  bgColor: string;
};

type SlideGlow = {
  color: string;
  opacity: number;
};

const SLIDES: (SlideItem & { glow: SlideGlow })[] = [
  {
    id: "1",
    type: "animated-wallet",
    title: "Withdraw like a Boss",
    subtitle: "Fast, secure withdrawals made simple.",
    bgColor: "#ffffff",
    glow: { color: "#EEF7FF", opacity: 1 },
  },
  {
    id: "2",
    type: "giftcard",
    title: "Sell your gift card",
    subtitle: "Sell smarter. Get paid faster.",
    bgColor: "#ffffff",
    glow: { color: "#FFF6E8", opacity: 1 },
  },
  {
    id: "3",
    type: "image",
    title: "Bill payments",
    subtitle: "Pay your bills seamlessly in one place",
    bgColor: "#ffffff",
    glow: { color: "#EAF8F2", opacity: 1 },
  },
  {
    id: "4",
    type: "chatgpt-portfolio",
    title: "Track Your Portfolio",
    subtitle: "Monitor your crypto assets in real time.",
    bgColor: "#ffffff",
    glow: { color: "#F5F5F7", opacity: 1 },
  },
  {
    id: "5",
    type: "virtual-card",
    title: "Virtual Card",
    subtitle: "Pay anywhere with your PAYVORA virtual card.",
    bgColor: "#ffffff",
    glow: { color: "#F2EFFB", opacity: 1 },
  },
  {
    id: "6",
    type: "chatgpt-esim",
    title: "Global eSIM",
    subtitle: "Stay connected wherever you go.",
    bgColor: "#ffffff",
    glow: { color: "#EAF5FF", opacity: 1 },
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
      <Animated.View style={[animStyle, { width: slideW, height: slideH, alignItems: "center", justifyContent: "center" }]}>
        <Image
          source={slide1Img}
          style={{ width: slideW, height: slideH }}
          contentFit="contain"
          cachePolicy="memory-disk"
          priority="high"
        />
      </Animated.View>
    </View>
  );
}

// ── (FreeCard removed — slide 2 now uses a direct image asset) ────────────────
function FreeCard({ cardW }: { cardW: number }) {  // kept as stub to avoid breaking anything
  return null;
}

// ── Slide 2: Gift card image — fade + spring scale in ─────────────────────────
function GiftCardSlide({
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
    op.value = withTiming(1, { duration: 520, easing: Easing.out(Easing.quad) });
    sc.value = withSpring(1, { damping: 16, stiffness: 140 });
  }, [isActive]);

  const animStyle = useAnimatedStyle(() => ({
    opacity: op.value,
    transform: [{ scale: sc.value }],
  }));

  return (
    <View style={{ width: slideW, height: slideH, alignItems: "center", justifyContent: "center" }}>
      <Animated.View style={[animStyle, { width: slideW, height: slideH, alignItems: "center", justifyContent: "center" }]}>
        <Image
          source={slide2Img}
          style={{ width: slideW, height: slideH }}
          contentFit="contain"
          cachePolicy="memory-disk"
          priority="high"
        />
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
    <View style={{ width: slideW, height: slideH, alignItems: "center", justifyContent: "center" }}>
      <Animated.View style={[animStyle, { width: slideW, height: slideH, alignItems: "center", justifyContent: "center" }]}>
        <Image
          source={slide3Img}
          style={{ width: slideW, height: slideH }}
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
    <View style={{ width: slideW, height: slideH, alignItems: "center", justifyContent: "center" }}>
      <Animated.View style={[animStyle, { width: slideW, height: slideH, alignItems: "center", justifyContent: "center" }]}>
        <Image
          source={source}
          style={{ width: slideW, height: slideH }}
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

// ── Slide 5: Virtual Card image — fade + spring scale in ──────────────────────
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
    op.value = withTiming(1, { duration: 520, easing: Easing.out(Easing.quad) });
    sc.value = withSpring(1, { damping: 16, stiffness: 140 });
  }, [isActive]);

  const animStyle = useAnimatedStyle(() => ({
    opacity: op.value,
    transform: [{ scale: sc.value }],
  }));

  return (
    <View style={{ width: slideW, height: slideH, alignItems: "center", justifyContent: "center" }}>
      <Animated.View style={[animStyle, { width: slideW, height: slideH, alignItems: "center", justifyContent: "center" }]}>
        <Image
          source={slide5Img}
          style={{ width: slideW, height: slideH }}
          contentFit="contain"
          cachePolicy="memory-disk"
          priority="high"
        />
      </Animated.View>
    </View>
  );
}

// ── Page dot indicator ────────────────────────────────────────────────────────
const INACTIVE_DOT_COLOR = "#d0d3d8";
const ACTIVE_BORDER_COLOR = "#0b0a0a";

function PageDot({
  index,
  scrollX,
  pageWidth,
}: {
  index: number;
  scrollX: SharedValue<number>;
  pageWidth: number;
}) {
  const animStyle = useAnimatedStyle(() => {
    const borderOpacity = interpolate(
      scrollX.value,
      [(index - 1) * pageWidth, index * pageWidth, (index + 1) * pageWidth],
      [0, 1, 0],
      Extrapolation.CLAMP,
    );
    return {
      borderWidth: 1.5,
      borderColor: `rgba(11, 10, 10, ${borderOpacity})`,
      backgroundColor: INACTIVE_DOT_COLOR,
    };
  });
  return <Animated.View style={[styles.dot, animStyle]} />;
}

// ── Main screen ───────────────────────────────────────────────────────────────
export default function OnboardingScreen() {
  const router  = useRouter();
  const insets  = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<any>(null);
  const scrollX = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollX.value = event.contentOffset.x;
  });

  const topInset    = Platform.OS === "web" ? 0 : insets.top;
  const bottomInset = Platform.OS === "web" ? 0 : insets.bottom;

  const bottomSectionH   = DOTS_H + TEXT_H + BTNS_H + 16 + bottomInset;
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
    <View style={[styles.root, { backgroundColor: "#ffffff" }]}>

      {/* Header — always white so glow never bleeds into logo area */}
      <View style={[styles.header, { height: HEADER_H + topInset, paddingTop: topInset, backgroundColor: "#ffffff" }]}>
        <PayvoraWordmark width={156} height={40} />
      </View>

      {/* Slide carousel — scroll drives the parallax depth on image slides */}
      <Animated.FlatList
        ref={flatListRef as any}
        data={SLIDES}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        bounces={false}
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={scrollHandler}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
        style={{ height: slideAreaH }}
        getItemLayout={(_, index) => ({ length: width, offset: width * index, index })}
        renderItem={({ item, index }) => {
          const isActive = index === activeIndex;
          const glowSize = Math.min(width, slideAreaH) * 1.1;
          return (
            <View style={{ width, height: slideAreaH, backgroundColor: "#ffffff", overflow: "hidden" }}>
              {/* Ambient glow — layered circles fading outward, confined to illustration area */}
              <View style={{
                position: "absolute",
                top: "50%", left: "50%",
                width: glowSize, height: glowSize,
                marginTop: -(glowSize / 2), marginLeft: -(glowSize / 2),
                borderRadius: glowSize / 2,
                backgroundColor: item.glow.color,
                opacity: 0.85,
              }} pointerEvents="none" />
              <View style={{
                position: "absolute",
                top: "50%", left: "50%",
                width: glowSize * 1.22, height: glowSize * 1.22,
                marginTop: -(glowSize * 1.22 / 2), marginLeft: -(glowSize * 1.22 / 2),
                borderRadius: glowSize * 1.22 / 2,
                backgroundColor: item.glow.color,
                opacity: 0.45,
              }} pointerEvents="none" />
              <View style={{
                position: "absolute",
                top: "50%", left: "50%",
                width: glowSize * 1.5, height: glowSize * 1.5,
                marginTop: -(glowSize * 1.5 / 2), marginLeft: -(glowSize * 1.5 / 2),
                borderRadius: glowSize * 1.5 / 2,
                backgroundColor: item.glow.color,
                opacity: 0.18,
              }} pointerEvents="none" />
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
            <PageDot key={i} index={i} scrollX={scrollX} pageWidth={width} />
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
  textBlock:     { alignItems: "center", justifyContent: "center", gap: 6, paddingVertical: 4 },
  title:         { fontFamily: "Manrope_700Bold", color: "#0b0a0a", textAlign: "center", letterSpacing: -0.3 },
  subtitle:      { fontFamily: "Manrope_400Regular", color: "#8A8F96", textAlign: "center", fontSize: 14, lineHeight: 21 },
  buttons:       { alignItems: "center", justifyContent: "center", gap: 12, marginTop: 8 },
  btnLogin:      { height: 50, backgroundColor: "#000", borderRadius: 4, alignItems: "center", justifyContent: "center" },
  btnLoginText:  { color: "#fff", fontSize: 15, fontFamily: "Manrope_700Bold", letterSpacing: 0.3 },
  btnSignUp:     { height: 50, borderRadius: 4, borderWidth: 1, borderColor: "#000", backgroundColor: "transparent", alignItems: "center", justifyContent: "center" },
  btnSignUpText: { color: "#000", fontSize: 15, fontFamily: "Manrope_700Bold", letterSpacing: 0.3 },
});
