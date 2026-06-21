import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
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

const eWalletImg = require("@/assets/images/e-wallet.png");

// ── Gift Card Illustration ───────────────────────────────────────────────────
// Pixel-perfect recreation of the Figma slide-2 card element.
// Base canvas: 329 × 210. We scale uniformly to fit available width.
function GiftCardIllustration({ scale }: { scale: number }) {
  const W = 329 * scale;
  const H = 210 * scale;
  const r = (px: number) => Math.round(px * scale);

  // Simple QR-like grid drawn with tiny black squares on white bg
  const qrCellSize = r(8);
  const qrPatternSize = r(78);
  const qrCells: JSX.Element[] = [];
  // Corner squares + random inner dots to read visually as a QR code
  const pattern = [
    [0,0],[0,1],[0,2],[0,3],[0,4],[0,5],[0,6],
    [1,0],[1,6],
    [2,0],[2,2],[2,3],[2,4],[2,6],
    [3,0],[3,2],[3,3],[3,4],[3,6],
    [4,0],[4,2],[4,3],[4,4],[4,6],
    [5,0],[5,6],
    [6,0],[6,1],[6,2],[6,3],[6,4],[6,5],[6,6],
    // inner data
    [2,8],[3,9],[4,8],[5,10],[8,2],[9,3],[8,4],[10,5],
    [8,8],[8,9],[9,8],[9,10],[10,9],[10,10],
  ];
  pattern.forEach(([row, col], idx) => {
    qrCells.push(
      <View
        key={idx}
        style={{
          position: "absolute",
          top: row * qrCellSize,
          left: col * qrCellSize,
          width: qrCellSize,
          height: qrCellSize,
          backgroundColor: "#000",
        }}
      />
    );
  });

  return (
    <View
      style={{
        width: W,
        height: H,
        backgroundColor: "#000",
        borderRadius: r(11.32),
        overflow: "hidden",
      }}
    >
      {/* Top-left labels */}
      <Text
        style={{
          position: "absolute",
          left: r(17),
          top: r(11),
          color: "#fff",
          fontFamily: "Manrope_700Bold",
          fontSize: r(13),
          lineHeight: r(24),
        }}
      >
        Gift card
      </Text>
      <Text
        style={{
          position: "absolute",
          left: r(16),
          top: r(33),
          color: "#fff",
          fontFamily: "Manrope_400Regular",
          fontSize: r(12),
          lineHeight: r(17),
          opacity: 0.8,
        }}
      >
        Location
      </Text>

      {/* Top-right ID */}
      <Text
        style={{
          position: "absolute",
          right: r(18),
          top: r(33),
          color: "#fff",
          fontFamily: "Manrope_400Regular",
          fontSize: r(12),
          lineHeight: r(17),
          opacity: 0.8,
        }}
      >
        ID: 12345678
      </Text>

      {/* Divider line */}
      <View
        style={{
          position: "absolute",
          left: r(16),
          right: r(16),
          top: r(58),
          height: StyleSheet.hairlineWidth,
          backgroundColor: "rgba(255,255,255,0.25)",
        }}
      />

      {/* €XX amount — bottom-left */}
      <Text
        style={{
          position: "absolute",
          left: r(15),
          top: r(150),
          color: "#fff",
          fontFamily: "Manrope_700Bold",
          fontSize: r(30),
          lineHeight: r(32),
          opacity: 0.9,
        }}
      >
        €XX
      </Text>

      {/* QR code box */}
      <View
        style={{
          position: "absolute",
          left: r(214),
          top: r(90),
          width: r(90),
          height: r(90),
          backgroundColor: "#fff",
          borderRadius: r(5.66),
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        <View style={{ width: qrPatternSize, height: qrPatternSize, position: "relative" }}>
          {qrCells}
        </View>
      </View>

      {/* Subtle shine overlay */}
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: H * 0.38,
          backgroundColor: "rgba(255,255,255,0.04)",
          borderTopLeftRadius: r(11.32),
          borderTopRightRadius: r(11.32),
        }}
      />
    </View>
  );
}

// ── Slide data ───────────────────────────────────────────────────────────────
type Slide = {
  id: string;
  type: "image" | "giftcard";
  image?: ReturnType<typeof require>;
  title: string;
  subtitle: string;
};

const slides: Slide[] = [
  {
    id: "1",
    type: "image",
    image: eWalletImg,
    title: "Withdraw like a Boss",
    subtitle: "BUY YOUR GIFT CARD ON AZA",
  },
  {
    id: "2",
    type: "giftcard",
    title: "Sell your gift card",
    subtitle: "BUY YOUR GIFT CARD ON AZA",
  },
  {
    id: "3",
    type: "image",
    image: eWalletImg,
    title: "Track Every Transaction",
    subtitle: "FULL HISTORY OF YOUR SALES, ALWAYS IN YOUR POCKET",
  },
];

// ── Helpers ──────────────────────────────────────────────────────────────────
function clamp(val: number, min: number, max: number) {
  return Math.min(Math.max(val, min), max);
}

const HEADER_H = 52;
const DOTS_H   = 24;
const TEXT_H   = 68;
const BTNS_H   = 96;

