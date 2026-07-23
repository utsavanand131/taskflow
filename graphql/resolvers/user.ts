import type { GraphQLContext } from "../context";
import { registerUser } from "@/services/auth";

interface RegisterArgs {
  name: string;
  email: string;
  password: string;
}

export const userResolvers = {
  Mutation: {
    register: async (
      _parent: unknown,
      args: RegisterArgs,
      context: GraphQLContext,
    ) => {
      return registerUser(context.prisma, args);
    },
  },
};
