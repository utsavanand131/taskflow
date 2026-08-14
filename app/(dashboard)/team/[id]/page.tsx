"use client";

import { gql } from "@apollo/client";
import { useMutation, useQuery } from "@apollo/client/react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

const TEAM_QUERY = gql`
  query Team($id: ID!) {
    team(id: $id) {
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

const INVITE_MEMBER_MUTATION = gql`
  mutation InviteMember($input: InviteMemberInput!) {
    inviteMember(input: $input) {
      id
      email
      status
      createdAt
      updatedAt

      invitedBy {
        id
        name
        email
      }

      team {
        id
        name
      }
    }
  }
`;

const UPDATE_MEMBER_ROLE_MUTATION = gql`
  mutation UpdateTeamMemberRole($input: UpdateTeamMemberRoleInput!) {
    updateTeamMemberRole(input: $input) {
      id
      role

      user {
        id
        name
        email
      }

      team {
        id
        name
      }
    }
  }
`;

const REMOVE_MEMBER_MUTATION = gql`
  mutation RemoveTeamMember($teamId: ID!, $userId: ID!) {
    removeTeamMember(teamId: $teamId, userId: $userId)
  }
`;

interface TeamMember {
  id: string;
  role: string;

  user: {
    id: string;
    name: string;
    email: string;
  };
}

interface TeamResponse {
  team: {
    id: string;
    name: string;
    description?: string | null;
    createdAt: string;
    updatedAt: string;
    members: TeamMember[];
  } | null;
}

interface InviteResponse {
  inviteMember: {
    id: string;
    email: string;
    status: string;
    createdAt: string;
    updatedAt: string;

    invitedBy: {
      id: string;
      name: string;
      email: string;
    };

    team: {
      id: string;
      name: string;
    };
  };
}

export default function TeamDetailsPage() {
  const params = useParams();
  const teamId = params.id as string;

  const [email, setEmail] = useState("");
  const [inviteMessage, setInviteMessage] = useState("");

  const { data, loading, error, refetch } = useQuery<TeamResponse>(TEAM_QUERY, {
    variables: {
      id: teamId,
    },
  });

  const [inviteMember, { loading: inviting, error: inviteError }] =
    useMutation<InviteResponse>(INVITE_MEMBER_MUTATION);

  const [updateMemberRole, { loading: updatingRole }] = useMutation(
    UPDATE_MEMBER_ROLE_MUTATION,
  );

  const [removeMember, { loading: removingMember }] = useMutation(
    REMOVE_MEMBER_MUTATION,
  );

  async function handleInvite(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email.trim()) {
      return;
    }

    setInviteMessage("");

    try {
      await inviteMember({
        variables: {
          input: {
            teamId,
            email: email.trim(),
          },
        },
      });

      setEmail("");
      setInviteMessage("Invitation sent successfully.");

      await refetch();
    } catch {
      // Apollo exposes the error through inviteError.
    }
  }

  async function handleRoleChange(userId: string, role: string) {
    try {
      await updateMemberRole({
        variables: {
          input: {
            teamId,
            userId,
            role,
          },
        },
      });

      await refetch();
    } catch (error) {
      console.error("Failed to update member role:", error);
    }
  }

  async function handleRemoveMember(userId: string) {
    const confirmed = window.confirm(
      "Are you sure you want to remove this member from the team?",
    );

    if (!confirmed) {
      return;
    }

    try {
      await removeMember({
        variables: {
          teamId,
          userId,
        },
      });

      await refetch();
    } catch (error) {
      console.error("Failed to remove team member:", error);
    }
  }

  if (loading) {
    return (
      <div className="min-h-full bg-gradient-to-br from-zinc-950 via-neutral-950 to-zinc-900 p-6 text-zinc-400">
        Loading team...
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

  if (!data?.team) {
    return (
      <div className="min-h-full bg-gradient-to-br from-zinc-950 via-neutral-950 to-zinc-900 p-6 text-zinc-400">
        Team not found.
      </div>
    );
  }

  const team = data.team;

  return (
    <div className="min-h-full bg-gradient-to-br from-zinc-950 via-neutral-950 to-zinc-900 px-4 py-6 text-zinc-100 md:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <Link
          href="/team"
          className="inline-flex text-sm text-zinc-500 transition hover:text-zinc-200"
        >
          ← Back to Teams
        </Link>

        <section className="border border-zinc-800 bg-zinc-900/80 p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-600">
            Team
          </p>

          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-100 md:text-3xl">
            {team.name}
          </h1>

          {team.description && (
            <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-400">
              {team.description}
            </p>
          )}

          <div className="mt-6 grid gap-4 border-t border-zinc-800 pt-5 sm:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-wide text-zinc-600">
                Members
              </p>

              <p className="mt-1 text-sm text-zinc-300">
                {team.members.length}{" "}
                {team.members.length === 1 ? "member" : "members"}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide text-zinc-600">
                Created
              </p>

              <p className="mt-1 text-sm text-zinc-300">
                {new Date(Number(team.createdAt)).toLocaleDateString()}
              </p>
            </div>
          </div>
        </section>

        <section className="border border-zinc-800 bg-zinc-900/80 p-6">
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-zinc-100">
              Invite Member
            </h2>

            <p className="mt-1 text-sm text-zinc-500">
              Invite an existing TaskFlow user by email.
            </p>
          </div>

          <form
            onSubmit={handleInvite}
            className="flex flex-col gap-3 sm:flex-row"
          >
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="member@example.com"
              className="flex-1 border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-200 outline-none placeholder:text-zinc-600 transition focus:border-zinc-500"
              required
            />

            <button
              type="submit"
              disabled={inviting || !email.trim()}
              className="border border-zinc-700 bg-zinc-950 px-4 py-2.5 text-sm font-medium text-zinc-200 transition hover:border-zinc-600 hover:bg-zinc-900 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {inviting ? "Sending..." : "Invite Member"}
            </button>
          </form>

          {inviteMessage && (
            <p className="mt-3 border border-emerald-900 bg-emerald-950/30 p-3 text-sm text-emerald-400">
              {inviteMessage}
            </p>
          )}

          {inviteError && (
            <p className="mt-3 border border-red-900 bg-red-950/30 p-3 text-sm text-red-400">
              {inviteError.message}
            </p>
          )}
        </section>

        <section className="border border-zinc-800 bg-zinc-900/80">
          <div className="border-b border-zinc-800 p-5">
            <h2 className="text-lg font-semibold text-zinc-100">Members</h2>

            <p className="mt-1 text-sm text-zinc-500">
              Manage people who belong to this team.
            </p>
          </div>

          <div>
            {team.members.map((member) => {
              const isOwner = member.role === "OWNER";

              return (
                <div
                  key={member.id}
                  className="flex flex-col gap-4 border-b border-zinc-800 p-5 last:border-b-0 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-zinc-200">
                      {member.user.name}
                    </p>

                    <p className="mt-1 text-sm text-zinc-500">
                      {member.user.email}
                    </p>
                  </div>

                  {isOwner ? (
                    <span className="w-fit border border-zinc-700 bg-zinc-950 px-3 py-1.5 text-xs font-medium text-zinc-400">
                      OWNER
                    </span>
                  ) : (
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                      <select
                        value={member.role}
                        onChange={(event) =>
                          handleRoleChange(member.user.id, event.target.value)
                        }
                        disabled={updatingRole || removingMember}
                        className="border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-200 outline-none transition focus:border-zinc-500"
                      >
                        <option value="MEMBER">MEMBER</option>

                        <option value="ADMIN">ADMIN</option>
                      </select>

                      <button
                        type="button"
                        onClick={() => handleRemoveMember(member.user.id)}
                        disabled={updatingRole || removingMember}
                        className="border border-zinc-700 px-3 py-2 text-sm font-medium text-zinc-400 transition hover:border-red-900 hover:bg-red-950/30 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {removingMember ? "Removing..." : "Remove"}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
