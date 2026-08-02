"use client";

import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Users,
  Settings,
  X,
} from "lucide-react";

const menuItems = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    name: "Projects",
    icon: FolderKanban,
    href: "/projects",
  },
  {
    name: "Tasks",
    icon: CheckSquare,
    href: "/tasks",
  },
  {
    name: "Team",
    icon: Users,
    href: "/team",
  },
  {
    name: "Settings",
    icon: Settings,
    href: "/settings",
  },
];

interface SidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (value: boolean) => void;
}

export default function Sidebar({ mobileOpen, setMobileOpen }: SidebarProps) {
  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 min-h-screen border-r p-6">
        <h1 className="text-2xl font-bold mb-8">TaskFlow</h1>

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <a
                key={item.name}
                href={item.href}
                className="flex items-center gap-3 rounded-lg p-3 hover:bg-gray-100"
              >
                <Icon size={20} />

                <span>{item.name}</span>
              </a>
            );
          })}
        </nav>
      </aside>

      {/* Mobile Sidebar */}
      {mobileOpen && (
        <>
          {/* Overlay */}
          <div
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
          />

          {/* Drawer */}
          <aside className="fixed left-0 top-0 z-50 h-full w-64 border-r bg-background p-6 md:hidden">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-2xl font-bold">TaskFlow</h1>

              <button onClick={() => setMobileOpen(false)}>
                <X size={22} />
              </button>
            </div>

            <nav className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;

                return (
                  <a
                    key={item.name}
                    href={item.href}
                    className="flex items-center gap-3 rounded-lg p-3 hover:bg-gray-100"
                  >
                    <Icon size={20} />

                    <span>{item.name}</span>
                  </a>
                );
              })}
            </nav>
          </aside>
        </>
      )}
    </>
  );
}
