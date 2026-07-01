import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import Animated, {
  FadeIn,
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
  const { width } = useWindowDimensions();
  const markSize = Math.min(Math.round(width * 0.27), 120);

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
    <View style={[s.root, { paddingTop: insets.top + 8, paddingBottom: insets.bottom + 32 }]}>

      {/* ── Top bar ── */}
      <Animated.View entering={FadeIn.duration(400)} style={s.topBar}>
        <Pressable
          style={s.backBtn}
          onPress={() => router.replace("/(auth)/login")}
          hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
        >
          <Ionicons name="chevron-back" size={22} color={C.dark} />
        </Pressable>
        <Text style={s.wordmark}>PAYVORA.</Text>
        <View style={{ width: 44 }} />
      </Animated.View>

      {/* ── Centre content ── */}
      <View style={s.center}>

        {/* Successmark SVG — springs in */}
        <Animated.View style={[s.iconWrap, iconStyle]}>
          <Image
            source={successmarkImg}
            style={{ width: markSize, height: markSize }}
            contentFit="contain"
            cachePolicy="memory-disk"
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
    paddingHorizontal: 24,
  },

  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 32,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: C.btnBorder,
    backgroundColor: C.white,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 1,
  },
  wordmark: {
    fontSize: 32,
    fontFamily: "Manrope_700Bold",
    color: C.dark,
    letterSpacing: -0.5,
  },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
  },

  iconWrap:    { marginBottom: 8 },
  successmark: { },

  textBlock: { alignItems: "center", gap: 10 },
  heading: {
    fontSize: 26,
    fontFamily: "Manrope_700Bold",
    color: C.dark,
    textAlign: "center",
    lineHeight: 31,
  },
  subText: {
    fontSize: 15,
    fontFamily: "Manrope_400Regular",
    color: C.gray,
    textAlign: "center",
    lineHeight: 22,
  },

  btnWrap: { width: "100%", marginTop: 4 },
  loginBtn: {
    height: 60,
    backgroundColor: C.dark,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#1E232C",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 6,
  },
  loginBtnText: {
    fontSize: 16,
    fontFamily: "Manrope_700Bold",
    color: C.white,
    letterSpacing: 0.2,
  },
});
