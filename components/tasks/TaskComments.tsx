"use client";

import { useState } from "react";
import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";

const ADD_COMMENT_MUTATION = gql`
  mutation AddComment($taskId: ID!, $content: String!) {
    addComment(taskId: $taskId, content: $content) {
      id
      content
      createdAt

      author {
        id
        name
      }
    }
  }
`;

const UPDATE_COMMENT_MUTATION = gql`
  mutation UpdateComment($commentId: ID!, $content: String!) {
    updateComment(commentId: $commentId, content: $content) {
      id
      content
      updatedAt
    }
  }
`;

const DELETE_COMMENT_MUTATION = gql`
  mutation DeleteComment($commentId: ID!) {
    deleteComment(commentId: $commentId)
  }
`;

interface Comment {
  id: string;
  content: string;
  createdAt: string;

  author: {
    id: string;
    name: string;
  };
}

interface TaskCommentsProps {
  taskId: string;
  comments: Comment[];
  onCommentAdded: () => void;
}

export default function TaskComments({
  taskId,
  comments,
  onCommentAdded,
}: TaskCommentsProps) {
  const [content, setContent] = useState("");

  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");

  const [addComment, { loading: addingComment }] =
    useMutation(ADD_COMMENT_MUTATION);

  const [updateComment, { loading: updatingComment }] = useMutation(
    UPDATE_COMMENT_MUTATION,
  );

  const [deleteComment, { loading: deletingComment }] = useMutation(
    DELETE_COMMENT_MUTATION,
  );

  async function refreshWhilePreservingScroll() {
    const scrollPosition = window.scrollY;

    await onCommentAdded();

    requestAnimationFrame(() => {
      window.scrollTo({
        top: scrollPosition,
        behavior: "auto",
      });
    });
  }

  async function handleSubmit() {
    const trimmedContent = content.trim();

    if (!trimmedContent) {
      return;
    }

    await addComment({
      variables: {
        taskId,
        content: trimmedContent,
      },
    });

    setContent("");

    await refreshWhilePreservingScroll();
  }

  function handleEdit(comment: Comment) {
    setEditingCommentId(comment.id);
    setEditContent(comment.content);
  }

  function handleCancelEdit() {
    setEditingCommentId(null);
    setEditContent("");
  }

  async function handleUpdate(commentId: string) {
    const trimmedContent = editContent.trim();

    if (!trimmedContent) {
      return;
    }

    await updateComment({
      variables: {
        commentId,
        content: trimmedContent,
      },
    });

    setEditingCommentId(null);
    setEditContent("");

    await refreshWhilePreservingScroll();
  }

  async function handleDelete(commentId: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this comment?",
    );

    if (!confirmed) {
      return;
    }

    await deleteComment({
      variables: {
        commentId,
      },
    });

    await refreshWhilePreservingScroll();
  }

  return (
    <div className="border border-zinc-800 bg-zinc-900/80 p-6">
      <div className="mb-6 border-b border-zinc-800 pb-5">
        <h2 className="text-lg font-semibold text-zinc-100">Comments</h2>

        <p className="mt-1 text-sm text-zinc-500">
          Discuss updates and progress on this task.
        </p>
      </div>

      <div className="space-y-3">
        {comments.length === 0 ? (
          <div className="border border-dashed border-zinc-800 p-6 text-center">
            <p className="text-sm text-zinc-500">No comments yet.</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="border border-zinc-800 bg-zinc-950 p-4"
            >
              <div className="flex flex-col gap-2 border-b border-zinc-800 pb-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm font-medium text-zinc-200">
                  {comment.author.name}
                </p>

                <p className="text-xs text-zinc-600">
                  {new Date(Number(comment.createdAt)).toLocaleString()}
                </p>
              </div>

              {editingCommentId === comment.id ? (
                <div className="mt-4 space-y-3">
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    rows={3}
                    className="w-full resize-none border border-zinc-700 bg-zinc-900 p-3 text-sm text-zinc-200 outline-none placeholder:text-zinc-600 transition focus:border-zinc-500"
                  />

                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      disabled={updatingComment}
                      className="border border-zinc-700 px-3 py-1.5 text-sm text-zinc-400 transition hover:bg-zinc-900 hover:text-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Cancel
                    </button>

                    <button
                      type="button"
                      onClick={() => handleUpdate(comment.id)}
                      disabled={updatingComment || !editContent.trim()}
                      className="border border-zinc-600 bg-zinc-800 px-3 py-1.5 text-sm font-medium text-zinc-100 transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {updatingComment ? "Saving..." : "Save"}
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-zinc-300">
                    {comment.content}
                  </p>

                  <div className="mt-4 flex gap-4">
                    <button
                      type="button"
                      onClick={() => handleEdit(comment)}
                      className="text-xs font-medium text-zinc-500 transition hover:text-zinc-200"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(comment.id)}
                      disabled={deletingComment}
                      className="text-xs font-medium text-zinc-500 transition hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {deletingComment ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>

      <div className="mt-6 border-t border-zinc-800 pt-5">
        <div>
          <p className="text-sm font-medium text-zinc-300">Add a comment</p>

          <p className="mt-1 text-xs text-zinc-600">
            Share an update or note about this task.
          </p>
        </div>

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write a comment..."
          rows={4}
          className="mt-4 w-full resize-none border border-zinc-700 bg-zinc-950 p-3 text-sm text-zinc-200 outline-none placeholder:text-zinc-600 transition focus:border-zinc-500"
        />

        <div className="mt-3 flex justify-end">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={addingComment || !content.trim()}
            className="border border-zinc-700 bg-zinc-950 px-4 py-2 text-sm font-medium text-zinc-200 transition hover:border-zinc-600 hover:bg-zinc-900 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {addingComment ? "Adding..." : "Add Comment"}
          </button>
        </div>
      </div>
    </div>
  );
}