// ── Screen ───────────────────────────────────────────────────────────────────
export default function OnboardingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const topInset    = Platform.OS === "web" ? 0 : insets.top;
  const bottomInset = Platform.OS === "web" ? 0 : insets.bottom;

  const bottomSectionH = DOTS_H + TEXT_H + BTNS_H + 32 + bottomInset;
  const slideAreaH     = height - topInset - HEADER_H - bottomSectionH;

  const illustrationSize = clamp(Math.min(slideAreaH * 0.88, width * 0.86), 180, 380);

  // Gift card: keep the 329/210 aspect ratio and fit inside the slide area
  const cardMaxW = clamp(width * 0.88, 240, 340);
  const cardScale = cardMaxW / 329;

  const isTablet       = width >= 768;
  const contentMaxWidth = Math.min(width, 500);
  const hPad           = clamp(width * 0.07, 20, 40);
  const btnWidth       = clamp(contentMaxWidth - hPad * 2, 220, 340);

  const titleSize    = clamp(isTablet ? width * 0.038 : width * 0.062, 18, 26);
  const subtitleSize = clamp(width * 0.031, 10.5, 13);
  const logoSize     = clamp(width * 0.054, 17, 23);

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index !== null) {
        setActiveIndex(viewableItems[0].index);
      }
    }
  ).current;

  return (
    <View style={[styles.root, { paddingTop: topInset }]}>

      {/* ── AZA. header ── */}
      <View style={[styles.header, { height: HEADER_H }]}>
        <Text style={[styles.logo, { fontSize: logoSize }]}>AZA.</Text>
      </View>

      {/* ── Illustration carousel ── */}
      <FlatList
        ref={flatListRef}
        data={slides}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        bounces={false}
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
        style={{ height: slideAreaH }}
        getItemLayout={(_, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
        renderItem={({ item }) => (
          <View
            style={{
              width,
              height: slideAreaH,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {item.type === "giftcard" ? (
              <GiftCardIllustration scale={cardScale} />
            ) : (
              <Image
                source={item.image}
                style={{ width: illustrationSize, height: illustrationSize }}
                contentFit="contain"
                transition={180}
                cachePolicy="memory-disk"
              />
            )}
          </View>
        )}
      />

      {/* ── Bottom section ── */}
      <View
        style={[
          styles.bottom,
          {
            paddingBottom: bottomInset + 16,
            paddingHorizontal: hPad,
            alignSelf: "center",
            width: contentMaxWidth,
          },
        ]}
      >
        {/* Dots */}
        <View style={[styles.dots, { height: DOTS_H }]}>
          {slides.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                i === activeIndex ? styles.dotActive : styles.dotInactive,
              ]}
            />
          ))}
        </View>

        {/* Text */}
        <View style={[styles.textBlock, { height: TEXT_H }]}>
          <Text
            style={[
              styles.title,
              { fontSize: titleSize, lineHeight: titleSize * 1.22 },
            ]}
            numberOfLines={2}
            adjustsFontSizeToFit
          >
            {slides[activeIndex].title}
          </Text>
          <Text
            style={[
              styles.subtitle,
              { fontSize: subtitleSize, lineHeight: subtitleSize * 1.5 },
            ]}
            numberOfLines={2}
          >
            {slides[activeIndex].subtitle}
          </Text>
        </View>

        {/* Buttons */}
        <View style={[styles.buttons, { height: BTNS_H }]}>
          <TouchableOpacity
            style={[styles.btnLogin, { width: btnWidth }]}
            onPress={() => router.push("/(auth)/login")}
            activeOpacity={0.85}
          >
            <Text style={styles.btnLoginText}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.btnSignUp, { width: btnWidth }]}
            onPress={() => router.push("/(auth)/register")}
            activeOpacity={0.85}
          >
            <Text style={styles.btnSignUpText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    fontFamily: "Manrope_700Bold",
    letterSpacing: 1.5,
    color: "#0b0a0a",
  },
  bottom: {
    gap: 0,
    backgroundColor: "#fff",
  },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  dot: {
    width: 8.39,
    height: 8.39,
    borderRadius: 1.58,
  },
  dotActive: {
    backgroundColor: "#d0d3d8",
    borderWidth: 1.58,
    borderColor: "#0b0a0a",
  },
  dotInactive: {
    backgroundColor: "#d0d3d8",
  },
  textBlock: {
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
  },
  title: {
    fontFamily: "Manrope_700Bold",
    color: "#0b0a0a",
    textAlign: "center",
    letterSpacing: -0.2,
  },
  subtitle: {
    fontFamily: "Manrope_400Regular",
    color: "#616263",
    textAlign: "center",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  buttons: {
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  // ── Exact Figma button specs — DO NOT modify ──
  btnLogin: {
    height: 38,
    backgroundColor: "#000",
    borderRadius: 3.15,
    alignItems: "center",
    justifyContent: "center",
  },
  btnLoginText: {
    color: "#f8f8f8",
    fontSize: 15,
    fontFamily: "Manrope_700Bold",
    letterSpacing: 0.4,
  },
  btnSignUp: {
    height: 38,
    borderRadius: 3.15,
    borderWidth: 0.79,
    borderColor: "#000",
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  btnSignUpText: {
    color: "#000",
    fontSize: 15,
    fontFamily: "Manrope_700Bold",
    letterSpacing: 0.4,
  },
});
