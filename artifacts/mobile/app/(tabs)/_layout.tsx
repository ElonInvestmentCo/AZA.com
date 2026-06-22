import { isLiquidGlassAvailable } from "expo-glass-effect";
import { Tabs, useRouter } from "expo-router";
import { Icon, Label, NativeTabs } from "expo-router/unstable-native-tabs";
import { SymbolView } from "expo-symbols";
import { Feather } from "@expo/vector-icons";
import React from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useColors } from "@/hooks/useColors";

/* ─── Custom pill tab bar ───────────────────────────────────────────────────── */

function PillTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  return (
    <View style={pill.outer} pointerEvents="box-none">
      <View style={pill.bar}>
        {state.routes.map((route, i) => {
          const { options } = descriptors[route.key];
          const focused = state.index === i;

          const icon = (() => {
            if (route.name === "index")   return "home"          as const;
            if (route.name === "card")    return "credit-card"   as const;
            if (route.name === "history") return "clock"         as const;
            return "circle" as const;
          })();

          /* Red badge for history */
          const showBadge = route.name === "history";

          return (
            <TouchableOpacity
              key={route.key}
              style={pill.item}
              onPress={() => {
                const event = navigation.emit({ type: "tabPress", target: route.key, canPreventDefault: true });
                if (!focused && !event.defaultPrevented) navigation.navigate(route.name);
              }}
              activeOpacity={0.8}
            >
              <View style={[pill.iconWrap, focused && pill.iconWrapActive]}>
                {Platform.OS === "ios" && route.name === "index" ? (
                  <SymbolView name={focused ? "house.fill" : "house"} tintColor="#FFFFFF" size={22} />
                ) : Platform.OS === "ios" && route.name === "card" ? (
                  <SymbolView name={focused ? "creditcard.fill" : "creditcard"} tintColor="#FFFFFF" size={22} />
                ) : Platform.OS === "ios" && route.name === "history" ? (
                  <SymbolView name={focused ? "clock.fill" : "clock"} tintColor="#FFFFFF" size={22} />
                ) : (
                  <Feather name={icon} size={22} color="#FFFFFF" />
                )}
                {showBadge && <View style={pill.badge} />}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const pill = StyleSheet.create({
  outer: {
    position:          "absolute",
    left:              20,
    right:             20,
    bottom:            Platform.OS === "ios" ? 28 : 16,
    alignItems:        "center",
    pointerEvents:     "box-none",
  },
  bar: {
    flexDirection:     "row",
    alignItems:        "center",
    justifyContent:    "space-around",
    backgroundColor:   "#000000",
    borderRadius:      40,
    height:            68,
    width:             "100%",
    paddingHorizontal: 20,
    shadowColor:       "#000",
    shadowOffset:      { width: 0, height: 8 },
    shadowOpacity:     0.4,
    shadowRadius:      20,
    elevation:         12,
  },
  item: {
    flex:           1,
    alignItems:     "center",
    justifyContent: "center",
    height:         68,
  },
  iconWrap: {
    width:           44,
    height:          44,
    borderRadius:    22,
    alignItems:      "center",
    justifyContent:  "center",
  },
  iconWrapActive: {
    backgroundColor: "rgba(139,92,246,0.35)",
  },
  badge: {
    position:     "absolute",
    top:          2,
    right:        2,
    width:        8,
    height:       8,
    borderRadius: 4,
    backgroundColor: "#FF3B30",
    borderWidth:  1.5,
    borderColor:  "#000",
  },
});

/* ─── NativeTabs layout (iOS 26+ liquid glass) ─────────────────────────────── */

function NativeTabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index">
        <Icon sf={{ default: "house", selected: "house.fill" }} />
        <Label>Home</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="card">
        <Icon sf={{ default: "creditcard", selected: "creditcard.fill" }} />
        <Label>Card</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="history">
        <Icon sf={{ default: "clock", selected: "clock.fill" }} />
        <Label>History</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}

/* ─── Classic layout (Android / web / older iOS) ───────────────────────────── */

function ClassicTabLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <PillTabBar {...props} />}
    >
      <Tabs.Screen name="index"   options={{ title: "Home"    }} />
      <Tabs.Screen name="card"    options={{ title: "Card"    }} />
      <Tabs.Screen name="history" options={{ title: "History" }} />
    </Tabs>
  );
}

export default function TabLayout() {
  if (isLiquidGlassAvailable()) return <NativeTabLayout />;
  return <ClassicTabLayout />;
}
