import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import {
  FlatList,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { ScreenHeader } from "@/components/ScreenHeader";

const C = {
  bg:      "#FFFFFF",
  text:    "#0B0A0A",
  textSec: "#595F67",
  textMut: "#AAAFB5",
  border:  "#EDF1F3",
  surface: "#F8F9FA",
  accent:  "#35C2C1",
  success: "#00B03C",
  warn:    "#F59E0B",
};

type RateCategory = "Gift Cards" | "Crypto" | "FX";

type GiftRate = { id:string; brand:string; country:string; rate:string; trend:"up"|"down"|"flat"; updated:string };
type CryptoRate = { id:string; symbol:string; name:string; buyRate:string; sellRate:string; change:string; pos:boolean };
type FXRate = { id:string; pair:string; buy:string; sell:string };

const GIFT_RATES: GiftRate[] = [
  { id:"1", brand:"Amazon",      country:"USA",       rate:"₦1,580/$",  trend:"up",   updated:"5 min ago" },
  { id:"2", brand:"Amazon",      country:"UK",        rate:"₦1,720/£",  trend:"up",   updated:"5 min ago" },
  { id:"3", brand:"Amazon",      country:"Australia", rate:"₦980/A$",   trend:"flat", updated:"12 min ago" },
  { id:"4", brand:"iTunes",      country:"USA",       rate:"₦1,500/$",  trend:"down", updated:"8 min ago" },
  { id:"5", brand:"iTunes",      country:"UK",        rate:"₦1,680/£",  trend:"up",   updated:"8 min ago" },
  { id:"6", brand:"Google Play", country:"USA",       rate:"₦1,350/$",  trend:"flat", updated:"15 min ago" },
  { id:"7", brand:"Steam",       country:"USA",       rate:"₦1,200/$",  trend:"up",   updated:"10 min ago" },
  { id:"8", brand:"PlayStation", country:"USA",       rate:"₦1,450/$",  trend:"down", updated:"20 min ago" },
  { id:"9", brand:"Xbox",        country:"USA",       rate:"₦1,300/$",  trend:"flat", updated:"25 min ago" },
  { id:"10",brand:"Walmart",     country:"USA",       rate:"₦1,480/$",  trend:"up",   updated:"7 min ago"  },
  { id:"11",brand:"Target",      country:"USA",       rate:"₦1,420/$",  trend:"flat", updated:"18 min ago" },
  { id:"12",brand:"Visa",        country:"USA",       rate:"₦1,600/$",  trend:"up",   updated:"3 min ago"  },
  { id:"13",brand:"Mastercard",  country:"USA",       rate:"₦1,590/$",  trend:"up",   updated:"3 min ago"  },
  { id:"14",brand:"Spotify",     country:"USA",       rate:"₦1,100/$",  trend:"down", updated:"30 min ago" },
  { id:"15",brand:"Netflix",     country:"USA",       rate:"₦1,050/$",  trend:"flat", updated:"22 min ago" },
  { id:"16",brand:"Razer Gold",  country:"Global",    rate:"₦1,250/$",  trend:"up",   updated:"9 min ago"  },
];

const CRYPTO_RATES: CryptoRate[] = [
  { id:"btc",  symbol:"BTC",  name:"Bitcoin",  buyRate:"₦72,800,000", sellRate:"₦70,500,000", change:"+2.4%", pos:true  },
  { id:"eth",  symbol:"ETH",  name:"Ethereum", buyRate:"₦3,850,000",  sellRate:"₦3,720,000",  change:"-1.2%", pos:false },
  { id:"usdt", symbol:"USDT", name:"Tether",   buyRate:"₦1,605",      sellRate:"₦1,595",      change:"+0.0%", pos:true  },
  { id:"bnb",  symbol:"BNB",  name:"BNB",      buyRate:"₦520,000",    sellRate:"₦505,000",    change:"+1.8%", pos:true  },
  { id:"sol",  symbol:"SOL",  name:"Solana",   buyRate:"₦165,000",    sellRate:"₦160,000",    change:"+5.2%", pos:true  },
  { id:"xrp",  symbol:"XRP",  name:"XRP",      buyRate:"₦1,080",      sellRate:"₦1,040",      change:"-0.8%", pos:false },
];

const FX_RATES: FXRate[] = [
  { id:"usd", pair:"USD / NGN", buy:"₦1,610", sell:"₦1,590" },
  { id:"gbp", pair:"GBP / NGN", buy:"₦2,040", sell:"₦2,010" },
  { id:"eur", pair:"EUR / NGN", buy:"₦1,750", sell:"₦1,730" },
  { id:"cad", pair:"CAD / NGN", buy:"₦1,190", sell:"₦1,170" },
  { id:"aud", pair:"AUD / NGN", buy:"₦1,050", sell:"₦1,030" },
];

const CATEGORIES: RateCategory[] = ["Gift Cards", "Crypto", "FX"];

export default function RatesScreen() {
  const [category, setCategory] = useState<RateCategory>("Gift Cards");

  const trendIcon = (t: GiftRate["trend"]) =>
    t === "up" ? "trending-up" : t === "down" ? "trending-down" : "minus";
  const trendColor = (t: GiftRate["trend"]) =>
    t === "up" ? C.success : t === "down" ? "#FF4444" : C.textMut;

  return (
    <View style={s.root}>
      <ScreenHeader title="Live Rates" />

      {/* Category tabs */}
      <View style={s.tabRow}>
        {CATEGORIES.map(cat => {
          const active = cat === category;
          return (
            <TouchableOpacity
              key={cat}
              style={[s.tab, active && s.tabActive]}
              onPress={() => { Haptics.selectionAsync(); setCategory(cat); }}
            >
              <Text style={[s.tabText, active && s.tabTextActive]}>{cat}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Live indicator */}
      <View style={s.liveRow}>
        <View style={s.liveDot} />
        <Text style={s.liveText}>Live rates — updated every 5 minutes</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>

        {/* Gift Cards */}
        {category === "Gift Cards" && (
          <>
            {GIFT_RATES.map((r, i) => (
              <Animated.View key={r.id} entering={FadeInDown.duration(260).delay(i * 20)}>
                <View style={s.giftRow}>
                  <View style={s.giftLeft}>
                    <Text style={s.giftBrand}>{r.brand}</Text>
                    <Text style={s.giftCountry}>{r.country} · {r.updated}</Text>
                  </View>
                  <View style={s.giftRight}>
                    <Text style={s.giftRate}>{r.rate}</Text>
                    <Feather name={trendIcon(r.trend)} size={14} color={trendColor(r.trend)} />
                  </View>
                </View>
              </Animated.View>
            ))}
          </>
        )}

        {/* Crypto */}
        {category === "Crypto" && (
          <>
            <View style={s.cryptoHeader}>
              <Text style={s.colHead}>Asset</Text>
              <Text style={s.colHead}>Buy</Text>
              <Text style={s.colHead}>Sell</Text>
              <Text style={s.colHead}>Change</Text>
            </View>
            {CRYPTO_RATES.map((r, i) => (
              <Animated.View key={r.id} entering={FadeInDown.duration(260).delay(i * 25)}>
                <View style={s.cryptoRow}>
                  <Text style={s.cryptoSymbol}>{r.symbol}</Text>
                  <Text style={s.cryptoPrice}>{r.buyRate}</Text>
                  <Text style={s.cryptoPrice}>{r.sellRate}</Text>
                  <Text style={[s.cryptoChange, { color: r.pos ? C.success : "#FF4444" }]}>{r.change}</Text>
                </View>
              </Animated.View>
            ))}
          </>
        )}

        {/* FX */}
        {category === "FX" && (
          <>
            {FX_RATES.map((r, i) => (
              <Animated.View key={r.id} entering={FadeInDown.duration(260).delay(i * 30)}>
                <View style={s.fxRow}>
                  <Text style={s.fxPair}>{r.pair}</Text>
                  <View style={s.fxRates}>
                    <View>
                      <Text style={s.fxLabel}>Buy</Text>
                      <Text style={s.fxVal}>{r.buy}</Text>
                    </View>
                    <View>
                      <Text style={s.fxLabel}>Sell</Text>
                      <Text style={s.fxVal}>{r.sell}</Text>
                    </View>
                  </View>
                </View>
              </Animated.View>
            ))}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root:  { flex: 1, backgroundColor: C.bg },
  scroll:{ padding: 20, paddingBottom: 100 },

  tabRow: { flexDirection:"row", marginHorizontal:20, marginBottom:0, backgroundColor:C.surface, borderRadius:12, padding:4 },
  tab:    { flex:1, paddingVertical:10, alignItems:"center", borderRadius:10 },
  tabActive: { backgroundColor:"#000" },
  tabText:   { fontSize:13, fontFamily:"Manrope_600SemiBold", color:C.textSec },
  tabTextActive: { color:"#fff" },

  liveRow: { flexDirection:"row", alignItems:"center", gap:6, paddingHorizontal:20, paddingVertical:10 },
  liveDot: { width:7, height:7, borderRadius:3.5, backgroundColor:"#00B03C" },
  liveText:{ fontSize:12, fontFamily:"Manrope_400Regular", color:C.textSec },

  giftRow: {
    flexDirection:"row", alignItems:"center", justifyContent:"space-between",
    paddingVertical:14, borderBottomWidth:1, borderBottomColor:C.border,
  },
  giftLeft:    {},
  giftBrand:   { fontSize:14, fontFamily:"Manrope_600SemiBold", color:C.text },
  giftCountry: { fontSize:11, fontFamily:"Manrope_400Regular", color:C.textMut, marginTop:2 },
  giftRight:   { flexDirection:"row", alignItems:"center", gap:6 },
  giftRate:    { fontSize:14, fontFamily:"Manrope_700Bold", color:C.text },

  cryptoHeader: { flexDirection:"row", paddingBottom:8, borderBottomWidth:1, borderBottomColor:C.border, marginBottom:4 },
  colHead: { flex:1, fontSize:11, fontFamily:"Manrope_600SemiBold", color:C.textMut, textAlign:"right" },
  cryptoRow: {
    flexDirection:"row", alignItems:"center",
    paddingVertical:12, borderBottomWidth:1, borderBottomColor:C.border,
  },
  cryptoSymbol: { flex:1, fontSize:13, fontFamily:"Manrope_700Bold", color:C.text },
  cryptoPrice:  { flex:1, fontSize:12, fontFamily:"Manrope_500Medium", color:C.text, textAlign:"right" },
  cryptoChange: { flex:1, fontSize:12, fontFamily:"Manrope_700Bold", textAlign:"right" },

  fxRow: {
    flexDirection:"row", alignItems:"center", justifyContent:"space-between",
    paddingVertical:16, borderBottomWidth:1, borderBottomColor:C.border,
  },
  fxPair:  { fontSize:15, fontFamily:"Manrope_600SemiBold", color:C.text },
  fxRates: { flexDirection:"row", gap:24 },
  fxLabel: { fontSize:10, fontFamily:"Manrope_400Regular", color:C.textMut, marginBottom:2 },
  fxVal:   { fontSize:13, fontFamily:"Manrope_700Bold", color:C.text },
});
