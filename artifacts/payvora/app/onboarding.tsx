import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewToken,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";
import { useAuth } from "@/context/AuthContext";

const { width } = Dimensions.get("window");
const PARALLAX_FACTOR = 0.28;

/* ─── Card dimensions ───────────────────────────────────────────────────── */
const CW = 248;   // card width
const CH = 150;   // card height
const STACK_GAP = 52; // vertical gap per card in the stack

/* ─── Contactless / NFC icon ────────────────────────────────────────────── */
function ContactlessIcon({ color = "#FFFFFF" }: { color?: string }) {
  return (
    <View style={{ alignItems: "center", justifyContent: "center", width: 20, height: 20 }}>
      {/* Three arcs — innermost smallest */}
      {[10, 14, 18].map((r, i) => (
        <View
          key={i}
          style={{
            position: "absolute",
            width: r,
            height: r,
            borderRadius: r / 2,
            borderWidth: 1.5,
            borderColor: color,
            borderLeftColor: "transparent",
            borderBottomColor: "transparent",
            transform: [{ rotate: "-45deg" }],
            opacity: 0.55 + i * 0.22,
          }}
        />
      ))}
    </View>
  );
}

/* ─── Mastercard logo (two overlapping circles) ─────────────────────────── */
function MastercardIcon() {
  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <View
        style={{
          width: 22,
          height: 22,
          borderRadius: 11,
          backgroundColor: "#EB001B",
          opacity: 0.92,
        }}
      />
      <View
        style={{
          width: 22,
          height: 22,
          borderRadius: 11,
          backgroundColor: "#F79E1B",
          marginLeft: -9,
          opacity: 0.88,
        }}
      />
    </View>
  );
}

/* ─── Single card ───────────────────────────────────────────────────────── */
interface CardProps {
  variant: "dark" | "light";
  brand?: boolean;        // shows "PayVora" top-left
  name: string;
  expiry?: string;
  showMastercard?: boolean;
  showContactless?: boolean;
  topOffset: number;
}

