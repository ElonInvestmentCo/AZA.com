import React, { useEffect, useRef } from "react";
import { View } from "react-native";

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
    const outerEl = outerRef.current as unknown as HTMLElement;
    if (!outerEl) return;

    // Match the exact cardSize + positioning used by the original working placeholder
    const cardSize = Math.round(Math.min(slideW * 0.72, slideH * 0.88));

    const container = document.createElement("div");
    container.style.cssText = [
      `width:${cardSize}px`,
      `height:${cardSize}px`,
      `position:absolute`,
      `top:50%`,
      `left:50%`,
      `transform:translate(-50%,-50%)`,
      `overflow:visible`,
      `z-index:10`,
    ].join(";");

    outerEl.appendChild(container);

    let anim: { destroy(): void } | null = null;
    try {
      anim = lottie.loadAnimation({
        container,
        renderer: "svg",
        loop: true,
        autoplay: true,
        animationData,
      });
    } catch (err) {
      console.error("[LottieWalletSlide] loadAnimation error:", err);
    }

    return () => {
      anim?.destroy();
      container.remove();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View
      // @ts-ignore
      ref={outerRef}
      style={{
        width: slideW,
        height: slideH,
        backgroundColor: "#0B0820",
        position: "relative",
      }}
    />
  );
}
