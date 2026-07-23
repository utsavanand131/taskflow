import type { PrismaClient } from "@/app/generated/prisma/client";
import bcrypt from "bcryptjs";
import { generateToken } from "@/lib/jwt";
import { registerSchema, loginSchema } from "@/validations/user";

export interface RegisterUserInput {
  name: string;
  email: string;
  password: string;
}

export interface LoginUserInput {
  email: string;
  password: string;
}

async function hashPassword(password: string) {
  const SALT_ROUNDS = 10;
  return bcrypt.hash(password, SALT_ROUNDS);
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

  const existingUser = await prisma.user.findUnique({
    where: {
      email: validatedData.email,
    },
  });

  if (existingUser) {
    throw new Error("A user with this email already exists.");
  }

  const hashedPassword = await hashPassword(validatedData.password);

  const user = await prisma.user.create({
    data: {
      name: validatedData.name,
      email: validatedData.email,
      password: hashedPassword,
    },
  });

  const token = generateToken(user.id);

  return {
    token,
    user,
  };
}

export async function loginUser(prisma: PrismaClient, input: LoginUserInput) {
  const result = loginSchema.safeParse(input);

  if (!result.success) {
    throw new Error(result.error.issues[0].message);
  }

  const validatedData = result.data;

  const user = await prisma.user.findUnique({
    where: {
      email: validatedData.email,
    },
  });

  if (!user) {
    throw new Error("Invalid email or password.");
  }

  if (!user.password) {
    throw new Error(
      "This account does not have a password. Please sign in using your OAuth provider.",
    );
  }

  const isPasswordValid = await bcrypt.compare(
    validatedData.password,
    user.password,
  );

  if (!isPasswordValid) {
    throw new Error("Invalid email or password.");
  }

  const token = generateToken(user.id);

  return {
    token,
    user,
  };
}
