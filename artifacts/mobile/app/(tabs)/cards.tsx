import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { rf } from "@/utils/responsive";

export default function CardsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const btnScale = useSharedValue(1);
  const btnAnim = useAnimatedStyle(() => ({ transform: [{ scale: btnScale.value }] }));

  const handleGetCard = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.push("/(app)/success-payment" as any);
  };

  return (
    <View style={[s.root, { paddingBottom: Platform.OS === "web" ? 32 : insets.bottom + 90 }]}>
      <View style={{ flex: 1 }} />

      <Animated.View style={[s.ctaWrap, btnAnim]}>
        <Pressable
          onPressIn={() => { btnScale.value = withTiming(0.96, { duration: 80 }); }}
          onPressOut={() => { btnScale.value = withSpring(1, { damping: 14 }); }}
          onPress={handleGetCard}
          style={s.ctaBtn}
        >
          <Text style={s.ctaText}>Get virtual card</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  ctaWrap: {
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  ctaBtn: {
    backgroundColor: "#000000",
    height: 52,
    borderRadius: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  ctaText: {
    fontSize: rf(15),
    fontFamily: "Manrope_700Bold",
    color: "#FFFFFF",
    letterSpacing: -0.2,
  },
});
