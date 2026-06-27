import React, { useEffect, useRef } from "react";
import { StyleSheet, View } from "react-native";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const lottieLib = require("lottie-web");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const animationDataRaw = require("@/assets/animations/wallet-lottie.json");

const lottie = (lottieLib && lottieLib.default) ? lottieLib.default : lottieLib;
const animationData = (animationDataRaw && animationDataRaw.default)
  ? animationDataRaw.default
  : animationDataRaw;

export default function LottieWalletSlide({
  slideW,
  slideH,
}: {
  slideW: number;
  slideH: number;
  illustrationSize?: number;
  isActive?: boolean;
}) {
  const outerRef = useRef<View>(null);

  useEffect(() => {
    const el = outerRef.current as unknown as HTMLElement | null;
    if (!el) return;

    console.log("[LottieWalletSlide] outer el:", el.tagName, el.offsetWidth, "x", el.offsetHeight);

    let anim: { destroy(): void } | null = null;
    try {
      anim = lottie.loadAnimation({
        container: el,
        renderer: "canvas",
        loop: true,
        autoplay: true,
        animationData,
      });
    } catch (err) {
      console.error("[LottieWalletSlide] loadAnimation error:", err);
    }

    return () => {
      anim?.destroy();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View
      ref={outerRef}
      style={[styles.outer, { width: slideW, height: slideH }]}
    />
  );
}

const styles = StyleSheet.create({
  outer: {
    backgroundColor: "#0B0820",
    overflow: "hidden",
  },
});
