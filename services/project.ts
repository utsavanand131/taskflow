import { PrismaClient } from "@/app/generated/prisma/client";

interface CreateProjectInput {
  name: string;
  description?: string;
  color?: string;
}

export async function createProject(
  prisma: PrismaClient,
  ownerId: string,
  input: CreateProjectInput,
) {
  return prisma.project.create({
    data: {
      name: input.name,
      description: input.description,
      color: input.color,
      ownerId,
    },
    include: {
      owner: true,
    },
  });
}
