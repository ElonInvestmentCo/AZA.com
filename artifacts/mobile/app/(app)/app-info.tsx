import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React from "react";
import {
  Linking,
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
  textSec: "#6A707C",
  border:  "#E8ECF4",
  inputBg: "#F7F8F9",
  teal:    "#35C2C1",
  chevron: "#C5C6CC",
};

const LINKS = [
  { id: "terms",   label: "Terms of Service",  icon: "file-text"    as const },
  { id: "privacy", label: "Privacy Policy",    icon: "shield"       as const },
  { id: "license", label: "Open Source Licenses", icon: "code"      as const },
  { id: "rate",    label: "Rate PAYVORA",      icon: "star"         as const },
];

export default function AppInfoScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 48 : insets.top + 8;

  const handleLinkPress = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (id === "rate") {
      Linking.openURL("https://payvora.app").catch(() => {});
    }
  };

  return (
    <View style={[s.root, { paddingTop: topPad }]}>
      <Animated.View entering={FadeInDown.duration(280)} style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.back(); }} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Feather name="arrow-left" size={22} color={C.text} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>App Information</Text>
        <View style={{ width: 40 }} />
      </Animated.View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[s.scroll, { paddingBottom: insets.bottom + 40 }]}>
        <Animated.View entering={FadeInDown.duration(300).delay(40)} style={s.logoBlock}>
          <View style={s.logoCircle}>
            <Image
              source={require("@/assets/images/3d_avatar_16.png")}
              style={s.logo}
              contentFit="cover"
              cachePolicy="memory-disk"
            />
          </View>
          <Text style={s.appName}>PAYVORA</Text>
          <Text style={s.version}>Version 1.0.0 (Build 100)</Text>
        </Animated.View>

        <Animated.View entering={FadeInUp.duration(300).delay(80)} style={s.card}>
          <View style={s.infoRow}>
            <Text style={s.infoLabel}>Version</Text>
            <Text style={s.infoValue}>1.0.0</Text>
          </View>
          <View style={s.rowDivider} />
          <View style={s.infoRow}>
            <Text style={s.infoLabel}>Build number</Text>
            <Text style={s.infoValue}>100</Text>
          </View>
          <View style={s.rowDivider} />
          <View style={s.infoRow}>
            <Text style={s.infoLabel}>Platform</Text>
            <Text style={s.infoValue}>{Platform.OS === "ios" ? "iOS" : Platform.OS === "android" ? "Android" : "Web"}</Text>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInUp.duration(320).delay(120)} style={s.listCard}>
          {LINKS.map((item, i) => (
            <React.Fragment key={item.id}>
              <TouchableOpacity style={s.rowItem} activeOpacity={0.7} onPress={() => handleLinkPress(item.id)}>
                <Feather name={item.icon} size={18} color={C.textSec} style={{ marginRight: 12 }} />
                <Text style={s.rowLabel}>{item.label}</Text>
                <Feather name="chevron-right" size={16} color={C.chevron} />
              </TouchableOpacity>
              {i < LINKS.length - 1 && <View style={s.rowDivider} />}
            </React.Fragment>
          ))}
        </Animated.View>

        <Text style={s.footer}>Built with ❤️ for seamless gift card trading.{"\n"}© 2026 PAYVORA. All rights reserved.</Text>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg, paddingHorizontal: 20 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 20 },
  backBtn: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: 18, fontFamily: "Manrope_700Bold", color: C.text },

  scroll: { gap: 18 },

  logoBlock: { alignItems: "center", paddingVertical: 12 },
  logoCircle: { width: 84, height: 84, borderRadius: 24, overflow: "hidden", marginBottom: 14, borderWidth: 1, borderColor: C.border },
  logo: { width: "100%", height: "100%" },
  appName: { fontSize: 20, fontFamily: "Manrope_700Bold", color: C.text, letterSpacing: 0.5, marginBottom: 4 },
  version: { fontSize: 13, fontFamily: "Manrope_400Regular", color: C.textSec },

  card: { borderWidth: 1, borderColor: C.border, borderRadius: 16, backgroundColor: C.inputBg, paddingHorizontal: 16 },
  infoRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 14 },
  infoLabel: { fontSize: 13, fontFamily: "Manrope_500Medium", color: C.textSec },
  infoValue: { fontSize: 13, fontFamily: "Manrope_600SemiBold", color: C.text },

  listCard: { borderWidth: 1, borderColor: C.border, borderRadius: 16, overflow: "hidden", backgroundColor: C.bg },
  rowItem: { flexDirection: "row", alignItems: "center", paddingVertical: 14, paddingHorizontal: 16 },
  rowLabel: { flex: 1, fontSize: 14, fontFamily: "Manrope_600SemiBold", color: C.text },
  rowDivider: { height: 1, backgroundColor: C.border, marginHorizontal: 16 },

  footer: { fontSize: 11, fontFamily: "Manrope_400Regular", color: C.textSec, textAlign: "center", lineHeight: 17, marginTop: 4 },
});
