import lottie, { AnimationItem } from "lottie-web";
import React, { useEffect, useRef } from "react";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const animationData = require("../assets/animations/wallet-lottie.json");

export default function LottieWalletSlide({
  slideW,
  slideH,
}: {
  slideW: number;
  slideH: number;
  illustrationSize?: number;
  isActive?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const animRef = useRef<AnimationItem | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) {
      console.warn("[LottieWalletSlide] container ref is null");
      return;
    }
    console.log("[LottieWalletSlide] mounting lottie, el:", el);
    try {
      animRef.current = lottie.loadAnimation({
        container: el,
        renderer: "svg",
        loop: true,
        autoplay: true,
        animationData,
      });
      console.log("[LottieWalletSlide] lottie loaded:", animRef.current);
    } catch (err) {
      console.error("[LottieWalletSlide] lottie error:", err);
    }
    return () => {
      animRef.current?.destroy();
      animRef.current = null;
    };
  }, []);

  const size = Math.round(Math.min(slideW, slideH) * 0.88);

  return (
    <div
      style={{
        width: slideW,
        height: slideH,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "transparent",
      }}
    >
      <div
        ref={containerRef}
        style={{
          width: size,
          height: size,
          border: "2px solid red",
        }}
      />
    </div>
  );
}
