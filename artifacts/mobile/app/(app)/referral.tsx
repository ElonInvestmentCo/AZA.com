import { Feather } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@/context/AuthContext";

const C = {
  bg:      "#FFFFFF",
  text:    "#0B0A0A",
  navy:    "#061941",
  textSec: "#595F67",
  textMut: "#AAAFB5",
  border:  "#F0F0F0",
  success: "#00B03C",
  primary: "#135EF2",
};

const STEPS = [
  { id: "1", icon: "share-2" as const, title: "Share your referral link", desc: "Share your unique referral code with friends and family." },
  { id: "2", icon: "user-plus" as const, title: "Friend signs up & trades", desc: "They create an account and complete their first transaction." },
  { id: "3", icon: "dollar-sign" as const, title: "Both earn rewards", desc: "You both earn ₦5,000 added to your wallet instantly." },
];

const HISTORY = [
  { id: "1", name: "James Okafor",  date: "Jun 20, 2025", amount: "₦5,000", status: "paid"    },
  { id: "2", name: "Ayo Adeyemi",   date: "Jun 18, 2025", amount: "₦5,000", status: "paid"    },
  { id: "3", name: "Chioma Eze",    date: "Jun 10, 2025", amount: "₦5,000", status: "pending" },
];

export default function ReferralScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const topPad = Platform.OS === "web" ? 48 : insets.top;

  const [copied, setCopied] = useState(false);
  const referralCode = "PV-" + (user?.name ?? "USER").toUpperCase().replace(/\s/g, "").slice(0, 5) + "2024";

  const handleCopy = async () => {
    await Clipboard.setStringAsync(referralCode);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShare = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      await Share.share({
        message: `Join PAYVORA and start earning! Use my referral code: ${referralCode}. Download the app and get started today.`,
        title: "Join PAYVORA — Earn ₦5,000",
      });
    } catch {}
  };

  return (
    <View style={[s.root, { paddingTop: topPad }]}>

      {/* Header */}
      <Animated.View entering={FadeInDown.duration(280)} style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.back(); }}>
          <Feather name="arrow-left" size={20} color={C.navy} />
        </TouchableOpacity>
        <Text style={s.title}>Refer & Earn</Text>
        <View style={{ width: 36 }} />
      </Animated.View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[s.scroll, { paddingBottom: insets.bottom + 100 }]}
      >

        {/* Hero card */}
        <Animated.View entering={FadeInDown.duration(360).delay(40)} style={s.heroCard}>
          <View style={s.heroOrb1} />
          <View style={s.heroOrb2} />
          <Text style={s.heroEmoji}>🎁</Text>
          <Text style={s.heroTitle}>Earn ₦5,000 per referral</Text>
          <Text style={s.heroDesc}>Invite your friends to join PAYVORA. Both of you earn ₦5,000 when they complete their first transaction.</Text>
          <View style={s.heroDivider} />
          <View style={s.heroStats}>
            <View style={s.heroStat}>
              <Text style={s.heroStatNum}>{HISTORY.length}</Text>
              <Text style={s.heroStatLabel}>Referrals</Text>
            </View>
            <View style={s.heroStatDivider} />
            <View style={s.heroStat}>
              <Text style={s.heroStatNum}>₦{(HISTORY.filter(h => h.status === "paid").length * 5000).toLocaleString("en-NG")}</Text>
              <Text style={s.heroStatLabel}>Earned</Text>
            </View>
            <View style={s.heroStatDivider} />
            <View style={s.heroStat}>
              <Text style={s.heroStatNum}>{HISTORY.filter(h => h.status === "pending").length}</Text>
              <Text style={s.heroStatLabel}>Pending</Text>
            </View>
          </View>
        </Animated.View>

        {/* Referral code */}
        <Animated.View entering={FadeInDown.duration(320).delay(80)}>
          <Text style={s.sectionTitle}>Your Referral Code</Text>
          <View style={s.codeRow}>
            <View style={s.codeBox}>
              <Text style={s.codeText}>{referralCode}</Text>
            </View>
            <TouchableOpacity style={[s.copyBtn, copied && { backgroundColor: C.success }]} onPress={handleCopy} activeOpacity={0.82}>
              <Feather name={copied ? "check" : "copy"} size={16} color="#FFFFFF" />
              <Text style={s.copyBtnText}>{copied ? "Copied!" : "Copy"}</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Share button */}
        <Animated.View entering={FadeInDown.duration(300).delay(110)}>
          <TouchableOpacity style={s.shareBtn} onPress={handleShare} activeOpacity={0.85}>
            <Feather name="share-2" size={18} color="#FFFFFF" />
            <Text style={s.shareBtnText}>Share Referral Link</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* How it works */}
        <Animated.View entering={FadeInUp.duration(320).delay(140)}>
          <Text style={s.sectionTitle}>How it works</Text>
          <View style={s.stepsCard}>
            {STEPS.map((step, i) => (
              <View key={step.id}>
                <View style={s.stepRow}>
                  <View style={s.stepNumWrap}>
                    <View style={s.stepNum}>
                      <Text style={s.stepNumText}>{step.id}</Text>
                    </View>
                    {i < STEPS.length - 1 && <View style={s.stepLine} />}
                  </View>
                  <View style={s.stepContent}>
                    <View style={s.stepIconWrap}>
                      <Feather name={step.icon} size={18} color={C.primary} />
                    </View>
                    <View style={{ flex: 1, gap: 3 }}>
                      <Text style={s.stepTitle}>{step.title}</Text>
                      <Text style={s.stepDesc}>{step.desc}</Text>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* Referral history */}
        <Animated.View entering={FadeInUp.duration(300).delay(180)}>
          <Text style={s.sectionTitle}>Referral History</Text>
          <View style={s.historyCard}>
            {HISTORY.length === 0 ? (
              <View style={s.emptyState}>
                <Feather name="users" size={28} color={C.textMut} />
                <Text style={s.emptyText}>No referrals yet</Text>
              </View>
            ) : (
              HISTORY.map((item, i) => (
                <View key={item.id}>
                  <View style={s.historyRow}>
                    <View style={s.historyAvatar}>
                      <Text style={s.historyAvatarText}>{item.name.split(" ").map(n => n[0]).join("").slice(0,2)}</Text>
                    </View>
                    <View style={{ flex: 1, gap: 3 }}>
                      <Text style={s.historyName}>{item.name}</Text>
                      <Text style={s.historyDate}>{item.date}</Text>
                    </View>
                    <View style={{ alignItems: "flex-end", gap: 3 }}>
                      <Text style={[s.historyAmount, { color: item.status === "paid" ? C.success : "#D97706" }]}>
                        +{item.amount}
                      </Text>
                      <View style={[s.statusBadge, { backgroundColor: item.status === "paid" ? "#E8F7EF" : "#FFFBEB" }]}>
                        <Text style={[s.statusText, { color: item.status === "paid" ? C.success : "#D97706" }]}>
                          {item.status === "paid" ? "Paid" : "Pending"}
                        </Text>
                      </View>
                    </View>
                  </View>
                  {i < HISTORY.length - 1 && <View style={s.divider} />}
                </View>
              ))
            )}
          </View>
        </Animated.View>

      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },

  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingBottom: 12, paddingTop: 8 },
  backBtn: { width: 36, height: 36, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 18, fontFamily: "Manrope_700Bold", color: C.navy },

  scroll: { paddingHorizontal: 20, paddingTop: 4, gap: 20 },

  heroCard: {
    backgroundColor: "#000000", borderRadius: 20, padding: 24,
    overflow: "hidden", gap: 10,
  },
  heroOrb1: { position: "absolute", width: 200, height: 200, borderRadius: 100, backgroundColor: "rgba(255,255,255,0.04)", top: -60, right: -40 },
  heroOrb2: { position: "absolute", width: 120, height: 120, borderRadius: 60, backgroundColor: "rgba(255,255,255,0.04)", bottom: -20, left: -20 },
  heroEmoji: { fontSize: 36 },
  heroTitle: { fontSize: 22, fontFamily: "Manrope_700Bold", color: "#FFFFFF" },
  heroDesc:  { fontSize: 13, fontFamily: "Manrope_400Regular", color: "rgba(255,255,255,0.7)", lineHeight: 20 },
  heroDivider: { height: 1, backgroundColor: "rgba(255,255,255,0.12)", marginVertical: 4 },
  heroStats:   { flexDirection: "row", alignItems: "center" },
  heroStat:    { flex: 1, alignItems: "center", gap: 3 },
  heroStatNum: { fontSize: 18, fontFamily: "Manrope_700Bold", color: "#FFFFFF" },
  heroStatLabel: { fontSize: 11, fontFamily: "Manrope_400Regular", color: "rgba(255,255,255,0.6)" },
  heroStatDivider: { width: 1, height: 32, backgroundColor: "rgba(255,255,255,0.15)" },

  sectionTitle: { fontSize: 14, fontFamily: "Manrope_700Bold", color: C.navy, marginBottom: 10 },

  codeRow: { flexDirection: "row", gap: 10, alignItems: "center" },
  codeBox: { flex: 1, backgroundColor: "#F8F9FA", borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, borderWidth: 1, borderColor: C.border, borderStyle: "dashed" },
  codeText: { fontSize: 15, fontFamily: "Manrope_700Bold", color: C.navy, letterSpacing: 1 },
  copyBtn: { backgroundColor: C.navy, borderRadius: 12, flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 14, paddingVertical: 14 },
  copyBtnText: { fontSize: 13, fontFamily: "Manrope_700Bold", color: "#FFFFFF" },

  shareBtn: { backgroundColor: "#000000", height: 52, borderRadius: 12, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10 },
  shareBtnText: { fontSize: 15, fontFamily: "Manrope_700Bold", color: "#FFFFFF" },

  stepsCard: { gap: 0 },
  stepRow:   { flexDirection: "row", gap: 12 },
  stepNumWrap: { alignItems: "center", width: 28 },
  stepNum: { width: 28, height: 28, borderRadius: 14, backgroundColor: C.navy, alignItems: "center", justifyContent: "center" },
  stepNumText: { fontSize: 12, fontFamily: "Manrope_700Bold", color: "#FFFFFF" },
  stepLine: { width: 2, flex: 1, backgroundColor: "#EEF0F2", marginVertical: 4, marginBottom: 0 },
  stepContent: { flex: 1, flexDirection: "row", gap: 12, paddingBottom: 20 },
  stepIconWrap: { width: 36, height: 36, borderRadius: 10, backgroundColor: "#EFF6FF", alignItems: "center", justifyContent: "center" },
  stepTitle: { fontSize: 13, fontFamily: "Manrope_700Bold", color: C.text },
  stepDesc:  { fontSize: 12, fontFamily: "Manrope_400Regular", color: C.textSec, lineHeight: 17 },

  historyCard: { borderRadius: 16, borderWidth: 1, borderColor: C.border, overflow: "hidden", backgroundColor: C.bg },
  historyRow:  { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 14, paddingHorizontal: 16 },
  historyAvatar: { width: 42, height: 42, borderRadius: 21, backgroundColor: "#EFF6FF", alignItems: "center", justifyContent: "center" },
  historyAvatarText: { fontSize: 13, fontFamily: "Manrope_700Bold", color: C.primary },
  historyName:   { fontSize: 13, fontFamily: "Manrope_600SemiBold", color: C.text },
  historyDate:   { fontSize: 11, fontFamily: "Manrope_400Regular", color: C.textMut },
  historyAmount: { fontSize: 13, fontFamily: "Manrope_700Bold" },
  statusBadge:   { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  statusText:    { fontSize: 10, fontFamily: "Manrope_600SemiBold" },
  divider:       { height: 1, backgroundColor: C.border },

  emptyState: { alignItems: "center", justifyContent: "center", paddingVertical: 32, gap: 8 },
  emptyText:  { fontSize: 14, fontFamily: "Manrope_500Medium", color: C.textMut },
});
