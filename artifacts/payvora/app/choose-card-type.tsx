import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Dimensions,
  Image,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";

/* ─── Palette (matches app conventions) ─────────────────────── */
const WHITE      = "#FFFFFF";
const BLACK      = "#000000";
const TEXT_DARK  = "#0B0A0A";
const TEXT_GRAY  = "#595F67";
const TEXT_LIGHT = "#AAAFB5";
const BORDER     = "#EDF1F3";
const INPUT_BG   = "#F0F0F0";

const { width: SCREEN_W } = Dimensions.get("window");
const PAIR_GAP   = 12;
const CARD_PAIR_W = (SCREEN_W - 48 - PAIR_GAP) / 2;
const CARD_PAIR_H = CARD_PAIR_W * (201 / 352);

/* ─── Card type ──────────────────────────────────────────────── */
type CardType = "regular" | "premium";

const CARD_INFO: Record<CardType, { title: string; body: string }> = {
  regular: {
    title: "Regular Card",
    body: "Instant and ready to use online. Add to Apple Pay and use it to pay in stores, just like a physical card.",
  },
  premium: {
    title: "Premium Card",
    body: "Elevated limits and exclusive benefits for a superior payment experience. Priority support included.",
  },
};

/* ─── Regular card (black, landscape background) ─────────────── */
function RegularCard({ width, height }: { width: number; height: number }) {
  const fs = width * 0.095;
  const chipW = width * 0.23;
  const chipH = height * 0.22;
  return (
    <View style={{ width, height, borderRadius: 9, overflow: "hidden", backgroundColor: "#1A1A1A" }}>
      {/* Night-field background photo — bottom half */}
      <Image
        source={require("../assets/images/card-bg-regular.png")}
        style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: height * 0.52 }}
        resizeMode="cover"
      />
      {/* VISA  ·  contactless */}
      <View style={{ position: "absolute", top: height * 0.13, left: width * 0.09, right: width * 0.09, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <Text style={{ color: WHITE, fontSize: fs, fontFamily: "Inter_700Bold", letterSpacing: -0.3 }}>VISA</Text>
        <Feather name="wifi" size={fs * 1.05} color={WHITE} style={{ transform: [{ rotate: "90deg" }] }} />
      </View>
      {/* Chip */}
      <View style={{ position: "absolute", top: height * 0.4, left: width * 0.09, width: chipW, height: chipH, borderRadius: 3, backgroundColor: "#B49028", borderWidth: 0.5, borderColor: "#DEC96A" }} />
      {/* PAYVORA */}
      <Text style={{ position: "absolute", bottom: height * 0.12, left: width * 0.09, color: WHITE, fontSize: fs * 0.65, fontFamily: "Inter_700Bold", letterSpacing: 2.2 }}>PAYVORA</Text>
    </View>
  );
}

/* ─── Premium card (full-bleed landscape background) ─────────── */
function PremiumCard({ width, height }: { width: number; height: number }) {
  const fs = width * 0.095;
  const chipW = width * 0.23;
  const chipH = height * 0.22;
  return (
    <View style={{ width, height, borderRadius: 9, overflow: "hidden", backgroundColor: "#111111" }}>
      {/* Full-card background — covers entire card */}
      <Image
        source={require("../assets/images/card-bg-premium.png")}
        style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
        resizeMode="cover"
      />
      {/* Subtle dark overlay for legibility (20%) */}
      <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.20)" }} />
      {/* VISA  ·  contactless */}
      <View style={{ position: "absolute", top: height * 0.13, left: width * 0.09, right: width * 0.09, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <Text style={{ color: WHITE, fontSize: fs, fontFamily: "Inter_700Bold", letterSpacing: -0.3 }}>VISA</Text>
        <Feather name="wifi" size={fs * 1.05} color={WHITE} style={{ transform: [{ rotate: "90deg" }] }} />
      </View>
      {/* Chip */}
      <View style={{ position: "absolute", top: height * 0.4, left: width * 0.09, width: chipW, height: chipH, borderRadius: 3, backgroundColor: "#B49028", borderWidth: 0.5, borderColor: "#DEC96A" }} />
      {/* PAYVORA */}
      <Text style={{ position: "absolute", bottom: height * 0.12, left: width * 0.09, color: WHITE, fontSize: fs * 0.65, fontFamily: "Inter_700Bold", letterSpacing: 2.2 }}>PAYVORA</Text>
    </View>
  );
}

/* ─── Side-by-side card pair with selection ──────────────────── */
function CardPair({ selected, onSelect }: { selected: CardType; onSelect: (t: CardType) => void }) {
  const cw = CARD_PAIR_W;
  const ch = CARD_PAIR_H;
  const cards: { type: CardType; label: string }[] = [
    { type: "regular", label: "Regular" },
    { type: "premium", label: "Premium" },
  ];
  return (
    <View style={cp.row}>
      {cards.map(({ type, label }) => {
        const active = selected === type;
        return (
          <TouchableOpacity key={type} onPress={() => onSelect(type)} activeOpacity={0.85} style={cp.item}>
            <View style={[cp.ring, active ? cp.ringActive : cp.ringInactive]}>
              {type === "regular"
                ? <RegularCard width={cw} height={ch} />
                : <PremiumCard width={cw} height={ch} />}
            </View>
            <Text style={[cp.label, active && cp.labelActive]}>{label}</Text>
          </TouchableOpacity>
        );
      })}
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

      {/* ── Cards ─────────────────────────────────────────────── */}
      <View style={s.cardSection}>
        <CardPair selected={selected} onSelect={pick} />
      </View>

      {/* ── Toggle row ─────────────────────────────────────────── */}
      <View style={s.toggleRow}>
        <ToggleBtn
          label="Regular"
          icon="credit-card"
          active={selected === "regular"}
          onPress={() => pick("regular")}
        />
        <ToggleBtn
          label="Premium"
          icon="star"
          active={selected === "premium"}
          onPress={() => pick("premium")}
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

/* ─── Card pair styles ───────────────────────────────────────── */
const cp = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: PAIR_GAP,
    paddingHorizontal: 24,
  },
  item: {
    flex: 1,
    alignItems: "center",
    gap: 8,
  },
  ring: {
    borderRadius: 11,
    borderWidth: 2.5,
  },
  ringActive: {
    borderColor: "#35C2C1",
    shadowColor: "#35C2C1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  ringInactive: {
    borderColor: "transparent",
    opacity: 0.82,
  },
  label: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 13,
    color: TEXT_GRAY,
    letterSpacing: -0.1,
  },
  labelActive: {
    color: TEXT_DARK,
  },
});
