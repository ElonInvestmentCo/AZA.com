import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
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
  FadeInLeft,
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

/* ─── Data ─────────────────────────────────────────────────────────────────── */

const TRANSACTIONS = [
  { id: "1", title: "Amazon Gift Card", sub: "Sold · Apr 28",     amount: "+₦200,040", positive: true,  icon: "shopping-bag" as const },
  { id: "2", title: "MTN Data Service", sub: "Withdraw · Apr 25", amount: "-₦15,000",  positive: false, icon: "smartphone"   as const },
  { id: "3", title: "iTunes Gift Card", sub: "Sold · Apr 22",     amount: "+₦89,500",  positive: true,  icon: "music"        as const },
  { id: "4", title: "Steam Gift Card",  sub: "Sold · Apr 20",     amount: "+₦45,200",  positive: true,  icon: "monitor"      as const },
];

/* ─── Balance count-up hook ─────────────────────────────────────────────────── */

function useCountUp(target: number, active: boolean, duration = 1100) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    let step = 0;
    const steps  = 55;
    const inc    = target / steps;
    const id = setInterval(() => {
      step++;
      setVal(Math.min(Math.floor(inc * step), target));
      if (step >= steps) clearInterval(id);
    }, duration / steps);
    return () => clearInterval(id);
  }, [active, target]);
  return val;
}

/* ─── Skeleton shimmer ──────────────────────────────────────────────────────── */

function Skel({
  w, h, r = 10,
}: { w: number | `${number}%`; h: number; r?: number }) {
  const colors  = useColors();
  const opacity = useSharedValue(0.35);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.06, { duration: 650, easing: Easing.sin }),
        withTiming(0.35, { duration: 650, easing: Easing.sin }),
      ),
      -1,
      true,
    );
  }, []);

  const style = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      style={[
        style,
        { width: w as any, height: h, borderRadius: r, backgroundColor: colors.border },
      ]}
    />
  );
}

/* ─── Quick action pill ─────────────────────────────────────────────────────── */

function QAction({
  icon, label, onPress,
}: { icon: keyof typeof Feather.glyphMap; label: string; onPress: () => void }) {
  const colors = useColors();
  const sc     = useSharedValue(1);
  const style  = useAnimatedStyle(() => ({ transform: [{ scale: sc.value }] }));

  return (
    <Animated.View style={[style, qa.wrap]}>
      <Pressable
        style={qa.btn}
        onPress={onPress}
        onPressIn={() => { sc.value = withSpring(0.87, { damping: 11, stiffness: 310 }); }}
        onPressOut={() => { sc.value = withSpring(1.0,  { damping: 11, stiffness: 310 }); }}
      >
        <View style={[qa.iconBox, { backgroundColor: colors.accentDim, borderColor: "rgba(0,217,160,0.18)" }]}>
          <Feather name={icon} size={18} color={colors.accent} />
        </View>
        <Text style={[qa.label, { color: colors.mutedForeground }]}>{label}</Text>
      </Pressable>
    </Animated.View>
  );
}

/* ─── Mini stat chip ────────────────────────────────────────────────────────── */

