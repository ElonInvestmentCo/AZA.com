import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";

export default function CardScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user } = useAuth();
  const topPad = Platform.OS === "web" ? 48 : insets.top;

  return (
    <View style={[s.root, { backgroundColor: colors.background }]}>
      <Animated.View entering={FadeInDown.duration(350).springify()} style={[s.header, { paddingTop: topPad + 10 }]}>
        <Text style={[s.title, { color: colors.text }]}>Virtual Card</Text>
        <TouchableOpacity style={[s.hdrBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Feather name="plus" size={18} color={colors.primary} />
        </TouchableOpacity>
      </Animated.View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[s.scroll, { paddingBottom: insets.bottom + 100 }]}>
        {/* Card visual */}
        <Animated.View entering={FadeInDown.duration(400).springify().delay(60)}>
          <LinearGradient colors={["#1A1A2E", "#16213E"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.card}>
            <LinearGradient colors={["#00D9A030", "#8B5CF620"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
            <View style={s.cardOrb} />
            <View style={s.cardRow}>
              <Text style={s.cardBrand}>AZA</Text>
              <Feather name="wifi" size={22} color="rgba(255,255,255,0.6)" style={{ transform: [{ rotate: "90deg" }] }} />
            </View>
            <Text style={s.cardNum}>•••• •••• •••• 4521</Text>
            <View style={s.cardBottom}>
              <View>
                <Text style={s.cardLbl}>Card Holder</Text>
                <Text style={s.cardVal}>{user?.name ?? "Card Holder"}</Text>
              </View>
              <View>
                <Text style={s.cardLbl}>Expires</Text>
                <Text style={s.cardVal}>12/28</Text>
              </View>
              <View style={s.visaBox}>
                <Text style={s.visaTxt}>VISA</Text>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Balance */}
        <Animated.View entering={FadeInUp.duration(360).springify().delay(100)} style={[s.balBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[s.balLbl, { color: colors.mutedForeground }]}>Available Balance</Text>
          <Text style={[s.balAmt, { color: colors.text }]}>₦{(user?.balance ?? 0).toLocaleString("en-NG", { minimumFractionDigits: 2 })}</Text>
        </Animated.View>

        {/* Actions */}
        <Animated.View entering={FadeInUp.duration(360).springify().delay(140)} style={s.actRow}>
          {[
            { icon: "plus"      as const, label: "Fund Card",  color: "#00D9A0" },
            { icon: "send"      as const, label: "Transfer",   color: "#3B82F6" },
            { icon: "lock"      as const, label: "Freeze",     color: "#8B5CF6" },
            { icon: "settings"  as const, label: "Settings",   color: "#F59E0B" },
          ].map(a => (
            <TouchableOpacity key={a.label} style={[s.actItem]}
              onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)} activeOpacity={0.75}>
              <View style={[s.actIcon, { backgroundColor: a.color + "20" }]}>
                <Feather name={a.icon} size={20} color={a.color} />
              </View>
              <Text style={[s.actLbl, { color: colors.mutedForeground }]}>{a.label}</Text>
            </TouchableOpacity>
          ))}
        </Animated.View>

        {/* CTA */}
        <Animated.View entering={FadeInUp.duration(340).springify().delay(180)} style={{ paddingHorizontal: 20 }}>
          <TouchableOpacity
            style={[s.cta, { backgroundColor: colors.primary }]}
            onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); router.push("/(app)/dashboard"); }}
            activeOpacity={0.85}
          >
            <Text style={[s.ctaTxt, { color: colors.background }]}>View Full Dashboard</Text>
            <Feather name="arrow-right" size={18} color={colors.background} />
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root:   { flex: 1 },
  scroll: { paddingTop: 8, gap: 20 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, paddingBottom: 12 },
  title:  { fontSize: 24, fontFamily: "Manrope_700Bold" },
  hdrBtn: { width: 40, height: 40, borderRadius: 12, borderWidth: 1, alignItems: "center", justifyContent: "center" },

  card: { marginHorizontal: 20, borderRadius: 24, padding: 24, gap: 20, overflow: "hidden", shadowColor: "#000", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 20, elevation: 10 },
  cardOrb: { position: "absolute", width: 200, height: 200, borderRadius: 100, backgroundColor: "rgba(0,217,160,0.06)", top: -60, right: -60 },
  cardRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  cardBrand: { fontSize: 22, fontFamily: "Manrope_700Bold", color: "#FFFFFF", letterSpacing: 2 },
  cardNum: { fontSize: 18, fontFamily: "Manrope_600SemiBold", color: "rgba(255,255,255,0.85)", letterSpacing: 4 },
  cardBottom: { flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between" },
  cardLbl: { fontSize: 10, fontFamily: "Manrope_400Regular", color: "rgba(255,255,255,0.55)", marginBottom: 3, textTransform: "uppercase", letterSpacing: 0.8 },
  cardVal: { fontSize: 13, fontFamily: "Manrope_600SemiBold", color: "#FFFFFF" },
  visaBox: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 6, borderWidth: 1, borderColor: "rgba(255,255,255,0.3)" },
  visaTxt: { fontSize: 16, fontFamily: "Manrope_700Bold", color: "#FFFFFF", fontStyle: "italic", letterSpacing: 1 },

  balBox: { marginHorizontal: 20, borderRadius: 18, borderWidth: 1, padding: 20, alignItems: "center", gap: 6 },
  balLbl: { fontSize: 13, fontFamily: "Manrope_400Regular" },
  balAmt: { fontSize: 32, fontFamily: "Manrope_700Bold", letterSpacing: -1 },

  actRow: { flexDirection: "row", justifyContent: "space-around", paddingHorizontal: 20 },
  actItem: { alignItems: "center", gap: 8 },
  actIcon: { width: 54, height: 54, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  actLbl:  { fontSize: 11, fontFamily: "Manrope_500Medium" },

  cta:    { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, height: 56, borderRadius: 16 },
  ctaTxt: { fontSize: 15, fontFamily: "Manrope_700Bold" },
});
