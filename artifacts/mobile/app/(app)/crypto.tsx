import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { AnimatedSheet } from "@/components/AnimatedSheet";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const C = {
  bg:        "#FFFFFF",
  text:      "#0B0A0A",
  navy:      "#061941",
  textSec:   "#595F67",
  textMuted: "#6C7278",
  inputBg:   "#F0F0F0",
  border:    "#EDF1F3",
  success:   "#00B03C",
  dark:      "#010101",
  black:     "#000000",
};

const COINS = [
  { id: "btc",  name: "Bitcoin",  symbol: "BTC",  rate: 85200000, bg: "#FFF7ED", color: "#F7931A" },
  { id: "eth",  name: "Ethereum", symbol: "ETH",  rate: 5100000,  bg: "#EFF6FF", color: "#627EEA" },
  { id: "usdt", name: "Tether",   symbol: "USDT", rate: 1620,     bg: "#F0FFF9", color: "#26A17B" },
  { id: "bnb",  name: "BNB",      symbol: "BNB",  rate: 560000,   bg: "#FFFBEB", color: "#F3BA2F" },
  { id: "sol",  name: "Solana",   symbol: "SOL",  rate: 128000,   bg: "#F5F3FF", color: "#9945FF" },
  { id: "xrp",  name: "XRP",      symbol: "XRP",  rate: 920,      bg: "#F0F9FF", color: "#346AA9" },
];

const NETWORKS = ["ERC-20", "BEP-20", "TRC-20", "Solana", "Bitcoin"];

function FieldLabel({ text }: { text: string }) {
  return <Text style={f.label}>{text}</Text>;
}

const f = StyleSheet.create({
  label: { fontSize: 12, fontFamily: "Manrope_500Medium", color: C.textMuted, textTransform: "capitalize", letterSpacing: 0.24 },
  input: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    backgroundColor: C.inputBg, borderWidth: 1, borderColor: C.border,
    borderRadius: 10, paddingHorizontal: 14, height: 46,
  },
  val: { fontSize: 13, fontFamily: "Manrope_500Medium", color: C.text, flex: 1 },
  ph:  { color: "#646464", fontSize: 10 },
});

function PickerModal({
  visible, title, onClose, children,
}: { visible: boolean; title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <AnimatedSheet visible={visible} onClose={onClose} maxHeight="65%">
      <Text style={pm.title}>{title}</Text>
      <ScrollView showsVerticalScrollIndicator={false}>{children}</ScrollView>
    </AnimatedSheet>
  );
}

const pm = StyleSheet.create({
  title:  { fontSize: 16, fontFamily: "Manrope_700Bold", color: C.text, marginBottom: 12 },
});

