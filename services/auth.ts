import type { PrismaClient } from "@/app/generated/prisma/client";
import { registerSchema } from "@/validations/user";

export interface RegisterUserInput {
  name: string;
  email: string;
  password: string;
}

export async function registerUser(
  prisma: PrismaClient,
  input: RegisterUserInput,
) {
  const result = registerSchema.safeParse(input);

  if (!result.success) {
    throw new Error(result.error.issues[0].message);
  }

  const validatedData = result.data;

  console.log("Validated Data:", validatedData);

  const existingUser = await prisma.user.findUnique({
    where: {
      email: validatedData.email,
    },
  });

  console.log("Existing User:", existingUser);

  if (existingUser) {
    throw new Error("A user with this email already exists.");
  }

  return {
    token: "coming-soon",
    user: {
      id: "coming-soon",
      name: validatedData.name,
      email: validatedData.email,
      image: null,
      emailVerified: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  };
}
