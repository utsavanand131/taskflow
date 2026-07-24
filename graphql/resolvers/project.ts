import type { GraphQLContext } from "../context";

import { requireAuth } from "@/lib/require-auth";
import { createProject } from "@/services/project";

interface CreateProjectArgs {
  input: {
    name: string;
    description?: string;
    color?: string;
  };
}

export const projectResolvers = {
  Query: {},

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
