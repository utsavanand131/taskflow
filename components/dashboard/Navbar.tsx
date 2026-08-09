"use client";

import { Bell, LogOut, Menu } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

import { removeToken } from "@/lib/auth/client";

interface NavbarProps {
  setMobileOpen: (value: boolean) => void;
}

export default function Navbar({ setMobileOpen }: NavbarProps) {
  const router = useRouter();
  const pathname = usePathname();

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

    if (pathname.startsWith("/dashboard")) {
      return "Dashboard";
    }

    return "Dashboard";
  }

  const pageTitle = getPageTitle();

  function handleLogout() {
    removeToken();
    router.push("/login");
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
        <button type="button" className="rounded-full p-2 hover:bg-gray-100">
          <Bell size={20} />
        </button>

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
