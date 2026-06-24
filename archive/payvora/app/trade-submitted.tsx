import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import {
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";

const WHITE   = "#FFFFFF";
const DARK    = "#1E232C";
const SUBTEXT = "#8391A1";

export default function TradeSubmittedScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, []);

  function handleDone() {
    Haptics.selectionAsync();
    router.replace("/(tabs)" as any);
  }

  return (
    <View style={[styles.screen, { paddingTop: Platform.OS === "web" ? 20 : insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor={WHITE} />

      {/* Hero illustration area */}
      <View style={styles.heroArea}>
        {/* Superhero / success illustration — reproduced as concentric circles + icon */}
        <View style={styles.illustrationOuter}>
          <View style={styles.illustrationMid}>
            <View style={styles.illustrationInner}>
              <View style={styles.successCircle}>
                <Feather name="check" size={48} color={WHITE} />
              </View>
            </View>
          </View>
        </View>

        {/* Decorative accent dots */}
        <View style={[styles.dot, styles.dotTL]} />
        <View style={[styles.dot, styles.dotTR]} />
        <View style={[styles.dot, styles.dotBL]} />
        <View style={[styles.dot, styles.dotBR]} />
        <View style={[styles.dotLg, styles.dotLgTop]} />
      </View>

      {/* Text */}
      <View style={styles.textArea}>
        <Text style={styles.title}>Trade Submitted</Text>
        <Text style={styles.subtitle}>Your trade has been submitted successfully</Text>
      </View>

      {/* Done button */}
      <View style={[styles.btnWrap, { paddingBottom: Platform.OS === "ios" ? insets.bottom + 8 : 40 }]}>
        <TouchableOpacity style={styles.doneBtn} onPress={handleDone} activeOpacity={0.85}>
          <Text style={styles.doneTxt}>Done</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: WHITE,
    alignItems: "center",
  },

  heroArea: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    position: "relative",
  },

  illustrationOuter: {
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "rgba(30,35,44,0.06)",
    alignItems: "center",
    justifyContent: "center",
  },
  illustrationMid: {
    width: 175,
    height: 175,
    borderRadius: 87.5,
    backgroundColor: "rgba(30,35,44,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  illustrationInner: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: "rgba(30,35,44,0.10)",
    alignItems: "center",
    justifyContent: "center",
  },
  successCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: DARK,
    alignItems: "center",
    justifyContent: "center",
  },

  dot: { position: "absolute", borderRadius: 100, backgroundColor: DARK },
  dotTL: { width: 10, height: 10, top: 60, left: 40, opacity: 0.15 },
  dotTR: { width: 14, height: 14, top: 48, right: 52, opacity: 0.12 },
  dotBL: { width: 8, height: 8, bottom: 80, left: 60, opacity: 0.10 },
  dotBR: { width: 12, height: 12, bottom: 72, right: 44, opacity: 0.13 },
  dotLg: { position: "absolute", borderRadius: 100, backgroundColor: DARK, opacity: 0.07 },
  dotLgTop: { width: 24, height: 24, top: 30, right: 80 },

  textArea: {
    alignItems: "center",
    paddingHorizontal: 32,
    gap: 10,
    marginBottom: 24,
  },
  title: {
    fontFamily: "Inter_700Bold",
    fontSize: 26,
    color: DARK,
    textAlign: "center",
  },
  subtitle: {
    fontFamily: "Inter_500Medium",
    fontSize: 15,
    color: SUBTEXT,
    textAlign: "center",
    lineHeight: 22,
    width: 226,
  },

  btnWrap: { width: "100%", paddingHorizontal: 29 },
  doneBtn: {
    backgroundColor: DARK,
    borderRadius: 8,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
  },
  doneTxt: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 15,
    color: WHITE,
  },
});
