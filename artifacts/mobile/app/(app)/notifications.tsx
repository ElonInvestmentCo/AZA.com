import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useState } from "react";
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

const C = {
  bg:      "#FFFFFF",
  text:    "#0B0A0A",
  navy:    "#061941",
  textSec: "#595F67",
  textMut: "#AAAFB5",
  border:  "#F0F0F0",
  success: "#00B03C",
  danger:  "#EF4444",
  warn:    "#D97706",
  accent:  "#00D9A0",
  info:    "#2563EB",
};

type NotifType = "transaction" | "security" | "promotion" | "system";

interface Notification {
  id:        string;
  type:      NotifType;
  title:     string;
  body:      string;
  time:      string;
  read:      boolean;
  icon:      keyof typeof Feather.glyphMap;
  iconBg:    string;
  iconColor: string;
}

const ICON_MAP: Record<NotifType, { icon: keyof typeof Feather.glyphMap; iconBg: string; iconColor: string }> = {
  transaction: { icon: "arrow-down-left", iconBg: "#F0FFF9", iconColor: C.success },
  security:    { icon: "shield",          iconBg: "#FFF0F0", iconColor: C.danger  },
  promotion:   { icon: "gift",            iconBg: "#FFF7ED", iconColor: C.warn    },
  system:      { icon: "bell",            iconBg: "#EFF6FF", iconColor: C.info    },
};

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    type: "transaction",
    title: "Withdrawal Successful",
    body: "₦5,000 has been withdrawn to GTBank ending in 6789.",
    time: "Just now",
    read: false,
    ...ICON_MAP.transaction,
  },
  {
    id: "2",
    type: "security",
    title: "New Device Login",
    body: "Your account was accessed from a new device. If this wasn't you, secure your account immediately.",
    time: "2 hours ago",
    read: false,
    ...ICON_MAP.security,
  },
  {
    id: "3",
    type: "transaction",
    title: "Airtime Purchase",
    body: "₦1,000 MTN airtime sent to 0812 345 6789.",
    time: "Yesterday, 3:42 PM",
    read: true,
    ...ICON_MAP.transaction,
  },
  {
    id: "4",
    type: "promotion",
    title: "Refer & Earn Bonus",
    body: "Your friend signed up using your referral code. ₦5,000 will be credited once they complete KYC.",
    time: "Yesterday, 11:00 AM",
    read: true,
    ...ICON_MAP.promotion,
  },
  {
    id: "5",
    type: "transaction",
    title: "Electricity Bill Payment",
    body: "₦10,000 EKEDC prepaid meter top-up was successful. Token: 4521-9845-7623-1290.",
    time: "2 days ago",
    read: true,
    ...ICON_MAP.transaction,
  },
  {
    id: "6",
    type: "system",
    title: "Identity Verification Complete",
    body: "Your KYC verification has been approved. You now have full wallet access.",
    time: "3 days ago",
    read: true,
    ...ICON_MAP.system,
  },
  {
    id: "7",
    type: "promotion",
    title: "Weekend Promo 🎉",
    body: "0% fee on all bill payments this weekend. Shop smarter with PAYVORA.",
    time: "4 days ago",
    read: true,
    ...ICON_MAP.promotion,
  },
  {
    id: "8",
    type: "transaction",
    title: "DSTV Subscription Renewed",
    body: "₦24,500 DSTV Compact Plus subscription renewed for account 1234567890.",
    time: "5 days ago",
    read: true,
    ...ICON_MAP.transaction,
  },
];

export default function NotificationsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 20 : insets.top;

  const [items, setItems] = useState<Notification[]>(MOCK_NOTIFICATIONS);

  const unreadCount = items.filter(n => !n.read).length;

  const markAllRead = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setItems(prev => prev.map(n => ({ ...n, read: true })));
  };

  const markRead = (id: string) => {
    setItems(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const dismiss = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setItems(prev => prev.filter(n => n.id !== id));
  };

  const unread  = items.filter(n => !n.read);
  const earlier = items.filter(n => n.read);

  return (
    <View style={[s.root, { paddingTop: topPad }]}>

      {/* Header */}
      <Animated.View entering={FadeInDown.duration(280)} style={s.header}>
        <TouchableOpacity
          style={s.backBtn}
          onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.back(); }}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Feather name="arrow-left" size={22} color={C.navy} />
        </TouchableOpacity>
        <View style={s.headerCenter}>
          <Text style={s.title}>Notifications</Text>
          {unreadCount > 0 && (
            <View style={s.badge}>
              <Text style={s.badgeText}>{unreadCount}</Text>
            </View>
          )}
        </View>
        {unreadCount > 0 ? (
          <TouchableOpacity onPress={markAllRead} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Text style={s.markAll}>Mark all read</Text>
          </TouchableOpacity>
        ) : (
          <View style={{ width: 80 }} />
        )}
      </Animated.View>

      <View style={s.divider} />

      {items.length === 0 ? (
        <Animated.View entering={FadeInUp.duration(320)} style={s.emptyState}>
          <View style={s.emptyIcon}>
            <Feather name="bell-off" size={32} color={C.textMut} />
          </View>
          <Text style={s.emptyTitle}>No notifications</Text>
          <Text style={s.emptySub}>You're all caught up. New alerts will appear here.</Text>
        </Animated.View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[s.scroll, { paddingBottom: insets.bottom + 48 }]}
        >
          {/* Unread section */}
          {unread.length > 0 && (
            <Animated.View entering={FadeInDown.duration(300).delay(40)}>
              <Text style={s.sectionLabel}>New</Text>
              {unread.map((n, i) => (
                <NotifCard
                  key={n.id}
                  item={n}
                  index={i}
                  onPress={() => markRead(n.id)}
                  onDismiss={() => dismiss(n.id)}
                />
              ))}
            </Animated.View>
          )}

          {/* Earlier section */}
          {earlier.length > 0 && (
            <Animated.View entering={FadeInDown.duration(300).delay(80)}>
              <Text style={s.sectionLabel}>Earlier</Text>
              {earlier.map((n, i) => (
                <NotifCard
                  key={n.id}
                  item={n}
                  index={i}
                  onPress={() => markRead(n.id)}
                  onDismiss={() => dismiss(n.id)}
                />
              ))}
            </Animated.View>
          )}
        </ScrollView>
      )}
    </View>
  );
}

