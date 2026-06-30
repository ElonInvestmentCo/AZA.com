export const APP_NAME = "PayVora";
export const APP_TAGLINE = "Your money, supercharged.";
export const APP_DESCRIPTION =
  "Trade gift cards for instant cash, pay every bill in seconds, recharge airtime, get a virtual dollar card, and manage your wallet — all in one powerful app.";

export const WEBSITE_URL = "https://payvora.org";
export const SUPPORT_EMAIL = "support@payvora.org";
export const SUPPORT_PHONE = "+234 800 PAYVORA";

export const APP_STORE_URL = "https://apps.apple.com/app/payvora";
export const PLAY_STORE_URL = "https://play.google.com/store/apps/payvora";

export const SOCIAL_LINKS = {
  twitter: "https://twitter.com/payvora",
  instagram: "https://instagram.com/payvora",
  facebook: "https://facebook.com/payvora",
  telegram: "https://t.me/payvora",
  whatsapp: "https://wa.me/2348001234567",
} as const;

export const GIFT_CARD_CATEGORIES = [
  { id: "amazon", label: "Amazon", country: "US" },
  { id: "apple", label: "Apple", country: "US" },
  { id: "google_play", label: "Google Play", country: "US" },
  { id: "steam", label: "Steam", country: "US" },
  { id: "itunes", label: "iTunes", country: "US" },
  { id: "walmart", label: "Walmart", country: "US" },
  { id: "target", label: "Target", country: "US" },
  { id: "ebay", label: "eBay", country: "US" },
  { id: "nordstrom", label: "Nordstrom", country: "US" },
  { id: "sephora", label: "Sephora", country: "US" },
  { id: "nike", label: "Nike", country: "US" },
] as const;

export const MOBILE_NETWORKS = [
  { id: "MTN", label: "MTN", color: "#FFCC00" },
  { id: "Airtel", label: "Airtel", color: "#FF0000" },
  { id: "Glo", label: "Glo", color: "#008000" },
  { id: "9mobile", label: "9mobile", color: "#006600" },
] as const;

export const BILL_TYPES = [
  { id: "electricity", label: "Electricity", icon: "zap" },
  { id: "water", label: "Water", icon: "droplets" },
  { id: "cable_tv", label: "Cable TV", icon: "tv" },
  { id: "internet", label: "Internet", icon: "wifi" },
  { id: "education", label: "Education", icon: "book-open" },
  { id: "government", label: "Government", icon: "landmark" },
] as const;

export const GIFT_CARD_COUNTRIES = [
  { code: "US", label: "United States", flag: "🇺🇸" },
  { code: "UK", label: "United Kingdom", flag: "🇬🇧" },
  { code: "CA", label: "Canada", flag: "🇨🇦" },
  { code: "AU", label: "Australia", flag: "🇦🇺" },
  { code: "EU", label: "Europe", flag: "🇪🇺" },
] as const;

export const TRANSACTION_STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  processing: "Processing",
  completed: "Completed",
  failed: "Failed",
  reversed: "Reversed",
};

export const NAIRA_SYMBOL = "₦";
export const DOLLAR_SYMBOL = "$";

export const MIN_WALLET_FUND_NGN = 500;
export const MAX_WALLET_FUND_NGN = 5_000_000;
export const MIN_AIRTIME_NGN = 50;
export const VIRTUAL_CARD_CREATION_FEE_USD = 2;
export const VIRTUAL_CARD_MAINTENANCE_FEE_USD = 1;

export const FAQ_ITEMS = [
  {
    question: "How do I sell my gift card on PayVora?",
    answer:
      "Download the PayVora app, create an account, tap 'Sell Gift Card', select your card type, enter the card details, and receive instant payment to your wallet.",
  },
  {
    question: "How long does a gift card trade take?",
    answer:
      "Most trades are completed within 5–15 minutes. Complex cases may take up to 2 hours during business hours.",
  },
  {
    question: "What gift card categories do you accept?",
    answer:
      "We accept Amazon, Apple, Google Play, Steam, iTunes, Walmart, Target, eBay, Nordstrom, Nike, Sephora, and many more.",
  },
  {
    question: "How do I get a virtual dollar card?",
    answer:
      "Go to 'Virtual Cards' in the app, tap 'Create Card', fund it with USD equivalent from your naira wallet, and start spending online globally.",
  },
  {
    question: "Which bills can I pay on PayVora?",
    answer:
      "Electricity (EKEDC, IKEDC, AEDC, PHED, EEDC, JED), water, cable TV (DSTV, GOtv, StarTimes), internet (MTN, Airtel, Spectranet), and government bills.",
  },
  {
    question: "How do I fund my PayVora wallet?",
    answer:
      "Go to 'Fund Wallet', select your bank, copy the account number, and transfer any amount. Your wallet is credited instantly after bank confirmation.",
  },
  {
    question: "Is PayVora secure?",
    answer:
      "Yes. We use 256-bit SSL encryption, two-factor authentication, biometric login, and comply with CBN and NDIC regulations.",
  },
  {
    question: "What networks are supported for airtime recharge?",
    answer:
      "MTN, Airtel, Glo, and 9mobile are fully supported with instant recharge.",
  },
] as const;
