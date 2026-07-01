import { Feather } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import * as Haptics from "expo-haptics";
import * as LocalAuthentication from "expo-local-authentication";
import * as ScreenCapture from "expo-screen-capture";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  interpolate,
  ZoomIn,
  ZoomOut,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@/context/AuthContext";
import { rf } from "@/utils/responsive";
import { PremiumEyeIcon } from "@/components/PremiumEyeIcon";

/* ─── Design tokens ──────────────────────────────────────────────────────── */
const C = {
  bg:      "#FFFFFF",
  text:    "#0B0A0A",
  navy:    "#061941",
  textSec: "#595F67",
  textMut: "#AAAFB5",
  border:  "#F0F0F0",
  success: "#00B03C",
  danger:  "#EF4444",
  primary: "#135EF2",
};

/* ─── Card data ──────────────────────────────────────────────────────────── */
const CARD_ACTIONS = [
  { id: "freeze",  label: "Freeze",       icon: "pause-circle" as const, color: "#0891B2", bg: "#ECFEFF" },
  { id: "limit",   label: "Limit",        icon: "sliders"      as const, color: "#7C3AED", bg: "#F5F3FF" },
  { id: "topup",   label: "Top Up",       icon: "plus-circle"  as const, color: "#00B03C", bg: "#F0FFF4" },
  { id: "details", label: "Card Details", icon: "eye"          as const, color: "#E11D48", bg: "#FFF1F2" },
];

const TRANSACTIONS = [
  { id: "1", name: "Amazon Purchase", date: "Jun 23, 2025", amount: "₦12,500", positive: false, icon: "shopping-bag" as const, iconBg: "#FFF2CF", iconColor: "#5C4000" },
  { id: "2", name: "Card Top Up",     date: "Jun 22, 2025", amount: "₦50,000", positive: true,  icon: "arrow-down"  as const, iconBg: "#F0FFF4", iconColor: "#00B03C" },
  { id: "3", name: "Netflix",         date: "Jun 20, 2025", amount: "₦4,700",  positive: false, icon: "tv"          as const, iconBg: "#FFF1F2", iconColor: "#E11D48" },
  { id: "4", name: "Spotify",         date: "Jun 18, 2025", amount: "₦2,400",  positive: false, icon: "music"       as const, iconBg: "#F5F3FF", iconColor: "#7C3AED" },
  { id: "5", name: "Card Top Up",     date: "Jun 15, 2025", amount: "₦20,000", positive: true,  icon: "arrow-down"  as const, iconBg: "#F0FFF4", iconColor: "#00B03C" },
];

/* ─── Loading skeleton ───────────────────────────────────────────────────── */
function SkeletonBox({ w, h, radius = 8 }: { w: number | string; h: number; radius?: number }) {
  const op = useSharedValue(1);
  useEffect(() => {
    const tick = () => {
      op.value = withTiming(0.4, { duration: 600 }, () => {
        op.value = withTiming(1, { duration: 600 }, tick);
      });
    };
    tick();
  }, []);
  const style = useAnimatedStyle(() => ({ opacity: op.value }));
  return (
    <Animated.View
      style={[
        style,
        { width: w as number, height: h, borderRadius: radius, backgroundColor: "#E8ECF0" },
      ]}
    />
  );
}

/* ─── Action button ──────────────────────────────────────────────────────── */
function ActionBtn({ item, onPress }: { item: typeof CARD_ACTIONS[number]; onPress: () => void }) {
  const sc   = useSharedValue(1);
  const anim = useAnimatedStyle(() => ({ transform: [{ scale: sc.value }] }));
  return (
    <Animated.View style={[anim, { alignItems: "center", gap: 7, flex: 1 }]}>
      <Pressable
        style={[ab.btn, { backgroundColor: item.bg }]}
        onPressIn={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          sc.value = withSpring(0.88, { damping: 12 });
        }}
        onPressOut={() => { sc.value = withSpring(1, { damping: 12 }); }}
        onPress={onPress}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Feather name={item.icon} size={20} color={item.color} />
      </Pressable>
      <Text style={ab.label}>{item.label}</Text>
    </Animated.View>
  );
}

