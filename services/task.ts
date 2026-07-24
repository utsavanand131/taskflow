import { prisma } from "@/lib/prisma";
import { TaskPriority, TaskStatus } from "@/app/generated/prisma/enums";

interface CreateTaskInput {
  projectId: string;
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string;
}

export async function createTask(userId: string, input: CreateTaskInput) {
  const project = await prisma.project.findFirst({
    where: {
      id: input.projectId,
      ownerId: userId,
    },
  });

  if (!project) {
    return null;
  }

  return prisma.task.create({
    data: {
      title: input.title,
      description: input.description,
      status: input.status,
      priority: input.priority,
      dueDate: input.dueDate ? new Date(input.dueDate) : null,
      projectId: input.projectId,
    },
    include: {
      project: true,
    },
  });
}
export async function getTasks(userId: string, projectId: string) {
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      ownerId: userId,
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
      project: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}
export async function getTaskById(userId: string, taskId: string) {
  return prisma.task.findFirst({
    where: {
      id: taskId,
      project: {
        ownerId: userId,
      },
    },
    include: {
      project: true,
    },
  });
}
interface UpdateTaskInput {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string;
}

export async function updateTask(
  userId: string,
  taskId: string,
  input: UpdateTaskInput,
) {
  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      project: {
        ownerId: userId,
      },
    },
  });

  if (!task) {
    return null;
  }

  return prisma.task.update({
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
      project: true,
    },
  });
}
export async function deleteTask(userId: string, taskId: string) {
  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      project: {
        ownerId: userId,
      },
    },
  });

  if (!task) {
    return false;
  }

  await prisma.task.delete({
    where: {
      id: taskId,
    },
  });

  return true;
}
