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

  const completedCount = checklist.filter((item) => item.completed).length;

  return (
    <div className="border border-zinc-800 bg-zinc-900/80 p-6">
      <div className="flex flex-col gap-2 border-b border-zinc-800 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-zinc-100">Checklist</h2>

          <p className="mt-1 text-sm text-zinc-500">
            Break this task into smaller steps.
          </p>
        </div>

        {checklist.length > 0 && (
          <span className="border border-zinc-700 bg-zinc-950 px-3 py-1 text-xs font-medium text-zinc-400">
            {completedCount}/{checklist.length} completed
          </span>
        )}
      </div>

      <div className="mt-5 space-y-3">
        {checklist.length === 0 ? (
          <div className="border border-dashed border-zinc-800 p-6 text-center">
            <p className="text-sm text-zinc-500">No checklist items yet.</p>
          </div>
        ) : (
          checklist.map((item) => (
            <div
              key={item.id}
              className="border border-zinc-800 bg-zinc-950 p-4"
            >
              {editingItemId === item.id ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-200 outline-none transition focus:border-zinc-500"
                  />

                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      disabled={updating}
                      className="border border-zinc-700 px-3 py-1.5 text-sm text-zinc-400 transition hover:bg-zinc-900 hover:text-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Cancel
                    </button>

                    <button
                      type="button"
                      onClick={() => handleUpdate(item.id)}
                      disabled={updating || !editContent.trim()}
                      className="border border-zinc-600 bg-zinc-800 px-3 py-1.5 text-sm font-medium text-zinc-100 transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50"
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
                      className="mt-1 h-4 w-4 cursor-pointer accent-zinc-300"
                    />

                    <div className="min-w-0 flex-1">
                      <p
                        className={`text-sm leading-6 ${
                          item.completed
                            ? "text-zinc-600 line-through"
                            : "text-zinc-200"
                        }`}
                      >
                        {item.content}
                      </p>

                      <p className="mt-1 text-xs text-zinc-600">
                        Added by {item.createdBy.name}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 flex gap-4 pl-7">
                    <button
                      type="button"
                      onClick={() => handleEdit(item)}
                      className="text-xs font-medium text-zinc-500 transition hover:text-zinc-200"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      disabled={deleting}
                      className="text-xs font-medium text-zinc-500 transition hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-50"
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

      <div className="mt-5 flex flex-col gap-3 border-t border-zinc-800 pt-5 sm:flex-row">
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Add a checklist item..."
          className="flex-1 border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-200 outline-none placeholder:text-zinc-600 transition focus:border-zinc-500"
        />

        <button
          type="button"
          onClick={handleAdd}
          disabled={adding || !content.trim()}
          className="border border-zinc-700 bg-zinc-950 px-4 py-2 text-sm font-medium text-zinc-200 transition hover:border-zinc-600 hover:bg-zinc-900 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {adding ? "Adding..." : "Add Item"}
        </button>
      </div>
    </div>
  );
}
