import { PrismaClient } from "@/app/generated/prisma/client";
import { getTaskAccessWhere, taskInclude } from "./taskUtils";

export async function getTasks(
  prisma: PrismaClient,
  userId: string,
  projectId: string,
) {
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      ...getTaskAccessWhere(userId),
    },
  });

  if (!project) {
    return [];
  }

  return prisma.task.findMany({
    where: {
      projectId,
    },
    include: taskInclude,
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function searchTasks(
  prisma: PrismaClient,
  userId: string,
  projectId: string,
  search: string,
  page: number,
  limit: number,
) {
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      ...getTaskAccessWhere(userId),
    },
  });

  if (!project) {
    return {
      items: [],
      total: 0,
      page,
      totalPages: 0,
    };
  }

  const where = {
    projectId,
    ...(search && {
      title: {
        contains: search,
      },
    }),
  };

  const total = await prisma.task.count({
    where,
  });

  const items = await prisma.task.findMany({
    where,
    include: taskInclude,
    orderBy: {
      createdAt: "desc",
    },
    skip: (page - 1) * limit,
    take: limit,
  });

  return {
    items,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}
