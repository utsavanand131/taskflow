import { requireAuth } from "@/lib/require-auth";

export const labelResolvers = {
  Query: {
    labels: async (_: unknown, __: unknown, context: any) => {
      requireAuth(context);

      return context.prisma.label.findMany({
        orderBy: {
          name: "asc",
        },
      });
    },
  },
};
