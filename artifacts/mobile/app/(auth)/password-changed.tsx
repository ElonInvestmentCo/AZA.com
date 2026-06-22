import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { AZAButton } from "@/components/AZAButton";
import { useColors } from "@/hooks/useColors";

export default function PasswordChangedScreen() {
  const router = useRouter();
  const colors = useColors();
  const insets = useSafeAreaInsets();

  const iconScale   = useSharedValue(0);
  const iconOpacity = useSharedValue(0);
  const ringScale   = useSharedValue(0.6);
  const ringOpacity = useSharedValue(0);

  useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    iconOpacity.value = withTiming(1, { duration: 300 });
    iconScale.value   = withSequence(
      withSpring(1.2, { damping: 8,  stiffness: 200 }),
      withSpring(1.0, { damping: 14, stiffness: 180 }),
    );
    ringOpacity.value = withDelay(100, withTiming(1,   { duration: 400 }));
    ringScale.value   = withDelay(100, withSpring(1.0, { damping: 14, stiffness: 120 }));
  }, []);

  const iconStyle = useAnimatedStyle(() => ({
    opacity:   iconOpacity.value,
    transform: [{ scale: iconScale.value }],
  }));

  const ringStyle = useAnimatedStyle(() => ({
    opacity:   ringOpacity.value,
    transform: [{ scale: ringScale.value }],
  }));

  return (
    <View
      style={[
        s.root,
        { backgroundColor: colors.background, paddingTop: insets.top + 40, paddingBottom: insets.bottom + 24 },
      ]}
    >
      <View style={s.iconWrap}>
        <Animated.View style={[s.ring, ringStyle]} />
        <Animated.View style={[s.iconCircle, iconStyle]}>
          <Feather name="check" size={40} color={colors.accent} />
        </Animated.View>
      </View>

      <Animated.View entering={FadeInDown.duration(400).springify().delay(200)} style={s.textBlock}>
        <Text style={[s.heading, { color: colors.text }]}>Password Updated!</Text>
        <Text style={[s.sub, { color: colors.mutedForeground }]}>
          Your password has been changed successfully. You can now sign in with your new password.
        </Text>
      </Animated.View>

      <Animated.View entering={FadeInDown.duration(400).springify().delay(320)} style={{ width: "100%" }}>
        <AZAButton title="Back to Login" onPress={() => router.replace("/(auth)/login")} />
      </Animated.View>
    </View>
  );
}

const C_ACCENT = "#00D9A0";

const s = StyleSheet.create({
  root:      { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 28, gap: 28 },
  iconWrap:  { alignItems: "center", justifyContent: "center", marginBottom: 8 },
  ring: {
    position: "absolute",
    width: 120, height: 120, borderRadius: 60,
    borderWidth: 1.5, borderColor: "rgba(0,217,160,0.25)",
  },
  iconCircle: {
    width: 88, height: 88, borderRadius: 44,
    backgroundColor: "rgba(0,217,160,0.12)",
    alignItems: "center", justifyContent: "center",
    borderWidth: 1.5, borderColor: "rgba(0,217,160,0.3)",
  },
  textBlock: { alignItems: "center", gap: 10 },
  heading:   { fontSize: 26, fontFamily: "Manrope_700Bold", letterSpacing: -0.5, textAlign: "center" },
  sub:       { fontSize: 15, fontFamily: "Manrope_400Regular", textAlign: "center", lineHeight: 23 },
});
