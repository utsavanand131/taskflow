"use client";

interface TaskCardProps {
  task: {
    id: string;
    title: string;
    description?: string | null;
    status: string;
    priority: string;
  };
}

export default function TaskCard({ task }: TaskCardProps) {
  return (
    <div className="rounded-xl border p-4 space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">{task.title}</h3>

        <span className="rounded-full border px-3 py-1 text-xs">
          {task.status}
        </span>
      </div>

      {task.description && (
        <p className="text-sm text-gray-500">{task.description}</p>
      )}

      <p className="text-xs text-gray-500">Priority: {task.priority}</p>
    </div>
  );
}
