import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { PasswordInput } from "@/components/PasswordInput";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { apiFetch } from "@/utils/api";
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
  placeholder:  "#8391A1",
  white:        "#FFFFFF",
  btnBorder:    "#E8ECF4",
  error:        "#FF5B7A",
  success:      "#00C48C",
  gray:         "#8391A1",
};

/* Password strength */
function getStrength(pw: string): { score: number; label: string; color: string } {
  if (!pw) return { score: 0, label: "", color: "transparent" };
  let score = 0;
  if (pw.length >= 8)  score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score <= 1) return { score, label: "Weak",   color: "#FF5B7A" };
  if (score === 2) return { score, label: "Fair",   color: "#F59E0B" };
  if (score === 3) return { score, label: "Good",   color: "#3B82F6" };
  return              { score, label: "Strong", color: "#00C48C" };
}

function StrengthBar({ password }: { password: string }) {
  const { score, label, color } = getStrength(password);
  if (!password) return null;
  return (
    <Animated.View entering={FadeIn.duration(200)} style={st.wrap}>
      <View style={st.bars}>
        {[1, 2, 3, 4].map(i => (
          <View
            key={i}
            style={[st.bar, { backgroundColor: i <= score ? color : "#E8ECF4" }]}
          />
        ))}
      </View>
      <Text style={[st.label, { color }]}>{label}</Text>
    </Animated.View>
  );
}

const st = StyleSheet.create({
  wrap:  { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 8 },
  bars:  { flex: 1, flexDirection: "row", gap: 4 },
  bar:   { flex: 1, height: 3, borderRadius: 2 },
  label: { fontSize: 11, fontFamily: "Manrope_600SemiBold", width: 44, textAlign: "right" },
});

