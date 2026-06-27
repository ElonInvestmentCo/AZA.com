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

export default function RejectedScreen() {
  const router = useRouter();

  const params   = useLocalSearchParams<{ cardType?: string; amount?: string; reason?: string }>();

  useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  }, []);

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <StatusBar barStyle="default" />
      <View style={styles.canvasWrap}>
        <View style={styles.canvas}>
          <Image
            source={require("@/assets/images/replica/rejected-illustration.png")}
            style={styles.illustration}
            resizeMode="contain"
          />

          <Image
            source={require("@/assets/images/replica/badge-rejected.png")}
            style={styles.badge}
            resizeMode="contain"
          />

          <Text style={styles.title}>Trade Rejected</Text>

          <Text style={styles.subtitle}>
            Your trade has been Decline{"\n"}card not Available
          </Text>

          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.button}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.replace("/(app)/card-status" as any);
            }}
          >
            <Text style={styles.buttonText}>Check trades</Text>
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
    left: 0,
    top: 60,
    width: 393,
    height: 215,
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
