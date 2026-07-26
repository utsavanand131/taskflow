import { requireAuth } from "@/lib/require-auth";
import {
  createTask,
  getTaskById,
  getTasks,
  updateTask,
  deleteTask,
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
