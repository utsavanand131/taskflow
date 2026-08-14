"use client";

import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";

const ASSIGN_TASK_MUTATION = gql`
  mutation AssignTask($taskId: ID!, $assigneeId: ID) {
    assignTask(taskId: $taskId, assigneeId: $assigneeId) {
      id
      assignee {
        id
        name
        email
      }
    }
  }
`;

interface TaskAssigneeProps {
  taskId: string;

  assignee: {
    id: string;
    name: string;
    email: string;
  } | null;

  owner: {
    id: string;
    name: string;
  };

  team?: {
    id: string;
    name: string;

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

  onAssigneeChanged: () => void | Promise<unknown>;
}

export default function TaskAssignee({
  taskId,
  assignee,
  owner,
  team,
  onAssigneeChanged,
}: TaskAssigneeProps) {
  const [assignTask, { loading }] = useMutation(ASSIGN_TASK_MUTATION);

  const members = team?.members ?? [];

  const users = [
    {
      id: owner.id,
      name: owner.name,
      email: "",
    },
    ...members.map((member) => ({
      id: member.user.id,
      name: member.user.name,
      email: member.user.email,
    })),
  ].filter(
    (user, index, array) =>
      array.findIndex((item) => item.id === user.id) === index,
  );

  async function handleChange(value: string) {
    await assignTask({
      variables: {
        taskId,
        assigneeId: value === "" ? null : value,
      },
    });

    await onAssigneeChanged();
  }

  return (
    <div className="border border-zinc-800 bg-zinc-950 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            Assignee
          </p>

          <p className="mt-1 text-sm text-zinc-300">
            {assignee?.name ?? "Unassigned"}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={assignee?.id ?? ""}
            onChange={(event) => handleChange(event.target.value)}
            disabled={loading}
            className="w-full border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-200 outline-none transition focus:border-zinc-500 sm:w-56"
          >
            <option value="">Unassigned</option>

            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>

          {loading && (
            <span className="shrink-0 text-xs text-zinc-600">Updating...</span>
          )}
        </div>
      </div>
    </div>
  );
}
