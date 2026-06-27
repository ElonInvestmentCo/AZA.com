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
 * TradeSubmittedReplica
 *
 * Pixel-perfect 1:1 replica of the provided "Trade Submitted" success screen.
 * Design canvas: 393 x 852 (iPhone 14/15 width). Layout uses absolute
 * positioning on a centered, max-width 393 canvas so proportions and
 * spacing match the reference exactly, while remaining responsive.
 */
export default function TradeSubmittedReplica() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.canvasWrap} testID="trade-submitted-replica">
        <View style={styles.canvas}>
          {/* Hero illustration: running man with flag */}
          <Image
            source={require("../assets/replica/success-illustration.png")}
            style={styles.illustration}
            resizeMode="contain"
            testID="success-illustration"
          />

          {/* Scalloped verified badge with white checkmark */}
          <Image
            source={require("../assets/replica/badge-success.png")}
            style={styles.badge}
            resizeMode="contain"
            testID="success-badge"
          />

          {/* Title */}
          <Text style={styles.title} testID="success-title">
            Trade Submitted
          </Text>

          {/* Subtitle (two lines, centered) */}
          <Text style={styles.subtitle} testID="success-subtitle">
            Your trade has been submitted{"\n"}successfully
          </Text>

          {/* Primary action: Done */}
          <TouchableOpacity
            testID="success-done-button"
            activeOpacity={0.85}
            style={styles.button}
            onPress={() => router.replace("/replica-launcher")}
          >
            <Text style={styles.buttonText}>Done</Text>
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
  // Illustration: 295.7 x 232.34 at left 29, top 55 (matches reference CSS)
  illustration: {
    position: "absolute",
    left: 29,
    top: 55,
    width: 295.7,
    height: 232.34,
  },
  // Badge: 100 x 100 at left 144, top 275 (matches reference CSS)
  badge: {
    position: "absolute",
    left: 144,
    top: 275,
    width: 100,
    height: 100,
  },
  // Title appears around y=410-445 in reference, centered horizontally.
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
  // Subtitle: two lines, gray, around y=455-505.
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
  // Button: full-width minus 24 horizontal padding, h=56, y=520 in reference.
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
