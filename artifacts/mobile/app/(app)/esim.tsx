import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { ScreenHeader } from "@/components/ScreenHeader";

const C = {
  bg:      "#FFFFFF",
  text:    "#0B0A0A",
  textSec: "#595F67",
  textMut: "#AAAFB5",
  border:  "#EDF1F3",
  surface: "#F8F9FA",
  inputBg: "#F7F8F9",
  btn:     "#000000",
  accent:  "#35C2C1",
};

type Region = { id:string; label:string; emoji:string; countries:number };
type ESimPlan = { id:string; data:string; validity:string; price:string; speed:string };

const REGIONS: Region[] = [
  { id:"global",  label:"Global",        emoji:"🌍", countries:190 },
  { id:"africa",  label:"Africa",        emoji:"🌍", countries:54  },
  { id:"europe",  label:"Europe",        emoji:"🇪🇺", countries:40  },
  { id:"asia",    label:"Asia Pacific",  emoji:"🌏", countries:35  },
  { id:"america", label:"Americas",      emoji:"🌎", countries:30  },
  { id:"mena",    label:"Middle East",   emoji:"🕌", countries:22  },
];

const PLANS_BY_REGION: Record<string, ESimPlan[]> = {
  global:  [
    { id:"g1", data:"1GB",  validity:"7 Days",  price:"$9.99",  speed:"4G/LTE" },
    { id:"g2", data:"3GB",  validity:"15 Days", price:"$19.99", speed:"4G/LTE" },
    { id:"g3", data:"5GB",  validity:"30 Days", price:"$29.99", speed:"5G/4G"  },
    { id:"g4", data:"10GB", validity:"30 Days", price:"$49.99", speed:"5G/4G"  },
    { id:"g5", data:"20GB", validity:"60 Days", price:"$79.99", speed:"5G/4G"  },
  ],
  africa:  [
    { id:"a1", data:"1GB",  validity:"7 Days",  price:"$4.99",  speed:"4G/LTE" },
    { id:"a2", data:"3GB",  validity:"15 Days", price:"$11.99", speed:"4G/LTE" },
    { id:"a3", data:"10GB", validity:"30 Days", price:"$24.99", speed:"4G"     },
  ],
  europe:  [
    { id:"e1", data:"1GB",  validity:"7 Days",  price:"$6.99",  speed:"4G/LTE" },
    { id:"e2", data:"5GB",  validity:"30 Days", price:"$24.99", speed:"5G/4G"  },
    { id:"e3", data:"10GB", validity:"30 Days", price:"$39.99", speed:"5G/4G"  },
  ],
  asia:    [
    { id:"as1", data:"2GB",  validity:"15 Days", price:"$8.99",  speed:"4G/LTE" },
    { id:"as2", data:"5GB",  validity:"30 Days", price:"$19.99", speed:"5G/4G"  },
  ],
  america: [
    { id:"am1", data:"1GB",  validity:"7 Days",  price:"$7.99",  speed:"4G/LTE" },
    { id:"am2", data:"5GB",  validity:"30 Days", price:"$26.99", speed:"5G/4G"  },
  ],
  mena:    [
    { id:"m1", data:"1GB",  validity:"7 Days",  price:"$5.99",  speed:"4G/LTE" },
    { id:"m2", data:"5GB",  validity:"30 Days", price:"$22.99", speed:"4G/LTE" },
  ],
};

type Step = "region" | "plans" | "confirm" | "success";

function QRCodeDisplay() {
  // Decorative QR code placeholder
  const cells = 10;
  const pattern = [
    [1,1,1,1,1,1,1,0,1,0],
    [1,0,0,0,0,0,1,0,0,1],
    [1,0,1,1,1,0,1,0,1,0],
    [1,0,1,1,1,0,1,1,1,1],
    [1,0,1,1,1,0,1,0,0,0],
    [1,0,0,0,0,0,1,0,1,1],
    [1,1,1,1,1,1,1,0,1,0],
    [0,1,0,0,1,0,0,0,0,1],
    [1,0,1,1,0,1,1,1,0,1],
    [0,1,0,1,0,0,1,0,1,1],
  ];
  const size = 160;
  const cell = size / cells;
  return (
    <View style={{ width:size, height:size, backgroundColor:"#fff", padding:cell*0.5, borderRadius:8, borderWidth:1, borderColor:"#EDF1F3" }}>
      {pattern.map((row,r) => (
        <View key={r} style={{ flexDirection:"row" }}>
          {row.map((filled,c) => (
            <View key={c} style={{ width:cell, height:cell, backgroundColor:filled?"#000":"#fff" }} />
          ))}
        </View>
      ))}
    </View>
  );
}

