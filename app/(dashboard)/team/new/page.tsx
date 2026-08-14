"use client";

import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const CREATE_TEAM_MUTATION = gql`
  mutation CreateTeam($input: CreateTeamInput!) {
    createTeam(input: $input) {
      id
      name
      description
      createdAt
      updatedAt

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
`;

export default function CreateTeamPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [createTeam, { loading, error }] = useMutation(CREATE_TEAM_MUTATION);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!name.trim()) {
      return;
    }

    try {
      await createTeam({
        variables: {
          input: {
            name: name.trim(),
            description: description.trim() || undefined,
          },
        },
      });

      router.push("/team");
    } catch {
      // Apollo exposes the error through the mutation state.
    }
  }

  return (
    <div className="min-h-full bg-gradient-to-br from-zinc-950 via-neutral-950 to-zinc-900 px-4 py-6 text-zinc-100 md:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl space-y-6">
        <button
          type="button"
          onClick={() => router.push("/team")}
          className="inline-flex items-center gap-2 text-sm text-zinc-500 transition hover:text-zinc-200"
        >
          <ArrowLeft size={16} />
          Back to Teams
        </button>

        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-600">
            Team Setup
          </p>

          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-100 md:text-3xl">
            Create Team
          </h1>

          <p className="mt-2 text-sm leading-6 text-zinc-400">
            Create a team to collaborate with other members.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="border border-zinc-800 bg-zinc-900/80 p-6"
        >
          <div className="space-y-5">
            <div>
              <label
                htmlFor="team-name"
                className="text-sm font-medium text-zinc-300"
              >
                Team Name
              </label>

              <input
                id="team-name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="e.g. Frontend Team"
                className="mt-2 w-full border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-200 outline-none placeholder:text-zinc-600 transition focus:border-zinc-500"
                required
              />
            </div>

            <div>
              <label
                htmlFor="team-description"
                className="text-sm font-medium text-zinc-300"
              >
                Description
              </label>

              <textarea
                id="team-description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="What is this team responsible for?"
                rows={5}
                className="mt-2 w-full resize-none border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-200 outline-none placeholder:text-zinc-600 transition focus:border-zinc-500"
              />
            </div>

            {error && (
              <div className="border border-red-900 bg-red-950/30 p-3 text-sm text-red-400">
                {error.message}
              </div>
            )}
          </div>

          <div className="mt-6 flex flex-col-reverse gap-3 border-t border-zinc-800 pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => router.push("/team")}
              disabled={loading}
              className="border border-zinc-700 px-4 py-2.5 text-sm font-medium text-zinc-400 transition hover:bg-zinc-900 hover:text-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading || !name.trim()}
              className="border border-zinc-600 bg-zinc-800 px-4 py-2.5 text-sm font-medium text-zinc-100 transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Team"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
