import * as Haptics from "expo-haptics";
import React, { useState, useEffect, useCallback } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";
import { apiFetch } from "@/utils/api";

interface EsimPlan {
  id: string;
  name: string;
  data: string;
  duration: string;
  price: number;
  countries: number;
  coverage: string;
  color: string;
  popular?: boolean;
  logoUrl?: string | null;
}

interface Region {
  name: string;
  count: number;
}

const FALLBACK_PLANS: EsimPlan[] = [
  {
    id: "1",
    name: "Tourist",
    data: "1 GB",
    duration: "7 days",
    price: 9.99,
    countries: 50,
    coverage: "Europe & Americas",
    color: "#3B82F6",
  },
  {
    id: "2",
    name: "Traveler",
    data: "5 GB",
    duration: "30 days",
    price: 24.99,
    countries: 120,
    coverage: "Global (Most regions)",
    color: "#00D9A0",
    popular: true,
  },
  {
    id: "3",
    name: "Global Pro",
    data: "10 GB",
    duration: "60 days",
    price: 49.99,
    countries: 190,
    coverage: "190+ countries",
    color: "#8B5CF6",
  },
];

const FALLBACK_REGIONS: Region[] = [
  { name: "Europe", count: 45 },
  { name: "Asia", count: 32 },
  { name: "Americas", count: 28 },
  { name: "Africa", count: 24 },
];

