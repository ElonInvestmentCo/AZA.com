import { Asset } from "expo-asset";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewToken,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// ── Assets ───────────────────────────────────────────────────────────────────
const slide1Img       = require("@/assets/images/slide1.png");
const slide3Img       = require("@/assets/images/slide3.png");
const giftCardImg     = require("@/assets/images/gift-card.png");
const giftCardVisaImg = require("@/assets/images/gift-card-visa.png");
const manImg          = require("@/assets/images/man-illustration.png");

// Pre-decode every image the instant this module is imported.
// By the time the first frame paints, images are already in memory → zero flicker.
Asset.loadAsync([slide1Img, slide3Img, giftCardImg, giftCardVisaImg, manImg]);

// ── Helpers ──────────────────────────────────────────────────────────────────
function clamp(val: number, min: number, max: number) {
  return Math.min(Math.max(val, min), max);
}

// ── Layout constants ─────────────────────────────────────────────────────────
const HEADER_H = 56;
const DOTS_H   = 28;
const TEXT_H   = 72;
const BTNS_H   = 116;

// ── Slide definitions ────────────────────────────────────────────────────────
type SlideItem = {
  id: string;
  type: "animated-wallet" | "giftcard" | "image";
  title: string;
  subtitle: string;
  bgColor: string;
};

const SLIDES: SlideItem[] = [
  {
    id: "1",
    type: "animated-wallet",
    title: "Withdraw like a Boss",
    subtitle: "BUY YOUR GIFT CARD ON AZA",
    bgColor: "#ffffff",
  },
  {
    id: "2",
    type: "giftcard",
    title: "Sell your gift card",
    subtitle: "Buy Your Gift Card On Aza",
    bgColor: "#FFD6E0",
  },
  {
    id: "3",
    type: "image",
    title: "Bill payments",
    subtitle: "We Got Your Bills Sorted",
    bgColor: "#ffffff",
  },
];

