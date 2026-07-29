import { PrismaClient, TeamRole } from "@/app/generated/prisma/client";
import { ActivityType } from "@/app/generated/prisma/enums";

import { createActivity } from "./activity";

interface CreateTeamInput {
  name: string;
  description?: string;
}

interface UpdateTeamInput {
  name?: string;
  description?: string;
}

export async function createTeam(
  prisma: PrismaClient,
  userId: string,
  input: CreateTeamInput,
) {
  const team = await prisma.team.create({
    data: {
      name: input.name,
      description: input.description,
      members: {
        create: {
          userId,
          role: TeamRole.OWNER,
        },
      },
    },
    include: {
      members: {
        include: {
          user: true,
        },
      },
    },
  });

  await createActivity(prisma, {
    type: ActivityType.TEAM_CREATED,
    message: `Created team "${team.name}"`,
    userId,
    teamId: team.id,
  });

  return team;
}

export async function getTeams(prisma: PrismaClient, userId: string) {
  return prisma.team.findMany({
    where: {
      members: {
        some: {
          userId,
        },
      },
    },
    include: {
      members: {
        include: {
          user: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getTeamById(
  prisma: PrismaClient,
  userId: string,
  teamId: string,
) {
  return prisma.team.findFirst({
    where: {
      id: teamId,
      members: {
        some: {
          userId,
        },
      },
    },
    include: {
      members: {
        include: {
          user: true,
        },
      },
    },
  });
}

export async function updateTeam(
  prisma: PrismaClient,
  userId: string,
  teamId: string,
  input: UpdateTeamInput,
) {
  const team = await prisma.team.findFirst({
    where: {
      id: teamId,
      members: {
        some: {
          userId,
          role: TeamRole.OWNER,
        },
      },
    },
  });

  if (!team) {
    return null;
  }

  const updatedTeam = await prisma.team.update({
    where: {
      id: teamId,
    },
    data: {
      ...input,
    },
    include: {
      members: {
        include: {
          user: true,
        },
      },
    },
  });

  await createActivity(prisma, {
    type: ActivityType.TEAM_UPDATED,
    message: `Updated team "${updatedTeam.name}"`,
    userId,
    teamId: updatedTeam.id,
  });

  return updatedTeam;
}

export async function deleteTeam(
  prisma: PrismaClient,
  userId: string,
  teamId: string,
) {
  const team = await prisma.team.findFirst({
    where: {
      id: teamId,
      members: {
        some: {
          userId,
          role: TeamRole.OWNER,
        },
      },
    },
  });

  if (!team) {
    return false;
  }

  await createActivity(prisma, {
    type: ActivityType.TEAM_DELETED,
    message: `Deleted team "${team.name}"`,
    userId,
    teamId: team.id,
  });

  await prisma.team.delete({
    where: {
      id: teamId,
    },
  });

  return true;
}
