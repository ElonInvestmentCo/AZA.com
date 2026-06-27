import * as Haptics from "expo-haptics";
import LottieView from "lottie-react-native";
import React, { useEffect } from "react";

const LOTTIE_URL =
  "https://lottie.host/9139a481-d8a2-4066-8ab6-1a5f13ada12f/uYLq4Z5FLB.lottie";

interface Props {
  size?: number;
  onFinish?: () => void;
  duration?: number;
}

export default function SplashAnimation({ size = 180, onFinish, duration = 2000 }: Props) {
  useEffect(() => {
    const t = setTimeout(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }, duration * 0.55);
    return () => clearTimeout(t);
  }, [duration]);

  return (
    <LottieView
      source={{ uri: LOTTIE_URL }}
      autoPlay
      loop={false}
      onAnimationFinish={() => onFinish?.()}
      style={{ width: size, height: size }}
      speed={1}
    />
  );
}
