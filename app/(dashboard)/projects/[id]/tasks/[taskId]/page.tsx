"use client";

import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { useParams } from "next/navigation";

const TASK_QUERY = gql`
  query Task($id: ID!) {
    task(id: $id) {
      id
      title
      description
      status
      priority
      dueDate
      createdAt

      project {
        id
        name
      }
    }
  }
`;

interface TaskResponse {
  task: {
    id: string;
    title: string;
    description?: string | null;
    status: string;
    priority: string;
    dueDate?: string | null;
    createdAt: string;

    project: {
      id: string;
      name: string;
    };
  };
}

export default function TaskDetailsPage() {
  const params = useParams();

  const taskId = params.taskId as string;

  const { data, loading, error } = useQuery<TaskResponse>(TASK_QUERY, {
    variables: {
      id: taskId,
    },
  });

  if (loading) {
    return <div>Loading task...</div>;
  }

  if (error) {
    return <div>{error.message}</div>;
  }

  if (!data?.task) {
    return <div>Task not found.</div>;
  }

  const task = data.task;

  return (
    <div className="space-y-6">
      <div className="rounded-xl border p-6">
        <h1 className="text-3xl font-bold">{task.title}</h1>

        {task.description && (
          <p className="mt-4 text-muted-foreground">{task.description}</p>
        )}

        <div className="mt-6 space-y-2 text-sm">
          <p>Project: {task.project.name}</p>

          <p>Status: {task.status}</p>

          <p>Priority: {task.priority}</p>

          {task.dueDate && <p>Due Date: {task.dueDate}</p>}

          <p>
            Created: {new Date(Number(task.createdAt)).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
}
