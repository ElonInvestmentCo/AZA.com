import { Dimensions, PixelRatio, Platform } from "react-native";

const { width: W, height: H } = Dimensions.get("window");

const BASE_W = 390;

/**
 * rs(size) — Responsive size.
 * Scales a pixel value linearly from the 390dp base, clamped to ±25%.
 */
export function rs(size: number, min?: number, max?: number): number {
  const scaled = size * (W / BASE_W);
  const lo = min ?? size * 0.75;
  const hi = max ?? size * 1.25;
  return Math.round(Math.min(Math.max(scaled, lo), hi));
}

/**
 * rf(size) — Responsive font.
 * Like rs() but also respects the OS accessibility font-scale on native.
 * On web it returns the base size unchanged (CSS handles scaling there).
 */
export function rf(size: number): number {
  if (Platform.OS === "web") return size;
  const scaled  = size * (W / BASE_W);
  const clamped = Math.min(Math.max(scaled, size * 0.82), size * 1.18);
  return PixelRatio.roundToNearestPixel(clamped);
}

/** Raw screen dimensions captured at startup. */
export const SW = W;
export const SH = H;

/** True on iPhone SE 1/2/3 and similarly narrow devices (< 375dp). */
export const isSmallPhone = W < 375;

/** True on iPad / Android tablet (≥ 768dp). */
export const isTablet = W >= 768;

/** Maximum content width used by the web/tablet container. */
export const MAX_CONTENT_W = 430;
