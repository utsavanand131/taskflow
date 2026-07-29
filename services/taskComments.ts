import { PrismaClient } from "@/app/generated/prisma/client";
import { ActivityType } from "@/app/generated/prisma/enums";

import { createActivity } from "./activity";
import { AddCommentInput, UpdateCommentInput } from "./taskTypes";
import { getTaskAccessWhere } from "./taskUtils";

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
          attachments: {
            include: {
              uploadedBy: true,
            },
            orderBy: {
              createdAt: "desc",
            },
          },
        },
      },
    },
  });

  await createActivity(prisma, {
    type: ActivityType.COMMENT_ADDED,
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
          attachments: {
            include: {
              uploadedBy: true,
            },
            orderBy: {
              createdAt: "desc",
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
