import { requireAuth } from "@/lib/require-auth";
import {
  addComment,
  assignTask,
  createTask,
  deleteComment,
  deleteTask,
  getTaskById,
  getTasks,
  searchTasks,
  updateComment,
  updateTask,
} from "@/services/task";

export const taskResolvers = {
  Query: {
    tasks: async (
      _: unknown,
      { projectId }: { projectId: string },
      context: any,
    ) => {
      const user = requireAuth(context);

      return getTasks(context.prisma, user.id, projectId);
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