export default function ESimScreen() {
  const router = useRouter();
  const [step,    setStep]    = useState<Step>("region");
  const [region,  setRegion]  = useState<Region | null>(null);
  const [plan,    setPlan]    = useState<ESimPlan | null>(null);
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1800));
    setLoading(false);
    setStep("success");
  };

  if (step === "success") {
    return (
      <View style={s.root}>
        <ScreenHeader title="eSIM Ready" showBack={false} />
        <ScrollView contentContainerStyle={s.successScroll}>
          <Animated.View entering={FadeInDown.duration(380).springify()} style={s.successCircle}>
            <Feather name="wifi" size={38} color="#fff" />
          </Animated.View>
          <Animated.Text entering={FadeInUp.duration(320).delay(80)} style={s.successTitle}>eSIM Activated!</Animated.Text>
          <Animated.Text entering={FadeInUp.duration(320).delay(100)} style={s.successSub}>
            Scan the QR code below to install your eSIM profile
          </Animated.Text>

          <Animated.View entering={FadeInUp.duration(320).delay(140)} style={s.qrCard}>
            <QRCodeDisplay />
            <Text style={s.qrScan}>Point your camera at this QR code</Text>
          </Animated.View>

          <Animated.View entering={FadeInUp.duration(300).delay(180)} style={s.receiptCard}>
            {[
              { label:"Region",    value: region?.label ?? "" },
              { label:"Plan",      value: `${plan?.data} / ${plan?.validity}` },
              { label:"Speed",     value: plan?.speed ?? "" },
              { label:"Amount",    value: plan?.price ?? "" },
              { label:"Reference", value: `ES-${Math.floor(Math.random()*900000)+100000}` },
            ].map(r => (
              <View key={r.label} style={s.receiptRow}>
                <Text style={s.receiptLabel}>{r.label}</Text>
                <Text style={s.receiptValue}>{r.value}</Text>
              </View>
            ))}
          </Animated.View>

          <Text style={s.installNote}>
            Go to Settings → Mobile Data → Add eSIM and scan the QR code, or tap "Install eSIM" in your device settings.
          </Text>

          <TouchableOpacity style={s.btn} onPress={() => router.back()}>
            <Text style={s.btnText}>Done</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={s.root}>
      <ScreenHeader title={
        step === "region"  ? "eSIM Packages" :
        step === "plans"   ? `${region?.emoji} ${region?.label} Plans` :
        "Confirm Purchase"
      } />

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

        {/* REGION */}
        {step === "region" && (
          <Animated.View entering={FadeInDown.duration(300)}>
            <Text style={s.subheading}>Select a region</Text>
            <View style={s.regionGrid}>
              {REGIONS.map((reg, i) => (
                <Animated.View key={reg.id} entering={FadeInDown.duration(270).delay(i * 30)}>
                  <TouchableOpacity
                    style={s.regionCard}
                    activeOpacity={0.8}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      setRegion(reg);
                      setStep("plans");
                    }}
                  >
                    <Text style={s.regionEmoji}>{reg.emoji}</Text>
                    <Text style={s.regionLabel}>{reg.label}</Text>
                    <Text style={s.regionSub}>{reg.countries} countries</Text>
                  </TouchableOpacity>
                </Animated.View>
              ))}
            </View>
          </Animated.View>
        )}

        {/* PLANS */}
        {step === "plans" && region && (
          <Animated.View entering={FadeInDown.duration(300)} style={{ gap: 10 }}>
            <Text style={s.subheading}>Select a data plan</Text>
            {(PLANS_BY_REGION[region.id] ?? []).map((p, i) => (
              <Animated.View key={p.id} entering={FadeInDown.duration(260).delay(i * 30)}>
                <TouchableOpacity
                  style={[s.planCard, plan?.id === p.id && s.planCardActive]}
                  activeOpacity={0.85}
                  onPress={() => {
                    Haptics.selectionAsync();
                    setPlan(p);
                  }}
                >
                  <View>
                    <Text style={s.planData}>{p.data}</Text>
                    <Text style={s.planMeta}>{p.validity} · {p.speed}</Text>
                  </View>
                  <View style={s.planRight}>
                    <Text style={s.planPrice}>{p.price}</Text>
                    {plan?.id === p.id && <Feather name="check-circle" size={18} color={C.accent} />}
                  </View>
                </TouchableOpacity>
              </Animated.View>
            ))}
            <TouchableOpacity
              style={[s.btn, { marginTop: 12 }, !plan && s.btnDisabled]}
              disabled={!plan}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                setStep("confirm");
              }}
            >
              <Text style={s.btnText}>Continue</Text>
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* CONFIRM */}
        {step === "confirm" && plan && region && (
          <Animated.View entering={FadeInDown.duration(300)} style={{ gap: 20 }}>
            <Text style={s.subheading}>Review your eSIM order</Text>
            <View style={s.receiptCard}>
              {[
                { label:"Region",    value: `${region.emoji} ${region.label}` },
                { label:"Countries", value: `${region.countries} countries` },
                { label:"Data",      value: plan.data },
                { label:"Validity",  value: plan.validity },
                { label:"Speed",     value: plan.speed },
                { label:"Price",     value: plan.price },
              ].map(r => (
                <View key={r.label} style={s.receiptRow}>
                  <Text style={s.receiptLabel}>{r.label}</Text>
                  <Text style={s.receiptValue}>{r.value}</Text>
                </View>
              ))}
            </View>
            <View style={[s.infoBox, { backgroundColor: C.accent + "12" }]}>
              <Feather name="info" size={14} color={C.accent} />
              <Text style={[s.infoText, { color: C.accent }]}>
                Your eSIM QR code will be generated immediately after payment.
              </Text>
            </View>
            <TouchableOpacity style={[s.btn, loading && s.btnDisabled]} disabled={loading} onPress={handlePay}>
              <Text style={s.btnText}>{loading ? "Processing…" : `Pay ${plan.price}`}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.secondaryBtn} onPress={() => setStep("plans")}>
              <Text style={s.secondaryText}>Change Plan</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root:  { flex:1, backgroundColor:C.bg },
  scroll:{ padding:20, flexGrow:1 },
  subheading: { fontSize:15, fontFamily:"Manrope_600SemiBold", color:C.textSec, marginBottom:16 },

  regionGrid: { flexDirection:"row", flexWrap:"wrap", gap:12 },
  regionCard: {
    width:"47%", backgroundColor:C.surface, borderRadius:16, padding:18,
    alignItems:"center", gap:6, borderWidth:1, borderColor:C.border,
  },
  regionEmoji: { fontSize:32, marginBottom:4 },
  regionLabel: { fontSize:14, fontFamily:"Manrope_700Bold", color:C.text },
  regionSub:   { fontSize:11, fontFamily:"Manrope_400Regular", color:C.textMut },

  planCard: {
    flexDirection:"row", alignItems:"center", justifyContent:"space-between",
    backgroundColor:C.surface, borderRadius:14, padding:16,
    borderWidth:1, borderColor:C.border,
  },
  planCardActive: { borderColor:C.accent, backgroundColor:C.accent + "08" },
  planData:  { fontSize:16, fontFamily:"Manrope_700Bold", color:C.text },
  planMeta:  { fontSize:12, fontFamily:"Manrope_400Regular", color:C.textMut, marginTop:3 },
  planRight: { flexDirection:"row", alignItems:"center", gap:8 },
  planPrice: { fontSize:16, fontFamily:"Manrope_700Bold", color:C.text },

  receiptCard:  { backgroundColor:C.surface, borderRadius:16, padding:18, borderWidth:1, borderColor:C.border, gap:14 },
  receiptRow:   { flexDirection:"row", justifyContent:"space-between", alignItems:"center" },
  receiptLabel: { fontSize:13, fontFamily:"Manrope_400Regular", color:C.textSec },
  receiptValue: { fontSize:13, fontFamily:"Manrope_600SemiBold", color:C.text },

  infoBox: { flexDirection:"row", alignItems:"flex-start", gap:8, borderRadius:12, padding:12 },
  infoText:{ flex:1, fontSize:12, fontFamily:"Manrope_400Regular", lineHeight:18 },

  btn:         { height:56, backgroundColor:C.btn, borderRadius:14, alignItems:"center", justifyContent:"center" },
  btnDisabled: { opacity:0.5 },
  btnText:     { fontSize:16, fontFamily:"Manrope_700Bold", color:"#fff" },
  secondaryBtn:  { height:48, alignItems:"center", justifyContent:"center" },
  secondaryText: { fontSize:14, fontFamily:"Manrope_600SemiBold", color:C.textSec },

  successScroll: { padding:24, alignItems:"center", gap:16, paddingBottom:60 },
  successCircle: { width:80, height:80, borderRadius:40, backgroundColor:C.accent, alignItems:"center", justifyContent:"center", marginBottom:4 },
  successTitle:  { fontSize:22, fontFamily:"Manrope_700Bold", color:C.text },
  successSub:    { fontSize:14, fontFamily:"Manrope_400Regular", color:C.textSec, textAlign:"center" },
  qrCard:  { alignItems:"center", gap:12, padding:20, backgroundColor:C.surface, borderRadius:20, borderWidth:1, borderColor:C.border, width:"100%" },
  qrScan:  { fontSize:12, fontFamily:"Manrope_400Regular", color:C.textSec },
  installNote: { fontSize:12, fontFamily:"Manrope_400Regular", color:C.textSec, textAlign:"center", lineHeight:18 },
});
