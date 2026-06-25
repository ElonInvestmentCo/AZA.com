import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from "react-native";
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
  bg:      "#FFFFFF",
  text:    "#1E232C",
  sub:     "#8391A1",
  success: "#00B03C",
  black:   "#1E232C",
};

export default function SuccessPaymentScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  const ILLUS = Math.min(Math.round(width * 0.52), 200);
  const R1    = Math.round(ILLUS * 0.60);
  const R2    = Math.round(ILLUS * 0.77);
  const ICON  = Math.round(ILLUS * 0.50);

  const checkScale   = useSharedValue(0);
  const checkOpacity = useSharedValue(0);
  const ring1 = useSharedValue(1);
  const ring2 = useSharedValue(1);

  useEffect(() => {
    checkScale.value   = withDelay(300, withSpring(1, { damping: 10, stiffness: 160 }));
    checkOpacity.value = withDelay(300, withTiming(1, { duration: 300 }));
    ring1.value = withDelay(600, withRepeat(
      withSequence(withTiming(1.4, { duration: 900 }), withTiming(1, { duration: 900 })),
      -1, false,
    ));
    ring2.value = withDelay(1000, withRepeat(
      withSequence(withTiming(1.7, { duration: 1100 }), withTiming(1, { duration: 1100 })),
      -1, false,
    ));
  }, []);

  const checkAnim = useAnimatedStyle(() => ({ transform: [{ scale: checkScale.value }], opacity: checkOpacity.value }));
  const ring1Anim = useAnimatedStyle(() => ({ transform: [{ scale: ring1.value }], opacity: 2 - ring1.value }));
  const ring2Anim = useAnimatedStyle(() => ({ transform: [{ scale: ring2.value }], opacity: 2 - ring2.value }));

  return (
    <View style={[s.root, { paddingBottom: insets.bottom + 32 }]}>

      <View style={[s.illustrationArea, { width: ILLUS, height: ILLUS }]}>
        <Animated.View style={[s.ring, { width: R2, height: R2, borderRadius: R2 / 2, borderColor: "rgba(0,176,60,0.08)" }, ring2Anim]} />
        <Animated.View style={[s.ring, { width: R1, height: R1, borderRadius: R1 / 2, borderColor: "rgba(0,176,60,0.15)" }, ring1Anim]} />
        <Animated.View style={[s.checkCircle, { width: ICON, height: ICON, borderRadius: ICON / 2 }, checkAnim]}>
          <Feather name="check" size={Math.round(ICON * 0.44)} color="#FFFFFF" />
        </Animated.View>
      </View>

      <Animated.View entering={FadeInDown.duration(400).delay(600)} style={s.textSection}>
        <Text style={s.title}>Payment Successful</Text>
        <Text style={s.subtitle}>Your payment has been processed successfully</Text>
      </Animated.View>

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
  root: { flex: 1, backgroundColor: C.bg, alignItems: "center", justifyContent: "center", paddingHorizontal: 32 },

  illustrationArea: { width: 200, height: 200, alignItems: "center", justifyContent: "center", marginBottom: 40 },
  ring: { position: "absolute", borderWidth: 2 },

  checkCircle: {
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: C.success,
    alignItems: "center", justifyContent: "center",
    shadowColor: C.success, shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35, shadowRadius: 20, elevation: 12,
  },

  textSection: { alignItems: "center", gap: 10, marginBottom: 48 },
  title:    { fontSize: 26, fontFamily: "Manrope_700Bold", color: C.text, textAlign: "center" },
  subtitle: { fontSize: 15, fontFamily: "Manrope_400Regular", color: C.sub, textAlign: "center", lineHeight: 22 },

  btnWrap:      { width: "100%" },
  doneBtn:      { backgroundColor: C.black, height: 56, borderRadius: 8, alignItems: "center", justifyContent: "center" },
  doneBtnText:  { fontSize: 15, fontFamily: "Manrope_600SemiBold", color: "#FFFFFF" },
});