export default function CryptoScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 20 : insets.top;

  const [selectedCoin, setSelectedCoin] = useState(COINS[0]);
  const [network,      setNetwork]      = useState("");
  const [address,      setAddress]      = useState("");
  const [amount,       setAmount]       = useState("");
  const [picker, setPicker] = useState<"coin" | "network" | null>(null);

  const nairaValue = amount ? (parseFloat(amount) * selectedCoin.rate) : 0;

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: C.bg }} behavior={Platform.OS === "ios" ? "padding" : undefined}>

      {/* Header */}
      <Animated.View entering={FadeInDown.duration(280).springify()} style={[s.header, { paddingTop: topPad + 10 }]}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
          <Feather name="arrow-left" size={22} color="#1E232C" />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Sell Crypto</Text>
        <View style={{ width: 44 }} />
      </Animated.View>
      <View style={s.divider} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[s.scroll, { paddingBottom: insets.bottom + 40 }]}
      >

        <Animated.View entering={FadeInDown.duration(300).springify().delay(30)}>
          <Text style={s.subtitle}>Select a cryptocurrency and enter trade details.</Text>
        </Animated.View>

        {/* Coin selector */}
        <Animated.View entering={FadeInDown.duration(300).springify().delay(60)}>
          <View style={{ gap: 4 }}>
            <FieldLabel text="select coin" />
            <TouchableOpacity style={f.input} onPress={() => setPicker("coin")} activeOpacity={0.8}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 10, flex: 1 }}>
                <View style={[s.coinDot, { backgroundColor: selectedCoin.bg }]}>
                  <Text style={{ fontSize: 12, fontFamily: "Manrope_700Bold", color: selectedCoin.color }}>{selectedCoin.symbol.slice(0,2)}</Text>
                </View>
                <Text style={f.val}>{selectedCoin.name} ({selectedCoin.symbol})</Text>
              </View>
              <Feather name="chevron-down" size={16} color={C.textMuted} />
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Network */}
        <Animated.View entering={FadeInDown.duration(300).springify().delay(90)}>
          <View style={{ gap: 4 }}>
            <FieldLabel text="network" />
            <TouchableOpacity style={f.input} onPress={() => setPicker("network")} activeOpacity={0.8}>
              <Text style={[f.val, !network && f.ph]}>{network || "   Select network"}</Text>
              <Feather name="chevron-down" size={16} color={C.textMuted} />
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Wallet address */}
        <Animated.View entering={FadeInDown.duration(300).springify().delay(120)}>
          <View style={{ gap: 4 }}>
            <FieldLabel text="wallet address" />
            <View style={f.input}>
              <TextInput
                style={[f.val]}
                placeholder="   Enter wallet address"
                placeholderTextColor="#646464"
                value={address}
                onChangeText={setAddress}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          </View>
        </Animated.View>

        {/* Amount */}
        <Animated.View entering={FadeInDown.duration(300).springify().delay(150)}>
          <View style={{ gap: 4 }}>
            <FieldLabel text="amount" />
            <View style={f.input}>
              <TextInput
                style={[f.val]}
                placeholder="   0.00"
                placeholderTextColor="#646464"
                value={amount}
                onChangeText={t => setAmount(t.replace(/[^0-9.]/g, ""))}
                keyboardType="decimal-pad"
              />
              <Text style={{ fontSize: 12, fontFamily: "Manrope_700Bold", color: C.textMuted }}>{selectedCoin.symbol}</Text>
            </View>
          </View>
        </Animated.View>

        {/* Rate preview */}
        <Animated.View entering={FadeInUp.duration(300).springify().delay(180)} style={s.rateBox}>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={s.rateLabel}>Current Rate</Text>
            <Text style={s.rateValue}>₦{selectedCoin.rate.toLocaleString("en-NG")}/{selectedCoin.symbol}</Text>
          </View>
        </Animated.View>

        {/* Summary */}
        <Animated.View entering={FadeInUp.duration(300).springify().delay(200)} style={s.summaryBox}>
          <View style={s.summaryRow}>
            <Text style={s.summaryLabel}>Rate</Text>
            <Text style={s.summaryValue}>₦{selectedCoin.rate.toLocaleString("en-NG")}</Text>
          </View>
          <View style={s.summaryLine} />
          <View style={s.summaryRow}>
            <Text style={s.summaryLabel}>Total:</Text>
            <Text style={[s.summaryValue, { fontSize: 14, fontFamily: "Manrope_700Bold" }]}>
              ₦{nairaValue.toLocaleString("en-NG")}
            </Text>
          </View>
        </Animated.View>

        {/* Proceed */}
        <Animated.View entering={FadeInUp.duration(300).springify().delay(230)}>
          <TouchableOpacity
            style={s.proceedBtn}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push("/(app)/confirm-transaction" as any);
            }}
            activeOpacity={0.85}
          >
            <Text style={s.proceedBtnText}>Proceed</Text>
          </TouchableOpacity>
        </Animated.View>

      </ScrollView>

      {/* Coin picker */}
      <PickerModal visible={picker === "coin"} title="Select Cryptocurrency" onClose={() => setPicker(null)}>
        {COINS.map(coin => (
          <TouchableOpacity
            key={coin.id}
            style={[pm2.option, selectedCoin.id === coin.id && { backgroundColor: "#F8F9FA" }]}
            onPress={() => { Haptics.selectionAsync(); setSelectedCoin(coin); setPicker(null); }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
              <View style={[s.coinDot, { backgroundColor: coin.bg, width: 36, height: 36, borderRadius: 18 }]}>
                <Text style={{ fontSize: 11, fontFamily: "Manrope_700Bold", color: coin.color }}>{coin.symbol.slice(0,2)}</Text>
              </View>
              <View>
                <Text style={pm2.optName}>{coin.name}</Text>
                <Text style={pm2.optSymbol}>{coin.symbol}</Text>
              </View>
            </View>
            {selectedCoin.id === coin.id && <Feather name="check" size={16} color="#7C3AED" />}
          </TouchableOpacity>
        ))}
      </PickerModal>

      {/* Network picker */}
      <PickerModal visible={picker === "network"} title="Select Network" onClose={() => setPicker(null)}>
        {NETWORKS.map(n => (
          <TouchableOpacity key={n} style={pm2.option} onPress={() => { Haptics.selectionAsync(); setNetwork(n); setPicker(null); }}>
            <Text style={pm2.optName}>{n}</Text>
            {network === n && <Feather name="check" size={16} color="#7C3AED" />}
          </TouchableOpacity>
        ))}
      </PickerModal>
    </KeyboardAvoidingView>
  );
}

const pm2 = StyleSheet.create({
  option: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: C.border },
  optName:   { fontSize: 15, fontFamily: "Manrope_600SemiBold", color: C.text },
  optSymbol: { fontSize: 12, fontFamily: "Manrope_400Regular", color: C.textMuted },
});

const s = StyleSheet.create({
  header:      { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingBottom: 14, backgroundColor: C.bg },
  backBtn:     { width: 44, height: 44, alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: 13, fontFamily: "Manrope_700Bold", color: C.text, textTransform: "capitalize" },
  divider:     { height: 1, backgroundColor: "#D1D1D1" },
  scroll:      { paddingHorizontal: 20, paddingTop: 20, gap: 18 },
  subtitle:    { fontSize: 12, fontFamily: "Manrope_500Medium", color: C.textMuted, letterSpacing: 0.24 },
  coinDot:     { width: 30, height: 30, borderRadius: 15, alignItems: "center", justifyContent: "center" },

  rateBox: {
    backgroundColor: "#F8F9FA", borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12,
    borderWidth: 1, borderColor: C.border,
  },
  rateLabel: { fontSize: 12, fontFamily: "Manrope_500Medium", color: C.textSec },
  rateValue: { fontSize: 12, fontFamily: "Manrope_700Bold", color: C.text },

  summaryBox:   { backgroundColor: C.dark, borderRadius: 10, paddingHorizontal: 18, paddingVertical: 2 },
  summaryRow:   { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 14 },
  summaryLine:  { height: 1, backgroundColor: "#E9E9E9" },
  summaryLabel: { fontSize: 10, fontFamily: "Manrope_500Medium", color: "#FFFFFF", letterSpacing: -0.1 },
  summaryValue: { fontSize: 10, fontFamily: "Manrope_700Bold", color: "#FFFFFF" },

  proceedBtn:     { backgroundColor: C.black, height: 48, borderRadius: 10, alignItems: "center", justifyContent: "center", elevation: 4 },
  proceedBtnText: { fontSize: 14, fontFamily: "Manrope_700Bold", color: "#FFFFFF", letterSpacing: -0.14 },
});
