import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { AnimatedSheet } from "@/components/AnimatedSheet";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
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
import { fetchBillers, matchBiller, payBill, type ReloadlyBiller } from "@/utils/api";

const C = {
  bg:        "#FFFFFF",
  text:      "#0B0A0A",
  textSec:   "#595F67",
  textMuted: "#6C7278",
  inputBg:   "#F0F0F0",
  border:    "#EDF1F3",
  success:   "#00B03C",
  dark:      "#010101",
  black:     "#000000",
  accent:    "#E11D48",
  accentBg:  "#FFF1F2",
};

const PROVIDERS = [
  { id: "dstv",      name: "DSTV",      color: "#0069B4", bg: "#EFF6FF", abbr: "DST", hints: ["dstv"] },
  { id: "gotv",      name: "GOtv",      color: "#FF6900", bg: "#FFF7ED", abbr: "GOT", hints: ["gotv"] },
  { id: "startimes", name: "StarTimes", color: "#E11D48", bg: "#FFF1F2", abbr: "STA", hints: ["startimes", "starttimes"] },
  { id: "consat",    name: "Consat",    color: "#7C3AED", bg: "#F5F3FF", abbr: "CON", hints: ["consat"] },
];

const BOUQUETS: Record<string, { id: string; name: string; price: string }[]> = {
  dstv: [
    { id: "padi",       name: "DStv Padi",          price: "1,850"  },
    { id: "yanga",      name: "DStv Yanga",          price: "2,565"  },
    { id: "confam",     name: "DStv Confam",         price: "4,615"  },
    { id: "compact",    name: "DStv Compact",        price: "9,000"  },
    { id: "compact+",   name: "DStv Compact+",       price: "14,250" },
    { id: "premium",    name: "DStv Premium",        price: "29,500" },
  ],
  gotv: [
    { id: "smallie",  name: "GOtv Smallie",   price: "900"   },
    { id: "jinja",    name: "GOtv Jinja",     price: "1,900" },
    { id: "jolli",    name: "GOtv Jolli",     price: "3,300" },
    { id: "max",      name: "GOtv Max",       price: "4,850" },
    { id: "supa",     name: "GOtv Supa",      price: "6,400" },
    { id: "supa+",    name: "GOtv Supa+",     price: "7,200" },
  ],
  startimes: [
    { id: "nova",     name: "Nova",       price: "900"   },
    { id: "basic",    name: "Basic",      price: "1,850" },
    { id: "smart",    name: "Smart",      price: "2,100" },
    { id: "classic",  name: "Classic",    price: "2,500" },
    { id: "super",    name: "Super",      price: "4,900" },
  ],
  consat: [
    { id: "basic",    name: "Basic",      price: "1,500" },
    { id: "standard", name: "Standard",   price: "3,000" },
    { id: "premium",  name: "Premium",    price: "6,000" },
  ],
};

