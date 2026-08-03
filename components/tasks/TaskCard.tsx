"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface TaskCardProps {
  task: {
    id: string;
    title: string;
    description?: string | null;
    priority: string;
  };
}

export default function TaskCard({ task }: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: task.id,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="cursor-grab rounded-xl border p-4 space-y-3 transition hover:border-primary"
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
