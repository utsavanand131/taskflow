"use client";

import { gql } from "@apollo/client";
import { useMutation, useQuery } from "@apollo/client/react";
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useParams } from "next/navigation";

import CreateTaskDialog from "@/components/tasks/CreateTaskDialog";
import KanbanColumn from "@/components/tasks/KanbanColumn";

const PROJECT_QUERY = gql`
  query Project($id: ID!) {
    project(id: $id) {
      id
      name
      description
      color
      status
      createdAt
      owner {
        id
        name
        email
      }
    }

    tasks(projectId: $id) {
      id
      title
      description
      status
      priority
      dueDate
      createdAt
    }
  }
`;

const UPDATE_TASK_MUTATION = gql`
  mutation UpdateTask($id: ID!, $input: UpdateTaskInput!) {
    updateTask(id: $id, input: $input) {
      id
      status
    }
  }
`;

interface ProjectResponse {
  project: {
    id: string;
    name: string;
    description?: string | null;
    color?: string | null;
    status: string;
    createdAt: string;
    owner: {
      id: string;
      name: string;
      email: string;
    };
  };

  tasks: {
    id: string;
    title: string;
    description?: string | null;
    status: string;
    priority: string;
    dueDate?: string | null;
    createdAt: string;
  }[];
}

export default function ProjectDetailsPage() {
  const params = useParams();

  const id = params.id as string;

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  const { data, loading, error, refetch } = useQuery<ProjectResponse>(
    PROJECT_QUERY,
    {
      variables: {
        id,
      },
    },
  );

  const [updateTask] = useMutation(UPDATE_TASK_MUTATION);

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over) return;

    const taskId = active.id.toString();

    let newStatus = over.id.toString();

    const validStatuses = ["TODO", "IN_PROGRESS", "DONE"];

    if (!validStatuses.includes(newStatus)) {
      const droppedTask = data?.tasks.find((task) => task.id === newStatus);

      if (!droppedTask) return;

      newStatus = droppedTask.status;
    }

    await updateTask({
      variables: {
        id: taskId,
        input: {
          status: newStatus,
        },
      },
    });

    await refetch();
  }

  if (loading) {
    return (
      <div className="min-h-full bg-gradient-to-br from-zinc-950 via-neutral-950 to-zinc-900 p-6 text-zinc-400">
        Loading project...
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

  if (!data?.project) {
    return (
      <div className="min-h-full bg-gradient-to-br from-zinc-950 via-neutral-950 to-zinc-900 p-6 text-zinc-400">
        Project not found.
      </div>
    );
  }

  const project = data.project;

  return (
    <div className="min-h-full bg-gradient-to-br from-zinc-950 via-neutral-950 to-zinc-900 px-4 py-6 text-zinc-100 md:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="border border-zinc-800 bg-zinc-900/80 p-6">
          <div className="flex flex-wrap items-center gap-3">
            <div
              className="h-5 w-5 shrink-0"
              style={{
                backgroundColor: project.color || "#6366f1",
              }}
            />

            <h1 className="text-2xl font-bold tracking-tight text-zinc-100 md:text-3xl">
              {project.name}
            </h1>
          </div>

          <span className="mt-4 inline-block border border-zinc-700 bg-zinc-950 px-3 py-1 text-xs font-medium text-zinc-300">
            {project.status}
          </span>

          {project.description && (
            <p className="mt-4 max-w-3xl text-sm leading-6 text-zinc-400">
              {project.description}
            </p>
          )}

          <div className="mt-6 grid gap-4 border-t border-zinc-800 pt-5 text-sm sm:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-wide text-zinc-600">
                Owner
              </p>
              <p className="mt-1 text-zinc-300">{project.owner.name}</p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide text-zinc-600">
                Created
              </p>
              <p className="mt-1 text-zinc-300">
                {new Date(Number(project.createdAt)).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        <div className="border border-zinc-800 bg-zinc-900/80 p-6">
          <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-zinc-100">Tasks</h2>

              <p className="mt-1 text-sm text-zinc-500">
                Drag tasks between columns to update their status.
              </p>
            </div>

            <CreateTaskDialog
              projectId={project.id}
              onCreated={() => refetch()}
            />
          </div>

          <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
            <div className="grid gap-4 lg:grid-cols-3">
              <KanbanColumn
                id="TODO"
                title="TODO"
                projectId={project.id}
                tasks={data.tasks.filter((task) => task.status === "TODO")}
              />

              <KanbanColumn
                id="IN_PROGRESS"
                title="IN_PROGRESS"
                projectId={project.id}
                tasks={data.tasks.filter(
                  (task) => task.status === "IN_PROGRESS",
                )}
              />

              <KanbanColumn
                id="DONE"
                title="DONE"
                projectId={project.id}
                tasks={data.tasks.filter((task) => task.status === "DONE")}
              />
            </div>
          </DndContext>
        </div>
      </div>
    </div>
  );
}
