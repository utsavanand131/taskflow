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

interface TeamResponse {
  team: {
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

  if (loading) {
    return <div>Loading team...</div>;
  }

  if (error) {
    return <div>{error.message}</div>;
  }

  if (!data?.team) {
    return <div>Team not found.</div>;
  }

  const team = data.team;

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/team"
          className="text-sm text-gray-500 hover:text-gray-900"
        >
          ← Back to Teams
        </Link>
      </div>

      <div className="rounded-xl border p-6">
        <h1 className="text-2xl font-bold">{team.name}</h1>

        {team.description && (
          <p className="mt-2 text-sm text-gray-500">{team.description}</p>
        )}

        <p className="mt-4 text-sm text-gray-500">
          Created: {new Date(Number(team.createdAt)).toLocaleDateString()}
        </p>
      </div>

      <div className="rounded-xl border p-6">
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Invite Member</h2>

          <p className="mt-1 text-sm text-gray-500">
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
            className="flex-1 rounded-lg border px-3 py-2 outline-none focus:ring-2"
            required
          />

          <button
            type="submit"
            disabled={inviting || !email.trim()}
            className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {inviting ? "Sending..." : "Invite Member"}
          </button>
        </form>

        {inviteMessage && (
          <p className="mt-3 text-sm text-green-600">{inviteMessage}</p>
        )}

        {inviteError && (
          <p className="mt-3 text-sm text-red-600">{inviteError.message}</p>
        )}
      </div>

      <div className="rounded-xl border">
        <div className="border-b p-5">
          <h2 className="text-lg font-semibold">Members</h2>

          <p className="mt-1 text-sm text-gray-500">
            {team.members.length}{" "}
            {team.members.length === 1 ? "member" : "members"}
          </p>
        </div>

        <div>
          {team.members.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between border-b p-5 last:border-b-0"
            >
              <div>
                <p className="font-medium">{member.user.name}</p>

                <p className="text-sm text-gray-500">{member.user.email}</p>
              </div>

              <span className="rounded-full border px-3 py-1 text-xs">
                {member.role}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
