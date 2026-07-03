import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const QUICK_PAY_KEY  = "payvora_quick_payment_enabled";
const QUICK_PAY_LIMIT = "payvora_quick_payment_limit";

const C = {
  bg:      "#FFFFFF",
  text:    "#0B0A0A",
  textSec: "#6A707C",
  border:  "#E8ECF4",
  inputBg: "#F7F8F9",
  teal:    "#35C2C1",
  amber:   "#D97706",
};

const LIMITS = [5000, 10000, 20000, 50000];

export default function QuickPaymentScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 48 : insets.top + 8;

  const [enabled, setEnabled] = useState(false);
  const [limit,   setLimit]   = useState(10000);
  const [loaded,  setLoaded]  = useState(false);

  useEffect(() => {
    (async () => {
      const [e, l] = await Promise.all([
        AsyncStorage.getItem(QUICK_PAY_KEY),
        AsyncStorage.getItem(QUICK_PAY_LIMIT),
      ]);
      setEnabled(e === "true");
      setLimit(l ? parseInt(l, 10) : 10000);
      setLoaded(true);
    })();
  }, []);

  const toggle = async (val: boolean) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setEnabled(val);
    await AsyncStorage.setItem(QUICK_PAY_KEY, val ? "true" : "false");
  };

  const selectLimit = async (val: number) => {
    Haptics.selectionAsync();
    setLimit(val);
    await AsyncStorage.setItem(QUICK_PAY_LIMIT, String(val));
  };

  if (!loaded) return <View style={[s.root, { paddingTop: topPad }]} />;

  return (
    <View style={[s.root, { paddingTop: topPad }]}>
      <Animated.View entering={FadeInDown.duration(280)} style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.back(); }} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Feather name="arrow-left" size={22} color={C.text} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Quick Payment</Text>
        <View style={{ width: 40 }} />
      </Animated.View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[s.scroll, { paddingBottom: insets.bottom + 40 }]}>
        <Animated.View entering={FadeInDown.duration(300).delay(40)} style={s.card}>
          <View style={s.cardRow}>
            <View style={s.iconCircle}>
              <Feather name="zap" size={20} color={C.amber} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.cardTitle}>Enable Quick Payment</Text>
              <Text style={s.cardSub}>Pay without entering your PIN or biometrics for small transactions</Text>
            </View>
            <Switch
              value={enabled}
              onValueChange={toggle}
              trackColor={{ false: C.border, true: C.teal }}
              thumbColor="#FFFFFF"
            />
          </View>
        </Animated.View>

        {enabled && (
          <Animated.View entering={FadeInUp.duration(300).delay(60)}>
            <Text style={s.sectionLabel}>Spending limit without authentication</Text>
            <View style={s.limitGrid}>
              {LIMITS.map(val => (
                <TouchableOpacity
                  key={val}
                  style={[s.limitChip, limit === val && s.limitChipActive]}
                  activeOpacity={0.8}
                  onPress={() => selectLimit(val)}
                >
                  <Text style={[s.limitText, limit === val && s.limitTextActive]}>
                    ₦{val.toLocaleString("en-NG")}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={s.infoBox}>
              <Feather name="info" size={14} color={C.textSec} style={{ marginRight: 8, marginTop: 1 }} />
              <Text style={s.infoText}>
                Transactions above ₦{limit.toLocaleString("en-NG")} will still require your PIN or biometric authentication for security.
              </Text>
            </View>
          </Animated.View>
        )}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg, paddingHorizontal: 20 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 20 },
  backBtn: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: 18, fontFamily: "Manrope_700Bold", color: C.text },

  scroll: { gap: 20 },

  card: { borderWidth: 1, borderColor: C.border, borderRadius: 16, padding: 16, backgroundColor: C.inputBg },
  cardRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  iconCircle: { width: 44, height: 44, borderRadius: 14, backgroundColor: "rgba(217,119,6,0.12)", alignItems: "center", justifyContent: "center" },
  cardTitle: { fontSize: 15, fontFamily: "Manrope_600SemiBold", color: C.text, marginBottom: 3 },
  cardSub: { fontSize: 12, fontFamily: "Manrope_400Regular", color: C.textSec, lineHeight: 17 },

  sectionLabel: { fontSize: 13, fontFamily: "Manrope_600SemiBold", color: C.text, marginBottom: 12 },
  limitGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 16 },
  limitChip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10, borderWidth: 1, borderColor: C.border, backgroundColor: C.bg },
  limitChipActive: { backgroundColor: C.teal, borderColor: C.teal },
  limitText: { fontSize: 13, fontFamily: "Manrope_600SemiBold", color: C.text },
  limitTextActive: { color: "#FFFFFF" },

  infoBox: { flexDirection: "row", backgroundColor: C.inputBg, borderRadius: 12, padding: 14 },
  infoText: { flex: 1, fontSize: 12, fontFamily: "Manrope_400Regular", color: C.textSec, lineHeight: 17 },
});
