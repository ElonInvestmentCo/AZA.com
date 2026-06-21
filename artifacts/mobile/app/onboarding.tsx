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
const slide1Img    = require("@/assets/images/slide1.png");
const slide3Img    = require("@/assets/images/slide3.png");
const giftCardImg  = require("@/assets/images/gift-card.png");
const manImg       = require("@/assets/images/man-illustration.png");

// ── Helpers ──────────────────────────────────────────────────────────────────
function clamp(val: number, min: number, max: number) {
  return Math.min(Math.max(val, min), max);
}

// ── Layout constants ─────────────────────────────────────────────────────────
const HEADER_H = 56;
const DOTS_H   = 28;
const TEXT_H   = 72;
const BTNS_H   = 116; // 2 buttons × 50px + 16px gap

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
    bgColor: "#ece8f8",
  },
  {
    id: "3",
    type: "image",
    title: "Bill payments",
    subtitle: "We Got Your Bills Sorted",
    bgColor: "#ffffff",
  },
];

// ── Slide 1: Animated wallet illustration ───────────────────────────────────
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
  // Man is life-size: taller than the phone illustration so he dominates the scene.
  // He slides in from above and pauses exactly when his hand aligns with the PAY button.
  const manH = illustrationSize * 1.38;
  const manW = manH * 0.72; // preserve aspect ratio of the man illustration

  // The PAY button sits at ~62% down the illustration height.
  // The man's pointing hand tip is at ~50% of his own height.
  // Solve: manTop + manH * 0.50 = illustrationSize * 0.62
  const manTop  = illustrationSize * 0.62 - manH * 0.50;
  const manLeft = -manW * 0.08; // anchor left edge slightly outside the illustration so body stays left

  // Slide starts fully above the slide area; toValue=0 is the resting (hand-aligned) position.
  const startY = -(illustrationSize + Math.abs(manTop) + manH);
  const manY = useRef(new Animated.Value(startY)).current;

  useEffect(() => {
    if (!isActive) return;
    manY.setValue(startY);
    Animated.timing(manY, {
      toValue: 0,
      duration: 1100,
      delay: 200,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: Platform.OS !== "web",
    }).start();
  }, [isActive, illustrationSize]);

  return (
    <View style={{ width: slideW, height: slideH, alignItems: "center", justifyContent: "center" }}>
      {/* Base e-wallet illustration — overflow visible so the life-size man can extend above/below */}
      <View style={{ width: illustrationSize, height: illustrationSize, position: "relative", overflow: "visible" }}>
        <Image
          source={slide1Img}
          style={{ width: illustrationSize, height: illustrationSize }}
          contentFit="contain"
          cachePolicy="memory-disk"
        />
        {/* Animated man overlay — life-size, slides down from top */}
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
          />
        </Animated.View>
      </View>
    </View>
  );
}

// ── Slide 2: Gift card image ─────────────────────────────────────────────────
function GiftCardSlide({
  slideW,
  slideH,
}: {
  slideW: number;
  slideH: number;
}) {
  // Card aspect ratio: 329/210 (landscape) → keep width ~88% of slide
  const cardW = clamp(slideW * 0.88, 240, 380);
  const cardH = cardW * (210 / 329);

  return (
    <View style={{ width: slideW, height: slideH, alignItems: "center", justifyContent: "center" }}>
      <Image
        source={giftCardImg}
        style={{ width: cardW, height: cardH, borderRadius: 12 }}
        contentFit="contain"
        cachePolicy="memory-disk"
      />
    </View>
  );
}

// ── Slide 3: Image illustration ──────────────────────────────────────────────
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
      />
    </View>
  );
}

// ── Main screen ──────────────────────────────────────────────────────────────
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

  const contentMaxW = Math.min(width, 500);
  const hPad        = clamp(width * 0.06, 16, 28);
  const btnWidth    = contentMaxW - hPad * 2;

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

      {/* ── AZA. header ── */}
      <View style={[styles.header, { height: HEADER_H }]}>
        <Text style={[styles.logo, { fontSize: logoSize }]}>AZA.</Text>
      </View>

      {/* ── Slide carousel ── */}
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
                <GiftCardSlide
                  slideW={width}
                  slideH={slideAreaH}
                />
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

      {/* ── Bottom section ── */}
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

// ── Styles ───────────────────────────────────────────────────────────────────
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
