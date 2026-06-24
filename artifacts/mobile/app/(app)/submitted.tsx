import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SubmittedScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const iconScale   = useSharedValue(0);
  const iconOpacity = useSharedValue(0);
  const ringScale   = useSharedValue(0.5);
  const ringOp      = useSharedValue(0);
  const heroScale   = useSharedValue(0.8);
  const heroOpacity = useSharedValue(0);

  useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    heroOpacity.value = withTiming(1,   { duration: 500 });
    heroScale.value   = withSpring(1.0, { damping: 14, stiffness: 100 });

    iconOpacity.value = withDelay(200, withTiming(1, { duration: 300 }));
    iconScale.value   = withDelay(200, withSequence(
      withSpring(1.25, { damping: 7,  stiffness: 180 }),
      withSpring(1.0,  { damping: 14, stiffness: 180 }),
    ));
    ringOp.value    = withDelay(300, withTiming(1,   { duration: 400 }));
    ringScale.value = withDelay(300, withSpring(1.0, { damping: 12, stiffness: 100 }));
  }, []);

  const iconStyle = useAnimatedStyle(() => ({
    opacity:   iconOpacity.value,
    transform: [{ scale: iconScale.value }],
  }));
  const ringStyle = useAnimatedStyle(() => ({
    opacity:   ringOp.value,
    transform: [{ scale: ringScale.value }],
  }));
  const heroStyle = useAnimatedStyle(() => ({
    opacity:   heroOpacity.value,
    transform: [{ scale: heroScale.value }],
  }));

  return (
    <View
      style={[
        s.root,
        { backgroundColor: "#FFFFFF", paddingTop: insets.top + 24, paddingBottom: insets.bottom + 32 },
      ]}
    >
      {/* ── Superhero illustration placeholder ─────────────────────────────── */}
      <Animated.View style={[s.heroWrap, heroStyle]}>
        <View style={s.heroCard}>
          <View style={s.heroBadge}>
            <Feather name="star" size={32} color="#7C3AED" />
          </View>
          <View style={s.heroLines}>
            {["#FCB3C5", "#D6E1FF", "#FFF2CF", "#D6E1FF", "#FCB3C5"].map((col, i) => (
              <View key={i} style={[s.heroLine, { backgroundColor: col, width: 60 + i * 20 }]} />
            ))}
          </View>
          <View style={s.heroBadge2}>
            <Feather name="award" size={24} color="#F59E0B" />
          </View>
        </View>
      </Animated.View>

      {/* ── Animated success icon ──────────────────────────────────────────── */}
      <View style={s.iconWrap}>
        <Animated.View style={[s.outerRing, ringStyle]} />
        <Animated.View style={[s.iconCircle, iconStyle]}>
          <Feather name="check" size={42} color="#FFFFFF" />
        </Animated.View>
      </View>

      {/* ── Text ──────────────────────────────────────────────────────────── */}
      <Animated.View
        entering={FadeInDown.duration(380).springify().delay(320)}
        style={s.textBlock}
      >
        <Text style={s.heading}>Trade Submitted</Text>
        <Text style={s.sub}>Your trade has been submitted successfully</Text>
      </Animated.View>

      {/* ── Buttons ───────────────────────────────────────────────────────── */}
      <Animated.View
        entering={FadeInUp.duration(360).springify().delay(440)}
        style={s.actions}
      >
        <TouchableOpacity
          style={s.doneBtn}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.replace("/(tabs)");
          }}
          activeOpacity={0.85}
        >
          <Text style={s.doneBtnText}>Done</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={s.outlineBtn}
          onPress={() => router.replace("/(app)/transactions")}
          activeOpacity={0.75}
        >
          <Text style={s.outlineBtnText}>View Transactions</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const s = StyleSheet.create({
  root: {
    flex: 1, alignItems: "center", paddingHorizontal: 32, gap: 24, justifyContent: "center",
  },

  heroWrap: { width: "100%", alignItems: "center", marginBottom: 4 },
  heroCard: {
    width: 260, height: 150, backgroundColor: "#F8F9FA", borderRadius: 16,
    alignItems: "center", justifyContent: "center", overflow: "hidden",
    flexDirection: "row", gap: 20,
    shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 16, elevation: 3,
  },
  heroBadge:  {
    width: 64, height: 64, borderRadius: 32, backgroundColor: "#EDE9FE",
    alignItems: "center", justifyContent: "center",
  },
  heroBadge2: {
    width: 48, height: 48, borderRadius: 24, backgroundColor: "#FEF3C7",
    alignItems: "center", justifyContent: "center",
  },
  heroLines: { gap: 6, alignItems: "flex-start" },
  heroLine:  { height: 8, borderRadius: 4, backgroundColor: "#FCB3C5" },

  iconWrap: { alignItems: "center", justifyContent: "center", marginBottom: 4 },
  outerRing: {
    position: "absolute", width: 130, height: 130, borderRadius: 65,
    borderWidth: 1.5, borderColor: "rgba(0,0,0,0.12)",
  },
  iconCircle: {
    width: 100, height: 100, borderRadius: 50, backgroundColor: "#000000",
    alignItems: "center", justifyContent: "center",
  },

  textBlock: { alignItems: "center", gap: 10 },
  heading: {
    fontSize: 26, fontFamily: "Manrope_700Bold", color: "#1E232C", letterSpacing: -0.4,
  },
  sub: {
    fontSize: 15, fontFamily: "Manrope_400Regular", color: "#8391A1",
    textAlign: "center", lineHeight: 22,
  },

  actions: { width: "100%", gap: 12 },
  doneBtn: {
    backgroundColor: "#1E232C", height: 52, borderRadius: 8,
    alignItems: "center", justifyContent: "center",
  },
  doneBtnText: { fontSize: 15, fontFamily: "Manrope_600SemiBold", color: "#FFFFFF" },
  outlineBtn: {
    height: 52, borderRadius: 8, borderWidth: 1.5, borderColor: "#E8ECF4",
    alignItems: "center", justifyContent: "center",
  },
  outlineBtnText: { fontSize: 15, fontFamily: "Manrope_600SemiBold", color: "#1E232C" },
});
