"use client";

import { useState } from "react";
import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";

const CREATE_PROJECT_MUTATION = gql`
  mutation CreateProject($input: CreateProjectInput!) {
    createProject(input: $input) {
      id
      name
      description
      color
      status
      createdAt
    }
  }
`;

interface CreateProjectDialogProps {
  onCreated: () => void;
}

export default function CreateProjectDialog({
  onCreated,
}: CreateProjectDialogProps) {
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
    color: "#6366f1",
  });

  const [createProject, { loading }] = useMutation(CREATE_PROJECT_MUTATION);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    await createProject({
      variables: {
        input: form,
      },
    });

    setForm({
      name: "",
      description: "",
      color: "#6366f1",
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
        + New Project
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-md space-y-4 rounded-xl border bg-background p-6"
          >
            <h2 className="text-xl font-semibold">Create Project</h2>

            <input
              className="w-full rounded border p-2"
              placeholder="Project name"
              value={form.name}
              onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value,
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

            <input
              type="color"
              value={form.color}
              onChange={(e) =>
                setForm({
                  ...form,
                  color: e.target.value,
                })
              }
            />

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
