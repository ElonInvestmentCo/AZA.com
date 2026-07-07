import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { PayvoraWordmark } from "@/components/PayvoraWordmark";
import * as Haptics from "expo-haptics";
import { PasswordInput } from "@/components/PasswordInput";
import SocialAuthButtons from "@/components/SocialAuthButtons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@/context/AuthContext";
import { rf } from "@/utils/responsive";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Linking from "expo-linking";
import auth from "@react-native-firebase/auth";
import firestore, { serverTimestamp } from "@react-native-firebase/firestore";

/* ─── Design tokens ──────────────────────────────────────────────────────── */
const C = {
  bg:           "#FFFFFF",
  inputBg:      "#F7F8F9",
  inputBorder:  "#E8ECF4",
  inputFocus:   "#1E232C",
  text:         "#1E232C",
  placeholder:  "#8391A1",
  subtext:      "#6A707C",
  loginBtn:     "#000000",
  loginBtnText: "#FFFFFF",
  forgotText:   "#6A707C",
  divider:      "#E8ECF4",
  dividerText:  "#1E232C",
  socialBg:     "#FFFFFF",
  socialBorder: "#E8ECF4",
  footerText:   "#1E232C",
  footerLink:   "#35C2C1",
  backBg:       "#FFFFFF",
  backBorder:   "#E8ECF4",
  backIcon:     "#1E232C",
  error:        "#FF5B7A",
  accent:       "#00D9A0",
  accentBg:     "#F0FDF9",
  accentBorder: "#A7F3D0",
};

const MAGIC_LINK_EMAIL_KEY = "@payvora/magic_link_email";

const ACTION_CODE_SETTINGS = {
  // Deep link target — caught by iOS Associated Domains + Android intent filter
  url: "https://payvora-2026.web.app/__/auth/action",
  handleCodeInApp: true,
  iOS:     { bundleId: "com.payvora.mobile" },
  android: { packageName: "com.payvora.mobile", installApp: true },
  dynamicLinkDomain: "payvora-2026.web.app",
};

const fingerprintImg = require("@/assets/images/fingerprint.png");

/* ─── Initialise Firestore user document after first sign-in ─────────────── */
async function initUserDoc(fbUser: { uid: string; email: string | null }) {
  const ref = firestore().collection("users").doc(fbUser.uid);
  const snap = await ref.get();
  if (!snap.exists) {
    await ref.set({
      uid:                fbUser.uid,
      email:              fbUser.email ?? "",
      displayName:        "Valued PayVora Member",
      walletBalanceNaira: 0,
      createdAt:          serverTimestamp(),
    });
  }
}

/* ─── Email input ────────────────────────────────────────────────────────── */
function EmailInput({
  placeholder,
  value,
  onChangeText,
  error,
  onSubmitEditing,
}: {
  placeholder: string;
  value: string;
  onChangeText: (t: string) => void;
  error?: boolean;
  onSubmitEditing?: () => void;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <View style={[inp.wrap, focused && inp.focused, error && inp.errored]}>
      <TextInput
        style={inp.field}
        placeholder={placeholder}
        placeholderTextColor={C.placeholder}
        value={value}
        onChangeText={onChangeText}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        textContentType="emailAddress"
        autoComplete="email"
        returnKeyType="next"
        onSubmitEditing={onSubmitEditing}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
    </View>
  );
}

const inp = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.inputBg,
    borderWidth: 1,
    borderColor: C.inputBorder,
    borderRadius: 14,
    paddingHorizontal: 18,
    height: 58,
  },
  focused: { borderColor: C.inputFocus },
  errored: { borderColor: C.error },
  field: {
    flex: 1,
    fontSize: 15,
    fontFamily: "Manrope_400Regular",
    color: C.text,
    height: "100%",
  },
});

