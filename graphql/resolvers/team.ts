import type { GraphQLContext } from "../context";

import { requireAuth } from "@/lib/require-auth";

import {
  createTeam,
  deleteTeam,
  getTeamById,
  getTeams,
  updateTeam,
} from "@/services/team";

import {
  getTeamMembers,
  removeTeamMember,
  updateTeamMemberRole,
} from "@/services/team-member";

import { TeamRole } from "@/app/generated/prisma/enums";

interface CreateTeamArgs {
  input: {
    name: string;
    description?: string;
  };
}

interface UpdateTeamArgs {
  id: string;
  input: {
    name?: string;
    description?: string;
  };
}

interface TeamArgs {
  id: string;
}

interface TeamMembersArgs {
  teamId: string;
}

interface RemoveTeamMemberArgs {
  teamId: string;
  userId: string;
}

interface UpdateTeamMemberRoleArgs {
  input: {
    teamId: string;
    userId: string;
    role: TeamRole;
  };
}

export const teamResolvers = {
  Query: {
    teams: async (
      _parent: unknown,
      _args: unknown,
      context: GraphQLContext,
    ) => {
      const user = requireAuth(context);

      return getTeams(context.prisma, user.id);
    },

    team: async (_parent: unknown, args: TeamArgs, context: GraphQLContext) => {
      const user = requireAuth(context);

      const team = await getTeamById(context.prisma, user.id, args.id);

      if (!team) {
        throw new Error("Team not found.");
      }

      return team;
    },

    teamMembers: async (
      _parent: unknown,
      args: TeamMembersArgs,
      context: GraphQLContext,
    ) => {
      const user = requireAuth(context);

      return getTeamMembers(context.prisma, args.teamId, user.id);
    },
  },

  Mutation: {
    createTeam: async (
      _parent: unknown,
      args: CreateTeamArgs,
      context: GraphQLContext,
    ) => {
      const user = requireAuth(context);

      return createTeam(context.prisma, user.id, args.input);
    },

    updateTeam: async (
      _parent: unknown,
      args: UpdateTeamArgs,
      context: GraphQLContext,
    ) => {
      const user = requireAuth(context);

      const team = await updateTeam(
        context.prisma,
        user.id,
        args.id,
        args.input,
      );

      if (!team) {
        throw new Error("Team not found.");
      }

      return team;
    },

    deleteTeam: async (
      _parent: unknown,
      args: TeamArgs,
      context: GraphQLContext,
    ) => {
      const user = requireAuth(context);

      const deleted = await deleteTeam(context.prisma, user.id, args.id);

      if (!deleted) {
        throw new Error("Team not found.");
      }

      return true;
    },

    removeTeamMember: async (
      _parent: unknown,
      args: RemoveTeamMemberArgs,
      context: GraphQLContext,
    ) => {
      const user = requireAuth(context);

      return removeTeamMember(
        context.prisma,
        args.teamId,
        args.userId,
        user.id,
      );
    },

    updateTeamMemberRole: async (
      _parent: unknown,
      args: UpdateTeamMemberRoleArgs,
      context: GraphQLContext,
    ) => {
      const user = requireAuth(context);

      return updateTeamMemberRole(
        context.prisma,
        args.input.teamId,
        args.input.userId,
        args.input.role,
        user.id,
      );
    },
  },
};
