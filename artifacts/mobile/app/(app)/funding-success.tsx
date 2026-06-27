import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect } from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { rf } from "@/utils/responsive";

/* ── Design tokens ────────────────────────────────────────────────────────── */
const C = {
  bg:      "#FFFFFF",
  text:    "#0B0A0A",
  navy:    "#061941",
  textSec: "#595F67",
  textMut: "#8A9099",
  border:  "#F0F0F0",
  success: "#00B03C",
  black:   "#010101",
};

/* ── Animated circle + checkmark ─────────────────────────────────────────── */
function SuccessIcon() {
  const circleScale  = useSharedValue(0);
  const circleOpacity = useSharedValue(0);
  const checkScale   = useSharedValue(0);
  const ringScale    = useSharedValue(0);
  const ringOpacity  = useSharedValue(0);

  useEffect(() => {
    /* 1. Outer pulse ring — starts faint */
    ringOpacity.value = withDelay(100, withTiming(1, { duration: 60 }));
    ringScale.value   = withDelay(100, withSpring(1, { damping: 8, stiffness: 120 }));
    /* 2. Main circle bounces in */
    circleOpacity.value = withDelay(120, withTiming(1, { duration: 80 }));
    circleScale.value   = withDelay(120, withSpring(1, { damping: 10, stiffness: 160 }));
    /* 3. Checkmark pops in after circle settles */
    checkScale.value = withDelay(
      360,
      withSequence(
        withSpring(1.25, { damping: 6, stiffness: 220 }),
        withSpring(1,    { damping: 12, stiffness: 200 }),
      ),
    );
    /* 4. Ring fades out slowly (pulse effect) */
    ringOpacity.value = withDelay(500, withTiming(0, { duration: 600 }));
  }, []);

  const circleStyle = useAnimatedStyle(() => ({
    opacity:   circleOpacity.value,
    transform: [{ scale: circleScale.value }],
  }));

  const checkStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkScale.value }],
  }));

  const ringStyle = useAnimatedStyle(() => ({
    opacity:   ringOpacity.value,
    transform: [{ scale: ringScale.value }],
  }));

  return (
    <View style={ic.wrap}>
      {/* Outer pulse ring */}
      <Animated.View style={[ic.ring, ringStyle]} />
      {/* Green circle */}
      <Animated.View style={[ic.circle, circleStyle]}>
        {/* Checkmark */}
        <Animated.View style={checkStyle}>
          <Feather name="check" size={46} color="#FFFFFF" strokeWidth={3} />
        </Animated.View>
      </Animated.View>
    </View>
  );
}

const ic = StyleSheet.create({
  wrap:   { alignItems: "center", justifyContent: "center", width: 140, height: 140 },
  ring:   {
    position: "absolute",
    width: 140, height: 140, borderRadius: 70,
    borderWidth: 2, borderColor: C.success + "44",
    backgroundColor: C.success + "0D",
  },
  circle: {
    width: 104, height: 104, borderRadius: 52,
    backgroundColor: C.success,
    alignItems: "center", justifyContent: "center",
    shadowColor: C.success,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 12,
  },
});

/* ── Detail row ───────────────────────────────────────────────────────────── */
function DetailRow({
  label,
  value,
  valueColor,
  bold,
}: {
  label: string;
  value: string;
  valueColor?: string;
  bold?: boolean;
}) {
  return (
    <View style={dr.row}>
      <Text style={dr.label}>{label}</Text>
      <Text
        style={[
          dr.value,
          bold && { fontFamily: "Manrope_700Bold" },
          valueColor ? { color: valueColor } : null,
        ]}
        numberOfLines={1}
        adjustsFontSizeToFit
      >
        {value}
      </Text>
    </View>
  );
}

const dr = StyleSheet.create({
  row:   { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 13 },
  label: { fontSize: rf(13), fontFamily: "Manrope_400Regular", color: C.textSec },
  value: { fontSize: rf(13), fontFamily: "Manrope_600SemiBold", color: C.text, flex: 1, textAlign: "right", marginLeft: 16 },
});

