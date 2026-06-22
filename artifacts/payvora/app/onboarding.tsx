import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewToken,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";
import { useAuth } from "@/context/AuthContext";

const { width } = Dimensions.get("window");

interface Slide {
  id: string;
  icon: string;
  iconSet: "feather" | "material";
  title: string;
  subtitle: string;
  accentColor: string;
}

const SLIDES: Slide[] = [
  {
    id: "1",
    icon: "credit-card",
    iconSet: "feather",
    title: "Your Money,\nReimagined",
    subtitle: "One wallet for everything. Spend, send, and save smarter than ever before.",
    accentColor: "#00D9A0",
  },
  {
    id: "2",
    icon: "trending-up",
    iconSet: "feather",
    title: "Trade &\nInvest",
    subtitle: "Access global crypto markets in real time. Build your portfolio with confidence.",
    accentColor: "#3B82F6",
  },
  {
    id: "3",
    icon: "wifi",
    iconSet: "feather",
    title: "Global eSIM\nConnectivity",
    subtitle: "Stay connected anywhere in the world. Instant eSIM activation in 190+ countries.",
    accentColor: "#8B5CF6",
  },
];

function SlideIcon({ slide }: { slide: Slide }) {
  return (
    <View style={[styles.iconContainer, { backgroundColor: slide.accentColor + "20", borderColor: slide.accentColor + "40" }]}>
      <View style={[styles.iconInner, { backgroundColor: slide.accentColor + "30" }]}>
        <Feather name={slide.icon as any} size={56} color={slide.accentColor} />
      </View>
    </View>
  );
}

export default function OnboardingScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { completeOnboarding } = useAuth();
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

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
    await completeOnboarding();
    router.replace("/login");
  }

  const isLast = activeIndex === SLIDES.length - 1;
  const accentColor = SLIDES[activeIndex]?.accentColor ?? "#00D9A0";

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top, paddingBottom: insets.bottom + 24 }]}>
      {!isLast && (
        <TouchableOpacity style={styles.skipBtn} onPress={handleSkip}>
          <Text style={[styles.skipText, { color: colors.mutedForeground }]}>Skip</Text>
        </TouchableOpacity>
      )}

      <FlatList
        ref={flatListRef}
        data={SLIDES}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged.current}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
        renderItem={({ item }) => (
          <View style={[styles.slide, { width }]}>
            <SlideIcon slide={item} />
            <Text style={[styles.title, { color: colors.foreground }]}>{item.title}</Text>
            <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>{item.subtitle}</Text>
          </View>
        )}
      />

      <View style={styles.footer}>
        <View style={styles.dots}>
          {SLIDES.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                {
                  width: i === activeIndex ? 24 : 8,
                  backgroundColor: i === activeIndex ? accentColor : colors.border,
                },
              ]}
            />
          ))}
        </View>

        <TouchableOpacity
          style={[styles.nextBtn, { backgroundColor: accentColor }]}
          onPress={handleNext}
          activeOpacity={0.85}
        >
          {isLast ? (
            <Text style={[styles.nextBtnText, { color: colors.primaryForeground }]}>Get Started</Text>
          ) : (
            <Feather name="arrow-right" size={24} color={colors.primaryForeground} />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  skipBtn: {
    position: "absolute",
    top: Platform.OS === "web" ? 91 : 60,
    right: 24,
    zIndex: 10,
    padding: 8,
  },
  skipText: {
    fontSize: 16,
    fontFamily: "Inter_500Medium",
  },
  slide: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
    gap: 28,
  },
  iconContainer: {
    width: 180,
    height: 180,
    borderRadius: 90,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    marginBottom: 12,
  },
  iconInner: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 40,
    fontFamily: "Inter_700Bold",
    textAlign: "center",
    lineHeight: 48,
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 17,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    lineHeight: 26,
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
  },
});
