import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ErrorFallbackProps } from "@/components/ErrorFallback";

const C = {
  bg:      "#FFFFFF",
  navy:    "#061941",
  text:    "#0B0A0A",
  textSec: "#595F67",
  danger:  "#EF4444",
  border:  "#F0F0F0",
  primary: "#135EF2",
  card:    "#F9FAFB",
};

export function CardErrorFallback({ error, resetError }: ErrorFallbackProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);

  const monoFont = Platform.select({
    ios: "Menlo",
    android: "monospace",
    default: "monospace",
  });

  const formatDetails = (): string => {
    let out = `Error: ${error.message}\n\n`;
    if (error.stack) out += `Stack Trace:\n${error.stack}`;
    return out;
  };

  return (
    <View style={[s.root, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>

      {/* Dev-mode error inspector */}
      {__DEV__ && (
        <Pressable
          onPress={() => setModalVisible(true)}
          accessibilityLabel="View error details"
          accessibilityRole="button"
          style={({ pressed }) => [
            s.inspectorBtn,
            { top: insets.top + 12, opacity: pressed ? 0.7 : 1 },
          ]}
        >
          <Feather name="alert-circle" size={18} color={C.textSec} />
          <Text style={s.inspectorLabel}>Error details</Text>
        </Pressable>
      )}

      {/* Card icon */}
      <View style={s.iconWrap}>
        <View style={s.iconCircle}>
          <Feather name="credit-card" size={36} color={C.navy} />
        </View>
        <View style={s.iconBadge}>
          <Feather name="alert-triangle" size={12} color="#FFFFFF" />
        </View>
      </View>

      {/* Copy */}
      <Text style={s.title}>My Card is unavailable</Text>
      <Text style={s.body}>
        Something went wrong while loading your card. Your card data is safe —
        please try again or come back in a moment.
      </Text>

      {/* Actions */}
      <View style={s.actions}>
        <Pressable
          onPress={resetError}
          style={({ pressed }) => [
            s.btnPrimary,
            { opacity: pressed ? 0.88 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] },
          ]}
        >
          <Feather name="refresh-cw" size={16} color="#FFFFFF" />
          <Text style={s.btnPrimaryText}>Try Again</Text>
        </Pressable>

        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [
            s.btnSecondary,
            { opacity: pressed ? 0.7 : 1 },
          ]}
        >
          <Text style={s.btnSecondaryText}>Go Back</Text>
        </Pressable>
      </View>

      {/* Dev modal */}
      {__DEV__ && (
        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={s.modalOverlay}>
            <View style={s.modalBox}>
              <View style={s.modalHeader}>
                <Text style={s.modalTitle}>Error Details</Text>
                <Pressable
                  onPress={() => setModalVisible(false)}
                  style={({ pressed }) => [s.closeBtn, { opacity: pressed ? 0.6 : 1 }]}
                  accessibilityLabel="Close"
                  accessibilityRole="button"
                >
                  <Feather name="x" size={22} color={C.text} />
                </Pressable>
              </View>
              <ScrollView
                contentContainerStyle={[s.modalScroll, { paddingBottom: insets.bottom + 16 }]}
                showsVerticalScrollIndicator
              >
                <View style={s.codeBox}>
                  <Text style={[s.codeText, { fontFamily: monoFont }]} selectable>
                    {formatDetails()}
                  </Text>
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: C.bg,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },

  inspectorBtn: {
    position: "absolute",
    right: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.border,
  },
  inspectorLabel: {
    fontSize: 12,
    color: C.textSec,
    fontFamily: "Manrope_500Medium",
  },

  iconWrap: {
    position: "relative",
    marginBottom: 24,
  },
  iconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
  },
  iconBadge: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: C.danger,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: C.bg,
  },

  title: {
    fontSize: 22,
    fontFamily: "Manrope_700Bold",
    color: C.navy,
    textAlign: "center",
    marginBottom: 12,
  },
  body: {
    fontSize: 15,
    fontFamily: "Manrope_400Regular",
    color: C.textSec,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 32,
    maxWidth: 320,
  },

  actions: {
    width: "100%",
    maxWidth: 320,
    gap: 12,
  },
  btnPrimary: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: 52,
    borderRadius: 12,
    backgroundColor: C.primary,
  },
  btnPrimaryText: {
    fontSize: 15,
    fontFamily: "Manrope_600SemiBold",
    color: "#FFFFFF",
  },
  btnSecondary: {
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: C.card,
  },
  btnSecondaryText: {
    fontSize: 15,
    fontFamily: "Manrope_600SemiBold",
    color: C.textSec,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalBox: {
    width: "100%",
    height: "85%",
    backgroundColor: C.bg,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: "Manrope_700Bold",
    color: C.text,
  },
  closeBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  modalScroll: {
    padding: 16,
  },
  codeBox: {
    backgroundColor: C.card,
    borderRadius: 10,
    padding: 16,
    borderWidth: 1,
    borderColor: C.border,
  },
  codeText: {
    fontSize: 11,
    lineHeight: 17,
    color: C.text,
  },
});