// ── Slide 1: Animated wallet + man + PAY-button glow ─────────────────────────
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
  // ── Man sizing ──────────────────────────────────────────────────────────────
  const manH = illustrationSize * 1.38;
  const manW = manH * 0.72;

  // Illustration centered in slide
  const illusTop  = (slideH - illustrationSize) / 2;
  const illusLeft = (slideW - illustrationSize) / 2;

  // Man: hand tip at 50% of his height aligns with PAY button at 62% of illustration
  const manTop  = illusTop  + illustrationSize * 0.62 - manH * 0.50;
  const manLeft = illusLeft - manW * 0.08;

  // ── Man slide-in animation ──────────────────────────────────────────────────
  const startY = -(slideH + manH);
  const manY   = useRef(new Animated.Value(startY)).current;

  // ── PAY-button glow animation ───────────────────────────────────────────────
  // PAY button sits at ~62% down and ~61% across the illustration
  const glowSize = illustrationSize * 0.20;
  const glowTop  = illusTop  + illustrationSize * 0.62 - glowSize / 2;
  const glowLeft = illusLeft + illustrationSize * 0.61 - glowSize / 2;

  const glowOpacity = useRef(new Animated.Value(0)).current;
  const glowScale   = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!isActive) {
      // Reset both animations when slide is no longer active
      manY.setValue(startY);
      glowOpacity.setValue(0);
      glowScale.setValue(1);
      return;
    }

    manY.setValue(startY);
    glowOpacity.setValue(0);
    glowScale.setValue(1);

    Animated.timing(manY, {
      toValue: 0,
      duration: 1100,
      delay: 200,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: Platform.OS !== "web",
    }).start(() => {
      // Fire 3 pulse ripples the instant the hand lands
      Animated.loop(
        Animated.sequence([
          Animated.parallel([
            Animated.timing(glowOpacity, {
              toValue: 0.75,
              duration: 120,
              easing: Easing.out(Easing.quad),
              useNativeDriver: Platform.OS !== "web",
            }),
            Animated.timing(glowScale, {
              toValue: 1.0,
              duration: 120,
              useNativeDriver: Platform.OS !== "web",
            }),
          ]),
          Animated.parallel([
            Animated.timing(glowOpacity, {
              toValue: 0,
              duration: 550,
              easing: Easing.in(Easing.quad),
              useNativeDriver: Platform.OS !== "web",
            }),
            Animated.timing(glowScale, {
              toValue: 2.0,
              duration: 550,
              easing: Easing.out(Easing.quad),
              useNativeDriver: Platform.OS !== "web",
            }),
          ]),
          Animated.delay(120),
        ]),
        { iterations: 3 }
      ).start();
    });
  }, [isActive, illustrationSize]);

  return (
    <View style={{ width: slideW, height: slideH }}>
      {/* Phone / e-wallet illustration */}
      <Image
        source={slide1Img}
        style={{
          position: "absolute",
          top: illusTop,
          left: illusLeft,
          width: illustrationSize,
          height: illustrationSize,
        }}
        contentFit="contain"
        cachePolicy="memory-disk"
        priority="high"
      />

      {/* PAY-button glow ripple — renders behind the man */}
      <Animated.View
        style={{
          position: "absolute",
          top: glowTop,
          left: glowLeft,
          width: glowSize,
          height: glowSize,
          borderRadius: glowSize / 2,
          backgroundColor: "#FFD700",
          opacity: glowOpacity,
          transform: [{ scale: glowScale }],
        }}
      />

      {/* Life-size man — slides in from top */}
      <Animated.View
        style={{
          position: "absolute",
          top: manTop,
          left: manLeft,
          width: manW,
          height: manH,
          transform: [{ translateY: manY }],
        }}
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

// ── Slide 2: Gift card ────────────────────────────────────────────────────────
function GiftCardSlide({ slideW, slideH }: { slideW: number; slideH: number }) {
  // ── Black card (credit-card ratio 1.586 : 1) ─────────────────────────────
  const blackCardW    = clamp(slideW * 0.76, 220, 340);
  const blackCardH    = blackCardW / 1.586;
  const blackCardLeft = (slideW - blackCardW) / 2;
  // Card sits in the upper-centre, leaving the lower third for the man
  const blackCardTop  = slideH * 0.08;

  // ── Man illustration — fully visible, standing in front of the card ───────
  const manH    = clamp(slideH * 0.78, 200, 340);
  const manW    = manH * 0.72;
  // Bottom-anchor the man so he stands on the floor of the slide
  const manTop  = slideH - manH;
  // Align him so his pointing arm reaches across the card
  const manLeft = -manW * 0.04;

  return (
    // Flat absolute layout — no overflow clipping needed
    <View style={{ width: slideW, height: slideH }}>

      {/* Plain black card container */}
      <View
        style={{
          position: "absolute",
          top: blackCardTop,
          left: blackCardLeft,
          width: blackCardW,
          height: blackCardH,
          backgroundColor: "#0F0F0F",
          borderRadius: 22,
          overflow: "hidden",
          // Subtle shadow for depth
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.45,
          shadowRadius: 24,
          elevation: 14,
        }}
      >
        {/* Gift card image fills the black card */}
        <Image
          source={giftCardVisaImg}
          style={{ width: blackCardW, height: blackCardH }}
          contentFit="cover"
          cachePolicy="memory-disk"
          priority="high"
        />
      </View>

      {/* Man illustration — rendered last so it sits in front of the card */}
      <Image
        source={manImg}
        style={{
          position: "absolute",
          top: manTop,
          left: manLeft,
          width: manW,
          height: manH,
        }}
        contentFit="contain"
        cachePolicy="memory-disk"
        priority="high"
      />
    </View>
  );
}

// ── Slide 3: Image illustration ───────────────────────────────────────────────
function ImageSlide({
  illustrationSize,
  slideW,
  slideH,
}: {
  illustrationSize: number;
  slideW: number;
  slideH: number;
}) {
  return (
    <View style={{ width: slideW, height: slideH, alignItems: "center", justifyContent: "center" }}>
      <Image
        source={slide3Img}
        style={{ width: illustrationSize, height: illustrationSize }}
        contentFit="contain"
        cachePolicy="memory-disk"
        priority="high"
      />
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

  const bottomSectionH = DOTS_H + TEXT_H + BTNS_H + 40 + bottomInset;
  const slideAreaH     = Math.max(height - topInset - HEADER_H - bottomSectionH, 160);
  const illustrationSize = clamp(Math.min(slideAreaH * 0.92, width * 0.9), 180, 420);

  const contentMaxW  = Math.min(width, 500);
  const hPad         = clamp(width * 0.06, 16, 28);
  const btnWidth     = contentMaxW - hPad * 2;
  const titleSize    = clamp(width * 0.064, 20, 28);
  const subtitleSize = clamp(width * 0.034, 11, 14);
  const logoSize     = clamp(width * 0.056, 18, 24);

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index !== null) {
        setActiveIndex(viewableItems[0].index);
      }
    }
  ).current;

  const activeSlide = SLIDES[activeIndex];

  return (
    <View style={[styles.root, { paddingTop: topInset }]}>

      {/* AZA. header */}
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
                <GiftCardSlide slideW={width} slideH={slideAreaH} />
              )}
              {item.type === "image" && (
                <ImageSlide
                  illustrationSize={illustrationSize}
                  slideW={width}
                  slideH={slideAreaH}
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

        {/* Text */}
        <View style={[styles.textBlock, { minHeight: TEXT_H }]}>
          <Text
            style={[styles.title, { fontSize: titleSize, lineHeight: titleSize * 1.2 }]}
            numberOfLines={2}
            adjustsFontSizeToFit
          >
            {activeSlide.title}
          </Text>
          <Text
            style={[styles.subtitle, { fontSize: subtitleSize, lineHeight: subtitleSize * 1.5 }]}
            numberOfLines={2}
          >
            {activeSlide.subtitle}
          </Text>
        </View>

        {/* Buttons */}
        <View style={[styles.buttons, { height: BTNS_H }]}>
          <TouchableOpacity
            style={[styles.btnLogin, { width: btnWidth }]}
            onPress={() => router.push("/(auth)/login")}
            activeOpacity={0.82}
          >
            <Text style={styles.btnLoginText}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.btnSignUp, { width: btnWidth }]}
            onPress={() => router.push("/(auth)/register")}
            activeOpacity={0.82}
          >
            <Text style={styles.btnSignUpText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  logo: {
    fontFamily: "Manrope_700Bold",
    letterSpacing: 1.5,
    color: "#0b0a0a",
  },
  bottom: {
    backgroundColor: "#fff",
  },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 2,
  },
  dotActive: {
    backgroundColor: "#0b0a0a",
    borderWidth: 0,
  },
  dotInactive: {
    backgroundColor: "#d0d3d8",
  },
  textBlock: {
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 4,
  },
  title: {
    fontFamily: "Manrope_700Bold",
    color: "#0b0a0a",
    textAlign: "center",
    letterSpacing: -0.3,
  },
  subtitle: {
    fontFamily: "Manrope_400Regular",
    color: "#616263",
    textAlign: "center",
  },
  buttons: {
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    marginTop: 8,
  },
  btnLogin: {
    height: 50,
    backgroundColor: "#000",
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  btnLoginText: {
    color: "#fff",
    fontSize: 15,
    fontFamily: "Manrope_700Bold",
    letterSpacing: 0.3,
  },
  btnSignUp: {
    height: 50,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#000",
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  btnSignUpText: {
    color: "#000",
    fontSize: 15,
    fontFamily: "Manrope_700Bold",
    letterSpacing: 0.3,
  },
});
