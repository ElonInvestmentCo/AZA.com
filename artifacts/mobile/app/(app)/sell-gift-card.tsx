import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, {
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { AZAButton } from "@/components/AZAButton";
import { AZAInput } from "@/components/AZAInput";
import { ScreenHeader } from "@/components/ScreenHeader";
import { useColors } from "@/hooks/useColors";

const DENOMS = ["$25", "$50", "$100", "$200", "$500"];

function DenomBtn({
  label, selected, onPress,
}: { label: string; selected: boolean; onPress: () => void }) {
  const colors = useColors();
  const scale  = useSharedValue(1);
  const style  = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Animated.View style={style}>
      <Pressable
        style={[
          s.denomBtn,
          {
            backgroundColor: selected ? colors.primary : colors.card,
            borderColor:     selected ? colors.primary : colors.border,
          },
        ]}
        onPress={onPress}
        onPressIn={() => { scale.value = withSpring(0.93, { damping: 12, stiffness: 300 }); }}
        onPressOut={() => { scale.value = withSpring(1.0,  { damping: 12, stiffness: 300 }); }}
      >
        <Text style={[s.denomText, { color: selected ? colors.primaryForeground : colors.text }]}>
          {label}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

export default function SellGiftCardScreen() {
  const router  = useRouter();
  const colors  = useColors();
  const { card } = useLocalSearchParams<{ card: string }>();
  const [code,  setCode]  = useState("");
  const [denom, setDenom] = useState<string | null>(null);

  const naira = denom ? parseInt(denom.replace("$", "")) * 780 : 0;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScreenHeader title={`Sell ${card ?? "Gift Card"}`} />
      <ScrollView
        contentContainerStyle={s.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInUp.duration(380).springify().delay(60)}>
          <Text style={[s.label, { color: colors.mutedForeground }]}>Select Denomination</Text>
          <View style={s.denomRow}>
            {DENOMS.map((d) => (
              <DenomBtn key={d} label={d} selected={denom === d} onPress={() => setDenom(d)} />
            ))}
          </View>
        </Animated.View>

        <Animated.View entering={FadeInUp.duration(380).springify().delay(100)}>
          <AZAInput
            label="Gift Card Code"
            placeholder="Enter card code"
            value={code}
            onChangeText={setCode}
            icon="credit-card"
            autoCapitalize="characters"
          />
        </Animated.View>

        {denom ? (
          <Animated.View
            entering={FadeInUp.duration(320).springify()}
            style={[s.estimateBox, { backgroundColor: colors.accentDim, borderColor: "rgba(0,217,160,0.2)" }]}
          >
            <Feather name="trending-up" size={15} color={colors.accent} />
            <Text style={[s.estimateText, { color: colors.accent }]}>
              You'll receive approximately{" "}
              <Text style={{ fontFamily: "Manrope_700Bold" }}>
                ₦{naira.toLocaleString("en-NG")}
              </Text>
            </Text>
          </Animated.View>
        ) : null}

        <AZAButton title="Continue" onPress={() => router.push("/(app)/confirm-transaction")} disabled={!code || !denom} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  content:      { paddingHorizontal: 20, paddingTop: 24, gap: 20, paddingBottom: 40 },
  label:        { fontSize: 13, fontFamily: "Manrope_600SemiBold", marginBottom: 10 },
  denomRow:     { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  denomBtn:     { paddingHorizontal: 20, paddingVertical: 11, borderRadius: 12, borderWidth: 1.5 },
  denomText:    { fontSize: 14, fontFamily: "Manrope_600SemiBold" },
  estimateBox:  { flexDirection: "row", alignItems: "center", gap: 10, padding: 14, borderRadius: 14, borderWidth: 1 },
  estimateText: { fontSize: 13, fontFamily: "Manrope_400Regular", flex: 1 },
});
