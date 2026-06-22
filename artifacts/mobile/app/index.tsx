import { useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useAuth } from "@/context/AuthContext";

export default function SplashIndex() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  const scaleAnim   = useRef(new Animated.Value(0.80)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const glowAnim    = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 1. Scale-in + fade-in simultaneously
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 55,
        friction: 9,
        useNativeDriver: Platform.OS !== "web",
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 750,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: Platform.OS !== "web",
      }),
    ]).start(() => {
      // 2. After logo appears, shimmer glow pulses
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 1400,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: Platform.OS !== "web",
          }),
          Animated.timing(glowAnim, {
            toValue: 0,
            duration: 1400,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: Platform.OS !== "web",
          }),
        ])
      ).start();
    });
  }, []);

  useEffect(() => {
    if (isLoading) return;
    const timer = setTimeout(() => {
      if (isAuthenticated) {
        router.replace("/(tabs)/");
      } else {
        router.replace("/onboarding");
      }
    }, 2800);
    return () => clearTimeout(timer);
  }, [isLoading, isAuthenticated]);

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.18],
  });

  return (
    <View style={s.container}>
      <Animated.View
        style={{
          opacity: opacityAnim,
          transform: [{ scale: scaleAnim }],
          alignItems: "center",
        }}
      >
        {/* PAYVORA wordmark */}
        <View style={s.logoWrap}>
          <Text style={s.logo}>PAYVORA</Text>
          {/* Shimmer overlay that glows on top of the text */}
          <Animated.View style={[s.shimmerOverlay, { opacity: glowOpacity }]} />
        </View>

        {/* Thin accent line beneath */}
        <View style={s.accentLine} />

        {/* Tagline */}
        <Text style={s.tagline}>FINTECH · REIMAGINED</Text>
      </Animated.View>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#080808",
    alignItems: "center",
    justifyContent: "center",
  },
  logoWrap: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    fontFamily: "Manrope_700Bold",
    fontSize: 54,
    letterSpacing: 10,
    color: "#FFFFFF",
    textAlign: "center",
    textShadowColor: "rgba(255,255,255,0.30)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 28,
  },
  shimmerOverlay: {
    position: "absolute",
    top: 0,
    left: -16,
    right: -16,
    bottom: 0,
    backgroundColor: "#FFFFFF",
    borderRadius: 6,
  },
  accentLine: {
    width: 48,
    height: 1.5,
    backgroundColor: "rgba(255,255,255,0.20)",
    marginTop: 18,
    marginBottom: 14,
  },
  tagline: {
    fontFamily: "Manrope_400Regular",
    fontSize: 10,
    letterSpacing: 5,
    color: "rgba(255,255,255,0.30)",
    textAlign: "center",
  },
});
