/**
 * AnimatedSheet — reusable bottom sheet with a backdrop whose opacity is
 * derived directly from the sheet's translateY position. This eliminates
 * the flash/snap of a static overlay by keeping both animations in
 * perfect sync on the UI thread via Reanimated interpolation.
 *
 * Responsive: uses useWindowDimensions so the off-screen position is always
 * correct regardless of orientation or screen size. The sheet's bottom padding
 * accounts for the device's safe-area inset (home indicator on iPhone, gesture
 * nav bar on Android) so content is never clipped behind system UI.
 *
 * Usage:
 *   <AnimatedSheet visible={open} onClose={() => setOpen(false)}>
 *     ...content...
 *   </AnimatedSheet>
 */

import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  ViewStyle,
  useWindowDimensions,
} from "react-native";
import Animated, {
  cancelAnimation,
  Easing,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const OPEN_DURATION  = 340;
const CLOSE_DURATION = 280;
const OPEN_EASING    = Easing.out(Easing.cubic);
const CLOSE_EASING   = Easing.in(Easing.quad);

interface AnimatedSheetProps {
  visible:     boolean;
  onClose:     () => void;
  children:    React.ReactNode;
  maxHeight?:  number | `${number}%`;
  sheetStyle?: ViewStyle;
}

export function AnimatedSheet({
  visible,
  onClose,
  children,
  maxHeight = "65%",
  sheetStyle,
}: AnimatedSheetProps) {
  const { height: screenH } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const [mounted, setMounted] = useState(visible);
  const isMountedRef = useRef(mounted);

  const screenHSV   = useSharedValue(screenH);
  const translateY  = useSharedValue(screenH);

  useEffect(() => {
    screenHSV.value = screenH;
  }, [screenH, screenHSV]);

  /* ── Animate in ──────────────────────────────────────────────────────── */
  const animateIn = useCallback(() => {
    cancelAnimation(translateY);
    translateY.value = screenHSV.value;
    translateY.value = withTiming(0, { duration: OPEN_DURATION, easing: OPEN_EASING });
  }, [translateY, screenHSV]);

  /* ── Animate out ─────────────────────────────────────────────────────── */
  const animateOut = useCallback((callback?: () => void) => {
    cancelAnimation(translateY);
    translateY.value = withTiming(
      screenHSV.value,
      { duration: CLOSE_DURATION, easing: CLOSE_EASING },
      (finished) => {
        if (finished) {
          runOnJS(setMounted)(false);
          if (callback) runOnJS(callback)();
        }
      },
    );
  }, [translateY, screenHSV]);

  /* ── Sync with parent `visible` prop ─────────────────────────────────── */
  useEffect(() => {
    if (visible) {
      isMountedRef.current = true;
      setMounted(true);
    } else {
      animateOut();
    }
  }, [visible]); // eslint-disable-line react-hooks/exhaustive-deps

  /* Kick off open animation. useLayoutEffect fires before paint so the very
     first frame rendered by the Modal already has the animation in progress —
     this eliminates the frame gap that caused the backdrop flash on web. */
  useLayoutEffect(() => {
    if (mounted && visible) {
      animateIn();
    }
  }, [mounted]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Backdrop press / back-button handler ────────────────────────────── */
  const handleClose = useCallback(() => {
    animateOut(onClose);
  }, [animateOut, onClose]);

  /* ── Animated styles ──────────────────────────────────────────────────── */
  const backdropStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      translateY.value,
      [0, screenHSV.value],
      [0.55, 0],
      "clamp",
    ),
  }));

  const sheetAnimStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  if (!mounted) return null;

  const sheetBottomPad = Math.max(insets.bottom, 12) + 20;

  return (
    <Modal
      visible
      transparent
      animationType="none"
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      {/* ── Animated backdrop — synced to sheet position, visual only ── */}
      <Animated.View
        style={[
          StyleSheet.absoluteFillObject,
          styles.backdrop,
          /* Explicit initial opacity guards against the pre-Reanimated frame
             on web where the animated style hasn't been applied yet. */
          { opacity: 0 },
          backdropStyle,
        ]}
        pointerEvents="none"
      />

      {/* ── Dismiss area above the sheet ── */}
      <Pressable style={styles.dismissArea} onPress={handleClose} />

      {/* ── Animated sheet panel ── */}
      <Animated.View
        style={[
          styles.sheet,
          { maxHeight, paddingBottom: sheetBottomPad },
          /* Explicit initial transform keeps the sheet off-screen before
             Reanimated takes over on the first render frame. */
          { transform: [{ translateY: screenH }] },
          sheetAnimStyle,
          sheetStyle,
        ]}
      >
        {children}
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: "#000",
  },
  dismissArea: {
    flex: 1,
  },
  sheet: {
    backgroundColor:      "#FFFFFF",
    borderTopLeftRadius:   24,
    borderTopRightRadius:  24,
    paddingHorizontal:     24,
    paddingTop:            16,
    shadowColor:           "#000",
    shadowOffset:          { width: 0, height: -4 },
    shadowOpacity:         0.08,
    shadowRadius:          16,
    elevation:             12,
  },
});
