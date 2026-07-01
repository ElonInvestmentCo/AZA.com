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
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { Circle, G, Rect, Svg } from "react-native-svg";

/* ─── Palette (matches app conventions) ─────────────────────── */
const WHITE      = "#FFFFFF";
const BLACK      = "#000000";
const TEXT_DARK  = "#0B0A0A";
const TEXT_GRAY  = "#595F67";
const TEXT_LIGHT = "#AAAFB5";
const BORDER     = "#EDF1F3";
const INPUT_BG   = "#F0F0F0";

const { width: SCREEN_W } = Dimensions.get("window");
const CARD_W = Math.min(SCREEN_W - 48, 360);
const CARD_H = CARD_W / 1.586;

/* ─── Card type ──────────────────────────────────────────────── */
type CardType = "virtual" | "disposable";

const CARD_INFO: Record<CardType, { title: string; body: string }> = {
  virtual: {
    title: "Virtual card",
    body: "Instant and ready to use online. Add to Apple Pay and use it to pay in stores, just like a physical card.",
  },
  disposable: {
    title: "Disposable virtual card",
    body: "Single-use card for extra security. Expires after one transaction, keeping your main account safe.",
  },
};

/* ─── Mastercard SVG logo ────────────────────────────────────── */
function MastercardLogo() {
  return (
    <View>
      <Svg width={46} height={28}>
        <Circle cx={16} cy={14} r={14} fill="#EB001B" opacity={0.96} />
        <Circle cx={30} cy={14} r={14} fill="#F79E1B" opacity={0.92} />
        <G opacity={0.85}>
          <Rect x={16} y={0} width={14} height={28} fill="#FF5F00" opacity={0.55} />
        </G>
      </Svg>
      <Text style={s.mcText}>mastercard{"\u00AE"}</Text>
    </View>
  );
}

/* ─── Payvora card logo ──────────────────────────────────────── */
function PayvoraLogo() {
  return (
    <View style={s.pvLogoWrap}>
      <View style={s.pvCircle}>
        <Text style={s.pvCircleLetter}>P</Text>
      </View>
      <Text style={s.pvWord}>PAYVORA</Text>
    </View>
  );
}

/* ─── The physical-style card ────────────────────────────────── */
function VirtualCard() {
  return (
    <View style={s.cardShadowWrap}>
      <View style={s.card}>
        {/* Subtle gradient overlay — top-left lighter */}
        <View style={s.cardGradientOverlay} pointerEvents="none" />

        {/* Large watermark P */}
        <Text style={s.watermark}>P</Text>

        {/* CARD HOLDER — vertical left */}
        <View style={s.labelLeftWrap}>
          <Text style={s.labelVertical}>CARD HOLDER</Text>
        </View>

        {/* VIRTUAL — vertical right */}
        <View style={s.labelRightWrap}>
          <Text style={[s.labelVertical, s.labelRight]}>VIRTUAL</Text>
        </View>

        {/* Bottom row */}
        <View style={s.cardBottom}>
          <MastercardLogo />
          <PayvoraLogo />
        </View>
      </View>
    </View>
  );
}

