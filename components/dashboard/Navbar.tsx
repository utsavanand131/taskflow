"use client";

import { gql } from "@apollo/client";
import { useMutation, useQuery } from "@apollo/client/react";
import { Bell, LogOut, Menu } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { removeToken } from "@/lib/auth/client";
import {
  useNotifications,
  type RealtimeNotification,
} from "@/components/notifications/NotificationProvider";

const NOTIFICATIONS_QUERY = gql`
  query Notifications {
    notifications {
      id
      message
      read
      createdAt
    }
  }
`;

const MARK_NOTIFICATION_READ_MUTATION = gql`
  mutation MarkNotificationRead($id: ID!) {
    markNotificationRead(id: $id) {
      id
      message
      read
      createdAt
    }
  }
`;

interface Notification {
  id: string;
  message: string;
  read: boolean;
  createdAt: string;
}

interface NotificationsResponse {
  notifications: Notification[];
}

interface NavbarProps {
  setMobileOpen: (value: boolean) => void;
}

export default function Navbar({ setMobileOpen }: NavbarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const notificationRef = useRef<HTMLDivElement>(null);

  const { data, loading, refetch } =
    useQuery<NotificationsResponse>(NOTIFICATIONS_QUERY);

  const [markNotificationRead] = useMutation(MARK_NOTIFICATION_READ_MUTATION);

  const { realtimeNotifications } = useNotifications();

  function getPageTitle() {
    if (pathname.includes("/tasks/")) {
      return "Task Details";
    }

    if (pathname.startsWith("/projects/") && pathname.split("/").length === 3) {
      return "Project Details";
    }

    if (pathname.startsWith("/projects")) {
      return "Projects";
    }

    if (pathname.startsWith("/tasks")) {
      return "Tasks";
    }

    if (pathname.startsWith("/teams")) {
      return "Teams";
    }

    if (pathname.startsWith("/settings")) {
      return "Settings";
    }

    if (pathname.startsWith("/dashboard")) {
      return "Dashboard";
    }

    return "Dashboard";
  }

  const pageTitle = getPageTitle();

  useEffect(() => {
    if (realtimeNotifications.length > 0) {
      refetch();
    }
  }, [realtimeNotifications.length, refetch]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setNotificationsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const serverNotifications = data?.notifications ?? [];

  const combinedNotifications: Notification[] = [
    ...realtimeNotifications,
    ...serverNotifications.filter(
      (serverNotification) =>
        !realtimeNotifications.some(
          (realtimeNotification) =>
            realtimeNotification.id === serverNotification.id,
        ),
    ),
  ];

  const unreadCount = combinedNotifications.filter(
    (notification) => !notification.read,
  ).length;

  async function handleNotificationClick(notification: Notification) {
    if (!notification.read) {
      try {
        await markNotificationRead({
          variables: {
            id: notification.id,
          },
        });

        await refetch();
      } catch (error) {
        console.error("Failed to mark notification as read:", error);
      }
    }
  }

  function handleLogout() {
    removeToken();
    router.push("/login");
  }

  function formatNotificationDate(date: string) {
    const notificationDate = new Date(date);

    if (Number.isNaN(notificationDate.getTime())) {
      return "";
    }

    return notificationDate.toLocaleString();
  }

  return (
    <header className="flex h-16 items-center justify-between border-b px-4 md:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="rounded-md p-2 hover:bg-gray-100 md:hidden"
          onClick={() => setMobileOpen(true)}
        >
          <Menu size={20} />
        </button>

        <h2 className="text-lg font-semibold">{pageTitle}</h2>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <div ref={notificationRef} className="relative">
          <button
            type="button"
            onClick={() => setNotificationsOpen((current) => !current)}
            className="relative rounded-full p-2 hover:bg-gray-100"
            aria-label="Notifications"
          >
            <Bell size={20} />

            {unreadCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 top-12 z-50 w-80 overflow-hidden rounded-xl border bg-white text-gray-900 shadow-lg">
              <div className="flex items-center justify-between border-b px-4 py-3">
                <h3 className="font-semibold">Notifications</h3>

                {unreadCount > 0 && (
                  <span className="text-xs text-muted-foreground">
                    {unreadCount} unread
                  </span>
                )}
              </div>

              <div className="max-h-96 overflow-y-auto">
                {loading ? (
                  <div className="p-4 text-sm text-muted-foreground">
                    Loading notifications...
                  </div>
                ) : combinedNotifications.length === 0 ? (
                  <div className="p-6 text-center text-sm text-muted-foreground">
                    No notifications yet.
                  </div>
                ) : (
                  combinedNotifications.map((notification) => (
                    <button
                      key={notification.id}
                      type="button"
                      onClick={() => handleNotificationClick(notification)}
                      className={`w-full border-b px-4 py-3 text-left transition hover:bg-gray-50 ${
                        notification.read ? "bg-white" : "bg-blue-50"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {!notification.read && (
                          <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-500" />
                        )}

                        <div className={notification.read ? "pl-5" : ""}>
                          <p className="text-sm font-medium text-gray-900">
                            {notification.message}
                          </p>

                          <p className="mt-1 text-xs text-gray-500">
                            {formatNotificationDate(notification.createdAt)}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-gray-100"
        >
          <LogOut size={18} />

          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}
