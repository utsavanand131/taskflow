"use client";

import { Bell, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { removeToken } from "@/lib/auth/client";

export default function Navbar() {
  const router = useRouter();

  function handleLogout() {
    removeToken();
    router.push("/login");
  }

  return (
    <header className="h-16 border-b flex items-center justify-between px-6">
      <h2 className="text-lg font-semibold">Dashboard</h2>

      <div className="flex items-center gap-4">
        <button className="rounded-full p-2 hover:bg-gray-100">
          <Bell size={20} />
        </button>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-gray-100"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </header>
  );
}
