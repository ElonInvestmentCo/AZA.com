import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import {
  Alert,
  Keyboard,
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
import { useWallet } from "@/context/WalletContext";

const RECENT_CONTACTS = [
  { id: "1", name: "Alex K.", initial: "A", color: "#3B82F6" },
  { id: "2", name: "Sarah M.", initial: "S", color: "#8B5CF6" },
  { id: "3", name: "James T.", initial: "J", color: "#F59E0B" },
  { id: "4", name: "Emma R.", initial: "E", color: "#EF4444" },
  { id: "5", name: "Lucas B.", initial: "L", color: "#00D9A0" },
];

const WALLET_ADDRESS = "0x7f3a...9b2c";

export default function SendScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { balance, addTransaction } = useWallet();
  const [activeTab, setActiveTab] = useState<"send" | "receive">("send");
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [copied, setCopied] = useState(false);

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  async function handleSend() {
    Keyboard.dismiss();
    const num = parseFloat(amount);
    if (!recipient.trim()) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Error", "Please enter a recipient");
      return;
    }
    if (!num || num <= 0) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Error", "Please enter a valid amount");
      return;
    }
    if (num > balance) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Insufficient funds", "You don't have enough balance");
      return;
    }
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    addTransaction({
      type: "send",
      title: `Sent to ${recipient}`,
      subtitle: note || "Transfer",
      amount: -num,
      currency: "USD",
      status: "completed",
      icon: "arrow-up-circle",
    });
    setRecipient("");
    setAmount("");
    setNote("");
    Alert.alert("Sent!", `$${num.toFixed(2)} sent successfully`);
  }

  function handleCopy() {
    setCopied(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setTimeout(() => setCopied(false), 2000);
  }

  const QUICK_AMOUNTS = ["10", "25", "50", "100", "250", "500"];

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={{ paddingTop: topPad, paddingBottom: (Platform.OS === "web" ? 34 : 0) + 100 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.foreground }]}>
            {activeTab === "send" ? "Send Money" : "Receive"}
          </Text>
        </View>

        {/* Tab Toggle */}
        <View style={[styles.tabContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {(["send", "receive"] as const).map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.tabBtn,
                activeTab === tab && { backgroundColor: colors.primary },
              ]}
              onPress={async () => {
                await Haptics.selectionAsync();
                setActiveTab(tab);
              }}
            >
              <Text
                style={[
                  styles.tabBtnText,
                  { color: activeTab === tab ? colors.primaryForeground : colors.mutedForeground },
                ]}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {activeTab === "send" ? (
          <View style={styles.content}>
            {/* Balance Chip */}
            <View style={[styles.balanceChip, { backgroundColor: colors.primary + "15", borderColor: colors.primary + "30" }]}>
              <Feather name="credit-card" size={14} color={colors.primary} />
              <Text style={[styles.balanceChipText, { color: colors.primary }]}>
                Available: ${balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </Text>
            </View>

            {/* Recent Contacts */}
            <View style={styles.section}>
              <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>Recent</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.contactsScroll}>
                {RECENT_CONTACTS.map((c) => (
                  <TouchableOpacity
                    key={c.id}
                    style={styles.contact}
                    onPress={async () => {
                      await Haptics.selectionAsync();
                      setRecipient(c.name);
                    }}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.contactAvatar, { backgroundColor: c.color + "25" }]}>
                      <Text style={{ color: c.color, fontSize: 16, fontFamily: "Inter_700Bold" }}>{c.initial}</Text>
                    </View>
                    <Text style={[styles.contactName, { color: colors.mutedForeground }]}>{c.name.split(" ")[0]}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Form */}
            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.mutedForeground }]}>Recipient</Text>
                <View style={[styles.inputWrapper, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <Feather name="user" size={18} color={colors.mutedForeground} style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, { color: colors.foreground }]}
                    value={recipient}
                    onChangeText={setRecipient}
                    placeholder="Name, email or address"
                    placeholderTextColor={colors.mutedForeground}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.mutedForeground }]}>Amount (USD)</Text>
                <View style={[styles.inputWrapper, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <Text style={{ color: colors.mutedForeground, fontSize: 18, marginRight: 8, fontFamily: "Inter_600SemiBold" }}>$</Text>
                  <TextInput
                    style={[styles.input, { color: colors.foreground, fontSize: 24, fontFamily: "Inter_700Bold" }]}
                    value={amount}
                    onChangeText={setAmount}
                    placeholder="0.00"
                    placeholderTextColor={colors.mutedForeground}
                    keyboardType="decimal-pad"
                  />
                </View>
              </View>

              {/* Quick Amounts */}
              <View style={styles.quickAmounts}>
                {QUICK_AMOUNTS.map((q) => (
                  <TouchableOpacity
                    key={q}
                    style={[styles.quickAmount, { backgroundColor: colors.card, borderColor: colors.border }]}
                    onPress={() => { setAmount(q); Haptics.selectionAsync(); }}
                  >
                    <Text style={[styles.quickAmountText, { color: colors.foreground }]}>${q}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.mutedForeground }]}>Note (optional)</Text>
                <View style={[styles.inputWrapper, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <Feather name="message-circle" size={18} color={colors.mutedForeground} style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, { color: colors.foreground }]}
                    value={note}
                    onChangeText={setNote}
                    placeholder="What's it for?"
                    placeholderTextColor={colors.mutedForeground}
                  />
                </View>
              </View>

              <TouchableOpacity
                style={[styles.sendBtn, { backgroundColor: colors.primary }]}
                onPress={handleSend}
                activeOpacity={0.85}
              >
                <Feather name="send" size={18} color={colors.primaryForeground} />
                <Text style={[styles.sendBtnText, { color: colors.primaryForeground }]}>Send Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.content}>
            {/* QR Code Placeholder */}
            <View style={styles.qrSection}>
              <View style={[styles.qrContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <View style={[styles.qrCode, { borderColor: colors.primary }]}>
                  {/* QR pattern simulation */}
                  {Array.from({ length: 5 }, (_, row) => (
                    <View key={row} style={styles.qrRow}>
                      {Array.from({ length: 5 }, (_, col) => (
                        <View
                          key={col}
                          style={[
                            styles.qrCell,
                            {
                              backgroundColor:
                                (row === 0 && col < 3) || (col === 0 && row < 3) || (row === 4 && col > 1) || (col === 4 && row > 1) || (row === 2 && col === 2)
                                  ? colors.primary
                                  : "transparent",
                            },
                          ]}
                        />
                      ))}
                    </View>
                  ))}
                </View>
                <Text style={[styles.qrLabel, { color: colors.foreground }]}>Scan to Pay</Text>
                <Text style={[styles.qrSubLabel, { color: colors.mutedForeground }]}>or share your address below</Text>
              </View>

              <View style={[styles.addressBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <Text style={[styles.addressLabel, { color: colors.mutedForeground }]}>Your Wallet Address</Text>
                <Text style={[styles.address, { color: colors.foreground }]}>{WALLET_ADDRESS}</Text>
                <TouchableOpacity
                  style={[styles.copyBtn, { backgroundColor: copied ? colors.primary : colors.primary + "20", borderColor: colors.primary + "40" }]}
                  onPress={handleCopy}
                  activeOpacity={0.85}
                >
                  <Feather name={copied ? "check" : "copy"} size={16} color={copied ? colors.primaryForeground : colors.primary} />
                  <Text style={[styles.copyBtnText, { color: copied ? colors.primaryForeground : colors.primary }]}>
                    {copied ? "Copied!" : "Copy Address"}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.receiveOptions}>
                {[
                  { icon: "share-2", label: "Share Link" },
                  { icon: "download", label: "Save QR" },
                ].map((opt) => (
                  <TouchableOpacity
                    key={opt.label}
                    style={[styles.receiveOpt, { backgroundColor: colors.card, borderColor: colors.border }]}
                    onPress={() => Haptics.selectionAsync()}
                  >
                    <Feather name={opt.icon as any} size={20} color={colors.foreground} />
                    <Text style={[styles.receiveOptText, { color: colors.foreground }]}>{opt.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 24, paddingBottom: 20 },
  title: { fontSize: 28, fontFamily: "Inter_700Bold", letterSpacing: -0.5 },
  tabContainer: {
    flexDirection: "row", marginHorizontal: 24, borderRadius: 14, borderWidth: 1,
    padding: 4, marginBottom: 24,
  },
  tabBtn: { flex: 1, paddingVertical: 10, borderRadius: 11, alignItems: "center" },
  tabBtnText: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  content: { paddingHorizontal: 24 },
  balanceChip: {
    flexDirection: "row", alignItems: "center", gap: 6,
    alignSelf: "flex-start", borderRadius: 10, borderWidth: 1, paddingHorizontal: 12, paddingVertical: 6, marginBottom: 20,
  },
  balanceChipText: { fontSize: 13, fontFamily: "Inter_500Medium" },
  section: { marginBottom: 24 },
  sectionLabel: { fontSize: 13, fontFamily: "Inter_500Medium", marginBottom: 12 },
  contactsScroll: { marginHorizontal: -4 },
  contact: { alignItems: "center", gap: 6, marginHorizontal: 6 },
  contactAvatar: { width: 52, height: 52, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  contactName: { fontSize: 11, fontFamily: "Inter_500Medium" },
  form: { gap: 16 },
  inputGroup: { gap: 8 },
  label: { fontSize: 13, fontFamily: "Inter_500Medium", letterSpacing: 0.3 },
  inputWrapper: {
    flexDirection: "row", alignItems: "center",
    borderRadius: 14, borderWidth: 1, paddingHorizontal: 16, minHeight: 56,
  },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, fontSize: 16, fontFamily: "Inter_400Regular", paddingVertical: 12 },
  quickAmounts: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  quickAmount: {
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10, borderWidth: 1,
  },
  quickAmountText: { fontSize: 14, fontFamily: "Inter_500Medium" },
  sendBtn: {
    height: 56, borderRadius: 16, flexDirection: "row",
    alignItems: "center", justifyContent: "center", gap: 8, marginTop: 8,
  },
  sendBtnText: { fontSize: 17, fontFamily: "Inter_600SemiBold" },
  qrSection: { alignItems: "center", gap: 20 },
  qrContainer: {
    width: "100%", borderRadius: 24, borderWidth: 1, padding: 32,
    alignItems: "center", gap: 12,
  },
  qrCode: { width: 160, height: 160, borderRadius: 16, borderWidth: 2, padding: 16, gap: 4 },
  qrRow: { flex: 1, flexDirection: "row", gap: 4 },
  qrCell: { flex: 1, borderRadius: 3 },
  qrLabel: { fontSize: 18, fontFamily: "Inter_700Bold", marginTop: 8 },
  qrSubLabel: { fontSize: 13, fontFamily: "Inter_400Regular" },
  addressBox: {
    width: "100%", borderRadius: 20, borderWidth: 1, padding: 20, gap: 8,
  },
  addressLabel: { fontSize: 12, fontFamily: "Inter_500Medium" },
  address: { fontSize: 18, fontFamily: "Inter_600SemiBold", letterSpacing: 1 },
  copyBtn: {
    flexDirection: "row", alignItems: "center", gap: 8, alignSelf: "flex-start",
    borderRadius: 10, borderWidth: 1, paddingHorizontal: 14, paddingVertical: 8, marginTop: 4,
  },
  copyBtnText: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  receiveOptions: { flexDirection: "row", gap: 12, width: "100%" },
  receiveOpt: {
    flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 8, borderRadius: 14, borderWidth: 1, paddingVertical: 14,
  },
  receiveOptText: { fontSize: 14, fontFamily: "Inter_500Medium" },
});
