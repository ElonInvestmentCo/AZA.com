import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TradeReplicaLauncher() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <View style={styles.container} testID="trade-replica-launcher">
        <Text style={styles.title}>Trade Replica Launcher</Text>
        <Text style={styles.subtitle}>
          Development / testing only. Tap a button to open the replica screen.
        </Text>

        <TouchableOpacity
          testID="open-trade-submitted-replica-button"
          activeOpacity={0.85}
          style={styles.button}
          onPress={() => router.push("/trade-submitted-replica")}
        >
          <Text style={styles.buttonText}>TradeSubmittedReplica</Text>
        </TouchableOpacity>

        <TouchableOpacity
          testID="open-trade-rejected-replica-button"
          activeOpacity={0.85}
          style={styles.button}
          onPress={() => router.push("/trade-rejected-replica")}
        >
          <Text style={styles.buttonText}>TradeRejectedReplica</Text>
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
    paddingTop: 32,
    gap: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1F232C",
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 16,
    lineHeight: 20,
  },
  button: {
    backgroundColor: "#1F232C",
    borderRadius: 12,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
