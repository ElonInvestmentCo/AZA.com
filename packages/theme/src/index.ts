export const colors = {
  bg: "#0A0A0F",
  surface: "#14141F",
  card: "#1C1C2A",
  accent: "#00D9A0",
  accentDim: "rgba(0, 217, 160, 0.12)",
  accentGlow: "rgba(0, 217, 160, 0.22)",
  accentDark: "#00B386",
  muted: "#8F8FA3",
  border: "#2A2A3D",
  white: "#FFFFFF",
  destructive: "#FF5B7A",
  warning: "#FFB830",
  success: "#00D9A0",
  info: "#3B9EF5",

  gray: {
    50: "#F9F9FF",
    100: "#EDEDF5",
    200: "#D4D4E0",
    300: "#ABABC0",
    400: "#8F8FA3",
    500: "#636380",
    600: "#3D3D55",
    700: "#2A2A3D",
    800: "#1C1C2A",
    900: "#14141F",
    950: "#0A0A0F",
  },
} as const;

export const typography = {
  fontFamily: {
    sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
    mono: ["JetBrains Mono", "Fira Code", "monospace"],
  },
  fontSize: {
    xs: "0.75rem",
    sm: "0.875rem",
    base: "1rem",
    lg: "1.125rem",
    xl: "1.25rem",
    "2xl": "1.5rem",
    "3xl": "1.875rem",
    "4xl": "2.25rem",
    "5xl": "3rem",
    "6xl": "3.75rem",
    "7xl": "4.5rem",
  },
  fontWeight: {
    normal: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
    extrabold: "800",
    black: "900",
  },
  lineHeight: {
    tight: "1.1",
    snug: "1.3",
    normal: "1.5",
    relaxed: "1.65",
    loose: "2",
  },
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  "2xl": 48,
  "3xl": 64,
  "4xl": 80,
  "5xl": 96,
  "6xl": 128,
} as const;

export const radii = {
  sm: 8,
  md: 14,
  lg: 20,
  xl: 28,
  full: 9999,
} as const;

export const shadows = {
  sm: "0 1px 2px rgba(0,0,0,0.4)",
  md: "0 4px 12px rgba(0,0,0,0.5)",
  lg: "0 8px 32px rgba(0,0,0,0.6)",
  accent: "0 0 24px rgba(0,217,160,0.22)",
  accentLg: "0 0 48px rgba(0,217,160,0.18)",
} as const;

export const theme = {
  colors,
  typography,
  spacing,
  radii,
  shadows,
} as const;

export type Theme = typeof theme;
export type Colors = typeof colors;
