import type { GraphQLContext } from "../context";

import { requireAuth } from "@/lib/require-auth";
import {
  createTeam,
  deleteTeam,
  getTeamById,
  getTeams,
  updateTeam,
} from "@/services/team";

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
  },
};
