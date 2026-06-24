import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useWallet } from "@/context/WalletContext";

const WHITE      = "#FFFFFF";
const TEXT_DARK  = "#0B0A0A";
const TEXT_GRAY  = "#595F67";
const TEXT_LIGHT = "#AAAFB5";
const INPUT_BG   = "#F0F0F0";
const BORDER     = "#EDF1F3";
const BLACK      = "#000000";
const GREEN      = "#00B03C";

const RECENT_CONTACTS = [
  { id: "1", name: "Alex K.",  initial: "A", color: "#3B82F6" },
  { id: "2", name: "Sarah M.", initial: "S", color: "#8B5CF6" },
  { id: "3", name: "James T.", initial: "J", color: "#F59E0B" },
  { id: "4", name: "Emma R.",  initial: "E", color: "#EF4444" },
  { id: "5", name: "Lucas B.", initial: "L", color: "#00D9A0" },
];

const WALLET_ADDRESS = "0x7f3a...9b2c";
const QUICK_AMOUNTS  = ["10", "25", "50", "100", "250", "500"];

export default function SendScreen() {
  const insets = useSafeAreaInsets();
  const { balance, transactions, addTransaction } = useWallet();

  const [activeTab,  setActiveTab]  = useState<"withdraw" | "receive" | "history">("withdraw");
  const [recipient,  setRecipient]  = useState("");
  const [amount,     setAmount]     = useState("");
  const [note,       setNote]       = useState("");
  const [copied,     setCopied]     = useState(false);

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  async function handleWithdraw() {
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
      subtitle: note || "Withdrawal",
      amount: -num,
      currency: "USD",
      status: "completed",
      icon: "arrow-up-circle",
    });
    setRecipient("");
    setAmount("");
    setNote("");
    Alert.alert("Sent!", `$${num.toFixed(2)} withdrawn successfully`);
  }

  function handleCopy() {
    setCopied(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setTimeout(() => setCopied(false), 2000);
  }

  const TABS = [
    { key: "withdraw", label: "Withdraw" },
    { key: "receive",  label: "Receive"  },
    { key: "history",  label: "History"  },
  ] as const;

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar barStyle="dark-content" backgroundColor={WHITE} />

      <ScrollView
        contentContainerStyle={{ paddingTop: topPad, paddingBottom: 110 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>
            {activeTab === "withdraw" ? "Withdraw" : activeTab === "receive" ? "Receive" : "History"}
          </Text>
          <View style={[styles.balancePill]}>
            <Feather name="credit-card" size={12} color={GREEN} />
            <Text style={styles.balancePillText}>
              ${balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </Text>
          </View>
        </View>

        {/* Tab Toggle */}
        <View style={styles.tabBar}>
          {TABS.map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tabBtn, activeTab === tab.key && styles.tabBtnActive]}
              onPress={async () => { await Haptics.selectionAsync(); setActiveTab(tab.key); }}
              activeOpacity={0.7}
            >
              <Text style={[styles.tabBtnText, activeTab === tab.key && styles.tabBtnTextActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Withdraw Tab ── */}
        {activeTab === "withdraw" && (
          <View style={styles.content}>
            {/* Recent Contacts */}
            <Text style={styles.sectionLabel}>Recent</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.contactsScroll}
              style={{ marginBottom: 24 }}
            >
              {RECENT_CONTACTS.map((c) => (
                <TouchableOpacity
                  key={c.id}
                  style={styles.contactItem}
                  onPress={async () => { await Haptics.selectionAsync(); setRecipient(c.name); }}
                  activeOpacity={0.7}
                >
                  <View style={[styles.contactAvatar, { backgroundColor: c.color + "25" }]}>
                    <Text style={{ color: c.color, fontSize: 18, fontFamily: "Inter_700Bold" }}>{c.initial}</Text>
                  </View>
                  <Text style={styles.contactName}>{c.name.split(" ")[0]}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Recipient */}
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Recipient</Text>
              <View style={styles.inputWrap}>
                <Feather name="user" size={16} color={TEXT_LIGHT} />
                <TextInput
                  style={styles.input}
                  value={recipient}
                  onChangeText={setRecipient}
                  placeholder="Name, email or address"
                  placeholderTextColor={TEXT_LIGHT}
                />
              </View>
            </View>

            {/* Amount */}
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Amount (USD)</Text>
              <View style={styles.inputWrap}>
                <Text style={styles.currencySign}>$</Text>
                <TextInput
                  style={[styles.input, styles.amtInputText]}
                  value={amount}
                  onChangeText={setAmount}
                  placeholder="0.00"
                  placeholderTextColor={TEXT_LIGHT}
                  keyboardType="decimal-pad"
                />
              </View>
            </View>

            {/* Quick amounts */}
            <View style={styles.quickRow}>
              {QUICK_AMOUNTS.map((q) => (
                <TouchableOpacity
                  key={q}
                  style={[styles.quickChip, amount === q && styles.quickChipActive]}
                  onPress={() => { setAmount(q); Haptics.selectionAsync(); }}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.quickChipText, amount === q && styles.quickChipTextActive]}>${q}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Note */}
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Note (optional)</Text>
              <View style={styles.inputWrap}>
                <Feather name="message-circle" size={16} color={TEXT_LIGHT} />
                <TextInput
                  style={styles.input}
                  value={note}
                  onChangeText={setNote}
                  placeholder="What's it for?"
                  placeholderTextColor={TEXT_LIGHT}
                />
              </View>
            </View>

            <TouchableOpacity style={styles.actionBtn} onPress={handleWithdraw} activeOpacity={0.85}>
              <Feather name="send" size={18} color={WHITE} />
              <Text style={styles.actionBtnText}>Withdraw Now</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ── Receive Tab ── */}
        {activeTab === "receive" && (
          <View style={styles.content}>
            <View style={styles.qrCard}>
              {/* QR pattern */}
              <View style={styles.qrBox}>
                {Array.from({ length: 5 }, (_, row) => (
                  <View key={row} style={{ flex: 1, flexDirection: "row", gap: 4 }}>
                    {Array.from({ length: 5 }, (_, col) => (
                      <View
                        key={col}
                        style={[
                          { flex: 1, borderRadius: 3 },
                          {
                            backgroundColor:
                              (row === 0 && col < 3) || (col === 0 && row < 3) ||
                              (row === 4 && col > 1) || (col === 4 && row > 1) ||
                              (row === 2 && col === 2)
                                ? BLACK
                                : "transparent",
                          },
                        ]}
                      />
                    ))}
                  </View>
                ))}
              </View>
              <Text style={styles.qrTitle}>Scan to Pay</Text>
              <Text style={styles.qrSub}>or share your address below</Text>
            </View>

            <View style={styles.addressCard}>
              <Text style={styles.addressLabel}>Your Wallet Address</Text>
              <Text style={styles.address}>{WALLET_ADDRESS}</Text>
              <TouchableOpacity
                style={[styles.copyBtn, copied && styles.copyBtnActive]}
                onPress={handleCopy}
                activeOpacity={0.85}
              >
                <Feather name={copied ? "check" : "copy"} size={15} color={copied ? WHITE : BLACK} />
                <Text style={[styles.copyBtnText, copied && styles.copyBtnTextActive]}>
                  {copied ? "Copied!" : "Copy Address"}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.shareRow}>
              {[{ icon: "share-2", label: "Share Link" }, { icon: "download", label: "Save QR" }].map((opt) => (
                <TouchableOpacity
                  key={opt.label}
                  style={styles.shareBtn}
                  onPress={() => Haptics.selectionAsync()}
                  activeOpacity={0.7}
                >
                  <Feather name={opt.icon as any} size={18} color={TEXT_DARK} />
                  <Text style={styles.shareBtnText}>{opt.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* ── History Tab ── */}
        {activeTab === "history" && (
          <View style={styles.content}>
            {transactions.length === 0 ? (
              <View style={styles.emptyHistory}>
                <Feather name="clock" size={36} color={TEXT_LIGHT} />
                <Text style={styles.emptyTitle}>No transactions yet</Text>
              </View>
            ) : (
              <View style={styles.historyList}>
                {transactions.map((tx, i) => {
                  const isPos = tx.amount > 0;
                  const naira = Math.abs(tx.amount * 1550);
                  return (
                    <View
                      key={tx.id}
                      style={[styles.historyRow, i < transactions.length - 1 && styles.historyRowBorder]}
                    >
                      <View style={[styles.historyIcon, { backgroundColor: isPos ? "#E8F8EE" : "#FEF2F2" }]}>
                        <Feather
                          name={isPos ? "arrow-down-circle" : "arrow-up-circle"}
                          size={16}
                          color={isPos ? GREEN : "#EF4444"}
                        />
                      </View>
                      <View style={styles.historyInfo}>
                        <Text style={styles.historyTitle}>{tx.title}</Text>
                        <Text style={styles.historySub}>
                          {new Date(tx.timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                          {" · "}{tx.subtitle}
                        </Text>
                      </View>
                      <Text style={[styles.historyAmt, { color: isPos ? GREEN : "#EF4444" }]}>
                        {isPos ? "+" : "-"}₦{naira.toLocaleString("en-NG", { minimumFractionDigits: 2 })}
                      </Text>
                    </View>
                  );
                })}
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: WHITE },

  header: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    paddingHorizontal: 24, paddingBottom: 18,
  },
  title: { fontFamily: "Inter_700Bold", fontSize: 26, color: TEXT_DARK, letterSpacing: -0.5 },
  balancePill: {
    flexDirection: "row", alignItems: "center", gap: 5,
    backgroundColor: GREEN + "15", borderRadius: 10, paddingHorizontal: 12, paddingVertical: 6,
  },
  balancePillText: { fontFamily: "Inter_600SemiBold", fontSize: 13, color: GREEN },

  tabBar: {
    flexDirection: "row", marginHorizontal: 24, backgroundColor: INPUT_BG,
    borderRadius: 14, padding: 4, marginBottom: 24,
  },
  tabBtn: { flex: 1, paddingVertical: 10, borderRadius: 11, alignItems: "center" },
  tabBtnActive: { backgroundColor: BLACK },
  tabBtnText: { fontFamily: "Inter_600SemiBold", fontSize: 14, color: TEXT_GRAY },
  tabBtnTextActive: { color: WHITE },

  content: { paddingHorizontal: 24, gap: 16 },

  sectionLabel: { fontFamily: "Inter_600SemiBold", fontSize: 13, color: TEXT_DARK },
  contactsScroll: { gap: 14, paddingRight: 8 },
  contactItem: { alignItems: "center", gap: 7 },
  contactAvatar: { width: 52, height: 52, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  contactName: { fontFamily: "Inter_500Medium", fontSize: 11, color: TEXT_GRAY },

  field: { gap: 8 },
  fieldLabel: { fontFamily: "Inter_600SemiBold", fontSize: 13, color: TEXT_DARK },
  inputWrap: {
    flexDirection: "row", alignItems: "center", gap: 12,
    backgroundColor: INPUT_BG, borderRadius: 14, paddingHorizontal: 16, minHeight: 52,
  },
  input: { flex: 1, fontFamily: "Inter_400Regular", fontSize: 15, color: TEXT_DARK, paddingVertical: 14 },
  currencySign: { fontFamily: "Inter_600SemiBold", fontSize: 18, color: TEXT_GRAY },
  amtInputText: { fontSize: 22, fontFamily: "Inter_700Bold" },

  quickRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  quickChip: {
    paddingHorizontal: 16, paddingVertical: 9, borderRadius: 10,
    backgroundColor: INPUT_BG, borderWidth: 1.5, borderColor: "transparent",
  },
  quickChipActive: { backgroundColor: "#E8F8EE", borderColor: GREEN },
  quickChipText: { fontFamily: "Inter_500Medium", fontSize: 13, color: TEXT_GRAY },
  quickChipTextActive: { fontFamily: "Inter_600SemiBold", color: GREEN },

  actionBtn: {
    backgroundColor: BLACK, borderRadius: 14, height: 54,
    flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10,
    marginTop: 8,
  },
  actionBtnText: { fontFamily: "Inter_600SemiBold", fontSize: 16, color: WHITE },

  qrCard: {
    backgroundColor: INPUT_BG, borderRadius: 24, padding: 32,
    alignItems: "center", gap: 10,
  },
  qrBox: { width: 150, height: 150, borderRadius: 12, gap: 4, padding: 12, backgroundColor: WHITE },
  qrTitle: { fontFamily: "Inter_700Bold", fontSize: 17, color: TEXT_DARK, marginTop: 6 },
  qrSub: { fontFamily: "Inter_400Regular", fontSize: 12, color: TEXT_LIGHT },

  addressCard: {
    backgroundColor: INPUT_BG, borderRadius: 16, padding: 20, gap: 8,
  },
  addressLabel: { fontFamily: "Inter_500Medium", fontSize: 12, color: TEXT_LIGHT },
  address: { fontFamily: "Inter_600SemiBold", fontSize: 17, color: TEXT_DARK, letterSpacing: 0.5 },
  copyBtn: {
    flexDirection: "row", alignItems: "center", gap: 8, alignSelf: "flex-start",
    borderRadius: 10, borderWidth: 1.5, borderColor: BLACK,
    paddingHorizontal: 14, paddingVertical: 8,
  },
  copyBtnActive: { backgroundColor: BLACK },
  copyBtnText: { fontFamily: "Inter_600SemiBold", fontSize: 13, color: BLACK },
  copyBtnTextActive: { color: WHITE },

  shareRow: { flexDirection: "row", gap: 12 },
  shareBtn: {
    flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 8, backgroundColor: INPUT_BG, borderRadius: 14, paddingVertical: 14,
  },
  shareBtnText: { fontFamily: "Inter_500Medium", fontSize: 14, color: TEXT_DARK },

  emptyHistory: { alignItems: "center", paddingTop: 60, gap: 12 },
  emptyTitle: { fontFamily: "Inter_600SemiBold", fontSize: 16, color: TEXT_LIGHT },

  historyList: {
    borderRadius: 20, borderWidth: 1, borderColor: BORDER, overflow: "hidden", backgroundColor: WHITE,
  },
  historyRow: { flexDirection: "row", alignItems: "center", padding: 16, gap: 12 },
  historyRowBorder: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: BORDER },
  historyIcon: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  historyInfo: { flex: 1 },
  historyTitle: { fontFamily: "Inter_600SemiBold", fontSize: 13, color: TEXT_DARK, marginBottom: 2 },
  historySub: { fontFamily: "Inter_400Regular", fontSize: 11, color: TEXT_LIGHT },
  historyAmt: { fontFamily: "Inter_700Bold", fontSize: 13 },
});
