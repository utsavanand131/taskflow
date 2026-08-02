import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Users,
  Settings,
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

export default function Sidebar() {
  return (
    <aside className="w-64 min-h-screen border-r p-6">
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
  );
}
