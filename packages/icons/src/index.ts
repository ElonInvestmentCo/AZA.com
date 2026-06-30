export type IconName =
  | "gift-card"
  | "virtual-card"
  | "bill"
  | "airtime"
  | "data"
  | "wallet"
  | "send"
  | "receive"
  | "security"
  | "shield"
  | "star"
  | "check"
  | "arrow-right"
  | "phone"
  | "mail"
  | "support"
  | "electricity"
  | "water"
  | "cable-tv"
  | "internet"
  | "education"
  | "government"
  | "mtn"
  | "airtel"
  | "glo"
  | "9mobile"
  | "amazon"
  | "apple"
  | "google-play"
  | "steam"
  | "itunes"
  | "walmart";

export const FEATURE_ICONS: Record<string, { label: string; lucideName: string; emoji: string }> = {
  "gift-card": { label: "Gift Cards", lucideName: "Gift", emoji: "🎁" },
  "virtual-card": { label: "Virtual Card", lucideName: "CreditCard", emoji: "💳" },
  "bill": { label: "Bill Payments", lucideName: "FileText", emoji: "📄" },
  "airtime": { label: "Airtime", lucideName: "Phone", emoji: "📱" },
  "data": { label: "Data Bundle", lucideName: "Wifi", emoji: "📶" },
  "wallet": { label: "Wallet", lucideName: "Wallet", emoji: "👛" },
  "send": { label: "Send", lucideName: "Send", emoji: "📤" },
  "receive": { label: "Receive", lucideName: "Download", emoji: "📥" },
  "security": { label: "Security", lucideName: "Shield", emoji: "🔒" },
  "electricity": { label: "Electricity", lucideName: "Zap", emoji: "⚡" },
  "water": { label: "Water", lucideName: "Droplets", emoji: "💧" },
  "cable-tv": { label: "Cable TV", lucideName: "Tv", emoji: "📺" },
  "internet": { label: "Internet", lucideName: "Wifi", emoji: "🌐" },
  "education": { label: "Education", lucideName: "BookOpen", emoji: "📚" },
  "government": { label: "Government", lucideName: "Landmark", emoji: "🏛️" },
} as const;

export const NETWORK_COLORS: Record<string, string> = {
  MTN: "#FFCC00",
  Airtel: "#FF0000",
  Glo: "#008000",
  "9mobile": "#006600",
} as const;

export const GIFT_CARD_EMOJIS: Record<string, string> = {
  amazon: "🛒",
  apple: "🍎",
  google_play: "🎮",
  steam: "🎮",
  itunes: "🎵",
  walmart: "🛍️",
  target: "🎯",
  ebay: "🏷️",
  nordstrom: "👗",
  nike: "👟",
  sephora: "💄",
  other: "🎁",
} as const;
