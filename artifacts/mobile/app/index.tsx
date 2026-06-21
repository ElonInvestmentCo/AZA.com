import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { useColors } from "@/hooks/useColors";
import { useAuth } from "@/context/AuthContext";

export default function SplashIndex() {
  const router = useRouter();
  const colors = useColors();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;
    const timer = setTimeout(() => {
      if (isAuthenticated) {
        router.replace("/(app)/dashboard");
      } else {
        router.replace("/onboarding");
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [isLoading, isAuthenticated]);

  return (
    <View style={[styles.container, { backgroundColor: "#000" }]}>
      <Text style={styles.logo}>aza</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    color: "#fff",
    fontSize: 48,
    fontFamily: "Manrope_700Bold",
    letterSpacing: -2,
  },
});
