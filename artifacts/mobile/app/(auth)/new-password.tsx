import { Image } from "expo-image";
import * as Haptics from "expo-haptics";
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

const eyeOpenImg   = require("../../assets/images/eye-open.svg");
const eyeClosedImg = require("../../assets/images/eye-closed.svg");

const C = {
  bg:          "#FFFFFF",
  dark:        "#1E232C",
  gray:        "#8391A1",
  inputBg:     "#F7F8F9",
  inputBorder: "#DADADA",
  inputFocus:  "#1E232C",
  white:       "#FFFFFF",
  btnBorder:   "#E8ECF4",
  error:       "#E74C3C",
};

function PasswordInput({
  placeholder,
  value,
  onChangeText,
}: {
  placeholder: string;
  value: string;
  onChangeText: (t: string) => void;
}) {
  const [focused,  setFocused]  = useState(false);
  const [showPass, setShowPass] = useState(false);
  return (
    <View style={[inp.row, focused && inp.focused]}>
      <TextInput
        style={inp.input}
        placeholder={placeholder}
        placeholderTextColor={C.gray}
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
    backgroundColor: C.inputBg,
    borderWidth: 1,
    borderColor: C.inputBorder,
    borderRadius: 8,
    paddingHorizontal: 18,
  },
  focused: { borderColor: C.inputFocus },
  input: {
    flex: 1,
    fontSize: 15,
    fontFamily: "Urbanist_500Medium",
    color: C.dark,
    height: "100%",
  },
  eyeBtn: { paddingLeft: 8 },
});

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
          { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 32 },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* ── AZA. header ── */}
        <Animated.View entering={FadeInUp.duration(380).springify()} style={s.header}>
          <Text style={s.brand}>AZA.</Text>
        </Animated.View>

        {/* ── Back button ── */}
        <Animated.View entering={FadeInUp.duration(380).delay(40).springify()} style={s.backRow}>
          <TouchableOpacity
            style={s.backBtn}
            onPress={() => router.back()}
            activeOpacity={0.78}
          >
            <Text style={s.backArrow}>‹</Text>
          </TouchableOpacity>
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
          />
          <PasswordInput
            placeholder="Confirm Password"
            value={confirm}
            onChangeText={t => { setConfirm(t); setError(""); }}
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
  scroll: { paddingHorizontal: 28, flexGrow: 1 },

  header: { alignItems: "center", marginBottom: 32 },
  brand: {
    fontSize: 28,
    fontFamily: "Urbanist_700Bold",
    color: C.dark,
    letterSpacing: 0.5,
  },

  backRow: { marginBottom: 32 },
  backBtn: {
    width: 41,
    height: 41,
    borderRadius: 12,
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: C.btnBorder,
    alignItems: "center",
    justifyContent: "center",
  },
  backArrow: {
    fontSize: 26,
    color: C.dark,
    lineHeight: 30,
    marginTop: -2,
  },

  titleBlock: { marginBottom: 32 },
  heading: {
    fontSize: 30,
    fontFamily: "Urbanist_700Bold",
    color: C.dark,
    letterSpacing: -0.3,
    lineHeight: 39,
    marginBottom: 12,
  },
  subText: {
    fontSize: 16,
    fontFamily: "Urbanist_500Medium",
    color: C.gray,
    lineHeight: 24,
  },

  formBlock: { gap: 16, marginBottom: 24 },
  errorText: {
    fontSize: 13,
    fontFamily: "Urbanist_500Medium",
    color: C.error,
  },

  btnWrap: {},
  resetBtn: {
    height: 56,
    backgroundColor: C.dark,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  resetBtnText: {
    fontSize: 15,
    fontFamily: "Urbanist_600SemiBold",
    color: C.white,
    textAlign: "center",
  },
});
