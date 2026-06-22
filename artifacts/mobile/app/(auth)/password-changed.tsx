import { Image } from "expo-image";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import {
  Pressable,
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
  withSequence,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const successmarkImg = require("../../assets/images/successmark.svg");

const C = {
  bg:        "#FFFFFF",
  dark:      "#1E232C",
  gray:      "#8391A1",
  white:     "#FFFFFF",
  btnBorder: "#E8ECF4",
};

export default function PasswordChangedScreen() {
  const router  = useRouter();
  const insets  = useSafeAreaInsets();

  const iconSc  = useSharedValue(0);
  const iconOp  = useSharedValue(0);
  const btnSc   = useSharedValue(1);
  const btnStyle = useAnimatedStyle(() => ({ transform: [{ scale: btnSc.value }] }));

  useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    iconOp.value = withTiming(1, { duration: 300 });
    iconSc.value = withSequence(
      withSpring(1.15, { damping: 7, stiffness: 200 }),
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
        { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 32 },
      ]}
    >
      {/* ── AZA. header ── */}
      <Animated.View entering={FadeInUp.duration(380).springify()} style={s.header}>
        <Text style={s.brand}>AZA.</Text>
      </Animated.View>

      {/* ── Back button ── */}
      <Animated.View entering={FadeInUp.duration(380).delay(40).springify()} style={s.backRow}>
        <TouchableOpacity
          style={s.backBtn}
          onPress={() => router.replace("/(auth)/login")}
          activeOpacity={0.78}
        >
          <Text style={s.backArrow}>‹</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* ── Centre content ── */}
      <View style={s.center}>
        {/* Successmark SVG — unmodified */}
        <Animated.View style={[s.iconWrap, iconStyle]}>
          <Image
            source={successmarkImg}
            style={{ width: 100, height: 100 }}
            contentFit="contain"
          />
        </Animated.View>

        {/* Text block */}
        <Animated.View
          entering={FadeInDown.duration(400).springify().delay(200)}
          style={s.textBlock}
        >
          <Text style={s.heading}>Password Changed!</Text>
          <Text style={s.subText}>
            Your password has been changed successfully.
          </Text>
        </Animated.View>

        {/* Back to Login button */}
        <Animated.View
          entering={FadeInDown.duration(400).springify().delay(320)}
          style={[btnStyle, s.btnWrap]}
        >
          <Pressable
            style={s.loginBtn}
            onPress={() => router.replace("/(auth)/login")}
            onPressIn={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              btnSc.value = withSpring(0.97, { damping: 13, stiffness: 320 });
            }}
            onPressOut={() => { btnSc.value = withSpring(1.0, { damping: 13, stiffness: 320 }); }}
          >
            <Text style={s.loginBtnText}>Back to Login</Text>
          </Pressable>
        </Animated.View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: C.bg,
    paddingHorizontal: 28,
  },

  header: { alignItems: "center", marginBottom: 32 },
  brand: {
    fontSize: 28,
    fontFamily: "Urbanist_700Bold",
    color: C.dark,
    letterSpacing: 0.5,
  },

  backRow: { marginBottom: 0 },
  backBtn: {
    width: 41,
    height: 41,
    borderRadius: 12,
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: C.btnBorder,
    alignItems: "center",
    justifyContent: "center",
  },
  backArrow: {
    fontSize: 26,
    color: C.dark,
    lineHeight: 30,
    marginTop: -2,
  },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 24,
  },

  iconWrap: { alignItems: "center", justifyContent: "center", marginBottom: 8 },

  textBlock: { alignItems: "center", gap: 12 },
  heading: {
    fontSize: 26,
    fontFamily: "Urbanist_700Bold",
    color: C.dark,
    textAlign: "center",
    lineHeight: 31,
  },
  subText: {
    fontSize: 15,
    fontFamily: "Urbanist_500Medium",
    color: C.gray,
    textAlign: "center",
    lineHeight: 22,
  },

  btnWrap: { width: "100%" },
  loginBtn: {
    height: 56,
    backgroundColor: C.dark,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  loginBtnText: {
    fontSize: 15,
    fontFamily: "Urbanist_600SemiBold",
    color: C.white,
    textAlign: "center",
  },
});
