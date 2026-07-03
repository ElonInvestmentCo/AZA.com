import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const LANGUAGE_KEY = "payvora_language";

const C = {
  bg:      "#FFFFFF",
  text:    "#0B0A0A",
  textSec: "#6A707C",
  border:  "#E8ECF4",
  inputBg: "#F7F8F9",
  teal:    "#35C2C1",
};

const LANGUAGES = [
  { code: "en", name: "English",  native: "English",  flag: "🇬🇧" },
  { code: "fr", name: "French",   native: "Français", flag: "🇫🇷" },
  { code: "ha", name: "Hausa",    native: "Hausa",     flag: "🇳🇬" },
  { code: "ig", name: "Igbo",     native: "Igbo",      flag: "🇳🇬" },
  { code: "yo", name: "Yoruba",   native: "Yorùbá",    flag: "🇳🇬" },
  { code: "pt", name: "Portuguese", native: "Português", flag: "🇵🇹" },
];

export default function LanguageScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 48 : insets.top + 8;

  const [selected, setSelected] = useState("en");
  const [loaded,   setLoaded]   = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(LANGUAGE_KEY).then(v => {
      setSelected(v ?? "en");
      setLoaded(true);
    });
  }, []);

  const handleSelect = async (code: string) => {
    Haptics.selectionAsync();
    setSelected(code);
    await AsyncStorage.setItem(LANGUAGE_KEY, code);
  };

  if (!loaded) return <View style={[s.root, { paddingTop: topPad }]} />;

  return (
    <View style={[s.root, { paddingTop: topPad }]}>
      <Animated.View entering={FadeInDown.duration(280)} style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.back(); }} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Feather name="arrow-left" size={22} color={C.text} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Language</Text>
        <View style={{ width: 40 }} />
      </Animated.View>

      <Text style={s.subtitle}>Choose your preferred display language</Text>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[s.scroll, { paddingBottom: insets.bottom + 40 }]}>
        <Animated.View entering={FadeInUp.duration(320).delay(60)} style={s.listCard}>
          {LANGUAGES.map((lang, i) => (
            <React.Fragment key={lang.code}>
              <TouchableOpacity style={s.rowItem} activeOpacity={0.7} onPress={() => handleSelect(lang.code)}>
                <Text style={s.flag}>{lang.flag}</Text>
                <View style={s.rowInfo}>
                  <Text style={s.rowLabel}>{lang.name}</Text>
                  <Text style={s.rowSub}>{lang.native}</Text>
                </View>
                {selected === lang.code && (
                  <Feather name="check-circle" size={20} color={C.teal} />
                )}
              </TouchableOpacity>
              {i < LANGUAGES.length - 1 && <View style={s.rowDivider} />}
            </React.Fragment>
          ))}
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg, paddingHorizontal: 20 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 8 },
  backBtn: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: 18, fontFamily: "Manrope_700Bold", color: C.text },
  subtitle: { fontSize: 13, fontFamily: "Manrope_400Regular", color: C.textSec, marginBottom: 20 },

  scroll: { gap: 16 },

  listCard: { borderWidth: 1, borderColor: C.border, borderRadius: 16, overflow: "hidden", backgroundColor: C.bg },
  rowItem: { flexDirection: "row", alignItems: "center", gap: 14, paddingVertical: 14, paddingHorizontal: 16 },
  flag: { fontSize: 26 },
  rowInfo: { flex: 1 },
  rowLabel: { fontSize: 15, fontFamily: "Manrope_600SemiBold", color: C.text, marginBottom: 2 },
  rowSub: { fontSize: 12, fontFamily: "Manrope_400Regular", color: C.textSec },
  rowDivider: { height: 1, backgroundColor: C.border, marginHorizontal: 16 },
});
