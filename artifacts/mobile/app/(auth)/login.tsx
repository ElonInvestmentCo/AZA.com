import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
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
import { useAuth } from "@/context/AuthContext";

const logoIcon = require("@/assets/images/logo-icon.png");

// ── Design tokens ─────────────────────────────────────────────────────────────
const C = {
  bg:           "#0A0A0F",
  surface:      "#14141F",
  inputBg:      "#1C1C2A",
  inputBorder:  "#2A2A3D",
  inputFocus:   "#00D9A0",
  text:         "#FFFFFF",
  subtext:      "#8F8FA3",
  placeholder:  "#55556A",
  accent:       "#00D9A0",
  accentDim:    "rgba(0,217,160,0.12)",
  btnBg:        "#FFFFFF",
  btnText:      "#0A0A0F",
  socialBg:     "#1C1C2A",
  socialBorder: "#2A2A3D",
  error:        "#FF5B7A",
  divider:      "#2A2A3D",
};

// ── Sub-components ─────────────────────────────────────────────────────────────
function FinInput({
  placeholder,
  value,
  onChangeText,
  keyboardType,
  autoCapitalize,
  secureToggle,
  icon,
  error,
}: {
  placeholder: string;
  value: string;
  onChangeText: (t: string) => void;
  keyboardType?: any;
  autoCapitalize?: any;
  secureToggle?: boolean;
  icon: keyof typeof Feather.glyphMap;
  error?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  const [showPw, setShowPw]   = useState(false);

  return (
    <View
      style={[
        s.inputRow,
        focused && s.inputRowFocused,
        error  && s.inputRowError,
      ]}
    >
      <Feather
        name={icon}
        size={18}
        color={focused ? C.accent : C.placeholder}
        style={{ marginRight: 12 }}
      />
      <TextInput
        style={s.input}
        placeholder={placeholder}
        placeholderTextColor={C.placeholder}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize ?? "none"}
        secureTextEntry={secureToggle && !showPw}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
      {secureToggle && (
        <TouchableOpacity
          onPress={() => setShowPw(v => !v)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Feather name={showPw ? "eye-off" : "eye"} size={18} color={C.placeholder} />
        </TouchableOpacity>
      )}
    </View>
  );
}

function Divider() {
  return (
    <View style={s.dividerRow}>
      <View style={s.dividerLine} />
      <Text style={s.dividerText}>Or Login with</Text>
      <View style={s.dividerLine} />
    </View>
  );
}

function SocialBtn({ icon, label }: { icon: string; label: string }) {
  return (
    <TouchableOpacity style={s.socialBtn} activeOpacity={0.75}>
      <Text style={s.socialIcon}>{icon}</Text>
      <Text style={s.socialLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

// ── Main screen ────────────────────────────────────────────────────────────────
export default function LoginScreen() {
  const router  = useRouter();
  const insets  = useSafeAreaInsets();
  const { login } = useAuth();

  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

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
      style={s.root}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={[
          s.scroll,
          { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 32 },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >

        {/* ── Top bar ── */}
        <View style={s.topBar}>
          <TouchableOpacity
            style={s.backBtn}
            onPress={() => router.back()}
            activeOpacity={0.75}
          >
            <Feather name="chevron-left" size={22} color={C.text} />
          </TouchableOpacity>
          <Image
            source={logoIcon}
            style={s.logoIcon}
            contentFit="contain"
            priority="high"
          />
        </View>

        {/* ── Heading ── */}
        <View style={s.headingBlock}>
          <Text style={s.welcome}>Welcome!</Text>
          <Text style={s.welcomeSub}>Fill your Details Here...</Text>
        </View>

        {/* ── Form ── */}
        <View style={s.form}>
          <FinInput
            icon="mail"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            error={!!error}
          />
          <FinInput
            icon="lock"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureToggle
            error={!!error}
          />
          {error ? (
            <Text style={s.errorText}>{error}</Text>
          ) : null}

          <TouchableOpacity
            onPress={() => router.push("/(auth)/forgot-password")}
            style={{ alignSelf: "flex-end" }}
          >
            <Text style={s.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>

        {/* ── Login button ── */}
        <TouchableOpacity
          style={[s.loginBtn, loading && { opacity: 0.7 }]}
          onPress={handleLogin}
          activeOpacity={0.85}
          disabled={loading}
        >
          <Text style={s.loginBtnText}>
            {loading ? "Signing in…" : "Login"}
          </Text>
        </TouchableOpacity>

        {/* ── Divider ── */}
        <Divider />

        {/* ── Social buttons ── */}
        <View style={s.socialRow}>
          <SocialBtn icon="G" label="Google" />
          <SocialBtn icon="" label="Apple" />
        </View>

        {/* ── Footer ── */}
        <View style={s.footer}>
          <Text style={s.footerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => router.push("/(auth)/register")}>
            <Text style={s.footerLink}>Register Now</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: C.bg,
  },
  scroll: {
    paddingHorizontal: 24,
    flexGrow: 1,
  },

  // Top bar
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 40,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: C.surface,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: C.inputBorder,
  },
  logoIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
  },

  // Heading
  headingBlock: {
    marginBottom: 36,
  },
  welcome: {
    fontSize: 32,
    fontFamily: "Manrope_700Bold",
    color: C.text,
    letterSpacing: -0.8,
    marginBottom: 4,
  },
  welcomeSub: {
    fontSize: 16,
    fontFamily: "Manrope_400Regular",
    color: C.subtext,
    letterSpacing: 0.1,
  },

  // Form
  form: {
    gap: 16,
    marginBottom: 28,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.inputBg,
    borderWidth: 1.5,
    borderColor: C.inputBorder,
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 56,
  },
  inputRowFocused: {
    borderColor: C.inputFocus,
    backgroundColor: "rgba(0,217,160,0.06)",
  },
  inputRowError: {
    borderColor: C.error,
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontFamily: "Manrope_400Regular",
    color: C.text,
    height: "100%",
  },
  errorText: {
    fontSize: 13,
    fontFamily: "Manrope_400Regular",
    color: C.error,
    marginTop: -4,
  },
  forgotText: {
    fontSize: 13,
    fontFamily: "Manrope_600SemiBold",
    color: C.subtext,
    marginTop: 4,
  },

  // Login button
  loginBtn: {
    height: 56,
    backgroundColor: C.btnBg,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 32,
    shadowColor: "#00D9A0",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  loginBtnText: {
    fontSize: 16,
    fontFamily: "Manrope_700Bold",
    color: C.btnText,
    letterSpacing: 0.3,
  },

  // Divider
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: C.divider,
  },
  dividerText: {
    fontSize: 13,
    fontFamily: "Manrope_400Regular",
    color: C.subtext,
  },

  // Social
  socialRow: {
    flexDirection: "row",
    gap: 14,
    marginBottom: 36,
  },
  socialBtn: {
    flex: 1,
    height: 52,
    backgroundColor: C.socialBg,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: C.socialBorder,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  socialIcon: {
    fontSize: 16,
    fontFamily: "Manrope_700Bold",
    color: C.text,
  },
  socialLabel: {
    fontSize: 14,
    fontFamily: "Manrope_600SemiBold",
    color: C.text,
  },

  // Footer
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "auto",
  },
  footerText: {
    fontSize: 14,
    fontFamily: "Manrope_400Regular",
    color: C.subtext,
  },
  footerLink: {
    fontSize: 14,
    fontFamily: "Manrope_700Bold",
    color: C.accent,
  },
});
