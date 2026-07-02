import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Dimensions,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SvgXml } from "react-native-svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";

/* ── Screen dimensions ───────────────────────────────────────── */
const { width: SW } = Dimensions.get("window");

/* Card is displayed large and centered — 48 px inset each side */
const CARD_W = SW - 96;
const CARD_H = CARD_W * (332 / 210);

/* ── Palette (PayVora light theme) ───────────────────────────── */
const C = {
  bg:        "#FFFFFF",
  textDark:  "#0B0A0A",
  textGray:  "#8A8F9A",
  inputBg:   "#F0F0F0",
  btnBg:     "#0B0A0A",
  btnText:   "#FFFFFF",
} as const;

/* ── SVG assets (inline — exact originals, untouched) ────────── */
const REGULAR_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="210" height="332" viewBox="0 0 210 332" fill="none">
<g clip-path="url(#cr0)">
<rect x="1.45122e-05" y="332" width="332" height="210" rx="12" transform="rotate(-90 1.45122e-05 332)" fill="#F9F9F9"/>
<g clip-path="url(#cr1)">
<circle cx="171.5" cy="275" r="18" fill="#F79E1C"/>
<circle cx="149" cy="275" r="18" fill="#EF1B22"/>
<path opacity="0.5" fill-rule="evenodd" clip-rule="evenodd" d="M160.25 289.052C164.365 285.753 167 280.684 167 275C167 269.316 164.365 264.247 160.25 260.948C156.135 264.247 153.5 269.316 153.5 275C153.5 280.684 156.135 285.753 160.25 289.052Z" fill="#F79E1C"/>
</g>
<g clip-path="url(#cr2)">
<rect x="69.7621" y="293" width="40" height="30.4762" rx="4.66667" transform="rotate(-90 69.7621 293)" fill="#E9DCA5"/>
<path d="M79.1371 292.375V281.583C79.1371 280.295 80.1818 279.25 81.4704 279.25H86.4808M99.6371 279.25H93.8246M93.8246 279.25H86.4808M93.8246 279.25V292.375M86.4808 279.25V292.375" stroke="#262626" stroke-width="0.583333"/>
<path d="M79.1371 253.625V266.125M79.1371 266.125H86.4808M79.1371 266.125H70.3871M99.6371 266.125H93.8246M93.8246 266.125H86.4808M93.8246 266.125V253.625M86.4808 266.125V253.625" stroke="#262626" stroke-width="0.583333"/>
</g>
<path d="M179.184 174.839C183.006 179.788 183.006 186.223 179.184 191.172M183.19 171.49C188.577 178.465 188.577 187.535 183.19 194.51M174.983 177.003C177.791 180.629 177.791 185.36 174.983 188.985M170.77 180.007C172.174 181.826 172.174 184.185 170.77 186.004" stroke="#424242" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</g>
<defs>
<clipPath id="cr0"><rect x="1.45122e-05" y="332" width="332" height="210" rx="12" transform="rotate(-90 1.45122e-05 332)" fill="white"/></clipPath>
<clipPath id="cr1"><rect width="51" height="60" fill="white" transform="translate(130 308) rotate(-90)"/></clipPath>
<clipPath id="cr2"><rect width="40" height="30.4762" fill="white" transform="matrix(0 -1 1 0 69.7621 293)"/></clipPath>
</defs>
</svg>`;

const PREMIUM_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="210" height="332" viewBox="0 0 210 332" fill="none">
<g clip-path="url(#cp0)">
<rect x="1.45122e-05" y="332" width="332" height="210" rx="12" transform="rotate(-90 1.45122e-05 332)" fill="url(#pg0)"/>
<g clip-path="url(#cp1)">
<circle cx="50.5" cy="42" r="13.625" fill="#8282B0" stroke="#C1C1D7" stroke-width="0.75"/>
<circle cx="33" cy="42" r="13.625" fill="#28283E" stroke="#C1C1D7" stroke-width="0.75"/>
<g opacity="0.2">
<path fill-rule="evenodd" clip-rule="evenodd" d="M41.75 52.9294C44.9506 50.3637 47 46.4212 47 42C47 37.5788 44.9506 33.6363 41.75 31.0706C38.5494 33.6363 36.5 37.5788 36.5 42C36.5 46.4212 38.5494 50.3637 41.75 52.9294Z" fill="#8282B0"/>
</g>
</g>
<g clip-path="url(#cp2)">
<rect x="108.81" y="65" width="32" height="24.381" rx="4.66667" transform="rotate(-90 108.81 65)" fill="url(#pg1)"/>
<path d="M116.31 64.5V56.3333C116.31 55.0447 117.354 54 118.643 54H122.185M132.71 54H128.06M128.06 54H122.185M128.06 54V64.5M122.185 54V64.5" stroke="#262626" stroke-width="0.583333"/>
<path d="M116.31 33.5V43.5M116.31 43.5H122.185M116.31 43.5H109.31M132.71 43.5H128.06M128.06 43.5H122.185M128.06 43.5V33.5M122.185 43.5V33.5" stroke="#262626" stroke-width="0.583333"/>
</g>
<path d="M178.173 41.319C181.77 45.9774 181.77 52.0332 178.173 56.6915M181.943 38.1667C187.013 44.7317 187.013 53.2684 181.943 59.8334M174.219 43.3558C176.863 46.7683 176.863 51.2208 174.219 54.6333M170.254 46.1832C171.576 47.8948 171.576 50.1157 170.254 51.8274" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M240.002 213L240.002 232.245L175.002 253L175.002 233.755L240.002 213Z" fill="white"/>
<path d="M240.002 173L240.002 192.245L175.002 213L175.002 193.755L240.002 173Z" fill="white"/>
<path d="M240.002 133L240.002 152.245L175.002 173L175.002 153.755L240.002 133Z" fill="white"/>
<path d="M240.002 92.9999L240.002 112.245L175.002 133L175.002 113.755L240.002 92.9999Z" fill="white"/>
</g>
<defs>
<linearGradient id="pg0" x1="166" y1="332" x2="223.059" y2="525.144" gradientUnits="userSpaceOnUse">
<stop stop-color="#779FBD"/>
<stop offset="0.515625" stop-color="#92BADA"/>
<stop offset="1" stop-color="#ADCED0"/>
</linearGradient>
<linearGradient id="pg1" x1="105.61" y1="77.1906" x2="143.21" y2="77.1906" gradientUnits="userSpaceOnUse">
<stop offset="0.120245" stop-color="#D5B688"/>
<stop offset="0.469278" stop-color="#FCF7B7"/>
<stop offset="1" stop-color="#E8DFA5"/>
</linearGradient>
<clipPath id="cp0"><rect x="1.45122e-05" y="332" width="332" height="210" rx="12" transform="rotate(-90 1.45122e-05 332)" fill="white"/></clipPath>
<clipPath id="cp1"><rect width="41" height="49" fill="white" transform="translate(17 69) rotate(-90)"/></clipPath>
<clipPath id="cp2"><rect width="32" height="24.381" fill="white" transform="matrix(0 -1 1 0 108.81 65)"/></clipPath>
</defs>
</svg>`;

