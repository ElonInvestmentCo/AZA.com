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
import { ScreenHeader } from "@/components/ScreenHeader";
import { useAuth } from "@/context/AuthContext";

const C = {
  bg:      "#FFFFFF",
  text:    "#0B0A0A",
  textSec: "#595F67",
  textMut: "#AAAFB5",
  border:  "#EDF1F3",
  surface: "#F8F9FA",
  accent:  "#35C2C1",
  success: "#00B03C",
  btn:     "#000000",
};

const REFERRAL_HISTORY = [
  { id:"1", name:"John A.",   date:"Jun 20, 2025", earned:"₦500",   status:"completed" },
  { id:"2", name:"Sarah M.",  date:"Jun 15, 2025", earned:"₦500",   status:"completed" },
  { id:"3", name:"David O.",  date:"Jun 10, 2025", earned:"₦500",   status:"completed" },
  { id:"4", name:"Amara K.",  date:"Jun 05, 2025", earned:"₦500",   status:"pending"   },
  { id:"5", name:"Tunde B.",  date:"May 28, 2025", earned:"₦500",   status:"completed" },
];

export default function ReferralScreen() {
  const { user }      = useAuth();
  const [copied, setCopied] = useState(false);

  const refCode = "AZA" + (user?.name?.replace(/\s/g,"").toUpperCase().slice(0,4) ?? "USER") + "2025";
  const refLink = `https://aza.app/join?ref=${refCode}`;

  const totalEarned   = REFERRAL_HISTORY.filter(r => r.status === "completed").length * 500;
  const totalReferrals= REFERRAL_HISTORY.length;
  const pendingCount  = REFERRAL_HISTORY.filter(r => r.status === "pending").length;

  const copyCode = async () => {
    await Clipboard.setStringAsync(refCode);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareLink = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      await Share.share({
        message: `Join AZA and earn instantly! Use my referral code ${refCode} or link: ${refLink}`,
        title:   "Join AZA — Sell Gift Cards & More",
      });
    } catch {}
  };

  return (
    <View style={s.root}>
      <ScreenHeader title="Referral Program" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>

        {/* Hero card */}
        <Animated.View entering={FadeInDown.duration(350)} style={s.heroCard}>
          <Text style={s.heroTitle}>Earn ₦500 per referral</Text>
          <Text style={s.heroSub}>Invite friends to AZA and earn ₦500 for every friend who completes their first trade.</Text>
        </Animated.View>

        {/* Stats */}
        <Animated.View entering={FadeInDown.duration(330).delay(40)} style={s.statsRow}>
          {[
            { label:"Total Earned",  value:`₦${totalEarned.toLocaleString()}`, icon:"dollar-sign" as const, color:C.success   },
            { label:"Referrals",     value:`${totalReferrals}`,                icon:"users"       as const, color:"#7C3AED"   },
            { label:"Pending",       value:`${pendingCount}`,                  icon:"clock"       as const, color:"#F59E0B"   },
          ].map(stat => (
            <View key={stat.label} style={[s.statCard, { borderColor:C.border }]}>
              <View style={[s.statIcon, { backgroundColor: stat.color + "18" }]}>
                <Feather name={stat.icon} size={18} color={stat.color} />
              </View>
              <Text style={s.statValue}>{stat.value}</Text>
              <Text style={s.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </Animated.View>

        {/* Referral code */}
        <Animated.View entering={FadeInDown.duration(320).delay(80)} style={s.codeCard}>
          <Text style={s.codeLabel}>Your Referral Code</Text>
          <View style={s.codeRow}>
            <Text style={s.code}>{refCode}</Text>
            <TouchableOpacity style={[s.copyBtn, copied && s.copyBtnActive]} onPress={copyCode}>
              <Feather name={copied ? "check" : "copy"} size={16} color={copied ? "#fff" : C.text} />
              <Text style={[s.copyText, copied && { color:"#fff" }]}>{copied ? "Copied!" : "Copy"}</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={s.shareBtn} onPress={shareLink}>
            <Feather name="share-2" size={16} color="#fff" />
            <Text style={s.shareText}>Share Referral Link</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* How it works */}
        <Animated.View entering={FadeInUp.duration(320).delay(100)}>
          <Text style={s.sectionTitle}>How it works</Text>
          {[
            { step:"1", title:"Share your code",      desc:"Share your unique referral link or code with friends." },
            { step:"2", title:"Friend registers",     desc:"Your friend creates an account using your code." },
            { step:"3", title:"Friend completes trade",desc:"Your friend completes their first gift card trade." },
            { step:"4", title:"You both earn",        desc:"You earn ₦500 instantly credited to your wallet." },
          ].map(item => (
            <View key={item.step} style={s.stepRow}>
              <View style={s.stepNum}>
                <Text style={s.stepNumText}>{item.step}</Text>
              </View>
              <View style={s.stepInfo}>
                <Text style={s.stepTitle}>{item.title}</Text>
                <Text style={s.stepDesc}>{item.desc}</Text>
              </View>
            </View>
          ))}
        </Animated.View>

        {/* History */}
        <Animated.View entering={FadeInUp.duration(320).delay(140)}>
          <Text style={s.sectionTitle}>Referral History</Text>
          {REFERRAL_HISTORY.map((r, i) => (
            <Animated.View key={r.id} entering={FadeInDown.duration(250).delay(i * 25)}>
              <View style={[s.histRow, { borderColor:C.border }]}>
                <View style={[s.histIcon, { backgroundColor: C.success + "15" }]}>
                  <Feather name="user-check" size={16} color={C.success} />
                </View>
                <View style={s.histInfo}>
                  <Text style={s.histName}>{r.name}</Text>
                  <Text style={s.histDate}>{r.date}</Text>
                </View>
                <View style={s.histRight}>
                  <Text style={[s.histEarned, { color: r.status === "completed" ? C.success : "#F59E0B" }]}>{r.earned}</Text>
                  <Text style={[s.histStatus, { color: r.status === "completed" ? C.success : "#F59E0B" }]}>
                    {r.status === "completed" ? "Paid" : "Pending"}
                  </Text>
                </View>
              </View>
            </Animated.View>
          ))}
        </Animated.View>

      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root:  { flex:1, backgroundColor:C.bg },
  scroll:{ padding:20, gap:24, paddingBottom:100 },

  heroCard: {
    backgroundColor: C.btn, borderRadius:20, padding:24, gap:8,
    shadowColor:"#000", shadowOffset:{width:0,height:4}, shadowOpacity:0.2, shadowRadius:12, elevation:6,
  },
  heroTitle: { fontSize:22, fontFamily:"Manrope_700Bold", color:"#fff" },
  heroSub:   { fontSize:13, fontFamily:"Manrope_400Regular", color:"rgba(255,255,255,0.65)", lineHeight:20 },

  statsRow: { flexDirection:"row", gap:10 },
  statCard: {
    flex:1, alignItems:"center", gap:6, padding:14,
    backgroundColor:C.surface, borderRadius:16, borderWidth:1,
  },
  statIcon:  { width:40, height:40, borderRadius:12, alignItems:"center", justifyContent:"center" },
  statValue: { fontSize:16, fontFamily:"Manrope_700Bold", color:C.text },
  statLabel: { fontSize:10, fontFamily:"Manrope_400Regular", color:C.textMut, textAlign:"center" },

  codeCard: { backgroundColor:C.surface, borderRadius:20, padding:20, gap:16, borderWidth:1, borderColor:C.border },
  codeLabel: { fontSize:13, fontFamily:"Manrope_500Medium", color:C.textSec },
  codeRow:   { flexDirection:"row", alignItems:"center", justifyContent:"space-between" },
  code: { fontSize:24, fontFamily:"Manrope_700Bold", color:C.text, letterSpacing:2 },
  copyBtn:       { flexDirection:"row", alignItems:"center", gap:6, paddingHorizontal:14, paddingVertical:8, borderRadius:20, borderWidth:1, borderColor:C.border, backgroundColor:"#fff" },
  copyBtnActive: { backgroundColor:C.success, borderColor:C.success },
  copyText:      { fontSize:13, fontFamily:"Manrope_600SemiBold", color:C.text },
  shareBtn:      { flexDirection:"row", alignItems:"center", justifyContent:"center", gap:8, backgroundColor:C.btn, borderRadius:14, height:50 },
  shareText:     { fontSize:15, fontFamily:"Manrope_700Bold", color:"#fff" },

  sectionTitle: { fontSize:16, fontFamily:"Manrope_700Bold", color:C.text, marginBottom:12 },

  stepRow: { flexDirection:"row", gap:14, marginBottom:16 },
  stepNum: { width:32, height:32, borderRadius:16, backgroundColor:C.btn, alignItems:"center", justifyContent:"center", marginTop:2 },
  stepNumText: { fontSize:13, fontFamily:"Manrope_700Bold", color:"#fff" },
  stepInfo:  {},
  stepTitle: { fontSize:14, fontFamily:"Manrope_600SemiBold", color:C.text },
  stepDesc:  { fontSize:12, fontFamily:"Manrope_400Regular", color:C.textSec, marginTop:3, lineHeight:18 },

  histRow:  { flexDirection:"row", alignItems:"center", gap:12, paddingVertical:12, borderBottomWidth:1 },
  histIcon: { width:38, height:38, borderRadius:12, alignItems:"center", justifyContent:"center" },
  histInfo: { flex:1 },
  histName: { fontSize:13, fontFamily:"Manrope_600SemiBold", color:C.text },
  histDate: { fontSize:11, fontFamily:"Manrope_400Regular", color:C.textMut, marginTop:2 },
  histRight:   { alignItems:"flex-end" },
  histEarned:  { fontSize:13, fontFamily:"Manrope_700Bold" },
  histStatus:  { fontSize:10, fontFamily:"Manrope_500Medium", marginTop:2 },
});
