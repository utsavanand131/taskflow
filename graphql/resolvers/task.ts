import { requireAuth } from "@/lib/require-auth";
import {
  assignTask,
  createTask,
  deleteTask,
  getTaskById,
  updateTask,
} from "@/services/task";
import { getTasks, searchTasks } from "@/services/taskSearch";
import {
  addComment,
  updateComment,
  deleteComment,
} from "@/services/taskComments";
import { createLabel, assignLabel, removeLabel } from "@/services/taskLabels";
import { uploadAttachment, deleteAttachment } from "@/services/taskAttachments";
import {
  addChecklistItem,
  updateChecklistItem,
  toggleChecklistItem,
  deleteChecklistItem,
} from "@/services/taskChecklist";
import { TaskPriority, TaskStatus } from "@/app/generated/prisma/enums";

export const taskResolvers = {
  Query: {
    tasks: async (
      _: unknown,
      {
        projectId,
        filter,
        sort,
      }: {
        projectId: string;
        filter?: {
          status?: TaskStatus;
          priority?: TaskPriority;
          assigneeId?: string;
          dueBefore?: string;
          dueAfter?: string;
        };
        sort?: {
          field: string;
          order?: "ASC" | "DESC";
        };
      },
      context: any,
    ) => {
      const user = requireAuth(context);

      return getTasks(context.prisma, user.id, projectId, filter, sort);
    },

    searchTasks: async (
      _: unknown,
      {
        projectId,
        search,
        page,
        limit,
      }: {
        projectId: string;
        search?: string;
        page?: number;
        limit?: number;
      },
      context: any,
    ) => {
      const user = requireAuth(context);

      return searchTasks(
        context.prisma,
        user.id,
        projectId,
        search ?? "",
        page ?? 1,
        limit ?? 10,
      );
    },

    task: async (_: unknown, { id }: { id: string }, context: any) => {
      const user = requireAuth(context);

      const task = await getTaskById(context.prisma, user.id, id);

      if (!task) {
        throw new Error("Task not found.");
      }

      return task;
    },
  },

  Mutation: {
    createTask: async (_: unknown, { input }: { input: any }, context: any) => {
      const user = requireAuth(context);

      const task = await createTask(context.prisma, user.id, input);

      if (!task) {
        throw new Error("Project not found.");
      }

      return task;
    },

    updateTask: async (
      _: unknown,
      { id, input }: { id: string; input: any },
      context: any,
    ) => {
      const user = requireAuth(context);

      const task = await updateTask(context.prisma, user.id, id, input);

      if (!task) {
        throw new Error("Task not found.");
      }

      return task;
    },

    assignTask: async (
      _: unknown,
      {
        taskId,
        assigneeId,
      }: {
        taskId: string;
        assigneeId?: string | null;
      },
      context: any,
    ) => {
      const user = requireAuth(context);

      const task = await assignTask(
        context.prisma,
        user.id,
        taskId,
        assigneeId ?? null,
      );

      if (!task) {
        throw new Error("Task not found.");
      }

      return task;
    },

    addComment: async (
      _: unknown,
      {
        taskId,
        content,
      }: {
        taskId: string;
        content: string;
      },
      context: any,
    ) => {
      const user = requireAuth(context);

      const comment = await addComment(context.prisma, user.id, {
        taskId,
        content,
      });

      if (!comment) {
        throw new Error("Task not found.");
      }

      return comment;
    },

    updateComment: async (
      _: unknown,
      {
        commentId,
        content,
      }: {
        commentId: string;
        content: string;
      },
      context: any,
    ) => {
      const user = requireAuth(context);

      const comment = await updateComment(context.prisma, user.id, {
        commentId,
        content,
      });

      if (!comment) {
        throw new Error("Comment not found.");
      }

      return comment;
    },

    deleteComment: async (
      _: unknown,
      { commentId }: { commentId: string },
      context: any,
    ) => {
      const user = requireAuth(context);

      const deleted = await deleteComment(context.prisma, user.id, commentId);

      if (!deleted) {
        throw new Error("Comment not found.");
      }

      return true;
    },

    createLabel: async (
      _: unknown,
      {
        name,
        color,
      }: {
        name: string;
        color?: string;
      },
      context: any,
    ) => {
      requireAuth(context);

      return createLabel(context.prisma, name, color);
    },

    assignLabel: async (
      _: unknown,
      {
        taskId,
        labelId,
      }: {
        taskId: string;
        labelId: string;
      },
      context: any,
    ) => {
      const user = requireAuth(context);

      const task = await assignLabel(context.prisma, user.id, taskId, labelId);

      if (!task) {
        throw new Error("Task not found.");
      }

      return task;
    },

    removeLabel: async (
      _: unknown,
      {
        taskId,
        labelId,
      }: {
        taskId: string;
        labelId: string;
      },
      context: any,
    ) => {
      const user = requireAuth(context);

      const task = await removeLabel(context.prisma, user.id, taskId, labelId);

      if (!task) {
        throw new Error("Task not found.");
      }

      return task;
    },

    uploadAttachment: async (
      _: unknown,
      {
        taskId,
        fileName,
        fileUrl,
        fileSize,
        mimeType,
      }: {
        taskId: string;
        fileName: string;
        fileUrl: string;
        fileSize?: number;
        mimeType?: string;
      },
      context: any,
    ) => {
      const user = requireAuth(context);

      const attachment = await uploadAttachment(context.prisma, user.id, {
        taskId,
        fileName,
        fileUrl,
        fileSize,
        mimeType,
      });

      if (!attachment) {
        throw new Error("Task not found.");
      }

      return attachment;
    },

    deleteAttachment: async (
      _: unknown,
      { attachmentId }: { attachmentId: string },
      context: any,
    ) => {
      const user = requireAuth(context);

      const deleted = await deleteAttachment(
        context.prisma,
        user.id,
        attachmentId,
      );

      if (!deleted) {
        throw new Error("Attachment not found.");
      }

      return true;
    },

    addChecklistItem: async (
      _: unknown,
      {
        taskId,
        content,
      }: {
        taskId: string;
        content: string;
      },
      context: any,
    ) => {
      const user = requireAuth(context);

      const item = await addChecklistItem(
        context.prisma,
        user.id,
        taskId,
        content,
      );

      if (!item) {
        throw new Error("Task not found.");
      }

      return item;
    },

    updateChecklistItem: async (
      _: unknown,
      {
        checklistItemId,
        content,
      }: {
        checklistItemId: string;
        content: string;
      },
      context: any,
    ) => {
      const user = requireAuth(context);

      const item = await updateChecklistItem(
        context.prisma,
        user.id,
        checklistItemId,
        content,
      );

      if (!item) {
        throw new Error("Checklist item not found.");
      }

      return item;
    },

    toggleChecklistItem: async (
      _: unknown,
      {
        checklistItemId,
      }: {
        checklistItemId: string;
      },
      context: any,
    ) => {
      const user = requireAuth(context);

      const item = await toggleChecklistItem(
        context.prisma,
        user.id,
        checklistItemId,
      );

      if (!item) {
        throw new Error("Checklist item not found.");
      }

      return item;
    },

    deleteChecklistItem: async (
      _: unknown,
      {
        checklistItemId,
      }: {
        checklistItemId: string;
      },
      context: any,
    ) => {
      const user = requireAuth(context);

      const deleted = await deleteChecklistItem(
        context.prisma,
        user.id,
        checklistItemId,
      );

      if (!deleted) {
        throw new Error("Checklist item not found.");
      }

      return true;
    },

    deleteTask: async (_: unknown, { id }: { id: string }, context: any) => {
      const user = requireAuth(context);

      const deleted = await deleteTask(context.prisma, user.id, id);

      if (!deleted) {
        throw new Error("Task not found.");
      }

      return true;
    },
  },
};
