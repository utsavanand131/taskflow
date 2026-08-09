"use client";

import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import Link from "next/link";
import { useState } from "react";

const SEARCH_ALL_TASKS_QUERY = gql`
  query SearchAllTasks(
    $search: String
    $filter: TaskFilterInput
    $sort: TaskSortInput
    $page: Int
    $limit: Int
  ) {
    searchAllTasks(
      search: $search
      filter: $filter
      sort: $sort
      page: $page
      limit: $limit
    ) {
      items {
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

        assignee {
          id
          name
        }
      }

      total
      page
      totalPages
    }
  }
`;

interface Task {
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

  assignee?: {
    id: string;
    name: string;
  } | null;
}

interface TasksResponse {
  searchAllTasks: {
    items: Task[];
    total: number;
    page: number;
    totalPages: number;
  };
}

export default function TasksPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [sortField, setSortField] = useState("CREATED_AT");
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("DESC");
  const [page, setPage] = useState(1);

  const { data, loading, error } = useQuery<TasksResponse>(
    SEARCH_ALL_TASKS_QUERY,
    {
      variables: {
        search,
        filter:
          status || priority
            ? {
                ...(status ? { status } : {}),
                ...(priority ? { priority } : {}),
              }
            : undefined,
        sort: {
          field: sortField,
          order: sortOrder,
        },
        page,
        limit: 10,
      },
    },
  );

  const tasks = data?.searchAllTasks.items ?? [];
  const total = data?.searchAllTasks.total ?? 0;
  const totalPages = data?.searchAllTasks.totalPages ?? 0;

  function handleSearchChange(value: string) {
    setSearch(value);
    setPage(1);
  }

  function handleStatusChange(value: string) {
    setStatus(value);
    setPage(1);
  }

  function handlePriorityChange(value: string) {
    setPriority(value);
    setPage(1);
  }

  function handleSortFieldChange(value: string) {
    setSortField(value);
    setPage(1);
  }

  function handleSortOrderChange(value: "ASC" | "DESC") {
    setSortOrder(value);
    setPage(1);
  }

  function formatDueDate(dueDate?: string | null) {
    if (!dueDate) {
      return "No due date";
    }

    return new Date(Number(dueDate)).toLocaleDateString();
  }

  if (loading) {
    return <div>Loading tasks...</div>;
  }

  if (error) {
    return <div>{error.message}</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Tasks</h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Manage tasks across your projects.
        </p>
      </div>

      <div className="space-y-4 rounded-xl border p-4">
        <input
          type="text"
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="Search tasks..."
          className="w-full rounded-md border px-3 py-2 text-sm"
        />

        <div className="flex flex-wrap gap-3">
          <select
            value={status}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="rounded-md border px-3 py-2 text-sm"
          >
            <option value="">All statuses</option>
            <option value="TODO">TODO</option>
            <option value="IN_PROGRESS">IN_PROGRESS</option>
            <option value="DONE">DONE</option>
          </select>

          <select
            value={priority}
            onChange={(e) => handlePriorityChange(e.target.value)}
            className="rounded-md border px-3 py-2 text-sm"
          >
            <option value="">All priorities</option>
            <option value="LOW">LOW</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="HIGH">HIGH</option>
            <option value="URGENT">URGENT</option>
          </select>

          <select
            value={sortField}
            onChange={(e) => handleSortFieldChange(e.target.value)}
            className="rounded-md border px-3 py-2 text-sm"
          >
            <option value="CREATED_AT">Created date</option>
            <option value="UPDATED_AT">Updated date</option>
            <option value="DUE_DATE">Due date</option>
            <option value="PRIORITY">Priority</option>
            <option value="TITLE">Title</option>
          </select>

          <select
            value={sortOrder}
            onChange={(e) =>
              handleSortOrderChange(e.target.value as "ASC" | "DESC")
            }
            className="rounded-md border px-3 py-2 text-sm"
          >
            <option value="DESC">Descending</option>
            <option value="ASC">Ascending</option>
          </select>
        </div>
      </div>

      <div className="text-sm text-muted-foreground">
        {total} {total === 1 ? "task" : "tasks"}
      </div>

      {tasks.length === 0 ? (
        <div className="rounded-xl border p-8 text-center">
          <p className="text-sm text-muted-foreground">No tasks found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => (
            <Link
              key={task.id}
              href={`/projects/${task.project.id}/tasks/${task.id}`}
              className="block rounded-xl border p-4 transition hover:bg-muted/50"
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div className="min-w-0">
                  <h2 className="font-medium">{task.title}</h2>

                  {task.description && (
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                      {task.description}
                    </p>
                  )}

                  <p className="mt-2 text-xs text-muted-foreground">
                    Project: {task.project.name}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="rounded-md border px-2 py-1">
                    {task.status}
                  </span>

                  <span className="rounded-md border px-2 py-1">
                    {task.priority}
                  </span>

                  <span className="rounded-md border px-2 py-1">
                    {task.assignee?.name ?? "Unassigned"}
                  </span>
                </div>
              </div>

              <div className="mt-3 text-xs text-muted-foreground">
                Due: {formatDueDate(task.dueDate)}
              </div>
            </Link>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            disabled={page <= 1}
            className="rounded-md border px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
          >
            Previous
          </button>

          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>

          <button
            type="button"
            onClick={() =>
              setPage((current) => Math.min(totalPages, current + 1))
            }
            disabled={page >= totalPages}
            className="rounded-md border px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