export default function NewPasswordScreen() {
  const router  = useRouter();
  const insets  = useSafeAreaInsets();
  const params  = useLocalSearchParams<{ verified?: string; email?: string; resetToken?: string }>();

  const [newPass,  setNewPass]  = useState("");
  const [confirm,  setConfirm]  = useState("");
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");
  const [blocked,  setBlocked]  = useState(false);

  const btnSc    = useSharedValue(1);
  const btnStyle = useAnimatedStyle(() => ({ transform: [{ scale: btnSc.value }] }));

  /* Guard — block if user navigated here without completing OTP */
  useEffect(() => {
    if (params.verified !== "1") {
      setBlocked(true);
    }
  }, []);

  if (blocked) {
    return (
      <View style={[guard.root, { paddingTop: insets.top + 24 }]}>
        <Ionicons name="shield-checkmark-outline" size={52} color={C.gray} />
        <Text style={guard.title}>Verification Required</Text>
        <Text style={guard.sub}>
          Please complete email verification before creating a new password.
        </Text>
        <Pressable
          style={guard.btn}
          onPress={() => router.replace("/(auth)/forgot-password" as any)}
        >
          <Text style={guard.btnText}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  const { score } = getStrength(newPass);

  const handleSubmit = async () => {
    if (!newPass.trim() || !confirm.trim()) {
      setError("Please fill in both fields.");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }
    if (newPass.length < 8) {
      setError("Password must be at least 8 characters.");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }
    if (newPass !== confirm) {
      setError("Passwords do not match.");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setLoading(true);
    setError("");
    try {
      await apiFetch("/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({
          resetToken: params.resetToken ?? "",
          newPassword: newPass,
        }),
      });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace("/(auth)/password-changed");
    } catch (err: any) {
      setError(err.message || "Failed to reset password. Please try again.");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setLoading(false);
    }
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
        <Animated.View
          entering={FadeInUp.duration(380).delay(80).springify()}
          style={s.titleBlock}
        >
          <Text style={s.heading}>Create New Password</Text>
          <Text style={s.subText}>
            Your new password must be different from your previously used passwords.
          </Text>
        </Animated.View>

        {/* ── Inputs ── */}
        <Animated.View
          entering={FadeInUp.duration(380).delay(140).springify()}
          style={s.formBlock}
        >
          <View>
            <PasswordInput
              placeholder="New Password"
              value={newPass}
              onChangeText={t => { setNewPass(t); setError(""); }}
              error={!!error && (!newPass || newPass.length < 8)}
            />
            <StrengthBar password={newPass} />
          </View>

          <PasswordInput
            placeholder="Confirm New Password"
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

        {/* ── Password requirements ── */}
        <Animated.View
          entering={FadeInUp.duration(380).delay(170).springify()}
          style={s.reqList}
        >
          {[
            { label: "At least 8 characters",         met: newPass.length >= 8 },
            { label: "One uppercase letter (A–Z)",    met: /[A-Z]/.test(newPass) },
            { label: "One number (0–9)",              met: /[0-9]/.test(newPass) },
            { label: "One special character (!@#…)",  met: /[^A-Za-z0-9]/.test(newPass) },
          ].map((r, i) => (
            <View key={i} style={s.reqRow}>
              <Ionicons
                name={r.met ? "checkmark-circle" : "ellipse-outline"}
                size={14}
                color={r.met ? C.success : C.gray}
              />
              <Text style={[s.reqText, r.met && { color: C.dark }]}>{r.label}</Text>
            </View>
          ))}
        </Animated.View>

        {/* ── Reset button ── */}
        <Animated.View
          entering={FadeInUp.duration(380).delay(200).springify()}
          style={[btnStyle, s.btnWrap]}
        >
          <Pressable
            style={[s.resetBtn, (loading || score < 2) && { opacity: 0.6 }]}
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

/* ── Guard screen styles ─────────────────────────────────────────────────── */
const guard = StyleSheet.create({
  root: {
    flex: 1, backgroundColor: "#FFFFFF",
    alignItems: "center", justifyContent: "center",
    paddingHorizontal: 36, gap: 16,
  },
  title: {
    fontSize: 22, fontFamily: "Manrope_700Bold",
    color: "#1E232C", textAlign: "center",
  },
  sub: {
    fontSize: 15, fontFamily: "Manrope_400Regular",
    color: "#8391A1", textAlign: "center", lineHeight: 22,
  },
  btn: {
    marginTop: 8, height: 52, paddingHorizontal: 32,
    backgroundColor: "#1E232C", borderRadius: 14,
    alignItems: "center", justifyContent: "center",
  },
  btnText: {
    fontSize: 15, fontFamily: "Manrope_700Bold", color: "#FFFFFF",
  },
});

/* ── Main styles ─────────────────────────────────────────────────────────── */
const s = StyleSheet.create({
  root:   { flex: 1, backgroundColor: C.bg },
  scroll: { paddingHorizontal: 24, flexGrow: 1 },

  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 36,
  },
  backBtn: {
    width: 44, height: 44, borderRadius: 12,
    borderWidth: 1, borderColor: C.btnBorder,
    backgroundColor: C.white,
    alignItems: "center", justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06, shadowRadius: 4, elevation: 1,
  },
  wordmark: {
    fontSize: 22,
    fontFamily: "Manrope_700Bold",
    color: C.dark,
    letterSpacing: 1,
  },

  titleBlock: { marginBottom: 32 },
  heading: {
    fontSize: 30, fontFamily: "Manrope_700Bold", color: C.dark,
    letterSpacing: -0.3, lineHeight: 39, marginBottom: 12,
  },
  subText: {
    fontSize: 15, fontFamily: "Manrope_400Regular",
    color: C.gray, lineHeight: 23,
  },

  formBlock: { gap: 16, marginBottom: 20 },
  errorText: {
    fontSize: 13, fontFamily: "Manrope_400Regular", color: C.error,
  },

  reqList: { gap: 8, marginBottom: 28 },
  reqRow:  { flexDirection: "row", alignItems: "center", gap: 8 },
  reqText: {
    fontSize: 13, fontFamily: "Manrope_400Regular",
    color: C.gray, lineHeight: 18,
  },

  btnWrap: {},
  resetBtn: {
    height: 60, backgroundColor: C.dark,
    borderRadius: 14, alignItems: "center", justifyContent: "center",
    shadowColor: "#1E232C", shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18, shadowRadius: 12, elevation: 6,
  },
  resetBtnText: {
    fontSize: 16, fontFamily: "Manrope_700Bold",
    color: C.white, letterSpacing: 0.2,
  },
});
