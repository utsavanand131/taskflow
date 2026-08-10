"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { io, type Socket } from "socket.io-client";

export interface RealtimeNotification {
  id: string;
  message: string;
  read: boolean;
  createdAt: string;
}

interface NotificationContextValue {
  realtimeNotifications: RealtimeNotification[];
  markRealtimeNotificationRead: (id: string) => void;
  clearRealtimeNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextValue | null>(
  null,
);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [realtimeNotifications, setRealtimeNotifications] = useState<
    RealtimeNotification[]
  >([]);

  useEffect(() => {
    const token = localStorage.getItem("taskflow_token");

    if (!token) {
      return;
    }

    const socket: Socket = io("http://localhost:4000", {
      auth: {
        token,
      },
    });

    socket.on("connect", () => {
      console.log("Notification socket connected:", socket.id);
    });

    socket.on("connect_error", (error) => {
      console.error("Notification socket error:", error.message);
    });

    socket.on("notification", (notification: RealtimeNotification) => {
      setRealtimeNotifications((current) => [notification, ...current]);
    });

    socket.on("disconnect", () => {
      console.log("Notification socket disconnected.");
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  function markRealtimeNotificationRead(id: string) {
    setRealtimeNotifications((current) =>
      current.map((notification) =>
        notification.id === id
          ? {
              ...notification,
              read: true,
            }
          : notification,
      ),
    );
  }

  function clearRealtimeNotifications() {
    setRealtimeNotifications([]);
  }

  return (
    <NotificationContext.Provider
      value={{
        realtimeNotifications,
        markRealtimeNotificationRead,
        clearRealtimeNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error(
      "useNotifications must be used inside NotificationProvider.",
    );
  }

  return context;
}
