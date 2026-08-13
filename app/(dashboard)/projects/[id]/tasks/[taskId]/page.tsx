"use client";

import { gql } from "@apollo/client";
import { useMutation, useQuery } from "@apollo/client/react";
import { useParams } from "next/navigation";

import ActivityTimeline from "@/components/tasks/ActivityTimeline";
import TaskComments from "@/components/tasks/TaskComments";
import TaskChecklist from "@/components/tasks/TaskChecklist";
import TaskLabels from "@/components/tasks/TaskLabels";
import TaskAttachments from "@/components/tasks/TaskAttachments";
import TaskAssignee from "@/components/tasks/TaskAssignee";

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

        owner {
          id
          name
        }

        team {
          id
          name

          members {
            id
            role

            user {
              id
              name
              email
            }
          }
        }
      }

      assignee {
        id
        name
        email
      }

      labels {
        id
        name
        color
      }

      attachments {
        id
        fileName
        fileUrl
        fileSize
        mimeType
        createdAt

        uploadedBy {
          id
          name
        }
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
      dueDate
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

      owner: {
        id: string;
        name: string;
      };

      team?: {
        id: string;
        name: string;

        members: {
          id: string;
          role: string;

          user: {
            id: string;
            name: string;
            email: string;
          };
        }[];
      } | null;
    };

    assignee?: {
      id: string;
      name: string;
      email: string;
    } | null;

    labels: {
      id: string;
      name: string;
      color?: string | null;
    }[];

    attachments: {
      id: string;
      fileName: string;
      fileUrl: string;
      fileSize?: number | null;
      mimeType?: string | null;
      createdAt: string;

      uploadedBy: {
        id: string;
        name: string;
      };
    }[];

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

  const {
    data,
    loading,
    error,
    refetch: refetchTask,
  } = useQuery<TaskResponse>(TASK_QUERY, {
    variables: {
      id: taskId,
    },
  });

  const [updateTask] = useMutation(UPDATE_TASK_MUTATION);

  async function refetchTaskPreservingScroll() {
    const scrollPosition = window.scrollY;

    await refetchTask();

    requestAnimationFrame(() => {
      window.scrollTo({
        top: scrollPosition,
        behavior: "auto",
      });
    });
  }

  async function handleStatusChange(status: string) {
    await updateTask({
      variables: {
        id: taskId,
        input: {
          status,
        },
      },
    });

    await refetchTaskPreservingScroll();
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

    await refetchTaskPreservingScroll();
  }

  async function handleDueDateChange(dueDate: string) {
    await updateTask({
      variables: {
        id: taskId,
        input: {
          dueDate: dueDate || null,
        },
      },
    });

    await refetchTaskPreservingScroll();
  }

  if (loading) {
    return (
      <div className="min-h-full bg-gradient-to-br from-zinc-950 via-neutral-950 to-zinc-900 p-6 text-zinc-400">
        Loading task...
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

  if (!data?.task) {
    return (
      <div className="min-h-full bg-gradient-to-br from-zinc-950 via-neutral-950 to-zinc-900 p-6 text-zinc-400">
        Task not found.
      </div>
    );
  }

  const task = data.task;

  return (
    <div className="min-h-full bg-gradient-to-br from-zinc-950 via-neutral-950 to-zinc-900 px-4 py-6 text-zinc-100 md:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <section className="border border-zinc-800 bg-zinc-900/80 p-6">
          <div className="flex flex-col gap-5">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-zinc-600">
                Task Details
              </p>

              <h1 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-100 md:text-3xl">
                {task.title}
              </h1>

              {task.description && (
                <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-400">
                  {task.description}
                </p>
              )}
            </div>

            <div className="grid gap-4 border-t border-zinc-800 pt-5 sm:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-wide text-zinc-600">
                  Project
                </p>

                <p className="mt-1 text-sm text-zinc-300">
                  {task.project.name}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-zinc-600">
                  Created
                </p>

                <p className="mt-1 text-sm text-zinc-300">
                  {new Date(Number(task.createdAt)).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="border border-zinc-800 bg-zinc-900/80 p-6">
          <h2 className="text-lg font-semibold text-zinc-100">
            Task Properties
          </h2>

          <div className="mt-5 space-y-5">
            <TaskAssignee
              taskId={task.id}
              assignee={task.assignee ?? null}
              owner={task.project.owner}
              team={task.project.team}
              onAssigneeChanged={() => refetchTaskPreservingScroll()}
            />

            <div className="grid gap-5 md:grid-cols-3">
              <div className="space-y-2">
                <label
                  htmlFor="task-status"
                  className="text-xs font-medium uppercase tracking-wide text-zinc-500"
                >
                  Status
                </label>

                <select
                  id="task-status"
                  value={task.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className="w-full border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-200 outline-none transition focus:border-zinc-500"
                >
                  <option value="TODO">TODO</option>
                  <option value="IN_PROGRESS">IN_PROGRESS</option>
                  <option value="DONE">DONE</option>
                </select>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="task-priority"
                  className="text-xs font-medium uppercase tracking-wide text-zinc-500"
                >
                  Priority
                </label>

                <select
                  id="task-priority"
                  value={task.priority}
                  onChange={(e) => handlePriorityChange(e.target.value)}
                  className="w-full border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-200 outline-none transition focus:border-zinc-500"
                >
                  <option value="LOW">LOW</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="HIGH">HIGH</option>
                  <option value="URGENT">URGENT</option>
                </select>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="task-due-date"
                  className="text-xs font-medium uppercase tracking-wide text-zinc-500"
                >
                  Due Date
                </label>

                <input
                  id="task-due-date"
                  type="date"
                  value={
                    task.dueDate
                      ? new Date(Number(task.dueDate))
                          .toISOString()
                          .split("T")[0]
                      : ""
                  }
                  onChange={(e) => handleDueDateChange(e.target.value)}
                  className="w-full border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-200 outline-none transition focus:border-zinc-500"
                />
              </div>
            </div>
          </div>
        </section>

        <TaskLabels
          taskId={task.id}
          labels={task.labels}
          onLabelsChanged={() => refetchTaskPreservingScroll()}
        />

        <TaskChecklist
          taskId={task.id}
          checklist={task.checklist}
          onChecklistChanged={() => refetchTaskPreservingScroll()}
        />

        <TaskAttachments
          taskId={task.id}
          attachments={task.attachments}
          onAttachmentsChanged={() => refetchTaskPreservingScroll()}
        />

        <TaskComments
          taskId={task.id}
          comments={task.comments}
          onCommentAdded={() => refetchTaskPreservingScroll()}
        />

        <ActivityTimeline activities={data.activities} />
      </div>
    </div>
  );
}
