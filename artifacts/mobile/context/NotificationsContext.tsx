import AsyncStorage from "@react-native-async-storage/async-storage";
import { Feather } from "@expo/vector-icons";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useAuth } from "@/context/AuthContext";

/**
 * Single source of truth for notifications.
 *
 * This used to live as `useState<Notification[]>(MOCK)` inside the
 * Notifications screen component itself. Because that state was local to
 * the screen, every time the screen unmounted (navigating to Home, etc.)
 * and remounted, React re-ran `useState(MOCK)` and silently resurrected
 * every notification the user had deleted — including ones deleted many
 * sessions ago.
 *
 * Moving the array (and all mutations: dismiss, mark read, mark unread,
 * mark-all-read) up into a provider mounted once at the app root — and
 * persisting it to AsyncStorage — means:
 *   - the data survives screen mount/unmount (navigating away and back)
 *   - it survives app restarts (persisted to disk)
 *   - there is exactly one array in memory, so there is no risk of a
 *     stale local copy fighting with a "global" one.
 */

export type NotifCategory =
  | "transaction" | "deposit" | "withdrawal" | "transfer"
  | "virtual_card" | "security" | "login_alert" | "promotion"
  | "cashback" | "reward" | "verification" | "referral" | "system";

export type TxStatus = "completed" | "pending" | "failed";

export interface Notification {
  id:          string;
  category:    NotifCategory;
  title:       string;
  body:        string;
  /** Unix ms timestamp */
  ts:          number;
  read:        boolean;
  icon:        keyof typeof Feather.glyphMap;
  iconBg:      string;
  iconColor:   string;
  status?:     TxStatus;
  /** CTA shown below body */
  cta?:        { label: string; action: string };
}

const STORAGE_PREFIX = "payvora_notifications_v1";

// Scope storage per-account so logging out and into a different account on
// the same device never shows (or lets you delete) another user's
// notifications. Signed-out state gets its own bucket rather than reusing
// whichever account last used the device.
function storageKeyFor(userId: string | null | undefined): string {
  return userId ? `${STORAGE_PREFIX}:${userId}` : `${STORAGE_PREFIX}:guest`;
}

const CAT_META: Record<NotifCategory, {
  icon:      keyof typeof Feather.glyphMap;
  iconBg:    string;
  iconColor: string;
}> = {
  transaction:  { icon: "arrow-down-left",   iconBg: "#F0FFF9", iconColor: "#00B03C" },
  deposit:      { icon: "arrow-down-circle", iconBg: "#EFF6FF", iconColor: "#2563EB" },
  withdrawal:   { icon: "arrow-up-circle",   iconBg: "#FFF0F0", iconColor: "#EF4444" },
  transfer:     { icon: "repeat",            iconBg: "#F5F3FF", iconColor: "#7C3AED" },
  virtual_card: { icon: "credit-card",       iconBg: "#EFF6FF", iconColor: "#2563EB" },
  security:     { icon: "shield",            iconBg: "#FFF0F0", iconColor: "#EF4444" },
  login_alert:  { icon: "log-in",            iconBg: "#FFF0F0", iconColor: "#EF4444" },
  promotion:    { icon: "gift",              iconBg: "#FFF7ED", iconColor: "#D97706" },
  cashback:     { icon: "percent",           iconBg: "#F0FFF9", iconColor: "#00B03C" },
  reward:       { icon: "star",              iconBg: "#FFF7ED", iconColor: "#D97706" },
  verification: { icon: "check-circle",      iconBg: "#F0FFF9", iconColor: "#00B03C" },
  referral:     { icon: "users",             iconBg: "#FFF7ED", iconColor: "#D97706" },
  system:       { icon: "bell",              iconBg: "#EFF6FF", iconColor: "#2563EB" },
};

const NOW = Date.now();
const D = (daysAgo: number, h = 0, m = 0) =>
  NOW - daysAgo * 86_400_000 - h * 3_600_000 - m * 60_000;

/** Initial seed data — only ever used the very first time the app runs,
 * before anything has been persisted to AsyncStorage. */
