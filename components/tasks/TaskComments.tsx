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

    await onCommentAdded();
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

    await onCommentAdded();
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

    await onCommentAdded();
  }

  return (
    <div className="rounded-xl border p-6 space-y-6">
      <h2 className="text-xl font-semibold">Comments</h2>

      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-sm text-muted-foreground">No comments yet.</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="rounded-lg border p-4">
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm font-medium">{comment.author.name}</p>

                <p className="text-xs text-muted-foreground">
                  {new Date(Number(comment.createdAt)).toLocaleString()}
                </p>
              </div>

              {editingCommentId === comment.id ? (
                <div className="mt-3 space-y-3">
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    rows={3}
                    className="w-full resize-none rounded-lg border p-3 text-sm outline-none"
                  />

                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      disabled={updatingComment}
                      className="rounded-lg border px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Cancel
                    </button>

                    <button
                      type="button"
                      onClick={() => handleUpdate(comment.id)}
                      disabled={updatingComment || !editContent.trim()}
                      className="rounded-lg border px-3 py-1.5 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {updatingComment ? "Saving..." : "Save"}
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="mt-2 text-sm">{comment.content}</p>

                  <div className="mt-3 flex gap-3">
                    <button
                      type="button"
                      onClick={() => handleEdit(comment)}
                      className="text-xs font-medium text-muted-foreground hover:text-foreground"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(comment.id)}
                      disabled={deletingComment}
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

      <div className="space-y-3">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write a comment..."
          rows={3}
          className="w-full resize-none rounded-lg border p-3 text-sm outline-none"
        />

        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={addingComment || !content.trim()}
            className="rounded-lg border px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50"
          >
            {addingComment ? "Adding..." : "Add Comment"}
          </button>
        </div>
      </div>
    </div>
  );
}
