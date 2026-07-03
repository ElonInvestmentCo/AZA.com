import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StyleSheet } from "react-native";

const PIN_KEY = "payvora_transaction_pin";

const C = {
  bg:      "#FFFFFF",
  text:    "#0B0A0A",
  textSec: "#6A707C",
  border:  "#E8ECF4",
  teal:    "#35C2C1",
  error:   "#FF5B7A",
};

type Stage = "current" | "new" | "confirm";

export default function PinCodeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 48 : insets.top + 8;

  const [hasPin,  setHasPin]  = useState<boolean | null>(null);
  const [stage,   setStage]   = useState<Stage>("new");
  const [digits,  setDigits]  = useState("");
  const [firstPin, setFirstPin] = useState("");
  const [error,   setError]   = useState("");

  useEffect(() => {
    AsyncStorage.getItem(PIN_KEY).then(stored => {
      const exists = !!stored;
      setHasPin(exists);
      setStage(exists ? "current" : "new");
    });
  }, []);

  const title = stage === "current" ? "Enter Current PIN"
    : stage === "new" ? (hasPin ? "Enter New PIN" : "Create Transaction PIN")
    : "Confirm New PIN";

  const subtitle = stage === "current" ? "Enter your existing 4-digit PIN to continue"
    : stage === "new" ? "Choose a 4-digit PIN to authorise transactions"
    : "Re-enter your new PIN to confirm";

  const handleKeyPress = (key: string) => {
    setError("");
    if (key === "back") {
      setDigits(d => d.slice(0, -1));
      return;
    }
    if (digits.length >= 4) return;
    Haptics.selectionAsync();
    const next = digits + key;
    setDigits(next);

    if (next.length === 4) {
      setTimeout(() => submitStage(next), 150);
    }
  };

  const submitStage = async (value: string) => {
    if (stage === "current") {
      const stored = await AsyncStorage.getItem(PIN_KEY);
      if (value !== stored) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        setError("Incorrect PIN. Please try again.");
        setDigits("");
        return;
      }
      setStage("new");
      setDigits("");
      return;
    }

    if (stage === "new") {
      setFirstPin(value);
      setStage("confirm");
      setDigits("");
      return;
    }

    if (stage === "confirm") {
      if (value !== firstPin) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        setError("PINs don't match. Please try again.");
        setDigits("");
        setStage("new");
        setFirstPin("");
        return;
      }
      await AsyncStorage.setItem(PIN_KEY, value);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert("PIN Saved", "Your transaction PIN has been set successfully.", [
        { text: "OK", onPress: () => router.back() },
      ]);
    }
  };

  if (hasPin === null) return <View style={[s.root, { paddingTop: topPad }]} />;

  const KEYS = ["1","2","3","4","5","6","7","8","9","","0","back"];

  return (
    <View style={[s.root, { paddingTop: topPad }]}>
      <Animated.View entering={FadeInDown.duration(280)} style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.back(); }} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Feather name="arrow-left" size={22} color={C.text} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Set PIN Code</Text>
        <View style={{ width: 40 }} />
      </Animated.View>

      <View style={s.content}>
        <Animated.View entering={FadeInDown.duration(300).delay(40)} style={{ alignItems: "center" }}>
          <View style={s.iconCircle}>
            <Feather name="grid" size={28} color={C.teal} />
          </View>
          <Text style={s.title}>{title}</Text>
          <Text style={s.subtitle}>{subtitle}</Text>
        </Animated.View>

        <Animated.View entering={FadeInUp.duration(300).delay(80)} style={s.dotsRow}>
          {[0, 1, 2, 3].map(i => (
            <View key={i} style={[s.dot, i < digits.length && s.dotFilled, !!error && s.dotError]} />
          ))}
        </Animated.View>

        {!!error && <Text style={s.errorText}>{error}</Text>}

        <Animated.View entering={FadeInUp.duration(320).delay(120)} style={s.keypad}>
          {KEYS.map((k, i) => (
            <TouchableOpacity
              key={i}
              style={[s.key, k === "" && { opacity: 0 }]}
              activeOpacity={0.6}
              disabled={k === ""}
              onPress={() => handleKeyPress(k)}
            >
              {k === "back" ? (
                <Feather name="delete" size={20} color={C.text} />
              ) : (
                <Text style={s.keyText}>{k}</Text>
              )}
            </TouchableOpacity>
          ))}
        </Animated.View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg, paddingHorizontal: 20 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 },
  backBtn: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: 18, fontFamily: "Manrope_700Bold", color: C.text },

  content: { flex: 1, justifyContent: "space-between", paddingBottom: 24 },

  iconCircle: { width: 64, height: 64, borderRadius: 32, backgroundColor: "rgba(53,194,193,0.12)", alignItems: "center", justifyContent: "center", marginBottom: 16, marginTop: 8 },
  title: { fontSize: 18, fontFamily: "Manrope_700Bold", color: C.text, marginBottom: 6, textAlign: "center" },
  subtitle: { fontSize: 13, fontFamily: "Manrope_400Regular", color: C.textSec, textAlign: "center", paddingHorizontal: 20 },

  dotsRow: { flexDirection: "row", justifyContent: "center", gap: 18, marginTop: 32 },
  dot: { width: 16, height: 16, borderRadius: 8, borderWidth: 1.5, borderColor: C.border },
  dotFilled: { backgroundColor: C.teal, borderColor: C.teal },
  dotError: { borderColor: C.error },
  errorText: { fontSize: 12, fontFamily: "Manrope_500Medium", color: C.error, textAlign: "center", marginTop: 12 },

  keypad: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", rowGap: 18 },
  key: { width: "30%", height: 64, alignItems: "center", justifyContent: "center" },
  keyText: { fontSize: 24, fontFamily: "Manrope_600SemiBold", color: C.text },
});
