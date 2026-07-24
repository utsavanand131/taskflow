import type { GraphQLContext } from "../context";

import { requireAuth } from "@/lib/require-auth";
import { createProject, getProjects } from "@/services/project";

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
      // We'll implement this in the next milestone.
      return null;
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
