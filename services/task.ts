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

interface AddCommentInput {
  taskId: string;
  content: string;
}

interface UpdateCommentInput {
  commentId: string;
  content: string;
}

function getTaskAccessWhere(userId: string) {
  return {
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
  };
}

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
    include: {
      project: {
        include: {
          team: true,
        },
      },
      assignee: true,
      comments: {
        include: {
          author: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      },
      labels: {
        orderBy: {
          name: "asc",
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
    include: {
      project: {
        include: {
          team: true,
        },
      },
      assignee: true,
      comments: {
        include: {
          author: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      },
      labels: {
        orderBy: {
          name: "asc",
        },
      },
    },
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

    include: {
      project: {
        include: {
          team: true,
        },
      },
      assignee: true,
      comments: {
        include: {
          author: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      },
      labels: {
        orderBy: {
          name: "asc",
        },
      },
    },

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
    include: {
      project: {
        include: {
          team: true,
        },
      },
      assignee: true,
      comments: {
        include: {
          author: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      },
      labels: {
        orderBy: {
          name: "asc",
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
    include: {
      project: {
        include: {
          team: true,
        },
      },
      assignee: true,
      comments: {
        include: {
          author: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      },
      labels: {
        orderBy: {
          name: "asc",
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
    include: {
      project: {
        include: {
          team: true,
        },
      },
      assignee: true,
      comments: {
        include: {
          author: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      },
      labels: {
        orderBy: {
          name: "asc",
        },
      },
    },
  });

  await createActivity(prisma, {
    type: ActivityType.TASK_UPDATED,
    message: assigneeId
      ? `Assigned task "${updatedTask.title}"`
      : `Unassigned task "${updatedTask.title}"`,
    userId,
    projectId: updatedTask.projectId,
    taskId: updatedTask.id,
  });

  return updatedTask;
}

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
    include: {
      project: {
        include: {
          team: true,
        },
      },
      assignee: true,
      comments: {
        include: {
          author: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      },
      labels: {
        orderBy: {
          name: "asc",
        },
      },
    },
  });

  await createActivity(prisma, {
    type: ActivityType.TASK_UPDATED,
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
    include: {
      project: {
        include: {
          team: true,
        },
      },
      assignee: true,
      comments: {
        include: {
          author: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      },
      labels: {
        orderBy: {
          name: "asc",
        },
      },
    },
  });

  await createActivity(prisma, {
    type: ActivityType.TASK_UPDATED,
    message: `Removed label "${label.name}" from task "${updatedTask.title}"`,
    userId,
    projectId: updatedTask.projectId,
    taskId: updatedTask.id,
  });

  return updatedTask;
}
export async function addComment(
  prisma: PrismaClient,
  userId: string,
  input: AddCommentInput,
) {
  const task = await prisma.task.findFirst({
    where: {
      id: input.taskId,
      project: getTaskAccessWhere(userId),
    },
  });

  if (!task) {
    return null;
  }

  const comment = await prisma.comment.create({
    data: {
      content: input.content,
      taskId: input.taskId,
      authorId: userId,
    },
    include: {
      author: true,
      task: {
        include: {
          labels: {
            orderBy: {
              name: "asc",
            },
          },
        },
      },
    },
  });

  await createActivity(prisma, {
    type: ActivityType.TASK_UPDATED,
    message: `Commented on task "${task.title}"`,
    userId,
    projectId: task.projectId,
    taskId: task.id,
  });

  return comment;
}

export async function updateComment(
  prisma: PrismaClient,
  userId: string,
  input: UpdateCommentInput,
) {
  const comment = await prisma.comment.findFirst({
    where: {
      id: input.commentId,
      authorId: userId,
    },
    include: {
      task: true,
    },
  });

  if (!comment) {
    return null;
  }

  const updatedComment = await prisma.comment.update({
    where: {
      id: input.commentId,
    },
    data: {
      content: input.content,
    },
    include: {
      author: true,
      task: {
        include: {
          labels: {
            orderBy: {
              name: "asc",
            },
          },
        },
      },
    },
  });

  await createActivity(prisma, {
    type: ActivityType.TASK_UPDATED,
    message: `Updated a comment on task "${comment.task.title}"`,
    userId,
    projectId: comment.task.projectId,
    taskId: comment.task.id,
  });

  return updatedComment;
}

export async function deleteComment(
  prisma: PrismaClient,
  userId: string,
  commentId: string,
) {
  const comment = await prisma.comment.findFirst({
    where: {
      id: commentId,
      authorId: userId,
    },
    include: {
      task: true,
    },
  });

  if (!comment) {
    return false;
  }

  await createActivity(prisma, {
    type: ActivityType.TASK_UPDATED,
    message: `Deleted a comment from task "${comment.task.title}"`,
    userId,
    projectId: comment.task.projectId,
    taskId: comment.task.id,
  });

  await prisma.comment.delete({
    where: {
      id: commentId,
    },
  });

  return true;
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
