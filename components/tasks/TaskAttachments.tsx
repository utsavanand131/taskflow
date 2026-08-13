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
    <div className="border border-zinc-800 bg-zinc-900/80 p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-zinc-100">Attachments</h2>

        <p className="mt-1 text-sm text-zinc-500">
          Files connected to this task.
        </p>
      </div>

      <div className="space-y-3">
        {attachments.length === 0 ? (
          <div className="border border-dashed border-zinc-800 p-6 text-center">
            <p className="text-sm text-zinc-500">No attachments yet.</p>
          </div>
        ) : (
          attachments.map((attachment) => (
            <div
              key={attachment.id}
              className="flex flex-col gap-4 border border-zinc-800 bg-zinc-950 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <a
                  href={attachment.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block truncate text-sm font-medium text-zinc-200 transition hover:text-zinc-100 hover:underline"
                >
                  {attachment.fileName}
                </a>

                <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-zinc-600">
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
                className="w-full border border-zinc-700 px-3 py-2 text-sm font-medium text-zinc-400 transition hover:border-red-900 hover:bg-red-950/30 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          ))
        )}
      </div>

      <div className="mt-6 space-y-4 border-t border-zinc-800 pt-5">
        <div>
          <label className="text-sm font-medium text-zinc-300">
            Upload file
          </label>

          <p className="mt-1 text-xs text-zinc-600">
            Maximum file size: 10 MB.
          </p>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileChange}
          disabled={uploading}
          className="block w-full border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-400 file:mr-4 file:border-0 file:bg-zinc-800 file:px-3 file:py-2 file:text-sm file:font-medium file:text-zinc-200 hover:file:bg-zinc-700"
        />

        {selectedFile && (
          <div className="border border-zinc-800 bg-zinc-950 p-3">
            <p className="text-sm text-zinc-300">
              Selected: {selectedFile.name}
            </p>

            <p className="mt-1 text-xs text-zinc-600">
              {formatFileSize(selectedFile.size)}
            </p>
          </div>
        )}

        {error && (
          <p className="border border-red-900 bg-red-950/30 p-3 text-sm text-red-400">
            {error}
          </p>
        )}

        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleUpload}
            disabled={!selectedFile || uploading}
            className="border border-zinc-700 bg-zinc-950 px-4 py-2 text-sm font-medium text-zinc-200 transition hover:border-zinc-600 hover:bg-zinc-900 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {uploading ? "Uploading..." : "Upload Attachment"}
          </button>
        </div>
      </div>
    </div>
  );
}
