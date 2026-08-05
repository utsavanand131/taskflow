"use client";

import { gql } from "@apollo/client";
import { useQuery, useMutation } from "@apollo/client/react";
import { useParams } from "next/navigation";

import ActivityTimeline from "@/components/tasks/ActivityTimeline";
import TaskComments from "@/components/tasks/TaskComments";
import TaskChecklist from "@/components/tasks/TaskChecklist";

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

      comments {
        id
        content
        createdAt

        author {
          id
          name
        }
      }

      checklist {
        id
        content
        completed
        createdAt

        createdBy {
          id
          name
        }
      }
    }

    activities: taskActivities(taskId: $id) {
      id
      type
      message
      createdAt

      user {
        name
      }
    }
  }
`;

const UPDATE_TASK_MUTATION = gql`
  mutation UpdateTask($id: ID!, $input: UpdateTaskInput!) {
    updateTask(id: $id, input: $input) {
      id
      status
      priority
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

    comments: {
      id: string;
      content: string;
      createdAt: string;

      author: {
        id: string;
        name: string;
      };
    }[];

    checklist: {
      id: string;
      content: string;
      completed: boolean;
      createdAt: string;

      createdBy: {
        id: string;
        name: string;
      };
    }[];
  };

  activities: {
    id: string;
    type: string;
    message: string;
    createdAt: string;

    user?: {
      name: string;
    } | null;
  }[];
}

export default function TaskDetailsPage() {
  const params = useParams();

  const taskId = params.taskId as string;

  const { data, loading, error, refetch } = useQuery<TaskResponse>(TASK_QUERY, {
    variables: {
      id: taskId,
    },
  });

  const [updateTask] = useMutation(UPDATE_TASK_MUTATION);

  async function handleStatusChange(status: string) {
    await updateTask({
      variables: {
        id: taskId,
        input: {
          status,
        },
      },
    });

    await refetch();
  }

  async function handlePriorityChange(priority: string) {
    await updateTask({
      variables: {
        id: taskId,
        input: {
          priority,
        },
      },
    });

    await refetch();
  }

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

        <div className="mt-6 space-y-4 text-sm">
          <p>Project: {task.project.name}</p>

          <div className="flex items-center gap-3">
            <span>Status:</span>

            <select
              value={task.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="rounded-md border px-3 py-1"
            >
              <option value="TODO">TODO</option>
              <option value="IN_PROGRESS">IN_PROGRESS</option>
              <option value="DONE">DONE</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            <span>Priority:</span>

            <select
              value={task.priority}
              onChange={(e) => handlePriorityChange(e.target.value)}
              className="rounded-md border px-3 py-1"
            >
              <option value="LOW">LOW</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="HIGH">HIGH</option>
              <option value="URGENT">URGENT</option>
            </select>
          </div>

          {task.dueDate && <p>Due Date: {task.dueDate}</p>}

          <p>
            Created: {new Date(Number(task.createdAt)).toLocaleDateString()}
          </p>
        </div>
      </div>

      <TaskChecklist
        taskId={task.id}
        checklist={task.checklist}
        onChecklistChanged={() => refetch()}
      />

      <TaskComments
        taskId={task.id}
        comments={task.comments}
        onCommentAdded={() => refetch()}
      />

      <ActivityTimeline activities={data.activities} />
    </div>
  );
}
