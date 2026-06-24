import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
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
import { ScreenHeader } from "@/components/ScreenHeader";

const C = {
  bg:      "#FFFFFF",
  text:    "#0B0A0A",
  textSec: "#595F67",
  textMut: "#AAAFB5",
  border:  "#EDF1F3",
  surface: "#F8F9FA",
  inputBg: "#F7F8F9",
  btn:     "#000000",
  accent:  "#35C2C1",
  success: "#00B03C",
  danger:  "#FF4444",
};

type Asset = {
  id:      string;
  symbol:  string;
  name:    string;
  price:   number;
  change:  number;
  color:   string;
  holding: number;
};

const ASSETS: Asset[] = [
  { id:"btc",  symbol:"BTC",  name:"Bitcoin",      price:43250.00,  change:2.4,  color:"#F7931A", holding:0.0023 },
  { id:"eth",  symbol:"ETH",  name:"Ethereum",     price:2315.50,   change:-1.2, color:"#627EEA", holding:0.15   },
  { id:"usdt", symbol:"USDT", name:"Tether",       price:1.00,      change:0.01, color:"#26A17B", holding:120.00 },
  { id:"usdc", symbol:"USDC", name:"USD Coin",     price:1.00,      change:0.0,  color:"#2775CA", holding:0      },
  { id:"bnb",  symbol:"BNB",  name:"BNB",          price:312.80,    change:1.8,  color:"#F3BA2F", holding:0      },
  { id:"sol",  symbol:"SOL",  name:"Solana",       price:98.40,     change:5.2,  color:"#9945FF", holding:0      },
  { id:"xrp",  symbol:"XRP",  name:"XRP",          price:0.63,      change:-0.8, color:"#006097", holding:0      },
  { id:"doge", symbol:"DOGE", name:"Dogecoin",     price:0.082,     change:3.1,  color:"#C2A633", holding:0      },
  { id:"ltc",  symbol:"LTC",  name:"Litecoin",     price:74.20,     change:-2.3, color:"#BFBBBB", holding:0      },
  { id:"trx",  symbol:"TRX",  name:"TRON",         price:0.112,     change:0.9,  color:"#EF0027", holding:0      },
];

type Mode = "list" | "buy" | "sell" | "confirm" | "success";

const NETWORKS: Record<string,string[]> = {
  usdt: ["ERC20","TRC20","BEP20"],
  usdc: ["ERC20","Polygon"],
  bnb:  ["BEP20"],
  eth:  ["ERC20","Arbitrum","Optimism"],
  sol:  ["Solana"],
  btc:  ["Bitcoin"],
  xrp:  ["XRP Ledger"],
  doge: ["Dogecoin"],
  ltc:  ["Litecoin"],
  trx:  ["TRC20"],
};

