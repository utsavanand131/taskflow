import type { User } from "@/app/generated/prisma/client";
import { getCurrentUser } from "@/services/current-user";
import { prisma } from "@/lib/prisma";

export interface GraphQLContext {
  prisma: typeof prisma;
  request: Request;
  user: User | null;
}

export async function createContext({
  request,
}: {
  request: Request;
}): Promise<GraphQLContext> {
  const user = await getCurrentUser(request);

  return {
    prisma,
    request,
    user,
  };
}
