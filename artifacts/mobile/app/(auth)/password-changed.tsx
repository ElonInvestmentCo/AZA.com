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
const backBtnImg     = require("../../assets/images/back-btn.svg");
const lkdImg         = require("../../assets/images/lkd.png");

const C = {
  bg:        "#FFFFFF",
  dark:      "#1E232C",
  gray:      "#8391A1",
  white:     "#FFFFFF",
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
    <View style={[s.root, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 32 }]}>

      {/* ── AZA. logo (lkd.png — unmodified) ── */}
      <Animated.View entering={FadeInUp.duration(380).springify()} style={s.header}>
        <Image source={lkdImg} style={s.lkd} contentFit="contain" />
      </Animated.View>

      {/* ── Back button (back-btn.svg — unmodified) ── */}
      <Animated.View entering={FadeInUp.duration(380).delay(40).springify()} style={s.backRow}>
        <TouchableOpacity
          onPress={() => router.replace("/(auth)/login")}
          activeOpacity={0.78}
        >
          <Image source={backBtnImg} style={s.backBtnImg} contentFit="contain" />
        </TouchableOpacity>
      </Animated.View>

      {/* ── Centre content ── */}
      <View style={s.center}>

        {/* Successmark SVG — unmodified, springs in */}
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
          <Text style={s.heading}>Password Changed!</Text>
          <Text style={s.subText}>
            Your password has been changed{"\n"}successfully.
          </Text>
        </Animated.View>

        {/* Back to Login button */}
        <Animated.View
          entering={FadeInDown.duration(400).springify().delay(280)}
          style={[btnStyle, s.btnWrap]}
        >
          <Pressable
            style={s.loginBtn}
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

  /* AZA. logo */
  header: { alignItems: "center", marginBottom: 28 },
  lkd:    { width: 87, height: 19 },

  /* Back button */
  backRow:   { marginBottom: 0 },
  backBtnImg: { width: 41, height: 41 },

  /* Centre */
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
  },

  iconWrap:    { marginBottom: 8 },
  successmark: { width: 100, height: 100 },

  textBlock: { alignItems: "center", gap: 10 },
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

  btnWrap: { width: "100%", marginTop: 4 },
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
