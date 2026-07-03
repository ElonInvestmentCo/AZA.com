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
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const C = {
  bg:        "#FFFFFF",
  text:      "#0B0A0A",
  navy:      "#061941",
  textSec:   "#595F67",
  textMuted: "#6C7278",
  inputBg:   "#F0F0F0",
  border:    "#EDF1F3",
  success:   "#00B03C",
  dark:      "#010101",
  black:     "#000000",
  primary:   "#135EF2",
};

const REGIONS = ["Africa", "Europe", "Americas", "Asia Pacific", "Middle East", "Global"];

const ESIM_PLANS = [
  { id:"1",  country:"Nigeria",       flag:"🇳🇬", data:"1GB",  duration:"7 Days",  price:"₦2,500",  popular:true  },
  { id:"2",  country:"Nigeria",       flag:"🇳🇬", data:"3GB",  duration:"30 Days", price:"₦6,000",  popular:false },
  { id:"3",  country:"United States", flag:"🇺🇸", data:"5GB",  duration:"30 Days", price:"₦8,500",  popular:true  },
  { id:"4",  country:"United Kingdom",flag:"🇬🇧", data:"3GB",  duration:"30 Days", price:"₦7,200",  popular:false },
  { id:"5",  country:"Europe",        flag:"🇪🇺", data:"5GB",  duration:"15 Days", price:"₦9,000",  popular:false },
  { id:"6",  country:"Global",        flag:"🌍",  data:"10GB", duration:"30 Days", price:"₦18,000", popular:true  },
  { id:"7",  country:"Canada",        flag:"🇨🇦", data:"3GB",  duration:"14 Days", price:"₦6,500",  popular:false },
  { id:"8",  country:"Germany",       flag:"🇩🇪", data:"5GB",  duration:"30 Days", price:"₦8,000",  popular:false },
];

