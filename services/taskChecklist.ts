import { PrismaClient } from "@/app/generated/prisma/client";
import { ActivityType } from "@/app/generated/prisma/enums";

import { createActivity } from "./activity";
import { getTaskAccessWhere } from "./taskUtils";

export async function addChecklistItem(
  prisma: PrismaClient,
  userId: string,
  taskId: string,
  content: string,
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

  const item = await prisma.checklistItem.create({
    data: {
      content,
      taskId,
      createdById: userId,
    },
    include: {
      createdBy: true,
    },
  });

  await createActivity(prisma, {
    type: ActivityType.TASK_UPDATED,
    message: `Added checklist item to task "${task.title}"`,
    userId,
    projectId: task.projectId,
    taskId: task.id,
  });

  return item;
}

export async function updateChecklistItem(
  prisma: PrismaClient,
  userId: string,
  checklistItemId: string,
  content: string,
) {
  const item = await prisma.checklistItem.findFirst({
    where: {
      id: checklistItemId,
      task: {
        project: getTaskAccessWhere(userId),
      },
    },
    include: {
      task: true,
    },
  });

  if (!item) {
    return null;
  }

  const updatedItem = await prisma.checklistItem.update({
    where: {
      id: checklistItemId,
    },
    data: {
      content,
    },
    include: {
      createdBy: true,
    },
  });

  await createActivity(prisma, {
    type: ActivityType.TASK_UPDATED,
    message: `Updated checklist item on task "${item.task.title}"`,
    userId,
    projectId: item.task.projectId,
    taskId: item.task.id,
  });

  return updatedItem;
}

export async function toggleChecklistItem(
  prisma: PrismaClient,
  userId: string,
  checklistItemId: string,
) {
  const item = await prisma.checklistItem.findFirst({
    where: {
      id: checklistItemId,
      task: {
        project: getTaskAccessWhere(userId),
      },
    },
    include: {
      task: true,
    },
  });

  if (!item) {
    return null;
  }

  const updatedItem = await prisma.checklistItem.update({
    where: {
      id: checklistItemId,
    },
    data: {
      completed: !item.completed,
    },
    include: {
      createdBy: true,
    },
  });

  await createActivity(prisma, {
    type: ActivityType.TASK_UPDATED,
    message: `${updatedItem.completed ? "Completed" : "Reopened"} checklist item on task "${item.task.title}"`,
    userId,
    projectId: item.task.projectId,
    taskId: item.task.id,
  });

  return updatedItem;
}
export async function deleteChecklistItem(
  prisma: PrismaClient,
  userId: string,
  checklistItemId: string,
) {
  const item = await prisma.checklistItem.findFirst({
    where: {
      id: checklistItemId,
      task: {
        project: getTaskAccessWhere(userId),
      },
    },
    include: {
      task: true,
    },
  });

  if (!item) {
    return false;
  }

  await createActivity(prisma, {
    type: ActivityType.TASK_UPDATED,
    message: `Deleted checklist item from task "${item.task.title}"`,
    userId,
    projectId: item.task.projectId,
    taskId: item.task.id,
  });

  await prisma.checklistItem.delete({
    where: {
      id: checklistItemId,
    },
  });

  return true;
}
