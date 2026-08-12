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
    <div className="border border-zinc-800 bg-zinc-900/80 p-5 transition-colors hover:border-zinc-700">
      <div className="flex items-start justify-between gap-4">
        <p className="text-sm font-medium text-zinc-400">{title}</p>

        <div className="flex h-9 w-9 items-center justify-center border border-zinc-800 bg-zinc-950">
          <Icon size={18} className="text-zinc-300" />
        </div>
      </div>

      <h2 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-100">
        {value}
      </h2>

      {description && (
        <p className="mt-1 text-sm text-zinc-500">{description}</p>
      )}
    </div>
  );
}