const SEED: Notification[] = [
  {
    id: "1", category: "withdrawal", ts: D(0, 0, 3), read: false,
    title: "Withdrawal Successful",
    body: "₦5,000 has been sent to GTBank ending in 6789.",
    status: "completed",
    ...CAT_META.withdrawal,
  },
  {
    id: "2", category: "login_alert", ts: D(0, 1, 45), read: false,
    title: "New Device Login",
    body: "Your account was accessed from a new iPhone in Lagos. If this wasn't you, tap to secure your account.",
    cta: { label: "Secure account", action: "security" },
    ...CAT_META.login_alert,
  },
  {
    id: "3", category: "deposit", ts: D(0, 3, 0), read: false,
    title: "Wallet Funded",
    body: "₦50,000 has been added to your PAYVORA wallet via bank transfer.",
    status: "completed",
    ...CAT_META.deposit,
  },
  {
    id: "4", category: "virtual_card", ts: D(0, 5, 0), read: false,
    title: "Card Transaction Declined",
    body: "Your virtual card was declined for $12.99 on Netflix. Check your card balance and try again.",
    status: "failed",
    cta: { label: "View card", action: "cards" },
    ...CAT_META.virtual_card,
  },
  {
    id: "5", category: "transaction", ts: D(1, 2, 0), read: true,
    title: "Airtime Purchase",
    body: "₦1,000 MTN airtime sent to 0812 345 6789.",
    status: "completed",
    ...CAT_META.transaction,
  },
  {
    id: "6", category: "referral", ts: D(1, 5, 0), read: true,
    title: "Referral Bonus Pending",
    body: "Your friend Chuka signed up with your code. ₦5,000 bonus will be credited once they complete KYC.",
    cta: { label: "Track referral", action: "referral" },
    ...CAT_META.referral,
  },
  {
    id: "7", category: "cashback", ts: D(2, 1, 0), read: true,
    title: "Cashback Credited",
    body: "₦250 cashback has been added to your wallet for your electricity bill payment.",
    ...CAT_META.cashback,
  },
  {
    id: "8", category: "transaction", ts: D(2, 4, 0), read: true,
    title: "Electricity Bill Payment",
    body: "₦10,000 EKEDC prepaid meter top-up was successful. Token: 4521-9845-7623-1290.",
    status: "completed",
    ...CAT_META.transaction,
  },
  {
    id: "9", category: "security", ts: D(3, 2, 0), read: true,
    title: "PIN Changed Successfully",
    body: "Your transaction PIN was changed. If you did not initiate this, contact support immediately.",
    cta: { label: "Contact support", action: "help" },
    ...CAT_META.security,
  },
  {
    id: "10", category: "verification", ts: D(3, 6, 0), read: true,
    title: "Identity Verification Complete",
    body: "Your KYC verification has been approved. You now have full wallet access and higher limits.",
    cta: { label: "Explore features", action: "home" },
    ...CAT_META.verification,
  },
  {
    id: "11", category: "promotion", ts: D(4, 0, 0), read: true,
    title: "Weekend Promo 🎉",
    body: "0% fee on all bill payments this weekend only. Save more with PAYVORA.",
    ...CAT_META.promotion,
  },
  {
    id: "12", category: "reward", ts: D(5, 3, 0), read: true,
    title: "Points Milestone Reached",
    body: "You've earned 500 PAYVORA points! Redeem them for cashback or airtime.",
    cta: { label: "Redeem now", action: "rewards" },
    ...CAT_META.reward,
  },
  {
    id: "13", category: "transfer", ts: D(6, 1, 0), read: true,
    title: "Transfer Received",
    body: "₦20,000 received from Adewale O. via PAYVORA Wallet.",
    status: "completed",
    ...CAT_META.transfer,
  },
  {
    id: "14", category: "system", ts: D(8, 0, 0), read: true,
    title: "App Update Available",
    body: "PAYVORA v2.4 is out — faster gift card processing, improved virtual card controls, and bug fixes.",
    cta: { label: "Update now", action: "app-info" },
    ...CAT_META.system,
  },
  {
    id: "15", category: "transaction", ts: D(10, 2, 0), read: true,
    title: "Gift Card Trade Completed",
    body: "Your Amazon $50 gift card was traded successfully. ₦45,200 credited to your wallet.",
    status: "completed",
    ...CAT_META.transaction,
  },
  {
    id: "16", category: "deposit", ts: D(22, 0, 0), read: true,
    title: "Large Deposit Received",
    body: "₦200,000 has been added to your wallet. Daily withdrawal limit applies.",
    status: "completed",
    ...CAT_META.deposit,
  },
];

