/**
 * AnimatedSheet — reusable bottom sheet with a backdrop whose opacity is
 * derived directly from the sheet's translateY position. This eliminates
 * the flash/snap of a static overlay by keeping both animations in
 * perfect sync on the UI thread via Reanimated interpolation.
 *
 * Usage:
 *   <AnimatedSheet visible={open} onClose={() => setOpen(false)}>
 *     ...content...
 *   </AnimatedSheet>
 */

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Dimensions,
  Modal,
  Pressable,
  StyleSheet,
  ViewStyle,
} from "react-native";
import Animated, {
  Easing,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const { height: SCREEN_H } = Dimensions.get("window");

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
  /* Internal modal visibility — controlled by animation lifecycle, not
     directly by the `visible` prop, so we can animate out before unmounting */
  const [mounted, setMounted] = useState(visible);
  const animating = useRef(false);

  const translateY = useSharedValue(SCREEN_H);

  /* ── Animate in ─────────────────────────────────────────────────────── */
  const animateIn = useCallback(() => {
    animating.current = true;
    translateY.value = SCREEN_H;
    translateY.value = withTiming(0, { duration: OPEN_DURATION, easing: OPEN_EASING }, () => {
      animating.current = false;
    });
  }, [translateY]);

  /* ── Animate out ────────────────────────────────────────────────────── */
  const animateOut = useCallback((callback?: () => void) => {
    if (animating.current && translateY.value === SCREEN_H) return; // already hidden
    animating.current = true;
    translateY.value = withTiming(
      SCREEN_H,
      { duration: CLOSE_DURATION, easing: CLOSE_EASING },
      (finished) => {
        if (finished) {
          runOnJS(setMounted)(false);
          animating.current = false;
          if (callback) runOnJS(callback)();
        }
      },
    );
  }, [translateY]);

  /* ── Sync with parent `visible` prop ────────────────────────────────── */
  useEffect(() => {
    if (visible) {
      setMounted(true);
    } else {
      animateOut();
    }
  }, [visible]); // eslint-disable-line react-hooks/exhaustive-deps

  /* Kick off the open animation once the modal is actually mounted */
  useEffect(() => {
    if (mounted && visible) {
      animateIn();
    }
  }, [mounted]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Backdrop press / back-button handler ───────────────────────────── */
  const handleClose = useCallback(() => {
    /* Animate out, then notify parent so it sets visible=false.
       The subsequent visible=false → useEffect will be a no-op because
       mounted will already be false by then. */
    animateOut(onClose);
  }, [animateOut, onClose]);

  /* ── Animated styles ─────────────────────────────────────────────────── */
  const backdropStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateY.value, [0, SCREEN_H], [0.55, 0], "clamp"),
  }));

  const sheetAnimStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  if (!mounted) return null;

  return (
    <Modal
      visible
      transparent
      animationType="none"
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      {/* ── Animated backdrop — visual only, pointerEvents="none" ── */}
      <Animated.View
        style={[StyleSheet.absoluteFillObject, styles.backdrop, backdropStyle]}
        pointerEvents="none"
      />

      {/* ── Dismiss area above the sheet ── */}
      <Pressable style={styles.dismissArea} onPress={handleClose} />

      {/* ── Animated sheet panel ── */}
      <Animated.View style={[styles.sheet, { maxHeight }, sheetAnimStyle, sheetStyle]}>
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
    backgroundColor:     "#FFFFFF",
    borderTopLeftRadius:  24,
    borderTopRightRadius: 24,
    paddingHorizontal:    24,
    paddingTop:           16,
    paddingBottom:        40,
    shadowColor:          "#000",
    shadowOffset:         { width: 0, height: -4 },
    shadowOpacity:        0.08,
    shadowRadius:         16,
    elevation:            12,
  },
});
