import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  Easing,
  FadeIn,
  FadeInDown,
  FadeInRight,
  FadeInUp,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";

/* ─── Transactions data ─────────────────────────────────────────────────────── */

const TRANSACTIONS = [
  {
    id: "1",
    title: "Amazon Gift Card",
    sub: "Sold · Apr 28",
    amount: "+₦200,040",
    positive: true,
    icon: "shopping-bag" as const,
  },
  {
    id: "2",
    title: "MTN Data Bundle",
    sub: "Bill Payment · Apr 25",
    amount: "-₦15,000",
    positive: false,
    icon: "smartphone" as const,
  },
  {
    id: "3",
    title: "iTunes Gift Card",
    sub: "Sold · Apr 22",
    amount: "+₦89,500",
    positive: true,
    icon: "music" as const,
  },
  {
    id: "4",
    title: "Steam Gift Card",
    sub: "Sold · Apr 20",
    amount: "+₦45,200",
    positive: true,
    icon: "monitor" as const,
  },
  {
    id: "5",
    title: "Wallet Withdrawal",
    sub: "Bank Transfer · Apr 18",
    amount: "-₦50,000",
    positive: false,
    icon: "arrow-up-right" as const,
  },
];

/* ─── Balance count-up hook ──────────────────────────────────────────────────── */

function useCountUp(target: number, active: boolean, duration = 1200) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    let step = 0;
    const steps = 60;
    const id = setInterval(() => {
      step++;
      setVal(Math.min(Math.floor((target / steps) * step), target));
      if (step >= steps) clearInterval(id);
    }, duration / steps);
    return () => clearInterval(id);
  }, [active, target]);
  return val;
}

/* ─── Skeleton shimmer ───────────────────────────────────────────────────────── */

function Skel({ w, h, r = 10 }: { w: number | `${number}%`; h: number; r?: number }) {
  const opacity = useSharedValue(0.3);
  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.07, { duration: 700, easing: Easing.sin }),
        withTiming(0.3, { duration: 700, easing: Easing.sin }),
      ),
      -1,
      true,
    );
  }, []);
  const style = useAnimatedStyle(() => ({ opacity: opacity.value }));
  return (
    <Animated.View
      style={[style, { width: w as any, height: h, borderRadius: r, backgroundColor: "#2A2A3D" }]}
    />
  );
}

/* ─── Quick action button ────────────────────────────────────────────────────── */

function QBtn({
  icon,
  label,
  color,
  onPress,
}: {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  color: string;
  onPress: () => void;
}) {
  const sc = useSharedValue(1);
  const anim = useAnimatedStyle(() => ({ transform: [{ scale: sc.value }] }));

  return (
    <Animated.View style={anim}>
      <Pressable
        onPress={onPress}
        onPressIn={() => { sc.value = withSpring(0.87, { damping: 12 }); }}
        onPressOut={() => { sc.value = withSpring(1, { damping: 12 }); }}
        style={qb.inner}
      >
        <View style={[qb.circle, { backgroundColor: color + "20", borderColor: color + "30" }]}>
          <Feather name={icon} size={19} color={color} />
        </View>
        <Text style={qb.label}>{label}</Text>
      </Pressable>
    </Animated.View>
  );
}

/* ─── Virtual card ───────────────────────────────────────────────────────────── */

