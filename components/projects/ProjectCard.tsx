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
      <div className="rounded-xl border p-5 space-y-3 transition hover:bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="h-4 w-4 rounded-full"
              style={{
                backgroundColor: project.color || "#6366f1",
              }}
            />

            <h2 className="text-lg font-semibold">{project.name}</h2>
          </div>

          <span className="rounded-full border px-3 py-1 text-xs">
            {project.status}
          </span>
        </div>

        {project.description && (
          <p className="text-sm text-gray-500">{project.description}</p>
        )}

        <div className="text-sm text-gray-500">
          Created: {new Date(Number(project.createdAt)).toLocaleDateString()}
        </div>
      </div>
    </Link>
  );
}
