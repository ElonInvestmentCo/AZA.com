import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
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

const WHITE    = "#FFFFFF";
const TEXT_DARK = "#0B0A0A";
const TEXT_GRAY = "#6C7278";
const INPUT_BG  = "#F0F0F0";
const BORDER    = "#EDF1F3";
const BLACK     = "#000000";
const PANEL_BG  = "#010101";
const DIVIDER   = "#E9E9E9";

const CATEGORIES = ["Amazon", "iTunes", "Google Play", "Steam", "eBay", "Walmart", "Visa", "Netflix", "Nike"];
const COUNTRIES  = ["USA", "UK", "Australia", "Canada", "Germany", "France", "Japan"];
const TYPES      = ["Physical", "E-code (Digital)", "Redeemable"];

interface PickerSheetProps {
  title: string;
  options: string[];
  selected: string;
  onSelect: (v: string) => void;
  onClose: () => void;
}

function PickerSheet({ title, options, selected, onSelect, onClose }: PickerSheetProps) {
  return (
    <View style={pickerSt.overlay}>
      <TouchableOpacity style={pickerSt.backdrop} activeOpacity={1} onPress={onClose} />
      <View style={pickerSt.sheet}>
        <View style={pickerSt.handle} />
        <Text style={pickerSt.title}>{title}</Text>
        <ScrollView showsVerticalScrollIndicator={false}>
          {options.map((opt) => (
            <TouchableOpacity
              key={opt}
              style={pickerSt.row}
              onPress={() => { Haptics.selectionAsync(); onSelect(opt); onClose(); }}
              activeOpacity={0.7}
            >
              <Text style={[pickerSt.rowText, opt === selected && pickerSt.rowActive]}>{opt}</Text>
              {opt === selected && <Feather name="check" size={16} color={BLACK} />}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

export default function SellGiftCardScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [category, setCategory] = useState("");
  const [country,  setCountry]  = useState("");
  const [type,     setType]     = useState("");
  const [amount,   setAmount]   = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [activePicker, setActivePicker] = useState<"category" | "country" | "type" | null>(null);

  const topPad = Platform.OS === "web" ? 20 : insets.top;
  const RATE   = 1200;
  const parsed = parseFloat(amount.replace(/,/g, "")) || 0;
  const total  = parsed * RATE;

  async function pickImage() {
    if (Platform.OS === "web") { Alert.alert("Upload", "Image upload works on device."); return; }
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") { Alert.alert("Permission needed", "Please allow photo access."); return; }
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, quality: 0.9 });
    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  }

  async function handleProceed() {
    if (!category) { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error); Alert.alert("Required", "Please select a gift card category."); return; }
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push({
      pathname: "/confirm-transaction",
      params: { category, country, type, amount, rate: String(RATE), total: String(total) },
    } as any);
  }

  return (
    <View style={[styles.screen, { paddingTop: topPad }]}>
      <StatusBar barStyle="dark-content" backgroundColor={WHITE} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
          <Feather name="arrow-left" size={20} color="#1E232C" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sell gift Card</Text>
        <View style={{ width: 20 }} />
      </View>
      <View style={styles.headerDivider} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 140 }} keyboardShouldPersistTaps="handled">
        <Text style={styles.subtitle}>Kindly provide your gift card details.</Text>

        {/* Dropdown fields */}
        {([
          { label: "Gift card category",            value: category, key: "category" as const },
          { label: "Gift card Country (optional)",  value: country,  key: "country"  as const },
          { label: "Gift card Type/sub-category",   value: type,     key: "type"     as const },
        ] as const).map((f) => (
          <View key={f.key} style={styles.fieldWrap}>
            <Text style={styles.fieldLabel}>{f.label}</Text>
            <TouchableOpacity style={styles.inputArea} onPress={() => { Haptics.selectionAsync(); setActivePicker(f.key); }} activeOpacity={0.75}>
              <Text style={[styles.inputText, !f.value && styles.placeholder]}>{f.value || "   Select"}</Text>
              <Feather name="chevron-down" size={15} color={TEXT_GRAY} />
            </TouchableOpacity>
          </View>
        ))}

        {/* Amount field */}
        <View style={styles.fieldWrap}>
          <Text style={styles.fieldLabel}>Amount</Text>
          <View style={styles.inputArea}>
            <TextInput
              style={[styles.inputText, { flex: 1 }]}
              placeholder="Enter amount"
              placeholderTextColor="#ACACAC"
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
            />
          </View>
        </View>

        {/* Upload gift card image */}
        <View style={styles.fieldWrap}>
          <Text style={styles.fieldLabel}>Upload gift card image</Text>
          <TouchableOpacity style={styles.uploadBox} onPress={pickImage} activeOpacity={0.75}>
            {imageUri ? (
              <>
                <Image source={{ uri: imageUri }} style={StyleSheet.absoluteFillObject} resizeMode="cover" />
                <View style={styles.uploadOverlay}>
                  <Feather name="refresh-cw" size={18} color={WHITE} />
                  <Text style={styles.uploadOverlayTxt}>Change image</Text>
                </View>
              </>
            ) : (
              <>
                <View style={styles.circlesRow}>
                  <View style={[styles.circle, { backgroundColor: "#BBBBBB", zIndex: 2 }]}>
                    <Feather name="image" size={16} color={WHITE} />
                  </View>
                  <View style={[styles.circle, { backgroundColor: "#D9D9D9", marginLeft: -14, zIndex: 1 }]}>
                    <Feather name="image" size={16} color={WHITE} />
                  </View>
                  <View style={[styles.plusCircle]}>
                    <Feather name="plus" size={16} color={WHITE} />
                  </View>
                </View>
                <Text style={styles.uploadHint}>Tap to upload your gift card</Text>
                <Text style={styles.uploadSub}>You can upload multiple files at once</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Rate / Total panel */}
        <View style={styles.ratePanel}>
          <View style={styles.rateRow}>
            <Text style={styles.rateLbl}>Rate</Text>
            <Text style={styles.rateVal}>₦{RATE.toLocaleString()}</Text>
          </View>
          <View style={styles.rateDivider} />
          <View style={styles.rateRow}>
            <Text style={styles.rateLbl}>Total:</Text>
            <Text style={[styles.rateVal, styles.rateTotal]}>₦{total > 0 ? total.toLocaleString() : "0"}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Proceed button */}
      <View style={[styles.ctaWrap, { paddingBottom: Platform.OS === "ios" ? insets.bottom + 8 : 20 }]}>
        <TouchableOpacity style={styles.ctaBtn} onPress={handleProceed} activeOpacity={0.85}>
          <Text style={styles.ctaTxt}>Proceed</Text>
        </TouchableOpacity>
      </View>

      {/* Pickers */}
      {activePicker === "category" && <PickerSheet title="Gift card category" options={CATEGORIES} selected={category} onSelect={setCategory} onClose={() => setActivePicker(null)} />}
      {activePicker === "country"  && <PickerSheet title="Gift card Country"  options={COUNTRIES}  selected={country}  onSelect={setCountry}  onClose={() => setActivePicker(null)} />}
      {activePicker === "type"     && <PickerSheet title="Gift card Type"     options={TYPES}      selected={type}     onSelect={setType}     onClose={() => setActivePicker(null)} />}
    </View>
  );
}

