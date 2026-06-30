import * as Haptics from "expo-haptics";
import { useRouter, useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import {
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const CANVAS_W = 393;
const CANVAS_H = 852;

export default function SubmittedScreen() {
  const router = useRouter();

  const params   = useLocalSearchParams<{ cardType?: string; amount?: string; naira?: string }>();
  const cardType = params.cardType ?? "Gift Card";
  const amount   = params.amount   ?? "$100";
  const naira    = params.naira    ?? "₦120,000";

  useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, [cardType, amount, naira]);

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.canvasWrap}>
        <View style={styles.canvas}>
          <Image
            source={require("@/assets/images/replica/success-illustration.png")}
            style={styles.illustration}
            resizeMode="contain"
          />

          <Image
            source={require("@/assets/images/replica/badge-success.png")}
            style={styles.badge}
            resizeMode="contain"
          />

          <Text style={styles.title}>Trade Submitted</Text>

          <Text style={styles.subtitle}>
            Your trade has been submitted{"\n"}successfully
          </Text>

          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.button}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.replace("/(tabs)" as any);
            }}
          >
            <Text style={styles.buttonText}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  canvasWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: "#FFFFFF",
  },
  canvas: {
    width: CANVAS_W,
    height: CANVAS_H,
    maxWidth: "100%",
    position: "relative",
    backgroundColor: "#FFFFFF",
  },
  illustration: {
    position: "absolute",
    left: 29,
    top: 55,
    width: 295.7,
    height: 232.34,
  },
  badge: {
    position: "absolute",
    left: 144,
    top: 275,
    width: 100,
    height: 100,
  },
  title: {
    position: "absolute",
    top: 408,
    left: 0,
    right: 0,
    textAlign: "center",
    fontSize: 26,
    fontWeight: "800",
    color: "#1F232C",
    letterSpacing: 0.2,
    fontFamily: "Manrope_700Bold",
  },
  subtitle: {
    position: "absolute",
    top: 452,
    left: 0,
    right: 0,
    textAlign: "center",
    fontSize: 16,
    lineHeight: 24,
    color: "#8E94A5",
    fontWeight: "400",
    fontFamily: "Manrope_400Regular",
  },
  button: {
    position: "absolute",
    left: 24,
    right: 24,
    top: 520,
    height: 56,
    backgroundColor: "#1F232C",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Manrope_600SemiBold",
  },
});
