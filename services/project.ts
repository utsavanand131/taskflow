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

export async function getProjects(prisma: PrismaClient, ownerId: string) {
  return prisma.project.findMany({
    where: {
      ownerId,
    },
    include: {
      owner: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getProjectById(
  prisma: PrismaClient,
  ownerId: string,
  projectId: string,
) {
  return prisma.project.findFirst({
    where: {
      id: projectId,
      ownerId,
    },
    include: {
      owner: true,
    },
  });
}
