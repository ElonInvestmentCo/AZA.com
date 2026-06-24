import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
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
import Animated, {
  FadeIn,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";

const eyeOpenImg   = require("../../assets/images/eye-open.svg");
const eyeClosedImg = require("../../assets/images/eye-closed.svg");

function PasswordInput({
  placeholder,
  value,
  onChangeText,
}: {
  placeholder: string;
  value: string;
  onChangeText: (t: string) => void;
}) {
  const C = useColors();
  const [focused,  setFocused]  = useState(false);
  const [showPass, setShowPass] = useState(false);
  return (
    <View
      style={[
        inp.row,
        {
          backgroundColor: C.input,
          borderColor: focused ? C.inputFocus : C.inputBorder,
          borderWidth: focused ? 1.5 : 1,
        },
      ]}
    >
      <TextInput
        style={[inp.input, { color: C.text }]}
        placeholder={placeholder}
        placeholderTextColor={C.placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={!showPass}
        autoCapitalize="none"
        autoCorrect={false}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
      <TouchableOpacity
        onPress={() => { Haptics.selectionAsync(); setShowPass(v => !v); }}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        style={inp.eyeBtn}
      >
        <Image
          source={showPass ? eyeOpenImg : eyeClosedImg}
          style={{ width: 22, height: 22 }}
          contentFit="contain"
        />
      </TouchableOpacity>
    </View>
  );
}

const inp = StyleSheet.create({
  row: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    paddingHorizontal: 18,
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontFamily: "Manrope_400Regular",
    height: "100%",
  },
  eyeBtn: { paddingLeft: 8 },
});

export default function NewPasswordScreen() {
  const router  = useRouter();
  const insets  = useSafeAreaInsets();
  const C       = useColors();

  const [newPass, setNewPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  const btnSc    = useSharedValue(1);
  const btnStyle = useAnimatedStyle(() => ({ transform: [{ scale: btnSc.value }] }));

  const handleSubmit = () => {
    if (!newPass.trim() || !confirm.trim()) {
      setError("Please fill in both fields.");
      return;
    }
    if (newPass !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setLoading(true);
    setError("");
    setTimeout(() => {
      setLoading(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace("/(auth)/password-changed");
    }, 1200);
  };

  return (
    <KeyboardAvoidingView
      style={[s.root, { backgroundColor: C.background }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={[
          s.scroll,
          { paddingTop: insets.top + 8, paddingBottom: insets.bottom + 32 },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* ── Top bar ── */}
        <Animated.View entering={FadeIn.duration(400)} style={s.topBar}>
          <Pressable
            style={[s.backBtn, { borderColor: C.border, backgroundColor: C.surface }]}
            onPress={() => router.back()}
            hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
          >
            <Ionicons name="chevron-back" size={22} color={C.text} />
          </Pressable>
          <Text style={[s.wordmark, { color: C.text }]}>AZA.</Text>
          <View style={{ width: 44 }} />
        </Animated.View>

        {/* ── Title ── */}
        <Animated.View entering={FadeInUp.duration(380).delay(80).springify()} style={s.titleBlock}>
          <Text style={[s.heading, { color: C.text }]}>Create new password</Text>
          <Text style={[s.subText, { color: C.mutedForeground }]}>
            Your new password must be unique from those previously used.
          </Text>
        </Animated.View>

        {/* ── Inputs ── */}
        <Animated.View entering={FadeInUp.duration(380).delay(140).springify()} style={s.formBlock}>
          <PasswordInput
            placeholder="New Password"
            value={newPass}
            onChangeText={t => { setNewPass(t); setError(""); }}
          />
          <PasswordInput
            placeholder="Confirm Password"
            value={confirm}
            onChangeText={t => { setConfirm(t); setError(""); }}
          />
          {!!error && (
            <Animated.Text entering={FadeIn.duration(220)} style={[s.errorText, { color: C.destructive }]}>
              {error}
            </Animated.Text>
          )}
        </Animated.View>

        {/* ── Reset Password button (gradient) ── */}
        <Animated.View
          entering={FadeInUp.duration(380).delay(200).springify()}
          style={[btnStyle, s.btnWrap]}
        >
          <LinearGradient
            colors={[C.gradientStart, C.gradientMid, C.gradientEnd] as [string, string, string]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[s.resetBtnGrad, { shadowColor: C.accentGlow, opacity: loading ? 0.72 : 1 }]}
          >
            <Pressable
              style={s.resetBtnPress}
              onPress={handleSubmit}
              onPressIn={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                btnSc.value = withSpring(0.97, { damping: 13, stiffness: 320 });
              }}
              onPressOut={() => { btnSc.value = withSpring(1.0, { damping: 13, stiffness: 320 }); }}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={s.resetBtnText}>Reset Password</Text>
              )}
            </Pressable>
          </LinearGradient>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  root:   { flex: 1 },
  scroll: { paddingHorizontal: 24, flexGrow: 1 },

  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 32,
  },
  backBtn: {
    width: 44, height: 44, borderRadius: 12, borderWidth: 1,
    alignItems: "center", justifyContent: "center",
  },
  wordmark: {
    fontSize: 32,
    fontFamily: "Manrope_700Bold",
    letterSpacing: -0.5,
  },

  titleBlock: { marginBottom: 32 },
  heading: {
    fontSize: 30,
    fontFamily: "Manrope_700Bold",
    letterSpacing: -0.3,
    lineHeight: 39,
    marginBottom: 12,
  },
  subText: {
    fontSize: 16,
    fontFamily: "Manrope_400Regular",
    lineHeight: 24,
  },

  formBlock: { gap: 16, marginBottom: 24 },
  errorText: {
    fontSize: 13,
    fontFamily: "Manrope_400Regular",
  },

  btnWrap: {},
  resetBtnGrad: {
    height: 60,
    borderRadius: 14,
    overflow: "hidden",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 24,
    elevation: 8,
  },
  resetBtnPress: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  resetBtnText: {
    fontSize: 16,
    fontFamily: "Manrope_700Bold",
    color: "#FFFFFF",
    letterSpacing: 0.2,
  },
});
