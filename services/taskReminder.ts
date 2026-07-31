import { PrismaClient } from "@/app/generated/prisma/client";
import { TaskStatus } from "@/app/generated/prisma/client";
import { getTaskAccessWhere, taskInclude } from "./taskUtils";

export async function getUpcomingTasks(prisma: PrismaClient, userId: string) {
  const now = new Date();

  const nextWeek = new Date();
  nextWeek.setDate(now.getDate() + 7);

  return prisma.task.findMany({
    where: {
      project: getTaskAccessWhere(userId),
      dueDate: {
        gte: now,
        lte: nextWeek,
      },
    },
    include: taskInclude,
    orderBy: {
      dueDate: "asc",
    },
  });
}

export async function getOverdueTasks(prisma: PrismaClient, userId: string) {
  const now = new Date();

  return prisma.task.findMany({
    where: {
      project: getTaskAccessWhere(userId),
      dueDate: {
        lt: now,
      },
      status: {
        not: TaskStatus.DONE,
      },
    },
    include: taskInclude,
    orderBy: {
      dueDate: "asc",
    },
  });
}
