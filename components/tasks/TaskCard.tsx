"use client";

import { useRouter } from "next/navigation";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

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

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: task.id,
    });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  function handleClick() {
    router.push(`/projects/${projectId}/tasks/${task.id}`);
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={handleClick}
      className={`cursor-pointer select-none border border-zinc-800 bg-zinc-900/90 p-4 transition ${
        isDragging
          ? "scale-[0.98] opacity-50"
          : "hover:border-zinc-700 hover:bg-zinc-900"
      }`}
    >
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <h3 className="min-w-0 text-sm font-semibold leading-5 text-zinc-100">
            {task.title}
          </h3>

          <span className="shrink-0 border border-zinc-700 bg-zinc-950 px-2 py-1 text-[10px] font-medium uppercase tracking-wide text-zinc-400">
            {task.priority}
          </span>
        </div>

        {task.description && (
          <p className="line-clamp-3 text-xs leading-5 text-zinc-500">
            {task.description}
          </p>
        )}
      </div>
    </div>
  );
}