/* ─── Animated link button ───────────────────────────────────────────────── */
function LinkBtn({
  onPress,
  style,
  textStyle,
  label,
}: {
  onPress: () => void;
  style?: object;
  textStyle: object;
  label: string;
}) {
  const op = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({ opacity: op.value }));
  return (
    <Animated.View style={[animStyle, style]}>
      <Pressable
        onPress={onPress}
        onPressIn={() => { op.value = withTiming(0.5, { duration: 80 }); }}
        onPressOut={() => { op.value = withSpring(1, { damping: 14, stiffness: 280 }); }}
        hitSlop={{ top: 10, bottom: 10, left: 8, right: 8 }}
      >
        <Text style={textStyle}>{label}</Text>
      </Pressable>
    </Animated.View>
  );
}

/* ─── Auth mode tabs ─────────────────────────────────────────────────────── */
type AuthMode = "magic" | "password";

function AuthModeTabs({
  mode,
  onChange,
}: {
  mode: AuthMode;
  onChange: (m: AuthMode) => void;
}) {
  return (
    <View style={tab.wrap}>
      <Pressable
        style={[tab.btn, mode === "magic" && tab.btnActive]}
        onPress={() => onChange("magic")}
      >
        <Text style={[tab.text, mode === "magic" && tab.textActive]}>
          Magic Link
        </Text>
      </Pressable>
      <Pressable
        style={[tab.btn, mode === "password" && tab.btnActive]}
        onPress={() => onChange("password")}
      >
        <Text style={[tab.text, mode === "password" && tab.textActive]}>
          Password
        </Text>
      </Pressable>
    </View>
  );
}

const tab = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    backgroundColor: C.inputBg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: C.inputBorder,
    padding: 4,
    marginBottom: 24,
  },
  btn: {
    flex: 1,
    paddingVertical: 9,
    alignItems: "center",
    borderRadius: 9,
  },
  btnActive: {
    backgroundColor: C.loginBtn,
  },
  text: {
    fontSize: 14,
    fontFamily: "Manrope_600SemiBold",
    color: C.subtext,
  },
  textActive: {
    color: "#FFFFFF",
  },
});

/* ─── Magic link sent confirmation card ─────────────────────────────────── */
function MagicLinkSentCard({
  email,
  onResend,
  sending,
}: {
  email: string;
  onResend: () => void;
  sending: boolean;
}) {
  return (
    <Animated.View entering={FadeIn.duration(300)} style={card.wrap}>
      <View style={card.iconWrap}>
        <Ionicons name="mail-unread-outline" size={28} color={C.accent} />
      </View>
      <Text style={card.title}>Check your inbox</Text>
      <Text style={card.body}>
        We sent a sign-in link to{"\n"}
        <Text style={card.email}>{email}</Text>
      </Text>
      <Text style={card.sub}>
        Tap the link in the email to complete sign-in. The link expires in 1 hour.
      </Text>
      <Pressable
        style={[card.resendBtn, sending && { opacity: 0.6 }]}
        onPress={onResend}
        disabled={sending}
      >
        {sending ? (
          <ActivityIndicator color={C.accent} size="small" />
        ) : (
          <Text style={card.resendText}>Resend link</Text>
        )}
      </Pressable>
    </Animated.View>
  );
}

