import { PrismaClient, TeamRole } from "@/app/generated/prisma/client";

import { ActivityType } from "@/app/generated/prisma/enums";
import { createActivity } from "./activity";
import { CreateTaskInput, UpdateTaskInput } from "./taskTypes";
import { getTaskAccessWhere, taskInclude } from "./taskUtils";
import { createNotification } from "./notification";

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
      dueDate:
        input.dueDate === undefined
          ? undefined
          : input.dueDate
            ? new Date(input.dueDate)
            : null,
    },
    include: taskInclude,
  });

  if (input.status && input.status !== task.status) {
    await createActivity(prisma, {
      type: ActivityType.TASK_UPDATED,
      message: `Changed status of "${updatedTask.title}" from ${task.status} to ${updatedTask.status}`,
      userId,
      projectId: updatedTask.projectId,
      taskId: updatedTask.id,
    });
  }

  if (input.priority && input.priority !== task.priority) {
    await createActivity(prisma, {
      type: ActivityType.TASK_UPDATED,
      message: `Changed priority of "${updatedTask.title}" from ${task.priority} to ${updatedTask.priority}`,
      userId,
      projectId: updatedTask.projectId,
      taskId: updatedTask.id,
    });
  }

  if (input.dueDate !== undefined) {
    const oldDueDate = task.dueDate?.toISOString() ?? null;
    const newDueDate = updatedTask.dueDate?.toISOString() ?? null;

    if (oldDueDate !== newDueDate) {
      await createActivity(prisma, {
        type: ActivityType.TASK_UPDATED,
        message: updatedTask.dueDate
          ? `Changed due date of "${updatedTask.title}" to ${updatedTask.dueDate.toLocaleDateString()}`
          : `Removed due date from "${updatedTask.title}"`,
        userId,
        projectId: updatedTask.projectId,
        taskId: updatedTask.id,
      });
    }
  }

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
          owner: true,
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

  const currentMembership = await prisma.teamMember.findFirst({
    where: {
      teamId: task.project.teamId ?? "",
      userId,
    },
  });

  const isOwner = task.project.ownerId === userId;

  const canAssign =
    isOwner ||
    currentMembership?.role === TeamRole.OWNER ||
    currentMembership?.role === TeamRole.ADMIN;

  if (!canAssign) {
    throw new Error("Only owners and admins can assign tasks.");
  }

  if (assigneeId) {
    let userExists = false;

    if (task.project.ownerId === assigneeId) {
      userExists = true;
    }

    if (
      task.project.team?.members.some((member) => member.userId === assigneeId)
    ) {
      userExists = true;
    }

    if (!userExists) {
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

  if (assigneeId) {
    await createNotification(
      prisma,
      assigneeId,
      `You were assigned task "${updatedTask.title}"`,
    );
  }

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
      project: {
        OR: [
          {
            ownerId: userId,
          },
          {
            team: {
              members: {
                some: {
                  userId,
                  role: {
                    in: [TeamRole.OWNER, TeamRole.ADMIN],
                  },
                },
              },
            },
          },
        ],
      },
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
