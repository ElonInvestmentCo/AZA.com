import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, {
  FadeInRight,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { ScreenHeader } from "@/components/ScreenHeader";
import { useColors } from "@/hooks/useColors";

type Filter = "all" | "sold" | "withdraw";

const ALL_TX = [
  { id: "1", title: "Amazon Gift Card",  date: "Apr 28", amount: "+₦200,040", positive: true,  type: "sold",     code: "3289HF-4378" },
  { id: "2", title: "MTN Data Service",  date: "Apr 25", amount: "-₦15,000",  positive: false, type: "withdraw", code: "—"          },
  { id: "3", title: "iTunes Gift Card",  date: "Apr 22", amount: "+₦89,500",  positive: true,  type: "sold",     code: "ITC-8821"   },
  { id: "4", title: "Steam Gift Card",   date: "Apr 20", amount: "+₦45,200",  positive: true,  type: "sold",     code: "STM-4491"   },
  { id: "5", title: "Wallet Withdraw",   date: "Apr 18", amount: "-₦30,000",  positive: false, type: "withdraw", code: "—"          },
  { id: "6", title: "Google Play Card",  date: "Apr 15", amount: "+₦35,000",  positive: true,  type: "sold",     code: "GPL-9934"   },
  { id: "7", title: "Vanilla Visa Card", date: "Apr 12", amount: "+₦152,000", positive: true,  type: "sold",     code: "VVC-7721"   },
];

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all",      label: "All"         },
  { key: "sold",     label: "Sold"        },
  { key: "withdraw", label: "Withdrawals" },
];

function FilterPill({
  label, active, onPress,
}: { label: string; active: boolean; onPress: () => void }) {
  const colors = useColors();
  const scale  = useSharedValue(1);
  const style  = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Animated.View style={style}>
      <Pressable
        style={[
          s.filterBtn,
          { backgroundColor: active ? colors.primary : colors.card, borderColor: colors.border },
        ]}
        onPress={onPress}
        onPressIn={() => { scale.value = withSpring(0.94, { damping: 12, stiffness: 300 }); }}
        onPressOut={() => { scale.value = withSpring(1.0,  { damping: 12, stiffness: 300 }); }}
      >
        <Text style={[s.filterText, { color: active ? colors.primaryForeground : colors.mutedForeground }]}>
          {label}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

export default function TransactionsScreen() {
  const router   = useRouter();
  const colors   = useColors();
  const [filter, setFilter] = useState<Filter>("all");

  const data = ALL_TX.filter((t) => filter === "all" || t.type === filter);

  return (
    <View style={[s.root, { backgroundColor: colors.background }]}>
      <ScreenHeader title="Transaction History" />

      <View style={s.filters}>
        {FILTERS.map((f) => (
          <FilterPill
            key={f.key}
            label={f.label}
            active={filter === f.key}
            onPress={() => setFilter(f.key)}
          />
        ))}
      </View>

      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        contentContainerStyle={s.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <Animated.View entering={FadeInRight.duration(320).springify().delay(index * 40)}>
            <Pressable
              style={[s.row, { borderBottomColor: colors.border }]}
              onPress={() => router.push("/(app)/card-status")}
            >
              <View
                style={[
                  s.txIcon,
                  { backgroundColor: item.positive ? colors.successLight : colors.destructiveDim },
                ]}
              >
                <Feather
                  name={item.positive ? "arrow-down-left" : "arrow-up-right"}
                  size={15}
                  color={item.positive ? colors.success : colors.destructive}
                />
              </View>
              <View style={s.mid}>
                <Text style={[s.title, { color: colors.text }]}>{item.title}</Text>
                <Text style={[s.code,  { color: colors.mutedForeground }]}>{item.code}</Text>
                <Text style={[s.date,  { color: colors.mutedForeground }]}>{item.date}</Text>
              </View>
              <Text style={[s.amount, { color: item.positive ? colors.success : colors.destructive }]}>
                {item.amount}
              </Text>
            </Pressable>
          </Animated.View>
        )}
      />
    </View>
  );
}

const s = StyleSheet.create({
  root:      { flex: 1 },
  filters:   { flexDirection: "row", paddingHorizontal: 16, paddingVertical: 14, gap: 8 },
  filterBtn: { paddingHorizontal: 16, paddingVertical: 9, borderRadius: 20, borderWidth: 1 },
  filterText:{ fontSize: 13, fontFamily: "Manrope_600SemiBold" },
  list:      { paddingHorizontal: 20, paddingBottom: 32 },
  row:       { flexDirection: "row", alignItems: "center", paddingVertical: 14, borderBottomWidth: StyleSheet.hairlineWidth, gap: 12 },
  txIcon:    { width: 44, height: 44, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  mid:       { flex: 1 },
  title:     { fontSize: 14, fontFamily: "Manrope_600SemiBold", marginBottom: 2 },
  code:      { fontSize: 12, fontFamily: "Manrope_400Regular",  marginBottom: 1 },
  date:      { fontSize: 11, fontFamily: "Manrope_400Regular"  },
  amount:    { fontSize: 14, fontFamily: "Manrope_700Bold"     },
});
