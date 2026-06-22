import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
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
import { AZAButton } from "@/components/AZAButton";
import { useColors } from "@/hooks/useColors";

export default function SuccessPaymentScreen() {
  const router = useRouter();
  const colors = useColors();
  const insets = useSafeAreaInsets();

  const iconScale = useSharedValue(0);
  const iconOp    = useSharedValue(0);
  const ringScale = useSharedValue(0.5);
  const ringOp    = useSharedValue(0);
  const amountOp  = useSharedValue(0);
  const amountY   = useSharedValue(20);

  useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    iconOp.value    = withTiming(1, { duration: 300 });
    iconScale.value = withSequence(
      withSpring(1.3,  { damping: 6,  stiffness: 180 }),
      withSpring(1.0,  { damping: 14, stiffness: 180 }),
    );
    ringOp.value    = withDelay(80,  withTiming(1,   { duration: 400 }));
    ringScale.value = withDelay(80,  withSpring(1.0, { damping: 12, stiffness: 100 }));
    amountOp.value  = withDelay(400, withTiming(1,   { duration: 450 }));
    amountY.value   = withDelay(400, withSpring(0,   { damping: 18, stiffness: 160 }));
  }, []);

  const iconStyle   = useAnimatedStyle(() => ({ opacity: iconOp.value,   transform: [{ scale: iconScale.value }] }));
  const ringStyle   = useAnimatedStyle(() => ({ opacity: ringOp.value,   transform: [{ scale: ringScale.value }] }));
  const amountStyle = useAnimatedStyle(() => ({ opacity: amountOp.value, transform: [{ translateY: amountY.value }] }));

  return (
    <View
      style={[
        s.root,
        { backgroundColor: colors.background, paddingTop: insets.top + 40, paddingBottom: insets.bottom + 24 },
      ]}
    >
      {/* Animated check */}
      <View style={s.iconWrap}>
        <Animated.View style={[s.outerRing, ringStyle]} />
        <Animated.View style={[s.iconCircle, iconStyle]}>
          <Feather name="check" size={44} color={colors.accent} />
        </Animated.View>
      </View>

      <Animated.View entering={FadeInDown.duration(380).springify().delay(260)} style={s.textBlock}>
        <Text style={[s.heading, { color: colors.text }]}>Payment Received!</Text>
        <Text style={[s.sub, { color: colors.mutedForeground }]}>
          Your wallet has been credited successfully.
        </Text>
      </Animated.View>

      {/* Amount */}
      <Animated.View
        style={[
          amountStyle,
          s.amountCard,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
      >
        <Text style={[s.amountLabel, { color: colors.mutedForeground }]}>Amount Credited</Text>
        <Text style={[s.amount, { color: colors.accent }]}>₦78,000.00</Text>
      </Animated.View>

      <Animated.View entering={FadeInUp.duration(360).springify().delay(380)} style={{ width: "100%" }}>
        <AZAButton
          title="Back to Dashboard"
          onPress={() => router.replace("/(app)/dashboard")}
        />
      </Animated.View>
    </View>
  );
}

const s = StyleSheet.create({
  root:       { flex: 1, alignItems: "center", paddingHorizontal: 28, gap: 24, justifyContent: "center" },
  iconWrap:   { alignItems: "center", justifyContent: "center" },
  outerRing:  {
    position: "absolute",
    width: 136, height: 136, borderRadius: 68,
    borderWidth: 1.5, borderColor: "rgba(0,217,160,0.20)",
  },
  iconCircle: {
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: "rgba(0,217,160,0.12)",
    alignItems: "center", justifyContent: "center",
    borderWidth: 2, borderColor: "rgba(0,217,160,0.30)",
  },
  textBlock:  { alignItems: "center", gap: 8 },
  heading:    { fontSize: 28, fontFamily: "Manrope_700Bold", letterSpacing: -0.5 },
  sub:        { fontSize: 14, fontFamily: "Manrope_400Regular", textAlign: "center", lineHeight: 22 },
  amountCard: {
    width: "100%", borderRadius: 20, borderWidth: 1,
    padding: 20, alignItems: "center", gap: 4,
  },
  amountLabel:{ fontSize: 12, fontFamily: "Manrope_400Regular" },
  amount:     { fontSize: 38, fontFamily: "Manrope_700Bold", letterSpacing: -1 },
});
