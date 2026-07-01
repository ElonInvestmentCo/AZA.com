import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { rf } from "@/utils/responsive";

const C = {
  bg:      "#FFFFFF",
  text:    "#0B0A0A",
  navy:    "#061941",
  textSec: "#595F67",
  textMut: "#AAAFB5",
  border:  "#F0F0F0",
};

type CardType = "virtual" | "disposable";

const CARD_INFO: Record<CardType, { title: string; body: string }> = {
  virtual: {
    title: "Virtual card",
    body: "Instant and ready to use online. Add to Apple Pay and use it to pay in stores, just like a physical card.",
  },
  disposable: {
    title: "Disposable virtual card",
    body: "Single-use card for extra security. Expires after one transaction, keeping your main account safe.",
  },
};

function CardVisual() {
  return (
    <View style={card.shell}>
      {/* Gradient overlay */}
      <View style={card.gradient} />
      {/* Watermark P */}
      <Text style={card.watermark}>P</Text>
      {/* CARD HOLDER — vertical left */}
      <Text style={card.labelLeft}>CARD HOLDER</Text>
      {/* VIRTUAL — vertical right */}
      <Text style={card.labelRight}>VIRTUAL</Text>
      {/* Bottom row */}
      <View style={card.bottom}>
        {/* Mastercard */}
        <View style={card.mcWrap}>
          <View style={[card.mcCircle, { backgroundColor: "#EB001B", left: 0 }]} />
          <View style={[card.mcCircle, { backgroundColor: "#F79E1B", left: 18 }]} />
          <Text style={card.mcText}>mastercard</Text>
        </View>
        {/* Payvora */}
        <View style={card.pvWrap}>
          <View style={card.pvCircle}>
            <Text style={card.pvP}>P</Text>
          </View>
          <Text style={card.pvName}>PAYVORA</Text>
        </View>
      </View>
    </View>
  );
}

function ToggleButton({ label, active, onPress, icon }: { label: string; active: boolean; onPress: () => void; icon: React.ComponentProps<typeof Feather>["name"] }) {
  const sc = useSharedValue(1);
  const anim = useAnimatedStyle(() => ({ transform: [{ scale: sc.value }] }));
  return (
    <Animated.View style={[anim, { flex: label === "Virtual" ? 0 : 1 }]}>
      <Pressable
        onPressIn={() => { sc.value = withSpring(0.94, { damping: 14 }); }}
        onPressOut={() => { sc.value = withSpring(1, { damping: 14 }); }}
        onPress={() => { Haptics.selectionAsync(); onPress(); }}
        style={[
          tog.btn,
          active ? tog.active : tog.inactive,
          label === "Virtual" ? {} : { flex: 1 },
        ]}
      >
        <Feather name={icon} size={15} color={active ? "#FFFFFF" : "#555555"} style={{ opacity: active ? 1 : 0.6 }} />
        <Text style={[tog.label, { color: active ? "#FFFFFF" : "#333333" }]}>{label}</Text>
      </Pressable>
    </Animated.View>
  );
}