const pickerSt = StyleSheet.create({
  overlay:  { ...StyleSheet.absoluteFillObject, zIndex: 100, justifyContent: "flex-end" },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.45)" },
  sheet:    { backgroundColor: WHITE, borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingHorizontal: 20, paddingBottom: 40, paddingTop: 14, maxHeight: 420 },
  handle:   { alignSelf: "center", width: 40, height: 4, borderRadius: 2, backgroundColor: "#E0E0E0", marginBottom: 16 },
  title:    { fontFamily: "Inter_700Bold", fontSize: 15, color: TEXT_DARK, marginBottom: 14, textTransform: "capitalize" },
  row:      { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 14, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: BORDER },
  rowText:  { fontFamily: "Inter_500Medium", fontSize: 14, color: TEXT_GRAY },
  rowActive:{ fontFamily: "Inter_700Bold", color: TEXT_DARK },
});

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: WHITE },

  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 14, paddingBottom: 14 },
  headerTitle: { fontFamily: "Inter_700Bold", fontSize: 13, color: BLACK, textTransform: "capitalize" },
  headerDivider: { height: StyleSheet.hairlineWidth, backgroundColor: "#D1D1D1" },

  subtitle: { fontFamily: "Inter_500Medium", fontSize: 12, color: TEXT_GRAY, paddingHorizontal: 22, paddingTop: 14, paddingBottom: 4, letterSpacing: 0.24 },

  fieldWrap: { paddingHorizontal: 22, marginTop: 14 },
  fieldLabel: { fontFamily: "Inter_500Medium", fontSize: 12, color: TEXT_GRAY, textTransform: "capitalize", letterSpacing: -0.24, marginBottom: 2 },
  inputArea: { flexDirection: "row", alignItems: "center", backgroundColor: INPUT_BG, borderRadius: 10, borderWidth: 1, borderColor: BORDER, height: 46, paddingHorizontal: 14 },
  inputText: { fontFamily: "Inter_500Medium", fontSize: 10, color: "#646464", flex: 1, letterSpacing: -0.1 },
  placeholder: { color: "#ACACAC" },

  uploadBox: { backgroundColor: INPUT_BG, borderRadius: 10, borderWidth: 1, borderColor: BORDER, paddingVertical: 20, alignItems: "center", gap: 8, overflow: "hidden", marginTop: 4 },
  circlesRow: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
  circle: { width: 49, height: 49, borderRadius: 24.5, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: BLACK, borderStyle: "dashed" },
  plusCircle: { width: 32, height: 32, borderRadius: 16, backgroundColor: BLACK, alignItems: "center", justifyContent: "center", marginLeft: -8, zIndex: 3 },
  uploadHint: { fontFamily: "Inter_500Medium", fontSize: 11, color: TEXT_GRAY },
  uploadSub: { fontFamily: "Inter_400Regular", fontSize: 8, color: "#ACACAC" },
  uploadOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.55)", alignItems: "center", justifyContent: "center", gap: 6 },
  uploadOverlayTxt: { fontFamily: "Inter_500Medium", fontSize: 13, color: WHITE },

  ratePanel: { marginHorizontal: 22, marginTop: 20, backgroundColor: PANEL_BG, borderRadius: 10, paddingHorizontal: 20, paddingVertical: 14 },
  rateRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  rateLbl: { fontFamily: "Inter_500Medium", fontSize: 10, color: WHITE, letterSpacing: -0.1 },
  rateVal: { fontFamily: "Inter_700Bold", fontSize: 10, color: WHITE, letterSpacing: -0.1 },
  rateTotal: { fontSize: 15 },
  rateDivider: { height: 1, backgroundColor: DIVIDER, marginVertical: 10 },

  ctaWrap: { paddingHorizontal: 22, paddingTop: 12, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: BORDER, backgroundColor: WHITE },
  ctaBtn: { backgroundColor: BLACK, borderRadius: 10, height: 48, alignItems: "center", justifyContent: "center" },
  ctaTxt: { fontFamily: "Inter_700Bold", fontSize: 14, color: WHITE, letterSpacing: -0.14 },
});
