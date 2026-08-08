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
    <div className="flex items-center gap-3">
      <span>Assignee:</span>

      <select
        value={assignee?.id ?? ""}
        onChange={(event) => handleChange(event.target.value)}
        disabled={loading}
        className="rounded-md border px-3 py-1"
      >
        <option value="">Unassigned</option>

        {users.map((user) => (
          <option key={user.id} value={user.id}>
            {user.name}
          </option>
        ))}
      </select>

      {loading && (
        <span className="text-xs text-muted-foreground">Updating...</span>
      )}
    </div>
  );
}