function NotifCard({
  item, index, onPress, onDismiss,
}: {
  item: Notification; index: number; onPress: () => void; onDismiss: () => void;
}) {
  return (
    <Animated.View entering={FadeInDown.duration(280).delay(index * 30).springify()}>
      <TouchableOpacity
        style={[n.card, !item.read && n.cardUnread]}
        activeOpacity={0.75}
        onPress={() => { Haptics.selectionAsync(); onPress(); }}
      >
        {/* Unread dot */}
        {!item.read && <View style={n.unreadDot} />}

        {/* Icon */}
        <View style={[n.iconWrap, { backgroundColor: item.iconBg }]}>
          <Feather name={item.icon} size={18} color={item.iconColor} />
        </View>

        {/* Content */}
        <View style={n.content}>
          <View style={n.topRow}>
            <Text style={[n.title, !item.read && n.titleBold]}>{item.title}</Text>
            <TouchableOpacity
              onPress={onDismiss}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Feather name="x" size={14} color={C.textMut} />
            </TouchableOpacity>
          </View>
          <Text style={n.body} numberOfLines={2}>{item.body}</Text>
          <Text style={n.time}>{item.time}</Text>
        </View>
      </TouchableOpacity>
      <View style={n.separator} />
    </Animated.View>
  );
}

const s = StyleSheet.create({
  root:         { flex: 1, backgroundColor: C.bg },
  header:       { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingBottom: 14, paddingTop: 8 },
  backBtn:      { width: 36, height: 36, alignItems: "center", justifyContent: "center" },
  headerCenter: { flexDirection: "row", alignItems: "center", gap: 8 },
  title:        { fontSize: 18, fontFamily: "Manrope_700Bold", color: C.navy },
  badge:        { backgroundColor: C.danger, borderRadius: 10, minWidth: 20, height: 20, alignItems: "center", justifyContent: "center", paddingHorizontal: 5 },
  badgeText:    { fontSize: 11, fontFamily: "Manrope_700Bold", color: "#FFFFFF" },
  markAll:      { fontSize: 12, fontFamily: "Manrope_600SemiBold", color: C.accent },
  divider:      { height: 1, backgroundColor: C.border },
  scroll:       { paddingTop: 8 },
  sectionLabel: { fontSize: 12, fontFamily: "Manrope_700Bold", color: C.textSec, textTransform: "uppercase", letterSpacing: 0.6, paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8 },
  emptyState:   { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 40, gap: 12 },
  emptyIcon:    { width: 72, height: 72, borderRadius: 36, backgroundColor: "#F0F0F0", alignItems: "center", justifyContent: "center" },
  emptyTitle:   { fontSize: 18, fontFamily: "Manrope_700Bold", color: C.text },
  emptySub:     { fontSize: 13, fontFamily: "Manrope_400Regular", color: C.textSec, textAlign: "center", lineHeight: 20 },
});

const n = StyleSheet.create({
  card:       { flexDirection: "row", alignItems: "flex-start", paddingHorizontal: 20, paddingVertical: 14, gap: 12, position: "relative" },
  cardUnread: { backgroundColor: "#FAFFFE" },
  unreadDot:  { position: "absolute", top: 18, left: 8, width: 6, height: 6, borderRadius: 3, backgroundColor: C.accent },
  iconWrap:   { width: 42, height: 42, borderRadius: 12, alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 },
  content:    { flex: 1, gap: 3 },
  topRow:     { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 8 },
  title:      { fontSize: 13, fontFamily: "Manrope_500Medium", color: C.text, flex: 1 },
  titleBold:  { fontFamily: "Manrope_700Bold" },
  body:       { fontSize: 12, fontFamily: "Manrope_400Regular", color: C.textSec, lineHeight: 17 },
  time:       { fontSize: 11, fontFamily: "Manrope_400Regular", color: C.textMut, marginTop: 2 },
  separator:  { height: 1, backgroundColor: C.border, marginHorizontal: 20 },
});
