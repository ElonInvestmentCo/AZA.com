/**
 * AnimatedSheet — reusable bottom sheet with:
 *   • Backdrop opacity synced to sheet position (no flash/snap)
 *   • Swipe-to-dismiss via a drag handle at the top of the sheet
 *   • Spring snap-back when the drag doesn't meet the dismiss threshold
 *   • Scroll-safe: gesture is isolated to the handle bar so internal
 *     ScrollViews and FlatLists work normally
 *
 * Responsive: uses useWindowDimensions so the off-screen position is always
 * correct regardless of orientation or screen size.
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
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";

/* ── Timing constants ────────────────────────────────────────────────────── */
const OPEN_DURATION  = 340;
const CLOSE_DURATION = 260;
const OPEN_EASING    = Easing.out(Easing.cubic);
const CLOSE_EASING   = Easing.in(Easing.quad);

/* ── Dismiss thresholds ──────────────────────────────────────────────────── */
const DISMISS_DISTANCE = 120;   // px — drag this far down → dismiss
const DISMISS_VELOCITY = 800;   // px/s — flick this fast → dismiss

/* ── Spring config for snap-back ─────────────────────────────────────────── */
const SNAP_SPRING = { damping: 20, stiffness: 260, mass: 0.8 };

interface AnimatedSheetProps {
  visible:       boolean;
  onClose:       () => void;
  children:      React.ReactNode;
  maxHeight?:    number | `${number}%`;
  sheetStyle?:   ViewStyle;
  /** Show the grey drag-handle pill (default: true). */
  showHandle?:   boolean;
}

export function AnimatedSheet({
  visible,
  onClose,
  children,
  maxHeight  = "65%",
  sheetStyle,
  showHandle = true,
}: AnimatedSheetProps) {
  const { height: screenH } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const [mounted, setMounted] = useState(visible);

  const screenHSV  = useSharedValue(screenH);
  /** Master vertical position of the sheet (0 = fully open). */
  const translateY = useSharedValue(screenH);
  /** Extra offset added by an in-flight pan gesture. */
  const dragOffset = useSharedValue(0);

  useEffect(() => {
    screenHSV.value = screenH;
  }, [screenH, screenHSV]);

  /* ── Animate in ──────────────────────────────────────────────────────── */
  const animateIn = useCallback(() => {
    cancelAnimation(translateY);
    dragOffset.value = 0;
    translateY.value = screenHSV.value;
    translateY.value = withTiming(0, { duration: OPEN_DURATION, easing: OPEN_EASING });
  }, [translateY, dragOffset, screenHSV]);

  /* ── Animate out ─────────────────────────────────────────────────────── */
  const animateOut = useCallback((callback?: () => void) => {
    cancelAnimation(translateY);
    dragOffset.value = 0;
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
  }, [translateY, dragOffset, screenHSV]);

  /* ── Sync with parent `visible` prop ─────────────────────────────────── */
  useEffect(() => {
    if (visible) {
      setMounted(true);
    } else {
      animateOut();
    }
  }, [visible]); // eslint-disable-line react-hooks/exhaustive-deps

  useLayoutEffect(() => {
    if (mounted && visible) animateIn();
  }, [mounted]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Backdrop press / back-button handler ────────────────────────────── */
  const handleClose = useCallback(() => {
    animateOut(onClose);
  }, [animateOut, onClose]);

  /* ── Pan gesture — isolated to the drag handle ───────────────────────── */
  const panGesture = Gesture.Pan()
    .activeOffsetY([0, Infinity])   // only activate on downward movement
    .onUpdate((e) => {
      // Only allow dragging downward; prevent pulling the sheet upward
      dragOffset.value = Math.max(0, e.translationY);
      translateY.value = dragOffset.value;
    })
    .onEnd((e) => {
      const shouldDismiss =
        e.translationY > DISMISS_DISTANCE ||
        e.velocityY     > DISMISS_VELOCITY;

      if (shouldDismiss) {
        // Hand off to the close animation, then fire onClose on JS thread
        translateY.value = withTiming(
          screenHSV.value,
          { duration: CLOSE_DURATION, easing: CLOSE_EASING },
          (finished) => {
            if (finished) {
              dragOffset.value = 0;
              runOnJS(setMounted)(false);
              runOnJS(onClose)();
            }
          },
        );
      } else {
        // Snap back to fully-open position with a spring
        dragOffset.value = 0;
        translateY.value = withSpring(0, SNAP_SPRING);
      }
    });

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
      {/* ── Animated backdrop — synced to sheet position ── */}
      <Animated.View
        style={[
          StyleSheet.absoluteFillObject,
          styles.backdrop,
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
          { transform: [{ translateY: screenH }] },
          sheetAnimStyle,
          sheetStyle,
        ]}
      >
        {/* ── Drag handle — gesture is scoped here so scrollable
              content inside children is never blocked ── */}
        <GestureDetector gesture={panGesture}>
          <Animated.View style={styles.handleArea}>
            {showHandle && <Animated.View style={styles.handlePill} />}
          </Animated.View>
        </GestureDetector>

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
    paddingTop:           0,
    shadowColor:          "#000",
    shadowOffset:         { width: 0, height: -4 },
    shadowOpacity:        0.08,
    shadowRadius:         16,
    elevation:            12,
  },
  /* Taller hit area so the gesture is easy to trigger */
  handleArea: {
    width:          "100%",
    height:          36,
    alignItems:     "center",
    justifyContent: "center",
    paddingTop:      10,
  },
  handlePill: {
    width:           36,
    height:           4,
    borderRadius:     2,
    backgroundColor: "#D1D5DB",
  },
});
