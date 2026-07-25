import type { GraphQLContext } from "../context";

import { requireAuth } from "@/lib/require-auth";

import {
  acceptInvitation,
  getMyInvitations,
  inviteMember,
  rejectInvitation,
} from "@/services/invitation";

export const invitationResolvers = {
  Query: {
    myInvitations: async (_: unknown, __: unknown, context: GraphQLContext) => {
      const user = requireAuth(context);

      return getMyInvitations(context.prisma, user.email);
    },
  },

  Mutation: {
    inviteMember: async (
      _: unknown,
      { input }: { input: { teamId: string; email: string } },
      context: GraphQLContext,
    ) => {
      const user = requireAuth(context);

      return inviteMember(context.prisma, input.teamId, input.email, user.id);
    },

    acceptInvitation: async (
      _: unknown,
      { id }: { id: string },
      context: GraphQLContext,
    ) => {
      const user = requireAuth(context);

      return acceptInvitation(context.prisma, id, user.id, user.email);
    },

    rejectInvitation: async (
      _: unknown,
      { id }: { id: string },
      context: GraphQLContext,
    ) => {
      const user = requireAuth(context);

      return rejectInvitation(context.prisma, id, user.email);
    },
  },
};
