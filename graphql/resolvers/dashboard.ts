import type { GraphQLContext } from "../context";

import { requireAuth } from "@/lib/require-auth";
import { getDashboardStats } from "@/services/dashboard";

export const dashboardResolvers = {
  Query: {
    dashboardStats: async (
      _parent: unknown,
      _args: unknown,
      context: GraphQLContext,
    ) => {
      const user = requireAuth(context);

      return getDashboardStats(context.prisma, user.id);
    },
  },
};