const ab = StyleSheet.create({
  btn:   { width: 52, height: 52, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  label: { fontSize: 11, fontFamily: "Manrope_600SemiBold", color: C.textSec, textAlign: "center" },
});

/* ─── Animated sliding tab bar ───────────────────────────────────────────── */
const TABS = [
  { key: "transactions" as const, label: "Transactions" },
  { key: "details"      as const, label: "Card Details" },
];

function TabBar({
  active,
  onChange,
}: {
  active: "transactions" | "details";
  onChange: (t: "transactions" | "details") => void;
}) {
  const [containerW, setContainerW] = useState(0);
  const indicator = useSharedValue(0);
  const PAD       = 4;
  const tabW      = containerW > 0 ? (containerW - PAD * 2) / TABS.length : 0;

  useEffect(() => {
    if (tabW <= 0) return;
    const idx = TABS.findIndex(t => t.key === active);
    indicator.value = withSpring(idx * tabW, { damping: 22, stiffness: 280 });
  }, [active, tabW]);

  const indStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: indicator.value }],
  }));

  return (
    <View
      style={tb.bar}
      onLayout={e => setContainerW(e.nativeEvent.layout.width)}
    >
      {tabW > 0 && (
        <Animated.View
          style={[
            tb.indicator,
            indStyle,
            { width: tabW, left: PAD, top: PAD, bottom: PAD },
          ]}
        />
      )}
      {TABS.map(t => (
        <Pressable
          key={t.key}
          style={tb.tab}
          onPress={() => {
            Haptics.selectionAsync();
            onChange(t.key);
          }}
        >
          <Text style={[tb.label, active === t.key && tb.labelActive]}>
            {t.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const tb = StyleSheet.create({
  bar: {
    flexDirection: "row",
    backgroundColor: "#F3F4F6",
    borderRadius: 14,
    padding: 4,
    position: "relative",
  },
  indicator: {
    position: "absolute",
    borderRadius: 11,
    backgroundColor: C.bg,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  tab:         { flex: 1, paddingVertical: 10, alignItems: "center", justifyContent: "center", zIndex: 1 },
  label:       { fontSize: 13, fontFamily: "Manrope_600SemiBold", color: "#9CA3AF" },
  labelActive: { color: C.navy },
});

/* ─── Responsive virtual card ────────────────────────────────────────────── */
interface VirtualCardProps {
  cardW:          number;
  frozen:         boolean;
  revealed:       boolean;
  onToggleReveal: () => void;
  balance:        number;
  name:           string;
  maskedNum:      string;
  fullNum:        string;
  expiry:         string;
  maskedCvv:      string;
  fullCvv:        string;
}

function VirtualCard({
  cardW, frozen, revealed, onToggleReveal,
  balance, name, maskedNum, fullNum, expiry, maskedCvv, fullCvv,
}: VirtualCardProps) {
  const cardH = Math.round(cardW * 0.6303);
  const sc    = cardW / 370;
  const f     = (n: number) => Math.max(1, Math.round(n * sc));
  const p     = (n: number) => Math.round(n * sc);

  const revealOp    = useSharedValue(0);
  const revealScale = useSharedValue(0.92);

  useEffect(() => {
    revealOp.value    = withTiming(revealed ? 1 : 0,    { duration: 280 });
    revealScale.value = withSpring(revealed ? 1 : 0.92, { damping: 16, stiffness: 280 });
  }, [revealed]);

  const maskedStyle  = useAnimatedStyle(() => ({
    opacity: interpolate(revealOp.value, [0, 1], [1, 0]),
  }));
  const revealedStyle = useAnimatedStyle(() => ({
    opacity: revealOp.value,
    transform: [{ scale: revealScale.value }],
  }));

  /* Card fade+scale entrance */
  const cardEnter = useSharedValue(0.94);
  const cardOp    = useSharedValue(0);
  useEffect(() => {
    cardEnter.value = withSpring(1, { damping: 18, stiffness: 240 });
    cardOp.value    = withTiming(1, { duration: 320 });
  }, []);
  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cardEnter.value }],
    opacity: cardOp.value,
  }));

  return (
    <Animated.View style={cardStyle}>
      <View
        style={[
          vc.card,
          {
            width: cardW, height: cardH,
            padding: p(20), borderRadius: p(22),
            opacity: frozen ? 0.58 : 1,
          },
        ]}
      >
        {/* Decorative orbs */}
        <View style={[vc.orb1, { width: p(200), height: p(200), borderRadius: p(100), top: p(-60), left: p(-40) }]} />
        <View style={[vc.orb2, { width: p(130), height: p(130), borderRadius: p(65),  bottom: p(-28), right: p(-18) }]} />
        <View style={[vc.orb3, { width: p(90),  height: p(90),  borderRadius: p(45),  top: p(18), right: p(28) }]} />

        {/* Frozen overlay */}
        {frozen && (
          <View style={[vc.frozenOverlay, { borderRadius: p(22) }]}>
            <Feather name="pause-circle" size={f(34)} color="#FFFFFF" />
            <Text style={[vc.frozenText, { fontSize: f(15) }]}>Card Frozen</Text>
          </View>
        )}

        {/* Top row */}
        <View style={vc.cardTop}>
          <View>
            <Text style={[vc.cardLabel, { fontSize: f(8), letterSpacing: 1.4 }]}>VIRTUAL CARD</Text>
            <Text style={[vc.cardBank,  { fontSize: f(12), marginTop: p(2) }]}>PAYVORA</Text>
          </View>
          <View style={vc.mastercard}>
            <View style={[vc.mcL, { width: p(22), height: p(22), borderRadius: p(11) }]} />
            <View style={[vc.mcR, { width: p(22), height: p(22), borderRadius: p(11), marginLeft: p(-9) }]} />
          </View>
        </View>

        {/* Balance */}
        <View style={{ marginTop: p(8) }}>
          <Text style={[vc.cardBalLabel, { fontSize: f(8) }]}>Available Balance</Text>
          <Text style={[vc.cardBalAmount, { fontSize: f(19) }]}>
            {"₦" + balance.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </Text>
        </View>

        {/* Card number — animated swap */}
        <View style={{ marginTop: p(10), marginBottom: p(10) }}>
          <Animated.Text
            style={[vc.cardNumber, { fontSize: f(13), letterSpacing: p(3) }, maskedStyle]}
            numberOfLines={1}
          >
            {maskedNum}
          </Animated.Text>
          <Animated.Text
            style={[vc.cardNumber, { fontSize: f(13), letterSpacing: p(2.5), position: "absolute" }, revealedStyle]}
            numberOfLines={1}
          >
            {fullNum}
          </Animated.Text>
        </View>

        {/* Footer */}
        <View style={vc.cardFooter}>
          <View>
            <Text style={[vc.cardMeta,    { fontSize: f(7) }]}>CARD HOLDER</Text>
            <Text style={[vc.cardMetaVal, { fontSize: f(9) }]}>{name.toUpperCase()}</Text>
          </View>
          <View>
            <Text style={[vc.cardMeta,    { fontSize: f(7) }]}>EXPIRES</Text>
            <Text style={[vc.cardMetaVal, { fontSize: f(9), fontVariant: ["tabular-nums"] }]}>{expiry}</Text>
          </View>
          <View>
            <Text style={[vc.cardMeta, { fontSize: f(7) }]}>CVV</Text>
            <View style={{ flexDirection: "row", alignItems: "center", gap: p(4) }}>
              <Animated.Text style={[vc.cardMetaVal, { fontSize: f(9), fontVariant: ["tabular-nums"] }, maskedStyle]}>
                {maskedCvv}
              </Animated.Text>
              <Animated.Text style={[vc.cardMetaVal, { fontSize: f(9), fontVariant: ["tabular-nums"], position: "absolute" }, revealedStyle]}>
                {fullCvv}
              </Animated.Text>
            </View>
          </View>
        </View>

        {/* Reveal toggle */}
        <TouchableOpacity
          style={[vc.visBtn, { bottom: p(16), right: p(16) }]}
          onPress={onToggleReveal}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <PremiumEyeIcon open={revealed} size={f(18)} color="rgba(255,255,255,0.78)" />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const vc = StyleSheet.create({
  card: {
    backgroundColor: "#0A0A0A",
    overflow: "hidden",
    position: "relative",
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.42,
    shadowRadius: 32,
    elevation: 20,
  },
  orb1: { position: "absolute", backgroundColor: "rgba(255,255,255,0.05)" },
  orb2: { position: "absolute", backgroundColor: "rgba(255,255,255,0.04)" },
  orb3: { position: "absolute", backgroundColor: "rgba(99,91,255,0.14)"   },

  frozenOverlay: {
    position: "absolute", inset: 0, zIndex: 10,
    backgroundColor: "rgba(0,0,0,0.6)",
    alignItems: "center", justifyContent: "center", gap: 10,
  },
  frozenText: { fontFamily: "Manrope_700Bold", color: "#FFFFFF" },

  cardTop:     { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  cardLabel:   { fontFamily: "Manrope_500Medium", color: "rgba(255,255,255,0.5)", textTransform: "uppercase" },
  cardBank:    { fontFamily: "Manrope_700Bold", color: "#FFFFFF" },
  mastercard:  { flexDirection: "row", alignItems: "center" },
  mcL:         { backgroundColor: "#EB001B" },
  mcR:         { backgroundColor: "#F79E1B", opacity: 0.95 },

  cardBalLabel:  { fontFamily: "Manrope_400Regular", color: "rgba(255,255,255,0.48)", letterSpacing: 0.4 },
  cardBalAmount: { fontFamily: "Manrope_700Bold", color: "#FFFFFF", letterSpacing: -0.5, marginTop: 2 },
  cardNumber: {
    fontFamily: "Manrope_500Medium",
    color: "rgba(255,255,255,0.88)",
    fontVariant: ["tabular-nums"],
  },
  cardFooter:  { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" },
  cardMeta:    { fontFamily: "Manrope_400Regular", color: "rgba(255,255,255,0.48)", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 2 },
  cardMetaVal: { fontFamily: "Manrope_600SemiBold", color: "#FFFFFF" },
  visBtn:      { position: "absolute" },
});

/* ─── Detail row ─────────────────────────────────────────────────────────── */
interface DetailRowProps {
  label:     string;
  value:     string;
  isStatus?: boolean;
  isFrozen?: boolean;
  copyable?: boolean;
  copiedKey: string;
  onCopy:    (value: string, key: string) => void;
  revealed:  boolean;
  isLast?:   boolean;
}

function DetailRow({ label, value, isStatus, isFrozen, copyable, copiedKey, onCopy, revealed, isLast }: DetailRowProps) {
  const wasCopied = copiedKey === label;

  /* Smooth reveal fade for individual value */
  const valOp    = useSharedValue(1);
  const valScale = useSharedValue(1);
  const prevRevealedRef = useRef(revealed);

  useEffect(() => {
    if (prevRevealedRef.current !== revealed && copyable && (label === "Card Number" || label === "CVV")) {
      valOp.value    = withTiming(0, { duration: 100 }, () => {
        valOp.value    = withTiming(1, { duration: 200 });
        valScale.value = withSpring(1, { damping: 14, stiffness: 300 });
      });
      valScale.value = withTiming(0.92, { duration: 100 });
    }
    prevRevealedRef.current = revealed;
  }, [revealed]);

  const valStyle = useAnimatedStyle(() => ({
    opacity: valOp.value,
    transform: [{ scale: valScale.value }],
  }));

  return (
    <View>
      <View style={dt.row}>
        <Text style={dt.label}>{label}</Text>
        <View style={dt.valueRow}>
          {isStatus ? (
            <View style={[dt.badge, isFrozen ? dt.badgeFrozen : dt.badgeActive]}>
              <View style={[dt.badgeDot, { backgroundColor: isFrozen ? C.danger : C.success }]} />
              <Text style={[dt.badgeText, { color: isFrozen ? C.danger : C.success }]}>
                {isFrozen ? "Frozen" : "Active"}
              </Text>
            </View>
          ) : (
            <Animated.Text
              style={[
                dt.value,
                valStyle,
                { fontVariant: label !== "Card Holder" && label !== "Card Type" ? ["tabular-nums"] : [] },
              ]}
            >
              {value}
            </Animated.Text>
          )}
          {copyable && (
            <TouchableOpacity
              onPress={() => onCopy(value, label)}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              style={dt.copyBtn}
            >
              <Animated.View entering={ZoomIn.duration(160)} key={wasCopied ? "check" : "copy"}>
                <Feather
                  name={wasCopied ? "check" : "copy"}
                  size={14}
                  color={wasCopied ? C.success : C.textMut}
                />
              </Animated.View>
            </TouchableOpacity>
          )}
        </View>
      </View>
      {!isLast && <View style={dt.divider} />}
    </View>
  );
}

const LABEL_W = 120;

const dt = StyleSheet.create({
  row:      { flexDirection: "row", alignItems: "center", paddingVertical: 18, paddingHorizontal: 18 },
  label:    { width: LABEL_W, fontSize: 13, fontFamily: "Manrope_400Regular", color: C.textSec },
  valueRow: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  value:    { fontSize: 13, fontFamily: "Manrope_500Medium", color: C.text, flex: 1 },
  copyBtn:  { width: 36, height: 36, alignItems: "center", justifyContent: "center" },
  divider:  { height: 1, backgroundColor: "#F3F4F6", marginHorizontal: 18 },

  badge:       { flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20, borderWidth: 1 },
  badgeActive: { backgroundColor: "#ECFFF3", borderColor: "#A7F3D0" },
  badgeFrozen: { backgroundColor: "#FFF1F1", borderColor: "#FECACA" },
  badgeDot:    { width: 6, height: 6, borderRadius: 3 },
  badgeText:   { fontSize: 12, fontFamily: "Manrope_600SemiBold" },
});

/* ─── Reveal button with animated fill ──────────────────────────────────── */
function RevealButton({ revealed, onPress }: { revealed: boolean; onPress: () => void }) {
  const sc   = useSharedValue(1);
  const anim = useAnimatedStyle(() => ({ transform: [{ scale: sc.value }] }));

  return (
    <Animated.View style={[anim, s.revealBtnWrap]}>
      <Pressable
        style={[s.revealBtn, revealed && s.revealBtnActive]}
        onPressIn={() => { sc.value = withSpring(0.96, { damping: 14 }); }}
        onPressOut={() => { sc.value = withSpring(1,    { damping: 14 }); }}
        onPress={onPress}
      >
        <PremiumEyeIcon open={revealed} size={16} color={revealed ? "#FFFFFF" : C.navy} />
        <Text style={[s.revealBtnText, revealed && { color: "#FFFFFF" }]}>
          {revealed ? "Hide Card Details" : "Reveal Card Details"}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

/* ─── Main screen ────────────────────────────────────────────────────────── */
export default function CardScreen() {
  const router    = useRouter();
  const insets    = useSafeAreaInsets();
  const { user }  = useAuth();
  const { width } = useWindowDimensions();
  const CARD_W    = Math.min(width - 40, 390);
  const topPad    = Platform.OS === "web" ? 40 : insets.top;

  const [frozen,    setFrozen]    = useState(false);
  const [revealed,  setRevealed]  = useState(false);
  const [activeTab, setActiveTab] = useState<"transactions" | "details">("transactions");
  const [copiedKey, setCopiedKey] = useState("");
  const [loading,   setLoading]   = useState(true);
  const [biometricAvailable, setBiometricAvailable] = useState(false);

  /* Simulate card data load */
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(t);
  }, []);

  /* Check biometric availability */
  useEffect(() => {
    LocalAuthentication.hasHardwareAsync().then(has => {
      if (has) LocalAuthentication.isEnrolledAsync().then(enrolled => setBiometricAvailable(enrolled));
    });
  }, []);

  /* Screen capture prevention when details are revealed */
  useEffect(() => {
    if (Platform.OS !== "web") {
      if (revealed) {
        ScreenCapture.preventScreenCaptureAsync().catch(() => {});
      } else {
        ScreenCapture.allowScreenCaptureAsync().catch(() => {});
      }
    }
    return () => {
      if (Platform.OS !== "web") ScreenCapture.allowScreenCaptureAsync().catch(() => {});
    };
  }, [revealed]);

  /* Card data */
  const maskedNum = "5234  ••••  ••••  8901";
  const fullNum   = "5234  4892  7712  8901";
  const expiry    = "08 / 27";
  const maskedCvv = "•••";
  const fullCvv   = "482";
  const balance   = user?.balance ?? 200590;
  const name      = user?.name ?? "PAYVORA User";

  /* Copy to clipboard */
  const handleCopy = useCallback(async (value: string, key: string) => {
    const clean = value.replace(/•/g, "").trim();
    if (!clean || clean.length < 3) {
      Alert.alert("Reveal first", "Please reveal card details before copying.");
      return;
    }
    await Clipboard.setStringAsync(clean);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(""), 2200);
  }, []);

  /* Biometric / alert reveal gate */
  const requestReveal = useCallback(async () => {
    if (revealed) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setRevealed(false);
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    if (biometricAvailable && Platform.OS !== "web") {
      try {
        const result = await LocalAuthentication.authenticateAsync({
          promptMessage: "Authenticate to reveal card details",
          fallbackLabel: "Use Passcode",
          cancelLabel: "Cancel",
          disableDeviceFallback: false,
        });
        if (result.success) {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          setRevealed(true);
        }
      } catch {
        /* Fallback to alert if biometric throws */
        showRevealAlert();
      }
    } else {
      showRevealAlert();
    }
  }, [revealed, biometricAvailable]);

  const showRevealAlert = () => {
    Alert.alert(
      "Reveal card details?",
      "Your full card number, expiry and CVV will be shown. Keep them private.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reveal",
          onPress: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            setRevealed(true);
          },
        },
      ],
    );
  };

  /* Action handlers */
  const handleAction = useCallback((id: string) => {
    if (id === "freeze") {
      Haptics.notificationAsync(
        frozen
          ? Haptics.NotificationFeedbackType.Success
          : Haptics.NotificationFeedbackType.Warning,
      );
      setFrozen(f => !f);
    } else if (id === "details") {
      Haptics.selectionAsync();
      setActiveTab("details");
    } else if (id === "topup") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      router.push("/(app)/dashboard" as any);
    } else if (id === "limit") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      Alert.alert("Spending Limit", "Set your card spending limit in card settings.", [{ text: "OK" }]);
    }
  }, [frozen]);

  const DETAILS = [
    { label: "Card Number", value: revealed ? fullNum   : maskedNum, copyable: true  },
    { label: "Card Holder", value: name.toUpperCase(),               copyable: true  },
    { label: "Expiry Date", value: expiry,                           copyable: true  },
    { label: "CVV",         value: revealed ? fullCvv   : maskedCvv, copyable: true  },
    { label: "Card Type",   value: "Virtual Mastercard",             copyable: false },
    { label: "Status",      value: frozen ? "Frozen" : "Active",     copyable: false, isStatus: true },
  ];

  return (
    <View style={[s.root, { paddingTop: topPad }]}>

      {/* ── Header ── */}
      <Animated.View entering={FadeInDown.duration(280)} style={s.header}>
        <Text style={s.title}>My Card</Text>
        <TouchableOpacity
          style={s.notifBtn}
          onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
          hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
        >
          <Feather name="bell" size={20} color={C.navy} />
          <View style={s.notifDot} />
        </TouchableOpacity>
      </Animated.View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[s.scroll, { paddingBottom: insets.bottom + 120 }]}
      >

        {/* ── Virtual card ── */}
        <View style={{ alignItems: "center" }}>
          {loading ? (
            <SkeletonBox w={CARD_W} h={Math.round(CARD_W * 0.6303)} radius={22} />
          ) : (
            <VirtualCard
              cardW={CARD_W}
              frozen={frozen}
              revealed={revealed}
              onToggleReveal={requestReveal}
              balance={balance}
              name={name}
              maskedNum={maskedNum}
              fullNum={fullNum}
              expiry={expiry}
              maskedCvv={maskedCvv}
              fullCvv={fullCvv}
            />
          )}
        </View>

        {/* ── Action buttons ── */}
        <Animated.View entering={FadeInUp.duration(300).delay(90)} style={s.actionsRow}>
          {loading
            ? [0, 1, 2, 3].map(i => (
                <View key={i} style={{ alignItems: "center", gap: 7, flex: 1 }}>
                  <SkeletonBox w={52} h={52} radius={16} />
                  <SkeletonBox w={44} h={10} radius={5} />
                </View>
              ))
            : CARD_ACTIONS.map(action => (
                <ActionBtn
                  key={action.id}
                  item={action}
                  onPress={() => handleAction(action.id)}
                />
              ))
          }
        </Animated.View>

        {/* ── Segmented control ── */}
        <Animated.View entering={FadeInUp.duration(280).delay(130)}>
          <TabBar active={activeTab} onChange={setActiveTab} />
        </Animated.View>

        {/* ── Transactions ── */}
        {activeTab === "transactions" && (
          <Animated.View entering={FadeIn.duration(240)} style={s.txCard}>
            {loading
              ? [0, 1, 2].map(i => (
                  <View key={i} style={s.txSkeletonRow}>
                    <SkeletonBox w={44} h={44} radius={14} />
                    <View style={{ flex: 1, gap: 8 }}>
                      <SkeletonBox w="80%" h={13} radius={6} />
                      <SkeletonBox w="50%" h={10} radius={6} />
                    </View>
                    <SkeletonBox w={60} h={13} radius={6} />
                  </View>
                ))
              : TRANSACTIONS.map((item, i) => (
                  <Animated.View key={item.id} entering={FadeInDown.duration(220).delay(i * 28)}>
                    <TouchableOpacity
                      style={s.txRow}
                      activeOpacity={0.72}
                      onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                    >
                      <View style={[s.txIcon, { backgroundColor: item.iconBg }]}>
                        <Feather name={item.icon} size={18} color={item.iconColor} />
                      </View>
                      <View style={s.txInfo}>
                        <Text style={s.txName}>{item.name}</Text>
                        <Text style={s.txDate}>{item.date}</Text>
                      </View>
                      <Text style={[s.txAmount, { color: item.positive ? C.success : C.danger }]}>
                        {item.positive ? "+" : "-"}{item.amount}
                      </Text>
                    </TouchableOpacity>
                    {i < TRANSACTIONS.length - 1 && <View style={s.txDivider} />}
                  </Animated.View>
                ))
            }
          </Animated.View>
        )}

        {/* ── Card Details ── */}
        {activeTab === "details" && (
          <Animated.View entering={FadeIn.duration(240)} style={s.detailsCard}>

            {/* Biometric hint banner when not yet revealed */}
            {!revealed && (
              <Animated.View entering={FadeIn.duration(200)} style={s.revealBanner}>
                <Feather name="shield" size={14} color="#6B7280" />
                <Text style={s.revealBannerText}>
                  {biometricAvailable
                    ? "Use Face ID or Touch ID to reveal your full card details"
                    : "Tap the button below to reveal your card details — keep them private"
                  }
                </Text>
              </Animated.View>
            )}

            {DETAILS.map((row, i) => (
              <DetailRow
                key={row.label}
                label={row.label}
                value={row.value}
                isStatus={"isStatus" in row ? row.isStatus : false}
                isFrozen={frozen}
                copyable={"copyable" in row ? row.copyable : false}
                copiedKey={copiedKey}
                onCopy={handleCopy}
                revealed={revealed}
                isLast={i === DETAILS.length - 1}
              />
            ))}

            <RevealButton revealed={revealed} onPress={requestReveal} />
          </Animated.View>
        )}

      </ScrollView>
    </View>
  );
}

