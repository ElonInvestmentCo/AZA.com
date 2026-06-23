import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const BG      = "#FFFFFF";
const TEXT    = "#0B0A0A";
const MUTED   = "#6C7278";
const BORDER  = "#EDF1F3";
const INPUTBG = "#F0F0F0";
const DARK    = "#010101";

const CATEGORIES = ["Amazon", "iTunes", "Google Play", "Steam", "Netflix", "Xbox", "Vanilla Visa", "eBay", "Walmart"];
const COUNTRIES  = ["USA", "UK", "Canada", "Australia", "Germany", "France", "Japan"];
const TYPES      = ["Physical", "Digital", "E-Code", "Subscription"];

function DropdownField({
  label,
  value,
  onPress,
}: {
  label: string;
  value: string;
  onPress: () => void;
}) {
  return (
    <View style={df.wrap}>
      <Text style={df.label}>{label}</Text>
      <TouchableOpacity style={df.field} onPress={onPress} activeOpacity={0.8}>
        <Text style={[df.value, !value && df.placeholder]}>{value || `Select ${label}`}</Text>
        <Feather name="chevron-down" size={18} color={MUTED} />
      </TouchableOpacity>
    </View>
  );
}

const df = StyleSheet.create({
  wrap:        { gap: 6 },
  label:       { fontSize: 12, fontFamily: "Manrope_500Medium", color: MUTED, paddingLeft: 2, textTransform: "capitalize" },
  field:       {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    backgroundColor: INPUTBG, borderWidth: 1.5, borderColor: BORDER,
    borderRadius: 10, paddingHorizontal: 16, paddingVertical: 14,
  },
  value:       { fontSize: 14, fontFamily: "Manrope_500Medium", color: TEXT },
  placeholder: { color: MUTED },
});

function PickerModal({
  visible,
  title,
  options,
  onSelect,
  onClose,
}: {
  visible: boolean;
  title: string;
  options: string[];
  onSelect: (v: string) => void;
  onClose: () => void;
}) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={pm.overlay} onPress={onClose} />
      <View style={pm.sheet}>
        <View style={pm.handle} />
        <Text style={pm.title}>{title}</Text>
        <ScrollView showsVerticalScrollIndicator={false}>
          {options.map((o) => (
            <TouchableOpacity
              key={o}
              style={pm.option}
              onPress={() => { Haptics.selectionAsync(); onSelect(o); onClose(); }}
            >
              <Text style={pm.optText}>{o}</Text>
              <Feather name="chevron-right" size={16} color={MUTED} />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </Modal>
  );
}

const pm = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)" },
  sheet:   {
    backgroundColor: BG, borderTopLeftRadius: 24, borderTopRightRadius: 24,
    paddingHorizontal: 24, paddingTop: 16, paddingBottom: 40, maxHeight: "60%",
  },
  handle:  { width: 40, height: 4, borderRadius: 2, backgroundColor: "#E0E0E0", alignSelf: "center", marginBottom: 16 },
  title:   { fontSize: 16, fontFamily: "Manrope_700Bold", color: TEXT, marginBottom: 12, textTransform: "capitalize" },
  option:  {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: BORDER,
  },
  optText: { fontSize: 15, fontFamily: "Manrope_500Medium", color: TEXT },
});

