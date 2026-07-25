import { PrismaClient } from "@/app/generated/prisma/client";

interface CreateProjectInput {
  name: string;
  description?: string;
  color?: string;
  teamId?: string;
}

interface UpdateProjectInput {
  name?: string;
  description?: string;
  color?: string;
}

export async function createProject(
  prisma: PrismaClient,
  ownerId: string,
  input: CreateProjectInput,
) {
  if (input.teamId) {
    const membership = await prisma.teamMember.findFirst({
      where: {
        teamId: input.teamId,
        userId: ownerId,
      },
    });

    if (!membership) {
      throw new Error("You are not a member of this team.");
    }
  }

  return prisma.project.create({
    data: {
      name: input.name,
      description: input.description,
      color: input.color,
      ownerId,
      teamId: input.teamId,
    },
    include: {
      owner: true,
      team: true,
    },
  });
}

export async function getProjects(prisma: PrismaClient, ownerId: string) {
  return prisma.project.findMany({
    where: {
      OR: [
        {
          ownerId,
        },
        {
          team: {
            members: {
              some: {
                userId: ownerId,
              },
            },
          },
        },
      ],
    },
    include: {
      owner: true,
      team: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getProjectById(
  prisma: PrismaClient,
  ownerId: string,
  projectId: string,
) {
  return prisma.project.findFirst({
    where: {
      id: projectId,
      OR: [
        {
          ownerId,
        },
        {
          team: {
            members: {
              some: {
                userId: ownerId,
              },
            },
          },
        },
      ],
    },
    include: {
      owner: true,
      team: true,
    },
  });
}

export async function updateProject(
  prisma: PrismaClient,
  ownerId: string,
  projectId: string,
  input: UpdateProjectInput,
) {
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      OR: [
        {
          ownerId,
        },
        {
          team: {
            members: {
              some: {
                userId: ownerId,
              },
            },
          },
        },
      ],
    },
  });

  if (!project) {
    return null;
  }

  return prisma.project.update({
    where: {
      id: projectId,
    },
    data: {
      ...input,
    },
    include: {
      owner: true,
      team: true,
    },
  });
}

export async function deleteProject(
  prisma: PrismaClient,
  ownerId: string,
  projectId: string,
) {
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      OR: [
        {
          ownerId,
        },
        {
          team: {
            members: {
              some: {
                userId: ownerId,
              },
            },
          },
        },
      ],
    },
  });

  if (!project) {
    return false;
  }

  await prisma.project.delete({
    where: {
      id: projectId,
    },
  });

  return true;
}
