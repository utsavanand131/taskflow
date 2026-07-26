import { PrismaClient } from "@/app/generated/prisma/client";
import {
  ActivityType,
  TaskPriority,
  TaskStatus,
} from "@/app/generated/prisma/enums";
import { createActivity } from "./activity";

interface CreateTaskInput {
  projectId: string;
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string;
}

interface UpdateTaskInput {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string;
}

export async function createTask(
  prisma: PrismaClient,
  userId: string,
  input: CreateTaskInput,
) {
  const project = await prisma.project.findFirst({
    where: {
      id: input.projectId,
      OR: [
        {
          ownerId: userId,
        },
        {
          team: {
            members: {
              some: {
                userId,
              },
            },
          },
        },
      ],
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
    include: {
      project: {
        include: {
          team: true,
        },
      },
    },
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

export async function getTasks(
  prisma: PrismaClient,
  userId: string,
  projectId: string,
) {
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      OR: [
        {
          ownerId: userId,
        },
        {
          team: {
            members: {
              some: {
                userId,
              },
            },
          },
        },
      ],
    },
  });

  if (!project) {
    return [];
  }

  return prisma.task.findMany({
    where: {
      projectId,
    },
    include: {
      project: {
        include: {
          team: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getTaskById(
  prisma: PrismaClient,
  userId: string,
  taskId: string,
) {
  return prisma.task.findFirst({
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
                },
              },
            },
          },
        ],
      },
    },
    include: {
      project: {
        include: {
          team: true,
        },
      },
    },
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
                },
              },
            },
          },
        ],
      },
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
    include: {
      project: {
        include: {
          team: true,
        },
      },
    },
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
