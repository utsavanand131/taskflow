import type { User } from "@/app/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

export async function getCurrentUser(request: Request): Promise<User | null> {
  const authorization = request.headers.get("Authorization");

  if (!authorization) {
    return null;
  }

  if (!authorization.startsWith("Bearer ")) {
    return null;
  }

  const token = authorization.slice(7);

  try {
    const payload = verifyToken(token);

    const user = await prisma.user.findUnique({
      where: {
        id: payload.userId,
      },
    });

    return user;
  } catch {
    return null;
  }
}
