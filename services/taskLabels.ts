import { PrismaClient } from "@/app/generated/prisma/client";
import { ActivityType } from "@/app/generated/prisma/enums";

import { createActivity } from "./activity";
import { getTaskAccessWhere, taskInclude } from "./taskUtils";

export async function createLabel(
  prisma: PrismaClient,
  name: string,
  color?: string,
) {
  return prisma.label.create({
    data: {
      name,
      color,
    },
  });
}

export async function assignLabel(
  prisma: PrismaClient,
  userId: string,
  taskId: string,
  labelId: string,
) {
  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      project: getTaskAccessWhere(userId),
    },
  });

  if (!task) {
    return null;
  }

  const label = await prisma.label.findUnique({
    where: {
      id: labelId,
    },
  });

  if (!label) {
    throw new Error("Label not found.");
  }

  const updatedTask = await prisma.task.update({
    where: {
      id: taskId,
    },
    data: {
      labels: {
        connect: {
          id: labelId,
        },
      },
    },
    include: taskInclude,
  });

  await createActivity(prisma, {
    type: ActivityType.LABEL_ASSIGNED,
    message: `Added label "${label.name}" to task "${updatedTask.title}"`,
    userId,
    projectId: updatedTask.projectId,
    taskId: updatedTask.id,
  });

  return updatedTask;
}

export async function removeLabel(
  prisma: PrismaClient,
  userId: string,
  taskId: string,
  labelId: string,
) {
  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      project: getTaskAccessWhere(userId),
    },
  });

  if (!task) {
    return null;
  }

  const label = await prisma.label.findUnique({
    where: {
      id: labelId,
    },
  });

  if (!label) {
    throw new Error("Label not found.");
  }

  const updatedTask = await prisma.task.update({
    where: {
      id: taskId,
    },
    data: {
      labels: {
        disconnect: {
          id: labelId,
        },
      },
    },
    include: taskInclude,
  });

  await createActivity(prisma, {
    type: ActivityType.LABEL_REMOVED,
    message: `Removed label "${label.name}" from task "${updatedTask.title}"`,
    userId,
    projectId: updatedTask.projectId,
    taskId: updatedTask.id,
  });

  return updatedTask;
}