export default function EsimScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 20 : insets.top;

  const [region,     setRegion]     = useState("All");
  const [search,     setSearch]     = useState("");
  const [selected,   setSelected]   = useState("");
  const [showModal,  setShowModal]  = useState(false);

  const plan = ESIM_PLANS.find(p => p.id === selected);

  const filtered = ESIM_PLANS.filter(p =>
    (region === "All" || p.country.toLowerCase().includes(region.toLowerCase())) &&
    (search === "" || p.country.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>

      <Animated.View entering={FadeInDown.duration(280).springify()} style={[s.header, { paddingTop: topPad + 10 }]}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
          <Feather name="arrow-left" size={22} color="#1E232C" />
        </TouchableOpacity>
        <Text style={s.headerTitle}>eSIM Plans</Text>
        <View style={{ width: 44 }} />
      </Animated.View>
      <View style={s.divider} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[s.scroll, { paddingBottom: insets.bottom + 40 }]}>

        <Animated.View entering={FadeInDown.duration(300).delay(30)}>
          <Text style={s.subtitle}>Browse and buy international eSIM data plans.</Text>
        </Animated.View>

        {/* Search */}
        <Animated.View entering={FadeInDown.duration(300).delay(50)} style={s.searchRow}>
          <Feather name="search" size={16} color={C.textMuted} />
          <TextInput
            style={s.searchInput}
            placeholder="Search country or region..."
            placeholderTextColor="#646464"
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch("")}>
              <Feather name="x" size={16} color={C.textMuted} />
            </TouchableOpacity>
          )}
        </Animated.View>

        {/* Region chips */}
        <Animated.View entering={FadeInDown.duration(300).delay(70)}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.regionScroll}>
            {["All", ...REGIONS].map(r => (
              <Pressable
                key={r}
                style={[s.regionChip, region === r && s.regionChipActive]}
                onPress={() => { Haptics.selectionAsync(); setRegion(r); }}
              >
                <Text style={[s.regionText, region === r && s.regionTextActive]}>{r}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Plans list */}
        <Animated.View entering={FadeInDown.duration(300).delay(100)}>
          {filtered.length === 0 ? (
            <View style={s.empty}>
              <Feather name="globe" size={32} color={C.textMuted} />
              <Text style={s.emptyText}>No plans found</Text>
            </View>
          ) : (
            filtered.map((p, i) => (
              <Animated.View key={p.id} entering={FadeInDown.duration(240).delay(i * 25)}>
                <TouchableOpacity
                  style={[s.planCard, selected === p.id && { borderColor: C.primary, borderWidth: 2 }]}
                  activeOpacity={0.82}
                  onPress={() => { Haptics.selectionAsync(); setSelected(p.id); }}
                >
                  <View style={s.planLeft}>
                    <Text style={s.planFlag}>{p.flag}</Text>
                    <View style={s.planInfo}>
                      <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                        <Text style={s.planCountry}>{p.country}</Text>
                        {p.popular && (
                          <View style={s.popularBadge}>
                            <Text style={s.popularText}>Popular</Text>
                          </View>
                        )}
                      </View>
                      <Text style={s.planMeta}>{p.data} · {p.duration}</Text>
                    </View>
                  </View>
                  <View style={s.planRight}>
                    <Text style={s.planPrice}>{p.price}</Text>
                    <View style={[s.selectCircle, selected === p.id && { backgroundColor: C.primary, borderColor: C.primary }]}>
                      {selected === p.id && <Feather name="check" size={10} color="#fff" />}
                    </View>
                  </View>
                </TouchableOpacity>
                {i < filtered.length - 1 && <View style={s.planDivider} />}
              </Animated.View>
            ))
          )}
        </Animated.View>

        {/* Selected summary */}
        {plan && (
          <Animated.View entering={FadeInUp.duration(260)} style={s.summaryBox}>
            <View style={s.summaryRow}>
              <Text style={s.summaryLabel}>Plan</Text>
              <Text style={s.summaryValue}>{plan.flag} {plan.country} — {plan.data}</Text>
            </View>
            <View style={s.summaryLine} />
            <View style={s.summaryRow}>
              <Text style={s.summaryLabel}>Duration</Text>
              <Text style={s.summaryValue}>{plan.duration}</Text>
            </View>
            <View style={s.summaryLine} />
            <View style={s.summaryRow}>
              <Text style={s.summaryLabel}>Total:</Text>
              <Text style={[s.summaryValue, { fontFamily: "Manrope_700Bold", fontSize: 13 }]}>{plan.price}</Text>
            </View>
          </Animated.View>
        )}

        <TouchableOpacity
          style={[s.buyBtn, !selected && { opacity: 0.45 }]}
          onPress={() => {
            if (!selected) return;
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            router.push({ pathname: "/(app)/submitted" as any, params: { title: "eSIM Activated", subtitle: "Your eSIM plan has been\nactivated successfully" } });
          }}
          activeOpacity={0.85}
        >
          <Text style={s.buyBtnText}>Purchase eSIM</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  header:      { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingBottom: 14, backgroundColor: C.bg },
  backBtn:     { width: 44, height: 44, alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: 13, fontFamily: "Manrope_700Bold", color: C.text, textTransform: "capitalize" },
  divider:     { height: 1, backgroundColor: "#D1D1D1" },
  scroll:      { paddingHorizontal: 20, paddingTop: 20, gap: 16 },
  subtitle:    { fontSize: 12, fontFamily: "Manrope_500Medium", color: C.textMuted, letterSpacing: 0.24 },

  searchRow:  { flexDirection: "row", alignItems: "center", gap: 10, backgroundColor: C.inputBg, borderRadius: 10, paddingHorizontal: 14, height: 46, borderWidth: 1, borderColor: C.border },
  searchInput: { flex: 1, fontSize: 13, fontFamily: "Manrope_500Medium", color: C.text },

  regionScroll: { gap: 8, paddingBottom: 4 },
  regionChip:        { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, borderWidth: 1, borderColor: C.border, backgroundColor: "#F8F9FA" },
  regionChipActive:  { backgroundColor: C.navy, borderColor: C.navy },
  regionText:        { fontSize: 12, fontFamily: "Manrope_500Medium", color: C.textSec },
  regionTextActive:  { color: "#FFFFFF" },

  planCard: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 14, borderRadius: 12, borderWidth: 1, borderColor: "transparent", paddingHorizontal: 4 },
  planLeft: { flexDirection: "row", alignItems: "center", gap: 12, flex: 1 },
  planFlag: { fontSize: 28 },
  planInfo: { flex: 1, gap: 3 },
  planCountry: { fontSize: 14, fontFamily: "Manrope_600SemiBold", color: C.text },
  planMeta:    { fontSize: 12, fontFamily: "Manrope_400Regular", color: C.textMuted },
  planRight:   { alignItems: "flex-end", gap: 8 },
  planPrice:   { fontSize: 14, fontFamily: "Manrope_700Bold", color: C.navy },
  selectCircle: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: C.border, alignItems: "center", justifyContent: "center" },
  planDivider: { height: 1, backgroundColor: C.border },

  popularBadge: { backgroundColor: "#FFF2CF", paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  popularText:  { fontSize: 9, fontFamily: "Manrope_700Bold", color: "#5C4000" },

  summaryBox:   { backgroundColor: C.dark, borderRadius: 10, paddingHorizontal: 18, paddingVertical: 2 },
  summaryRow:   { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 13 },
  summaryLine:  { height: 1, backgroundColor: "rgba(255,255,255,0.1)" },
  summaryLabel: { fontSize: 10, fontFamily: "Manrope_400Regular", color: "rgba(255,255,255,0.7)" },
  summaryValue: { fontSize: 10, fontFamily: "Manrope_500Medium", color: "#FFFFFF" },

  buyBtn:     { backgroundColor: C.black, height: 48, borderRadius: 10, alignItems: "center", justifyContent: "center", elevation: 4 },
  buyBtnText: { fontSize: 14, fontFamily: "Manrope_700Bold", color: "#FFFFFF", letterSpacing: -0.14 },

  empty: { alignItems: "center", paddingVertical: 40, gap: 8 },
  emptyText: { fontSize: 14, fontFamily: "Manrope_500Medium", color: C.textMuted },
});