/* ─── Styles ──────────────────────────────────────────────────────────────── */
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },

  header: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    paddingHorizontal: 20, paddingBottom: 14, paddingTop: 8,
  },
  title:    { fontSize: rf(22), fontFamily: "Manrope_700Bold", color: C.navy },
  notifBtn: {
    width: 44, height: 44, borderRadius: 22,
    alignItems: "center", justifyContent: "center",
    backgroundColor: "#F3F4F6", position: "relative",
  },
  notifDot: {
    position: "absolute", top: 9, right: 9,
    width: 7, height: 7, borderRadius: 3.5,
    backgroundColor: "#FF3B30", borderWidth: 1.5, borderColor: C.bg,
  },

  scroll:      { paddingHorizontal: 20, paddingTop: 4, gap: 24 },
  actionsRow:  { flexDirection: "row", justifyContent: "space-between" },

  txCard:        { borderRadius: 16, borderWidth: 1, borderColor: C.border, overflow: "hidden", backgroundColor: C.bg },
  txSkeletonRow: { flexDirection: "row", alignItems: "center", gap: 12, padding: 16 },
  txRow:         { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 15, paddingHorizontal: 16 },
  txIcon:        { width: 44, height: 44, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  txInfo:        { flex: 1, gap: 4 },
  txName:        { fontSize: 14, fontFamily: "Manrope_600SemiBold", color: C.text },
  txDate:        { fontSize: 11, fontFamily: "Manrope_400Regular", color: C.textMut },
  txAmount:      { fontSize: 14, fontFamily: "Manrope_700Bold", fontVariant: ["tabular-nums"] },
  txDivider:     { height: 1, backgroundColor: "#F9FAFB", marginHorizontal: 16 },

  detailsCard: {
    borderRadius: 16, borderWidth: 1, borderColor: C.border,
    overflow: "hidden", backgroundColor: C.bg,
  },
  revealBanner: {
    flexDirection: "row", alignItems: "center", gap: 8,
    backgroundColor: "#F9FAFB", paddingHorizontal: 18, paddingVertical: 13,
    borderBottomWidth: 1, borderBottomColor: C.border,
  },
  revealBannerText: {
    flex: 1, fontSize: 12, fontFamily: "Manrope_400Regular", color: "#6B7280", lineHeight: 17,
  },

  revealBtnWrap: { padding: 16 },
  revealBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8,
    height: 48, borderRadius: 12,
    backgroundColor: "#F3F4F6",
    borderWidth: 1, borderColor: C.border,
  },
  revealBtnActive: {
    backgroundColor: C.navy, borderColor: C.navy,
  },
  revealBtnText: {
    fontSize: 14, fontFamily: "Manrope_600SemiBold", color: C.navy,
  },
});
