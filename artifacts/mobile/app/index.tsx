import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { useAuth } from "@/context/AuthContext";

const payvoraImg = require("@/assets/images/splash-payvora.png");

export default function SplashIndex() {
  const router = useRouter();
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
    <View style={styles.container}>
      <Image
        source={payvoraImg}
        style={styles.logo}
        contentFit="contain"
        priority="high"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000",
  },
  logo: {
    width: "95%",
    aspectRatio: 2,
  },
});