const card = StyleSheet.create({
  wrap: {
    backgroundColor: C.accentBg,
    borderWidth: 1,
    borderColor: C.accentBorder,
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    gap: 10,
    marginBottom: 24,
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  title: {
    fontSize: rf(17),
    fontFamily: "Manrope_700Bold",
    color: C.text,
  },
  body: {
    fontSize: 14,
    fontFamily: "Manrope_400Regular",
    color: C.subtext,
    textAlign: "center",
    lineHeight: 21,
  },
  email: {
    fontFamily: "Manrope_700Bold",
    color: C.text,
  },
  sub: {
    fontSize: 12,
    fontFamily: "Manrope_400Regular",
    color: C.subtext,
    textAlign: "center",
    lineHeight: 18,
  },
  resendBtn: {
    marginTop: 4,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: C.accent,
  },
  resendText: {
    fontSize: 13,
    fontFamily: "Manrope_600SemiBold",
    color: C.accent,
  },
});

/* ─── Main screen ────────────────────────────────────────────────────────── */
export default function LoginScreen() {
  const router    = useRouter();
  const insets    = useSafeAreaInsets();
  const { login } = useAuth();
  const { width } = useWindowDimensions();
  const fingerprintSize = Math.min(Math.round(width * 0.24), 100);

  const passwordRef = useRef<TextInput>(null);

  /* ── Shared state ── */
  const [authMode,    setAuthMode]    = useState<AuthMode>("magic");
  const [email,       setEmail]       = useState("");
  const [password,    setPassword]    = useState("");
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState("");
  const [socialError, setSocialError] = useState("");

  /* ── Magic-link specific ── */
  const [linkSent,    setLinkSent]    = useState(false);
  const [resending,   setResending]   = useState(false);

  /* ── Animations ── */
  const btnSc    = useSharedValue(1);
  const btnStyle = useAnimatedStyle(() => ({ transform: [{ scale: btnSc.value }] }));
  const shakeX     = useSharedValue(0);
  const shakeStyle = useAnimatedStyle(() => ({ transform: [{ translateX: shakeX.value }] }));

  const triggerShake = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    shakeX.value = withSequence(
      withTiming(-8, { duration: 55 }),
      withTiming(8,  { duration: 55 }),
      withTiming(-5, { duration: 55 }),
      withTiming(5,  { duration: 55 }),
      withTiming(0,  { duration: 55 }),
    );
  };

  /* ─── Deep-link interception ──────────────────────────────────────────── */
  const handleDeepLink = async (url: string) => {
    if (!auth().isSignInWithEmailLink(url)) return;
    try {
      // Retrieve the email we cached before sending the link
      const savedEmail = await AsyncStorage.getItem(MAGIC_LINK_EMAIL_KEY);
      if (!savedEmail) {
        setError("Could not find saved email. Please request a new link.");
        setLinkSent(false);
        return;
      }
      setLoading(true);
      const result = await auth().signInWithEmailLink(savedEmail, url);
      await AsyncStorage.removeItem(MAGIC_LINK_EMAIL_KEY);
      await initUserDoc({
        uid:   result.user.uid,
        email: result.user.email,
      });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace("/(tabs)");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Sign-in failed.";
      setError(msg);
      setLinkSent(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Handle the app being opened FROM the magic link while cold-started
    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLink(url);
    });

    // Handle the app receiving the magic link while already running
    const sub = Linking.addEventListener("url", ({ url }) => {
      handleDeepLink(url);
    });

    return () => sub.remove();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* ─── Send magic link ─────────────────────────────────────────────────── */
  const sendMagicLink = async (isResend = false) => {
    const trimmed = email.trim();
    if (!trimmed) {
      setError("Please enter your email address.");
      triggerShake();
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError("Please enter a valid email address.");
      triggerShake();
      return;
    }

    if (isResend) setResending(true);
    else          setLoading(true);
    setError("");

    try {
      await auth().sendSignInLinkToEmail(trimmed, ACTION_CODE_SETTINGS);
      await AsyncStorage.setItem(MAGIC_LINK_EMAIL_KEY, trimmed);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setLinkSent(true);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to send link.";
      setError(msg);
      if (!isResend) triggerShake();
    } finally {
      setLoading(false);
      setResending(false);
    }
  };

  /* ─── Password login (existing JWT flow) ─────────────────────────────── */
  const handlePasswordLogin = async () => {
    if (!email || !password) {
      setError("Please enter your email and password.");
      triggerShake();
      return;
    }
    setLoading(true);
    setError("");
    const ok = await login(email, password);
    setLoading(false);
    if (ok) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace("/(auth)/otp");
    } else {
      setError("Invalid credentials. Please try again.");
      triggerShake();
    }
  };

  const handleModeChange = (m: AuthMode) => {
    setAuthMode(m);
    setError("");
    setLinkSent(false);
  };

  return (
    <KeyboardAvoidingView
      style={s.root}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <StatusBar style="dark" />

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
            <Ionicons name="chevron-back" size={22} color={C.backIcon} />
          </Pressable>
          <PayvoraWordmark width={164} height={42} />
          <View style={{ width: 44 }} />
        </Animated.View>

        {/* ── Fingerprint / icon ── */}
        <Animated.View
          entering={FadeInDown.duration(500).delay(80).springify()}
          style={s.fingerprintWrap}
        >
          <Image
            source={fingerprintImg}
            style={{ width: fingerprintSize, height: fingerprintSize }}
            contentFit="contain"
            cachePolicy="memory-disk"
          />
        </Animated.View>

        {/* ── Auth mode tabs ── */}
        <Animated.View entering={FadeInUp.duration(380).delay(100).springify()}>
          <AuthModeTabs mode={authMode} onChange={handleModeChange} />
        </Animated.View>

        {/* ── Magic-link flow ── */}
        {authMode === "magic" && (
          <Animated.View
            entering={FadeIn.duration(260)}
            exiting={FadeOut.duration(160)}
          >
            {linkSent ? (
              <>
                <MagicLinkSentCard
                  email={email}
                  onResend={() => sendMagicLink(true)}
                  sending={resending}
                />
                <LinkBtn
                  onPress={() => { setLinkSent(false); setError(""); }}
                  style={s.switchLink}
                  textStyle={s.switchLinkText}
                  label="← Use a different email"
                />
              </>
            ) : (
              <Animated.View style={[s.form, shakeStyle]}>
                <EmailInput
                  placeholder="Enter your email"
                  value={email}
                  onChangeText={t => { setEmail(t); setError(""); }}
                  error={!!error}
                  onSubmitEditing={() => sendMagicLink()}
                />
                {error ? (
                  <Animated.Text entering={FadeIn.duration(200)} style={s.errorText}>
                    {error}
                  </Animated.Text>
                ) : null}

                <Animated.View style={btnStyle}>
                  <Pressable
                    style={[s.loginBtn, s.loginBtnAccent, loading && { opacity: 0.72 }]}
                    onPress={() => sendMagicLink()}
                    onPressIn={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                      btnSc.value = withSpring(0.96, { damping: 13, stiffness: 300 });
                    }}
                    onPressOut={() => {
                      btnSc.value = withSpring(1.0, { damping: 13, stiffness: 300 });
                    }}
                    disabled={loading}
                  >
                    {loading ? (
                      <ActivityIndicator color="#FFFFFF" size="small" />
                    ) : (
                      <>
                        <Ionicons name="mail-outline" size={17} color="#FFFFFF" style={{ marginRight: 6 }} />
                        <Text style={s.loginBtnText}>Send Magic Link</Text>
                      </>
                    )}
                  </Pressable>
                </Animated.View>

                <Text style={s.magicHint}>
                  We'll email you a secure, one-tap sign-in link — no password needed.
                </Text>
              </Animated.View>
            )}
          </Animated.View>
        )}

        {/* ── Password flow ── */}
        {authMode === "password" && (
          <Animated.View
            entering={FadeIn.duration(260)}
            exiting={FadeOut.duration(160)}
          >
            <Animated.View style={[s.form, shakeStyle]}>
              <EmailInput
                placeholder="Enter your email"
                value={email}
                onChangeText={t => { setEmail(t); setError(""); }}
                error={!!error}
                onSubmitEditing={() => passwordRef.current?.focus()}
              />
              <PasswordInput
                value={password}
                onChangeText={t => { setPassword(t); setError(""); }}
                error={!!error}
                textContentType="password"
                returnKeyType="done"
                onSubmitEditing={handlePasswordLogin}
              />
              {error ? (
                <Animated.Text entering={FadeIn.duration(200)} style={s.errorText}>
                  {error}
                </Animated.Text>
              ) : null}
              <LinkBtn
                onPress={() => { Haptics.selectionAsync(); router.push("/(auth)/forgot-password"); }}
                style={s.forgotWrap}
                textStyle={s.forgotText}
                label="Forgot Password?"
              />
            </Animated.View>

            <Animated.View style={[s.btnWrap, btnStyle]}>
              <Pressable
                style={[s.loginBtn, loading && { opacity: 0.75 }]}
                onPress={handlePasswordLogin}
                onPressIn={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  btnSc.value = withSpring(0.96, { damping: 13, stiffness: 300 });
                }}
                onPressOut={() => {
                  btnSc.value = withSpring(1.0, { damping: 13, stiffness: 300 });
                }}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color={C.loginBtnText} size="small" />
                ) : (
                  <Text style={s.loginBtnText}>Login</Text>
                )}
              </Pressable>
            </Animated.View>
          </Animated.View>
        )}

        {/* ── Divider ── */}
        <Animated.View
          entering={FadeInUp.duration(380).delay(260).springify()}
          style={s.dividerRow}
        >
          <View style={s.dividerLine} />
          <Text style={s.dividerText}>Or continue with</Text>
          <View style={s.dividerLine} />
        </Animated.View>

        {/* ── Social buttons ── */}
        <Animated.View
          entering={FadeInUp.duration(380).delay(300).springify()}
          style={s.socialWrap}
        >
          <SocialAuthButtons
            onSuccess={() => router.replace("/(tabs)")}
            onError={msg => { setSocialError(msg); Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error); }}
          />
          {socialError ? (
            <Animated.Text entering={FadeIn.duration(200)} style={s.socialError}>
              {socialError}
            </Animated.Text>
          ) : null}
        </Animated.View>

        {/* ── Footer ── */}
        <Animated.View
          entering={FadeInUp.duration(380).delay(340).springify()}
          style={s.footer}
        >
          <Text style={s.footerText}>Don't have an account? </Text>
          <LinkBtn
            onPress={() => router.push("/(auth)/register")}
            textStyle={s.footerLink}
            label="Register Now"
          />
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