function StatChip({
  icon, label, value, positive,
}: { icon: keyof typeof Feather.glyphMap; label: string; value: string; positive?: boolean }) {
  const colors = useColors();
  return (
    <View style={[sc2.chip, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={[sc2.iconBox, { backgroundColor: positive ? colors.successLight : colors.destructiveDim }]}>
        <Feather name={icon} size={13} color={positive ? colors.success : colors.destructive} />
      </View>
      <View>
        <Text style={[sc2.label, { color: colors.mutedForeground }]}>{label}</Text>
        <Text style={[sc2.value, { color: colors.text }]}>{value}</Text>
      </View>
    </View>
  );
}

/* ─── Main screen ───────────────────────────────────────────────────────────── */

export default function DashboardScreen() {
  const router  = useRouter();
  const colors  = useColors();
  const insets  = useSafeAreaInsets();
  const { user, logout } = useAuth();

  const [loaded,      setLoaded]      = useState(false);
  const [showBalance, setShowBalance] = useState(true);

  const balance     = user?.balance ?? 0;
  const animated    = useCountUp(balance, loaded);
  const topPad      = Platform.OS === "web" ? 48 : insets.top;

  /* Floating card */
  const floatY = useSharedValue(0);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 1200);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    floatY.value = withRepeat(
      withSequence(
        withTiming(-5, { duration: 2400, easing: Easing.sin }),
        withTiming(5,  { duration: 2400, easing: Easing.sin }),
      ),
      -1,
      true,
    );
  }, [loaded]);

  const floatStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: floatY.value }],
  }));

  const fmt = (n: number) => "₦" + n.toLocaleString("en-NG");

  return (
    <View style={[s.root, { backgroundColor: colors.background }]}>

      {/* ── Top bar ──────────────────────────────────────────────────── */}
      <Animated.View
        entering={FadeInDown.duration(400).springify()}
        style={[s.topBar, { paddingTop: topPad + 14 }]}
      >
        <View>
          <Text style={[s.greeting, { color: colors.mutedForeground }]}>Good morning 👋</Text>
          <Text style={[s.name, { color: colors.text }]}>{user?.name ?? "User"}</Text>
        </View>
        <View style={{ flexDirection: "row", gap: 10 }}>
          <TouchableOpacity
            style={[s.iconBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}
            activeOpacity={0.78}
          >
            <Feather name="bell" size={17} color={colors.mutedForeground} />
            <View style={[s.notifDot, { backgroundColor: colors.accent }]} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[s.iconBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={logout}
            activeOpacity={0.78}
          >
            <Feather name="log-out" size={17} color={colors.mutedForeground} />
          </TouchableOpacity>
        </View>
      </Animated.View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[s.scroll, { paddingBottom: insets.bottom + 36 }]}
      >

        {/* ── Balance card ─────────────────────────────────────────────── */}
        <Animated.View entering={FadeInUp.duration(460).springify().delay(60)}>
          <Animated.View
            style={[
              s.balCard,
              { backgroundColor: colors.surface, borderColor: colors.border },
              loaded ? floatStyle : undefined,
            ]}
          >
            {/* Top row */}
            <View style={s.balTop}>
              <View style={[s.brandPill, { backgroundColor: colors.accentDim }]}>
                <View style={[s.brandDot, { backgroundColor: colors.accent }]} />
                <Text style={[s.brandLabel, { color: colors.accent }]}>PAYVORA</Text>
              </View>
              <TouchableOpacity
                onPress={() => { Haptics.selectionAsync(); setShowBalance(v => !v); }}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Feather
                  name={showBalance ? "eye" : "eye-off"}
                  size={17}
                  color={colors.mutedForeground}
                />
              </TouchableOpacity>
            </View>

            {/* Balance label */}
            <Text style={[s.balLabel, { color: colors.mutedForeground }]}>Total Balance</Text>

            {/* Balance amount or skeleton */}
            {!loaded ? (
              <View style={{ marginTop: 6, marginBottom: 4 }}>
                <Skel w="68%" h={44} r={11} />
              </View>
            ) : (
              <Animated.Text
                entering={FadeIn.duration(500)}
                style={[s.balAmount, { color: colors.text }]}
              >
                {showBalance ? fmt(animated) : "₦ ••••••••"}
              </Animated.Text>
            )}

            {/* Footer */}
            <View style={s.balFooter}>
              {!loaded ? (
                <Skel w="42%" h={22} r={20} />
              ) : (
                <Animated.View
                  entering={FadeInLeft.duration(360).springify().delay(80)}
                  style={[s.gainPill, { backgroundColor: colors.successLight }]}
                >
                  <Feather name="trending-up" size={11} color={colors.accent} />
                  <Text style={[s.gainText, { color: colors.accent }]}>+₦45,200 today</Text>
                </Animated.View>
              )}
              <Text style={[s.balNote, { color: colors.mutedForeground }]}>
                {loaded ? "Live rate" : "Loading…"}
              </Text>
            </View>

            {/* Accent stripe at bottom of card */}
            <View style={[s.cardStripe, { backgroundColor: colors.accent }]} />
          </Animated.View>
        </Animated.View>

        {/* ── Mini stats row ────────────────────────────────────────────── */}
        {loaded && (
          <Animated.View
            entering={FadeInUp.duration(380).springify().delay(100)}
            style={s.statsRow}
          >
            <StatChip icon="arrow-down-left" label="Total Sold"     value="₦534,740" positive />
            <StatChip icon="arrow-up-right"  label="Withdrawn"      value="₦45,000"  />
          </Animated.View>
        )}
        {!loaded && (
          <View style={[s.statsRow, { gap: 12 }]}>
            <Skel w="47%" h={64} r={16} />
            <Skel w="47%" h={64} r={16} />
          </View>
        )}

        {/* ── Quick actions ──────────────────────────────────────────────── */}
        <Animated.View
          entering={FadeInUp.duration(400).springify().delay(140)}
          style={s.qRow}
        >
          <QAction icon="arrow-up"   label="Top Up"    onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)} />
          <QAction icon="send"       label="Send"       onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)} />
          <QAction icon="gift"       label="Gift Cards" onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.push("/(app)/gift-cards"); }} />
          <QAction icon="refresh-cw" label="Withdraw"  onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)} />
        </Animated.View>

        {/* ── Sell promo banner ─────────────────────────────────────────── */}
        <Animated.View entering={FadeInUp.duration(400).springify().delay(180)}>
          <TouchableOpacity
            style={[s.banner, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.push("/(app)/gift-cards"); }}
            activeOpacity={0.87}
          >
            {/* Decorative glow blob */}
            <View style={[s.bannerGlow, { backgroundColor: colors.accentDim }]} />
            <View style={[s.bannerIconWrap, { backgroundColor: colors.accentDim }]}>
              <Feather name="gift" size={22} color={colors.accent} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[s.bannerTitle, { color: colors.text }]}>Sell a Gift Card</Text>
              <Text style={[s.bannerSub, { color: colors.mutedForeground }]}>
                Instant payout · Amazon, iTunes & more
              </Text>
            </View>
            <View style={[s.bannerArrow, { backgroundColor: colors.accent }]}>
              <Feather name="arrow-right" size={15} color={colors.primaryForeground} />
            </View>
          </TouchableOpacity>
        </Animated.View>

        {/* ── Recent transactions ───────────────────────────────────────── */}
        <Animated.View
          entering={FadeInUp.duration(380).springify().delay(220)}
          style={s.sectionHdr}
        >
          <View>
            <Text style={[s.sectionTitle, { color: colors.text }]}>Recent Transactions</Text>
            <Text style={[s.sectionSub, { color: colors.mutedForeground }]}>
              {loaded ? `${TRANSACTIONS.length} transactions` : "Loading…"}
            </Text>
          </View>
          <TouchableOpacity
            style={[s.seeAllBtn, { backgroundColor: colors.accentDim }]}
            onPress={() => router.push("/(app)/transactions")}
          >
            <Text style={[s.seeAllText, { color: colors.accent }]}>See All</Text>
            <Feather name="chevron-right" size={13} color={colors.accent} />
          </TouchableOpacity>
        </Animated.View>

        {/* Skeleton rows */}
        {!loaded && (
          <Animated.View exiting={FadeOut.duration(200)} style={{ gap: 18 }}>
            {[0, 1, 2].map((i) => (
              <View key={i} style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                <Skel w={44} h={44} r={14} />
                <View style={{ flex: 1, gap: 8 }}>
                  <Skel w="58%" h={13} />
                  <Skel w="38%" h={10} />
                </View>
                <View style={{ alignItems: "flex-end", gap: 8 }}>
                  <Skel w={72} h={13} />
                  <Skel w={56} h={10} />
                </View>
              </View>
            ))}
          </Animated.View>
        )}

        {/* Real rows */}
        {loaded && (
          <View style={[s.txList, { borderColor: colors.border }]}>
            {TRANSACTIONS.map((tx, i) => (
              <Animated.View
                key={tx.id}
                entering={FadeInRight.duration(340).springify().delay(i * 60)}
              >
                <TouchableOpacity
                  style={[
                    s.txRow,
                    { borderBottomColor: colors.border },
                    i === TRANSACTIONS.length - 1 && { borderBottomWidth: 0 },
                  ]}
                  onPress={() => { Haptics.selectionAsync(); router.push("/(app)/card-status"); }}
                  activeOpacity={0.72}
                >
                  <View
                    style={[
                      s.txIcon,
                      { backgroundColor: tx.positive ? colors.successLight : colors.destructiveDim },
                    ]}
                  >
                    <Feather
                      name={tx.icon}
                      size={15}
                      color={tx.positive ? colors.success : colors.destructive}
                    />
                  </View>

                  <View style={s.txMid}>
                    <Text style={[s.txTitle, { color: colors.text }]}>{tx.title}</Text>
                    <Text style={[s.txSub,   { color: colors.mutedForeground }]}>{tx.sub}</Text>
                  </View>

                  <View style={{ alignItems: "flex-end", gap: 4 }}>
                    <Text
                      style={[
                        s.txAmount,
                        { color: tx.positive ? colors.success : colors.destructive },
                      ]}
                    >
                      {tx.amount}
                    </Text>
                    <View
                      style={[
                        s.txBadge,
                        { backgroundColor: tx.positive ? colors.successLight : colors.destructiveDim },
                      ]}
                    >
                      <Text
                        style={[
                          s.txBadgeText,
                          { color: tx.positive ? colors.success : colors.destructive },
                        ]}
                      >
                        {tx.positive ? "Completed" : "Debit"}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

/* ─── Styles ────────────────────────────────────────────────────────────────── */

const s = StyleSheet.create({
  root:    { flex: 1 },
  topBar:  {
    flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start",
    paddingHorizontal: 24, paddingBottom: 20,
    borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: "#2A2A3D",
  },
  greeting: { fontSize: 13, fontFamily: "Manrope_400Regular", marginBottom: 3 },
  name:     { fontSize: 20, fontFamily: "Manrope_700Bold", letterSpacing: -0.4 },
  iconBtn: {
    width: 40, height: 40, borderRadius: 12,
    alignItems: "center", justifyContent: "center", borderWidth: 1,
  },
  notifDot: {
    position: "absolute", top: 8, right: 8,
    width: 7, height: 7, borderRadius: 4,
  },

  scroll: { paddingHorizontal: 20, paddingTop: 24, gap: 20 },

  /* balance card */
  balCard: {
    borderRadius: 24, borderWidth: 1, padding: 22, overflow: "hidden",
    shadowColor: "#00D9A0", shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.07, shadowRadius: 20, elevation: 6,
  },
  balTop:     { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  brandPill:  { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  brandDot:   { width: 6, height: 6, borderRadius: 3 },
  brandLabel: { fontSize: 11, fontFamily: "Manrope_700Bold", letterSpacing: 1.5 },
  balLabel:   { fontSize: 12, fontFamily: "Manrope_400Regular", marginBottom: 4 },
  balAmount:  { fontSize: 38, fontFamily: "Manrope_700Bold", letterSpacing: -1.5, marginBottom: 16 },
  balFooter:  { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  gainPill:   { flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  gainText:   { fontSize: 12, fontFamily: "Manrope_600SemiBold" },
  balNote:    { fontSize: 11, fontFamily: "Manrope_400Regular" },
  cardStripe: { position: "absolute", bottom: 0, left: 0, right: 0, height: 2.5, opacity: 0.6 },

  /* stats row */
  statsRow: { flexDirection: "row", gap: 12 },

  /* quick actions */
  qRow: { flexDirection: "row", justifyContent: "space-between" },

  /* sell banner */
  banner: {
    borderRadius: 20, borderWidth: 1, padding: 18,
    flexDirection: "row", alignItems: "center", gap: 14, overflow: "hidden",
  },
  bannerGlow:     { position: "absolute", width: 100, height: 100, borderRadius: 50, left: -30, top: -30 },
  bannerIconWrap: { width: 48, height: 48, borderRadius: 15, alignItems: "center", justifyContent: "center" },
  bannerTitle:    { fontSize: 15, fontFamily: "Manrope_700Bold", marginBottom: 3 },
  bannerSub:      { fontSize: 12, fontFamily: "Manrope_400Regular" },
  bannerArrow:    { width: 36, height: 36, borderRadius: 11, alignItems: "center", justifyContent: "center" },

  /* section header */
  sectionHdr:  { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  sectionTitle:{ fontSize: 17, fontFamily: "Manrope_700Bold" },
  sectionSub:  { fontSize: 12, fontFamily: "Manrope_400Regular", marginTop: 2 },
  seeAllBtn:   { flexDirection: "row", alignItems: "center", gap: 3, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20 },
  seeAllText:  { fontSize: 12, fontFamily: "Manrope_600SemiBold" },

  /* transaction list */
  txList: { borderRadius: 20, borderWidth: 1, overflow: "hidden", paddingHorizontal: 16 },
  txRow:  { flexDirection: "row", alignItems: "center", paddingVertical: 15, borderBottomWidth: StyleSheet.hairlineWidth, gap: 12 },
  txIcon: { width: 44, height: 44, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  txMid:  { flex: 1 },
  txTitle:{ fontSize: 14, fontFamily: "Manrope_600SemiBold", marginBottom: 3 },
  txSub:  { fontSize: 12, fontFamily: "Manrope_400Regular" },
  txAmount:   { fontSize: 14, fontFamily: "Manrope_700Bold" },
  txBadge:    { paddingHorizontal: 7, paddingVertical: 2, borderRadius: 20 },
  txBadgeText:{ fontSize: 10, fontFamily: "Manrope_600SemiBold" },
});

/* quick action local styles */
const qa = StyleSheet.create({
  wrap:    {},
  btn:     { alignItems: "center", gap: 7 },
  iconBox: {
    width: 54, height: 54, borderRadius: 17,
    alignItems: "center", justifyContent: "center", borderWidth: 1,
  },
  label:   { fontSize: 11, fontFamily: "Manrope_500Medium" },
});

/* stat chip local styles */
const sc2 = StyleSheet.create({
  chip:    { flex: 1, flexDirection: "row", alignItems: "center", gap: 10, borderRadius: 16, borderWidth: 1, padding: 14 },
  iconBox: { width: 32, height: 32, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  label:   { fontSize: 10, fontFamily: "Manrope_400Regular", marginBottom: 2 },
  value:   { fontSize: 14, fontFamily: "Manrope_700Bold" },
});
