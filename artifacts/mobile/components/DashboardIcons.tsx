import React from "react";
import Svg, {
  Path,
  Rect,
  Circle,
  G,
  Ellipse,
  Line,
  Polyline,
} from "react-native-svg";

interface IconProps {
  size?: number;
  color?: string;
}

/* ─── Quick Action Icons (white on black bar) ─────────────────────────── */

/** Fund Wallet — wallet outline + plus badge overlay (Figma Group 1024) */
export function FundWalletIcon({ size = 20, color = "#FFFFFF" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      {/* Wallet body */}
      <Rect x="1" y="5" width="16" height="12" rx="2" stroke={color} strokeWidth="1.5" />
      {/* Wallet flap top */}
      <Path d="M1 8.5H17" stroke={color} strokeWidth="1.5" />
      {/* Card slot */}
      <Rect x="11.5" y="11" width="4" height="2.5" rx="0.75" fill={color} />
      {/* Plus badge circle */}
      <Circle cx="15" cy="5" r="4" fill={color === "#FFFFFF" ? "#000000" : "#FFFFFF"} />
      {/* Plus sign */}
      <Path
        d="M15 3.2V6.8M13.2 5H16.8"
        stroke={color}
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </Svg>
  );
}

/** Sell — send / paper-plane diagonal arrow (Figma send icon) */
export function SellIcon({ size = 20, color = "#FFFFFF" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <Path
        d="M17.5 2.5L9.17 10.83"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M17.5 2.5L12.5 17.5L9.17 10.83L2.5 7.5L17.5 2.5Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/** Withdraw — tray with upward arrow (Figma arrow-up-from-base) */
export function WithdrawIcon({ size = 20, color = "#FFFFFF" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      {/* Base tray */}
      <Path
        d="M3.5 16H16.5"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* Arrow stem */}
      <Path
        d="M10 13V4"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* Arrow head */}
      <Path
        d="M6 7.5L10 3.5L14 7.5"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/* ─── Service Grid Icons ──────────────────────────────────────────────── */

/** Gift Card — present box with ribbon (Figma gift icon) */
export function GiftCardIcon({ size = 20, color = "#5C4000" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      {/* Box body */}
      <Rect x="2" y="9" width="16" height="10" rx="1.5" stroke={color} strokeWidth="1.4" />
      {/* Lid */}
      <Rect x="1" y="6" width="18" height="4" rx="1.5" stroke={color} strokeWidth="1.4" />
      {/* Centre ribbon vertical */}
      <Path d="M10 6V19" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
      {/* Left ribbon bow */}
      <Path
        d="M10 6C10 6 8 3 6 4C4 5 6 7 8 6.5"
        stroke={color}
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Right ribbon bow */}
      <Path
        d="M10 6C10 6 12 3 14 4C16 5 14 7 12 6.5"
        stroke={color}
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/** Airtime — phone handset with signal arcs (Figma Water Drop / 24 / Outline repurposed for phone signal) */
export function AirtimeIcon({ size = 20, color = "#0891B2" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      {/* Phone body */}
      <Path
        d="M4.5 3.5C4.5 2.67 5.17 2 6 2H14C14.83 2 15.5 2.67 15.5 3.5V16.5C15.5 17.33 14.83 18 14 18H6C5.17 18 4.5 17.33 4.5 16.5V3.5Z"
        stroke={color}
        strokeWidth="1.4"
      />
      {/* Home button / indicator */}
      <Circle cx="10" cy="15.5" r="0.75" fill={color} />
      {/* Screen / signal bars inside phone */}
      <Path d="M7.5 6H9" stroke={color} strokeWidth="1.3" strokeLinecap="round" />
      <Path d="M7.5 8.5H12.5" stroke={color} strokeWidth="1.3" strokeLinecap="round" />
      <Path d="M7.5 11H11" stroke={color} strokeWidth="1.3" strokeLinecap="round" />
    </Svg>
  );
}

/** Electricity — lightning bolt (Figma zap / Water Drop outline) */
export function ElectricityIcon({ size = 20, color = "#D97706" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <Path
        d="M11.5 2L3.5 11.5H10L8.5 18L16.5 8.5H10L11.5 2Z"
        stroke={color}
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/** Cable TV — monitor/TV screen (Figma Tv / 24 / Outline — Group 1316) */
export function CableTVIcon({ size = 20, color = "#E11D48" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      {/* Screen */}
      <Rect x="1.5" y="3" width="17" height="12" rx="2" stroke={color} strokeWidth="1.4" />
      {/* Stand stem */}
      <Path d="M10 15V18" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
      {/* Stand base */}
      <Path d="M7 18H13" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
      {/* Antenna left */}
      <Path d="M7 3L5 1" stroke={color} strokeWidth="1.3" strokeLinecap="round" />
      {/* Antenna right */}
      <Path d="M13 3L15 1" stroke={color} strokeWidth="1.3" strokeLinecap="round" />
    </Svg>
  );
}

/**
 * Rates — 3-bar chart (Figma bar-chart 18.9×18.9, path p28eeeb80)
 * Exact Figma path: viewBox 0 0 14.175 14.175
 */
export function RatesIcon({ size = 20, color = "#7C3AED" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 14.175 14.175" fill="none">
      <Path
        d={
          "M0 1.575C0 0.705152 0.705152 0 1.575 0H12.6C13.4698 0 14.175 0.705152 14.175 1.575V12.6C14.175 13.4698 13.4698 14.175 12.6 14.175H1.575C0.705152 14.175 0 13.4698 0 12.6V1.575ZM12.6 1.575H1.575V12.6H12.6V1.575ZM7.0875 3.15C7.52242 3.15 7.875 3.50258 7.875 3.9375V10.2375C7.875 10.6724 7.52242 11.025 7.0875 11.025C6.65258 11.025 6.3 10.6724 6.3 10.2375V3.9375C6.3 3.50258 6.65258 3.15 7.0875 3.15ZM10.2375 4.725C10.6724 4.725 11.025 5.07758 11.025 5.5125V10.2375C11.025 10.6724 10.6724 11.025 10.2375 11.025C9.80257 11.025 9.45 10.6724 9.45 10.2375V5.5125C9.45 5.07758 9.80257 4.725 10.2375 4.725ZM3.9375 6.3C4.37242 6.3 4.725 6.65258 4.725 7.0875V10.2375C4.725 10.6724 4.37242 11.025 3.9375 11.025C3.50258 11.025 3.15 10.6724 3.15 10.2375V7.0875C3.15 6.65258 3.50258 6.3 3.9375 6.3Z"
        }
        fill={color}
      />
    </Svg>
  );
}

/**
 * Transactions — 3-row filter/slider (Figma filter icon, path p351d000)
 * Exact Figma path: viewBox 0 0 14 15.75
 */
export function TransactionsIcon({ size = 20, color = "#2563EB" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 13.9985 15.7484" fill="none">
      <Path
        d={
          "M4.37455 1.74982C3.89135 1.74982 3.49964 2.14153 3.49964 2.62473C3.49964 3.10793 3.89135 3.49964 4.37455 3.49964C4.85774 3.49964 5.24945 3.10793 5.24945 2.62473C5.24945 2.14153 4.85774 1.74982 4.37455 1.74982ZM1.89917 1.74982C2.25949 0.730381 3.23172 0 4.37455 0C5.51737 0 6.4896 0.730381 6.84992 1.74982H13.1236C13.6068 1.74982 13.9985 2.14153 13.9985 2.62473C13.9985 3.10793 13.6068 3.49964 13.1236 3.49964H6.84992C6.4896 4.51907 5.51737 5.24945 4.37455 5.24945C3.23172 5.24945 2.25949 4.51907 1.89917 3.49964H0.874909C0.39171 3.49964 0 3.10793 0 2.62473C0 2.14153 0.39171 1.74982 0.874909 1.74982H1.89917ZM9.624 6.99927C9.1408 6.99927 8.74909 7.39098 8.74909 7.87418C8.74909 8.35738 9.1408 8.74909 9.624 8.74909C10.1072 8.74909 10.4989 8.35738 10.4989 7.87418C10.4989 7.39098 10.1072 6.99927 9.624 6.99927ZM7.14862 6.99927C7.50894 5.97984 8.48118 5.24945 9.624 5.24945C10.7668 5.24945 11.7391 5.97984 12.0994 6.99927H13.1236C13.6068 6.99927 13.9985 7.39098 13.9985 7.87418C13.9985 8.35738 13.6068 8.74909 13.1236 8.74909H12.0994C11.7391 9.76853 10.7668 10.4989 9.624 10.4989C8.48118 10.4989 7.50894 9.76853 7.14862 8.74909H0.874909C0.39171 8.74909 0 8.35738 0 7.87418C0 7.39098 0.39171 6.99927 0.874909 6.99927H7.14862ZM4.37455 12.2487C3.89135 12.2487 3.49964 12.6404 3.49964 13.1236C3.49964 13.6068 3.89135 13.9985 4.37455 13.9985C4.85774 13.9985 5.24945 13.6068 5.24945 13.1236C5.24945 12.6404 4.85774 12.2487 4.37455 12.2487ZM1.89917 12.2487C2.25949 11.2293 3.23172 10.4989 4.37455 10.4989C5.51737 10.4989 6.4896 11.2293 6.84992 12.2487H13.1236C13.6068 12.2487 13.9985 12.6404 13.9985 13.1236C13.9985 13.6068 13.6068 13.9985 13.1236 13.9985H6.84992C6.4896 15.018 5.51737 15.7484 4.37455 15.7484C3.23172 15.7484 2.25949 15.018 1.89917 13.9985H0.874909C0.39171 13.9985 0 13.6068 0 13.1236C0 12.6404 0.39171 12.2487 0.874909 12.2487H1.89917Z"
        }
        fill={color}
      />
    </Svg>
  );
}

/** Betting — dice / coin with dollar mark */
export function BettingIcon({ size = 20, color = "#0891B2" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      {/* Outer circle coin */}
      <Circle cx="10" cy="10" r="8" stroke={color} strokeWidth="1.4" />
      {/* Dollar sign */}
      <Path
        d="M10 5.5V7M10 13V14.5M12.5 7.5C12.5 7.5 11.5 6.5 10 6.5C8.5 6.5 7.5 7.5 7.5 8.5C7.5 9.5 8.5 10 10 10C11.5 10 12.5 10.5 12.5 11.5C12.5 12.5 11.5 13.5 10 13.5C8.5 13.5 7.5 12.5 7.5 12.5"
        stroke={color}
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/**
 * Funding — money banknote / lines with bullet (Figma money/24/Outline, path p2e94cc80)
 * Exact Figma path: viewBox 0 0 12.6 9.45
 */
export function FundingIcon({ size = 20, color = "#1D6ECC" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 12.6 9.45" fill="none">
      <Path
        d={
          "M0 0.7875C0 0.352576 0.352576 0 0.7875 0H1.575C2.00992 0 2.3625 0.352576 2.3625 0.7875C2.3625 1.22242 2.00992 1.575 1.575 1.575H0.7875C0.352576 1.575 0 1.22242 0 0.7875ZM3.9375 0.7875C3.9375 0.352576 4.29008 0 4.725 0H11.8125C12.2474 0 12.6 0.352576 12.6 0.7875C12.6 1.22242 12.2474 1.575 11.8125 1.575H4.725C4.29008 1.575 3.9375 1.22242 3.9375 0.7875ZM0 4.725C0 4.29008 0.352576 3.9375 0.7875 3.9375H1.575C2.00992 3.9375 2.3625 4.29008 2.3625 4.725C2.3625 5.15992 2.00992 5.5125 1.575 5.5125H0.7875C0.352576 5.5125 0 5.15992 0 4.725ZM3.9375 4.725C3.9375 4.29008 4.29008 3.9375 4.725 3.9375H11.8125C12.2474 3.9375 12.6 4.29008 12.6 4.725C12.6 5.15992 12.2474 5.5125 11.8125 5.5125H4.725C4.29008 5.5125 3.9375 5.15992 3.9375 4.725ZM0 8.6625C0 8.22758 0.352576 7.875 0.7875 7.875H1.575C2.00992 7.875 2.3625 8.22758 2.3625 8.6625C2.3625 9.09742 2.00992 9.45 1.575 9.45H0.7875C0.352576 9.45 0 9.09742 0 8.6625ZM3.9375 8.6625C3.9375 8.22758 4.29008 7.875 4.725 7.875H11.8125C12.2474 7.875 12.6 8.22758 12.6 8.6625C12.6 9.09742 12.2474 9.45 11.8125 9.45H4.725C4.29008 9.45 3.9375 9.09742 3.9375 8.6625Z"
        }
        fill={color}
      />
    </Svg>
  );
}

/** More — 2×2 dot grid (Figma grid/24/Outline) */
export function MoreIcon({ size = 20, color = "#7C3AED" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      {/* Top-left */}
      <Rect x="2" y="2" width="6.5" height="6.5" rx="1.5" stroke={color} strokeWidth="1.4" />
      {/* Top-right */}
      <Rect x="11.5" y="2" width="6.5" height="6.5" rx="1.5" stroke={color} strokeWidth="1.4" />
      {/* Bottom-left */}
      <Rect x="2" y="11.5" width="6.5" height="6.5" rx="1.5" stroke={color} strokeWidth="1.4" />
      {/* Bottom-right */}
      <Rect x="11.5" y="11.5" width="6.5" height="6.5" rx="1.5" stroke={color} strokeWidth="1.4" />
    </Svg>
  );
}

/* ─── Gift Card Modal Tile Icons (larger, 24px) ────────────────────────── */

/** Sell Gift Card — gift box with larger rendering */
export function SellGiftCardIcon({ size = 24, color = "#5C4000" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Box body */}
      <Rect x="2" y="11" width="20" height="11" rx="2" stroke={color} strokeWidth="1.6" />
      {/* Lid */}
      <Rect x="1" y="7" width="22" height="5" rx="2" stroke={color} strokeWidth="1.6" />
      {/* Centre ribbon vertical */}
      <Path d="M12 7V22" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
      {/* Left bow loop */}
      <Path
        d="M12 7C12 7 9.5 3.5 7 4.5C4.5 5.5 7 8.5 9.5 7.5"
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Right bow loop */}
      <Path
        d="M12 7C12 7 14.5 3.5 17 4.5C19.5 5.5 17 8.5 14.5 7.5"
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/** Check Pending — clock face with hands */
export function CheckPendingIcon({ size = 24, color = "#7A1535" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Clock face */}
      <Circle cx="12" cy="12" r="9.5" stroke={color} strokeWidth="1.6" />
      {/* Hour hand pointing up-right */}
      <Path
        d="M12 7V12L15.5 14"
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* 12 o'clock tick */}
      <Path d="M12 3V4.5" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
      {/* 3 o'clock tick */}
      <Path d="M19.5 12H21" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
    </Svg>
  );
}
