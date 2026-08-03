"use client";

import { useDroppable } from "@dnd-kit/core";

import TaskCard from "./TaskCard";

interface KanbanColumnProps {
  id: string;
  title: string;
  tasks: {
    id: string;
    title: string;
    description?: string | null;
    priority: string;
  }[];
}

export default function KanbanColumn({ id, title, tasks }: KanbanColumnProps) {
  const { setNodeRef } = useDroppable({
    id,
  });

  return (
    <div ref={setNodeRef} className="rounded-xl border p-4 min-h-80">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold">{title}</h3>

        <span className="rounded-full border px-2 py-1 text-xs">
          {tasks.length}
        </span>
      </div>

      <div className="space-y-3">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
}
