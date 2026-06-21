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

const slides = [
  {
    id: "1",
    image: eWalletImg,
    title: "Withdraw like a Boss",
    subtitle: "buy your gift card on aza",
  },
  {
    id: "2",
    image: eWalletImg,
    title: "Sell Gift Cards Fast",
    subtitle: "trade amazon, itunes, steam & more",
  },
  {
    id: "3",
    image: eWalletImg,
    title: "Track Every Transaction",
    subtitle: "full history of your sales, always in your pocket",
  },
];

function clamp(val: number, min: number, max: number) {
  return Math.min(Math.max(val, min), max);
}

// Fixed heights for non-image sections so we can compute slide area explicitly
const HEADER_H = 52;    // "AZA." logo row
const DOTS_H   = 24;    // dot row
const TEXT_H   = 68;    // title + subtitle
const BTNS_H   = 96;    // login + signup buttons + gap

export default function OnboardingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const topInset   = Platform.OS === "web" ? 0 : insets.top;
  const bottomInset = Platform.OS === "web" ? 0 : insets.bottom;

  // Exact pixel budget for the illustration area
  const bottomSectionH = DOTS_H + TEXT_H + BTNS_H + 32 + bottomInset; // 32 = gaps + padding
  const slideAreaH = height - topInset - HEADER_H - bottomSectionH;

  // Illustration is square, fills ~88% of the slide area, capped at 380
  const illustrationSize = clamp(Math.min(slideAreaH * 0.88, width * 0.86), 180, 380);

  const isTablet = width >= 768;
  const contentMaxWidth = Math.min(width, 500);
  const hPad = clamp(width * 0.07, 20, 40);
  const btnWidth = clamp(contentMaxWidth - hPad * 2, 220, 340);

  const titleSize   = clamp(isTablet ? width * 0.038 : width * 0.062, 18, 26);
  const subtitleSize = clamp(width * 0.031, 10.5, 13);
  const logoSize    = clamp(width * 0.054, 17, 23);

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

      {/* ── Illustration carousel — explicit height so items render on all screens ── */}
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
        style={{ height: slideAreaH }}    // ← explicit: no flex:1 ambiguity
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
            <Image
              source={item.image}
              style={{ width: illustrationSize, height: illustrationSize }}
              contentFit="contain"
              transition={180}
              cachePolicy="memory-disk"
            />
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

        {/* Buttons — exact Figma specs, DO NOT change */}
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