export default function CardsScreen() {
  const router  = useRouter();
  const insets  = useSafeAreaInsets();
  const topPad  = Platform.OS === "web" ? 48 : insets.top;
  const [selected, setSelected] = useState<CardType>("virtual");

  const btnScale = useSharedValue(1);
  const btnAnim  = useAnimatedStyle(() => ({ transform: [{ scale: btnScale.value }] }));

  const handleGetCard = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.push("/(app)/success-payment" as any);
  };

  return (
    <View style={[s.root, { paddingTop: topPad }]}>

      {/* Header */}
      <Animated.View entering={FadeInDown.duration(280)} style={s.header}>
        <View style={{ width: 36 }} />
        <Text style={s.title}>Choose a card type</Text>
        <TouchableOpacity
          style={s.headerBtn}
          onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.push("/(app)/settings" as any); }}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Feather name="settings" size={20} color={C.navy} />
        </TouchableOpacity>
      </Animated.View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[s.scroll, { paddingBottom: insets.bottom + 110 }]}
      >

        {/* Card visual */}
        <Animated.View entering={FadeInDown.duration(360).springify().delay(40)}>
          <CardVisual />
        </Animated.View>

        {/* Toggle row */}
        <Animated.View entering={FadeInUp.duration(320).springify().delay(80)} style={s.toggleRow}>
          <ToggleButton
            label="Virtual"
            active={selected === "virtual"}
            onPress={() => setSelected("virtual")}
            icon="credit-card"
          />
          <ToggleButton
            label="Disposable virtual"
            active={selected === "disposable"}
            onPress={() => setSelected("disposable")}
            icon="shield"
          />
        </Animated.View>

        {/* Divider */}
        <Animated.View entering={FadeInUp.duration(300).delay(110)} style={s.divider} />

        {/* Description */}
        <Animated.View entering={FadeInUp.duration(320).springify().delay(140)} style={s.descRow}>
          <View style={s.descIconWrap}>
            <Feather name="shield" size={22} color="#555555" />
          </View>
          <View style={s.descText}>
            <Text style={s.descTitle}>{CARD_INFO[selected].title}</Text>
            <Text style={s.descBody}>{CARD_INFO[selected].body}</Text>
          </View>
        </Animated.View>

        {/* Existing cards section */}
        <Animated.View entering={FadeInUp.duration(300).delay(180)} style={s.existingSection}>
          <View style={s.existingHeader}>
            <Text style={s.existingTitle}>My Cards</Text>
            <TouchableOpacity onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.push("/(app)/card-status" as any); }}>
              <Text style={s.viewAll}>View Status</Text>
            </TouchableOpacity>
          </View>
          {/* Empty state */}
          <View style={s.emptyCard}>
            <Feather name="credit-card" size={32} color={C.textMut} />
            <Text style={s.emptyTitle}>No virtual cards yet</Text>
            <Text style={s.emptyBody}>Get your first virtual card to shop online safely.</Text>
          </View>
        </Animated.View>

      </ScrollView>

      {/* CTA — fixed at bottom */}
      <Animated.View
        entering={FadeInUp.duration(320).springify().delay(200)}
        style={[s.ctaWrap, { paddingBottom: insets.bottom + 90 }]}
      >
        <Animated.View style={btnAnim}>
          <Pressable
            onPressIn={() => { btnScale.value = withTiming(0.96, { duration: 80 }); }}
            onPressOut={() => { btnScale.value = withSpring(1, { damping: 14 }); }}
            onPress={handleGetCard}
            style={s.ctaBtn}
          >
            <Feather name="credit-card" size={18} color="#FFFFFF" />
            <Text style={s.ctaText}>Get virtual card</Text>
          </Pressable>
        </Animated.View>
      </Animated.View>

    </View>
  );
}

