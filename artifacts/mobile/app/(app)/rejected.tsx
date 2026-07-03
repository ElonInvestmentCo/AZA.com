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

export default function RejectedScreen() {
  const router = useRouter();

  const params = useLocalSearchParams<{ cardType?: string; amount?: string; reason?: string }>();

  useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  }, []);

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>

        {/* Illustration — grows to fill available top space */}
        <View style={styles.illustrationWrap}>
          <Image
            source={require("@/assets/images/replica/rejected-illustration.png")}
            style={styles.illustration}
            resizeMode="contain"
          />
        </View>

        {/* Badge */}
        <Image
          source={require("@/assets/images/replica/badge-rejected.png")}
          style={styles.badge}
          resizeMode="contain"
        />

        {/* Copy */}
        <Text style={styles.title}>Trade Rejected</Text>
        <Text style={styles.subtitle}>
          Your trade has been Decline{"\n"}card not Available
        </Text>

        {/* Push button toward bottom */}
        <View style={styles.spacer} />

        {/* CTA */}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 16,
    alignItems: "center",
  },

  /* Illustration takes ~42% of screen height */
  illustrationWrap: {
    width: "100%",
    flex: 0.42,
    alignItems: "center",
    justifyContent: "center",
  },
  illustration: {
    width: "100%",
    height: "100%",
  },

  /* Fixed-size badge sits directly below the illustration */
  badge: {
    width: 90,
    height: 90,
    marginTop: 8,
    marginBottom: 4,
  },

  title: {
    marginTop: 20,
    fontSize: 26,
    fontFamily: "Manrope_700Bold",
    color: "#1F232C",
    textAlign: "center",
    letterSpacing: 0.2,
  },
  subtitle: {
    marginTop: 10,
    fontSize: 15,
    lineHeight: 22,
    fontFamily: "Manrope_400Regular",
    color: "#8E94A5",
    textAlign: "center",
  },

  spacer: { flex: 1 },

  button: {
    width: "100%",
    height: 54,
    backgroundColor: "#1F232C",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "Manrope_600SemiBold",
    letterSpacing: 0.1,
  },
});
