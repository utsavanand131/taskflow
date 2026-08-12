"use client";

import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Users,
  Settings,
  X,
} from "lucide-react";
import { usePathname } from "next/navigation";

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
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden min-h-screen w-64 border-r border-zinc-800 bg-zinc-950 text-zinc-100 md:block">
        <div className="flex h-16 items-center border-b border-zinc-800 px-6">
          <h1 className="text-xl font-semibold tracking-tight">TaskFlow</h1>
        </div>

        <nav className="space-y-1 p-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <a
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 border px-3 py-3 text-sm font-medium transition ${
                  active
                    ? "border-zinc-700 bg-zinc-800 text-zinc-100"
                    : "border-transparent text-zinc-400 hover:border-zinc-800 hover:bg-zinc-900 hover:text-zinc-100"
                }`}
              >
                <Icon size={18} />

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
            className="fixed inset-0 z-40 bg-black/70 md:hidden"
          />

          {/* Drawer */}
          <aside className="fixed left-0 top-0 z-50 h-full w-72 border-r border-zinc-800 bg-zinc-950 text-zinc-100 md:hidden">
            <div className="flex h-16 items-center justify-between border-b border-zinc-800 px-5">
              <h1 className="text-xl font-semibold tracking-tight">TaskFlow</h1>

              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="border border-zinc-800 p-2 text-zinc-400 transition hover:bg-zinc-900 hover:text-zinc-100"
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>

            <nav className="space-y-1 p-4">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);

                return (
                  <a
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 border px-3 py-3 text-sm font-medium transition ${
                      active
                        ? "border-zinc-700 bg-zinc-800 text-zinc-100"
                        : "border-transparent text-zinc-400 hover:border-zinc-800 hover:bg-zinc-900 hover:text-zinc-100"
                    }`}
                  >
                    <Icon size={18} />

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
