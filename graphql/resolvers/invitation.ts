import type { GraphQLContext } from "../context";

import { requireAuth } from "@/lib/require-auth";

import {
  inviteMember,
  getMyInvitations,
  acceptInvitation,
  rejectInvitation,
} from "@/services/invitation";

interface InviteMemberArgs {
  input: {
    teamId: string;
    email: string;
  };
}

interface InvitationArgs {
  id: string;
}

export const invitationResolvers = {
  Query: {
    myInvitations: async (
      _parent: unknown,
      _args: unknown,
      context: GraphQLContext,
    ) => {
      const user = requireAuth(context);

      return getMyInvitations(context.prisma, user.email);
    },
  },

  Mutation: {
    inviteMember: async (
      _parent: unknown,
      args: InviteMemberArgs,
      context: GraphQLContext,
    ) => {
      const user = requireAuth(context);

      return inviteMember(
        context.prisma,
        args.input.teamId,
        args.input.email,
        user.id,
      );
    },

    acceptInvitation: async (
      _parent: unknown,
      args: InvitationArgs,
      context: GraphQLContext,
    ) => {
      const user = requireAuth(context);

      return acceptInvitation(context.prisma, args.id, user.id, user.email);
    },

    rejectInvitation: async (
      _parent: unknown,
      args: InvitationArgs,
      context: GraphQLContext,
    ) => {
      const user = requireAuth(context);

      return rejectInvitation(context.prisma, args.id, user.email);
    },
  },
};
