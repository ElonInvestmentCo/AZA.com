import React, { useCallback, useEffect, useLayoutEffect, useState } from "react";
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
  withDecay,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const OPEN_DURATION  = 340;
const OPEN_EASING    = Easing.out(Easing.cubic);
const CLOSE_EASING   = Easing.in(Easing.quad);

/**
 * Dismiss when dragged past 28% of screen height OR released with
 * velocity > 500 px/s.  DRAG_RESISTANCE < 1 gives the sheet a
 * weighted feel while the finger is moving.
 */
const DISMISS_RATIO    = 0.28;
const DISMISS_VELOCITY = 500;
const DRAG_RESISTANCE  = 0.92; // 1 = no resistance, lower = more resistance

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

  const screenHSV  = useSharedValue(screenH);
  const translateY = useSharedValue(screenH);
  /* "Resting" open position — 0 when fully open */
  const openY      = useSharedValue(screenH);
  /**
   * Guards against double-close: once either path (gesture decay or
   * parent-driven animateOut) starts the closing sequence, the other
   * path becomes a no-op.
   */
  const isClosing  = useSharedValue(false);

  useEffect(() => {
    screenHSV.value = screenH;
  }, [screenH, screenHSV]);

  /* ── JS-side close finalisers ─────────────────────────────────────── */
  const finaliseClose = useCallback(() => {
    setMounted(false);
    onClose();
  }, [onClose]);

  const finaliseMountedOnly = useCallback(() => {
    setMounted(false);
  }, []);

  /* ── Animate in ──────────────────────────────────────────────────── */
  const animateIn = useCallback(() => {
    isClosing.value  = false;
    cancelAnimation(translateY);
    translateY.value = screenHSV.value;
    openY.value      = 0;
    translateY.value = withTiming(0, { duration: OPEN_DURATION, easing: OPEN_EASING });
  }, [translateY, screenHSV, openY, isClosing]);

  /* ── Animate out (backdrop tap / hardware back / parent close) ────── */
  const animateOut = useCallback((withCallback: boolean) => {
    if (isClosing.value) return; // gesture path already owns the close
    isClosing.value  = true;
    cancelAnimation(translateY);
    translateY.value = withTiming(
      screenHSV.value,
      { duration: 260, easing: CLOSE_EASING },
      (finished) => {
        if (!finished) return;
        if (withCallback) runOnJS(finaliseClose)();
        else              runOnJS(finaliseMountedOnly)();
      },
    );
  }, [translateY, screenHSV, isClosing, finaliseClose, finaliseMountedOnly]);

  /* ── Sync with parent `visible` prop ─────────────────────────────── */
  useEffect(() => {
    if (visible) {
      setMounted(true);
    } else {
      animateOut(false); // parent already called onClose; just unmount
    }
  }, [visible]); // eslint-disable-line react-hooks/exhaustive-deps

  useLayoutEffect(() => {
    if (mounted && visible) animateIn();
  }, [mounted]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Backdrop / hardware-back handler ───────────────────────────── */
  const handleClose = useCallback(() => {
    animateOut(true);
  }, [animateOut]);

  /* ── Pan gesture — drag-to-dismiss ──────────────────────────────── */
  const panGesture = Gesture.Pan()
    /*
     * `activeOffsetY(N)` activates the gesture only once the finger has
     * travelled N px downward. This is the correct single-value form —
     * the array form `[lo, hi]` defines a dead zone (activates when
     * *outside* the range), which would be semantically wrong here.
     *
     * Effect on scroll conflict: when a ScrollView inside the sheet is
     * at its top boundary and the user drags downward, the scroll has
     * nowhere to go, so Gesture Handler hands the event to this gesture
     * after the 10 px threshold. Upward/horizontal scroll retains
     * priority because the finger never reaches the downward threshold.
     */
    .activeOffsetY(10)
    .onUpdate((e) => {
      if (isClosing.value) return;

      const drag = e.translationY;
      if (drag <= 0) return; // ignore upward overshoots mid-gesture

      /*
       * Resistance increases slightly the further the user pulls,
       * giving a weighted, spring-like feel without being distracting.
       */
      const resistanceFactor = Math.max(
        DRAG_RESISTANCE * 0.75,
        DRAG_RESISTANCE - (drag / (screenHSV.value * 4)) * 0.1,
      );
      translateY.value = openY.value + drag * resistanceFactor;
    })
    .onEnd((e) => {
      if (isClosing.value) return;

      const isDismissed =
        e.translationY > screenHSV.value * DISMISS_RATIO ||
        e.velocityY     > DISMISS_VELOCITY;

      if (isDismissed) {
        /*
         * Physics-based exit: the sheet continues with the finger's
         * release velocity so the motion feels like a natural throw
         * rather than a fixed-duration animation.
         */
        isClosing.value  = true;
        translateY.value = withDecay(
          {
            velocity:     Math.max(e.velocityY, DISMISS_VELOCITY),
            clamp:        [translateY.value, screenHSV.value + 300],
            deceleration: 0.997,
          },
          (finished) => {
            if (finished) runOnJS(finaliseClose)();
          },
        );
      } else {
        /*
         * Spring back using the actual release velocity so the return
         * feels like a continuation of the gesture, not a separate snap.
         */
        translateY.value = withSpring(openY.value, {
          velocity:  e.velocityY,
          damping:   26,
          stiffness: 300,
          mass:      0.8,
        });
      }
    });

  /* ── Animated styles ─────────────────────────────────────────────── */
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

      {/* ── Floating sheet panel — entire surface is gesture-sensitive ── */}
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
