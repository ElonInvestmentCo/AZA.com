import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import React, { useEffect } from "react";
import { View } from "react-native";

const LOTTIE_URL =
  "https://lottie.host/9139a481-d8a2-4066-8ab6-1a5f13ada12f/uYLq4Z5FLB.lottie";

interface Props {
  size?: number;
  onFinish?: () => void;
  duration?: number;
}

export default function SplashAnimation({ size = 180, onFinish, duration = 2000 }: Props) {
  useEffect(() => {
    const t = setTimeout(() => onFinish?.(), duration);
    return () => clearTimeout(t);
  }, [duration, onFinish]);

  return (
    <View style={{ width: size, height: size }}>
      <DotLottieReact
        src={LOTTIE_URL}
        loop={false}
        autoplay
        style={{ width: size, height: size }}
      />
    </View>
  );
}
