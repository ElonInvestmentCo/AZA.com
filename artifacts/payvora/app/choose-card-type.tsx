import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Dimensions,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SvgXml } from "react-native-svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";

/* ─── Palette ─────────────────────────────────────────────────── */
const WHITE      = "#FFFFFF";
const BLACK      = "#000000";
const TEXT_DARK  = "#0B0A0A";
const TEXT_GRAY  = "#595F67";
const TEXT_LIGHT = "#AAAFB5";
const INPUT_BG   = "#F0F0F0";
const CARD_BG    = "#F5F7FA";

/* ─── Card dimensions ─────────────────────────────────────────── */
const { width: SCREEN_W } = Dimensions.get("window");
const CARD_W = SCREEN_W - 96;
const CARD_H = CARD_W * (332 / 210);

/* ─── SVG strings ─────────────────────────────────────────────── */
const REGULAR_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="210" height="332" viewBox="0 0 210 332" fill="none">
<g clip-path="url(#clip0_1_316)">
<rect x="1.45122e-05" y="332" width="332" height="210" rx="12" transform="rotate(-90 1.45122e-05 332)" fill="#F9F9F9"/>
<g clip-path="url(#clip1_1_316)">
<circle cx="171.5" cy="275" r="18" fill="#F79E1C"/>
<circle cx="149" cy="275" r="18" fill="#EF1B22"/>
<path opacity="0.5" fill-rule="evenodd" clip-rule="evenodd" d="M160.25 289.052C164.365 285.753 167 280.684 167 275C167 269.316 164.365 264.247 160.25 260.948C156.135 264.247 153.5 269.316 153.5 275C153.5 280.684 156.135 285.753 160.25 289.052Z" fill="#F79E1C"/>
<path d="M130.785 306V300H131.906V300.977H131.98C132.105 300.646 132.31 300.388 132.594 300.203C132.878 300.016 133.217 299.922 133.613 299.922C134.014 299.922 134.35 300.016 134.621 300.203C134.895 300.391 135.096 300.648 135.227 300.977H135.289C135.432 300.656 135.66 300.401 135.973 300.211C136.285 300.018 136.658 299.922 137.09 299.922C137.634 299.922 138.078 300.092 138.422 300.434C138.768 300.775 138.941 301.289 138.941 301.977V306H137.773V302.086C137.773 301.68 137.663 301.385 137.441 301.203C137.22 301.021 136.956 300.93 136.648 300.93C136.268 300.93 135.973 301.047 135.762 301.281C135.551 301.513 135.445 301.811 135.445 302.176V306H134.281V302.012C134.281 301.686 134.18 301.424 133.977 301.227C133.773 301.029 133.509 300.93 133.184 300.93C132.962 300.93 132.758 300.988 132.57 301.105C132.385 301.22 132.236 301.38 132.121 301.586C132.009 301.792 131.953 302.03 131.953 302.301V306H130.785Z" fill="#595959"/>
</g>
<g clip-path="url(#clip2_1_316)">
<rect x="69.7621" y="293" width="40" height="30.4762" rx="4.66667" transform="rotate(-90 69.7621 293)" fill="#E9DCA5"/>
<path d="M79.1371 292.375V281.583C79.1371 280.295 80.1818 279.25 81.4704 279.25H86.4808M99.6371 279.25H93.8246M93.8246 279.25H86.4808M93.8246 279.25V292.375M86.4808 279.25V292.375" stroke="#262626" stroke-width="0.583333"/>
<path d="M79.1371 253.625V266.125M79.1371 266.125H86.4808M79.1371 266.125H70.3871M99.6371 266.125H93.8246M93.8246 266.125H86.4808M93.8246 266.125V253.625M86.4808 266.125V253.625" stroke="#262626" stroke-width="0.583333"/>
</g>
<path d="M179.184 174.839C183.006 179.788 183.006 186.223 179.184 191.172M183.19 171.49C188.577 178.465 188.577 187.535 183.19 194.51M174.983 177.003C177.791 180.629 177.791 185.36 174.983 188.985M170.77 180.007C172.174 181.826 172.174 184.185 170.77 186.004" stroke="#424242" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</g>
<defs>
<clipPath id="clip0_1_316">
<rect x="1.45122e-05" y="332" width="332" height="210" rx="12" transform="rotate(-90 1.45122e-05 332)" fill="white"/>
</clipPath>
<clipPath id="clip1_1_316">
<rect width="51" height="60" fill="white" transform="translate(130 308) rotate(-90)"/>
</clipPath>
<clipPath id="clip2_1_316">
<rect width="40" height="30.4762" fill="white" transform="matrix(0 -1 1 0 69.7621 293)"/>
</clipPath>
</defs>
</svg>`;

const PREMIUM_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="210" height="332" viewBox="0 0 210 332" fill="none">
<g clip-path="url(#clip0_1_329)">
<rect x="1.45122e-05" y="332" width="332" height="210" rx="12" transform="rotate(-90 1.45122e-05 332)" fill="url(#paint0_linear_1_329)"/>
<g clip-path="url(#clip1_1_329)">
<circle cx="50.5" cy="42" r="13.625" fill="#8282B0" stroke="#C1C1D7" stroke-width="0.75"/>
<circle cx="33" cy="42" r="13.625" fill="#28283E" stroke="#C1C1D7" stroke-width="0.75"/>
<g opacity="0.2">
<mask id="path-4-inside-1_1_329" fill="white">
<path fill-rule="evenodd" clip-rule="evenodd" d="M41.75 52.9294C44.9506 50.3637 47 46.4212 47 42C47 37.5788 44.9506 33.6363 41.75 31.0706C38.5494 33.6363 36.5 37.5788 36.5 42C36.5 46.4212 38.5494 50.3637 41.75 52.9294Z"/>
</mask>
<path fill-rule="evenodd" clip-rule="evenodd" d="M41.75 52.9294C44.9506 50.3637 47 46.4212 47 42C47 37.5788 44.9506 33.6363 41.75 31.0706C38.5494 33.6363 36.5 37.5788 36.5 42C36.5 46.4212 38.5494 50.3637 41.75 52.9294Z" fill="#8282B0"/>
</g>
</g>
<g clip-path="url(#clip2_1_329)">
<rect x="108.81" y="65" width="32" height="24.381" rx="4.66667" transform="rotate(-90 108.81 65)" fill="url(#paint1_linear_1_329)"/>
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
<linearGradient id="paint0_linear_1_329" x1="166" y1="332" x2="223.059" y2="525.144" gradientUnits="userSpaceOnUse">
<stop stop-color="#779FBD"/>
<stop offset="0.515625" stop-color="#92BADA"/>
<stop offset="1" stop-color="#ADCED0"/>
</linearGradient>
<linearGradient id="paint1_linear_1_329" x1="105.61" y1="77.1906" x2="143.21" y2="77.1906" gradientUnits="userSpaceOnUse">
<stop offset="0.120245" stop-color="#D5B688"/>
<stop offset="0.469278" stop-color="#FCF7B7"/>
<stop offset="1" stop-color="#E8DFA5"/>
</linearGradient>
<clipPath id="clip0_1_329">
<rect x="1.45122e-05" y="332" width="332" height="210" rx="12" transform="rotate(-90 1.45122e-05 332)" fill="white"/>
</clipPath>
<clipPath id="clip1_1_329">
<rect width="41" height="49" fill="white" transform="translate(17 69) rotate(-90)"/>
</clipPath>
<clipPath id="clip2_1_329">
<rect width="32" height="24.381" fill="white" transform="matrix(0 -1 1 0 108.81 65)"/>
</clipPath>
</defs>
</svg>`;

