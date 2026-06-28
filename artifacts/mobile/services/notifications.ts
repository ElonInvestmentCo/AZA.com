import { Platform } from "react-native";

// Detect Expo Go — notifications crash in Expo Go (SDK 53+)
function isExpoGo(): boolean {
  try {
    const Constants = require("expo-constants").default;
    return Constants?.appOwnership === "expo";
  } catch {
    return false;
  }
}

const SKIP_NOTIFICATIONS = Platform.OS === "web" || isExpoGo();

type NotificationsModule = typeof import("expo-notifications");
let _N: NotificationsModule | null = null;

function getN(): NotificationsModule | null {
  if (SKIP_NOTIFICATIONS) return null;
  if (_N) return _N;
  try {
    _N = require("expo-notifications") as NotificationsModule;
    try {
      _N?.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: true,
          shouldShowBanner: true,
          shouldShowList: true,
        }),
      });
    } catch {}
    return _N;
  } catch {
    return null;
  }
}

export async function requestNotificationPermissions(): Promise<boolean> {
  try {
    const N = getN();
    if (!N) return false;
    const existing = await N.getPermissionsAsync() as unknown as { status: string };
    if (existing.status === "granted") return true;
    const result = await N.requestPermissionsAsync() as unknown as { status: string };
    return result.status === "granted";
  } catch {
    return false;
  }
}

export async function getExpoPushToken(): Promise<string | null> {
  try {
    const N = getN();
    if (!N) return null;
    const granted = await requestNotificationPermissions();
    if (!granted) return null;
    const token = await N.getExpoPushTokenAsync().catch(() => null);
    return token?.data ?? null;
  } catch {
    return null;
  }
}

export async function scheduleTradeSubmitted(cardType: string, amount: string): Promise<void> {
  try {
    const N = getN();
    if (!N) return;
    await N.scheduleNotificationAsync({
      content: {
        title: "Trade Submitted 🎉",
        body: `Your ${cardType} trade for ${amount} is under review.`,
        data: { type: "trade_submitted", cardType, amount },
      },
      trigger: null,
    });
  } catch {}
}

export async function scheduleTradeCompleted(cardType: string, nairaAmount: string, delaySeconds = 30): Promise<void> {
  try {
    const N = getN();
    if (!N) return;
    await N.scheduleNotificationAsync({
      content: {
        title: "Trade Completed ✅",
        body: `Your ${cardType} trade has been approved! ${nairaAmount} credited to your wallet.`,
        data: { type: "trade_completed", cardType, nairaAmount },
      },
      trigger: { type: (N as any).SchedulableTriggerInputTypes?.TIME_INTERVAL ?? "timeInterval", seconds: delaySeconds },
    });
  } catch {}
}

export async function scheduleWalletFunded(amount: string): Promise<void> {
  try {
    const N = getN();
    if (!N) return;
    await N.scheduleNotificationAsync({
      content: {
        title: "Wallet Funded 💰",
        body: `${amount} has been successfully added to your PayVora wallet.`,
        data: { type: "wallet_funded", amount },
      },
      trigger: null,
    });
  } catch {}
}

export async function scheduleStatusUpdate(cardType: string, ref: string, newStatus: "approved" | "rejected"): Promise<void> {
  try {
    const N = getN();
    if (!N) return;
    const approved = newStatus === "approved";
    await N.scheduleNotificationAsync({
      content: {
        title: approved ? "Trade Approved ✅" : "Trade Update ⚠️",
        body: approved
          ? `Your ${cardType} (Ref: ${ref}) has been approved and funds credited.`
          : `Your ${cardType} (Ref: ${ref}) was not approved. Tap to resubmit.`,
        data: { type: "status_update", cardType, ref, newStatus },
      },
      trigger: null,
    });
  } catch {}
}

export async function cancelAllNotifications(): Promise<void> {
  try {
    const N = getN();
    if (!N) return;
    await N.cancelAllScheduledNotificationsAsync();
  } catch {}
}
