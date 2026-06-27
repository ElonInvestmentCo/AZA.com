import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function requestNotificationPermissions(): Promise<boolean> {
  if (Platform.OS === "web") return false;

  const existing = await Notifications.getPermissionsAsync() as unknown as { status: string };
  if (existing.status === "granted") return true;

  const result = await Notifications.requestPermissionsAsync() as unknown as { status: string };
  return result.status === "granted";
}

export async function getExpoPushToken(): Promise<string | null> {
  if (Platform.OS === "web") return null;
  try {
    const granted = await requestNotificationPermissions();
    if (!granted) return null;
    const token = await Notifications.getExpoPushTokenAsync().catch(() => null);
    return token?.data ?? null;
  } catch {
    return null;
  }
}

export async function scheduleTradeSubmitted(
  cardType: string,
  amount: string,
): Promise<void> {
  if (Platform.OS === "web") return;
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Trade Submitted 🎉",
        body: `Your ${cardType} trade for ${amount} is under review. We'll notify you once it's processed.`,
        data: { type: "trade_submitted", cardType, amount },
      },
      trigger: null,
    });
  } catch {}
}

export async function scheduleTradeCompleted(
  cardType: string,
  nairaAmount: string,
  delaySeconds = 30,
): Promise<void> {
  if (Platform.OS === "web") return;
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Trade Completed ✅",
        body: `Your ${cardType} trade has been approved! ${nairaAmount} has been credited to your wallet.`,
        data: { type: "trade_completed", cardType, nairaAmount },
      },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, seconds: delaySeconds },
    });
  } catch {}
}

export async function scheduleWalletFunded(amount: string): Promise<void> {
  if (Platform.OS === "web") return;
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Wallet Funded 💰",
        body: `${amount} has been successfully added to your PayVora wallet.`,
        data: { type: "wallet_funded", amount },
      },
      trigger: null,
    });
  } catch {}
}

export async function scheduleStatusUpdate(
  cardType: string,
  ref: string,
  newStatus: "approved" | "rejected",
): Promise<void> {
  if (Platform.OS === "web") return;
  try {
    const approved = newStatus === "approved";
    await Notifications.scheduleNotificationAsync({
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
  if (Platform.OS === "web") return;
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch {}
}
