import { PrismaClient, TeamRole } from "@/app/generated/prisma/client";
import { ActivityType } from "@/app/generated/prisma/enums";
import { createActivity } from "./activity";

export async function getTeamMembers(
  prisma: PrismaClient,
  teamId: string,
  userId: string,
) {
  const membership = await prisma.teamMember.findFirst({
    where: {
      teamId,
      userId,
    },
  });

  if (!membership) {
    throw new Error("You are not a member of this team.");
  }

  return prisma.teamMember.findMany({
    where: {
      teamId,
    },
    include: {
      user: true,
      team: true,
    },
    orderBy: {
      role: "asc",
    },
  });
}

export async function removeTeamMember(
  prisma: PrismaClient,
  teamId: string,
  targetUserId: string,
  currentUserId: string,
) {
  const currentMember = await prisma.teamMember.findFirst({
    where: {
      teamId,
      userId: currentUserId,
    },
  });

  if (!currentMember || currentMember.role !== TeamRole.OWNER) {
    throw new Error("Only the team owner can remove members.");
  }

  const targetMember = await prisma.teamMember.findFirst({
    where: {
      teamId,
      userId: targetUserId,
    },
    include: {
      user: true,
      team: true,
    },
  });

  if (!targetMember) {
    throw new Error("Team member not found.");
  }

  if (targetMember.role === TeamRole.OWNER) {
    throw new Error("The team owner cannot be removed.");
  }

  await createActivity(prisma, {
    type: ActivityType.MEMBER_REMOVED,
    message: `Removed ${targetMember.user.email} from team "${targetMember.team.name}"`,
    userId: currentUserId,
    teamId,
  });

  await prisma.teamMember.delete({
    where: {
      id: targetMember.id,
    },
  });

  return true;
}

export async function updateTeamMemberRole(
  prisma: PrismaClient,
  teamId: string,
  targetUserId: string,
  role: TeamRole,
  currentUserId: string,
) {
  const currentMember = await prisma.teamMember.findFirst({
    where: {
      teamId,
      userId: currentUserId,
    },
  });

  if (!currentMember || currentMember.role !== TeamRole.OWNER) {
    throw new Error("Only the team owner can update member roles.");
  }

  const targetMember = await prisma.teamMember.findFirst({
    where: {
      teamId,
      userId: targetUserId,
    },
  });

  if (!targetMember) {
    throw new Error("Team member not found.");
  }

  if (targetMember.role === TeamRole.OWNER) {
    throw new Error("The team owner's role cannot be changed.");
  }

  return prisma.teamMember.update({
    where: {
      id: targetMember.id,
    },
    data: {
      role,
    },
    include: {
      user: true,
      team: true,
    },
  });
}
