import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Platform,
  Pressable,
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
  primary: "#135EF2",
};

type Category = "Gift Cards" | "Crypto" | "eSIM";

const GIFT_RATES = [
  { id:"1", name:"Amazon",         flag:"🇺🇸", rate:"₦1,650/USD", badge:"Popular",   badgeBg:"#FFF2CF", badgeColor:"#5C4000" },
  { id:"2", name:"iTunes",         flag:"🍎", rate:"₦1,580/USD", badge:"Top Rate",  badgeBg:"#D6E1FF", badgeColor:"#1A3070" },
  { id:"3", name:"Google Play",    flag:"▶️",  rate:"₦1,540/USD", badge:null,        badgeBg:"",         badgeColor:"" },
  { id:"4", name:"Steam",          flag:"🎮", rate:"₦1,490/USD", badge:null,        badgeBg:"",         badgeColor:"" },
  { id:"5", name:"Visa Gift Card", flag:"💳", rate:"₦1,600/USD", badge:"Fast Pay",  badgeBg:"#F0FFF4", badgeColor:"#059669" },
  { id:"6", name:"Walmart",        flag:"🛒", rate:"₦1,450/USD", badge:null,        badgeBg:"",         badgeColor:"" },
  { id:"7", name:"eBay",           flag:"🛍️", rate:"₦1,420/USD", badge:null,        badgeBg:"",         badgeColor:"" },
  { id:"8", name:"Vanilla",        flag:"🍦", rate:"₦1,380/USD", badge:null,        badgeBg:"",         badgeColor:"" },
];

const CRYPTO_RATES = [
  { id:"1", name:"Bitcoin",  symbol:"BTC", rate:"₦85,200,000",  change:"+2.4%",  up:true,  bg:"#FFF7ED", color:"#F7931A" },
  { id:"2", name:"Ethereum", symbol:"ETH", rate:"₦5,100,000",   change:"+1.8%",  up:true,  bg:"#EFF6FF", color:"#627EEA" },
  { id:"3", name:"USDT",     symbol:"USDT",rate:"₦1,620",       change:"0.0%",   up:true,  bg:"#F0FFF9", color:"#26A17B" },
  { id:"4", name:"BNB",      symbol:"BNB", rate:"₦560,000",     change:"-0.7%",  up:false, bg:"#FFFBEB", color:"#F3BA2F" },
  { id:"5", name:"Solana",   symbol:"SOL", rate:"₦128,000",     change:"+5.1%",  up:true,  bg:"#F5F3FF", color:"#9945FF" },
  { id:"6", name:"XRP",      symbol:"XRP", rate:"₦920",         change:"-1.2%",  up:false, bg:"#F0F9FF", color:"#346AA9" },
];

