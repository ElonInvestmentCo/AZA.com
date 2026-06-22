import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React from "react";
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
  FadeInDown,
  FadeInLeft,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";

const TRANSACTIONS = [
  { id: "1", title: "Amazon Gift Card",  sub: "Sold • April 28, 2024",    amount: "+₦200,040", positive: true  },
  { id: "2", title: "MTN Data Service",  sub: "Withdraw • April 25, 2024", amount: "-₦15,000",  positive: false },
  { id: "3", title: "iTunes Gift Card",  sub: "Sold • April 22, 2024",    amount: "+₦89,500",  positive: true  },
  { id: "4", title: "Steam Gift Card",   sub: "Sold • April 20, 2024",    amount: "+₦45,200",  positive: true  },
];

function ActionBtn({
  icon, label, onPress,
}: { icon: keyof typeof Feather.glyphMap; label: string; onPress: () => void }) {
  const colors = useColors();
  const scale  = useSharedValue(1);
  const style  = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Animated.View style={style}>
      <Pressable
        style={s.actionItem}
        onPress={onPress}
        onPressIn={() => { scale.value = withSpring(0.92, { damping: 12, stiffness: 300 }); }}
        onPressOut={() => { scale.value = withSpring(1.0,  { damping: 12, stiffness: 300 }); }}
      >
        <View style={[s.actionIcon, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Feather name={icon} size={19} color={colors.accent} />
        </View>
        <Text style={[s.actionLabel, { color: colors.mutedForeground }]}>{label}</Text>
      </Pressable>
    </Animated.View>
  );
}

export default function DashboardScreen() {
  const router = useRouter();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuth();

  const topPad = Platform.OS === "web" ? 48 : insets.top;
  const fmt = (n: number) => "₦" + n.toLocaleString("en-NG");

  return (
    <View style={[s.root, { backgroundColor: colors.background }]}>

      {/* ── Balance header ── */}
      <Animated.View
        entering={FadeInDown.duration(420).springify()}
        style={[s.header, { paddingTop: topPad + 20 }]}
      >
        <View style={s.headerTop}>
          <View>
            <Text style={[s.greeting, { color: colors.mutedForeground }]}>
              Hi, {user?.name ?? "User"} 👋
            </Text>
            <Text style={[s.balanceLabel, { color: colors.subtitle }]}>Available Balance</Text>
          </View>
          <TouchableOpacity
            onPress={logout}
            style={[s.logoutBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}
            activeOpacity={0.75}
          >
            <Feather name="log-out" size={16} color={colors.mutedForeground} />
          </TouchableOpacity>
        </View>

        <Text style={[s.balance, { color: colors.text }]}>{fmt(user?.balance ?? 0)}</Text>

        <View style={s.actions}>
          <ActionBtn icon="arrow-up"   label="Top Up"     onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)} />
          <ActionBtn icon="send"       label="Send"       onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)} />
          <ActionBtn icon="gift"       label="Gift Cards" onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); router.push("/(app)/gift-cards"); }} />
          <ActionBtn icon="refresh-cw" label="Withdraw"   onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)} />
        </View>
      </Animated.View>

      {/* ── Scrollable content ── */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[s.content, { paddingBottom: insets.bottom + 28 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Promo banner */}
        <Animated.View entering={FadeInUp.duration(380).springify().delay(80)}>
          <TouchableOpacity
            style={[s.promoCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={() => router.push("/(app)/gift-cards")}
            activeOpacity={0.88}
          >
            <View style={[s.promoIconWrap, { backgroundColor: colors.accentDim }]}>
              <Feather name="gift" size={20} color={colors.accent} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[s.promoTitle, { color: colors.text }]}>Sell a Gift Card</Text>
              <Text style={[s.promoSub,   { color: colors.mutedForeground }]}>
                Amazon, iTunes, Steam & more
              </Text>
            </View>
            <View style={[s.promoArrow, { backgroundColor: colors.accent }]}>
              <Feather name="arrow-right" size={16} color={colors.primaryForeground} />
            </View>
          </TouchableOpacity>
        </Animated.View>

        {/* Section header */}
        <Animated.View entering={FadeInUp.duration(380).springify().delay(130)} style={s.sectionHeader}>
          <Text style={[s.sectionTitle, { color: colors.text }]}>Recent Transactions</Text>
          <TouchableOpacity onPress={() => router.push("/(app)/transactions")}>
            <Text style={[s.seeAll, { color: colors.accent }]}>See All</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Transaction rows */}
        {TRANSACTIONS.map((tx, i) => (
          <Animated.View
            key={tx.id}
            entering={FadeInLeft.duration(350).springify().delay(160 + i * 50)}
          >
            <TouchableOpacity
              style={[s.txRow, { borderBottomColor: colors.border }]}
              onPress={() => router.push("/(app)/card-status")}
              activeOpacity={0.75}
            >
              <View style={[s.txIcon, { backgroundColor: tx.positive ? colors.successLight : colors.destructiveDim }]}>
                <Feather
                  name={tx.positive ? "arrow-down-left" : "arrow-up-right"}
                  size={15}
                  color={tx.positive ? colors.success : colors.destructive}
                />
              </View>
              <View style={s.txMid}>
                <Text style={[s.txTitle, { color: colors.text }]}>{tx.title}</Text>
                <Text style={[s.txSub,   { color: colors.mutedForeground }]}>{tx.sub}</Text>
              </View>
              <Text style={[s.txAmount, { color: tx.positive ? colors.success : colors.destructive }]}>
                {tx.amount}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root:        { flex: 1 },
  header:      { paddingHorizontal: 24, paddingBottom: 28, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: "#2A2A3D" },
  headerTop:   { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 },
  greeting:    { fontSize: 13, fontFamily: "Manrope_400Regular", marginBottom: 2 },
  balanceLabel:{ fontSize: 12, fontFamily: "Manrope_400Regular" },
  logoutBtn:   { width: 36, height: 36, borderRadius: 10, alignItems: "center", justifyContent: "center", borderWidth: 1 },
  balance:     { fontSize: 38, fontFamily: "Manrope_700Bold", letterSpacing: -1.5, marginBottom: 24 },
  actions:     { flexDirection: "row", justifyContent: "space-between" },
  actionItem:  { alignItems: "center", gap: 7 },
  actionIcon:  { width: 52, height: 52, borderRadius: 16, alignItems: "center", justifyContent: "center", borderWidth: 1 },
  actionLabel: { fontSize: 11, fontFamily: "Manrope_500Medium" },

  content:      { paddingHorizontal: 20, paddingTop: 20 },
  promoCard:    { borderRadius: 18, padding: 16, flexDirection: "row", alignItems: "center", gap: 14, marginBottom: 28, borderWidth: 1 },
  promoIconWrap:{ width: 44, height: 44, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  promoTitle:   { fontSize: 15, fontFamily: "Manrope_700Bold", marginBottom: 2 },
  promoSub:     { fontSize: 12, fontFamily: "Manrope_400Regular" },
  promoArrow:   { width: 34, height: 34, borderRadius: 10, alignItems: "center", justifyContent: "center" },

  sectionHeader:{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  sectionTitle: { fontSize: 16, fontFamily: "Manrope_700Bold" },
  seeAll:       { fontSize: 13, fontFamily: "Manrope_600SemiBold" },

  txRow:   { flexDirection: "row", alignItems: "center", paddingVertical: 14, borderBottomWidth: StyleSheet.hairlineWidth, gap: 12 },
  txIcon:  { width: 42, height: 42, borderRadius: 13, alignItems: "center", justifyContent: "center" },
  txMid:   { flex: 1 },
  txTitle: { fontSize: 14, fontFamily: "Manrope_600SemiBold", marginBottom: 2 },
  txSub:   { fontSize: 12, fontFamily: "Manrope_400Regular" },
  txAmount:{ fontSize: 14, fontFamily: "Manrope_700Bold" },
});