/* ─── Styles ──────────────────────────────────────────────────────────────── */
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
    borderColor: C.backBorder,
    backgroundColor: C.backBg,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 1,
  },

  fingerprintWrap: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 32,
    marginTop: 8,
  },

  form:      { gap: 16, marginBottom: 24 },
  errorText: {
    fontSize: 13,
    fontFamily: "Manrope_400Regular",
    color: C.error,
    textAlign: "center",
  },
  forgotWrap:  { alignSelf: "flex-end", marginTop: 2 },
  forgotText:  {
    fontSize: 14,
    fontFamily: "Manrope_600SemiBold",
    color: C.forgotText,
  },
  magicHint: {
    fontSize: 12,
    fontFamily: "Manrope_400Regular",
    color: C.subtext,
    textAlign: "center",
    lineHeight: 18,
    marginTop: 6,
  },
  switchLink: { alignSelf: "center", marginBottom: 8 },
  switchLinkText: {
    fontSize: 13,
    fontFamily: "Manrope_500Medium",
    color: C.subtext,
  },

  btnWrap: { marginBottom: 24 },
  loginBtn: {
    height: 60,
    backgroundColor: C.loginBtn,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 6,
  },
  loginBtnAccent: {
    backgroundColor: "#0A0A0F",
  },
  loginBtnText: {
    fontSize: rf(16),
    fontFamily: "Manrope_700Bold",
    color: C.loginBtnText,
    letterSpacing: 0.2,
  },

  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: "#E8ECF4" },
  dividerText: {
    marginHorizontal: 12,
    fontSize: 14,
    fontFamily: "Manrope_400Regular",
    color: "#6A707C",
  },

  socialWrap:  { marginBottom: 24, gap: 10 },
  socialError: {
    fontSize: 13,
    fontFamily: "Manrope_400Regular",
    color: "#FF5B7A",
    textAlign: "center",
    marginTop: 4,
  },

  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "auto",
    paddingTop: 24,
  },
  footerText: {
    fontSize: rf(15),
    fontFamily: "Manrope_400Regular",
    color: C.footerText,
  },
  footerLink: {
    fontSize: rf(15),
    fontFamily: "Manrope_700Bold",
    color: C.footerLink,
  },
});
