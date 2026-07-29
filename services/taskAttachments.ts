import { PrismaClient } from "@/app/generated/prisma/client";
import { ActivityType } from "@/app/generated/prisma/enums";
import { createActivity } from "./activity";
import { UploadAttachmentInput } from "./taskTypes";
import { getTaskAccessWhere } from "./taskUtils";

export async function uploadAttachment(
  prisma: PrismaClient,
  userId: string,
  input: UploadAttachmentInput,
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

  const attachment = await prisma.attachment.create({
    data: {
      taskId: input.taskId,
      uploadedById: userId,
      fileName: input.fileName,
      fileUrl: input.fileUrl,
      fileSize: input.fileSize,
      mimeType: input.mimeType,
    },
    include: {
      uploadedBy: true,
    },
  });

  await createActivity(prisma, {
    type: ActivityType.TASK_UPDATED,
    message: `Uploaded "${attachment.fileName}" to task "${task.title}"`,
    userId,
    projectId: task.projectId,
    taskId: task.id,
  });

  return attachment;
}

export async function deleteAttachment(
  prisma: PrismaClient,
  userId: string,
  attachmentId: string,
) {
  const attachment = await prisma.attachment.findFirst({
    where: {
      id: attachmentId,
      task: {
        project: getTaskAccessWhere(userId),
      },
    },
    include: {
      task: true,
    },
  });

  if (!attachment) {
    return false;
  }

  await createActivity(prisma, {
    type: ActivityType.TASK_UPDATED,
    message: `Deleted attachment "${attachment.fileName}" from task "${attachment.task.title}"`,
    userId,
    projectId: attachment.task.projectId,
    taskId: attachment.task.id,
  });

  await prisma.attachment.delete({
    where: {
      id: attachmentId,
    },
  });

  return true;
}
