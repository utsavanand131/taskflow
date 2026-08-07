"use client";

import { useRef, useState } from "react";
import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";

const UPLOAD_ATTACHMENT_MUTATION = gql`
  mutation UploadAttachment(
    $taskId: ID!
    $fileName: String!
    $fileUrl: String!
    $publicId: String
    $resourceType: String
    $fileSize: Int
    $mimeType: String
  ) {
    uploadAttachment(
      taskId: $taskId
      fileName: $fileName
      fileUrl: $fileUrl
      publicId: $publicId
      resourceType: $resourceType
      fileSize: $fileSize
      mimeType: $mimeType
    ) {
      id
      fileName
      fileUrl
      publicId
      resourceType
      fileSize
      mimeType
      createdAt

      uploadedBy {
        id
        name
      }
    }
  }
`;

const DELETE_ATTACHMENT_MUTATION = gql`
  mutation DeleteAttachment($attachmentId: ID!) {
    deleteAttachment(attachmentId: $attachmentId)
  }
`;

interface Attachment {
  id: string;
  fileName: string;
  fileUrl: string;
  fileSize?: number | null;
  mimeType?: string | null;
  createdAt: string;

  uploadedBy: {
    id: string;
    name: string;
  };
}

interface UploadResponse {
  url: string;
  publicId: string;
  resourceType: string;
  fileName: string;
  fileSize: number;
  mimeType: string | null;
}

interface TaskAttachmentsProps {
  taskId: string;
  attachments: Attachment[];
  onAttachmentsChanged: () => void | Promise<unknown>;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024;

function formatFileSize(bytes?: number | null) {
  if (!bytes) {
    return "";
  }

  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function TaskAttachments({
  taskId,
  attachments,
  onAttachmentsChanged,
}: TaskAttachmentsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [saveAttachment] = useMutation(UPLOAD_ATTACHMENT_MUTATION);

  const [deleteAttachment, { loading: deleting }] = useMutation(
    DELETE_ATTACHMENT_MUTATION,
  );

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    setError(null);

    if (!file) {
      setSelectedFile(null);
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setSelectedFile(null);
      setError("File size must be 10 MB or less.");

      event.target.value = "";
      return;
    }

    setSelectedFile(file);
  }

  async function handleUpload() {
    if (!selectedFile || uploading) {
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();

      formData.append("file", selectedFile);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = (await response.json()) as
        | UploadResponse
        | {
            error?: string;
          };

      if (!response.ok) {
        throw new Error(
          "error" in result && result.error
            ? result.error
            : "Failed to upload file.",
        );
      }

      if (!("url" in result)) {
        throw new Error("Upload did not return a file URL.");
      }

      await saveAttachment({
        variables: {
          taskId,
          fileName: result.fileName,
          fileUrl: result.url,
          publicId: result.publicId,
          resourceType: result.resourceType,
          fileSize: result.fileSize,
          mimeType: result.mimeType,
        },
      });

      setSelectedFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      await onAttachmentsChanged();
    } catch (uploadError) {
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "Failed to upload attachment.",
      );
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(attachmentId: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this attachment?",
    );

    if (!confirmed) {
      return;
    }

    setError(null);

    try {
      await deleteAttachment({
        variables: {
          attachmentId,
        },
      });

      await onAttachmentsChanged();
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Failed to delete attachment.",
      );
    }
  }

  return (
    <div className="rounded-xl border p-6 space-y-6">
      <h2 className="text-xl font-semibold">Attachments</h2>

      <div className="space-y-3">
        {attachments.length === 0 ? (
          <p className="text-sm text-muted-foreground">No attachments yet.</p>
        ) : (
          attachments.map((attachment) => (
            <div
              key={attachment.id}
              className="flex items-center justify-between gap-4 rounded-lg border p-4"
            >
              <div className="min-w-0">
                <a
                  href={attachment.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block truncate text-sm font-medium hover:underline"
                >
                  {attachment.fileName}
                </a>

                <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
                  {attachment.fileSize ? (
                    <span>{formatFileSize(attachment.fileSize)}</span>
                  ) : null}

                  <span>Uploaded by {attachment.uploadedBy.name}</span>

                  <span>
                    {new Date(Number(attachment.createdAt)).toLocaleString()}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleDelete(attachment.id)}
                disabled={deleting}
                className="shrink-0 rounded-md border px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-50"
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>

      <div className="space-y-3 border-t pt-4">
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileChange}
          disabled={uploading}
          className="block w-full text-sm"
        />

        {selectedFile && (
          <p className="text-sm text-muted-foreground">
            Selected: {selectedFile.name} ({formatFileSize(selectedFile.size)})
          </p>
        )}

        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleUpload}
            disabled={!selectedFile || uploading}
            className="rounded-lg border px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50"
          >
            {uploading ? "Uploading..." : "Upload Attachment"}
          </button>
        </div>
      </div>
    </div>
  );
}