export default function EsimScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [activePlan, setActivePlan] = useState<EsimPlan | null>(null);
  const [usagePercent] = useState(42);
  const [plans, setPlans] = useState<EsimPlan[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sandbox, setSandbox] = useState(false);

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const fetchData = useCallback(async (isRefresh = false) => {
    if (!isRefresh) setLoading(true);
    setError(null);

    try {
      const [plansRes, regionsRes] = await Promise.all([
        apiFetch<{ plans: EsimPlan[]; sandbox?: boolean }>("/esim/plans"),
        apiFetch<{ regions: Region[]; total?: number }>("/esim/regions"),
      ]);

      setPlans(plansRes.plans?.length ? plansRes.plans : FALLBACK_PLANS);
      setRegions(regionsRes.regions?.length ? regionsRes.regions : FALLBACK_REGIONS);
      setSandbox(plansRes.sandbox ?? false);
    } catch (err) {
      setError(String(err));
      setPlans(FALLBACK_PLANS);
      setRegions(FALLBACK_REGIONS);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    fetchData(true);
  }, [fetchData]);

  function handleActivate(plan: EsimPlan) {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert(
      "Activate eSIM",
      `Activate ${plan.name} plan for $${plan.price}?\n${plan.data} · ${plan.duration} · ${plan.countries} countries`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Activate", onPress: () => setActivePlan(plan) },
      ]
    );
  }

  const displayPlans = plans.length ? plans : FALLBACK_PLANS;
  const displayRegions = regions.length ? regions : FALLBACK_REGIONS;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingTop: topPad, paddingBottom: (Platform.OS === "web" ? 34 : 0) + 100 }}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={colors.primary}
          colors={[colors.primary]}
        />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={[styles.title, { color: colors.foreground }]}>eSIM</Text>
          {sandbox && (
            <View style={[styles.sandboxBadge, { backgroundColor: colors.warning + "20", borderColor: colors.warning + "30" }]}>
              <Text style={[styles.sandboxText, { color: colors.warning }]}>SANDBOX</Text>
            </View>
          )}
        </View>
        <TouchableOpacity
          style={[styles.headerBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
        >
          <Feather name="help-circle" size={18} color={colors.foreground} />
        </TouchableOpacity>
      </View>

      {/* Active Plan or Empty State */}
      {activePlan ? (
        <View style={[styles.activePlanCard, { backgroundColor: activePlan.color + "20", borderColor: activePlan.color + "40" }]}>
          <View style={styles.activePlanHeader}>
            <View>
              <Text style={[styles.activePlanBadge, { color: activePlan.color }]}>● ACTIVE</Text>
              <Text style={[styles.activePlanName, { color: colors.foreground }]}>{activePlan.name} Plan</Text>
            </View>
            <TouchableOpacity onPress={() => Haptics.selectionAsync()}>
              <Feather name="settings" size={20} color={colors.mutedForeground} />
            </TouchableOpacity>
          </View>
          <View style={styles.usageSection}>
            <View style={styles.usageTop}>
              <Text style={[styles.usageLabel, { color: colors.mutedForeground }]}>Data Used</Text>
              <Text style={[styles.usageValue, { color: colors.foreground }]}>
                {(parseFloat(activePlan.data) * usagePercent / 100).toFixed(1)} / {activePlan.data}
              </Text>
            </View>
            <View style={[styles.usageBar, { backgroundColor: colors.border }]}>
              <View style={[styles.usageFill, { width: `${usagePercent}%` as any, backgroundColor: activePlan.color }]} />
            </View>
            <Text style={[styles.usagePercent, { color: colors.mutedForeground }]}>{usagePercent}% used</Text>
          </View>
          <View style={styles.activePlanMeta}>
            <View style={styles.metaItem}>
              <Feather name="clock" size={14} color={colors.mutedForeground} />
              <Text style={[styles.metaText, { color: colors.mutedForeground }]}>{activePlan.duration} remaining</Text>
            </View>
            <View style={styles.metaItem}>
              <Feather name="globe" size={14} color={colors.mutedForeground} />
              <Text style={[styles.metaText, { color: colors.mutedForeground }]}>{activePlan.countries} countries</Text>
            </View>
          </View>
        </View>
      ) : (
        <View style={[styles.noEsimCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[styles.noEsimIcon, { backgroundColor: colors.muted }]}>
            <Feather name="wifi-off" size={28} color={colors.mutedForeground} />
          </View>
          <Text style={[styles.noEsimTitle, { color: colors.foreground }]}>No Active eSIM</Text>
          <Text style={[styles.noEsimSub, { color: colors.mutedForeground }]}>
            Choose a plan below to stay connected worldwide
          </Text>
        </View>
      )}

      {/* Error Banner */}
      {error ? (
        <TouchableOpacity
          style={[styles.errorBanner, { backgroundColor: colors.destructive + "15", borderColor: colors.destructive + "30" }]}
          onPress={() => { Haptics.selectionAsync(); fetchData(); }}
          activeOpacity={0.7}
        >
          <Feather name="alert-circle" size={14} color={colors.destructive} />
          <Text style={[styles.errorText, { color: colors.destructive }]} numberOfLines={1}>
            Live data unavailable — showing cached plans
          </Text>
          <Feather name="refresh-cw" size={14} color={colors.destructive} />
        </TouchableOpacity>
      ) : null}

      {/* Coverage Regions */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Coverage</Text>
        {loading ? (
          <View style={styles.regionsLoading}>
            {[1, 2, 3, 4].map((i) => (
              <View key={i} style={[styles.regionSkeleton, { backgroundColor: colors.card, borderColor: colors.border }]} />
            ))}
          </View>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.regionsScroll}>
            {displayRegions.slice(0, 6).map((r) => (
              <TouchableOpacity
                key={r.name}
                style={[styles.regionCard, { backgroundColor: colors.card, borderColor: colors.border }]}
                onPress={() => Haptics.selectionAsync()}
                activeOpacity={0.7}
              >
                <Feather name="map-pin" size={20} color={colors.primary} />
                <Text style={[styles.regionName, { color: colors.foreground }]}>{r.name}</Text>
                <Text style={[styles.regionCount, { color: colors.mutedForeground }]}>{r.count} countries</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>

      {/* Plans */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Available Plans</Text>
          {loading && <ActivityIndicator size="small" color={colors.primary} />}
        </View>
        <View style={styles.plansList}>
          {loading ? (
            [1, 2, 3].map((i) => (
              <View
                key={i}
                style={[styles.planSkeleton, { backgroundColor: colors.card, borderColor: colors.border }]}
              >
                <View style={[styles.skeletonLine, { width: "60%", backgroundColor: colors.border }]} />
                <View style={[styles.skeletonLine, { width: "40%", backgroundColor: colors.border, marginTop: 8 }]} />
                <View style={[styles.skeletonBtn, { backgroundColor: colors.border }]} />
              </View>
            ))
          ) : (
            displayPlans.map((plan) => (
              <View
                key={plan.id}
                style={[
                  styles.planCard,
                  { backgroundColor: colors.card, borderColor: plan.popular ? plan.color : colors.border },
                  plan.popular && { borderWidth: 1.5 },
                ]}
              >
                {plan.popular && (
                  <View style={[styles.popularBadge, { backgroundColor: plan.color }]}>
                    <Text style={[styles.popularText, { color: "#0A0A0F" }]}>Most Popular</Text>
                  </View>
                )}
                <View style={styles.planHeader}>
                  <View style={[styles.planIcon, { backgroundColor: plan.color + "20" }]}>
                    <Feather name="globe" size={22} color={plan.color} />
                  </View>
                  <View style={styles.planInfo}>
                    <Text style={[styles.planName, { color: colors.foreground }]}>{plan.name}</Text>
                    <Text style={[styles.planCoverage, { color: colors.mutedForeground }]}>{plan.coverage}</Text>
                  </View>
                  <Text style={[styles.planPrice, { color: colors.foreground }]}>${plan.price}</Text>
                </View>
                <View style={[styles.planFeatures, { borderTopColor: colors.border }]}>
                  {[
                    { icon: "database", label: plan.data },
                    { icon: "clock", label: plan.duration },
                    { icon: "map-pin", label: `${plan.countries} countries` },
                  ].map((f) => (
                    <View key={f.label} style={styles.feature}>
                      <Feather name={f.icon as any} size={13} color={plan.color} />
                      <Text style={[styles.featureText, { color: colors.mutedForeground }]}>{f.label}</Text>
                    </View>
                  ))}
                </View>
                <TouchableOpacity
                  style={[
                    styles.activateBtn,
                    { backgroundColor: activePlan?.id === plan.id ? colors.muted : plan.color },
                  ]}
                  onPress={() => activePlan?.id === plan.id ? null : handleActivate(plan)}
                  activeOpacity={0.85}
                >
                  <Text
                    style={[
                      styles.activateBtnText,
                      { color: activePlan?.id === plan.id ? colors.mutedForeground : "#0A0A0F" },
                    ]}
                  >
                    {activePlan?.id === plan.id ? "Active" : "Activate"}
                  </Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>
      </View>

      {/* Info */}
      <View style={[styles.infoCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Feather name="info" size={16} color={colors.mutedForeground} />
        <Text style={[styles.infoText, { color: colors.mutedForeground }]}>
          eSIM activates instantly. No physical SIM required. Compatible with iPhone XS and newer, Google Pixel 3+, and most modern Android devices.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    paddingHorizontal: 24, paddingBottom: 20,
  },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  title: { fontSize: 28, fontFamily: "Inter_700Bold", letterSpacing: -0.5 },
  sandboxBadge: { borderRadius: 6, borderWidth: 1, paddingHorizontal: 8, paddingVertical: 3 },
  sandboxText: { fontSize: 10, fontFamily: "Inter_700Bold", letterSpacing: 0.5 },
  headerBtn: {
    width: 40, height: 40, borderRadius: 12, borderWidth: 1,
    alignItems: "center", justifyContent: "center",
  },
  activePlanCard: {
    marginHorizontal: 24, borderRadius: 20, borderWidth: 1, padding: 20, marginBottom: 24,
  },
  activePlanHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 },
  activePlanBadge: { fontSize: 11, fontFamily: "Inter_600SemiBold", letterSpacing: 1, marginBottom: 4 },
  activePlanName: { fontSize: 20, fontFamily: "Inter_700Bold" },
  usageSection: { gap: 8 },
  usageTop: { flexDirection: "row", justifyContent: "space-between" },
  usageLabel: { fontSize: 13, fontFamily: "Inter_400Regular" },
  usageValue: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  usageBar: { height: 8, borderRadius: 4, overflow: "hidden" },
  usageFill: { height: "100%", borderRadius: 4 },
  usagePercent: { fontSize: 12, fontFamily: "Inter_400Regular" },
  activePlanMeta: { flexDirection: "row", gap: 20, marginTop: 16 },
  metaItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  metaText: { fontSize: 13, fontFamily: "Inter_400Regular" },
  noEsimCard: {
    marginHorizontal: 24, borderRadius: 20, borderWidth: 1, padding: 32,
    alignItems: "center", gap: 12, marginBottom: 24,
  },
  noEsimIcon: { width: 64, height: 64, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  noEsimTitle: { fontSize: 18, fontFamily: "Inter_600SemiBold" },
  noEsimSub: { fontSize: 14, fontFamily: "Inter_400Regular", textAlign: "center", lineHeight: 20 },
  errorBanner: {
    marginHorizontal: 24, marginBottom: 16, borderRadius: 12, borderWidth: 1,
    flexDirection: "row", alignItems: "center", gap: 8, padding: 12,
  },
  errorText: { flex: 1, fontSize: 13, fontFamily: "Inter_500Medium" },
  section: { paddingHorizontal: 24, marginBottom: 24 },
  sectionHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 14 },
  sectionTitle: { fontSize: 18, fontFamily: "Inter_600SemiBold" },
  regionsScroll: { marginHorizontal: -4 },
  regionsLoading: { flexDirection: "row", gap: 8 },
  regionSkeleton: {
    width: 100, height: 88, borderRadius: 16, borderWidth: 1,
  },
  regionCard: {
    borderRadius: 16, borderWidth: 1, padding: 16, gap: 6,
    marginHorizontal: 4, alignItems: "center", minWidth: 100,
  },
  regionName: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  regionCount: { fontSize: 11, fontFamily: "Inter_400Regular" },
  plansList: { gap: 16 },
  planSkeleton: { borderRadius: 20, borderWidth: 1, padding: 20, gap: 0 },
  skeletonLine: { height: 14, borderRadius: 7 },
  skeletonBtn: { height: 48, borderRadius: 12, marginTop: 16 },
  planCard: { borderRadius: 20, borderWidth: 1, padding: 20, overflow: "hidden" },
  popularBadge: {
    position: "absolute", top: 16, right: 16,
    borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4,
  },
  popularText: { fontSize: 11, fontFamily: "Inter_700Bold" },
  planHeader: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 16 },
  planIcon: { width: 44, height: 44, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  planInfo: { flex: 1 },
  planName: { fontSize: 16, fontFamily: "Inter_700Bold", marginBottom: 2 },
  planCoverage: { fontSize: 12, fontFamily: "Inter_400Regular" },
  planPrice: { fontSize: 22, fontFamily: "Inter_700Bold", letterSpacing: -0.5 },
  planFeatures: {
    flexDirection: "row", gap: 16, paddingTop: 14, borderTopWidth: 1, marginBottom: 16, flexWrap: "wrap",
  },
  feature: { flexDirection: "row", alignItems: "center", gap: 5 },
  featureText: { fontSize: 12, fontFamily: "Inter_500Medium" },
  activateBtn: { height: 48, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  activateBtnText: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  infoCard: {
    marginHorizontal: 24, borderRadius: 16, borderWidth: 1, padding: 16,
    flexDirection: "row", gap: 10, alignItems: "flex-start",
  },
  infoText: { fontSize: 13, fontFamily: "Inter_400Regular", flex: 1, lineHeight: 20 },
});
