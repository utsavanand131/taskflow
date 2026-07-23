import type { GraphQLContext } from "../context";
import { registerUser, loginUser } from "@/services/auth";

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
