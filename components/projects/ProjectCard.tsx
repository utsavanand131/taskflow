"use client";

import Link from "next/link";

interface ProjectCardProps {
  project: {
    id: string;
    name: string;
    description?: string | null;
    color?: string | null;
    status: string;
    createdAt: string;
  };
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link href={`/projects/${project.id}`} className="block">
      <div className="space-y-4 border border-zinc-800 bg-zinc-900/80 p-5 transition hover:border-zinc-700 hover:bg-zinc-900">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <div
              className="h-4 w-4 shrink-0"
              style={{
                backgroundColor: project.color || "#6366f1",
              }}
            />

            <h2 className="truncate text-lg font-semibold text-zinc-100">
              {project.name}
            </h2>
          </div>

          <span className="shrink-0 border border-zinc-700 bg-zinc-950 px-3 py-1 text-xs font-medium text-zinc-300">
            {project.status}
          </span>
        </div>

        {project.description && (
          <p className="line-clamp-2 text-sm leading-6 text-zinc-400">
            {project.description}
          </p>
        )}

        <div className="border-t border-zinc-800 pt-3 text-xs text-zinc-500">
          Created: {new Date(Number(project.createdAt)).toLocaleDateString()}
        </div>
      </div>
    </Link>
  );
}
