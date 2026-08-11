import { PrismaClient } from "@/app/generated/prisma/client";
import bcrypt from "bcryptjs";

interface UpdateProfileInput {
  name: string;
}

export async function updateProfile(
  prisma: PrismaClient,
  userId: string,
  input: UpdateProfileInput,
) {
  const name = input.name.trim();

  if (!name) {
    throw new Error("Name cannot be empty.");
  }

  return prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      name,
    },
  });
}

export async function changePassword(
  prisma: PrismaClient,
  userId: string,
  currentPassword: string,
  newPassword: string,
) {
  if (!currentPassword || !newPassword) {
    throw new Error("Current and new passwords are required.");
  }

  if (newPassword.length < 8) {
    throw new Error("New password must be at least 8 characters long.");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new Error("User not found.");
  }

  if (!user.password) {
    throw new Error("Password change is not available for this account.");
  }

  const passwordMatches = await bcrypt.compare(currentPassword, user.password);

  if (!passwordMatches) {
    throw new Error("Current password is incorrect.");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  return prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      password: hashedPassword,
    },
  });
}
