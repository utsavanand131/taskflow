"use client";

import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import Link from "next/link";

const TEAMS_QUERY = gql`
  query Teams {
    teams {
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

interface Team {
  id: string;
  name: string;
  description?: string | null;
  createdAt: string;
  updatedAt: string;

  members: {
    id: string;
    role: string;

    user: {
      id: string;
      name: string;
      email: string;
    };
  }[];
}

interface TeamsResponse {
  teams: Team[];
}

export default function TeamsPage() {
  const { data, loading, error } = useQuery<TeamsResponse>(TEAMS_QUERY);

  if (loading) {
    return <div>Loading teams...</div>;
  }

  if (error) {
    return <div>{error.message}</div>;
  }

  const teams = data?.teams ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">Manage your teams and members.</p>

        <Link
          href="/team/new"
          className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
        >
          Create Team
        </Link>
      </div>

      {teams.length === 0 ? (
        <div className="rounded-xl border p-8 text-center">
          <h2 className="text-lg font-semibold">No teams yet</h2>

          <p className="mt-2 text-sm text-gray-500">
            Create your first team to start collaborating.
          </p>

          <Link
            href="/team/new"
            className="mt-4 inline-block rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
          >
            Create Team
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {teams.map((team) => (
            <Link key={team.id} href={`/team/${team.id}`} className="block">
              <div className="rounded-xl border p-5 transition hover:shadow-md">
                <div className="flex items-start justify-between gap-4">
                  <h2 className="text-lg font-semibold">{team.name}</h2>

                  <span className="rounded-full border px-3 py-1 text-xs">
                    {team.members.length}{" "}
                    {team.members.length === 1 ? "member" : "members"}
                  </span>
                </div>

                {team.description && (
                  <p className="mt-3 text-sm text-gray-500">
                    {team.description}
                  </p>
                )}

                <div className="mt-4 text-sm text-gray-500">
                  Created:{" "}
                  {new Date(Number(team.createdAt)).toLocaleDateString()}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
