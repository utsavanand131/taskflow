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
      className={`cursor-pointer select-none rounded-xl border p-4 space-y-3 transition hover:border-primary ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      <h3 className="font-semibold">{task.title}</h3>

      {task.description && (
        <p className="text-sm text-muted-foreground">{task.description}</p>
      )}

      <span className="inline-block rounded-full border px-3 py-1 text-xs">
        {task.priority}
      </span>
    </div>
  );
}
