"use client";

import { useState } from "react";
import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";

const ADD_CHECKLIST_ITEM_MUTATION = gql`
  mutation AddChecklistItem($taskId: ID!, $content: String!) {
    addChecklistItem(taskId: $taskId, content: $content) {
      id
      content
      completed
      createdAt

      createdBy {
        id
        name
      }
    }
  }
`;

const UPDATE_CHECKLIST_ITEM_MUTATION = gql`
  mutation UpdateChecklistItem($checklistItemId: ID!, $content: String!) {
    updateChecklistItem(checklistItemId: $checklistItemId, content: $content) {
      id
      content
      completed
    }
  }
`;

const TOGGLE_CHECKLIST_ITEM_MUTATION = gql`
  mutation ToggleChecklistItem($checklistItemId: ID!) {
    toggleChecklistItem(checklistItemId: $checklistItemId) {
      id
      content
      completed
    }
  }
`;

const DELETE_CHECKLIST_ITEM_MUTATION = gql`
  mutation DeleteChecklistItem($checklistItemId: ID!) {
    deleteChecklistItem(checklistItemId: $checklistItemId)
  }
`;

interface ChecklistItem {
  id: string;
  content: string;
  completed: boolean;
  createdAt: string;

  createdBy: {
    id: string;
    name: string;
  };
}

interface TaskChecklistProps {
  taskId: string;
  checklist: ChecklistItem[];
  onChecklistChanged: () => void;
}

export default function TaskChecklist({
  taskId,
  checklist,
  onChecklistChanged,
}: TaskChecklistProps) {
  const [content, setContent] = useState("");

  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");

  const [addChecklistItem, { loading: adding }] = useMutation(
    ADD_CHECKLIST_ITEM_MUTATION,
  );

  const [updateChecklistItem, { loading: updating }] = useMutation(
    UPDATE_CHECKLIST_ITEM_MUTATION,
  );

  const [toggleChecklistItem] = useMutation(TOGGLE_CHECKLIST_ITEM_MUTATION);

  const [deleteChecklistItem, { loading: deleting }] = useMutation(
    DELETE_CHECKLIST_ITEM_MUTATION,
  );

  async function handleAdd() {
    const trimmedContent = content.trim();

    if (!trimmedContent) {
      return;
    }

    await addChecklistItem({
      variables: {
        taskId,
        content: trimmedContent,
      },
    });

    setContent("");

    await onChecklistChanged();
  }

  async function handleToggle(checklistItemId: string) {
    await toggleChecklistItem({
      variables: {
        checklistItemId,
      },
    });

    await onChecklistChanged();
  }

  function handleEdit(item: ChecklistItem) {
    setEditingItemId(item.id);
    setEditContent(item.content);
  }

  function handleCancelEdit() {
    setEditingItemId(null);
    setEditContent("");
  }

  async function handleUpdate(checklistItemId: string) {
    const trimmedContent = editContent.trim();

    if (!trimmedContent) {
      return;
    }

    await updateChecklistItem({
      variables: {
        checklistItemId,
        content: trimmedContent,
      },
    });

    setEditingItemId(null);
    setEditContent("");

    await onChecklistChanged();
  }

  async function handleDelete(checklistItemId: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this checklist item?",
    );

    if (!confirmed) {
      return;
    }

    await deleteChecklistItem({
      variables: {
        checklistItemId,
      },
    });

    await onChecklistChanged();
  }

  return (
    <div className="rounded-xl border p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Checklist</h2>

        {checklist.length > 0 && (
          <span className="text-sm text-muted-foreground">
            {checklist.filter((item) => item.completed).length}/
            {checklist.length} completed
          </span>
        )}
      </div>

      <div className="space-y-3">
        {checklist.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No checklist items yet.
          </p>
        ) : (
          checklist.map((item) => (
            <div key={item.id} className="rounded-lg border p-4">
              {editingItemId === item.id ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full rounded-lg border px-3 py-2 text-sm outline-none"
                  />

                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      disabled={updating}
                      className="rounded-lg border px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Cancel
                    </button>

                    <button
                      type="button"
                      onClick={() => handleUpdate(item.id)}
                      disabled={updating || !editContent.trim()}
                      className="rounded-lg border px-3 py-1.5 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {updating ? "Saving..." : "Save"}
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={item.completed}
                      onChange={() => handleToggle(item.id)}
                      className="mt-1 h-4 w-4 cursor-pointer"
                    />

                    <div className="min-w-0 flex-1">
                      <p
                        className={`text-sm ${
                          item.completed
                            ? "text-muted-foreground line-through"
                            : ""
                        }`}
                      >
                        {item.content}
                      </p>

                      <p className="mt-1 text-xs text-muted-foreground">
                        Added by {item.createdBy.name}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 flex gap-3 pl-7">
                    <button
                      type="button"
                      onClick={() => handleEdit(item)}
                      className="text-xs font-medium text-muted-foreground hover:text-foreground"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      disabled={deleting}
                      className="text-xs font-medium text-muted-foreground hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Add a checklist item..."
          className="flex-1 rounded-lg border px-3 py-2 text-sm outline-none"
        />

        <button
          type="button"
          onClick={handleAdd}
          disabled={adding || !content.trim()}
          className="rounded-lg border px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50"
        >
          {adding ? "Adding..." : "Add Item"}
        </button>
      </div>
    </div>
  );
}
