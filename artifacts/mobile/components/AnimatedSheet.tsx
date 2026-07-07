import React, { useCallback, useEffect, useLayoutEffect, useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  View,
  ViewStyle,
  useWindowDimensions,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import * as Haptics from "expo-haptics";
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

const DISMISS_VELOCITY = 800;
const DRAG_RESISTANCE  = 0.92;

/** Spring config for snapping between points */
const SNAP_SPRING = { damping: 28, stiffness: 320, mass: 0.85 };

/** Rubber-band resistance for upward overshoots */
const RUBBER_FACTOR = 0.12;

/**
 * Find the translateY value of the nearest snap point.
 * snapYs: array of translateY targets (smaller = higher on screen = bigger sheet)
 * velY: release velocity — positive means moving down (toward dismiss)
 */
function nearestSnapY(
  currentY: number,
  snapYs: readonly number[],
  velY: number,
): number {
  "worklet";
  // Velocity bias: shift the effective position in the velocity direction
  const biased = currentY + velY * 0.08;
  let best = snapYs[0];
  let bestDist = Math.abs(biased - best);
  for (let i = 1; i < snapYs.length; i++) {
    const dist = Math.abs(biased - snapYs[i]);
    if (dist < bestDist) { best = snapYs[i]; bestDist = dist; }
  }
  return best;
}

export interface AnimatedSheetProps {
  visible:          boolean;
  onClose:          () => void;
  children:         React.ReactNode;
  /**
   * Height constraint of the sheet content.
   * Ignored when `snapPoints` are provided (sheet fills to top snap automatically).
   */
  maxHeight?:       number | `${number}%`;
  sheetStyle?:      ViewStyle;
  /**
   * Multi-snap bottom sheet.
   * Array of fractions (0–1) of screen height the sheet can occupy, e.g. [0.35, 0.65, 0.95].
   * Sheet opens to `initialSnapIndex` and snaps between points on gesture release.
   * Dismissed when dragged below the smallest snap point.
   */
  snapPoints?:      readonly number[];
  /** Index into snapPoints to open at. Defaults to the middle snap or 0. */
  initialSnapIndex?: number;
  /** Show the drag handle pill at the top of the sheet. Default: true. */
  showHandle?:      boolean;
}

export function AnimatedSheet({
  visible,
  onClose,
  children,
  maxHeight = "65%",
  sheetStyle,
  snapPoints,
  initialSnapIndex,
  showHandle = true,
}: AnimatedSheetProps) {
  const { height: screenH } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const [mounted, setMounted] = useState(visible);

  const screenHSV  = useSharedValue(screenH);
  const translateY = useSharedValue(screenH);
  /** Current resting position (translateY when idle). 0 = fully open. */
  const openY      = useSharedValue(screenH);
  const isClosing  = useSharedValue(false);

  useEffect(() => {
    screenHSV.value = screenH;
  }, [screenH, screenHSV]);

  // ── Snap point helpers ─────────────────────────────────────────────────
  /** translateY values for each snap point (smaller = taller sheet) */
  const snapYs = snapPoints
    ? (snapPoints.map(f => screenH * (1 - f)) as readonly number[])
    : null;

  /** The translateY below which we dismiss (just below the smallest snap) */
  const dismissY = snapYs
    ? screenH * (1 - Math.min(...snapPoints!)) + 32
    : screenH * 0.72;

  /** Initial resting translateY */
  const initY = snapYs
    ? snapYs[initialSnapIndex ?? Math.floor(snapYs.length / 2)]
    : 0;

  // ── JS-side close finalisers ───────────────────────────────────────────
  const finaliseClose = useCallback(() => {
    setMounted(false);
    onClose();
  }, [onClose]);

  const finaliseMountedOnly = useCallback(() => {
    setMounted(false);
  }, []);

  const triggerSnapHaptic = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
  }, []);

  // ── Animate in ────────────────────────────────────────────────────────
  const animateIn = useCallback(() => {
    isClosing.value  = false;
    cancelAnimation(translateY);
    translateY.value = screenHSV.value;
    openY.value      = initY;
    translateY.value = withTiming(initY, { duration: OPEN_DURATION, easing: OPEN_EASING });
  }, [translateY, screenHSV, openY, isClosing, initY]);

  // ── Animate out ───────────────────────────────────────────────────────
  const animateOut = useCallback((withCallback: boolean) => {
    if (isClosing.value) return;
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

  // ── Sync with parent `visible` prop ───────────────────────────────────
  useEffect(() => {
    if (visible) {
      setMounted(true);
    } else {
      animateOut(false);
    }
  }, [visible]); // eslint-disable-line react-hooks/exhaustive-deps

  useLayoutEffect(() => {
    if (mounted && visible) animateIn();
  }, [mounted]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleClose = useCallback(() => {
    animateOut(true);
  }, [animateOut]);

  // ── Pan gesture ────────────────────────────────────────────────────────
  const panGesture = Gesture.Pan()
    .activeOffsetY(10)
    .onUpdate((e) => {
      if (isClosing.value) return;
      const drag = e.translationY;

      if (drag < 0) {
        // Upward overshot → rubber band resistance
        translateY.value = openY.value + drag * RUBBER_FACTOR;
        return;
      }

      // Downward drag with progressive resistance
      const resistanceFactor = Math.max(
        DRAG_RESISTANCE * 0.75,
        DRAG_RESISTANCE - (drag / (screenHSV.value * 4)) * 0.1,
      );
      translateY.value = openY.value + drag * resistanceFactor;
    })
    .onEnd((e) => {
      if (isClosing.value) return;

      const shouldDismiss =
        translateY.value > dismissY ||
        e.velocityY > DISMISS_VELOCITY;

      if (shouldDismiss) {
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
        return;
      }

      if (snapYs && snapYs.length > 1) {
        // Multi-snap: find nearest snap point
        const target = nearestSnapY(translateY.value, snapYs, e.velocityY);
        const prevOpen = openY.value;
        openY.value = target;
        translateY.value = withSpring(target, SNAP_SPRING);
        // Haptic only when crossing to a different snap
        if (Math.abs(target - prevOpen) > 8) {
          runOnJS(triggerSnapHaptic)();
        }
      } else {
        // Single snap: spring back to rest
        translateY.value = withSpring(openY.value, {
          velocity:  e.velocityY,
          damping:   26,
          stiffness: 300,
          mass:      0.8,
        });
      }
    });

  // ── Animated styles ───────────────────────────────────────────────────
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

  const sheetBottomPad = Math.max(insets.bottom, 12) + 12;
  // When snap points are active, let height fill to the tallest snap
  const resolvedMaxHeight = snapYs
    ? (screenH * Math.max(...snapPoints!)) - sheetBottomPad
    : maxHeight;

  return (
    <Modal
      visible
      transparent
      animationType="none"
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      {/* Animated backdrop */}
      <Animated.View
        style={[
          StyleSheet.absoluteFillObject,
          styles.backdrop,
          { opacity: 0 },
          backdropStyle,
        ]}
        pointerEvents="none"
      />

      {/* Dismiss area above the sheet */}
      <Pressable style={styles.dismissArea} onPress={handleClose} />

      {/* Floating sheet panel */}
      <GestureDetector gesture={panGesture}>
        <Animated.View
          style={[
            styles.sheet,
            { maxHeight: resolvedMaxHeight, paddingBottom: sheetBottomPad },
            { transform: [{ translateY: screenH }] },
            sheetAnimStyle,
            sheetStyle,
          ]}
        >
          {/* Drag handle */}
          {showHandle && (
            <View style={styles.handleArea} pointerEvents="none">
              <View style={styles.handle} />
            </View>
          )}
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
    marginHorizontal:  12,
    marginBottom:      12,
    backgroundColor:   "#FFFFFF",
    borderRadius:      24,
    paddingHorizontal: 0,
    paddingTop:        0,
    shadowColor:       "#000",
    shadowOffset:      { width: 0, height: -2 },
    shadowOpacity:     0.12,
    shadowRadius:      24,
    elevation:         16,
    overflow:          "hidden",
  },
  handleArea: {
    width:          "100%",
    alignItems:     "center",
    paddingTop:     10,
    paddingBottom:  4,
  },
  handle: {
    width:        36,
    height:       4,
    borderRadius: 2,
    backgroundColor: "#E0E0E6",
  },
});
