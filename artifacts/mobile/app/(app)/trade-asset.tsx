import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const C = {
  bg:      "#FFFFFF",
  text:    "#0B0A0A",
  navy:    "#061941",
  textSec: "#595F67",
  textMut: "#AAAFB5",
  border:  "#F0F0F0",
};

const ASSETS = [
  {
    id: "gift",
    title: "Gift Card",
    subtitle: "Sell Amazon, iTunes, Steam & more",
    bg: "#FFF2CF",
    iconBg: "rgba(92,64,0,0.12)",
    iconColor: "#5C4000",
    icon: "gift" as const,
    route: "/(app)/sell-gift-card" as const,
    badge: "Best Rate",
    badgeBg: "#5C4000",
  },
  {
    id: "crypto",
    title: "Cryptocurrency",
    subtitle: "Sell BTC, ETH, USDT & other coins",
    bg: "#F0FFF9",
    iconBg: "rgba(38,161,123,0.12)",
    iconColor: "#26A17B",
    icon: "trending-up" as const,
    route: "/(app)/crypto" as const,
    badge: "Fast",
    badgeBg: "#26A17B",
  },
  {
    id: "esim",
    title: "eSIM Data",
    subtitle: "Sell international eSIM data plans",
    bg: "#EFF6FF",
    iconBg: "rgba(37,99,235,0.12)",
    iconColor: "#2563EB",
    icon: "wifi" as const,
    route: "/(app)/esim" as const,
    badge: null,
    badgeBg: "",
  },
];

export default function TradeAssetScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 48 : insets.top;

  return (
    <View style={[s.root, { paddingTop: topPad }]}>

      {/* Header */}
      <Animated.View entering={FadeInDown.duration(280)} style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.back(); }}>
          <Feather name="arrow-left" size={20} color={C.navy} />
        </TouchableOpacity>
        <Text style={s.title}>Sell Assets</Text>
        <View style={{ width: 36 }} />
      </Animated.View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[s.scroll, { paddingBottom: insets.bottom + 100 }]}
      >

        <Animated.View entering={FadeInDown.duration(300).delay(30)}>
          <Text style={s.subtitle}>What would you like to sell today?</Text>
        </Animated.View>

        {ASSETS.map((item, i) => (
          <Animated.View key={item.id} entering={FadeInUp.duration(320).delay(60 + i * 60)}>
            <TouchableOpacity
              style={[s.card, { backgroundColor: item.bg }]}
              activeOpacity={0.82}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.push(item.route as any);
              }}
            >
              <View style={s.cardOrb} />

              <View style={s.cardLeft}>
                <View style={[s.iconWrap, { backgroundColor: item.iconBg }]}>
                  <Feather name={item.icon} size={28} color={item.iconColor} />
                </View>
                <View style={s.cardText}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                    <Text style={[s.cardTitle, { color: item.iconColor }]}>{item.title}</Text>
                    {item.badge && (
                      <View style={[s.badgePill, { backgroundColor: item.badgeBg }]}>
                        <Text style={s.badgeText}>{item.badge}</Text>
                      </View>
                    )}
                  </View>
                  <Text style={[s.cardSubtitle, { color: item.iconColor + "99" }]}>{item.subtitle}</Text>
                </View>
              </View>

              <Feather name="chevron-right" size={20} color={item.iconColor + "88"} />
            </TouchableOpacity>
          </Animated.View>
        ))}

        {/* Info card */}
        <Animated.View entering={FadeInUp.duration(300).delay(260)} style={s.infoCard}>
          <Feather name="shield" size={20} color="#2563EB" />
          <View style={{ flex: 1, gap: 3 }}>
            <Text style={s.infoTitle}>Secure & Fast Transactions</Text>
            <Text style={s.infoDesc}>All trades are processed securely with instant payouts to your wallet.</Text>
          </View>
        </Animated.View>

      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },

  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingBottom: 12, paddingTop: 8 },
  backBtn: { width: 36, height: 36, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 18, fontFamily: "Manrope_700Bold", color: C.navy },

  scroll: { paddingHorizontal: 20, paddingTop: 8, gap: 16 },
  subtitle: { fontSize: 14, fontFamily: "Manrope_400Regular", color: C.textSec, marginBottom: 4 },

  card: {
    borderRadius: 16, padding: 20, flexDirection: "row",
    alignItems: "center", justifyContent: "space-between",
    overflow: "hidden",
  },
  cardOrb: {
    position: "absolute", width: 120, height: 120, borderRadius: 60,
    backgroundColor: "rgba(255,255,255,0.25)", top: -30, right: -20,
  },
  cardLeft: { flexDirection: "row", alignItems: "center", gap: 14, flex: 1 },
  iconWrap: { width: 56, height: 56, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  cardText: { flex: 1, gap: 5 },
  cardTitle: { fontSize: 16, fontFamily: "Manrope_700Bold" },
  cardSubtitle: { fontSize: 12, fontFamily: "Manrope_400Regular", lineHeight: 17 },
  badgePill: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  badgeText: { fontSize: 9, fontFamily: "Manrope_700Bold", color: "#FFFFFF" },

  infoCard: {
    flexDirection: "row", gap: 12, alignItems: "flex-start",
    backgroundColor: "#EFF6FF", borderRadius: 12, padding: 16,
    borderWidth: 1, borderColor: "#BFDBFE",
  },
  infoTitle: { fontSize: 13, fontFamily: "Manrope_600SemiBold", color: "#1D4ED8" },
  infoDesc:  { fontSize: 12, fontFamily: "Manrope_400Regular", color: "#3B82F6", lineHeight: 17 },
});
