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

const SECTIONS = [
  {
    title: "Finance",
    items: [
      { id: "airtime",  label: "Airtime",      sublabel: "Buy airtime for any network",        icon: "phone"       as const, iconBg: "#FFFBEB", iconColor: "#D97706", route: "/(app)/airtime"  as const },
      { id: "data",     label: "Data Bundle",   sublabel: "Buy data for any network",           icon: "wifi"        as const, iconBg: "#EFF6FF", iconColor: "#2563EB", route: "/(app)/data"     as const },
      { id: "elec",     label: "Electricity",   sublabel: "Pay your electricity bill",          icon: "zap"         as const, iconBg: "#FFF7ED", iconColor: "#D97706", route: "/(app)/electricity" as const },
      { id: "cable",    label: "Cable TV",      sublabel: "Subscribe to DSTV, GOtv & more",     icon: "tv"          as const, iconBg: "#FFF1F2", iconColor: "#E11D48", route: "/(app)/cable"    as const },
      { id: "bills",    label: "Internet",      sublabel: "Pay your internet bill",             icon: "wifi"        as const, iconBg: "#EFF6FF", iconColor: "#2563EB", route: "/(app)/bills"    as const },
      { id: "bet",      label: "Betting",       sublabel: "Fund your betting account",          icon: "dollar-sign" as const, iconBg: "#ECFEFF", iconColor: "#0891B2", route: "/(app)/betting" as const },
      { id: "esim",     label: "eSIM",          sublabel: "International eSIM data plans",      icon: "globe"       as const, iconBg: "#F5F3FF", iconColor: "#7C3AED", route: "/(app)/esim"     as const },
    ],
  },
  {
    title: "Trading",
    items: [
      { id: "crypto",  label: "Cryptocurrency", sublabel: "Buy & sell crypto assets",           icon: "trending-up" as const, iconBg: "#F0FFF9", iconColor: "#26A17B", route: "/(app)/crypto"       as const },
      { id: "sell",    label: "Sell Gift Card",  sublabel: "Amazon, iTunes, Steam & more",      icon: "gift"        as const, iconBg: "#FFF2CF", iconColor: "#5C4000", route: "/(app)/sell-gift-card" as const },
      { id: "rates",   label: "Rates",           sublabel: "Current gift card & crypto rates",  icon: "bar-chart-2" as const, iconBg: "#F5F3FF", iconColor: "#7C3AED", route: "/(app)/rates"        as const },
    ],
  },
  {
    title: "Account",
    items: [
      { id: "referral", label: "Refer & Earn",  sublabel: "Earn ₦5,000 per referral",          icon: "users"       as const, iconBg: "#FFF0F0", iconColor: "#E11D48", route: "/(app)/referral"  as const },
      { id: "settings", label: "Settings",      sublabel: "Manage account & preferences",       icon: "settings"    as const, iconBg: "#F0F4FF", iconColor: "#2563EB", route: "/(app)/settings"  as const },
    ],
  },
];

export default function MoreScreen() {
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
        <Text style={s.title}>More</Text>
        <View style={{ width: 36 }} />
      </Animated.View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[s.scroll, { paddingBottom: insets.bottom + 100 }]}
      >
        {SECTIONS.map((section, si) => (
          <Animated.View key={section.title} entering={FadeInUp.duration(320).delay(si * 60)}>
            <Text style={s.sectionTitle}>{section.title}</Text>
            <View style={s.card}>
              {section.items.map((item, i) => (
                <View key={item.id}>
                  <TouchableOpacity
                    style={s.row}
                    activeOpacity={0.75}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      router.push(item.route as any);
                    }}
                  >
                    <View style={[s.iconWrap, { backgroundColor: item.iconBg }]}>
                      <Feather name={item.icon} size={20} color={item.iconColor} />
                    </View>
                    <View style={s.rowInfo}>
                      <Text style={s.rowLabel}>{item.label}</Text>
                      <Text style={s.rowSub}>{item.sublabel}</Text>
                    </View>
                    <Feather name="chevron-right" size={16} color={C.textMut} />
                  </TouchableOpacity>
                  {i < section.items.length - 1 && <View style={s.divider} />}
                </View>
              ))}
            </View>
          </Animated.View>
        ))}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },

  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingBottom: 12, paddingTop: 8 },
  backBtn: { width: 36, height: 36, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 18, fontFamily: "Manrope_700Bold", color: C.navy },

  scroll: { paddingHorizontal: 20, paddingTop: 8, gap: 6 },

  sectionTitle: { fontSize: 13, fontFamily: "Manrope_700Bold", color: C.textSec, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8, marginTop: 8 },

  card:    { borderRadius: 16, borderWidth: 1, borderColor: C.border, overflow: "hidden", backgroundColor: C.bg },
  row:     { flexDirection: "row", alignItems: "center", gap: 14, paddingVertical: 14, paddingHorizontal: 16 },
  iconWrap:{ width: 44, height: 44, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  rowInfo: { flex: 1, gap: 2 },
  rowLabel:{ fontSize: 14, fontFamily: "Manrope_600SemiBold", color: C.text },
  rowSub:  { fontSize: 11, fontFamily: "Manrope_400Regular", color: C.textMut },
  divider: { height: 1, backgroundColor: C.border, marginHorizontal: 16 },
});