/* ── Card data ────────────────────────────────────────────────── */
type CardId = "regular" | "premium";

interface Card {
  id: CardId;
  label: string;
  ctaLabel: string;
  description: string;
  svg: string;
}

const CARDS: Card[] = [
  {
    id: "regular",
    label: "Regular",
    ctaLabel: "Get regular virtual card",
    description:
      "Instant and ready to use online. Add to Apple Pay and use it to pay in stores, just like a physical card.",
    svg: REGULAR_SVG,
  },
  {
    id: "premium",
    label: "Premium",
    ctaLabel: "Get premium virtual card",
    description:
      "Elevated limits and exclusive benefits for a superior payment experience. Priority support included.",
    svg: PREMIUM_SVG,
  },
];

/* ── Screen ───────────────────────────────────────────────────── */
export default function ChooseCardTypeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [activeId, setActiveId] = useState<CardId>("regular");

  const topPad = Platform.OS === "web" ? 20 : insets.top;
  const botPad = Platform.OS === "web" ? 32 : Math.max(insets.bottom, 16);

  const activeCard = CARDS.find((c) => c.id === activeId)!;

  function handleSelect(id: CardId) {
    if (id === activeId) return;
    Haptics.selectionAsync();
    setActiveId(id);
  }

  return (
    <View style={[s.root, { paddingTop: topPad }]}>
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />

      {/* ── Header ──────────────────────────────────────────────── */}
      <View style={s.header}>
        <TouchableOpacity
          style={s.backBtn}
          onPress={() => router.back()}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Feather name="arrow-left" size={20} color={C.textDark} />
        </TouchableOpacity>

        <Text style={s.title}>Choose a card type</Text>

        {/* right spacer keeps title centred */}
        <View style={s.backBtn} />
      </View>

      <ScrollView
        contentContainerStyle={s.scroll}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* ── Card display ──────────────────────────────────────── */}
        <View style={s.cardArea}>
          <SvgXml xml={activeCard.svg} width={CARD_W} height={CARD_H} />
        </View>

        {/* ── Tab row ───────────────────────────────────────────── */}
        <View style={s.tabs}>
          {CARDS.map((card) => {
            const active = card.id === activeId;
            return (
              <TouchableOpacity
                key={card.id}
                onPress={() => handleSelect(card.id)}
                activeOpacity={0.7}
                style={s.tab}
              >
                <Text style={[s.tabText, active ? s.tabActive : s.tabInactive]}>
                  {card.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ── Description ───────────────────────────────────────── */}
        <Text style={s.desc}>{activeCard.description}</Text>
      </ScrollView>

      {/* ── CTA ─────────────────────────────────────────────────── */}
      <View style={[s.ctaWrap, { paddingBottom: botPad }]}>
        <TouchableOpacity
          style={s.cta}
          activeOpacity={0.82}
          onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)}
        >
          <Text style={s.ctaText}>{activeCard.ctaLabel}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

/* ── Styles ───────────────────────────────────────────────────── */
const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: C.bg,
  },

  /* Header */
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: C.inputBg,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontFamily: "Inter_700Bold",
    fontSize: 17,
    color: C.textDark,
    letterSpacing: -0.3,
  },

  /* Scroll body */
  scroll: {
    paddingBottom: 24,
  },

  /* Card */
  cardArea: {
    alignItems: "center",
    paddingHorizontal: 48,
    paddingTop: 32,
    paddingBottom: 36,
  },

  /* Tabs */
  tabs: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 24,
    marginBottom: 18,
  },
  tab: {
    paddingVertical: 4,
    paddingHorizontal: 2,
  },
  tabText: {
    fontSize: 17,
    letterSpacing: -0.2,
  },
  tabActive: {
    fontFamily: "Inter_700Bold",
    color: C.textDark,
  },
  tabInactive: {
    fontFamily: "Inter_400Regular",
    color: C.textGray,
  },

  /* Description */
  desc: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: C.textGray,
    lineHeight: 21,
    textAlign: "center",
    paddingHorizontal: 40,
    letterSpacing: -0.1,
  },

  /* CTA */
  ctaWrap: {
    paddingHorizontal: 24,
    paddingTop: 16,
    backgroundColor: C.bg,
  },
  cta: {
    backgroundColor: C.btnBg,
    borderRadius: 50,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
  },
  ctaText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 16,
    color: C.btnText,
    letterSpacing: -0.2,
  },
});
