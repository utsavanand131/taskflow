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
  const { data, loading, error, refetch } =
    useQuery<ProjectsResponse>(PROJECTS_QUERY);

  if (loading) {
    return <div>Loading projects...</div>;
  }

  if (error) {
    return <div>{error.message}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-gray-500">Manage your workspace projects</p>
        <CreateProjectDialog onCreated={() => refetch()} />
      </div>

      {data?.projects.length === 0 ? (
        <div className="rounded-xl border p-8 text-center">
          No projects yet.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {data?.projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
