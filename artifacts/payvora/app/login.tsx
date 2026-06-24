import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";
import { useAuth } from "@/context/AuthContext";
import { EyeToggleBtn } from "@/components/EyeToggleBtn";
import SocialAuthButtons from "@/components/SocialAuthButtons";

/* ── Screen ─────────────────────────────────────────────────────────────── */
export default function LoginScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { login } = useAuth();

  const [email,        setEmail]        = useState("");
  const [password,     setPassword]     = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading,    setIsLoading]    = useState(false);
  const [error,        setError]        = useState("");

  async function handleLogin() {
    if (!email.trim() || !password.trim()) {
      setError("Please fill in all fields");
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }
    setError("");
    setIsLoading(true);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      await login(email.trim(), password);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace("/(tabs)");
    } catch {
      setError("Invalid credentials. Please try again.");
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + 32, paddingBottom: insets.bottom + 32 },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={[styles.logoMark, { backgroundColor: colors.primary + "20", borderColor: colors.primary + "40" }]}>
            <Feather name="credit-card" size={28} color={colors.primary} />
          </View>
          <Text style={[styles.brandName, { color: colors.foreground }]}>Payvora</Text>
          <Text style={[styles.tagline, { color: colors.mutedForeground }]}>Welcome back</Text>
        </View>

        <View style={styles.form}>
          {/* Email */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.mutedForeground }]}>Email</Text>
            <View style={[styles.inputWrapper, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Feather name="mail" size={18} color={colors.mutedForeground} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: colors.foreground }]}
                value={email}
                onChangeText={setEmail}
                placeholder="you@example.com"
                placeholderTextColor={colors.mutedForeground}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          </View>

          {/* Password */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.mutedForeground }]}>Password</Text>
            <View style={[styles.inputWrapper, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Feather name="lock" size={18} color={colors.mutedForeground} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: colors.foreground, flex: 1 }]}
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                placeholderTextColor={colors.mutedForeground}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <EyeToggleBtn
                show={showPassword}
                onToggle={() => setShowPassword(v => !v)}
                color={colors.mutedForeground}
              />
            </View>
          </View>

          <TouchableOpacity style={styles.forgotBtn} onPress={() => Haptics.selectionAsync()}>
            <Text style={[styles.forgotText, { color: colors.primary }]}>Forgot password?</Text>
          </TouchableOpacity>

          {error ? (
            <View style={[styles.errorBox, { backgroundColor: colors.destructive + "20", borderColor: colors.destructive + "40" }]}>
              <Feather name="alert-circle" size={16} color={colors.destructive} />
              <Text style={[styles.errorText, { color: colors.destructive }]}>{error}</Text>
            </View>
          ) : null}

          <TouchableOpacity
            style={[styles.signInBtn, { backgroundColor: "#000000", opacity: isLoading ? 0.7 : 1 }]}
            onPress={handleLogin}
            disabled={isLoading}
            activeOpacity={0.85}
          >
            {isLoading ? (
              <ActivityIndicator color={colors.primaryForeground} />
            ) : (
              <Text style={[styles.signInBtnText, { color: colors.primaryForeground }]}>Sign In</Text>
            )}
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
            <Text style={[styles.dividerText, { color: colors.mutedForeground }]}>or</Text>
            <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
          </View>

          <SocialAuthButtons
            onSuccess={() => router.replace("/(tabs)")}
            onError={(msg) => setError(msg)}
          />
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.mutedForeground }]}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => router.push("/register")}>
            <Text style={[styles.footerLink, { color: colors.primary }]}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 24, flexGrow: 1 },
  header: { alignItems: "center", marginBottom: 40 },
  logoMark: {
    width: 72, height: 72, borderRadius: 20,
    alignItems: "center", justifyContent: "center",
    borderWidth: 1, marginBottom: 16,
  },
  brandName: { fontSize: 32, fontFamily: "Inter_700Bold", letterSpacing: -1, marginBottom: 4 },
  tagline: { fontSize: 17, fontFamily: "Inter_400Regular" },
  form: { gap: 16 },
  inputGroup: { gap: 8 },
  label: { fontSize: 13, fontFamily: "Inter_500Medium", letterSpacing: 0.3 },
  inputWrapper: {
    flexDirection: "row", alignItems: "center",
    borderRadius: 14, borderWidth: 1, paddingHorizontal: 16, height: 56,
  },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, fontSize: 16, fontFamily: "Inter_400Regular" },
  forgotBtn: { alignSelf: "flex-end" },
  forgotText: { fontSize: 14, fontFamily: "Inter_500Medium" },
  errorBox: {
    flexDirection: "row", alignItems: "center", gap: 8,
    borderRadius: 12, borderWidth: 1, padding: 12,
  },
  errorText: { fontSize: 14, fontFamily: "Inter_400Regular", flex: 1 },
  signInBtn: {
    height: 56, borderRadius: 16,
    alignItems: "center", justifyContent: "center",
    marginTop: 4,
  },
  signInBtnText: { fontSize: 17, fontFamily: "Inter_600SemiBold" },
  divider: { flexDirection: "row", alignItems: "center", gap: 12 },
  dividerLine: { flex: 1, height: 1 },
  dividerText: { fontSize: 14, fontFamily: "Inter_400Regular" },
  socialRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
  },
  socialBtnWrap: {
    flex: 1,
    alignItems: "center",
  },
  socialBtn: {
    width: 105,
    height: 56,
  },
  footer: { flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: "auto", paddingTop: 32 },
  footerText: { fontSize: 15, fontFamily: "Inter_400Regular" },
  footerLink: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
});
