"use client";

import { useDroppable } from "@dnd-kit/core";

import TaskCard from "./TaskCard";

interface KanbanColumnProps {
  id: string;
  title: string;
  projectId: string;

  tasks: {
    id: string;
    title: string;
    description?: string | null;
    priority: string;
  }[];
}

export default function KanbanColumn({
  id,
  title,
  projectId,
  tasks,
}: KanbanColumnProps) {
  const { setNodeRef } = useDroppable({
    id,
  });

  return (
    <div
      ref={setNodeRef}
      className="min-h-80 border border-zinc-800 bg-zinc-950/60 p-4"
    >
      <div className="mb-4 flex items-center justify-between border-b border-zinc-800 pb-3">
        <div>
          <h3 className="text-sm font-semibold tracking-wide text-zinc-200">
            {title}
          </h3>

          <p className="mt-1 text-xs text-zinc-600">
            {title === "TODO"
              ? "Not started"
              : title === "IN_PROGRESS"
                ? "Currently working"
                : "Completed"}
          </p>
        </div>

        <span className="flex h-7 min-w-7 items-center justify-center border border-zinc-700 bg-zinc-900 px-2 text-xs font-medium text-zinc-300">
          {tasks.length}
        </span>
      </div>

      <div className="space-y-3">
        {tasks.length === 0 ? (
          <div className="border border-dashed border-zinc-800 p-6 text-center">
            <p className="text-xs text-zinc-600">Drop tasks here</p>
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard key={task.id} projectId={projectId} task={task} />
          ))
        )}
      </div>
    </div>
  );
}
