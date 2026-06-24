import { Feather, Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useState } from "react";
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
import Animated, {
  FadeInDown,
  FadeInUp,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@/context/AuthContext";

const C = {
  bg:         "#FFFFFF",
  text:       "#0B0A0A",
  textSec:    "#6A707C",
  border:     "#E8ECF4",
  inputBg:    "#F7F8F9",
  chevron:    "#C5C6CC",
  logoutBorder: "#0B0A0A",
};

type SettingRow = {
  id: string;
  label: string;
  sublabel?: string;
  onPress: () => void;
};

function SearchBar() {
  const [query, setQuery] = useState("");
  return (
    <View style={sb.wrap}>
      <Feather name="search" size={18} color={C.chevron} style={sb.icon} />
      <TextInput
        style={sb.input}
        placeholder="Search"
        placeholderTextColor={C.chevron}
        value={query}
        onChangeText={setQuery}
        autoCapitalize="none"
        returnKeyType="search"
      />
    </View>
  );
}

const sb = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.inputBg,
    borderRadius: 28,
    paddingHorizontal: 16,
    height: 52,
    marginBottom: 8,
  },
  icon: { marginRight: 10 },
  input: {
    flex: 1,
    fontSize: 15,
    fontFamily: "Manrope_400Regular",
    color: C.text,
    height: "100%",
  },
});

function RowItem({
  item,
  isLast,
}: {
  item: SettingRow;
  isLast: boolean;
}) {
  return (
    <TouchableOpacity
      style={[row.wrap, !isLast && row.border]}
      activeOpacity={0.7}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        item.onPress();
      }}
    >
      <View style={row.info}>
        <Text style={row.label}>{item.label}</Text>
        {item.sublabel ? (
          <Text style={row.sublabel} numberOfLines={1}>
            {item.sublabel}
          </Text>
        ) : null}
      </View>
      <Ionicons name="chevron-forward" size={18} color={C.chevron} />
    </TouchableOpacity>
  );
}

const row = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 18,
    paddingHorizontal: 4,
  },
  border: {
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  info: { flex: 1 },
  label: {
    fontSize: 16,
    fontFamily: "Manrope_600SemiBold",
    color: C.text,
    marginBottom: 2,
  },
  sublabel: {
    fontSize: 13,
    fontFamily: "Manrope_400Regular",
    color: C.textSec,
  },
});

export default function SettingsScreen() {
  const router  = useRouter();
  const insets  = useSafeAreaInsets();
  const { logout } = useAuth();

  const topPad = Platform.OS === "web" ? 48 : insets.top + 8;

  const ROWS: SettingRow[] = [
    {
      id: "password",
      label: "Change password",
      sublabel: "Change E-wallet account's login password",
      onPress: () => {},
    },
    {
      id: "pin",
      label: "Set PIN code",
      sublabel: "Change, reset PIN code used in transaction",
      onPress: () => {},
    },
    {
      id: "quick",
      label: "Quick payment setting",
      sublabel: "Payment without authentication",
      onPress: () => {},
    },
    {
      id: "language",
      label: "Language",
      sublabel: "English",
      onPress: () => {},
    },
    {
      id: "info",
      label: "App information",
      onPress: () => {},
    },
    {
      id: "biometrics",
      label: "Biometrics",
      onPress: () => {},
    },
  ];

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
          onPress: () => {
            logout();
            router.replace("/(auth)/login" as any);
          },
        },
      ],
    );
  };

  return (
    <View style={[s.root, { paddingTop: topPad }]}>

      {/* ── Header ── */}
      <Animated.View entering={FadeInDown.duration(300)} style={s.header}>
        <TouchableOpacity
          style={s.backBtn}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.back();
          }}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="chevron-back" size={22} color={C.text} />
        </TouchableOpacity>
        <Text style={s.title}>Setting</Text>
        <View style={{ width: 40 }} />
      </Animated.View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          s.scroll,
          { paddingBottom: insets.bottom + 40 },
        ]}
      >
        {/* ── Search ── */}
        <Animated.View entering={FadeInDown.duration(320).delay(40)}>
          <SearchBar />
        </Animated.View>

        {/* ── Settings list ── */}
        <Animated.View
          entering={FadeInUp.duration(340).delay(80)}
          style={s.list}
        >
          {ROWS.map((item, i) => (
            <RowItem
              key={item.id}
              item={item}
              isLast={i === ROWS.length - 1}
            />
          ))}
        </Animated.View>

        {/* ── Log out ── */}
        <Animated.View entering={FadeInUp.duration(320).delay(140)}>
          <Pressable style={s.logoutBtn} onPress={handleLogout}>
            <Text style={s.logoutText}>Log out</Text>
          </Pressable>
        </Animated.View>
      </ScrollView>

    </View>
  );
}

const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: C.bg,
    paddingHorizontal: 24,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 18,
    fontFamily: "Manrope_700Bold",
    color: C.text,
  },

  scroll: {
    flexGrow: 1,
  },

  list: {
    marginTop: 8,
    marginBottom: 40,
  },

  logoutBtn: {
    height: 58,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: C.logoutBorder,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  logoutText: {
    fontSize: 16,
    fontFamily: "Manrope_600SemiBold",
    color: C.text,
  },
});
