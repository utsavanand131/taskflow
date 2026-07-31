import { PrismaClient } from "@/app/generated/prisma/client";

export async function createNotification(
  prisma: PrismaClient,
  userId: string,
  message: string,
) {
  return prisma.notification.create({
    data: {
      userId,
      message,
    },
  });
}

export async function getNotifications(prisma: PrismaClient, userId: string) {
  return prisma.notification.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function markNotificationRead(
  prisma: PrismaClient,
  userId: string,
  notificationId: string,
) {
  const notification = await prisma.notification.findFirst({
    where: {
      id: notificationId,
      userId,
    },
  });

  if (!notification) {
    return null;
  }

  return prisma.notification.update({
    where: {
      id: notificationId,
    },
    data: {
      read: true,
    },
  });
}
