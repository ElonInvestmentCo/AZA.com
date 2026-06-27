import React, { useEffect, useRef } from "react";
import { View } from "react-native";

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

    const cardSize = Math.round(Math.min(slideW * 0.72, slideH * 0.88));

    // Create a raw unmanaged div and append it
    const div = document.createElement("div");
    div.style.cssText = `width:${cardSize}px;height:${cardSize}px;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);overflow:visible;z-index:10;`;

    // Inject a static SVG with bright colours
    div.innerHTML =
      `<svg width="${cardSize}" height="${cardSize}" xmlns="http://www.w3.org/2000/svg">` +
      `<rect width="${cardSize}" height="${cardSize}" fill="#FFD700"/>` +
      `<circle cx="${cardSize / 2}" cy="${cardSize / 2}" r="${cardSize * 0.35}" fill="white"/>` +
      `<text x="${cardSize / 2}" y="${cardSize / 2 + 8}" text-anchor="middle" fill="#0B0820" font-size="24" font-weight="bold">LOTTIE</text>` +
      `</svg>`;

    outerEl.appendChild(div);
    console.log("[LottieWalletSlide] static SVG injected. outerEl style:", outerEl.getAttribute("style"));

    return () => { div.remove(); };
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
