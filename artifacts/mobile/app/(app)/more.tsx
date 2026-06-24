import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { ScreenHeader } from "@/components/ScreenHeader";

const C = {
  bg:      "#FFFFFF",
  text:    "#0B0A0A",
  textSec: "#595F67",
  textMut: "#AAAFB5",
  border:  "#EDF1F3",
  surface: "#F8F9FA",
  accent:  "#35C2C1",
};

type ServiceItem = {
  id:      string;
  label:   string;
  icon:    React.ComponentProps<typeof Feather>["name"];
  color:   string;
  route:   string | null;
  desc:    string;
  badge?:  string;
};

const SERVICES: ServiceItem[] = [
  { id:"crypto",   label:"Crypto",          icon:"trending-up",  color:"#F7931A", route:"/(app)/crypto",   desc:"Buy and sell cryptocurrencies" },
  { id:"esim",     label:"eSIM",            icon:"wifi",         color:"#35C2C1", route:"/(app)/esim",     desc:"Global eSIM data packages" },
  { id:"referral", label:"Referral",        icon:"users",        color:"#7C3AED", route:"/(app)/referral", desc:"Earn ₦500 per referral", badge:"₦500" },
  { id:"airtime",  label:"Airtime",         icon:"phone",        color:"#FFCC00", route:"/(app)/airtime",  desc:"Buy airtime for any network" },
  { id:"data",     label:"Data Bundle",     icon:"wifi",         color:"#3B82F6", route:"/(app)/data",     desc:"Mobile data plans" },
  { id:"bills",    label:"Pay Bills",       icon:"zap",          color:"#F59E0B", route:"/(app)/bills",    desc:"Electricity, Cable TV, Internet" },
  { id:"withdraw", label:"Withdraw",        icon:"arrow-up-circle",color:"#EF4444",route:"/(app)/withdraw", desc:"Withdraw funds to bank" },
  { id:"rates",    label:"Rates",           icon:"bar-chart-2",  color:"#10B981", route:"/(app)/rates",    desc:"Live gift card & crypto rates" },
  { id:"settings", label:"Settings",        icon:"sliders",      color:"#8B8FA3", route:"/(app)/settings", desc:"Account & security settings" },
  { id:"kyc",      label:"Verify Identity", icon:"shield",       color:"#6366F1", route:null,              desc:"KYC verification tiers", badge:"Tier 1" },
  { id:"support",  label:"Support",         icon:"headphones",   color:"#EC4899", route:null,              desc:"Get help & live chat" },
  { id:"notifications",label:"Notifications",icon:"bell",        color:"#F97316", route:null,              desc:"Manage your notifications" },
];

type SectionDef = { title: string; items: ServiceItem[] };

const SECTIONS: SectionDef[] = [
  { title:"Finance",  items: SERVICES.filter(s => ["crypto","withdraw","rates"].includes(s.id)) },
  { title:"Connectivity", items: SERVICES.filter(s => ["esim","airtime","data"].includes(s.id)) },
  { title:"Payments", items: SERVICES.filter(s => ["bills"].includes(s.id)) },
  { title:"Account",  items: SERVICES.filter(s => ["referral","kyc","settings","support","notifications"].includes(s.id)) },
];

export default function MoreScreen() {
  const router = useRouter();

  return (
    <View style={s.root}>
      <ScreenHeader title="More Services" />
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        {SECTIONS.map((section, si) => (
          <Animated.View key={section.title} entering={FadeInDown.duration(300).delay(si * 40)}>
            <Text style={s.sectionTitle}>{section.title}</Text>
            <View style={s.sectionGrid}>
              {section.items.map((item, i) => (
                <Animated.View key={item.id} entering={FadeInDown.duration(260).delay(si * 40 + i * 20)}>
                  <TouchableOpacity
                    style={s.itemCard}
                    activeOpacity={0.8}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      if (item.route) router.push(item.route as any);
                    }}
                  >
                    <View style={[s.iconWrap, { backgroundColor: item.color + "18" }]}>
                      <Feather name={item.icon} size={22} color={item.color} />
                    </View>
                    <View style={s.itemInfo}>
                      <View style={s.labelRow}>
                        <Text style={s.itemLabel}>{item.label}</Text>
                        {item.badge && (
                          <View style={[s.badge, { backgroundColor: item.color + "20" }]}>
                            <Text style={[s.badgeText, { color: item.color }]}>{item.badge}</Text>
                          </View>
                        )}
                      </View>
                      <Text style={s.itemDesc} numberOfLines={1}>{item.desc}</Text>
                    </View>
                    <Feather name="chevron-right" size={18} color={C.textMut} />
                  </TouchableOpacity>
                </Animated.View>
              ))}
            </View>
          </Animated.View>
        ))}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root:  { flex:1, backgroundColor:C.bg },
  scroll:{ padding:20, gap:24, paddingBottom:100 },

  sectionTitle: { fontSize:13, fontFamily:"Manrope_700Bold", color:C.textMut, textTransform:"uppercase", letterSpacing:0.6, marginBottom:10 },
  sectionGrid:  { gap:1, borderRadius:16, overflow:"hidden", borderWidth:1, borderColor:C.border },

  itemCard: {
    flexDirection:"row", alignItems:"center", gap:14,
    backgroundColor:C.bg, paddingVertical:14, paddingHorizontal:16,
    borderBottomWidth:1, borderBottomColor:C.border,
  },
  iconWrap: { width:46, height:46, borderRadius:14, alignItems:"center", justifyContent:"center" },
  itemInfo: { flex:1 },
  labelRow: { flexDirection:"row", alignItems:"center", gap:8 },
  itemLabel:{ fontSize:14, fontFamily:"Manrope_600SemiBold", color:C.text },
  itemDesc: { fontSize:12, fontFamily:"Manrope_400Regular", color:C.textMut, marginTop:2 },
  badge:    { paddingHorizontal:7, paddingVertical:2, borderRadius:8 },
  badgeText:{ fontSize:10, fontFamily:"Manrope_600SemiBold" },
});