/* ─── Card type ──────────────────────────────────────────────── */
type CardType = "regular" | "premium";

const CARD_INFO: Record<CardType, { label: string; title: string; body: string; svg: string }> = {
  regular: {
    label: "Regular",
    title: "Regular Card",
    body: "Instant and ready to use online. Add to Apple Pay and use it to pay in stores, just like a physical card.",
    svg: REGULAR_SVG,
  },
  premium: {
    label: "Premium",
    title: "Premium Card",
    body: "Elevated limits and exclusive benefits for a superior payment experience. Priority support included.",
    svg: PREMIUM_SVG,
  },
};

const CARD_TYPES: CardType[] = ["regular", "premium"];

/* ─── Main screen ────────────────────────────────────────────── */
export default function ChooseCardTypeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [selected, setSelected] = useState<CardType>("regular");

  const topPad = Platform.OS === "web" ? 20 : insets.top;
  const botPad = Platform.OS === "web" ? 32 : insets.bottom + 16;

  function pick(type: CardType) {
    Haptics.selectionAsync();
    setSelected(type);
  }

  const info = CARD_INFO[selected];

  return (
    <View style={[s.screen, { paddingTop: topPad }]}>
      <StatusBar barStyle="dark-content" backgroundColor={WHITE} />

      {/* ── Header ─────────────────────────────────────────────── */}
      <View style={s.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={s.backBtn}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Feather name="arrow-left" size={20} color={TEXT_DARK} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Choose a card type</Text>
        <View style={s.headerSpacer} />
      </View>

      {/* ── Card showcase area ─────────────────────────────────── */}
      <View style={s.cardShowcase}>
        <SvgXml
          xml={info.svg}
          width={CARD_W}
          height={CARD_H}
        />
      </View>

      {/* ── Tab switcher ───────────────────────────────────────── */}
      <View style={s.tabRow}>
        {CARD_TYPES.map((type) => {
          const active = selected === type;
          return (
            <TouchableOpacity
              key={type}
              onPress={() => pick(type)}
              activeOpacity={0.7}
              style={s.tabItem}
            >
              <Text style={[s.tabText, active ? s.tabTextActive : s.tabTextInactive]}>
                {CARD_INFO[type].label}
              </Text>
              {active && <View style={s.tabUnderline} />}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* ── Divider ────────────────────────────────────────────── */}
      <View style={s.divider} />

      {/* ── Description ────────────────────────────────────────── */}
      <View style={s.descSection}>
        <Text style={s.descText}>{info.body}</Text>
      </View>

      {/* ── Spacer ─────────────────────────────────────────────── */}
      <View style={{ flex: 1 }} />

      {/* ── CTA button ─────────────────────────────────────────── */}
      <View style={[s.ctaWrap, { paddingBottom: botPad }]}>
        <TouchableOpacity
          style={s.ctaBtn}
          activeOpacity={0.82}
          onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)}
        >
          <Text style={s.ctaText}>
            {`Get ${info.label.toLowerCase()} card`}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

/* ─── Styles ─────────────────────────────────────────────────── */
const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: WHITE },

  /* Header */
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 14,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: INPUT_BG,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 17,
    color: TEXT_DARK,
    letterSpacing: -0.2,
  },
  headerSpacer: { width: 36 },

  /* Card showcase */
  cardShowcase: {
    backgroundColor: CARD_BG,
    marginHorizontal: 24,
    borderRadius: 20,
    alignItems: "center",
    paddingVertical: 32,
    marginBottom: 28,
  },

  /* Tab switcher */
  tabRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 32,
    paddingHorizontal: 24,
    marginBottom: 4,
  },
  tabItem: {
    alignItems: "center",
    paddingBottom: 10,
  },
  tabText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 16,
    letterSpacing: -0.2,
  },
  tabTextActive: {
    color: TEXT_DARK,
  },
  tabTextInactive: {
    color: TEXT_LIGHT,
  },
  tabUnderline: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 2.5,
    borderRadius: 2,
    backgroundColor: BLACK,
  },

  /* Divider */
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#EDF1F3",
    marginHorizontal: 24,
    marginTop: 2,
    marginBottom: 20,
  },

  /* Description */
  descSection: {
    paddingHorizontal: 32,
    alignItems: "center",
  },
  descText: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: TEXT_GRAY,
    lineHeight: 22,
    textAlign: "center",
    letterSpacing: -0.1,
  },

  /* CTA */
  ctaWrap: {
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  ctaBtn: {
    backgroundColor: BLACK,
    borderRadius: 50,
    height: 54,
    alignItems: "center",
    justifyContent: "center",
  },
  ctaText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 16,
    color: WHITE,
    letterSpacing: -0.2,
  },
});