/* ── Main screen ──────────────────────────────────────────────────────────── */
export default function FundingSuccessScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{
    amount: string;
    ref:    string;
    date:   string;
    time:   string;
    bank:   string;
  }>();

  const amount = params.amount ?? "₦0";
  const ref    = params.ref    ?? "TXN-000000-FW";
  const date   = params.date   ?? "";
  const time   = params.time   ?? "";
  const bank   = params.bank   ?? "";

  const topPad    = Platform.OS === "web" ? 20 : insets.top;
  const bottomPad = Math.max(insets.bottom, 16);

  const handleDone = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.dismissAll();
  };

  const handleViewTransaction = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.replace("/(tabs)/history" as any);
  };

  return (
    <View style={[s.root, { paddingTop: topPad }]}>

      {/* ── Close button (top-right) ── */}
      <Animated.View entering={FadeIn.duration(300).delay(600)} style={s.closeRow}>
        <Pressable
          onPress={handleDone}
          style={s.closeBtn}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Feather name="x" size={20} color={C.textSec} />
        </Pressable>
      </Animated.View>

      {/* ── Icon + heading ── */}
      <View style={s.heroSection}>
        <SuccessIcon />

        <Animated.View
          entering={FadeInDown.duration(320).springify().delay(300)}
          style={s.headingWrap}
        >
          <Text style={s.title}>Funding Successful</Text>
          <Text style={s.subtitle}>
            Your wallet has been funded successfully.{"\n"}The funds are now available for use.
          </Text>
        </Animated.View>
      </View>

      {/* ── Amount pill ── */}
      <Animated.View
        entering={FadeInDown.duration(300).springify().delay(380)}
        style={s.amountPill}
      >
        <Text style={s.amountLabel}>Amount Funded</Text>
        <Text style={s.amountValue}>{amount}</Text>
      </Animated.View>

      {/* ── Transaction details card ── */}
      <Animated.View
        entering={FadeInDown.duration(300).springify().delay(440)}
        style={s.card}
      >
        {bank ? (
          <>
            <DetailRow label="Bank" value={bank} />
            <View style={s.divider} />
          </>
        ) : null}
        <DetailRow label="Reference" value={ref} bold />
        {date ? (
          <>
            <View style={s.divider} />
            <DetailRow label="Date" value={date} />
          </>
        ) : null}
        {time ? (
          <>
            <View style={s.divider} />
            <DetailRow label="Time" value={time} />
          </>
        ) : null}
        <View style={s.divider} />
        <DetailRow label="Status" value="Successful" valueColor={C.success} bold />
        <View style={s.divider} />
        <DetailRow label="Fee" value="₦0.00" valueColor={C.success} />
      </Animated.View>

      {/* ── Actions ── */}
      <Animated.View
        entering={FadeInDown.duration(300).springify().delay(500)}
        style={[s.actions, { paddingBottom: bottomPad + 8 }]}
      >
        <TouchableOpacity style={s.doneBtn} onPress={handleDone} activeOpacity={0.85}>
          <Text style={s.doneBtnText}>Done</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={s.viewTxBtn}
          onPress={handleViewTransaction}
          activeOpacity={0.75}
        >
          <Feather name="list" size={15} color={C.navy} />
          <Text style={s.viewTxText}>View Transaction</Text>
        </TouchableOpacity>
      </Animated.View>

    </View>
  );
}

const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: C.bg,
    paddingHorizontal: 24,
  },

  closeRow: {
    alignItems: "flex-end",
    paddingTop: 8,
    paddingBottom: 4,
  },
  closeBtn: {
    width: 36, height: 36,
    borderRadius: 18,
    backgroundColor: "#F5F6F7",
    alignItems: "center", justifyContent: "center",
  },

  heroSection: {
    alignItems: "center",
    paddingTop: 16,
    paddingBottom: 24,
    gap: 20,
  },

  headingWrap: { alignItems: "center", gap: 8 },
  title: {
    fontSize: rf(24),
    fontFamily: "Manrope_700Bold",
    color: C.navy,
    letterSpacing: -0.4,
    textAlign: "center",
  },
  subtitle: {
    fontSize: rf(13),
    fontFamily: "Manrope_400Regular",
    color: C.textSec,
    textAlign: "center",
    lineHeight: 20,
    maxWidth: 280,
  },

  amountPill: {
    backgroundColor: C.success + "10",
    borderWidth: 1,
    borderColor: C.success + "30",
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: "center",
    gap: 4,
    marginBottom: 16,
  },
  amountLabel: {
    fontSize: rf(11),
    fontFamily: "Manrope_600SemiBold",
    color: C.success,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  amountValue: {
    fontSize: rf(32),
    fontFamily: "Manrope_700Bold",
    color: C.navy,
    letterSpacing: -0.5,
  },

  card: {
    backgroundColor: "#F8F9FA",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: C.border,
    paddingHorizontal: 18,
    marginBottom: 24,
  },
  divider: { height: 1, backgroundColor: C.border },

  actions: {
    gap: 10,
    marginTop: "auto" as any,
  },
  doneBtn: {
    height: 52,
    backgroundColor: C.black,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 6,
  },
  doneBtnText: {
    fontSize: rf(15),
    fontFamily: "Manrope_700Bold",
    color: "#FFFFFF",
    letterSpacing: -0.1,
  },
  viewTxBtn: {
    height: 48,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: C.navy + "25",
    backgroundColor: C.navy + "06",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  viewTxText: {
    fontSize: rf(14),
    fontFamily: "Manrope_600SemiBold",
    color: C.navy,
    letterSpacing: -0.1,
  },
});
