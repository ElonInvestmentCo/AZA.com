import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AZAButton } from "@/components/AZAButton";
import { AZAInput } from "@/components/AZAInput";
import { useAuth } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";

export default function LoginScreen() {
  const router = useRouter();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }
    setLoading(true);
    setError("");
    const ok = await login(email, password);
    setLoading(false);
    if (ok) {
      router.replace("/(auth)/pin");
    } else {
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + 40, paddingBottom: insets.bottom + 24 },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.logo, { color: colors.text }]}>aza</Text>
        <Text style={[styles.heading, { color: colors.text }]}>Welcome back</Text>
        <Text style={[styles.sub, { color: colors.mutedForeground }]}>
          Sign in to your AZA account
        </Text>

        <View style={styles.form}>
          <AZAInput
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            icon="mail"
          />
          <AZAInput
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureToggle
            icon="lock"
          />
          {error ? (
            <Text style={[styles.errorText, { color: colors.destructive }]}>{error}</Text>
          ) : null}
          <TouchableOpacity
            onPress={() => router.push("/(auth)/forgot-password")}
            style={{ alignSelf: "flex-end" }}
          >
            <Text style={[styles.forgotText, { color: colors.text }]}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>

        <AZAButton title="Login" onPress={handleLogin} loading={loading} />

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.mutedForeground }]}>
            Don't have an account?{" "}
          </Text>
          <TouchableOpacity onPress={() => router.push("/(auth)/register")}>
            <Text style={[styles.footerLink, { color: colors.text }]}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 28, gap: 0 },
  logo: { fontSize: 32, fontFamily: "Manrope_700Bold", letterSpacing: -1, marginBottom: 32 },
  heading: { fontSize: 26, fontFamily: "Manrope_700Bold", letterSpacing: -0.5, marginBottom: 8 },
  sub: { fontSize: 15, fontFamily: "Manrope_400Regular", marginBottom: 36 },
  form: { gap: 16, marginBottom: 24 },
  errorText: { fontSize: 13, fontFamily: "Manrope_400Regular" },
  forgotText: { fontSize: 13, fontFamily: "Manrope_600SemiBold" },
  footer: { flexDirection: "row", justifyContent: "center", marginTop: 24 },
  footerText: { fontSize: 14, fontFamily: "Manrope_400Regular" },
  footerLink: { fontSize: 14, fontFamily: "Manrope_700Bold" },
});