function VirtualCard({ name }: { name: string }) {
  const tilt = useSharedValue(0);

  useEffect(() => {
    tilt.value = withRepeat(
      withSequence(
        withTiming(-1.5, { duration: 3200, easing: Easing.inOut(Easing.sin) }),
        withTiming(1.5, { duration: 3200, easing: Easing.inOut(Easing.sin) }),
      ),
      -1,
      true,
    );
  }, []);

  const cardAnim = useAnimatedStyle(() => ({
    transform: [{ rotateZ: `${tilt.value}deg` }],
  }));

  return (
    <Animated.View style={[vc.card, cardAnim]}>
      <LinearGradient
        colors={["#1A2340", "#0D1520"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={vc.gradient}
      >
        {/* Decorative orbs */}
        <View style={vc.orb1} />
        <View style={vc.orb2} />

        {/* Brand + chip */}
        <View style={vc.topRow}>
          <View>
            <Text style={vc.brand}>PAYVORA</Text>
            <Text style={vc.cardType}>VIRTUAL DOLLARS</Text>
          </View>
          {/* SIM chip graphic */}
          <View style={vc.chip}>
            <View style={vc.chipH} />
            <View style={vc.chipV} />
            <View style={vc.chipInner} />
          </View>
        </View>

        {/* Card number */}
        <Text style={vc.cardNum}>•••• •••• •••• 4587</Text>

        {/* Footer */}
        <View style={vc.footer}>
          <View>
            <Text style={vc.footLabel}>CARD HOLDER</Text>
            <Text style={vc.footVal}>{(name || "John Doe").toUpperCase()}</Text>
          </View>
          <View>
            <Text style={vc.footLabel}>VALID THRU</Text>
            <Text style={vc.footVal}>09/28</Text>
          </View>
          <Text style={vc.visa}>VISA</Text>
        </View>

        {/* Accent bar */}
        <LinearGradient
          colors={["#00D9A0", "#00A878"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={vc.accentBar}
        />
      </LinearGradient>
    </Animated.View>
  );
}

/* ─── Transaction row ────────────────────────────────────────────────────────── */

function TxRow({
  tx,
  isLast,
  onPress,
}: {
  tx: (typeof TRANSACTIONS)[0];
  isLast: boolean;
  onPress: () => void;
}) {
  const colors = useColors();
  const sc = useSharedValue(1);
  const anim = useAnimatedStyle(() => ({ transform: [{ scale: sc.value }] }));

  return (
    <Animated.View style={anim}>
      <Pressable
        onPress={onPress}
        onPressIn={() => { sc.value = withSpring(0.985, { damping: 15 }); }}
        onPressOut={() => { sc.value = withSpring(1, { damping: 15 }); }}
        style={[
          tx_s.row,
          { borderBottomColor: colors.border },
          isLast && { borderBottomWidth: 0 },
        ]}
      >
        <View
          style={[
            tx_s.icon,
            {
              backgroundColor: tx.positive
                ? "rgba(0,217,160,0.12)"
                : "rgba(255,91,122,0.12)",
            },
          ]}
        >
          <Feather
            name={tx.icon}
            size={15}
            color={tx.positive ? colors.accent : colors.destructive}
          />
        </View>
        <View style={tx_s.mid}>
          <Text style={[tx_s.title, { color: colors.text }]}>{tx.title}</Text>
          <Text style={[tx_s.sub, { color: colors.mutedForeground }]}>{tx.sub}</Text>
        </View>
        <View style={{ alignItems: "flex-end", gap: 4 }}>
          <Text
            style={[
              tx_s.amount,
              { color: tx.positive ? colors.accent : colors.destructive },
            ]}
          >
            {tx.amount}
          </Text>
          <View
            style={[
              tx_s.badge,
              {
                backgroundColor: tx.positive
                  ? "rgba(0,217,160,0.12)"
                  : "rgba(255,91,122,0.12)",
              },
            ]}
          >
            <Text
              style={[
                tx_s.badgeText,
                { color: tx.positive ? colors.accent : colors.destructive },
              ]}
            >
              {tx.positive ? "Credit" : "Debit"}
            </Text>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

/* ─── Main screen ────────────────────────────────────────────────────────────── */

export default function DashboardScreen() {
  const router = useRouter();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuth();

  const [loaded, setLoaded] = useState(false);
  const [showBal, setShowBal] = useState(true);

  const balance = user?.balance ?? 0;
  const animated = useCountUp(balance, loaded);
  const topPad = Platform.OS === "web" ? 48 : insets.top;

  const floatY = useSharedValue(0);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 1000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    floatY.value = withRepeat(
      withSequence(
        withTiming(-4, { duration: 2600, easing: Easing.inOut(Easing.sin) }),
        withTiming(4, { duration: 2600, easing: Easing.inOut(Easing.sin) }),
      ),
      -1,
      true,
    );
  }, [loaded]);

  const floatStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: floatY.value }],
  }));

  const fmt = (n: number) => "₦" + n.toLocaleString("en-NG");
  const firstName = (user?.name ?? "User").split(" ")[0];

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <View style={[s.root, { backgroundColor: colors.background }]}>

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <Animated.View
        entering={FadeInDown.duration(380).springify()}
        style={[s.header, { paddingTop: topPad + 12 }]}
      >
        <View>
          <Text style={[s.greeting, { color: colors.mutedForeground }]}>
            {greeting()} 👋
          </Text>
          <Text style={[s.name, { color: colors.text }]}>{firstName}</Text>
        </View>
        <View style={{ flexDirection: "row", gap: 10 }}>
          <TouchableOpacity
            style={[s.hBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}
            activeOpacity={0.78}
          >
            <Feather name="bell" size={17} color={colors.mutedForeground} />
            <View style={[s.notifDot, { backgroundColor: colors.accent }]} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[s.hBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={logout}
            activeOpacity={0.78}
          >
            <Feather name="log-out" size={17} color={colors.mutedForeground} />
          </TouchableOpacity>
        </View>
      </Animated.View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[s.scroll, { paddingBottom: insets.bottom + 40 }]}
      >

        {/* ── Balance card ─────────────────────────────────────────────────── */}
        <Animated.View entering={FadeInUp.duration(420).springify().delay(40)}>
          <Animated.View style={loaded ? floatStyle : undefined}>
            <LinearGradient
              colors={["#141428", "#0E0E1E"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[s.balCard, { borderColor: colors.border }]}
            >
              <View style={s.glowBlob} />

              {/* Top */}
              <View style={s.balTop}>
                <View style={[s.payvoraPill, { backgroundColor: colors.accentDim }]}>
                  <View style={[s.payvoraDot, { backgroundColor: colors.accent }]} />
                  <Text style={[s.payvoreLabel, { color: colors.accent }]}>PAYVORA</Text>
                </View>
                <TouchableOpacity
                  onPress={() => { Haptics.selectionAsync(); setShowBal(v => !v); }}
                  hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                >
                  <Feather
                    name={showBal ? "eye" : "eye-off"}
                    size={17}
                    color={colors.mutedForeground}
                  />
                </TouchableOpacity>
              </View>

              <Text style={[s.balLabel, { color: colors.mutedForeground }]}>Total Balance</Text>

              {!loaded ? (
                <View style={{ marginTop: 6, marginBottom: 18 }}>
                  <Skel w="65%" h={44} r={11} />
                </View>
              ) : (
                <Animated.Text
                  entering={FadeIn.duration(500)}
                  style={[s.balAmount, { color: colors.text }]}
                >
                  {showBal ? fmt(animated) : "₦ ••••••••"}
                </Animated.Text>
              )}

              {/* In-card stats */}
              <View style={[s.inCardStats, { backgroundColor: "rgba(255,255,255,0.04)" }]}>
                <View style={s.inStat}>
                  <Feather name="arrow-down-left" size={11} color={colors.accent} />
                  <Text style={[s.inStatLabel, { color: colors.mutedForeground }]}>Total Sold</Text>
                  <Text style={[s.inStatVal, { color: colors.text }]}>₦534,740</Text>
                </View>
                <View style={[s.inDivider, { backgroundColor: colors.border }]} />
                <View style={s.inStat}>
                  <Feather name="arrow-up-right" size={11} color={colors.destructive} />
                  <Text style={[s.inStatLabel, { color: colors.mutedForeground }]}>Withdrawn</Text>
                  <Text style={[s.inStatVal, { color: colors.text }]}>₦65,000</Text>
                </View>
                <View style={[s.inDivider, { backgroundColor: colors.border }]} />
                <View style={s.inStat}>
                  <Feather name="trending-up" size={11} color="#F59E0B" />
                  <Text style={[s.inStatLabel, { color: colors.mutedForeground }]}>This Month</Text>
                  <Text style={[s.inStatVal, { color: colors.text }]}>₦289,540</Text>
                </View>
              </View>

              <LinearGradient
                colors={["#00D9A0", "#00A878"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={s.cardBar}
              />
            </LinearGradient>
          </Animated.View>
        </Animated.View>

        {/* ── Quick actions ─────────────────────────────────────────────────── */}
        <Animated.View
          entering={FadeInUp.duration(380).springify().delay(80)}
          style={s.qRow}
        >
          <QBtn icon="arrow-down-left" label="Top Up"    color="#00D9A0" onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)} />
          <QBtn icon="send"            label="Send"      color="#3B82F6" onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)} />
          <QBtn icon="gift"            label="Gift Cards" color="#8B5CF6" onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.push("/(app)/gift-cards"); }} />
          <QBtn icon="arrow-up-right"  label="Withdraw"  color="#F59E0B" onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)} />
        </Animated.View>

        {/* ── Virtual card ──────────────────────────────────────────────────── */}
        <Animated.View entering={FadeInUp.duration(400).springify().delay(120)}>
          <View style={s.secHdr}>
            <View>
              <Text style={[s.secTitle, { color: colors.text }]}>Virtual Card</Text>
              <Text style={[s.secSub, { color: colors.mutedForeground }]}>Payvora Virtual Dollars</Text>
            </View>
            <TouchableOpacity style={[s.seeAllBtn, { backgroundColor: colors.accentDim }]}>
              <Text style={[s.seeAllTxt, { color: colors.accent }]}>Manage</Text>
              <Feather name="chevron-right" size={12} color={colors.accent} />
            </TouchableOpacity>
          </View>
          <VirtualCard name={user?.name ?? "John Doe"} />
        </Animated.View>

        {/* ── Sell promo banner ─────────────────────────────────────────────── */}
        <Animated.View entering={FadeInUp.duration(380).springify().delay(160)}>
          <TouchableOpacity
            onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.push("/(app)/gift-cards"); }}
            activeOpacity={0.87}
            style={[s.banner, { backgroundColor: colors.surface, borderColor: colors.border }]}
          >
            <LinearGradient
              colors={["rgba(0,217,160,0.14)", "rgba(0,217,160,0.02)"]}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={StyleSheet.absoluteFill}
            />
            <View style={[s.bannerIcon, { backgroundColor: "rgba(0,217,160,0.15)" }]}>
              <Feather name="gift" size={22} color="#00D9A0" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[s.bannerTitle, { color: colors.text }]}>Sell a Gift Card</Text>
              <Text style={[s.bannerSub, { color: colors.mutedForeground }]}>
                Best rates · Amazon, iTunes, Steam & more
              </Text>
            </View>
            <View style={[s.bannerArrow, { backgroundColor: "#00D9A0" }]}>
              <Feather name="arrow-right" size={14} color="#0A0A0F" />
            </View>
          </TouchableOpacity>
        </Animated.View>

        {/* ── Recent transactions ───────────────────────────────────────────── */}
        <Animated.View
          entering={FadeInUp.duration(360).springify().delay(200)}
          style={s.secHdr}
        >
          <View>
            <Text style={[s.secTitle, { color: colors.text }]}>Recent Transactions</Text>
            <Text style={[s.secSub, { color: colors.mutedForeground }]}>
              {loaded ? `${TRANSACTIONS.length} recent` : "Loading…"}
            </Text>
          </View>
          <TouchableOpacity
            style={[s.seeAllBtn, { backgroundColor: colors.accentDim }]}
            onPress={() => router.push("/(app)/transactions")}
          >
            <Text style={[s.seeAllTxt, { color: colors.accent }]}>See All</Text>
            <Feather name="chevron-right" size={12} color={colors.accent} />
          </TouchableOpacity>
        </Animated.View>

        {!loaded && (
          <Animated.View exiting={FadeOut.duration(200)} style={{ gap: 18 }}>
            {[0, 1, 2].map(i => (
              <View key={i} style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                <Skel w={46} h={46} r={14} />
                <View style={{ flex: 1, gap: 8 }}>
                  <Skel w="56%" h={13} />
                  <Skel w="38%" h={10} />
                </View>
                <View style={{ alignItems: "flex-end", gap: 8 }}>
                  <Skel w={70} h={13} />
                  <Skel w={52} h={10} />
                </View>
              </View>
            ))}
          </Animated.View>
        )}

        {loaded && (
          <View style={[s.txList, { borderColor: colors.border }]}>
            {TRANSACTIONS.map((tx, i) => (
              <Animated.View
                key={tx.id}
                entering={FadeInRight.duration(320).springify().delay(i * 55)}
              >
                <TxRow
                  tx={tx}
                  isLast={i === TRANSACTIONS.length - 1}
                  onPress={() => { Haptics.selectionAsync(); router.push("/(app)/card-status"); }}
                />
              </Animated.View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

/* ─── Styles ─────────────────────────────────────────────────────────────────── */

const s = StyleSheet.create({
  root: { flex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 24,
    paddingBottom: 18,
  },
  greeting: { fontSize: 13, fontFamily: "Manrope_400Regular", marginBottom: 3 },
  name: { fontSize: 22, fontFamily: "Manrope_700Bold", letterSpacing: -0.5 },
  hBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  notifDot: {
    position: "absolute",
    top: 9,
    right: 9,
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  scroll: { paddingHorizontal: 20, paddingTop: 6, gap: 22 },

  balCard: {
    borderRadius: 26,
    borderWidth: 1,
    padding: 22,
    overflow: "hidden",
    shadowColor: "#00D9A0",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 8,
  },
  glowBlob: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "rgba(0,217,160,0.07)",
    top: -80,
    right: -60,
  },
  balTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },
  payvoraPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  payvoraDot: { width: 6, height: 6, borderRadius: 3 },
  payvoreLabel: { fontSize: 11, fontFamily: "Manrope_700Bold", letterSpacing: 1.5 },
  balLabel: { fontSize: 12, fontFamily: "Manrope_400Regular", marginBottom: 4 },
  balAmount: {
    fontSize: 40,
    fontFamily: "Manrope_700Bold",
    letterSpacing: -1.5,
    marginBottom: 20,
  },
  inCardStats: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    padding: 14,
  },
  inStat: { flex: 1, alignItems: "center", gap: 4 },
  inDivider: { width: 1, height: 36, marginHorizontal: 4 },
  inStatLabel: { fontSize: 10, fontFamily: "Manrope_400Regular" },
  inStatVal: { fontSize: 13, fontFamily: "Manrope_700Bold" },
  cardBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    opacity: 0.7,
  },

  qRow: { flexDirection: "row", justifyContent: "space-between" },

  secHdr: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  secTitle: { fontSize: 17, fontFamily: "Manrope_700Bold" },
  secSub: { fontSize: 12, fontFamily: "Manrope_400Regular", marginTop: 2 },
  seeAllBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  seeAllTxt: { fontSize: 12, fontFamily: "Manrope_600SemiBold" },

  banner: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    overflow: "hidden",
  },
  bannerIcon: {
    width: 50,
    height: 50,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  bannerTitle: { fontSize: 15, fontFamily: "Manrope_700Bold", marginBottom: 3 },
  bannerSub: { fontSize: 12, fontFamily: "Manrope_400Regular" },
  bannerArrow: {
    width: 36,
    height: 36,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },

  txList: { borderRadius: 20, borderWidth: 1, overflow: "hidden", paddingHorizontal: 16 },
});

const qb = StyleSheet.create({
  inner: { alignItems: "center", gap: 8 },
  circle: {
    width: 56,
    height: 56,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  label: { fontSize: 11, fontFamily: "Manrope_500Medium", color: "#8F8FA3" },
});

const vc = StyleSheet.create({
  card: {
    borderRadius: 22,
    overflow: "hidden",
    shadowColor: "#00D9A0",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18,
    shadowRadius: 28,
    elevation: 12,
  },
  gradient: { padding: 24, paddingBottom: 26, minHeight: 200, overflow: "hidden" },
  orb1: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "rgba(0,217,160,0.06)",
    top: -80,
    right: -60,
  },
  orb2: {
    position: "absolute",
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "rgba(59,130,246,0.06)",
    bottom: -50,
    left: -30,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
  },
  brand: { fontSize: 18, fontFamily: "Manrope_700Bold", color: "#FFFFFF", letterSpacing: 2, marginBottom: 2 },
  cardType: { fontSize: 9, fontFamily: "Manrope_400Regular", color: "rgba(255,255,255,0.5)", letterSpacing: 1.5 },
  chip: {
    width: 42,
    height: 32,
    borderRadius: 5,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  chipH: {
    position: "absolute",
    top: "50%",
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: "rgba(255,255,255,0.25)",
  },
  chipV: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: "50%",
    width: 1,
    backgroundColor: "rgba(255,255,255,0.25)",
  },
  chipInner: {
    width: 26,
    height: 18,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  cardNum: {
    fontSize: 16,
    fontFamily: "Manrope_400Regular",
    color: "rgba(255,255,255,0.75)",
    letterSpacing: 3,
    marginBottom: 20,
  },
  footer: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  footLabel: { fontSize: 8, fontFamily: "Manrope_400Regular", color: "rgba(255,255,255,0.45)", letterSpacing: 1.2, marginBottom: 2 },
  footVal: { fontSize: 13, fontFamily: "Manrope_600SemiBold", color: "#FFFFFF", letterSpacing: 0.5 },
  visa: { fontSize: 20, fontFamily: "Manrope_700Bold", color: "rgba(255,255,255,0.9)", fontStyle: "italic" },
  accentBar: { position: "absolute", bottom: 0, left: 0, right: 0, height: 3, opacity: 0.8 },
});

const tx_s = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 12,
  },
  icon: { width: 46, height: 46, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  mid: { flex: 1 },
  title: { fontSize: 14, fontFamily: "Manrope_600SemiBold", marginBottom: 3 },
  sub: { fontSize: 12, fontFamily: "Manrope_400Regular" },
  amount: { fontSize: 14, fontFamily: "Manrope_700Bold" },
  badge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 20 },
  badgeText: { fontSize: 10, fontFamily: "Manrope_600SemiBold" },
});
