import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
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

const WHITE      = "#FFFFFF";
const TEXT_DARK  = "#0B0A0A";
const TEXT_GRAY  = "#595F67";
const TEXT_LIGHT = "#AAAFB5";
const INPUT_BG   = "#F0F0F0";
const BORDER     = "#EDF1F3";
const BLACK      = "#000000";
const GREEN      = "#00B03C";
const GREEN_SOFT = "#E8F8EE";

const CATEGORIES = ["Amazon", "iTunes", "Google Play", "Steam", "eBay", "Walmart", "Visa", "Sephora", "Nike", "Netflix"];
const COUNTRIES  = ["United States", "United Kingdom", "Canada", "Australia", "Germany", "France"];
const CARD_TYPES = ["Physical", "E-code (Digital)"];
const AMOUNTS    = ["$25", "$50", "$100", "$200", "$500"];

interface PickerSheetProps {
  title: string;
  options: string[];
  selected: string;
  onSelect: (v: string) => void;
  onClose: () => void;
}

function PickerSheet({ title, options, selected, onSelect, onClose }: PickerSheetProps) {
  return (
    <View style={pickerStyles.overlay}>
      <TouchableOpacity style={pickerStyles.backdrop} activeOpacity={1} onPress={onClose} />
      <View style={pickerStyles.sheet}>
        <View style={pickerStyles.handle} />
        <Text style={pickerStyles.title}>{title}</Text>
        <ScrollView showsVerticalScrollIndicator={false}>
          {options.map((opt) => (
            <TouchableOpacity
              key={opt}
              style={pickerStyles.row}
              onPress={() => { Haptics.selectionAsync(); onSelect(opt); onClose(); }}
              activeOpacity={0.7}
            >
              <Text style={[pickerStyles.rowText, opt === selected && pickerStyles.rowTextActive]}>{opt}</Text>
              {opt === selected && <Feather name="check" size={16} color={BLACK} />}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

interface SelectFieldProps {
  label: string;
  value: string;
  placeholder: string;
  onPress: () => void;
  optional?: boolean;
}

function SelectField({ label, value, placeholder, onPress, optional }: SelectFieldProps) {
  return (
    <View style={fieldStyles.wrapper}>
      <View style={fieldStyles.labelRow}>
        <Text style={fieldStyles.label}>{label}</Text>
        {optional && <Text style={fieldStyles.optional}>(Optional)</Text>}
      </View>
      <TouchableOpacity style={fieldStyles.select} onPress={onPress} activeOpacity={0.7}>
        <Text style={[fieldStyles.selectText, !value && fieldStyles.placeholder]}>
          {value || placeholder}
        </Text>
        <Feather name="chevron-down" size={16} color={TEXT_LIGHT} />
      </TouchableOpacity>
    </View>
  );
}

export default function SellGiftCardScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [category,   setCategory]   = useState("");
  const [country,    setCountry]    = useState("");
  const [cardType,   setCardType]   = useState("");
  const [amount,     setAmount]     = useState("");
  const [customAmt,  setCustomAmt]  = useState("");
  const [imageUri,   setImageUri]   = useState<string | null>(null);
  const [activePicker, setActivePicker] = useState<"category" | "country" | "type" | null>(null);

  const topPad = Platform.OS === "web" ? 20 : insets.top;

  const RATE = 1550;
  const parsedAmt = parseFloat((amount.replace("$", "") || customAmt) || "0");
  const totalNGN  = isNaN(parsedAmt) ? 0 : parsedAmt * RATE;

  async function pickImage() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission needed", "Please allow access to your photos to upload a gift card image.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.9,
    });
    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  }

  function canProceed() {
    return category && cardType && (amount || customAmt.trim());
  }

  async function handleProceed() {
    if (!canProceed()) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Incomplete", "Please fill in all required fields.");
      return;
    }
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    Alert.alert(
      "Order Submitted",
      `Selling ${category} gift card for ₦${totalNGN.toLocaleString("en-NG", { minimumFractionDigits: 2 })}.\n\nWe'll confirm your transaction shortly.`,
      [{ text: "Done", onPress: () => router.back() }]
    );
  }

  return (
    <View style={[styles.screen, { paddingTop: topPad }]}>
      <StatusBar barStyle="dark-content" backgroundColor={WHITE} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backBtn}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Feather name="arrow-left" size={22} color={TEXT_DARK} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sell Gift Card</Text>
        <View style={styles.headerRight} />
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Category */}
          <SelectField
            label="Gift Card Category"
            value={category}
            placeholder="Select category"
            onPress={() => setActivePicker("category")}
          />

          {/* Country */}
          <SelectField
            label="Country"
            value={country}
            placeholder="Select country"
            onPress={() => setActivePicker("country")}
            optional
          />

          {/* Card Type */}
          <SelectField
            label="Type / Subcategory"
            value={cardType}
            placeholder="Select card type"
            onPress={() => setActivePicker("type")}
          />

          {/* Preset Amounts */}
          <View style={styles.amtWrapper}>
            <Text style={styles.amtLabel}>Amount</Text>
            <View style={styles.amtGrid}>
              {AMOUNTS.map((a) => (
                <TouchableOpacity
                  key={a}
                  style={[styles.amtChip, amount === a && styles.amtChipActive]}
                  onPress={() => { Haptics.selectionAsync(); setAmount(a); setCustomAmt(""); }}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.amtChipText, amount === a && styles.amtChipTextActive]}>{a}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TextInput
              style={styles.customAmt}
              placeholder="Or enter custom amount (USD)"
              placeholderTextColor={TEXT_LIGHT}
              keyboardType="decimal-pad"
              value={customAmt}
              onChangeText={(v) => { setCustomAmt(v); setAmount(""); }}
            />
          </View>

          {/* Upload */}
          <View style={styles.uploadWrapper}>
            <Text style={styles.uploadLabel}>Upload Gift Card Image</Text>
            <TouchableOpacity
              style={[styles.uploadBox, imageUri && styles.uploadBoxFilled]}
              onPress={pickImage}
              activeOpacity={0.75}
            >
              {imageUri ? (
                <>
                  <Image source={{ uri: imageUri }} style={styles.uploadPreview} resizeMode="cover" />
                  <View style={styles.uploadOverlay}>
                    <Feather name="refresh-cw" size={20} color={WHITE} />
                    <Text style={styles.uploadOverlayText}>Change image</Text>
                  </View>
                </>
              ) : (
                <>
                  <View style={styles.uploadIconWrap}>
                    <Feather name="upload" size={24} color={TEXT_GRAY} />
                  </View>
                  <Text style={styles.uploadHint}>Tap to upload card image</Text>
                  <Text style={styles.uploadSub}>PNG, JPG up to 10 MB</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Rate & Total */}
          <View style={styles.rateCard}>
            <View style={styles.rateRow}>
              <Text style={styles.rateLabel}>Exchange Rate</Text>
              <Text style={styles.rateValue}>$1 = ₦{RATE.toLocaleString()}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.rateRow}>
              <Text style={styles.rateLabel}>You will receive</Text>
              <Text style={[styles.rateValue, styles.rateTotal]}>
                {totalNGN > 0 ? `₦${totalNGN.toLocaleString("en-NG", { minimumFractionDigits: 2 })}` : "—"}
              </Text>
            </View>
          </View>

          {/* Proceed */}
          <TouchableOpacity
            style={[styles.proceedBtn, !canProceed() && styles.proceedBtnDisabled]}
            onPress={handleProceed}
            activeOpacity={0.82}
          >
            <Text style={styles.proceedText}>Proceed</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Pickers */}
      {activePicker === "category" && (
        <PickerSheet
          title="Select Category"
          options={CATEGORIES}
          selected={category}
          onSelect={setCategory}
          onClose={() => setActivePicker(null)}
        />
      )}
      {activePicker === "country" && (
        <PickerSheet
          title="Select Country"
          options={COUNTRIES}
          selected={country}
          onSelect={setCountry}
          onClose={() => setActivePicker(null)}
        />
      )}
      {activePicker === "type" && (
        <PickerSheet
          title="Select Type"
          options={CARD_TYPES}
          selected={cardType}
          onSelect={setCardType}
          onClose={() => setActivePicker(null)}
        />
      )}
    </View>
  );
}