export default function SellGiftCardScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 20 : insets.top;

  const [category, setCategory] = useState("");
  const [country,  setCountry]  = useState("");
  const [type,     setType]     = useState("");
  const [amount,   setAmount]   = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [picker,   setPicker]   = useState<"category" | "country" | "type" | null>(null);

  const RATE      = 1200;
  const parsed    = parseFloat(amount.replace(/,/g, "")) || 0;
  const total     = parsed * RATE;
  const canSubmit = !!category && !!type;

  async function pickImage() {
    if (Platform.OS === "web") {
      Alert.alert("Upload", "Image upload works on device.");
      return;
    }
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission needed", "Please allow photo access.");
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

  async function handleProceed() {
    if (!canSubmit) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Required", "Please select a gift card category and type.");
      return;
    }
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push({
      pathname: "/confirm-transaction",
      params: { category, country, type, amount, rate: String(RATE), total: String(total) },
    } as any);
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: BG }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* Header */}
      <View style={[hdr.wrap, { paddingTop: topPad + 12 }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={hdr.back}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Feather name="arrow-left" size={22} color="#1E232C" />
        </TouchableOpacity>
        <Text style={hdr.title}>Sell Gift Card</Text>
        <View style={{ width: 40 }} />
      </View>
      <View style={hdr.divider} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={sc.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={sc.subtitle}>Kindly provide your gift card details.</Text>

        <DropdownField label="Gift card category"           value={category} onPress={() => setPicker("category")} />
        <DropdownField label="Gift card Country (optional)" value={country}  onPress={() => setPicker("country")}  />
        <DropdownField label="Gift card Type/sub-category"  value={type}     onPress={() => setPicker("type")}     />

        {/* Amount */}
        <View style={field.wrap}>
          <Text style={field.label}>Amount</Text>
          <View style={field.input}>
            <TextInput
              style={field.inputText}
              placeholder="Enter amount"
              placeholderTextColor="#ACACAC"
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
            />
          </View>
        </View>

        {/* Upload */}
        <View style={up.wrap}>
          <Text style={up.label}>Upload gift card image</Text>
          <TouchableOpacity style={up.box} onPress={pickImage} activeOpacity={0.75}>
            {imageUri ? (
              <>
                <Image source={{ uri: imageUri }} style={StyleSheet.absoluteFillObject} resizeMode="cover" />
                <View style={up.overlay}>
                  <Feather name="refresh-cw" size={18} color="#FFFFFF" />
                  <Text style={up.overlayTxt}>Change image</Text>
                </View>
              </>
            ) : (
              <>
                <View style={up.circles}>
                  <View style={[up.circle, { backgroundColor: "#BBBBBB", zIndex: 2 }]}>
                    <Feather name="image" size={16} color="#FFFFFF" />
                  </View>
                  <View style={[up.circle, { backgroundColor: "#D9D9D9", marginLeft: -14, zIndex: 1 }]}>
                    <Feather name="image" size={16} color="#FFFFFF" />
                  </View>
                  <View style={up.plus}>
                    <Feather name="plus" size={16} color="#FFFFFF" />
                  </View>
                </View>
                <Text style={up.hint}>Tap to upload your gift card</Text>
                <Text style={up.sub}>You can upload multiple files at once</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Rate panel */}
        <View style={rp.box}>
          <View style={rp.row}>
            <Text style={rp.label}>Rate</Text>
            <Text style={rp.value}>₦{RATE.toLocaleString()}</Text>
          </View>
          <View style={rp.divider} />
          <View style={rp.row}>
            <Text style={rp.label}>Total:</Text>
            <Text style={[rp.value, rp.total]}>₦{total > 0 ? total.toLocaleString() : "0"}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Proceed */}
      <View style={[cta.wrap, { paddingBottom: Platform.OS === "ios" ? insets.bottom + 8 : 20 }]}>
        <TouchableOpacity
          style={[cta.btn, !canSubmit && { opacity: 0.45 }]}
          onPress={handleProceed}
          activeOpacity={0.85}
        >
          <Text style={cta.txt}>Proceed</Text>
        </TouchableOpacity>
      </View>

      <PickerModal visible={picker === "category"} title="Gift card category" options={CATEGORIES} onSelect={setCategory} onClose={() => setPicker(null)} />
      <PickerModal visible={picker === "country"}  title="Gift card Country"  options={COUNTRIES}  onSelect={setCountry}  onClose={() => setPicker(null)} />
      <PickerModal visible={picker === "type"}     title="Gift card Type"     options={TYPES}      onSelect={setType}     onClose={() => setPicker(null)} />
    </KeyboardAvoidingView>
  );
}

const hdr = StyleSheet.create({
  wrap:    { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingBottom: 16, backgroundColor: BG },
  back:    { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  title:   { fontSize: 13, fontFamily: "Manrope_700Bold", color: TEXT, textAlign: "center" },
  divider: { height: 1, backgroundColor: "#D1D1D1" },
});

const sc = StyleSheet.create({
  content:  { padding: 20, gap: 18, paddingBottom: 48 },
  subtitle: { fontSize: 12, fontFamily: "Manrope_500Medium", color: MUTED, letterSpacing: 0.2 },
});

const field = StyleSheet.create({
  wrap:      { gap: 6 },
  label:     { fontSize: 12, fontFamily: "Manrope_500Medium", color: MUTED, paddingLeft: 2 },
  input:     { flexDirection: "row", alignItems: "center", backgroundColor: INPUTBG, borderWidth: 1.5, borderColor: BORDER, borderRadius: 10, paddingHorizontal: 16, height: 48 },
  inputText: { flex: 1, fontSize: 14, fontFamily: "Manrope_500Medium", color: TEXT },
});

const up = StyleSheet.create({
  wrap:       { gap: 6 },
  label:      { fontSize: 12, fontFamily: "Manrope_500Medium", color: MUTED },
  box:        {
    backgroundColor: INPUTBG, borderRadius: 10, borderWidth: 1,
    borderColor: BORDER, paddingVertical: 20, alignItems: "center", gap: 8, overflow: "hidden", marginTop: 4,
  },
  circles:    { flexDirection: "row", alignItems: "center", marginBottom: 4 },
  circle:     { width: 49, height: 49, borderRadius: 24.5, alignItems: "center", justifyContent: "center" },
  plus:       { width: 32, height: 32, borderRadius: 16, backgroundColor: "#000000", alignItems: "center", justifyContent: "center", marginLeft: -8, zIndex: 3 },
  hint:       { fontSize: 11, fontFamily: "Manrope_500Medium", color: MUTED },
  sub:        { fontSize: 9, fontFamily: "Manrope_400Regular", color: "#ACACAC" },
  overlay:    { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.55)", alignItems: "center", justifyContent: "center", gap: 6 },
  overlayTxt: { fontSize: 13, fontFamily: "Manrope_500Medium", color: "#FFFFFF" },
});

const rp = StyleSheet.create({
  box:     { backgroundColor: DARK, borderRadius: 10, paddingHorizontal: 16, paddingVertical: 4 },
  row:     { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 12 },
  divider: { height: 1, backgroundColor: "rgba(233,233,233,0.2)" },
  label:   { fontSize: 10, fontFamily: "Manrope_500Medium", color: "#FFFFFF" },
  value:   { fontSize: 10, fontFamily: "Manrope_700Bold",   color: "#FFFFFF" },
  total:   { fontSize: 15 },
});

const cta = StyleSheet.create({
  wrap: { paddingHorizontal: 20, paddingTop: 12, borderTopWidth: 1, borderTopColor: BORDER, backgroundColor: BG },
  btn:  { backgroundColor: "#000000", borderRadius: 10, height: 48, alignItems: "center", justifyContent: "center" },
  txt:  { fontSize: 14, fontFamily: "Manrope_700Bold", color: "#FFFFFF" },
});
