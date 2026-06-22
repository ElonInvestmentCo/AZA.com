import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";

interface ScreenHeaderProps {
  title?: string;
  showBack?: boolean;
  rightAction?: React.ReactNode;
}

export function ScreenHeader({
  title,
  showBack = true,
  rightAction,
}: ScreenHeaderProps) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const topPad = Platform.OS === "web" ? 16 : insets.top + 8;

  return (
    <View
      style={[
        s.container,
        {
          paddingTop: topPad,
          backgroundColor: colors.background,
          borderBottomColor: colors.border,
        },
      ]}
    >
      <View style={s.row}>
        {showBack ? (
          <TouchableOpacity
            onPress={() => router.back()}
            style={[
              s.backBtn,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
            activeOpacity={0.75}
          >
            <Feather name="chevron-left" size={20} color={colors.text} />
          </TouchableOpacity>
        ) : (
          <View style={s.spacer} />
        )}
        {title ? (
          <Text style={[s.title, { color: colors.text }]}>{title}</Text>
        ) : null}
        <View style={s.spacer}>{rightAction}</View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  title: {
    fontSize: 17,
    fontFamily: "Manrope_700Bold",
    letterSpacing: -0.3,
  },
  spacer: {
    width: 40,
    alignItems: "flex-end",
  },
});
