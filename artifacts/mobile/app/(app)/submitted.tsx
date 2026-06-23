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
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SubmittedScreen() {
  const router  = useRouter();
  const insets  = useSafeAreaInsets();

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
        { backgroundColor: "#FFFFFF", paddingTop: insets.top + 60, paddingBottom: insets.bottom + 32 },
      ]}
    >
      {/* Animated success icon — solid black circle with white checkmark */}
      <View style={s.iconWrap}>
        <Animated.View style={[s.outerRing, ringStyle]} />
        <Animated.View style={[s.iconCircle, iconStyle]}>
          <Feather name="check" size={42} color="#FFFFFF" />
        </Animated.View>
      </View>

      {/* Text */}
      <Animated.View
        entering={FadeInDown.duration(380).springify().delay(240)}
        style={s.textBlock}
      >
        <Text style={s.heading}>Trade Submitted</Text>
        <Text style={s.sub}>
          Your trade has been submitted successfully
        </Text>
      </Animated.View>

      {/* Done button */}
      <Animated.View
        entering={FadeInUp.duration(360).springify().delay(380)}
        style={s.actions}
      >
        <TouchableOpacity
          style={s.doneBtn}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.replace("/(tabs)");
          }}
          activeOpacity={0.85}
        >
          <Text style={s.doneBtnText}>Done</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={s.outlineBtn}
          onPress={() => router.replace("/(app)/transactions")}
          activeOpacity={0.75}
        >
          <Text style={s.outlineBtnText}>View Transactions</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const s = StyleSheet.create({
  root: {
    flex:           1,
    alignItems:     "center",
    paddingHorizontal: 32,
    gap:            28,
    justifyContent: "center",
  },

  iconWrap: {
    alignItems:     "center",
    justifyContent: "center",
    marginBottom:   8,
  },
  outerRing: {
    position:     "absolute",
    width:        130,
    height:       130,
    borderRadius: 65,
    borderWidth:  1.5,
    borderColor:  "rgba(0,0,0,0.12)",
  },
  iconCircle: {
    width:          100,
    height:         100,
    borderRadius:   50,
    backgroundColor:"#000000",
    alignItems:     "center",
    justifyContent: "center",
  },

  textBlock: { alignItems: "center", gap: 10 },
  heading: {
    fontSize:   26,
    fontFamily: "Manrope_700Bold",
    color:      "#1E232C",
    letterSpacing: -0.4,
  },
  sub: {
    fontSize:   15,
    fontFamily: "Manrope_400Regular",
    color:      "#8391A1",
    textAlign:  "center",
    lineHeight: 22,
  },

  actions: { width: "100%", gap: 12 },

  doneBtn: {
    backgroundColor: "#1E232C",
    height:          52,
    borderRadius:    8,
    alignItems:      "center",
    justifyContent:  "center",
  },
  doneBtnText: {
    fontSize:   15,
    fontFamily: "Manrope_600SemiBold",
    color:      "#FFFFFF",
  },

  outlineBtn: {
    height:          52,
    borderRadius:    8,
    borderWidth:     1.5,
    borderColor:     "#E8ECF4",
    alignItems:      "center",
    justifyContent:  "center",
  },
  outlineBtnText: {
    fontSize:   15,
    fontFamily: "Manrope_600SemiBold",
    color:      "#1E232C",
  },
});
