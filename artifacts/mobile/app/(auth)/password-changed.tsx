import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  withSequence,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";

const successmarkImg = require("../../assets/images/successmark.svg");

export default function PasswordChangedScreen() {
  const router  = useRouter();
  const insets  = useSafeAreaInsets();
  const C       = useColors();

  const iconSc  = useSharedValue(0);
  const iconOp  = useSharedValue(0);
  const btnSc   = useSharedValue(1);
  const btnStyle = useAnimatedStyle(() => ({ transform: [{ scale: btnSc.value }] }));

  useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    iconOp.value = withTiming(1, { duration: 320 });
    iconSc.value = withSequence(
      withSpring(1.18, { damping: 7,  stiffness: 200 }),
      withSpring(1.0,  { damping: 14, stiffness: 180 }),
    );
  }, []);

  const iconStyle = useAnimatedStyle(() => ({
    opacity:   iconOp.value,
    transform: [{ scale: iconSc.value }],
  }));

  return (
    <View
      style={[
        s.root,
        { backgroundColor: C.background, paddingTop: insets.top + 8, paddingBottom: insets.bottom + 32 },
      ]}
    >
      {/* ── Top bar ── */}
      <Animated.View entering={FadeIn.duration(400)} style={s.topBar}>
        <Pressable
          style={[s.backBtn, { borderColor: C.border, backgroundColor: C.surface }]}
          onPress={() => router.replace("/(auth)/login")}
          hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
        >
          <Ionicons name="chevron-back" size={22} color={C.text} />
        </Pressable>
        <Text style={[s.wordmark, { color: C.text }]}>AZA.</Text>
        <View style={{ width: 44 }} />
      </Animated.View>

      {/* ── Centre content ── */}
      <View style={s.center}>

        {/* Successmark SVG */}
        <Animated.View style={[s.iconWrap, iconStyle]}>
          <Image
            source={successmarkImg}
            style={s.successmark}
            contentFit="contain"
          />
        </Animated.View>

        {/* "Password Changed!" */}
        <Animated.View
          entering={FadeInDown.duration(400).springify().delay(160)}
          style={s.textBlock}
        >
          <Text style={[s.heading, { color: C.text }]}>Password Changed!</Text>
          <Text style={[s.subText, { color: C.mutedForeground }]}>
            Your password has been changed{"\n"}successfully.
          </Text>
        </Animated.View>

        {/* Back to Login button (gradient) */}
        <Animated.View
          entering={FadeInDown.duration(400).springify().delay(280)}
          style={[btnStyle, s.btnWrap]}
        >
          <LinearGradient
            colors={[C.gradientStart, C.gradientMid, C.gradientEnd] as [string, string, string]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[s.loginBtnGrad, { shadowColor: C.accentGlow }]}
          >
            <Pressable
              style={s.loginBtnPress}
              onPress={() => router.replace("/(auth)/login")}
              onPressIn={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                btnSc.value = withSpring(0.97, { damping: 13, stiffness: 320 });
              }}
              onPressOut={() => {
                btnSc.value = withSpring(1.0, { damping: 13, stiffness: 320 });
              }}
            >
              <Text style={s.loginBtnText}>Back to Login</Text>
            </Pressable>
          </LinearGradient>
        </Animated.View>

      </View>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, paddingHorizontal: 24 },

  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 32,
  },
  backBtn: {
    width: 44, height: 44, borderRadius: 12, borderWidth: 1,
    alignItems: "center", justifyContent: "center",
  },
  wordmark: {
    fontSize: 32,
    fontFamily: "Manrope_700Bold",
    letterSpacing: -0.5,
  },

  center: { flex: 1, alignItems: "center", justifyContent: "center", gap: 20 },
  iconWrap:    { marginBottom: 8 },
  successmark: { width: 100, height: 100 },

  textBlock: { alignItems: "center", gap: 10 },
  heading: {
    fontSize: 26,
    fontFamily: "Manrope_700Bold",
    textAlign: "center",
    lineHeight: 31,
  },
  subText: {
    fontSize: 15,
    fontFamily: "Manrope_400Regular",
    textAlign: "center",
    lineHeight: 22,
  },

  btnWrap: { width: "100%", marginTop: 4 },
  loginBtnGrad: {
    height: 60,
    borderRadius: 14,
    overflow: "hidden",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 24,
    elevation: 8,
  },
  loginBtnPress: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loginBtnText: {
    fontSize: 16,
    fontFamily: "Manrope_700Bold",
    color: "#FFFFFF",
    letterSpacing: 0.2,
  },
});
