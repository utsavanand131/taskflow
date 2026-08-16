"use client";

import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";

import ProjectCard from "@/components/projects/ProjectCard";
import CreateProjectDialog from "@/components/projects/CreateProjectDialog";

const PROJECTS_QUERY = gql`
  query Projects {
    projects {
      id
      name
      description
      color
      status
      createdAt
    }
  }
`;

interface ProjectsResponse {
  projects: {
    id: string;
    name: string;
    description?: string | null;
    color?: string | null;
    status: string;
    createdAt: string;
  }[];
}

export default function ProjectsPage() {
  const { data, loading, error, refetch } = useQuery<ProjectsResponse>(
    PROJECTS_QUERY,
    {
      fetchPolicy: "network-only",
    },
  );

  if (loading) {
    return (
      <div className="min-h-full bg-gradient-to-br from-zinc-950 via-neutral-950 to-zinc-900 p-6 text-zinc-400">
        Loading projects...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-full bg-gradient-to-br from-zinc-950 via-neutral-950 to-zinc-900 p-6 text-red-400">
        {error.message}
      </div>
    );
  }

  return (
    <div className="min-h-full bg-gradient-to-br from-zinc-950 via-neutral-950 to-zinc-900 px-4 py-6 text-zinc-100 md:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-zinc-400">
            Manage your workspace projects
          </p>

          <CreateProjectDialog onCreated={() => refetch()} />
        </div>

        {data?.projects.length === 0 ? (
          <div className="border border-dashed border-zinc-800 bg-zinc-900/60 p-10 text-center">
            <p className="text-sm text-zinc-500">No projects yet.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {data?.projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
