import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AZAButton } from "@/components/AZAButton";
import { useColors } from "@/hooks/useColors";

const { width } = Dimensions.get("window");

const slides = [
  {
    id: "1",
    title: "Withdraw like a Boss",
    subtitle: "Buy your gift card on AZA and cash out instantly.",
    bg: "#000",
    textColor: "#fff",
  },
  {
    id: "2",
    title: "Sell Gift Cards Fast",
    subtitle: "Trade Amazon, iTunes, Steam and more at the best rates.",
    bg: "#061941",
    textColor: "#fff",
  },
  {
    id: "3",
    title: "Track Every Transaction",
    subtitle: "Full history of your sales and withdrawals, always in your pocket.",
    bg: "#008a48",
    textColor: "#fff",
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
      setCurrentIndex((i) => i + 1);
    } else {
      router.replace("/(auth)/login");
    }
  };

  const isLast = currentIndex === slides.length - 1;

  return (
    <View style={{ flex: 1, backgroundColor: slides[currentIndex].bg }}>
      <FlatList
        ref={flatListRef}
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <View style={[styles.slide, { width, backgroundColor: item.bg }]}>
            <View style={styles.illustration}>
              <Text style={[styles.illustrationText, { color: item.textColor }]}>
                {item.id === "1" ? "💳" : item.id === "2" ? "🎁" : "📊"}
              </Text>
            </View>
            <Text style={[styles.title, { color: item.textColor }]}>
              {item.title}
            </Text>
            <Text style={[styles.subtitle, { color: item.textColor, opacity: 0.7 }]}>
              {item.subtitle}
            </Text>
          </View>
        )}
      />

      <View style={[styles.footer, { paddingBottom: insets.bottom + 24 }]}>
        <View style={styles.dots}>
          {slides.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                {
                  backgroundColor:
                    i === currentIndex ? "#fff" : "rgba(255,255,255,0.3)",
                  width: i === currentIndex ? 20 : 8,
                },
              ]}
            />
          ))}
        </View>

        <View style={styles.actions}>
          <TouchableOpacity onPress={() => router.replace("/(auth)/login")}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.nextBtn} onPress={handleNext} activeOpacity={0.85}>
            <Text style={styles.nextText}>{isLast ? "Get Started" : "Next"}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    paddingTop: 80,
  },
  illustration: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 48,
  },
  illustrationText: { fontSize: 80 },
  title: {
    fontSize: 28,
    fontFamily: "Manrope_700Bold",
    textAlign: "center",
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: "Manrope_400Regular",
    textAlign: "center",
    lineHeight: 24,
  },
  footer: {
    paddingHorizontal: 28,
    gap: 24,
  },
  dots: {
    flexDirection: "row",
    gap: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  skipText: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 15,
    fontFamily: "Manrope_500Medium",
  },
  nextBtn: {
    backgroundColor: "#fff",
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 40,
  },
  nextText: {
    color: "#000",
    fontSize: 15,
    fontFamily: "Manrope_600SemiBold",
  },
});
