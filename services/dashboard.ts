import { PrismaClient, TaskStatus } from "@/app/generated/prisma/client";

export async function getDashboardStats(prisma: PrismaClient, userId: string) {
  const [
    totalProjects,
    totalTasks,
    totalTeams,
    todoTasks,
    inProgressTasks,
    doneTasks,
    recentActivities,
  ] = await Promise.all([
    prisma.project.count({
      where: {
        OR: [
          { ownerId: userId },
          {
            team: {
              members: {
                some: { userId },
              },
            },
          },
        ],
      },
    }),

    prisma.task.count({
      where: {
        project: {
          OR: [
            { ownerId: userId },
            {
              team: {
                members: {
                  some: { userId },
                },
              },
            },
          ],
        },
      },
    }),

    prisma.team.count({
      where: {
        members: {
          some: { userId },
        },
      },
    }),

    prisma.task.count({
      where: {
        status: TaskStatus.TODO,
        project: {
          OR: [
            { ownerId: userId },
            {
              team: {
                members: {
                  some: { userId },
                },
              },
            },
          ],
        },
      },
    }),

    prisma.task.count({
      where: {
        status: TaskStatus.IN_PROGRESS,
        project: {
          OR: [
            { ownerId: userId },
            {
              team: {
                members: {
                  some: { userId },
                },
              },
            },
          ],
        },
      },
    }),

    prisma.task.count({
      where: {
        status: TaskStatus.DONE,
        project: {
          OR: [
            { ownerId: userId },
            {
              team: {
                members: {
                  some: { userId },
                },
              },
            },
          ],
        },
      },
    }),

    prisma.activity.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 10,
    }),
  ]);

  return {
    totalProjects,
    totalTasks,
    totalTeams,

    todoTasks,
    inProgressTasks,
    doneTasks,

    recentActivities,
  };
}
