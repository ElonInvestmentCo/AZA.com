import { Tabs } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { SymbolView } from "expo-symbols";
import React from "react";
import {
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
/* ─── Custom pill tab bar ───────────────────────────────────────────────────── */

function PillTabBar({ state, descriptors, navigation }: any) {
  return (
    <View style={pill.outer} pointerEvents="box-none">
      <View style={pill.bar}>
        {state.routes.map((route: any, i: number) => {
          const focused = state.index === i;

          const icon = (() => {
            if (route.name === "index")   return "home"        as const;
            if (route.name === "card")    return "credit-card" as const;
            if (route.name === "history") return "clock"       as const;
            return "circle" as const;
          })();

          const showBadge = route.name === "history";

          return (
            <TouchableOpacity
              key={route.key}
              style={pill.item}
              onPress={() => {
                const event = navigation.emit({
                  type: "tabPress",
                  target: route.key,
                  canPreventDefault: true,
                });
                if (!focused && !event.defaultPrevented) {
                  navigation.navigate(route.name);
                }
              }}
              activeOpacity={0.8}
            >
              <View style={[pill.iconWrap, focused && pill.iconWrapActive]}>
                {Platform.OS === "ios" && route.name === "index" ? (
                  <SymbolView
                    name={focused ? "house.fill" : "house"}
                    tintColor="#FFFFFF"
                    size={22}
                  />
                ) : Platform.OS === "ios" && route.name === "card" ? (
                  <SymbolView
                    name={focused ? "creditcard.fill" : "creditcard"}
                    tintColor="#FFFFFF"
                    size={22}
                  />
                ) : Platform.OS === "ios" && route.name === "history" ? (
                  <SymbolView
                    name={focused ? "clock.fill" : "clock"}
                    tintColor="#FFFFFF"
                    size={22}
                  />
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
    position:      "absolute",
    left:          20,
    right:         20,
    bottom:        Platform.OS === "ios" ? 28 : 16,
    alignItems:    "center",
    pointerEvents: "box-none",
  } as any,
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
    width:          44,
    height:         44,
    borderRadius:   22,
    alignItems:     "center",
    justifyContent: "center",
  },
  iconWrapActive: {
    backgroundColor: "rgba(139,92,246,0.35)",
  },
  badge: {
    position:        "absolute",
    top:             2,
    right:           2,
    width:           8,
    height:          8,
    borderRadius:    4,
    backgroundColor: "#FF3B30",
    borderWidth:     1.5,
    borderColor:     "#000",
  },
});

/* ─── Tab layout ────────────────────────────────────────────────────────────── */

export default function TabLayout() {
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
