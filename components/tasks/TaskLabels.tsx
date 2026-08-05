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
    <div className="rounded-xl border p-6 space-y-6">
      <h2 className="text-xl font-semibold">Labels</h2>

      <div className="space-y-3">
        {labels.length === 0 ? (
          <p className="text-sm text-muted-foreground">No labels assigned.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {labels.map((label) => (
              <div
                key={label.id}
                className="flex items-center gap-2 rounded-full border px-3 py-1.5"
              >
                <span
                  className="h-3 w-3 rounded-full"
                  style={{
                    backgroundColor: label.color || "#6B7280",
                  }}
                />

                <span className="text-sm">{label.name}</span>

                <button
                  type="button"
                  onClick={() => handleRemove(label.id)}
                  disabled={removing}
                  className="ml-1 text-xs text-muted-foreground hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label={`Remove ${label.name} label`}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-3">
        <p className="text-sm font-medium">Assign existing label</p>

        <div className="flex flex-col gap-3 sm:flex-row">
          <select
            value={selectedLabelId}
            onChange={(e) => setSelectedLabelId(e.target.value)}
            disabled={labelsLoading}
            className="flex-1 rounded-lg border px-3 py-2 text-sm outline-none"
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
            className="rounded-lg border px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50"
          >
            {assigning ? "Assigning..." : "Assign"}
          </button>
        </div>

        {!labelsLoading && labelsData && availableLabels.length === 0 && (
          <p className="text-xs text-muted-foreground">
            No other existing labels are available.
          </p>
        )}
      </div>

      <div className="space-y-3 border-t pt-5">
        <p className="text-sm font-medium">Create new label</p>

        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            value={newLabelName}
            onChange={(e) => setNewLabelName(e.target.value)}
            placeholder="Label name..."
            className="flex-1 rounded-lg border px-3 py-2 text-sm outline-none"
          />

          <input
            type="color"
            value={newLabelColor}
            onChange={(e) => setNewLabelColor(e.target.value)}
            className="h-10 w-14 cursor-pointer rounded-lg border p-1"
            aria-label="Label color"
          />

          <button
            type="button"
            onClick={handleCreate}
            disabled={creating || assigning || !newLabelName.trim()}
            className="rounded-lg border px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50"
          >
            {creating ? "Creating..." : "Create & Assign"}
          </button>
        </div>
      </div>
    </div>
  );
}
