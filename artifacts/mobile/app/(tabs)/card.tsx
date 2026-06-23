import { Feather } from "@expo/vector-icons";
import React from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function CardScreen() {
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 48 : insets.top;

  return (
    <View style={[s.root, { paddingTop: topPad + 16 }]}>
      <Text style={s.title}>Card</Text>
      <View style={s.empty}>
        <View style={s.iconWrap}>
          <Feather name="credit-card" size={36} color="#8B5CF6" />
        </View>
        <Text style={s.emptyTitle}>Your Cards</Text>
        <Text style={s.emptyDesc}>Virtual and physical cards will appear here.</Text>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  root:       { flex: 1, backgroundColor: "#FFFFFF" },
  title: {
    fontSize: 22,
    fontFamily: "Manrope_700Bold",
    color: "#0B0A0A",
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
    gap: 12,
    paddingBottom: 80,
  },
  iconWrap: {
    width: 72, height: 72,
    borderRadius: 20,
    backgroundColor: "#8B5CF620",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: "Manrope_700Bold",
    color: "#0B0A0A",
    textAlign: "center",
  },
  emptyDesc: {
    fontSize: 14,
    fontFamily: "Manrope_400Regular",
    color: "#595F67",
    textAlign: "center",
    lineHeight: 22,
  },
});
