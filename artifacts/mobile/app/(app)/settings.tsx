import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@/context/AuthContext";

const LANGUAGE_KEY = "payvora_language";
const LANGUAGE_NAMES: Record<string, string> = {
  en: "English",
  fr: "French",
  ha: "Hausa",
  ig: "Igbo",
  yo: "Yoruba",
  pt: "Portuguese",
};

const C = {
  bg:      "#FFFFFF",
  text:    "#0B0A0A",
  navy:    "#061941",
  textSec: "#6A707C",
  border:  "#E8ECF4",
  inputBg: "#F7F8F9",
  chevron: "#C5C6CC",
};

const BASE_ROWS = [
  { id: "password",  label: "Change password",       sublabel: "Change E-wallet account's login password",   icon: "lock"        as const, color: "#7C3AED" },
  { id: "pin",       label: "Set PIN code",           sublabel: "Change, reset PIN code used in transaction", icon: "grid"        as const, color: "#2563EB" },
  { id: "quick",     label: "Quick payment setting",  sublabel: "Payment without authentication",             icon: "zap"         as const, color: "#D97706" },
  { id: "language",  label: "Language",               sublabel: "English",                                    icon: "globe"       as const, color: "#059669" },
  { id: "info",      label: "App information",        sublabel: "Version 1.0.0",                              icon: "info"        as const, color: "#0891B2" },
  { id: "biometrics",label: "Biometrics",             sublabel: "Face ID / Fingerprint",                      icon: "shield"      as const, color: "#E11D48" },
  { id: "support",   label: "Help & Support",         sublabel: "Chat, FAQ, Contact us",                      icon: "help-circle" as const, color: "#7C3AED" },
  { id: "refer",     label: "Refer a Friend",         sublabel: "Earn up to ₦5,000 per referral",             icon: "gift"        as const, color: "#EA580C" },
];

