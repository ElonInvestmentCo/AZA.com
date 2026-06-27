import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { PasswordInput } from "@/components/PasswordInput";
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

const C = {
  bg:           "#FFFFFF",
  dark:         "#1E232C",
  inputBg:      "#F7F8F9",
  inputBorder:  "#E8ECF4",
  inputFocus:   "#1E232C",
  placeholder:  "#8391A1",
  white:        "#FFFFFF",
  btnBorder:    "#E8ECF4",
  error:        "#FF5B7A",
};


export default function NewPasswordScreen() {
  const router  = useRouter();
  const insets  = useSafeAreaInsets();

  const [newPass,  setNewPass]  = useState("");
  const [confirm,  setConfirm]  = useState("");
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

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
      style={s.root}
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
            style={s.backBtn}
            onPress={() => router.back()}
            hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
          >
            <Ionicons name="chevron-back" size={22} color={C.dark} />
          </Pressable>
          <Text style={s.wordmark}>PAYVORA.</Text>
          <View style={{ width: 44 }} />
        </Animated.View>

        {/* ── Title ── */}
        <Animated.View entering={FadeInUp.duration(380).delay(80).springify()} style={s.titleBlock}>
          <Text style={s.heading}>Create new password</Text>
          <Text style={s.subText}>
            Your new password must be unique from those previously used.
          </Text>
        </Animated.View>

        {/* ── Inputs ── */}
        <Animated.View entering={FadeInUp.duration(380).delay(140).springify()} style={s.formBlock}>
          <PasswordInput
            placeholder="New Password"
            value={newPass}
            onChangeText={t => { setNewPass(t); setError(""); }}
            error={!!error && !newPass}
          />
          <PasswordInput
            placeholder="Confirm Password"
            value={confirm}
            onChangeText={t => { setConfirm(t); setError(""); }}
            error={!!error && newPass !== confirm}
          />
          {!!error && (
            <Animated.Text entering={FadeIn.duration(220)} style={s.errorText}>
              {error}
            </Animated.Text>
          )}
        </Animated.View>

        {/* ── Reset Password button ── */}
        <Animated.View
          entering={FadeInUp.duration(380).delay(200).springify()}
          style={[btnStyle, s.btnWrap]}
        >
          <Pressable
            style={[s.resetBtn, loading && { opacity: 0.72 }]}
            onPress={handleSubmit}
            onPressIn={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              btnSc.value = withSpring(0.97, { damping: 13, stiffness: 320 });
            }}
            onPressOut={() => { btnSc.value = withSpring(1.0, { damping: 13, stiffness: 320 }); }}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={C.white} size="small" />
            ) : (
              <Text style={s.resetBtnText}>Reset Password</Text>
            )}
          </Pressable>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  root:   { flex: 1, backgroundColor: C.bg },
  scroll: { paddingHorizontal: 24, flexGrow: 1 },

  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 32,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: C.btnBorder,
    backgroundColor: C.white,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 1,
  },
  wordmark: {
    fontSize: 32,
    fontFamily: "Manrope_700Bold",
    color: C.dark,
    letterSpacing: -0.5,
  },

  titleBlock: { marginBottom: 32 },
  heading: {
    fontSize: 30,
    fontFamily: "Manrope_700Bold",
    color: C.dark,
    letterSpacing: -0.3,
    lineHeight: 39,
    marginBottom: 12,
  },
  subText: {
    fontSize: 16,
    fontFamily: "Manrope_400Regular",
    color: C.placeholder,
    lineHeight: 24,
  },

  formBlock: { gap: 16, marginBottom: 24 },
  errorText: {
    fontSize: 13,
    fontFamily: "Manrope_400Regular",
    color: C.error,
  },

  btnWrap: {},
  resetBtn: {
    height: 60,
    backgroundColor: C.dark,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#1E232C",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 6,
  },
  resetBtnText: {
    fontSize: 16,
    fontFamily: "Manrope_700Bold",
    color: C.white,
    letterSpacing: 0.2,
  },
});
