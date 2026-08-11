"use client";

import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
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
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Create Team</h1>

        <p className="mt-1 text-sm text-gray-500">
          Create a team to collaborate with other members.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border p-6">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium">
            Team Name
          </label>

          <input
            id="name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="e.g. Frontend Team"
            className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="description" className="text-sm font-medium">
            Description
          </label>

          <textarea
            id="description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="What is this team responsible for?"
            rows={4}
            className="w-full resize-none rounded-lg border px-3 py-2 outline-none focus:ring-2"
          />
        </div>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
            {error.message}
          </div>
        )}

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => router.push("/team")}
            className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading || !name.trim()}
            className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Team"}
          </button>
        </div>
      </form>
    </div>
  );
}
