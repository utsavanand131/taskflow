import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
}

export default function StatsCard({
  title,
  value,
  icon: Icon,
  description,
}: StatsCardProps) {
  return (
    <div className="rounded-xl border p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{title}</p>

        <Icon size={20} />
      </div>

      <h2 className="mt-3 text-3xl font-bold">{value}</h2>

      {description && (
        <p className="mt-1 text-sm text-gray-500">{description}</p>
      )}
    </div>
  );
}
