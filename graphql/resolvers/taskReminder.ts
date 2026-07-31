import type { GraphQLContext } from "../context";

import { requireAuth } from "@/lib/require-auth";
import { getUpcomingTasks, getOverdueTasks } from "@/services/taskReminder";

export const taskReminderResolvers = {
  Query: {
    upcomingTasks: async (_: unknown, __: unknown, context: GraphQLContext) => {
      const user = requireAuth(context);

      return getUpcomingTasks(context.prisma, user.id);
    },

    overdueTasks: async (_: unknown, __: unknown, context: GraphQLContext) => {
      const user = requireAuth(context);

      return getOverdueTasks(context.prisma, user.id);
    },
  },
};