// ── Picker sheet styles ───────────────────────────────────────
const pickerStyles = StyleSheet.create({
  overlay: { ...StyleSheet.absoluteFillObject, zIndex: 100, justifyContent: "flex-end" },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.45)" },
  sheet: {
    backgroundColor: WHITE, borderTopLeftRadius: 24, borderTopRightRadius: 24,
    paddingHorizontal: 20, paddingBottom: 40, paddingTop: 14, maxHeight: 420,
  },
  handle: { alignSelf: "center", width: 40, height: 4, borderRadius: 2, backgroundColor: "#E0E0E0", marginBottom: 16 },
  title: { fontFamily: "Inter_700Bold", fontSize: 16, color: TEXT_DARK, marginBottom: 16 },
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 14, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: BORDER },
  rowText: { fontFamily: "Inter_400Regular", fontSize: 15, color: TEXT_GRAY },
  rowTextActive: { fontFamily: "Inter_600SemiBold", color: TEXT_DARK },
});

// ── Select field styles ───────────────────────────────────────
const fieldStyles = StyleSheet.create({
  wrapper: { marginBottom: 20 },
  labelRow: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 8 },
  label: { fontFamily: "Inter_600SemiBold", fontSize: 13, color: TEXT_DARK },
  optional: { fontFamily: "Inter_400Regular", fontSize: 12, color: TEXT_LIGHT },
  select: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    backgroundColor: INPUT_BG, borderRadius: 12, paddingHorizontal: 16, height: 50,
  },
  selectText: { fontFamily: "Inter_500Medium", fontSize: 14, color: TEXT_DARK },
  placeholder: { color: TEXT_LIGHT },
});