function VirtualCard({
  variant,
  brand,
  name,
  expiry,
  showMastercard,
  showContactless,
  topOffset,
}: CardProps) {
  const isDark = variant === "dark";

  return (
    <View
      style={[
        cs.card,
        {
          top: topOffset,
          backgroundColor: isDark ? "#101010" : "rgba(215,212,238,0.88)",
          borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.55)",
          shadowColor: isDark ? "#000000" : "#6b5fc4",
        },
      ]}
    >
      {/* Inner glare blob for depth */}
      {isDark && (
        <View style={cs.glare} />
      )}

      {/* ── Top row: brand / chip  +  contactless ── */}
      <View style={cs.topRow}>
        <View style={{ gap: 2 }}>
          {brand && (
            <Text style={[cs.brandText, { color: isDark ? "#FFFFFF" : "#1a1a2e" }]}>
              PayVora
            </Text>
          )}
          {/* Chip */}
          <View style={[cs.chip, { backgroundColor: isDark ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.12)" }]} />
        </View>
        {showContactless && (
          <ContactlessIcon color={isDark ? "#FFFFFF" : "#1a1a2e"} />
        )}
      </View>

      {/* ── Card number ── */}
      <Text style={[cs.cardNum, { color: isDark ? "rgba(255,255,255,0.9)" : "rgba(20,20,40,0.85)" }]}>
        1234  1234  1234  1234
      </Text>

      {/* ── Bottom row: name + expiry/logo ── */}
      <View style={cs.bottomRow}>
        <View style={{ gap: 1 }}>
          {expiry && (
            <Text style={[cs.expiryLabel, { color: isDark ? "rgba(255,255,255,0.45)" : "rgba(20,20,40,0.45)" }]}>
              EXPIRES
            </Text>
          )}
          <Text style={[cs.nameText, { color: isDark ? "rgba(255,255,255,0.85)" : "rgba(20,20,40,0.8)" }]}>
            {name}
          </Text>
        </View>
        <View style={cs.bottomRight}>
          {expiry && (
            <Text style={[cs.expiryText, { color: isDark ? "rgba(255,255,255,0.6)" : "rgba(20,20,40,0.6)" }]}>
              {expiry}
            </Text>
          )}
          {showMastercard ? <MastercardIcon /> : null}
        </View>
      </View>
    </View>
  );
}

const cs = StyleSheet.create({
  card: {
    position: "absolute",
    width: CW,
    height: CH,
    borderRadius: 18,
    borderWidth: 1,
    padding: 18,
    overflow: "hidden",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.45,
    shadowRadius: 24,
    elevation: 16,
    justifyContent: "space-between",
  },
  glare: {
    position: "absolute",
    width: CW * 0.65,
    height: CH * 1.1,
    borderRadius: CW * 0.5,
    backgroundColor: "rgba(255,255,255,0.055)",
    top: -CH * 0.25,
    left: CW * 0.22,
    transform: [{ rotate: "-20deg" }],
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  brandText: {
    fontSize: 13,
    fontFamily: "Inter_700Bold",
    letterSpacing: 0.2,
    marginBottom: 6,
  },
  chip: {
    width: 28,
    height: 20,
    borderRadius: 4,
  },
  cardNum: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    letterSpacing: 2.5,
    marginTop: 2,
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  expiryLabel: {
    fontSize: 7,
    fontFamily: "Inter_400Regular",
    letterSpacing: 0.8,
  },
  nameText: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  bottomRight: {
    alignItems: "flex-end",
    gap: 4,
  },
  expiryText: {
    fontSize: 11,
    fontFamily: "Inter_500Medium",
    letterSpacing: 0.5,
  },
});

/* ─── Stacked card group with 3-D perspective ───────────────────────────── */
function VirtualCardStack() {
  const totalH = CH + STACK_GAP * 2;

  return (
    <View style={{ width: CW + 20, height: totalH + 24, alignItems: "center", justifyContent: "center" }}>
      {/* 3-D tilt wrapper */}
      <View
        style={{
          width: CW,
          height: totalH,
          transform: [
            { perspective: 960 },
            { rotateX: "28deg" },
            { rotateZ: "-6deg" },
          ],
        }}
      >
        {/* Back card – dark, PayVora brand */}
        <VirtualCard
          variant="dark"
          brand
          name="LANA STEINER"
          topOffset={0}
        />

        {/* Middle card – light/lavender */}
        <VirtualCard
          variant="light"
          name="OLIVIA RHYE"
          expiry="06/24"
          showContactless
          topOffset={STACK_GAP}
        />

        {/* Front card – dark, Mastercard */}
        <VirtualCard
          variant="dark"
          name="PHOENIX BAKER"
          expiry="06/24"
          showMastercard
          showContactless
          topOffset={STACK_GAP * 2}
        />
      </View>
    </View>
  );
}

/* ─── Slide types / data ────────────────────────────────────────────────── */
interface Slide {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  accentColor: string;
  decorColor: string;
}

const SLIDES: Slide[] = [
  {
    id: "1",
    icon: "credit-card",
    title: "Your Money,\nReimagined",
    subtitle: "One wallet for everything. Spend, send, and save smarter than ever before.",
    accentColor: "#00D9A0",
    decorColor: "#00D9A030",
  },
  {
    id: "2",
    icon: "trending-up",
    title: "Trade &\nInvest",
    subtitle: "Access global crypto markets in real time. Build your portfolio with confidence.",
    accentColor: "#3B82F6",
    decorColor: "#3B82F630",
  },
  {
    id: "3",
    icon: "wifi",
    title: "Global eSIM\nConnectivity",
    subtitle: "Stay connected anywhere in the world. Instant eSIM activation in 190+ countries.",
    accentColor: "#8B5CF6",
    decorColor: "#8B5CF630",
  },
];

/* ─── Parallax slide ────────────────────────────────────────────────────── */
function ParallaxSlide({
  slide,
  index,
  scrollX,
}: {
  slide: Slide;
  index: number;
  scrollX: Animated.Value;
}) {
  const inputRange = [
    (index - 1) * width,
    index * width,
    (index + 1) * width,
  ];

  const iconTranslateX = scrollX.interpolate({
    inputRange,
    outputRange: [width * PARALLAX_FACTOR, 0, -width * PARALLAX_FACTOR],
    extrapolate: "clamp",
  });
  const iconScale = scrollX.interpolate({
    inputRange,
    outputRange: [0.78, 1, 0.78],
    extrapolate: "clamp",
  });
  const iconOpacity = scrollX.interpolate({
    inputRange,
    outputRange: [0.5, 1, 0.5],
    extrapolate: "clamp",
  });

  const textTranslateX = scrollX.interpolate({
    inputRange,
    outputRange: [width * 0.06, 0, -width * 0.06],
    extrapolate: "clamp",
  });
  const textOpacity = scrollX.interpolate({
    inputRange,
    outputRange: [0, 1, 0],
    extrapolate: "clamp",
  });

  const ring1Scale = scrollX.interpolate({
    inputRange,
    outputRange: [0.88, 1, 0.88],
    extrapolate: "clamp",
  });

  return (
    <View style={[styles.slide, { width }]}>
      {/* Depth rings for non-card slides */}
      {slide.id !== "1" && (
        <>
          <Animated.View
            style={[
              styles.depthRing1,
              { borderColor: slide.accentColor + "18", transform: [{ translateX: iconTranslateX }, { scale: ring1Scale }] },
            ]}
          />
          <Animated.View
            style={[
              styles.depthRing2,
              {
                borderColor: slide.accentColor + "10",
                transform: [
                  {
                    translateX: scrollX.interpolate({
                      inputRange,
                      outputRange: [width * 0.14, 0, -width * 0.14],
                      extrapolate: "clamp",
                    }),
                  },
                ],
              },
            ]}
          />
        </>
      )}

      {/* ── Illustration area ── */}
      <Animated.View
        style={[
          styles.iconParallaxWrap,
          {
            opacity: iconOpacity,
            transform: [{ translateX: iconTranslateX }, { scale: iconScale }],
          },
        ]}
      >
        {slide.id === "1" ? (
          /* Slide 1: 3-D stacked virtual cards */
          <VirtualCardStack />
        ) : (
          /* Slides 2 & 3: circle icon */
          <View
            style={[
              styles.iconOuter,
              { backgroundColor: slide.accentColor + "18", borderColor: slide.accentColor + "38" },
            ]}
          >
            <View style={[styles.iconInner, { backgroundColor: slide.accentColor + "28" }]}>
              <Feather name={slide.icon as any} size={58} color={slide.accentColor} />
            </View>
          </View>
        )}
      </Animated.View>

      {/* Text block */}
      <Animated.View
        style={[
          styles.textBlock,
          { opacity: textOpacity, transform: [{ translateX: textTranslateX }] },
        ]}
      >
        <Text style={styles.title}>{slide.title}</Text>
        <Text style={styles.subtitle}>{slide.subtitle}</Text>
      </Animated.View>
    </View>
  );
}

/* ─── Screen ────────────────────────────────────────────────────────────── */
export default function OnboardingScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { completeOnboarding } = useAuth();
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems[0]) {
        setActiveIndex(viewableItems[0].index ?? 0);
      }
    }
  );

  async function handleNext() {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (activeIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: activeIndex + 1, animated: true });
    } else {
      await handleGetStarted();
    }
  }

  async function handleGetStarted() {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await completeOnboarding();
    router.replace("/login");
  }

  async function handleSkip() {
    await Haptics.selectionAsync();
    await completeOnboarding();
    router.replace("/login");
  }

  const isLast = activeIndex === SLIDES.length - 1;
  const accentColor = SLIDES[activeIndex]?.accentColor ?? "#00D9A0";

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background, paddingTop: insets.top, paddingBottom: insets.bottom + 24 },
      ]}
    >
      {!isLast && (
        <TouchableOpacity style={styles.skipBtn} onPress={handleSkip}>
          <Text style={[styles.skipText, { color: colors.mutedForeground }]}>Skip</Text>
        </TouchableOpacity>
      )}

      <Animated.FlatList
        ref={flatListRef}
        data={SLIDES}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true }
        )}
        onViewableItemsChanged={onViewableItemsChanged.current}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
        renderItem={({ item, index }) => (
          <ParallaxSlide slide={item} index={index} scrollX={scrollX} />
        )}
      />

      <View style={styles.footer}>
        <View style={styles.dots}>
          {SLIDES.map((_, i) => {
            const dotWidth = scrollX.interpolate({
              inputRange: [(i - 1) * width, i * width, (i + 1) * width],
              outputRange: [8, 24, 8],
              extrapolate: "clamp",
            });
            const dotOpacity = scrollX.interpolate({
              inputRange: [(i - 1) * width, i * width, (i + 1) * width],
              outputRange: [0.35, 1, 0.35],
              extrapolate: "clamp",
            });
            return (
              <Animated.View
                key={i}
                style={[
                  styles.dot,
                  {
                    width: dotWidth,
                    opacity: dotOpacity,
                    backgroundColor: accentColor,
                  },
                ]}
              />
            );
          })}
        </View>

        <TouchableOpacity
          style={[styles.nextBtn, { backgroundColor: accentColor }]}
          onPress={handleNext}
          activeOpacity={0.85}
        >
          {isLast ? (
            <Text style={styles.nextBtnText}>Get Started</Text>
          ) : (
            <Feather name="arrow-right" size={24} color="#FFFFFF" />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  skipBtn: {
    position: "absolute",
    top: Platform.OS === "web" ? 91 : 60,
    right: 24,
    zIndex: 10,
    padding: 8,
  },
  skipText: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    letterSpacing: 0.1,
  },

  slide: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
    gap: 32,
    overflow: "hidden",
  },

  depthRing1: {
    position: "absolute",
    width: 260,
    height: 260,
    borderRadius: 130,
    borderWidth: 1,
  },
  depthRing2: {
    position: "absolute",
    width: 340,
    height: 340,
    borderRadius: 170,
    borderWidth: 1,
  },

  iconParallaxWrap: {},
  iconOuter: {
    width: 184,
    height: 184,
    borderRadius: 92,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  iconInner: {
    width: 124,
    height: 124,
    borderRadius: 62,
    alignItems: "center",
    justifyContent: "center",
  },

  textBlock: {
    alignItems: "center",
    gap: 16,
    paddingHorizontal: 4,
  },
  title: {
    fontSize: 34,
    fontFamily: "Inter_700Bold",
    textAlign: "center",
    lineHeight: 42,
    letterSpacing: -0.5,
    color: "#FFFFFF",
  },
  subtitle: {
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    lineHeight: 24,
    letterSpacing: 0.1,
    color: "rgba(255,255,255,0.55)",
  },

  footer: {
    paddingHorizontal: 32,
    paddingTop: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dots: {
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  nextBtn: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  nextBtnText: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
    color: "#FFFFFF",
  },
});
