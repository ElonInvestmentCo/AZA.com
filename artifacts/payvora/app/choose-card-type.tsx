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
import { SvgXml } from "react-native-svg";

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

/* ─── Premium card SVG ───────────────────────────────────────── */
const PREMIUM_CARD_SVG = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="352" height="201" viewBox="0 0 352 201" fill="none">
<g clip-path="url(#clip0_1_28)">
<g>
<path d="M321.997 0H30C13.4315 0 0 13.4315 0 30V171C0 187.569 13.4315 201 30 201H321.997C338.566 201 351.997 187.569 351.997 171V30C351.997 13.4315 338.566 0 321.997 0Z" fill="#1D1D1D"/>
<mask id="mask0_1_28" maskUnits="userSpaceOnUse" x="0" y="0" width="352" height="201">
<path d="M322 0H30.0029C13.4344 0 0.00289917 13.4315 0.00289917 30V171C0.00289917 187.569 13.4344 201 30.0029 201H322C338.568 201 352 187.569 352 171V30C352 13.4315 338.568 0 322 0Z" fill="url(#paint0_linear_1_28)"/>
</mask>
<g mask="url(#mask0_1_28)">
<path d="M351.029 -19.3925C326.794 9.94369 266.611 54.204 264.357 35.65C260.189 1.33139 503.562 -63.2187 491.931 0.965996C480.3 65.151 261.838 120.115 156.63 78.721C51.4226 37.327 240.355 -97.8821 371.064 82.975C501.773 263.832 243.279 164.11 212.256 132.357C181.232 100.604 146.62 57.603 158.09 20.997C169.561 -15.6094 297.821 61.902 278.286 314.372" stroke="#C3BCC9" stroke-opacity="0.43" stroke-width="5"/>
</g>
<mask id="mask1_1_28" maskUnits="userSpaceOnUse" x="33" y="21" width="56" height="54">
<path d="M61.9675 21.8476H60.0813C45.6519 21.8476 33.9546 33.5449 33.9546 47.9743C33.9546 62.4037 45.6519 74.101 60.0813 74.101H61.9675C76.3969 74.101 88.0942 62.4037 88.0942 47.9743C88.0942 33.5449 76.3969 21.8476 61.9675 21.8476Z" fill="white"/>
</mask>
<g mask="url(#mask1_1_28)">
<path d="M55.6353 40.201L52.8838 55.785H57.2843L60.038 40.201H55.6353Z" fill="white"/>
<path d="M49.1966 40.218L44.8866 50.846L44.4271 49.241C43.5771 47.308 41.164 44.531 38.3311 42.781L42.2721 55.777L46.9284 55.77L53.8585 40.215L49.1966 40.218Z" fill="white"/>
<path d="M42.754 41.328C42.4983 40.379 41.7569 40.096 40.8367 40.062H34.0141L33.9575 40.372C39.2669 41.616 42.7801 44.611 44.2379 48.212L42.754 41.328Z" fill="white"/>
<path d="M68.9539 43.186C70.3936 43.164 71.4371 43.468 72.2475 43.782L72.6448 43.962L73.2401 40.585C72.3686 40.269 71.0025 39.93 69.298 39.93C64.9495 39.93 61.8846 42.044 61.8608 45.073C61.8325 47.312 64.0441 48.561 65.7146 49.307C67.4294 50.072 68.0043 50.558 67.9964 51.241C67.9828 52.284 66.6292 52.763 65.3649 52.763C63.6027 52.763 62.6666 52.528 61.2213 51.947L60.6543 51.698L60.0352 55.186C61.0651 55.621 62.9654 55.996 64.9382 56.016C69.564 56.016 72.5701 53.927 72.6018 50.69C72.621 48.92 71.4473 47.568 68.9041 46.46C67.3648 45.736 66.4232 45.256 66.4322 44.526C66.4322 43.878 67.2313 43.186 68.9539 43.186Z" fill="white"/>
<path d="M84.536 40.218H81.136C80.08 40.218 79.2949 40.496 78.8309 41.511L72.2969 55.793H76.9181C76.9181 55.793 77.6719 53.873 77.8428 53.452C78.3487 53.452 82.839 53.459 83.478 53.459C83.609 54.003 84.015 55.793 84.015 55.793H88.097L84.536 40.218ZM79.1093 50.263C79.4715 49.368 80.863 45.907 80.863 45.907C80.839 45.95 81.221 45.006 81.449 44.419L81.745 45.763C81.745 45.763 82.589 49.484 82.765 50.263H79.1093Z" fill="white"/>
</g>
<path d="M44.3323 96.9084C39.0316 96.9084 34.7345 101.205 34.7345 106.506C34.7345 111.807 39.0316 116.104 44.3323 116.104H54.1361C59.4368 116.104 63.7339 111.807 63.7339 106.506C63.7339 101.205 59.4368 96.9084 54.1361 96.9084H44.3323Z" fill="url(#chipGold)" stroke="#94A2AD" stroke-width="1.55978"/>
<mask id="mask2_1_28" maskUnits="userSpaceOnUse" x="297" y="38" width="22" height="20">
<path d="M308.213 38.232H307.504C302.074 38.232 297.672 42.6337 297.672 48.0635C297.672 53.4933 302.074 57.895 307.504 57.895H308.213C313.643 57.895 318.045 53.4933 318.045 48.0635C318.045 42.6337 313.643 38.232 308.213 38.232Z" fill="white"/>
</mask>
<g mask="url(#mask2_1_28)">
<path d="M300.408 45.791C300.663 46.098 300.854 46.466 300.981 46.835C301.109 47.204 301.172 47.634 301.172 48.064C301.172 48.494 301.109 48.924 300.981 49.293C300.854 49.662 300.663 50.03 300.408 50.338C300.09 50.768 300.154 51.382 300.599 51.689C301.045 51.997 301.682 51.935 302 51.505C302.382 51.013 302.637 50.522 302.891 49.907C303.146 49.293 303.21 48.679 303.21 48.064C303.21 47.45 303.082 46.835 302.891 46.221C302.7 45.668 302.382 45.115 302 44.623C301.682 44.193 301.045 44.131 300.599 44.439C300.154 44.746 300.09 45.36 300.408 45.791Z" fill="white"/>
<path d="M303.91 44.009C304.674 45.176 305.12 46.589 305.12 48.064C305.12 49.539 304.674 50.952 303.91 52.12C303.592 52.55 303.783 53.164 304.228 53.471C304.738 53.779 305.311 53.594 305.629 53.164C306.584 51.689 307.157 49.969 307.157 48.064C307.157 46.221 306.584 44.439 305.629 42.964C305.311 42.534 304.674 42.349 304.228 42.657C303.783 42.964 303.592 43.517 303.91 44.009Z" fill="white"/>
<path d="M307.603 42.165C308.685 43.886 309.258 45.913 309.258 48.064C309.258 50.215 308.621 52.242 307.603 53.963C307.348 54.455 307.475 55.008 307.985 55.315C308.494 55.561 309.067 55.438 309.385 54.946C310.658 52.918 311.359 50.583 311.359 48.064C311.359 45.545 310.658 43.21 309.385 41.182C309.131 40.69 308.494 40.568 307.985 40.813C307.475 41.121 307.348 41.674 307.603 42.165Z" fill="white"/>
<path d="M311.295 40.322C312.632 42.595 313.46 45.237 313.46 48.064C313.46 50.891 312.696 53.533 311.295 55.806C311.04 56.298 311.168 56.851 311.677 57.158C312.186 57.404 312.759 57.281 313.078 56.79C314.606 54.209 315.497 51.259 315.497 48.064C315.497 44.869 314.606 41.919 313.078 39.339C312.823 38.847 312.186 38.724 311.677 38.97C311.168 39.216 311.04 39.83 311.295 40.322Z" fill="white"/>
</g>
<path d="M35.7 187V176.92H40.488C41.2347 176.92 41.874 177.051 42.406 177.312C42.9473 177.573 43.3627 177.937 43.652 178.404C43.9507 178.871 44.1 179.417 44.1 180.042C44.1 180.667 43.9507 181.218 43.652 181.694C43.3533 182.17 42.9333 182.543 42.392 182.814C41.86 183.075 41.2253 183.206 40.488 183.206H37.408V181.554H40.376C40.8707 181.554 41.2533 181.419 41.524 181.148C41.804 180.868 41.944 180.504 41.944 180.056C41.944 179.608 41.804 179.249 41.524 178.978C41.2533 178.707 40.8707 178.572 40.376 178.572H37.856V187H35.7ZM43.5801 187L47.1921 176.92H49.0401L45.7221 187H43.5801ZM50.9721 187L47.6681 176.92H49.6001L53.2121 187H50.9721ZM45.4841 183.094H51.1401V184.774H45.4841V183.094ZM55.6677 187V182.926L51.9157 176.92H54.5057L57.4737 182.254H56.2557L59.2097 176.92H61.5757L57.8237 182.926V187H55.6677ZM65.6765 187L62.0645 176.92H64.3045L67.0625 185.32H66.7965L69.5685 176.92H71.6965L68.0845 187H65.6765ZM76.9532 187.14C76.2065 187.14 75.5159 187.014 74.8812 186.762C74.2559 186.51 73.7099 186.155 73.2432 185.698C72.7859 185.231 72.4265 184.681 72.1652 184.046C71.9132 183.402 71.7872 182.693 71.7872 181.918C71.7872 180.891 72.0065 179.995 72.4452 179.23C72.8839 178.455 73.4905 177.853 74.2652 177.424C75.0492 176.995 75.9405 176.78 76.9392 176.78C77.9565 176.78 78.8525 176.995 79.6272 177.424C80.4019 177.853 81.0085 178.455 81.4472 179.23C81.8952 180.005 82.1192 180.905 82.1192 181.932C82.1192 182.697 81.9885 183.402 81.7272 184.046C81.4752 184.681 81.1159 185.231 80.6492 185.698C80.1919 186.155 79.6459 186.51 79.0112 186.762C78.3859 187.014 77.6999 187.14 76.9532 187.14ZM76.9392 185.432C77.5272 185.432 78.0452 185.283 78.4932 184.984C78.9412 184.685 79.2912 184.275 79.5432 183.752C79.8045 183.22 79.9352 182.604 79.9352 181.904C79.9352 181.213 79.8092 180.611 79.5572 180.098C79.3052 179.585 78.9552 179.188 78.5072 178.908C78.0592 178.628 77.5365 178.488 76.9392 178.488C76.3512 178.488 75.8332 178.628 75.3852 178.908C74.9372 179.188 74.5872 179.585 74.3352 180.098C74.0925 180.602 73.9712 181.204 73.9712 181.904C73.9712 182.613 74.0972 183.234 74.3492 183.766C74.6012 184.289 74.9512 184.699 75.3992 184.998C75.8472 185.287 76.3605 185.432 76.9392 185.432ZM83.1811 187V176.92H87.6891C88.4171 176.92 89.0518 177.046 89.5931 177.298C90.1344 177.541 90.5544 177.886 90.8531 178.334C91.1518 178.782 91.3011 179.305 91.3011 179.902C91.3011 180.49 91.1518 181.008 90.8531 181.456C90.5544 181.895 90.1344 182.24 89.5931 182.492C89.0518 182.735 88.4171 182.856 87.6891 182.856H84.8891V181.274H87.6331C88.1464 181.274 88.5384 181.157 88.8091 180.924C89.0891 180.681 89.2291 180.345 89.2291 179.916C89.2291 179.477 89.0938 179.146 88.8231 178.922C88.5524 178.689 88.1558 178.572 87.6331 178.572H85.3371V187H83.1811ZM88.8651 187L84.8191 181.764H87.1011L91.7771 187H88.8651ZM92.2247 187L95.8367 176.92H97.6847L94.3667 187H92.2247ZM99.6167 187L96.3127 176.92H98.2447L101.857 187H99.6167ZM94.1287 183.094H99.7847V184.774H94.1287V183.094Z" fill="white"/>
</g>
<defs>
<linearGradient id="chipGold" x1="34" y1="97" x2="64" y2="116" gradientUnits="userSpaceOnUse">
<stop offset="0" stop-color="#C8922A"/>
<stop offset="0.4" stop-color="#F0D06A"/>
<stop offset="1" stop-color="#C0842A"/>
</linearGradient>
<linearGradient id="paint0_linear_1_28" x1="176.001" y1="0" x2="176.001" y2="201" gradientUnits="userSpaceOnUse">
<stop stop-color="#EDFC74"/>
<stop offset="1" stop-color="#F5FFA8"/>
</linearGradient>
<clipPath id="clip0_1_28">
<rect width="352" height="201" fill="white"/>
</clipPath>
</defs>
</svg>`;

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

/* ─── Premium card (black + gold swirl, SVG) ─────────────────── */
function PremiumCard({ width, height }: { width: number; height: number }) {
  return (
    <View style={{ width, height, borderRadius: 9, overflow: "hidden" }}>
      <SvgXml xml={PREMIUM_CARD_SVG} width={width} height={height} />
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
