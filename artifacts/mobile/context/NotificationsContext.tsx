import * as Notifications from "expo-notifications";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Platform } from "react-native";
import { useRouter } from "expo-router";
import {
  requestNotificationPermissions,
  getExpoPushToken,
} from "@/services/notifications";

interface NotificationsContextType {
  pushToken: string | null;
  permissionGranted: boolean;
  requestPermissions: () => Promise<boolean>;
}

const NotificationsContext = createContext<NotificationsContextType>({
  pushToken: null,
  permissionGranted: false,
  requestPermissions: async () => false,
});

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const [pushToken, setPushToken]             = useState<string | null>(null);
  const [permissionGranted, setGranted]       = useState(false);
  const router                                = useRouter();
  const notifListener                         = useRef<Notifications.EventSubscription | null>(null);
  const responseListener                      = useRef<Notifications.EventSubscription | null>(null);

  const requestPermissions = useCallback(async (): Promise<boolean> => {
    const granted = await requestNotificationPermissions();
    setGranted(granted);
    if (granted) {
      const token = await getExpoPushToken();
      setPushToken(token);
    }
    return granted;
  }, []);

  useEffect(() => {
    if (Platform.OS === "web") return;

    requestPermissions();

    notifListener.current = Notifications.addNotificationReceivedListener(
      (_notification) => {
      },
    );

    responseListener.current = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const data = response.notification.request.content.data as Record<string, string> | undefined;
        const type = data?.type;
        if (type === "trade_submitted" || type === "trade_completed" || type === "status_update") {
          router.push("/(app)/card-status" as any);
        } else if (type === "wallet_funded") {
          router.push("/(tabs)" as any);
        }
      },
    );

    return () => {
      notifListener.current?.remove();
      responseListener.current?.remove();
    };
  }, [requestPermissions, router]);

  return (
    <NotificationsContext.Provider value={{ pushToken, permissionGranted, requestPermissions }}>
      {children}
    </NotificationsContext.Provider>
  );
}

export const useNotifications = () => useContext(NotificationsContext);
