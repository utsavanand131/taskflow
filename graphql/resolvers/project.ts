import type { GraphQLContext } from "../context";

import { requireAuth } from "@/lib/require-auth";
import {
  createProject,
  deleteProject,
  getProjectById,
  getProjects,
  updateProject,
} from "@/services/project";

interface CreateProjectArgs {
  input: {
    name: string;
    description?: string;
    color?: string;
  };
}

interface UpdateProjectArgs {
  id: string;
  input: {
    name?: string;
    description?: string;
    color?: string;
  };
}

interface ProjectArgs {
  id: string;
}

export const projectResolvers = {
  Query: {
    projects: async (
      _parent: unknown,
      _args: unknown,
      context: GraphQLContext,
    ) => {
      const user = requireAuth(context);

      return getProjects(context.prisma, user.id);
    },

    project: async (
      _parent: unknown,
      args: ProjectArgs,
      context: GraphQLContext,
    ) => {
      const user = requireAuth(context);

      const project = await getProjectById(context.prisma, user.id, args.id);

      if (!project) {
        throw new Error("Project not found.");
      }

      return project;
    },
  },

  Mutation: {
    createProject: async (
      _parent: unknown,
      args: CreateProjectArgs,
      context: GraphQLContext,
    ) => {
      const user = requireAuth(context);

      return createProject(context.prisma, user.id, args.input);
    },

    updateProject: async (
      _parent: unknown,
      args: UpdateProjectArgs,
      context: GraphQLContext,
    ) => {
      const user = requireAuth(context);

      const project = await updateProject(
        context.prisma,
        user.id,
        args.id,
        args.input,
      );

      if (!project) {
        throw new Error("Project not found.");
      }

      return project;
    },

    deleteProject: async (
      _parent: unknown,
      args: ProjectArgs,
      context: GraphQLContext,
    ) => {
      const user = requireAuth(context);

      const deleted = await deleteProject(context.prisma, user.id, args.id);

      if (!deleted) {
        throw new Error("Project not found.");
      }

      return true;
    },
  },
};
