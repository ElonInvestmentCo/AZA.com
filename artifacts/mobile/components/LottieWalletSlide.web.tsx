import lottie, { AnimationItem } from "lottie-web";
import React, { useEffect, useRef } from "react";
import { View } from "react-native";

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
    if (!el) return;
    animRef.current = lottie.loadAnimation({
      container: el,
      renderer: "svg",
      loop: true,
      autoplay: true,
      animationData,
    });
    return () => {
      animRef.current?.destroy();
      animRef.current = null;
    };
  }, []);

  const size = Math.round(Math.min(slideW, slideH) * 0.88);

  return (
    <View
      style={{
        width: slideW,
        height: slideH,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* @ts-ignore – valid on web; ref on div not in RN types */}
      <div
        ref={containerRef}
        style={{ width: size, height: size }}
      />
    </View>
  );
}
