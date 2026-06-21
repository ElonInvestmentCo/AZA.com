import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";

const PIN_LENGTH = 4;
const KEYPAD = [
  ["1", "2", "3"],
  ["4", "5", "6"],
  ["7", "8", "9"],
  ["", "0", "⌫"],
];

export default function PinScreen() {
  const router = useRouter();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [pin, setPin] = useState("");

  const handleKey = (key: string) => {
    if (key === "⌫") {
      setPin((p) => p.slice(0, -1));
      return;
    }
    if (key === "") return;
    if (pin.length >= PIN_LENGTH) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const next = pin + key;
    setPin(next);
    if (next.length === PIN_LENGTH) {
      setTimeout(() => {
        router.replace("/(app)/dashboard");
      }, 300);
    }
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background, paddingTop: insets.top + 40, paddingBottom: insets.bottom + 24 },
      ]}
    >
      <Text style={[styles.logo, { color: colors.text }]}>aza</Text>
      <Text style={[styles.heading, { color: colors.text }]}>Enter Your PIN</Text>
      <Text style={[styles.sub, { color: colors.mutedForeground }]}>
        Set up a 4-digit PIN for quick access
      </Text>

      <View style={styles.dots}>
        {Array.from({ length: PIN_LENGTH }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              {
                backgroundColor:
                  i < pin.length ? colors.primary : colors.border,
                borderColor: colors.border,
              },
            ]}
          />
        ))}
      </View>

      <View style={styles.keypad}>
        {KEYPAD.map((row, ri) => (
          <View key={ri} style={styles.row}>
            {row.map((key, ki) => (
              <TouchableOpacity
                key={ki}
                style={[
                  styles.key,
                  {
                    backgroundColor: key === "" ? "transparent" : colors.card,
                    borderColor: colors.border,
                  },
                ]}
                onPress={() => handleKey(key)}
                activeOpacity={key === "" ? 1 : 0.7}
                disabled={key === ""}
              >
                <Text
                  style={[
                    styles.keyText,
                    {
                      color: key === "⌫" ? colors.mutedForeground : colors.text,
                      fontSize: key === "⌫" ? 20 : 24,
                    },
                  ]}
                >
                  {key}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", paddingHorizontal: 28 },
  logo: { fontSize: 32, fontFamily: "Manrope_700Bold", letterSpacing: -1, marginBottom: 40 },
  heading: { fontSize: 24, fontFamily: "Manrope_700Bold", letterSpacing: -0.5, marginBottom: 8 },
  sub: { fontSize: 14, fontFamily: "Manrope_400Regular", textAlign: "center", marginBottom: 40 },
  dots: { flexDirection: "row", gap: 16, marginBottom: 48 },
  dot: { width: 16, height: 16, borderRadius: 8, borderWidth: 1.5 },
  keypad: { gap: 12, width: "100%" },
  row: { flexDirection: "row", justifyContent: "center", gap: 16 },
  key: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  keyText: { fontFamily: "Manrope_600SemiBold" },
});
