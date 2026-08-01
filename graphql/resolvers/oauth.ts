import { googleLogin } from "@/services/oauth";

export const oauthResolvers = {
  Mutation: {
    googleLogin: async (
      _: unknown,
      args: {
        credential: string;
      },
      context: {
        prisma: any;
      },
    ) => {
      return googleLogin(context.prisma, {
        credential: args.credential,
      });
    },
  },
};
