import { useRouter } from "expo-router";
import React, { useRef, useState, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from "react-native-reanimated";
import { useAuth } from "@/context/AuthContext";
import SplashAnimation from "@/components/SplashAnimation";

export default function SplashIndex() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const isAuthenticatedRef = useRef(isAuthenticated);
  isAuthenticatedRef.current = isAuthenticated;

  const [animDone,  setAnimDone]  = useState(false);
  const [authReady, setAuthReady] = useState(!isLoading);

  const wordmarkOpacity = useSharedValue(0);
  const screenOpacity   = useSharedValue(1);

  const wordmarkStyle = useAnimatedStyle(() => ({ opacity: wordmarkOpacity.value }));
  const screenStyle   = useAnimatedStyle(() => ({ opacity: screenOpacity.value }));

  useEffect(() => {
    wordmarkOpacity.value = withDelay(
      300,
      withTiming(1, { duration: 800, easing: Easing.out(Easing.cubic) })
    );
  }, []);

  useEffect(() => {
    if (!isLoading) setAuthReady(true);
  }, [isLoading]);

  const navigate = () => {
    screenOpacity.value = withTiming(0, { duration: 300, easing: Easing.in(Easing.cubic) });
    setTimeout(() => {
      if (isAuthenticatedRef.current) {
        router.replace("/(tabs)/" as any);
      } else {
        router.replace("/onboarding");
      }
    }, 320);
  };

  useEffect(() => {
    if (animDone && authReady) navigate();
  }, [animDone, authReady]);

  useEffect(() => {
    const fallback = setTimeout(() => setAnimDone(true), 2800);
    return () => clearTimeout(fallback);
  }, []);

  return (
    <View style={s.root}>
      <Animated.View style={[StyleSheet.absoluteFill, s.fill, screenStyle]}>
        <View style={s.center}>
          <SplashAnimation
            size={180}
            duration={2000}
            onFinish={() => setAnimDone(true)}
          />
          <Animated.Text style={[s.wordmark, wordmarkStyle]}>
            AZA.
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
    marginTop: 24,
    textShadowColor: "rgba(255,255,255,0.18)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
});
