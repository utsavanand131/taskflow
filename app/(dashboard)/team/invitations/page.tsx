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
    return <div>Loading invitations...</div>;
  }

  if (error) {
    return <div>{error.message}</div>;
  }

  const invitations = data?.myInvitations ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/team"
            className="text-sm text-gray-500 hover:text-gray-900"
          >
            ← Back to Teams
          </Link>

          <p className="mt-4 text-sm text-gray-500">
            Review invitations to join teams.
          </p>
        </div>
      </div>

      {invitations.length === 0 ? (
        <div className="rounded-xl border p-8 text-center">
          <h2 className="text-lg font-semibold">No pending invitations</h2>

          <p className="mt-2 text-sm text-gray-500">
            You don't have any team invitations right now.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {invitations.map((invitation) => (
            <div key={invitation.id} className="rounded-xl border p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold">
                    {invitation.team.name}
                  </h2>

                  {invitation.team.description && (
                    <p className="mt-1 text-sm text-gray-500">
                      {invitation.team.description}
                    </p>
                  )}

                  <p className="mt-3 text-sm text-gray-600">
                    Invited by{" "}
                    <span className="font-medium">
                      {invitation.invitedBy.name}
                    </span>
                  </p>

                  <p className="text-sm text-gray-500">
                    {invitation.invitedBy.email}
                  </p>

                  <p className="mt-2 text-xs text-gray-400">
                    Invited on{" "}
                    {new Date(
                      Number(invitation.createdAt),
                    ).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleAccept(invitation.id)}
                    disabled={accepting || rejecting}
                    className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {accepting ? "Accepting..." : "Accept"}
                  </button>

                  <button
                    onClick={() => handleReject(invitation.id)}
                    disabled={accepting || rejecting}
                    className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
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
  );
}
