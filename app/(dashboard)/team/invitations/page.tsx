"use client";

import { gql } from "@apollo/client";
import { useMutation, useQuery } from "@apollo/client/react";
import Link from "next/link";

const INVITATIONS_QUERY = gql`
  query MyInvitations {
    myInvitations {
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
        description
      }
    }
  }
`;

const ACCEPT_INVITATION_MUTATION = gql`
  mutation AcceptInvitation($id: ID!) {
    acceptInvitation(id: $id)
  }
`;

const REJECT_INVITATION_MUTATION = gql`
  mutation RejectInvitation($id: ID!) {
    rejectInvitation(id: $id)
  }
`;

interface Invitation {
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
    description?: string | null;
  };
}

interface InvitationsResponse {
  myInvitations: Invitation[];
}

export default function InvitationsPage() {
  const { data, loading, error, refetch } =
    useQuery<InvitationsResponse>(INVITATIONS_QUERY);

  const [acceptInvitation, { loading: accepting }] = useMutation(
    ACCEPT_INVITATION_MUTATION,
  );

  const [rejectInvitation, { loading: rejecting }] = useMutation(
    REJECT_INVITATION_MUTATION,
  );

  async function handleAccept(id: string) {
    try {
      await acceptInvitation({
        variables: {
          id,
        },
      });

      await refetch();
    } catch (error) {
      console.error("Failed to accept invitation:", error);
    }
  }

  async function handleReject(id: string) {
    try {
      await rejectInvitation({
        variables: {
          id,
        },
      });

      await refetch();
    } catch (error) {
      console.error("Failed to reject invitation:", error);
    }
  }

  if (loading) {
    return (
      <div className="min-h-full bg-gradient-to-br from-zinc-950 via-neutral-950 to-zinc-900 p-6 text-zinc-400">
        Loading invitations...
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

  const invitations = data?.myInvitations ?? [];

  return (
    <div className="min-h-full bg-gradient-to-br from-zinc-950 via-neutral-950 to-zinc-900 px-4 py-6 text-zinc-100 md:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <div>
          <Link
            href="/team"
            className="inline-flex text-sm text-zinc-500 transition hover:text-zinc-200"
          >
            ← Back to Teams
          </Link>

          <p className="mt-4 text-sm text-zinc-400">
            Review invitations to join teams.
          </p>
        </div>

        {invitations.length === 0 ? (
          <div className="border border-dashed border-zinc-800 bg-zinc-900/60 p-10 text-center">
            <h2 className="text-lg font-semibold text-zinc-100">
              No pending invitations
            </h2>

            <p className="mt-2 text-sm text-zinc-500">
              You don't have any team invitations right now.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {invitations.map((invitation) => (
              <div
                key={invitation.id}
                className="border border-zinc-800 bg-zinc-900/80 p-5"
              >
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                  <div className="min-w-0">
                    <p className="text-xs uppercase tracking-[0.15em] text-zinc-600">
                      Team Invitation
                    </p>

                    <h2 className="mt-2 text-xl font-semibold text-zinc-100">
                      {invitation.team.name}
                    </h2>

                    {invitation.team.description && (
                      <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
                        {invitation.team.description}
                      </p>
                    )}

                    <div className="mt-5 space-y-1">
                      <p className="text-sm text-zinc-400">
                        Invited by{" "}
                        <span className="font-medium text-zinc-200">
                          {invitation.invitedBy.name}
                        </span>
                      </p>

                      <p className="text-xs text-zinc-600">
                        {invitation.invitedBy.email}
                      </p>

                      <p className="pt-1 text-xs text-zinc-600">
                        Invited on{" "}
                        {new Date(
                          Number(invitation.createdAt),
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex w-full flex-col gap-2 sm:flex-row lg:w-auto">
                    <button
                      type="button"
                      onClick={() => handleAccept(invitation.id)}
                      disabled={accepting || rejecting}
                      className="border border-zinc-600 bg-zinc-800 px-5 py-2.5 text-sm font-medium text-zinc-100 transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {accepting ? "Accepting..." : "Accept"}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleReject(invitation.id)}
                      disabled={accepting || rejecting}
                      className="border border-zinc-700 bg-zinc-950 px-5 py-2.5 text-sm font-medium text-zinc-400 transition hover:border-red-900 hover:bg-red-950/30 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {rejecting ? "Rejecting..." : "Reject"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