interface NotificationsContextType {
  notifications: Notification[];
  /** True only until the persisted store has been read once at app start. */
  isLoading: boolean;
  dismiss: (id: string) => void;
  dismissMany: (ids: string[]) => void;
  markRead: (id: string) => void;
  toggleReadState: (id: string) => void;
  markAllRead: () => void;
  /** Simulates re-fetching from the backend. Intentionally does NOT bring
   * back anything the user deleted — a real backend would simply not
   * return rows that were deleted server-side either. */
  refresh: () => Promise<void>;
}

const NotificationsContext = createContext<NotificationsContextType>({
  notifications: [],
  isLoading: true,
  dismiss: () => {},
  dismissMany: () => {},
  markRead: () => {},
  toggleReadState: () => {},
  markAllRead: () => {},
  refresh: async () => {},
});

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoading: authLoading } = useAuth();
  const userId = user?.id ?? null;

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  // Guards against writing to AsyncStorage with the initial empty state
  // before the persisted value has even been read — that would clobber a
  // real persisted list with an empty one on every cold start.
  const hydrated = useRef(false);
  // Tracks which account's storage key is currently loaded, so we can
  // detect a login/logout/account switch and re-hydrate from that
  // account's own bucket instead of leaking the previous account's list.
  const loadedFor = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    // Wait for auth to settle so we key storage by the real account (or
    // the "guest" bucket) instead of hydrating once as guest and never
    // re-reading once the real user id becomes available.
    if (authLoading) return;
    if (loadedFor.current === userId) return;

    let cancelled = false;
    hydrated.current = false;
    setIsLoading(true);
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(storageKeyFor(userId));
        if (cancelled) return;
        if (raw) {
          setNotifications(JSON.parse(raw));
        } else {
          // Only a brand-new (never-persisted) account/guest bucket seeds
          // the sample data; an existing account with zero notifications
          // left over from real activity should just show empty.
          setNotifications(userId ? [] : SEED);
        }
      } catch {
        if (!cancelled) setNotifications([]);
      } finally {
        if (!cancelled) {
          loadedFor.current = userId;
          hydrated.current = true;
          setIsLoading(false);
        }
      }
    })();
    return () => { cancelled = true; };
  }, [userId, authLoading]);

  // Persist on every change — this is the "centralized notification
  // store" that stays in sync with what's rendered; there's no separate
  // in-memory copy anywhere else in the app.
  useEffect(() => {
    if (!hydrated.current) return;
    AsyncStorage.setItem(storageKeyFor(userId), JSON.stringify(notifications)).catch(() => {
      // Non-fatal — worst case a deletion doesn't survive an app restart,
      // it will still behave correctly for the remainder of this session.
    });
  }, [notifications, userId]);

  const dismiss = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const dismissMany = useCallback((ids: string[]) => {
    const idSet = new Set(ids);
    setNotifications(prev => prev.filter(n => !idSet.has(n.id)));
  }, []);

  const markRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const toggleReadState = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: !n.read } : n)));
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const refresh = useCallback(async () => {
    // No real backend endpoint for notifications yet. Re-reading from
    // AsyncStorage (our current source of truth) rather than resetting to
    // SEED ensures a pull-to-refresh can never resurrect deleted items.
    try {
      const raw = await AsyncStorage.getItem(storageKeyFor(userId));
      if (raw) setNotifications(JSON.parse(raw));
    } catch {
      // Keep whatever is currently in memory.
    }
  }, [userId]);

  return (
    <NotificationsContext.Provider
      value={{ notifications, isLoading, dismiss, dismissMany, markRead, toggleReadState, markAllRead, refresh }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  return useContext(NotificationsContext);
}
