import { PrismaClient } from "@/app/generated/prisma/client";
import { ActivityType } from "@/app/generated/prisma/enums";

import { createActivity } from "./activity";

import { CreateTaskInput, UpdateTaskInput } from "./taskTypes";

import { getTaskAccessWhere, taskInclude } from "./taskUtils";

export async function createTask(
  prisma: PrismaClient,
  userId: string,
  input: CreateTaskInput,
) {
  const project = await prisma.project.findFirst({
    where: {
      id: input.projectId,
      ...getTaskAccessWhere(userId),
    },
  });

  if (!project) {
    return null;
  }

  const task = await prisma.task.create({
    data: {
      title: input.title,
      description: input.description,
      status: input.status,
      priority: input.priority,
      dueDate: input.dueDate ? new Date(input.dueDate) : null,
      projectId: input.projectId,
    },
    include: taskInclude,
  });

  await createActivity(prisma, {
    type: ActivityType.TASK_CREATED,
    message: `Created task "${task.title}"`,
    userId,
    projectId: task.projectId,
    taskId: task.id,
  });

  return task;
}

export async function getTaskById(
  prisma: PrismaClient,
  userId: string,
  taskId: string,
) {
  return prisma.task.findFirst({
    where: {
      id: taskId,
      project: getTaskAccessWhere(userId),
    },
    include: taskInclude,
  });
}

export async function updateTask(
  prisma: PrismaClient,
  userId: string,
  taskId: string,
  input: UpdateTaskInput,
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

  const updatedTask = await prisma.task.update({
    where: {
      id: taskId,
    },
    data: {
      title: input.title,
      description: input.description,
      status: input.status,
      priority: input.priority,
      dueDate: input.dueDate ? new Date(input.dueDate) : undefined,
    },
    include: taskInclude,
  });

  await createActivity(prisma, {
    type: ActivityType.TASK_UPDATED,
    message: `Updated task "${updatedTask.title}"`,
    userId,
    projectId: updatedTask.projectId,
    taskId: updatedTask.id,
  });

  return updatedTask;
}

export async function assignTask(
  prisma: PrismaClient,
  userId: string,
  taskId: string,
  assigneeId: string | null,
) {
  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      project: getTaskAccessWhere(userId),
    },
    include: {
      project: {
        include: {
          team: {
            include: {
              members: true,
            },
          },
        },
      },
    },
  });

  if (!task) {
    return null;
  }

  if (assigneeId) {
    let canAssign = false;

    if (task.project.ownerId === assigneeId) {
      canAssign = true;
    }

    if (
      task.project.team?.members.some((member) => member.userId === assigneeId)
    ) {
      canAssign = true;
    }

    if (!canAssign) {
      throw new Error("User is not a member of this project.");
    }
  }

  const updatedTask = await prisma.task.update({
    where: {
      id: taskId,
    },
    data: {
      assigneeId,
    },
    include: taskInclude,
  });

  await createActivity(prisma, {
    type: ActivityType.TASK_ASSIGNED,
    message: assigneeId
      ? `Assigned task "${updatedTask.title}"`
      : `Unassigned task "${updatedTask.title}"`,
    userId,
    projectId: updatedTask.projectId,
    taskId: updatedTask.id,
  });

  return updatedTask;
}

export async function deleteTask(
  prisma: PrismaClient,
  userId: string,
  taskId: string,
) {
  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      project: getTaskAccessWhere(userId),
    },
  });

  if (!task) {
    return false;
  }

  await createActivity(prisma, {
    type: ActivityType.TASK_DELETED,
    message: `Deleted task "${task.title}"`,
    userId,
    projectId: task.projectId,
    taskId: task.id,
  });

  await prisma.task.delete({
    where: {
      id: taskId,
    },
  });

  return true;
}