// ── Screen styles ─────────────────────────────────────────────
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: WHITE },

  header: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 20, paddingBottom: 14,
    borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: BORDER,
  },
  backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: INPUT_BG, alignItems: "center", justifyContent: "center" },
  headerTitle: { fontFamily: "Inter_700Bold", fontSize: 17, color: TEXT_DARK },
  headerRight: { width: 36 },

  content: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 40 },

  amtWrapper: { marginBottom: 20 },
  amtLabel: { fontFamily: "Inter_600SemiBold", fontSize: 13, color: TEXT_DARK, marginBottom: 10 },
  amtGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 12 },
  amtChip: {
    paddingHorizontal: 18, paddingVertical: 10, borderRadius: 10,
    backgroundColor: INPUT_BG, borderWidth: 1.5, borderColor: "transparent",
  },
  amtChipActive: { backgroundColor: "#E8F8EE", borderColor: GREEN },
  amtChipText: { fontFamily: "Inter_500Medium", fontSize: 14, color: TEXT_GRAY },
  amtChipTextActive: { fontFamily: "Inter_600SemiBold", color: GREEN },
  customAmt: {
    backgroundColor: INPUT_BG, borderRadius: 12, paddingHorizontal: 16,
    height: 50, fontFamily: "Inter_400Regular", fontSize: 14, color: TEXT_DARK,
  },

  uploadWrapper: { marginBottom: 24 },
  uploadLabel: { fontFamily: "Inter_600SemiBold", fontSize: 13, color: TEXT_DARK, marginBottom: 10 },
  uploadBox: {
    height: 140, borderRadius: 14, borderWidth: 1.5, borderColor: BORDER,
    borderStyle: "dashed", backgroundColor: INPUT_BG,
    alignItems: "center", justifyContent: "center", gap: 8, overflow: "hidden",
  },
  uploadBoxFilled: { borderStyle: "solid", borderColor: "transparent" },
  uploadPreview: { ...StyleSheet.absoluteFillObject },
  uploadOverlay: {
    ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center", justifyContent: "center", gap: 6,
  },
  uploadOverlayText: { fontFamily: "Inter_500Medium", fontSize: 13, color: WHITE },
  uploadIconWrap: { width: 52, height: 52, borderRadius: 26, backgroundColor: WHITE, alignItems: "center", justifyContent: "center" },
  uploadHint: { fontFamily: "Inter_500Medium", fontSize: 13, color: TEXT_GRAY },
  uploadSub: { fontFamily: "Inter_400Regular", fontSize: 11, color: TEXT_LIGHT },

  rateCard: {
    backgroundColor: "#F8FAFB", borderRadius: 14, padding: 18,
    borderWidth: 1, borderColor: BORDER, marginBottom: 28,
  },
  rateRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  rateLabel: { fontFamily: "Inter_400Regular", fontSize: 13, color: TEXT_GRAY },
  rateValue: { fontFamily: "Inter_600SemiBold", fontSize: 13, color: TEXT_DARK },
  rateTotal: { fontSize: 15, color: GREEN },
  divider: { height: 1, backgroundColor: BORDER, marginVertical: 12 },

  proceedBtn: {
    backgroundColor: BLACK, borderRadius: 14, height: 54,
    alignItems: "center", justifyContent: "center",
  },
  proceedBtnDisabled: { backgroundColor: "#C4C4C4" },
  proceedText: { fontFamily: "Inter_600SemiBold", fontSize: 16, color: WHITE },
});