/* ─── Toggle pill button ─────────────────────────────────────── */
function ToggleBtn({
  label,
  icon,
  active,
  onPress,
}: {
  label: string;
  icon: React.ComponentProps<typeof Feather>["name"];
  active: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={[s.toggleBtn, active ? s.toggleActive : s.toggleInactive]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Feather name={icon} size={16} color={active ? WHITE : TEXT_GRAY} />
      <Text style={[s.toggleText, active ? s.toggleTextActive : s.toggleTextInactive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

/* ─── Main screen ────────────────────────────────────────────── */
export default function ChooseCardTypeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [selected, setSelected] = useState<CardType>("virtual");

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

      {/* ── Card ───────────────────────────────────────────────── */}
      <View style={s.cardSection}>
        <VirtualCard />
      </View>

      {/* ── Toggle row ─────────────────────────────────────────── */}
      <View style={s.toggleRow}>
        <ToggleBtn
          label="Virtual"
          icon="credit-card"
          active={selected === "virtual"}
          onPress={() => pick("virtual")}
        />
        <ToggleBtn
          label="Disposable virtual"
          icon="credit-card"
          active={selected === "disposable"}
          onPress={() => pick("disposable")}
        />
      </View>

      {/* ── Divider ────────────────────────────────────────────── */}
      <View style={s.divider} />

      {/* ── Info row ───────────────────────────────────────────── */}
      <View style={s.infoRow}>
        <View style={s.shieldCircle}>
          <Feather name="shield" size={20} color={TEXT_GRAY} />
        </View>
        <View style={s.infoText}>
          <Text style={s.infoTitle}>{info.title}</Text>
          <Text style={s.infoBody}>{info.body}</Text>
        </View>
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
          <Text style={s.ctaText}>Get virtual card</Text>
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

  /* Card */
  cardSection: {
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 4,
  },
  cardShadowWrap: {
    width: CARD_W,
    height: CARD_H,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.28,
    shadowRadius: 24,
    elevation: 18,
  },
  card: {
    width: CARD_W,
    height: CARD_H,
    borderRadius: 20,
    backgroundColor: "#141414",
    overflow: "hidden",
    position: "relative",
  },
  cardGradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "transparent",
    borderRadius: 20,
    opacity: 0.06,
  },

  /* Watermark */
  watermark: {
    position: "absolute",
    fontSize: CARD_H * 1.05,
    fontFamily: "Inter_700Bold",
    color: "rgba(255,255,255,0.05)",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -CARD_W * 0.28 }, { translateY: -CARD_H * 0.58 }],
    lineHeight: CARD_H * 1.1,
    letterSpacing: -8,
    includeFontPadding: false,
  },

  /* Vertical labels */
  labelLeftWrap: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  labelRightWrap: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  labelVertical: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 9,
    color: "rgba(255,255,255,0.82)",
    letterSpacing: 3.5,
    transform: [{ rotate: "-90deg" }],
    includeFontPadding: false,
  },
  labelRight: {
    transform: [{ rotate: "90deg" }],
  },

  /* Card bottom */
  cardBottom: {
    position: "absolute",
    bottom: 18,
    left: 20,
    right: 20,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },

  /* Mastercard */
  mcText: {
    fontFamily: "Inter_400Regular",
    fontSize: 8.5,
    color: "rgba(255,255,255,0.65)",
    marginTop: 3,
    letterSpacing: 0.2,
  },

  /* Payvora logo */
  pvLogoWrap: {
    alignItems: "flex-end",
    gap: 3,
  },
  pvCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.6)",
    alignItems: "center",
    justifyContent: "center",
  },
  pvCircleLetter: {
    fontFamily: "Inter_700Bold",
    fontSize: 11,
    color: "rgba(255,255,255,0.85)",
    lineHeight: 14,
    includeFontPadding: false,
  },
  pvWord: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 8,
    color: "rgba(255,255,255,0.72)",
    letterSpacing: 2.8,
  },

  /* Toggle */
  toggleRow: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 24,
    paddingTop: 26,
    paddingBottom: 4,
  },
  toggleBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    paddingHorizontal: 18,
    paddingVertical: 11,
    borderRadius: 50,
  },
  toggleActive: {
    backgroundColor: BLACK,
  },
  toggleInactive: {
    borderWidth: 1.5,
    borderColor: BORDER,
    backgroundColor: "transparent",
  },
  toggleText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 13.5,
    letterSpacing: -0.1,
  },
  toggleTextActive:   { color: WHITE },
  toggleTextInactive: { color: TEXT_GRAY },

  /* Divider */
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: BORDER,
    marginHorizontal: 24,
    marginTop: 22,
  },

  /* Info row */
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 16,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  shieldCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#F4F4F4",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  infoText: { flex: 1 },
  infoTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 15,
    color: TEXT_DARK,
    letterSpacing: -0.2,
    marginBottom: 5,
  },
  infoBody: {
    fontFamily: "Inter_400Regular",
    fontSize: 13.5,
    color: TEXT_LIGHT,
    lineHeight: 20,
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
