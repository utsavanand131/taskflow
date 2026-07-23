import { GraphQLError } from "graphql";
import type { User } from "@/app/generated/prisma/client";
import type { GraphQLContext } from "@/graphql/context";

export function requireAuth(context: GraphQLContext): User {
  if (!context.user) {
    throw new GraphQLError("Unauthorized", {
      extensions: {
        code: "UNAUTHENTICATED",
      },
    });
  }

  return context.user;
}
