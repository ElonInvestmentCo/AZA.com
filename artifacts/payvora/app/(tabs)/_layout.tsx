import { isLiquidGlassAvailable } from "expo-glass-effect";
import * as Haptics from "expo-haptics";
import { Tabs, usePathname } from "expo-router";
import { Icon, Label, NativeTabs } from "expo-router/unstable-native-tabs";
import { SymbolView } from "expo-symbols";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import React from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
type BottomTabBarProps = {
  state: { routes: { key: string; name: string }[]; index: number };
  navigation: { navigate: (name: string) => void };
  descriptors?: Record<string, unknown>;
};

const ACTIVE_PILL = "#E8DEF8";
const ACTIVE_ICON = "#4A148C";
const INACTIVE_ICON = "#FFFFFF";
const NAV_BG = "#000000";

const TAB_ICONS: Record<string, { feather?: string; material?: string; sf?: string }> = {
  index:   { feather: "home",        sf: "house.fill" },
  markets: { feather: "trending-up", sf: "chart.bar.fill" },
  send:    { feather: "send",        sf: "arrow.up.arrow.down.circle.fill" },
  esim:    { material: "sim-card",   sf: "simcard.fill" },
  profile: { feather: "user",        sf: "person.fill" },
};

const TAB_LABELS: Record<string, string> = {
  index:   "Home",
  markets: "Markets",
  send:    "Transfer",
  esim:    "eSIM",
  profile: "Profile",
};

function TabIcon({
  routeName,
  isFocused,
}: {
  routeName: string;
  isFocused: boolean;
}) {
  const cfg = TAB_ICONS[routeName];
  const color = isFocused ? ACTIVE_ICON : INACTIVE_ICON;
  const size = 22;

  if (!cfg) return <Feather name="circle" size={size} color={color} />;

  if (Platform.OS === "ios" && cfg.sf) {
    return (
      <SymbolView
        name={cfg.sf as any}
        tintColor={color}
        size={size}
      />
    );
  }
  if (cfg.material) {
    return <MaterialIcons name={cfg.material as any} size={size + 2} color={color} />;
  }
  if (cfg.feather) {
    return <Feather name={cfg.feather as any} size={size} color={color} />;
  }
  return <Feather name="circle" size={size} color={color} />;
}

function BlackPillTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const bottomPad = Math.max(insets.bottom, Platform.OS === "web" ? 12 : 8);

  return (
    <View
      style={[
        styles.tabBarOuter,
        { bottom: bottomPad },
      ]}
      pointerEvents="box-none"
    >
      <View style={styles.tabBarPill}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;

          function onPress() {
            if (!isFocused) {
              Haptics.selectionAsync();
              navigation.navigate(route.name);
            }
          }

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              style={styles.tabItemOuter}
              activeOpacity={0.75}
              accessibilityLabel={TAB_LABELS[route.name] ?? route.name}
              accessibilityRole="button"
              accessibilityState={{ selected: isFocused }}
            >
              <View style={[styles.tabItemInner, isFocused && styles.tabItemActive]}>
                <TabIcon routeName={route.name} isFocused={isFocused} />
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

function NativeTabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index">
        <Icon sf={{ default: "house", selected: "house.fill" }} />
        <Label>Home</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="markets">
        <Icon sf={{ default: "chart.bar", selected: "chart.bar.fill" }} />
        <Label>Markets</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="send">
        <Icon sf={{ default: "arrow.up.arrow.down.circle", selected: "arrow.up.arrow.down.circle.fill" }} />
        <Label>Transfer</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="esim">
        <Icon sf={{ default: "simcard", selected: "simcard.fill" }} />
        <Label>eSIM</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="profile">
        <Icon sf={{ default: "person", selected: "person.fill" }} />
        <Label>Profile</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}

function ClassicTabLayout() {
  return (
    <Tabs
      tabBar={(props) => <BlackPillTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="markets" options={{ title: "Markets" }} />
      <Tabs.Screen name="send" options={{ title: "Transfer" }} />
      <Tabs.Screen name="esim" options={{ title: "eSIM" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
    </Tabs>
  );
}

export default function TabLayout() {
  if (isLiquidGlassAvailable()) {
    return <NativeTabLayout />;
  }
  return <ClassicTabLayout />;
}

const styles = StyleSheet.create({
  tabBarOuter: {
    position: "absolute",
    left: 21,
    right: 21,
    alignItems: "stretch",
    zIndex: 100,
  },
  tabBarPill: {
    flexDirection: "row",
    backgroundColor: NAV_BG,
    borderRadius: 34,
    height: 53,
    paddingHorizontal: 8,
    alignItems: "center",
    gap: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 12,
  },
  tabItemOuter: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: 37,
  },
  tabItemInner: {
    width: "100%",
    height: 37,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  tabItemActive: {
    backgroundColor: ACTIVE_PILL,
  },
});