export default function SettingsScreen() {
  const router  = useRouter();
  const insets  = useSafeAreaInsets();
  const { user, logout } = useAuth();
  const topPad = Platform.OS === "web" ? 48 : insets.top + 8;
  const [query, setQuery] = useState("");
  const [language, setLanguage] = useState("English");

  // Re-read the stored language every time Settings gains focus so the
  // sublabel reflects the current choice instead of always showing "English".
  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      AsyncStorage.getItem(LANGUAGE_KEY).then(code => {
        if (!cancelled) setLanguage(LANGUAGE_NAMES[code ?? "en"] ?? "English");
      });
      return () => { cancelled = true; };
    }, []),
  );

  const firstName = (user?.name ?? "User").split(" ")[0];
  const email = user?.email ?? "user@payvora.app";

  const rows = BASE_ROWS.map(r => r.id === "language" ? { ...r, sublabel: language } : r);
  const filteredRows = rows.filter(r =>
    query === "" || r.label.toLowerCase().includes(query.toLowerCase())
  );

  const handleLogout = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    Alert.alert(
      "Log out",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Log out",
          style: "destructive",
          onPress: () => { logout(); router.replace("/(auth)/login" as any); },
        },
      ],
    );
  };

  const handleRowPress = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    switch (id) {
      case "refer":
        router.push("/(app)/referral" as any);
        break;
      case "password":
        router.push("/(auth)/forgot-password" as any);
        break;
      case "biometrics":
        router.push("/(auth)/face-id" as any);
        break;
      case "pin":
        router.push("/(app)/pin-code" as any);
        break;
      case "quick":
        router.push("/(app)/quick-payment" as any);
        break;
      case "language":
        router.push("/(app)/language" as any);
        break;
      case "info":
        router.push("/(app)/app-info" as any);
        break;
      case "support":
        router.push("/(app)/help-support" as any);
        break;
    }
  };

  return (
    <View style={[s.root, { paddingTop: topPad }]}>

      {/* Header — title is absolutely centered so it never shifts off-center
          if the back button's hit area or safe-area insets differ by device. */}
      <Animated.View entering={FadeInDown.duration(280)} style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.back(); }} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Feather name="arrow-left" size={22} color={C.text} />
        </TouchableOpacity>
        <Text style={s.title} numberOfLines={1}>Setting</Text>
      </Animated.View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[s.scroll, { paddingBottom: insets.bottom + 40 }]}>

        {/* Profile card */}
        <Animated.View entering={FadeInDown.duration(300).delay(30)} style={s.profileCard}>
          <Image
            source={require("@/assets/images/3d_avatar_16.png")}
            style={s.avatar}
            contentFit="cover"
            cachePolicy="memory-disk"
          />
          <View style={s.profileInfo}>
            <Text style={s.profileName}>{firstName}</Text>
            <Text style={s.profileEmail} numberOfLines={1}>{email}</Text>
          </View>
          <TouchableOpacity style={s.editBtn} onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}>
            <Feather name="edit-2" size={14} color={C.textSec} />
          </TouchableOpacity>
        </Animated.View>

        {/* Search */}
        <Animated.View entering={FadeInDown.duration(300).delay(60)} style={s.searchRow}>
          <Feather name="search" size={16} color={C.chevron} />
          <TextInput
            style={s.searchInput}
            placeholder="Search"
            placeholderTextColor={C.chevron}
            value={query}
            onChangeText={setQuery}
            autoCapitalize="none"
            returnKeyType="search"
          />
        </Animated.View>

        {/* Settings rows */}
        <Animated.View entering={FadeInUp.duration(320).delay(90)} style={s.listCard}>
          {filteredRows.map((item, i) => (
            <React.Fragment key={item.id}>
              <TouchableOpacity style={s.rowItem} activeOpacity={0.7} onPress={() => handleRowPress(item.id)}>
                <View style={[s.rowIcon, { backgroundColor: item.color + "18" }]}>
                  <Feather name={item.icon} size={18} color={item.color} />
                </View>
                <View style={s.rowInfo}>
                  <Text style={s.rowLabel}>{item.label}</Text>
                  {item.sublabel ? <Text style={s.rowSublabel} numberOfLines={1}>{item.sublabel}</Text> : null}
                </View>
                <Feather name="chevron-right" size={16} color={C.chevron} />
              </TouchableOpacity>
              {i < filteredRows.length - 1 && <View style={s.rowDivider} />}
            </React.Fragment>
          ))}
        </Animated.View>

        {/* Log out */}
        <Animated.View entering={FadeInUp.duration(300).delay(130)}>
          <Pressable style={s.logoutBtn} onPress={handleLogout}>
            <Feather name="log-out" size={18} color={C.text} style={{ marginRight: 10 }} />
            <Text style={s.logoutText}>Log out</Text>
          </Pressable>
        </Animated.View>

      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg, paddingHorizontal: 20 },

  header: { flexDirection: "row", alignItems: "center", position: "relative", height: 40, marginBottom: 20 },
  backBtn: { width: 40, height: 40, alignItems: "center", justifyContent: "center", zIndex: 1 },
  title: {
    position: "absolute",
    left: 40, right: 40,
    textAlign: "center",
    fontSize: 18, fontFamily: "Manrope_700Bold", color: C.text,
  },

  scroll: { gap: 16 },

  profileCard: { flexDirection: "row", alignItems: "center", gap: 14, backgroundColor: C.inputBg, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: C.border },
  avatar:      { width: 64, height: 64, borderRadius: 32 },
  profileInfo: { flex: 1 },
  profileName:  { fontSize: 16, fontFamily: "Manrope_700Bold", color: C.text, marginBottom: 3 },
  profileEmail: { fontSize: 13, fontFamily: "Manrope_400Regular", color: C.textSec },
  editBtn:     { width: 34, height: 34, borderRadius: 10, backgroundColor: C.bg, borderWidth: 1, borderColor: C.border, alignItems: "center", justifyContent: "center" },

  searchRow:   { flexDirection: "row", alignItems: "center", gap: 10, backgroundColor: C.inputBg, borderRadius: 28, paddingHorizontal: 18, height: 52 },
  searchInput: { flex: 1, fontSize: 15, fontFamily: "Manrope_400Regular", color: C.text, height: "100%" },

  listCard:    { borderWidth: 1, borderColor: C.border, borderRadius: 16, overflow: "hidden", backgroundColor: C.bg },
  rowItem:     { flexDirection: "row", alignItems: "center", gap: 14, paddingVertical: 14, paddingHorizontal: 16 },
  rowIcon:     { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  rowInfo:     { flex: 1 },
  rowLabel:    { fontSize: 15, fontFamily: "Manrope_600SemiBold", color: C.text, marginBottom: 2 },
  rowSublabel: { fontSize: 12, fontFamily: "Manrope_400Regular", color: C.textSec },
  rowDivider:  { height: 1, backgroundColor: C.border, marginHorizontal: 16 },

  logoutBtn:  { height: 54, borderRadius: 14, borderWidth: 1.5, borderColor: C.text, flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: 4 },
  logoutText: { fontSize: 16, fontFamily: "Manrope_600SemiBold", color: C.text },
});
