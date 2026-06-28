import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ScreenHeader } from "@/components/ScreenHeader";
import { useColors } from "@/hooks/useColors";

type Filter = "all" | "sold" | "withdraw";

const ALL_TRANSACTIONS = [
  { id: "1", title: "Amazon Gift Card", sub: "April 28, 2024", amount: "+₦200,040", positive: true, type: "sold", code: "3289HF-4378" },
  { id: "2", title: "MTN Data Service", sub: "April 25, 2024", amount: "-₦15,000", positive: false, type: "withdraw", code: "—" },
  { id: "3", title: "iTunes Gift Card", sub: "April 22, 2024", amount: "+₦89,500", positive: true, type: "sold", code: "ITC-8821" },
  { id: "4", title: "Steam Gift Card", sub: "April 20, 2024", amount: "+₦45,200", positive: true, type: "sold", code: "STM-4491" },
  { id: "5", title: "Wallet Withdraw", sub: "April 18, 2024", amount: "-₦30,000", positive: false, type: "withdraw", code: "—" },
  { id: "6", title: "Google Play Card", sub: "April 15, 2024", amount: "+₦35,000", positive: true, type: "sold", code: "GPL-9934" },
  { id: "7", title: "Vanilla Visa Card", sub: "April 12, 2024", amount: "+₦152,000", positive: true, type: "sold", code: "VVC-7721" },
];

export default function TransactionsScreen() {
  const router = useRouter();
  const colors = useColors();
  const [filter, setFilter] = useState<Filter>("all");

  const filtered = ALL_TRANSACTIONS.filter((t) =>
    filter === "all" ? true : t.type === filter
  );

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <ScreenHeader title="Transaction History" />

      <View style={styles.filters}>
        {(["all", "sold", "withdraw"] as Filter[]).map((f) => (
          <TouchableOpacity
            key={f}
            style={[
              styles.filterBtn,
              {
                backgroundColor: filter === f ? colors.primary : colors.card,
                borderColor: colors.border,
              },
            ]}
            onPress={() => setFilter(f)}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.filterText,
                { color: filter === f ? "#fff" : colors.mutedForeground },
              ]}
            >
              {f === "all" ? "All" : f === "sold" ? "Sold" : "Withdrawals"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => (
          <View style={[styles.separator, { backgroundColor: colors.border }]} />
        )}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.row}
            onPress={() => router.push("/(app)/card-status")}
            activeOpacity={0.8}
          >
            <View
              style={[
                styles.icon,
                { backgroundColor: item.positive ? colors.successLight : "#fff5f5" },
              ]}
            >
              <Feather
                name={item.positive ? "arrow-down-left" : "arrow-up-right"}
                size={16}
                color={item.positive ? colors.success : colors.destructive}
              />
            </View>
            <View style={styles.mid}>
              <Text style={[styles.title, { color: colors.text }]}>{item.title}</Text>
              <Text style={[styles.code, { color: colors.mutedForeground }]}>{item.code}</Text>
              <Text style={[styles.date, { color: colors.mutedForeground }]}>{item.sub}</Text>
            </View>
            <Text
              style={[
                styles.amount,
                { color: item.positive ? colors.success : colors.destructive },
              ]}
            >
              {item.amount}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  filters: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  filterBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterText: { fontSize: 13, fontFamily: "Manrope_600SemiBold" },
  list: { paddingHorizontal: 20, paddingTop: 4, paddingBottom: 32 },
  separator: { height: StyleSheet.hairlineWidth, marginLeft: 68 },
  row: { flexDirection: "row", alignItems: "center", paddingVertical: 14, gap: 12 },
  icon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  mid: { flex: 1 },
  title: { fontSize: 14, fontFamily: "Manrope_600SemiBold", marginBottom: 2 },
  code: { fontSize: 12, fontFamily: "Manrope_400Regular", marginBottom: 1 },
  date: { fontSize: 11, fontFamily: "Manrope_400Regular" },
  amount: { fontSize: 14, fontFamily: "Manrope_700Bold" },
});
