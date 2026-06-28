import React, { createContext, useCallback, useContext, useState } from "react";

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

  const requestPermissions = useCallback(async (): Promise<boolean> => {
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

  return (
    <NotificationsContext.Provider value={{ pushToken, permissionGranted, requestPermissions }}>
      {children}
    </NotificationsContext.Provider>
  );
}

export const useNotifications = () => useContext(NotificationsContext);
