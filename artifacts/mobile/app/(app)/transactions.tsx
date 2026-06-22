import {
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const C = {
  bg:        "#FFFFFF",
  text:      "#151521",
  subtext:   "rgba(26,29,37,0.5)",
  border:    "rgba(21,21,33,0.2)",
  amount:    "#000000",
};

type TxType = "transferred" | "refund" | "transaction";
type IconKind = "visa" | "bank" | "paypal" | "receipt" | "stripe" | "cash";

interface Tx {
  id:     string;
  type:   TxType;
  date:   string;
  amount: string;
  icon:   IconKind;
}

const TRANSACTIONS: Tx[] = [
  { id: "1", type: "transferred", date: "Aug 19, 2023", amount: "$123.00",  icon: "visa"    },
  { id: "2", type: "transferred", date: "Jul 20, 2023",  amount: "$12.00",  icon: "bank"    },
  { id: "3", type: "refund",      date: "May 08, 2023",  amount: "$234.00", icon: "paypal"  },
  { id: "4", type: "refund",      date: "Feb 29, 2023",  amount: "$15.00",  icon: "receipt" },
  { id: "5", type: "transaction", date: "Jan 25, 2023",  amount: "-$92.00", icon: "stripe"  },
  { id: "6", type: "transaction", date: "Jan 16, 2023",  amount: "-$20.00", icon: "cash"    },
];

const TYPE_LABEL: Record<TxType, string> = {
  transferred: "Transferred",
  refund:      "Refund",
  transaction: "Transaction",
};

function TxIcon({ kind }: { kind: IconKind }) {
  if (kind === "visa") {
    return (
      <View style={[ico.circle, { backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "rgba(0,0,0,0.1)" }]}>
        <FontAwesome5 name="cc-visa" size={20} color="#263B80" />
      </View>
    );
  }
  if (kind === "bank") {
    return (
      <View style={[ico.circle, { backgroundColor: "#118EEB" }]}>
        <MaterialCommunityIcons name="bank-transfer" size={22} color="#FFFFFF" />
      </View>
    );
  }
  if (kind === "paypal") {
    return (
      <View style={[ico.circle, { backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "rgba(0,0,0,0.1)" }]}>
        <FontAwesome5 name="paypal" size={18} color="#003087" />
      </View>
    );
  }
  if (kind === "receipt") {
    return (
      <View style={[ico.circle, { backgroundColor: "#FE5722" }]}>
        <Ionicons name="receipt-outline" size={18} color="#FFFFFF" />
      </View>
    );
  }
  if (kind === "stripe") {
    return (
      <View style={[ico.circle, { backgroundColor: "#000000" }]}>
        <FontAwesome5 name="stripe-s" size={18} color="#FFFFFF" />
      </View>
    );
  }
  return (
    <View style={[ico.circle, { backgroundColor: "#00DA5A" }]}>
      <MaterialCommunityIcons name="cash" size={20} color="#FFFFFF" />
    </View>
  );
}

const ico = StyleSheet.create({
  circle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});

type Filter = "all" | TxType;

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all",         label: "All"         },
  { key: "transferred", label: "Transferred" },
  { key: "refund",      label: "Refund"      },
  { key: "transaction", label: "Transaction" },
];

function FilterPill({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  const sc = useSharedValue(1);
  const style = useAnimatedStyle(() => ({ transform: [{ scale: sc.value }] }));
  return (
    <Animated.View style={style}>
      <Pressable
        style={[fp.btn, active ? fp.active : fp.inactive]}
        onPress={() => { Haptics.selectionAsync(); onPress(); }}
        onPressIn={() => { sc.value = withSpring(0.93, { damping: 12, stiffness: 300 }); }}
        onPressOut={() => { sc.value = withSpring(1.0, { damping: 12, stiffness: 300 }); }}
      >
        <Text style={[fp.label, { color: active ? "#FFFFFF" : "rgba(21,21,33,0.5)" }]}>
          {label}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

const fp = StyleSheet.create({
  btn:     { paddingHorizontal: 16, paddingVertical: 9, borderRadius: 20 },
  active:  { backgroundColor: "#151521" },
  inactive:{ backgroundColor: "#F5F5F5" },
  label:   { fontSize: 13, fontFamily: "Manrope_500Medium" },
});

function TxRow({ item, index }: { item: Tx; index: number }) {
  const sc = useSharedValue(1);
  const pressStyle = useAnimatedStyle(() => ({ transform: [{ scale: sc.value }] }));
  return (
    <Animated.View entering={FadeInDown.duration(300).delay(index * 60).springify()}>
      <Animated.View style={pressStyle}>
        <Pressable
          style={s.card}
          onPress={() => Haptics.selectionAsync()}
          onPressIn={() => { sc.value = withSpring(0.97, { damping: 14, stiffness: 300 }); }}
          onPressOut={() => { sc.value = withSpring(1.0, { damping: 14, stiffness: 300 }); }}
        >
          <View style={s.cardLeft}>
            <TxIcon kind={item.icon} />
            <View style={s.infoBlock}>
              <Text style={s.typeLabel}>{TYPE_LABEL[item.type]}</Text>
              <Text style={s.dateText}>{item.date}</Text>
            </View>
          </View>
          <Text style={s.amount}>{item.amount}</Text>
        </Pressable>
      </Animated.View>
    </Animated.View>
  );
}

export default function TransactionsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [filter, setFilter] = useState<Filter>("all");
  const data = TRANSACTIONS.filter((t) => filter === "all" || t.type === filter);
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  return (
    <View style={[s.root, { paddingTop: topPad }]}>
      <View style={s.header}>
        <Pressable style={s.backBtn} onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.back(); }}>
          <Ionicons name="chevron-back" size={20} color={C.text} />
        </Pressable>
        <Text style={s.headerTitle}>Transactions</Text>
        <View style={{ width: 36 }} />
      </View>

      <View style={s.filterRow}>
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
        contentContainerStyle={[s.list, { paddingBottom: insets.bottom + 32 }]}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => <TxRow item={item} index={index} />}
      />
    </View>
  );
}

const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: C.bg,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(21,21,33,0.12)",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: "Manrope_700Bold",
    color: C.text,
  },
  filterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 20,
  },
  list: {
    paddingHorizontal: 20,
    gap: 12,
  },
  card: {
    height: 70,
    borderRadius: 32,
    borderWidth: 0.5,
    borderColor: C.border,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  cardLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  infoBlock: {
    gap: 4,
  },
  typeLabel: {
    fontSize: 12,
    fontFamily: "Manrope_400Regular",
    color: C.subtext,
  },
  dateText: {
    fontSize: 15,
    fontFamily: "Manrope_500Medium",
    color: C.text,
  },
  amount: {
    fontSize: 15,
    fontFamily: "Manrope_500Medium",
    color: C.amount,
    textAlign: "right",
  },
});