function AssetRow({ asset, onPress }: { asset: Asset; onPress: () => void }) {
  const pos = asset.change >= 0;
  return (
    <TouchableOpacity style={ar.wrap} activeOpacity={0.8} onPress={onPress}>
      <View style={[ar.icon, { backgroundColor: asset.color + "20" }]}>
        <Text style={[ar.sym, { color: asset.color }]}>{asset.symbol.charAt(0)}</Text>
      </View>
      <View style={ar.info}>
        <Text style={ar.name}>{asset.name}</Text>
        <Text style={ar.symbol}>{asset.symbol}</Text>
      </View>
      <View style={ar.right}>
        <Text style={ar.price}>${asset.price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
        <View style={[ar.badge, { backgroundColor: (pos ? C.success : C.danger) + "15" }]}>
          <Feather name={pos ? "trending-up" : "trending-down"} size={10} color={pos ? C.success : C.danger} />
          <Text style={[ar.change, { color: pos ? C.success : C.danger }]}>
            {pos ? "+" : ""}{asset.change}%
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const ar = StyleSheet.create({
  wrap:   { flexDirection:"row", alignItems:"center", gap:12, paddingVertical:14, borderBottomWidth:1, borderBottomColor:"#EDF1F3" },
  icon:   { width:44, height:44, borderRadius:22, alignItems:"center", justifyContent:"center" },
  sym:    { fontSize:18, fontFamily:"Manrope_700Bold" },
  info:   { flex:1 },
  name:   { fontSize:14, fontFamily:"Manrope_600SemiBold", color:"#0B0A0A" },
  symbol: { fontSize:12, fontFamily:"Manrope_400Regular", color:"#AAAFB5", marginTop:2 },
  right:  { alignItems:"flex-end", gap:4 },
  price:  { fontSize:14, fontFamily:"Manrope_700Bold", color:"#0B0A0A" },
  badge:  { flexDirection:"row", alignItems:"center", gap:3, paddingHorizontal:6, paddingVertical:2, borderRadius:8 },
  change: { fontSize:10, fontFamily:"Manrope_600SemiBold" },
});

export default function CryptoScreen() {
  const router = useRouter();
  const [mode,     setMode]     = useState<Mode>("list");
  const [asset,    setAsset]    = useState<Asset | null>(null);
  const [tab,      setTab]      = useState<"buy"|"sell">("buy");
  const [amount,   setAmount]   = useState("");
  const [network,  setNetwork]  = useState("");
  const [address,  setAddress]  = useState("");
  const [loading,  setLoading]  = useState(false);
  const [searchQ,  setSearchQ]  = useState("");

  const nets = asset ? (NETWORKS[asset.id] ?? ["Default"]) : [];
  const filtered = ASSETS.filter(a =>
    a.name.toLowerCase().includes(searchQ.toLowerCase()) ||
    a.symbol.toLowerCase().includes(searchQ.toLowerCase())
  );

  const totalBalance = ASSETS.reduce((sum, a) => sum + a.holding * a.price, 0);

  const handleConfirm = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1600));
    setLoading(false);
    setMode("success");
  };

  const reset = () => {
    setMode("list");
    setAsset(null);
    setAmount("");
    setNetwork("");
    setAddress("");
  };

  if (mode === "success") {
    return (
      <View style={s.root}>
        <ScreenHeader title={tab === "buy" ? "Purchase Successful" : "Sale Successful"} showBack={false} />
        <View style={s.successWrap}>
          <Animated.View entering={FadeInDown.duration(400).springify()} style={[s.successCircle, { backgroundColor: asset?.color ?? C.success }]}>
            <Feather name="check" size={38} color="#fff" />
          </Animated.View>
          <Animated.Text entering={FadeInUp.duration(320).delay(80)} style={s.successTitle}>
            {tab === "buy" ? "Purchase Complete!" : "Sale Complete!"}
          </Animated.Text>
          <Animated.Text entering={FadeInUp.duration(320).delay(120)} style={s.successSub}>
            {amount} worth of {asset?.name} has been {tab === "buy" ? "added to" : "removed from"} your wallet
          </Animated.Text>
          <Animated.View entering={FadeInUp.duration(300).delay(160)} style={s.receiptCard}>
            {[
              { label:"Asset",      value: `${asset?.name} (${asset?.symbol})` },
              { label:"Action",     value: tab === "buy" ? "Buy" : "Sell" },
              { label:"Amount",     value: amount },
              { label:"Rate",       value: `$${asset?.price.toLocaleString()}` },
              { label:"Network",    value: network },
              { label:"Reference",  value: `CR-${Math.floor(Math.random()*9000000)+1000000}` },
              { label:"Status",     value: "Completed" },
            ].map(r => (
              <View key={r.label} style={s.receiptRow}>
                <Text style={s.receiptLabel}>{r.label}</Text>
                <Text style={[s.receiptValue, r.label === "Status" && { color: C.success }]}>{r.value}</Text>
              </View>
            ))}
          </Animated.View>
          <TouchableOpacity style={s.btn} onPress={reset}>
            <Text style={s.btnText}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (mode === "confirm") {
    return (
      <View style={s.root}>
        <ScreenHeader title="Confirm Trade" />
        <ScrollView contentContainerStyle={s.scroll}>
          <Animated.View entering={FadeInDown.duration(300)} style={{ gap: 20 }}>
            <View style={[s.assetHeader, { backgroundColor: (asset?.color ?? "#000") + "12" }]}>
              <View style={[ar.icon, { backgroundColor: (asset?.color ?? "#000") + "25" }]}>
                <Text style={[ar.sym, { color: asset?.color }]}>{asset?.symbol.charAt(0)}</Text>
              </View>
              <View>
                <Text style={s.confName}>{asset?.name}</Text>
                <Text style={s.confSym}>{tab === "buy" ? "Buy" : "Sell"} · {network}</Text>
              </View>
            </View>
            <View style={s.receiptCard}>
              {[
                { label:"Action",     value: tab === "buy" ? "Purchase" : "Sale" },
                { label:"Asset",      value: asset?.symbol ?? "" },
                { label:"Amount (₦)", value: amount },
                { label:"Rate",       value: `$${asset?.price.toLocaleString()}` },
                { label:"Network",    value: network },
                { label:"Fee",        value: "₦150" },
              ].map(r => (
                <View key={r.label} style={s.receiptRow}>
                  <Text style={s.receiptLabel}>{r.label}</Text>
                  <Text style={s.receiptValue}>{r.value}</Text>
                </View>
              ))}
            </View>
            <TouchableOpacity style={[s.btn, loading && s.btnDisabled]} disabled={loading} onPress={handleConfirm}>
              <Text style={s.btnText}>{loading ? "Processing…" : `Confirm ${tab === "buy" ? "Purchase" : "Sale"}`}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.secondaryBtn} onPress={() => setMode(tab)}>
              <Text style={s.secondaryText}>Go Back</Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </View>
    );
  }

  if (mode === "buy" || mode === "sell") {
    return (
      <KeyboardAvoidingView style={s.root} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScreenHeader title={`${mode === "buy" ? "Buy" : "Sell"} ${asset?.symbol}`} />
        <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
          <Animated.View entering={FadeInDown.duration(300)} style={{ gap: 20 }}>

            <View style={[s.assetHeader, { backgroundColor: (asset?.color ?? "#000") + "12" }]}>
              <View style={[ar.icon, { backgroundColor: (asset?.color ?? "#000") + "25" }]}>
                <Text style={[ar.sym, { color: asset?.color }]}>{asset?.symbol.charAt(0)}</Text>
              </View>
              <View>
                <Text style={s.confName}>{asset?.name}</Text>
                <Text style={s.confSym}>Current Rate: ${asset?.price.toLocaleString()}</Text>
              </View>
            </View>

            {/* Network */}
            <View style={s.field}>
              <Text style={s.fieldLabel}>Select Network</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingBottom: 4 }}>
                {nets.map(n => (
                  <TouchableOpacity
                    key={n}
                    style={[s.netChip, network === n && s.netChipActive]}
                    onPress={() => { Haptics.selectionAsync(); setNetwork(n); }}
                  >
                    <Text style={[s.netChipText, network === n && s.netChipTextActive]}>{n}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Amount in Naira */}
            <View style={s.field}>
              <Text style={s.fieldLabel}>Amount (₦)</Text>
              <TextInput
                style={s.input}
                placeholder="₦0.00"
                placeholderTextColor={C.textMut}
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
              />
              {amount ? (
                <Text style={s.hint}>
                  ≈ {(parseFloat(amount.replace(/[^0-9.]/g, "")) / (asset?.price ?? 1) / 1600).toFixed(8)} {asset?.symbol}
                </Text>
              ) : null}
            </View>

            {/* Wallet address for buy */}
            {mode === "buy" && (
              <View style={s.field}>
                <Text style={s.fieldLabel}>Wallet Address (optional)</Text>
                <TextInput
                  style={s.input}
                  placeholder="Receive to your AZA wallet if empty"
                  placeholderTextColor={C.textMut}
                  value={address}
                  onChangeText={setAddress}
                  autoCapitalize="none"
                />
              </View>
            )}

            <TouchableOpacity
              style={[s.btn, (!network || !amount) && s.btnDisabled]}
              disabled={!network || !amount}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                setMode("confirm");
              }}
            >
              <Text style={s.btnText}>Continue</Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  // LIST view
  return (
    <View style={s.root}>
      <ScreenHeader title="Crypto" />
      <ScrollView contentContainerStyle={[s.scroll, { paddingBottom: 100 }]} showsVerticalScrollIndicator={false}>

        {/* Portfolio summary */}
        <Animated.View entering={FadeInDown.duration(320)} style={s.portfolioCard}>
          <Text style={s.portLabel}>Portfolio Value</Text>
          <Text style={s.portAmount}>${totalBalance.toFixed(2)}</Text>
          <Text style={s.portSub}>≈ ₦{(totalBalance * 1600).toLocaleString("en-NG", { maximumFractionDigits: 0 })}</Text>
        </Animated.View>

        {/* Buy / Sell toggle */}
        <Animated.View entering={FadeInDown.duration(300).delay(40)} style={s.actionRow}>
          {(["buy","sell"] as const).map((t) => (
            <TouchableOpacity
              key={t}
              style={[s.actionBtn, tab === t && s.actionBtnActive]}
              onPress={() => { Haptics.selectionAsync(); setTab(t); }}
            >
              <Feather name={t === "buy" ? "arrow-down-left" : "arrow-up-right"} size={16} color={tab === t ? "#fff" : C.textSec} />
              <Text style={[s.actionBtnText, tab === t && s.actionBtnTextActive]}>{t === "buy" ? "Buy" : "Sell"}</Text>
            </TouchableOpacity>
          ))}
        </Animated.View>

        {/* Search */}
        <Animated.View entering={FadeInDown.duration(300).delay(60)} style={s.searchWrap}>
          <Feather name="search" size={16} color={C.textMut} />
          <TextInput
            style={s.searchInput}
            placeholder="Search crypto"
            placeholderTextColor={C.textMut}
            value={searchQ}
            onChangeText={setSearchQ}
          />
        </Animated.View>

        {/* Asset list */}
        {filtered.map((a, i) => (
          <Animated.View key={a.id} entering={FadeInDown.duration(260).delay(80 + i * 20)}>
            <AssetRow
              asset={a}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setAsset(a);
                setNetwork(NETWORKS[a.id]?.[0] ?? "Default");
                setAmount("");
                setMode(tab);
              }}
            />
          </Animated.View>
        ))}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root:   { flex: 1, backgroundColor: C.bg },
  scroll: { padding: 20, flexGrow: 1 },

  portfolioCard: {
    backgroundColor: C.text, borderRadius: 20, padding: 24, gap: 4, marginBottom: 16,
    shadowColor: "#000", shadowOffset: { width:0, height:4 }, shadowOpacity:0.2, shadowRadius:12, elevation:6,
  },
  portLabel:  { fontSize:13, fontFamily:"Manrope_400Regular", color:"rgba(255,255,255,0.6)" },
  portAmount: { fontSize:30, fontFamily:"Manrope_700Bold", color:"#FFFFFF", letterSpacing:-1 },
  portSub:    { fontSize:13, fontFamily:"Manrope_400Regular", color:"rgba(255,255,255,0.45)" },

  actionRow:        { flexDirection:"row", gap:10, marginBottom:16 },
  actionBtn:        { flex:1, flexDirection:"row", alignItems:"center", justifyContent:"center", gap:8, paddingVertical:12, borderRadius:12, borderWidth:1, borderColor:C.border, backgroundColor:C.surface },
  actionBtnActive:  { backgroundColor:C.btn, borderColor:C.btn },
  actionBtnText:     { fontSize:14, fontFamily:"Manrope_600SemiBold", color:C.textSec, textTransform:"capitalize" },
  actionBtnTextActive:{ color:"#fff" },

  searchWrap: {
    flexDirection:"row", alignItems:"center", gap:10,
    backgroundColor:C.inputBg, borderRadius:12, paddingHorizontal:14, paddingVertical:12,
    borderWidth:1, borderColor:C.border, marginBottom:8,
  },
  searchInput: { flex:1, fontSize:14, fontFamily:"Manrope_400Regular", color:C.text },

  assetHeader: { flexDirection:"row", alignItems:"center", gap:12, borderRadius:14, padding:14 },
  confName: { fontSize:16, fontFamily:"Manrope_700Bold", color:C.text },
  confSym:  { fontSize:12, fontFamily:"Manrope_400Regular", color:C.textSec, marginTop:2 },

  field:      { gap: 8 },
  fieldLabel: { fontSize:13, fontFamily:"Manrope_500Medium", color:C.textSec },

  netChip:         { paddingHorizontal:14, paddingVertical:8, borderRadius:20, borderWidth:1, borderColor:C.border, backgroundColor:C.surface },
  netChipActive:   { backgroundColor:C.btn, borderColor:C.btn },
  netChipText:     { fontSize:12, fontFamily:"Manrope_500Medium", color:C.textSec },
  netChipTextActive:{ color:"#fff" },

  input: {
    backgroundColor:C.inputBg, borderWidth:1, borderColor:C.border,
    borderRadius:12, paddingHorizontal:16, paddingVertical:14,
    fontSize:15, fontFamily:"Manrope_500Medium", color:C.text,
  },
  hint: { fontSize:12, fontFamily:"Manrope_400Regular", color:C.textMut },

  btn:         { height:56, backgroundColor:C.btn, borderRadius:14, alignItems:"center", justifyContent:"center" },
  btnDisabled: { opacity:0.5 },
  btnText:     { fontSize:16, fontFamily:"Manrope_700Bold", color:"#fff" },

  secondaryBtn:  { height:48, alignItems:"center", justifyContent:"center" },
  secondaryText: { fontSize:14, fontFamily:"Manrope_600SemiBold", color:C.textSec },

  receiptCard:  { backgroundColor:C.surface, borderRadius:16, padding:18, borderWidth:1, borderColor:C.border, gap:14 },
  receiptRow:   { flexDirection:"row", justifyContent:"space-between", alignItems:"center" },
  receiptLabel: { fontSize:13, fontFamily:"Manrope_400Regular", color:C.textSec },
  receiptValue: { fontSize:13, fontFamily:"Manrope_600SemiBold", color:C.text },

  successWrap:   { flex:1, alignItems:"center", justifyContent:"center", padding:24, gap:12 },
  successCircle: { width:80, height:80, borderRadius:40, alignItems:"center", justifyContent:"center", marginBottom:8 },
  successTitle:  { fontSize:22, fontFamily:"Manrope_700Bold", color:C.text },
  successSub:    { fontSize:14, fontFamily:"Manrope_400Regular", color:C.textSec, textAlign:"center", lineHeight:22 },
});