export default function CableScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 20 : insets.top;

  const [provider,      setProvider]      = useState<typeof PROVIDERS[number] | null>(null);
  const [smartCard,     setSmartCard]     = useState("");
  const [bouquet,       setBouquet]       = useState<{ id: string; name: string; price: string } | null>(null);
  const [bouquetSheet,  setBouquetSheet]  = useState(false);
  const [billers,       setBillers]       = useState<ReloadlyBiller[]>([]);
  const [submitting,    setSubmitting]    = useState(false);

  useEffect(() => {
    fetchBillers("CABLE_TV_BILL_PAYMENT")
      .then(setBillers)
      .catch((err) => console.warn("Failed to load cable billers:", err));
  }, []);

  const bouquets = provider ? (BOUQUETS[provider.id] ?? []) : [];
  const canProceed = !!provider && smartCard.length >= 10 && !!bouquet && !submitting;

  const handleSubscribe = async () => {
    if (!canProceed || !provider || !bouquet) return;

    const biller = matchBiller(billers, provider.hints);
    if (!biller) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Biller unavailable", `${provider.name} isn't currently available. Please try again later.`);
      return;
    }

    setSubmitting(true);
    try {
      const result = await payBill({
        billerId: biller.id,
        subscriberAccountNumber: smartCard,
        amount: parseInt(bouquet.price.replace(/,/g, "")),
        referenceId: `cable-${Date.now()}`,
      });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.push({
        pathname: "/(app)/submitted" as any,
        params: {
          title:    "Subscription Successful",
          subtitle: `Your ${provider.name} subscription is\nbeing processed (ref: ${result.referenceId})`,
        },
      });
    } catch (err) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Payment Failed", err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: C.bg }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* ── Header ── */}
      <Animated.View
        entering={FadeInDown.duration(280).springify()}
        style={[s.header, { paddingTop: topPad + 10 }]}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={s.backBtn}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Feather name="arrow-left" size={22} color="#1E232C" />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Cable TV</Text>
        <View style={{ width: 44 }} />
      </Animated.View>
      <View style={s.divider} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[s.scroll, { paddingBottom: insets.bottom + 40 }]}
      >
        <Animated.View entering={FadeInDown.duration(300).delay(30)}>
          <Text style={s.subtitle}>Select your cable provider and subscription plan.</Text>
        </Animated.View>

        {/* ── Provider cards ── */}
        <Animated.View entering={FadeInDown.duration(300).delay(60)}>
          <Text style={s.label}>cable provider</Text>
          <View style={s.providerGrid}>
            {PROVIDERS.map(p => {
              const active = provider?.id === p.id;
              return (
                <Pressable
                  key={p.id}
                  style={[
                    s.providerCard,
                    active && { borderColor: p.color, borderWidth: 2, backgroundColor: p.bg },
                  ]}
                  onPress={() => {
                    Haptics.selectionAsync();
                    setProvider(p);
                    setBouquet(null); // reset bouquet when provider changes
                  }}
                >
                  <View style={[s.providerIcon, { backgroundColor: active ? p.color + "22" : "#F0F0F0" }]}>
                    <Text style={[s.providerAbbr, { color: active ? p.color : C.textMuted }]}>
                      {p.abbr}
                    </Text>
                  </View>
                  <Text style={[s.providerName, active && { color: p.color }]} numberOfLines={1}>
                    {p.name}
                  </Text>
                  {active && (
                    <View style={[s.providerCheck, { backgroundColor: p.color }]}>
                      <Feather name="check" size={8} color="#fff" />
                    </View>
                  )}
                </Pressable>
              );
            })}
          </View>
        </Animated.View>

        {/* ── Smart card / IUC number ── */}
        <Animated.View entering={FadeInDown.duration(300).delay(90)}>
          <Text style={s.label}>
            {provider?.id === "dstv" || provider?.id === "gotv" ? "iuc / smart card number" : "smart card number"}
          </Text>
          <View style={s.inputField}>
            <Feather name="credit-card" size={16} color={C.textMuted} style={{ marginRight: 8 }} />
            <TextInput
              style={[s.inputText, { flex: 1 }]}
              placeholder="Enter smart card / IUC number"
              placeholderTextColor="#646464"
              value={smartCard}
              onChangeText={t => setSmartCard(t.replace(/\D/g, "").slice(0, 12))}
              keyboardType="numeric"
              maxLength={12}
            />
            {smartCard.length >= 10 && (
              <Feather name="check-circle" size={18} color={C.success} />
            )}
          </View>
          {smartCard.length > 0 && smartCard.length < 10 && (
            <Text style={s.fieldHint}>Smart card number must be at least 10 digits</Text>
          )}
        </Animated.View>

        {/* ── Subscription plan ── */}
        <Animated.View entering={FadeInDown.duration(300).delay(120)}>
          <Text style={s.label}>subscription plan</Text>
          <TouchableOpacity
            style={[
              s.selectBtn,
              !provider && { opacity: 0.5 },
              bouquet && provider && { borderColor: provider.color },
            ]}
            onPress={() => {
              if (!provider) {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
                return;
              }
              Haptics.selectionAsync();
              setBouquetSheet(true);
            }}
            activeOpacity={0.8}
          >
            {bouquet && provider ? (
              <View style={s.bouquetSelected}>
                <Text style={[s.bouquetName, { color: provider.color }]}>{bouquet.name}</Text>
                <Text style={s.bouquetPrice}>₦{bouquet.price}/month</Text>
              </View>
            ) : (
              <Text style={s.selectPlaceholder}>
                {provider ? `Choose ${provider.name} plan` : "Select a provider first"}
              </Text>
            )}
            <Feather name="chevron-down" size={16} color={C.textMuted} />
          </TouchableOpacity>
        </Animated.View>

        {/* ── Summary ── */}
        {!!bouquet && !!provider && (
          <Animated.View entering={FadeInUp.duration(260)} style={s.summaryBox}>
            <View style={s.summaryRow}>
              <Text style={s.summaryLabel}>Provider</Text>
              <Text style={s.summaryValue}>{provider.name}</Text>
            </View>
            <View style={s.summaryLine} />
            <View style={s.summaryRow}>
              <Text style={s.summaryLabel}>Plan</Text>
              <Text style={s.summaryValue}>{bouquet.name}</Text>
            </View>
            <View style={s.summaryLine} />
            <View style={s.summaryRow}>
              <Text style={s.summaryLabel}>Smart Card</Text>
              <Text style={s.summaryValue}>{smartCard || "—"}</Text>
            </View>
            <View style={s.summaryLine} />
            <View style={s.summaryRow}>
              <Text style={s.summaryLabel}>Total</Text>
              <Text style={[s.summaryValue, s.summaryTotal]}>₦{bouquet.price}</Text>
            </View>
          </Animated.View>
        )}

        {/* ── CTA ── */}
        <TouchableOpacity
          style={[s.payBtn, !canProceed && s.payBtnDisabled]}
          onPress={handleSubscribe}
          activeOpacity={0.85}
          disabled={!canProceed}
        >
          {submitting ? (
            <ActivityIndicator color="#FFFFFF" style={{ marginRight: 8 }} />
          ) : (
            <Feather name="tv" size={16} color="#FFFFFF" style={{ marginRight: 8 }} />
          )}
          <Text style={s.payBtnText}>
            {submitting ? "Processing..." : provider ? `Subscribe to ${provider.name}` : "Subscribe"}
          </Text>
        </TouchableOpacity>

      </ScrollView>

      {/* ── Bouquet picker sheet ── */}
      <AnimatedSheet
        visible={bouquetSheet}
        onClose={() => setBouquetSheet(false)}
        maxHeight="65%"
      >
        <View style={sh.inner}>
          <Text style={sh.title}>
            {provider ? `${provider.name} Plans` : "Select Plan"}
          </Text>
          <ScrollView showsVerticalScrollIndicator={false}>
            {bouquets.map(b => {
              const active = bouquet?.id === b.id;
              return (
                <TouchableOpacity
                  key={b.id}
                  style={[sh.option, active && sh.optionActive]}
                  onPress={() => {
                    Haptics.selectionAsync();
                    setBouquet(b);
                    setBouquetSheet(false);
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={[sh.optName, active && provider && { color: provider.color }]}>
                      {b.name}
                    </Text>
                    <Text style={sh.optPrice}>₦{b.price}/month</Text>
                  </View>
                  {active && (
                    <Feather name="check" size={16} color={provider?.color ?? C.accent} />
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </AnimatedSheet>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  header:       { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingBottom: 14, backgroundColor: C.bg },
  backBtn:      { width: 44, height: 44, alignItems: "center", justifyContent: "center" },
  headerTitle:  { fontSize: 13, fontFamily: "Manrope_700Bold", color: C.text, textTransform: "capitalize" },
  divider:      { height: 1, backgroundColor: "#D1D1D1" },
  scroll:       { paddingHorizontal: 20, paddingTop: 20, gap: 18 },
  subtitle:     { fontSize: 12, fontFamily: "Manrope_500Medium", color: C.textMuted, letterSpacing: 0.24 },
  label:        { fontSize: 12, fontFamily: "Manrope_500Medium", color: C.textMuted, textTransform: "capitalize", letterSpacing: 0.24, marginBottom: 6 },
  fieldHint:    { fontSize: 11, fontFamily: "Manrope_400Regular", color: "#E11D48", marginTop: 4 },

  /* Provider grid — 2 per row */
  providerGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  providerCard: {
    width: "47.5%", alignItems: "center", gap: 6,
    paddingVertical: 14,
    borderRadius: 12, borderWidth: 1, borderColor: C.border,
    backgroundColor: "#F8F9FA", position: "relative",
  },
  providerIcon:  { width: 42, height: 42, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  providerAbbr:  { fontSize: 11, fontFamily: "Manrope_700Bold" },
  providerName:  { fontSize: 12, fontFamily: "Manrope_600SemiBold", color: C.textSec },
  providerCheck: { position: "absolute", top: 6, right: 6, width: 14, height: 14, borderRadius: 7, alignItems: "center", justifyContent: "center" },

  /* Inputs */
  inputField:    { flexDirection: "row", alignItems: "center", backgroundColor: C.inputBg, borderRadius: 10, paddingHorizontal: 14, height: 46, borderWidth: 1, borderColor: C.border },
  inputText:     { fontSize: 13, fontFamily: "Manrope_500Medium", color: C.text },

  /* Bouquet select */
  selectBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    backgroundColor: C.inputBg, borderWidth: 1, borderColor: C.border,
    borderRadius: 10, paddingHorizontal: 14, height: 54,
  },
  selectPlaceholder: { fontSize: 12, fontFamily: "Manrope_500Medium", color: "#646464", flex: 1 },
  bouquetSelected:   { flex: 1 },
  bouquetName:       { fontSize: 13, fontFamily: "Manrope_700Bold" },
  bouquetPrice:      { fontSize: 11, fontFamily: "Manrope_400Regular", color: C.textMuted, marginTop: 1 },

  /* Summary */
  summaryBox:   { backgroundColor: C.dark, borderRadius: 10, paddingHorizontal: 18, paddingVertical: 2 },
  summaryRow:   { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 12 },
  summaryLine:  { height: 1, backgroundColor: "rgba(255,255,255,0.1)" },
  summaryLabel: { fontSize: 10, fontFamily: "Manrope_400Regular", color: "rgba(255,255,255,0.7)" },
  summaryValue: { fontSize: 10, fontFamily: "Manrope_500Medium", color: "#FFFFFF" },
  summaryTotal: { fontFamily: "Manrope_700Bold", fontSize: 13 },

  /* CTA */
  payBtn:         { flexDirection: "row", backgroundColor: C.black, height: 48, borderRadius: 10, alignItems: "center", justifyContent: "center", elevation: 4 },
  payBtnDisabled: { opacity: 0.45 },
  payBtnText:     { fontSize: 14, fontFamily: "Manrope_700Bold", color: "#FFFFFF", letterSpacing: -0.14 },
});

const sh = StyleSheet.create({
  inner:      { paddingHorizontal: 20, paddingTop: 20, flex: 1 },
  title:      { fontSize: 16, fontFamily: "Manrope_700Bold", color: C.text, marginBottom: 14 },
  option:     { flexDirection: "row", alignItems: "center", paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: C.border },
  optionActive: {},
  optName:    { fontSize: 14, fontFamily: "Manrope_600SemiBold", color: C.text },
  optPrice:   { fontSize: 12, fontFamily: "Manrope_400Regular", color: C.textMuted, marginTop: 2 },
});
