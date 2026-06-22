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
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@/context/AuthContext";

const logoIcon = require("@/assets/images/logo-icon.png");

const C = {
  bg:          "#0A0A0F",
  surface:     "#14141F",
  inputBg:     "#1C1C2A",
  inputBorder: "#2A2A3D",
  inputFocus:  "#00D9A0",
  text:        "#FFFFFF",
  subtext:     "#8F8FA3",
  placeholder: "#55556A",
  accent:      "#00D9A0",
  btnText:     "#0A0A0F",
  error:       "#FF5B7A",
  divider:     "#2A2A3D",
};

function FinInput({
  placeholder, value, onChangeText, keyboardType, autoCapitalize,
  secureToggle, icon, error,
}: {
  placeholder: string; value: string; onChangeText: (t: string) => void;
  keyboardType?: any; autoCapitalize?: any; secureToggle?: boolean;
  icon: keyof typeof Feather.glyphMap; error?: boolean;
}) {
  const [focused,  setFocused]  = useState(false);
  const [showPw,   setShowPw]   = useState(false);
  return (
    <View style={[s.inputRow, focused && s.inputRowFocused, error && s.inputRowError]}>
      <Feather name={icon} size={18} color={focused ? C.inputFocus : C.placeholder} style={{ marginRight: 12 }} />
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
        <TouchableOpacity onPress={() => setShowPw(v => !v)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Feather name={showPw ? "eye-off" : "eye"} size={18} color={C.placeholder} />
        </TouchableOpacity>
      )}
    </View>
  );
}

export default function RegisterScreen() {
  const router  = useRouter();
  const insets  = useSafeAreaInsets();
  const { register } = useAuth();

  const [name,     setName]     = useState("");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

  const handleRegister = async () => {
    if (!name || !email || !password) { setError("Please fill in all fields."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setLoading(true);
    setError("");
    await register(name, email, password);
    setLoading(false);
    router.replace("/(auth)/pin");
  };

  return (
    <KeyboardAvoidingView style={s.root} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView
        contentContainerStyle={[s.scroll, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 32 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInDown.duration(400).springify()} style={s.topBar}>
          <TouchableOpacity style={s.backBtn} onPress={() => router.back()} activeOpacity={0.75}>
            <Feather name="chevron-left" size={22} color={C.text} />
          </TouchableOpacity>
          <Image source={logoIcon} style={s.logoIcon} contentFit="contain" priority="high" />
        </Animated.View>

        <Animated.View entering={FadeInUp.duration(420).springify().delay(80)} style={s.headingBlock}>
          <Text style={s.welcome}>Create Account</Text>
          <Text style={s.welcomeSub}>Join PAYVORA and start trading today</Text>
        </Animated.View>

        <Animated.View entering={FadeInUp.duration(420).springify().delay(140)} style={s.form}>
          <FinInput
            icon="user"
            placeholder="Enter your full name"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            error={!!error}
          />
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
            placeholder="Create a password"
            value={password}
            onChangeText={setPassword}
            secureToggle
            error={!!error}
          />
          {error ? <Text style={s.errorText}>{error}</Text> : null}
        </Animated.View>

        <Animated.View entering={FadeInUp.duration(420).springify().delay(200)}>
          <TouchableOpacity
            style={[s.registerBtn, loading && { opacity: 0.7 }]}
            onPress={handleRegister}
            activeOpacity={0.85}
            disabled={loading}
          >
            <Text style={s.registerBtnText}>{loading ? "Creating account…" : "Create Account"}</Text>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View entering={FadeInUp.duration(420).springify().delay(260)} style={s.footer}>
          <Text style={s.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={s.footerLink}>Login</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  root:   { flex: 1, backgroundColor: C.bg },
  scroll: { paddingHorizontal: 24, flexGrow: 1 },

  topBar: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 40 },
  backBtn: {
    width: 44, height: 44, borderRadius: 14,
    backgroundColor: C.surface, alignItems: "center", justifyContent: "center",
    borderWidth: 1, borderColor: C.inputBorder,
  },
  logoIcon: { width: 44, height: 44, borderRadius: 12 },

  headingBlock: { marginBottom: 36 },
  welcome:      { fontSize: 32, fontFamily: "Manrope_700Bold", color: C.text, letterSpacing: -0.8, marginBottom: 4 },
  welcomeSub:   { fontSize: 16, fontFamily: "Manrope_400Regular", color: C.subtext },

  form: { gap: 16, marginBottom: 28 },
  inputRow: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: C.inputBg, borderWidth: 1.5, borderColor: C.inputBorder,
    borderRadius: 14, paddingHorizontal: 16, height: 56,
  },
  inputRowFocused: { borderColor: C.inputFocus, backgroundColor: "rgba(0,217,160,0.06)" },
  inputRowError:   { borderColor: C.error },
  input: { flex: 1, fontSize: 15, fontFamily: "Manrope_400Regular", color: C.text, height: "100%" },
  errorText: { fontSize: 13, fontFamily: "Manrope_400Regular", color: C.error },

  registerBtn: {
    height: 56, backgroundColor: C.accent, borderRadius: 14,
    alignItems: "center", justifyContent: "center", marginBottom: 32,
    shadowColor: C.accent, shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28, shadowRadius: 16, elevation: 8,
  },
  registerBtnText: { fontSize: 16, fontFamily: "Manrope_700Bold", color: C.btnText, letterSpacing: 0.3 },

  footer:     { flexDirection: "row", justifyContent: "center", alignItems: "center", marginTop: "auto" },
  footerText: { fontSize: 14, fontFamily: "Manrope_400Regular", color: C.subtext },
  footerLink: { fontSize: 14, fontFamily: "Manrope_700Bold", color: C.accent },
});
