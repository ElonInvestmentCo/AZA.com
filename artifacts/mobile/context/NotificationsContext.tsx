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
  const [pushToken, setPushToken]       = useState<string | null>(null);
  const [permissionGranted, setGranted] = useState(false);
  const router                          = useRouter();
  const notifListener                   = useRef<any>(null);
  const responseListener                = useRef<any>(null);

  const requestPermissions = useCallback(async (): Promise<boolean> => {
    if (Platform.OS === "web") return false;
    try {
      const { requestNotificationPermissions, getExpoPushToken } =
        await import("@/services/notifications");
      const granted = await requestNotificationPermissions();
      setGranted(granted);
      if (granted) {
        const token = await getExpoPushToken();
        setPushToken(token);
      }
      return granted;
    } catch {
      return false;
    }
  }, []);

  useEffect(() => {
    if (Platform.OS === "web") return;

    requestPermissions();

    let N: typeof import("expo-notifications") | null = null;

    try {
      N = require("expo-notifications");
    } catch {
      return;
    }

    try {
      notifListener.current = N?.addNotificationReceivedListener(
        (_notification: any) => {},
      );
    } catch {}

    try {
      responseListener.current = N?.addNotificationResponseReceivedListener(
        (response: any) => {
          try {
            const data = response?.notification?.request?.content?.data as Record<string, string> | undefined;
            const type = data?.type;
            if (type === "trade_submitted" || type === "trade_completed" || type === "status_update") {
              router.push("/(app)/card-status" as any);
            } else if (type === "wallet_funded") {
              router.push("/(tabs)" as any);
            }
          } catch {}
        },
      );
    } catch {}

    return () => {
      try { notifListener.current?.remove(); } catch {}
      try { responseListener.current?.remove(); } catch {}
    };
  }, [requestPermissions, router]);

  return (
    <NotificationsContext.Provider value={{ pushToken, permissionGranted, requestPermissions }}>
      {children}
    </NotificationsContext.Provider>
  );
}

export const useNotifications = () => useContext(NotificationsContext);
