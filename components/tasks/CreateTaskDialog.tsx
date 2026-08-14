"use client";

import { useState } from "react";
import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import { X } from "lucide-react";

const CREATE_TASK_MUTATION = gql`
  mutation CreateTask($input: CreateTaskInput!) {
    createTask(input: $input) {
      id
      title
      description
      status
      priority
    }
  }
`;

interface CreateTaskDialogProps {
  projectId: string;
  onCreated: () => void;
}

export default function CreateTaskDialog({
  projectId,
  onCreated,
}: CreateTaskDialogProps) {
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "MEDIUM",
    status: "TODO",
  });

  const [createTask, { loading }] = useMutation(CREATE_TASK_MUTATION);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    await createTask({
      variables: {
        input: {
          projectId,
          title: form.title,
          description: form.description,
          priority: form.priority,
          status: form.status,
        },
      },
    });

    setForm({
      title: "",
      description: "",
      priority: "MEDIUM",
      status: "TODO",
    });

    setOpen(false);

    onCreated();
  }

  function handleClose() {
    if (loading) {
      return;
    }

    setOpen(false);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-100 transition hover:border-zinc-600 hover:bg-zinc-800"
      >
        + New Task
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-md border border-zinc-800 bg-zinc-950 p-6 text-zinc-100 shadow-2xl"
          >
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold">Create Task</h2>

                <p className="mt-1 text-sm text-zinc-500">
                  Add a task to this project.
                </p>
              </div>

              <button
                type="button"
                onClick={handleClose}
                disabled={loading}
                className="border border-zinc-800 p-2 text-zinc-500 transition hover:bg-zinc-900 hover:text-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Close dialog"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="task-title"
                  className="text-sm font-medium text-zinc-300"
                >
                  Task title
                </label>

                <input
                  id="task-title"
                  type="text"
                  placeholder="Task title"
                  value={form.title}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      title: e.target.value,
                    })
                  }
                  className="mt-2 w-full border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-sm text-zinc-200 outline-none placeholder:text-zinc-600 transition focus:border-zinc-500"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="task-description"
                  className="text-sm font-medium text-zinc-300"
                >
                  Description
                </label>

                <textarea
                  id="task-description"
                  placeholder="Description"
                  value={form.description}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      description: e.target.value,
                    })
                  }
                  rows={4}
                  className="mt-2 w-full resize-none border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-sm text-zinc-200 outline-none placeholder:text-zinc-600 transition focus:border-zinc-500"
                />
              </div>

              <div>
                <label
                  htmlFor="task-priority"
                  className="text-sm font-medium text-zinc-300"
                >
                  Priority
                </label>

                <select
                  id="task-priority"
                  value={form.priority}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      priority: e.target.value,
                    })
                  }
                  className="mt-2 w-full border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-sm text-zinc-200 outline-none transition focus:border-zinc-500"
                >
                  <option value="LOW">LOW</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="HIGH">HIGH</option>
                  <option value="URGENT">URGENT</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="task-status"
                  className="text-sm font-medium text-zinc-300"
                >
                  Status
                </label>

                <select
                  id="task-status"
                  value={form.status}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      status: e.target.value,
                    })
                  }
                  className="mt-2 w-full border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-sm text-zinc-200 outline-none transition focus:border-zinc-500"
                >
                  <option value="TODO">TODO</option>
                  <option value="IN_PROGRESS">IN_PROGRESS</option>
                  <option value="DONE">DONE</option>
                </select>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3 border-t border-zinc-800 pt-5">
              <button
                type="button"
                onClick={handleClose}
                disabled={loading}
                className="border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-400 transition hover:bg-zinc-900 hover:text-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading || !form.title.trim()}
                className="border border-zinc-600 bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-100 transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Creating..." : "Create Task"}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
