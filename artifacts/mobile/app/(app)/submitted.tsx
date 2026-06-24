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
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const C = {
  bg:    "#FFFFFF",
  text:  "#1E232C",
  sub:   "#8391A1",
  black: "#1E232C",
};

export default function SubmittedScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const checkScale = useSharedValue(0);
  const checkOpacity = useSharedValue(0);
  const ring1 = useSharedValue(1);
  const ring2 = useSharedValue(1);

  useEffect(() => {
    checkScale.value = withDelay(300, withSpring(1, { damping: 10, stiffness: 160 }));
    checkOpacity.value = withDelay(300, withTiming(1, { duration: 300 }));
    ring1.value = withDelay(600, withRepeat(
      withSequence(withTiming(1.35, { duration: 800 }), withTiming(1, { duration: 800 })),
      -1, false,
    ));
    ring2.value = withDelay(900, withRepeat(
      withSequence(withTiming(1.6, { duration: 1000 }), withTiming(1, { duration: 1000 })),
      -1, false,
    ));
  }, []);

  const checkAnim = useAnimatedStyle(() => ({
    transform: [{ scale: checkScale.value }],
    opacity: checkOpacity.value,
  }));
  const ring1Anim = useAnimatedStyle(() => ({
    transform: [{ scale: ring1.value }],
    opacity: 2 - ring1.value,
  }));
  const ring2Anim = useAnimatedStyle(() => ({
    transform: [{ scale: ring2.value }],
    opacity: 2 - ring2.value,
  }));

  return (
    <View style={[s.root, { paddingBottom: insets.bottom + 32 }]}>

      {/* Illustration area */}
      <View style={s.illustrationArea}>
        {/* Decorative pattern background */}
        <View style={s.bgPattern}>
          {[...Array(5)].map((_, i) => (
            <View key={i} style={[s.bgLine, { transform: [{ rotate: `${i * 36}deg` }] }]} />
          ))}
        </View>

        {/* Success ring animations */}
        <Animated.View style={[s.ring, s.ring2, ring2Anim]} />
        <Animated.View style={[s.ring, s.ring1, ring1Anim]} />

        {/* Checkmark circle */}
        <Animated.View style={[s.checkCircle, checkAnim]}>
          <View style={s.checkInner}>
            <Feather name="check" size={44} color="#FFFFFF" strokeWidth={3} />
          </View>
        </Animated.View>
      </View>

      {/* Text */}
      <Animated.View entering={FadeInDown.duration(400).delay(600)} style={s.textSection}>
        <Text style={s.title}>Trade Submitted</Text>
        <Text style={s.subtitle}>Your trade has been submitted successfully</Text>
      </Animated.View>

      {/* Done button */}
      <Animated.View entering={FadeInUp.duration(400).delay(800)} style={s.btnWrap}>
        <TouchableOpacity
          style={s.doneBtn}
          onPress={() => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            router.replace("/(tabs)" as any);
          }}
          activeOpacity={0.85}
        >
          <Text style={s.doneBtnText}>Done</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const s = StyleSheet.create({
  root: {
    flex: 1, backgroundColor: C.bg,
    alignItems: "center", justifyContent: "center",
    paddingHorizontal: 32,
  },

  illustrationArea: {
    width: 200, height: 200,
    alignItems: "center", justifyContent: "center",
    marginBottom: 40,
  },
  bgPattern: {
    position: "absolute", width: 200, height: 200,
    alignItems: "center", justifyContent: "center",
  },
  bgLine: {
    position: "absolute", width: 200, height: 1,
    backgroundColor: "#F0F0F0",
  },

  ring: {
    position: "absolute",
    borderRadius: 120,
    borderWidth: 2,
  },
  ring1: {
    width: 120, height: 120,
    borderColor: "rgba(0,0,0,0.08)",
  },
  ring2: {
    width: 150, height: 150,
    borderColor: "rgba(0,0,0,0.04)",
  },

  checkCircle: {
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: C.black,
    alignItems: "center", justifyContent: "center",
    shadowColor: "#000", shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2, shadowRadius: 20, elevation: 12,
  },
  checkInner: { alignItems: "center", justifyContent: "center" },

  textSection: { alignItems: "center", gap: 10, marginBottom: 48 },
  title: { fontSize: 26, fontFamily: "Manrope_700Bold", color: C.text, textAlign: "center" },
  subtitle: { fontSize: 15, fontFamily: "Manrope_400Regular", color: C.sub, textAlign: "center", lineHeight: 22 },

  btnWrap: { width: "100%" },
  doneBtn: {
    backgroundColor: C.black, height: 56, borderRadius: 8,
    alignItems: "center", justifyContent: "center",
  },
  doneBtnText: { fontSize: 15, fontFamily: "Manrope_600SemiBold", color: "#FFFFFF" },
});
