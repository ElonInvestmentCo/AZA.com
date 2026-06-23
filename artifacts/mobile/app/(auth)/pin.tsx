import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const BG     = "#0A0A0F";
const CARD   = "#1C1C2A";
const BORDER = "#2A2A3D";
const TEXT   = "#FFFFFF";
const MUTED  = "#8F8FA3";
const ACCENT = "#00D9A0";

const PIN_LEN = 4;
const KEYPAD = [
  ["1", "2", "3"],
  ["4", "5", "6"],
  ["7", "8", "9"],
  ["",  "0", "⌫"],
];

function PinDot({ filled }: { filled: boolean }) {
  const scale = useSharedValue(1);
  const glow  = useSharedValue(0);

  useEffect(() => {
    if (filled) {
      scale.value = withSequence(
        withSpring(1.35, { damping: 8,  stiffness: 280 }),
        withSpring(1.1,  { damping: 14, stiffness: 200 }),
      );
      glow.value = withTiming(1, { duration: 200 });
    } else {
      scale.value = withSpring(1, { damping: 14, stiffness: 200 });
      glow.value  = withTiming(0, { duration: 150 });
    }
  }, [filled]);

  const anim = useAnimatedStyle(() => ({
    transform:       [{ scale: scale.value }],
    backgroundColor: filled ? ACCENT : "transparent",
    borderColor:     filled ? ACCENT : BORDER,
    shadowColor:     ACCENT,
    shadowOpacity:   glow.value * 0.7,
    shadowRadius:    glow.value * 10,
    elevation:       glow.value * 6,
  }));

  return <Animated.View style={[dot.base, anim]} />;
}

function KeyBtn({ label, onPress }: { label: string; onPress: () => void }) {
  const scale = useSharedValue(1);
  const anim  = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  if (label === "") return <View style={key.empty} />;

  return (
    <Animated.View style={anim}>
      <Pressable
        style={[key.btn, { backgroundColor: CARD, borderColor: BORDER }]}
        onPress={onPress}
        onPressIn={() => { scale.value = withSpring(0.9,  { damping: 10, stiffness: 280 }); }}
        onPressOut={() => { scale.value = withSpring(1.0, { damping: 12, stiffness: 280 }); }}
      >
        <Text style={[key.text, label === "⌫" && { fontSize: 20, color: MUTED }]}>
          {label}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

export default function PinScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [pin, setPin] = useState("");

  const handleKey = (k: string) => {
    if (k === "⌫") {
      Haptics.selectionAsync();
      setPin((p) => p.slice(0, -1));
      return;
    }
    if (k === "" || pin.length >= PIN_LEN) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const next = pin + k;
    setPin(next);
    if (next.length === PIN_LEN) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setTimeout(() => router.replace("/(tabs)/"), 400);
    }
  };

  return (
    <View style={[s.root, { paddingTop: insets.top + 40, paddingBottom: insets.bottom + 24 }]}>
      {/* Logo + headings */}
      <Animated.View entering={FadeInDown.duration(400).springify()} style={s.header}>
        <Text style={s.logo}>AZA.</Text>
        <Text style={s.heading}>Set Your PIN</Text>
        <Text style={s.sub}>Create a secure 4-digit PIN for quick access</Text>
      </Animated.View>

      {/* Pin dots */}
      <Animated.View entering={FadeInUp.duration(420).springify().delay(80)} style={s.dots}>
        {Array.from({ length: PIN_LEN }).map((_, i) => (
          <PinDot key={i} filled={i < pin.length} />
        ))}
      </Animated.View>

      {/* Keypad */}
      <Animated.View entering={FadeInUp.duration(420).springify().delay(160)} style={s.keypad}>
        {KEYPAD.map((row, ri) => (
          <View key={ri} style={s.row}>
            {row.map((k, ki) => (
              <KeyBtn key={ki} label={k} onPress={() => handleKey(k)} />
            ))}
          </View>
        ))}
      </Animated.View>
    </View>
  );
}

const s = StyleSheet.create({
  root:    { flex: 1, backgroundColor: BG, alignItems: "center", paddingHorizontal: 28 },
  header:  { alignItems: "center", marginBottom: 48 },
  logo:    { fontSize: 32, fontFamily: "Manrope_700Bold", color: TEXT, letterSpacing: -0.5, marginBottom: 32 },
  heading: { fontSize: 26, fontFamily: "Manrope_700Bold", color: TEXT, letterSpacing: -0.5, marginBottom: 8 },
  sub:     { fontSize: 14, fontFamily: "Manrope_400Regular", color: MUTED, textAlign: "center" },
  dots:    { flexDirection: "row", gap: 20, marginBottom: 52 },
  keypad:  { gap: 14, width: "100%" },
  row:     { flexDirection: "row", justifyContent: "center", gap: 16 },
});

const dot = StyleSheet.create({
  base: { width: 18, height: 18, borderRadius: 9, borderWidth: 2 },
});

const key = StyleSheet.create({
  btn:   {
    width: 84, height: 84, borderRadius: 42,
    alignItems: "center", justifyContent: "center", borderWidth: 1,
  },
  text:  { fontSize: 26, fontFamily: "Manrope_600SemiBold", color: TEXT },
  empty: { width: 84, height: 84 },
});
