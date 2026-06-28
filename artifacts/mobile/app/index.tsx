import { useRouter } from "expo-router";
import React, { useRef, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from "react-native-reanimated";
import { useAuth } from "@/context/AuthContext";

export default function SplashIndex() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const isAuthenticatedRef = useRef(isAuthenticated);
  isAuthenticatedRef.current = isAuthenticated;

  const wordmarkOpacity = useSharedValue(0);
  const screenOpacity   = useSharedValue(1);

  const wordmarkStyle = useAnimatedStyle(() => ({ opacity: wordmarkOpacity.value }));
  const screenStyle   = useAnimatedStyle(() => ({ opacity: screenOpacity.value }));

  useEffect(() => {
    wordmarkOpacity.value = withDelay(
      200,
      withTiming(1, { duration: 700, easing: Easing.out(Easing.cubic) })
    );
  }, []);

  useEffect(() => {
    if (isLoading) return;

    const timer = setTimeout(() => {
      screenOpacity.value = withTiming(0, { duration: 300, easing: Easing.in(Easing.cubic) });
      setTimeout(() => {
        try {
          if (isAuthenticatedRef.current) {
            router.replace("/(tabs)" as any);
          } else {
            router.replace("/onboarding");
          }
        } catch (e) {
          console.error("[SplashIndex] navigation failed:", e);
        }
      }, 320);
    }, 1800);

    return () => clearTimeout(timer);
  }, [isLoading]);

  return (
    <View style={s.root}>
      <Animated.View style={[StyleSheet.absoluteFill, s.fill, screenStyle]}>
        <View style={s.center}>
          <Animated.Text style={[s.wordmark, wordmarkStyle]}>
            PAYVORA.
          </Animated.Text>
        </View>
      </Animated.View>
    </View>
  );
}

const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#080808",
  },
  fill: {
    flex: 1,
    backgroundColor: "#080808",
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  wordmark: {
    fontFamily: "Manrope_700Bold",
    fontSize: 52,
    letterSpacing: 4,
    color: "#FFFFFF",
    textAlign: "center",
    textShadowColor: "rgba(255,255,255,0.18)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
});
