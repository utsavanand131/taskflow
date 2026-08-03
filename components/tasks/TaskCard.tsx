"use client";

import { useRouter } from "next/navigation";

interface TaskCardProps {
  projectId: string;

  task: {
    id: string;
    title: string;
    description?: string | null;
    priority: string;
  };
}

export default function TaskCard({ projectId, task }: TaskCardProps) {
  const router = useRouter();

  function handleClick() {
    router.push(`/projects/${projectId}/tasks/${task.id}`);
  }

  return (
    <div
      onClick={handleClick}
      className="cursor-pointer rounded-xl border p-4 space-y-3 transition hover:border-primary"
    >
      <h3 className="font-semibold">{task.title}</h3>

      {task.description && (
        <p className="text-sm text-muted-foreground">{task.description}</p>
      )}

      <span className="rounded-full border px-3 py-1 text-xs">
        {task.priority}
      </span>
    </div>
  );
}
