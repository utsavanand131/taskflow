import {
  PrismaClient,
  TaskStatus,
  ProjectStatus,
} from "@/app/generated/prisma/client";

function getProjectAccessWhere(userId: string) {
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

export async function getDashboardStats(prisma: PrismaClient, userId: string) {
  const projectWhere = getProjectAccessWhere(userId);

  const taskWhere = {
    project: projectWhere,
  };

  const today = new Date();

  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);

  tomorrow.setDate(today.getDate() + 1);

  const [
    totalProjects,
    activeProjects,
    completedProjects,
    archivedProjects,

    totalTasks,
    todoTasks,
    inProgressTasks,
    completedTasks,

    overdueTasks,
    dueTodayTasks,

    recentActivity,
  ] = await Promise.all([
    prisma.project.count({
      where: projectWhere,
    }),

    prisma.project.count({
      where: {
        ...projectWhere,
        status: ProjectStatus.ACTIVE,
      },
    }),

    prisma.project.count({
      where: {
        ...projectWhere,
        status: ProjectStatus.COMPLETED,
      },
    }),

    prisma.project.count({
      where: {
        ...projectWhere,
        status: ProjectStatus.ARCHIVED,
      },
    }),

    prisma.task.count({
      where: taskWhere,
    }),

    prisma.task.count({
      where: {
        ...taskWhere,
        status: TaskStatus.TODO,
      },
    }),

    prisma.task.count({
      where: {
        ...taskWhere,
        status: TaskStatus.IN_PROGRESS,
      },
    }),

    prisma.task.count({
      where: {
        ...taskWhere,
        status: TaskStatus.DONE,
      },
    }),

    prisma.task.count({
      where: {
        ...taskWhere,
        status: {
          not: TaskStatus.DONE,
        },
        dueDate: {
          lt: today,
        },
      },
    }),

    prisma.task.count({
      where: {
        ...taskWhere,
        dueDate: {
          gte: today,
          lt: tomorrow,
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

  const completionRate =
    totalTasks === 0
      ? 0
      : Number(((completedTasks / totalTasks) * 100).toFixed(1));

  return {
    projects: {
      total: totalProjects,
      active: activeProjects,
      completed: completedProjects,
      archived: archivedProjects,
    },

    tasks: {
      total: totalTasks,
      todo: todoTasks,
      inProgress: inProgressTasks,
      completed: completedTasks,
      overdue: overdueTasks,
      dueToday: dueTodayTasks,
      completionRate,
    },

    recentActivity,
  };
}
