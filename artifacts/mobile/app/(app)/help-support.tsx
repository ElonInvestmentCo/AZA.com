import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Linking,
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
  textSec: "#6A707C",
  border:  "#E8ECF4",
  inputBg: "#F7F8F9",
  teal:    "#35C2C1",
  chevron: "#C5C6CC",
};

const CHANNELS = [
  { id: "chat",  label: "Live Chat",      sublabel: "Chat with our support team",     icon: "message-circle" as const, color: "#059669" },
  { id: "email", label: "Email Us",       sublabel: "support@payvora.app",            icon: "mail"           as const, color: "#2563EB" },
  { id: "call",  label: "Call Us",        sublabel: "+234 800 000 0000",              icon: "phone"          as const, color: "#D97706" },
  { id: "whatsapp", label: "WhatsApp",    sublabel: "Chat with us on WhatsApp",       icon: "smartphone"     as const, color: "#25D366" },
];

const FAQS = [
  { q: "How long does a gift card trade take?", a: "Most gift card trades are processed within 5-30 minutes after your card is verified." },
  { q: "How do I fund my wallet?",               a: "Go to Fund Wallet from the home screen, select your bank, and transfer the amount shown to the account provided." },
  { q: "Is my biometric data safe?",             a: "Yes. Your biometric data never leaves your device — PAYVORA only receives a success/fail confirmation from your device's secure hardware." },
  { q: "What happens if a bill payment fails?",  a: "If a payment fails after your wallet is debited, the amount is automatically refunded to your wallet within 24 hours." },
];

export default function HelpSupportScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 48 : insets.top + 8;
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleChannelPress = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    switch (id) {
      case "email":
        Linking.openURL("mailto:support@payvora.app").catch(() => {});
        break;
      case "call":
        Linking.openURL("tel:+2348000000000").catch(() => {});
        break;
      case "whatsapp":
        Linking.openURL("https://wa.me/2348000000000").catch(() => {});
        break;
      case "chat":
        router.push("/(app)/live-chat" as any);
        break;
    }
  };

  const toggleFaq = (i: number) => {
    Haptics.selectionAsync();
    setOpenFaq(prev => (prev === i ? null : i));
  };

  return (
    <View style={[s.root, { paddingTop: topPad }]}>
      <Animated.View entering={FadeInDown.duration(280)} style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.back(); }} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Feather name="arrow-left" size={22} color={C.text} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Help & Support</Text>
        <View style={{ width: 40 }} />
      </Animated.View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[s.scroll, { paddingBottom: insets.bottom + 40 }]}>
        <Animated.View entering={FadeInDown.duration(300).delay(40)}>
          <Text style={s.sectionLabel}>Contact us</Text>
          <View style={s.listCard}>
            {CHANNELS.map((item, i) => (
              <React.Fragment key={item.id}>
                <TouchableOpacity style={s.rowItem} activeOpacity={0.7} onPress={() => handleChannelPress(item.id)}>
                  <View style={[s.rowIcon, { backgroundColor: item.color + "18" }]}>
                    <Feather name={item.icon} size={18} color={item.color} />
                  </View>
                  <View style={s.rowInfo}>
                    <Text style={s.rowLabel}>{item.label}</Text>
                    <Text style={s.rowSublabel}>{item.sublabel}</Text>
                  </View>
                  <Feather name="chevron-right" size={16} color={C.chevron} />
                </TouchableOpacity>
                {i < CHANNELS.length - 1 && <View style={s.rowDivider} />}
              </React.Fragment>
            ))}
          </View>
        </Animated.View>

        <Animated.View entering={FadeInUp.duration(320).delay(90)}>
          <Text style={s.sectionLabel}>Frequently asked questions</Text>
          <View style={s.listCard}>
            {FAQS.map((item, i) => (
              <React.Fragment key={item.q}>
                <TouchableOpacity style={s.faqRow} activeOpacity={0.7} onPress={() => toggleFaq(i)}>
                  <View style={s.faqHeader}>
                    <Text style={s.faqQ}>{item.q}</Text>
                    <Feather name={openFaq === i ? "chevron-up" : "chevron-down"} size={16} color={C.chevron} />
                  </View>
                  {openFaq === i && <Text style={s.faqA}>{item.a}</Text>}
                </TouchableOpacity>
                {i < FAQS.length - 1 && <View style={s.rowDivider} />}
              </React.Fragment>
            ))}
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg, paddingHorizontal: 20 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 20 },
  backBtn: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: 18, fontFamily: "Manrope_700Bold", color: C.text },

  scroll: { gap: 24 },
  sectionLabel: { fontSize: 13, fontFamily: "Manrope_700Bold", color: C.textSec, textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 10 },

  listCard: { borderWidth: 1, borderColor: C.border, borderRadius: 16, overflow: "hidden", backgroundColor: C.bg },
  rowItem: { flexDirection: "row", alignItems: "center", gap: 14, paddingVertical: 14, paddingHorizontal: 16 },
  rowIcon: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  rowInfo: { flex: 1 },
  rowLabel: { fontSize: 14, fontFamily: "Manrope_600SemiBold", color: C.text, marginBottom: 2 },
  rowSublabel: { fontSize: 12, fontFamily: "Manrope_400Regular", color: C.textSec },
  rowDivider: { height: 1, backgroundColor: C.border, marginHorizontal: 16 },

  faqRow: { paddingVertical: 14, paddingHorizontal: 16 },
  faqHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 10 },
  faqQ: { flex: 1, fontSize: 13, fontFamily: "Manrope_600SemiBold", color: C.text },
  faqA: { fontSize: 12, fontFamily: "Manrope_400Regular", color: C.textSec, marginTop: 10, lineHeight: 18 },
});
