import { PrismaClient } from "@/app/generated/prisma/client";
import { ActivityType } from "@/app/generated/prisma/enums";

interface CreateActivityInput {
  type: ActivityType;
  message: string;
  userId: string;
  projectId?: string;
  taskId?: string;
  teamId?: string;
}

export async function createActivity(
  prisma: PrismaClient,
  input: CreateActivityInput,
) {
  return prisma.activity.create({
    data: {
      type: input.type,
      message: input.message,
      userId: input.userId,
      projectId: input.projectId,
      taskId: input.taskId,
      teamId: input.teamId,
    },
  });
}
