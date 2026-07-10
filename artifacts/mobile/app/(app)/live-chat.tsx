import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useCallback, useRef, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const C = {
  bg:      "#FFFFFF",
  text:    "#0B0A0A",
  textSec: "#6A707C",
  border:  "#E8ECF4",
  inputBg: "#F7F8F9",
  teal:    "#35C2C1",
  bubbleMe: "#0B0A0A",
};

type Msg = { id: string; from: "me" | "agent"; text: string; time: string };

const now = () => new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

const AUTO_REPLIES = [
  "Thanks for reaching out! A support agent will be with you shortly.",
  "Got it — could you share your transaction reference so I can look into this?",
  "I've noted the details. Our team typically resolves this within a few hours.",
];

export default function LiveChatScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 48 : insets.top + 8;
  const listRef = useRef<FlatList<Msg>>(null);

  const [messages, setMessages] = useState<Msg[]>([
    {
      id: "welcome",
      from: "agent",
      text: "Hi! Welcome to PAYVORA support. Our team is online 9am–6pm WAT. How can we help you today?",
      time: now(),
    },
  ]);
  const [draft, setDraft] = useState("");
  const replyIndex = useRef(0);

  const send = useCallback(() => {
    const text = draft.trim();
    if (!text) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const userMsg: Msg = { id: `me-${Date.now()}`, from: "me", text, time: now() };
    setMessages(prev => [...prev, userMsg]);
    setDraft("");

    setTimeout(() => {
      const reply = AUTO_REPLIES[replyIndex.current % AUTO_REPLIES.length];
      replyIndex.current += 1;
      setMessages(prev => [...prev, { id: `agent-${Date.now()}`, from: "agent", text: reply, time: now() }]);
      listRef.current?.scrollToEnd({ animated: true });
    }, 700);

    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 50);
  }, [draft]);

  return (
    <KeyboardAvoidingView
      style={[s.root, { paddingTop: topPad }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <Animated.View entering={FadeInDown.duration(280)} style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.back(); }} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Feather name="arrow-left" size={22} color={C.text} />
        </TouchableOpacity>
        <View style={{ alignItems: "center" }}>
          <Text style={s.headerTitle}>Live Chat</Text>
          <View style={s.statusRow}>
            <View style={s.statusDot} />
            <Text style={s.statusText}>Online</Text>
          </View>
        </View>
        <View style={{ width: 40 }} />
      </Animated.View>

      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={m => m.id}
        contentContainerStyle={s.list}
        renderItem={({ item }) => (
          <Animated.View
            entering={FadeInUp.duration(220)}
            style={[s.bubbleRow, item.from === "me" && s.bubbleRowMe]}
          >
            <View style={[s.bubble, item.from === "me" ? s.bubbleMe : s.bubbleAgent]}>
              <Text style={item.from === "me" ? s.bubbleTextMe : s.bubbleTextAgent}>{item.text}</Text>
            </View>
            <Text style={[s.time, item.from === "me" && { textAlign: "right" }]}>{item.time}</Text>
          </Animated.View>
        )}
      />

      <View style={[s.inputRow, { paddingBottom: insets.bottom + 12 }]}>
        <TextInput
          style={s.input}
          placeholder="Type a message…"
          placeholderTextColor={C.textSec}
          value={draft}
          onChangeText={setDraft}
          onSubmitEditing={send}
          returnKeyType="send"
          multiline
        />
        <TouchableOpacity style={s.sendBtn} onPress={send} activeOpacity={0.8} disabled={!draft.trim()}>
          <Feather name="send" size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg, paddingHorizontal: 20 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 },
  backBtn: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: 16, fontFamily: "Manrope_700Bold", color: C.text },
  statusRow: { flexDirection: "row", alignItems: "center", gap: 5, marginTop: 2 },
  statusDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: C.teal },
  statusText: { fontSize: 11, fontFamily: "Manrope_500Medium", color: C.textSec },

  list: { paddingVertical: 12, gap: 14 },
  bubbleRow: { maxWidth: "82%", alignSelf: "flex-start" },
  bubbleRowMe: { alignSelf: "flex-end" },
  bubble: { borderRadius: 16, paddingHorizontal: 14, paddingVertical: 10 },
  bubbleAgent: { backgroundColor: C.inputBg, borderBottomLeftRadius: 4 },
  bubbleMe: { backgroundColor: C.bubbleMe, borderBottomRightRadius: 4 },
  bubbleTextAgent: { fontSize: 14, fontFamily: "Manrope_400Regular", color: C.text, lineHeight: 20 },
  bubbleTextMe: { fontSize: 14, fontFamily: "Manrope_400Regular", color: "#FFFFFF", lineHeight: 20 },
  time: { fontSize: 10, fontFamily: "Manrope_400Regular", color: C.textSec, marginTop: 4, marginHorizontal: 4 },

  inputRow: { flexDirection: "row", alignItems: "flex-end", gap: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: C.border },
  input: { flex: 1, backgroundColor: C.inputBg, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10, fontSize: 14, fontFamily: "Manrope_400Regular", color: C.text, maxHeight: 100 },
  sendBtn: { width: 42, height: 42, borderRadius: 21, backgroundColor: C.text, alignItems: "center", justifyContent: "center" },
});
