import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  ViewStyle,
  useWindowDimensions,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
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
import { useSafeAreaInsets } from "react-native-safe-area-context";

const OPEN_DURATION  = 340;
const CLOSE_DURATION = 260;
const OPEN_EASING    = Easing.out(Easing.cubic);
const CLOSE_EASING   = Easing.in(Easing.quad);

/* Dismiss if dragged past 28% of screen height OR released with velocity > 500 */
const DISMISS_RATIO    = 0.28;
const DISMISS_VELOCITY = 500;

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

  const screenHSV  = useSharedValue(screenH);
  const translateY = useSharedValue(screenH);
  /* Tracks the current "resting" open position — normally 0 when fully open */
  const openY      = useSharedValue(screenH);

  useEffect(() => {
    screenHSV.value = screenH;
  }, [screenH, screenHSV]);

  /* ── Animate in ──────────────────────────────────────────────────────── */
  const animateIn = useCallback(() => {
    cancelAnimation(translateY);
    translateY.value = screenHSV.value;
    openY.value      = 0;
    translateY.value = withTiming(0, { duration: OPEN_DURATION, easing: OPEN_EASING });
  }, [translateY, screenHSV, openY]);

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

  useLayoutEffect(() => {
    if (mounted && visible) {
      animateIn();
    }
  }, [mounted]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Close handler ───────────────────────────────────────────────────── */
  const handleClose = useCallback(() => {
    animateOut(onClose);
  }, [animateOut, onClose]);

  /* ── Pan gesture — drag to dismiss ──────────────────────────────────── */
  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      /* Only allow dragging downward */
      translateY.value = Math.max(0, openY.value + e.translationY);
    })
    .onEnd((e) => {
      const dismissed =
        e.translationY > screenHSV.value * DISMISS_RATIO ||
        e.velocityY > DISMISS_VELOCITY;

      if (dismissed) {
        runOnJS(handleClose)();
      } else {
        /* Snap back to open position */
        translateY.value = withSpring(openY.value, {
          damping:   22,
          stiffness: 280,
          mass:      0.7,
        });
      }
    });

  /* ── Animated styles ─────────────────────────────────────────────────── */
  const backdropStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      translateY.value,
      [0, screenHSV.value],
      [0.5, 0],
      "clamp",
    ),
  }));

  const sheetAnimStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  if (!mounted) return null;

  const sheetBottomPad = Math.max(insets.bottom, 12) + 12;

  return (
    <Modal
      visible
      transparent
      animationType="none"
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      {/* ── Animated backdrop ── */}
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

      {/* ── Floating sheet panel ── */}
      <GestureDetector gesture={panGesture}>
        <Animated.View
          style={[
            styles.sheet,
            { maxHeight, paddingBottom: sheetBottomPad },
            { transform: [{ translateY: screenH }] },
            sheetAnimStyle,
            sheetStyle,
          ]}
        >
          {children}
        </Animated.View>
      </GestureDetector>
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
    /* Floating card — inset from screen edges */
    marginHorizontal:    12,
    marginBottom:        12,
    backgroundColor:     "#FFFFFF",
    borderRadius:        24,
    paddingHorizontal:   0,
    paddingTop:          0,
    shadowColor:         "#000",
    shadowOffset:        { width: 0, height: -2 },
    shadowOpacity:       0.12,
    shadowRadius:        24,
    elevation:           16,
    overflow:            "hidden",
  },
});
