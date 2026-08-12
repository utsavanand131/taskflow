"use client";

import { useState } from "react";
import { gql } from "@apollo/client";
import { useMutation, useQuery } from "@apollo/client/react";

const LABELS_QUERY = gql`
  query Labels {
    labels {
      id
      name
      color
    }
  }
`;

const CREATE_LABEL_MUTATION = gql`
  mutation CreateLabel($name: String!, $color: String) {
    createLabel(name: $name, color: $color) {
      id
      name
      color
    }
  }
`;

const ASSIGN_LABEL_MUTATION = gql`
  mutation AssignLabel($taskId: ID!, $labelId: ID!) {
    assignLabel(taskId: $taskId, labelId: $labelId) {
      id

      labels {
        id
        name
        color
      }
    }
  }
`;

const REMOVE_LABEL_MUTATION = gql`
  mutation RemoveLabel($taskId: ID!, $labelId: ID!) {
    removeLabel(taskId: $taskId, labelId: $labelId) {
      id

      labels {
        id
        name
        color
      }
    }
  }
`;

interface Label {
  id: string;
  name: string;
  color?: string | null;
}

interface LabelsResponse {
  labels: Label[];
}

interface CreateLabelResponse {
  createLabel: {
    id: string;
    name: string;
    color?: string | null;
  };
}

interface TaskLabelsProps {
  taskId: string;
  labels: Label[];
  onLabelsChanged: () => void;
}

export default function TaskLabels({
  taskId,
  labels,
  onLabelsChanged,
}: TaskLabelsProps) {
  const [selectedLabelId, setSelectedLabelId] = useState("");
  const [newLabelName, setNewLabelName] = useState("");
  const [newLabelColor, setNewLabelColor] = useState("#3B82F6");

  const {
    data: labelsData,
    loading: labelsLoading,
    refetch: refetchLabels,
  } = useQuery<LabelsResponse>(LABELS_QUERY);

  const [createLabel, { loading: creating }] = useMutation<CreateLabelResponse>(
    CREATE_LABEL_MUTATION,
  );

  const [assignLabel, { loading: assigning }] = useMutation(
    ASSIGN_LABEL_MUTATION,
  );

  const [removeLabel, { loading: removing }] = useMutation(
    REMOVE_LABEL_MUTATION,
  );

  const availableLabels =
    labelsData?.labels.filter(
      (label) => !labels.some((assignedLabel) => assignedLabel.id === label.id),
    ) ?? [];

  async function handleAssign() {
    if (!selectedLabelId) {
      return;
    }

    await assignLabel({
      variables: {
        taskId,
        labelId: selectedLabelId,
      },
    });

    setSelectedLabelId("");

    await onLabelsChanged();
  }

  async function handleRemove(labelId: string) {
    await removeLabel({
      variables: {
        taskId,
        labelId,
      },
    });

    await onLabelsChanged();
  }

  async function handleCreate() {
    const trimmedName = newLabelName.trim();

    if (!trimmedName) {
      return;
    }

    const result = await createLabel({
      variables: {
        name: trimmedName,
        color: newLabelColor,
      },
    });

    const createdLabelId = result.data?.createLabel?.id;

    setNewLabelName("");

    await refetchLabels();

    if (createdLabelId) {
      await assignLabel({
        variables: {
          taskId,
          labelId: createdLabelId,
        },
      });

      await onLabelsChanged();
    }
  }

  return (
    <div className="border border-zinc-800 bg-zinc-900/80 p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-zinc-100">Labels</h2>

        <p className="mt-1 text-sm text-zinc-500">
          Organize this task with reusable labels.
        </p>
      </div>

      <div className="space-y-3">
        {labels.length === 0 ? (
          <div className="border border-dashed border-zinc-800 p-5">
            <p className="text-sm text-zinc-500">No labels assigned.</p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {labels.map((label) => (
              <div
                key={label.id}
                className="flex items-center gap-2 border border-zinc-700 bg-zinc-950 px-3 py-1.5"
              >
                <span
                  className="h-2.5 w-2.5 shrink-0"
                  style={{
                    backgroundColor: label.color || "#6B7280",
                  }}
                />

                <span className="text-sm text-zinc-200">{label.name}</span>

                <button
                  type="button"
                  onClick={() => handleRemove(label.id)}
                  disabled={removing}
                  className="ml-1 text-sm text-zinc-500 transition hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label={`Remove ${label.name} label`}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6 space-y-3 border-t border-zinc-800 pt-5">
        <p className="text-sm font-medium text-zinc-300">
          Assign existing label
        </p>

        <div className="flex flex-col gap-3 sm:flex-row">
          <select
            value={selectedLabelId}
            onChange={(e) => setSelectedLabelId(e.target.value)}
            disabled={labelsLoading}
            className="flex-1 border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-200 outline-none transition focus:border-zinc-500"
          >
            <option value="">
              {labelsLoading ? "Loading labels..." : "Select a label"}
            </option>

            {availableLabels.map((label) => (
              <option key={label.id} value={label.id}>
                {label.name}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={handleAssign}
            disabled={assigning || !selectedLabelId}
            className="border border-zinc-700 bg-zinc-950 px-4 py-2 text-sm font-medium text-zinc-200 transition hover:border-zinc-600 hover:bg-zinc-900 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {assigning ? "Assigning..." : "Assign"}
          </button>
        </div>

        {!labelsLoading && labelsData && availableLabels.length === 0 && (
          <p className="text-xs text-zinc-600">
            No other existing labels are available.
          </p>
        )}
      </div>

      <div className="mt-6 space-y-3 border-t border-zinc-800 pt-5">
        <p className="text-sm font-medium text-zinc-300">Create new label</p>

        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            value={newLabelName}
            onChange={(e) => setNewLabelName(e.target.value)}
            placeholder="Label name..."
            className="flex-1 border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-200 outline-none placeholder:text-zinc-600 transition focus:border-zinc-500"
          />

          <input
            type="color"
            value={newLabelColor}
            onChange={(e) => setNewLabelColor(e.target.value)}
            className="h-10 w-14 cursor-pointer border border-zinc-700 bg-zinc-950 p-1"
            aria-label="Label color"
          />

          <button
            type="button"
            onClick={handleCreate}
            disabled={creating || assigning || !newLabelName.trim()}
            className="border border-zinc-700 bg-zinc-950 px-4 py-2 text-sm font-medium text-zinc-200 transition hover:border-zinc-600 hover:bg-zinc-900 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {creating ? "Creating..." : "Create & Assign"}
          </button>
        </div>
      </div>
    </div>
  );
}
