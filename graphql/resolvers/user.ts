import type { GraphQLContext } from "../context";
import { registerUser, loginUser } from "@/services/auth";
import { requireAuth } from "@/lib/require-auth";

interface RegisterArgs {
  name: string;
  email: string;
  password: string;
}

interface LoginArgs {
  email: string;
  password: string;
}

export const userResolvers = {
  Query: {
    me: (_parent: unknown, _args: unknown, context: GraphQLContext) => {
      return requireAuth(context);
    },
  },

  Mutation: {
    register: async (
      _parent: unknown,
      args: RegisterArgs,
      context: GraphQLContext,
    ) => {
      return registerUser(context.prisma, args);
    },

    login: async (
      _parent: unknown,
      args: LoginArgs,
      context: GraphQLContext,
    ) => {
      return loginUser(context.prisma, args);
    },
  },
};
