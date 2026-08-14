"use client";

import { useState } from "react";
import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import { X } from "lucide-react";

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

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
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
        + New Project
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-md border border-zinc-800 bg-zinc-950 p-6 text-zinc-100 shadow-2xl"
          >
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold">Create Project</h2>

                <p className="mt-1 text-sm text-zinc-500">
                  Set up a new project for your workspace.
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
                  htmlFor="project-name"
                  className="text-sm font-medium text-zinc-300"
                >
                  Project name
                </label>

                <input
                  id="project-name"
                  type="text"
                  placeholder="Project name"
                  value={form.name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      name: e.target.value,
                    })
                  }
                  className="mt-2 w-full border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-sm text-zinc-200 outline-none placeholder:text-zinc-600 transition focus:border-zinc-500"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="project-description"
                  className="text-sm font-medium text-zinc-300"
                >
                  Description
                </label>

                <textarea
                  id="project-description"
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
                  htmlFor="project-color"
                  className="text-sm font-medium text-zinc-300"
                >
                  Project color
                </label>

                <div className="mt-2 flex items-center gap-3">
                  <input
                    id="project-color"
                    type="color"
                    value={form.color}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        color: e.target.value,
                      })
                    }
                    className="h-10 w-14 cursor-pointer border border-zinc-700 bg-zinc-900 p-1"
                  />

                  <span className="text-sm text-zinc-500">{form.color}</span>
                </div>
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
                disabled={loading || !form.name.trim()}
                className="border border-zinc-600 bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-100 transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Creating..." : "Create Project"}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
