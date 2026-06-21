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

export default function RegisterScreen() {
  const router = useRouter();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { register } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async () => {
    if (!name || !email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    setError("");
    await register(name, email, password);
    setLoading(false);
    router.replace("/(auth)/pin");
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
        <Text style={[styles.heading, { color: colors.text }]}>Create Account</Text>
        <Text style={[styles.sub, { color: colors.mutedForeground }]}>
          Join AZA and start trading gift cards
        </Text>

        <View style={styles.form}>
          <AZAInput
            label="Full Name"
            placeholder="Enter your full name"
            value={name}
            onChangeText={setName}
            icon="user"
          />
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
            placeholder="Create a password"
            value={password}
            onChangeText={setPassword}
            secureToggle
            icon="lock"
          />
          {error ? (
            <Text style={[styles.errorText, { color: colors.destructive }]}>{error}</Text>
          ) : null}
        </View>

        <AZAButton title="Create Account" onPress={handleRegister} loading={loading} />

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.mutedForeground }]}>
            Already have an account?{" "}
          </Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={[styles.footerLink, { color: colors.text }]}>Login</Text>
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
  footer: { flexDirection: "row", justifyContent: "center", marginTop: 24 },
  footerText: { fontSize: 14, fontFamily: "Manrope_400Regular" },
  footerLink: { fontSize: 14, fontFamily: "Manrope_700Bold" },
});
