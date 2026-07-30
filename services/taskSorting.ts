import { Prisma } from "@/app/generated/prisma/client";

interface TaskSortInput {
  field: string;
  order?: "ASC" | "DESC";
}

export function buildTaskSort(
  sort?: TaskSortInput,
): Prisma.TaskOrderByWithRelationInput {
  if (!sort) {
    return {
      createdAt: "desc",
    };
  }

  const order = sort.order === "ASC" ? "asc" : "desc";

  switch (sort.field) {
    case "UPDATED_AT":
      return {
        updatedAt: order,
      };

    case "DUE_DATE":
      return {
        dueDate: order,
      };

    case "TITLE":
      return {
        title: order,
      };

    case "PRIORITY":
      return {
        priority: order,
      };

    case "CREATED_AT":
    default:
      return {
        createdAt: order,
      };
  }
}
