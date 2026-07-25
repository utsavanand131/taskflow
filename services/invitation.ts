import {
  InvitationStatus,
  PrismaClient,
  TeamRole,
} from "@/app/generated/prisma/client";

export async function inviteMember(
  prisma: PrismaClient,
  teamId: string,
  email: string,
  userId: string,
) {
  const membership = await prisma.teamMember.findFirst({
    where: {
      teamId,
      userId,
      role: {
        in: [TeamRole.OWNER, TeamRole.ADMIN],
      },
    },
  });

  if (!membership) {
    throw new Error("Only team owners or admins can invite members.");
  }

  const existingMember = await prisma.teamMember.findFirst({
    where: {
      teamId,
      user: {
        email,
      },
    },
  });

  if (existingMember) {
    throw new Error("User is already a team member.");
  }

  const existingInvitation = await prisma.teamInvitation.findFirst({
    where: {
      teamId,
      email,
      status: InvitationStatus.PENDING,
    },
  });

  if (existingInvitation) {
    throw new Error("Invitation already exists.");
  }

  return prisma.teamInvitation.create({
    data: {
      email,
      teamId,
      invitedById: userId,
    },
    include: {
      invitedBy: true,
      team: true,
    },
  });
}

export async function getMyInvitations(prisma: PrismaClient, email: string) {
  return prisma.teamInvitation.findMany({
    where: {
      email,
      status: InvitationStatus.PENDING,
    },
    include: {
      invitedBy: true,
      team: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function acceptInvitation(
  prisma: PrismaClient,
  invitationId: string,
  userId: string,
  email: string,
) {
  const invitation = await prisma.teamInvitation.findUnique({
    where: {
      id: invitationId,
    },
  });

  if (!invitation) {
    throw new Error("Invitation not found.");
  }

  if (invitation.email !== email) {
    throw new Error("You cannot accept this invitation.");
  }

  if (invitation.status !== InvitationStatus.PENDING) {
    throw new Error("Invitation has already been processed.");
  }

  await prisma.$transaction([
    prisma.teamMember.create({
      data: {
        teamId: invitation.teamId,
        userId,
      },
    }),

    prisma.teamInvitation.update({
      where: {
        id: invitation.id,
      },
      data: {
        status: InvitationStatus.ACCEPTED,
      },
    }),
  ]);

  return true;
}

export async function rejectInvitation(
  prisma: PrismaClient,
  invitationId: string,
  email: string,
) {
  const invitation = await prisma.teamInvitation.findUnique({
    where: {
      id: invitationId,
    },
  });

  if (!invitation) {
    throw new Error("Invitation not found.");
  }

  if (invitation.email !== email) {
    throw new Error("You cannot reject this invitation.");
  }

  if (invitation.status !== InvitationStatus.PENDING) {
    throw new Error("Invitation has already been processed.");
  }

  await prisma.teamInvitation.update({
    where: {
      id: invitationId,
    },
    data: {
      status: InvitationStatus.REJECTED,
    },
  });

  return true;
}
