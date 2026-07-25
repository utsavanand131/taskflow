import type { GraphQLContext } from "../context";

import { TeamRole } from "@/app/generated/prisma/client";
import { requireAuth } from "@/lib/require-auth";

import {
  getTeamMembers,
  removeTeamMember,
  updateTeamMemberRole,
} from "@/services/team-member";

export const teamMemberResolvers = {
  Query: {
    teamMembers: async (
      _: unknown,
      { teamId }: { teamId: string },
      context: GraphQLContext,
    ) => {
      const user = requireAuth(context);

      return getTeamMembers(context.prisma, teamId, user.id);
    },
  },

  Mutation: {
    removeTeamMember: async (
      _: unknown,
      { teamId, userId }: { teamId: string; userId: string },
      context: GraphQLContext,
    ) => {
      const user = requireAuth(context);

      return removeTeamMember(context.prisma, teamId, userId, user.id);
    },

    updateTeamMemberRole: async (
      _: unknown,
      {
        input,
      }: {
        input: {
          teamId: string;
          userId: string;
          role: TeamRole;
        };
      },
      context: GraphQLContext,
    ) => {
      const user = requireAuth(context);

      return updateTeamMemberRole(
        context.prisma,
        input.teamId,
        input.userId,
        input.role,
        user.id,
      );
    },
  },
};
