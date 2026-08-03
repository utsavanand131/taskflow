"use client";

import { gql } from "@apollo/client";
import { useQuery, useMutation } from "@apollo/client/react";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { useParams } from "next/navigation";

import TaskCard from "@/components/tasks/TaskCard";
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

    // Dropped on another task
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

    refetch();
  }

  if (loading) {
    return <div>Loading project...</div>;
  }

  if (error) {
    return <div>{error.message}</div>;
  }

  if (!data?.project) {
    return <div>Project not found.</div>;
  }

  const project = data.project;

  return (
    <div className="space-y-6">
      <div className="rounded-xl border p-6">
        <div className="flex items-center gap-3">
          <div
            className="h-5 w-5 rounded-full"
            style={{
              backgroundColor: project.color || "#6366f1",
            }}
          />

          <h1 className="text-3xl font-bold">{project.name}</h1>
        </div>

        <span className="mt-4 inline-block rounded-full border px-3 py-1 text-sm">
          {project.status}
        </span>

        {project.description && (
          <p className="mt-4 text-gray-500">{project.description}</p>
        )}

        <div className="mt-6 text-sm text-gray-500">
          <p>Owner: {project.owner.name}</p>

          <p>
            Created: {new Date(Number(project.createdAt)).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="rounded-xl border p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Tasks</h2>

          <CreateTaskDialog
            projectId={project.id}
            onCreated={() => refetch()}
          />
        </div>

        <DndContext onDragEnd={handleDragEnd}>
          <div className="grid gap-4 lg:grid-cols-3">
            <KanbanColumn
              id="TODO"
              title="TODO"
              tasks={data.tasks.filter((task) => task.status === "TODO")}
            />

            <KanbanColumn
              id="IN_PROGRESS"
              title="IN_PROGRESS"
              tasks={data.tasks.filter((task) => task.status === "IN_PROGRESS")}
            />

            <KanbanColumn
              id="DONE"
              title="DONE"
              tasks={data.tasks.filter((task) => task.status === "DONE")}
            />
          </div>
        </DndContext>
      </div>
    </div>
  );
}
