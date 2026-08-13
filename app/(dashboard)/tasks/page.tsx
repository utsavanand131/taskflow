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
    return (
      <div className="min-h-full bg-gradient-to-br from-zinc-950 via-neutral-950 to-zinc-900 p-6 text-zinc-400">
        Loading tasks...
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
        <div>
          <p className="text-sm text-zinc-400">
            Manage tasks across your projects.
          </p>
        </div>

        <div className="border border-zinc-800 bg-zinc-900/80 p-5">
          <div className="space-y-4">
            <div>
              <label
                htmlFor="task-search"
                className="text-xs font-medium uppercase tracking-wide text-zinc-500"
              >
                Search
              </label>

              <input
                id="task-search"
                type="text"
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search tasks..."
                className="mt-2 w-full border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-200 outline-none placeholder:text-zinc-600 transition focus:border-zinc-500"
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label
                  htmlFor="task-status"
                  className="text-xs font-medium uppercase tracking-wide text-zinc-500"
                >
                  Status
                </label>

                <select
                  id="task-status"
                  value={status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className="mt-2 w-full border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-200 outline-none transition focus:border-zinc-500"
                >
                  <option value="">All statuses</option>
                  <option value="TODO">TODO</option>
                  <option value="IN_PROGRESS">IN_PROGRESS</option>
                  <option value="DONE">DONE</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="task-priority"
                  className="text-xs font-medium uppercase tracking-wide text-zinc-500"
                >
                  Priority
                </label>

                <select
                  id="task-priority"
                  value={priority}
                  onChange={(e) => handlePriorityChange(e.target.value)}
                  className="mt-2 w-full border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-200 outline-none transition focus:border-zinc-500"
                >
                  <option value="">All priorities</option>
                  <option value="LOW">LOW</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="HIGH">HIGH</option>
                  <option value="URGENT">URGENT</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="task-sort-field"
                  className="text-xs font-medium uppercase tracking-wide text-zinc-500"
                >
                  Sort by
                </label>

                <select
                  id="task-sort-field"
                  value={sortField}
                  onChange={(e) => handleSortFieldChange(e.target.value)}
                  className="mt-2 w-full border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-200 outline-none transition focus:border-zinc-500"
                >
                  <option value="CREATED_AT">Created date</option>
                  <option value="UPDATED_AT">Updated date</option>
                  <option value="DUE_DATE">Due date</option>
                  <option value="PRIORITY">Priority</option>
                  <option value="TITLE">Title</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="task-sort-order"
                  className="text-xs font-medium uppercase tracking-wide text-zinc-500"
                >
                  Order
                </label>

                <select
                  id="task-sort-order"
                  value={sortOrder}
                  onChange={(e) =>
                    handleSortOrderChange(e.target.value as "ASC" | "DESC")
                  }
                  className="mt-2 w-full border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-200 outline-none transition focus:border-zinc-500"
                >
                  <option value="DESC">Descending</option>
                  <option value="ASC">Ascending</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg font-semibold text-zinc-100">Tasks</p>

            <p className="mt-1 text-sm text-zinc-500">
              {total} {total === 1 ? "task" : "tasks"} found
            </p>
          </div>
        </div>

        {tasks.length === 0 ? (
          <div className="border border-dashed border-zinc-800 bg-zinc-900/60 p-10 text-center">
            <p className="text-sm text-zinc-500">No tasks found.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => (
              <Link
                key={task.id}
                href={`/projects/${task.project.id}/tasks/${task.id}`}
                className="block border border-zinc-800 bg-zinc-900/80 p-5 transition hover:border-zinc-700 hover:bg-zinc-900"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0">
                    <div className="flex items-start gap-3">
                      <h2 className="min-w-0 truncate text-base font-semibold text-zinc-100">
                        {task.title}
                      </h2>
                    </div>

                    {task.description && (
                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-zinc-500">
                        {task.description}
                      </p>
                    )}

                    <p className="mt-3 text-xs text-zinc-600">
                      Project: {task.project.name}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="border border-zinc-700 bg-zinc-950 px-2.5 py-1.5 font-medium text-zinc-400">
                      {task.status}
                    </span>

                    <span className="border border-zinc-700 bg-zinc-950 px-2.5 py-1.5 font-medium text-zinc-400">
                      {task.priority}
                    </span>

                    <span className="border border-zinc-700 bg-zinc-950 px-2.5 py-1.5 font-medium text-zinc-400">
                      {task.assignee?.name ?? "Unassigned"}
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-zinc-800 pt-3">
                  <span className="text-xs text-zinc-600">
                    Due: {formatDueDate(task.dueDate)}
                  </span>

                  <span className="text-xs font-medium text-zinc-600 transition group-hover:text-zinc-300">
                    View task →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-zinc-800 pt-5">
            <button
              type="button"
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              disabled={page <= 1}
              className="border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-300 transition hover:border-zinc-600 hover:bg-zinc-900 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>

            <span className="text-sm text-zinc-500">
              Page {page} of {totalPages}
            </span>

            <button
              type="button"
              onClick={() =>
                setPage((current) => Math.min(totalPages, current + 1))
              }
              disabled={page >= totalPages}
              className="border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-300 transition hover:border-zinc-600 hover:bg-zinc-900 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