/* ─── Card visual styles ─────────────────────────────── */
const card = StyleSheet.create({
  shell: {
    marginHorizontal: 24,
    aspectRatio: 1.586,
    borderRadius: 22,
    backgroundColor: "#141414",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.3,
    shadowRadius: 30,
    elevation: 12,
    position: "relative",
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "transparent",
  },
  watermark: {
    position: "absolute",
    top: "15%",
    left: "30%",
    fontSize: 160,
    fontWeight: "900",
    color: "rgba(255,255,255,0.045)",
    lineHeight: 160,
    letterSpacing: -8,
  },
  labelLeft: {
    position: "absolute",
    left: 20,
    top: "50%",
    transform: [{ translateY: -6 }, { rotate: "-90deg" }],
    color: "rgba(255,255,255,0.82)",
    fontSize: 10,
    fontFamily: "Manrope_600SemiBold",
    letterSpacing: 3.5,
  },
  labelRight: {
    position: "absolute",
    right: 20,
    top: "50%",
    transform: [{ translateY: -6 }, { rotate: "90deg" }],
    color: "rgba(255,255,255,0.82)",
    fontSize: 10,
    fontFamily: "Manrope_600SemiBold",
    letterSpacing: 3.5,
  },
  bottom: {
    position: "absolute",
    bottom: 20,
    left: 22,
    right: 22,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  mcWrap:   { gap: 4 },
  mcCircle: { position: "absolute", width: 28, height: 28, borderRadius: 14, top: 0 },
  mcText:   { color: "rgba(255,255,255,0.7)", fontSize: 9, marginTop: 32, fontFamily: "Manrope_400Regular" },
  pvWrap:   { alignItems: "flex-end", gap: 4 },
  pvCircle: { width: 20, height: 20, borderRadius: 10, borderWidth: 1.5, borderColor: "rgba(255,255,255,0.6)", alignItems: "center", justifyContent: "center" },
  pvP:      { color: "rgba(255,255,255,0.85)", fontSize: 11, fontFamily: "Manrope_700Bold", lineHeight: 14 },
  pvName:   { color: "rgba(255,255,255,0.75)", fontSize: 9, letterSpacing: 2.5, fontFamily: "Manrope_600SemiBold" },
});

/* ─── Toggle styles ──────────────────────────────────── */
const tog = StyleSheet.create({
  btn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingHorizontal: 18,
    paddingVertical: 11,
    borderRadius: 50,
  },
  active:   { backgroundColor: "#000000" },
  inactive: { backgroundColor: "transparent", borderWidth: 1.5, borderColor: "#E0E0E0" },
  label:    { fontSize: rf(13), fontFamily: "Manrope_600SemiBold" },
});

/* ─── Screen styles ──────────────────────────────────── */
const s = StyleSheet.create({
  root:   { flex: 1, backgroundColor: C.bg },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 12,
    paddingTop: 8,
  },
  headerBtn: { width: 36, height: 36, alignItems: "center", justifyContent: "center" },
  title: { fontSize: rf(17), fontFamily: "Manrope_700Bold", color: C.navy, letterSpacing: -0.2 },

  scroll: { paddingTop: 8, gap: 24 },

  toggleRow: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 24,
  },

  divider: { height: 1, backgroundColor: C.border, marginHorizontal: 24 },

  descRow:     { flexDirection: "row", alignItems: "flex-start", gap: 14, paddingHorizontal: 24 },
  descIconWrap:{ width: 46, height: 46, borderRadius: 23, backgroundColor: "#F4F4F4", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  descText:    { flex: 1, gap: 4 },
  descTitle:   { fontSize: rf(15), fontFamily: "Manrope_700Bold", color: C.text, letterSpacing: -0.2 },
  descBody:    { fontSize: rf(13), fontFamily: "Manrope_400Regular", color: "#888888", lineHeight: rf(20) },

  existingSection: { paddingHorizontal: 24, gap: 12 },
  existingHeader:  { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  existingTitle:   { fontSize: rf(15), fontFamily: "Manrope_700Bold", color: C.text },
  viewAll:         { fontSize: rf(13), fontFamily: "Manrope_600SemiBold", color: "#000000" },

  emptyCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: C.border,
    borderStyle: "dashed",
    paddingVertical: 32,
    alignItems: "center",
    gap: 8,
    backgroundColor: "#FAFAFA",
  },
  emptyTitle: { fontSize: rf(14), fontFamily: "Manrope_600SemiBold", color: C.textSec },
  emptyBody:  { fontSize: rf(12), fontFamily: "Manrope_400Regular", color: C.textMut, textAlign: "center", maxWidth: 220 },

  ctaWrap: { paddingHorizontal: 24, paddingTop: 8, backgroundColor: C.bg },
  ctaBtn: {
    backgroundColor: "#000000",
    height: 52,
    borderRadius: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  ctaText: { fontSize: rf(15), fontFamily: "Manrope_700Bold", color: "#FFFFFF", letterSpacing: -0.2 },
});
