import type { GraphQLContext } from "../context";

import { requireAuth } from "@/lib/require-auth";
import { createProject, getProjectById, getProjects } from "@/services/project";

interface CreateProjectArgs {
  input: {
    name: string;
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
  },
};