export default function RatesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 48 : insets.top;
  const [tab, setTab] = useState<Category>("Gift Cards");

  return (
    <View style={[s.root, { paddingTop: topPad }]}>

      {/* Header */}
      <Animated.View entering={FadeInDown.duration(280)} style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.back(); }}>
          <Feather name="arrow-left" size={20} color={C.navy} />
        </TouchableOpacity>
        <Text style={s.title}>Rates</Text>
        <View style={{ width: 36 }} />
      </Animated.View>

      {/* Tab bar */}
      <Animated.View entering={FadeInDown.duration(290).delay(30)} style={s.tabBar}>
        {(["Gift Cards", "Crypto", "eSIM"] as Category[]).map(t => (
          <Pressable
            key={t}
            style={[s.tabItem, tab === t && s.tabItemActive]}
            onPress={() => { Haptics.selectionAsync(); setTab(t); }}
          >
            <Text style={[s.tabText, tab === t && s.tabTextActive]}>{t}</Text>
          </Pressable>
        ))}
      </Animated.View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[s.scroll, { paddingBottom: insets.bottom + 100 }]}
      >

        {tab === "Gift Cards" && (
          <Animated.View entering={FadeInDown.duration(300).delay(40)} style={{ gap: 1 }}>
            {/* Header row */}
            <View style={s.tableHeader}>
              <Text style={[s.thText, { flex: 2 }]}>Gift Card</Text>
              <Text style={[s.thText, { flex: 1, textAlign: "right" }]}>Rate</Text>
            </View>
            {GIFT_RATES.map((item, i) => (
              <Animated.View key={item.id} entering={FadeInDown.duration(240).delay(i * 30)}>
                <TouchableOpacity
                  style={s.rateRow}
                  activeOpacity={0.75}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    router.push("/(app)/sell-gift-card" as any);
                  }}
                >
                  <View style={s.rateLeft}>
                    <View style={s.rateIconCircle}>
                      <Text style={{ fontSize: 20 }}>{item.flag}</Text>
                    </View>
                    <View style={{ gap: 3 }}>
                      <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                        <Text style={s.rateName}>{item.name}</Text>
                        {item.badge && (
                          <View style={[s.badge, { backgroundColor: item.badgeBg }]}>
                            <Text style={[s.badgeText, { color: item.badgeColor }]}>{item.badge}</Text>
                          </View>
                        )}
                      </View>
                      <Text style={s.rateSubtitle}>per USD</Text>
                    </View>
                  </View>
                  <View style={s.rateRight}>
                    <Text style={s.rateValue}>{item.rate}</Text>
                    <Feather name="chevron-right" size={14} color={C.textMut} />
                  </View>
                </TouchableOpacity>
                {i < GIFT_RATES.length - 1 && <View style={s.divider} />}
              </Animated.View>
            ))}
          </Animated.View>
        )}

        {tab === "Crypto" && (
          <Animated.View entering={FadeInDown.duration(300).delay(40)} style={{ gap: 1 }}>
            <View style={s.tableHeader}>
              <Text style={[s.thText, { flex: 2 }]}>Coin</Text>
              <Text style={[s.thText, { flex: 1, textAlign: "right" }]}>Price (NGN)</Text>
            </View>
            {CRYPTO_RATES.map((item, i) => (
              <Animated.View key={item.id} entering={FadeInDown.duration(240).delay(i * 30)}>
                <TouchableOpacity
                  style={s.rateRow}
                  activeOpacity={0.75}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    router.push("/(app)/crypto" as any);
                  }}
                >
                  <View style={s.rateLeft}>
                    <View style={[s.rateIconCircle, { backgroundColor: item.bg }]}>
                      <Text style={{ fontSize: 14, fontFamily: "Manrope_700Bold", color: item.color }}>{item.symbol.slice(0,2)}</Text>
                    </View>
                    <View style={{ gap: 3 }}>
                      <Text style={s.rateName}>{item.name}</Text>
                      <Text style={s.rateSubtitle}>{item.symbol}</Text>
                    </View>
                  </View>
                  <View style={s.rateRight}>
                    <Text style={s.rateValue}>{item.rate}</Text>
                    <Text style={{ fontSize: 11, fontFamily: "Manrope_600SemiBold", color: item.up ? C.success : C.danger }}>
                      {item.change}
                    </Text>
                  </View>
                </TouchableOpacity>
                {i < CRYPTO_RATES.length - 1 && <View style={s.divider} />}
              </Animated.View>
            ))}
          </Animated.View>
        )}

        {tab === "eSIM" && (
          <Animated.View entering={FadeInUp.duration(300).delay(40)} style={s.emptyState}>
            <Feather name="wifi" size={40} color={C.textMut} />
            <Text style={s.emptyTitle}>eSIM Rates</Text>
            <Text style={s.emptyDesc}>eSIM rates will be available soon. Check back later.</Text>
          </Animated.View>
        )}

      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },

  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingBottom: 12, paddingTop: 8 },
  backBtn: { width: 36, height: 36, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 18, fontFamily: "Manrope_700Bold", color: C.navy },

  tabBar: { flexDirection: "row", paddingHorizontal: 20, gap: 8, paddingBottom: 12 },
  tabItem:       { flex: 1, paddingVertical: 9, borderRadius: 10, backgroundColor: "#F8F9FA", alignItems: "center", borderWidth: 1, borderColor: C.border },
  tabItemActive: { backgroundColor: C.navy, borderColor: C.navy },
  tabText:       { fontSize: 12, fontFamily: "Manrope_600SemiBold", color: C.textSec },
  tabTextActive: { color: "#FFFFFF" },

  scroll: { paddingHorizontal: 20, paddingTop: 4 },

  tableHeader: {
    flexDirection: "row", justifyContent: "space-between",
    paddingHorizontal: 4, paddingVertical: 10, marginBottom: 2,
  },
  thText: { fontSize: 11, fontFamily: "Manrope_600SemiBold", color: C.textMut, textTransform: "uppercase", letterSpacing: 0.5 },

  rateRow:    { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 14 },
  rateLeft:   { flexDirection: "row", alignItems: "center", gap: 12, flex: 1 },
  rateRight:  { alignItems: "flex-end", gap: 3 },
  rateIconCircle: { width: 44, height: 44, borderRadius: 22, backgroundColor: "#F8F9FA", alignItems: "center", justifyContent: "center" },
  rateName:    { fontSize: 14, fontFamily: "Manrope_600SemiBold", color: C.text },
  rateSubtitle:{ fontSize: 11, fontFamily: "Manrope_400Regular", color: C.textMut },
  rateValue:   { fontSize: 13, fontFamily: "Manrope_700Bold", color: C.navy },
  badge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  badgeText: { fontSize: 9, fontFamily: "Manrope_700Bold" },
  divider: { height: 1, backgroundColor: C.border },

  emptyState: { alignItems: "center", paddingTop: 80, gap: 12 },
  emptyTitle: { fontSize: 18, fontFamily: "Manrope_700Bold", color: C.navy },
  emptyDesc:  { fontSize: 14, fontFamily: "Manrope_400Regular", color: C.textSec, textAlign: "center", lineHeight: 22 },
});
