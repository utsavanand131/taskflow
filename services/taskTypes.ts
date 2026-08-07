import { TaskPriority, TaskStatus } from "@/app/generated/prisma/enums";

export interface CreateTaskInput {
  projectId: string;
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string;
}

export interface AddCommentInput {
  taskId: string;
  content: string;
}

export interface UpdateCommentInput {
  commentId: string;
  content: string;
}

export interface UploadAttachmentInput {
  taskId: string;
  fileName: string;
  fileUrl: string;
  publicId?: string;
  resourceType?: string;
  fileSize?: number;
  mimeType?: string;
}
