import { Platform } from "react-native";
import { useWindowDimensions } from "react-native";

export const MAX_CONTENT_WIDTH = 430;

export function useResponsive() {
  const { width, height } = useWindowDimensions();
  const isWeb = Platform.OS === "web";
  const contentWidth = isWeb ? Math.min(width, MAX_CONTENT_WIDTH) : width;
  const isMobile  = width < 640;
  const isTablet  = width >= 640 && width < 1024;
  const isDesktop = width >= 1024;
  return { screenWidth: width, screenHeight: height, contentWidth, isMobile, isTablet, isDesktop, isWeb };
}
