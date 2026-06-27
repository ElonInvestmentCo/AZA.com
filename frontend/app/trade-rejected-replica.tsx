import { useRouter } from "expo-router";
import {
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

/**
 * TradeRejectedReplica
 *
 * Pixel-perfect 1:1 replica of the provided "Trade Rejected" error screen.
 * Design canvas: 393 x 852 (iPhone 14/15 width). Layout uses absolute
 * positioning on a centered, max-width 393 canvas so proportions and
 * spacing match the reference exactly, while remaining responsive.
 */
export default function TradeRejectedReplica() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.canvasWrap} testID="trade-rejected-replica">
        <View style={styles.canvas}>
          {/* Hero illustration: confused character with leaves, gray blob, question marks */}
          <Image
            source={require("../assets/replica/rejected-illustration.png")}
            style={styles.illustration}
            resizeMode="contain"
            testID="rejected-illustration"
          />

          {/* Scalloped red error badge with white X */}
          <Image
            source={require("../assets/replica/badge-rejected.png")}
            style={styles.badge}
            resizeMode="contain"
            testID="rejected-badge"
          />

          {/* Title */}
          <Text style={styles.title} testID="rejected-title">
            Trade Rejected
          </Text>

          {/* Subtitle (two lines, centered, matches reference copy) */}
          <Text style={styles.subtitle} testID="rejected-subtitle">
            Your trade has been Decline{"\n"}card not Available
          </Text>

          {/* Primary action: Check trades */}
          <TouchableOpacity
            testID="rejected-check-trades-button"
            activeOpacity={0.85}
            style={styles.button}
            onPress={() => router.back()}
          >
            <Text style={styles.buttonText}>Check trades</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

// Design canvas size (matches reference screenshot).
const CANVAS_W = 393;
const CANVAS_H = 852;

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
  // Illustration spans full canvas width above the badge.
  // Cropped asset is 393 x 215, placed starting at top 60 to clear status bar.
  illustration: {
    position: "absolute",
    left: 0,
    top: 60,
    width: 393,
    height: 215,
  },
  // Red scalloped badge sits below illustration, overlapping its bottom blob.
  // 100 x 100 at left 144, top 275 (matches reference CSS).
  badge: {
    position: "absolute",
    left: 144,
    top: 275,
    width: 100,
    height: 100,
  },
  // Title centered, around y=410-445.
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
  },
  // Subtitle: two lines, gray.
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
  },
  // Button at y=520, full width minus 24 horizontal padding.
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
  },
});
