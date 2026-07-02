import * as Haptics from "expo-haptics";
import React from "react";
import {
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ChooseCardTypeScreen() {
  const insets = useSafeAreaInsets();
  const botPad = Platform.OS === "web" ? 32 : Math.max(insets.bottom, 16);

  return (
    <View style={s.root}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={{ flex: 1 }} />

      <View style={[s.ctaWrap, { paddingBottom: botPad }]}>
        <TouchableOpacity
          style={s.cta}
          activeOpacity={0.82}
          onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)}
        >
          <Text style={s.ctaText}>Get regular virtual card</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  ctaWrap: {
    paddingHorizontal: 24,
    paddingTop: 16,
    backgroundColor: "#FFFFFF",
  },
  cta: {
    backgroundColor: "#0B0A0A",
    borderRadius: 50,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
  },
  ctaText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 16,
    color: "#FFFFFF",
    letterSpacing: -0.2,
  },
});
