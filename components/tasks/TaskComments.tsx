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

  const [addComment, { loading }] = useMutation(ADD_COMMENT_MUTATION);

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

              <p className="mt-2 text-sm">{comment.content}</p>
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
            disabled={loading || !content.trim()}
            className="rounded-lg border px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Adding..." : "Add Comment"}
          </button>
        </div>
      </div>
    </div>
  );
}
