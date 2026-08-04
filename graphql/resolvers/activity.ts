import type { GraphQLContext } from "../context";
import { requireAuth } from "@/lib/require-auth";

interface TaskActivitiesArgs {
  taskId: string;
}

export const activityResolvers = {
  Query: {
    taskActivities: async (
      _parent: unknown,
      args: TaskActivitiesArgs,
      context: GraphQLContext,
    ) => {
      const user = requireAuth(context);

      return context.prisma.activity.findMany({
        where: {
          taskId: args.taskId,

          task: {
            project: {
              ownerId: user.id,
            },
          },
        },

        orderBy: {
          createdAt: "desc",
        },

        include: {
          user: true,
        },
      });
    },
  },
};
