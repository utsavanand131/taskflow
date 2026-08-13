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

const MY_INVITATIONS_QUERY = gql`
  query MyInvitations {
    myInvitations {
      id
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

interface InvitationsResponse {
  myInvitations: {
    id: string;
  }[];
}

export default function TeamsPage() {
  const { data, loading, error } = useQuery<TeamsResponse>(TEAMS_QUERY);

  const { data: invitationData } =
    useQuery<InvitationsResponse>(MY_INVITATIONS_QUERY);

  if (loading) {
    return (
      <div className="min-h-full bg-gradient-to-br from-zinc-950 via-neutral-950 to-zinc-900 p-6 text-zinc-400">
        Loading teams...
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

  const teams = data?.teams ?? [];

  const pendingInvitations = invitationData?.myInvitations?.length ?? 0;

  return (
    <div className="min-h-full bg-gradient-to-br from-zinc-950 via-neutral-950 to-zinc-900 px-4 py-6 text-zinc-100 md:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-zinc-400">
            Manage your teams and members.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/team/new"
              className="border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-100 transition hover:border-zinc-600 hover:bg-zinc-800"
            >
              Create Team
            </Link>

            {pendingInvitations > 0 && (
              <Link
                href="/team/invitations"
                className="border border-zinc-700 bg-zinc-950 px-4 py-2 text-sm font-medium text-zinc-300 transition hover:border-zinc-600 hover:bg-zinc-900"
              >
                Invitations ({pendingInvitations})
              </Link>
            )}
          </div>
        </div>

        {teams.length === 0 ? (
          <div className="border border-dashed border-zinc-800 bg-zinc-900/60 p-10 text-center">
            <h2 className="text-lg font-semibold text-zinc-100">
              No teams yet
            </h2>

            <p className="mt-2 text-sm text-zinc-500">
              Create your first team to start collaborating.
            </p>

            <Link
              href="/team/new"
              className="mt-5 inline-block border border-zinc-700 bg-zinc-950 px-4 py-2 text-sm font-medium text-zinc-200 transition hover:border-zinc-600 hover:bg-zinc-900"
            >
              Create Team
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {teams.map((team) => (
              <Link
                key={team.id}
                href={`/team/${team.id}`}
                className="group block"
              >
                <div className="border border-zinc-800 bg-zinc-900/80 p-5 transition hover:border-zinc-700 hover:bg-zinc-900">
                  <div className="flex items-start justify-between gap-4">
                    <h2 className="min-w-0 truncate text-lg font-semibold text-zinc-100">
                      {team.name}
                    </h2>

                    <span className="shrink-0 border border-zinc-700 bg-zinc-950 px-3 py-1 text-xs font-medium text-zinc-400">
                      {team.members.length}{" "}
                      {team.members.length === 1 ? "member" : "members"}
                    </span>
                  </div>

                  {team.description && (
                    <p className="mt-3 line-clamp-2 text-sm leading-6 text-zinc-400">
                      {team.description}
                    </p>
                  )}

                  <div className="mt-5 border-t border-zinc-800 pt-3 text-xs text-zinc-600">
                    Created:{" "}
                    {new Date(Number(team.createdAt)).toLocaleDateString()}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
