import type { GraphQLContext } from "../context";

import { requireAuth } from "@/lib/require-auth";
import {
  getNotifications,
  markNotificationRead,
} from "@/services/notification";

export const notificationResolvers = {
  Query: {
    notifications: async (_: unknown, __: unknown, context: GraphQLContext) => {
      const user = requireAuth(context);

      return getNotifications(context.prisma, user.id);
    },
  },

  Mutation: {
    markNotificationRead: async (
      _: unknown,
      { id }: { id: string },
      context: GraphQLContext,
    ) => {
      const user = requireAuth(context);

      const notification = await markNotificationRead(
        context.prisma,
        user.id,
        id,
      );

      if (!notification) {
        throw new Error("Notification not found.");
      }

      return notification;
    },
  },
};
