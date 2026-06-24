import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";
import { useAuth } from "@/context/AuthContext";

interface SettingItem {
  label: string;
  icon: string;
  iconColor: string;
  type: "nav" | "toggle" | "danger";
  value?: boolean;
  onPress?: () => void;
  onToggle?: (v: boolean) => void;
}

export default function ProfileScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user, logout } = useAuth();

  const [notifications, setNotifications] = useState(true);
  const [biometrics, setBiometrics] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [priceAlerts, setPriceAlerts] = useState(false);

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const firstName = user?.name?.split(" ")[0] ?? "User";
  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "PV";

  const memberSince = user?.joinedAt
    ? new Date(user.joinedAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : "June 2026";

  async function handleLogout() {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          await logout();
          router.replace("/login");
        },
      },
    ]);
  }

  const sections: { title: string; items: SettingItem[] }[] = [
    {
      title: "Account",
      items: [
        {
          label: "Personal Info",
          icon: "user",
          iconColor: "#3B82F6",
          type: "nav",
          onPress: () => Haptics.selectionAsync(),
        },
        {
          label: "Payment Methods",
          icon: "credit-card",
          iconColor: "#00D9A0",
          type: "nav",
          onPress: () => Haptics.selectionAsync(),
        },
        {
          label: "Verification (KYC)",
          icon: "shield",
          iconColor: "#F59E0B",
          type: "nav",
          onPress: () => Haptics.selectionAsync(),
        },
      ],
    },
    {
      title: "Security",
      items: [
        {
          label: "Biometric Login",
          icon: "lock",
          iconColor: "#8B5CF6",
          type: "toggle",
          value: biometrics,
          onToggle: (v) => {
            setBiometrics(v);
            Haptics.selectionAsync();
          },
        },
        {
          label: "Change PIN",
          icon: "key",
          iconColor: "#EF4444",
          type: "nav",
          onPress: () => Haptics.selectionAsync(),
        },
        {
          label: "Two-Factor Auth",
          icon: "smartphone",
          iconColor: "#3B82F6",
          type: "nav",
          onPress: () => Haptics.selectionAsync(),
        },
      ],
    },
    {
      title: "Preferences",
      items: [
        {
          label: "Push Notifications",
          icon: "bell",
          iconColor: "#F59E0B",
          type: "toggle",
          value: notifications,
          onToggle: (v) => {
            setNotifications(v);
            Haptics.selectionAsync();
          },
        },
        {
          label: "Price Alerts",
          icon: "trending-up",
          iconColor: "#00D9A0",
          type: "toggle",
          value: priceAlerts,
          onToggle: (v) => {
            setPriceAlerts(v);
            Haptics.selectionAsync();
          },
        },
        {
          label: "Dark Mode",
          icon: "moon",
          iconColor: "#6B7280",
          type: "toggle",
          value: darkMode,
          onToggle: (v) => {
            setDarkMode(v);
            Haptics.selectionAsync();
          },
        },
      ],
    },
    {
      title: "Support",
      items: [
        {
          label: "Help Center",
          icon: "help-circle",
          iconColor: "#3B82F6",
          type: "nav",
          onPress: () => Haptics.selectionAsync(),
        },
        {
          label: "Terms of Service",
          icon: "file-text",
          iconColor: "#6B7280",
          type: "nav",
          onPress: () => Haptics.selectionAsync(),
        },
        {
          label: "Privacy Policy",
          icon: "eye-off",
          iconColor: "#6B7280",
          type: "nav",
          onPress: () => Haptics.selectionAsync(),
        },
      ],
    },
  ];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingTop: topPad, paddingBottom: (Platform.OS === "web" ? 34 : 0) + 100 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.foreground }]}>Profile</Text>
        <TouchableOpacity
          style={[styles.headerBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={() => Haptics.selectionAsync()}
        >
          <Feather name="edit-2" size={16} color={colors.foreground} />
        </TouchableOpacity>
      </View>

      {/* User Card */}
      <View style={[styles.userCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={[styles.avatarLarge, { backgroundColor: colors.primary + "20", borderColor: colors.primary + "40" }]}>
          <Text style={[styles.avatarInitials, { color: colors.primary }]}>{initials}</Text>
        </View>
        <View style={styles.userInfo}>
          <Text style={[styles.userName, { color: colors.foreground }]}>{user?.name ?? "Payvora User"}</Text>
          <Text style={[styles.userEmail, { color: colors.mutedForeground }]}>{user?.email ?? "user@payvora.app"}</Text>
        </View>
        <View style={[styles.memberBadge, { backgroundColor: colors.primary + "15", borderColor: colors.primary + "30" }]}>
          <Feather name="star" size={12} color={colors.primary} />
          <Text style={[styles.memberText, { color: colors.primary }]}>Member since {memberSince}</Text>
        </View>
      </View>

      {/* Stats Row */}
      <View style={styles.statsRow}>
        {[
          { label: "Transactions", value: "48", icon: "activity", color: "#3B82F6" },
          { label: "Countries", value: "12", icon: "globe", color: "#00D9A0" },
          { label: "Referrals", value: "7", icon: "users", color: "#8B5CF6" },
        ].map((stat) => (
          <View key={stat.label} style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Feather name={stat.icon as any} size={18} color={stat.color} />
            <Text style={[styles.statValue, { color: colors.foreground }]}>{stat.value}</Text>
            <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>{stat.label}</Text>
          </View>
        ))}
      </View>

      {/* Settings Sections */}
      {sections.map((section) => (
        <View key={section.title} style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>{section.title.toUpperCase()}</Text>
          <View style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            {section.items.map((item, i) => (
              <TouchableOpacity
                key={item.label}
                style={[
                  styles.settingRow,
                  i < section.items.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border },
                ]}
                onPress={item.type !== "toggle" ? item.onPress : undefined}
                activeOpacity={item.type === "nav" ? 0.7 : 1}
              >
                <View style={[styles.settingIcon, { backgroundColor: item.iconColor + "20" }]}>
                  <Feather name={item.icon as any} size={16} color={item.iconColor} />
                </View>
                <Text style={[styles.settingLabel, { color: colors.foreground }]}>{item.label}</Text>
                {item.type === "toggle" ? (
                  <Switch
                    value={item.value}
                    onValueChange={item.onToggle}
                    trackColor={{ false: colors.border, true: colors.primary + "60" }}
                    thumbColor={item.value ? colors.primary : colors.mutedForeground}
                    ios_backgroundColor={colors.border}
                  />
                ) : (
                  <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}

      {/* Sign Out */}
      <View style={styles.section}>
        <TouchableOpacity
          style={[styles.signOutBtn, { backgroundColor: colors.destructive + "15", borderColor: colors.destructive + "30" }]}
          onPress={handleLogout}
          activeOpacity={0.85}
        >
          <Feather name="log-out" size={18} color={colors.destructive} />
          <Text style={[styles.signOutText, { color: colors.destructive }]}>Sign Out</Text>
        </TouchableOpacity>
        <Text style={[styles.version, { color: colors.mutedForeground }]}>Payvora v1.0.0</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    paddingHorizontal: 24, paddingBottom: 20,
  },
  title: { fontSize: 28, fontFamily: "Inter_700Bold", letterSpacing: -0.5 },
  headerBtn: {
    width: 40, height: 40, borderRadius: 12, borderWidth: 1,
    alignItems: "center", justifyContent: "center",
  },
  userCard: {
    marginHorizontal: 24, borderRadius: 20, borderWidth: 1, padding: 20,
    alignItems: "center", gap: 12, marginBottom: 16,
  },
  avatarLarge: {
    width: 80, height: 80, borderRadius: 24, borderWidth: 2,
    alignItems: "center", justifyContent: "center",
  },
  avatarInitials: { fontSize: 28, fontFamily: "Inter_700Bold" },
  userInfo: { alignItems: "center" },
  userName: { fontSize: 20, fontFamily: "Inter_700Bold", marginBottom: 2 },
  userEmail: { fontSize: 14, fontFamily: "Inter_400Regular" },
  memberBadge: {
    flexDirection: "row", alignItems: "center", gap: 5, borderRadius: 10, borderWidth: 1,
    paddingHorizontal: 12, paddingVertical: 5,
  },
  memberText: { fontSize: 12, fontFamily: "Inter_500Medium" },
  statsRow: { flexDirection: "row", gap: 10, paddingHorizontal: 24, marginBottom: 20 },
  statCard: {
    flex: 1, borderRadius: 16, borderWidth: 1, padding: 14,
    alignItems: "center", gap: 6,
  },
  statValue: { fontSize: 20, fontFamily: "Inter_700Bold" },
  statLabel: { fontSize: 11, fontFamily: "Inter_400Regular", textAlign: "center" },
  section: { paddingHorizontal: 24, marginBottom: 20 },
  sectionTitle: { fontSize: 11, fontFamily: "Inter_600SemiBold", letterSpacing: 1, marginBottom: 10 },
  sectionCard: { borderRadius: 20, borderWidth: 1, overflow: "hidden" },
  settingRow: {
    flexDirection: "row", alignItems: "center", padding: 14, gap: 12,
  },
  settingIcon: { width: 36, height: 36, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  settingLabel: { flex: 1, fontSize: 15, fontFamily: "Inter_500Medium" },
  signOutBtn: {
    height: 56, borderRadius: 16, borderWidth: 1,
    flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10,
  },
  signOutText: { fontSize: 16, fontFamily: "Inter_600SemiBold" },
  version: { fontSize: 12, fontFamily: "Inter_400Regular", textAlign: "center", marginTop: 12 },
});
