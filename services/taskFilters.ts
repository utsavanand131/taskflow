import { TaskPriority, TaskStatus } from "@/app/generated/prisma/enums";

interface TaskFilterInput {
  status?: TaskStatus;
  priority?: TaskPriority;
  assigneeId?: string;
  dueBefore?: string;
  dueAfter?: string;
}

export function buildTaskFilter(filter?: TaskFilterInput) {
  if (!filter) {
    return {};
  }

  return {
    ...(filter.status && {
      status: filter.status,
    }),

    ...(filter.priority && {
      priority: filter.priority,
    }),

    ...(filter.assigneeId && {
      assigneeId: filter.assigneeId,
    }),

    ...(filter.dueBefore && {
      dueDate: {
        lte: new Date(filter.dueBefore),
      },
    }),

    ...(filter.dueAfter && {
      dueDate: {
        gte: new Date(filter.dueAfter),
      },
    }),
  };
}
