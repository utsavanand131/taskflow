"use client";

import { useState } from "react";
import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";

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

  async function handleSubmit(e: React.FormEvent) {
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

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="rounded-lg bg-black px-4 py-2 text-white"
      >
        + New Task
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-md space-y-4 rounded-xl border bg-background p-6"
          >
            <h2 className="text-xl font-semibold">Create Task</h2>

            <input
              className="w-full rounded border p-2"
              placeholder="Task title"
              value={form.title}
              onChange={(e) =>
                setForm({
                  ...form,
                  title: e.target.value,
                })
              }
              required
            />

            <textarea
              className="w-full rounded border p-2"
              placeholder="Description"
              value={form.description}
              onChange={(e) =>
                setForm({
                  ...form,
                  description: e.target.value,
                })
              }
            />

            <select
              className="w-full rounded border p-2"
              value={form.priority}
              onChange={(e) =>
                setForm({
                  ...form,
                  priority: e.target.value,
                })
              }
            >
              <option value="LOW">LOW</option>

              <option value="MEDIUM">MEDIUM</option>

              <option value="HIGH">HIGH</option>

              <option value="URGENT">URGENT</option>
            </select>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg border px-4 py-2"
              >
                Cancel
              </button>

              <button
                disabled={loading}
                className="rounded-lg bg-black px-4 py-2 text-white"
              >
                {loading ? "Creating..." : "Create"}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
