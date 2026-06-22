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

const STEPS = ["Submitted", "Verifying", "Paid"] as const;

export default function SubmittedScreen() {
  const router = useRouter();
  const colors = useColors();
  const insets = useSafeAreaInsets();

  const iconScale   = useSharedValue(0);
  const iconOpacity = useSharedValue(0);
  const ringScale   = useSharedValue(0.5);
  const ringOp      = useSharedValue(0);

  useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    iconOpacity.value = withTiming(1, { duration: 300 });
    iconScale.value   = withSequence(
      withSpring(1.25, { damping: 7,  stiffness: 180 }),
      withSpring(1.0,  { damping: 14, stiffness: 180 }),
    );
    ringOp.value    = withDelay(100, withTiming(1,   { duration: 400 }));
    ringScale.value = withDelay(100, withSpring(1.0, { damping: 12, stiffness: 100 }));
  }, []);

  const iconStyle = useAnimatedStyle(() => ({
    opacity:   iconOpacity.value,
    transform: [{ scale: iconScale.value }],
  }));
  const ringStyle = useAnimatedStyle(() => ({
    opacity:   ringOp.value,
    transform: [{ scale: ringScale.value }],
  }));

  return (
    <View
      style={[
        s.root,
        { backgroundColor: colors.background, paddingTop: insets.top + 40, paddingBottom: insets.bottom + 24 },
      ]}
    >
      {/* Animated success icon */}
      <View style={s.iconWrap}>
        <Animated.View style={[s.outerRing, ringStyle]} />
        <Animated.View style={[s.iconCircle, iconStyle]}>
          <Feather name="check" size={38} color={colors.accent} />
        </Animated.View>
      </View>

      <Animated.View entering={FadeInDown.duration(380).springify().delay(240)} style={s.textBlock}>
        <Text style={[s.heading, { color: colors.text }]}>Submitted!</Text>
        <Text style={[s.sub, { color: colors.mutedForeground }]}>
          Your gift card has been submitted for verification. Payment will be sent shortly.
        </Text>
      </Animated.View>

      {/* Status stepper */}
      <Animated.View entering={FadeInUp.duration(360).springify().delay(320)} style={s.stepperRow}>
        {STEPS.map((step, i) => (
          <React.Fragment key={step}>
            <View style={s.stepItem}>
              <View style={[
                s.stepDot,
                { backgroundColor: i === 0 ? colors.accent : colors.surface, borderColor: colors.border },
              ]}>
                {i === 0 && <Feather name="check" size={10} color={colors.primaryForeground} />}
              </View>
              <Text style={[s.stepLabel, { color: i === 0 ? colors.text : colors.mutedForeground }]}>
                {step}
              </Text>
            </View>
            {i < STEPS.length - 1 && (
              <View style={[s.stepLine, { backgroundColor: colors.border }]} />
            )}
          </React.Fragment>
        ))}
      </Animated.View>

      <Animated.View entering={FadeInUp.duration(360).springify().delay(380)} style={s.actions}>
        <AZAButton title="Go to Dashboard"     onPress={() => router.replace("/(app)/dashboard")} />
        <AZAButton title="View Transactions"   onPress={() => router.replace("/(app)/transactions")} variant="outline" />
      </Animated.View>
    </View>
  );
}

const s = StyleSheet.create({
  root:      { flex: 1, alignItems: "center", paddingHorizontal: 28, gap: 24, justifyContent: "center" },
  iconWrap:  { alignItems: "center", justifyContent: "center", marginBottom: 4 },
  outerRing: {
    position: "absolute",
    width: 120, height: 120, borderRadius: 60,
    borderWidth: 1.5, borderColor: "rgba(0,217,160,0.22)",
  },
  iconCircle: {
    width: 88, height: 88, borderRadius: 44,
    backgroundColor: "rgba(0,217,160,0.12)",
    alignItems: "center", justifyContent: "center",
    borderWidth: 1.5, borderColor: "rgba(0,217,160,0.28)",
  },
  textBlock: { alignItems: "center", gap: 8 },
  heading:   { fontSize: 28, fontFamily: "Manrope_700Bold", letterSpacing: -0.5 },
  sub:       { fontSize: 14, fontFamily: "Manrope_400Regular", textAlign: "center", lineHeight: 22 },

  stepperRow: { flexDirection: "row", alignItems: "center", gap: 0 },
  stepItem:   { alignItems: "center", gap: 6 },
  stepDot:    { width: 26, height: 26, borderRadius: 13, alignItems: "center", justifyContent: "center", borderWidth: 1 },
  stepLine:   { width: 40, height: 1.5, marginBottom: 20 },
  stepLabel:  { fontSize: 11, fontFamily: "Manrope_600SemiBold" },

  actions:    { width: "100%", gap: 12 },
});
