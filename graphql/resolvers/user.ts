import type { GraphQLContext } from "../context";

export const userResolvers = {
  Mutation: {
    register: async (
      _parent: unknown,
      _args: unknown,
      context: GraphQLContext,
    ) => {
      console.log("Prisma available:", !!context.prisma);

      throw new Error("Not implemented yet");
    },
  },
};
