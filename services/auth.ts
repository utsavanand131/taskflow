import type { PrismaClient } from "@/app/generated/prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { registerSchema } from "@/validations/user";

export interface RegisterUserInput {
  name: string;
  email: string;
  password: string;
}

async function hashPassword(password: string) {
  const SALT_ROUNDS = 10;
  return bcrypt.hash(password, SALT_ROUNDS);
}

function generateToken(userId: string) {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not configured.");
  }

  return jwt.sign(
    {
      userId,
    },
    secret,
    {
      expiresIn: "7d",
    },
  );
}

export async function registerUser(
  prisma: PrismaClient,
  input: RegisterUserInput,
) {
  // Validate input
  const result = registerSchema.safeParse(input);

  if (!result.success) {
    throw new Error(result.error.issues[0].message);
  }

  const validatedData = result.data;

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: {
      email: validatedData.email,
    },
  });

  if (existingUser) {
    throw new Error("A user with this email already exists.");
  }

  // Hash password
  const hashedPassword = await hashPassword(validatedData.password);

  console.log("Password hashed successfully.");

  // Create user
  const user = await prisma.user.create({
    data: {
      name: validatedData.name,
      email: validatedData.email,
      password: hashedPassword,
    },
  });

  console.log("User created:", user.id);

  // Generate JWT
  const token = generateToken(user.id);

  return {
    token,
    user,
  };
}
