import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewToken,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

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

export default function OnboardingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index !== null) {
        setActiveIndex(viewableItems[0].index);
      }
    }
  ).current;

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      {/* AZA. Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>AZA.</Text>
      </View>

      {/* Swipeable slides */}
      <FlatList
        ref={flatListRef}
        data={slides}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
        renderItem={({ item }) => (
          <View style={[styles.slide, { width }]}>
            <Image
              source={item.image}
              style={styles.illustration}
              resizeMode="contain"
            />
          </View>
        )}
      />

      {/* Bottom section — fixed */}
      <View style={[styles.bottom, { paddingBottom: insets.bottom + 28 }]}>
        {/* Page dots */}
        <View style={styles.dots}>
          {slides.map((_, i) => {
            const isActive = i === activeIndex;
            return (
              <View
                key={i}
                style={[
                  styles.dot,
                  isActive ? styles.dotActive : styles.dotInactive,
                ]}
              />
            );
          })}
        </View>

        {/* Text */}
        <View style={styles.textBlock}>
          <Text style={styles.title}>{slides[activeIndex].title}</Text>
          <Text style={styles.subtitle}>{slides[activeIndex].subtitle}</Text>
        </View>

        {/* Buttons */}
        <View style={styles.buttons}>
          <TouchableOpacity
            style={styles.btnLogin}
            onPress={() => router.push("/(auth)/login")}
            activeOpacity={0.85}
          >
            <Text style={styles.btnLoginText}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btnSignUp}
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
    paddingTop: 16,
    paddingBottom: 4,
  },
  logo: {
    fontSize: 22,
    fontFamily: "Manrope_700Bold",
    letterSpacing: 1,
    color: "#0b0a0a",
  },
  slide: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 38,
    paddingTop: 16,
  },
  illustration: {
    width: 334,
    height: 334,
  },
  bottom: {
    paddingHorizontal: 32,
    gap: 20,
    backgroundColor: "#fff",
  },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
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
    gap: 10,
  },
  title: {
    fontSize: 25.2,
    fontFamily: "Manrope_700Bold",
    color: "#0b0a0a",
    textAlign: "center",
    letterSpacing: -0.3,
    lineHeight: 30,
  },
  subtitle: {
    fontSize: 12.6,
    fontFamily: "Manrope_400Regular",
    color: "#616263",
    textAlign: "center",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    lineHeight: 18.9,
  },
  buttons: {
    gap: 8,
    alignItems: "center",
  },
  btnLogin: {
    width: 263,
    height: 38,
    backgroundColor: "#000",
    borderRadius: 3.15,
    alignItems: "center",
    justifyContent: "center",
  },
  btnLoginText: {
    color: "#f8f8f8",
    fontSize: 12.6,
    fontFamily: "Manrope_600SemiBold",
  },
  btnSignUp: {
    width: 263,
    height: 38,
    borderRadius: 3.15,
    borderWidth: 0.79,
    borderColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  btnSignUpText: {
    color: "#000",
    fontSize: 12.6,
    fontFamily: "Manrope_600SemiBold",
  },
});
