import DashboardShell from "@/components/dashboard/DashboardShell";
import { NotificationProvider } from "@/components/notifications/NotificationProvider";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NotificationProvider>
      <DashboardShell>{children}</DashboardShell>
    </NotificationProvider>
  );
}
